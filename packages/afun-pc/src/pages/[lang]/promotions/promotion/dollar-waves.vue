<script lang="ts" setup>
import { ApiMemberRedDetail, ApiPromoRedClaimed } from '@tg/apis'

const route = useRoute()
const router = useLocalRouter()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { openNotify } = useNotify()
const { t } = useI18n()
const pid = ref(`${route.query.promoid}`)
const preview = route.query.preview?.toString() ?? ''
const currencyName = ref('')
const { globalPageTitle } = useGlobalStatePageTitle()

const currentDollarZone = ref(AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)

const { data: cdata, runAsync: runGetClaimed, loading: claimedLoading } = useRequest(ApiPromoRedClaimed, {
  ready: isLogin,
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess: (res, params) => {
    if (res && (res.ip || res.bl)) {
      if (res.ip) {
        openNotify({
          type: 'error',
          code: 'false',
          message: t('same_ip_once'),
        })
      }
      if (res.bl) {
        openNotify({
          type: 'error',
          code: 'false',
          message: t('activity_blacked'),
        })
      }
      goPromo()
    }
  },
})

const { data: detailData, runAsync: runGetDetail } = useRequest(ApiMemberRedDetail, {
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess: (res, params) => {
    const bb = res && res.lang && res.lang.length && res.lang.map(r => r.replace('_', '-').includes(userLanguage.value))
    if (bb) {
      const displayTime = res.display_time

      currentDollarZone.value = res.timezone
      currencyName.value = Object.keys(res.conf)[0]
      const displayTimeStartStamp = displayTime && displayTime.s ? (dayjs.tz(displayTime.s, currentDollarZone.value).valueOf()) : undefined
      localStorage.setItem(`promo_red_start_${params[0]}_${currencyName.value}`, displayTimeStartStamp)
    }
    const tongue = res && res.lang ? res.lang.toString() : undefined
    if (tongue) {
      if (tongue.includes(userLanguage.value.slice(0, 2)))
        console.log('yes')
      else
        goPromo()
    }
    // if (res && +res.display !== 1)
    if (res && +res.state !== 1 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
    }
  },
  onError: () => {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('promo_end'),
    })
    goPromo()
  },
})

const isBRL = computed(() => {
  if (detailData.value) {
    const drop = detailData.value.drop
    return drop && +drop === 2
  }
  return false
})
const isDiamond = computed(() => {
  if (detailData.value) {
    const drop = detailData.value.drop
    return drop && +drop === 3
  }
  return false
})

function getDetail() {
  runGetDetail(pid.value)
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

watchEffect(() => {
  const names = detailData.value?.name
  const name = names ? names[userLanguage.value.replace('-', '_') as any] : ''
  if (name)
    globalPageTitle.value = name
})

if (isLogin.value)
  await application.allSettled([runGetDetail(pid.value), runGetClaimed({ pid: pid.value, lang: currencyName.value })])
else
  await application.allSettled([runGetDetail(pid.value)])
</script>

<template>
  <div v-if="detailData" class="pt-[20px]">
    <template v-if="isDiamond">
      <AppDollarWavesTemp3 :get-detail="getDetail" :data="detailData" />
    </template>
    <template v-else-if="isBRL">
      <AppDollarWavesTempBRL :get-detail="getDetail" :data="detailData" />
    </template>
    <template v-else>
      <AppDollarWavesTempTwo :get-detail="getDetail" :data="detailData" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>
