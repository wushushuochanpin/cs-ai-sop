from typing import TypedDict, Annotated, List, Dict, Any, Union
from langgraph.graph.message import add_messages

# ==========================================
# Agent 状态定义 (这是报错找不到的类)
# ==========================================
class AgentState(TypedDict):
    # 消息历史 (自动追加模式)
    messages: Annotated[List[Any], add_messages]
    
    # 用户当前的订单ID
    current_order_id: Union[str, None]
    
    # 上下文数据槽位
    context: Dict[str, Any]
    
    # 下一步动作指令
    next_step: Union[str, None]