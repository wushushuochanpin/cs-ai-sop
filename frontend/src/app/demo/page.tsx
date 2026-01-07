"use client";

import { useState, useEffect } from "react";
import { Settings, ArrowUpDown, Info } from "lucide-react"; // 需安装 lucide-react

// 1. 模拟翻译语料库
const TRANSLATIONS: Record<string, string> = {
  zh: "我是资深产品架构师，专注于构建高可用、高扩展的复杂的企业级应用系统。",
  en: "I am a Senior Product Architect, focused on building highly available and scalable enterprise application systems.",
  ar: "أنا مهندس منتجات خبير ، أركز على بناء أنظمة تطبيقات مؤسسية عالية التوفر وقابلة للتطوير." 
};

const LANG_CONFIG = [
  { code: "zh", label: "🇨🇳 中文 (Chinese)", dir: "ltr" },
  { code: "en", label: "🇺🇸 English", dir: "ltr" },
  { code: "ar", label: "🇸🇦 Arabic", dir: "rtl" }, // 关键：标记为 RTL
];

export default function MultiLangDemo() {
  // --- 状态管理 ---
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isDualMode, setIsDualMode] = useState(true);
  const [primaryLang, setPrimaryLang] = useState("zh");
  const [secondaryLang, setSecondaryLang] = useState("ar");
  const [textMode, setTextMode] = useState<"wrap" | "ellipsis">("ellipsis");
  const [inputText, setInputText] = useState("");

  // --- 辅助逻辑 ---
  
  // 获取语言的排版方向 (ltr 或 rtl)
  const getDir = (langCode: string) => LANG_CONFIG.find(l => l.code === langCode)?.dir || "ltr";
  
  // 核心：输入检测逻辑
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    // 简单的正则检测
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    
    // 如果检测到语言变化，自动切换主语言
    if (hasArabic && primaryLang !== 'ar') {
        setPrimaryLang('ar');
    } else if (hasChinese && primaryLang !== 'zh') {
        setPrimaryLang('zh');
    } else if (!hasArabic && !hasChinese && text.length > 2 && primaryLang !== 'en') {
        // 简单假设其他长于2的非中阿字符为英文
        setPrimaryLang('en');
    }
  };

  // 交换主副语言
  const swapLangs = () => {
    const temp = primaryLang;
    setPrimaryLang(secondaryLang);
    setSecondaryLang(temp);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-800">
      
      {/* 模拟手机/卡片窗口 */}
      <div className="w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
        
        {/* === Header: 标题 & 小齿轮 === */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h1 className="font-bold text-lg">多语言展示 Demo</h1>
            <button 
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className={`p-2 rounded-full hover:bg-gray-700 transition-all ${isConfigOpen ? 'bg-gray-700 rotate-90' : ''}`}
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>

        {/* === Config Panel (可折叠配置区) === */}
        {isConfigOpen && (
            <div className="bg-gray-50 border-b border-gray-200 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                
                {/* 1. 单/双语切换 */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600">双语模式</span>
                    <button 
                        onClick={() => setIsDualMode(!isDualMode)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${isDualMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${isDualMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* 2. 主副语言选择 */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">主语言 (Primary)</label>
                        <select 
                            value={primaryLang}
                            onChange={(e) => setPrimaryLang(e.target.value)}
                            className="text-sm border rounded p-1"
                        >
                            {LANG_CONFIG.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                    </div>

                    <button onClick={swapLangs} className="mt-4 text-gray-400 hover:text-blue-600">
                        <ArrowUpDown className="w-4 h-4" />
                    </button>

                    <div className={`flex flex-col gap-1 ${!isDualMode ? 'opacity-30 pointer-events-none' : ''}`}>
                        <label className="text-xs text-gray-400">副语言 (Secondary)</label>
                        <select 
                            value={secondaryLang}
                            onChange={(e) => setSecondaryLang(e.target.value)}
                            className="text-sm border rounded p-1"
                        >
                            {LANG_CONFIG.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* 3. 文本溢出模式 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600">文本溢出处理</label>
                    <div className="flex gap-2 text-xs">
                        <button 
                            onClick={() => setTextMode("wrap")}
                            className={`px-3 py-1 rounded border ${textMode === 'wrap' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white'}`}
                        >
                            自动换行 (Auto Height)
                        </button>
                        <button 
                            onClick={() => setTextMode("ellipsis")}
                            className={`px-3 py-1 rounded border ${textMode === 'ellipsis' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white'}`}
                        >
                            省略号 (Truncate)
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* === 核心展示区域 === */}
        <div className="p-6 bg-white min-h-[150px] flex flex-col justify-center border-b border-gray-100">
            {/* 
               技巧 1：外层容器的 dir 属性决定了整体是左对齐还是右对齐 
               如果主语言是 Ar，整个容器变为 RTL
            */}
            <div dir={getDir(primaryLang)} className="flex flex-col gap-1">
                
                {/* === 主语言 === */}
                <div 
                    // 技巧 2：text-start 会根据 dir 自动变为 left 或 right
                    // 技巧 3：dir="auto" 确保即使在 RTL 布局里，如果内容是英文，标点符号也不会乱
                    dir="auto"
                    title={textMode === 'ellipsis' ? TRANSLATIONS[primaryLang] : undefined}
                    className={`text-xl font-bold text-gray-900 leading-snug transition-all
                        ${textMode === 'ellipsis' ? 'truncate' : 'whitespace-normal'}
                    `}
                >
                    {TRANSLATIONS[primaryLang]}
                </div>

                {/* === 副语言 === */}
                {isDualMode && (
                    <div 
                        dir="auto" // 关键：让浏览器自动判断这行字的内部方向，与外层隔离
                        title={textMode === 'ellipsis' ? TRANSLATIONS[secondaryLang] : undefined}
                        className={`text-sm text-gray-500 font-medium transition-all
                            ${textMode === 'ellipsis' ? 'truncate' : 'whitespace-normal'}
                        `}
                    >
                        {TRANSLATIONS[secondaryLang]}
                    </div>
                )}
            </div>
        </div>

        {/* === 智能输入测试区 === */}
        <div className="p-4 bg-gray-50 flex-1">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                智能输入感应测试
            </label>
            <input 
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="试着输入中文、英文或阿拉伯语..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            
            {/* 实时反馈 */}
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                <Info className="w-3 h-3"/>
                <span>当前检测并展示为主语言：</span>
                <span className="font-bold px-1 bg-gray-200 rounded text-gray-800">
                    {LANG_CONFIG.find(l => l.code === primaryLang)?.label}
                </span>
            </div>
        </div>

      </div>
    </div>
  );
}