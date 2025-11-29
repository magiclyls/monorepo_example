<script lang="ts" setup>
import { BaseButton, BaseImage, BaseSelect } from '@tg/bccomponents'
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
        <BaseButton>1</BaseButton>
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
        <div class="flex flex-none items-center justify-between border-safe-bottom p-4 sticky -bottom-4 z-20 -mx-4 -mb-4 mt-auto bg-layer3 sm:bottom-0">
          <div class="flex cursor-pointer items-center text-secondary">
            <svg class="icon flex-none mr-1 w-[1.25rem] h-[1.25rem]" viewBox="0 0 32 32"><path d="M20.2575 5.33398C21.4308 5.33398 22.5141 5.96004 23.1003 6.97564L27.3602 14.3603C27.9455 15.375 27.9455 16.6252 27.3602 17.6408L23.1003 25.0255C22.5141 26.0411 21.4308 26.6671 20.2575 26.6671H11.7413C10.5681 26.6671 9.48476 26.0411 8.89859 25.0255L4.63864 17.6408C4.0534 16.6261 4.0534 15.3759 4.63864 14.3603L8.89859 6.97564C9.48476 5.96004 10.5681 5.33398 11.7413 5.33398H20.2575ZM15.9994 11.4916C13.4507 11.4916 11.3843 13.5589 11.3843 16.1105C11.3843 18.662 13.4507 20.7294 15.9994 20.7294C18.5482 20.7294 20.6146 18.662 20.6146 16.1105C20.6146 13.5589 18.5482 11.4916 15.9994 11.4916Z" /></svg> 以貨幣顯示
          </div><div class="flex items-center text-secondary">
            <div class="switch switch-xs mr-1">
              <div />
            </div><span class="ml-2">隱藏小尺寸</span>
          </div>
        </div>
      </template>
    </BaseSelect>
  </div>
</template>

<style>

</style>
