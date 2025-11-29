import type { StatisticsType } from './statistics'
import type { TTheme } from '@tg/types'
import type { BrandInfoType } from '~/types'
import { ApiMemberBrandDetail, ApiMemberChannelTrackConfigDetail } from '@tg/apis'
import { getLang, setServerLangMap } from '@tg/vue-i18n'

let sportsMaintainedStatus: Promise<boolean> | null = null

/**
 * 首页模板
 * stake-黑色  值 1
 * stake-绿  值 2
 * bc.game  值 3
 * 大老板制定的首页-白 值 4
 * 青黑 -- 值 5
 * 新版黑色stake -- 值 6
 */
export type HomeTemplate = typeof EnumsTheme[keyof typeof EnumsTheme]

interface GlobalInitMap {
  /** 体育馆维护状态 */
  isSportsMaintained: boolean | null
  /** 体育馆维护开始时间 */
  sportsMaintainedStartTime: number | null
  /** 体育馆维护结束时间 */
  sportsMaintainedEndTime: number | null
  /** 默认跳转首页 */
  defaultRedirect: string
  /** 全局全参数品牌信息 */
  allBrandInfo: BrandInfoType | null
  /** 当前是什么首页模板 */
  currentTemplate: HomeTemplate
  /** 当前是什么主题模板 */
  currentTheme: TTheme
  /** 是否打开注册弹窗 */
  isOpenRegisterDialog: boolean
  /** 是否打开登录弹窗 */
  isOpenLoginDialog: boolean
  /** 是否打开下载弹窗 */
  isOpenDownLoadDialog: boolean
  /** 是否打开底部下载弹窗 */
  isOpenDownLoadDialogBottom: boolean
  /** 是不是pc渲染h5模式 */
  isPcRenderH5: boolean
}

/** 全局初始化数据 */
const globalInitMap = reactive<GlobalInitMap>({
  isSportsMaintained: null,
  sportsMaintainedStartTime: null,
  sportsMaintainedEndTime: null,
  defaultRedirect: 'casino',
  allBrandInfo: null,
  currentTemplate: 1,
  isOpenRegisterDialog: false,
  isOpenLoginDialog: false,
  isOpenDownLoadDialog: false,
  currentTheme: '',
  isOpenDownLoadDialogBottom: false,
  isPcRenderH5: false,
})

/**
 * 设置体育馆维护状态
 * @param status
 */
export function setIsSportsMaintained(status: boolean) {
  globalInitMap.isSportsMaintained = status
}

/**
 * 设置体育馆维护开始时间和结束时间
 * @param time
 */
export function setSportsMaintainedTime(startTime: number, endTime: number) {
  globalInitMap.sportsMaintainedStartTime = startTime * 1000
  globalInitMap.sportsMaintainedEndTime = endTime * 1000
}

/**
 * 获取体育馆维护状态
 * @returns {Promise<boolean>}
 */
export async function getSportsMaintainedStatus(): Promise<boolean> {
  const { VITE_SITE_NAME } = import.meta.env
  sportsMaintainedStatus = new Promise((resolve, reject) => {
    if (VITE_SITE_NAME === 'win6' && !location.href.includes('sports')) {
      setIsSportsMaintained(false)
      resolve(globalInitMap.isSportsMaintained as boolean)
    }

    // ApiMemberPlatformList({ game_type: 4, auth: false, page: 1, page_size: 10 }).then((res) => {
    const res = globalInitMap.allBrandInfo?.smaint
    if (res === null || res === undefined || !res) {
      setIsSportsMaintained(false)
      resolve(globalInitMap.isSportsMaintained as boolean)
    }
    else {
      // const currentProvider = res.d[0].id
      // const sportsObj = res.d.find(a => a.id === currentProvider)
      setIsSportsMaintained(+res?.state === 2)
      setSportsMaintainedTime(res?.st ?? 0, res?.et ?? 0)

      resolve(globalInitMap.isSportsMaintained as boolean)
    }
    // }).catch((err) => {
    //   console.error('err', err)
    //   reject(err)
    // })
  })

  return sportsMaintainedStatus
}

/**
 * 请求页面初始化跳转
 * @returns void
 */
export function requestPageInitRedirect() {
  const params = new URLSearchParams(document.location.search)
  const c = params.get('c') || undefined
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ApiMemberBrandDetail({ c }).then((res) => {
        window.brandDetail = res

        setServerLangMap((res?.base?.lang?.d || []) as string[])
        window.brandDetail  = res
        window.langChoosed = getLang()
        // ⚠️sg没有的模板则展示模板1
        const tpls = Object.values(EnumsTheme).filter(v => typeof v === 'number') as number[]
        if (!tpls.includes(res.tpl))
          res.tpl = 1

        // 初始化主题
        themeInit(1)
        addScriptToHead(res?.code || '')

        // const _env = import.meta.env
        // _env.VITE_I18N_DEFAULT_LANG = 'pt-BR'

        // // 1首页，2娱乐城，3体育，4联盟中心
        // 需求变更：1首页 2注册 3登录 4体育
        globalInitMap.allBrandInfo = res
        const { location: linkLocation } = res
        if (linkLocation) {
          if (+linkLocation === 1)
            globalInitMap.defaultRedirect = 'casino'

          else if (+linkLocation === 4)
            globalInitMap.defaultRedirect = 'sports/401'

          else if (+linkLocation === 2 && !checkLogin())
            globalInitMap.isOpenRegisterDialog = true
            // setTimeout(() => {
          // openRegisterDialog()
            // }, 3000)

          else if (+linkLocation === 3 && !checkLogin())
            globalInitMap.isOpenLoginDialog = true
            // setTimeout(() => {
          // openLoginDialog()
            // }, 3000)
        }
        try {
          const obj = JSON.parse((globalInitMap.allBrandInfo?.pc?.home_app_download || '{}') as string)
          const temp = obj.flag && +obj.flag === 2 ? obj.customize : obj.official
          const isPopUP = (temp?.popup)
          const isPopUPBottom = (JSON.parse((globalInitMap.allBrandInfo?.pc?.bottom_app_download || '{}') as string)?.popup)
          if (isPopUP === false && !checkLogin())
            globalInitMap.isOpenDownLoadDialog = true
          if (isPopUPBottom === false && !checkLogin())
            globalInitMap.isOpenDownLoadDialogBottom = true
        }
        catch {}

        getSportsMaintainedStatus()
        resolve(+res)
      }).catch((err: Error) => {
        console.error('er123r', err?.message)
        let data
        try {
          data = JSON.parse(err?.message)
          if (data && data.data) {
            console.log('data ======== ++++++ ', data.data)
            globalInitMap.allBrandInfo = data.data
          }
        }
        catch (err) {
          console.log('catch err = ', err)
        }
        reject(err)
      })
    }, 1000)
  })
}

/**
 * 获取埋点信息配置
 */
export function getChannelTrackConfig(): Promise<StatisticsType[]> {
  return new Promise((resolve, reject) => {
    ApiMemberChannelTrackConfigDetail({ url: document.location.href }).then((res) => {
      /** 这个变量暂时没用 */
      const statusNameList: StatisticsType[] = []
      // 设置id缓存
      if (res && res.length) {
        res.forEach((p) => {
          switch (p.track_name) {
            case 'google':
              localStorage.setItem('tggoogleId', JSON.stringify({
                value: p.track_id,
              }, null, 2))
              statusNameList.push('google')
              break
            case 'facebook':
              localStorage.setItem('tgfacebookId', JSON.stringify({
                value: p.track_id,
              }, null, 2))
              statusNameList.push('facebook')
              break
            case 'kwai':
              localStorage.setItem('tgkwaiId', JSON.stringify({
                value: p.track_id,
              }, null, 2))
              statusNameList.push('kwai')
              break
            case 'tiktok':
              localStorage.setItem('tgtiktokId', JSON.stringify({
                value: p.track_id,
              }, null, 2))
              statusNameList.push('tiktok')
              break
          }
        })
      }
      resolve(statusNameList)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function globalInit() {
  return Promise.all([
    requestPageInitRedirect(),
  ])
}

export {
  globalInitMap,
}

function themeInit(tpl: HomeTemplate) {
  const paramsThemme = new URLSearchParams(window.location.search)?.get('theme')
  globalInitMap.currentTheme = EnumsTheme[tpl || 1] as TTheme
  // 优先读取查询参数主题
  const theme = paramsThemme as TTheme || globalInitMap.currentTheme
  document.documentElement.setAttribute('theme', theme)
  initTheme()
  changeMetaTheme(theme)
  globalInitMap.currentTemplate = tpl || 1
}

export function changeMetaTheme(theme: TTheme) {
  const metaTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
  let themeColor = ''
  if (theme === 'green')
    themeColor = '#235337'
  else if (theme === 'bcgame')
    themeColor = '#1a2c38'
  else if (theme === 'white')
    themeColor = '#ffffff'
  else if (theme === 'greenblack')
    themeColor = '#282828'
  else
    themeColor = '#1a2c38'
  if (metaTag)
    metaTag.content = themeColor
}
