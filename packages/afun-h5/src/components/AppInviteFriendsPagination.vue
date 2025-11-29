<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppInviteFriendsPagination',
})
const props = withDefaults(defineProps<Props>(), {
  size: 10,
})
const emit = defineEmits(['update:currentPage'])

interface Props {
  total: number
  size: number
}

const { t } = useI18n()
const currentPage = ref(1)
const totalPage = computed(() => Math.ceil(props.total / props.size))

function pre() {
  if (currentPage.value <= 1)
    return
  currentPage.value = currentPage.value - 1
  emit('update:currentPage', currentPage.value)
}

function next() {
  if (currentPage.value === totalPage.value)
    return
  currentPage.value = currentPage.value + 1
  emit('update:currentPage', currentPage.value)
}

function onNumberPage(page: number) {
  if (currentPage.value === page)
    return
  currentPage.value = page
  emit('update:currentPage', currentPage.value)
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="pre-btn mr-[8px] text-[14px]" :class="{ disable: currentPage === 1 }" @click="pre">
      {{ t('上一页') }}
    </div>
    <div v-for="item in totalPage" :key="item" class="page-btn" :class="{ active: currentPage === item }" @click="onNumberPage(item)">
      {{ item }}
    </div>
    <div class="ml-[8px] text-[14px] next-btn" :class="{ disable: currentPage === totalPage }" @click="next">
      {{ t('下一页') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pre-btn,
.next-btn {
  cursor: pointer;
  color: #fff;
  &.disable {
    color: #b1bad3;
    cursor: default;
  }
}
.page-btn {
  cursor: pointer;
  font-size: 14px;
  color: #b1bad3;
  width: 28px;
  height: 28px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  &.active {
    background: #213743;
  }
}
</style>
