<script lang="ts" setup>
import type { EnumCurrencyKey } from '@tg/types'
import type { EnumLanguageKeys } from '@tg/types'
import type { EnumSportsOddsType } from '~/stores/sports'
import { IconUniJumpPage } from '@tg/icons'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppFooterWg',
})
const { t } = useI18n()

const router = useLocalRouter()
const { openService } = useService()
const { VITE_OFFICIAL_NAME, VITE_OFFICIAL_DOMAIN, VITE_SITE_NAME } = getEnv()
const {
  currentGlobalCurrency,
  companyData,
} = storeToRefs(useAppStore())
const languageStore = useLanguageStore()
const { userLanguage, AllLanguages } = storeToRefs(languageStore)
const sportStore = useSportsStore()
const { sportsOddsType, AllOddsTypes } = storeToRefs(sportStore)
const { isMobile } = storeToRefs(useWindowStore())
const { langChoosed, brandConfig } = storeToRefs(useBrandStore())

const langChoosedObj = computed(() => langChoosed.value ? AllLanguages.value.filter(a => a.value === langChoosed.value)[0] : '')

// const supportCurrency = [
//   '/png/footer/ltc.png',
//   '/png/footer/bitcoin.png',
//   '/png/footer/ethereum.png',
//   '/png/footer/tron.png',
//   '/png/footer/ripple.png',
//   '/png/footer/dogecoin.png',
//   '/png/footer/bitcoin_cash.png',
//   '/png/footer/tether.png',
//   '/png/footer/safe_gamble.png',
//   // '/png/footer/18plus.png',
// ]
const supportCurrency = [
  'coin-btc',
  'coin-usdt',
  'coin-busd',
  'coin-ape',
  'coin-bnb',
  'coin-xrp',
  'coin-eth',
  'coin-doge',
  'coin-eos',
  'coin-dai',
  'coin-cro',
  'coin-bch',
  'coin-link',
  'coin-usdc',
  'coin-ltc',
  'coin-matic',
  'coin-trx',
  'coin-shib',
  'coin-sand',
  'coin-bnb-1',
  'coin-uni',
]
const partner = [
  { url: '/png/footer/email.avif.png', with: '35px' },
  { url: '/png/footer/telegram.avif.png', with: '35px' },
  { url: '/png/footer/18plus.avif.png', with: '35px' },
  // { url: '/png/footer/verified.png', with: '120px' },
  // // { url: `/png/site/${VITE_SITE_NAME}/official.png`, with: '141px' },
  // { url: '/png/footer/main.png', with: '82.82px' },
  // { url: '/png/footer/ufc.png', with: '151.5px' },
]

const targetCurrency = ref<EnumCurrencyKey>('USDT')

const { rate, runGetRateFromTo } = useExchangeRateFromTo(currentGlobalCurrency, targetCurrency)
runGetRateFromTo()
// const connectData = computed(() => {
//   if (!footerThirdData.value)
//     return []

//   const keys = Object.keys(footerThirdData.value)
//   if (!keys.length)
//     return []

//   const _data: any[] = [
//     { title: t('facebook'), icon: true },
//     { title: t('twitter'), icon: true },
//     { title: t('instagram'), icon: true },
//     { title: t('youtube'), icon: true },
//     { title: t('tiktok'), icon: true },
//     { title: t('telegram'), icon: true },
//   ]

//   keys.forEach((key) => {
//     if (footerThirdData.value[key].state === false) {
//       const index = _data.findIndex(item => item.title.toLowerCase() === key)
//       if (index !== -1)
//         _data.splice(index, 1)
//     }
//   })

//   _data.forEach((item) => {
//     item.path = footerThirdData.value[item.title.toLowerCase()]?.url
//   })

//   return _data
// })

const menuData = computed(() => [
  // {
  //   title: t('sports').toLowerCase(), // 葡语需要先转换成小写，然后css capitalize 才会起作用
  //   children: [
  //     { title: t('home_space_title'), path: '/' },
  //     { title: t('footer_menu_live'), path: `/sports/${SPORTS_PLAT_ID}/live` },
  //     { title: t('sports_rule'), icon: false, path: '/policies/spt-book' },
  //   ],
  // },
  {
    title: t('casino').toLowerCase(),
    children: [
      { title: t('tasks_space_title'), path: '/casino' },
      { title: t('vip_water_back'), path: '/casino' },
      { title: t('wait_receive'), path: '/casino' },
      { title: t('vip'), path: '/vip-club' },
      { title: t('go_make_money'), path: '/casino' },
      { title: t('activity'), path: '/promotions' },
    ],
  },
  {
    title: t('game'),
    children: [
      { title: t('game_dianzi'), hasSpace: true },
      { title: t('chess'), hasSpace: true },
      { title: t('fishing'), hasSpace: true },
      { title: t('live'), hasSpace: true },
      { title: t('lyticket'), hasSpace: true },
      { title: t('sports'), hasSpace: true },
      { title: t('game_douji'), hasSpace: true },
      { title: t('electric_game'), hasSpace: true },
      { title: t('key_chain') },
      { title: t('try_label'), hasSpace: true },
    ],
  },
  {
    title: t('support'),
    children: [
      // { title: t('gameble_aware'), icon: true },
      { title: t('online_kefu'), onClick: () => openService({ isFootBar: false, needDeal: true }) },
      { title: t('help_center') },
      { title: t('reward_feedback'), path: '/provably-fair/overview' },
      { title: t('about_us'), path: '/policies/privacy' },
      // { title: t('responsible_casino'), path: '/responsible-gambling/safe' },
    ],
  },
  // {
  //   title: t('community'),
  //   children: [
  //     // { title: t('blog') },
  //     // { title: t('chat_forum'), icon: true },
  //     ...connectData.value,
  //     // { title: t('online_shopping'), icon: true },
  //   ],
  // },
  // {
  //   title: t('about_us'),
  //   children: [
  //     { title: t('privacy_policy'), path: '/policies/privacy' },
  //     { title: t('footer_license') },
  //     { title: t('anti_money_laundering_rule'), path: '/policies/anti-money-laundering' },
  //     { title: t('footer_terms_of_service'), path: '/policies/terms' },
  //     // { title: 'Primedice', icon: true },
  //   ],
  // },
])

function selectChange(v: EnumLanguageKeys) {
  languageStore.changeLanguage(v)
}
function selectOddsChange(v: EnumSportsOddsType) {
  sportStore.setSportsOddsType(v)
}
function pathTo(tmp: { path?: string; title: string; icon?: boolean; onClick?: () => void }) {
  if (tmp.path)
    router.push(replaceSportsPlatId(tmp.path))
  else if (tmp.onClick)
    tmp.onClick()
}
</script>

<template>
  <div class="app-footer-wg" :style="{ gap: isMobile ? '12px' : '32px' }">
    <div class="footer-nav">
      <div v-for="item, index of menuData" :key="index" class="layout-spacing reset">
        <div class="nav-head">
          {{ item.title }}
        </div>
        <div v-for="tmp of item.children" :key="tmp.title" class="leading-[18px]" :class="[`child-${userLanguage}`, tmp.hasSpace ? 'space-txt' : '']" @click="pathTo(tmp)">
          {{ tmp.title }}
          <IconUniJumpPage v-if="tmp.icon" />
        </div>
      </div>

    </div>

    <BaseDivider size="1" />
    <div class="text-[12px] leading-[18px] text-[var(--tg-text-green-main)]">
      {{ t('contact_us_short') }}
    </div>
    <div :class="isMobile ? 'h5-footer-sponsor' : 'pc-footer-sponsor'">
      <BaseImage
        v-for="item, index of partner" :key="index" :width="isMobile ? 'auto' : item.with"
        :height="isMobile ? '35px' : 'auto'" :url="item.url"
      />
    </div>
    <div class="text-center text-[10px] leading-[17px] text-[var(--tg-text-green-main)]">
      {{ t('copyright_desc', { site: VITE_OFFICIAL_NAME }) }}
    </div>
    <BaseDivider size="1" />
    <div class="mb-[24px]">
      <div class="center">
        <BaseImage height="19px" url="/png/footer/partner1.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner2.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner3.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner4.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner5.avif.png" />
      </div>
      <div class="center mt-[10px]">
        <BaseImage height="19px" url="/png/footer/partner6.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner7.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner8.avif.png" />
        <BaseImage height="19px" url="/png/footer/partner9.avif.png" />
      </div>
    </div>
    <div class="footer-copyright">
      <!-- <BaseLogo :static="false" /> -->
      <div class="text-center text-[9px] leading-[13px] text-[var(--tg-text-green-main)]">
        Copyright © {{ VITE_OFFICIAL_NAME }} {{ VITE_OFFICIAL_DOMAIN }} | {{ t('footer_under_logo_copyright') }} 2024
      </div>
      <!-- <div>
        1 {{ currentGlobalCurrency }} = ${{ rate }}
      </div> -->
    </div>
    <!-- <div class="footer-description">
      {{ t('footer_description', { name: VITE_OFFICIAL_NAME, email: companyData.email }) }}
    </div> -->
    <!-- <div class="footer-description limit-width">
      <span>{{ t('support') }}</span>
      <span class="">{{ companyData.email }}</span>
      <span>|</span>
      <span>{{ t('partner') }}</span>
      <span>{{ companyData.email }}</span>
      <span>|</span>
      <span>{{ t('media') }}</span>
      <span>{{ companyData.email }}</span>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.logos-center {
  // gap: var(--tg-spacing-36);
}
.select-wrap {
  --tg-base-select-popper-style-padding-x: 0;
  --tg-base-select-popper-style-padding-y: 0;
  @include webTheme('green'){
    --tg-base-select-popper-label-color: var(--tg-text-lightgrey);
  }
}
.app-footer-wg {
  --tg-base-divider-bg-color: var(--tg-secondary-grey);
  /* background-color: #0F212E; */
  width: 100%;
  display: grid;
  padding: 32px 0;
  padding-top: 27px;
  .footer-nav{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(10ch,1fr));
    grid-gap: var(--tg-spacing-16);
    color: var(--tg-text-lightgrey);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-normal);
    @include webTheme('green'){
      color: var(--tg-text-lightgrey);
    }
    .layout-spacing:nth-child(1){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing:nth-child(3){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing:nth-child(2){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing:nth-child(4){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing:nth-child(5){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing:nth-child(6){
      .nav-head{
        font-weight: bold;
      }
    }
    .layout-spacing{
      align-items: flex-start;
      // gap: var(--tg-spacing-8);
    }
    .nav-head{
      @include webTheme('green'){
          color: var(--tg-text-green-main)
      }
      font-size: var(--tg-font-size-base);
      font-weight: 500;
      color: var(--tg-text-white);
      margin-bottom: var(--tg-spacing-6);
      text-transform: capitalize;
    }
    .nav-head~div{
      cursor: pointer;
      font-weight: var(--tg-font-weight-semibold);
      white-space: wrap;
      display: flex;
      align-items: center;
      font-size: var(--tg-font-size-default);
      .app-svg-icon {
        font-size: var(--tg-font-size-xs);
        margin-left: var(--tg-spacing-8);
        font-weight: var(--tg-font-weight-normal);
      }
      &:hover{
        --tg-icon-color: var(--tg-text-white);
        color: var(--tg-text-white);
      }
    }
    .last-nav{
      color:var(--tg-text-white);
      // gap: var(--tg-spacing-14);
      // 之前font-size是14，去掉这行就是之前的
      font-size: var(--tg-font-size-base);
      @include webTheme('green'){
          color: var(--tg-text-green-main)
      }
      .nav-head{
         margin-bottom: var(--tg-spacing-0);
      }
    }
  }
  .h5-support-box{
    .support-text{
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .h5-footer-support{
    width: 100%;
    display: grid;
    grid-gap: 10px 0;
    grid-template-columns: repeat(7, 34px);
    justify-content: space-between;
    // justify-items: center;
  }
  .pc-footer-support {
    .support-row{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(14, 40px);
      justify-content: space-between;

    }
  }
  .h5-footer-sponsor{
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 35px);
    justify-items: start;
  }
  .pc-footer-sponsor {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-gap: 26px 24px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    justify-items: center;
  }
  .footer-copyright{
    width: 100%;
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: center;
    color: var(--tg-text-lightgrey);
    gap:0.5rem;
    font-size: var(--tg-font-size-default);
    line-height: 1.5;
  }
  .footer-description{
    line-height: 1.5;
    text-align: center;
    color: var(--tg-text-lightgrey);
    font-size: var(--tg-font-size-xs);
    span:nth-child(even) {
      color: var(--tg-text-white);
    }
  }
  .limit-width{
    display: flex;
    flex-wrap: wrap;
    // gap: var(--tg-spacing-4);
    line-height: 1.375;
    margin: auto;
    text-align: left;
  }
}
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
  .logos-center {
    >:first-child {
      margin-right: var(--tg-spacing-36);
    }
  }
  .app-footer-wg {
    .footer-nav {
      .layout-spacing {
        > * {
          margin-top: var(--tg-spacing-8);
        }
        >:first-child {
          margin-top: 0;
        }
      }
      .last-nav{
        > * {
          margin-top: var(--tg-spacing-14);
        }
        >:first-child {
          margin-top: 0;
        }
      }
    }
    .limit-width {
      > span {
        margin-right: var(--tg-spacing-4);
      }
      > span:last-child {
        margin-right: 0;
      }
    }
  }
// }

.child-zh-CN.space-txt {
  letter-spacing: 4px;
}
</style>
