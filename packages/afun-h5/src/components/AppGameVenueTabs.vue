<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { useCasinoStore } from '@tg/stores'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  list: Array<Record<string, any>> | undefined
  active: string
  showHot?: boolean
  type?: number
}

const props = withDefaults(defineProps<Props>(), {
  showHot: false,
  type: 1,
})

const emit = defineEmits(['update:active', 'change'])
const { t } = useI18n()
const CasinoStore = useCasinoStore()

// pp  102 303
// db   103 205 314 503
// pa    "104"  "208" "312"  "316" (unknow)
// ky  "207"  "501"
// fg  "202"  "313"  "504"
// bg "105"  "203"
// tp  "110" "214"  "323"
// leg  "209"   '505'
// mt  "204"  "318"  "502"
// fc  '"213"'  "322"
// ty   "210" "320"  "506"
// cq9   '"206"'  "315"
// jdb  '"201"'  '"308"'
// tada  "211"  "302"  "507"  "701"
// jili  "212"  "321"  "508"  "702"
const video: Array<string> = ['102', '103', '104', '105', '110']
const fishing: Array<string> = ['205', '208', '207', '202', '203', '214', '209', '204', '213', '210', '206', '201', '211', '212']
const slot: Array<string> = ['303', '314', '312', '313', '323', '318', '322', '320', '315', '308', '302', '321']
const chess: Array<string> = ['503', '316', '501', '504', '505', '502', '506', '507', '508']
const lottery: Array<string> = ['701', '702']

const gamelist = computed(() => {
  const arr = props.list?.map((item) => {
    // const logo = CasinoStore.venueList.find((venue: any) => item.venue_id === venue.venue_id)?.nav
    let logo = ''

    logo = item.icon?.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_dbox.webp`)
    let logoText = ''
    const handled = false
    let isHotOrNew = false
    let platform_id = item.platform_id

    if (platform_id === 'hot') {
      logoText = 'Hot'
      platform_id = 'hot'
      logo = 'ph-h5/png/hot.png'
      isHotOrNew = true
    }
    else if (platform_id === 'new') {
      logoText = 'New'
      platform_id = 'new'
      logo = 'ph-h5/png/new.png'
      isHotOrNew = true
    }
    // else if (video.includes(item.platform_id)) {
    //   logoText = t('视讯')
    //   handled = true
    // }
    // else if (fishing.includes(item.platform_id)) {
    //   logoText = t('捕鱼')
    //   handled = true
    // }
    // else if (slot.includes(item.platform_id)) {
    //   logoText = t('电子')
    //   handled = true
    // }
    // else if (chess.includes(item.platform_id)) {
    //   logoText = t('棋牌')
    //   handled = true
    // }
    // else if (lottery.includes(item.platform_id)) {
    //   logoText = t('彩票')
    //   handled = true
    // }
    return { ...item, logo, logoText, handled, isHotOrNew, platform_id } as any
  })

  return arr
})

function change($event: MouseEvent, item: any) {
  scrollIntoView($event.target)
  emit('change', item.platform_id)
  emit('update:active', item.platform_id)
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}
</script>

<template>
  <div class="flex items-center hide-scroll overflow-scroll">
    <div v-for="item in gamelist" :key="item.platform_id" class="venue-item" :class="{ active: item.platform_id === active }" @click="change($event, item)">
      <div v-if="item.isHotOrNew" class="center">
        <AfunBaseImage :url="item.logo" class="w-[20px] h-[20px]" />
        <span class="ml-[2px] font-[600]">{{ item.logoText }}</span>
      </div>
      <div v-else-if="item.handled" class="center">
        <AfunBaseImage :url="item.logo" class="h-[26px]" width="auto" is-cloud />
        <span
          class="ml-[2px] text-[12px] font-[600]"
          :style="{ marginTop: item.platform_id === '102' || item.platform_id === '303' ? '5px' : '0' }"
        >
          {{ item.logoText }}
        </span>
      </div>
      <AfunBaseImage v-else :url="item.logo" is-cloud class="h-[20px]" width="auto" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.venue-item {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  color: #fff;
  &.active {
    background: #2f4553;
  }
}
</style>
