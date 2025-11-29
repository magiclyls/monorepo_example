<script lang="ts" setup>
defineOptions({
  name: 'AppGlobalLimited',
})
const router = useLocalRouter()
const route = useRoute()
const { brandConfig } = storeToRefs(useBrandStore())
watchEffect(() => {
  if (brandConfig.value) {
    const { ban, bl } = brandConfig.value
    if (ban)
      router.replace('/limit-ip?limitType=area')
    else
    if (route.name?.toString().includes('limit-ip') && !ban)
      router.replace('/')

    if (bl)
      router.replace('/limit-ip?limitType=ip')
    else
    if (route.name?.toString().includes('limit-ip') && !bl)
      router.replace('/')
  }
})
</script>

<template>
  <div />
</template>
