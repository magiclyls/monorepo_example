<script lang="ts" setup>
import { IconUniMaintain } from '@tg/icons';
interface Props {
  url: string
  active?: boolean
  showBg?: boolean
  maintained?: string
  loading?: 'eager' | 'lazy'
}
defineOptions({
  name: 'BaseProviderItem',
})
withDefaults(defineProps<Props>(), {
  loading: 'lazy',
})

const { bool: isError } = useBoolean(false)
</script>

<template>
  <div class="base-provider-item" :class="{ active, bg: showBg, maintain: maintained === '2' }">
    <div class="img-wrap">
      <BaseImage v-if="!isError" :loading="loading" :url="url" is-cloud with-theme @error-img="isError = true" />
      <BaseImage v-else with-theme url="/png/home/provider-error.png" />
    </div>
    <div v-if="maintained === '2'" class="center maintained-wrap">
      <BaseEmpty>
        <template #icon>
          <IconUniMaintain style="--tg-base-button-font-size:20px" name="uni-maintain" />
        </template>
        <template #description>
          <span style="font-size: var(--tg-font-size-xs);">
            {{ $t('plat_maintain') }}
          </span>
        </template>
      </BaseEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-provider-item {
  position: relative;
  will-change: transform;
  transition: all 0.3s ease 0s;
  border-radius: var(--tg-radius-md);
  display: block;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(27, 23, 23, .2), 0 2px 4px -1px rgba(0, 0, 0, .12);

  &::before {
    content: "";
    display: block;
    width: 100%;
    padding-top: 40%;
  }

  &:hover {
    transform: translateY(-4%);
    box-shadow: 0 4px 6px 2px rgba(27, 23, 23, .2), 0 2px 4px 2px rgba(0, 0, 0, .12);
  }

  &.maintain {
    cursor: not-allowed;
  }

  .img-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .maintained-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    --tg-empty-text-padding: 0;
    background: #{rgba($color: var(--tg-color-blue-rgb), $alpha: 0.8)};
  }

  &.bg {
    background-color: var(--tg-secondary-main);
  }

  &.active {
    background-color: var(--tg-text-blue);
  }
}
</style>
