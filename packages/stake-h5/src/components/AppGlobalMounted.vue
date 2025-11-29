<script lang="ts" setup>
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppGlobalMounted',
})
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { isLogin } = storeToRefs(useAppStore())
const { openRegisterDialog } = useRegisterDialog()

function setAppDeviceNumber() {
  const deviceNumber = getUrlParam('devicenumber')
  if (deviceNumber)
    Local.set(STORAGE_FINGERPRINT, deviceNumber)
}

function handleWindowOnload() {
  // 如果href中有c或者u参数，且未登录，则打开注册弹窗
  if (!isLogin.value) {
    // const c = getUrlParam('c')
    const u = getUrlParam('u')
    if (u) { // c ||
      setTimeout(() => {
        openRegisterDialog()
      }, 3000)
    }
  }
}

function localSaveC_U() {
  const c = getUrlParam('c')
  const u = getUrlParam('u')
  const adjustapptoken = getUrlParam('adjustapptoken')
  const ueventtoken = getUrlParam('eventtoken')

  if (c)
    Local.set(STORAGE_CCCCC, c.replace(/\//g, ''))

  if (u)
    Local.set(STORAGE_UUUUU, u.replace(/\//g, ''))

  if (adjustapptoken)
    Local.set('adjustapptoken', adjustapptoken.replace(/\//g, ''))

  if (ueventtoken)
    Local.set('eventtoken', ueventtoken.replace(/\//g, ''))
}

function createGlobalFontLink() {
  const linkTag = document.createElement('link')
  linkTag.setAttribute('rel', 'stylesheet')
  linkTag.setAttribute('href', `${VITE_CASINO_IMG_CLOUD_URL}/aba0ebl.css`)
  document.head.appendChild(linkTag)
}

onMounted(() => {
  handleWindowOnload()
  setAppDeviceNumber()
  localSaveC_U()
  createGlobalFontLink()
})
</script>

<template>
  <div />
</template>
