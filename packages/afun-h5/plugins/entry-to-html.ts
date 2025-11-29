import type { Plugin, ResolvedConfig } from 'vite'
import { JSDOM } from 'jsdom'

function createDom(source: string | Uint8Array) {
  return new JSDOM(source)
}

export default function VitePluginEntryToHtml(): Plugin {
  let viteConfig: ResolvedConfig

  return {
    name: 'vite-plugin-entry-to-html',
    enforce: 'post',
    apply: 'build',
    configResolved(config) {
      viteConfig = config
    },
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle)
        return html

      const dom = createDom(html)

      //  ../assets/src-utils -> /assets/src-utils
      const code = ctx.chunk?.code.replaceAll('./chunk', '/js/chunk').replaceAll('../assets/src-utils', '/assets/src-utils')

      const newDomScript = dom.window.document.querySelector('script#newEntryIndex')
      if (newDomScript)
        newDomScript.textContent = code

      const moduleScripts = dom.window.document.querySelectorAll('script[type="module"]')
      moduleScripts[0].remove()

      const htmlStr = dom.serialize()
      return htmlStr
    },
  }
}
