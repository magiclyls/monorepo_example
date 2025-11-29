<script setup lang="ts">
import { IconHeaderBack } from '@tg/icons'

const appStore = useAppStore()
const { isLogin, gameIsStart } = storeToRefs(appStore)
const route = useRoute()
const { back, replace } = useLocalRouter()

const windowStore = useWindowStore()
const { isInterestTreasure } = storeToRefs(windowStore)
const { t } = useI18n()
const { globalPageTitle } = useGlobalStatePageTitle()

const handledTitle = computed(() => {
  if (isInterestTreasure.value)
    return t('safe')
  else
    return globalPageTitle.value
})

function backIfLocal() {
  const backurl = Local.get(STORAGE_BACK_URL)?.value as any
  back()
  if (backurl)
    replace(backurl)
}

watch(() => route.fullPath, (a) => {
  // 从小游戏切走的时候
  if (!a.includes('/casino/original-game'))
    gameIsStart.value = false
})
</script>

<template>
  <div class="h-[60px] flex justify-between text-[18px] font-semibold">
    <div class="flex items-center">
      <BaseButton
        type="text" size="none" style="padding: 14px 30px 14px 0;"
        @click="backIfLocal"
      >
        <IconHeaderBack
          style="font-size: 18px"
          class="arrow-left"
        />
      </BaseButton>
    </div>
    <div v-if="gameIsStart && isLogin" class="flex flex-1 items-center justify-end">
      <AppWalletH5 />
    </div>
    <template v-else>
      <template v-if="isLogin">
        <div class="w-[0px] flex flex-1 items-center justify-center">
          <div
            class="overflow-ellipsis overflow-hidden whitespace-nowrap"
          >
            {{ handledTitle }}
          </div>
        </div>
        <div class="w-[40px]" />
      </template>
      <AppLoginRegisterBtnsH5 v-else />
    </template>
  </div>
</template>

<style scoped lang="scss">
.arrow-left{
  color: var(--tg-text-white);
  @include webTheme('green') {
    color: #5ECEA6;
  }
}
</style>
