import type { Room } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { EnumLanguage } from '@tg/types'
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

export interface FeedBackItem {
  feed_id: string
  bonusState: 1 | 2
  [k: string]: any
}

const { VITE_SOCKET_PREFIX } = getEnv()

export const allSmileFace = [
  '😁',
  '😂',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😌',
  '😍',
  '😏',
  '😒',
  '😓',
  '😔',
  '😖',
  '😘',
  '😚',
  '😜',
  '😝',
  '😞',
  '😠',
  '😡',
  '😢',
  '😣',
  '😤',
  '😥',
  '😨',
  '😩',
  '😪',
  '😫',
  '😭',
  '😰',
  '😱',
  '😲',
  '😳',
  '😵',
  '😷',
  '😸',
  '😹',
  '😺',
  '😻',
  '😼',
  '😽',
  '😾',
  '😿',
  '🙀',
  '🙅',
  '🙆',
  '🙇',
  '🙈',
  '🙉',
  '🙊',
  '🙋',
  '🙌',
  '🙍',
  '🙎',
  '🙏',
  '😀',
  '😇',
  '😈',
  '😎',
  '😐',
  '😑',
  '😕',
  '😗',
  '😙',
  '😛',
  '😟',
  '😦',
  '😧',
  '😬',
  '😮',
  '😯',
  '😴',
  '😶',
  '💚',
  '💛',
  '💝',
  '💞',
  '💟',
  '💔',
  '💕',
  '💖',
  '💗',
]

export const allEmojis = [
  'adesanya.webp',
  'biden.webp',
  'beer.webp',
  'blob.webp',
  'catbread.webp',
  'coffee.webp',
  'cooldoge.webp',
  'coupon.webp',
  'coin.webp',
  'dendi.webp',
  'djokovic.webp',
  'doge.webp',
  'donut.webp',
  'easyms.webp',
  'eddie.webp',
  'elon.webp',
  'ezpz.webp',
  'feelsgoodman.webp',
  'gary.webp',
  'jordan.webp',
  'kanye.webp',
  'lambo.webp',
  'lebron.webp',
  'nyancat.webp',
  'lefroge.webp',
  'mahomes.webp',
  'mcgregor.webp',
  'messi.webp',
  'monkas.webp',
  'nadal.webp',
  'nightdoge.webp',
  'pepehands.webp',
  'pikachu.webp',
  'rish.webp',
  'ronaldo.webp',
  'woods.webp',
  'santa.webp',
  'stonks.webp',
  'sus.webp',
  'trump.webp',
  'umbrella.webp',
  'pepelaugh.webp',
  'pepe.webp',
  'poggers.webp',
]

export const useChatStore = defineStore('chat', () => {
  const route = useRoute()
  const { bool: hideChat, toggle: toggleChat } = useBoolean(false)
  const { bool: enableChat, setBool: setEnableChat } = useBoolean(true)
  const {
    bool: showFeedbackChat,
    setFalse: setFeedbackChatFalse,
    setTrue: setFeedbackChatTrue,
  } = useBoolean(false)
  const feedBackItem = ref<FeedBackItem | undefined>()

  const chatRoomList = reactive<Array<Room>>([
    { icon: 'flag-cn', label: '中文', value: 'zh-CN', apiValue: 'zh_CN' },
    { icon: 'flag-en', label: 'English', value: 'en-US', apiValue: 'en_US' },
    { icon: 'flag-vn', label: 'Tiếng Việt', value: 'vi-VN', apiValue: 'vi_VN' },
    { icon: 'flag-br', label: 'Português', value: 'pt-BR', apiValue: 'pt_BR' },
    { icon: 'flag-in', label: 'India', value: 'hi-IN', apiValue: 'hi_IN' },
    { icon: 'flag-thai', label: 'ประเทศไทย', value: 'th-TH', apiValue: 'th_TH' },
  ])

  const queryRoom = route.query.room
  const room = ref(chatRoomList.find(c => c.value === (queryRoom || getLang())) || chatRoomList[0])

  const deletedMsgs = ref<string[]>([])

  const currentLanguage = computed(() => room.value.value)
  const roomLang = computed(() => EnumLanguage[currentLanguage.value])
  const topic = computed(() => {
    const prefix = VITE_SOCKET_PREFIX
    const lang = EnumLanguage[currentLanguage.value]
    const _topic = `${prefix}/chat/${lang}`
    return _topic
  })
  const topic_del_msg = computed(() => {
    const prefix = VITE_SOCKET_PREFIX
    const _topic = `${prefix}/chat/del`
    return _topic
  })

  function setDelMsgs(id: string) {
    deletedMsgs.value.push(id)
  }

  function setRoom(r: Room) {
    room.value = r
  }

  function setFeedbackItem(v?: FeedBackItem) {
    feedBackItem.value = v
  }

  return {
    chatRoomList,
    room,
    currentLanguage,
    topic,
    topic_del_msg,
    deletedMsgs,
    roomLang,
    enableChat,
    hideChat,
    toggleChat,
    setDelMsgs,
    setRoom,
    showFeedbackChat,
    setFeedbackChatFalse,
    setFeedbackChatTrue,
    feedBackItem,
    setFeedbackItem,
    setEnableChat,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
