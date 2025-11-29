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
  <div class="product-item w-full bg-[rgb(240, 241, 245)] flex flex-col rounded-[16rem] relative top-0 cursor-pointer hover:[&_.mask]:!opacity-100" @click="gameStart">
    <div class="w-full relative overflow-hidden rounded-[16rem] aspect-square">
      <BaseImage class="w-full" :url="gameInfo.img || ''" :name="gameInfo.name" is-network loading="eager" />
    </div>

    <div class="absolute top-[2rem] right-[2rem] p-[1rem] rounded-full bg-[rgba(0,0,0,0.3)]">
      <IconPerson class="w-[15rem] h-[15rem]" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
