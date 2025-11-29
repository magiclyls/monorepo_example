<script setup lang="ts">
import { IconPerson } from '@tg/icons'
import BaseImage from '../BaseImage.vue'

interface Props {
  gameInfo: {
    img?: string
    name?: string
    platform_id?: string
    platform_name: string
    game_id?: string
    [k: string]: any
    maintained: string
    game_type: string
    online_num: number
  }
}

withDefaults(defineProps<Props>(), {
})
const emits = defineEmits(['gameStart', 'onFav'])

function gameStart() {
  emits('gameStart')
}
</script>

<template>
  <div class="product-item w-full bg-[rgb(240, 241, 245)] flex flex-col rounded-[16px] relative top-0 cursor-pointer hover:[&_.mask]:!opacity-100" @click="gameStart">
    <div class="w-full relative overflow-hidden rounded-[16px] aspect-square">
      <BaseImage class="w-full" :url="gameInfo.img || ''" :name="gameInfo.name" is-network loading="eager" />
    </div>

    <div class="absolute top-[2px] right-[2px] p-[1px] rounded-full bg-[rgba(0,0,0,0.3)]">
      <IconPerson class="w-[15px] h-[15px]" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
