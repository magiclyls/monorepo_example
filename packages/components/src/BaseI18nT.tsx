/* eslint-disable no-cond-assign */
import type { VNode } from 'vue'
import { defineComponent, Fragment, h, inject, isVNode, Text } from 'vue'

function splitTemplate(str: string): (string | { index: number })[] {
  const result: (string | { index: number })[] = []
  const regex = /\{(\d+)\}/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(str))) {
    // 前面剩余的普通字符串
    if (match.index > lastIndex) {
      result.push(str.slice(lastIndex, match.index))
    }
    // 占位符，存成一个对象
    result.push({ index: Number(match[1]) })
    lastIndex = regex.lastIndex
  }

  // 剩余尾巴
  if (lastIndex < str.length) {
    result.push(str.slice(lastIndex))
  }

  return result
}

export default defineComponent({
  name: 'BaseI18nT',
  props: {
    keypath: {
      type: String,
      required: true,
    },
    localeSymbol: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const local = inject<any>(props.localeSymbol)
    const children = (slots.default?.() || [])[0]?.children
    const childVnodes: VNode[] = []

    if (Array.isArray(children) && children.length && local[props.keypath]) {
      splitTemplate(local[props.keypath]).forEach((item) => {
        if (typeof item === 'string') {
          childVnodes.push(h(Text, null, item))
        }
        else {
          const child = children[item.index]
          if (isVNode(child)) {
            childVnodes.push(child)
          }
        }
      })
    }

    return () => {
      return h(Fragment, null, childVnodes)
    }
  },
})
