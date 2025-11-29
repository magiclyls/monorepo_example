import type { Locale } from '@tg/vue-i18n'
import { install, setLocalesMessages } from '@tg/vue-i18n'

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../locales/*.json'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.json$/)?.[1], loadLocale]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

setLocalesMessages(localesMap)

export { install }
