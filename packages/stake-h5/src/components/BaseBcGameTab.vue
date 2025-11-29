<script setup lang="ts">
interface TabItem {
  [text: string]: any
  value: string | number
  label: string | number
  icon?: Component
}
interface Props {
  tabs: TabItem[]
  activeTab: string | number
  className?: string
  isGap?: boolean
}

defineOptions({
  name: 'BaseBcGameTab',
})
const props = withDefaults(defineProps<Props>(), {
  isGap: false,
})
const emits = defineEmits(['update:activeTab', 'change'])

const activeTab = computed(() => props.activeTab)
function selected(item: TabItem) {
  emits('update:activeTab', item.value)
  emits('change', item.value, item)
}
</script>

<template>
  <div class="scroll-x tabs-title hide-scroll ml-auto mt-[8px]" :class="[className, isGap ? 'p-[4px]' : '']">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tabs-btn btn-like"
      :aria-selected="tab.value == activeTab ? true : null"
      @click="selected(tab)"
    >
      <div class="center">
        <component v-if="tab.icon" :is="tab.icon" class="icon-text" ></component>
        <div>{{ tab.label }}</div>
      </div>
    </button>
  </div>
</template>

<style>
:root{
  --bc-base-tab-height: 40px;
  --bc-base-tab-padding: 4px;
  --bc-base-tab-radius: 8px;
  --bc-base-tab-text-color: rgb(179 190 193);
  --bc-base-tab-bg-color: rgb(50 55 56);
  --bc-base-tab-btn-pl: 8px;
  --bc-base-tab-btn-pr: 8px;
  --bc-base-tab-btn-active-bg-color: rgb(58 65 66);
  --bc-base-tab-btn-active-text-color: rgb(255 255 255);
  --bc-base-tab-btn-active-icon-color: rgb(36 238 137);
  --bc-base-tab-btn-icon-font-size: 20px;

}
</style>

<style scoped lang="scss">
  button{
      background: none;
      text-transform: none;
  }
  .tabs-title{
      display: flex;
      flex: none;
      height: var(--bc-base-tab-height);
      position: relative;
      border-radius: var(--bc-base-tab-radius);
      color: var(--bc-base-tab-text-color);
  }
  .tabs-title:not([data-type]){
      background-color: var(--bc-base-tab-bg-color)
  }
  .tabs-title:not([data-type]) .tabs-btn{
    border-radius: var(--bc-base-tab-radius);
  }
  .hide-scroll{
      scrollbar-width: none;
  }
  .scroll-x{
      overflow-y: hidden;
      overflow-x: auto;
      overscroll-behavior: contain;
  }
  .tabs-btn{
      flex: 1;
      align-self: stretch;
      text-wrap: nowrap;
      padding-left: var(--bc-base-tab-btn-pl);
      padding-right: var(--bc-base-tab-btn-pr);
      .icon-text{
        color: var(--bc-base-tab-text-color);
        font-size: var(--bc-base-tab-btn-icon-font-size);
      }
      &[aria-selected]{
        background-color: var(--bc-base-tab-btn-active-bg-color);
        color: var(--bc-base-tab-btn-active-text-color);
        font-weight: 800;
        & .icon-text{
          color: var(--bc-base-tab-btn-active-icon-color);
        }
      }
  }
  .btn-like{
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      touch-action: manipulation;
      &:active{
          filter: brightness(1.05);
          transform: translateY(1px);
      }
  }
</style>
