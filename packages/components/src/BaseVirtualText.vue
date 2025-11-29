<script lang="ts" setup>
import {
  computed,
} from 'vue'

interface Props {
  text: string
}
defineOptions({
  name: 'BaseVirtualText',
})
const props = withDefaults(defineProps<Props>(), {
  text: '',
})

const strs = computed(() => {
  const text = props.text
  const brand1 = text.slice(0, 4)
  const brand3 = text.slice(-4)
  const middle = text.slice(4, -4)
  const group1 = middle.slice(0, 15)
  const brand2 = middle.slice(15, 19)
  const group2 = middle.slice(19)
  return { brand1, brand2, brand3, group1, group2 }
})
</script>

<template>
  <div class="notranslate break-all rounded-lg p-2  break-all bg-input_bright">
    <span class="text-brand">{{ strs.brand1 }}</span>{{ strs.group1 }}<span class="text-brand">{{ strs.brand2 }}</span>{{ strs.group2 }}<span class="text-brand">{{ strs.brand3 }}</span>
  </div>
</template>

<style lang="scss" scoped>
.text-brand {
  color: rgb(36, 238, 137);
}
.bg-input_bright {
  background-color: rgb(41, 45, 46);
  color: white; //inherit body
}
</style>
