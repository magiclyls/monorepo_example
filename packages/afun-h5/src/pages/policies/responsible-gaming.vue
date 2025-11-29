<script setup lang='ts'>
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted } from 'vue'

defineOptions({ name: 'ResponsibleGaming' })
const setTitle = inject('setTitle', (v: string) => {})

const { VITE_OFFICIAL_NAME } = getEnv()

//  对象
const i18nMap: any = {
  responsibleGaming: {
    'zh-CN': '负责任博彩',
    'en-US': 'Responsible Gaming',
  },
  guestResponsibility: {
    'zh-CN': '客户责任',
    'en-US': 'Guest Responsibility',
  },
  guestResponsibilityDesc1: {
    'zh-CN': `在${VITE_OFFICIAL_NAME}，我们致力于推广博彩作为一种娱乐和休闲的替代形式，利益相关者共同承担责任，确保我们的博彩决策是知情的，我们的博彩行为是社会负责任的。`,
    'en-US': `At ${VITE_OFFICIAL_NAME}, we are committed to promoting gaming as an alternative form of entertainment and leisure, with stakeholders sharing a shared responsibility to ensure that our gaming decisions are informed and our gaming behaviors are socially responsible.`,
  },
  guestResponsibilityDesc2: {
    'zh-CN': '我们的主要关注点是维护公平和安全的博彩体验，保护玩家免受游戏的任何不良后果。',
    'en-US': 'Our primary concern is maintaining a fair and safe gaming experience and protecting players from any adverse consequences of the game.',
  },
  guestResponsibilityDesc3: {
    'zh-CN': `${VITE_OFFICIAL_NAME}致力于为客户提供负责任的博彩。我们创建了一个超越最低标准的负责任博彩计划，提供超出预期的结果。我们的计划帮助那些寻求帮助的人或接受员工培训来帮助客人，我们也努力创造一个环境，让负责任博彩意识更加普遍，让帮助客户变得容易和私密。`,
    'en-US': `${VITE_OFFICIAL_NAME} is committed to providing customers with responsible gaming. We've created a responsible gaming program that goes above and beyond the minimums and delivers results that exceed expectations. Our programs help those who seek assistance or receive staff training to help guests, and we also strive to create an environment where responsible gaming awareness is more common and making helping customers easy and private.`,
  },
  guestResponsibilityDesc4: {
    'zh-CN': '我们与当地咨询机构Life Change Recovery Center合作，为我们的客人提供专业的客户服务。',
    'en-US': 'We partner with our local consulting agency, Life Change Recovery Center, to provide our guests with professional customer care services.',
  },
  guestResponsibilityDesc5: {
    'zh-CN': '请享受理性、负责任和有控制的游戏。',
    'en-US': 'Please enjoy rational, responsible and controlled play.',
  },
  excludedPersons: {
    'zh-CN': '被排除人员',
    'en-US': 'Excluded Persons',
  },
  excludedPersonsDesc: {
    'zh-CN': `在${VITE_OFFICIAL_NAME}，我们致力于推广博彩作为一种娱乐和休闲的替代形式，利益相关者承担共同责任，确保博彩决策是知情的，博彩行为是社会负责任的。`,
    'en-US': `At ${VITE_OFFICIAL_NAME}, we are committed in promoting gaming as an alternative form of entertainment and leisure where stakeholders undertake a shared responsibility to ensure gaming decisions are informed and that gaming behavior is socially responsible.`,
  },
  excludedPersonsItem1: {
    'zh-CN': '21岁以下的人员或菲律宾任何学校、学院或大学的学生；',
    'en-US': 'Persons under twenty-one (21) years of age or students of any school, college or university in the Philippines;',
  },
  excludedPersonsItem2: {
    'zh-CN': '直接与政府或其任何机构运营相关的政府官员及其直系亲属（父母、配偶和子女）；',
    'en-US': 'Government officials connected directly with the operation of the government or any of its agencies and their immediate relatives (parents, spouse and children);',
  },
  excludedPersonsItem3: {
    'zh-CN': '菲律宾武装部队成员（包括陆军、海军和空军）和菲律宾国家警察；',
    'en-US': 'Members of the Armed Forces of the Philippines (including the Army, Navy and Airforce) and the Philippine National Police;',
  },
  excludedPersonsItem4: {
    'zh-CN': '直接或间接参与博彩运营的PAGCOR博彩就业许可证（GEL）持有人；',
    'en-US': 'PAGCOR Gaming Employment License (GEL) holders directly or indirectly involved in gaming operations;',
  },
  excludedPersonsItem5: {
    'zh-CN': '被列入国家限制人员数据库（NDRP）的人员。',
    'en-US': 'Persons included in the National Database of Restricted Persons (NDRP).',
  },
  gamblingAddiction: {
    'zh-CN': '博彩成瘾',
    'en-US': 'Gambling Addiction',
  },
  gamblingAddictionDesc1: {
    'zh-CN': '当玩家产生无法控制的赌博冲动时，博彩就成了一个问题，这可能导致一个人负债，甚至对家庭或社区造成伤害。',
    'en-US': 'Gambling becomes a problem when a player develops an uncontrollable urge to gamble which may lead one to incur debts or even inflict harm on one\'s family or community.',
  },
  gamblingAddictionDesc2: {
    'zh-CN': '博彩成瘾会在心理、身体、社会和职业生活领域造成干扰。其特征如下行为：',
    'en-US': 'Gambling addiction causes disruptions in the psychological, physical, social and vocational areas of life. It is characterized by the following behavior:',
  },
  gamblingAddictionItem1: {
    'zh-CN': '对博彩的痴迷日益加深。',
    'en-US': 'Increasing obsession with gambling.',
  },
  gamblingAddictionItem2: {
    'zh-CN': '需要更频繁地下注更多金钱。',
    'en-US': 'A need to bet more money much frequently.',
  },
  gamblingAddictionItem3: {
    'zh-CN': '试图停止时会感到不安或易怒。',
    'en-US': 'Restlessness or irritability when attempting to stop.',
  },
  gamblingAddictionItem4: {
    'zh-CN': '追逐损失。',
    'en-US': 'Chasing losses.',
  },
  gamblingAddictionItem5: {
    'zh-CN': '尽管产生严重的负面后果，但由于持续的博彩行为而失去控制。',
    'en-US': 'Loss of control as a result of continued gambling behavior in spite of mounting, serious and negative consequences.',
  },
  responsibleGamingSection: {
    'zh-CN': '负责任博彩',
    'en-US': 'Responsible Gaming',
  },
  responsibleGamingDesc1: {
    'zh-CN': '对于经常享受博彩的玩家来说，有时超出预算并不罕见。我们建议制定具体的预算计划，以确保您的博彩支出是可承受的。有时人们否认自己问题的严重性，只有在危机时才寻求帮助。诚实地问问自己，如果您认为自己可能有问题，请将停止博彩两周或一个月作为测试目标。如果您无法实现这一目标，您可能有问题，这可能不仅影响您，还影响您的家庭、事业和个人生活。请负责任地博彩。',
    'en-US': 'For players who enjoy gambling frequently, it is not uncommon to spend over their budget sometimes. We advise that specific budget plans be made to ensure your gambling expenditure is affordable. Sometimes people deny the extent of their own problems and seek help only in crisis. Ask yourself honestly and if you think you might have a problem, set yourself the goal of stopping gambling for two weeks or a month as a test. If you are unable to achieve this, you could have a problem and this might affect not only you but also your family, career, and personal life. Please gamble responsibly.',
  },
  responsibleGamingDesc2: {
    'zh-CN': '作为PAGCOR负责任博彩倡议的一部分，提醒所有玩家严格禁止在开放和公共场所游戏。登录时，请花点时间查看负责任博彩指南，以确保安全愉快的博彩体验。',
    'en-US': 'As part of PAGCOR\'s Responsible Gaming initiatives, all players are reminded that playing in open and public places is strictly prohibited. Upon logging in, please take a moment to view the responsible gaming guidelines to ensure a safe and enjoyable gaming experience.',
  },
  whereToSeekHelp: {
    'zh-CN': '在哪里寻求博彩相关问题的帮助',
    'en-US': 'WHERE TO SEEK HELP FOR GAMBLING-RELATED CONCERNS',
  },
  whereToSeekHelpDesc1: {
    'zh-CN': '如果您觉得您或家庭成员有博彩问题，您可以通过以下方式联系我们的客户支持：（客户服务/电子邮件）。',
    'en-US': 'If you feel that you or a family member has a gambling problem, you may contact our customer support at: (customer service/email).',
  },
  liveChat: {
    'zh-CN': '在线聊天',
    'en-US': 'Live Chat',
  },
  whereToSeekHelpDesc2: {
    'zh-CN': `此外，${VITE_OFFICIAL_NAME}已与支持机构合作，解决与博彩问题相关的关切。您可以直接联系以下帮助中心：`,
    'en-US': `Also, ${VITE_OFFICIAL_NAME} has tied up with support facilities to address concerns related to gambling problems. You may directly contact the following help center:`,
  },
  gamblersAnonymous: {
    'zh-CN': '菲律宾戒赌互助会',
    'en-US': 'GAMBLERS ANONYMOUS PILIPINAS',
  },
  hotlineInfo: {
    'zh-CN': '热线电话\nReagan: 0917-509-4080\nDann: 0927-223-3963\nZita: 0917-311-2232\n电子邮件: info@gaphilippines.org\n网站: https://gamblersanonymous.ph/',
    'en-US': 'Hotlines\nReagan: 0917-509-4080\nDann: 0927-223-3963\nZita: 0917-311-2232\nEmail: info@gaphilippines.org\nWebsite: https://gamblersanonymous.ph/',
  },
  pagcorExclusionProgram: {
    'zh-CN': 'PAGCOR排除计划',
    'en-US': 'PAGCOR Exclusion Program',
  },
  pagcorExclusionDesc1: {
    'zh-CN': 'PAGCOR管理排除计划，该计划能够将您排除在所有PAGCOR运营和监管的机构之外。',
    'en-US': 'PAGCOR manages the exclusion program which will be able to exclude you from gambling in all PAGCOR operated and regulated establishments.',
  },
  pagcorExclusionDesc2: {
    'zh-CN': '表格和程序可以在此链接中找到：https://pagcor.ph/regulatory/exclusion2.php。有两种类型的排除计划：',
    'en-US': 'The forms and procedures can be found on this link: https://pagcor.ph/regulatory/exclusion2.php. There are two types of exclusion programs:',
  },
  selfExclusion: {
    'zh-CN': '1. 自我排除',
    'en-US': '1. Self-Exclusion',
  },
  selfExclusionItem1: {
    'zh-CN': '您可以申请6个月、1年或5年的排除期。在您选择的期限过后，排除令将自动解除；',
    'en-US': 'You can request for an exclusion period of 6 months, 1 year or 5 years. After the lapse of your selected period, the exclusion order will be lifted automatically;',
  },
  selfExclusionItem2: {
    'zh-CN': '六个月排除期是不可撤销的；',
    'en-US': 'The six-month exclusion period is irrevocable;',
  },
  selfExclusionItem3: {
    'zh-CN': '延期可以至少六（6）个月；',
    'en-US': 'Extensions may be granted for at least six (6) months;',
  },
  familyExclusion: {
    'zh-CN': '2. 家庭排除',
    'en-US': '2. Family Exclusion',
  },
  familyExclusionItem1: {
    'zh-CN': '以下任何一名家庭成员都可以申请排除：配偶、至少18岁的子女和父母；',
    'en-US': 'Any one of the following family members can request for exclusion: spouse, child at least 18 years of age and a parent;',
  },
  familyExclusionItem2: {
    'zh-CN': '申请人可以申请6个月、1年或3年的排除期。排除期结束后，家庭排除令将自动解除，除非家庭重新申请排除。',
    'en-US': 'Applicant may request for an exclusion period of 6 months, 1 year or 3 years. After completion of the exclusion period, the family exclusion order will be lifted automatically unless the family re-applies for exclusion.',
  },
  pagcorContact: {
    'zh-CN': '您可以通过keepitfun@pagcor.ph联系PAGCOR，了解任何关切或澄清。',
    'en-US': 'You can contact PAGCOR for any concerns or clarifications at keepitfun@pagcor.ph.',
  },
}

// 获取文本
function getText(key: string): string {
  const textMap = i18nMap[key]
  if (!textMap) {
    console.warn(`Translation key "${key}" not found`)
    return key // 如果没有找到key，返回key本身
  }

  // 根据当前站点语言获取对应字段
  const currentLang = getLang()
  return textMap[currentLang] || textMap['en-US'] || key
}

onMounted(() => {
  setTitle(getText('responsibleGaming'))
})
</script>

<template>
  <div class="min-h-screen leading-[20px]">
    <main class="main">
      <div class="parent-layout">
        <div class="content-parent !mt-0">
          <div>
            <div class="faqs-title">
              <span class="title-text">{{ getText('guestResponsibility') }}</span>
            </div>
            <div class="divider" />
          </div>

          <div class="item-answer">
            <span>{{ getText('guestResponsibilityDesc1') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('guestResponsibilityDesc2') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('guestResponsibilityDesc3') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('guestResponsibilityDesc4') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('guestResponsibilityDesc5') }}</span>
          </div>
        </div>

        <div class="content-parent">
          <div>
            <div class="faqs-title">
              <span class="title-text">{{ getText('excludedPersons') }}</span>
            </div>
            <div class="divider" />
          </div>

          <div class="item-answer">
            <span>{{ getText('excludedPersonsDesc') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('excludedPersonsItem1') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('excludedPersonsItem2') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('excludedPersonsItem3') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('excludedPersonsItem4') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('excludedPersonsItem5') }}</span>
          </div>
        </div>

        <div class="content-parent">
          <div>
            <div class="faqs-title">
              <span class="title-text">{{ getText('gamblingAddiction') }}</span>
            </div>
            <div class="divider" />
          </div>

          <div class="item-answer">
            <span>{{ getText('gamblingAddictionDesc1') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('gamblingAddictionDesc2') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('gamblingAddictionItem1') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('gamblingAddictionItem2') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('gamblingAddictionItem3') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('gamblingAddictionItem4') }}</span>
          </div>

          <div class="faqs-item-detail">
            <div class="item-circle-parent">
              <div class="item-circle" />
            </div>
            <span class="item-detail">{{ getText('gamblingAddictionItem5') }}</span>
          </div>
        </div>

        <div class="content-parent">
          <div>
            <div class="faqs-title">
              <span class="title-text">{{ getText('responsibleGamingSection') }}</span>
            </div>
            <div class="divider" />
          </div>

          <div class="item-answer">
            <span>{{ getText('responsibleGamingDesc1') }}</span>
          </div>

          <div class="item-answer">
            <span>{{ getText('responsibleGamingDesc2') }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang='scss' scoped>
.main {
  position: relative;
}
.content-parent {
  background-color: #233846;
  padding-bottom: 6px;
  margin-top: 8px;
  border-radius: 4px;
}

.item-answer {
  padding: 6px 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
}

.faqs-item-detail {
  display: flex;
  flex-direction: row;
  padding: 2px 20px;
  line-height: 15px;
}

.item-circle-parent {
  height: 20px;
  width: 6px;
  display: flex;
  align-items: center;
}

.item-circle {
  background-color: #b1bad3;
  border-radius: 90px;
  height: 4px;
  width: 4px;
}

.item-detail {
  padding-left: 5px;
  font-size: 14px;
  line-height: 20px;
  flex: 1;
  color: #b1bad3;
}

.faqs-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 52px;
  padding: 8px 16px;
  gap: 6px;
}

.title-indicator {
  position: relative;
  display: block;
  content-visibility: auto;
  width: 2px;
  height: 18px;
  aspect-ratio: 0.222222 / 1;
  background: #24ee89;
  border-radius: 5px;

  .src {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    visibility: visible;
  }
}

.title-text {
  font-weight: 700;
  font-size: 14px;
  color: #fff;
}

.divider {
  height: 1px;
  background-color: #2f4553;
  width: calc(100% - 24px);
  margin: 0 auto;
}
</style>
