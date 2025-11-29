<script setup lang="ts">
import { AfunBasePopup } from '@tg/bccomponents'
import { useCasinoStore, useDownloadStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, h, ref } from 'vue'
import AppBanner from '~/components/AppBanner.vue'
import AppCasinoFooter from '~/components/AppCasinoFooter.vue'
import AppCasinoMultiLine from '~/components/AppCasinoMultiLine.vue'
import AppCasinoSearch from '~/components/AppCasinoSearch.vue'
import AppGameTypeTabs from '~/components/AppGameTypeTabs.vue'
import AppSearchInput from '~/components/AppSearchInput.vue'

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
    /** cid = 5 */
    if (item.cid === '5') {
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

    /** ty = 1类别 */
    else if (item.ty === 1 || item.ty === 5) {
      _c.push({
        cid: item.cid,
        platform_id: item.platform_id,
        name: item.label,
        icon: item.icon,
        value: item.value,
        ty: item.ty,
        component: defineAsyncComponent(
          () => import('~/pages/group/_components/category-detail.vue'),
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
          () => import('~/pages/group/_components/category-detail.vue'),
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
          () => import('~/pages/group/_components/category-detail.vue'),
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
      return application.loadImage(a.icon.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_active.webp`).replace('/images', '/images-af'))
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
</script>

<template>
  <div class="px-[12px]">
    <AppBanner type="casino" class="mt-[14px]" />
    <AppSearchInput :fake="true" @onclick="isOpenSearch = true" />
    <AppGameTypeTabs v-model:active="currentCasinoNav" :list="casinoNav" />
    <div v-show="showAll" class="mt-[12px]">
      <template v-for="item in casinoGameList">
        <AppCasinoMultiLine
          v-if="item && item.gameList && item.gameList.length"
          :key="item.name"
          :is-provider="item.cid === '5'"
          class="mb-[16px] last:mb-0" :detail="item"
        />
      </template>
    </div>
    <div v-show="currentObject">
      <KeepAlive>
        <component :is="currentObject?.component" :detail="currentObject" :type="2" />
      </KeepAlive>
    </div>
    <AfunBasePopup :model-value="isOpenSearch" :animation="false">
      <AppCasinoSearch :show="isOpenSearch" page="home-page" @close="closeSearch" />
    </AfunBasePopup>
  </div>
  <AppCasinoFooter v-show="showAll" class="mt-[23px] mb-[-12px] px-[12px]" />
</template>
