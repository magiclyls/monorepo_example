<script lang="ts" setup>
import { AfunBaseLabel } from '@tg/bccomponents'
import { IconIconUniBankDelete, IconUniEdit } from '@tg/icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSelect from '~/components/AppSelect.vue'

interface Props {
  title: string
  modelValue: string
  msg?: string
  list: any
  num: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change', 'edit', 'delete', 'bind'])

const { t } = useI18n()

const toEdit = (item: any) => emit('edit', item)
const toDeleteBankcard = (item: any) => emit('delete', item)
const bind = () => emit('bind')

const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <AfunBaseLabel :label="title" required style="--afun-base-label-color:#B1BAD3">
    <AppSelect
      ref="bankCardSelectRef"
      v-model="computedValue"
      :msg="msg"
      :place-holder="title"
      :options="list"
      :options1noselect="false"
      full
      item-align="left"
      style="--app-select-label-border-color-active: #557086;"
      @change="(v) => emit('change', v)"
    >
      <!-- 公共的 slot 模板 -->
      <template #option="{ item, hide }">
        <div class="mb-[16px] px-[10px] flex items-center justify-between">
          <div class="flex items-center">
            <span
              class="l" :class="[
                item.disabled ? 'max-w-[88%]' : '',
                item.value === modelValue ? 'text-[#f23038]' : '',
              ]"
            >{{ item.label }}</span>
            <span v-if="item.disabled" class="ml-[10px] text-[12px] font-[600] text-[#FF4D4F]">
              {{ t('停用') }}
            </span>
          </div>
          <div class="flex items-center gap-[18px] text-[14px]">
            <span @click.stop="toEdit(item);hide()">
              <IconUniEdit
                :class="item.disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-pointer'"
                class="text-[#0d2245]"
              />
            </span>
            <span @click.stop="toDeleteBankcard(item);hide()">
              <IconIconUniBankDelete
                :class="item.disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-pointer'"
                class="text-[#ff4d4f]"
              />
            </span>
          </div>
        </div>
      </template>
      <template #extra>
        <div v-if="num < 3" class="center">
          <span
            class="text-[#15C16B] cursor-pointer text-[12px] font-[600] leading-[20px] active:scale-[0.96]"
            @click="bind"
          >
            {{ t('添加收款账号') }}
          </span>
        </div>
      </template>
    </AppSelect>
  </AfunBaseLabel>
</template>
