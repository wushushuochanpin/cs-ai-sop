"use client";

import Link from "next/link";
import { Wrench, Globe, ArrowRight } from "lucide-react"; // 依然用这些漂亮的图标

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 font-sans text-gray-800">
      
      {/* 标题区 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          JD SOP Agent System
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          京东物流智能操作平台 • 全栈技术架构验证环境
        </p>
      </div>

      {/* 卡片入口区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* 入口 1: SOP 编辑器 */}
        <Link href="/debug" className="group">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col items-start cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Wrench className="w-32 h-32 text-blue-600 transform rotate-12" />
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              SOP 流程编排 (Debug)
            </h2>
            <p className="text-gray-500 mb-6 flex-1">
              核心业务功能。支持变量插入 (@Order)、Strict Mode 严格模式输入限制、右侧属性配置面板。
            </p>
            <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
              进入工作台 <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </Link>

        {/* 入口 2: 多语言 Demo */}
        <Link href="/demo" className="group">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 h-full flex flex-col items-start cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Globe className="w-32 h-32 text-purple-600 transform -rotate-12" />
            </div>

            <div className="p-3 bg-purple-50 rounded-lg mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              多语言混排 Demo
            </h2>
            <p className="text-gray-500 mb-6 flex-1">
              国际化技术验证。支持 RTL (阿拉伯语) 布局自动翻转、主副语言混排、智能输入检测。
            </p>
            <div className="flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
              查看演示 <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </Link>

      </div>

      <div className="mt-16 text-xs text-gray-400">
        © 2024 JD Logistics • Powered by Next.js & Tailwind CSS
      </div>
    </div>
  );
}