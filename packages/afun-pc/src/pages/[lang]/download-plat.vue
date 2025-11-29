<script setup lang="ts">
import { IconDownloadIos, IconDownloadAndroid } from '@tg/icons'
import BaseQrcode from '~/components/BaseQrcode.vue'
import {ApiMemberBrandAppVersion} from '@tg/apis'

usePageTitle({ prefix: 'betmax_casino_online_title',isT:true})

const { runAsync: runAsyncMemberBrandAppVersion } = useRequest(ApiMemberBrandAppVersion)
const iosUrl = ref('')
const androidUrl = ref('')
const qrcodeUrl = ref('')
onMounted(async () => {
  const res = await runAsyncMemberBrandAppVersion()
  iosUrl.value = res?.ios?.link?.primary
  androidUrl.value = res?.android?.link?.primary
  qrcodeUrl.value = iosUrl.value
})
</script>

<template>
    <div class="download px-[100px] py-[50px]">
      <BaseImage class="max-w-[450px] max-h-[455px] object-contain" url="/png/download-icon.png" />
      <div class="content-container">
        <div class="flex flex-col gap-[18px]">
          <div class="title">{{ $t('PLATAFORMA DE DESCARGA DE JUEGOS') }}</div>
          <div class="subtitle">{{ $t('Tu Paraíso de Entretenimiento de Apuestas') }}</div>
          <div class="description">{{ $t('Ofrecemos Una Experiencia De Apuestas De Clase Mundial,Permitiéndote Disfrutar Plenamente De La Emoción Y Diversión.') }}</div>
        </div>
        <div class="flex gap-[47px]">
          <BaseQrcode :url="qrcodeUrl" :size="240" style="--base-qrcode-warp-radius: 16px;" />
          <div class="flex flex-col gap-[32px]">
            <div class="text-21 font-600 text-white mt-[16px]">{{ $t('Escanear para descargar la aplicación') }}</div>
            <BaseButton bg-style="primary" class="w-[363px] h-[62px]" @click="qrcodeUrl = iosUrl">
              <IconDownloadIos class="mr-8 text-[24px]" style="--tg-icon-color:black" />
              <span class="text-[24px] font-600 text-black">iOS</span>
            </BaseButton>
            <BaseButton bg-style="primary" class="w-[363px] h-[62px]" @click="qrcodeUrl = androidUrl">
              <IconDownloadAndroid class="mr-8 text-[24px]" style="--tg-icon-color:black" />
              <span class= "text-[24px] font-600 text-black">Android</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped lang="scss">
.download {
  width: 100%;
  height: 100%;
  font-family: proxima-nova;
  @include getBackgroundImage('/download-bg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 57px;

  @media (max-width: 1800px) {
    zoom: 0.94;
  }
  @media (max-width: 1680px) {
    zoom: 0.875;
  }
  @media (max-width: 1600px) {
    zoom: 0.83;
  }
  @media (max-width: 1440px) {
    zoom: 0.75;
  }
  @media (max-width: 1366px) {
    zoom: 0.71;
  }
  @media (max-width: 1280px) {
    zoom: 0.67;
  }

  @media (max-height: 1000px) {
    zoom: 0.93;
  }
  @media (max-height: 900px) {
    zoom: 0.83;
  }
  @media (max-height: 800px) {
    zoom: 0.74;
  }
  @media (max-height: 768px) {
    zoom: 0.71;
  }
}

.title {
  font-size: 55px;
  font-weight: 900;
  background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow:
    1px 1px 0 rgba(36, 238, 137, 0.3),
    -1px -1px 0 rgba(159, 232, 113, 0.3),
    1px -1px 0 rgba(36, 238, 137, 0.3),
    -1px 1px 0 rgba(159, 232, 113, 0.3);
}
.subtitle {
  font-size: 30px;
  font-weight: 600;
  color: #fff;
  padding-left: 18px;
}
.description {
  font-size: 18px;
  font-weight: 600;
  color: #B1BAD3;
  padding-left: 9px;
}
</style>

<route lang="yaml">
  meta:
    layout: home
  </route>
