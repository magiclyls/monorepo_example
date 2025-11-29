<script lang="ts" setup>
import Home from './home.vue'

const route = useRoute()
const { getSuspenseStatus } = useLayoutAnimate({ aniSuspense: true })

const keepAliveList = ref<string[]>([])

function suspenseResolved() {
  getSuspenseStatus('suspense-resolved')
}
</script>

<template>
  <Home>
    <template #default>
      <div>
        <AppContent class="@container">
          <RouterView v-slot="{ Component }">
            <template v-if="Component">
              <KeepAlive :include="keepAliveList" :max="10">
                <Suspense timeout="0" @resolve="suspenseResolved">
                  <component :is="Component" :key="route.path" />
                  <template #fallback>
                    <AppLoading full-screen />
                  </template>
                </Suspense>
              </KeepAlive>
            </template>
          </RouterView>
        </AppContent>
      </div>
    </template>
  </Home>
</template>

<style scoped lang="scss">
</style>
