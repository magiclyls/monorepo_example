<script lang="ts" setup>
import { BaseButton, BaseIcon, BaseImage, BaseSelect, BaseSwitch } from '@tg/bccomponents'
import { ref } from 'vue'

const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '1', value: 4 },
  { label: '2', value: 5 },
  { label: '3', value: 6 },
  { label: '1', value: 7 },
  { label: '2', value: 8 },
  { label: '3', value: 9 },
  { label: '1', value: 10 },
  { label: '2', value: 11 },
  { label: '3', value: 12 },
]
const v = ref(1)
const s = ref(true)
</script>

<template>
  <div class="mine">
    <div class="mb-4">
      ddsd
    </div>
    <BaseSelect v-model="v" :options="options" placement="bottom-start">
      <BaseButton>type1</BaseButton>
      <template #select-item="{ item, selectedOption }">
        <div
          :class="{
            'bg-layer4': item.value === selectedOption?.value,
          }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
        >
          <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
          <div class="ml-2">
            <div class="flex items-center text-base font-extrabold">
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
    </BaseSelect>
    <div class="my-5" />
    <BaseSelect v-model="v" :options="options" placement="bottom-start">
      <template #default="{ selectedOption }">
        <BaseButton>{{ selectedOption?.label }}</BaseButton>
      </template>
      <template #search-right>
        <BaseButton style="margin-left: 16px;">
          <BaseIcon name="menu" />
        </BaseButton>
      </template>
      <template #select-item="{ item, selectedOption }">
        <div
          :class="{
            'bg-layer4': item.value === selectedOption?.value,
          }" class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
        >
          <BaseImage class="rounded-sm h-6 w-6" url="https://bcgame.im/coin/BCD.black.png" />
          <div class="ml-2">
            <div class="flex items-center text-base font-extrabold">
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex  items-center justify-between border-safe-bottom p-4 sticky bottom-0 bg-layer3 ">
          <div class="flex cursor-pointer items-center text-secondary">
            <BaseIcon name="affiliate" /> 以貨幣顯示
          </div>
          <div class="flex items-center text-secondary">
            <BaseSwitch v-model="s" />
            <span class="ml-2">隱藏小尺寸</span>
          </div>
        </div>
      </template>
    </BaseSelect>
  </div>
</template>

<style>

</style>
