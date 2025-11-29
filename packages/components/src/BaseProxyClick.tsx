import type { PropType, Slots, VNode } from 'vue'
import { cloneVNode, defineComponent, isVNode } from 'vue'

function getVnode(slots: Slots): VNode | undefined {
  const vnode = slots.default?.()[0]
  if (vnode?.children && Array.isArray(vnode.children) && vnode.children.length && isVNode(vnode.children[0])) {
    return vnode.children[0]
  }
  return vnode
}

export const proxyProps = {
  onClick: {
    type: Function as PropType<(e: Event) => void>,
    default: () => {},
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
}

export default defineComponent({
  name: 'BaseProxyClick',
  props: proxyProps,
  emits: ['click'],
  setup(props, { emit, slots }) {
    const vnode = getVnode(slots)
    if (!vnode)
      return null

    const newOnClick = (e: Event) => {
      if (!props.isVerified) {
        e.preventDefault()
        e.stopPropagation()
        emit('click')
      }
    }

    return () => {
      return cloneVNode(vnode, { onClickCapture: newOnClick })
    }
  },
})
