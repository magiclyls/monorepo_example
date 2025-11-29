<script setup lang="ts">
import { AfunBaseDialog, BaseProxyClick } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'

const { bool: dialogVisible, setBool: setDialogVisible } = useBoolean(false)
const { bool: isVerified, setBool: setIsVerified } = useBoolean(false)
</script>

<template>
  <BaseProxyClick :is-verified="isVerified" @click="setDialogVisible(true)">
    <slot />
  </BaseProxyClick>

  <AfunBaseDialog v-model="dialogVisible">
    验证
  </AfunBaseDialog>
</template>
