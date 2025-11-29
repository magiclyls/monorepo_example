<script lang="ts" setup>
const { gameUrl } = useMiniGame('dice')
</script>

<template>
  <div>
    123 {{ gameUrl }}
    <WujieVue
      :key="gameUrl"
      width="100%"
      height="100%"
      name="Dice"
      :url="gameUrl"
    />
    234
  </div>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>
