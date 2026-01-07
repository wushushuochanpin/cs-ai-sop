import datetime
from typing import Dict, Optional
from langchain_core.tools import tool

# ==========================================
# 模拟数据库 (Mock Data)
# ==========================================
MOCK_ORDERS = {
    "JD001": {"type": "NORMAL", "status": "IN_TRANSIT", "estimated_delivery": "2023-10-25 12:00:00"},
    "JD002": {"type": "LARGE", "status": "DELAYED", "estimated_delivery": "2023-10-20 18:00:00"},
    "JD003": {"type": "VIRTUAL", "status": "DELIVERED", "estimated_delivery": "2023-10-25 10:00:00"},
}

MOCK_WAYBILLS = {
    "JD001": {"location": "北京通州分拣中心", "last_update": "2023-10-24 20:00:00", "weather": "SUNNY"},
    "JD002": {"location": "武汉转运中心", "last_update": "2023-10-21 08:00:00", "weather": "HEAVY_RAIN"},
}

# ==========================================
# 原子工具函数 (Atomic Tools)
# 只负责查数，不负责决策！
# ==========================================

@tool
def get_order_detail(order_id: str) -> Dict:
    """
    【原子能力】查询订单基础信息。
    """
    order = MOCK_ORDERS.get(order_id)
    if not order:
        return {"error": "Order not found", "exists": False}
    return {**order, "exists": True}

@tool
def get_logistics_info(order_id: str) -> Dict:
    """
    【原子能力】查询物流轨迹信息。
    """
    waybill = MOCK_WAYBILLS.get(order_id)
    if not waybill:
        return {"info": "No logistics info available", "has_record": False}
    return {**waybill, "has_record": True}

@tool
def get_current_time() -> str:
    """
    【原子能力】获取系统当前时间。
    格式: YYYY-MM-DD HH:MM:SS
    """
    # 模拟一个固定时间用于测试，实际生产可改为 datetime.now()
    return "2023-10-24 15:00:00"

@tool
def calculate_time_diff_hours(time_str_1: str, time_str_2: str) -> float:
    """
    【原子能力】计算两个时间相差的小时数 (time1 - time2)。
    """
    try:
        t1 = datetime.datetime.strptime(time_str_1, "%Y-%m-%d %H:%M:%S")
        t2 = datetime.datetime.strptime(time_str_2, "%Y-%m-%d %H:%M:%S")
        diff = t1 - t2
        return diff.total_seconds() / 3600
    except Exception:
        return 0.0

# 导出工具清单
ALL_TOOLS = [get_order_detail, get_logistics_info, get_current_time, calculate_time_diff_hours]