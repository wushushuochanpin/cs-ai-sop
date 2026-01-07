from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON, create_engine

# =======================
# 1. 变量配置表
# =======================
class Variable(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True)
    value: str 
    description: Optional[str] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# =======================
# 2. SOP 流程表 (这里就是报错找不到的类)
# =======================
class SOP(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: Optional[str] = Field(default=None)
    # 核心字段：存储图结构的 JSON
    graph_config: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# =======================
# 3. 对话记录表
# =======================
class ChatHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True)
    sender: str 
    message: Dict = Field(sa_column=Column(JSON)) # 注意这里类型改为了 Dict
    meta_data: Optional[Dict[str, Any]] = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# =======================
# 4. 初始化数据库函数
# =======================
def create_db_and_tables(engine):
    SQLModel.metadata.create_all(engine)