import { acceptHMRUpdate, defineStore } from 'pinia'

export const useWindowStore = defineStore('window', () => {
  const { width, height: windowHeight } = useWindowSize()
  const bodyRef = ref(document.body) // 直接引用 body
  const { width: bodyWidth } = useElementSize(bodyRef as Ref<HTMLElement>)

  /** 内容区域宽度 */
  const appContentWidth = ref(0)
  /** 左侧偏移量 */
  const appContentOffsetLeft = ref(0)

  /** 宽度边界 638 xs */
  const widthBoundaryXs = ref(638)
  /** 宽度边界 768 sm */
  const widthBoundarySm = ref(768)
  /** 宽度边界 975 md */
  const widthBoundaryMd = ref(975)
  /** 宽度边界 1200 lg */
  const widthBoundaryLg = ref(1200)
  /** 宽度边界 1290 xl */
  const widthBoundaryXl = ref(1290)
  /** 利息宝页面 */
  const isInterestTreasure = ref(false)

  const isXs = computed(() => bodyWidth.value < widthBoundaryXs.value)
  const isSm = computed(() => bodyWidth.value < widthBoundarySm.value && bodyWidth.value >= widthBoundaryXs.value)
  const isMd = computed(() => bodyWidth.value < widthBoundaryMd.value && bodyWidth.value >= widthBoundarySm.value)
  const isLg = computed(() => bodyWidth.value < widthBoundaryLg.value && bodyWidth.value >= widthBoundaryMd.value)
  const isXl = computed(() => bodyWidth.value < widthBoundaryXl.value && bodyWidth.value >= widthBoundaryLg.value)

  const isLessThanXs = computed(() => bodyWidth.value < widthBoundaryXs.value)
  const isLessThanSm = computed(() => bodyWidth.value < widthBoundarySm.value)
  const isLessThanMd = computed(() => bodyWidth.value < widthBoundaryMd.value)
  const isLessThanLg = computed(() => bodyWidth.value < widthBoundaryLg.value) // isFixed
  const isLessThanXl = computed(() => bodyWidth.value < widthBoundaryXl.value)

  const isGreaterThanXs = computed(() => bodyWidth.value > widthBoundaryXs.value)
  const isGreaterThanSm = computed(() => bodyWidth.value > widthBoundarySm.value) // isFixedSmall
  const isGreaterThanMd = computed(() => bodyWidth.value > widthBoundaryMd.value)
  const isGreaterThanLg = computed(() => bodyWidth.value > widthBoundaryLg.value)
  const isGreaterThanXl = computed(() => bodyWidth.value > widthBoundaryXl.value)

  const isMobile = computed(() => bodyWidth.value <= widthBoundarySm.value) // isFullScreen
  const windowIsMobile = computed(() => width.value <= widthBoundarySm.value) // isFullScreen

  /** 右侧边栏宽度 */
  const rightWidth = computed(() => {
    if (bodyWidth.value > widthBoundarySm.value && bodyWidth.value < 1000)
      return '320px'

    else if (bodyWidth.value >= 1000)
      return '370px'

    else
      return ''
  })

  const setAppContentWidth = (width: number) => {
    appContentWidth.value = width
  }

  const setAppContentOffsetLeft = (left: number) => {
    appContentOffsetLeft.value = left
  }

  watch([width, windowIsMobile, isMobile, bodyWidth], () => {
    if (bodyWidth.value !== 0) {
      // console.log('xxxxxx', windowIsMobile.value === false && isMobile.value && globalInitMap.isPcRenderH5)
      if (windowIsMobile.value === false && isMobile.value && globalInitMap.isPcRenderH5) {
        document.body.style.setProperty('--pc-h5model-left', `calc(100% / 2 - ${bodyWidth.value / 2}px)`)
        document.body.style.setProperty('--pc-h5model-left-notify-list', `calc(100% / 2 - ${bodyWidth.value / 2 - 16}px)`)
        document.body.style.setProperty('--pc-h5model-width', `${bodyWidth.value}px`)
        document.body.style.width = `${bodyWidth.value}px`
      }
      else {
        document.body.style.removeProperty('--pc-h5model-left')
        document.body.style.removeProperty('--pc-h5model-left-notify-list')
        document.body.style.removeProperty('--pc-h5model-width')
        document.body.style.width = '100%'
      }
    }
    // console.log('bodyWidth', bodyWidth.value, 'width', width.value, 'isMobile', isMobile.value, 'windowIsMobile', windowIsMobile.value)
  }, { immediate: true })

  return {
    widthBoundaryXs,
    widthBoundarySm,
    widthBoundaryMd,
    widthBoundaryLg,
    widthBoundaryXl,
    width,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isLessThanXs,
    isLessThanSm,
    isLessThanMd,
    isLessThanLg,
    isLessThanXl,
    isGreaterThanXs,
    isGreaterThanSm,
    isGreaterThanMd,
    isGreaterThanLg,
    isGreaterThanXl,
    isMobile,
    appContentWidth,
    windowHeight,
    rightWidth,
    appContentOffsetLeft,
    bodyWidth,
    isInterestTreasure,
    setAppContentWidth,
    setAppContentOffsetLeft,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot))
