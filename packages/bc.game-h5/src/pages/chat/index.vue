<script setup lang="ts">
import { ref } from 'vue'

const showRulesDialog = ref(true)
const showChatUnlockDialog = ref(false)

const chatMessages = ref([
  {
    username: 'Phdozebafucc',
    time: '17:51',
    content: 'hello sir Kindly check with live support.',
    isAdmin: true,
    isSelf: false,
  },
  {
    username: 'Luckhalashao',
    time: '17:51',
    content: 'hello sir Kindly check with live support.',
    isAdmin: false,
    isSelf: false,
  },
  {
    username: 'JIBO-fei',
    time: '17:51',
    content: 'hello',
    emoji: '😉',
    isAdmin: false,
    isSelf: false,
  },
  {
    username: '小明',
    time: '17:53',
    content: 'Why？ dukuc',
    isAdmin: false,
    isSelf: true,
  },
  {
    username: 'Luckhalashao',
    time: '17:51',
    content: 'Check with live support.',
    isAdmin: false,
    isSelf: false,
  },
  {
    username: 'Phdozebafucc',
    time: '17:51',
    content: 'hello sir Kindly check with live support check with live support check with live support.',
    isAdmin: false,
    isSelf: false,
  },
  {
    username: 'BV weiee',
    time: '17:51',
    content: 'hello sir Kindly check with live',
    emoji: '🎵',
    isAdmin: false,
    isSelf: false,
  },
  {
    username: 'Phdozebafucc',
    time: '17:51',
    content: 'hello sir Kindly check with live support.',
    isAdmin: true,
    isSelf: false,
  },
])
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="header-left">
        <span class="global-label">全球</span>
        <i class="arrow-down" />
        <div class="online-status">
          <i class="online-dot" />
          <span class="online-text">在线：9,810</span>
        </div>
      </div>
      <div class="header-right">
        <div class="icon-info-container" @click="showRulesDialog = true">
          <i class="icon-info" />
        </div>
        <div class="icon-info-container">
          <i class="icon-close" />
        </div>
      </div>
    </div>

    <div class="chat-content">
      <div class="message-list">
        <div
          v-for="(message, index) in chatMessages" :key="index"
          class="message-item" :class="[
            message.isSelf ? 'message-self' : '',
            message.isAdmin ? 'message-admin' : '',
          ]"
        >
          <div class="message-header">
            <span class="username" :class="{ 'admin-name': message.isAdmin }">
              <span v-if="message.isAdmin">@AdiMeer</span>
              <span v-else>{{ message.username }}</span>
            </span>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <div class="message-body">
            {{ message.content }}
            <span v-if="message.emoji" class="message-emoji">{{ message.emoji }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <div class="input-container">
        <div class="input-with-emoji">
          <input type="text" class="message-input" placeholder="输入您的消息">
          <i class="emoji-icon" />
        </div>
        <button class="send-button" @click="showChatUnlockDialog = true">
          <i class="send-icon" />
        </button>
      </div>
    </div>
    <div class="footer-spacer" />

    <!-- 聊天室规则弹框 -->
    <div v-if="showRulesDialog" class="dialog-overlay" @click="showRulesDialog = false">
      <div class="dialog rules-dialog" @click.stop>
        <div class="dialog-header">
          <h3>聊天室规则</h3>
          <button class="close-btn" @click="showRulesDialog = false">
            <i class="icon-close" />
          </button>
        </div>
        <div class="dialog-content" style="padding-bottom: 40px;">
          <ol class="rules-list">
            <li>1.聊天室规则，请勿发送垃圾信息聊天室规则，请勿发送垃圾信息聊天室规则，请勿发送垃圾信息聊天室规则，请勿发送垃圾信息</li>
            <li>2.聊天室规则，请勿发送垃圾信息</li>
            <li>3.聊天室规则，请勿发送垃圾信息请勿发送垃圾信息</li>
            <li>4.聊天室规则，请勿发送垃圾信息</li>
            <li>5.聊天室规则，请勿发送垃圾信息请勿发送</li>
            <li>6.聊天室规则，请勿发送垃圾信息</li>
            <li>7.聊天室规则，请勿发送垃圾信息请勿发送垃圾信息</li>
            <li>8.聊天室规则，请勿发送垃圾信息请勿发送垃圾信息请勿发送垃圾信息</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 解锁聊天功能弹框 -->
    <div v-if="showChatUnlockDialog" class="dialog-overlay" @click="showChatUnlockDialog = false">
      <div class="dialog unlock-dialog" @click.stop>
        <div class="dialog-header">
          <h3>解锁聊天功能</h3>
          <button class="close-btn" @click="showChatUnlockDialog = false">
            <i class="icon-close" />
          </button>
        </div>
        <div class="dialog-content unlock-content">
          <div class="telegram-icon" />
          <p class="unlock-text">
            在近7日內，完成存款至少10 USD或下注50 USD方可聊天。
          </p>
          <button class="deposit-btn">
            存款
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #292d2e;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  padding-bottom: 56px; /* 为系统底部导航留出空间 */
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 4px 16px;
  font-size: 14px;
  color: white;
  z-index: 100;
  height: 24px;
}

.icon-info-container {
  width: 28px;
  height: 28px;
  background-color: #3a4142;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time {
  font-weight: 500;
}

.status-icons {
  display: flex;
  gap: 4px;
  align-items: center;
}

.signal-icon,
.wifi-icon,
.battery-icon {
  width: 17px;
  height: 17px;
  background-size: contain;
  background-repeat: no-repeat;
}

.signal-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18l-3 3m10-10l-3 3m4-4l-3 3"></path></svg>');
}

.wifi-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>');
}

.battery-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line></svg>');
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #323738;
  height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
}

.global-label {
  font-size: 14px;
  margin-right: 4px;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 16px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ffffff;
}

.online-status {
  display: flex;
  align-items: center;
}

.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #24ee89;
  border-radius: 50%;
  margin-right: 6px;
}

.online-text {
  font-size: 12px;
  color: #24ee89;
}

.header-right {
  display: flex;
  gap: 4px;
}

.icon-info,
.icon-close {
  width: 12px;
  height: 12px;
  display: inline-block;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #3a4142;
  border-radius: 50%;
  padding: 8px;
}

.icon-info {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>');
}

.icon-close {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>');
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px;
  background: #222627;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  margin-bottom: 16px;
  max-width: 85%;
}

.message-self {
  align-self: flex-end;
}

.message-self .message-header {
  flex-direction: row-reverse;
  background: none;
  padding: 0;
  height: auto;
  justify-content: flex-start;
}

.message-self .message-body {
  background-color: #24ee89;
  color: #1e2121;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.username {
  font-size: 10px;
  color: #878d99;
}

.admin-name {
  color: #40ffa0;
}

.message-time {
  font-size: 10px;
  color: #878d99;
}

.message-body {
  display: inline-block;
  background-color: #3a4142;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  word-break: break-word;
  line-height: 16px;
}

.message-emoji {
  font-size: 16px;
  margin-left: 4px;
}

.chat-input-area {
  position: fixed;
  bottom: 56px; /* 为系统底部导航留出空间 */
  left: 0;
  right: 0;
  background-color: #292d2e;
  z-index: 10;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #292d2e;
}

.input-with-emoji {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #3a4142;
  border-radius: 8px;
  padding: 0 12px;
  margin-right: 10px;
  height: 36px;
}

.message-input {
  flex: 1;
  background-color: transparent;
  border: none;
  color: #ffffff;
  padding: 0 8px;
  font-size: 14px;
  height: 100%;
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.emoji-icon {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>');
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 36px;
  height: 36px;
  background: #3a4142;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.send-icon {
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('/img/h5/affiliate-program/chat-send.png');
}

.footer-spacer {
  height: 56px;
}

/* 弹框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.dialog {
  background-color: #222627;
  padding-top: 5px;
  border-radius: 12px 12px 0 0;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.dialog-header {
  position: relative;
  padding: 14px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 14px;
  color: #fff;
  text-align: center;
  flex: 1;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4a5354;
  border-radius: 6px;
}

.close-btn .icon-close {
  width: 14px;
  height: 14px;
  padding: 0;
  transform: translateX(1px);
  background-color: transparent;
}

.dialog-content {
  padding: 12px;
  overflow-y: auto;
}

/* 规则弹框样式 */
.rules-list {
  padding-left: 20px;
  margin: 0;
}

.rules-list li {
  margin-bottom: 4px;
  font-size: 10px;
  line-height: 16px;
  font-weight: 400;
  color: #ffffff;
}

/* 解锁聊天功能弹框样式 */
.unlock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
}

.telegram-icon {
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  background: url('/img/h5/affiliate-program/chat-send.png') no-repeat center center;
  background-size: contain;
}

.unlock-text {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.deposit-btn {
  width: 170px;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  box-shadow:
    0px -2px 0px 0px #1dca6a inset,
    0px 0px 12px 0px #23ee884d;
  color: #000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
}

.deposit-btn:hover {
  opacity: 0.9;
}
</style>
