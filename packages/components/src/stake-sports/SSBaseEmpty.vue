<script lang="ts" setup>
import { IconSptUserBet } from '@tg/icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  description?: string
}
defineOptions({
  name: 'SSBaseEmpty',
})

const props = defineProps<Props>()

const { t } = useI18n()

const emptyDescription = computed(
  () => props.description || t('暂无文章'),
)
</script>

<template>
  <div class="base-empty">
    <div class="icon">
      <slot name="icon">
        <IconSptUserBet class="text-[#9DABC9]" />
      </slot>
    </div>
    <div class="description">
      <slot name="description">
        <span>
          {{ emptyDescription }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style>
:root {
  --ss-empty-padding: 16rem;
  --ss-empty-icon-size: 80rem;
  --ss-base-empty-des-color: #6d7693;
}
</style>

<style lang="scss" scoped>
.base-empty {
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: var(--ss-empty-padding);

  .icon {
    display: flex;
    font-size: var(--ss-empty-icon-size);
  }

  .description {
    font-size: 14rem;
    color: var(--ss-base-empty-des-color);
    font-weight: 500;
    line-height: 20rem;
    margin-top: 6rem;
  }
}
</style>
