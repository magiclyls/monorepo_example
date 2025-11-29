export const useGlobalStatePageTitle = createGlobalState(() => {
  const globalPageTitle = ref('')

  return {
    globalPageTitle,
  }
})
