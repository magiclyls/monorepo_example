<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { SendFlutterAppMessage } from '@tg/types'
import { isExternal, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  /** 需要分享的内容 */
  shareText?: string
  width?: string
  round?: boolean
  showName?: boolean
  socials?: string[]
}
interface ISocialsItem {
  label: string
  img: string
  imgRound: string
  link: string
}
defineOptions({
  name: 'AppApplicationSharing',
})
const props = withDefaults(defineProps<Props>(), {
  width: '28px',
  showName: true,
  socials: () => [],
  shareText: location.href,
})

const router = useRouter()

const shareText = computed(() => encodeURIComponent(props.shareText))

const defaultSocials = [
  {
    label: 'Facebook',
    img: '/m/afun-h5/png/share-social-facebook.png',
    imgRound: '/m/afun-h5/png/share-social-facebook-round.png',
    link: 'https://www.facebook.com/sharer/sharer.php?u=',
  },
  {
    label: 'Kwai',
    img: '/m/afun-h5/png/share-social-kwai-round.png',
    imgRound: '/m/afun-h5/png/share-social-kwai-round.png',
    link: 'https://www.kwai.com/?content=',
  },
  {
    label: 'TikTok',
    img: '/m/afun-h5/png/share-social-tiktok.png',
    imgRound: '/m/afun-h5/png/share-social-tiktok-round.png',
    link: 'https://www.tiktok.com/?text=',
  },
  {
    label: 'Telegram',
    img: '/m/afun-h5/png/share-social-telegram.png',
    imgRound: '/m/afun-h5/png/share-social-telegram-round.png',
    link: 'https://t.me/share/url?url=',
  },
  {
    label: 'Instagram',
    img: '/m/afun-h5/png/share-social-instagram.png',
    imgRound: '/m/afun-h5/png/share-social-instagram-round.png',
    link: 'https://www.instagram.com/?quote=',
  },
  {
    label: 'YouTube',
    img: '/m/afun-h5/png/share-social-youtube.png',
    imgRound: '/m/afun-h5/png/share-social-youtube-round.png',
    link: 'https://www.youtube.com/?text=',
  },
  {
    label: 'WhatsApp',
    img: '/m/afun-h5/png/share-social-whatsapp.png',
    imgRound: '/m/afun-h5/png/share-social-whatsapp-round.png',
    link: 'https://api.whatsapp.com/send?text=',
  },
  {
    label: 'LINE',
    img: '/m/afun-h5/png/share-social-line.png',
    imgRound: '/m/afun-h5/png/share-social-line-round.png',
    link: 'https://line.me/R/share?text=',
  },
  {
    label: 'X',
    img: '/m/afun-h5/png/share-social-x.png',
    imgRound: '/m/afun-h5/png/share-social-x-round.png',
    link: 'https://twitter.com/intent/tweet?text%20&url=',
  },
  {
    label: 'Gmail',
    img: '/m/afun-h5/png/share-social-gmail.png',
    imgRound: '/m/afun-h5/png/share-social-gmail-round.png',
    link: 'Gmail',
  },
]

const socialData = computed(() => {
  if (props.socials && props.socials.length > 0) {
    const arr: ISocialsItem[] = []
    for (let i = 0; i < props.socials.length; i++) {
      const obj = defaultSocials.find(a => a.label === props.socials[i])
      if (obj)
        arr.push(obj)
    }
    return arr
  }
  return defaultSocials
})

function openKwaiApp() {
  const schemeUrl = `kwai://content=${shareText.value}`
  const fallbackUrl = `https://www.kwai.com/?content=${shareText.value}`
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = schemeUrl
  document.body.appendChild(iframe)

  setTimeout(() => {
    router.push(fallbackUrl)
  }, 1500)
}

function openLink(item: any) {
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.PUBLIC_SHARE, { item, share: props.shareText })
    return
  }
  if (item.link === 'Gmail')
    window.location.href = `mailto:?subject=&body=${props.shareText}`
  else if (item.label === 'Kwai')
    openKwaiApp()
  else
    item.link && push(item.link + shareText.value)
}

function push(path: string) {
  if (!path)
    return
  if (isExternal(path)) {
    window.open(path, '_blank')
    return
  }
  router.push(path)
}
</script>

<template>
  <div class="share-wrap share-list">
    <div v-for="(item, index) in socialData" :key="index" class="social" @click="openLink(item)">
      <AfunBaseImage :url="round ? item.imgRound : item.img" :width="width" :height="width" class="promotion-base-image" />
      <span v-if="showName">{{ item.label }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --tg-app-share-size: 12px;
  --tg-app-share-icon-size: 54px;
  --tg-app-share-icon-margin-bottom: 9px;
  /* --social: #1b1b1b; */
  --social: #fff;
}
</style>

<style lang="scss" scoped>
.share-wrap {
  display: grid;
  width: 100%;
  gap: 10px;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, minmax(var(--tg-app-share-icon-size), auto));
}

.social {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--tg-app-share-size);
  cursor: pointer;

  div:first-of-type {
    margin-bottom: var(--tg-app-share-icon-margin-bottom);
  }

  .promotion-base-image {
    --tg-base-img-style-radius: 4px;
  }
}

.share-list {
  .social {
    color: var(--social);
  }
}
</style>
