<script lang="ts" setup>
defineOptions({
  name: 'AppPromoVipContent',
})

const emits = defineEmits(['rebateClick', 'hideReceive'])

const { bool: isListMounted, setBool: setListMountedBool } = useBoolean(false)

const hideReceiveBool = ref(false)
const curTab = ref('0')

provide('isInPromoVip', true)
provide('isInPromoRebate', false)

function rebateClick() {
  emits('rebateClick')
}

function hideReceive(bool: boolean, tab: string) {
  hideReceiveBool.value = bool
  curTab.value = tab
  emits('hideReceive', bool, tab)
}

onMounted(() => {
  setTimeout(() => {
    setListMountedBool(true)
  }, 600)
})
</script>

<template>
  <AppLoading v-if="!isListMounted" full-screen />
  <div v-show="isListMounted" class="pb-[16px]">
    <div class="my-[16px]">
      <!-- <AppVipInfoBar :hide-receive="hideReceiveBool" :cur-tab="curTab" /> -->
      <AppVipInfoBar2 :hide-receive="hideReceiveBool" :cur-tab="curTab" />
    </div>
    <AppVipContent :is-show-rebate="false" @rebate-click="rebateClick" @hide-receive="hideReceive" />
  </div>
</template>

<style lang="scss" scoped>
</style>
