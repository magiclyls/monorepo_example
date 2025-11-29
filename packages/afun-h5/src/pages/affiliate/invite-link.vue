<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
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
      img: '/m/afun-h5/png/link-facebook.png',
      link: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    {
      label: 'TikTok',
      img: '/m/afun-h5/png/link-tiktok.png',
      link: 'https://www.tiktok.com/?text=',
    },
    {
      label: 'Telegram',
      img: '/m/afun-h5/png/link-telegram.png',
      link: 'https://t.me/share/url?url=',
    },
    {
      label: 'Instagram',
      img: '/m/afun-h5/png/link-ins.png',
      link: 'https://www.instagram.com/?quote=',
    },
    {
      label: 'YouTube',
      img: '/m/afun-h5/png/share-social-youtube-round.png',
      link: 'https://www.youtube.com/?text=',
    },
    {
      label: 'WhatsApp',
      img: '/m/afun-h5/png/link-whatsapp.png',
      link: 'https://api.whatsapp.com/send?text=',
    },
    {
      label: 'LINE',
      img: '/m/afun-h5/png/link-line.png',
      link: 'https://line.me/R/share?text=',
    },
    {
      label: 'X',
      img: '/m/afun-h5/png/link-x.png',
      link: 'https://twitter.com/intent/tweet?text%20&url=',
    },
    {
      label: 'Gmail',
      img: '/m/afun-h5/png/link-gmail.png',
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
    <div class="bg-[#0F212E] rounded-[6px] p-[16px] mb-[8px]">
      <div class="text-[#fff] text-[16px] font-[600] mb-[14px]">
        {{ t('我的链接') }}
      </div>
      <div class="pl-[10px] h-[40px] rounded-[4px] bg-[#213743] text-[#fff] text-[14px] font-[600] flex justify-between items-center" @click="copyText">
        <span class="">{{ qrUrl }}</span>
        <span class="w-[38px] h-[38px] flex justify-center items-center bg-[#2F4553] rounded-r-[2px] mr-[1px]">
          <IconUniCopy :style="{ color: '#B1BAD3' }" class="text-[14px]" />
        </span>
      </div>
      <div class="text-[#fff] text-[16px] font-[600] text-center mt-[16px] mb-[14px]">
        {{ t('快速分享') }}
      </div>
      <div class="grid grid-cols-5 grid-rows-2 gap-[10px]">
        <a v-for="item in socialData" :key="item.label" :href="item.link" target="_blank" rel="noopener noreferrer" class="flex flex-col gap-[6px] items-center">
          <AfunBaseImage
            :url="item.img"
            class="w-[42px] h-[42px] shrink-0"
          />
          <div class="text-center text-[12px] text-[#fff] font-[400]">{{ item.label }}</div>
        </a>
      </div>
    </div>
    <div class="bg-[#0F212E] rounded-[6px] p-[16px] mb-[8px]">
      <AfunBaseImage
        :url="`/m/afun-h5/png/invitation_${mode}.png`"
        class="w-full shrink-0"
      />
    </div>
    <div v-if="contents?.length > 0" class="bg-[#0F212E] rounded-[6px] py-[16px] px-[12px]">
      <div class="text-[#fff] text-[14px] font-[600] mb-[8px]">
        {{ t('规则说明') }}
      </div>
      <div class="flex gap-[10px]">
        <div class="w-[4px] h-[4px] rounded-full bg-[#B1BAD3] mt-[10px]" />
        <div>
          <div v-for="content in contents" :key="content" class="text-[#B1BAD3] text-[12px] font-[600]">
            <div class="content" v-html="content.replace(/\n/g, '<br>')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
