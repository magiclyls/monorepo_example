<script setup lang="ts">
import type { ICasinoGameItem } from '@tg/types'
import { ApiMemberFavDelete, ApiMemberFavInsert } from '@tg/apis'
import { BaseAspectRatio, PhBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconLike, IconLikeActive, IconUniMaintained } from '@tg/icons'
import { useAppStore, useCasinoStore } from '@tg/stores'
import { EnumGlobalGameType, EnumOriginalLotteryVenue } from '@tg/types'
import { addUrlSearch, application } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

interface Props {
  data: ICasinoGameItem
  size?: string
  // 1 正方形
  type?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  type: 1,
  size: 'auto',
})

const emit = defineEmits(['onclick'])

const { t } = useI18n()
const router = useRouter()
const { imageRatio, imageDirectory, imageBorder } = storeToRefs(useCasinoStore())
const { isLogin } = storeToRefs(useAppStore())
const { bool: isError, setTrue: setErrorTrue } = useBoolean(false)
const { bool: thumbnailStatus, setFalse: thumbnailLoadError } = useBoolean(true)
const { bool: showBorder, setFalse: showBorderFalse } = useBoolean(true)
const { bool: showImg, setTrue: showImgTrue } = useBoolean(false)

const isFavorite = ref(props.data?.is_fav === 1)
const id = computed(() => props.data?.id)

// 是否维护
const isMaintained = computed(() => props.data.maintained === '2')
// 是否原创游戏
const isOriginalGame = computed(() => props.data.game_type === EnumGlobalGameType.original)
const isLottery = computed(() => props.data.venue_id === EnumOriginalLotteryVenue.originalLottery)

const gameImgUrl = computed(() => {
  if (isOriginalGame.value && props.data.img) {
    const arr = props.data.img.split('/')
    arr[arr?.length - 1] = `${arr[arr?.length - 1]}`
    return arr.join('/')
  }
  return props.data.img
})
const toPath = computed(() => {
  const r = Math.random().toString(36).slice(-10)
  const { id, name, platform_name, game_type, game_id, venue_id, ty } = props.data
  const query: any = {
    id,
    name,
    pn: platform_name,
    type: game_type,
    code: game_id,
    vid: venue_id,
    game_id,
  }

  let q_ty = ''
  if (ty) {
    q_ty = `&ty=${ty}`
    query.ty = ty
  }

  if (isOriginalGame.value) {
    return `/original-game/${game_id}${q_ty.replace('&', '?')}`
  }
  if (isLottery.value) {
    return application.getOriginalLotteryRouter(game_id)
  }

  return addUrlSearch(
    `/games/${id || r}`,
    application.objectToUrlParams(query),
  )
})

function gameStart() {
  if (isMaintained.value)
    return
  const { game_id, platform_id, game_type, name } = props.data

  if (game_id === 'sglb' && [2, 3, 5].includes(+game_type)) {
    router.push(`/group/category/${platform_id}?cid=${platform_id}&ty=4&name=${name}`)
    return
  }
  router.push(toPath.value)
}

// 添加收藏
const { run: runFavInsert, loading: loadingInsert } = useRequest(() => ApiMemberFavInsert(id.value), {
  ready: ref(Boolean(id)),
  onSuccess() {
    isFavorite.value = true
  },
})

// 删除收藏
const { run: runFavDelete, loading: loadingDelete } = useRequest(() => ApiMemberFavDelete(id.value), {
  ready: ref(Boolean(id)),
  onSuccess() {
    isFavorite.value = false
  },
})

/**
 * 获取缩略图地址（xxx.webp => xxx.s.webp）
 * @param url
 */
function getThumbnailUrl(url: string) {
  if (!url)
    return ''
  const arr = url.split('.')
  arr.splice(arr.length - 1, 0, 's')
  return arr.join('.')
}

function collect() {
  if (!isLogin.value) {
    Message.info(t('请先登录'))
    return
  }
  if (loadingInsert.value || loadingDelete.value)
    return

  if (isFavorite.value) {
    runFavDelete()
  }
  else {
    runFavInsert()
  }
}
function dealGameUrl(url: string) {
  return url.replace('%lang%', getLangForBackend() || 'en_US').replace('images', 'images-ph')
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
  <BaseAspectRatio :ratio="imageRatio">
    <div class="relative w-full h-full rounded-[10rem] overflow-hidden cursor-pointer" :class="{ maintain: isMaintained }" @click="gameStart">
      <!-- 模糊图 -->
      <div class="absolute w-full h-full top-0 left-0">
        <PhBaseImage
          v-if="thumbnailStatus" :image-directory="imageDirectory" fit="cover" is-cloud :url="getThumbnailUrl(data.img)" loading="eager" class="w-full h-full"
          @error-img="thumbnailLoadError"
        />
      </div>
      <!-- 正常图片 -->
      <PhBaseImage
        v-if="!isError && showImg" :image-directory="imageDirectory" :url="gameImgUrl" loading="eager" :name="data.name" class="w-full h-full"
        fit="cover" is-cloud @error-img="setErrorTrue()" @load-img="showBorderFalse"
      />
      <div v-if="isError && !isMaintained" :data-url="dealGameUrl(gameImgUrl)" class="absolute w-full h-full top-0 left-0 flex items-center justify-center flex-col bg-[#fff] text-[#9DABC9]">
        <PhBaseImage class="mb-[2rem]" url="/ph-h5/png/game-img-error.png" width="24rem" height="24rem" />
        <span class="text-[10rem]">{{ t('加载失败了x_x') }}</span>
      </div>
      <!-- 边框 -->
      <template v-if="showBorder">
        <img v-if="!isError" class="absolute w-full h-full z-10 top-0 left-0" :src="imageBorder" alt="">
        <div class="absolute max-w-[86%] whitespace-nowrap overflow-hidden text-ellipsis h-full top-0 left-0 text-[#6D7693] text-[11rem] p-[6rem]">
          {{ data.name }}
        </div>
      </template>
      <!-- 维护 -->
      <div v-if="isMaintained" class="w-full h-full bg-[#fff] text-[#9DABC9] flex flex-col items-center justify-center">
        <IconUniMaintained class="text-[24rem] mb-[2rem]" />
        <span class="text-[10rem]">{{ t('场馆维护中') }}</span>
      </div>

      <!-- 收藏 -->
      <template v-else-if="$route.name !== 'Home'">
        <div class="size-[24rem] center absolute z-1 top-0 right-0" @click.stop="collect">
          <div class="w-[16rem] h-[16rem] overflow-hidden rounded-full center bg-[rgba(255,255,255,0.7)]">
            <template v-if="isFavorite">
              <IconLikeActive class="text-[#f23038] text-[10rem]" />
            </template>
            <template v-else>
              <IconLike class="text-[transparent] text-[10rem]" />
            </template>
          </div>
        </div>
      </template>
    </div>
  </BaseAspectRatio>
</template>

<style scoped lang="scss">
.maintain {
  cursor: not-allowed;
}
</style>
