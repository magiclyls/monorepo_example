<script setup lang='ts'>
defineOptions({
  name: 'AppCookie',
})
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { push } = useLocalRouter()
const { bool: show } = useBoolean(!Local.get<boolean>(STORAGE_COOKIE)?.value)
function accept() {
  show.value = false
  Local.set(STORAGE_COOKIE, true)
}
</script>

<template>
  <div
    v-if="show"
    class="app-cookie" :class="{ 'is-h5': isMobile }"
  >
    <div class="wrap">
      <p>
        <BaseButton type="text" size="none" @click="push('/policies/cookies')">
          <span class="btn">🍪 {{ t('we_use_cookie') }}</span>
        </BaseButton>
        {{ t('cookie_purposes') }}
      </p>
      <BaseButton size="sm" bg-style="primary" @click="accept">
        {{ t('accept') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-cookie {
  position: fixed;
  color: var(--tg-text-grey-light);
  width: max-content;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  background-color: var(--tg-secondary-main);
  border-radius: var(--tg-radius-default);
  padding: var(--tg-spacing-12) var(--tg-spacing-16);
  margin: var(--tg-spacing-16) 0;
  box-shadow: var(--tg-header-shadow);
  max-width: calc(100% - 2em);
  z-index: var(--tg-z-index-secondary);
  .wrap{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--tg-spacing-16);
    line-height: 1.5;
    p{
      font-size: var(--tg-font-size-default);
      color: var(--tg-text-lightgrey);
      .btn{
        color: var(--tg-text-white);
        font-weight: var(--tg-font-weight-semibold);
      }
    }
  }
  &.is-h5{
    bottom: var(--tg-spacing-60);
    .wrap{
      flex-direction: column;
      align-items: normal;
    }
  }
}
</style>
