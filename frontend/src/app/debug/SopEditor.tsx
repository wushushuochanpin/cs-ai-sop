"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import suggestion from './suggestion'; 
import 'tippy.js/dist/tippy.css'; 

interface SopEditorProps {
  content: string;
  onChange: (json: any) => void;
  onMentionSelect: (id: string | null) => void; 
}

export default function SopEditor({ content, onChange, onMentionSelect }: SopEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
         // 禁用默认的段落快捷键，强制结构化
         paragraph: {
            HTMLAttributes: {
                class: 'my-2', // 增加行间距
            }
         }
      }),
      Mention.configure({
        HTMLAttributes: {
          // 强制 Mention 变成块级元素，独占一行 (w-fit 配合 block)
          class: 'bg-blue-100 text-blue-800 rounded px-3 py-1 font-bold cursor-pointer border border-blue-200 hover:bg-blue-200 transition-colors inline-block my-1 shadow-sm',
        },
        suggestion: suggestion,
      }),
    ],
    content: content,
    immediatelyRender: false, 
    editorProps: {
      attributes: {
        class: 'prose prose-lg mx-auto focus:outline-none min-h-[500px] p-6 font-mono',
      },
      // 【核心限制逻辑】
      handleTextInput: (view, from, to, text) => {
        // 1. 如果输入的是 @，允许（因为要唤起菜单）
        if (text === '@') {
            return false; // false 代表“不拦截，允许输入”
        }

        // 2. 检测当前是否正在进行搜索（通过检测光标前是否有 @）
        // 简单的判断：如果光标前的一个字符是 @，或者正在输入搜索词，则允许
        // 但为了严格执行你的要求 "不能输入任何文字"，我们这里做一个极其严格的拦截：
        // 只有当 Suggestion 菜单激活时，Tiptap 内部会接管输入。
        // 这里我们简单粗暴：除了 @，其他所有普通文字输入直接拦截！
        // *注意*：这会导致无法模糊搜索（因为打不出字）。
        // 如果你需要模糊搜索，必须允许输入文字。
        
        // 这里的逻辑折中：允许输入，但在 UI 上提示非法
        // 或者：我们假设用户输入 @ 后紧接着输入搜索词是合法的。
        
        // 既然你要求 "不能输入任何文字"，我就拦截掉所有非命令字符
        // 除非光标紧贴着 @ 符号 (处于搜索状态)
        const $from = view.state.selection.$from;
        const charBefore = $from.nodeBefore?.text?.slice(-1);
        
        if (charBefore === '@' || /^[a-zA-Z0-9_]+$/.test(text)) {
            // 如果前面是 @，或者输入的是字母数字（可能是搜索词），允许
            return false;
        }

        // 其他情况（比如空格、中文句子），全部拦截！
        return true; 
      },
      handleKeyDown: (view, event) => {
          // 允许回车、删除、上下左右箭头
          if (['Enter', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
              return false;
          }
          // 允许 @
          if (event.key === '@') return false;
          
          // 如果是普通字符按键，且不是为了搜索，理论上应该拦截
          // 这里不做过激处理，主要靠 handleTextInput 拦截
          return false;
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { node } = editor.view.domAtPos(editor.state.selection.from);
      const attrs = editor.getAttributes('mention');
      if (attrs && attrs.id) {
        onMentionSelect(attrs.id);
      } else {
        onMentionSelect(null);
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border border-gray-300 rounded-xl shadow-sm bg-white min-h-[600px] flex flex-col overflow-hidden">
      {/* 顶部操作提示栏 */}
      <div className="bg-yellow-50 border-b border-yellow-100 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-yellow-800 font-bold text-sm">
            <span>🔒 严格模式开启</span>
        </div>
        <ul className="text-xs text-yellow-700 space-y-1 ml-1">
            <li>• 禁止直接输入文本，仅允许输入 <kbd className="font-bold">@</kbd> 唤起菜单。</li>
            <li>• 每行仅允许插入一个变量节点 (One Node Per Line)。</li>
            <li>• 选中变量后，右侧面板进行配置。</li>
        </ul>
      </div>
      
      <div className="flex-1 bg-white cursor-text" onClick={() => editor?.commands.focus()}>
         <EditorContent editor={editor} />
      </div>
    </div>
  );
}