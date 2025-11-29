<script setup lang="ts">
import type { ICasinoGameItem } from '@tg/types'
import { ApiMemberFavDelete, ApiMemberFavInsert } from '@tg/apis'
import { AfunBaseImage, BaseAspectRatio } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconLike, IconLikeActive, IconUniMaintained } from '@tg/icons'
import { useAppStore, useCasinoStore } from '@tg/stores'
import { EnumGlobalGameType, EnumOriginalLotteryVenue } from '@tg/types'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '~/utils'

interface Props {
  data: ICasinoGameItem
  size?: string
  // 1 正方形
  type?: number | string
  onlineCount?: boolean
  compressImage?: boolean // 是否压缩图片
}

const props = withDefaults(defineProps<Props>(), {
  type: 1,
  size: 'auto',
  onlineCount: true,
  compressImage: true,
})

const emit = defineEmits(['onclick'])

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore())
const { imageRatio, imageDirectory, imageBorder } = storeToRefs(useCasinoStore())
const { bool: isError, setTrue: setErrorTrue } = useBoolean(false)
const { bool: thumbnailStatus, setFalse: thumbnailLoadError } = useBoolean(props.compressImage)
const { bool: showBorder, setFalse: showBorderFalse } = useBoolean(true)
const { bool: showImg, setTrue: showImgTrue } = useBoolean(!props.compressImage)

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
    return `?page_dialog=original-game-${game_id}`
  }
  if (isLottery.value) {
    return application.getOriginalLotteryRouter(game_id)
  }

  query.page_dialog = 'game-detail'
  return `?${application.objectToUrlParams(query)}`
})

function gameStart() {
  if (isMaintained.value)
    return
  const { game_id, platform_id, game_type, name } = props.data

  if (game_id === 'sglb' && [2, 3, 5].includes(+game_type)) {
    router.push(`/group/category/${platform_id}?cid=${platform_id}&ty=4&name=${name}`)
    return
  }

  if (route.query.page_dialog) {
    router.replace(toPath.value)
  }
  else {
    router.push(toPath.value)
  }
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
  <div>
    <BaseAspectRatio :ratio="imageRatio">
      <div
        class="relative w-full h-full rounded-[10px] overflow-hidden  cursor-pointer"
        :class="{ maintain: isMaintained }" @click="gameStart"
      >
        <!-- 模糊图 -->
        <div v-if="thumbnailStatus" class="absolute w-full h-full top-0 left-0">
          <AfunBaseImage
            :image-directory="imageDirectory" fit="cover" is-cloud
            :url="getThumbnailUrl(data.img)" loading="eager" class="w-full h-full"
            @error-img="thumbnailLoadError"
          />
        </div>
        <!-- 正常图片 -->
        <AfunBaseImage
          v-if="!isError && showImg" :image-directory="imageDirectory" :url="gameImgUrl" loading="eager"
          :name="data.name" class="w-full h-full"
          fit="cover" is-cloud @error-img="setErrorTrue()" @load-img="showBorderFalse"
        />
        <div
          v-if="isError && !isMaintained" :data-url="gameImgUrl"
          class="absolute w-full h-full top-0 left-0 flex items-center justify-center flex-col bg-[#fff] text-[#9DABC9]"
        >
          <AfunBaseImage class="mb-[2px]" url="/m/afun-h5/png/game-img-error.png" width="24px" height="24px" />
          <span class="text-[10px]">{{ t('加载失败了x_x') }}</span>
        </div>
        <!-- 边框 -->
        <template v-if="showBorder">
          <img v-if="!isError" class="absolute w-full h-full z-10 top-0 left-0" :src="imageBorder" alt="">
          <div
            class="absolute max-w-[86%] whitespace-nowrap overflow-hidden text-ellipsis h-full top-0 left-0 text-[#6D7693] text-[11px] p-[6px]"
          >
            {{ data.name }}
          </div>
        </template>
        <!-- 维护 -->
        <div
          v-if="isMaintained"
          class="w-full h-full bg-[#fff] text-[#9DABC9] flex flex-col items-center justify-center"
        >
          <IconUniMaintained class="text-[24px] mb-[2px]" />
          <span class="text-[10px]">{{ t('场馆维护中') }}</span>
        </div>

        <!-- 收藏 -->
        <template v-else-if="$route.name !== 'Home' && false">
          <div class="size-[24px] center absolute z-1 top-0 right-0" @click.stop="collect">
            <div class="w-[16px] h-[16px] overflow-hidden rounded-full center bg-[rgba(255,255,255,0.7)]">
              <template v-if="isFavorite">
                <IconLikeActive class="text-[#f23038] text-[10px]" />
              </template>
              <template v-else>
                <IconLike class="text-[transparent] text-[10px]" />
              </template>
            </div>
          </div>
        </template>
      </div>
    </BaseAspectRatio>
    <div v-if="onlineCount && !isMaintained" class="mt-[4px] flex items-center text-[12px]">
      <span class="ml-[3px] mr-[8px] rounded-[50%] bg-[#24EE89] w-[6.5px] h-[6.5px]" />
      <span class="font-[600] mr-[6px]">{{ data.online_num }}</span>
      <span class="text-[#B1BAD3] font-[600]">{{ t('在玩') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.maintain {
  cursor: not-allowed;
}
</style>
