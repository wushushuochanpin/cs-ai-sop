import sys
print("正在尝试导入 uvicorn...")
try:
    import uvicorn
    print("导入成功！准备启动服务...")
except ImportError as e:
    print(f"导入失败: {e}")
    sys.exit(1)

if __name__ == "__main__":
    print("正在启动 Uvicorn 服务器...")
    try:
        # 注意：这里去掉了 reload=True，有时候文件监控在某些系统会有问题
        uvicorn.run("app.api:app", host="127.0.0.1", port=8000)
    except Exception as e:
        print(f"启动发生错误: {e}")
else:
    print("警告：run.py 被作为模块导入了，而不是直接运行。")