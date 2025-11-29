<script setup lang="ts">
import { BaseCurrencyIcon, BaseImage, BaseTable } from '@tg/bccomponents'
import { ref } from 'vue'

const columns = ref([
  {
    title: '用户名',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: 'time',
    align: 'center',
  },
  {
    title: '奖项',
    dataIndex: 'prize',
    align: 'right',
    slot: 'prize',
  },
])

const dataSource = ref([
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
  {
    username: 'sd****ws',
    time: '刚刚收到',
    prize: '+10000.00',
  },
])

const activeTab = ref('report')
const showPopup = ref(false)
const showRewardPopup = ref(false)

function closePopup() {
  showPopup.value = false
}

function closeRewardPopup() {
  showRewardPopup.value = false
}
</script>

<template>
  <div class="turntable-container">
    <div class="top-section">
      <div class="prize-block">
        <div class="prize-title">
          轮盘抽奖总额
        </div>
        <div class="prize-amount">
          AED 75,325,444.10
        </div>
      </div>
      <div class="user-block">
        <div class="avatar">
          <img src="" alt="avatar">
        </div>
        <div class="user-info">
          <div class="user-name">
            Coy...
          </div>
          <div class="user-currency">
            账: <span class="user-key">AEI</span>
          </div>
        </div>
        <div class="arrow-icon">
          &gt;
        </div>
      </div>
    </div>

    <div class="bonus-box">
      <div class="bonus-top">
        <div class="bonus-info">
          <div class="bonus-amount">
            <BaseImage width="27px" height="20px" class="mx-1" url="/img/h5/affiliate-program/price-icon.png" />
            <span class="amount-value mx-1">97.00</span>
            <BaseImage width="20px" url="/img/h5/affiliate-program/flag-icon.png" />
          </div>
          <div class="bonus-percentage">
            0.08%
          </div>
        </div>
        <div class="receive-bonus-btn">
          领取奖金
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-value" />
      </div>

      <div class="flex justify-center items-center bonus-desc-container">
        <div class="bonus-desc">
          您还需要 <span class="mx-1">3.00</span> <BaseImage class="mr-1" width="14px" url="/img/h5/affiliate-program/flag-icon.png" /> 才能体验到钱包
        </div>
      </div>
    </div>

    <div class="turntable-section">
      <img class="turntable-img" width="" src="/img/h5/affiliate-program/turntable-img.png" alt="转盘">
      <div class="turntable-info">
        <div class="turntable-tip">
          下级累计打赏 <span class="green-text">50</span> <BaseImage width="14px" class="mr-2" url="/img/h5/affiliate-program/flag-icon.png" /> ，奖励 <span class="green-text">1</span> 次抽奖
        </div>
        <div class="countdown">
          2天后过期 <span class="green-text">04:34:21</span>
        </div>
      </div>
    </div>

    <div class="invite-button">
      <span>邀请好友帮忙提款</span>
      <BaseImage width="11px" class="mx-2" url="/img/h5/affiliate-program/share-icon.png" />
    </div>

    <div class="tabs-container">
      <div
        class="tab"
        :class="{ active: activeTab === 'report' }"
        @click="activeTab = 'report'"
      >
        报告
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'rules' }"
        @click="activeTab = 'rules'"
      >
        规则
      </div>
    </div>

    <!-- 报告内容 -->
    <div v-if="activeTab === 'report'" class="table-container">
      <BaseTable
        :columns="columns"
        :data-source="dataSource"
        :show-empty="true"
      >
        <template #prize="{ record }">
          <div class="prize-cell">
            <span class="prize-value">{{ record.prize }}</span>
            <BaseCurrencyIcon style="width:14px;height:14px;margin-left:4px;" cur="USDT" />
          </div>
        </template>
      </BaseTable>
    </div>

    <!-- 规则内容 -->
    <div v-else-if="activeTab === 'rules'" class="rules-content">
      <div class="rule-item">
        1.当累计金额达到100USDT时，您可以开始提款。
      </div>
      <div class="rule-item">
        2.邀请好友注册Meibo.com，可以帮助您快速提款。
      </div>
      <div class="rule-item">
        3.每个用户每天将获得一次免费旋转。
      </div>
      <div class="rule-item">
        4.每个用户每次活动有效期为3天，可多次参加活动。
      </div>
      <div class="rule-item">
        5.如果您获得额外的现金奖金，您可以免费玩游戏并赢得更多资金。
      </div>
      <div class="rule-item">
        6.如果3天内不提款，钱款会丢失。
      </div>
    </div>

    <div class="enter-game-button">
      进入游戏
    </div>

    <!-- 获取更多次数弹框 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-container">
        <div class="popup-header">
          <div class="popup-title">
            获得更多次数
          </div>
          <div class="popup-close" @click="closePopup">
            ×
          </div>
        </div>
        <div class="popup-content">
          <div class="invite-text">
            邀请5个好友，实酬一次抽奖
          </div>
          <div class="progress-text">
            已邀请3人
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-value" style="width: 60%;" />
          </div>
          <div class="total-invite">
            已累计邀请50个好友，已获得10次抽奖次数
          </div>
        </div>
        <div class="share-button">
          分享朋友
        </div>
      </div>
    </div>

    <!-- 奖励弹框 -->
    <div v-if="showRewardPopup" class="popup-overlay">
      <div class="popup-container">
        <div class="popup-header">
          <div class="popup-title">
            免费获得钱币
          </div>
          <div class="popup-close" @click="closeRewardPopup">
            ×
          </div>
        </div>
        <div class="popup-content">
          <div class="reward-min-amount">
            <BaseImage width="20px" url="/img/h5/affiliate-program/flag-icon.png" class="mr-2" /> 最低100.00提现
          </div>

          <div class="congratulation-text">
            恭喜您好运，您中奖了
          </div>

          <div class="reward-amount">
            <BaseImage width="24px" height="24px" url="/img/h5/affiliate-program/price-icon.png" class="mr-2" />
            <span class="amount-value" style="font-size: 18px;">97.00</span>
            <BaseImage width="20px" url="/img/h5/affiliate-program/flag-icon.png" class="ml-2" />
          </div>

          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: 60%;" />
            </div>
            <div class="progress-percent">
              60.00%
            </div>
          </div>

          <div class="remain-amount">
            转入至钱包还需4.02 <BaseImage width="14px" url="/img/h5/affiliate-program/flag-icon.png" class="ml-2" />
          </div>

          <div style="padding: 0 14px;">
            <button class="claim-more-btn">
              索取更多现金
            </button>
          </div>

          <div class="free-spin-text">
            免费旋转并赢得真钱
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.turntable-container {
  background-color: #232626;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  padding-bottom: 30px;
  overflow-y: scroll;
}

.loading-text {
  text-align: center;
  color: #999;
  padding: 10px 0;
  font-size: 14px;
}

.top-section {
  display: flex;
  margin-top: 10px;
  gap: 6px;
  padding: 4px;
  background-color: #323738;
  border-radius: 10.47px;
}

.prize-block {
  flex: 1;
  background-color: #232626;
  border-radius: 8px;
  padding: 8px;
}

.prize-title {
  color: #b3bec1;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 700;
  text-align: center;
}

.prize-amount {
  color: #ff9820;
  font-size: 14px;
  font-weight: 860;
  text-align: center;
}

.user-block {
  min-width: 114px;
  background-color: #232626;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f;
  margin-right: 8px;
  overflow: hidden;
}

.user-info {
  margin-right: 12px;
}

.user-name {
  color: #fff;
  font-size: 12px;
}

.user-currency {
  color: #b3bec1;
  font-size: 12px;
}

.user-key {
  color: #24ee89;
}

.arrow-icon {
  color: #b3bec1;
  font-size: 18px;
}

.secret-area-box {
  margin-top: 10px;
}

.secret-area {
  background-color: #323738;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.secret-area-info .secret-area-title {
  color: #b3bec1;
  font-size: 12px;
  margin-bottom: 4px;
}

.secret-area-info .secret-area-amount {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.bonus-box {
  margin-top: 12px;
  background: linear-gradient(90deg, #305c48 0%, #353939 100%);
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.bonus-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bonus-info {
  display: flex;
  flex-direction: column;
}

.bonus-amount {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.currency-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url('/img/h5/affiliate-program/currency-icon.png');
  background-size: cover;
  margin-right: 4px;
}

.amount-value {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.flag-icon,
.thai-flag {
  width: 20px;
  height: 14px;
  background: linear-gradient(180deg, red 33%, white 33%, white 66%, red 66%);
  border-radius: 2px;
}

.bonus-percentage {
  color: #24ee89;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: bold;
  transform: translateY(10px);
}

.progress-bar {
  height: 6px;
  background-color: #1d3a23;
  border-radius: 3px;
  width: 100%;
  margin-bottom: 10px;
}

.progress-value {
  height: 100%;
  width: 100%;
  background: linear-gradient(0deg, #24ee89, #24ee89), linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 3px;
}
.green-text {
  color: #24ee89;
  margin: 0 4px;
}

.receive-bonus-btn {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px 0px 12px 0px #23ee884d,
    0px -2px 0px 0px #1dca6a inset;
  color: #171a1a;
  padding: 8px 32px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
}

.bonus-desc-container {
  position: relative;
}

.bonus-desc {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  padding: 0 8px;
  color: #b3bec1;
  font-size: 12px;
  background: #00000033;
  text-align: center;
}

.bonus-desc span {
  color: #fff;
  font-weight: bold;
}

.turntable-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.turntable-img {
  width: 100%;
  max-width: 293px;
}

.turntable-info {
  margin-top: 12px;
  text-align: center;
}

.turntable-tip {
  color: #b3bec1;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turntable-tip .flag-icon {
  margin: 0 4px;
}

.countdown {
  color: #b3bec1;
  font-size: 14px;
  margin-top: 4px;
}

.invite-button {
  margin-top: 20px;
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px 0px 12px 0px #23ee884d,
    0px -2px 0px 0px #1dca6a inset;
  color: #171a1a;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.invite-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  position: relative;
}

.invite-icon:after {
  content: '↗';
  position: absolute;
  top: -2px;
  right: -2px;
}

.tabs-container {
  display: flex;
  margin-top: 20px;
  border: none;
  border-radius: 7.11px;
  background-color: #323738;
}

.tab {
  flex: 1;
  text-align: center;
  height: 32px;
  line-height: 32px;
  color: #b3bec1;
  font-size: 12px;
  font-weight: 700;
  position: relative;
}

.tab.active {
  color: #fff;
  font-weight: bold;
  background-color: #3a4142;
  border-radius: 7.11px;
}

.tab.active:after {
  display: none;
}

.table-header {
  display: flex;
  background-color: #323738;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 12px 16px;
  margin-top: 10px;
}

.header-item {
  flex: 1;
  color: #b3bec1;
  font-size: 12px;
  font-weight: 600;
}

.text-right {
  text-align: right;
}

.table-container {
  background-color: #232626;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
}

.prize-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.prize-value {
  font-weight: bold;
}

.enter-game-button {
  margin-top: 20px;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px 0px 12px 0px #23ee884d,
    0px -2px 0px 0px #1dca6a inset;
  color: #171a1a;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.arrow-indicator {
  display: none;
}

.rules-content {
  background-color: #232626;
  border-radius: 8px;
  padding: 16px 0;
  margin-top: 8px;
}

.rule-item {
  color: #b3bec1;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 10px;
}

/* 弹框样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.popup-container {
  width: 100%;
  background-color: #232626;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slide-up 0.3s ease-out;
}

.popup-header {
  position: relative;
  padding: 16px;
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.popup-title {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.popup-close {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-25%);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #4a5354;
  border-radius: 6px;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.invite-text {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.progress-text {
  color: #fff;
  font-size: 12px;
  margin-bottom: 8px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #3a3e3f;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar-value {
  height: 100%;
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 4px;
}

.total-invite {
  color: #b3bec1;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
}

.share-button {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px 0px 12px 0px #23ee884d,
    0px -2px 0px 0px #1dca6a inset;
  color: #171a1a;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin: 0 16px 16px 16px;
  border-radius: 8px;
}

.reward-min-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
}

.congratulation-text {
  color: #b3bec1;
  font-size: 12px;
  text-align: center;
  margin-bottom: 16px;
}

.reward-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.progress-container {
  position: relative;
  margin: 0 14px 16px 14px;
}

.progress-bar-bg {
  height: 6px;
  background-color: #3a3e3f;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 3px;
}

.progress-percent {
  position: absolute;
  right: 0;
  top: -18px;
  color: #fff;
  font-size: 12px;
}

.remain-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b3bec1;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.claim-more-btn {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px 0px 12px 0px #23ee884d,
    0px -2px 0px 0px #1dca6a inset;
  color: #171a1a;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  border-radius: 8px;
  border: none;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.free-spin-text {
  color: #fff;
  font-size: 14px;
  text-align: center;
  padding: 16px 8px;
  background: #24ee891a;
}

.mr-2 {
  margin-right: 8px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
