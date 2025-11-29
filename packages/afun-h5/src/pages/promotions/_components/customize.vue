<script setup lang='ts'>
import { ApiMemberDisplayConfig } from '@tg/apis' // 路径请根据实际情况调整
import { AfunBaseButton, AfunBaseImage, AfunBaseRichArea } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { computed, inject, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '~/utils'

defineOptions({ name: 'Customize' })
const { t } = useI18n()
const setTitle = inject('setTitle', (v: string) => {})
const route = useRoute()
// const { openNotify } = useNotify()
const pid = route.query.pid ? route.query.pid.toString() : ''
const { jumpToUrl } = useRedirect()
const lang = getLangForBackend()
const router = useRouter()
const userLanguage = ref(getLang())
const { data: configData, runAsync: runGetConfig } = useRequest(() => ApiMemberDisplayConfig(pid), {
  onSuccess: (data) => {
    let tongue = data.lang || '[]'

    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
  },
})
// 是否跳外部链接
const isJumpOut = computed(() => configData.value ? configData.value.display_type === '2' : false)
// 玩法规则
const ruleHtml = computed(() => configData.value ? configData.value.detail : '')
// 是否显示底部按钮
const isShowBtn = computed(() => configData.value ? configData.value.button === 1 : false)
// 底部按钮文字
const btnText = computed(() => configData.value && isShowBtn ? JSON.parse(configData.value.button_text)[lang] : '')

await Promise.allSettled([runGetConfig()])

function onBtnClick() {
  if (configData.value) {
    jumpToUrl({
      type: +configData.value.button_type,
      jumpUrl: configData.value.button_redirect,
    })
  }
}
function onBannerClick() {
  if (configData.value && isJumpOut.value) {
    jumpToUrl({
      type: +configData.value.button_type,
      jumpUrl: configData.value.button_redirect,
    })
  }
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}
watchEffect(() => {
  let names = configData.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    setTitle(name)
})
</script>

<template>
  <div class="mx-auto max-w-[650px] w-full flex flex-col gap-[16px] pb-[60px] @md:pt-[32px]">
    <div class="center">
      <AfunBaseImage :class="isJumpOut ? 'cursor-pointer' : ''" class="set-radios" is-network :url="configData?.image" loading="eager" @click="onBannerClick" />
    </div>
    <!-- 玩法规则 -->
    <div v-if="ruleHtml && !isJumpOut">
      <AfunBaseRichArea :content="ruleHtml" />
    </div>
    <div class="flex flex-col items-center">
      <AfunBaseButton v-if="isShowBtn" bg-style="secondary" size="lg" @click="onBtnClick">
        {{ btnText }}
      </AfunBaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.set-radios {
  --tg-base-img-style-radius: 12px;
}
</style>
