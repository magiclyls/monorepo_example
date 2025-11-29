<script setup lang='ts'>
import { IconUniUnionpay, IconUniBankDelete, IconUniDArrowRight } from '@tg/icons'
interface Props {
  modelValue?: string
}
defineOptions({
  name: 'AppBankAndCoinAddress',
})
withDefaults(defineProps<Props>(), {

})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="app-bank-address">
    <div class="app-label">
      <span class="title">出款银行卡（3/3）</span>

      <BaseButton
        style="--tg-base-button-font-weight: var(--tg-font-weight-normal);"
        type="text" size="none"
      >
        <span style="padding-right: var(--tg-spacing-4);">前往卡包</span>
        <IconUniDArrowRight class="text-[16px]" />

      </BaseButton>
    </div>
    <div class="content-box">
      <div v-for="i in 3" :key="i" class="item">
        <IconUniUnionpay />
        <div class="info">
          <span>中国建设银行</span>
          <span>8888 8888 8888 8888 88</span>
        </div>
        <BaseButton type="text" size="none">
          <IconUniBankDelete
            style="font-size: var(--tg-font-size-base);"
          />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-bank-address{
  .app-label{
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.4;
    margin-bottom: var(--tg-spacing-8);
    .title{
      color: var(--tg-text-white);
    }
  }
  .content-box{
    // background: #0F212E;
    box-shadow: 0px 2px 2px 0px #000000B2;
    background: linear-gradient(256.03deg, #0F212E 14.62%, #1A303F 52.68%);
    border-radius: var(--tg-radius-md);
    padding: var(--tg-spacing-10) var(--tg-spacing-8);
    .item{
      display: flex;
      align-items: center;
      gap: var(--tg-spacing-8);
      padding: var(--tg-spacing-4) var(--tg-spacing-4) var(--tg-spacing-4) var(--tg-spacing-16);
      line-height: 1.4;
    }
    .item+.item{
      border-top: 0.5px solid rgba(177, 186, 211, 0.5);
      margin-top: var(--tg-spacing-4);
    }
    .info{
      display: flex;
      flex-direction: column;
      color:var(--tg-text-white);
      flex: 1;

    }
    .add{
      min-height: 76px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--tg-spacing-8);
      line-height: 1.4;
    }
  }
}
</style>
