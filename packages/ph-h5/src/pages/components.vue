<script setup lang='tsx'>
import { BaseSkeleton, PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseFinanceEmpty, PhBaseSelect, PhBaseTabs } from '@tg/bccomponents'
import { IconUniError } from '@tg/icons'
import { ref } from 'vue'
import { Message } from '~/utils'

const tab = ref(1)
const list0 = [
  { label: 'tab1', value: 1, icon: 'IconWallet' },
  { label: 'tab2', value: 2, icon: 'IconFiat' },

]
const list = [
  { label: 'tab1', value: 1, icon: 'IconWallet' },
  { label: 'tab2', value: 2, icon: 'IconFiat', dotTip: 99 },
  { label: 'tab3', value: 3, icon: 'IconVirtual' },

]
const listTip = [
  { label: 'tab1', value: 1, icon: 'IconWallet' },
  { label: 'tab2', value: 2, icon: 'IconFiat', infoTip: '待领取' },
  { label: 'tab3', value: 3, icon: 'IconVirtual' },

]

const list2 = [
  { label: 'tab1', value: 1 },
  { label: 'tab2', value: 2, dotTip: 99 },
  { label: 'tab3', value: 3 },
  { label: 'tab4', value: 4 },
  { label: 'tab5', value: 5, dotTip: 99 },
  { label: 'tab6', value: 6 },
  { label: 'tab7', value: 7 },
  { label: 'tab8', value: 8, dotTip: 99 },
  { label: 'tab9', value: 9 },

]

const dialog = ref(false)
const selectVal = ref('1')
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
]

function msg() {
  Message.success(
    <div class="flex items-center gap-[4rem]">
      <IconUniError class="text-white" />
      <span class="whitespace-nowrap">每次投注最多1000.00</span>
      <PhBaseCurrencyIcon
        currencyType="CNY"
        style="--ph-app-currency-icon-size:14rem"
      />
    </div>,
  )
}
</script>

<template>
  <div class="text-black p-[20rem]">
    <div class="components">
      <h1 class="font-bold text-[24rem]">
        PhBaseButton
      </h1>
      <div>
        <PhBaseButton type="primary">
          primary
        </PhBaseButton>
        <PhBaseButton type="secondary">
          secondary
        </PhBaseButton>
        <PhBaseButton type="none">
          none
        </PhBaseButton>

        <PhBaseButton class="w-[85rem]" style="--ph-base-button-padding-y:2rem;--ph-base-button-font-size:14rem;--ph-base-button-border-radius:4rem;">
          primary
        </PhBaseButton>
      </div>
    </div>
    <div class="component">
      <h1 class="font-bold text-[24rem]">
        PhBaseTabs
      </h1>
      <div>
        <div class="label">
          type : default 1
        </div>
        <PhBaseTabs v-model="tab" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 2
        </div>
        <PhBaseTabs v-model="tab" :type="2" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 3
        </div>
        <PhBaseTabs v-model="tab" :type="3" :list="list2" />

        <PhBaseTabs v-model="tab" :type="3" full :list="list" />
      </div>
      <div>
        <div class="label">
          type : 4
        </div>

        <PhBaseTabs v-model="tab" :type="4" full :list="list0" class="my-[20rem]" />
        <PhBaseTabs v-model="tab" :type="4" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 5
        </div>
        <PhBaseTabs v-model="tab" :type="5" :list="list2" />
        <PhBaseTabs v-model="tab" full :type="5" :list="list" class="my-[20rem]" />
        <PhBaseTabs v-model="tab" full :type="5" :list="listTip" style="--tabs-wrap-padding-y:5rem;--tabs-wrap-bg:white;--tabs-item-active-bg:#F23038;--tabs-item-active-color:white;" />
      </div>
      <div>
        <div class="label">
          type : 6
        </div>
        <PhBaseTabs v-model="tab" :type="6" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 7
        </div>
        <PhBaseTabs v-model="tab" :type="7" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 8
        </div>
        <PhBaseTabs v-model="tab" :type="8" :list="list" />
      </div>
    </div>
    <div class="components">
      <h1 class="font-bold text-[24rem]">
        PhBaseDialog
      </h1>
      <div>
        <div class="label">
          <div type="primary" @click="dialog = true">
            open dialog
          </div>
        </div>
        <PhBaseDialog v-model="dialog">
          <div class="d">
            dsdfsd
          </div>
        </PhBaseDialog>
      </div>
    </div>
    <div class="components">
      <h1 class="font-bold text-[24rem]">
        PhBaseFinanceEmpty
      </h1>
      <div>
        <div class="label">
          <div type="primary" @click="dialog = true">
            open dialog
          </div>
        </div>
        <PhBaseFinanceEmpty description="该币种暂无存款渠道，请稍后再试或联系客服" />
      </div>
    </div>

    <div class="components">
      <h1 class="font-bold text-[24rem]">
        PhBaseSelect
      </h1>
      <div>
        <PhBaseSelect v-model="selectVal" :options="options" />
      </div>
    </div>

    <div class="components">
      <h1 class="font-bold text-[24rem]">
        BaseSkeleton
      </h1>
      <div>
        <BaseSkeleton
          bg="#B1BAD3"
          height="176px"
          width="100%"
          animated="ani-opacity"
        />
      </div>
    </div>

    <div class="components">
      <h1 class="font-bold text-[24rem]">
        message
      </h1>
      <div>
        <div class="flex gap-[20rem]">
          <span @click="Message.info('info')">info</span>
          <span @click="Message.error('error')">error</span>
          <span @click="Message.success('success')">success</span>

          <span class="d" @click="msg">jsx</span>
        </div>
      </div>
    </div>
  </div>
</template>
