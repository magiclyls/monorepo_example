<script lang="ts" setup>
import type { TTheme } from '@tg/types'

interface IThemeList {
  name: string
  theme: TTheme
}

defineOptions({
  name: 'AppChangeTheme',
})

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const themeList = ref<IThemeList[]>([
  {
    name: 'Default',
    theme: '',
  },
  {
    name: 'green',
    theme: 'green',
  },
  {
    name: 'Bcgame',
    theme: 'bcgame',
  },
  {
    name: 'White',
    theme: 'white',
  },
  {
    name: '青黑',
    theme: 'greenblack',
  },
  {
    name: '新stake',
    theme: 'new-default',
  },
])

function changeSite(theme: TTheme) {
  appStore.changeTheme(theme)
}
</script>

<template>
  <div class="bg-tg-primary flex flex-col gap-[5px] rounded-[5px] p-[6px]">
    <BaseButton v-for="item in themeList" :key="item.theme" @click="changeSite(item.theme)">
      <span
        :class="{
          'text-indigo-300': theme === item.theme,
        }"
      >{{ item.name }}</span>
    </BaseButton>
  </div>
</template>
