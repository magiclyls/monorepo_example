<script lang="ts" setup>
import { BaseAspectRatio, BaseButton, BaseEmpty, BaseImage, BaseProgress, BaseSelect, BaseSwipe, BaseVirtualText } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { BaseRouterLink } from '@tg/shared-router'
import { ref } from 'vue'

const { bool } = useBoolean(false)

const tabs = ref([
  { label: 'label1', value: '1' },
  { label: 'label2', value: '2' },
  { label: 'label3', value: '3' },
])

const options = ref([
  { label: 'label1', value: '1' },
  { label: 'label2', value: '2' },
  { label: 'label3', value: '3' },
])
const selectValue = ref('1')
const tabCurrent = ref(0)

const dissss = ref(false)
</script>

<template>
  <div>
    <div class="mt-4">
      <!-- banner -->
      <BaseAspectRatio ratio="4.6/1">
        <div class="w-full h-full relative bg-cover bg-repeat-x rounded-xl bg-layer4" style="background-image: linear-gradient(to right, rgb(46, 112, 81), transparent 40%), url('/img/pc/casino/banner-bg.svg');">
          <div class="absolute left-[1.5%] top-0 h-[96%]">
            <BaseImage url="/img/pc/casino/banner-logo.png" class="h-full" />
          </div>
          <div class="absolute right-0 top-0 h-full">
            <BaseImage url="/img/pc/casino/banner-right.png" class="h-full" />
          </div>
          <div class="absolute w-[5.3%] top-[50%] right-[2%] translate-y-[-50%]">
            <BaseImage url="/img/pc/casino/banner-brands.png" />
          </div>
          <div class="absolute top-[6%] left-[14%] text-center flex flex-col items-center">
            <p class="text-3xl font-extrabold">
              保持桀驁不馴
            </p>
            <div class="rounded-xl  text-lg font-semibold py-3 px-15 mt-4 bg-[#0003]">
              <div>註冊並獲得</div>
              <span class="text-2xl font-extrabold">高達</span>
              <span class="text-2xl  font-extrabold bg-gradient-to-r ml-1 text-transparent bg-clip-text from-[#9FE871] to-[#24EE89]">THB 684,558.24</span>
              <div>在賭場或體育</div>
            </div>
            <BaseButton class="w-60 mt-5 h-10 font-bold">
              立即加入
            </BaseButton>
          </div>
        </div>
      </BaseAspectRatio>

      <div class="bg-red-300">
        Casino {{ bool }}

        <BaseButton @click="dissss = !dissss">
          Toggle
        </BaseButton>

        <BaseRouterLink to="/sports">
          跳转体育123
        </BaseRouterLink>

        <div class="flex p-4 m-4 border w-96">
          <BaseTab v-model:current="tabCurrent" :tabs="tabs" />
        </div>
      </div>

      <BaseVirtualText text="0x1045AE62f6b1640aD94703CD2b5Ff955BA6F0A58" />
      <BaseImage class="w-48 rounded-sm h-48" url="/avatar.png" />
      <BaseEmpty />
      <BaseProgress :value="5" />
      <BaseSelect v-model="selectValue" :options="options">
        <BaseButton>
          {{ selectValue }}
        </BaseButton>
      </BaseSelect>
      <BaseSwipe
        :images="[
          'https://bc.game/assets/banner_m-Co6NetFU.png',
          'https://d2utx4nptvgikt.cloudfront.net/banner/zh-CN/1728130868750.webp',
        ]"
        height="400px"
        :autoplay="true"
        :delay="5000"
        :loop="true"
        :navigation="true"
        :pagination="true"
      />
    </div>
  </div>
</template>
