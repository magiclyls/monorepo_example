<script setup lang="ts">
import { ApiMemberFavDelete, ApiMemberFavInsert } from '@tg/apis'
import { IconUniMaintain, IconNavbarUser } from '@tg/icons';
import { EnumOriginalLotteryVenue } from '@tg/types';

interface Props {
  gameInfo: {
    img?: string
    name?: string
    platform_id?: string
    platform_name: string
    game_id?: string
    [k: string]: any
    maintained: string
    game_type: string
    online_num: number
  }
  showManCount?: boolean
  loading?: 'eager' | 'lazy'
  ty?: number | string
}
defineOptions({
  name: 'BaseGameItem',
})
const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
})

const keepAliveStore = useKeepAliveStore()

const { t } = useI18n()
const { imageRatio, imageDirectory, imageBorder } = storeToRefs(useCasinoStore())
const { isLogin, theme } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const closeSearch = inject('closeSearch', () => { })
const closeSearchH5 = inject('closeSearchH5', () => { })
const { bool: isError, setTrue: setErrorTrue } = useBoolean(false)
const { bool: thumbnailStatus, setFalse: thumbnailLoadError } = useBoolean(true)
const { bool: showBorder, setFalse: showBorderFalse } = useBoolean(true)
const { bool: showImg, setTrue: showImgTrue } = useBoolean(false)
const router = useLocalRouter()
const route = useRoute()
const { openLoginDialog } = useLoginDialog()

const isFavorite = ref(props.gameInfo?.is_fav === 1)

const id = computed(() => props.gameInfo?.id)
// 是否收藏页面
const isFavoritePage = computed(() => route.fullPath.includes('/casino/favourites'))
const isOriginLottery = computed(() => props.gameInfo.platform_id === EnumOriginalLotteryVenue.originalLottery)

// 添加收藏
const { run: runFavInsert, loading: loadingInsert } = useRequest(() => ApiMemberFavInsert(id.value), {
  ready: id,
  onSuccess() {
    isFavorite.value = true
  },
})
// 删除收藏
const { run: runFavDelete, loading: loadingDelete } = useRequest(() => ApiMemberFavDelete(id.value), {
  ready: id,
  onSuccess() {
    isFavorite.value = false
  },
})

// 是否原创游戏
const isOriginalGame = computed(() => props.gameInfo.game_type === EnumGlobalGameType.original)
const isMaintained = computed(() => {
  return props.gameInfo.maintained === '2'
})
const toPath = computed(() => {
  const r = Math.random().toString(36).slice(-10)
  const { id, name, platform_name, game_type, game_id, venue_id } = props.gameInfo
  const u = router.currentRoute.value.query.u
  const c = router.currentRoute.value.query.c

  const query: any = {
    id,
    name,
    pn: platform_name,
    type: game_type,
    code: game_id,
    vid: venue_id,
    game_id,
  }
  if (u) {
    query.uid = u
    query.u = u
  }

  if (c)
    query.c = c

  let q_ty = ''
  if (props.ty) {
    q_ty = `&ty=${props.ty}`
    query.ty = props.ty
  }

  if (isOriginalGame.value) {
    if (u && c)
      return `/casino/original-game/${game_id}?u=${u}&c=${c}${q_ty}`
    else if (u)
      return `/casino/original-game/${game_id}?u=${u}${q_ty}`
    else if (c)
      return `/casino/original-game/${game_id}?c=${c}${q_ty}`
    else
      return `/casino/original-game/${game_id}${q_ty.replace('&', '?')}`
  }
    if (isOriginLottery.value) {
    const lotteryType = String(game_id)[0]
    return `/casino/mobile-lottery?type=${lotteryType}`
  }

  return addUrlSearch(
    `/casino/games/${id || r}`,
    application.objectToUrlParams(query),
  )
})

const gameImgUrl = computed(() => {
  if (isOriginalGame.value && props.gameInfo.img) {
    const arr = props.gameInfo.img.split('/')
    arr[arr?.length - 1] = `${arr[arr?.length - 1]}`
    return arr.join('/')
  }
  return props.gameInfo.img
})

function gameStart() {
  const { game_id, platform_id, game_type } = props.gameInfo

  if (isMaintained.value)
    return

  if (game_id === 'sglb' && [2, 3, 5].includes(+game_type)) {
    router.push(`/casino/group/category?cid=${platform_id}&ty=4`)
    return
  }

  console.log('toPath.value', toPath.value, router.currentRoute.value)

  const last_game_id = Local.get('last_game_id')?.value
  let removeGamesAlive: any
  if (last_game_id && props.gameInfo?.id && props.gameInfo.id !== last_game_id)
    removeGamesAlive = keepAliveStore.removeKeepAlive('KeepAliveCasinoGames')

  if (router.currentRoute.value.path.includes('/casino/games')) {
    removeGamesAlive = keepAliveStore.removeKeepAlive('KeepAliveCasinoGames')
    nextTick(() => {
      setTimeout(() => {
        router.replace(toPath.value)
        // removeGamesAlive && removeGamesAlive()
      }, 0)
    })
  }
  else {
    nextTick(() => {
      setTimeout(() => {
        router.push(toPath.value)
        removeGamesAlive && removeGamesAlive()
      }, 0)
    })
  }

  if (isMobile.value)
    closeSearchH5()
  else
    closeSearch()
}

/**
 * 获取缩略图地址（xxx.webp => xxx.s.webp）
 * @param url
 */
function getThumbnailUrl(url: string) {
  const arr = url.split('.')
  arr.splice(arr.length - 1, 0, 's')
  return arr.join('.')
}

function keepGame() {
  if (!isLogin.value) {
    openLoginDialog()
    return
  }
  if (loadingInsert.value || loadingDelete.value)
    return

  if (isFavorite.value) {
    runFavDelete()
    return
  }
  runFavInsert()
}

onMounted(() => {
  setTimeout(() => {
    showImgTrue()
  }, Math.ceil(Math.random() * 50 + 300))
})
defineExpose({
  gameStart,
})
</script>

<template>
  <BaseAspectRatio class="game-ratio" :ratio="imageRatio"
    style="border-radius: var(--tg-radius-md);overflow: hidden;">
    <div class="base-game-item" :class="{ maintain: isMaintained }" @click="gameStart">
      <div class="backgrop-filter">
        <BaseImage v-if="thumbnailStatus" :image-directory="imageDirectory" is-cloud :url="getThumbnailUrl(gameInfo.img ?? '')" loading="eager"
          @error-img="thumbnailLoadError" />
      </div>
      <template v-if="showBorder">
        <img class="border border-transparent" :src="imageBorder" alt="">
        <div class="game-title">
          {{ gameInfo.name }}
        </div>
      </template>
      <BaseImage v-if="!isError && showImg" :image-directory="imageDirectory" :url="gameImgUrl" loading="eager" :name="gameInfo.name" is-cloud
        style="height: inherit;" @error-img="setErrorTrue()" @load-img="showBorderFalse" />
      <div v-if="isError && !isMaintained" class="img-load">
        <div style="text-align: center;">
          <BaseImage style="margin-top: 45%;margin-left: 42%;" width="14px" height="14px" url="/png/icon/uni-game-err.png" />
        </div>
      </div>
      <div v-if="isMaintained" class="maintain-game-item">
        <IconUniMaintain style="font-size:var(--tg-font-size-2xl)" name="uni-maintain" />
        <div>
          {{ $t('plat_maintain') }}
        </div>
      </div>
      <div
        class="keep-game absolute right-[4px] top-[4px] h-[22px] w-[22px] flex items-center justify-center pl-[2.5px] pt-[2px]"
        @click.stop="keepGame">
        <!-- v-if="+gameInfo.is_fav > 0" 接口有 bug is_fav -->
        <BaseImage v-if="isFavorite || isFavoritePage" class="active w-[17px]" url="/webp/casino/keep_1.webp"
          loading="eager" />
      </div>
      <!-- 显示在图片右下角的在线人数 -->
      <div v-if="gameInfo.game_type !== EnumGlobalGameType.casino || showManCount"
        class="absolute bottom-[4px] right-[4px] flex items-center rounded-[6px] bg-[#0003] px-[2px] text-[10px] font-semibold leading-[18px] text-[#fff]">
        <IconNavbarUser name="navbar-user" style="--tg-icon-color:#fff;font-size: 10px;" />
        <span class="ml-[2px]">{{ gameInfo.online_num }}</span>
      </div>
    </div>
  </BaseAspectRatio>
</template>

<style scoped lang="scss">
.theme-text {
  @include webTheme('green') {
    color: #f6d14a;
  }
}

.keep-game {
  display: none;

  @include webTheme('green') {
    display: block;
  }

  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  @include getBackgroundImage('/casino/keep_0');

  .active {
    animation: animate-fav 0.5s ease-in-out;
  }
}

.game-ratio {
  transition: all 0.3s;
  transform: scale(1);
}

.game-ratio:hover {
  transform: translateY(-7px) scale(1);
}

.base-game-item {
  position: relative;
  width: 100%;
  height: -webkit-fill-available;
  top: 0;
  will-change: transform;
  cursor: pointer;

  .border {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .game-title {
    width: 100%;
    height: 100%;
    color: var(--tg-text-lightgrey);
    font-size: var(--tg-font-size-default);
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
  }

  // .active-game-item {
  //   position: absolute;
  //   display: flex;
  //   width: 100%;
  //   height: 100%;
  //   left: 0;
  //   top: 0;
  //   flex-direction: column;
  //   flex-wrap: nowrap;
  //   justify-content: space-between;
  //   padding: 1rem;
  //   font-size: var(--tg-font-size-base);
  //   opacity: 0;
  //   color: var(--tg-text-white);
  //   background-color: var(--tg-sub-blue);
  //   will-change: transform;
  //   transition: all 0.3s ease 0.3s;

  //   .game-title {
  //     font-size: var(--tg-font-size-md);
  //     line-height: 1.2;
  //   }

  //   .game-uni-play {
  //     margin: 0 auto;
  //     font-size: var(--tg-font-size-3xl);
  //     --tg-icon-color: var(--tg-text-white);
  //   }
  // }
  .game-href {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .img-load {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  &.maintain {
    cursor: not-allowed;
  }

  .maintain-game-item {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 12px;
    background-color: rgba(7, 29, 42, 0.8);

    >*:not(:first-child) {
      margin-top: 40px;
    }

    div {
      transform: translateY(-50%);
      font-size: var(--tg-font-size-base);
      color: var(--tg-text-white);
      font-weight: var(--tg-font-weight-semibold);
    }
  }

  .backgrop-filter {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}

.count {
  display: flex;
  align-items: center;
  margin-top: var(--tg-spacing-4);
  font-size: var(--tg-font-size-xs);
  color: var(--tg-text-lightgrey);
  font-weight: var(--tg-font-weight-semibold);
  line-height: 1.5;

  @include webTheme('green') {
    //只有这里文字颜色变化
    color: var(--tg-text-yellow);
  }

  @include webTheme('greenblack') {
    color: #26ffbe;
  }

  .dot {
    width: 6.5px;
    height: 6.5px;
    border-radius: 50%;
    background-color: var(--tg-primary-success);
    margin-left: 2px;

    @include webTheme('greenblack') {
      background-color: #26ffbe;
    }
  }

  .num {
    color: var(--tg-text-white);
    font-variant-numeric: tabular-nums;
  }
}

@keyframes animate-fav {
  0% {
    transform: scale(1);
  }

  25% {
    transform: rotate(5deg);
    transform-origin: bottom left;
  }

  50% {
    transform: scale(1.2) rotate(0deg);
    transform-origin: bottom left;
  }

  75% {
    transform: rotate(-5deg);
    transform-origin: bottom left;
  }

  100% {
    transform: scale(1) rotate(0deg);
    transform-origin: bottom left;
  }
}
</style>
