<script setup lang='ts'>
import { IconUniJumpPage } from '@tg/icons'
import { getEnv } from '@tg/utils';
// const { t } = useI18n()
const {
  VITE_TRANSITION_API,
  VITE_TRANSITION_KEY,
  VITE_OFFICIAL_NAME,
  // VITE_OFFICIAL_DOMAIN,
  VITE_SITE_NAME,
} = getEnv()
const { runAsyncFrontLang, t } = useFrontLang()

const a = ref('')
axios.post(`${VITE_TRANSITION_API}?key=${VITE_TRANSITION_KEY}`, {
  q: `<div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          Understanding the odds and knowing the risks associated with gambling.
        </div>
      </div>`,
  source: 'en-US',
  target: 'zh-CN',
}, {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
},
).then((res) => {
  a.value = res.data.data.translations[0].translatedText
  console.log('测试翻译===>', res)
}).catch((err) => {
  console.log('翻译出错了===>', err)
})

await application.allSettled([runAsyncFrontLang('responsible_safe')])
</script>

<template>
  <div class="flex flex-col p-[12px]">
    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px]">
        <div class="text-tg-text-white text-[24px] font-semibold leading-[1.32]">
          {{ $t('stake_safety', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_1', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_2') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_3', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_4') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_5') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_6') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_7') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_8', { site: VITE_OFFICIAL_NAME }) }}
          </div>
        </li>
      </ul>
    </section>

    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[20px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_9') }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_10', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          Tips to Gambling Safely Are:
          <!-- {{ t('responsible_safe_text_11') }} -->
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_12') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_13') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_14') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_15') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_16') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_17') }}
          </div>
        </li>
      </ul>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          <span>Learn more tips with our </span>
          <span class="inline-flex font-semibold">responsible&nbsp;</span>
          <span class="inline-flex font-semibold">gambling&nbsp;</span>
          <span class="inline-flex font-semibold">guide</span>.
        </div>
      </div>
    </section>

    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[20px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_19') }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_20') }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_21', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_22') }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_23') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_24', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_25') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_26') }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_27') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_28') }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_29') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_30') }}
        </div>
      </div>
    </section>

    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[20px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_31', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_32', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_33') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_34', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_35') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_36') }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_37') }}
        </div>
      </div>
      <!-- 🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[14px] leading-[1.32]">
          {{ t('responsible_safe_text_38') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_39') }}
        </div>
      </div>
      <!-- 🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[14px] leading-[1.32]">
          {{ t('responsible_safe_text_40') }}
        </div>
      </div>
      <div class="mb-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          A wager limit (or betting limit) allows you to set a limit on how much you can wager over your set period of time.
          The maximum bet limit can be set over a period of one day, one week or one month.
          The limit <span class="font-semibold">is not a net limit</span> so profits are excluded. This means, if you are profitable during the period these profits are not offset against your maximum bet limit.
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          To increase or decrease your limits you must remove existing limits and create new limits.
          Upon removing limits a <span class="font-semibold">24-hour cool off period</span> will commence before you are able to create your new limit.
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_43') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_44', { site: VITE_SITE_NAME }) }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_45') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_46') }}
        </div>
      </div>
    </section>

    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[20px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_47') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_48') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_49') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_50') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_51') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_52') }}
          </div>
        </li>
      </ul>
      <!-- 🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[14px] leading-[1.32]">
          {{ t('responsible_safe_text_53') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_54') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_55') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_56') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_57') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_58') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_59') }}
          </div>
        </li>
      </ul>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          Additional Resources to Assist
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          If you are worried about yourself, or if someone you know is having problems managing their gambling, there are several external support agencies that can assist with providing advice.
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          Talk to someone you trust about your gambling – such as a close friend or family member, a religious or community leader, doctor, or other health professional.
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] font-semibold leading-[1.5]">
          Gamblers Anonymous
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          Website
          <div class="flex items-center gap-[8px]">
            <span class="font-semibold">https://gamblersanonymous.org/ga/</span>
            <IconUniJumpPage  />
          </div>
          <span class="font-semibold">Gambling Therapy</span>
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          Website
          <div class="flex items-center gap-[8px]">
            <span class="font-semibold">https://www.gamblingtherapy.org/</span>
            <IconUniJumpPage  />
          </div>
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          <div class="flex items-center">
            Contact:&nbsp;
            <span class="font-semibold">support@gamblingtherapy.org</span>
            <IconUniJumpPage class="ml-[8px]"  />
          </div>
        </div>
      </div>
    </section>

    <!-- 🔖🔖🔖 -->
    <section class="flex flex-col">
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[20px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_60') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_61', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_62') }}
        </div>
      </div>
      <div class="mt-[12px]">
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_63') }}
        </div>
      </div>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_64') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_65') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_66') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_67') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_68') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_69') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_70') }}
          </div>
        </li>
      </ul>
      <!-- 🔖🔖 -->
      <div class="mb-[8px] mt-[24px]">
        <div class="text-tg-text-white text-[16px] font-semibold leading-[1.32]">
          {{ t('responsible_safe_text_71') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[16px] leading-[1.5]">
          {{ t('responsible_safe_text_72', { site: VITE_OFFICIAL_NAME }) }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-[16px] ml-[32px] list-disc text-[16px] leading-[1.5]">
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_73') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_74') }}
          </div>
        </li>
        <li class="my-[4px]">
          <div>
            {{ t('responsible_safe_text_75') }}
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang='scss' scoped>

</style>
