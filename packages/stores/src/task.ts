import type { TaskDetail } from '@tg/types'
import { ApiJobTaskCategory, ApiJobTaskList } from '@tg/apis'
import { getLangForBackend } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest } from 'vue-request'

interface CateGory {
  id: string
  category_name: string
  state: number
}

export const useTaskStore = defineStore('task', () => {
  /**
   * 当前分类
   */
  const currentCategory = ref()
  const allCategory = ref<CateGory[]>([])
  const allCategoryDetail = ref<TaskDetail[]>([])
  // 修改当前分类
  function changeCurrentCategory(value: string) {
    currentCategory.value = value
  }
  /** 任务列表 */
  const { runAsync: getTaskListAsyncApi, loading: taskListDataLoading } = useRequest(ApiJobTaskList, {
    manual: true,
    onSuccess: (res) => {
      allCategoryDetail.value = res?.data
    },
  })
  /** 任务分类列表 */
  const { loading: taskLoading, runAsync: getTaskCategoryApi } = useRequest(ApiJobTaskCategory, {
    manual: true,
    onSuccess: (res) => {
      currentCategory.value = res?.categories && res.categories.length > 0 ? res?.categories[0].id : undefined
      allCategory.value = res?.categories && res.categories.length > 0 ? res?.categories : []
      res?.categories && res.categories.length > 0 && getTaskListAsyncApi({ lang: getLangForBackend() || 'en_US', category_id: currentCategory.value })
    },
  })

  return {
    currentCategory,
    taskLoading,
    allCategory,
    allCategoryDetail,
    taskListDataLoading,
    getTaskCategoryApi,
    getTaskListAsyncApi,
    changeCurrentCategory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
