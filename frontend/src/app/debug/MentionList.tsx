import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command({ id: item.id, label: item.label })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }
      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }
      if (event.key === 'Enter') {
        enterHandler()
        return true
      }
      return false
    },
  }))

  return (
    // 强制白色背景，强制阴影，强制宽度
    <div className="bg-white rounded-md border border-gray-300 shadow-2xl overflow-hidden w-[450px] z-50 flex flex-col font-sans text-left">
      <div className="max-h-64 overflow-y-auto bg-white">
        {props.items.length ? (
            props.items.map((item: any, index: number) => (
            <button
                key={index}
                onClick={() => selectItem(index)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors duration-75 flex items-center gap-2
                ${index === selectedIndex ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
                {/* 样式：中文名 (ID) : 描述 */}
                <div className="flex-1 flex items-baseline gap-2 overflow-hidden">
                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{item.label}</span>
                    <span className="font-mono text-xs text-gray-400 whitespace-nowrap">({item.id})</span>
                    <span className="text-gray-300 font-bold">:</span>
                    <span className="text-xs text-gray-500 truncate">{item.desc}</span>
                </div>
            </button>
            ))
        ) : (
            <div className="p-4 text-center text-sm text-gray-400">无匹配变量</div>
        )}
      </div>
    </div>
  )
})

MentionList.displayName = 'MentionList';

export default MentionList;