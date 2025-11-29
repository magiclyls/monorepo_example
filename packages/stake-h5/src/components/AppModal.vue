<script lang="ts" setup>
import { type ModalType } from '~/stores/modal'

const { lockScroll } = useScrollPrevent()
const queryModalName = ref(getParamsQuery('modal') as ModalType | null)
const modalStore = useModalStore()
const { modalState } = storeToRefs(modalStore)
const curComponent = getReloadDialog()

function getReloadDialog() {
  if (queryModalName.value === 'bg-login' || queryModalName.value === 'bg-register')
    return defineAsyncComponent(() => import('./AppBcGameUserLoginOrRegister.vue'))

  return null
}

onMounted(() => {
  setTimeout(() => {
    const allScrollYEl = document.querySelectorAll('.dialog2-background.dialog4-background')
    lockScroll(allScrollYEl)
  }, 300)

  if (curComponent)
    modalStore.showModal()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modalState.isShow" class="dialog2-background dialog4-background fixed bottom-0 left-0 right-0 top-0 z-[1001] flex items-center justify-center">
      <component :is="curComponent" v-if="curComponent" />
    </div>
  </Teleport>
</template>
