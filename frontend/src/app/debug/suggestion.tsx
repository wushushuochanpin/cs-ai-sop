import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './MentionList'

export default {
  // 强制返回测试数据，验证 UI 是否生效
  items: ({ query }: any) => {
    console.log("Searching:", query);
    
    // 模拟数据 (按照你的草图结构)
    const data = [
      { id: 'order_status', label: '运单状态', desc: '枚举值: 待发货, 运输中, 已完成' },
      { id: 'order_id', label: '运单ID', desc: '唯一标识 JD00xxxxx' },
      { id: 'customer_level', label: '客户等级', desc: 'PLUS会员 / 普通用户' },
      { id: 'check_ui', label: 'UI测试', desc: '如果你看到这个，说明代码生效了' },
    ];

    return data.filter((item) => 
      item.label.toLowerCase().includes(query.toLowerCase()) || 
      item.id.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          // 强制移除 Tippy 默认的黑色背景
          theme: 'light',
          maxWidth: 'none', 
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}