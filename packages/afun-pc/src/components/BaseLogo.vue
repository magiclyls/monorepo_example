<script setup lang="ts">
import { IconUniBack, IconHeaderHome } from '@tg/icons';

interface Props {
  mode?: 'light' | 'dark'
  useSmall?: boolean
  isBack?: boolean
  static?: boolean
  useLogoAfterLogin?: boolean
  smallLogo?: boolean
  originHeight?: number
}
defineOptions({
  name: 'BaseLogo',
})
const props = withDefaults(defineProps<Props>(), {
  mode: 'light',
  useSmall: false,
  isBack: false,
  static: true,
  useLogoAfterLogin: true,
  originHeight: 22,
})
defineEmits(['loadImg'])

const router = useLocalRouter()
const route = useRoute()
const { logoAndIcoAndLoading } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { isLogin } = storeToRefs(useAppStore())
const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()
const { lastLogoShouldGo } = storeToRefs(useMenuStore())
const logoRef = ref<HTMLElement>()
const { width: logoWidth } = useElementSize(logoRef)

const showBack = computed(() => {
  return isMobile.value && props.isBack && isLogin.value
    ? [`/${getCurrentUrlLanguage()}/sports/${getSportsPlatId()}`, `/${getCurrentUrlLanguage()}/casino`].includes(router.currentRoute.value.path)
    : true
})

const curLogoImg = computed(() => {
  if (props.useSmall)
    return logoAndIcoAndLoading.value.first_letter ?? ''

  return isLogin.value && props.useLogoAfterLogin
    ? logoAndIcoAndLoading.value.after_login
    : logoAndIcoAndLoading.value.logo_white
})

function to() {
  if (props.static)
    return

  if (lastLogoShouldGo.value === 'casino') {
    // 娱乐城首页需要滚动到顶部
    if (isMobile.value) {
      scrollMainContentToTop(route.meta.needScrollingXHidden)
      window.casinoIndexScrollHeight = 0
      window.saveScrollPositionHeight = 0
    }
    appEventBus.emit(EventBusNames.CASINO_LOBBY_RESET, true)
    router.push('/casino')
  }
  else if (lastLogoShouldGo.value === 'sports') {
    const temp = `/sports/${getSportsPlatId()}`
    appEventBus.emit(EventBusNames.SPORTS_LOBBY_RESET, true)
    router.push(temp)
  }
  // }

  isMobile.value && leftIsExpand.value && closeLeftSidebar()
}
</script>

<template>
  <div>
    <div v-if="!smallLogo" class="base-logo" :style="{ height: `${originHeight}px` }" :data-small="useSmall"
      :data-url="curLogoImg">
      <div v-show="showBack" class="h-full min-w-[20px]" :class="{ 'max-w-[60px]': useSmall }"
        style="--app-sport-image-error-icon-size:40px;" @click="to">
        <div class="logo-center">
          <BaseButton class="h-full" type="text" size="none">
            <AppImage v-if="curLogoImg" ref="logoRef" :key="curLogoImg" loading="eager" class="logo-img h-full"
              :class="[{ 'is-small': useSmall }]" err-icon="img-casino-error" is-network :url="curLogoImg"
              @load-img="$emit('loadImg', logoWidth)" />
          </BaseButton>
        </div>
      </div>
      <BaseButton v-show="!showBack" style="--tg-base-button-padding-x:var(--tg-spacing-button-padding-vertical-xs) 0;
        --tg-base-button-padding-y: var(--tg-spacing-button-padding-vertical-xs)
        35px" type="text" custom-padding @click="router.back()">
        <IconUniBack style="font-size: var(--tg-font-size-base);
        --tg-icon-color:var(--tg-text-white)" name="uni-back" />
      </BaseButton>
    </div>
    <!-- h5主页图标 -->
    <BaseButton v-else type="text" size="none" @click="to">
      <IconHeaderHome style="font-size: 25px; color: #fff;" />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.is-small {
  width: 40px;
}

.logo-center {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-img {
  :deep(img) {
    width: auto !important;
  }
}
</style>
