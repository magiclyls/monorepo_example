/**
 * 站点配置
 */

// 支持的站点类型
export type SiteType = 'x02' | 'v03'

// 站点配置接口
export interface SiteConfig {
  domains: string
  csUrl: string
  downloadAndroid: string
  downloadIos: string
  mainDomain: string
  siteName: string
}

// 站点配置映射
export const SITE_CONFIGS: Record<SiteType, SiteConfig> = {
  x02: {
    domains: 'https://x71279.com:14359,https://x71696.com:14359,https://x71887.com:14359,https://x72637.com:14359,https://x72637.com:14359',
    csUrl: 'https://a18111.com#/?business_id=150&access_key=C8B3111B9F0467651D4EB62DA14D1439',
    downloadAndroid: '',
    downloadIos: '',
    mainDomain: 'https://x78671.com:51886,https://x78682.com:51886,https://x78985.com:51886',
    siteName: '新葡京',
  },
  v03: {
    domains: 'https://v96617.com:14126,https://v96621.com:14126,https://v96629.com:14126,https://v96673.com:14126,https://v96977.com:14126',
    csUrl: 'https://a18111.com/#/?business_id=151&access_key=702B2981D231BD216A8A7E98C397285D',
    downloadAndroid: '',
    downloadIos: '',
    mainDomain: 'https://v97719.com:14126,https://v97277.com:14126,https://v97729.com:14126',
    siteName: '威尼斯人',
  },
}

// 获取当前站点类型
export function getCurrentSite(): SiteType {
  return (window.site as SiteType) || 'x02'
}

// 获取当前站点配置
export function getCurrentSiteConfig(): SiteConfig {
  const site = getCurrentSite()
  return SITE_CONFIGS[site]
}

// 设置站点类型
export function setSite(site: SiteType) {
  window.site = site
}
