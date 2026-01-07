import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session

# 1. 加载 .env 文件中的环境变量
load_dotenv()

# 2. 获取 API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# 3. 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sop_database.db")

# check_same_thread=False 是 SQLite 在多线程环境下的必要参数
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# !!! 之前报错就是因为缺了下面这个函数 !!!
def get_session():
    """
    依赖注入函数：用于在 API 请求中获取数据库会话
    """
    with Session(engine) as session:
        yield session