<script setup lang="ts">
interface Props {
  menuInfo: any
  autoShow?: boolean

}
defineOptions({
  name: 'BaseAccordion2',
})
const props = withDefaults(defineProps<Props>(), {
  menuInfo: () => {
    return {
      title: '',
      list: [],
    }
  },
  autoShow: false,

})

const emit = defineEmits(['clickHead', 'clickItem', 'radioChange'])

const { bool: isShow, setBool: setAutoShowBool } = useBoolean(props.autoShow)

const showDown = computed(() => {
  return props.menuInfo?.list?.length
})

function handleClickHeader() {
  setAutoShowBool(!isShow.value)
  emit('clickHead', props.menuInfo, isShow.value)
}
function handleClickItem(item: any) {
  emit('clickItem', item)
}
function close() {
  setAutoShowBool(false)
}

defineExpose({ close })
</script>

<template>
  <div class="base-accordion" :class="{ 'only-accordion': !isShow }">
    <div class="accordion-header" :class="{ isShow }" @click="handleClickHeader">
      <div class="mask" />
      <div class="title flex-center">
        <span class="header-title">{{ menuInfo.title }}</span>
      </div>
      <slot name="icon" :is-show="isShow" />
    </div>
    <div
      v-if="showDown" class="accordion-content" :style="`max-height:${isShow ? '2000px' : 0};`"
    >
      <!-- transition: max-height ${isShow ? '1' : '0.3'}s ; -->
      <div class="wrap">
        <div v-for="item of menuInfo.list" :key="item.id" class="content-item" @click="handleClickItem(item)">
          <span class="header-title">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-accordion-header-height: 45px;
  --tg-base-accordion-arrow-active: #55708680;
  --tg-base-accordion2-head-font-size: 16px;
  --tg-base-accordion2-content-font-size: 14px;
}
</style>

<style scoped lang="scss">
.base-accordion {

  font-weight: var(--tg-font-weight-semibold);

  --tg-radio-group-style-gap-vertical: 0;
  --tg-radio-group-style-gap-horizontal: 0;
  --tg-base-radio-style-just-content: space-between;
  --tg-base-radio-style-flex-direction: row-reverse;
  // background-color: #213743;
  .accordion-header {
    display: flex;
    height: var(--tg-base-accordion-header-height);
    min-height: 45px;
    padding: 0 10px;
    border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: var(--tg-base-accordion2-head-font-size);
    color: var(--tg-text-white);
    position: relative;
    background-color: var(--tg-secondary-grey);
    @include webTheme('greenblack') {
      background-color: var(--tg-secondary-dark);
    }
    @include webTheme('green') {
      background-color: #076237;
    }
    @include webTheme('white'){
      background-color: #FFFFFF;
      border: 1px solid #C1C1C1;
      border-radius: 4px;
      --tg-text-white:#111111;
    --tg-icon-color:#111111;
    }
    .title {
      flex: 1;
      justify-content: flex-start;
      width: 0;
    }

    &.isShow {
      --tg-icon-color: var(--tg-text-white);
    }
    .mask{
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 9;
      background-color: rgba(51, 155, 198, 0.5);
      @include webTheme('greenblack') {
        background-color:  rgba(31, 162, 122, 0.5);
      }
      @include webTheme('white') {
        background-color:  rgba(212, 212, 212, 0.5);
      }
      @include webTheme('green') {
        background-color:  #076237;
      }

    }
    &:active{
      .mask{
       /*  display: block; */
        display: none;
      }

    }
   /*  &:hover {
      background-color: var(--tg-secondary-main);
      --tg-icon-color: var(--tg-text-white);

      .icon-img {
        filter: brightness(2);
      }
    } */
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .accordion-content {
    max-height: 0;
    overflow: hidden;
    // transition: max-height 0.8s;
    background-color: var(--tg-secondary-grey);
    font-size: var(--tg-base-accordion2-content-font-size);
    color: var(--tg-text-lightgrey);
    font-weight: 600;
    border-radius:0 0 var(--tg-radius-default) var(--tg-radius-default) ;
    @include webTheme('greenblack') {
      color: var(--tg-text-lightgrey);
      background-color: var(--tg-secondary-dark);
    }
    @include webTheme('green') {
      color: #ffffff;
      background-color: #02432D;

    }

    .content-item,
    .radio-menu-item {
      height: 20px;
      display: flex;
      border-radius: var(--tg-radius-default);
      align-items: center;
      cursor: pointer;

      >div {
        height: 100%;
      }
    }
    .wrap{
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 16px 10px;
        border-top: 2px solid var(--tg-secondary-main);
        @include webTheme('white'){
          background-color: #FFFFFF;
          border: 1px solid #E0E0E0;
          box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.21);
          border-top: none;

        }
    }

    /* .content-item:hover,
    .radio-menu-item:hover {
      background-color: var(--tg-secondary-main);
    } */
  }

  .header-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
}

.only-accordion {
  border-radius:  var(--tg-radius-default);
  overflow: hidden;
}
</style>
