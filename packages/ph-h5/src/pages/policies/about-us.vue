<script setup lang='ts'>
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'AboutUs' })

const { VITE_OFFICIAL_NAME } = getEnv()

const { t } = useI18n()
// 使用语言store
const setTitle = inject('setTitle', (v: string) => {})

// 获取当前语言
const currentLanguage = ref(getLang())

//  对象
const i18nMap: any = {
  aboutUs: {
    'zh-CN': '关于我们',
    'en-US': 'About Us',
  },
  certificationAuthority: {
    'zh-CN': '认证机构',
    'en-US': 'Certification authority',
  },
  aboutOKbet: {
    'zh-CN': `${VITE_OFFICIAL_NAME}受娱乐和博彩公司(PAGCOR)监管和许可。我们认识到博彩和游戏是娱乐形式。成立于2021年，${VITE_OFFICIAL_NAME}现在是一家成熟的运营商，拥有一支合格、经验丰富的专业团队，致力于通过卓越的产品提供和优质的客户服务为我们的客户提供最佳的在线娱乐体验。`,
    'en-US': `${VITE_OFFICIAL_NAME} is licensed and regulated by the Philippine Amusement and Gaming Corporation (PAGCOR). We view betting and gaming as a form of entertainment. Founded in 2021, ${VITE_OFFICIAL_NAME} is now an established operator with a qualified, experienced team dedicated to delivering the best online entertainment through great products and excellent customer service.`,
  },
}

// 获取文本
function getText(key: string): string {
  const textMap = i18nMap[key]
  if (!textMap) {
    console.warn(`Translation key "${key}" not found`)
    return key // 如果没有找到key，返回key本身
  }

  // 根据当前站点语言获取对应字段
  return textMap[currentLanguage.value] || textMap['en-US'] || key
}

onMounted(() => {
  setTitle(t('关于我们'))
})
</script>

<template>
  <div class="parent leading-[20px]">
    <div class="content">
      <span class="text-content">
        {{ getText('aboutOKbet') }}
      </span>
    </div>
    <!-- <div class="copyright">
      <span class="text-bold-14">
        {{ getText('certificationAuthority') }}
      </span>
      <div class="bottom-img">
        <div class="item-img">
          <PhBaseImage url="/ph-h5/png/copyright-01.png" />
        </div>
        <div class="item-img">
          <PhBaseImage url="/ph-h5/png/copyright-02.png" />
        </div>
        <div class="item-img">
          <PhBaseImage url="/ph-h5/png/copyright-03.png" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang='scss' scoped>
.parent {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 4rem 12rem 0;
  gap: 12rem;
}
.content {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16rem 12rem;
  align-items: center;
  border-radius: 12rem;
}
.text-content {
  color: #6d7693;
  font-size: 14px;
}

.copyright {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 16rem 12rem;
  align-items: center;
  border-radius: 12rem;
  gap: 8rem;
}
.text-bold-14 {
  color: #0d2245;
  font-size: 14rem;
  font-weight: 700;
}
.bottom-img {
  display: flex;
  width: 100%;
  height: 40rem;
}
.item-img {
  position: relative;
  flex: 1;
}
</style>
