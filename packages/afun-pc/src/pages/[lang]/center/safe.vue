<script setup lang="ts">

</script>

<template>
  <div>
    <Suspense :timeout="0">
      <AppVaultDescription />
      <template #fallback>
          <AppLoading full-screen />
      </template>
    </Suspense>
    </div>
</template>

<route lang="yaml">
meta:
  layout: center
</route>
