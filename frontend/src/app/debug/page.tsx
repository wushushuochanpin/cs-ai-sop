"use client"; 

import { useState } from "react";
import dynamic from 'next/dynamic';
// 图标库先注释，避免报错，确保你先跑通逻辑
// import { Trash2, Database, ChevronDown, Check, Plus } from "lucide-react"; 

const SopEditor = dynamic(() => import('./SopEditor'), { 
  ssr: false,
  loading: () => <div className="p-8 text-gray-400">Loading Editor...</div>
});

const VARIABLE_DB = [
    { 
        id: 'order_status', 
        label: '运单状态', 
        desc: '描述运单的具体状态值', 
        type: 'Enum', 
        options: ['待发货', '运输中', '派送中', '已完成', '已取消', '异常停滞'] 
    },
    { 
        id: 'order_id', 
        label: '运单ID', 
        desc: '运单的唯一标识ID', 
        type: 'String' 
    },
    { 
        id: 'customer_type', 
        label: '客户类型', 
        desc: '客户的等级分类', 
        type: 'Enum',
        options: ['普通用户', 'PLUS会员', '企业用户']
    }
];

interface Branch {
    id: number;
    name: string;
    selectedValues: string[];
}

export default function DebugPage() {
  const [editorJson, setEditorJson] = useState<any>(null);
  const [activeVarId, setActiveVarId] = useState<string | null>(null);

  const [branches, setBranches] = useState<Branch[]>([
      { id: 1, name: '分支1', selectedValues: [] }
  ]);

  const activeVar = VARIABLE_DB.find(v => v.id === activeVarId);

  const addBranch = () => {
      const newId = branches.length + 1;
      setBranches([...branches, { id: Date.now(), name: `分支${newId}`, selectedValues: [] }]);
  };

  const removeBranch = (branchId: number) => {
      setBranches(branches.filter(b => b.id !== branchId));
  };

  const toggleValueInBranch = (branchId: number, value: string) => {
      setBranches(branches.map(b => {
          if (b.id !== branchId) return b;
          const exists = b.selectedValues.includes(value);
          if (exists) {
              return { ...b, selectedValues: b.selectedValues.filter(v => v !== value) };
          } else {
              return { ...b, selectedValues: [...b.selectedValues, value] };
          }
      }));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      
      {/* 左侧：编辑区 (固定宽度 66%) */}
      <div className="w-2/3 p-6 flex flex-col h-full border-r border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <span>📚</span> SOP 流程编排
            </h2>
        </div>
        <SopEditor 
          content="<p></p>" 
          onChange={(json) => setEditorJson(json)} 
          onMentionSelect={(id) => setActiveVarId(id)}
        />
      </div>

      {/* 右侧：属性编辑面板 (固定宽度 33%) */}
      <div className="w-1/3 h-full bg-white flex flex-col">
         {activeVar ? (
            // 【状态 A】有选中变量，显示表单
            <div className="p-8 flex flex-col h-full animate-in slide-in-from-right duration-200">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-xl font-extrabold text-gray-800">属性编辑</h3>
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded">
                        @{activeVar.id}
                    </div>
                </div>

                <div className="text-base text-gray-700 font-bold mb-6 border-b border-gray-100 pb-4">
                    当前变量: <span className="text-blue-600">{activeVar.label}</span>
                </div>

                {/* 分支列表 */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {branches.map((branch, idx) => (
                        <div key={branch.id} className="group border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-bold text-gray-600">{branch.name}</label>
                                {branches.length > 1 && (
                                    <button onClick={() => removeBranch(branch.id)} className="text-xs text-red-400 hover:text-red-600 font-bold px-2">
                                        删除
                                    </button>
                                )}
                            </div>
                            
                            {/* 模拟的多选框 */}
                            <div className="relative">
                                <div className="w-full min-h-[42px] border border-gray-300 rounded bg-gray-50 px-2 py-2 flex flex-wrap gap-2 items-center">
                                    {branch.selectedValues.map(val => (
                                        <span key={val} className="bg-white text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded shadow-sm flex items-center">
                                            {val}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleValueInBranch(branch.id, val); }}
                                                className="ml-1 text-gray-400 hover:text-red-500 font-bold"
                                            >×</button>
                                        </span>
                                    ))}
                                    {branch.selectedValues.length === 0 && (
                                        <span className="text-gray-400 text-xs italic">请选择 {activeVar.label} 的值...</span>
                                    )}
                                </div>

                                {/* 选项列表 */}
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {activeVar.options ? activeVar.options.map(opt => {
                                        const isSelected = branch.selectedValues.includes(opt);
                                        return (
                                            <button 
                                                key={opt}
                                                onClick={() => toggleValueInBranch(branch.id, opt)}
                                                className={`px-2 py-2 text-xs text-left rounded border transition-all
                                                ${isSelected 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                                            >
                                                {opt}
                                            </button>
                                        )
                                    }) : (
                                        <div className="col-span-2 text-gray-400 text-xs text-center py-2">无枚举选项</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button 
                        onClick={addBranch}
                        className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 font-bold transition-all text-sm"
                    >
                        + 添加新分支
                    </button>
                </div>
            </div>
         ) : (
             // 【状态 B】空状态 (始终显示)
             <div className="h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
                 <div className="text-6xl mb-4 opacity-20">⚙️</div>
                 <p className="font-bold">未选择变量</p>
                 <p className="text-xs mt-2">请在左侧点击蓝色的 @变量 进行配置</p>
             </div>
         )}
      </div>
    </div>
  );
}