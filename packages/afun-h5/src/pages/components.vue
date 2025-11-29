<script setup lang='tsx'>
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseDialog, AfunBaseTabs, BaseSkeleton, PhBaseFinanceEmpty, PhBaseSelect } from '@tg/bccomponents'
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
    <div class="flex items-center gap-[4px]">
      <IconUniError class="text-white" />
      <span class="whitespace-nowrap">每次投注最多1000.00</span>
      <AfunBaseCurrencyIcon
        currencyType="CNY"
        style="--ph-app-currency-icon-size:14px"
      />
    </div>,
  )
}
</script>

<template>
  <div class="p-[20px]">
    <div class="components">
      <h1 class="font-bold text-[24px]">
        AfunBaseButton
      </h1>
      <div>
        <AfunBaseButton type="primary">
          primary
        </AfunBaseButton>
        <AfunBaseButton type="secondary">
          secondary
        </AfunBaseButton>
        <AfunBaseButton type="none">
          none
        </AfunBaseButton>

        <AfunBaseButton class="w-[85px]" style="--afun-base-button-padding-y:2px;--afun-base-button-font-size:14px;--afun-base-button-border-radius:4px;">
          primary
        </AfunBaseButton>
      </div>
    </div>
    <div class="component">
      <h1 class="font-bold text-[24px]">
        AfunBaseTabs
      </h1>
      <div>
        <div class="label">
          type : default 1
        </div>
        <AfunBaseTabs v-model="tab" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 2
        </div>
        <AfunBaseTabs v-model="tab" :type="2" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 3
        </div>
        <AfunBaseTabs v-model="tab" :type="3" :list="list2" />

        <AfunBaseTabs v-model="tab" :type="3" full :list="list" />
      </div>
      <div>
        <div class="label">
          type : 4
        </div>

        <AfunBaseTabs v-model="tab" :type="4" full :list="list0" class="my-[20px]" />
        <AfunBaseTabs v-model="tab" :type="4" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 5
        </div>
        <AfunBaseTabs v-model="tab" :type="5" full :list="list2" />
        <AfunBaseTabs v-model="tab" full :type="5" :list="list" class="my-[20px]" />
        <AfunBaseTabs v-model="tab" full :type="5" :list="listTip" style="--afun-tabs-wrap-padding-y:5px;" />
      </div>
      <div>
        <div class="label">
          type : 6
        </div>
        <AfunBaseTabs v-model="tab" :type="6" :list="list" />
      </div>
      <div>
        <div class="label">
          type : 7
        </div>
        <AfunBaseTabs v-model="tab" :type="7" :list="list" />
      </div>
    </div>
    <div class="components">
      <h1 class="font-bold text-[24px]">
        AfunBaseDialog
      </h1>
      <div>
        <div class="label">
          <div type="primary" @click="dialog = true">
            open dialog
          </div>
        </div>
        <AfunBaseDialog v-model="dialog">
          <div class="d">
            dsdfsd
          </div>
        </AfunBaseDialog>
      </div>
    </div>
    <div class="components">
      <h1 class="font-bold text-[24px]">
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
      <h1 class="font-bold text-[24px]">
        PhBaseSelect
      </h1>
      <div>
        <PhBaseSelect v-model="selectVal" :options="options" />
      </div>
    </div>

    <div class="components">
      <h1 class="font-bold text-[24px]">
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
      <h1 class="font-bold text-[24px]">
        message
      </h1>
      <div>
        <div class="flex gap-[20px]">
          <span @click="Message.info('info')">info</span>
          <span @click="Message.error('error')">error</span>
          <span @click="Message.success('success')">success</span>

          <span class="d" @click="msg">jsx</span>
        </div>
      </div>
    </div>
  </div>
</template>
