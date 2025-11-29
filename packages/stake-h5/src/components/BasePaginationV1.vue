<script setup lang="ts">
import { computed } from 'vue'
import { IconUniArrowLeft, IconUniArrowRight } from '@tg/icons';

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

interface Props {
  modelValue: number
  totalPages: number
  disabled?: boolean
}
const formattedPage = computed(() => {
  return props.modelValue.toString().padStart(2, '0')
})

const formattedTotalPages = computed(() => {
  return props.totalPages.toString().padStart(2, '0')
})

function updatePage(newPage: number) {
  if (newPage >= 1 && newPage <= props.totalPages)
    emit('update:modelValue', newPage)
}
</script>

<template>
  <div class="center flex flex-shrink-0 rounded px-[4px] py-[2px] space-x-4">
    <!-- Prev -->
    <button
      class="page-button h-[36px] w-[24px] flex items-center justify-center rounded-l-md rounded-r-sm bg-[#0F212E]"
      :class="[modelValue === 1 && 'disabled']" :disabled="modelValue <= 1 || disabled"
      @click="updatePage(modelValue - 1)">
      <IconUniArrowLeft name="uni-arrow-left" class="icon-theme" :class="[modelValue === 1 && 'disabled']" />
    </button>

    <!-- Current Page -->
    <div class="page-button flex flex-shrink-0 items-center justify-evenly rounded p-[4px]">
      <div class="center current-page h-[28px] flex flex-none rounded px-[10px] text-center text-14"
        :class="[(modelValue === 1 || modelValue === totalPages) && 'disabled']">
        {{ formattedPage }}
      </div>
      <div class="center mx-[1px] h-[28px] flex px-[4px] text-14">
        {{ t('de') }}
      </div>
      <div class="center text-theme-main h-[28px] flex px-[10px] text-14">
        {{ formattedTotalPages }}
      </div>
    </div>

    <!-- Next -->
    <button class="page-button h-[36px] w-[24px] flex items-center justify-center rounded-l-sm rounded-r-md"
      :disabled="modelValue >= totalPages || disabled" :class="[modelValue === totalPages && 'disabled']"
      @click="updatePage(modelValue + 1)">
      <IconUniArrowRight name="uni-arrow-right" class="icon-theme" :class="[modelValue === totalPages && 'disabled']" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.page-button {
  background: #0F212E;
  color: #fff;

  &.disabled {
    background: #253946;
    color: var(--th-secondary-grey-100);
  }

  @include webTheme('white') {
    color: #484848;
    background: #E8E8E8;

    &.disabled {
      color: #555555;
      background-color: #c1c1c1;
    }
  }

  @include webTheme('green') {
    color: #3CB389;
    background: #055434;

    &.disabled {
      color: #5ECEA6;
      background-color: #055434;
    }
  }
}

.text-theme-main {
  color: #fff;

  @include webTheme('white') {
    color: #111111;
  }

  @include webTheme('green') {
    color: #FFFFFF;
  }
}

.current-page {
  color: #677386;
  background-color: #253946;

  @include webTheme('white') {
    color: #555555;
    background-color: #c1c1c1;
  }

  @include webTheme('green') {
    color: #5ECEA6;
    background-color: #076237;
  }
}

.icon-theme {
  color: #FFFFFF;

  &.disabled {
    color: #677386;
  }

  @include webTheme('white') {
    color: #111111;

    &.disabled {
      color: #555555;
    }
  }

  @include webTheme('green') {
    color: #FFFFFF;

    &.disabled {
      color: #5ECEA6;
    }
  }
}
</style>
