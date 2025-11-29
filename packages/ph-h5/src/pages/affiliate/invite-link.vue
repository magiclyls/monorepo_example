<script lang="ts" setup>
import { PhBaseImage } from '@tg/bccomponents'
import { IconUniCopy } from '@tg/icons'
import { useAffiliate } from '@tg/stores'
import { EnumLanguage } from '@tg/types/enums'
import { application, delay } from '@tg/utils'
import { useBrowserLocation, useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '~/utils'

const location = useBrowserLocation()
const { t, locale } = useI18n()
const { copy } = useClipboard()
const { link_url, mode, rules } = storeToRefs(useAffiliate())

const socialData = computed(() => {
  return [
    {
      label: 'Facebook',
      img: '/ph-h5/png/link-facebook.png',
      link: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    {
      label: 'TikTok',
      img: '/ph-h5/png/link-tiktok.png',
      link: 'https://www.tiktok.com/?text=',
    },
    {
      label: 'Telegram',
      img: '/ph-h5/png/link-telegram.png',
      link: 'https://t.me/share/url?url=',
    },
    {
      label: 'Instagram',
      img: '/ph-h5/png/link-ins.png',
      link: 'https://www.instagram.com/?quote=',
    },
    {
      label: 'YouTube',
      img: '/ph-h5/png/share-social-youtube-round.png',
      link: 'https://www.youtube.com/?text=',
    },
    {
      label: 'WhatsApp',
      img: '/ph-h5/png/link-whatsapp.png',
      link: 'https://api.whatsapp.com/send?text=',
    },
    {
      label: 'LINE',
      img: '/ph-h5/png/link-line.png',
      link: 'https://line.me/R/share?text=',
    },
    {
      label: 'X',
      img: '/ph-h5/png/link-x.png',
      link: 'https://twitter.com/intent/tweet?text%20&url=',
    },
    {
      label: 'Gmail',
      img: '/ph-h5/png/link-gmail.png',
      link: 'Gmail',
    },
  ]
})

const contents = computed(() => {
  // 需要处理 rules 的格式 如果为空 则返回空数组
  if (Object.keys(rules.value).length === 0)
    return []
  return rules.value[EnumLanguage[locale.value as keyof typeof EnumLanguage]] || []
})

const qrUrl = computed(() => `${location.value.origin}${link_url.value ?? ''}`)

function copyText() {
  copy(qrUrl.value || '').then(() => {
    Message.success(t('成功复制'))
  })
}

await application.allSettled([delay(800)])
</script>

<template>
  <div>
    <div class="bg-[#fff] rounded-[6rem] p-[16rem] mb-[8rem]">
      <div class="text-[#0D2245] text-[16rem] font-[600] mb-[14rem]">
        {{ t('我的链接') }}
      </div>
      <div class="pl-[10rem] h-[40rem] rounded-[4rem] bg-[#F6F7F8] text-[#0D2245] text-[14rem] font-[600] flex justify-between items-center" @click="copyText">
        <span class="">{{ qrUrl }}</span>
        <span class="w-[38rem] h-[38rem] flex justify-center items-center bg-[#EBEBEB] rounded-r-[2rem] mr-[1rem]">
          <IconUniCopy :style="{ color: '#6D7693' }" class="text-[14rem]" />
        </span>
      </div>
      <div class="text-[#0D2245] text-[16rem] font-[600] text-center mt-[16rem] mb-[14rem]">
        {{ t('快速分享') }}
      </div>
      <div class="grid grid-cols-5 grid-rows-2 gap-[10rem]">
        <a v-for="item in socialData" :key="item.label" :href="item.link" target="_blank" rel="noopener noreferrer" class="flex flex-col gap-[6rem] items-center">
          <PhBaseImage
            :url="item.img"
            class="w-[42rem] h-[42rem] shrink-0"
          />
          <div class="text-center text-[12rem] text-[#0D2245] font-[600]">{{ item.label }}</div>
        </a>
      </div>
    </div>
    <div class="bg-[#fff] rounded-[6rem] p-[16rem] mb-[8rem]">
      <PhBaseImage
        :url="`/ph-h5/png/invitation_${mode}.png`"
        class="w-full shrink-0"
      />
    </div>
    <div v-if="contents?.length > 0" class="bg-[#fff] rounded-[6rem] py-[16rem] mb-[8rem] px-[12rem]">
      <div class="text-[#0D2245] text-[14rem] font-[600] mb-[8rem]">
        {{ t('规则说明') }}
      </div>
      <div class="flex gap-[10rem]">
        <div class="w-[4rem] h-[4rem] rounded-full bg-[#6D7693] mt-[10rem]" />
        <div>
          <div v-for="content in contents" :key="content" class="text-[#6D7693] text-[12rem] font-[600]">
            <div class="content" v-html="content.replace(/\n/g, '<br>')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
