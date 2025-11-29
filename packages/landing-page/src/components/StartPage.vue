<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { isDev, useLineData } from '../hooks'

const { t } = i18n.global
const { mainDomain, domains } = useLineData()

const siteName = window.site || ''
const isMobile = window.innerWidth <= 768
const device = isMobile ? 'h5' : 'pc'
const imgDomain = isDev() ? '/landing-page' : t('域名')

function startGame() {
  const mainDomainList = isDev() ? [''] : mainDomain.value.split(',')
  const url = mainDomainList[Math.floor(Math.random() * mainDomainList.length)]
  const urlParams = new URLSearchParams(window.location.search)
  const c = urlParams.get('c')?.replace(/\//g, '')
  const newUrl = c ? `${url}/${siteName}/?c=${c}` : `${url}/${siteName}`
  location.href = newUrl
}
function addScriptToHead(scriptContent) {
  try {
    if (!scriptContent)
      return

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = scriptContent
    document.head.appendChild(script)
  }
  catch (error) {
    console.error('addScriptToHead error', error)
  }
}
onMounted(() => {
  const currentUrl = window.location.href
  // 检查是否启用统计脚本的环境变量
  const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

  if (!currentUrl.includes('/x02') && enableAnalytics) {
    const scriptText = `
      var _czc = _czc || [];
      (function () {
       var um = document.createElement("script");
       um.src = "https://s9.cnzz.com/z.js?id=1281401674&async=1";
       var s = document.getElementsByTagName("script")[0];
       s.parentNode.insertBefore(um, s);
      })();
      `
    addScriptToHead(scriptText)
  }
})
</script>

<template>
  <div class="w-full flex items-center justify-center h-[100vh]" style="background-color: rgb(237, 237, 239);">
    <div class="w-full py-[40rem] flex items-center justify-center">
      <div>
        <BaseImage class="w-[312rem] md:w-[410rem] mb-[16rem]" :url="`${imgDomain}/png/${siteName}_${device}.png`" alt="" />
        <div class="text-center text-[32rem] text-[#5b3503] " @click="startGame">
          <span class="cursor-pointer">{{ t('点击进入') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
