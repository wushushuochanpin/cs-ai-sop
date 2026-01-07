from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Dict, Any, List

# 修正 1: 只从 config 导入 engine 和 get_session
from app.config import get_session, engine 

# 修正 2: 从 models 导入 create_db_and_tables
from app.models import SOP, Variable, create_db_and_tables

from app.sop_parser import parse_sop_document
from app.graph import build_graph_from_sop

# 初始化 FastAPI 应用
app = FastAPI(title="JD SOP Agent System")

# 配置 CORS (允许跨域)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 应用启动时创建数据库表
@app.on_event("startup")
def on_startup():
    create_db_and_tables(engine)

# ==========================================
# 数据传输对象 (DTO)
# ==========================================
class SOPCreateRequest(BaseModel):
    name: str
    content: str 

class SOPDebugRequest(BaseModel):
    content: str           
    order_id: str = "JD001"

# ==========================================
# API 接口定义
# ==========================================

@app.get("/")
def root():
    return {"message": "JD SOP System Backend is Running!"}

@app.get("/variables")
def get_variables(session: Session = Depends(get_session)):
    """
    前端获取所有可用变量的接口
    """
    vars = session.exec(select(Variable)).all()
    # 转换为前端好用的格式
    return [
        {
            "id": v.key,           
            "label": v.value,      
            "desc": v.description  
        } 
        for v in vars
    ]

@app.post("/sop/debug")
async def debug_sop(request: SOPDebugRequest):
    try:
        sop_config = parse_sop_document(request.content)
        graph = build_graph_from_sop(sop_config)
        
        initial_state = {
            "messages": [],
            "current_order_id": request.order_id,
            "context": {},
            "next_step": None
        }
        
        final_state = await graph.ainvoke(initial_state)
        
        return {
            "status": "success",
            "parsed_config": sop_config,
            "final_context": final_state["context"],
            "bot_reply": final_state["messages"][-1]
        }
        
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "message": str(e),
            "trace": traceback.format_exc()
        }

@app.post("/sop/save")
def save_sop(request: SOPCreateRequest, session: Session = Depends(get_session)):
    try:
        parsed_config = parse_sop_document(request.content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SOP Syntax Error: {str(e)}")
    
    new_sop = SOP(
        name=request.name,
        description=request.content,
        graph_config=parsed_config
    )
    session.add(new_sop)
    session.commit()
    session.refresh(new_sop)
    return {"id": new_sop.id, "name": new_sop.name, "status": "saved"}

@app.get("/sop/list")
def list_sops(session: Session = Depends(get_session)):
    sops = session.exec(select(SOP)).all()
    return sops