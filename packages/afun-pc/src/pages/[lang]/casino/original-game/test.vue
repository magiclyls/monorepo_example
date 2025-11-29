<script setup lang='ts'>
const baseTile = { result: '', openByPlayer: false }
const column = ref(9)
const row = ref(3)

const tileList = ref(iniTileList())

function iniTileList() {
  const arrCol = []
  let arrRow = []

  for (let ci = 0; ci < column.value; ci++) {
    arrRow = []
    for (let ri = 0; ri < row.value; ri++) {
      const item = cloneDeep(baseTile)
      arrRow.push(item)
    }
    arrCol.push(arrRow)
  }

  return arrCol
}

// const result = ref([])
// const chosen

function onTailClick(r: number, c: number) {
  console.log('🦺🦺🦺 ~ onTailClick ~ r:', r, c)
  tileList.value[r][c].openByPlayer = true
}
</script>

<template>
  <div class="w-[800px] flex flex-col-reverse gap-[5px] p-[20px]">
    <div v-for="r, i in tileList" :key="i" class="flex gap-[5px]">
      <div
        v-for="c, ii in r" :key="ii" class="text-tg-text-white h-[50px] w-[100px] flex items-center justify-center rounded-sm"
        :class="c.openByPlayer ? 'bg-red-400' : 'bg-slate-400'" @click="onTailClick(i, ii)"
      >
        {{ `${i}-${ii}` }}
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
  </route>
