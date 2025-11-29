<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
import { useAffiliate } from '@tg/stores'
import { EnumLanguage } from '@tg/types'
import { getEnv } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { mode } = storeToRefs(useAffiliate())
const { VITE_OFFICIAL_DOMAIN } = getEnv()

// 获取文案内容
const getTextContent = computed(() => {
  const prefix = `${mode.value}_`
  let sections: string[] = []

  // 根据 mode 设置不同的 sections
  if (mode.value === 1)
    sections = ['直属团队', '自身业绩', '总结说明']
  else if (mode.value === 2)
    sections = ['直属团队', '其它团队', '总结说明']
  else if (mode.value === 3)
    sections = ['直属团队', '自身业绩', '其它团队', '总结说明']

  return sections.reduce((acc, section) => {
    const content: Array<{ type: 'example' | 'content', text: string }> = []

    // 获取示例说明
    let exampleIndex = 1
    if (mode.value === 3 && section === '其它团队') {
      // mode 3 时 other_teams 显示两个示例
      for (let index = 0; index < 2; index++) {
        const example = t(`${prefix}${section}例子_${exampleIndex}`)
        content.push({
          type: 'content',
          text: example,
        })
        exampleIndex++
      }
    }
    else {
      // 其他情况只显示一个示例
      const example = t(`${prefix}${section}例子_${exampleIndex}`)
      content.push({
        type: 'content',
        text: example,
      })
    }

    if (content.length > 0)
      acc[section] = content

    return acc
  }, {} as Record<string, Array<{ type: 'example' | 'content', text: string }>>)
})

// 获取标题
function getTitle(key: string) {
  return t(`${mode.value}_${key}`)
}

const getUrl = computed(() => {
  return `/m/afun-h5/png/${EnumLanguage[locale.value as keyof typeof EnumLanguage]}${mode.value === 1 ? '_1' : ''}.png`
})

const getProblemUrl = computed(() => {
  return `/m/afun-h5/png/invitation_${mode.value}.png`
})
</script>

<template>
  <div class="promotion_tutorial">
    <div class="flex flex-col gap-[8px]">
      <div class="bg-[#0F212E] rounded-[6px] p-[12px]">
        <div class="font-[600] text-[#fff] text-[14px]">
          {{ t('联盟计划是什么', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
        <div class="font-[600] text-[#B1BAD3] text-[12px]">
          {{ t('联盟计划是', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="bg-[#0F212E] rounded-[6px] p-[12px]">
        <div class="font-[600] text-[#fff] text-[14px]">
          {{ t('参加需要花费多少钱？') }}
        </div>
        <div class="font-[600] text-[#B1BAD3] text-[12px]">
          {{ t('联盟计划免费') }}
        </div>
      </div>
      <div class="bg-[#0F212E] rounded-[6px] p-[12px]">
        <div class="font-[600] text-[#fff] text-[14px]">
          {{ t('即使我没有网站也可以获得福利吗？') }}
        </div>
        <div class="font-[600] text-[#B1BAD3] text-[12px]">
          {{ t('没有网站也有福利', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="bg-[#0F212E] rounded-[6px] p-[12px]">
        <div class="font-[600] text-[#fff] text-[14px]">
          {{ t('我能赚多少钱？') }}
        </div>
        <div class="font-[600] text-[#B1BAD3] text-[12px]">
          {{ t('你能赚j8') }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-[16px] mt-[16px]">
      <div class="bg-[#0F212E] p-[16px] rounded-[6px]">
        <AfunBaseImage :url="getProblemUrl" with-theme />
        <div class="text-[14px] font-[600] text-[#B1BAD3]" style="margin-top: 20px;">
          {{ t('推荐下注有佣金') }}
        </div>
        <div class="text-[14px] font-[600] text-[#B1BAD3]">
          {{ t('每天结算佣金') }}
        </div>
      </div>
      <div class="bg-[#0F212E] p-[16px] rounded-[6px]">
        <AfunBaseImage :key="locale" :url="getUrl" with-theme />
      </div>
      <div class="bg-[#0F212E] p-[16px] rounded-[6px]">
        <template v-for="(content, section) in getTextContent" :key="section">
          <div class="des-item flex flex-col">
            <div class="p">
              <div class="font-[600] text-[#fff] text-[14px] mb-[8px]">
                {{ $t(getTitle(section)) }}
              </div>
            </div>
            <template v-for="(item, index) in content" :key="index">
              <div class="flex items-baseline">
                <div class="div-round mr-10" />
                <div class="p">
                  <div class="font-[600] text-[#B1BAD3] text-[12px] mb-[16px]">
                    {{ $t(item.text) }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
