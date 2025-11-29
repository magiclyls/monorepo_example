<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { ApiGameLunch, ApiMemberFavDelete, ApiMemberFavInsert, ApiMemberGameDetail } from '@tg/apis'
import { BaseAspectRatio, PhBaseButton, PhBaseCurrencyIcon, PhBaseImage, PhBaseSelect } from '@tg/bccomponents'
import { sendMsgToAdjust } from '@tg/hooks'
import { IconChatStar1, IconGamePlay, IconShare } from '@tg/icons'
import { useAppStore, useCasinoStore, useCurrency, useDialogStore } from '@tg/stores'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { application, getCurrencyConfig, Local, sendMsgToFlutterThirdPartyApp, toFixed } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

interface Props {
  id: string
  pid: string
  gameId: string
  vid?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['changeTheatre'])
const appStore = useAppStore()
const { isSelfExcludeOpen } = storeToRefs(appStore)
const { t } = useI18n()
const { push } = useRouter()
const { isLogin, isCompleteKYC } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { venueList, imageRatio, imageDirectory } = storeToRefs(useCasinoStore())
const dialogStore = useDialogStore()

const isKYCVerifyOpen = ref(false)

const openGameLoading = ref(false)
const isFavorite = ref(false)

/** KYC弹窗 */
// const { openKYCDialog } = useDialogKYCVerify()

// 当前游戏选择的币种
const currentCurrency = ref<EnumCurrencyKey>()
// 当前游戏支持的币种
const currencyList = ref<EnumCurrencyKey[]>([])

const currentCurrencyCode = computed(() => getCurrencyConfig(currentCurrency.value as EnumCurrencyKey).cur ?? currentGlobalCurrencyMap.value.cur)
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value.type)
const currentCurrencyOptions = computed(() => {
  return currencyList.value.map((item) => {
    return { label: item, value: item }
  })
})
const paramEmpty = computed(() => !!(props.id || props.gameId))

// 游戏详情接口
const { data: dataDetail, runAsync: runDetail } = useRequest(() => ApiMemberGameDetail(props.id, props.pid, props.gameId), {
  ready: paramEmpty,
  onSuccess(res) {
    currencyList.value = res.currencys

    // 如果用户选择过货币，使用之前保存的货币
    const lastCurrency = Local.get<EnumCurrencyKey>('CASINO_GAME_CURRENCY')

    if (lastCurrency && currencyList.value.findIndex(a => a === lastCurrency.value) > -1)
      currentCurrency.value = lastCurrency.value

    else if (currencyList.value.findIndex(a => a === currentGlobalCurrency.value) > -1)
      currentCurrency.value = currencyList.value[currencyList.value.findIndex(a => a === currentGlobalCurrency.value)]

    else
      currentCurrency.value = currencyList.value[0]

    isFavorite.value = +res.is_fav === 1
  },
})

const id = computed(() => dataDetail.value ? dataDetail.value.id : '')
const pid = computed(() => dataDetail.value ? dataDetail.value.platform_id : '')
const code = computed(() => dataDetail.value ? dataDetail.value.game_id : '')
const gameProviderName = computed(() => {
  return venueList.value?.find(
    (a: Record<string, any>) => a.id === dataDetail.value?.platform_id,
  )?.name ?? '-'
})
// AG平台游戏
// AG   = "104" //AG真人
// AGFish  = "208" //AG捕鱼
// AGSlot       = "312" //AG老虎机(XIN)
// YOPLAY       = "316" //AG老虎机(YOPLAY)
// BBIN = "107" //BBIN真人
// BBINSlot     = "317" //BBIN老虎机
// IM  = "401" 优化代码结构 直接加在AG判断
// DG  = "106"
const isAG = computed(() => (pid.value === '312' || pid.value === '104' || pid.value === '208' || pid.value === '312' || pid.value === '316' || pid.value === '107' || pid.value === '317' || pid.value === '401' || pid.value === '106'))

// 启动游戏接口
const {
  runAsync: runLunchGameAsync,
  data: gameUrl,
  mutate: mutateGameUrl,
} = useRequest(() => ApiGameLunch({
  pid: pid.value,
  code: code.value,
  cur: currentCurrencyCode.value,
  wcur: currentGlobalCurrencyMap.value.cur,
}), {
  manual: true,
  onBefore() {
    openGameLoading.value = true
  },
  onSuccess(res) {
    // 判断data开头是不是http
    if (res.toString().startsWith('http')) {
      if (isAG.value) {
        setTimeout(() => {
          location.href = res
        }, 100)
      }
      else {
        localStorage.setItem('gameUrlLocal', res)
        push('/games/mobile-game-frame')
      }
      setTimeout(() => {
        openGameLoading.value = false
      }, 1500)
    }
  },
  onError() {
    openGameLoading.value = false
  },
})
//

// 重新获取游戏地址是先清空
function clearUrl() {
  mutateGameUrl('')
}
// 切换路由时重新获取detail
function refreshDetail() {
  clearUrl()
  runDetail().then(() => !isAG.value)
}
// 选择货币
function onChooseCurrency(v: EnumCurrencyKey) {
  clearUrl()
  currentCurrency.value = v
  Local.set<EnumCurrencyKey>('CASINO_GAME_CURRENCY', v)
}

// 开始游戏
function startGame(v: boolean) {
  if (isSelfExcludeOpen.value)
    return

  /** 增加kyc逻辑 */
  // if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
  // TODO 打开kyc弹窗
  // return

  // pg === '301'
  sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.ENTERGAME)
  sendMsgToAdjust(SendFlutterThirdPartyAppMessage.ENTERGAME)
  if (props.vid === '301') {
    runLunchGameAsync().then((res) => {
      // 1. 伪装跳转
      history.pushState(null, '', '/virtual.html')
      // 2. 替换整个页面
      document.open()
      document.write(res)
      document.close()
    })
  }
  else {
    runLunchGameAsync()
  }
}

// 添加收藏
const { run: runFavInsert, loading: loadingInsert } = useRequest(() => ApiMemberFavInsert(id.value), {
  onSuccess() {
    isFavorite.value = true
  },
})
// 删除收藏
const { run: runFavDelete, loading: loadingDelete } = useRequest(() => ApiMemberFavDelete(id.value), {
  onSuccess() {
    isFavorite.value = false
  },
})

function collect() {
  if (!isLogin.value) {
    push('/login')
    return
  }
  if (loadingInsert.value || loadingDelete.value)
    return

  if (isFavorite.value) {
    runFavDelete()
  }
  else {
    runFavInsert()
  }
}

function ShareRegister() {
  if (!isLogin.value) {
    push('/login')
    return
  }
  dialogStore.setShowShareRegisterLinkDialogTrue()
}

watch(currentGlobalCurrency, (a) => {
  const index = currencyList.value.findIndex(c => c === a)
  if (index > -1) {
    currentCurrency.value = currencyList.value[index]
    onChooseCurrency(currentCurrency.value)
  }
})

onMounted(() => {
  if (isSelfExcludeOpen.value) {
    Message.error(t('已设置自我排除'))
  }
})

defineExpose({ refreshDetail, dataDetail })

await application.allSettled([runDetail()])
</script>

<template>
  <div>
    <div class="rounded-[8rem] overflow-hidden">
      <div class="flex p-[16rem] bg-[#fff] ">
        <div class="w-[130rem] rounded-[16rem] overflow-hidden mr-[16rem]">
          <BaseAspectRatio :ratio="imageRatio">
            <PhBaseImage v-if="dataDetail?.img" :image-directory="imageDirectory" :url="dataDetail.img" is-cloud class="w-full h-full" fit="cover" />
          </BaseAspectRatio>
        </div>
        <div class="flex flex-1 h-[13prem] flex-col">
          <template v-if="isLogin">
            <div class="text-[#0D2245] font-[500] leading-[20rem]">
              {{ t('选择游戏币种') }}
            </div>
            <div class="mt-[12rem] flex-1">
              <div v-if="currentCurrency" class="flex items-center">
                <span class="text-[#6D7693] mr-[3rem] font-[500] leading-[20rem]">{{ t('余额') }}</span>
                <PhBaseSelect v-model="currentCurrency" :width="120" :options="currentCurrencyOptions" @change="onChooseCurrency">
                  <template #label="{ data }">
                    <div class="flex  items-center pl-[8rem] pr-[26rem] leading-[20rem]">
                      <PhBaseCurrencyIcon v-if="data?.value" style="--ph-app-currency-icon-size:18rem;" :currency-type="data?.value" />
                      <span class="mx-[4rem] text-[#0D2245] font-semibold">{{ data?.label }}</span>
                    </div>
                  </template>
                  <template #item="{ item, active }">
                    <div class="w-full flex items-center" :class="{ active }">
                      <PhBaseCurrencyIcon :currency-type="item.value" style="--ph-app-currency-icon-size:18rem;" />
                      <span class="ml-[4rem]">  {{ item.label }}</span>
                    </div>
                  </template>
                </PhBaseSelect>
              </div>
            </div>
            <PhBaseButton
              :loading="openGameLoading" :disabled="isSelfExcludeOpen" style="--ph-base-button-padding-y:6rem;"
              @click="startGame(true)"
            >
              <IconGamePlay class="text-[14rem] text-[#fff]" />
              <span class=" ml-[8rem] text-[14rem] font-[500]">{{ t('开始游戏') }}</span>
            </PhBaseButton>
          </template>
          <template v-else>
            <div class="text-[#0D2245] text-[18rem] font-[500] leading-[20rem] mb-[2rem]">
              {{ dataDetail?.name }}
            </div>
            <div class="flex-1 text-[#6D7693] font-[600]">
              {{ gameProviderName }}
            </div>
            <PhBaseButton
              style="--ph-base-button-padding-y:6rem;"
              @click="push('/login')"
            >
              <IconGamePlay class="text-[14rem] text-[#fff]" />
              <span class=" ml-[8rem] text-[14rem] font-[500]">{{ t('开始游戏') }}</span>
            </PhBaseButton>
          </template>
        </div>
      </div>
      <div class="bg-[#EBEBEB] h-[44rem] flex px-[20rem]  items-center text-[18rem]" :style="{ justifyContent: +(dataDetail?.rtp || 0) > 0 ? 'space-between' : 'flex-end' }">
        <div v-if="+(dataDetail?.rtp || 0) > 0" class="text-[14rem] flex ">
          <div class="text-[#0D2245] font-[500] mr-[4rem]">
            RTP
          </div>
          <div class="text-[#F23038] font-[500]">
            {{ toFixed(dataDetail?.rtp || 0, 2) }}%
          </div>
        </div>
        <div class="flex">
          <div class="mr-[20rem] flex items-center cursor-pointer" @click="collect">
            <template v-if="isFavorite">
              <IconChatStar1 class="text-[red]" />
            </template>
            <template v-else>
              <IconChatStar1 class="text-[#9DABC8]" />
            </template>
          </div>
          <div class="flex items-center cursor-pointer" @click="ShareRegister">
            <IconShare class="text-[#9DABC8]" />
          </div>
        </div>
      </div>
    </div>
    <!-- 中间介绍盒子 -->
    <!-- <div class="mt-[16rem] px-[20rem] flex justify-between items-center bg-[#fff] rounded-[8rem] h-[65rem]">
      <div>
        <div class="text-[#0D2245] leading-[25rem] text-[16rem] font-[500]">
          {{ dataDetail?.name }}
        </div>
        <div class="text-[#F23038] leading-[20rem] font-[500]">
          {{ gameProviderName }}
        </div>
      </div>
      <div v-if="+(dataDetail?.rtp || 0) > 0">
        <div class="text-[#0D2245] leading-[25rem] font-[500]">
          RTP
        </div>
        <div class="text-[#F23038] leading-[20rem] font-[500]">
          {{ toFixed(dataDetail?.rtp || 0, 2) }}%
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang='scss' scoped></style>
