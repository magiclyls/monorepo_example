<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import AppMiniGameBaseHotkey from './AppMiniGameBaseHotkey.vue'
import AppMiniGamePartHotKeysWrap from './AppMiniGamePartHotKeysWrap.vue'

defineOptions({
  name: 'AppMiniGamePartDiceHotKeys',
})
const { t } = useI18n()

const hotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('切换获胜条件'), hotKey: 'q' },
  { label: t('降低目标'), hotKey: 'w' },
  { label: t('提高目标'), hotKey: 'e' },
]
</script>

<template>
  <AppMiniGamePartHotKeysWrap>
    <div class="flex-col-16 flex flex-col">
      <AppMiniGameBaseHotkey v-for="k in hotKeys" :key="k.hotKey" :label="k.label" :hot-key="k.hotKey" />
    </div>
  </AppMiniGamePartHotKeysWrap>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
