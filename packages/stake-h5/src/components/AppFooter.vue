<script lang="ts" setup>
import type { EnumLanguageKeys, EnumCurrencyKey } from '@tg/types'
import type { EnumSportsOddsType } from '~/stores/sports'
import { IconUniArrowDown, IconUniJumpPage } from '@tg/icons'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppFooter',
})
const { t } = useI18n()
const NOW = dayjs()
const router = useLocalRouter()
const { openService } = useService()
const { VITE_OFFICIAL_NAME, VITE_OFFICIAL_DOMAIN, VITE_SITE_NAME } = getEnv()
const {
  currentGlobalCurrency,
  companyData,
} = storeToRefs(useAppStore())
const languageStore = useLanguageStore()
const { userLanguage, validLangList } = storeToRefs(languageStore)
const sportStore = useSportsStore()
const { sportsOddsType, AllOddsTypes } = storeToRefs(sportStore)
const { isMobile } = storeToRefs(useWindowStore())

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

const targetCurrency = ref<EnumCurrencyKey>('USDT')

const { rate, runGetRateFromTo } = useExchangeRateFromTo(currentGlobalCurrency, targetCurrency)
runGetRateFromTo()

const menuData = computed(() => [
  {
    title: t('sports').toLowerCase(), // 葡语需要先转换成小写，然后css capitalize 才会起作用
    children: [
      { title: t('home_space_title'), path: '/sports/401' },
      { title: t('footer_menu_live'), path: `/sports/${SPORTS_PLAT_ID}/live` },
      { title: t('sports_rule'), icon: false, path: '/policies/spt-book' },
    ],
  },
  {
    title: t('casino').toLowerCase(),
    children: [
      { title: t('h5_footer_navigation_games'), path: '/casino' },
      { title: t('vip_club'), path: '/vip-club' },
      // { title: t('promo_activity'), path: '/promotions' },
    ],
  },
  {
    title: t('support'),
    children: [
      { title: t('fairness'), path: '/provably-fair/overview' },
      { title: t('footer_affiliate'), path: '/affiliate/invitation-link' },
      { title: t('responsible_casino'), path: '/responsible-gambling/safe' },
      // { title: t('gameble_aware'), icon: true },
      { title: t('h5_footer_navigation_live_support'), onClick: () => openService({ isFootBar: false, needDeal: true }) },
      // { title: t('help_center'), icon: true },
    ],
  },
  {
    title: t('about_us'),
    children: [
      { title: t('privacy_policy'), path: '/policies/privacy' },
      { title: t('footer_license') },
      { title: t('anti_money_laundering_rule'), path: '/policies/anti-money-laundering' },
      { title: t('footer_terms_of_service'), path: '/policies/terms' },
      // { title: 'Primedice', icon: true },
    ],
  },
])
const h5MenuData = computed(() => [
  {
    title: t('h5_pop_up_menu_game'), // 葡语需要先转换成小写，然后css capitalize 才会起作用
    list: [
      { title: t('casino'), path: '/casino', id: '11' },
      { title: t('sports'), path: `/sports/${getSportsPlatId()}`, id: '12' },
    ],
  },
  {
    title: t('promotions'),
    list: [
      { title: t('vip_club'), path: '/vip-club', id: '21' },
      { title: t('footer_affiliate'), path: '/affiliate/invitation-link', id: '22' },
      { title: t('promo_activity'), path: '/promotion', id: '23' },
    ],
  },
  {
    title: t('about_us'),
    list: [
      { title: t('privacy_policy'), path: '/policies/privacy', id: '31' },
      { title: t('footer_license'), id: '32' },
      { title: t('anti_money_laundering_rule'), path: '/policies/anti-money-laundering', id: '33' },
      { title: t('footer_terms_of_service'), path: '/policies/terms', id: '34' },
      { title: t('fairness'), path: '/provably-fair/overview', id: '35' },
      { title: t('h5_footer_navigation_live_support'), onClick: () => openService({ isFootBar: false, needDeal: true }), id: '36' },
    ],
  },

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
  <div class="app-footer" :style="{ gap: isMobile ? '12px' : '32px' }">
    <div v-if="isMobile" class="footer-nav-mobile">
      <BaseLogo :static="false" />
      <div class="copy-right theme-color mb-[16px] mt-[12px]">
        © {{ NOW.format('YYYY') }} {{ VITE_OFFICIAL_DOMAIN }} | {{ t('footer_under_logo_copyright') }}
      </div>
      <BaseDivider size="1" class="theme-border" />
      <div class="flex flex-col gap-[10px] py-[16px]">
        <BaseAccordion2
          v-for="item, index of h5MenuData"
          :key="index"
          :menu-info="item"
          @click-item="(item) => {
            if (item.onClick){
              item.onClick()
            }
            else if (item.path){
              router.push(item.path)
            }
          }"
        >
          <template #icon="slotProps">
            <IconUniArrowDown :has-transition="false" :class="`${slotProps.isShow ? 'rotate-0' : 'rotate-90'}  text-sm theme-icon` " />
          </template>
        </BaseAccordion2>

        <BaseSelect
          class="footer-select"
          :has-active-style="true"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-style-font-size:16px;--tg-base-select-disabled-opacity:1;"
          :model-value="userLanguage" popper plain-popper-label popper-clazz="low-z-index-pop"
          :options="validLangList.map(a => ({ ...a, label: a.title }))" @select="selectChange"
        />
        <BaseSelect
          class="footer-select"
          :has-active-style="true"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-style-font-size:16px;--tg-base-select-disabled-opacity:1;"
          :model-value="sportsOddsType" popper plain-popper-label popper-clazz="low-z-index-pop"
          :options="AllOddsTypes.map(a => ({ ...a, label: a.title }))" @select="selectOddsChange"
        />
      </div>
      <div class="theme-rate text-center">
        1 {{ currentGlobalCurrency }} = ${{ rate }}
      </div>
    </div>
    <div v-else class="footer-nav">
      <div v-for="item, index of menuData" :key="index" class="layout-spacing reset">
        <div class="nav-head">
          {{ item.title }}
        </div>
        <div v-for="tmp of item.children" :key="tmp.title" @click="pathTo(tmp)">
          {{ tmp.title }}
          <IconUniJumpPage v-if="tmp.icon" />
        </div>
      </div>
      <div class="layout-spacing reset last-nav">
        <div class="nav-head">
          {{ t('language_title') }}
        </div>
        <div class="select-wrap">
          <BaseSelect
            style="--tg-base-select-popper-label-hover-bg-color:transparent;"
            :model-value="userLanguage" popper plain-popper-label popper-clazz="low-z-index-pop"
            :options="validLangList.map(a => ({ ...a, label: a.title }))" @select="selectChange"
          />
        </div>
      </div>
      <div class="layout-spacing reset last-nav">
        <div>{{ t('sports_odds_title') }}</div>
        <div class="select-wrap">
          <BaseSelect
            style="--tg-base-select-popper-label-hover-bg-color:transparent;"
            :model-value="sportsOddsType" popper plain-popper-label popper-clazz="low-z-index-pop"
            :options="AllOddsTypes.map(a => ({ ...a, label: a.title }))" @select="selectOddsChange"
          />
        </div>
      </div>
    </div>

    <BaseDivider size="1" />
    <div :class="isMobile ? 'h5-support-box' : 'pc-footer-support'">
      <div class="text-tg-text-white support-text mb-[20px] text-[16px] font-[600]">
        {{ $t('supported_currency') }}
      </div>
      <div v-if="isMobile" class="h5-footer-support">
        <BaseImage
          style="margin: 0 auto;" width="34px" :url="`/png/icon/${url}.png`"
          v-for="url, index of supportCurrency" :key="index"
        />
      </div>
      <template v-else>
        <div class="support-row">
          <BaseImage
            v-for="url, index of supportCurrency.slice(0, 14) " :key="index" width="34px"
            :url="`/png/icon/${url}.png`"
          />
        </div>
        <div class="support-row mt-[20px]">
          <div style="grid-column: 1 / 4" />
          <BaseImage
            v-for="url, index of supportCurrency.slice(-7) " :key="index" width="34px"
            :url="`/png/icon/${url}.png`"
          />
          <BaseImage
            style="margin: 0 auto;" width="34px" url="/png/icon/18plus.png"
          />
        </div>
      </template>
    </div>

    <template v-if="!isMobile">
      <BaseDivider size="1" />
      <div class="footer-copyright">
        <BaseLogo :static="false" />
        <div class="copy-right">
          © {{ NOW.format('YYYY') }} {{ VITE_OFFICIAL_DOMAIN }} | {{ t('footer_under_logo_copyright') }}
        </div>
        <div>
          1 {{ currentGlobalCurrency }} = ${{ rate }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.theme-icon{
  @include webTheme('green'){
    --tg-icon-color: #5ECEA6;
  }
}
.theme-border{
  @include webTheme('green'){
    --tg-base-divider-bg-color: rgba(25, 123, 89, 0.20);
  }
}
.theme-color{
  @include webTheme('green'){
    color: #3CB389;
  }
}
.copy-right{
  @include webTheme('white'){
    color: #C1C1C1;
  }
}
.theme-rate{
  @include webTheme('white'){
    color: #C1C1C1;
  }
}
.logos-center {
  // gap: var(--tg-spacing-36);
}
.select-wrap {
  --tg-base-select-popper-style-padding-x: 0;
  --tg-base-select-popper-style-padding-y: 0;
  @include webTheme('green'){
    --tg-base-select-popper-label-color: #76F0C5;
    // --tg-text-lightgrey:red !important;
  }
}
.app-footer {
  --tg-base-divider-bg-color: var(--tg-secondary-grey);
  /* background-color: #0F212E; */
  width: 100%;
  display: grid;
  padding: 32px 0;
  .footer-select{
    --tg-base-select-popper-bg-color:var(--tg-primary-main);
    --tg-base-select-hover-bg-color:var(--tg-secondary-grey);
    --tg-base-select-pop-plain-bg-color:var(--tg-secondary-grey);
    --tg-base-select-popper-label-hover-bg-color: var(--tg-base-select-pop-plain-bg-color);
    @include webTheme('greenblack') {
      --tg-base-select-popper-bg-color:var(--tg-primary-main);
      --tg-base-select-hover-bg-color:var(--tg-secondary-dark);
      --tg-base-select-pop-plain-bg-color:var(--tg-secondary-dark);
    }
    @include webTheme('green') {
      --tg-popper-hover-color-default: #076237;
      --tg-base-select-pop-plain-bg-color: #076237;
    }
    @include webTheme('white'){
      --tg-popper-hover-color-default: #ffffff;
      --tg-base-select-pop-plain-bg-color: #ffffff;
      border: 1px solid #C1C1C1;
      border-radius: 4px;
    }
  }
  .footer-nav{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(16ch,1fr));
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
      @include webTheme('green'){
          color: #76F0C5;
      }
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
      @include webTheme('white'){
          color: #111111;
      }
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
    grid-gap: 44px;
    grid-template-columns: repeat(3,1fr);
    justify-items: center;
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
  .app-footer {
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
  .footer-nav-mobile{
    margin-top: -16px;
    color: var(--tg-text-lightgrey);
    font-size: 12px;
    font-weight: var(--tg-font-weight-normal);
    @include webTheme('green'){
      --tg-icon-color: #ffffff;
    }
  }
// }
</style>
