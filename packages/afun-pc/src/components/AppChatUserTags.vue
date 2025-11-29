<script lang="ts" setup>
import type { ChatUserInfo } from '@tg/types/types'

interface Props {
  userInfo: ChatUserInfo
}
defineOptions({
  name: 'AppChatUserTags',
})
defineProps<Props>()

const levelRoleTxt = {
  0: '',
  1: 'Platinum I',
  2: 'Platinum II',
  3: 'Platinum III',
  4: 'Platinum IV',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  diamond: 'Diamond',
  moderator: 'Moderator',
}

const { userInfo: originUser } = storeToRefs(useAppStore())
const { openStatisticsDialog } = useStatisticsDialog()
</script>

<template>
  <div class="tg-user-tags">
    <template v-if="userInfo.level">
      <VTooltip placement="top">
        <div class="user-level-tag" :class="[`user-badge-${userInfo.level}`]">
          <span class="hoverable">
            <component :is="`IconChatStar${userInfo.level}`" class="!w-[21px] !h-[20px]" />
          </span>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ levelRoleTxt[userInfo.level] }}
          </div>
        </template>
      </VTooltip>
    </template>
    <template v-if="userInfo.role">
      <VTooltip placement="top">
        <div class="user-role-tag" :class="[`user-role-${userInfo.role}`]">
          <span class="hoverable">{{ userInfo.role[0] }}</span>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ levelRoleTxt[userInfo.role] }}
          </div>
        </template>
      </VTooltip>
    </template>
    <template v-if="originUser && userInfo.name === originUser.username">
      <div>
        ME
      </div>
    </template>
    <BaseButton type="text" size="none" @click="openStatisticsDialog(userInfo.name)">
      <span class="user-name">{{ userInfo.name }}</span>
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.tg-user-tags {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  vertical-align: text-top;
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  line-height: 1.5;
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-6);
  }
  .user-level-tag {
    display: flex;
  }
  .user-role-tag {
    color: var(--tg-text-blue);
    text-transform: capitalize;
  }
  .user-name {
    line-height: 1.5;
    @include webTheme('green'){
      color: #3CB389;
    }
  }
}
</style>
