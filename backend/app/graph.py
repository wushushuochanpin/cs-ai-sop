import operator
from typing import Dict, Any, Callable
from langgraph.graph import StateGraph, END

# 确保引用路径正确
from app.state import AgentState
from app.tools import ALL_TOOLS
from app.prompts import RESPONDER_SYSTEM_PROMPT

# ==========================================
# 工具映射表
# ==========================================
TOOL_MAP = {t.name: t for t in ALL_TOOLS}

def get_tool_func(action_str: str) -> Callable:
    if action_str and action_str.startswith("tool:"):
        parts = action_str.split(":")
        if len(parts) > 1:
            tool_name = parts[1]
            return TOOL_MAP.get(tool_name)
    return None

# ==========================================
# 节点执行器
# ==========================================
def create_node_func(node_config: Dict[str, Any]):
    def _node_func(state: AgentState):
        print(f"--- Executing Node: {node_config['id']} ---")
        
        # 1. 执行动作
        action_func = get_tool_func(node_config.get("action"))
        if action_func:
            order_id = state.get("current_order_id", "JD001") 
            try:
                result = action_func.invoke(order_id)
                tool_name = node_config['action'].split(":")[1]
                # 确保 context 字典存在
                if "context" not in state:
                    state["context"] = {}
                state["context"][tool_name] = result
            except Exception as e:
                print(f"    Tool Error: {e}")
                
        # 2. 决定下一步
        branches = node_config.get("branches", [])
        next_node = node_config.get("next")
        
        context = state.get("context", {})
        
        for branch in branches:
            condition = branch["condition"]
            target = branch["target"]
            try:
                if eval(condition, {"context": context}):
                    state["next_step"] = target
                    return state
            except Exception as e:
                print(f"    Eval Error: {e}")

        if next_node:
            state["next_step"] = next_node
        else:
            state["next_step"] = "END"
            
        return state

    return _node_func

# ==========================================
# 动态图构建器
# ==========================================
def build_graph_from_sop(sop_config: Dict[str, Any]):
    workflow = StateGraph(AgentState)
    
    nodes = sop_config.get("nodes", {})
    start_node_id = sop_config.get("start_node")
    
    if not nodes or not start_node_id:
        # 如果 SOP 为空，返回一个直接结束的图
        workflow.add_node("end_node", lambda s: s)
        workflow.set_entry_point("end_node")
        workflow.add_edge("end_node", END)
        return workflow.compile()
    
    # A. 添加节点
    for node_id, config in nodes.items():
        node_func = create_node_func(config)
        workflow.add_node(node_id, node_func)
    
    # B. 添加回复节点
    def responder_node(state: AgentState):
        last_context = state.get("context", {})
        return {"messages": [f"机器人: 处理完毕。最后的数据是: {last_context}"]}
        
    workflow.add_node("responder", responder_node)

    # C. 定义边
    def router(state: AgentState):
        next_step = state.get("next_step")
        if next_step == "END" or next_step is None:
            return "responder"
        return next_step

    for node_id in nodes.keys():
        workflow.add_conditional_edges(node_id, router)
    
    workflow.add_edge("responder", END)
    workflow.set_entry_point(start_node_id)
    
    return workflow.compile()