<script setup lang='ts'>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'
import { PhBaseImage } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppApplicationSharing from '~/components/AppApplicationSharing.vue'

defineOptions({ name: 'AppCasinoFooter' })
const router = useRouter()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { data: proData, runAsync } = useRequest(ApiMemberAgencyMyPromotion)

const qrUrl = computed(() => `${location.origin}${proData.value?.link_url ?? ''}`)

// const list = [
//   'casino-footer-gcash',
//   'casino-footer-maya',
//   'casino-footer-fotune',
//   'casino-footer-ub',
//   'casino-footer-aub',
// ]

const list = [
  'pg',
  'jili',
  'tada',
  'spribe',
  'jdb',
  'fc',
  'evo',
  'pp',
  'tp',
  'hacksaw',
  'world',
  'microgaming',
  'playace',
  'redtiger',
  'netent',
]

function listHeight(name: string) {
  if (name === 'pp') {
    return '20rem'
  }
  else if (name === 'world') {
    return '18rem'
  }
  else {
    return '16rem'
  }
}

const pList = [
  { title: t('关于我们'), path: '/policies/about-us' },
  { title: t('常见问题'), path: '/policies/faqs' },
  { title: t('负责任博彩'), path: '/policies/responsible-gaming' },
  { title: t('使用条款'), path: '/policies/terms-of-use' },
  { title: t('隐私政策'), path: '/policies/privacy-policy' },
]
onMounted(() => {
  isLogin.value && runAsync()
})
</script>

<template>
  <div class="w-full flex flex-col items-center text-[14rem] font-[600] text-[#0D2245] leading-[20rem]">
    <div class="w-[91%] mb-[12rem] py-[12rem] flex flex-col gap-[16rem] items-center">
      <span>{{ t('关注我们') }}</span>
      <AppApplicationSharing
        :show-name="false" width="40rem" round :share-text="qrUrl"
        :socials="['Facebook', 'Instagram', 'Telegram', 'YouTube', 'TikTok', 'X']"
        style="--tg-app-share-icon-size:40rem;--tg-app-share-icon-margin-bottom:0;"
      />
      <span>{{ t('负责任博彩') }}</span>
    </div>
    <div class="w-full flex flex-col gap-[10rem]  pb-[19rem]">
      <div v-for="item in pList" :key="item.title" class="h-[37rem] pl-[13.95rem] bg-[#fff] flex items-center rounded-[6.97rem]" @click="router.push(item.path)">
        {{ item.title }}
      </div>
    </div>
    <div class="w-full mt-[16rem] mb-[26rem] pb-[11rem]">
      <div class="text-center w-full mb-[10rem]">
        {{ t('合作伙伴') }}
      </div>
      <!-- <div class="flex items-center w-full justify-between">
        <div v-for="item in list" :key="item" class="w-[44rem] h-[44rem]">
          <PhBaseImage :url="`/ph-h5/png/${item}.png`" />
        </div>
      </div> -->
      <div class="flex flex-wrap">
        <div v-for="item in list" :key="item" class="w-[20%] center h-[34rem]">
          <PhBaseImage :url="`/ph-h5/png/${item}.png`" class="auto" :style="{ height: listHeight(item) }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
