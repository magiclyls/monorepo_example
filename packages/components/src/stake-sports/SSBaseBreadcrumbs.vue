<script setup lang='ts'>
import { IconUniArrowrightLine } from '@tg/icons'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  [k: string]: any
  value: string
  label: string
}
interface Props {
  list: BreadcrumbItem[]
  onlyLast?: boolean // 只显示最后一个
}
defineOptions({
  name: 'SSBaseBreadcrumbs',
})
const props = defineProps<Props>()
const emit = defineEmits(['itemClick'])
const route = useRoute()
const lastIndex = computed(() => props.list.length - 1)
const lastItem = computed(() => props.list[lastIndex.value])

function handleClick(item: BreadcrumbItem, index: number) {
  emit('itemClick', { list: props.list, item, index })
}
function checkRoute(v: string) {
  return route.path.split('/').includes(v)
}
</script>

<template>
  <div class="base-breadcrumbs">
    <div class="wrap">
      <div v-if="onlyLast" class="bread-item" @click="handleClick(lastItem, lastIndex)">
        <span>{{ lastItem.label }}</span>
      </div>
      <template v-else>
        <div
          v-for="b, i in list" :key="i" class="bread-item"
          :class="{ active: checkRoute(b.value) }"
        >
          <span @click="handleClick(b, i)">{{ b.label }}</span>
          <IconUniArrowrightLine v-show="i !== list.length - 1" style="font-size: 11.2rem;margin: 0 4rem;" />
        </div>
      </template>
    </div>
  </div>
</template>

<style>
:root {
  --ss-base-breadcrumbs-color1: #6d7693;
  --ss-base-breadcrumbs-color2: #fff;
}
</style>

<style lang='scss' scoped>
.base-breadcrumbs {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;

  .wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bread-item {
    display: inline;
    font-size: 14rem;
    color: var(--ss-base-breadcrumbs-color1);
    font-weight: 600;
    white-space: nowrap;

    span {
      cursor: pointer;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--ss-base-breadcrumbs-color2);
      }
    }

    &.active {
      color: var(--ss-base-breadcrumbs-color2);
    }
  }
}
</style>
