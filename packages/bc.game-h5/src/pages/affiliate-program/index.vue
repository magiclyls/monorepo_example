<script setup lang="ts">
import { BaseCurrencyIcon, BaseImage, BaseTable } from '@tg/bccomponents'
import { useLocalRouter } from '@tg/shared-router'
import { ref } from 'vue'

const router = useLocalRouter()

const directColumns = ref([
  {
    title: '级别',
    dataIndex: 'name',
    slot: 'name',
    align: 'center',
  },
  {
    title: '有效投注',
    dataIndex: 'name2',
    slot: 'name2',
    align: 'center',
  },
  {
    title: '返佣比例',
    dataIndex: 'name3',
    slot: 'name3',
    align: 'center',
  },
])
const teamColumns = ref([
  {
    title: '级别',
    dataIndex: 'name',
    slot: 'name',
    align: 'center',
  },
  {
    title: '有效投注',
    dataIndex: 'name2',
    slot: 'name2',
    align: 'center',
  },
  {
    title: '返佣比例',
    dataIndex: 'name3',
    slot: 'name3',
    align: 'center',
  },
])

const directTableData = ref([
  {
    name: '1',
    name2: '10.00+',
    name3: '1.00%',
  },
])
const teamTableData = ref([
  {
    name: '1',
    name2: '10.00+',
    name3: '1.00%',
  },
])
const directLoading = ref(false)
const teamLoading = ref(false)

function copyLink() {
  // 复制链接实现
}

const activeTab = ref('invite') // 'invite' 或 'commission'

function switchTab(tab: string) {
  activeTab.value = tab
}

function navigateTo(path: string) {
  router.push(`/affiliate-program/${path}`)
}
</script>

<template>
  <div class="affiliate-container">
    <!-- 用户信息 -->
    <div class="user-info-card">
      <div class="user-id">
        <span>账号：</span>
        <span class="id-value">Akkkkky</span>
      </div>
      <div class="flex justify-center items-center mb-2 ">
        <BaseImage width="32px" url="/img/h5/affiliate-program/commission-icon.png" />
      </div>
      <div class="commission">
        <div class="available-text">
          可领佣金：
        </div>
        <div class="amount">
          1000.12
        </div>
        <BaseCurrencyIcon style="width:14px;height:14px" cur="USDT" />
      </div>
      <button class="withdraw-btn">
        领取佣金
      </button>
    </div>

    <!-- 功能导航 -->
    <div class="function-nav">
      <div class="nav-item" @click="navigateTo('my-data')">
        <div class="nav-icon icon-partners" />
        <div class="nav-text">
          我的数据
        </div>
      </div>
      <div class="nav-item" @click="navigateTo('finance-data')">
        <div class="nav-icon icon-finance" />
        <div class="nav-text">
          财务数据
        </div>
      </div>
      <div class="nav-item" @click="navigateTo('commission-record')">
        <div class="nav-icon icon-withdraw" />
        <div class="nav-text">
          佣金记录
        </div>
      </div>
      <div class="nav-item" @click="navigateTo('commission-detail')">
        <div class="nav-icon icon-commission" />
        <div class="nav-text">
          佣金详情
        </div>
      </div>
      <div class="nav-item" @click="navigateTo('faq')">
        <div class="nav-icon icon-questions" />
        <div class="nav-text">
          常见问题
        </div>
      </div>
    </div>

    <!-- 邀请链接导航栏 -->
    <div class="invite-link-tabs">
      <div
        class="tab"
        :class="{ active: activeTab === 'invite' }"
        @click="switchTab('invite')"
      >
        <div class="tab-icon">
          <i class="icon-link" />
        </div>
        <div class="tab-text">
          邀请链接
        </div>
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'commission' }"
        @click="switchTab('commission')"
      >
        <div class="tab-icon">
          <i class="icon-ratio" />
        </div>
        <div class="tab-text">
          返佣比例
        </div>
      </div>
    </div>

    <!-- 邀请链接内容 -->
    <template v-if="activeTab === 'invite'">
      <!-- 邀请朋友 -->
      <div class="invite-section">
        <div class="invite-header">
          <div class="text">
            邀请朋友
          </div>
        </div>
        <div class="copy-section">
          <div class="invite-desc">
            每次您推荐的玩家下注，无论赢或输，您都会收到不同的佣金百分比。
            <br>
            系统每天计算一次佣金，复制链接，发送即可开始您得躺赚之旅！
          </div>
          <div class="link-container">
            <div class="link-text">
              推荐链接
            </div>
            <div class="link-box">
              <span class="link-url">https://bcgame.im/i-344r79je-n/</span>
              <button class="copy-btn" @click="copyLink">
                复制
              </button>
            </div>
          </div>
        </div>

        <!-- 社交分享 -->
        <div class="social-share">
          <div class="share-title">
            通过社交网络分享
          </div>
          <div class="social-icons">
            <div class="social-item">
              <div class="icon facebook">
                <i class="fab fa-facebook-f" />
              </div>
              <div class="icon-text">
                FACBOOK
              </div>
            </div>
            <div class="social-item">
              <div class="icon telegram">
                <i class="fab fa-telegram-plane" />
              </div>
              <div class="icon-text">
                Telegram
              </div>
            </div>
            <div class="social-item">
              <div class="icon instagram">
                <i class="fab fa-instagram" />
              </div>
              <div class="icon-text">
                Instagram
              </div>
            </div>
            <div class="social-item">
              <div class="icon youtube">
                <i class="fab fa-youtube" />
              </div>
              <div class="icon-text">
                YouTube
              </div>
            </div>
            <div class="social-item">
              <div class="icon whatsapp">
                <i class="fab fa-whatsapp" />
              </div>
              <div class="icon-text">
                WhatsApp
              </div>
            </div>
            <div class="social-item">
              <div class="icon x">
                <i class="fab fa-x-twitter" />
              </div>
              <div class="icon-text">
                X
              </div>
            </div>
            <div class="social-item">
              <div class="icon line">
                <i class="fab fa-line" />
              </div>
              <div class="icon-text">
                LINE
              </div>
            </div>
            <div class="social-item">
              <div class="icon tiktok">
                <i class="fab fa-tiktok" />
              </div>
              <div class="icon-text">
                TikTok
              </div>
            </div>
            <div class="social-item">
              <div class="icon gmail">
                <i class="far fa-envelope" />
              </div>
              <div class="icon-text">
                Gmail
              </div>
            </div>
          </div>
        </div>
        <div class="support-text">
          推荐系统与条件
        </div>
      </div>

      <!-- 用户层级关系图 -->
      <div class="hierarchy-chart">
        <BaseImage class="w-full h-full" url="/img/h5/affiliate-program/my-data-img.png" />
      </div>

      <!-- 规则说明 -->
      <div class="rules-section">
        <div class="rule-title">
          规则说明
        </div>
        <div class="rule-content">
          您拥有邀请好友的流量，依一一阶层面图队，
          <br>
          (1) B1、B2、B3 阶层佣金：(自行+好友)(0.7) : 0.02-3200
          <br>
          (2) C1、C2 阶层佣金：(10万+45万)(0.08)-2520
          <br>
          (3) C3 阶层佣金、(5万) 0.02-12000
        </div>
      </div>
    </template>

    <!-- 返佣比例内容 -->
    <template v-else>
      <!-- 直属佣金 -->
      <div class="commission-table-section">
        <div class="section-title">
          <div class="title-text">
            直属佣金
          </div>
          <BaseImage url="/img/h5/affiliate-program/direct-commission-img.png" />
        </div>

        <div class="game-tabs">
          <div class="game-tab active">
            真人视讯、老虎机、捕鱼
          </div>
          <div class="game-tab">
            体育
          </div>
          <div class="game-tab">
            小游戏
          </div>
          <div class="game-tab">
            棋牌
          </div>
        </div>

        <BaseTable
          :columns="directColumns"
          :data-source="directTableData"
          :loading="directLoading"
        >
          <template #name="{ record }">
            <div class="level-cell">
              <BaseImage width="14px" height="16px" url="/img/h5/affiliate-program/medal.png" />
              <span>{{ record.name }}</span>
            </div>
          </template>
          <template #name2="{ record }">
            <div class="price-cell">
              <span>{{ record.name2 }}</span>
              <BaseCurrencyIcon style="transform: translateY(-1px);" cur="USDT" />
            </div>
          </template>
        </BaseTable>
      </div>

      <!-- 团队佣金 -->
      <div class="commission-table-section">
        <div class="section-title">
          <div class="title-text">
            团队佣金
          </div>
          <BaseImage style="width: 64px;" url="/img/h5/affiliate-program/team-commission-img.png" />
        </div>

        <div class="game-tabs">
          <div class="game-tab active">
            真人视讯、老虎机、捕鱼
          </div>
          <div class="game-tab">
            体育
          </div>
          <div class="game-tab">
            小游戏
          </div>
          <div class="game-tab">
            棋牌
          </div>
        </div>

        <BaseTable
          :columns="teamColumns"
          :data-source="teamTableData"
          :loading="teamLoading"
        >
          <template #name="{ record }">
            <div class="level-cell">
              <BaseImage width="14px" height="16px" url="/img/h5/affiliate-program/medal.png" />
              <span>{{ record.name }}</span>
            </div>
          </template>
          <template #name2="{ record }">
            <div class="price-cell">
              <span>{{ record.name2 }}</span>
              <BaseCurrencyIcon style="transform: translateY(-1px);" cur="USDT" />
            </div>
          </template>
        </BaseTable>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.affiliate-container {
  background-color: #232626;
  color: white;
  min-height: 100vh;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 14px;
  overflow-y: scroll;
}

.user-info-card {
  background-color: #323738;
  border-radius: 8px;
  padding: 8px;
  position: relative;

  .user-id {
    font-size: 10px;
    margin-bottom: 20px;
    padding: 5px 10px;
    background-color: #464f50;
    border-radius: 4px;
    display: inline-block;

    .id-value {
      color: #4cd964;
    }
  }

  .commission {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;

    .available-text {
      font-size: 12px;
    }

    .amount {
      font-size: 14px;
      font-weight: 700;
      color: #4cd964;
      margin: 0 5px;
    }

    .icon-currency {
      color: #4cd964;
    }
  }

  .withdraw-btn {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    color: #171a1a;
    border: none;
    border-radius: 6.98px;
    padding: 9.5px 12px;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
  }
}

.function-nav {
  background-color: #323738;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: center;
  gap: 4px;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;

    .nav-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-text {
      font-size: 12px;
      color: #aaa;
    }
  }
}

.invite-link-tabs {
  display: flex;
  padding: 6px 8px;
  background-color: #323738;
  border-radius: 4px;

  .tab {
    flex: 1;
    text-align: center;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &.active {
      background-color: #3a4142;
    }

    .tab-icon {
      margin-right: 5px;

      i {
        font-size: 16px;
        color: #4cd964;
      }
    }

    .tab-text {
      font-size: 14px;
    }
  }
}

.invite-section {
  background-color: #323738;
  border-radius: 8px;
  padding: 16px;

  .invite-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .link-icon {
      width: 24px;
      height: 24px;
      background-color: #4cd964;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    .text {
      font-size: 16px;
    }
  }

  .divider {
    height: 1px;
    background-color: #444;
    margin: 10px 0;
  }

  .invite-desc {
    font-size: 12px;
    color: #b3bec1;
    line-height: 1.4;
    margin: 15px 0;
  }

  .link-container {
    margin-top: 20px;

    .link-text {
      font-size: 12px;
      margin-bottom: 5px;
      color: #b3bec1;
    }

    .link-box {
      display: flex;
      background-color: #3a4142;
      border-radius: 4px;
      padding: 4px;

      .link-url {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #aaa;
      }

      .copy-btn {
        background-color: transparent;
        border: 1px solid #4a5354;
        color: white;
        border-radius: 4px;
        padding: 0 10px;
      }
    }
  }

  .social-share {
    margin-top: 20px;

    .share-title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 15px;
    }

    .social-icons {
      display: flex;
      flex-wrap: wrap;
      column-gap: 10px;
      row-gap: 15px;

      .social-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60px;

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;

          i {
            font-size: 18px;
          }
        }

        .icon-text {
          font-size: 10px;
          color: #b3bec1;
          text-align: center;
        }
      }

      .facebook {
        background-color: #1877f2;
      }
      .telegram {
        background-color: #0088cc;
      }
      .instagram {
        background-color: #c13584;
      }
      .youtube {
        background-color: #ff0000;
      }
      .whatsapp {
        background-color: #25d366;
      }
      .x {
        background-color: #000;
      }
      .line {
        background-color: #00b900;
      }
      .tiktok {
        background-color: #000;
      }
      .gmail {
        background-color: #ea4335;
      }
    }
  }

  .support-text {
    text-align: center;
    color: #4cd964;
    margin-top: 20px;
    font-size: 14px;
  }
}

.hierarchy-chart {
  background-color: #323738;
  border-radius: 8px;

  .level-1,
  .level-2,
  .level-3 {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .divider-line {
    height: 40px;
    border-left: 1px dashed #444;
    margin: 0 auto;
    width: 1px;
  }

  .user-node {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.main {
      background-color: #ffc107;
    }

    &.sub {
      background-color: #4cd964;
    }

    &.sub-sub {
      background-color: #0088cc;
    }
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }
}

.rules-section {
  background-color: #323738;
  border-radius: 8px;
  padding: 15px;

  .rule-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .rule-content {
    font-size: 13px;
    color: #aaa;
    line-height: 1.6;
  }
}

.filter-tabs {
  background-color: #323738;
  border-radius: 8px;
  display: flex;

  .filter-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    color: #b3bec1;
    font-size: 14px;

    &.active {
      background-color: #3a4142;
      color: #fff;
    }

    i {
      margin-right: 5px;
    }
  }
}

.commission-table-section {
  background-color: #232626;
  border-radius: 8px;
  overflow: hidden;

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .title-text {
      font-size: 16px;
      font-weight: 600;
    }

    .title-icon {
      width: 40px;
      height: 40px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .game-tabs {
    display: flex;
    overflow-x: auto;
    padding: 8px;
    background-color: #323738;
    margin-bottom: 8px;
    border-radius: 4px;
    gap: 10px;

    .game-tab {
      padding: 8px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      color: #b3bec1;
      border-radius: 4px;

      &.active {
        background-color: #3a4142;
        color: #24ee89;
      }
    }
  }

  .level-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    gap: 3px;

    &.level-1 {
      background-color: #4cd964;
    }

    &.level-2 {
      background-color: #af52de;
    }

    &.level-3 {
      background-color: #5856d6;
    }

    &.level-4 {
      background-color: #5ac8fa;
    }

    &.level-5 {
      background-color: #ff2d55;
    }

    &.level-6 {
      background-color: #8e8e93;
    }

    &.level-7 {
      background-color: #ff9500;
    }
  }
  .price-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    gap: 4px;
    color: #24ee89;
  }
}
</style>
