<script setup lang='ts'>
import { BaseImage } from '@tg/bccomponents'
import { IconChatClose, IconChatPicture, IconChatVideo } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { getBrandInfo } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ChatBaseButton from '../components/ChatBaseButton.vue'
import ChatBaseInput from '../components/ChatBaseInput.vue'
import { useLocale } from '../components/ChatConfigProvider'
import ChatDateTag from '../components/ChatDateTag.vue'
import ChatEmojiContainer from '../components/ChatEmojiContainer.vue'
import ChatMessageItem from '../components/ChatMessageItem.vue'
import ChatToast from '../components/ChatToast.vue'
import { useChatConfig } from '../config'
import { useChatKefuService } from '../hooks/useChatKefuService'

defineOptions({ name: 'AppChatHome' })
const props = withDefaults(defineProps<{
  sign?: string
  isH5?: boolean
  onClose?: () => void
}>(), {
  isH5: true,
})

const showEmoji = ref(false)
const chatInputRef = ref<{ appendEmoji: (emoji: string) => void } | null>(null)
const videoInputRef = ref<HTMLInputElement | null>(null)
const imageInputRef = ref<HTMLInputElement | null>(null)
const chatMessageRef = ref<HTMLDivElement | null>(null)
const isScrolling = ref(false)
const activeStickyIndex = ref<number | null>(null) // 記錄當前應該顯示的 sticky date index
let scrollTimer: ReturnType<typeof setTimeout> | null = null

const { ensureToken, getMessageList, checkIsNewQueue, sendNotice, sendMessage, getCheckMessage, getPollingMessage, registerWsDisconnectHandler, registerWsConnectHandler, getRobotSentence, getIsBot, getIsSend, getAdv } = useChatKefuService()
const config = useChatConfig()
const messages = computed(() => getMessageList())
const messageText = ref('')
const BLogoImg = getBrandInfo('pc.pc_logo_white')
const SLogoImg = getBrandInfo('pc.pc_first_letter')
const router = useRouter()
const { $$t } = useLocale()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

function handleClose() {
  if (props.isH5 === false && props.onClose) {
    props.onClose()
  }
  else {
    router.back()
  }
}

const logoImg = computed(() => {
  if (currentGlobalCurrencyMap.value.balance.length > 18) {
    return SLogoImg
  }
  else {
    return BLogoImg
  }
})

const pollingTimer = ref<number | null>(null)
let unregisterWsDisconnect: (() => void) | null = null
let unregisterWsConnect: (() => void) | null = null
async function setupChatSession() {
  const result = await ensureToken({
    kefuUrl: config?.kefuUrl,
    userName: config?.userName,
    lang: config?.lang,
    sign: config.sign,
  })
  if (result.is_bot === 0) {
    // 真人客服，會判斷新舊對話做不同處理
    const isNewQueue = await checkIsNewQueue()
    if (isNewQueue) {
      // await sendNotice()
    }
    else {
      await getCheckMessage()
    }
  }
  else {
    // 機器人客服，直接開始輪詢
    await getRobotSentence('')
  }
}

onMounted(async () => {
  unregisterWsDisconnect = registerWsDisconnectHandler(handleWsDisconnect)
  unregisterWsConnect = registerWsConnectHandler(handleWsConnect)

  await setupChatSession()

  if (chatMessageRef.value)
    chatMessageRef.value.addEventListener('scroll', handleScroll)
  await nextTick()
  scrollToBottom()
  setupIntersectionObserver()
})

watch(
  () => messages.value.length,
  async () => {
    if (isScrolling.value)
      return
    await nextTick()
    scrollToBottom()
    // 消息改變後重新計算 active date tag
    await nextTick()
    updateActiveDateTag()
  },
)

onBeforeUnmount(() => {
  clearPollingTimer()
  if (chatMessageRef.value)
    chatMessageRef.value.removeEventListener('scroll', handleScroll)
  unregisterWsDisconnect?.()
  unregisterWsConnect?.()
})

// 設置 Intersection Observer
function setupIntersectionObserver() {
  if (!chatMessageRef.value)
    return

  const observer = new IntersectionObserver(
    (entries) => {
      updateActiveDateTag()
    },
    {
      root: chatMessageRef.value,
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: '0px',
    },
  )

  // 觀察所有 date tags
  nextTick(() => {
    const dateTags = chatMessageRef.value?.querySelectorAll('[data-date-tag]')
    dateTags?.forEach(tag => observer.observe(tag))
  })
}

// 更新當前應該顯示的 date tag
function updateActiveDateTag() {
  if (!chatMessageRef.value)
    return

  const container = chatMessageRef.value
  const dateTags = container.querySelectorAll('[data-date-tag]')
  if (dateTags.length === 0) {
    activeStickyIndex.value = null
    return
  }

  // 如果滾動到頂部，清除 active
  if (container.scrollTop === 0) {
    activeStickyIndex.value = null
    return
  }

  const containerRect = container.getBoundingClientRect()
  const topDates: Array<{ index: number, relativeTop: number }> = []

  // 找到所有在頂部附近的 date tag
  dateTags.forEach((tag) => {
    const rect = tag.getBoundingClientRect()
    const relativeTop = rect.top - containerRect.top
    const index = Number((tag as HTMLElement).getAttribute('data-date-index'))

    // 只關注在頂部 50px 範圍內的
    if (relativeTop <= 50) {
      topDates.push({ index, relativeTop })
    }
  })
  // 按索引降序排列，取最大的（最靠近當前位置的最後一個）
  if (topDates.length > 0) {
    topDates.sort((a, b) => b.index - a.index)
    activeStickyIndex.value = topDates[0].index
  }
}

function handleScroll() {
  isScrolling.value = true
  setupIntersectionObserver()
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = setTimeout(() => {
    isScrolling.value = false

    // 如果滾動到頂部，清除 active sticky
    if (chatMessageRef.value && chatMessageRef.value.scrollTop === 0) {
      activeStickyIndex.value = null
    }
  }, 500)
}

function handleWsDisconnect() {
  clearPollingTimer()
}

function handleWsConnect() {
  startPolling()
}

function clearPollingTimer() {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

function startPolling() {
  clearPollingTimer()
  pollingTimer.value = window.setInterval(async () => {
    try {
      await getPollingMessage()
    }
    catch (error) {
      console.error('聊天輪詢失敗', error)
    }
  }, 3000)
}

function scrollToBottom() {
  const container = chatMessageRef.value
  if (!container)
    return
  container.scrollTop = container.scrollHeight
}

async function setMessageList() {
  if (!getIsSend())
    return
  const content = messageText.value.trim()
  if (!content)
    return
  if (getIsBot()) {
    await getRobotSentence(content)
  }
  else {
    await sendMessage({ text: content })
  }
  messageText.value = ''
}

async function handleLinkClick(linkText: string) {
  // 當點擊機器人消息中的 submitLink 鏈接時，發送鏈接文字給機器人
  if (getIsBot()) {
    try {
      await getRobotSentence(linkText)
    }
    catch (error) {
      console.error('發送鏈接消息失敗', error)
    }
  }
}

function onShowEmoji(value: boolean) {
  showEmoji.value = value
}

function onSelectEmoji(emoji: string) {
  chatInputRef.value?.appendEmoji(emoji)
}

function onChooseVideo() {
  if (!getIsSend())
    return
  videoInputRef.value?.click()
}

async function onVideoSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return
  try {
    const imageUrl = await readFileAsDataUrl(file)
    await sendMessage({ video: imageUrl })
  }
  catch (error) {
    console.error('上傳圖片失敗', error)
  }
  finally {
    target.value = ''
  }
}

function onChooseImage() {
  if (!getIsSend())
    return
  imageInputRef.value?.click()
}

async function onImageSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return
  try {
    const imageUrl = await readFileAsDataUrl(file)
    await sendMessage({ images: [imageUrl] })
  }
  catch (error) {
    console.error('上傳圖片失敗', error)
  }
  finally {
    target.value = ''
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('圖片讀取失敗'))
    reader.readAsDataURL(file)
  })
}

// 判斷該 date tag 是否應該隱藏
function shouldHideDateTag(index: number): boolean {
  // 如果沒有 active sticky，都不隱藏
  if (activeStickyIndex.value === null)
    return false

  // 如果是當前 active 的，不隱藏
  if (index === activeStickyIndex.value)
    return false

  // 索引比 active 小的（更早的消息）都隱藏
  if (index < activeStickyIndex.value)
    return true

  // 索引比 active 大的（更晚的消息）不隱藏
  return false
}
</script>

<template>
  <ChatToast />
  <div class="chat-container" :style="{ height: '100%' }">
    <div class="chat-header flex items-center justify-between h-[60px] px-[12px] py-[17px] z-fixed ">
      <BaseImage is-network :url="logoImg" class="h-[29px] w-auto" width="auto" />
      <IconChatClose class="cursor-pointer" @click="handleClose" />
    </div>
    <div ref="chatMessageRef" class="chat-message">
      <div v-if="getAdv()" v-html="getAdv()" />
      <template v-for="(item, index) in messages" :key="item.cid || `${item.name}-${index}`">
        <ChatDateTag
          v-if="item.role === 'date'"
          :date="item.content[0]"
          :should-hide="shouldHideDateTag(index)"
          :data-date-tag="true"
          :data-date-index="index"
        />
        <ChatMessageItem
          v-else
          :is-h5="props.isH5"
          :role="item.role"
          :text="item.content"
          :name="item.name ?? ''"
          :time="item.time"
          :avatar="item.avatar ?? ''"
          @link-click="handleLinkClick"
        />
      </template>

      <ChatEmojiContainer
        :model-value="showEmoji"
        @update:model-value="onShowEmoji"
        @select="onSelectEmoji"
      />
    </div>
    <div class="bg-[#203844] p-[16px]">
      <div>
        <ChatBaseInput
          ref="chatInputRef"
          v-model:text="messageText"
          :model-value="showEmoji"
          :is-h5="props.isH5"
          :disabled="!getIsSend()"
          @update:model-value="onShowEmoji"
          @keydown.enter="setMessageList"
        />
      </div>
      <div class="flex justify-end gap-[12px] mt-[8px] mb-[9px]">
        <input
          ref="videoInputRef"
          type="file"
          accept="video/*"
          class="hidden"
          @change="onVideoSelected"
        >
        <ChatBaseButton type="secondary" @click="onChooseVideo">
          <template #icon>
            <IconChatVideo class="w-[16px] h-[16px] text-[#fff] mx-[15px] my-[12px]" />
          </template>
        </ChatBaseButton>
        <input
          ref="imageInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onImageSelected"
        >
        <ChatBaseButton type="secondary" @click="onChooseImage">
          <template #icon>
            <IconChatPicture class="w-[16px] h-[16px] text-[#fff] mx-[15px] my-[12px]" />
          </template>
        </ChatBaseButton>
        <ChatBaseButton :text="$$t('发送')" @click="setMessageList" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.chat-container {
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: #0f212f;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.12);
}

.chat-message {
  background: #0f212f;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
}
</style>
