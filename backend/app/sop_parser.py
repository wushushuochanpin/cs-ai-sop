import re
from typing import Dict, List, Any

# ==========================================
# SOP 文档解析器
# ==========================================

def parse_sop_document(doc_content: str) -> Dict[str, Any]:
    """
    解析 SOP 文本。
    """
    lines = doc_content.strip().split('\n')
    nodes = {}
    current_node_id = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # 1. 识别节点头: # 节点名
        if line.startswith("# "):
            current_node_id = line[2:].strip()
            nodes[current_node_id] = {
                "id": current_node_id,
                "action": None,
                "next": None,
                "branches": []
            }
            continue
            
        if not current_node_id:
            continue
            
        # 2. 识别工具调用: 调用 @工具名
        if "调用 @" in line:
            tool_name = line.split("@")[1].strip()
            nodes[current_node_id]["action"] = f"tool:{tool_name}"
            
        # 3. 识别条件跳转: ? 条件 -> # 目标节点
        elif line.startswith("?"):
            match = re.match(r"\? (.+) -> # (.+)", line)
            if match:
                condition = match.group(1).strip()
                target = match.group(2).strip()
                nodes[current_node_id]["branches"].append({
                    "condition": condition,
                    "target": target
                })
        
        # 4. 识别默认跳转: -> # 目标节点
        elif line.startswith("-> #"):
            target = line.split("-> #")[1].strip()
            nodes[current_node_id]["next"] = target

    # 简单的容错处理：如果没有解析出节点，返回空结构
    if not nodes:
        return {"start_node": None, "nodes": {}}

    return {"start_node": list(nodes.keys())[0], "nodes": nodes}