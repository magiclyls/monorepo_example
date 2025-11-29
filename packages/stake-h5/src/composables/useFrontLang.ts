import { ApiMemberFrontLang } from '@tg/apis'
import { getEnv } from '@tg/utils';

export function useFrontLang() {
  const { VITE_OFFICIAL_NAME, VITE_OFFICIAL_DOMAIN } = getEnv()

  const { data: langData, runAsync: runAsyncFrontLang } = useRequest(ApiMemberFrontLang)

  function t(key: string, data?: { site?: string, domain?: string, host?: string }) {
    return langData.value && langData.value[key] ? langData.value[key]?.replace(/\{site\}/g, VITE_OFFICIAL_NAME)?.replace(/\{domain\}/g, VITE_OFFICIAL_DOMAIN) : ''
  }
  return {
    langData,
    runAsyncFrontLang,
    t,
  }
}
