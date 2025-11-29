import { i18n } from '@tg/vue-i18n'

export function usePageTitle({ prefix = '', suffix = '', isT = false, isHost = true }:
{
  prefix: string | Ref | ComputedRef
  suffix?: string | Ref | ComputedRef
  isT?: boolean
  isHost?: boolean
}) {
  const host = location.host
  const npre = toRef(prefix)
  const nsuf = toRef(suffix)
  const { globalPageTitle } = useGlobalStatePageTitle()

  const { t } = i18n.global

  const pre = computed(() => npre.value && isT ? t(npre.value) : npre.value)
  const suf = computed(() => nsuf.value && isT ? t(nsuf.value) : nsuf.value)
  const joint = computed(() => pre ? ' - ' : '')
  const title = computed(() => `${pre.value ?? ''} ${suf.value ?? ''}`) // ${joint.value}${isHost ? host : ''}

  useTitle(title)
  globalPageTitle.value = title.value

  onMounted(() => {
    useTitle(title)
  })

  onActivated(() => {
    useTitle(title)
  })

  return {
    title,
  }
}
