import { computed, ref } from 'vue'

/**
 * 消息列表通用 Hook
 * 處理消息標題翻譯和資料格式化
 */
export function useMessageList() {
  const list = ref<any[]>([])
  const total = ref(0)
  const page = ref(1)

  /**
   * 獲取消息標題的翻譯
   */
  function getMessageTitle(title: string, t: (key: string) => string): string {
    switch (title) {
      case 'withdraw_success':
        return t('提款成功')
      case 'withdraw_fail':
        return t('提款失败')
      case 'deposit_success':
        return t('存款成功')
      case 'deposit_fail':
        return t('存款失败')
      case 'deposit_in_process':
        return t('存款进行中')
      case 'withdraw_in_process':
        return t('提款进行中')
      default:
        return title
    }
  }

  /**
   * 格式化後的列表（需要傳入 t 函數）
   */
  function getFormattedList(t: (key: string) => string) {
    return computed(() => {
      return list.value.map(item => ({
        ...item,
        originalTitle: item.title, // 保留原始英文
        title: getMessageTitle(item.title, t), // 翻譯成中文
      }))
    })
  }

  /**
   * 設置列表資料
   */
  function setList(data: any[], isFirstPage = false) {
    if (isFirstPage) {
      list.value = data
    }
    else {
      list.value = [...list.value, ...data]
    }
  }

  /**
   * 重置列表
   */
  function resetList() {
    list.value = []
    page.value = 1
    total.value = 0
  }

  return {
    list,
    total,
    page,
    getMessageTitle,
    getFormattedList,
    setList,
    resetList,
  }
}
