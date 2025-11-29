import { getEnv } from '@tg/utils';
/**
 * 三方kyc
 */
export function useKYC() {
  const { VITE_KYC_TOKEN } = getEnv()
  /** 加载CDN */
  function loadLegitimuzCDN() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('legitimuz-sdk')) {
        resolve(1)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.legitimuz.com/js/sdk/legitimuz-sdk.js'
      script.id = 'legitimuz-sdk' // 标记，防止重复加载
      script.async = true

      script.onload = () => {
        resolve(1)
      }
      script.onerror = () => {
        reject(new Error('Failed to load Legitimuz SDK'))
      }

      document.body.appendChild(script)
    })
  }
  /** 初始化实例 */
  function initInstance() {
    return new Promise<void>((resolve, reject) => {
      let div = document.getElementById('legitimuz-root')
      if (!div) {
        div = document.createElement('div')
        div.id = 'legitimuz-root'
        document.body.appendChild(div)
      }

      window.sdkInstance = Legitimuz({
        host: 'https://api.legitimuz.com',
        token: VITE_KYC_TOKEN,
      })
      console.log('🚸🚸🚸 ~ initInstance ~ window.sdkInstance:', window.sdkInstance)
      window.sdkInstance.mount()
      resolve()
    })
  }
  /** 步骤一 加载CDN，初始化 */
  function loadLegitimuzCDNAndInit() {
    return new Promise<void>((resolve) => {
      loadLegitimuzCDN().then(() => {
        initInstance().then(() => {
          resolve()
        })
      })
    })
  }
  /** CPF验证 一般kyc */
  function staryVerifyDocument(data: { cpf: string; referenceId: string }) {
    return new Promise<void>((resolve, reject) => {
      window.sdkInstance.verifyDocument(data).finally(() => {
        resolve()
      })
    })
  }
  /** 人脸识别 */
  function startFacialRecognitionFlow(data: { cpf: string; referenceId: string }) {
    return new Promise<void>((resolve, reject) => {
      window.sdkInstance.startFaceIndex(data).finally(() => {
        resolve()
      })
    })
  }

  return {
    /** ⚠️ 必须先挂载CDN */
    loadLegitimuzCDNAndInit,
    /** CPF验证 一般kyc */
    staryVerifyDocument,
    /** 人脸识别 */
    startFacialRecognitionFlow,
  }
}
