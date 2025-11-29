<script setup lang='ts'>
import { ApiMemberDisplayConfig } from '@tg/apis'

import { IconUniClose } from '@tg/icons'

const route = useRoute()
const { t } = useI18n()
const { openNotify } = useNotify()
const pid = route.query.pid ? route.query.pid.toString() : ''
const preview = route.query.preview?.toString() ?? ''
const { jumpToUrl } = useRedirect()
const lang = getCurrentLanguageForBackend()
const router = useLocalRouter()
const { isMobile } = storeToRefs(useWindowStore())
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { data: configData, runAsync: runGetConfig } = useRequest(() => ApiMemberDisplayConfig(pid), {
  onSuccess: (data) => {
    let tongue = data.lang || '[]'

    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getCurrentLanguageForBackend())) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('lang_not_support_promo'),
      })
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
const { globalPageTitle } = useGlobalStatePageTitle()

await application.allSettled([runGetConfig()])

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
    router.replace('/promotion')
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
    globalPageTitle.value = name
})
</script>

<template>
  <div class="mx-auto max-w-[650px] w-full flex flex-col gap-[16px] pb-[60px] pt-[20px] @md:pt-[3px]2">
    <!-- <div v-if="isMobile" class="back box-content h-[16px] flex items-center justify-end pt-[16px] leading-[16px]">
      <BaseButton type="text" size="none" @click="goPromo">
        <IconUniClose  />
      </BaseButton>
    </div> -->
    <div class="flex items-center justify-center">
      <BaseImage class="" :class="isJumpOut ? 'cursor-pointer' : ''" is-network :url="configData?.image" @click="onBannerClick" />
    </div>
    <!-- 玩法规则 -->
    <div v-if="ruleHtml && !isJumpOut">
      <BaseRichArea :content="ruleHtml" />
    </div>
    <div class="flex flex-col items-center">
      <BaseButton v-if="isShowBtn" bg-style="primary" size="lg" @click="onBtnClick">
        {{ btnText }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
  </route>
