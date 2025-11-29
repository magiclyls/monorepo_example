<script setup lang="ts">
import { BaseButton, BaseCollapseItem, BaseIcon, BaseImage } from '@tg/bccomponents'
import { ref } from 'vue'
import Footer from '~/layouts/footer.vue'

defineOptions({ name: 'AffiliateExhibition' })

/** Q&A list */
const questionList = ref([
  {
    title: '轉介系統如何運作？',
    answer: '當您與任何朋友、家人分享您的推薦連結或宣傳該連結並且玩家在我們的網站註冊時，該玩家將成為您的推薦人，他們將透過在BC.GAME 玩遊戲為您賺取佣金和額外獎勵。',
    active: false,
  },
  {
    title: '我的推薦可以賺多少錢？',
    answer: '您可以賺取他們下注額的 25% + THB 33,561.40 每位推薦人。',
    active: false,
  },
  {
    title: '什麼是 USD 獎勵，它是如何運作的？',
    answer: '每推薦一位新會員到 BC.GAME ，即可獲得 THB 33,561.40 美元獎勵。當您的推薦人從 VIP4 升級到 VIP 70，此美元獎勵會分 10 部分贈送。',
    active: false,
  },
])
const isActive4 = ref(false)
const isActive5 = ref(false)
const isActive6 = ref(false)
const isActive7 = ref(false)
const isActive8 = ref(false)
</script>

<template>
  <div>
    <div class="w-full">
      <!-- banner -->
      <div
        class="banner my-4 flex items-center h-64 justify-between rounded-[16px] bg-cover bg-no-repeat bg-[url(/img/pc/affiliate-exhibition/banner_bg.webp)]"
      >
        <div class="grid grid-cols-1 gap-2 justify-items-center ml-[70px]">
          <p class="text-nowrap text-3xl">
            邀請朋友賺錢
          </p>
          <p class="text-nowrap text-2xl  text-[#24EE89]">
            JP¥149,440 + 25% 委員會
          </p>
          <BaseButton class="my-2 p-6">
            註冊並賺取
          </BaseButton>
          <p class="cursor-pointer  text-[#24EE89]">
            推薦條款與條件
          </p>
        </div>
        <div class="w-[596px]">
          <BaseImage url="/img/pc/affiliate-exhibition/banner_right.png" />
        </div>
      </div>
      <!-- 下面部分 -->
      <div class="grid grid-cols-1 gap-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- 左 -->
          <div class="relative rounded-[12px] bg-[#323738] p-6 flex flex-col ">
            <p class="text-[24px] leading-[32px]">
              Get your <span class="text-[#24EE89]">THB 33,562.20</span>
            </p>
            <p class="text-[24px] leading-[32px]">
              referral rewards
            </p>
            <p class="my-[12.5px] text-[16px] text-[#B3BEC1]">
              您每邀請一位朋友，就可獲得 THB 33,562.20，邀請越多，獲得越多！
            </p>
            <BaseImage url="/img/pc/affiliate-exhibition/img1.png" />
            <BaseButton type="secondary" class="text-[14px] mt-[12px]">
              檢視詳細資訊
            </BaseButton>
          </div>
          <!-- 右 -->
          <div class="relative rounded-[12px] bg-[#323738] p-6 flex flex-col ">
            <p class="text-[24px] leading-[32px]">
              獲得 <span class="text-[#24EE89]">25%</span>佣金獎勵
            </p>
            <p class="my-[12.5px] text-[16px] text-[#B3BEC1]">
              每次您的朋友根據遊戲下注時，您都會收到佣金獎勵。
            </p>
            <BaseImage url="/img/pc/affiliate-exhibition/img2.png" />
            <BaseButton type="secondary" class="text-[14px] mt-[12px]">
              檢視詳細資訊
            </BaseButton>
          </div>
        </div>
        <!-- 即時獎勵 -->
        <div class="pt-[24px] px-[24px] pb-[17.5px] rounded-[12px] bg-[#323738]">
          <p><b class="live-dot" />即時獎勵</p>
          <div class="flex items-center justify-between mt-[12px] mb-[12.5px]">
            <span class="text-[14px]">至今已寄出的獎金總數</span>
            <span class="text-[20px] leading-[28px] text-[#24EE89]">THB 829,832.10K</span>
          </div>
          <div class="h-[53px] overflow-hidden flex flex-col">
            <div
              class="grid grid-rows-2 gap-4 text-[14px] live-container"
              style="grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));"
            >
              <div v-for="i in 100" :key="i" class=" flex items-center">
                <p>Jqnilegiluac</p>
                <div class="flex items-center flex-shrink-0">
                  <span class="mx-[4px] text-[#24EE89] text-nowrap">+IDR 240.00</span>
                  <div class="text-[16px] flex items-center">
                    <BaseIcon name="usdt" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 進一步了解我們的 -->
        <div class="flex flex-col items-center p-[24px] relative rounded-[12px] bg-[#323738] overflow-hidden">
          <div class="absolute top-0 left-0 w-[56.49%]">
            <BaseImage url="/img/pc/affiliate-exhibition/more_bg.png" />
          </div>

          <p class="text-[24px] leading-[32px]">
            進一步了解我們的 <span class="text-[#24EE89]">聯盟計劃</span>
          </p>
          <BaseImage url="/img/pc/affiliate-exhibition/mail_box.png" />
          <p class="text-[#B3BEC1] text-center">
            如果您有大量的觀眾和追隨者。我們有特殊條件讓您自訂推薦計劃！
          </p>
          <p class="text-[#B3BEC1] text-center">
            如果您能邀請到玩家，而且他們的下注金額達到十億美元以上，您就能獲得自己的客製化賭場！您可以使用自己的網域和設計風格建立賭場網站。
          </p>
          <p class="text-[#B3BEC1] text-center">
            如需詳細資訊，請聯絡我們
          </p>
          <div
            class="w-full h-[58px] mt-[8px] p-[9px] rounded-[12px] pl-[16.945px] flex items-center justify-between border-solid border-[1px] border-[#3A4142] bg-[#292D2E]"
          >
            <p>business@bc.game</p>
            <BaseButton type="secondary" class="w-[96px] text-[14px]">
              立即傳送
            </BaseButton>
          </div>
        </div>
        <!--  -->
        <div class="rounded-[12px] bg-[#323738] p-[24px] mb-[16.5px]">
          <p class="text-[20px] leading-[28px] mb-[12.5px]">
            常見問題
          </p>
          <BaseCollapseItem
            v-for="item in questionList" :key="item.title" v-model="item.active" class="mb-[16px]"
            :title="item.title" position="single" style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>{{ item.answer }}</div>
          </BaseCollapseItem>
          <BaseCollapseItem
            v-model="isActive4" class="mb-[16px]" title="是否有任何橫幅我可以用來做廣告？" position="single" style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>是的，我們提供多種橫幅尺寸，方便您使用。<span class="ml-[4px] cursor-pointer text-[#24EE89]">按一下這裡</span></div>
          </BaseCollapseItem>
          <BaseCollapseItem
            v-model="isActive5" class="mb-[16px]" title="我有很多觀眾，如何獲得特價優惠？" position="single" style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>
              如果您擁有流量較高的網站或擁有大量受眾的社交媒體帳戶，您可以透過<span class="cursor-pointer text-[#24EE89]"> support@bc.game
              </span>與我們聯繫以獲得特別優惠。
            </div>
          </BaseCollapseItem>
          <BaseCollapseItem
            v-model="isActive6" class="mb-[16px]" title="如果我有不同的網站/帳戶，我可以建立多少個聯盟連結？" position="single"
            style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>您可以為不同的流量來源建立多達 20 個獨特的代碼。</div>
          </BaseCollapseItem>
          <BaseCollapseItem
            v-model="isActive7" class="mb-[16px]" title="我可以查看推薦人的資料嗎？" position="single" style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>
              是的，BC.GAME 相信完全透明，並向用戶提供所有數據，例如用戶名、總賭注和賺取的佣金、註冊日期和應用的推薦連結。 您可以在<span
                class="cursor-pointer text-[#24EE89]"
              >
                推薦會員控制面板</span>中查看所有這些資訊。
            </div>
          </BaseCollapseItem>
          <BaseCollapseItem
            v-model="isActive8" class="mb-[16px]" title="我可以寄小費或獎勵給我的推薦人嗎？" position="single" style="
          --collapse-header-bg:#323738;
          --collapse-border:none;
          --collapse-text-color:#B3BEC1;
          --collapse-title-color:#fff;
          --collapse-content-bg:#323738;
          --collapse-title-font-weight:400;
          --collapse-header-padding:0;
          --collapse-content-padding:0;
          --collapse-height:24px;
          "
          >
            <template #arrow>
              <div class="w-[24px] h-[24px] flex items-center justify-center bg-[#3A4142] text-[16px] rounded-[6px]">
                <BaseIcon name="right" />
              </div>
            </template>
            <div>是的，您可以使用任何受支援的硬幣發送推薦人小費。<span class="cursor-pointer text-[#24EE89]">按一下這裡</span></div>
          </BaseCollapseItem>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style lang="scss">
.live-dot {
  display: inline-block;
  background-color: rgb(69, 217, 30);
  width: 8px;
  height: 8px;
  position: relative;
  margin-right: 8px;
  border-radius: 4px;

  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 50%;
    margin-top: -4px;
    margin-left: -4px;
    background-color: rgb(69, 217, 30);
    opacity: 0.3;
    border-radius: 50%;
    animation: 1.5s linear 0s infinite normal none running online;
  }
}

@keyframes online {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(2.5);
  }
}

.live-container {
  animation: 30s linear 0s infinite normal none running scroll;
}

@keyframes scroll {
  0% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-100%);
  }
}
</style>
