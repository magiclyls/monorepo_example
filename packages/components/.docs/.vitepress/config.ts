import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig } from 'vitepress'
// import { mdVueDemoPlugin } from 'vitepress-vue-demo'

import TailwindcssConfig from '../../../tailwindcss/vite.tailwindcss.config'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TG-前端',
  description: '组件库',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '组件库', link: '/BaseButton' },
    ],

    sidebar: [
      {
        text: 'BC.GAME 组件',
        items: [
          { text: 'BaseButton', link: '/BaseButton' },
          { text: 'BaseImage', link: '/BaseImage' },
          { text: 'BaseIcon', link: '/BaseIcon' },
          { text: 'BaseVirtualText', link: '/BaseVirtualText' },
          { text: 'BaseSelect', link: '/BaseSelect' },
          { text: 'BaseSwipe', link: '/BaseSwipe' },
          { text: 'BaseProgress', link: '/BaseProgress' },
          { text: 'BaseQrcode', link: '/BaseQrcode' },
          { text: 'BaseMenu', link: '/BaseMenu' },
          { text: 'BaseBadge', link: '/BaseBadge' },
          { text: 'BaseForm', link: '/BaseForm' },
          { text: 'BaseInput', link: '/BaseInput' },
          { text: 'BaseSwitch', link: '/BaseSwitch' },
          { text: 'BaseAspectRatio', link: '/BaseAspectRatio' },
          { text: 'BaseLoading', link: '/BaseLoading' },
          { text: 'BaseCheckBox', link: '/BaseCheckBox' },
          { text: 'BaseGameItem', link: '/BaseGameItem' },
          { text: 'BaseGameList', link: '/BaseGameList' },
          { text: 'BaseDialog', link: '/BaseDialog' },
          { text: 'BaseTabs', link: '/BaseTabs' },
          { text: 'BaseAmount', link: '/BaseAmount' },
          { text: 'BaseCurrencyIcon', link: '/BaseCurrencyIcon' },
          { text: 'BasePercentage', link: '/BasePercentage' },
          { text: 'BaseCollapseItem', link: '/BaseCollapseItem' },
          // { text: 'BaseCollapse', link: '/BaseCollapse' },
          { text: 'BaseDropDown', link: '/BaseDropDown' },
          { text: 'BaseTable', link: '/BaseTable' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), '../../icons')],
        symbolId: 'icon-[name]',
      }),
      TailwindcssConfig.tailwindcss(),
    ],
    // markdown: {
    //   config: (md) => {
    //     md.use(mdVueDemoPlugin)
    //   },
    // },
    publicDir: '../../../public',
    envDir: '../../../',
  },
})
