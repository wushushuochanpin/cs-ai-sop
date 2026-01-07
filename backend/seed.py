from sqlmodel import Session, select
from sqlmodel import Session, select
from app.config import engine
from app.models import Variable, create_db_and_tables # 修改这里：从 models 导入

def init_db():
    # 1. 建表
    create_db_and_tables(engine)
    
    with Session(engine) as session:
        # 2. 检查是否已经有数据，避免重复添加
        existing = session.exec(select(Variable)).first()
        if existing:
            print("数据库已有数据，跳过初始化。")
            return

        print("正在写入默认变量...")
        
        # 3. 定义我们要预置的变量 (Key + 中文名/Value + 描述)
        vars = [
            Variable(key="order_id", value="订单号", description="京东订单唯一标识，如JD001"),
            Variable(key="order_status", value="订单状态", description="枚举值：待发货, 运输中, 派送中, 已完成"),
            Variable(key="logistics_company", value="物流公司", description="承运商名称，如京东物流"),
            Variable(key="delay_days", value="延误天数", description="当前时间减去预计送达时间的天数"),
            Variable(key="customer_level", value="客户等级", description="用户等级：PLUS, 普通"),
            Variable(key="is_fresh", value="是否生鲜", description="布尔值：true/false"),
        ]
        
        for v in vars:
            session.add(v)
        
        session.commit()
        print("✅ 默认变量写入完成！")

if __name__ == "__main__":
    init_db()