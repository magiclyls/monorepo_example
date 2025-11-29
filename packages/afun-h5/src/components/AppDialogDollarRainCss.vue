<script setup lang="ts">
import { ApiMemberPromoRedBonus, ApiMemberRedDetail, ApiPromoRedClaimed } from '@tg/apis'
import { AfunBaseDialog } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniClose3 } from '@tg/icons'
import { useAppStore, useCurrency, useDialogStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { getLang, getLangConfig, getLangForBackend } from '@tg/vue-i18n'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import { Message, RedEnvelopeItem } from '~/utils'

interface Props {
  /* pid: string */
}
defineOptions({
  name: 'AppDialogDollarRainCss',
})
const props = withDefaults(defineProps<Props>(), {
})

const route = useRoute()
const { push } = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const currencyStore = useCurrency()
const dialogStore = useDialogStore()
const { dialogRainData, dialogBonusData } = storeToRefs(dialogStore)
const { bool: isOpening, setBool: setIsOpening } = useBoolean(false)
const userLanguage = ref(getLang())
const languageBack = ref(getLangForBackend())
const { height: innerHeight } = useWindowSize()

const redEnvelopeItem = ref()
const firstBonusData = ref()

const globalCurrencyCode = ref('701')

const timeScopes = ref<any>([])
const currentDollarZone = ref(getLangConfig()?.zone)

const localHM = ref(zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm'))

function zoneDayJs(t?: any) {
  return dayjs(t).tz(currentDollarZone.value)
}

function setLocalHM() {
  localHM.value = zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
}

const currencyName = ref('')

const isInRange = computed(() => {
  if (timeScopes.value && timeScopes.value.length)
    return localHM.value >= timeScopes.value[0][0] && localHM.value <= '23:59'
  return false
})

const { data: cdata, runAsync: runGetClaimed, loading: claimedLoading } = useRequest(ApiPromoRedClaimed, {
  ready: isLogin,
  manual: true,
})

const { data: detailData, runAsync: runGetDetail } = useRequest(ApiMemberRedDetail, {
  manual: true,
  onSuccess: (res, params) => {
    // const bb = res && res.lang && res.lang.length && res.lang.map(r => r.replace('_', '-').includes(userLanguage.value))
    const displayTime = res.display_time
    currentDollarZone.value = res.timezone
    currencyName.value = languageBack.value

    globalCurrencyCode.value = res.conf.currency ?? '701'

    const displayTimeStartStamp = displayTime && displayTime.s ? (dayjs.tz(displayTime.s, currentDollarZone.value).valueOf()) : undefined
    localStorage.setItem(`promo_red_start_${params[0]}_${currencyName.value}`, displayTimeStartStamp?.toString() || '')
    // localHM.value = dayjs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
    setLocalHM()
    if (res) {
      const cycle = res.cycle
      if (cycle && cycle.length)
        timeScopes.value = transferScope(cycle) // .sort((a, b) => a - b) // [['1:00', '3:00'], ['3:00', '7:00'], ['7:00', '12:00'], ['12:00', '17:00'], ['17:00', '20:00'], ['20:00', '23:59']].map(m => m.map(s => formatTag(s))) // uniq(flatten(res.config.map(c => c.scope))).sort(sortTimeTag).map((i: string) => i.split('~').map(m => formatTag(m)))
    }
  },
})

function transferScope(arr: Array<number[]>) {
  arr.sort((a, b) => a[0] - b[0])
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const sun = arr[i]
    let temp
    const start = sun[0]
    const end = sun[1]
    if (start < 24 && end >= 24)
      temp = [`${sun[0]}`, '23:59'].map(s => formatTag(s))
    else
      temp = [`${sun[0]}`, `${sun[1]}`].map(s => formatTag(s))
    result.push(temp)
  }
  return result
}

function formatTag(tag: string) {
  return tag.split(':').map(i => +i < 10 ? `0${+i}` : i).join(':')
}

const { data: bonusData, runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoRedBonus, {
  ready: isLogin,
  manual: true,
  onAfter: () => {
    appEventBus.emit(EventBusNames.USER_REFRESH_RED_CLAIMED)
  },
})

function langNotify(m: string) {
  Message.info(t('请切换至{0}领取', [m]))
}

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

const isBRL = ref(false)
const isCrystal = ref(false)

function closeDialog() {
  dialogRainData.value = undefined
}
async function applyDollarWave() {
  if (!isLogin.value) {
    push('/register')
    closeDialog()
    return
  }
  if (cdata.value && (cdata.value.ip || cdata.value.bl)) {
    if (cdata.value.ip) {
      Message.error(t('本活动同一个ip只能参与一次'))
    }
    if (cdata.value.bl) {
      Message.error(t('不符合活动参与资格'))
    }
    closeDialog()
    if (dialogRainData.value.pid)
      runGetClaimed({ pid: dialogRainData.value.pid, lang: currencyName.value })
    return
  }
  if (bonusLoading.value || isOpening.value)
    return
  setIsOpening(true)
  const code = globalCurrencyCode.value
  setLocalHM()
  runGetBonus(dialogRainData.value.pid, code, 0).then((res: any) => { // , code
    if (res === 0) {
      Message.info(t('活动未开始请稍后再试'))
      setTimeout(() => {
        setIsOpening(false)
      }, 300)
    }
    else {
      if (res) {
        if (res.tongue && +res.state === 4) {
          // openNotify({
          //   type: 'info',
          //   message: t('promo_lang_receive', [t(`lang_${res.tongue}`)]),
          // })
          notifyLangThrottle(t(`lang_${res.tongue}`))
          setTimeout(() => {
            setIsOpening(false)
            setTimeout(() => {
              closeDialog()
            }, 0)
          }, 300)
          return
        }
        firstBonusData.value = { ...res, currencyCode: code }
        setLocalHM()
        nextTick(() => {
          setTimeout(() => {
            setIsOpening(false)
          }, 300)
          const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
          if (nextScope)
            nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1] // dayjs(`2024-08-21 ${nextScope[1]}`).subtract(1, 'minute').format('HH:mm')
          appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
          dialogBonusData.value = {
            pid: dialogRainData.value.pid,
            firstBonusData: firstBonusData.value,
            bonusData: bonusData.value,
            nextScope: nextScope?.join('-'),
            isBRL: isBRL.value,
            isCrystal: isCrystal.value,
            currencyName: detailData.value?.conf.currency,
          }
          currencyStore.initCurrencyList()
          setTimeout(() => {
            closeDialog()
          }, 100)
        })
      }
    }
  }).catch(() => {
    const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
    if (nextScope)
      nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
    appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
    dialogBonusData.value = {
      pid: dialogRainData.value.pid,
      firstBonusData: { },
      bonusData: { state: 1 },
      nextScope: nextScope?.join('-'),
      isBRL: isBRL.value,
      isCrystal: isCrystal.value,
      currencyName: detailData.value?.conf.currence,
    }
    setTimeout(() => {
      setIsOpening(false)
      closeDialog()
    }, 300)
  })
}

const gameContainerRef = ref<HTMLElement>()

async function animate() {
  // localHM.value = dayjs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
  setLocalHM()
  if (timeScopes.value && timeScopes.value.length && isInRange.value !== undefined && !isInRange.value) {
    closeDialog()
    return
  }
  redEnvelopeItem.value?.start()
}

watchEffect(() => {
  if (isBRL.value)
    redEnvelopeItem.value = new RedEnvelopeItem('dollar', 'game-container', { userLanguage })

  else if (isCrystal.value)
    redEnvelopeItem.value = new RedEnvelopeItem('diamond', 'game-container', { userLanguage })

  else redEnvelopeItem.value = new RedEnvelopeItem('red', 'game-container', { userLanguage })
})

onMounted(async () => {
  appEventBus.on(EventBusNames.PROMO_REDRAIN_BONUSDIALOG_CLOSE, closeDialog)
})

watch(dialogRainData, (d) => {
  if (d && d.pid) {
    runGetClaimed({ pid: dialogRainData.value.pid, lang: currencyName.value })
    runGetDetail(dialogRainData.value.pid).then((res) => {
      if (res) {
        const drop = res.drop
        isBRL.value = !!(res && drop && +drop === 2)
        isCrystal.value = !!(res && drop && +drop === 3)
        nextTick(() => {
          animate()
          if (gameContainerRef.value) {
            gameContainerRef.value.addEventListener('click', (e) => {
              applyDollarWave()
            })
          }
        })
      }
    }).catch(() => {
      closeDialog()
    })
  }
})

onBeforeUnmount(() => {
  redEnvelopeItem.value?.onClose()
})
</script>

<template>
  <AfunBaseDialog v-model="dialogRainData" style="--afun-base-dialog-background-color:transparent;" :show-header="false">
    <div v-if="dialogRainData" class="rain-wrap" :style="{ height: `${innerHeight}px` }">
      <div class="app-dollar-rain-main">
        <div ref="gameContainerRef" class="game-container" />
      </div>
      <div class="close theme-close absolute right-[15px] top-[15px] flex cursor-pointer text-[15px]" @click="closeDialog">
        <IconUniClose3 />
      </div>
    </div>
  </AfunBaseDialog>
</template>

<style lang="scss">
.theme-close {
  padding: 10px;
}
.rain-wrap {
  width: 100%;
}
.game-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
