import { HttpClient } from 'feie-ui'
import { i18n } from '@tg/vue-i18n'
import { router } from '~/modules/router'
import { TIMEZONE } from '~/utils/enums'

const { VITE_HTTP_TIMEOUT, PROD } = getEnv()

const timeZoneList = [
  { label: '世界 UTC+0', value: TIMEZONE.ETC, time_zone: 'utc', offset: 0 },
  { label: '美东时间 UTC-4', value: TIMEZONE.USA, time_zone: 'en_US', offset: 240 },
  { label: '中国 UTC+8', value: TIMEZONE.CST, time_zone: 'zh_CN', offset: -480 },
  { label: '泰国 UTC+7', value: TIMEZONE.THAILAND, time_zone: 'th_TH', offset: -420 },
  { label: '越南 UTC+7', value: TIMEZONE.VIETNAM, time_zone: 'vi_VN', offset: -420 },
  { label: '巴西 UTC-3', value: TIMEZONE.BRT, time_zone: 'pt_BR', offset: 180 },
  { label: '印度 UTC+5:30', value: TIMEZONE.INDIA, time_zone: 'hi_IN', offset: 330 },
  { label: '印度尼西亚 UTC+7', value: TIMEZONE.INDONESIA, time_zone: 'id_ID', offset: -420 },
  { label: '韩国 UTC+9', value: TIMEZONE.KOREA, time_zone: 'ko_KR', offset: -540 },
  { label: '日本 UTC+9', value: TIMEZONE.JAPAN, time_zone: 'ja_JP', offset: -540 },
]

/** 传参需要Cbor加密的接口 */
const cborUrlList = [
  '/member/login',
  '/member/reg',
]

const timeOffset = new Date().getTimezoneOffset()
const timeZone = timeZoneList.filter(tz => tz.offset === timeOffset)[0] ?? timeZoneList[0]

interface IResponse<T> {
  status: boolean
  data: T
  tip?: string
}

const { t } = i18n.global
const { openNotify } = useNotify()
// const { openLoginDialog } = useLoginDialog()

function getMsgByCode(data: any) {
  switch (data) {
    case '5023':
      return t('balance_not_enough')
    default:
      return undefined
  }
}

const dataIsTokenHandler = debounce((responseStatus: any, response: any) => {
  const appStore = useAppStore()
  const { closeRightSidebar, rightIsExpand } = useRightSidebar()
  const { setCloseAllDialog } = useDialogState()
  setCloseAllDialog(true)
  appStore.removeToken()
  appStore.removeUserInfo()
  appStore.setMqttConnectedFalse()
  socketClient.connect('token失效 重新连接')
  if (rightIsExpand.value)
    closeRightSidebar()

  openNotify({
    type: 'error',
    code: `${responseStatus}`,
    message: `
              ${isTestEnv() ? `Url: ${response.config.url}<br />` : ''}
              ${t('login_fail_tip')}
            `,
  })
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
    setTimeout(() => {
      appEventBus.emit(EventBusNames.NEED_LOGiN_MSG)
    }, 500)
  }
  // openLoginDialog()
}, 4000, {
  leading: true,
  trailing: false,
})
const sportsMaintainHandler = debounce(() => {
  if (router.currentRoute.value.path.includes('sports')) {
    setIsSportsMaintained(true)
    router.push(`/${getCurrentUrlLanguage()}/sport-maintained`)
  }
}, 4000, {
  leading: true,
  trailing: false,
})

function getDevice(url: string) {
  if (isPwa() && (url.includes('/member/reg')
    || url.includes('/member/login') || url.includes('/member/third/register')
    || url.includes('/deposit/bank/application')
    || url.includes('/third/deposit')
    || url.includes('/deposit/coin/application')
    || url.includes('/deposit/coin/application')
    || url.includes('/job/task/')
  ))
    return 28

  const isMobile = window.innerWidth <= 768
  if (isMobile)
    return 25
  else return 24
}

/**
 * 不需要错误提示的接口
 */
const noNotifyArr = [
  '/game/original/mines',
  '/member/agency/config',
  '/member/agency/valid/member/count',
  '/member/agency/valid/member/detail',
  '/member/promo/red/detail',
]

export function apiStatusFalse(response) {
  const { status, data, tip } = response.data as IResponse<any>
  // console.log('🦺🦺🦺 ~ data:', response.config.url, data)
  console.log('🚀 ~ data:', data)

  const responseStatus = response.status

  let tipMsg = ''
  if (tip && tip !== '0')
    tipMsg = tip

  if (!status) {
    // 如果后端返回token，关闭所有请求，清除token
    if (data === 'token') {
      dataIsTokenHandler(responseStatus, response)
    }
    else if (data === 'maintain') {
      return sportsMaintainHandler()
    }
    else if (data.includes('member-verify')) {
      return Promise.reject(new Error(JSON.stringify(response.data)))
    }
    else {
      let requestData = {
        noNotify: false,
      }
      if (noNotifyArr.includes(response.config.url))
        requestData = response.config.data ? JSON.parse(response.config.data) : requestData

      if (!response.config.params?.noNotify && !requestData.noNotify && data !== '5024') {
        // 打印请求参数
        openNotify({
          type: response.config.url.includes('/chat/send') ? 'chat' : 'error',
          code: `${responseStatus}`,
          title: tipMsg,
          // ${isTestEnv() ? `Url: ${response.config.url}<br />` : ''}
          message: `
                ${(getMsgByCode(data) ?? data) || t('sys_error')}
              `,
        })
      }
    }
  }
  return response
}

