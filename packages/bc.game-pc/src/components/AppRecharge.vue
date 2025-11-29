<script setup lang="ts">
import { ref } from 'vue'
import BaseCollapseItem from '../../../components/src/BaseCollapseItem.vue'
import BaseDialog from '../../../components/src/BaseDialog.vue'
import BaseIcon from '../../../components/src/BaseIcon.vue'
import BaseImage from '../../../components/src/BaseImage.vue'
import BaseQrcode from '../../../components/src/BaseQrcode.vue'
import BaseSelect from '../../../components/src/BaseSelect.vue'
import BaseTabs from '../../../components/src/BaseTabs.vue'
import AppBankCard from './AppBankCard.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const show = ref(false)
const tabIndex = ref(0)
const tabs = ref([
  { title: '加密貨幣', value: '1' },
  { title: '法幣', value: '2' },
])
const currencyIndex = ref(0)
const currency = ref([
  { label: 'USDT', title: 'USDT', value: '1', icon: 'https://bc.game/coin/USDT.black.png' },
  { label: 'BTC', title: 'BTC', value: '2', icon: 'https://bc.game/coin/BTC.black.png' },
  { label: 'ETH', title: 'ETH', value: '3', icon: 'https://bc.game/coin/ETH.black.png' },
  { label: 'USDC', title: 'USDC', value: '4', icon: 'https://bc.game/coin/USDC.black.png' },
])

const value = ref('')
const bankGroups = ref<{
  title: string
  position: 'first' | 'last'
  icons: string[]
  cards: {
    title: string
    details: string[]
    tag?: string
    image: string
  }[]
}[]>([
  {
    title: '推薦',
    position: 'first',
    icons: ['https://img2.distributedresourcestorage.com/fait/5c/f3/25/172733872487092.png', 'https://img2.distributedresourcestorage.com/fait/5c/f3/25/172733872487092.png'],
    cards: [
      {
        title: 'Банк эсепке алым',
        details: ['500 ~ 161,966', 'EAT： > 5 分鐘'],
        tag: '热门',
        image: 'https://img2.distributedresourcestorage.com/fait/5c/f3/25/172733872487092.png',
      },
      {
        title: 'Банк эсепке алым',
        details: ['500 ~ 161,966', 'EAT： > 5 分鐘'],
        tag: '最快',
        image: 'https://img2.distributedresourcestorage.com/fait/5c/f3/25/172733872487092.png',
      },
    ],
  },
  {
    title: '銀行轉帳',
    position: 'last',
    icons: ['https://img2.distributedresourcestorage.com/fait/39/9b/8d/173216306977157.png'],
    cards: [
      {
        title: 'Банк эсепке алым',
        details: ['500 ~ 161,966', 'EAT： > 5 分鐘'],
        image: 'https://img2.distributedresourcestorage.com/fait/39/9b/8d/173216306977157.png',
      },
    ],
  },
])
</script>

<template>
  <div @click="show = true">
    <slot />
  </div>
  <BaseDialog
    v-model="show" title="充值" :show-close="false" show-back :dialog-style="{ '--dialog-header-bg': '#323738', '--dialog-body-padding': '0', '--dialog-body-min-height': '34rem' }"
    @back="show = false"
  >
    <BaseTabs
      v-model:active="tabIndex" :type="2" :list="tabs"
      :style="{ '--tabs-width': '50%', '--tabs-indicator-position': `${tabIndex * 100}%`, '--tabs-btn-bg-color': '#323738', '--tabs-border-radius': '0' }"
    />
    <div v-if="tabIndex === 0" class="p-4">
      <BaseTabs
        v-model:active="currencyIndex" :type="3" :list="currency" class="mt-2 mb-4"
        :style="{ '--tabs-width': 'fit-content', '--tabs-padding': '1rem 4px 1rem 4px', '--tabs-btn-bg-color': '#323738', '--tabs-border-radius': '100px', '--tabs-active-border': '1px solid #24EE89' }"
      />
      <div class="text-white text-sm mt-4 mb-4">
        <span>沒有找到您使用的加密幣？</span>
        <span class="text-[#24EE89] font-bold cursor-pointer">在此處新增</span>
      </div>
      <div class="bg-[#323738] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="w-[12.5rem] text-[#B3BEC1] text-sm mb-2 pl-1">
            充值幣別
          </div>
          <div class="w-[12.5rem] text-[#B3BEC1] text-sm mb-2 pl-1">
            選擇鏈種
          </div>
        </div>
        <div class="flex items-center justify-between">
          <BaseSelect v-model="value" :options="currency" placement="bottom-start">
            <BaseCollapseItem
              disabled :title="currency[currencyIndex].title"
              :arrow="{ showArrowBg: true, arrowPosition: 'up' }" class="w-[12.5rem]"
            >
              <template #icon>
                <BaseImage class="rounded-sm h-6 w-6" :url="currency[currencyIndex].icon" />
              </template>
            </BaseCollapseItem>
            <template #select-item="{ item, selectedOption }">
              <div
                :class="{
                  'bg-layer4': item.value === selectedOption?.value,
                }"
                class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
              >
                <BaseImage class="rounded-sm h-6 w-6" :url="item.icon" />
                <div class="ml-2">
                  <div class="flex items-center text-base font-extrabold">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </template>
          </BaseSelect>
          <BaseSelect v-model="value" :options="currency" placement="bottom-start" :popper-search="false">
            <BaseCollapseItem
              disabled title="ERC20" :arrow="{ showArrowBg: true, arrowPosition: 'up' }"
              class="w-[12.5rem]"
            />
            <template #select-item="{ item, selectedOption }">
              <div
                :class="{
                  'bg-layer4': item.value === selectedOption?.value,
                }"
                class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
              >
                <BaseImage class="rounded-sm h-6 w-6" :url="item.icon" />
                <div class="ml-2">
                  <div class="flex items-center text-base font-extrabold">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </template>
          </BaseSelect>
        </div>
        <div class="h-[40px] bg-[#514634] rounded-lg text-sm text-white font-bold flex items-center gap-2 mt-4">
          <BaseImage
            class="inline-block w-10 h-auto"
            url="https://bc.game/modules/wallet2/assets/bonus-3a17ce62.png"
          />
          <span>充值</span><span class="text-[#FF9820]">10 USDT</span><span> 或以上即可獲得額外</span><span
            class="text-[#FF9820]"
          >180%</span><span>獎金</span>
        </div>
        <div class="mt-4 flex justify-between">
          <div class="rounded-sm p-1 bg-white flex items-center justify-center">
            <BaseQrcode :size="128" value="ABCD1234567890123456789012345678WXYZ" />
          </div>
          <div class="w-[16.25rem] flex flex-col justify-between">
            <div class="text-[#B3BEC1] text-sm pl-1">
              充值地址
            </div>
            <div class="text-sm text-white bg-[#292D2E] rounded-lg p-2">
              <span>USDT-ERC20</span>
              <span>0x1234567890123456789012345678901234567890</span>
            </div>
            <button
              type="button" style="color: white;"
              class="h-10 w-full rounded-lg mt-5 bg-[#4A5354] cursor-pointer"
            >
              <BaseIcon name="copy" />
              複製地址
            </button>
          </div>
        </div>
        <div class="p-2 flex text-secondary rounded-xl bg-[rgba(36,238,137,0.2)] mt-4 text-[#B3BEC1]">
          <BaseIcon name="info" />
          僅 USDT 至此存款地址。低於 1 USDT 的轉帳將不獲入帳。
        </div>
      </div>
    </div>
    <div v-if="tabIndex === 1" class="p-4">
      <div class="bg-[#323738] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <span class="text-[#B3BEC1] text-sm">充值幣別</span>
          <BaseSelect v-model="value" :options="currency" placement="bottom-start">
            <BaseCollapseItem
              disabled title="KGS" :arrow="{ showArrowBg: true, arrowPosition: 'up' }"
              class="w-[12.5rem]"
            />
            <template #select-item="{ item, selectedOption }">
              <div
                :class="{
                  'bg-layer4': item.value === selectedOption?.value,
                }"
                class="mb-1 flex cursor-pointer items-center rounded-lg px-2 py-3 !leading-5 fix-light-hover"
              >
                <BaseImage class="rounded-sm h-6 w-6" :url="item.icon" />
                <div class="ml-2">
                  <div class="flex items-center text-base font-extrabold">
                    {{ item.label }}
                  </div>
                </div>
              </div>
            </template>
          </BaseSelect>
        </div>
        <div class="text-[#B3BEC1] text-sm pt-2 pb-2">
          充值方式
        </div>
        <div class="flex flex-col gap-[1px]">
          <BaseCollapseItem
            v-for="group in bankGroups"
            :key="group.title" :style="{ '--collapse-border': '0.0625rem solid #e4eaf019' }" :title="group.title"
            :position="group.position"
          >
            <template #extra>
              <BaseImage v-for="(icon, index) in group.icons" :key="index" class="w-[3.5rem]" :url="icon" />
            </template>
            <div class="grid grid-cols-3 gap-x-1.5 gap-y-4">
              <AppBankCard
                v-for="card in group.cards" :key="card.title" :title="card.title"
                :details="card.details" :tag="card.tag" :image="card.image"
              />
            </div>
          </BaseCollapseItem>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped lang="scss">

</style>
