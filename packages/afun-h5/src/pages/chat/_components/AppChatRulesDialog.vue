<script lang="ts" setup>
import { IconUniJumpPage } from '@tg/icons'
import { getEnv } from '@tg/utils'

defineOptions({
  name: 'AppChatRulesDialog',
})
const { VITE_OFFICIAL_NAME } = getEnv()
</script>

<template>
  <section class="modal-content-normal">
    <ol class="rules-content">
      <li v-for="r in 12" :key="r">
        <span>{{ $t(`chat_rule_${r}`, { site: VITE_OFFICIAL_NAME }) }}</span>
      </li>
    </ol>
    <div class="text-center">
      {{ $t('chat_rule_full_title') }}
      <a>
        <span class="bold-text">{{ $t('chat_forum') }}</span>
        <IconUniJumpPage />
      </a>
      {{ $t('chat_rule_find') }}
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .bold-text {
  font-weight: 600;
}

.modal-content-normal {
  padding-right: 16px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  touch-action: auto;
  line-height: 1.5;
  color: #b1bad3;
  font-size: 14px;
  font-weight: 400;

  ol {
    margin-bottom: 16px;
    list-style-type: decimal;
    list-style-position: inside;

    > * + * {
      margin-top: 8px;
    }
  }

  a {
    color: #fff;
    display: inline-flex;
    align-items: center;

    .app-svg-icon {
      font-size: 12px;
    }

    .app-svg-icon {
      margin: 0 8px;
    }
  }

  .center {
    display: inline-flex;
    flex-wrap: wrap;
  }

  .rules-content {
    @include webTheme('green') {
      color: #42bc91;
    }
  }

  .text-center {
    @include webTheme('green') {
      color: #42bc91;
    }
  }
}
</style>
