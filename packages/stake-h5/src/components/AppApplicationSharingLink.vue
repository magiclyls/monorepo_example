<script setup lang="ts">
defineOptions({
  name: 'AppApplicationSharingLink',
})

const props = withDefaults(defineProps<Props>(), {
  width: '28px',
})

const { isMobile } = storeToRefs(useWindowStore())

interface Props {
  /** 需要分享的内容 */
  shareText: string
  width?: string
  round?: boolean
}
const router = useLocalRouter()

const shareText = computed(() => encodeURIComponent(props.shareText))

const socialData = computed(() => {
  return [
    {
      label: 'Facebook',
      img: '/png/settings/social-facebook.png',
      imgRound: '/png/settings/social-facebook-round.png',
      link: 'https://www.facebook.com/sharer/sharer.php?u=',
    },
    {
      label: 'Kwai',
      img: '/png/settings/social-kwai-round.png',
      imgRound: '/png/settings/social-kwai-round.png',
      link: 'https://www.kwai.com/?content=',
    },
    {
      label: 'TikTok',
      img: '/png/settings/social-tiktok.png',
      imgRound: '/png/settings/social-tiktok-round.png',
      link: 'https://www.tiktok.com/?text=',
    },
    {
      label: 'Telegram',
      img: '/png/settings/social-telegram.png',
      imgRound: '/png/settings/social-telegram-round.png',
      link: 'https://t.me/share/url?url=',
    },
    {
      label: 'Instagram',
      img: '/png/settings/social-instagram.png',
      imgRound: '/png/settings/social-instagram-round.png',
      link: 'https://www.instagram.com/?quote=',
    },
    {
      label: 'YouTube',
      img: '/png/settings/social-youtube.png',
      imgRound: '/png/settings/social-youtube-round.png',
      link: 'https://www.youtube.com/?text=',
    },
    {
      label: 'WhatsApp',
      img: '/png/settings/social-whatsapp.png',
      imgRound: '/png/settings/social-whatsapp-round.png',
      link: 'https://api.whatsapp.com/send?text=',
    },
    {
      label: 'LINE',
      img: '/png/settings/social-line.png',
      imgRound: '/png/settings/social-line-round.png',
      link: 'https://line.me/R/share?text=',
    },
    {
      label: 'X',
      img: '/png/settings/social-x.png',
      imgRound: '/png/settings/social-x-round.png',
      link: 'https://twitter.com/intent/tweet?text%20&url=',
    },
    {
      label: 'Gmail',
      img: '/png/settings/social-gmail.png',
      imgRound: '/png/settings/social-gmail-round.png',
      link: 'Gmail',
    },
  ]
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
    item.link && router.push(item.link + shareText.value)
}
</script>

<template>
  <div class="share-wrap share-list" :class="{ 'pc-layout': isMobile === false }">
    <div v-for="(item, index) in socialData" :key="index" class="social" @click="openLink(item)">
      <BaseImage :url="round ? item.imgRound : item.img" :width="width" :height="width" class="promotion-base-image" />
      {{ item.label }}
    </div>
  </div>
</template>

<style>
:root {
  --tg-app-share-size: var(--tg-font-size-xs);
}
</style>

<style lang="scss" scoped>
.share-wrap {
  display: grid;
  width: 100%;
  gap: var(--tg-spacing-10);
  row-gap: var(--tg-spacing-20);
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, minmax(54px, auto));

  &.pc-layout {
    grid-template-columns: repeat(5, 1fr);
  }

  @include webTheme('green') {
    color: #fff;
  }

  @include webTheme('white') {
    color: #111;
  }
}

.social {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--tg-app-share-size);
  cursor: pointer;
  font-weight: 400;

  div:first-of-type {
    margin-bottom: var(--tg-spacing-8);
  }

  .promotion-base-image {
    // width: 28px;
    // height: 28px;
    --tg-base-img-style-radius: var(--tg-radius-default);
  }
}

.share-list {
  .social {
    color: var(--tw-ring-offset-color);

    @include webTheme('white') {
      color: #111;
    }
  }
}
</style>
