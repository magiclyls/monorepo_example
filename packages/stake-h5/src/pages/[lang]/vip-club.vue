<script lang="ts" setup>
import { getEnv } from '@tg/utils';

interface ITableData {
  text?: string
  empty?: boolean
  sticky?: boolean
  child?: {
    icon?: string
    text?: string
  }[]
}
interface IMenuData {
  title: string
  label: string
  value: string
}

const { VITE_OFFICIAL_NAME } = getEnv()
const { t } = useI18n()
const appStore = useAppStore()
const { vipConfigData, isHaveVIPRebateConfig, isVipOpen } = storeToRefs(appStore)
appStore.runGetVipConfig()
appStore.runGetMemberVipBonusRecord()
const {
  appContentWidth,
  widthBoundarySm,
} = storeToRefs(useWindowStore())
const router = useLocalRouter()
usePageTitle({ prefix: t('vip_club') })

const site = computed(() => ({ site: VITE_OFFICIAL_NAME }))
const vipArray = computed(() =>
  vipConfigData.value ? Object.values(vipConfigData.value.vips).sort((a, b) => +a.level - (+b.level)) : [],
)

const tableData: ITableData[] = [
  {
    text: t('vip_level_comp'),
    sticky: true,
  },
  {
    child: [
      {
        icon: 'chat-star-bronze',
        text: t('copper'),
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
        text: t('silver'),
      },
      {
        icon: 'chat-star-gold',
        text: t('gold'),
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
        text: `${t('platinum')} I – III`,
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
        text: `${t('platinum')} IV – VI`,
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
        text: t('diamond'),
      },
    ],
  },
  {
    text: t('bet_amount_label'),
    sticky: true,
  },
  {
    text: '1 万美元',
  },
  {
    text: '5 万 – 10 万美元',
  },
  {
    text: '25 万 – 100 万美元',
  },
  {
    text: '250 万 – 1,000 万美元',
  },
  {
    text: '2,500 万美元',
  },
  {
    text: t('monthly_bonus'),
    sticky: true,
  },
  {
    child: [
      {
        icon: 'chat-star-bronze',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
      },
      {
        icon: 'chat-star-gold',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('upgrade_bonus'),
    sticky: true,
  },
  {
    child: [
      {
        icon: 'chat-star-bronze',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
      },
      {
        icon: 'chat-star-gold',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('vip_water_back'),
    sticky: true,
  },
  {
    child: [
      {
        icon: 'chat-star-bronze',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
      },
      {
        icon: 'chat-star-gold',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('weekly_bonus'),
    sticky: true,
  },
  {
    child: [
      {
        icon: 'chat-star-bronze',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
      },
      {
        icon: 'chat-star-gold',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('day_deposit_bonus'),
    sticky: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('bonus_up'),
    sticky: true,
  },
  {
    empty: true,
  },
  {
    child: [
      {
        icon: 'chat-star-silver',
      },
      {
        icon: 'chat-star-gold',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-1',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: t('dedicated_vip_servicer'),
    sticky: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    child: [
      {
        icon: 'chat-star-4',
      },
    ],
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
  {
    text: `Bespoke ${t('finance_other_tab_bonus')}`,
    sticky: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    empty: true,
  },
  {
    child: [
      {
        icon: 'chat-star-diamond',
      },
    ],
  },
]

const vipCols = computed<Array<{
  title: string
  key: string
}>>(() => [
  {
    title: t('vip_level_comp'),
    key: 'level',
  },
  {
    title: t('bet_amount_label'),
    key: 'score',
  },
  {
    title: t('monthly_bonus'),
    key: 'monthly_gift',
  },
  {
    title: t('upgrade_bonus'),
    key: 'up_gift',
  },
  {
    title: t('weekly_bonus'),
    key: 'weekly_gift',
  },
  {
    title: `${t('day_bonus')}<br/>${t('deposit_bonus')}`,
    key: 'daily_gift',
  },
  {
    title: t('bonus_up'),
    key: 'member_count',
  },
  {
    title: t('dedicated_vip_servicer'),
    key: 'member_count',
  },
  {
    title: 'BESPOKE',
    key: 'member_count',
  },
])

const menuValue = ref('1')
const menuData: IMenuData[] = [
  {
    title: t('menu_title_settings_general'),
    label: t('menu_title_settings_general'),
    value: '1',
  },
  {
    title: t('promo'),
    label: t('promo'),
    value: '2',
  },
  {
    title: t('dedicated_vip_servicer'),
    label: t('dedicated_vip_servicer'),
    value: '3',
  },
]
const award = ref<HTMLElement | null>(null)

const isSm = computed(() => appContentWidth.value < widthBoundarySm.value)

const toVip = function () {
  award.value?.scrollIntoView({ behavior: 'smooth' })
}

if (!isVipOpen.value)
  router.push('/')
</script>

<template>
  <div class="tg-vip-club vip-plan-wrap">
    <div class="vip-banner">
      <div class="banner-wrap" :class="{ 'banner-is-sm': isSm }">
        <div class="banner-left">
          <p class="left-title">
            {{ t('vip_club_tip_1', { site: VITE_OFFICIAL_NAME }) }}
          </p>
          <p class="left-desc">
            {{ t('vip_club_tip_2') }}
          </p>
          <div class="left-btns">
            <BaseButton
              bg-style="secondary"
              size="md"
              @click="router.push('/casino')"
            >
              <span>{{ t('start_game') }}</span>
            </BaseButton>
            <BaseButton class="theme-red-btn" bg-style="red" size="md" @click.prevent="toVip">
              <a href="#" class="theme-text">{{ t('look_vip_level') }}</a>
            </BaseButton>
          </div>
        </div>
        <div class="banner-right">
          <BaseImage v-if="!isSm" url="/png/vip-club/vip_club_header.png" />
          <BaseImage
            v-else
            url="/png/vip-club/vip_club_header_mobile.png"
            width="80px"
            class="base-image"
          />
        </div>
      </div>
    </div>
    <div class="vip-content">
      <!-- 入门 -->
      <div class="vip-tutorial mb-[32px]">
        <p class="title">
          {{ t('beginner_handbook') }}
        </p>
        <p class="desc">
          {{ t('vip_club_tip_3') }}
        </p>
        <div class="t-steps" :class="{ 'steps-is-sm': isSm }">
          <div class="step-item">
            <div class="img-wrap">
              <BaseImage with-theme url="/png/vip-club/step1.png" />
            </div>
            <p>
              {{ t('checklist_card_first_step') }}
            </p>
            <p>
              {{ t('vip_club_tip_4') }}
            </p>
          </div>
          <div class="step-item">
            <div class="img-wrap">
              <BaseImage with-theme url="/png/vip-club/step2.png" />
            </div>
            <p>
              {{ t('step_num', { num: t('two') }) }}
            </p>
            <p>
              {{ t('vip_club_tip_5') }}
            </p>
          </div>
          <div class="step-item">
            <div class="img-wrap">
              <BaseImage with-theme url="/png/vip-club/step3.png" />
            </div>
            <p>
              {{ t('step_num', { num: t('three') }) }}
            </p>
            <p>
              {{ t('vip_club_tip_6') }}
            </p>
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div class="vip-slider mb-[32px]">
        <p class="title">
          {{ t('experience') }}
        </p>
        <p class="desc">
          {{ t('vip_club_tip_7', site) }}
        </p>
        <AppBannerUnlimited class="vip-slider-wrap" />
      </div>
      <!-- 奖励 -->
      <div ref="award" class="vip-award mb-[32px]">
        <p class="title">
          {{ t('bonus_label') }}
        </p>
        <p class="desc">
          {{ t('vip_club_tip_8') }}
        </p>
      </div>
      <AppVipContent :is-show-rebate="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-red-btn{
  @include webTheme('white'){
    --tg-base-button-red-white-bg-color:#C1C1C1;
  }
}
.theme-text{
  @include webTheme('green'){
    color: #fff;
  }
}
.tg-vip-club {
  width: 100%;
  .vip-banner{
    padding: var(--tg-spacing-56) 0;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1000px;
      right: -1000px;
      background-color: var(--tg-secondary-dark);
    }
    .banner-wrap{
      width: 100%;
      max-width: 1200px;
      display: grid;
      grid-template-areas: "headerText headerImage";
      grid-template-columns: 1fr 400px;
      gap: 1.5rem;
      position: relative;
      .banner-left{
        display: flex;
        flex-direction: column;
        // gap: .75rem;
        grid-area: headerText;
        .left-title{
          color: var(--tg-text-white);
          font-size: var(--tg-font-size-3xl);
          font-weight: var(--tg-font-weight-bold);
          line-height: 42px;
          margin-bottom: .75rem;
        }
        .left-desc{
          color: var(--tg-text-lightgrey);
          font-size: var(--tg-font-size-base);
          line-height: 24px;
          margin-bottom: .75rem;
        }
        .left-btns{
          margin-top: var(--tg-spacing-12);
          font-size: var(--tg-font-size-default);
          display: flex;
          // gap: .5rem;
          flex-wrap: wrap;
          >:first-child {
            margin-right: .5rem;
          }
        }
      }
      .banner-right{
        grid-area: headerImage;
        .base-image{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      &.banner-is-sm{
        grid-template-areas:
        "headerImage"
        "headerText";
        grid-template-columns: 1fr;
        .left-title{
          text-align: center;
        }
      }
    }
  }
  .vip-content{
    padding: var(--tg-spacing-32) 0;
    display: flex;
    flex-direction: column;
    // gap: var(--tg-spacing-32);
    width: 100%;
    .vip-tutorial, .vip-award, .vip-question, .vip-slider{
      .title{
        text-align: center;
        color: var(--tg-text-white);
        font-size: var(--tg-font-size-lg);
        font-weight: var(--tg-font-weight-bold);
        line-height: 24px;
        // margin-top: var(--tg-spacing-16);
      }
      .desc{
        text-align: center;
        color: var(--tg-text-lightgrey);
        font-size: var(--tg-font-size-base);
        margin-top: var(--tg-spacing-8);
        line-height: 22px;
      }
      .t-steps{
        display: grid;
        grid-auto-flow: column;
        gap: 3.5rem;
        width: 100%;
        .step-item{
          p:nth-child(2){
            font-size: var(--tg-font-size-md);
            color: var(--tg-text-white);
            font-weight: var(--tg-font-weight-semibold);
            line-height: 24px;
          }
          p:nth-child(3){
            font-size: var(--tg-font-size-base);
            color: var(--tg-text-lightgrey);
            margin-top: var(--tg-spacing-8);
            line-height: 24px;
          }
          .img-wrap{
            margin: var(--tg-spacing-42) 0 var(--tg-spacing-26);
            box-shadow: var(--tg-box-shadow);
          }
        }
        &.steps-is-sm{
          grid-auto-flow: row;
          gap: 24px;
          margin-top: 24px;
          .img-wrap{
            margin: 0 0 var(--tg-spacing-24);
          }
        }
      }
    }
    .vip-award{
      .a-table{
        color: var(--tg-text-white);
        font-weight: var(--tg-font-weight-bold);
        font-size: var(--tg-font-size-base);
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        justify-content: center;
        align-items: center;
        grid-gap: .125rem;
        margin-top: var(--tg-spacing-42);
        min-width: 43rem;
        width: fit-content;
        .table-item{
          width: 100%;
          height: 100%;
          min-height: 6rem;
          min-width: 7rem;
          background-color: var(--tg-secondary-dark);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: .5rem;
          padding: var(--tg-spacing-16);
          line-height: 24px;
          text-align: center;
          &:has(span){
            flex-direction: column;
            gap: 0;
          }
          svg{
            width: 24px;
            height: 24px;
          }
          > div {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: .5rem;
          }
          .empty {
            width: 20px;
            height: 4px;
            background-color: var(--tg-secondary-grey);
          }
        }
      }
    }
    .question-wrap{
      display: grid;
      grid-auto-flow: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 1.5rem;
      margin-top: var(--tg-spacing-42);
      &.question-is-sm{
        grid-auto-flow: row;
        justify-content: stretch;
        align-items: center;
        gap: .5rem;
        .q-menu {
          overflow-x: scroll;
        }
      }
      .q-content {
        padding: var(--tg-spacing-24);
        background-color: var(--tg-secondary-dark);
        border-radius: var(--tg-radius-md);
        display: flex;
        flex-direction: column;
        gap: .5rem;
        --tg-base-collapse-header-height: fit-content;
        .content-wrap{
          color: var(--tg-text-lightgrey);
          display: flex;
          flex-direction: column;
          gap: .25rem;
          font-size: var(--tg-font-size-default);
          padding: var(--tg-spacing-16) var(--tg-spacing-20);
          p{
            line-height: 21px;
          }
        }
      }
    }
    .vip-more{
      display: grid;
      grid-template-columns: 3fr 1fr 3fr;
      min-height: 50px;
      margin-bottom: var(--tg-spacing-32);
      .more-left,.more-right{
        display: flex;
        flex-direction: column;
        gap: .75rem;
        p:nth-child(1){
          color: var(--tg-text-white);
          font-size: var(--tg-font-size-lg);
          line-height: 1.32;
        }
        p:nth-child(2){
          color: var(--tg-text-lightgrey);
          line-height: 1.32;
          font-size: var(--tg-font-size-default);
        }
        div:nth-child(3){
          margin-top: var(--tg-spacing-18);
        }
      }
      .more-mid{
        display: flex;
        justify-content: center;
        align-items: center;
        div{
          width: 2px;
          height: 80%;
          background: var(--tg-secondary-grey);
        }
      }
    }
    .vip-slider{
      .vip-slider-wrap{
        margin-top: var(--tg-spacing-20);
      }
    }
  }
}
.sticky{
  position: sticky;
  left: 0;
}
.vip-plan-wrap{
  @include webTheme('green'){
    --tg-base-button-style-bg:var(--tg-secondary-deepdark);
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
