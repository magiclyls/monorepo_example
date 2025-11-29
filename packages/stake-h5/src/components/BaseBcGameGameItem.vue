<script setup lang="ts">
import { IconBcItemStart, IconUniMaintain } from '@tg/icons';

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
  name: 'BaseBcGameGameItem',
})
const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
})

const keepAliveStore = useKeepAliveStore()

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { bool: isError, setTrue: setErrorTrue } = useBoolean(false)
const { bool: thumbnailStatus, setFalse: thumbnailLoadError } = useBoolean(true)
const { bool: showBorder, setFalse: showBorderFalse } = useBoolean(true)
const { bool: showImg, setTrue: showImgTrue } = useBoolean(false)
const router = useLocalRouter()

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

onMounted(() => {
  setTimeout(() => {
    showImgTrue()
  }, Math.ceil(Math.random() * 50 + 300))
})
</script>

<template>
  <BaseAspectRatio class="group game-ratio" ratio="100/134.1463414634"
    style="border-radius: var(--tg-radius-md);overflow: hidden;">
    <div class="base-game-item" :class="{ maintain: isMaintained }" @click.stop="gameStart">
      <div class="backgrop-filter">
        <BaseImage v-if="thumbnailStatus" is-cloud :url="getThumbnailUrl(gameInfo.img ?? '')" loading="eager"
          @error-img="thumbnailLoadError" />
      </div>
      <template v-if="showBorder">
        <img class="border" src="/stake/img/border/border.svg" alt="">
        <div class="game-title">
          {{ gameInfo.name }}
        </div>
      </template>
      <BaseImage v-if="!isError && showImg" :url="gameImgUrl" :loading="loading" :name="gameInfo.name" is-cloud
        style="height: inherit;" @error-img="setErrorTrue()" @load-img="showBorderFalse" />
      <div v-if="isError && !isMaintained" class="img-load">
        <div style="text-align: center;">
          <BaseImage style="margin-top: 45%;margin-left: 42%;" width="14px" height="14px"  url="/png/icon/uni-game-err.png" />
        </div>
      </div>
      <!-- 小人 -->
      <div v-if="gameInfo.game_type !== EnumGlobalGameType.casino || showManCount"
        class="bg-person absolute bottom-[4px] right-[4px] h-[20px] flex items-center rounded-md px-[6px]">
        <img class="mr-[4px] w-[12px]"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAV1BMVEUAAAD///+vv7+zvsKzvcD///+yv8Czv7////////////////+0vsH///+0v8L///+0v8L///////////+zvsGzvcKyvcK0vb+zv8Ozv7////+zvsH///9BsiEjAAAAG3RSTlMAvxC/gHBgIK8gEO/n35+Pj4BgUM+vcHBAQDB6axrrAAAAhUlEQVQoz4XOWRKEIAxF0ciMs23PZP/r7C5RIcTS83lfUQSuvceHHC3Log+LXhSDDCtJuwm7JxnaNNzJDyGT/2LzwZ68YEfxsz5pMECoraut0KV9AWONUkbAgdr7g6hdh3+Nu5GuG9x1OvUKCVevfcDCELtH5hs/4EO8YObDDIupKkxw4geB5Rgg/yXcwgAAAABJRU5ErkJggg=="><span
          class="text-xs font-semibold text-[white]">{{ gameInfo.online_num }}</span>
      </div>
      <!-- 遮罩 -->
      <div v-if="!isMobile || isMaintained"
        class="center absolute left-0 top-0 h-full w-full cursor-pointer rounded-lg bg-[#00000099] opacity-0 group-hover:opacity-100"
        @click="gameStart">
        <div
          class="center absolute left-0 top-0 h-[40%] w-full flex px-[8px] text-center font-extrabold leading-[16px] text-[white]">
          {{ gameInfo.name }}
        </div>
        <div
          class="center bg-start h-[36px] w-[36px] flex rounded-full transition-all duration-300 group-hover:scale-150">
          <IconBcItemStart class="text-[36px]" name="bc-item-start" />
        </div>
      </div>
      <div v-if="isMaintained" class="maintain-game-item">
        <IconUniMaintain style="font-size:var(--tg-font-size-2xl)" name="uni-maintain" />
        <div>
          {{ $t('plat_maintain') }}
        </div>
      </div>
    </div>
  </BaseAspectRatio>
</template>

<style>
:root {
  --bc-item-style-start-bg-color: #fff3;
  --bc-item-style-person-bg-color: #0003;
}
</style>

<style scoped lang="scss">
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

  .backgrop-filter {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .bg-start {
    background-color: var(--bc-item-style-start-bg-color);
  }

  .bg-person {
    background-color: var(--bc-item-style-person-bg-color);
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
    border-radius: var(--tg-radius-md);

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
}
</style>
