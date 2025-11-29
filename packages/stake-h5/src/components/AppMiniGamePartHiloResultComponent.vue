<script setup lang="ts">
interface Props {
  result: number[]
}
defineOptions({
  name: 'AppMiniGamePartHiloResultComponent',
})
const props = withDefaults(defineProps<Props>(), {
})

// const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
// const suits = ['S', 'H', 'D', 'C']

// const randomCards = ref<any[]>([])

const pokers = computed(() => props.result?.map(i => PokerArray[+i]))

// function getRandomInt(max: number) {
//   return Math.floor(Math.random() * max)
// }

// function getRandomCards() {
//   for (let i = 0; i < 53; i++) {
//     randomCards.value.push({
//       rank: ranks[getRandomInt(ranks.length)],
//       suit: suits[getRandomInt(suits.length)],
//     })
//   }
// }

// onMounted(() => {
//   getRandomCards()
// })

// watch(() => props.result, () => {
//   getRandomCards()
// })
</script>

<template>
  <div class="content">
    <div class="wrap w-full">
      <div class="wrap scroll-x">
        <div class="flex-row-8 slide-down w-fit flex items-center justify-center">
          <template v-for="(card, idx) in pokers" :key="idx">
            <AppMiniGamePokerCard :rank="card.rank" :color="card.suit" :face-down="false" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-row-8{
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  width: 100%;
}
</style>
