<script setup lang='ts'>
interface Props {
  list: any[]
}
defineOptions({
  name: 'AppSportsEventTypeTab',
})
defineProps<Props>()
const emit = defineEmits(['change'])
const currentTab = defineModel({ type: Number, required: true })
const { isMobile } = storeToRefs(useWindowStore())

const hoverTab = ref('')

function onClick(item: ISelectOptionNumber) {
  currentTab.value = item.value
  emit('change', item.value)
}

function onMouseenter(v: string) {
  hoverTab.value = v
}
function onMouseLeave() {
  hoverTab.value = ''
}
</script>

<template>
  <BaseSelect
    v-if="isMobile" v-model="currentTab" popper :options="list"
    style="--tg-base-select-popper-bg-color:transparent;
    --tg-base-select-hover-bg-color:transparent;
    --tg-base-select-popper-style-padding-x:0;
    --tg-base-select-popper-style-padding-y:0;"
    @select="$emit('change')"
  >
    <template #label="{ data }">
      <div class="select-label" style="filter: brightness(var(--app-sprots-tab-brightness));">
        <AppImage
          width="18px" height="18px"
          :url="data?.icon" is-cloud
          with-theme
        />
        <span class="ml-[8px]">{{ data?.label }}</span>
      </div>
    </template>
  </BaseSelect>
  <div v-else class="event-type-tab">
    <div
      v-for="t in list" :key="t.value" class="tab"
      :class="{ active: t.value === currentTab }"
      @mouseenter="onMouseenter(t.value)" @mouseleave="onMouseLeave"
      @click="onClick(t)"
    >
      <AppImage
        with-theme
        width="18px" height="18px"
        :url="t.icon"
        is-cloud
        :style="{ filter: hoverTab === t.value || t.value === currentTab ? ' brightness(var(--app-sprots-tab-brightness))' : ' brightness(1)' }"
      />
      <span class="ml-[8px]">{{ t.label }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --app-sprots-tab-brightness: 2;
}

[theme="green"] {
  --app-sprots-tab-brightness: 1;
 }

 [theme="greenblack"] {
  --app-sprots-tab-brightness: 1;
 }

 [theme="white"] {
  --app-sprots-tab-brightness: 1;
 }
</style>

<style lang='scss' scoped>
.select-label {
  font-size: var(--tg-font-size-md);
  font-weight: var(--tg-font-weight-semibold);
  color: var(--tg-text-white);
  --tg-icon-color: var(--tg-text-white);
  display: flex;
  // gap: var(--tg-spacing-8);
  align-items: center;
  line-height: 25px;
}

.event-type-tab {
  font-size: var(--tg-font-size-md);
  font-weight: var(--tg-font-weight-semibold);
  color: var(--tg-text-lightgrey);
  display: flex;
  @include webTheme('green') {
    color: var(--tg-text-green-sub);
  }
  >* {
    margin-right: var(--tg-spacing-26);
  }
  >:last-child {
    margin-right: 0;
  }

  .tab {
    display: flex;
    // gap: var(--tg-spacing-8);
    align-items: center;
    line-height: 25px;
    cursor: pointer;

    &:active {
      transform: scale(0.96);
    }

    &:hover,
    &.active {
      color: var(--tg-text-white);
      --tg-icon-color: var(--tg-text-white);
    }
  }
}
</style>
