export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">JD SOP Agent System</h1>
      <div className="flex gap-4">
        <a href="/debug" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          SOP 调试台
        </a>
        <a href="/list" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          SOP 列表
        </a>
      </div>
    </div>
  )
}