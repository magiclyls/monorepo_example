<script lang="ts" setup>
import { AfunBaseImage, AfunBaseEmpty } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniMaintained } from '@tg/icons'

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
  <div
    class="base-provider-item"
    :class="{ active, bg: showBg, maintain: maintained === '2' }"
  >
    <div class="img-wrap">
      <AfunBaseImage v-if="!isError" :loading="loading" :url="url" is-cloud @error-img="isError = true" />
      <AfunBaseImage v-else url="/png/home/provider-error.png" />
    </div>
    <div v-if="maintained === '2'" class="center maintained-wrap">
      <AfunBaseEmpty>
        <template #icon>
          <IconUniMaintained style="font-size:20px" />
        </template>
        <template #description>
          <span style="font-size: 12px;">
            {{ $t('场馆维护中') }}
          </span>
        </template>
      </AfunBaseEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-provider-item {
  position: relative;
  will-change: transform;
  transition: all 0.3s ease 0s;
  border-radius: 8px;
  display: block;
  cursor: pointer;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(27, 23, 23, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.12);
  &::before {
    content: '';
    display: block;
    width: 100%;
    padding-top: 40%;
  }
  &:hover {
    transform: translateY(-4%);
    box-shadow:
      0 4px 6px 2px rgba(27, 23, 23, 0.2),
      0 2px 4px 2px rgba(0, 0, 0, 0.12);
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
    background: rgba(26, 46, 56, 0.8);
  }
  &.bg {
    background-color: #2f4553;
  }

  &.active {
    background-color: #1475e1;
  }
}
</style>
