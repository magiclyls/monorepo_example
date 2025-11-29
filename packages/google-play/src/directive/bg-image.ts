import type { DirectiveBinding } from 'vue'

/**
 * 通过指令替换背景图片的路径
 */
export const bgImage = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 比如 '/home/banner'，不带后缀
    const value: ValueType = binding.value

    if (!value)
      return

    let format = 'png'

    // 查找 body 或 html 上的类名
    if (document.documentElement.classList.contains('avif')) {
      format = 'avif'
    }
    else if (document.documentElement.classList.contains('webp')) {
      format = 'webp'
    }

    if (Array.isArray(value)) {
    // 多个背景图
      const urls = value.map(v => `url('${buildUrl(v, format)}')`).join(', ')
      el.style.backgroundImage = urls
    }
    else {
    // 单个背景图
      const imageUrl = buildUrl(value, format)
      el.style.backgroundImage = `url('${imageUrl}')`
    }
  },
}

type ValueType = string | string[] | null | undefined

function buildUrl(path: string, format: string) {
  // 彩票
  if (path.includes('/lottery/png'))
    return path.replaceAll('png', format)

  // 完整路径直接使用
  if (typeof path === 'string') {
    if (path.includes('.png') || path.includes('.webp') || path.includes('.avif')) {
      return path
    }
  }

  return `/ph-h5/${format}${path}.${format}`
}
