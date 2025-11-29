import type { DirectiveBinding } from 'vue'

/**
 * 通过指令替换背景图片的路径
 */
export const bgImage = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const value = `/lottery${binding.value}` // 比如 '/home/banner'，不带后缀

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

    // 拼接最终路径
    const imageUrl = value.replace('variable', `ph-h5`).replaceAll('png', format)

    el.style.backgroundImage = `url('${imageUrl}')`
  },
}
