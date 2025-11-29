<script lang="ts" setup>
const { name } = useUrlState('modal')
console.log('🚀 ~ name:', name)
</script>

<template>
  <div class="login-bg relative h-full w-full overflow-hidden bg-gray-900 @md:h-[40rem] @md:w-[50rem] @md:rounded-[1rem]">
    <Suspense timeout="0">
      <AppBcGameUserRegister v-if="name == 'bg-register'" />
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
.login-bg {
  background-color: rgb(35,38,38);
}

// .login-bg-mobile {
//   width: 50rem;
//   height: 40rem;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// }
</style>
