<script setup lang='ts'>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'
import { AfunBaseArrow, AfunBaseCell, AfunBaseImage, AfunBasePopup } from '@tg/bccomponents'
import { useService } from '@tg/hooks'
import { IconUniClose } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { getBrandInfo, getEnv, globalInitMap } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppImage from '~/components/AppImage.vue'

defineOptions({ name: 'AppCasinoFooter' })

const SPORTS_PLAT_ID = 401

const router = useRouter()
const { t } = useI18n()
const { openService } = useService()
const { isLogin } = storeToRefs(useAppStore())
const { data: proData, runAsync } = useRequest(ApiMemberAgencyMyPromotion)
const brandConfig = ref(globalInitMap.allBrandInfo)
const qrUrl = computed(() => `${location.origin}${proData.value?.link_url ?? ''}`)

// Get site information
const { VITE_OFFICIAL_NAME, VITE_OFFICIAL_DOMAIN } = getEnv()
const siteLogo = getBrandInfo('pc.pc_logo_white')

// Bottom popup state
const isShowPopup = ref(false)
const currentPopupItem = ref<any>(null)

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
    return '20px'
  }
  else if (name === 'world') {
    return '18px'
  }
  else {
    return '16px'
  }
}

const pList = reactive([
  {
    title: t('晋升'),
    children: [
      { title: t('优惠活动'), path: '/promotions' },
      { title: t('联盟计划'), path: '/affiliate' },
      { title: t('VIP俱乐部'), path: '/vip' },
      // { title: t('promo_activity'), path: '/promotions' },
    ],
    expand: false,
  },
  {
    title: t('体育').toLowerCase(), // 葡语需要先转换成小写，然后css capitalize 才会起作用
    children: [
      { title: t('体育首页'), path: '/sports' },
      { title: t('足球'), path: `/sports/1` },
      { title: t('体育规则'), path: `policies/sports-book` },
    ],
    expand: false,
  },
  {
    title: t('关于我们'),
    children: [
      { title: t('关于我们'), path: '/policies/about-us' },
      { title: t('条款和条件'), path: '/policies/terms-of-use' },
      { title: t('帮助'), path: 'policies/help' },
    ],
    expand: false,
  },
  {
    title: t('责任'),
    children: [
      { title: t('投注要求'), path: '/policies/wager-requirements' },
      { title: t('反洗钱'), path: '/policies/anti-money-laundering' },
      // { title: t('负责任博彩'), path: '/policies/terms-of-use' },
      { title: t('隐私政策'), path: '/policies/privacy-policy' },
      { title: t('币混合'), path: '/policies/coin-mixing' },
      { title: t('游戏提供商'), path: '/policies/game-provider' },
      { title: t('一般规则'), path: '/policies/general-rules' },
      { title: t('Cookie政策'), path: '/policies/cookie-policy' },
      { title: t('公平性'), path: '/provably-fair' },
      // { title: t('gameble_aware'), icon: true },
      // { title: t('help_center'), icon: true },
    ],
    expand: false,
  },
  {
    title: t('联系我们'),
    children: [
      { title: t('联系我们'), path: '/service' },
    ],
    expand: false,
  },
])

function getBottomData(v: any) {
  const arr = Object.entries(toRaw(v)).map(([name, data]) => ({
    name,
    ...data,
  }))
  return arr.filter((item: any) => item.state)
}

// Open bottom popup
function openPopup(item: any) {
  item.expand = !item.expand
  // isShowPopup.value = true
}

// Handle click item in popup
function handleClickItem(child: any) {
  if (child.onClick) {
    child.onClick()
  }
  else if (child.path) {
    router.push(child.path)
  }
  isShowPopup.value = false
}

const textInfoImgs = [
  { img: '/m/afun-h5/png/footer-img1.png', url: '', alt: '' },
]

const textInfoImgs2 = [
  { img: '/m/afun-h5/png/footer-img2.png', url: 'https://betblocker.org/', alt: '' },
  { img: '/m/afun-h5/png/footer-img3.png', url: 'https://gamblingtherapy.org/', alt: '' },
  { img: '/m/afun-h5/png/footer-img4.png', url: 'https://sigap.fazenda.gov.br/', alt: '' },
]

const textInfoData = [t('解释说明1'), t('解释说明2'), t('解释说明3')]

onMounted(() => {
  isLogin.value && runAsync()
})
</script>

<template>
  <div class="w-full flex flex-col items-center text-[14px] font-[600] text-[#B1BAD3] leading-[20px] bg-[#1a2c38]">
    <div v-if="brandConfig?.bottom && getBottomData(brandConfig?.bottom)?.length" class="w-[91%] mt-[24px] flex flex-col gap-[16px] items-center">
      <span>{{ t('加入我们的社区') }}</span>
      <div class="w-[280px] flex" :class="[getBottomData(brandConfig?.bottom)?.length >= 5 ? 'justify-between items-center' : 'center wz-style']">
        <component
          :is="bottomItem.url ? 'a' : 'div'"
          v-for="(bottomItem, index) in getBottomData(brandConfig?.bottom)"
          :key="index"
          :href="bottomItem.url || null"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AfunBaseImage :url="`/m/afun-h5/png/social-${bottomItem.name}.png`" width="32px" height="32px" class="promotion-base-image" style="--tg-base-img-style-radius: 16px;" />
        </component>
      </div>
    </div>
    <div class="w-full flex flex-col gap-[10px] mt-[24px]">
      <div v-for="item in pList" :key="item.title">
        <AfunBaseCell class="w-[full] min-h-[45px] px-[16px] bg-[#213743] rounded-[4px] text-[#fff] footer-base-cell" @click="item.expand = !item.expand">
          <template #title>
            <span class="font-[500]">{{ item.title }}</span>
          </template>
          <template #right>
            <div class="bg-transparent">
              <AfunBaseArrow :direction="item.expand ? 'top' : 'bottom'" :shadow="false" style="color: #B1BAD3;" />
            </div>
          </template>
          <div v-if="item?.expand" class="h-px bg-[#2f4553] -mx-[16px]" />
          <div v-if="item?.expand" class="flex flex-col w-full py-[16px] gap-[16px]">
            <div
              v-for="(child, index) in item?.children"
              :key="index"
              class="h-[18px] w-full flex items-center justify-between rounded-[4px] text-[#B1BAD3] font-[500] cursor-pointer hover:bg-[#2F4553]"
              @click="handleClickItem(child)"
            >
              <span>{{ child.title }}</span>
            </div>
          </div>
        </AfunBaseCell>
      </div>
    </div>

    <div class="text-[#B1BAD3] text-[12px] leading-[21px]">
      <div class="w-[200px] h-[36px] flex justify-between items-center my-[24px] mx-[auto]">
        <AppImage height="36px" :url="siteLogo" :alt="siteLogo" />
        <component
          :is="imgItem.url ? 'a' : 'div'"
          v-for="(imgItem, index) in textInfoImgs"
          :key="index"
          :href="imgItem.url || null"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AfunBaseImage height="36px" :url="imgItem.img" :alt="imgItem.alt" />
        </component>
      </div>
      <i18n-t
        keypath="解释说明" tag="div"
        class="text-[12px] font-semibold leading-[21px]"
      >
        <span>{{ VITE_OFFICIAL_NAME }}</span>
      </i18n-t>
      <div v-for="textItem, index of textInfoData" :key="index">
        {{ textItem }}
      </div>
      <div class="wz-css w-[full] flex flex-wrap center my-[24px] mx-[auto] px-[30px]">
        <component
          :is="imgItem.url ? 'a' : 'div'"
          v-for="(imgItem, index) in textInfoImgs2"
          :key="index"
          :href="imgItem.url || null"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AfunBaseImage
            height="36px" :url="imgItem.img" :alt="imgItem.alt"
            class="icon-img"
          />
        </component>
      </div>
    </div>

    <!-- Bottom Popup -->
    <AfunBasePopup v-model="isShowPopup">
      <div class="font-[600] px-[10px] py-[12px] bg-[#1A2C38] rounded-tl-[8px] rounded-tr-[8px] rounded-bl-0 rounded-br-0">
        <div class="flex items-center justify-between mb-[10px]">
          <span class="text-[#fff] text-[16px]">{{ currentPopupItem?.title }}</span>
          <IconUniClose class="text-[#B1BAD3] text-[18px] cursor-pointer" @click="isShowPopup = false" />
        </div>
        <div class="flex flex-col">
          <div
            v-for="(child, index) in currentPopupItem?.children"
            :key="index"
            class="h-[40px] px-[12px] flex items-center justify-between rounded-[4px] text-[#fff] cursor-pointer hover:bg-[#2F4553]"
            @click="handleClickItem(child)"
          >
            <span>{{ child.title }}</span>
            <AfunBaseArrow direction="right" />
          </div>
        </div>
      </div>
    </AfunBasePopup>
  </div>
</template>

<style lang='scss' scoped>
.footer-base-cell {
  --afun-app-cell-min-height: 45px;
  --afun-app-cell-padding-x: 0;
  --afun-app-cell-padding-y: 0;
}
.wz-style {
  grid-gap: 50px;

  .promotion-base-image {
    --tg-base-img-style-radius: 16px;
  }
}
.foo-style {
  grid-gap: initial;

  .promotion-base-image {
    --tg-base-img-style-radius: 16px;
  }
}
.wz-css {
  & a:last-child {
    margin-top: 12px;
  }

  & a:first-child {
    margin-right: 51px;
  }
}
</style>

<style lang='scss'>
.footer-base-cell {
  .child {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
