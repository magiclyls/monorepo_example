import { ApiMemberSmartVerify, ApiSmartVerificationConfig } from '@tg/apis'

declare global {
  interface Window {
    initNECaptcha: any
  }
}

export function useAliCaptcha(options?: { success?: (validate?: string) => void }) {
  const r = Math.random().toString(36).slice(-10)
  const captcha = ref()
  const captchaButton = ref()
  const captchaVerifyParam = ref()
  const captchaButtonId = ref(`captcha-button-${r}`)
  const captchaEleId = ref(`captcha-element-${r}`)
  const { userLanguage } = storeToRefs(useLanguageStore())

  const { runAsync: runAliVerify, loading: loadingMemberCaptcha } = useRequest(ApiMemberSmartVerify)
  const { data: configData, runAsync: runSmartConfig, loading: loadingMemberCaptchaConfig } = useRequest(ApiSmartVerificationConfig)

  // const needVerify = computed(() => configData.value && configData.value.device_token && configData.value.smart_verification && configData.value.smart_verification.scene_id && configData.value.smart_verification.type && +configData.value.smart_verification.type > 1)

  /** 网易验证码 */
  /** 1不使用 2滑动拼图 3文字点选 4图标点选 5推理拼图 6短信上行验证 7语序点选 8空间推理 9语音验证 */
  const needVerify = computed(() => configData.value && configData.value.captcha_id && +configData.value.type > 1)

  function showCaptcha() {
    if (needVerify.value && captcha.value) {
      captcha.value.verify()
      setTimeout(() => {
        captcha.value.refresh()
      }, 50)
    }
    else {
      if (options && options.success)
        options.success()
    }
  }

  onMounted(async () => {
    runSmartConfig().then((res) => {
      if (needVerify.value) {
        setTimeout(() => {
          // captchaButton.value = document.getElementById(captchaButtonId.value)
          // // # VITE_ALI_SCENEID = '1q8k9dbap'
          // // # VITE_ALI_PREFIX = '1pyxrq5'
          // // SceneId
          // // 无痕 '1q8k9dbap'
          // // 滑块 '1jn7cu4hq'
          // // 图像拼接 'vx699dx2p'
          // window.initAliyunCaptcha({
          //   SceneId: res.smart_verification!.scene_id, // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
          //   prefix: res.device_token, // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
          //   mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
          //   element: `#${captchaEleId.value}`, // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
          //   button: `#${captchaButtonId.value}`, // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
          //   captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
          //   onBizResultCallback, // 业务请求结果回调函数，无需修改
          //   getInstance, // 绑定验证码实例函数，无需修改
          //   slideStyle: {
          //     width: 320,
          //     height: 40,
          //   }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
          //   language: userLanguage.value === 'zh-CN' ? 'cn' : 'en', // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
          // })

          window.initNECaptcha({
            element: document.body, // popup 模式下，element 可以为空或者document.body
            captchaId: res.captcha_id,
            width: '320px',
            mode: 'popup',
            apiVersion: 2,
            popupStyles: {
              position: 'fixed',
              top: '20%',
            },
            lang: userLanguage.value === 'zh-CN' ? 'zh-CN' : userLanguage.value.split('-')[0],
            onVerify(err: any, data: { validate: string }) {
              /**
               * 第一个参数是err（Error的实例），验证失败才有err对象
               * 第二个参数是data对象，验证成功后的相关信息，data数据结构为key-value，如下：
               * {
               *   validate: 'xxxxx' // 二次验证信息
               * }
               */
              if (err)
                return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次

              // 后端说去掉member/captcha
              // runAliVerify({
              //   captcha_id: res.captcha_id,
              //   validate: data.validate,
              //   username: '',
              // }).then((a) => {
              //   onBizResultCallback(a,data.validate)
              // })
              onBizResultCallback(true,data.validate)
            },
          }, (instance: any) => {
            getInstance(instance)
          }, (error: any) => {
            console.log('🦺🦺🦺 ~ 验证码初始化错误', error)
          })
        }, 0)
      }
    })
  })

  onBeforeUnmount(() => {
    captchaButton.value = null

    // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
    document.getElementById('aliyunCaptcha-mask')?.remove()
    document.getElementById('aliyunCaptcha-window-popup')?.remove()
  })

  function getInstance(instance: any) {
    captcha.value = instance
  }

  // async function captchaVerifyCallback(verifyParam: string) {
  //   // 1.向后端发起业务请求，获取验证码验证结果和业务结果
  //   const result = await runAliVerify({
  //     captcha_verify_param: verifyParam, // 验证码参数
  //     // yourBizParam... // 业务参数
  //   })
  //   // return {
  //   //  captchaResult: true, // 验证码验证是否通过，boolean类型，必选
  //   //  bizResult: true, // 业务验证是否通过，boolean类型，可选；若为无业务验证结果的场景，bizResult可以为空
  //   // }
  //   captchaVerifyParam.value = verifyParam
  //   const temp = {
  //     captchaResult: result === true,
  //     bizResult: true,
  //   }

  //   return temp
  // }

  // 验证通过后调用
  function onBizResultCallback(result: any,validate:string) {
    if (result === true && options && options.success)
      options.success(validate)
  }

  return {
    captchaButtonId,
    captchaEleId,
    captchaVerifyParam,
    showCaptcha,
    loadingMemberCaptcha,
    loadingMemberCaptchaConfig,
  }
}
