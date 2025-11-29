<script lang="ts" setup>
import type { ChatUserInfo } from '@tg/types/types'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'

interface Props {
  userInfo: ChatUserInfo
}
defineOptions({
  name: 'AppChatUserTags',
})
const props = defineProps<Props>()

const levelRoleTxt: Record<number | string, string> = {
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
// const { openStatisticsDialog } = useStatisticsDialog()

function openStatisticsDialog(e: string) { }
</script>

<template>
  <div class="tg-user-tags">
    <!-- -->
    <span v-if="userInfo.level">
      <VTooltip placement="top">
        <div class="user-level-tag" :class="[`user-badge-${userInfo.level}`]">
          <span class="hoverable ">
            <component :is="`IconChatStar${userInfo.level}`" class="!w-[21px] !h-[20px]" />
          </span>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ levelRoleTxt[userInfo.level ?? 0] }}
          </div>
        </template>
      </VTooltip>
    </span>
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
      <div class="text-[#1275E1]">
        ME
      </div>
    </template>
    <!-- <BaseButton type="none" class="user-name-button" size="none" @click="openStatisticsDialog(userInfo.name)"> -->
    <span class="user-name" @click="openStatisticsDialog(userInfo.name)">{{ userInfo.name }}</span>
    <!-- </BaseButton> -->
  </div>
</template>

<style lang="scss" scoped>
  .tg-user-tags {
  --tg-font-size-default: 14px;
  --tg-font-weight-semibold: 600;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  vertical-align: text-top;
  font-size: 14px;
  font-weight: 600;
  /* line-height: 1.5; */

  > *:not(:first-child) {
    margin-left: 8px;
  }

  .user-level-tag {
    display: flex;
  }

  .user-role-tag {
    color: #3cb389;
    text-transform: capitalize;
  }

  .user-name-button {
    font-size: 14px;
    line-height: normal;
    /* height: 14px; */
  }

  .user-name {
    /* line-height: 1.5; */
    color: var(--tg, #6d7693);

    font-size: 14px;
    /* height: 14px; */
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-left: 5px;
  }
}
</style>
