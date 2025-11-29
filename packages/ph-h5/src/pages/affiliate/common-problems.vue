<script lang="ts" setup>
import { PhBaseImage } from '@tg/bccomponents'
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
  return `/ph-h5/png/${EnumLanguage[locale.value as keyof typeof EnumLanguage]}${mode.value === 1 ? '_1' : ''}.png`
})

const getProblemUrl = computed(() => {
  return `/ph-h5/png/invitation_${mode.value}.png`
})
</script>

<template>
  <div class="promotion_tutorial">
    <div class="flex flex-col gap-[8rem]">
      <div class="bg-[#fff] rounded-[6rem] p-[12rem]">
        <div class="font-[600] text-[#0D2245] text-[14rem]">
          {{ t('联盟计划是什么', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
        <div class="font-[600] text-[#6D7693] text-[12rem]">
          {{ t('联盟计划是', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="bg-[#fff] rounded-[6rem] p-[12rem]">
        <div class="font-[600] text-[#0D2245] text-[14rem]">
          {{ t('参加需要花费多少钱？') }}
        </div>
        <div class="font-[600] text-[#6D7693] text-[12rem]">
          {{ t('联盟计划免费') }}
        </div>
      </div>
      <div class="bg-[#fff] rounded-[6rem] p-[12rem]">
        <div class="font-[600] text-[#0D2245] text-[14rem]">
          {{ t('即使我没有网站也可以获得福利吗？') }}
        </div>
        <div class="font-[600] text-[#6D7693] text-[12rem]">
          {{ t('没有网站也有福利', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="bg-[#fff] rounded-[6rem] p-[12rem]">
        <div class="font-[600] text-[#0D2245] text-[14rem]">
          {{ t('我能赚多少钱？') }}
        </div>
        <div class="font-[600] text-[#6D7693] text-[12rem]">
          {{ t('你能赚j8') }}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-[16rem] mt-[16rem]">
      <div class="bg-[#fff] p-[16rem] rounded-[6rem]">
        <PhBaseImage :url="getProblemUrl" with-theme />
        <div class="text-[14rem] font-[600] text-[#6D7693]" style="margin-top: 20px;">
          {{ t('推荐下注有佣金') }}
        </div>
        <div class="text-[14rem] font-[600] text-[#6D7693]">
          {{ t('每天结算佣金') }}
        </div>
      </div>
      <div class="bg-[#fff] p-[16rem] rounded-[6rem]">
        <PhBaseImage :key="locale" :url="getUrl" with-theme />
      </div>
      <div class="bg-[#fff] p-[16rem] rounded-[6rem]">
        <template v-for="(content, section) in getTextContent" :key="section">
          <div class="des-item flex flex-col">
            <div class="p">
              <div class="font-[600] text-[#0D2245] text-[14rem] mb-[8rem]">
                {{ $t(getTitle(section)) }}
              </div>
            </div>
            <template v-for="(item, index) in content" :key="index">
              <div class="flex items-baseline">
                <div class="div-round mr-10" />
                <div class="p">
                  <div class="font-[600] text-[#6D7693] text-[12rem] mb-[16rem]">
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
