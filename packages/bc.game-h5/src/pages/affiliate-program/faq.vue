<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { ref } from 'vue'

// 常见问题列表
const faqItems = ref([
  {
    question: 'LOGO.COM 联盟计划是什么？',
    answer: 'LOGO.COM 联盟计划是我们为您提供有关连结的机会，只需让我们有机会吸引更多的玩家。',
    expanded: true,
  },
  {
    question: '参加需要花费多少钱？',
    answer: '',
    expanded: false,
  },
  {
    question: '即使我没有网站也可以获得推广吗？',
    answer: '',
    expanded: false,
  },
  {
    question: '我能挣多少钱？',
    answer: '',
    expanded: false,
  },
])

// 切换FAQ展开状态
function toggleFaq(index: number) {
  faqItems.value[index].expanded = !faqItems.value[index].expanded
}
</script>

<template>
  <div class="faq-container">
    <!-- 常见问题说明 -->
    <div class="faq-section">
      <h2 class="section-title">
        常见问题说明
      </h2>

      <div class="faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="faq-item"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span>{{ item.question }}</span>
            <div class="arrow-wrapper">
              <i class="arrow-icon" :class="{ expanded: item.expanded }" />
            </div>
          </div>
          <div v-if="item.expanded" class="faq-answer">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- 关系图1 -->
    <div class="relationship-chart">
      <BaseImage class="w-full h-full" url="/img/h5/affiliate-program/my-data-img.png" />
    </div>

    <!-- 关系图2 -->
    <div class="relationship-chart">
      <BaseImage class="w-full" url="/img/h5/affiliate-program/faq-img.png" />
    </div>

    <!-- 说明文字部分 -->
    <div class="text-section">
      <!-- 直属团队 -->
      <div class="text-block">
        <h3 class="text-title">
          直属团队
        </h3>
        <p class="text-desc">
          是指直面玩家返的佣金，统一叫直属团队。
        </p>
        <ul class="text-list">
          <li>(1) B1、B2、B3 所赚取A、(8万+5万+5万) x 0.02=3200</li>
          <li>(2) C1、C2赚取的B1、(10万+4万)x0.018=2520</li>
          <li>(3) C3赚取的B3、61万x0.02=12200</li>
        </ul>
      </div>

      <!-- 自身业绩 -->
      <div class="text-block">
        <h3 class="text-title">
          自身业绩
        </h3>
        <p class="text-desc">
          是指自己玩游戏也会计算到自属业绩。
        </p>
        <ul class="text-list">
          <li>(1) B1自身业绩8万，B1赚取自身的佣金：8万x0.03=2400。</li>
          <li>(2) B2自身业绩5万，B2赚取的B2的佣金：5万x0.02=1000。</li>
          <li>(3) B3自身业绩3万，B3赚取的B3的佣金：3万x0.03=900。</li>
          <li>(4) C1自身业绩10万，C1赚取C1的佣金：10万x0.02=1000。</li>
          <li>(5) C2自身业绩4万，C2赚取C2的佣金：4万x0.02=800。</li>
          <li>(6) C3自身业绩61万，C3赚取C3的佣金：61万x0.03=18300。</li>
        </ul>
      </div>

      <!-- 其他团队 -->
      <div class="text-block">
        <h3 class="text-title">
          其他团队
        </h3>
        <p class="text-desc">
          是指下下级、下下下级...等发展的佣金，统一叫其他团队。
        </p>
        <p class="text-desc">
          本公司只无限发展下级，二级连锁件为限于阻止。
        </p>
        <p class="text-desc">
          来自C1、C2、C3的团队业绩是7万，所以C1、C2和C3赚取了(10万+7.6万+61万)x0.002=15600。
        </p>
      </div>

      <!-- 总结说明 -->
      <div class="text-block">
        <h3 class="text-title">
          总结说明
        </h3>
        <ul class="text-list">
          <li>(1) C3结为，团结比合所有业绩都要受到至高返佣比例。</li>
          <li>(2) B2而言比较低，没有发展下级，收益低。</li>
          <li>(3) B3虽然加入比较晚，且属于A的下级，但其下级C3给力，比B3很接近亏更高返佣比例，所以B3不经下级团队收入也很可观，因此对于下级下，不管是处于第几级，收益水平不变明显，不适论如何人下级的力，发展也不割韭。</li>
          <li>(4) 这是一套非常公平合理代理模式，并不会因为加入大时间，而减去收获在晚入。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.faq-container {
  background-color: #1a1d1e;
  color: white;
  min-height: 100vh;
  padding: 16px;
  overflow-y: scroll;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.faq-section {
  background-color: #323738;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.faq-item {
  margin-bottom: 12px;

  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    padding: 8px 0;

    .arrow-wrapper {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #4a5354;
      border-radius: 4px;
    }

    .arrow-icon {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-right: 2px solid #b3bec1;
      border-bottom: 2px solid #b3bec1;
      transform: rotate(-45deg);
      transition: transform 0.3s;

      &.expanded {
        transform: rotate(45deg);
      }
    }
  }

  .faq-answer {
    padding: 8px 0;
    color: #b3bec1;
    font-size: 12px;
    line-height: 1.5;
  }
}

.relationship-chart {
  background-color: #292d2e;
  border-radius: 8px;
  margin-bottom: 16px;

  .w-full {
    width: 100%;
  }
}

.text-section {
  background-color: #323738;
  border-radius: 8px;
  padding: 16px;

  .text-block {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .text-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .text-desc {
      font-size: 12px;
      color: #849194;
      line-height: 1.5;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .text-list {
      li {
        font-size: 12px;
        color: #849194;
        line-height: 1.5;
        font-weight: 600;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
