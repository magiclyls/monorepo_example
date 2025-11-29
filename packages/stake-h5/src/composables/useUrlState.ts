export function useUrlState<T>(urlName: string) {
  const name = ref<T>()

  const handleUrlChange = () => {
    const modalName = getParamsQuery<T>(urlName)
    console.log('modalName', modalName)

    if (modalName === name.value)
      return

    name.value = modalName
  }

  onMounted(() => {
    window.addEventListener('replaceState', handleUrlChange)
  })

  onUnmounted(() => {
    window.removeEventListener('replaceState', handleUrlChange)
  })

  return { name }
}
