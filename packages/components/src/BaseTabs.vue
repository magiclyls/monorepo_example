<script lang="ts" setup>
interface Props {
  list: Array<{ title: string, [key: string]: any }>
  active: number
  type?: number
}

defineOptions({
  name: 'BaseTabs',
})

withDefaults(defineProps<Props>(), {
  type: 1,
})

const emit = defineEmits(['update:active'])

function handlePressDown($event: any) {
  $event.target.style.transition = 'transform .1s'
  $event.target.style.transform = 'translateY(2px)'
}

function handlePressUp($event: any) {
  $event.target.style.transform = ''
}

function scrollIntoView(tab: any) {
  tab.target.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}
</script>

<template>
  <div>
    <div v-if="type === 1" class="tabs-title tabs-title-1 scroll-x hide-scroll   flex">
      <button
        v-for="item, index in list"
        :key="item.title" class="tabs-btn tabs-btn-1 btn-like cursor-pointer"
        :class="{ active: index === active }"
        @click="emit('update:active', index)" @mousedown="handlePressDown($event)" @mouseup="handlePressUp($event)" @touchstart="handlePressDown($event)" @touchend="handlePressUp($event)"
      >
        {{ item.title }}
      </button>
    </div>
    <div v-if="type === 2" class="tabs-title tabs-title-2 scroll-x hide-scroll   flex">
      <button
        v-for="item, index in list"
        :key="item.title" class="tabs-btn tabs-btn-2 btn-like cursor-pointer"
        :class="{ active: index === active }"
        @click="emit('update:active', index)" @mousedown="handlePressDown($event)" @mouseup="handlePressUp($event)" @touchstart="handlePressDown($event)" @touchend="handlePressUp($event)"
      >
        {{ item.title }}
      </button>
      <div class="tabs-indicator" />
    </div>
    <div v-if="type === 3" class="hid flex px-4 -mx-4 overflow-auto hide-scroll gap-2">
      <button
        v-for="item, index in list"
        :key="item.title" class="mr-0.5 last:mr-0 shrink-0 flex h-10 items-center justify-center rounded-lg px-2 py-0 hover:bg-[#2a2d2e] btn-like cursor-pointer"
        :class="{ 'bg-tab_selected': index === active }"
        :style="{ border: index === active ? 'var(--tabs-active-border)' : 'none' }"
        @click="emit('update:active', index);scrollIntoView($event)"
      >
        <img class="h-4.5 w-4.5" :src="item.icon" alt="" width="var(--tabs-icon-size)" height="var(--tabs-icon-size)">
        <span class="ml-1 whitespace-nowrap"> {{ item.title }}</span>
      </button>
    </div>
    <div v-if="type === 9" class="flex">
      <button
        v-for="item, index in list"
        :key="item.title" class="mr-2 last:mr-0 text-xs button flex-1 p-1 flex items-center justify-center h-auto whitespace-nowrap rounded-none border-b-2 font-normal text-[#b3bec1] border-b-transparent cursor-pointer"
        :class="{ '!border-b-[#2cd97d] !font-bold !text-[#ffffff]': index === active }"
        @click="emit('update:active', index)" @mousedown="handlePressDown($event)" @mouseup="handlePressUp($event)" @touchstart="handlePressDown($event)" @touchend="handlePressUp($event)"
      >
        {{ item.title }}
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --tabs-width: 0;
  --tabs-indicator-position: 0;
  --tabs-icon-size: 18px;
  --tabs-padding: 0 0.5rem 0 0.5rem;
  --tabs-border-radius: 0.5rem;
  --tabs-active-border: none;
  --tabs-title-color: #b3bec1;
  --tabs-btn-bg-color: #232626;
}
</style>

<style scoped lang="scss">
.btn-like {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  touch-action: manipulation;
  padding: var(--tabs-padding);
  border-radius: var(--tabs-border-radius);
  border: var(--tabs-border);
  color: var(--tabs-title-color);
  background-color: var(--tabs-btn-bg-color);
}

.tabs-title {
  position: relative;
  display: flex;
  height: 2.5rem;
  border-radius: var(--tabs-border-radius);
  color: var(--tabs-title-color);
  overflow: hidden;
  &-1 {
    background-color: #333738;
  }
}

.tabs-btn {
  flex: 1;
  align-self: stretch;
  text-wrap: nowrap;
  padding: var(--tabs-padding);
  display: flex;
  justify-content: center;
  align-items: center;
  &-1 {
    border-radius: 0.5rem;
    background-color: #333738;
    &.active {
      background-color: #3b4142;
      color: #ffffff;
      font-weight: 800;
    }
  }
  &-2 {
    &.active {
      color: #ffffff;
      font-weight: 800;
    }
  }
}

.tabs-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.15rem;
  width: var(--tabs-width);
  background-color: #2cd97d;
  transition: transform 0.3s;
  transform: translate(var(--tabs-indicator-position));
}

.bg-tab_selected {
  background-color: #3b4142;
  color: #ffffff;
  font-weight: 800;
}
</style>
