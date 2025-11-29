<script lang="ts" setup>
const route = useRoute()
const { pause, resume } = useIntervalFn(() => {
  addPrize()
}, 4000, {
  immediate: false,
})

const prize = ref(0)

const prizeFormat = computed(() => formatWithSubstring(Number(prize.value ?? 0.00).toFixed(2)))

function addPrize() {
  prize.value = +prize.value + Math.random() * 200
  Local.set('local_prize_pool', prize.value)
}

onMounted(() => {
  const val = Local.get('local_prize_pool')?.value as string
  prize.value = val && +val > 0 ? +val : (Math.random() * 400000 + 100000)
  Local.set('local_prize_pool', prize.value)
  resume()
})

onBeforeUnmount(() => {
  pause()
})

watch(route, (val) => {
  if (val.name === 'casino-home' || val.path === '/')
    resume()
  else
    pause()
})
</script>

<template>
  <div class="app-prize-pool box-border aspect-[335/82] w-full flex items-end justify-center gap-[2px] pb-[5.63%]">
    <div
      v-for="p, pdx in prizeFormat"
      :key="pdx"
      class="h-[29%]"
      :class="[
        +p >= 0 ? 'aspect-[14/24]' : 'aspect-[7/24]',
        +p >= 0 ? `num-${p} num-item` : (p === '.' ? 'num-dot' : 'num-comma'),
      ]"
      :style="{ backgroundPositionY: `${(+p) * 1 / 9 * 100}%` }"
    />
  </div>
</template>

<style lang="scss" scoped>
.app-prize-pool {
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  @include getBackgroundImage('/home/prize_pool');
  .num-item {
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position-x: 0;
    background-position-y: 0;
    overflow: hidden;
    transition: background-position-y 2s ease-out;
    @include getBackgroundImage('/home/num_0_9');
  }
  .num-dot, .num-comma {
    transition: none;
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .num-dot {
    @include getBackgroundImage('/home/num_dot');
  }
  .num-comma {
    @include getBackgroundImage('/home/num_comma');
  }
}
</style>
