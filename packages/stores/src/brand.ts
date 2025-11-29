import type { BrandInfoType, EnumLanguageKeys } from '@tg/types'
import { ApiMemberBrandDetail } from '@tg/apis'
import { TIMEZONE_LABEL_KEY } from '@tg/types'
import { globalInitMap } from '@tg/utils'
import { changeLanguage, i18n } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'

/**
 * @description 会员品牌配置
 */
export const useBrandStore = defineStore('brand', () => {
  const { t } = i18n.global
  const isFetchOk = ref(false)
  const brandChangeNum = ref(1)
  const { locale } = useI18n()
  const brandConfig = ref<BrandInfoType | null>(null)
  const langChoosed = ref<EnumLanguageKeys | undefined>(window.langChoosed)

  const { runAsync: runAsyncBrandBaseDetailInner, refreshAsync: refreshAsyncBrandBaseDetail } = useRequest(ApiMemberBrandDetail, {
    manual: true,
    onSuccess: (res) => {
      isFetchOk.value = true
      if (res?.base?.lang?.f === 1 && res?.base?.lang?.d && typeof res.base.lang.d === 'string') {
        const lang = res.base.lang.d.replace('_', '-') as EnumLanguageKeys
        window.langChoosed = lang
        langChoosed.value = lang
        if (locale.value !== lang) {
          changeLanguage(lang)
        }
      }
      else {
        window.langChoosed = undefined
        langChoosed.value = undefined
      }

      brandChangeNum.value++
      globalInitMap.allBrandInfo = res
      brandConfig.value = res
    },
  })

  async function runAsyncBrandBaseDetail() {
    await runAsyncBrandBaseDetailInner()
  }

  const brandBase = computed(() => brandConfig.value?.base)
  const brandAmount = computed(() => brandConfig.value?.amount)
  const brandThird = computed(() => brandConfig.value?.third)
  const brandPc = computed(() => brandConfig.value?.pc)
  const brandKf = computed(() => brandConfig.value?.kf)
  const brandReg = computed(() => brandConfig.value && brandConfig.value.reg && brandConfig.value.reg.length ? brandConfig.value.reg[0] : undefined)
  const brandApp = computed(() => brandConfig.value?.app)

  const isOpenVerify = computed(() => {
    return brandBase.value?.verify?.all || brandBase.value?.verify?.otp
  })
  const isOpenPayPwd = computed(() => {
    return brandBase.value?.verify?.all || brandBase.value?.verify?.password
  })

  /**
   * 是否开启手机验证
   *
   * 默认关闭
   */
  const isOpenMobileVerify = computed(() => {
    const reg = brandConfig.value?.reg
    if (reg)
      return reg[0].phone.verify

    return false
  })

  /**
   * 是否开启邮箱验证
   *
   * 默认关闭
   */
  const isOpenEmailVerify = computed(() => {
    const reg = brandConfig.value?.reg
    if (reg)
      return reg[0].mail.verify

    return false
  })

  /**
   * 当前验证类型
   *
   * 用于判断当前验证类型，显示不同的验证组件
   */
  const verifyType = computed(() => {
    if (isOpenEmailVerify.value)
      return 'email'

    if (isOpenMobileVerify.value)
      return 'mobile'

    return null
  })

  /**
   * 是否开启KYC验证
   */
  const isKYCVerifyOpen = computed(() => brandBase.value?.kyc === 1 && brandBase.value?.lang.d?.includes('pt_BR'))
  /**
   * 注册是否打开CPF字段
   * 后台开启kyc并且语言包含葡语
   */
  const isOpenCPFOnRegister = computed(() => isKYCVerifyOpen.value && brandBase.value?.lang.d?.includes('pt_BR'))

  /** 是否开启了脸部识别验证 - 用于忘记密码、删除账户 */
  const isFaceVerificationOpen = computed(() => isKYCVerifyOpen.value && brandBase.value?.verification === 2)

  /** 是否开启了脸部识别验证 - 用于长时间未登录 */
  const isRegFaceVerificationOpen = computed(() => isKYCVerifyOpen.value && brandReg.value?.verification === 2)

  /** 是否开启强制极速入款（payment_type 3/代付/二维码展示） */
  const isOpenFastDeposit = computed(() => brandConfig.value?.base?.fast === 1)

  /** 后台是否开启存款PWA功能 */
  const isDepositPWAOpen = computed(() => brandBase.value?.pwaSetting?.pwaEnabled)

  /** 保险库、利息宝是否开启 1是开启 */
  const isSafeInterestOpen = computed(() => brandBase.value?.interest === 1)

  /** 后台是否开启登陆PWA功能 */
  const isLoginPWAOpen = computed(() => brandBase.value?.loginPwa)

  /** 时区转换为文字 */
  const timeZoneToText = computed(() => {
    if (brandBase.value && brandBase.value.default.timezone)
      return t(TIMEZONE_LABEL_KEY[brandBase.value.default.timezone])

    return ''
  })
  /** 时区：仅数字 如：UTC+9 */
  const timeZoneToTextWithoutRegion = computed(() => {
    const regex = /UTC[+-]?\d+(?:\.\d+)?/g
    return timeZoneToText.value.match(regex)
  })

  /**
   * Logo，Ico，Loading 图片
   */
  const logoAndIcoAndLoading = computed(() => {
    if (brandPc.value) {
      return {
        logo_white: brandPc.value.pc_logo_white,
        logo_gray: brandPc.value.pc_logo_gray,
        ico: brandPc.value.pc_icon || '',
        loadingImgUrl: brandPc.value.pc_loading?.image ?? '',
        first_letter: brandPc.value.pc_first_letter,
        after_login: brandPc.value.pc_logo_white_after_login,
      }
    }
    return {
      logo_white: '',
      logo_gray: '',
      ico: '',
      loadingImgUrl: '',
      first_letter: '',
    }
  })

  return {
    isFetchOk,
    logoAndIcoAndLoading,
    isOpenMobileVerify,
    isOpenEmailVerify,
    brandConfig,
    verifyType,
    brandChangeNum,
    runAsyncBrandBaseDetail,
    refreshAsyncBrandBaseDetail,
    /** 站点基础信息 check：1-谷歌验证 2-资金密码 3-全部 */
    brandBase,
    brandPc,
    brandKf,
    brandReg,
    brandAmount,
    brandThird,
    brandApp,
    /** 站点是否开启双重验证 */
    isOpenVerify,
    /** 站点是否开启资金密码 */
    isOpenPayPwd,
    langChoosed,
    /** 站点是否开启KYC验证 */
    isKYCVerifyOpen,
    /** 注册是否打开CPF字段 */
    isOpenCPFOnRegister,
    /** 是否开启强制极速入款 */
    isOpenFastDeposit,
    /** 后台是否开启存款PWA功能 */
    isDepositPWAOpen,
    /** 保险库、利息宝是否开启 1是开启 */
    isSafeInterestOpen,
    /** 后台是否开启登陆PWA功能 */
    isLoginPWAOpen,
    timeZoneToText,
    timeZoneToTextWithoutRegion,
    /** 是否开启了脸部识别验证 */
    isFaceVerificationOpen,
    isRegFaceVerificationOpen,

  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBrandStore, import.meta.hot))
