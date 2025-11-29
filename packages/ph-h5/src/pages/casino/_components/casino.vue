<script setup lang="ts">
import { PhBasePopup } from '@tg/bccomponents'
import { IconSearch } from '@tg/icons'
import { useCasinoStore, useDownloadStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppBanner from '~/components/AppBanner.vue'
import AppCasinoFooter from '~/components/AppCasinoFooter.vue'
import AppCasinoMultiLine from '~/components/AppCasinoMultiLine.vue'
import AppGameTypeTabs from '~/components/AppGameTypeTabs.vue'
import AppMarquee from '~/components/AppMarquee.vue'
import Search from './search.vue'

defineOptions({ name: 'AppCasino' })

interface ComponentItem {
  cid: string
  platform_id: string
  name: string
  icon: string
  component: any
  value?: string
  ty?: string | number
}

const { isShowPwaHasC } = storeToRefs(useDownloadStore())
const { casinoNav, casinoGameList, currentCasinoNav } = storeToRefs(useCasinoStore())
const { t } = useI18n()

const isOpenSearch = ref(false)
const forceIsOpenSearch = ref(true)
const showAll = computed(() => currentCasinoNav.value === '-1&all')
const componentList = computed(() => {
  const _c: ComponentItem[] = []
  const _list = casinoNav.value
    ? casinoNav.value
    : [{
        ty: -1,
        cid: '',
        name: '',
        icon: '',
        value: '-1',
        platform_id: '',
        label: '',
      }]
  _list.forEach((item) => {
    /** ty = 1类别 */
    if (item.ty === 1 || item.ty === 5) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppGameSingleTypeDetails.vue'),
        ),
      })
    }

    else if (item.ty === 2) {
      /**  ty = 2场馆 */
      _c.push({
        cid: item.platform_id,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppGameSingleTypeDetails.vue'),
        ),
      })
    }
    else if (item.ty === -1) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        component: h('div'),
      })
    }
    else {
      _c.push({
        cid: item.platform_id,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/components/AppGameSingleTypeDetails.vue'),
        ),
      })
    }
  })

  return _c
})

const currentObject = computed<ComponentItem>(() => {
  const _0 = componentList.value.find((item: any) => item.value === currentCasinoNav.value)
  return _0 as ComponentItem
})

// 统一加载tab中的网络icon
function loadIcon() {
  // active icon 不需要等待
  if (casinoNav.value && casinoNav.value.length > 0) {
    casinoNav.value.map((a) => {
      return application.loadImage(a.icon.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_active.webp`))
    })
  }
  // return new Promise((resolve) => {
  //   let a = 0
  //   const t = setInterval(() => {
  //     a++
  //     if (casinoNav.value && casinoNav.value.length > 0) {
  //       clearInterval(t)
  //       const arr = casinoNav.value.map((a) => {
  //         return application.loadImage(a.icon)
  //       })
  //       Promise.allSettled(arr).then((result) => {
  //         resolve(result)
  //       })
  //     }
  //     else if (a > 300 || !casinoNav.value) {
  //       clearInterval(t)
  //       resolve(true)
  //     }
  //   }, 50)
  // })
}

function closeSearch(force: boolean) {
  if (force) {
    forceIsOpenSearch.value = false
    setTimeout(() => {
      forceIsOpenSearch.value = true
    }, 500)
  }
  isOpenSearch.value = false
}

loadIcon()
</script>

<template>
  <div class="px-[10rem]">
    <AppGameTypeTabs v-model:active="currentCasinoNav" :list="casinoNav" />
    <div class="relative flex h-[32rem] cursor-pointer bg-[#fff] rounded-[100px]" @click="isOpenSearch = true">
      <div class="h-full w-full flex items-center text-[#BEC7DC] flex-1 border-none pl-[40rem]">
        {{ t('搜索游戏名称') }}
      </div>
      <div class="absolute left-[10rem] top-[2rem]">
        <IconSearch class="text-[26rem] text-[#BEC7DC]" />
      </div>
    </div>
    <AppBanner type="casino" class="mt-[10rem]" />
    <AppMarquee v-show="showAll" class="mt-[8rem]" />
    <div v-show="showAll" class="mt-[12rem]">
      <template v-for="item in casinoGameList">
        <!-- 游戏提供商 -->
        <div v-if="item.cid === '5'" :key="item.cid" />
        <AppCasinoMultiLine
          v-else-if="item"
          :key="item.name"
          class="mb-[16rem] last:mb-0" :detail="item"
        />
      </template>
    </div>
    <div v-show="currentObject">
      <KeepAlive>
        <component :is="currentObject?.component" :detail="currentObject" />
      </KeepAlive>
    </div>
    <AppCasinoFooter v-show="showAll" class="mt-[23rem]" />
    <PhBasePopup v-if="forceIsOpenSearch" v-model="isOpenSearch">
      <Search @close="closeSearch" />
    </PhBasePopup>
  </div>
</template>
