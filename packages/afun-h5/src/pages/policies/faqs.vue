<script setup lang='ts'>
import { AfunBaseArrow, AfunBaseCell } from '@tg/bccomponents'
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'Faqs' })

const { t } = useI18n()
const { VITE_OFFICIAL_NAME } = getEnv()
// 获取当前域名
const CURRENT_DOMAIN = window.location.origin
const setTitle = inject('setTitle', (v: string) => { })
// 使用语言store
//  映射对象
const i18nMap: Record<string, Record<string, string>> = {
  faqsTitle1: {
    'zh-CN': '政策声明',
    'en-US': 'Policy Statement',
  },
  faqsTitle1SubTitle1: {
    'zh-CN': '我需要提供哪些文件进行KYC验证？',
    'en-US': 'What documents do I need to provide for KYC verification?',
  },
  faqsTitle1Desc1: {
    'zh-CN': '当被要求时，您可能需要向我们提供以下每个类别的清晰可读文件副本。我们鼓励您在收到我们的请求之前，在方便的时候直接发送您的文件副本，以便将来与我们进行更顺畅的交易处理。',
    'en-US': 'You may be required to provide us with a clear and readable copy of a document from each of the following categories when requested. We encourage that you directly send a copy of your documents at your earliest convenience, prior to our request, to facilitate smoother processing of transactions with us in the future.',
  },
  faqsTitle1Desc1Item1: {
    'zh-CN': '身份证明 - 您的带照片身份证件的完整清晰副本，包含您的姓名、出生日期和有效证件到期日期。',
    'en-US': 'Proof of Identity - a full and clear copy of your photo ID with your name, date of birth and a valid document expiry date.',
  },
  faqsTitle1Desc1Item2: {
    'zh-CN': '地址证明 - 确认您当前居住地址的文件，该文件在3个月内签发。只有在您的有效身份证件上没有反映地址，或者我们特别要求此文件的情况下才需要发送此文件 - 这取决于您的账户活动。',
    'en-US': 'Proof of Address - a document confirming your current residential address that is issued within 3 months. It is only necessary to send this document if there\'s no address reflected on your valid photo ID or in the event that we specifically require for this document - depending on your account activities.',
  },
  faqsTitle1Desc1Item3: {
    'zh-CN': '账户所有权证明 - 这取决于您与我们交易时使用的存款或取款方法。请参考本FAQ后续项目中列出的您使用的具体方法，以了解更多我们需要您提供的文件或其中的部分。',
    'en-US': 'Proof of Account Ownership - this depends on the deposit or withdrawal methods you\'ve used to transact with us. Please refer to the specific method you used listed on the succeeding items of this FAQs to understand more on what documents, or part of which, we need you to fulfill.',
  },
  faqsTitle1Desc1Item4: {
    'zh-CN': '资金来源或财富来源证明 - 这些是我们可能根据您与我们关系期间的账户变动而要求的额外文件。详细说明请参见：哪些文件足以作为资金来源或财富来源证明？',
    'en-US': 'Proof of Source of Funds or Source of Wealth - These are additional documents that we might require depending on the account movements during your relationship with us. Detailed explanation is available on: What documents are sufficient as Proof of Source of Funds or Source of Wealth?',
  },
  faqsTitle1Desc2: {
    'zh-CN': '请注意：',
    'en-US': 'PLEASE NOTE:',
  },
  faqsTitle1Desc2Item0: {
    'zh-CN': '文件必须清晰可读。',
    'en-US': 'The documents must be clear and readable.',
  },
  faqsTitle1Desc2Item1: {
    'zh-CN': '扫描或拍摄完整文件。请不要裁剪、折叠或遮挡文件（无论是完全还是部分）。',
    'en-US': 'Scan or capture the full document. Please do not crop, fold or obstruct the document (whether fully or partially).',
  },
  faqsTitle1Desc2Item2: {
    'zh-CN': '文件必须有效且最近（少于3个月），显示您的全名、当前居住地址、账户详情、交易详情和文件有效期。',
    'en-US': `The documents must be valid and recent (less than 3 months old) showing your full name, current residential address, account details, ${VITE_OFFICIAL_NAME} transaction details and document validity date.`,
  },
  faqsTitle1Desc2Item3: {
    'zh-CN': '由于信息缺失或不一致，您可能会被要求发送额外的支持文件，如出生证明、签证或入境许可等。',
    'en-US': 'You may be asked to send additional supporting documents such as Birth Certificate, Visa or Entry Permit, etc. due to missing information or discrepancy(ies).',
  },
  faqsTitle1Desc2Item4: {
    'zh-CN': '如果您的文件中的信息是用外语表述的，如果您能直接向我们提供英文翻译会很有帮助。',
    'en-US': 'If the information in your documents is stated in foreign language, it would be helpful if you could directly provide us with its English translation.',
  },
  faqsTitle1Desc2Item5: {
    'zh-CN': '对于无纸化或在线账户，请截屏账户详情和账单页面，并发送包含URL地址栏的完整截图。在线账户的截图仅被接受为有效的账户所有权证明、资金来源证明和/或财富来源证明，但不作为有效的地址证明。',
    'en-US': 'For paperless or online accounts, please Print Screen the account details and statement pages and send us the full screenshot including the URL address bar. Screenshots of online accounts are accepted as valid proof of account ownership, proof of source of funds and/or proof of source of wealth only but not as a valid proof of address.',
  },
  faqsTitle1Desc2Item6: {
    'zh-CN': '请仅以JPG、GIF、PNG或PDF文件格式发送图像，每个文件最大大小为4 MB',
    'en-US': 'Please send images in JPG, GIF, PNG or PDF file formats only with a maximum size of 4 MB per file',
  },
  faqsTitle1Desc2Item7: {
    'zh-CN': '请使用您设备上可用的最高分辨率。',
    'en-US': 'Please use the highest resolution available on your device.',
  },
  faqsTitle1Desc2Item8: {
    'zh-CN': '如果没有扫描仪，您可以使用数码相机或智能手机相机拍摄文件。',
    'en-US': 'If scanner is not available, you may capture the document using a digital camera or smartphone camera.',
  },
  faqsTitle1Desc2Item10: {
    'zh-CN': '通过电子邮件发送文件附件时，请使用您的注册电子邮件地址，否则验证处理时间可能会更长。',
    'en-US': 'Please use your  registered email address when sending document attachments by email, otherwise processing time for verification may be longer.',
  },
  faqsTitle1Desc2Item11: {
    'zh-CN': `根据您的账户活动和可能触发的内部阈值，未来可能仍会要求额外的要求。${VITE_OFFICIAL_NAME}有权执行这些验证流程，以确保每个成员的安全和保障环境。`,
    'en-US': `Additional requirements may still be asked in the future depending on the account activities and internal thresholds that you might trigger. ${VITE_OFFICIAL_NAME} has the right to perform these verification processes to ensure safe and secured environment for every member.`,
  },
  faqsTitle1SubTitle2: {
    'zh-CN': '为什么我被要求进行KYC验证流程？',
    'en-US': 'Why am I being asked to undergo KYC verification process?',
  },
  faqsTitle1SubTitle2Desc0: {
    'zh-CN': '您将被要求进行我们的KYC验证流程，原因如下：',
    'en-US': 'You will be required to undergo our KYC verification process as a result of:',
  },
  faqsTitle1SubTitle2Desc0Item0: {
    'zh-CN': `您更新了${VITE_OFFICIAL_NAME}个人资料中的某些个人信息；`,
    'en-US': `You updating certain personal information on your ${VITE_OFFICIAL_NAME} Profile;`,
  },
  faqsTitle1SubTitle2Desc0Item1: {
    'zh-CN': `缺乏与您、您的${VITE_OFFICIAL_NAME}账户或您与${VITE_OFFICIAL_NAME}的交易相关的某些信息；`,
    'en-US': `Lack of certain information relating to you, your ${VITE_OFFICIAL_NAME} account or your transaction(s) with ${VITE_OFFICIAL_NAME};`,
  },
  faqsTitle1SubTitle2Desc0Item2: {
    'zh-CN': `与您、您的${VITE_OFFICIAL_NAME}账户或您与${VITE_OFFICIAL_NAME}的交易相关的信息存在差异或不一致；`,
    'en-US': `Discrepancy(ies) or inconsistency(ies) of information relating to you, your ${VITE_OFFICIAL_NAME} account or your transaction(s) with ${VITE_OFFICIAL_NAME};`,
  },
  faqsTitle1SubTitle2Desc0Item3: {
    'zh-CN': '促销申请；',
    'en-US': 'Promotional claims;',
  },
  faqsTitle1SubTitle2Desc0Item4: {
    'zh-CN': '触发了某些活动级别或阈值；',
    'en-US': 'Certain activity levels or thresholds being triggered;',
  },
  faqsTitle1SubTitle2Desc0Item5: {
    'zh-CN': '我们的例行或随机检查。',
    'en-US': 'Our routine or random checks.',
  },
  faqsTitle1SubTitle2Desc1: {
    'zh-CN': `尽管有上述规定，${VITE_OFFICIAL_NAME}保留在我们认为必要或适当的时候对任何成员进行KYC验证的权利。`,
    'en-US': `Notwithstanding the above, ${VITE_OFFICIAL_NAME} reserves the right to perform KYC verifications on any of our members as and when we deem necessary or appropriate.`,
  },
  faqsTitle1SubTitle3: {
    'zh-CN': '我需要提供哪些文件进行KYC验证？',
    'en-US': 'What documents do I need to provide for KYC verification?',
  },
  faqsTitle2: {
    'zh-CN': '账户',
    'en-US': 'Account',
  },
  faqsTitle2SubTitle0: {
    'zh-CN': `我可以在${VITE_OFFICIAL_NAME}注册多少个账户？`,
    'en-US': `How many accounts can I register with ${VITE_OFFICIAL_NAME}?`,
  },
  faqsTitle2SubTitle0Desc0: {
    'zh-CN': `您只被允许在${VITE_OFFICIAL_NAME}注册一个账户，并且始终持有不超过一个账户。如果发现多个账户属于或与您相关，${VITE_OFFICIAL_NAME}保留将这些账户视为单一联合账户或根据我们的条款和条件关闭此类账户的权利。`,
    'en-US': `You are only permitted to register one account with ${VITE_OFFICIAL_NAME} and hold no more than one account at all times. Should more than one account be identified as belonging or relating to you, ${VITE_OFFICIAL_NAME} reserves the right to treat any such accounts as a single joint account or to close such accounts in accordance with our Terms & Conditions.`,
  },
  faqsTitle2SubTitle1Desc0: {
    'zh-CN': `作为${VITE_OFFICIAL_NAME}尽职调查的一部分，以满足监管要求，我们需要验证我们成员的身份。如果您需要发送文件副本进行验证，我们的相关部门将向您发送电子邮件。`,
    'en-US': `As part of ${VITE_OFFICIAL_NAME}\'s due diligence to satisfy the regulatory requirements, we are required to verify the identity of our members. Our related department will be sending you an email should you need to send a copy of your documents for verification.`,
  },
  faqsTitle2SubTitle2Desc0: {
    'zh-CN': '请检查您是否正确输入了密码。密码应至少包含6个字符，并且区分大小写。如果此问题持续存在，请点击忘记账户功能重置您的旧/之前密码。',
    'en-US': 'Please check if you have entered the password correctly. The password should have at least 6 characters and it is case sensitive. If this problem persists, click the Forgot Account function to reset your old/previous password.',
  },
  faqsTitle2SubTitle1: {
    'zh-CN': `我在${VITE_OFFICIAL_NAME}游戏时是否需要提交任何形式的验证文件？`,
    'en-US': `Do I need to submit any form of verification documents when I play at ${VITE_OFFICIAL_NAME}?`,
  },
  faqsTitle2SubTitle2: {
    'zh-CN': '当我尝试使用密码登录时为什么会出现错误？',
    'en-US': 'Why is there an error when I try to log in using my password?',
  },
  faqsTitle2SubTitle3: {
    'zh-CN': '我的个人信息安全吗？',
    'en-US': 'Is my personal information secure?',
  },
  faqsTitle2SubTitle3Desc0: {
    'zh-CN': '我们致力于维护隐私实践，尽可能为客户创造安全的游戏环境。',
    'en-US': 'We are committed to maintaining privacy practices to create, as far as possible, a secure gaming environment for our customers.',
  },
  faqsTitle2SubTitle3Desc1: {
    'zh-CN': '我们保护个人信息的承诺符合数据保护立法，包括我们如何处理数据。',
    'en-US': 'Our commitment to protect personal information are in accordance with data protection legislation, including how we process the data.',
  },
  faqsTitle2SubTitle3Desc2: {
    'zh-CN': `所有为${VITE_OFFICIAL_NAME}或代表${VITE_OFFICIAL_NAME}提供服务的各方都有法律义务遵守和遵守${VITE_OFFICIAL_NAME}的隐私标准。`,
    'en-US': `All parties who perform services for or on behalf of ${VITE_OFFICIAL_NAME} have legal obligations to observe and comply with ${VITE_OFFICIAL_NAME}\'s privacy standards.`,
  },
  faqsTitle2SubTitle3Desc3: {
    'zh-CN': '请参阅我们的隐私政策页面了解更多详情。',
    'en-US': 'Kindly refer to our Privacy Policy page for more details.',
  },
  faqsTitle2SubTitle4: {
    'zh-CN': `我是否被允许在${VITE_OFFICIAL_NAME}上游戏？`,
    'en-US': `Am I allowed to play on ${VITE_OFFICIAL_NAME}?`,
  },
  faqsTitle2SubTitle4Desc0: {
    'zh-CN': `您必须至少21岁或您所在地区的法定成年年龄（以较大者为准），并且已阅读并同意${VITE_OFFICIAL_NAME}的规则和条款。点击链接查看更多相关信息。`,
    'en-US': `You must be at least 21 years old or the legal age of the majority in your locality, whichever is the oldest, and have read and agreed to the ${VITE_OFFICIAL_NAME} rules and terms. Click the link to view more relevant information.`,
  },
  faqsTitle2SubTitle5Desc0: {
    'zh-CN': '不需要。一旦您完成注册并完整填写会员账户资料，您就可以用一个账户享受网站上提供的所有产品。',
    'en-US': 'No. Once you have completed SIGN UP and your member account profile in full, you can enjoy all products offered on Site with your one account.',
  },
  faqsTitle2SubTitle5: {
    'zh-CN': `我是否必须开设新账户才能在除体育博彩以外的${VITE_OFFICIAL_NAME}产品中游戏？`,
    'en-US': `Do I have to open a new account to play in ${VITE_OFFICIAL_NAME} products other than Sportsbook?`,
  },
  faqsTitle2SubTitle6Desc0: {
    'zh-CN': `请注意，当您登录账户时，您可以在${VITE_OFFICIAL_NAME}主页右上角的"我的账户"下的"对账单"中查看最近30天的账户对账单。`,
    'en-US': `Please note that you will be able to view the last 30 days of your account statement in \"Statement\" under \"My Account\" located at the upper rightmost part of your ${VITE_OFFICIAL_NAME} homepage when you login to your account.`,
  },
  faqsTitle2SubTitle7: {
    'zh-CN': '什么是投注责任，它如何帮助我？',
    'en-US': 'What is betting liability and how does it help me?',
  },
  faqsTitle2SubTitle7Desc0: {
    'zh-CN': '作为一家信誉良好且负责任的游戏公司，我们希望您在充分享受网站服务的同时调整心态。少数客户可能对游戏上瘾，这会对他们的经济、职业、家庭和社会产生负面影响。在这方面，我们公司强烈建议您花一些时间访问投注责任页面查看重要信息，澄清和调整您的娱乐心态。',
    'en-US': 'As a reputable and responsible gaming company, we hope that you will adjust your mentality while enjoying the website services to the fullest. A small number of customers may be so addicted to games that it has a negative impact on their economy, career, family and society. In this regard, our company strongly recommends that you take some time to go to the betting responsibility page to view important information, clarify and adjust your entertainment mentality.',
  },
  faqsTitle2SubTitle8Desc0: {
    'zh-CN': '您可以使用以下两种方法中的任何一种在您的账户上申请自我排除或暂停：',
    'en-US': 'You may apply self-exclusion or Time out on your account using any of the two methods::',
  },
  faqsTitle2SubTitle9: {
    'zh-CN': '我可以在到期前取消我的自我排除吗？',
    'en-US': 'Can I remove my self-exclusion before it expires?',
  },
  faqsTitle2SubTitle9Desc0: {
    'zh-CN': '自我排除限制将严格适用于账户，有效期为最少六个月（6个月），在6个月期限结束前无法取消。',
    'en-US': 'Self-exclusion restrictions will be strictly applied to an account and will be valid for a minimum period of six (6) months and cannot be removed before the end of the 6month period.',
  },
  faqsTitle2SubTitle10Desc0: {
    'zh-CN': '不需要，您不需要在账户中维持最低余额。',
    'en-US': 'No, you don\'t need to maintain a minimum balance in your account.',
  },
  faqsTitle2SubTitle10: {
    'zh-CN': '我是否必须在账户中维持最低余额？',
    'en-US': 'Do I have to maintain a minimum balance in my account?',
  },
  faqsTitle2SubTitle11: {
    'zh-CN': '如果我的账户一段时间未使用会被关闭吗，我如何重新激活它？',
    'en-US': 'Will my account be closed if it has been unused for a while and how can I reactivate it?',
  },
  faqsTitle2SubTitle11Desc0: {
    'zh-CN': `如果自您上次账户登录日期起连续6个月内没有进行任何交易，您的${VITE_OFFICIAL_NAME}账户将被归类为休眠账户。`,
    'en-US': `Your ${VITE_OFFICIAL_NAME} account will be categorized as a Dormant Account if there were no transactions performed for a continuous period of 6 months since your last account login date.`,
  },
  faqsTitle2SubTitle11Desc1: {
    'zh-CN': `如果您的账户自上次账户登录日期起连续超过18个月保持休眠状态，${VITE_OFFICIAL_NAME}保留将您账户中的剩余资金作为捐赠转移给指定的慈善机构和公益事业，并关闭您的账户的权利。`,
    'en-US': `If your account remains dormant for a continuous period of more than 18 months since your last account login date, ${VITE_OFFICIAL_NAME} reserves the right to transfer the remaining funds in your account as a donation to nominated charity(ies) and good causes, and to close your account.`,
  },
  faqsTitle2SubTitle12: {
    'zh-CN': `我在${VITE_OFFICIAL_NAME}注册的姓名是否必须与我的身份证件和在${VITE_OFFICIAL_NAME}存款/取款时使用的账户上的姓名相同？`,
    'en-US': `Does my registered name with ${VITE_OFFICIAL_NAME} have to be the same as that on my identification document and account(s) used in depositing/withdrawing with ${VITE_OFFICIAL_NAME}?`,
  },
  faqsTitle2SubTitle12Desc0: {
    'zh-CN': `您必须使用您的真实合法姓名和身份注册${VITE_OFFICIAL_NAME}账户，这也必须与用于在您的${VITE_OFFICIAL_NAME}账户中存款或接收资金的信用卡/借记卡、银行账户或其他支付账户上的信息相对应。`,
    'en-US': `You must register your ${VITE_OFFICIAL_NAME} account using your true and legal name and identity which must also correspond with that on the credit/debit card(s), bank account(s) or other payment accounts used to deposit or receive funds in your ${VITE_OFFICIAL_NAME} account.`,
  },
  faqsTitle2SubTitle13Desc0: {
    'zh-CN': `如果您仍然可以登录账户，请点击${VITE_OFFICIAL_NAME}主页右上角的"我的账户">个人资料并参考"电子邮件地址"。但是，如果您无法登录，请联系我们的客户服务。`,
    'en-US': `If you still can login into your account, please click on \"My Account\" located at the upper rightmost part of your ${VITE_OFFICIAL_NAME} homepage > Profile and refer to \"Email Address\". However, if you can\'t, please contact our customer service.`,
  },
  faqsTitle2SubTitle13: {
    'zh-CN': '我记不起我注册的电子邮件，我该怎么办？',
    'en-US': 'I can\'t remember my registered email, what should I do?',
  },
  faqsTitle2SubTitle14: {
    'zh-CN': '我已注册但无法投注',
    'en-US': 'I have registered but can\'t bet',
  },
  faqsTitle2SubTitle14Desc0: {
    'zh-CN': `如果您仍然可以登录账户，请点击${VITE_OFFICIAL_NAME}主页右上角的"我的账户" > 个人资料并参考"电子邮件地址"。但是，如果您无法登录，请联系我们的客户服务。`,
    'en-US': `If you still can login into your account, please click on "My Account" located at the upper rightmost part of your ${VITE_OFFICIAL_NAME} homepage > Profile and refer to "Email Address". However, if you can\'t, please contact our customer service.`,
  },
  faqsTitle2SubTitle14Desc1: {
    'zh-CN': '您可以在注册后立即完善会员信息，或在注册后6个月内随时前往"个人资料"页面完善。',
    'en-US': 'You can complete the membership information immediately after registration, or go to the "Personal Profile" page to complete it at any time within 6 months after registration.',
  },
  faqsTitle2SubTitle14Desc2: {
    'zh-CN': '要完成您的会员资料，您需要提供以下信息：',
    'en-US': 'To complete your membership profile, you will need to provide the following information:',
  },
  faqsTitle2SubTitle14Desc2Item0: {
    'zh-CN': '称呼',
    'en-US': 'call',
  },
  faqsTitle2SubTitle14Desc2Item1: {
    'zh-CN': '姓名',
    'en-US': 'Name',
  },
  faqsTitle2SubTitle14Desc2Item2: {
    'zh-CN': '确认您的账户名、密码和电子邮件地址',
    'en-US': 'Confirm your account name, password and email address',
  },
  faqsTitle2SubTitle14Desc2Item3: {
    'zh-CN': '手机和座机号码',
    'en-US': 'Mobile and landline numbers',
  },
  faqsTitle2SubTitle14Desc2Item4: {
    'zh-CN': '生日',
    'en-US': 'Birthday',
  },
  faqsTitle2SubTitle14Desc2Item5: {
    'zh-CN': '国籍和出生地',
    'en-US': 'Nationality and place of birth',
  },
  faqsTitle2SubTitle14Desc2Item6: {
    'zh-CN': '居住地',
    'en-US': 'place of residence',
  },
  faqsTitle2SubTitle14Desc2Item7: {
    'zh-CN': '居住地址信息',
    'en-US': 'residential address information',
  },
  faqsTitle2SubTitle14Desc2Item8: {
    'zh-CN': '首选语言和时区',
    'en-US': 'Preferred language and time zone',
  },
  faqsTitle2SubTitle14Desc2Item9: {
    'zh-CN': '再次确认您是否真的想接收更新和优惠',
    'en-US': 'Once again do you really want to receive updates and offers',
  },
  faqsTitle2SubTitle14Desc2Item10: {
    'zh-CN': '再次确认您已年满21岁（以及您所在地区的法定年龄）。您已阅读网站条款和条件。',
    'en-US': 'Double-check that you are over the age of 21 (and over the legal age in your area). You have read the terms and conditions of the website.',
  },
  faqsTitle2SubTitle14Desc2Item11: {
    'zh-CN': '再次提醒，只有在您完成资料后才能进行存款。',
    'en-US': 'Again, deposits cannot be made until you have completed your profile.',
  },
  faqsTitle2SubTitle14Desc3: {
    'zh-CN': '请注意，只有在您完整填写资料后，才能进行任何资金存入。',
    'en-US': 'Note, you will not be able to deposit any funds until you have first completed your profile in full.',
  },
  faqsTitle2SubTitle15: {
    'zh-CN': '如果我没有更新我的资料会怎样？',
    'en-US': 'What happens if I didn\'t update my profile details?',
  },
  faqsTitle2SubTitle15Desc0: {
    'zh-CN': '如果您在注册后6个月内未更新您的资料，您将无法完整使用我们的网站及服务。',
    'en-US': 'If you have not updated your profile details within 6 months from SIGN UP, you will not be able to use our Site and its Services in full.',
  },
  faqsTitle2SubTitle15Desc1: {
    'zh-CN': '要完善您的会员资料详情，请参见FAQ"我已注册账户但无法投注"。',
    'en-US': 'To complete your member profile details see FAQ"I\'ve registered an account but cannot place any bets".',
  },
  faqsTitle2SubTitle15Desc2: {
    'zh-CN': '请注意，您自注册之日起有6个月时间来完整填写会员资料。',
    'en-US': 'Note, you have up to 6 months from the date of SIGN UP to complete your member profile in full.',
  },
  faqsTitle2SubTitle15Desc3: {
    'zh-CN': '如果您的会员资料在6个月内未完成，您的账户将被关闭，您的注册信息将从我们的系统中删除。',
    'en-US': 'If your member profile is not completed within 6 months, your account will be closed and your SIGN UP information removed from our systems.',
  },
  faqsTitle2SubTitle16: {
    'zh-CN': '我可以更改我的首选语言吗？',
    'en-US': 'Can I change my preferred language?',
  },
  faqsTitle2SubTitle16Desc0: {
    'zh-CN': '请在您的个人资料设置中更新您的语言选择 - 进入首页 > 左上角侧边栏 > 左上角语言',
    'en-US': 'Please update your language selection in your profile settings - Go to Home > Top-left sidebar > Top-left language',
  },
  faqsTitle3: {
    'zh-CN': '资料验证',
    'en-US': 'Profile Verification',
  },
  faqsTitle3SubTitle0: {
    'zh-CN': '什么是KYC？',
    'en-US': 'What is KYC?',
  },
  faqsTitle3SubTitle0Desc0: {
    'zh-CN': `了解您的客户（KYC）是${VITE_OFFICIAL_NAME}作为受监管企业必须执行的尽职调查活动，以便为您提供服务。KYC程序要求我们根据相关法律法规，核实会员的相关信息，确保${VITE_OFFICIAL_NAME}会员及其活动的合规性。`,
    'en-US': `Know Your Customer (KYC) refers to the due diligence activities that ${VITE_OFFICIAL_NAME}, as a regulated business, must perform to provide services to you. KYC procedures are required to establish certain information about our members for compliance with the relevant legislations and to ensure probity of ${VITE_OFFICIAL_NAME} members and their activities with us.`,
  },
  faqsTitle3SubTitle1: {
    'zh-CN': `${VITE_OFFICIAL_NAME}的KYC验证流程是什么？`,
    'en-US': `What is ${VITE_OFFICIAL_NAME}\'s KYC verification process?`,
  },
  faqsTitle3SubTitle1Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}完全受马恩岛博彩监督委员会许可和监管。作为我们履行监管要求的尽职调查的一部分，我们需要验证会员的身份。`,
    'en-US': `${VITE_OFFICIAL_NAME} is fully licensed and regulated by the Isle of Man Gambling Supervision Commission. As part of our due diligence to satisfy the regulatory requirements, we are required to verify the identity of our members.`,
  },
  faqsTitle3SubTitle1Desc1: {
    'zh-CN': `为完成必要的KYC验证流程，我们将要求会员提供某些有效身份证明文件的副本。此请求将通过您在${VITE_OFFICIAL_NAME}注册的电子邮件地址以及${VITE_OFFICIAL_NAME}账户消息收件箱通知您。请注意，您需要使用数码相机、智能手机相机或扫描仪提交所需文件。`,
    'en-US': `To fulfill the necessary KYC verification process, we will require our members to provide us with copies of certain valid identification documents. This request will be communicated to you via your email address registered with ${VITE_OFFICIAL_NAME} as well as via your ${VITE_OFFICIAL_NAME} account Messaging Inbox. Please note that you will require access to a digital camera, smartphone camera or scanner for your submission of the required documents.`,
  },
  faqsTitle3SubTitle2: {
    'zh-CN': '为什么我被要求进行KYC验证流程？',
    'en-US': 'Why am I being asked to undergo KYC verification process?',
  },
  faqsTitle3SubTitle2Desc0: {
    'zh-CN': '您将因以下原因被要求进行我们的KYC验证流程：',
    'en-US': 'You will be required to undergo our KYC verification process as a result of:',
  },
  faqsTitle3SubTitle2Desc0Item0: {
    'zh-CN': `您更新了${VITE_OFFICIAL_NAME}个人资料中的某些个人信息；`,
    'en-US': `You updating certain personal information on your ${VITE_OFFICIAL_NAME} Profile;`,
  },
  faqsTitle3SubTitle2Desc0Item1: {
    'zh-CN': `缺乏与您、您的${VITE_OFFICIAL_NAME}账户或您与${VITE_OFFICIAL_NAME}的交易相关的某些信息；`,
    'en-US': `Lack of certain information relating to you, your ${VITE_OFFICIAL_NAME} account or your transaction(s) with ${VITE_OFFICIAL_NAME};`,
  },
  faqsTitle3SubTitle2Desc0Item2: {
    'zh-CN': `与您、您的${VITE_OFFICIAL_NAME}账户或您与${VITE_OFFICIAL_NAME}的交易相关的信息存在差异或不一致；`,
    'en-US': `Discrepancy(ies) or inconsistency(ies) of information relating to you, your ${VITE_OFFICIAL_NAME} account or your transaction(s) with ${VITE_OFFICIAL_NAME};`,
  },
  faqsTitle3SubTitle2Desc0Item3: {
    'zh-CN': '促销申请；',
    'en-US': 'Promotional claims;',
  },
  faqsTitle3SubTitle2Desc0Item4: {
    'zh-CN': '触发了某些活动级别或阈值；',
    'en-US': 'Certain activity levels or thresholds being triggered; or',
  },
  faqsTitle3SubTitle2Desc0Item5: {
    'zh-CN': '我们的例行或随机检查。',
    'en-US': 'Our routine or random checks.',
  },
  faqsTitle3SubTitle2Desc1: {
    'zh-CN': `尽管有上述规定，${VITE_OFFICIAL_NAME}保留在我们认为必要或适当的时候对任何会员进行KYC验证的权利。`,
    'en-US': `Notwithstanding the above, ${VITE_OFFICIAL_NAME} reserves the right to perform KYC verifications on any of our members as and when we deem necessary or appropriate.`,
  },
  faqsTitle3SubTitle3: {
    'zh-CN': '我如何知道是否需要进行KYC验证流程？',
    'en-US': 'How will I know if I am required to undergo your KYC verification process?',
  },
  faqsTitle3SubTitle3Desc0: {
    'zh-CN': `您将收到我们KYC部门的通知，要求您通过电子邮件发送文件至您注册的${VITE_OFFICIAL_NAME}电子邮件地址以及通过${VITE_OFFICIAL_NAME}账户消息收件箱提交KYC验证文件。`,
    'en-US': `You will receive a notification from our KYC department requiring you to submit documents for KYC verification via email to your registered ${VITE_OFFICIAL_NAME} email address as well as via your ${VITE_OFFICIAL_NAME} account Messaging Inbox`,
  },
  faqsTitle3SubTitle3Desc1: {
    'zh-CN': `收到此类通知后，请尽快提供所有所需文件，以避免交易处理延迟和/或减少/防止${VITE_OFFICIAL_NAME}账户持续使用的中断。`,
    'en-US': `You should provide all the required documents at your earliest convenience upon receipt of such notification to avoid any delays in processing your transactions and/or reduce/prevent interruptions to the continuing use of your ${VITE_OFFICIAL_NAME} account.`,
  },
  faqsTitle3SubTitle4: {
    'zh-CN': '我没有收到KYC部门的通知，还可以提交文件进行验证吗？',
    'en-US': 'I did not receive a notification from your KYC department. Can I still send you the copies of my documents for verification?',
  },
  faqsTitle3SubTitle5: {
    'zh-CN': '我需要提供哪些文件进行KYC验证？',
    'en-US': 'What documents do I need to provide for KYC verification?',
  },
  faqsTitle3SubTitle6: {
    'zh-CN': '如果我没有所需的文件怎么办？',
    'en-US': 'What if I do not have the required documents?',
  },
  faqsTitle3SubTitle6Desc0: {
    'zh-CN': '如果您没有任何所需的文件，也可以接受其他官方机构签发的官方文件或证明。我们将根据具体情况进行审核。',
    'en-US': 'If you do not have any of the required documents, other official documents or evidence issued by authorised authorities may be accepted. These will be reviewed on a case-by-case basis.',
  },
  faqsTitle3SubTitle7: {
    'zh-CN': '你们只接受英文文件吗？',
    'en-US': 'Do you only accept documents written in English?',
  },
  faqsTitle3SubTitle7Desc0: {
    'zh-CN': '虽然我们更倾向于收到英文文件，但也接受您的母语文件。如果有英文翻译也请一并提供。',
    'en-US': 'Although we prefer to receive documents in English language, we also accept documents in your native languages. It would also be helpful if you could include the documents\' English translation, if any.',
  },
  faqsTitle3SubTitle8: {
    'zh-CN': '我可以提交复印件吗？',
    'en-US': 'Can I give you a photocopy document?',
  },
  faqsTitle3SubTitle8Desc0: {
    'zh-CN': '您可以提交复印件，但我们建议您提供彩色扫描件以保证图像质量。如果复印件质量较差，我们可能会要求您提供带有清晰盖章的文件认证副本。',
    'en-US': 'You can submit a photocopy document but we encourage you to provide us with scanned coloured copy instead, due to image quality reasons. If a photocopied document is of a poor quality, we may require you to provide us with a certified true copy of your document with a stamp clearly reflected on it.',
  },
  faqsTitle3SubTitle9: {
    'zh-CN': '提交文件后可以重新上传吗？',
    'en-US': 'Can I re-upload after I submitted my document(s)?',
  },
  faqsTitle3SubTitle9Desc0: {
    'zh-CN': '当文件状态为"已提交"时，您仍可以无限次重新上传或删除文件。当文件状态为"审核中"时，上传功能将被禁用，以便我们的KYC团队先审核已提交的文件并为您提供更新。',
    'en-US': 'When the document status is SUBMITTED, you still have the option to re-upload or remove the document with unlimited tries. When the document status is REVIEW, the UPLOAD function will be disabled to allow our KYC team to review the submitted documents first and provide you with updates.',
  },
  faqsTitle3SubTitle10: {
    'zh-CN': '我如何知道我提交的文件是否足以用于KYC验证？',
    'en-US': 'How will I know if the documents I have submitted are sufficient for KYC verification purposes?',
  },
  faqsTitle3SubTitle10Desc0: {
    'zh-CN': '由于KYC文件提交和咨询量大，处理时间可能较长，请您耐心等待。请放心，我们会优先处理您的问题，并尽快回复。',
    'en-US': 'Please bear with us when processing takes longer due to high volume of KYC document submissions and enquiries. Please be assured your concerns are our priority and we will respond as soon as we can.',
  },
  faqsTitle3SubTitle11: {
    'zh-CN': '完成KYC验证的时间限制是多久？',
    'en-US': 'How long is the given timeframe to complete KYC verification?',
  },
  faqsTitle3SubTitle11Desc0: {
    'zh-CN': '您需要在我们发送初始KYC请求通知后的120小时内提供有效且完整的文件。在某些情况下，可能需要更长的处理时间。',
    'en-US': 'You need to provide valid and complete documents within 120 hours from the time we have sent the initial KYC request notification. Under certain circumstances, however, longer processing time may be required.',
  },
  faqsTitle3SubTitle12: {
    'zh-CN': '我会被要求多次进行KYC验证吗？',
    'en-US': 'Will I be required to undergo KYC verification more than once?',
  },
  faqsTitle3SubTitle12Desc0: {
    'zh-CN': '除非您上次KYC验证提交的文件已过期（如护照有效期到期），或自上次KYC验证后已过较长时间，否则您不会被要求重复提交相同的KYC文件。在这种情况下，您可能需要重新提交有效且当前的文件。',
    'en-US': 'You will not be subject to the same KYC document verification more than once, unless the document(s) you submitted in the last KYC verification had expired, e.g. passport validity period expires, or where a reasonable period since the last KYC verification process has passed, in which case you may be required to re-submit valid and current document(s).',
  },
  faqsTitle3SubTitle12Desc1: {
    'zh-CN': `尽管如此，在您与${VITE_OFFICIAL_NAME}的关系期间，您可能会被要求进行不同级别的KYC验证检查。`,
    'en-US': `Notwithstanding the above, you may be subject to different levels of KYC verification checks in the course of your relationship with ${VITE_OFFICIAL_NAME}.`,
  },
  faqsTitle3SubTitle13: {
    'zh-CN': '如果我之前提交的照片身份证已过期怎么办？',
    'en-US': 'What happens when my previously accepted Photo ID has reached the expiration date?',
  },
  faqsTitle3SubTitle13Desc0: {
    'zh-CN': '一旦您之前提交的身份证件过期，您需要向我们提供更新后的副本或其他有效的身份证明文件。',
    'en-US': 'You will need to provide us with the renewed copy or another valid form of your identity document, once your previously submitted ID expires.',
  },
  faqsTitle3SubTitle13Desc1: {
    'zh-CN': `在文件到期日前两个月，我们会通过电子邮件和${VITE_OFFICIAL_NAME}账户消息通知您重新提交有效且当前的文件。如果您未按要求提供文件，文件到期当天会再次通知您。`,
    'en-US': `Two months prior to the document expiration date, we will notify you via email and via your ${VITE_OFFICIAL_NAME} account Messaging Notification to re-submit valid and current document(s). You will receive another notification on the actual date of the document expiration in case you have not supplied the required document.`,
  },
  faqsTitle3SubTitle14: {
    'zh-CN': '如果我拒绝提供KYC验证所需的任何或全部文件会怎样？',
    'en-US': 'What if I refuse to provide any or all of the required documents for KYC verification purposes?',
  },
  faqsTitle3SubTitle14Desc0: {
    'zh-CN': `如果我们没有收到您所有所需的文件，或未在规定时间内收到，您的${VITE_OFFICIAL_NAME}账户验证将失败。`,
    'en-US': `If we do not receive all the required documents from you, or we do not receive them within the given time frame, your ${VITE_OFFICIAL_NAME} account verification process will fail.`,
  },
  faqsTitle3SubTitle14Desc1: {
    'zh-CN': `因此，您的${VITE_OFFICIAL_NAME}账户将受到一些限制，包括但不限于：`,
    'en-US': `As a result, your ${VITE_OFFICIAL_NAME} account will be bound by a few restrictions which may include, but not limited to, the following:`,
  },
  faqsTitle3SubTitle14Desc1Item0: {
    'zh-CN': '相关交易作废，',
    'en-US': 'voiding of the relevant transaction(s),',
  },
  faqsTitle3SubTitle14Desc1Item1: {
    'zh-CN': '投注取消，包括奖金没收；',
    'en-US': 'cancellation of bets including forfeiture of any winnings；',
  },
  faqsTitle3SubTitle14Desc1Item2: {
    'zh-CN': `暂停或关闭您的${VITE_OFFICIAL_NAME}账户，并保留账户内的任何资金。`,
    'en-US': `suspending or closing your ${VITE_OFFICIAL_NAME} account, with any funds remaining in it.`,
  },
  faqsTitle3SubTitle14Desc2: {
    'zh-CN': `您必须成功完成KYC验证流程，才能恢复${VITE_OFFICIAL_NAME}账户的任何进一步交易。`,
    'en-US': `You must successfully complete the KYC verification process to resume any further transactions on your ${VITE_OFFICIAL_NAME} account.`,
  },
  faqsTitle3SubTitle15: {
    'zh-CN': '我的文件在你们那里安全吗？',
    'en-US': 'Are my documents safe with you?',
  },
  faqsTitle3SubTitle15Desc0: {
    'zh-CN': `我们非常重视数据保护。我们致力于对我们收集的个人信息保密，以便您能安心在${VITE_OFFICIAL_NAME}在线娱乐。`,
    'en-US': `We take Data Protection very seriously. We are committed to maintaining the confidentiality of the personal information collected by us to allow you to enjoy playing online at ${VITE_OFFICIAL_NAME}.`,
  },
  faqsTitle3SubTitle15Desc1: {
    'zh-CN': '我们将采取技术和组织措施来保护您的个人数据，例如：',
    'en-US': 'We will use technical and organisational measures to safeguard your personal data, such as the following:',
  },
  faqsTitle3SubTitle15Desc1Item0: {
    'zh-CN': '您的账户访问受唯一的用户名和密码控制，',
    'en-US': 'access to your account is controlled by password and username which are unique to you,',
  },
  faqsTitle3SubTitle15Desc1Item1: {
    'zh-CN': '将您的个人数据存储在安全服务器上。',
    'en-US': 'storing your personal data on secure servers.',
  },
  faqsTitle3SubTitle15Desc2: {
    'zh-CN': '虽然我们会尽一切合理努力保护您的个人数据，但您应知晓互联网的使用并非完全安全，因此我们无法保证通过互联网传输的任何个人数据的安全性或完整性。',
    'en-US': 'Whilst we will use all reasonable efforts to safeguard your personal data, you acknowledge that the use of the internet is not entirely secure and for this reason we cannot guarantee the security or integrity of any personal data which are transferred from you or to you via the internet.',
  },
  faqsTitle3SubTitle15Desc3: {
    'zh-CN': '请仔细阅读隐私政策，了解我们如何使用您的个人数据。',
    'en-US': 'Please read the Privacy Policy carefully as it contains certain information about how we will use your personal data.',
  },
  faqsTitle3SubTitle16: {
    'zh-CN': 'KYC验证完成后，我可以要求删除我的个人文件吗？',
    'en-US': 'Can I request my personal document(s) to be deleted after verification is completed?',
  },
  faqsTitle3SubTitle16Desc0: {
    'zh-CN': `只要您使用所请求的服务，我们会在系统中保留您的个人信息，并在目的达成后删除，或者在您不再希望继续作为${VITE_OFFICIAL_NAME}会员注册时删除，前提是符合数据保护法规和监管要求。出于安全原因，我们可能会将${VITE_OFFICIAL_NAME}使用过程中产生的消息记录数据（包括消息内容、会员姓名、时间和日期）保留超过12个月。对于尚未注册但参与了${VITE_OFFICIAL_NAME}其他服务（如竞赛）的人士，其信息将保留至服务顺利运行所需的时间。`,
    'en-US': `We will hold your personal information on our systems for as long as you use the service you have requested, and remove it in the event that the purpose has been met, or, in the case of ${VITE_OFFICIAL_NAME} membership you no longer wish to continue your registration as a ${VITE_OFFICIAL_NAME} member, subject to Data Protection legislation and regulatory requirements. For safety reasons, however, we may store messaging transcript data (including message content, member names, times and dates) arising from the use of ${VITE_OFFICIAL_NAME} for a period in excess of 12 months. Where personal information is held for people who are not yet registered but have taken part in other ${VITE_OFFICIAL_NAME} services (e.g. competitions), that information will be held as long as is necessary to ensure that the service is running smoothly.`,
  },
  faqsTitle3SubTitle16Desc1: {
    'zh-CN': '我们将确保所有提供的个人信息都安全保存，符合相关数据保护法律。',
    'en-US': 'We will ensure that all personal information supplied is held securely, in accordance with relevant data protection laws.',
  },
  faqsTitle3SubTitle17: {
    'zh-CN': '哪些文件足以作为账户所有权证明？',
    'en-US': 'Which documents are sufficient as proof of account ownership?',
  },
  faqsTitle3SubTitle17Desc0: {
    'zh-CN': `与您${VITE_OFFICIAL_NAME}账户存款和取款信息一致的有效账户信息，如姓名、银行卡号、电子邮件地址。请勿使用第三方银行卡进行交易，否则审核时间会更长。根据第三方交易对您账户的影响，可能需要您提供更多信息，甚至导致账户被冻结或关闭。`,
    'en-US': `Valid account information that matches your ${VITE_OFFICIAL_NAME} account for deposits and withdrawals, such as your name, bank card number, email address. Do not use third-party bank cards for transactions, as this will result in longer review times. Depending on the impact of third-party transactions on your account, it may lead to the need to provide more information, or even the account to be frozen or closed.`,
  },
  faqsTitle3SubTitle17Desc0Item0: {
    'zh-CN': '最近3个月的银行账户对账单。',
    'en-US': 'Bank account statements from the last 3 months.',
  },
  faqsTitle3SubTitle17Desc0Item1: {
    'zh-CN': '显示您的姓名和卡号以及同一页面URL栏的网银清晰完整截图。',
    'en-US': 'A clear and complete screenshot of Internet Banking showing your name and card number and a link in the URL bar on the same page.',
  },
  faqsTitle3SubTitle17Desc0Item2: {
    'zh-CN': '支付宝存款凭证',
    'en-US': 'Alipay deposit certificate',
  },
  faqsTitle3SubTitle17Desc0Item3: {
    'zh-CN': '微信资料及其对应的存款凭证',
    'en-US': 'WeChat profile and its corresponding deposit certificate',
  },
  faqsTitle3SubTitle17Desc0Item4: {
    'zh-CN': '银行卡成功支付截图及其他相应存款凭证',
    'en-US': 'Screenshot of successful payment by bank card and other corresponding deposit certificates',
  },
  faqsTitle3SubTitle18: {
    'zh-CN': '什么是SOW声明表，什么时候需要填写？',
    'en-US': 'What is a SOW Declaration Form and when do | have to fill out one?',
  },
  faqsTitle3SubTitle18Desc0: {
    'zh-CN': '证明您资金和财富合法来源的证据：',
    'en-US': 'Evidence showing legitimate source of your funds and wealth:',
  },
  faqsTitle3SubTitle18Desc0Item0: {
    'zh-CN': '最近3个月的主要储蓄银行账户对账单',
    'en-US': 'Main Savings Bank Account Statement for the last 3 months',
  },
  faqsTitle3SubTitle18Desc0Item1: {
    'zh-CN': '最近3个月的工资/薪资单',
    'en-US': 'Salary/Pay Slip for the last 3 months',
  },
  faqsTitle3SubTitle18Desc0Item2: {
    'zh-CN': '投资/营业执照或合同',
    'en-US': 'Investment/business license or Contract',
  },
  faqsTitle3SubTitle18Desc0Item3: {
    'zh-CN': 'SOW问卷——如需此文件，可在资料验证页面直接获取。',
    'en-US': 'SOW Questionnaire - if this document is required, it will be readily-available on the Profile Verification page.',
  },
  faqsTitle3SubTitle19: {
    'zh-CN': `我应该如何向${VITE_OFFICIAL_NAME}提交所需的KYC文件？`,
    'en-US': `How should I send the required KYC documents to ${VITE_OFFICIAL_NAME}?`,
  },
  faqsTitle3SubTitle19Desc0: {
    'zh-CN': `我们强烈建议您使用个人资料验证页面中的上传功能，以更快、更方便地将文件发送给我们。登录${VITE_OFFICIAL_NAME}账户后，个人资料验证页面可在网站右上角"我的账户"下找到，或已登录时直接点击此处。`,
    'en-US': `We highly recommend that you use the Upload function in our PROFILE VERIFICATION page for faster and more convenient way of sending your documents to us. The PROFILE VERIFICATION page can be found under "My Account" at the upper right side of the website after you login to your ${VITE_OFFICIAL_NAME} account or if you are already logged into your account, simply click here.`,
  },
  faqsTitle3SubTitle20: {
    'zh-CN': '更改邮箱/账户找回',
    'en-US': 'Change of email address/ Account Recovery',
  },
  faqsTitle3SubTitle20Desc0: {
    'zh-CN': '如果我想更改邮箱地址该怎么办？',
    'en-US': 'What to do if I want to change my email address?',
  },
  faqsTitle3SubTitle20Desc0Item1: {
    'zh-CN': '请点击网站右上角登录下方的"忘记账户？"按钮开始操作。',
    'en-US': 'To start with the procedure, kindly click on the "Forgot Account?" button found at the topmost right corner of the website just below the log-in.',
  },
  faqsTitle3SubTitle20Desc0Item2: {
    'zh-CN': `按照步骤填写所需信息。新邮箱请确保未在${VITE_OFFICIAL_NAME}注册过。`,
    'en-US': `Follow the steps and fill-in the necessary information needed. For the new email address, please make sure that it\'s not yet registered with ${VITE_OFFICIAL_NAME}`,
  },
  faqsTitle3SubTitle20Desc0Item3: {
    'zh-CN': '如不符合条款，我们将无法处理您的请求。输入安全码后，所需文件会显示并可供您查阅。',
    'en-US': 'we will be unable to process your request in accordance with our terms and conditions. The necessary documents will be shown and be available for your perusal after the security code is keyed',
  },
  faqsTitle4: {
    'zh-CN': '网站与移动端-移动站点',
    'en-US': 'WEBSITE AND MOBILE-Mobile Site',
  },
  faqsTitle4SubTitle0: {
    'zh-CN': `什么是${VITE_OFFICIAL_NAME}移动端？`,
    'en-US': `What is ${VITE_OFFICIAL_NAME} Mobile?`,
  },
  faqsTitle4SubTitle0Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动端是我们全新的移动门户，为您的智能手机带来完整的${VITE_OFFICIAL_NAME}体育博彩和全新刺激的娱乐场游戏。`,
    'en-US': `${VITE_OFFICIAL_NAME} Mobile is our brand new Mobile portal, bringing you the complete ${VITE_OFFICIAL_NAME} sports betting line-up and exciting new Casino games to your Smartphone.`,
  },
  faqsTitle4SubTitle1Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动端：请访问${CURRENT_DOMAIN}/mobile，体验专为您的智能手机设计的全新体育博彩和娱乐场。`,
    'en-US': `${VITE_OFFICIAL_NAME} MOBILE: Go to ${CURRENT_DOMAIN}/mobile to enjoy our brand new sportsbook and casino designed just for your smartphone.`,
  },
  /* faqsTitle4SubTitle1: {
    'zh-CN': `如何在手机上连接${VITE_OFFICIAL_NAME}移动端？`,
    'en-US': `How do I connect ${VITE_OFFICIAL_NAME} Mobile on my phone?'`,
  }, */
  faqsTitle4SubTitle2: {
    'zh-CN': `如何判断我的手机是否兼容${VITE_OFFICIAL_NAME}移动端？`,
    'en-US': `How do I know if my phone is compatible with ${VITE_OFFICIAL_NAME} Mobile?`,
  },
  faqsTitle4SubTitle2Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动端兼容多种手机型号，我们也在不断努力支持更多设备。如果您的手机有问题，请联系我们，我们会协助您。`,
    'en-US': `${VITE_OFFICIAL_NAME} Mobile is compatible with a wide range of mobile phone models and we are constantly working to ensure more devices are supported. If you\'re having trouble with your phone, please contact us so we can take a closer look.`,
  },
  faqsTitle4SubTitle3Desc0: {
    'zh-CN': `是的，您可以通过点击${CURRENT_DOMAIN}/register注册新账户。`,
    'en-US': `Yes. Visit ${CURRENT_DOMAIN}/register to create your account.`,
  },
  faqsTitle4SubTitle4Desc0: {
    'zh-CN': '我们的移动娱乐场通过您的体育博彩余额运行，无需额外转账即可进行娱乐场游戏。',
    'en-US': 'Our Mobile Casino runs via your Sportsbook balance and there is no need for any extra transfer to the Casino to play.',
  },
  faqsTitle4SubTitle5Desc0: {
    'zh-CN': '手机制造商和型号通常显示在电池下的手机外壳上。或者，您也可以查看手机制造商官网或联系我们的客服，我们会很乐意协助您。',
    'en-US': 'The manufacturer and model number is usually displayed on the phone casing under the battery. Alternatively, check your phone manufacturer\' website or contact us and one of our customer service advisors will be pleased to assist you.',
  },
  faqsTitle4SubTitle3: {
    'zh-CN': `我可以通过移动端网站注册${VITE_OFFICIAL_NAME}账户吗？`,
    'en-US': `Can I register a ${VITE_OFFICIAL_NAME} account via the website?`,
  },
  faqsTitle4SubTitle4: {
    'zh-CN': '我必须转账到移动娱乐场才能玩吗？',
    'en-US': 'Do I have to transfer funds to the Mobile Casino to play?',
  },
  faqsTitle4SubTitle5: {
    'zh-CN': '我如何知道我用的是什么手机？',
    'en-US': 'How do I tell what Mobile phone I have?',
  },
  faqsTitle4SubTitle6: {
    'zh-CN': `使用${VITE_OFFICIAL_NAME}移动端需要花多少钱？`,
    'en-US': `How much does it cost to use the ${VITE_OFFICIAL_NAME} site?`,
  },
  faqsTitle4SubTitle6Desc0: {
    'zh-CN': '您无需支付任何移动端的使用费用。',
    'en-US': 'You don’t need to pay any fees to use the mobile site.',
  },
  faqsTitle4SubTitle7: {
    'zh-CN': '如果我有任何问题应该联系谁？',
    'en-US': 'Who should I contact if I have any questions?',
  },
  faqsTitle4SubTitle7Desc0: {
    'zh-CN': '您可以通过我们的客服团队联系：',
    'en-US': 'You can contact through our customer service team:',
  },
  faqsTitle4SubTitle7Desc1: {
    'zh-CN': `使用${CURRENT_DOMAIN}的在线客服`,
    'en-US': `Online customer service using ${CURRENT_DOMAIN}`,
  },
  faqsTitle4SubTitle8: {
    'zh-CN': '如果投注时断网会发生什么？',
    'en-US': 'What happens if I lose my connection while I bet?',
  },
  faqsTitle4SubTitle8Desc0: {
    'zh-CN': `当您在使用${VITE_OFFICIAL_NAME}移动端时断开连接，恢复信号后可继续使用网站。只有显示投注回执号时该投注才会被确认。您可以在大厅的账户历史中查看所有投注。`,
    'en-US': `When you lose connection while using ${VITE_OFFICIAL_NAME} mobile, you can continue to use the website once the mobile signal is restored. This bet will not be confirmed unless the bet\'s receipt number is displayed. You can view all your bets in the account history in the lobby.`,
  },
  faqsTitle4SubTitle9Desc0: {
    'zh-CN': `可以，只要您的移动服务商允许国际漫游，您就可以使用${VITE_OFFICIAL_NAME}移动端。请注意可能会产生更高的数据费用，详情请咨询您的移动服务商。`,
    'en-US': `Yes, as long as your mobile service provider allows foreign network roaming, you can use ${VITE_OFFICIAL_NAME} mobile. Note that higher data charges may apply, please contact your mobile service provider for more details.`,
  },
  faqsTitle4SubTitle9: {
    'zh-CN': `出国旅行时可以使用${VITE_OFFICIAL_NAME}移动端吗？`,
    'en-US': `Can I use ${VITE_OFFICIAL_NAME} Mobile when I travel abroad?`,
  },
  faqsTitle4SubTitle10: {
    'zh-CN': '当我向客服电话咨询时，需要提供哪些信息？',
    'en-US': 'What information do I need to provide when I ask a customer service phone question?',
  },
  faqsTitle4SubTitle10Desc0: {
    'zh-CN': '为了帮助我们处理您的查询，请提供以下信息：',
    'en-US': 'To help us make your query, please provide the following information:',
  },
  faqsTitle4SubTitle10Desc0Item0: {
    'zh-CN': '账户信息（用户名/账户ID）',
    'en-US': 'Account Information (Username/Account ID)',
  },
  faqsTitle4SubTitle10Desc0Item1: {
    'zh-CN': '手机制造商和手机型号。',
    'en-US': 'Phone manufacturer and phone model.',
  },
  faqsTitle4SubTitle10Desc0Item2: {
    'zh-CN': '页面上显示的错误代码。',
    'en-US': 'The error code displayed on your page.',
  },
  faqsTitle4SubTitle10Desc0Item3: {
    'zh-CN': '您使用的是网络应用程序还是WAP网站？',
    'en-US': 'Are you using a web application or a WAP website?',
  },
  faqsTitle4SubTitle10Desc1Item0: {
    'zh-CN': '这是第一次发生此类错误吗？如果不是，请提供详细信息。',
    'en-US': 'Is this the first time such an error has occurred? If not, please provide detailed information.',
  },
  faqsTitle4SubTitle10Desc1: {
    'zh-CN': '错误是什么时候发生的？',
    'en-US': 'When did the error occur?',
  },
  faqsTitle4SubTitle11: {
    'zh-CN': '我可以在哪里查看我的交易历史记录，可以查看多少天？',
    'en-US': 'Where can I check my transaction history and how many days can I check?',
  },
  faqsTitle4SubTitle11Desc0: {
    'zh-CN': '您可以访问最近30天的账户摘要和交易历史记录，以及最近90天的体育博彩历史记录。',
    'en-US': 'You can access your account summary and transaction history within the last 30 days, and sports betting history within the last 90 days.',
  },
  faqsTitle4SubTitle11Desc1: {
    'zh-CN': '只需选择菜单项并点击"对账单"即可轻松访问这些信息。',
    'en-US': 'Simply choose the Menu Point and click "Statement" for easy access of these information.',
  },
  faqsTitle4SubTitle12: {
    'zh-CN': '被屏蔽的内容会影响我吗？',
    'en-US': 'Does blocked content affect me?',
  },
  faqsTitle4SubTitle12Desc0: {
    'zh-CN': '一些网络运营商可能会屏蔽某些类型的内容和服务，这些内容和服务仅对21岁以上的用户开放。您的移动网络运营商需要验证您是否超过21岁，请联系您的移动服务提供商了解更多详情。',
    'en-US': 'Some network operators may block certain types of content and services that are only available to users over the age of 21. Your mobile network operator will need to verify that you are over 21, please contact your mobile service provider for more details.',
  },
  faqsTitle4SubTitle13Desc0: {
    'zh-CN': `在使用${VITE_OFFICIAL_NAME}移动版时，您的手机仍然能够接收来电和短信。大多数支持的手机会允许您接听电话，并在完成后将您返回到服务中。`,
    'en-US': `Your phone will still be able to receive inbound voice and SMS traffic whilst using ${VITE_OFFICIAL_NAME} Mobile. Most supported handsets will allow you to take a call and will return you to the service once you have finished.`,
  },
  faqsTitle4SubTitle14Desc0: {
    'zh-CN': '是的，您可以使用现有的用户ID和密码登录移动网站。',
    'en-US': 'Yes, you can use your existing user ID and password to log in to the mobile site.',
  },
  faqsTitle4SubTitle15Desc0: {
    'zh-CN': `您在任何时候只能登录一个版本的${VITE_OFFICIAL_NAME}。如果您在主网站上登录，然后登录移动网站，您将自动从主网站注销，反之亦然。`,
    'en-US': `You can only be logged in on one version of ${VITE_OFFICIAL_NAME} at any point in time. If you are logged in on the main website and you log in to the mobile site, you will automatically be logged out of the main website and vice-versa.`,
  },
  faqsTitle4SubTitle13: {
    'zh-CN': '如果我在使用服务时接到电话或短信会怎样？',
    'en-US': 'What happens if I receive a call or SMS whilst using the service?',
  },
  faqsTitle4SubTitle14: {
    'zh-CN': '我可以使用现有的用户名和密码访问移动网站吗？',
    'en-US': 'Can I use the Mobile site with my existing username and password?',
  },
  faqsTitle4SubTitle15: {
    'zh-CN': '我可以在主网站登录的同时登录移动网站吗？',
    'en-US': 'Can I log in on the Mobile site while I am logged in on the main website?',
  },
  faqsTitle4SubTitle16: {
    'zh-CN': '我无法登录，我的账户被阻止了 - 为什么？',
    'en-US': 'I can\'t log in my account is blocked - why?',
  },
  faqsTitle5: {
    'zh-CN': '网站与移动端-ＷEBSITE',
    'en-US': 'WEBSITE AND MOBILE-ＷEBSITE',
  },
  faqsTitle5SubTitle0: {
    'zh-CN': `哪些浏览器支持访问${CURRENT_DOMAIN}服务？`,
    'en-US': `What are the supported web browsers to access ${CURRENT_DOMAIN} services?`,
  },
  faqsTitle5SubTitle0Desc0: {
    'zh-CN': '我们的网站针对跨浏览器兼容性进行了优化，为多种浏览器提供支持；更显著的是在排名前4的浏览器：Windows Internet Explorer、Mozilla Firefox、Apple Safari和Google Chrome。',
    'en-US': 'Our site is optimized for cross browser compatibility, offering support for a wide range of web browsers; more significantly on the top 4 popular browsers: Windows Internet Explorer, Mozilla Firefox, Apple Safari and Google Chrome.',
  },
  faqsTitle5SubTitle0Desc1: {
    'zh-CN': '然而，一些较旧的浏览器可能不支持最新的网页标准。因此，如果您使用这些浏览器的旧版本，我们鼓励您升级到最新版本，因为您不仅会体验到浏览限制，还可能容易受到安全威胁。',
    'en-US': 'However, some older browsers may not support the newer web standards. As such, you may experience some problems viewing parts of our site. If you are using older versions of these browsers, we encourage that you upgrade to the newest version, as you may not only experience browsing limitations but could likely be vulnerable to security threats.',
  },
  faqsTitle5SubTitle1: {
    'zh-CN': '浏览器支持',
    'en-US': 'Browser support',
  },
  faqsTitle5SubTitle1Desc0: {
    'zh-CN': 'Internet Explorer (IE11.00)',
    'en-US': 'Internet Explorer (IE11.00)',
  },
  faqsTitle5SubTitle1Desc1: {
    'zh-CN': 'Firefox (39.0+)',
    'en-US': 'Firefox (39.0+)',
  },
  faqsTitle5SubTitle1Desc2: {
    'zh-CN': 'Apple (9.1.10+)',
    'en-US': 'Apple (9.1.10+)',
  },
  faqsTitle5SubTitle1Desc3: {
    'zh-CN': 'Google (50+)',
    'en-US': 'Google (50+)',
  },
  faqsTitle5SubTitle1Desc4: {
    'zh-CN': '如果您的浏览器不是上述列表中的浏览器，请使用我们的反馈表单提交问题，或者如果您遇到任何问题，请联系我们的客户服务。',
    'en-US': 'If you are using other browsers than those listed above, please submit your question using our feedback form, or contact our customer service if some issues arise.',
  },
  faqsTitle5SubTitle2: {
    'zh-CN': '我需要更改任何浏览器配置吗？',
    'en-US': 'Do I need to change any browser configurations?',
  },
  faqsTitle5SubTitle2Desc0: {
    'zh-CN': '为了访问我们的网站的全部功能，您需要启用JavaScript并接受cookies。',
    'en-US': 'In order to access the full functionality of our site, you will need to enable JavaScript and accept cookies in your',
  },
  faqsTitle5SubTitle2Desc1: {
    'zh-CN': '如果您禁用了JavaScript和cookies，这是不可能的。如果您使用的是默认浏览器设置，您应该能够在网站上进行投注而不会遇到任何问题。',
    'en-US': 'not possible if you have disabled JavaScript and cookies. If your browser is still in the default browser settings, you should be able to bet on site without any problems.',
  },
  faqsTitle5SubTitle2Desc2: {
    'zh-CN': 'Cookies是网站访问时创建的小文本文件，用于记住特定的信息，如网站偏好、投注选择和原始状态。Cookies设计用于仅记住浏览器会话中的信息，而不是收集关于您的信息。',
    'en-US': 'Cookies are small text files created by websites you visit to remember specific information such as site preferences, bet selections and original status. Cookies are designed to remember only information about your browser session, and not used to collect information about you.',
  },
  faqsTitle5SubTitle2Desc3: {
    'zh-CN': 'JavaScript是一种网页浏览器实现的一部分，使网页更加互动，它被大多数浏览器支持。它通常是安全的，因为它们仅在您的浏览器上运行，不会与您的计算机操作系统交互。然而在某些情况下，调整浏览器的安全或隐私设置可能会干扰这些要求。以下是如何在您的浏览器中启用JavaScript和cookies：',
    'en-US': 'JavaScript is a programming language implemented as part of a web browser to make web sites more interactive and it is supported by almost all browsers. It is generally safe to enable JavaScripts as they run only on your browser and does not interact with your computer\'s operating system. However in certain cases, adjusting your browser\'s privacy or security levels to a higher level may interfere with these requirements. Here is how you can enable JavaScript and cookies on your browser:',
  },
  faqsTitle5SubTitle2Desc4: {
    'zh-CN': '启用JavaScript：',
    'en-US': 'To enable JavaScript:',
  },
  faqsTitle5SubTitle2Desc5: {
    'zh-CN': '接受Cookies：',
    'en-US': 'To accept Cookies:',
  },
  faqsTitle5SubTitle3: {
    'zh-CN': '推荐的显示分辨率是多少？',
    'en-US': 'What is the recommended display resolution?',
  },
  faqsTitle5SubTitle3Desc0: {
    'zh-CN': '为了获得更好的观看体验，我们建议最小颜色深度为32位，以下图形分辨率：',
    'en-US': 'For a better viewing experience, we recommend a minimum color depth of 32 bits and the following graphics resolution:',
  },
  faqsTitle5SubTitle4: {
    'zh-CN': '如果我仍然在使用更新且正确配置的网页浏览器时遇到问题，我该怎么办？',
    'en-US': 'What should I do if I am still experiencing problem with your site despite using an updated and correctly configured web browser?',
  },
  faqsTitle5SubTitle4Desc0: {
    'zh-CN': '请通过联系我们的客户服务页面获取更多详细信息。指示您使用的特定网页浏览器版本，以及您的操作系统类型、使用的互联网连接类型和其他相关信息，可以帮助我们更快地识别问题。',
    'en-US': 'Please raise your concerns by contacting our customer service page for more details. Indicating the specific web browser version you are using, as well as your operating system, type of Internet connection you are using and other relevant information that can help us identify the problem faster.',
  },
  faqsTitle5SubTitle5: {
    'zh-CN': '我如何保护自己不被钓鱼？',
    'en-US': 'How can I protect myself from being phished?',
  },
  faqsTitle5SubTitle5Desc0: {
    'zh-CN': `1. 请不要回复要求您提供个人信息或更改密码的电子邮件。钓鱼者通常会使用虚假和耸人听闻的消息（例如"紧急 - 您的账户信息可能已被盗"）来获得用户的即时响应。${VITE_OFFICIAL_NAME}不会向客户索要电子邮件密码或账户信息。即使您认为电子邮件可能是合法的，也不要回复 - 请联系我们的客户服务进行验证或访问${VITE_OFFICIAL_NAME}网站，例如公告通知等。`,
    'en-US': `1. Please do not reply to emails that require you to provide personal information or change your password. Phishers usually use fake and sensational messages (such as "Urgent - your account information may have been stolen") in order to get an immediate response from users . ${VITE_OFFICIAL_NAME} will not ask customers for email passwords or account information. Even if you think the email may be legitimate, don\'t respond - contact our customer service for verification or visit the ${VITE_OFFICIAL_NAME} website, such as announcement notices, etc.`,
  },
  faqsTitle5SubTitle5Desc1: {
    'zh-CN': `2. 通过地址栏输入URL访问${VITE_OFFICIAL_NAME}。`,
    'en-US': `2. Enter the URL through the address bar to access ${VITE_OFFICIAL_NAME}.`,
  },
  faqsTitle5SubTitle5Desc2: {
    'zh-CN': `如果您想访问${VITE_OFFICIAL_NAME}网站，请直接在浏览器中输入相关URL，不要通过电子邮件中的任何超链接登录。`,
    'en-US': `If you want to visit a website belonging to ${VITE_OFFICIAL_NAME}, please enter the relevant URL directly in the browser to enter, do not log in through any hyperlink in the email.`,
  },
  faqsTitle5SubTitle5Desc3: {
    'zh-CN': `钓鱼者经常在电子邮件中使用链接将受害者直接发送到虚假网站，通常用类似的URL替换${CURRENT_DOMAIN}。当点击时，地址栏中显示的URL可能看起来是真实的，但有几种方法可以伪造并带您到虚假网站。如果您怀疑电子邮件是假的，请不要点击电子邮件中的任何链接。联系客户服务进行验证。始终检查多次，看看浏览器URL栏中的地址是否为我们的${VITE_OFFICIAL_NAME}的有效地址。`,
    'en-US': `Phishers often use links in emails to send victims directly to fake websites, usually replacing ${CURRENT_DOMAIN} with a similar URL. When clicked, the URL displayed in the address bar may look real, but there are several ways Can be faked and take you to fake websites. If you suspect an email is fake, please do not click on any link in the email. Call customer service to verify. Always check multiple times whether the address in the browser\'s URL bar is a valid address for our ${VITE_OFFICIAL_NAME}.`,
  },
  faqsTitle5SubTitle5Desc4: {
    'zh-CN': `3. 请定期检查您的${VITE_OFFICIAL_NAME}账户`,
    'en-US': `3. Please check your ${VITE_OFFICIAL_NAME} account regularly`,
  },
  faqsTitle5SubTitle5Desc5: {
    'zh-CN': `请登录您的${VITE_OFFICIAL_NAME}账户，检查您的银行账户余额。`,
    'en-US': `Please log in to your ${VITE_OFFICIAL_NAME} account regularly to check your bank account balance.`,
  },
  faqsTitle5SubTitle5Desc6: {
    'zh-CN': '如果您怀疑您的账户已被未经授权的人员访问，请立即更改您的密码并通知我们的客户服务。检查您的交易和银行金额。立即通知我们任何可疑的交易或错误。',
    'en-US': 'If you suspect that your account has been accessed by an unauthorized person, please change your password immediately and notify our customer service immediately. Check your transaction and bank amount. Notify us immediately of any suspicious transactions or errors.',
  },
  faqsTitle5SubTitle5Desc7: {
    'zh-CN': '4. 检查您访问的网站是否安全',
    'en-US': '4. Check if the website you are visiting is safe',
  },
  faqsTitle5SubTitle5Desc8: {
    'zh-CN': `在您在${VITE_OFFICIAL_NAME}网站上进行投注或任何银行交易之前，请确保您访问的网站是一个使用加密技术保护您的个人数据和在线交易的网站。`,
    'en-US': `Before you bet or do any banking transactions on the ${VITE_OFFICIAL_NAME} website, please ensure that the website you are visiting is a secure server that uses encryption to protect your personal data and transactions online.`,
  },
  faqsTitle5SubTitle5Desc9: {
    'zh-CN': '检查地址栏中的网络地址。如果您访问的网站位于安全服务器上，它应该以 “https://”（其中 “S” 代表安全）开头，而不是通常的 “http://”。在浏览器的状态栏中查找锁形图标。您可以将鼠标悬停在该图标上，以查看加密级别。',
    'en-US': 'Check the address bar and make sure the site starts with https:// (the “S” means secure), not http://\. Look for the lock icon in your browser. Hover over it to view the encryption or certificate details.',
  },
  faqsTitle5SubTitle5Desc10: {
    'zh-CN': '在浏览器状态栏中查找锁定图标。您可以通过将鼠标悬停在图标上来检查加密级别。',
    'en-US': 'Look for the lock icon in your browser. Hover over it to view the encryption or certificate details.',
  },
  faqsTitle5SubTitle5Desc11: {
    'zh-CN': '请注意，网站加密并不意味着网站是合法的。它只会告诉您数据是以加密形式发送的。',
    'en-US': 'Note that the fact that the site is encrypted does not mean that the site is legitimate. It will just tell you that the data was sent in encrypted form.',
  },
  faqsTitle5SubTitle5Desc12: {
    'zh-CN': '5. 经常报告可疑活动',
    'en-US': '5. Frequently report suspicious activity',
  },
  faqsTitle5SubTitle5Desc13: {
    'zh-CN': `如果您收到一封您怀疑不是真实的电子邮件，或遇到任何假冒${VITE_OFFICIAL_NAME}网站的网站，请立即通知我们，拨打我们的客户服务电话或转发给我们。`,
    'en-US': `If you receive an email that you suspect is not genuine or encounter any fraudulent website impersonating the ${VITE_OFFICIAL_NAME} website, please notify us immediately, call our customer service or forward it to us.`,
  },
  faqsTitle5SubTitle6: {
    'zh-CN': '您还有其他关于如何确保我的个人数据和账户信息安全的提示吗？',
    'en-US': 'Do you have any other tips on how to ensure security of my personal data and account information?',
  },
  faqsTitle5SubTitle6Desc0: {
    'zh-CN': '1. 谨慎使用电子邮件',
    'en-US': '1. Be cautious with emails',
  },
  faqsTitle5SubTitle6Desc1: {
    'zh-CN': '2. 避免打开或回复垃圾邮件，因为这会给发送者确认他们已经到达真实电子邮件地址的印象。阅读电子邮件时要使用常识。如果某事看起来不太可能或太好而不真实，那么它可能就是。对打开附件和从电子邮件下载文件要谨慎，无论它们来自哪里。',
    'en-US': '2. Be cautious with your personal data',
  },
  faqsTitle5SubTitle6Desc2: {
    'zh-CN': '3. 保持您的在线密码保密。不要让任何人知道您的PIN或密码，不要将它们写下来，也不要对所有在线账户使用相同的密码。',
    'en-US': '3. Keep your computer secure',
  },
  faqsTitle5SubTitle6Desc3: {
    'zh-CN': '4. 使用防病毒软件并保持更新，使用反垃圾邮件软件可以阻止垃圾邮件到达您。',
    'en-US': '4. Remember To Log Out and Lock Your Windows Desktop',
  },
  faqsTitle5SubTitle6Desc4: {
    'zh-CN': '5. 保持您的计算机安全',
    'en-US': '5. Clear Your Browser\'s Cache',
  },
  faqsTitle5SubTitle6Desc5: {
    'zh-CN': '6. 使用防火墙。这将帮助保持计算机上的信息安全，同时阻止来自不需要来源的信息。',
    'en-US': '6. It is also important, particularly for users with a broadband connection, to install a firewall. This will help keep the information on your computer secure while blocking communication from unwanted sources.',
  },
  faqsTitle5SubTitle6Desc6: {
    'zh-CN': '7. 始终记住在完成交易后注销并锁定您的Windows桌面。',
    'en-US': `7. Always remember to logout of your ${VITE_OFFICIAL_NAME} login session when you have completed your transactions. Do not leave your computer unattended. If you need to leave your computer even for one minute, always lock your Windows desktop using Ctrl-Alt-Del method.`,
  },
  faqsTitle5SubTitle6Desc7: {
    'zh-CN': '8. 清除浏览器缓存',
    'en-US': '8. Clear Your Browser\'s Cache',
  },
  faqsTitle5SubTitle6Desc8: {
    'zh-CN': '9. 避免共享个人计算机（PC）',
    'en-US': '9. Avoid Sharing Personal Computers (PCs)',
  },
  faqsTitle5SubTitle6Desc9: {
    'zh-CN': `10. 避免使用共享PC或公共PC，如那些在网吧中找到的PC，来玩${VITE_OFFICIAL_NAME}网站上的游戏。如果有必要，请始终确保这些PC是安全的，并在完成游戏后清除浏览器缓存。`,
    'en-US': `10. Avoid using shared PCs or public PCs such as those found in cyber cafes to play your games at ${VITE_OFFICIAL_NAME} sites. If there is a need to do so, always satisfy yourself thoroughly that the PCs are free from viruses and be sure to clear the browser\'s cache upon completion of your games.`,
  },
  faqsTitle5SubTitle6Desc10: {
    'zh-CN': '11. 更新您的浏览器和PC操作系统及软件',
    'en-US': '11. Update Your Browsers and PC Operating System and software',
  },
  faqsTitle5SubTitle6Desc11: {
    'zh-CN': '12. 确保您的浏览器、PC操作系统和应用程序软件支持128位SSL加密或更高加密标准。',
    'en-US': '12. You should also ensure that your browsers, PC operating system and application software to support 128-bit SSL encryption or a higher encryption standard.',
  },
  faqsTitle5SubTitle6Desc12: {
    'zh-CN': '13. 我们强烈建议您始终遵守上述最佳隐私和安全实践，以确保顺利且无忧的电子游戏体验。',
    'en-US': '13. We strongly recommend that you observe the above best privacy and security practices at all times to ensure a smooth and worry-free e-gaming experience.',
  },
  faqsTitle5SubTitle7: {
    'zh-CN': '我不再希望接收日志',
    'en-US': 'I no longer wish to receive logs',
  },
  faqsTitle5SubTitle7Desc0: {
    'zh-CN': '为了使用我们的网站，需要在您的浏览器上激活cookies。这些cookies允许我们在您访问和/或使用我们的网站时区分您与其他用户。如果您希望删除或禁用已经存储在您的计算机上的cookies，可以通过删除现有cookies和/或更改浏览器的安全设置来实现。此过程取决于您使用的浏览器。我们的快速帮助指南显示了删除/禁用各种浏览器cookies的步骤。您也可以访问浏览器的官方网站查看相关说明。',
    'en-US': 'In order to use our website, it is necessary to activate cookies on your browser. These cookies allow us to distinguish you from other users when you visit and/or use our website. If you wish to delete or disable any cookies already stored on your computer in browsing track mode, you can do so by deleting existing cookies and/or changing your browser\'s privacy settings. This process will vary depending on the browser you are using. Our quick help guide shows the steps to delete/disable various browser cookies. You can also visit the official website of the browser to view the relevant instructions.',
  },
  faqsTitle5SubTitle7Desc1: {
    'zh-CN': '请注意：通过删除/禁用cookies，您可能会失去对我们网站某些区域或您账户的访问权限。',
    'en-US': 'Please Note: By deleting/disabling cookies, you may lose access to certain areas of our website/your account.',
  },
  faqsTitle5SubTitle8: {
    'zh-CN': '如何删除/禁用cookies？',
    'en-US': 'How to delete/disable cookies?',
  },
  faqsTitle5SubTitle8Desc0: {
    'zh-CN': '此过程取决于您使用的浏览器。您也可以访问浏览器的官方网站查看相关说明。',
    'en-US': 'This process will vary depending on the browser you are using. You can also visit the official website of the browser to view the relevant instructions.',
  },
  faqsTitle5SubTitle9: {
    'zh-CN': '如何查找我的IP地址？',
    'en-US': 'How can I find my IP address?',
  },
  faqsTitle6: {
    'zh-CN': '网站与移动端-移动应用',
    'en-US': 'WEBSITE AND MOBILE-Mobile App for Android and iOS',
  },
  faqsTitle6SubTitle0: {
    'zh-CN': `什么是${VITE_OFFICIAL_NAME}移动应用？`,
    'en-US': `What is ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle0Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动应用可以下载并安装在任何兼容的Android和iOS设备上。应用支持${VITE_OFFICIAL_NAME}产品，如Sportbook、Casino、Live Casino、Virtual Sports和Lotto。${VITE_OFFICIAL_NAME}现在可以轻松访问，更快且更有趣。`,
    'en-US': `${VITE_OFFICIAL_NAME} mobile app can be downloaded and installed on any compatible Android and iOS devices. The app supports ${VITE_OFFICIAL_NAME} products such as Sportbook, Casino, Live Casino, Virtual Sports and Lotto. ${VITE_OFFICIAL_NAME} is now easily accessed, faster and with more fun on-the-go.`,
  },
  faqsTitle6SubTitle1Desc0: {
    'zh-CN': 'Android系统大约为51.06MB，iOS大约为104.76MB。我们建议您连接到具有强大信号的WiFi以进行下载。',
    'en-US': 'The Android system is estimated to be 51.06MB, and the iOS is estimated to be 104.76MB. It is recommended that you connect to a WiFi with a strong signal to download.',
  },
  faqsTitle6SubTitle2Desc0: {
    'zh-CN': `目前，${VITE_OFFICIAL_NAME}移动应用在两个商店中均不可用。您可以直接暂停脚本执行 - F8 - 网站，或访问此链接`,
    'en-US': `Currently, ${VITE_OFFICIAL_NAME} mobile app is not available in both stores. You may download the app dire Pause script execution - F8 - website, or visit this link`,
  },
  faqsTitle6SubTitle3Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}应用支持iOS 12以上和Android版本5.0及以上。`,
    'en-US': `${VITE_OFFICIAL_NAME} App supports iOS 12 above and Android version 5.0 and newer.`,
  },
  faqsTitle6SubTitle4Desc0: {
    'zh-CN': `兼容使用Android版本5.0及以上的设备。我们也在不断努力支持更多设备。如果您在使用${VITE_OFFICIAL_NAME} Android应用时遇到问题，请通过Live Chat与我们联系。`,
    'en-US': `Compatible with devices that use Android version 5.0 and newer. We are constantly working to ensure more devices are fully supported. If you encounter a problem while using the ${VITE_OFFICIAL_NAME} Android app from your device then please contact us via Live Chat.`,
  },
  faqsTitle6SubTitle5Desc0: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动应用对所有${VITE_OFFICIAL_NAME}客户免费。数据费用可能适用，您的移动服务提供商可能会因使用其数据服务而向您收费。`,
    'en-US': `${VITE_OFFICIAL_NAME} mobile app is FREE for all ${VITE_OFFICIAL_NAME} customers. Data charges may apply and your mobile service provider may charge you for using their data services to access the Internet.`,
  },
  faqsTitle6SubTitle6Desc0: {
    'zh-CN': `如果您使用移动网页，您的屏幕上会出现一个消息提示，您可以下载${VITE_OFFICIAL_NAME}移动应用。点击下载开始。`,
    'en-US': `If you are using mobile web, there will be a message prompt on your screen where you can download the ${VITE_OFFICIAL_NAME} mobile app. Click for the download to begin.`,
  },
  faqsTitle6SubTitle7Desc0: {
    'zh-CN': `使用您的设备，清除您选择的浏览器cookie。为此所需的操作取决于您的浏览器。消息现在显示，如果您访问我们的移动网站，您可以继续下载${VITE_OFFICIAL_NAME}移动应用。`,
    'en-US': `Using your device, clear cookies for your browser of choice. The actions required for this will depend on your browser. The message will now show if you visit our mobile site, and you can continue to download the ${VITE_OFFICIAL_NAME} mobile app.`,
  },
  faqsTitle6SubTitle1: {
    'zh-CN': `${VITE_OFFICIAL_NAME} APP的文件大小是多少？`,
    'en-US': `What is the file size of ${VITE_OFFICIAL_NAME} APP?`,
  },
  faqsTitle6SubTitle2: {
    'zh-CN': `${VITE_OFFICIAL_NAME}应用在Google Playstore和iTunes App Store中可用吗？`,
    'en-US': `Is ${VITE_OFFICIAL_NAME} App available in Google Playstore and iTunes App Store?`,
  },
  faqsTitle6SubTitle3: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动应用支持哪些移动设备和版本？`,
    'en-US': `What are the mobile devices and versions supported by the ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle4: {
    'zh-CN': `如何判断我的设备是否兼容${VITE_OFFICIAL_NAME} Android应用？`,
    'en-US': `How do I know if my device is compatible with the ${VITE_OFFICIAL_NAME} Android app?`,
  },
  faqsTitle6SubTitle5: {
    'zh-CN': `${VITE_OFFICIAL_NAME}移动应用免费吗？`,
    'en-US': `Is the ${VITE_OFFICIAL_NAME} mobile app free?`,
  },
  faqsTitle6SubTitle6: {
    'zh-CN': `如何下载${VITE_OFFICIAL_NAME}移动应用？`,
    'en-US': `How can I download the ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle7: {
    'zh-CN': `回答"否"，当被问及是否想下载${VITE_OFFICIAL_NAME}移动应用时，我该怎么办？`,
    'en-US': `Answered "No" when asked if I want to download the ${VITE_OFFICIAL_NAME} mobile app, how can I get the app now?`,
  },
  faqsTitle6SubTitle8: {
    'zh-CN': `如何在我的iPhone或iPad上安装${VITE_OFFICIAL_NAME} iOS应用？`,
    'en-US': `How do I install the ${VITE_OFFICIAL_NAME} iOS app on my iPhone or iPad?`,
  },
  faqsTitle6SubTitle8Desc0: {
    'zh-CN': `按照以下简单步骤下载${VITE_OFFICIAL_NAME} APP到您的移动设备：`,
    'en-US': `Follow these easy steps to download ${VITE_OFFICIAL_NAME} APP on your mobile devices:`,
  },
  faqsTitle6SubTitle8Desc1: {
    'zh-CN': `1) 在您的浏览器中启动${VITE_OFFICIAL_NAME}网站，触发自动提示询问您是否想下载应用或访问此链接`,
    'en-US': `1) Launch ${VITE_OFFICIAL_NAME} website on your browser to trigger an automatic prompt asking if you would like to download the app or visit this link`,
  },
  faqsTitle6SubTitle8Desc2: {
    'zh-CN': '2) 下载完成后，您应该能够在您的移动电话主页上找到应用。',
    'en-US': '2) Once the download has completed, you should be able to find the app on you mobile phone\'s home page.',
  },
  faqsTitle6SubTitle8Desc3: {
    'zh-CN': '提示：',
    'en-US': 'Tips:',
  },
  faqsTitle6SubTitle8Desc4: {
    'zh-CN': '如果您看到此消息："Untrusted Enterprise Developer\"',
    'en-US': 'If you see this message: "Untrusted Enterprise Developer\"',
  },
  faqsTitle6SubTitle8Desc5: {
    'zh-CN': '-您需要在您的设备上启用"未知来源"。要直接访问"未知来源"设置，请按Home按钮并点击设置。',
    'en-US': '-You need to enable "unknown sources" on your device. To access the Unknown Sources setting directly, press Home button and tap Settings.',
  },
  faqsTitle6SubTitle8Desc6: {
    'zh-CN': '-选择常规、配置文件和设备管理。您可能需要向下滚动以查看"未知来源"设置。当您找到它时，按它检查框并启用"未知来源"。',
    'en-US': '-Select General, Profiles & Device Management. You may need to scroll down to see the Unknown Sources setting. When you find it, press it to check the box and enable Unknown Sources.',
  },
  faqsTitle6SubTitle9: {
    'zh-CN': `我可以使用${VITE_OFFICIAL_NAME}移动应用完成${VITE_OFFICIAL_NAME}账户吗？`,
    'en-US': `Can I use ${VITE_OFFICIAL_NAME} mobile app to complete a ${VITE_OFFICIAL_NAME} account?`,
  },
  faqsTitle6SubTitle9Desc0: {
    'zh-CN': `为了使用${VITE_OFFICIAL_NAME}应用，您需要通过我们的网站注册为${VITE_OFFICIAL_NAME}会员。一旦您完成了快速注册，您可以使用${VITE_OFFICIAL_NAME}移动应用完成您的会员资料。`,
    'en-US': `To avail the ${VITE_OFFICIAL_NAME} app, you will need to sign up as a ${VITE_OFFICIAL_NAME} member through our website. Once you have completed the quick register, you may complete your member profile using the ${VITE_OFFICIAL_NAME} Mobile App.`,
  },
  faqsTitle6SubTitle9Desc1: {
    'zh-CN': '如果您还不是会员，请立即注册！',
    'en-US': 'If you are not yet a member, SIGN UP now!',
  },
  faqsTitle6SubTitle10: {
    'zh-CN': `使用${VITE_OFFICIAL_NAME}移动应用时，您接受哪些支付方式？`,
    'en-US': `What payment methods do you accept when using the ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle10Desc0: {
    'zh-CN': `可用支付方式将基于您注册的${VITE_OFFICIAL_NAME}账户设置。`,
    'en-US': `Available payment methods will be based on your registered ${VITE_OFFICIAL_NAME} account settings.`,
  },
  faqsTitle6SubTitle11Desc0: {
    'zh-CN': `是的，您可以使用${VITE_OFFICIAL_NAME}移动应用来处理 - 存款和取款。`,
    'en-US': `Yes, you can use the ${VITE_OFFICIAL_NAME} mobile app to both process - Deposit and Withdrawal.`,
  },
  faqsTitle6SubTitle12Desc0: {
    'zh-CN': '制造商和型号通常显示在手机外壳下的电池上。',
    'en-US': 'The manufacturer and model number are usually displayed on the phone casing under the battery.',
  },
  faqsTitle6SubTitle11: {
    'zh-CN': `我可以存款和取款吗？`,
    'en-US': `Can I deposit and withdraw funds when using the ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle12: {
    'zh-CN': '我如何找到我的移动电话的设备信息？',
    'en-US': 'How do i find the device information of my mobile phone?',
  },
  /* faqsTitle6SubTitle13: {
    'zh-CN': '我如何找到我的设备IP地址？',
    'en-US': 'How do I find my device IP address?',
  },
  faqsTitle6SubTitle13Desc0: {
    'zh-CN': 'Android:',
    'en-US': 'Android:',
  },
  faqsTitle6SubTitle13Desc1: {
    'zh-CN': 'iOS:',
    'en-US': 'iOS:',
  }, */
  faqsTitle6SubTitle14: {
    'zh-CN': '如何判断我的设备是否已Root/Jailbroken？',
    'en-US': 'How do I know if my device is Rooted/Jailbroken?',
  },
  faqsTitle6SubTitle14Desc0: {
    'zh-CN': `安装一个第三方应用程序，检查您的设备是否已Root或Jailbroken。请注意，任何第三方应用程序都不受${VITE_OFFICIAL_NAME}支持或推荐。`,
    'en-US': `Install a 3rd party app that checks if your device is rooted or jailbroken. Note that any 3rd party apps are not supported or recommended by ${VITE_OFFICIAL_NAME}.`,
  },
  faqsTitle6SubTitle15Desc0: {
    'zh-CN': '为了帮助我们处理您的查询，请提供以下信息：',
    'en-US': 'To help us with your enquiry please provide:',
  },
  faqsTitle6SubTitle16Desc0: {
    'zh-CN': `只需登录您的${VITE_OFFICIAL_NAME}账户并点击"对账单"。您可以在最近30天内访问您的账户摘要和交易历史记录，同时，体育博彩历史交易记录最长可达90天。`,
    'en-US': `Simply login to you ${VITE_OFFICIAL_NAME} account and click "Statement". You can access your account summary and transaction history within the last 30 days, meanwhile, the sports betting history transaction last up to 90 days.`,
  },
  faqsTitle6SubTitle17Desc0: {
    'zh-CN': `您的移动电话仍然可以接收来电和短信，即使您在使用${VITE_OFFICIAL_NAME}移动应用。大多数受支持的设备将允许您接听电话并返回${VITE_OFFICIAL_NAME}移动应用。`,
    'en-US': `Your mobile will still be able to receive inbound calls and SMS while you are using the ${VITE_OFFICIAL_NAME} mobile app. Most supported devices will allow you to take a call and will return you to the ${VITE_OFFICIAL_NAME} mobile app once you have finished.`,
  },
  faqsTitle6SubTitle18Desc0: {
    'zh-CN': `是的，您可以使用您的现有用户名和密码通过${VITE_OFFICIAL_NAME}移动应用登录。`,
    'en-US': `Yes, you can use your existing user ID and password to log in using the ${VITE_OFFICIAL_NAME} mobile app.`,
  },
  faqsTitle6SubTitle19Desc0: {
    'zh-CN': '是的，它将适用于两个设备。',
    'en-US': 'Yes, it will work on both devices.',
  },
  faqsTitle6SubTitle15: {
    'zh-CN': `当我联系客户服务关于${VITE_OFFICIAL_NAME}移动应用时，我应该提供哪些信息？`,
    'en-US': `What information should I provide when contacting customer services regarding the ${VITE_OFFICIAL_NAME} mobile app?`,
  },
  faqsTitle6SubTitle16: {
    'zh-CN': '我可以在哪里检查我的交易历史记录以及它持续了多长时间？',
    'en-US': 'Where can I check my transaction history and how many days it last?',
  },
  faqsTitle6SubTitle17: {
    'zh-CN': '如果我使用服务时收到来电或短信，会发生什么？',
    'en-US': 'What happens if I receive a call or SMS whilst using the service?',
  },
  faqsTitle6SubTitle18: {
    'zh-CN': `我可以使用我的现有用户名和密码通过${VITE_OFFICIAL_NAME}移动应用登录吗？`,
    'en-US': `Can I use the ${VITE_OFFICIAL_NAME} mobile app with my existing username and password?`,
  },
  faqsTitle6SubTitle19: {
    'zh-CN': `我可以同时使用${VITE_OFFICIAL_NAME}移动应用和网站登录吗？`,
    'en-US': `Cani log in using ${VITE_OFFICIAL_NAME} mobile app and website at the same time?`,
  },
  faqsTitle6SubTitle20: {
    'zh-CN': '我的账户被阻止了。为什么？',
    'en-US': 'I can\'t log in my account is blocked. Why?',
  },
  faqsTitle6SubTitle21: {
    'zh-CN': '如何使用我的设备拍摄屏幕截图？',
    'en-US': 'How can I take a screenshot using my device?',
  },
  faqsTitle6SubTitle21Desc0: {
    'zh-CN': '这可能取决于您的移动设备型号。请查阅您的手机手册或询问您的手机提供商获取更多信息。',
    'en-US': 'This can vary depending on your mobile devices make and model. Consult your phone manual or ask your phones provider for more information.',
  },
  faqsTitle6SubTitle21Desc1: {
    'zh-CN': '提示：',
    'en-US': 'Tips:',
  },
  faqsTitle6SubTitle21Desc2: {
    'zh-CN': '在某些Android设备上，您可以同时按下电源/锁定按钮和主页按钮几秒钟。您应该会听到声音，屏幕会闪烁。屏幕截图应保存到您的设备"图库"（因设备而异）。',
    'en-US': 'On some Android devices you can press and hold Power/Lock button and Home button at the same time for a couple of seconds. You should hear a sound and the screen will flash. A screenshot should be saved to your devices \"Gallery\" (varies from device to device).',
  },
  faqsTitle6SubTitle21Desc3: {
    'zh-CN': '如果您使用iPhone或iPad，您可以立即按下主页和睡眠/唤醒按钮。屏幕截图应保存到您的照片应用程序中。',
    'en-US': 'If you are using iPhone or iPad, you can immediately press and release the Home and the Sleep/Wake button on the top or side of your device. A screenshot should be saved in your Photos app.',
  },
  faqsTitle6SubTitle22: {
    'zh-CN': `如何清除${VITE_OFFICIAL_NAME} Android应用的缓存和应用数据？`,
    'en-US': `How can I clear the ${VITE_OFFICIAL_NAME} Android app\'s cache and app data?`,
  },
  faqsTitle6SubTitle22Desc0: {
    'zh-CN': '1) 点击"设置"菜单。',
    'en-US': '1) Tap on the "Settings" menu.',
  },
  faqsTitle6SubTitle22Desc1: {
    'zh-CN': '2) 向下滚动并选择"应用程序管理器"',
    'en-US': '2) Scroll down and select "Application manager"',
  },
  faqsTitle6SubTitle22Desc2: {
    'zh-CN': `3) 选择${VITE_OFFICIAL_NAME}应用`,
    'en-US': `3) Select the ${VITE_OFFICIAL_NAME} app`,
  },
  faqsTitle6SubTitle22Desc3: {
    'zh-CN': '4) 选择"清除数据"和"清除缓存"',
    'en-US': '4) Select "CLEAR DATA" and "CLEAR CACHE"',
  },
  faqsTitle7: {
    'zh-CN': '体育博彩-下注前',
    'en-US': 'SPORTSBOOK Before Placing Bets',
  },
  faqsTitle7SubTitle0: {
    'zh-CN': '赔率是如何显示的？',
    'en-US': 'How are betting odds displayed?',
  },
  faqsTitle7SubTitle1: {
    'zh-CN': '什么是欧赔、香港赔、印尼赔和马来赔？',
    'en-US': 'What are Euro, Hong Kong, Indo and Malay odds types?',
  },
  faqsTitle7SubTitle2: {
    'zh-CN': '什么是"滚球"？',
    'en-US': 'What is \"In-Play\"?',
  },
  faqsTitle7SubTitle2Desc0: {
    'zh-CN': '"滚球"是指定义何时开始的事件。滚球投注可能因事件发生时的行动而延迟或被接受。',
    'en-US': 'In-Play is the status that defines when an event has started. Bets placed In-Play may be subject to delayed confirmation or acceptance based on the actions occurring within that event.',
  },
  faqsTitle7SubTitle3Desc0: {
    'zh-CN': '"即将到来"可以在事件状态中查看。这将在应用程序、移动网页和桌面上可见。',
    'en-US': '"Coming Soon" can be viewed in the event status. This will be visible in the app, mobile web and desktop.',
  },
  faqsTitle7SubTitle4Desc0: {
    'zh-CN': '主队是您在事件框中首先看到的队伍。强队（让分热门）以粗体字母标识，让分可见于其显示赔率旁边。',
    'en-US': 'Home teams are the first team you will see in the event box. The stronger team (handicap favourite) is identified with their name in bold letters and highlighted. The assigned handicap is visible next to their displayed odds.',
  },
  faqsTitle7SubTitle3: {
    'zh-CN': '我如何知道事件是否会有滚球市场？',
    'en-US': 'How do I know if the event will have in-play markets?',
  },
  faqsTitle7SubTitle4: {
    'zh-CN': '我如何区分主队或客队，以及谁是让分热门？',
    'en-US': 'How do I distinguish Home or Away teams, and which is the handicap favourite?',
  },
  faqsTitle7SubTitle5: {
    'zh-CN': '最低和最高投注金额是多少？',
    'en-US': 'What is the minimum and maximum betting amounts?',
  },
  faqsTitle7SubTitle5Desc0: {
    'zh-CN': '最低投注金额由您选择的货币决定，以及投注类型（单式和过关投注可能不同）。',
    'en-US': 'The minimum bet amount is determined by your chosen currency, as well as the type of bet placed (Single and Parlay Bets may differ).',
  },
  faqsTitle7SubTitle5Desc1: {
    'zh-CN': '允许的最高投注金额将根据体育赛事和比赛而有所不同。',
    'en-US': 'The maximum bet amounts allowed will vary per Sport and Event.',
  },
  faqsTitle7SubTitle5Desc2: {
    'zh-CN': '特定值将始终在您登录后显示在投注单上。',
    'en-US': 'Specific values allowed will always be displayed within your bet slip once logged in.',
  },
  faqsTitle7SubTitle6: {
    'zh-CN': '最低和最高投注金额是多少？',
    'en-US': 'What is the minimum and maximum betting amounts?',
  },
  faqsTitle7SubTitle6Desc0: {
    'zh-CN': '这些投注需要至少2个选择，最多10个选择才能添加到投注单上。',
    'en-US': 'These bets require a minimum of 2 selections to a maximum of 10 selections to be added to the bet slip.',
  },
  faqsTitle7SubTitle6Desc1: {
    'zh-CN': '从"过关"状态选项中选择的选择将全部允许组合成过关投注。',
    'en-US': 'Selections chosen from the "Parlay" status option of App, Mobile or Desktop should all be allowed to be combined into a Parlay bet.',
  },
  faqsTitle7SubTitle6Desc2: {
    'zh-CN': '您也可以从任何页面随机添加2个或更多选择，但是，其中一些选择可能不被允许过关，并且会在投注单上被识别为过关。',
    'en-US': 'You may also randomly add 2 or more selections from any page, however, some of these selections may not be parlay allowed and will be identified as so within the bet slip.',
  },
  faqsTitle7SubTitle6Desc3: {
    'zh-CN': '有关这些投注类型的更多信息，请参阅我们的帮助部分 > 体育博彩规则 > 过关/多倍。',
    'en-US': 'For more information on these bet types, please refer to our Help Section > Sportsbook Rules > Parlay / Multiples.',
  },
  faqsTitle7SubTitle7: {
    'zh-CN': '"待定"状态在投注收据或我的投注中意味着什么？',
    'en-US': 'What does \"Pending\" status mean in Bet Receipt or My Bets?',
  },
  faqsTitle7SubTitle7Desc0: {
    'zh-CN': '所有滚球投注都受系统接受程序的约束。这可能导致显示"待定"状态，在您的投注被确认或被拒绝之前。',
    'en-US': 'All bets placed In-Play are subject to a system acceptance procedure. This may result in a "Pending" status being displayed, before your bet is either Confirmed or Rejected.',
  },
  faqsTitle7SubTitle8Desc0: {
    'zh-CN': '平局规则适用于多于1个赢家的情况。结算将根据原始投注金额除以赢家数量并乘以原始赔率来计算。剩余投注将丢失。',
    'en-US': 'Dead Heat Rules apply to bets where more than 1 winner has been confirmed for an Outright Market. Settlement will apply by dividing the original stake amount by the number of winners and multiplying this value by the original odds. The remainder of the stake will be lost.',
  },
  faqsTitle7SubTitle9Desc0: {
    'zh-CN': '要与我们公司进行投注，您必须至少21岁，并且已阅读并同意我们的规则和条款才能使用我们的服务。',
    'en-US': 'To bet with our company you must be at least 21 years old and have read and agree to our rules and terms to use our services.',
  },
  faqsTitle7SubTitle9Desc1: {
    'zh-CN': '在某些国家或地区，当地法律禁止赌博，这是您的责任，以确保当地法律接受相关的投注和游戏，并且不会阻止您注册和开设我们的账户。',
    'en-US': 'In some countries or regions, local laws prohibit gambling, and it is your responsibility to ensure that local laws accept relevant bets and games and do not prevent you from registering and opening an account with our company.',
  },
  faqsTitle7SubTitle10Desc0: {
    'zh-CN': '虽然我们总是努力显示正确的数据，但有关事件（例如日期、时间、得分、统计数据、新闻、红牌、中立场地细节等）的信息仅用于一般信息目的。公司对此类信息提供不承担任何责任。',
    'en-US': 'While we always strive to display the correct data, information relating to an event (e.g. dates, times, scores, statistics, news, red cards, neutral ground details, etc.) are for general information purposes only. The company shall not be liable for the accuracy in the information provided.',
  },
  faqsTitle7SubTitle8: {
    'zh-CN': '什么是平局规则的含义？',
    'en-US': 'What is the meaning of a Dead Heat Rules?',
  },
  faqsTitle7SubTitle9: {
    'zh-CN': '我的投注合法吗？',
    'en-US': 'Are my bets legal?',
  },
  faqsTitle7SubTitle10: {
    'zh-CN': '您的预赛和直播内容是否总是正确的？',
    'en-US': 'Is the information in your pre start and live content always correct?',
  },
  faqsTitle7SubTitle0Desc0: {
    'zh-CN': '赔率根据您登录的地区或您注册的国家而显示。但是，每个成员可以手动调整以符合他们的偏好，如果他们选择的话。',
    'en-US': 'Odds are displayed according to the region in which you are logged in or according to your country of registration. However, each member can manually adjust to their favored preference if they choose.',
  },
  faqsTitle7SubTitle1Desc0: {
    'zh-CN': '香港赔率',
    'en-US': 'Hong Kong Odds',
  },
  faqsTitle7SubTitle1Desc1: {
    'zh-CN': '香港赔率（HK）显示每投注1个单位的赢利金额。虽然投注（和赢利金额）将在投注成功时返回，但仅在赔率中引用赢利金额。',
    'en-US': 'The value displayed for Hong Kong Odds (HK) indentifies the winning amount for every 1 unit that is staked at these odds. While the stake (and win amount) will be returned if the bet is successful, only the win amount is referenced in the odds.',
  },
  faqsTitle7SubTitle1Desc2: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=0.88）将提供每投注100个单位的88个单位的赢利。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = 0.88) will offer winnings of 88 for every 100 staked.',
  },
  faqsTitle7SubTitle1Desc3: {
    'zh-CN': '欧赔',
    'en-US': 'Euro Decimal Odds',
  },
  faqsTitle7SubTitle1Desc4: {
    'zh-CN': '欧赔（欧元）显示每投注1个单位的回报金额。如果投注成功，回报将包括本金和赢利金额。',
    'en-US': 'The value displayed for Euro Decimal Odds (Euro) indentifies the return amount for every 1 unit that is staked at these odds. If the bet is successful, the return will include both stake and winning amount.',
  },
  faqsTitle7SubTitle1Desc5: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=1.88）将提供每投注100个单位的188个单位的回报。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = 1.88) will offer a return of 188 for every 100 staked.',
  },
  faqsTitle7SubTitle1Desc6: {
    'zh-CN': '印尼赔率',
    'en-US': 'Indo Odds',
  },
  faqsTitle7SubTitle1Desc7: {
    'zh-CN': '印尼赔率可以为正或负。只有负赔率会显示减号（-）。',
    'en-US': 'The values displayed for Indo Odds can be either positive or negative. Only negative odds will display the minus (-) symbol.',
  },
  faqsTitle7SubTitle1Desc8: {
    'zh-CN': '注意：投注后扣除的余额将根据投注收据中规定的印尼赔率进行调整，而不是投注金额。例如，如果赔率为-1.19，投注金额为100，则从账户余额中扣除119。',
    'en-US': 'Note: The balance deducted after bet placement will be related to the Indo Odds stated within the Bet Receipt and not the stake value. Example, if odds were -1.19 and a staked value was 100, 119 will be deducted from account balance.',
  },
  faqsTitle7SubTitle1Desc9: {
    'zh-CN': '注意：投注后扣除的余额将根据投注收据中规定的印尼赔率进行调整，而不是投注金额。例如，如果赔率为-1.19，投注金额为100，则从账户余额中扣除119。',
    'en-US': 'Note: The balance deducted after bet placement will be related to the Indo Odds stated within the Bet Receipt and not the stake value. Example, if odds were -1.19 and a staked value was 100, 119 will be deducted from account balance.',
  },
  faqsTitle7SubTitle1Desc10: {
    'zh-CN': '-正赔率：显示的值表示每投注1个单位的赢利（与香港赔率相同）。',
    'en-US': '-Positive Odds: The value displayed identifies the winning amount for every 1 unit that is staked (same as Hong Kong Odds).',
  },
  faqsTitle7SubTitle1Desc11: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=1.07）将提供每投注100个单位的107个单位的赢利。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = 1.07) will offer winnings of 107 for every 100 that is staked.',
  },
  faqsTitle7SubTitle1Desc12: {
    'zh-CN': '-负赔率：显示的值表示赢得1个单位的所需风险。它总是比-1.00高。',
    'en-US': '-Negative Odds: The value displayed identifies the risk required in order to win 1 unit. It will always have a value higher than-1.00.',
  },
  faqsTitle7SubTitle1Desc13: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=-1.19）表示要赢得100，需要投注119。如果投注成功，回报将包括本金和赢利金额。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = -1.19) will mean that to win 100, 119 will need to be staked. If the bet is successful, the return will include both stake and winning amount.',
  },
  faqsTitle7SubTitle1Desc14: {
    'zh-CN': '马来赔率',
    'en-US': 'Malay Odds',
  },
  faqsTitle7SubTitle1Desc15: {
    'zh-CN': '马来赔率可以为正或负。只有负赔率会显示减号（-）。',
    'en-US': 'The values displayed for Malay Odds can be either positive or negative. Only negative odds will display the minus (-) symbol.',
  },
  faqsTitle7SubTitle1Desc16: {
    'zh-CN': '注意：投注后扣除的余额将根据投注收据中规定的马来赔率进行调整，而不是投注金额。例如，如果赔率为-0.59，投注金额为100，则从账户余额中扣除59。',
    'en-US': 'Note: The balance deducted after bet placement will be related to the Malay Odds stated with the Bet Receipt and not the stake value. Example, if odds were -0.59 and a staked value was 100,59 will be deducted from account balance.',
  },
  faqsTitle7SubTitle1Desc17: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=-0.59）表示要赢得100，需要投注59。如果投注成功，回报将包括本金和赢利金额。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = -0.59) will mean that to win 100,59 will need to be staked. If the bet is successful, the return will include both stake and winning amount.',
  },
  faqsTitle7SubTitle1Desc18: {
    'zh-CN': '-正赔率：显示的值表示每投注1个单位的赢利（与香港赔率相同）。',
    'en-US': '-Positive Odds: The value displayed identifies the winning amount for every 1 unit that is staked (same as Hong Kong Odds).',
  },
  faqsTitle7SubTitle1Desc19: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=1.07）将提供每投注100个单位的107个单位的赢利。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = 1.07) will offer winnings of 107 for every 100 that is staked.',
  },
  faqsTitle7SubTitle1Desc20: {
    'zh-CN': '-负赔率：显示的值表示赢得1个单位的所需风险。它可以显示为0和-1.00之间的任何负值。例如：-0.59',
    'en-US': '-Negative Odds: The value displayed identifies the risk required in order to 1 unit. It can be displayed as any negative value between 0 and -1.00. E.g. -0.59',
  },
  faqsTitle7SubTitle1Desc21: {
    'zh-CN': '例如：利物浦 @-0.5 让分（赔率=-0.59）表示要赢得100，需要投注59。如果投注成功，回报将包括本金和赢利金额。',
    'en-US': 'E.g. Liverpool @-0.5 Handicap (Odds = -0.59) will mean that to win 100,59 will need to be staked. If the bet is successful, the return will include both stake and winning amount.',
  },
  faqsTitle8: {
    'zh-CN': '体育博彩-投注类型问题',
    'en-US': 'SPORTSBOOK Bet type Questions',
  },
  faqsTitle8SubTitle0: {
    'zh-CN': '什么是过关/未过关？',
    'en-US': 'What Is Over/Under?',
  },
  faqsTitle8SubTitle1: {
    'zh-CN': '什么是1X2？',
    'en-US': 'What is 1X2?',
  },
  faqsTitle8SubTitle0Desc0: {
    'zh-CN': '"过关/未过关"是指定义的事件中可能或可能不发生的次数。',
    'en-US': '"Over/Under" refers to a defined number of occurrences that may or may not occur within an event.',
  },
  faqsTitle8SubTitle0Desc1: {
    'zh-CN': '您选择的项目必须与事件记录的次数一致，才能成功投注。例如，网球比赛中O/U 2.5局。',
    'en-US': 'The selection you choose must be aligned with the recorded occurrences for a bet to be successful. For example, O/U 2.5 Sets in Tennis match.',
  },
  faqsTitle8SubTitle0Desc2: {
    'zh-CN': '如果您选择"未过关"，并且比赛局数为3局或更多，那么您的投注将被结算为损失。',
    'en-US': 'Should you choose "Under" and the number of Sets played was 3 or more, then your bet will be settled as a loss.',
  },
  faqsTitle8SubTitle1Desc0: {
    'zh-CN': '“1X2” 是体育博彩中常用的一种赛果投注方式，表示在比赛规定时间内可能出现的三种结果：',
    'en-US': '1X2” is a common result bet for regular time:',
  },
  faqsTitle8SubTitle1Desc1: {
    'zh-CN': '1 → 主队获胜',
    'en-US': '1 → Home team wins',
  },
  faqsTitle8SubTitle1Desc2: {
    'zh-CN': 'X → 双方战平（平局）',
    'en-US': 'X → Draw',
  },
  faqsTitle8SubTitle1Desc3: {
    'zh-CN': '2 → 客队获胜',
    'en-US': '2 → Away team wins',
  },
  faqsTitle8SubTitle1Desc4: {
    'zh-CN': '其中 1 和 2 分别代表赔率表中列出的第一支和第二支球队（通常是主队和客队）。',
    'en-US': 'Here, 1 and 2 refer to the first and second teams listed on the odds board (typically home and away).',
  },
  faqsTitle8SubTitle2Desc0: {
    'zh-CN': '我们提供不同的体育赛事和多种投注类型，您可以查看所有比赛以进行预测或现场游戏。',
    'en-US': 'We offer different sports and a variety of bet types, you can view all innings to bet on predictions or live games.',
  },
  faqsTitle8SubTitle3Desc0: {
    'zh-CN': '外围市场为选择谁将赢得特定奖项、比赛、组或比赛等提供了机会。例子包括：',
    'en-US': 'Outright markets provide the opportunity to choose who will win a specific award, competition, group, or race etc. Examples include:',
  },
  faqsTitle8SubTitle3Desc1: {
    'zh-CN': '比赛最终结果，即高尔夫锦标赛或F1车手冠军赛。',
    'en-US': 'The final outcome of a competition, i.e. Golf Tournament or F1 Driver\'s Champion.',
  },
  faqsTitle8SubTitle3Desc2: {
    'zh-CN': '预选赛最终结果，即世界杯小组赛冠军。',
    'en-US': 'The final outcome of a preliminary round, i.e. Group winner in World Cup.',
  },
  faqsTitle8SubTitle3Desc3: {
    'zh-CN': '比赛最终结果，即F1单场赛车个人冠军。',
    'en-US': 'The final outcome of a race, e.g. individual winner of a F1 race.',
  },
  faqsTitle8SubTitle3Desc4: {
    'zh-CN': 'MVP奖项获得者等。',
    'en-US': 'MVP award winners etc.',
  },
  faqsTitle8SubTitle3Desc5: {
    'zh-CN': '有关这些投注类型的更多信息，请参阅我们的帮助部分 > 体育博彩规则 > 外围市场。',
    'en-US': 'Further information can be found in our Help Section > Sportsbook Rules > Outrights.',
  },
  faqsTitle8SubTitle2: {
    'zh-CN': '我们还提供哪些投注市场？',
    'en-US': 'What other betting markets do we offer besides Handicap, Over/Under and Money Line?',
  },
  faqsTitle8SubTitle3: {
    'zh-CN': '什么是外围投注？',
    'en-US': 'What is Outright betting?',
  },
  faqsTitle9: {
    'zh-CN': '体育博彩-下注',
    'en-US': 'SPORTSBOOK Placing Bets',
  },
  faqsTitle9SubTitle0: {
    'zh-CN': '什么是"选择以红色表示的投注不能与其他投注组合"的含义？',
    'en-US': 'What is the meaning of \"Selection indicated in red may not be combined for multiple bets\"?',
  },
  faqsTitle9SubTitle0Desc0: {
    'zh-CN': '客户只能在选择投注市场时，从不会影响彼此的投注市场中进行投注。如果相关或有条件的投注在过关投注中存在，组合投注将不被接受。',
    'en-US': 'A customer may only place multiple bets when choosing from betting markets that do not have a direct affect on each other. If a related contingency is present in the parlay multiple, the combined bet will not be excepted.',
  },
  faqsTitle9SubTitle0Desc1: {
    'zh-CN': '示例：',
    'en-US': 'Example:',
  },
  faqsTitle9SubTitle0Desc2: {
    'zh-CN': '-曼联在1X2市场中获胜 @ 赔率1.80',
    'en-US': '-Manchester United to win in the 1X2 market @ odds of 1.80',
  },
  faqsTitle9SubTitle0Desc3: {
    'zh-CN': '-曼联在正确比分市场中2-0获胜 @ 赔率7.0',
    'en-US': '-Manchester United to win 2-0 in the correct score market @odds of 7.0',
  },
  faqsTitle9SubTitle0Desc4: {
    'zh-CN': '如果曼联2-0获胜，组合赔率将是12.6。但是，赔率应该只是7.0，因为如果曼联2-0获胜，他们将在1X2市场中自动获胜。',
    'en-US': 'If Manchester United win 2-0, the combined odds would be 12.6. However, the odds should only be 7.0 because if Manchester United win 2-0, they will automatically have won in the 1X2 market.',
  },
  faqsTitle9SubTitle1Desc0: {
    'zh-CN': '如果您已成功下注，即使您失去网络连接，投注仍然有效。一旦您重新登录，您可以在结果页面查看赛事结果，并在我的账户部分查看您的投注结果。',
    'en-US': 'If you had successfully placed your bets, bets will remain in effect even if you have lost your Internet connection. Once you log back in, you can check the event results on the results page and view the results of your bets in the My Account section.',
  },
  faqsTitle9SubTitle1Desc1: {
    'zh-CN': '对于在网络连接丢失时未成功下注的投注，您的余额不会被扣除。您只需要在重新连接后再次登录即可继续。如果您不确定投注是否成功，您始终可以在对账单中查看您的投注活动。',
    'en-US': 'For bets that were unsuccessfully placed when the Internet connection was lost, your balance will not be deducted. You only need to log in again after re-connecting to continue. You can always check your betting activities in the statement if you are unsure whether the bets were placed successfully.',
  },

  faqsTitle9SubTitle1: {
    'zh-CN': '如果我在游戏时网络断开连接会发生什么？',
    'en-US': 'What happens if I get disconnected from the internet while playing?',
  },
  faqsTitle10: {
    'zh-CN': '体育博彩-投注后',
    'en-US': 'SPORTSBOOK After Placing Bets',
  },
  faqsTitle10SubTitle0: {
    'zh-CN': '我可以更改或取消我的投注吗？',
    'en-US': 'Can I change or cancel my bet?',
  },
  faqsTitle10SubTitle0Desc0: {
    'zh-CN': '您有责任确保您的投注详情正确。一旦投注被我们接受并确认，将无法取消、撤销或更改，并被视为您已下单的最终证据。所有投注都会被记录在我们的交易日志数据库中，并作为所有交易及其时间的最终证据。',
    'en-US': 'You are solely responsible to ensure that the details of your bets are correct. Once your bets have been placed and their acceptance confirmed by us they may not be cancelled, revoked or changed and shall be deemed to be conclusive evidence in respect of the bets that you have placed. All bets are logged and recorded in our transaction log database and are conclusive evidence of all transactions and times at which the transactions are placed.',
  },
  faqsTitle10SubTitle1Desc0: {
    'zh-CN': '许多投注在市场"无条件确定"后会自动结算。例如：足球比赛投注大于2.5球，如果进了3球，您的奖金和本金很可能会在第3个进球确认后很快返还。对于无法在赛中结算的市场，我们会在赛事结束后尽快结算所有投注。',
    'en-US': 'Many bets are settled automatically In-Play once a market has been "Unconditionally Determined". For example： bet on Over 2.5 goals in a Football match and if 3 goals are scored, then it\'s likely your winnings and stake will be returned soon after the 3rd goal is confirmed. For markets that cannot be settled In-Play, we aim to settle all bets as soon as possible once an event has finished.',
  },
  faqsTitle10SubTitle2Desc0: {
    'zh-CN': '如果赛事被放弃、暂停或推迟，并在官方开球/开始时间后36小时内未能恢复，则以当时结果为准，投注将被取消，除非个别体育项目规则另有规定。某些已无条件确定的市场将按规定结算。这些市场的结算程序在各自体育项目规则中有说明。公司在此类事件中取消投注的决定为最终决定，与赛事裁判或相关管理机构的任何官方决定无关。对于"过关"投注，该投注仍视为有效，但过关中的该项选择视为无效，该项的派彩公式按（1）计算。',
    'en-US': 'Should an event be abandoned, suspended or postponed and fail to resume after 36 hours from the official kick off/ start time, the result as it stands will be deemed void and bets will be cancelled, unless stated otherwise in the individual sport\'s rules. Certain markets that are unconditionally determined will be settled accordingly. The settlement procedures for these markets are stated in the individual sport\'s rules. The company\'s decision to cancel bets in such an event is final and is regardless of any official decision by the event referee or relevant governing authority. For "Parlays", the bet will still be considered valid, though the selection within the parlay will be considered void. The payout formula will be calculated as (1) for that particular selection.',
  },
  faqsTitle10SubTitle3Desc0: {
    'zh-CN': '当最初在我们网站上发布的比分或结果需要修改时，就会发生结果更改。除非各体育项目或赛事规则另有规定，赛事结果将在赛事结束当天确定用于结算。',
    'en-US': 'Result changes occur when the score or result that was initially posted on our website requires amendment. The result of an event will be determined on the day of its conclusion for betting purposes unless otherwise stated within the rules for each sport or event.',
  },
  faqsTitle10SubTitle3Desc1: {
    'zh-CN': '任何可能导致推翻决定的后续查询，在结果处理后72小时内未被我们公司认可。结果处理后72小时内，我们公司只会因人为错误、系统错误或结果来源错误而重置/更正结果。',
    'en-US': 'Any subsequent enquiry that may result in an overturned decision will not be recognized by our company after 72 hours from the processing of the result. Within 72 hours after results are processed, our company will only reset / correct the results due to human error, system error or mistakes made by the referring results source.',
  },
  faqsTitle10SubTitle4Desc0: {
    'zh-CN': '我们通过观看赛事直播或获取赛事官方管理机构的信息来确认结果。',
    'en-US': 'We confirm the results by watching events live or by obtaining information from the official governing body of the participants involved in the event.',
  },
  faqsTitle10SubTitle5Desc0: {
    'zh-CN': '"我的投注"和"对账单"仅显示过去30天内已结算的投注。超过30天的交易请通过在线客服或邮件联系我们。',
    'en-US': 'My Bets and Statement only show settled wagers up to 30 days past. For transactions over 30 days, please contact us via Live Chat or email.',
  },
  faqsTitle10SubTitle5Desc1: {
    'zh-CN': '请注意，涉及6个月以上时间范围的请求可能会收取服务费。',
    'en-US': 'Kindly note that requests covering over a range of 6 months may be subject to a service free.',
  },
  faqsTitle10SubTitle6Desc0: {
    'zh-CN': '提前结算是允许您提前结算部分或全部投注的功能。现金结算按钮中显示的金额包含您的本金。',
    'en-US': 'Cash Out is a feature that allows the early settlement for a portion or all your wager. The value displayed within the Cash Out button includes your stake.',
  },
  faqsTitle10SubTitle6Desc1: {
    'zh-CN': '全额提前结算是指在赛事结束前提前结算您的全部投注。',
    'en-US': 'A full cash out is the early settlement of your wager before the conclusion of the event.',
  },
  faqsTitle10SubTitle6Desc2: {
    'zh-CN': '部分提前结算是指在赛事结束前提前结算部分本金。每种市场类型的最小单位本金必须保留在部分结算范围的任一侧。',
    'en-US': 'A partial cash out is the adjusted payout of a part of your stake before the conclusion of the event. The minimum unit stake (per market type) must remain on either side of the partial cash out range.',
  },
  faqsTitle10SubTitle7Desc0: {
    'zh-CN': '是的，现金结算金额为确认结算后返还的总金额，包括您的本金。',
    'en-US': 'Yes, the Cash out value is the total amount returned upon confirmation of cash out, inclusive of your stake amount.',
  },
  faqsTitle10SubTitle8Desc0: {
    'zh-CN': '每个投注只能结算一次。',
    'en-US': 'Cash Out can only be processed once for any bet.',
  },
  faqsTitle10SubTitle9Desc0: {
    'zh-CN': '并非所有投注都可以提前结算。可结算的投注会在"我的投注"中的"现金结算"标签下显示。',
    'en-US': 'Not all bets can be cashed out. Bets that are eligible for cash out are reflected within the "Cash out" tab in "My Bets".',
  },
  faqsTitle10SubTitle10Desc0: {
    'zh-CN': '并非所有投注都可以提前结算。可结算的投注会在"我的投注"中的"现金结算"标签下显示。',
    'en-US': 'Not all bets can be cashed out. Bets that are eligible for cash out are reflected within the "Cash out" tab in "My Bets".',
  },
  faqsTitle10SubTitle11Desc0: {
    'zh-CN': '不，您不必全部结算。我们的现金结算功能允许您提前结算部分本金，剩余本金按正常方式结算。这种方式可以让您锁定部分资金，同时剩余本金仍有获胜的可能。',
    'en-US': 'No, you dont have to. Our Cash Out feature allows you to partially cash out a portion of your original stake, while letting the remaining stake settle as normal. This approach provides the opportunity to secure certain funds, with the potential for winnings to be returned from the remaining stake.',
  },
  faqsTitle10SubTitle12Desc0: {
    'zh-CN': '进入"我的投注"，找到您想要结算的投注。点击"现金结算"按钮进行结算，或点击按钮旁的滑块并拖动滑块调整结算金额。',
    'en-US': 'Go to "My Bets" and look for the wager that you wish to cash out. Click CASH OUT button to perform the cash out, or click the sliding logo beside the button and drag the slider to adjust the Cash Out amount in your favor.',
  },
  faqsTitle10SubTitle13Desc0: {
    'zh-CN': '您之前所有已结算投注的详情都可在"我的投注"和"对账单"中查看。',
    'en-US': 'The details of all your previously cashed out wagers are reflected within the "My Bets" and "Statement".',
  },
  faqsTitle10SubTitle14Desc0: {
    'zh-CN': '进球、红牌、VAR或技术故障等重大事件可能导致现金结算在一段时间内不可用。',
    'en-US': 'Significant events such as goals, red cards, VAR or technical malfunction may lead to Cash Out being unavailable for a certain period of time.',
  },
  faqsTitle10SubTitle15Desc0: {
    'zh-CN': '现金结算交易与普通投注适用相同条款。您可以在"我的投注"或"对账单"中任何投注的"现金结算详情"下拉中找到取消结算的详细信息。',
    'en-US': 'Cash Out transactions are subject to the same terms and conditions as normal wagers. You can find the details for the cancellation of your cash out within the "Cash Out Details" drop-down of any wager within "My Bets" or "Statement".',
  },
  faqsTitle10SubTitle16Desc0: {
    'zh-CN': '请前往体育规则并在下拉列表中选择"现金结算"。这里可以找到更多相关信息和结算示例。',
    'en-US': 'Please go to the Sports Rules and select "Cash Out" from the drop-down list. Here you can find further information and settlement examples related to Cash Out.',
  },
  faqsTitle10SubTitle1: {
    'zh-CN': '处理投注派彩需要多长时间？',
    'en-US': 'How long does it take to process a bet payout?',
  },
  faqsTitle10SubTitle2: {
    'zh-CN': '如果赛事被暂停或中止，投注单会被取消吗？',
    'en-US': 'If an event is suspended or abandoned, will the bet ticket be cancelled?',
  },
  faqsTitle10SubTitle3: {
    'zh-CN': '为什么结果或比分会被重置？',
    'en-US': 'Why would a result or score be reset?',
  },
  faqsTitle10SubTitle4: {
    'zh-CN': '你们公司从哪里获取赛事结果？',
    'en-US': 'Where does your company obtain results relating to the events offered?',
  },
  faqsTitle10SubTitle5: {
    'zh-CN': '为什么在"我的投注"或"对账单"中找不到某个投注？',
    'en-US': 'Why can\'t find a wager in My Bets or Statement?',
  },
  faqsTitle10SubTitle6: {
    'zh-CN': '什么是现金结算？',
    'en-US': 'What is Cash Out?',
  },
  faqsTitle10SubTitle7: {
    'zh-CN': '现金结算金额包含我的本金吗？',
    'en-US': 'Does the cash out value include my stake amount?',
  },
  faqsTitle10SubTitle8: {
    'zh-CN': '我可以结算几次？',
    'en-US': 'How many times can I cash out?',
  },
  faqsTitle10SubTitle9: {
    'zh-CN': '为什么我无法结算已有投注？',
    'en-US': 'Why am I unable to cash out an existing bet?',
  },
  faqsTitle10SubTitle10: {
    'zh-CN': '所有投注都可以结算吗？',
    'en-US': 'Can all wagers be Cashed Out?',
  },
  faqsTitle10SubTitle11: {
    'zh-CN': '我必须全部结算本金吗？',
    'en-US': 'Must I Cash Out my entire stake?',
  },
  faqsTitle10SubTitle12: {
    'zh-CN': '如何进行现金结算？',
    'en-US': 'How do I perform a Cash Out?',
  },
  faqsTitle10SubTitle13: {
    'zh-CN': '在哪里可以查看我已结算投注的详情？',
    'en-US': 'Where can I find the details of my cashed out bet?',
  },
  faqsTitle10SubTitle14: {
    'zh-CN': '为什么现金结算按钮显示"当前不可用"？',
    'en-US': 'Why is the Cash Out button showing "Currently Unavailable"?',
  },
  faqsTitle10SubTitle15: {
    'zh-CN': '为什么我的现金结算被取消？',
    'en-US': 'Why was my Cash Out cancelled?',
  },
  faqsTitle10SubTitle16: {
    'zh-CN': '在哪里可以查看更多关于现金结算规则的信息？',
    'en-US': 'Where can I find further information about Cash Out Rules?',
  },
  faqsTitle11: {
    'zh-CN': '体育博彩直播电视',
    'en-US': 'SPORTSBOOK Live TV',
  },
  faqsTitle11SubTitle0: {
    'zh-CN': '我可以观看这项服务吗？',
    'en-US': 'Can I view this service?',
  },
  faqsTitle11SubTitle1: {
    'zh-CN': '观看直播电视需要账户吗？',
    'en-US': 'Do I need an account in order to watch Live TV?',
  },
  faqsTitle11SubTitle2: {
    'zh-CN': '我可以在直播电视上观看哪些顶级赛事？',
    'en-US': 'What top class events can I watch on Live TV?',
  },
  faqsTitle11SubTitle3: {
    'zh-CN': '观看直播视频流需要什么系统和浏览器要求？',
    'en-US': 'What are the system and browser requirements to view the live video streaming?',
  },
  faqsTitle11SubTitle4: {
    'zh-CN': '为什么Chrome或Firefox浏览器在我的桌面设备上无法播放直播电视？',
    'en-US': 'Why does Chrome or Firefox browser not playback Live TV on my Desktop?',
  },
  faqsTitle11SubTitle5: {
    'zh-CN': '为什么我无法观看在我国家举办的赛事？',
    'en-US': 'Why am I unable to view events held in my country?',
  },
  faqsTitle11SubTitle6: {
    'zh-CN': '如何识别有直播流的比赛？',
    'en-US': 'How are the matches with live streaming indicated?',
  },
  faqsTitle11SubTitle7: {
    'zh-CN': '我可以从哪些国家观看直播电视？',
    'en-US': 'Which countries can I watch live TV from?',
  },
  faqsTitle11SubTitle8: {
    'zh-CN': '观看直播电视有什么限制？',
    'en-US': 'What restrictions apply to watching Live TV?',
  },
  faqsTitle11SubTitle9: {
    'zh-CN': '如果网站速度慢或连接经常断开，我该怎么办？',
    'en-US': 'What can I do if the site is slow or if the connection is regularly lost?',
  },
  faqsTitle11SubTitle10: {
    'zh-CN': '每个赛事的直播电视什么时候开始？',
    'en-US': 'When does Live TV become active for each event?',
  },
  faqsTitle11SubTitle11: {
    'zh-CN': '当我满足所有上述系统和浏览器要求时，为什么仍然无法观看直播视频流？',
    'en-US': 'Why am I unable to watch the live video streaming when I have met all the above system and browser requirements?',
  },
  faqsTitle11SubTitle12: {
    'zh-CN': '使用宽带、Wi-Fi、4G和3G时我应该期待什么差异？',
    'en-US': 'What differences should I expect using Broadband, Wi-Fi, 4G and 3G?',
  },
  faqsTitle11SubTitle13: {
    'zh-CN': '我可以观看视频但没有音频从流中传出？',
    'en-US': 'I can view the video but is there is no audio coming from the stream?',
  },
  faqsTitle11SubTitle14: {
    'zh-CN': '如何检查我是否安装了Flash播放器？',
    'en-US': 'How can I check if I have Flash player installed?',
  },
  faqsTitle11SubTitle0Desc0: {
    'zh-CN': '此服务适用于位于特定地区的会员，他们账户中有资金或在过去24小时内下过注。',
    'en-US': 'This service is available for members, based in certain regions, who have funds in their account or have placed a bet within the last 24 hours.',
  },
  faqsTitle11SubTitle1Desc0: {
    'zh-CN': '是的，您需要登录账户才能观看直播电视。',
    'en-US': 'Yes, you need to be logged in to your account in order to view Live TV.',
  },
  faqsTitle11SubTitle2Desc0: {
    'zh-CN': '直播电视目前提供多个体育项目的赛事，包括足球、篮球、网球、五人制足球、沙滩足球、羽毛球、手球、排球和斯诺克等。',
    'en-US': 'Live TV is currently offering events across multiple sports including Football, Basketball, Tennis, Futsal, Beach Soccer, Badminton, Handball, Volleyball and Snooker to name a few.',
  },
  faqsTitle11SubTitle3Desc0: {
    'zh-CN': '大多数操作系统应该能够流畅播放我们的直播电视服务。但是，在较旧或不太知名的操作系统上可能会出现功能异常（或播放问题）。',
    'en-US': 'Most operating systems should have the ability to stream uninterrupted coverage of our Live TV service. However, non-function (or problems with playback) may occur on older or lesser known operating systems.',
  },
  faqsTitle11SubTitle3Desc1: {
    'zh-CN': '浏览器播放可能会根据您是在桌面设备还是移动设备上观看直播电视而有所不同。',
    'en-US': 'Browser playback may vary depending on whether you are watching Live TV on Desktop or Mobile.',
  },
  faqsTitle11SubTitle3Desc2: {
    'zh-CN': '对于移动设备，我们建议您使用最新版本的Chrome或Safari浏览器。',
    'en-US': 'For Mobile devices we recommend you use the latest browser version of Chrome or Safari.',
  },
  faqsTitle11SubTitle3Desc3: {
    'zh-CN': '对于桌面设备，我们建议您使用最新版本的Chrome、Safari（在苹果电脑上）或Internet Explorer Edge / IE 11。一些较旧版本的IE（7,8,9,10）可能无法播放直播电视。',
    'en-US': 'For Desktop devices we recommend you use the latest browser version of Chrome, Safari (on Apple PCs) or Internet Explorer Edge / IE 11. Some older versions of IE (7,8,9,10) may not playback Live TV.',
  },
  faqsTitle11SubTitle4Desc0: {
    'zh-CN': '由于这些提供商实施的Flash阻止措施，您可能需要手动允许Flash在您的PC上播放。一旦设置更新后，除非缓存被清除，否则您不需要再次调整此设置。',
    'en-US': 'Due to a Flash blocking measure imposed by these providers, you may need to manually allow Flash to be played on your PC. Once the setting has been updated, you will not be required to adjust this again unless the cache has been cleared.',
  },
  faqsTitle11SubTitle4Desc1: {
    'zh-CN': 'Chrome - 转到设置 > 显示高级设置 > 内容设置（隐私） > Flash。选择允许网站运行Flash，最后选择完成。Firefox - 转到菜单/附加组件，然后点击插件并确保"Flash Player"设置为"始终激活"。',
    'en-US': 'Chrome - Go to Settings > Show advanced settings > Content settings (Privacy) > Flash. Select Allow sites to run Flash and finally select Done. Firefox - Go to Menu / Add-ons, then click plugins and ensure that \"Flash Player\" is set to \"Always Activate\".',
  },
  faqsTitle11SubTitle4Desc2: {
    'zh-CN': '如果这些方法都不起作用，请通过搜索引擎检查。',
    'en-US': 'Please check via search engine if either of these methods does not work.',
  },
  faqsTitle11SubTitle5Desc0: {
    'zh-CN': '我们不被允许流式传输来自主办国的某些赛事或比赛。',
    'en-US': 'We are not permitted to stream certain events or matches from the host country.',
  },
  faqsTitle11SubTitle6Desc0: {
    'zh-CN': '在赔率页面上，有直播流的比赛用电视图标标识。在赛事进行中点击此图标将加载流。对于移动设备，您需要先进入您想观看的赛事，然后才能激活电视播放。',
    'en-US': 'On the odds page, matches with live steaming available are identified with a TV icon. Clicking on this icon while the event is In-Play will load the stream. For Mobile devices, you need to enter the event you wish to watch, before TV playback can be activated.',
  },
  faqsTitle11SubTitle7Desc0: {
    'zh-CN': '由于直播广播版权限制，此服务功能暂时仅对中国、菲律宾和越南的客户开放。',
    'en-US': 'Due to live broadcast copyright restrictions, this service function is temporarily only available to customers in China, the Philippines, and Vietnam.',
  },
  faqsTitle11SubTitle8Desc0: {
    'zh-CN': '您只能出于个人使用目的访问直播视频流。从我们这里流式传输的直播视频不得以任何方式复制或重现，除非获得公司的明确许可。',
    'en-US': 'You are only permitted to access live streaming video for your own personal use. Live video streamed from us must not be copied or reproduced in any way without the express permission of the company.',
  },
  faqsTitle11SubTitle9Desc0: {
    'zh-CN': '尝试访问其他互联网网站，确定问题是否仅限于我们的直播视频流。如果您无法使用任何其他互联网服务，请联系您的互联网服务提供商。如果我们的直播流是唯一受影响的网站，请联系我们的客户服务代表之一，他们将很乐意为您提供帮助。',
    'en-US': 'Try to access other internet sites and determine whether the problems are confined to our live video streaming. If you are unable to use any other internet services please contact your Internet Service Provider. If our Live Streaming is the only affected site, please contact one of our Customer Service Representatives, who will be happy to assist you.',
  },
  faqsTitle11SubTitle10Desc0: {
    'zh-CN': '每个赛事将在预定开始时间前2分钟开始流式传输。比赛必须在进行中赔率页面内处于活跃状态。',
    'en-US': 'Each event will begin streaming 2 minutes prior to the scheduled start time of the event / match. The match must be active within the In-Play odds page.',
  },
  faqsTitle11SubTitle11Desc0: {
    'zh-CN': '如果您的设备上运行着防火墙（安全硬件/软件）或任何其他相关安全软件，可能会影响您对网站的访问。您应该查阅制造商的手册/说明书或直接联系他们了解软件包/硬件配置。',
    'en-US': 'If you have a Firewall (security hardware / software) or any other related security software running on your device, it might have affected your access to the site. You should consult the manufacturer\'s manual /handbook or contact them directly regarding the package / hardware configuration.',
  },
  faqsTitle11SubTitle12Desc0: {
    'zh-CN': '我们建议您使用宽带或Wi-Fi，它们为我们的直播电视流播放提供更好的带宽和更优化的性能。',
    'en-US': 'We recommend that you use Broadband or Wi-Fi which offers better bandwidth and more optimized performance for playback of our Live TV streams.',
  },
  faqsTitle11SubTitle12Desc1: {
    'zh-CN': '4G和3G用户应该注意，使用直播电视可能会消耗您计划中允许的大量数据。此外，3G用户在流中可能会更频繁地遇到"缓冲"。请注意，当流中出现播放问题时，可能是由于赛事源的问题，您自己或本公司都无法修复。',
    'en-US': '4G and 3G users should be aware that using Live TV may consume a high amount of data allowed in your plan. Also, 3G users may encounter \"buffering\" more often within streams.Note that when playback issues occur within a stream, it may be due to an issue at the event source and not fixable by yourself or this company.',
  },
  faqsTitle11SubTitle13Desc0: {
    'zh-CN': '确保您的设备有声卡来播放音频，并且您的音频音量已调高。',
    'en-US': 'Make sure that your device has a sound card to play the audio and your audio volume is turned up.',
  },
  faqsTitle11SubTitle14Desc0: {
    'zh-CN': '访问Adobe网站检查您是否安装了最新版本的flash播放器。',
    'en-US': 'Go to Adobe\'s website to check if you have the latest flash player installed.',
  },
}
// 结构
const contentSections = [
  {
    id: 'faqsTitle1',
    titleKey: 'faqsTitle1',
    items: [
      { index: 0, key: 'faqsTitle1SubTitle1', items: [
        { key: 'faqsTitle1Desc1', items: [
          { key: 'faqsTitle1Desc1Item1' },
          { key: 'faqsTitle1Desc1Item2' },
          { key: 'faqsTitle1Desc1Item3' },
          { key: 'faqsTitle1Desc1Item4' },
        ] },
        { key: 'faqsTitle1Desc2', items: [
          { key: 'faqsTitle1Desc2Item0' },
          { key: 'faqsTitle1Desc2Item1' },
          { key: 'faqsTitle1Desc2Item2' },
          { key: 'faqsTitle1Desc2Item3' },
          { key: 'faqsTitle1Desc2Item4' },
          { key: 'faqsTitle1Desc2Item5' },
          { key: 'faqsTitle1Desc2Item6' },
          { key: 'faqsTitle1Desc2Item7' },
          { key: 'faqsTitle1Desc2Item8' },
          { key: 'faqsTitle1Desc2Item10' },
          { key: 'faqsTitle1Desc2Item11' },
        ] },
      ] },
      { index: 1, key: 'faqsTitle1SubTitle2', items: [
        { key: 'faqsTitle1SubTitle2Desc0', items: [
          { key: 'faqsTitle1SubTitle2Desc0Item0' },
          { key: 'faqsTitle1SubTitle2Desc0Item1' },
          { key: 'faqsTitle1SubTitle2Desc0Item2' },
          { key: 'faqsTitle1SubTitle2Desc0Item3' },
          { key: 'faqsTitle1SubTitle2Desc0Item4' },
          { key: 'faqsTitle1SubTitle2Desc0Item5' },
        ] },
        { key: 'faqsTitle1SubTitle2Desc1' },
      ] },
    ],
  },
  {
    id: 'faqsTitle2',
    titleKey: 'faqsTitle2',
    items: [
      { index: 3, key: 'faqsTitle2SubTitle0', items: [
        { key: 'faqsTitle2SubTitle0Desc0' },
      ] },
      { index: 4, key: 'faqsTitle2SubTitle1', items: [
        { key: 'faqsTitle2SubTitle1Desc0' },
      ] },
      { index: 5, key: 'faqsTitle2SubTitle2', items: [
        { key: 'faqsTitle2SubTitle2Desc0' },
      ] },
      { index: 6, key: 'faqsTitle2SubTitle3', items: [
        { key: 'faqsTitle2SubTitle3Desc0' },
        { key: 'faqsTitle2SubTitle3Desc1' },
        { key: 'faqsTitle2SubTitle3Desc2' },
        { key: 'faqsTitle2SubTitle3Desc3' },
      ] },
      { index: 7, key: 'faqsTitle2SubTitle4', items: [
        { key: 'faqsTitle2SubTitle4Desc0' },
      ] },
      { index: 8, key: 'faqsTitle2SubTitle5', items: [
        { key: 'faqsTitle2SubTitle5Desc0' },
      ] },
      { index: 10, key: 'faqsTitle2SubTitle7', items: [
        { key: 'faqsTitle2SubTitle7Desc0' },
      ] },
      { index: 12, key: 'faqsTitle2SubTitle9', items: [
        { key: 'faqsTitle2SubTitle9Desc0' },
      ] },
      { index: 13, key: 'faqsTitle2SubTitle10', items: [
        { key: 'faqsTitle2SubTitle10Desc0' },
      ] },
      { index: 14, key: 'faqsTitle2SubTitle11', items: [
        { key: 'faqsTitle2SubTitle11Desc0' },
        { key: 'faqsTitle2SubTitle11Desc1' },
      ] },
      { index: 15, key: 'faqsTitle2SubTitle12', items: [
        { key: 'faqsTitle2SubTitle12Desc0' },
      ] },
      { index: 16, key: 'faqsTitle2SubTitle13', items: [
        { key: 'faqsTitle2SubTitle13Desc0' },
      ] },
      { index: 17, key: 'faqsTitle2SubTitle14', items: [
        { key: 'faqsTitle2SubTitle14Desc0' },
        { key: 'faqsTitle2SubTitle14Desc1' },
        { key: 'faqsTitle2SubTitle14Desc2', items: [
          { key: 'faqsTitle2SubTitle14Desc2Item0' },
          { key: 'faqsTitle2SubTitle14Desc2Item1' },
          { key: 'faqsTitle2SubTitle14Desc2Item2' },
          { key: 'faqsTitle2SubTitle14Desc2Item3' },
          { key: 'faqsTitle2SubTitle14Desc2Item4' },
          { key: 'faqsTitle2SubTitle14Desc2Item5' },
          { key: 'faqsTitle2SubTitle14Desc2Item6' },
          { key: 'faqsTitle2SubTitle14Desc2Item7' },
          { key: 'faqsTitle2SubTitle14Desc2Item8' },
          { key: 'faqsTitle2SubTitle14Desc2Item9' },
          { key: 'faqsTitle2SubTitle14Desc2Item10' },
          { key: 'faqsTitle2SubTitle14Desc2Item11' },
        ] },
        { key: 'faqsTitle2SubTitle14Desc3' },
      ] },
      { index: 18, key: 'faqsTitle2SubTitle15', items: [
        { key: 'faqsTitle2SubTitle15Desc0' },
        { key: 'faqsTitle2SubTitle15Desc1' },
        { key: 'faqsTitle2SubTitle15Desc2' },
        { key: 'faqsTitle2SubTitle15Desc3' },
      ] },
      { index: 19, key: 'faqsTitle2SubTitle16', items: [
        { key: 'faqsTitle2SubTitle16Desc0' },
      ] },
    ],
  },
  {
    id: 'faqsTitle3',
    titleKey: 'faqsTitle3',
    items: [
      { index: 20, key: 'faqsTitle3SubTitle0', items: [
        { key: 'faqsTitle3SubTitle0Desc0' },
      ] },
      { index: 21, key: 'faqsTitle3SubTitle1', items: [
        { key: 'faqsTitle3SubTitle1Desc0' },
        { key: 'faqsTitle3SubTitle1Desc1' },
      ] },
      { index: 22, key: 'faqsTitle3SubTitle2', items: [
        { key: 'faqsTitle3SubTitle2Desc0', items: [
          { key: 'faqsTitle3SubTitle2Desc0Item0' },
          { key: 'faqsTitle3SubTitle2Desc0Item1' },
          { key: 'faqsTitle3SubTitle2Desc0Item2' },
          { key: 'faqsTitle3SubTitle2Desc0Item3' },
          { key: 'faqsTitle3SubTitle2Desc0Item4' },
          { key: 'faqsTitle3SubTitle2Desc0Item5' },
        ] },
        { key: 'faqsTitle3SubTitle2Desc1' },
      ] },
      { index: 23, key: 'faqsTitle3SubTitle3', items: [
        { key: 'faqsTitle3SubTitle3Desc0' },
        { key: 'faqsTitle3SubTitle3Desc1' },
      ] },
      { index: 25, key: 'faqsTitle3SubTitle5', items: [
        { key: 'faqsTitle1Desc1', items: [
          { key: 'faqsTitle1Desc1Item1' },
          { key: 'faqsTitle1Desc1Item2' },
          { key: 'faqsTitle1Desc1Item3' },
          { key: 'faqsTitle1Desc1Item4' },
        ] },
        { key: 'faqsTitle1Desc2', items: [
          { key: 'faqsTitle1Desc2Item0' },
          { key: 'faqsTitle1Desc2Item1' },
          { key: 'faqsTitle1Desc2Item2' },
          { key: 'faqsTitle1Desc2Item3' },
          { key: 'faqsTitle1Desc2Item4' },
          { key: 'faqsTitle1Desc2Item5' },
          { key: 'faqsTitle1Desc2Item6' },
          { key: 'faqsTitle1Desc2Item7' },
          { key: 'faqsTitle1Desc2Item8' },
          { key: 'faqsTitle1Desc2Item10' },
          { key: 'faqsTitle1Desc2Item11' },
        ] },
      ] },
      { index: 26, key: 'faqsTitle3SubTitle6', items: [
        { key: 'faqsTitle3SubTitle6Desc0' },
      ] },
      { index: 27, key: 'faqsTitle3SubTitle7', items: [
        { key: 'faqsTitle3SubTitle7Desc0' },
      ] },
      { index: 28, key: 'faqsTitle3SubTitle8', items: [
        { key: 'faqsTitle3SubTitle8Desc0' },
      ] },
      { index: 29, key: 'faqsTitle3SubTitle9', items: [
        { key: 'faqsTitle3SubTitle9Desc0' },
      ] },
      { index: 30, key: 'faqsTitle3SubTitle10', items: [
        { key: 'faqsTitle3SubTitle10Desc0' },
      ] },
      { index: 31, key: 'faqsTitle3SubTitle11', items: [
        { key: 'faqsTitle3SubTitle11Desc0' },
      ] },
      { index: 32, key: 'faqsTitle3SubTitle12', items: [
        { key: 'faqsTitle3SubTitle12Desc0' },
        { key: 'faqsTitle3SubTitle12Desc1' },
      ] },
      { index: 33, key: 'faqsTitle3SubTitle13', items: [
        { key: 'faqsTitle3SubTitle13Desc0' },
        { key: 'faqsTitle3SubTitle13Desc1' },
      ] },
      { index: 34, key: 'faqsTitle3SubTitle14', items: [
        { key: 'faqsTitle3SubTitle14Desc0' },
        { key: 'faqsTitle3SubTitle14Desc1', items: [
          { key: 'faqsTitle3SubTitle14Desc1Item0' },
          { key: 'faqsTitle3SubTitle14Desc1Item1' },
          { key: 'faqsTitle3SubTitle14Desc1Item2' },
        ] },
        { key: 'faqsTitle3SubTitle14Desc2' },
      ] },
      { index: 35, key: 'faqsTitle3SubTitle15', items: [
        { key: 'faqsTitle3SubTitle15Desc0' },
        { key: 'faqsTitle3SubTitle15Desc1', items: [
          { key: 'faqsTitle3SubTitle15Desc1Item0' },
          { key: 'faqsTitle3SubTitle15Desc1Item1' },
        ] },
        { key: 'faqsTitle3SubTitle15Desc2' },
        { key: 'faqsTitle3SubTitle15Desc3' },
      ] },
      { index: 36, key: 'faqsTitle3SubTitle16', items: [
        { key: 'faqsTitle3SubTitle16Desc0' },
        { key: 'faqsTitle3SubTitle16Desc1' },
      ] },
      { index: 37, key: 'faqsTitle3SubTitle17', items: [
        { key: 'faqsTitle3SubTitle17Desc0', items: [
          { key: 'faqsTitle3SubTitle17Desc0Item0' },
          { key: 'faqsTitle3SubTitle17Desc0Item1' },
          { key: 'faqsTitle3SubTitle17Desc0Item2' },
          { key: 'faqsTitle3SubTitle17Desc0Item3' },
          { key: 'faqsTitle3SubTitle17Desc0Item4' },
        ] },
      ] },
      { index: 38, key: 'faqsTitle3SubTitle18', items: [
        { key: 'faqsTitle3SubTitle18Desc0', items: [
          { key: 'faqsTitle3SubTitle18Desc0Item0' },
          { key: 'faqsTitle3SubTitle18Desc0Item1' },
          { key: 'faqsTitle3SubTitle18Desc0Item2' },
          { key: 'faqsTitle3SubTitle18Desc0Item3' },
        ] },
      ] },
      { index: 39, key: 'faqsTitle3SubTitle19', items: [
        { key: 'faqsTitle3SubTitle19Desc0' },
      ] },
      { index: 40, key: 'faqsTitle3SubTitle20', items: [
        { key: 'faqsTitle3SubTitle20Desc0', items: [
          { key: 'faqsTitle3SubTitle20Desc0Item1' },
          { key: 'faqsTitle3SubTitle20Desc0Item2' },
          { key: 'faqsTitle3SubTitle20Desc0Item3' },
        ] },
      ] },
    ],
  },
  {
    id: 'faqsTitle4',
    titleKey: 'faqsTitle4',
    items: [
      { index: 41, key: 'faqsTitle4SubTitle0', items: [
        { key: 'faqsTitle4SubTitle0Desc0' },
      ] },
      /* { index: 42, key: 'faqsTitle4SubTitle1', items: [
        { key: 'faqsTitle4SubTitle1Desc0' },
      ] }, */
      { index: 43, key: 'faqsTitle4SubTitle2', items: [
        { key: 'faqsTitle4SubTitle2Desc0' },
      ] },
      { index: 44, key: 'faqsTitle4SubTitle3', items: [
        { key: 'faqsTitle4SubTitle3Desc0' },
      ] },
      { index: 45, key: 'faqsTitle4SubTitle4', items: [
        { key: 'faqsTitle4SubTitle4Desc0' },
      ] },
      { index: 46, key: 'faqsTitle4SubTitle5', items: [
        { key: 'faqsTitle4SubTitle5Desc0' },
      ] },
      { index: 47, key: 'faqsTitle4SubTitle6', items: [
        { key: 'faqsTitle4SubTitle6Desc0' },
      ] },
      { index: 48, key: 'faqsTitle4SubTitle7', items: [
        { key: 'faqsTitle4SubTitle7Desc0' },
        { key: 'faqsTitle4SubTitle7Desc1' },
      ] },
      { index: 49, key: 'faqsTitle4SubTitle8', items: [
        { key: 'faqsTitle4SubTitle8Desc0' },
      ] },
      { index: 50, key: 'faqsTitle4SubTitle9', items: [
        { key: 'faqsTitle4SubTitle9Desc0' },
      ] },
      { index: 51, key: 'faqsTitle4SubTitle10', items: [
        { key: 'faqsTitle4SubTitle10Desc0', items: [
          { key: 'faqsTitle4SubTitle10Desc0Item0' },
          { key: 'faqsTitle4SubTitle10Desc0Item1' },
          { key: 'faqsTitle4SubTitle10Desc0Item2' },
          { key: 'faqsTitle4SubTitle10Desc0Item3' },
        ] },
        { key: 'faqsTitle4SubTitle10Desc1', items: [
          { key: 'faqsTitle4SubTitle10Desc1Item0' },
        ] },
      ] },
      { index: 52, key: 'faqsTitle4SubTitle11', items: [
        { key: 'faqsTitle4SubTitle11Desc0' },
        { key: 'faqsTitle4SubTitle11Desc1' },
      ] },
      { index: 53, key: 'faqsTitle4SubTitle12', items: [
        { key: 'faqsTitle4SubTitle12Desc0' },
      ] },
      { index: 54, key: 'faqsTitle4SubTitle13', items: [
        { key: 'faqsTitle4SubTitle13Desc0' },
      ] },
      { index: 55, key: 'faqsTitle4SubTitle14', items: [
        { key: 'faqsTitle4SubTitle14Desc0' },
      ] },
      { index: 56, key: 'faqsTitle4SubTitle15', items: [
        { key: 'faqsTitle4SubTitle15Desc0' },
      ] },
    ],
  },
  {
    id: 'faqsTitle5',
    titleKey: 'faqsTitle5',
    items: [
      { index: 58, key: 'faqsTitle5SubTitle0', items: [
        { key: 'faqsTitle5SubTitle0Desc0' },
        { key: 'faqsTitle5SubTitle0Desc1' },
      ] },
      { index: 59, key: 'faqsTitle5SubTitle1', items: [
        { key: 'faqsTitle5SubTitle1Desc0' },
        { key: 'faqsTitle5SubTitle1Desc1' },
        { key: 'faqsTitle5SubTitle1Desc2' },
        { key: 'faqsTitle5SubTitle1Desc3' },
        { key: 'faqsTitle5SubTitle1Desc4' },
      ] },
      { index: 60, key: 'faqsTitle5SubTitle2', items: [
        { key: 'faqsTitle5SubTitle2Desc0' },
        { key: 'faqsTitle5SubTitle2Desc1' },
        { key: 'faqsTitle5SubTitle2Desc2' },
        { key: 'faqsTitle5SubTitle2Desc3' },
        { key: 'faqsTitle5SubTitle2Desc4' },
        { key: 'faqsTitle5SubTitle2Desc5' },
      ] },
      { index: 61, key: 'faqsTitle5SubTitle3', items: [
        { key: 'faqsTitle5SubTitle3Desc0' },
      ] },
      { index: 62, key: 'faqsTitle5SubTitle4', items: [
        { key: 'faqsTitle5SubTitle4Desc0' },
      ] },
      { index: 63, key: 'faqsTitle5SubTitle5', items: [
        { key: 'faqsTitle5SubTitle5Desc0' },
        { key: 'faqsTitle5SubTitle5Desc1' },
        { key: 'faqsTitle5SubTitle5Desc2' },
        { key: 'faqsTitle5SubTitle5Desc3' },
        { key: 'faqsTitle5SubTitle5Desc4' },
        { key: 'faqsTitle5SubTitle5Desc5' },
        { key: 'faqsTitle5SubTitle5Desc6' },
        { key: 'faqsTitle5SubTitle5Desc7' },
        { key: 'faqsTitle5SubTitle5Desc8' },
        { key: 'faqsTitle5SubTitle5Desc9' },
        { key: 'faqsTitle5SubTitle5Desc10' },
        { key: 'faqsTitle5SubTitle5Desc11' },
        { key: 'faqsTitle5SubTitle5Desc12' },
        { key: 'faqsTitle5SubTitle5Desc13' },
      ] },
      { index: 64, key: 'faqsTitle5SubTitle6', items: [
        { key: 'faqsTitle5SubTitle6Desc0' },
        { key: 'faqsTitle5SubTitle6Desc1' },
        { key: 'faqsTitle5SubTitle6Desc2' },
        { key: 'faqsTitle5SubTitle6Desc3' },
        { key: 'faqsTitle5SubTitle6Desc4' },
        { key: 'faqsTitle5SubTitle6Desc5' },
        { key: 'faqsTitle5SubTitle6Desc6' },
        { key: 'faqsTitle5SubTitle6Desc7' },
        { key: 'faqsTitle5SubTitle6Desc8' },
        { key: 'faqsTitle5SubTitle6Desc9' },
        { key: 'faqsTitle5SubTitle6Desc10' },
        { key: 'faqsTitle5SubTitle6Desc11' },
        { key: 'faqsTitle5SubTitle6Desc12' },
        { key: 'faqsTitle5SubTitle6Desc13' },
        { key: 'faqsTitle5SubTitle6Desc14' },
        { key: 'faqsTitle5SubTitle6Desc15' },
        { key: 'faqsTitle5SubTitle6Desc16' },
      ] },
      { index: 65, key: 'faqsTitle5SubTitle7', items: [
        { key: 'faqsTitle5SubTitle7Desc0' },
        { key: 'faqsTitle5SubTitle7Desc1' },
      ] },
      { index: 66, key: 'faqsTitle5SubTitle8', items: [
        { key: 'faqsTitle5SubTitle8Desc0' },
      ] },
    ],
  },
  {
    id: 'faqsTitle6',
    titleKey: 'faqsTitle6',
    items: [
      { index: 68, key: 'faqsTitle6SubTitle0', items: [
        { key: 'faqsTitle6SubTitle0Desc0' },
      ] },
      { index: 69, key: 'faqsTitle6SubTitle1', items: [
        { key: 'faqsTitle6SubTitle1Desc0' },
      ] },
      { index: 70, key: 'faqsTitle6SubTitle2', items: [
        { key: 'faqsTitle6SubTitle2Desc0' },
      ] },
      { index: 71, key: 'faqsTitle6SubTitle3', items: [
        { key: 'faqsTitle6SubTitle3Desc0' },
      ] },
      { index: 72, key: 'faqsTitle6SubTitle4', items: [
        { key: 'faqsTitle6SubTitle4Desc0' },
      ] },
      { index: 73, key: 'faqsTitle6SubTitle5', items: [
        { key: 'faqsTitle6SubTitle5Desc0' },
      ] },
      { index: 74, key: 'faqsTitle6SubTitle6', items: [
        { key: 'faqsTitle6SubTitle6Desc0' },
      ] },
      { index: 75, key: 'faqsTitle6SubTitle7', items: [
        { key: 'faqsTitle6SubTitle7Desc0' },
      ] },
      { index: 76, key: 'faqsTitle6SubTitle8', items: [
        { key: 'faqsTitle6SubTitle8Desc0' },
        { key: 'faqsTitle6SubTitle8Desc1' },
        { key: 'faqsTitle6SubTitle8Desc2' },
        { key: 'faqsTitle6SubTitle8Desc3' },
        { key: 'faqsTitle6SubTitle8Desc4' },
        { key: 'faqsTitle6SubTitle8Desc5' },
        { key: 'faqsTitle6SubTitle8Desc6' },
      ] },
      { index: 77, key: 'faqsTitle6SubTitle9', items: [
        { key: 'faqsTitle6SubTitle9Desc0' },
        { key: 'faqsTitle6SubTitle9Desc1' },
      ] },
      { index: 78, key: 'faqsTitle6SubTitle10', items: [
        { key: 'faqsTitle6SubTitle10Desc0' },
      ] },
      { index: 79, key: 'faqsTitle6SubTitle11', items: [
        { key: 'faqsTitle6SubTitle11Desc0' },
      ] },
      { index: 80, key: 'faqsTitle6SubTitle12', items: [
        { key: 'faqsTitle6SubTitle12Desc0' },
      ] },
      /* { index: 81, key: 'faqsTitle6SubTitle13', items: [
        { key: 'faqsTitle6SubTitle13Desc0' },
        { key: 'faqsTitle6SubTitle13Desc1' },
      ] }, */
      { index: 82, key: 'faqsTitle6SubTitle14', items: [
        { key: 'faqsTitle6SubTitle14Desc0' },
      ] },
      { index: 83, key: 'faqsTitle6SubTitle15', items: [
        { key: 'faqsTitle6SubTitle15Desc0' },
      ] },
      { index: 84, key: 'faqsTitle6SubTitle16', items: [
        { key: 'faqsTitle6SubTitle16Desc0' },
      ] },
      { index: 85, key: 'faqsTitle6SubTitle17', items: [
        { key: 'faqsTitle6SubTitle17Desc0' },
      ] },
      { index: 86, key: 'faqsTitle6SubTitle18', items: [
        { key: 'faqsTitle6SubTitle18Desc0' },
      ] },
      { index: 87, key: 'faqsTitle6SubTitle19', items: [
        { key: 'faqsTitle6SubTitle19Desc0' },
      ] },
      { index: 89, key: 'faqsTitle6SubTitle21', items: [
        { key: 'faqsTitle6SubTitle21Desc0' },
        { key: 'faqsTitle6SubTitle21Desc1' },
        { key: 'faqsTitle6SubTitle21Desc2' },
        { key: 'faqsTitle6SubTitle21Desc3' },
      ] },
      { index: 90, key: 'faqsTitle6SubTitle22', items: [
        { key: 'faqsTitle6SubTitle22Desc0' },
        { key: 'faqsTitle6SubTitle22Desc1' },
        { key: 'faqsTitle6SubTitle22Desc2' },
        { key: 'faqsTitle6SubTitle22Desc3' },
      ] },
    ],
  },
  {
    id: 'faqsTitle7',
    titleKey: 'faqsTitle7',
    items: [
      { index: 91, key: 'faqsTitle7SubTitle0', items: [
        { key: 'faqsTitle7SubTitle0Desc0' },
      ] },
      { index: 92, key: 'faqsTitle7SubTitle1', items: [
        { key: 'faqsTitle7SubTitle1Desc0' },
        { key: 'faqsTitle7SubTitle1Desc1' },
        { key: 'faqsTitle7SubTitle1Desc2' },
        { key: 'faqsTitle7SubTitle1Desc3' },
        { key: 'faqsTitle7SubTitle1Desc4' },
        { key: 'faqsTitle7SubTitle1Desc5' },
        { key: 'faqsTitle7SubTitle1Desc6' },
        { key: 'faqsTitle7SubTitle1Desc7' },
        { key: 'faqsTitle7SubTitle1Desc8' },
        { key: 'faqsTitle7SubTitle1Desc9' },
        { key: 'faqsTitle7SubTitle1Desc10' },
        { key: 'faqsTitle7SubTitle1Desc11' },
        { key: 'faqsTitle7SubTitle1Desc12' },
        { key: 'faqsTitle7SubTitle1Desc13' },
        { key: 'faqsTitle7SubTitle1Desc14' },
        { key: 'faqsTitle7SubTitle1Desc15' },
        { key: 'faqsTitle7SubTitle1Desc16' },
        { key: 'faqsTitle7SubTitle1Desc17' },
        { key: 'faqsTitle7SubTitle1Desc18' },
        { key: 'faqsTitle7SubTitle1Desc19' },
        { key: 'faqsTitle7SubTitle1Desc20' },
        { key: 'faqsTitle7SubTitle1Desc21' },
      ] },
      { index: 93, key: 'faqsTitle7SubTitle2', items: [
        { key: 'faqsTitle7SubTitle2Desc0' },
      ] },
      { index: 94, key: 'faqsTitle7SubTitle3', items: [
        { key: 'faqsTitle7SubTitle3Desc0' },
      ] },
      { index: 95, key: 'faqsTitle7SubTitle4', items: [
        { key: 'faqsTitle7SubTitle4Desc0' },
      ] },
      { index: 96, key: 'faqsTitle7SubTitle5', items: [
        { key: 'faqsTitle7SubTitle5Desc0' },
        { key: 'faqsTitle7SubTitle5Desc1' },
        { key: 'faqsTitle7SubTitle5Desc2' },
      ] },
      { index: 97, key: 'faqsTitle7SubTitle6', items: [
        { key: 'faqsTitle7SubTitle6Desc0' },
        { key: 'faqsTitle7SubTitle6Desc1' },
        { key: 'faqsTitle7SubTitle6Desc2' },
        { key: 'faqsTitle7SubTitle6Desc3' },
      ] },
      { index: 98, key: 'faqsTitle7SubTitle7', items: [
        { key: 'faqsTitle7SubTitle7Desc0' },
      ] },
      { index: 99, key: 'faqsTitle7SubTitle8', items: [
        { key: 'faqsTitle7SubTitle8Desc0' },
      ] },
      { index: 100, key: 'faqsTitle7SubTitle9', items: [
        { key: 'faqsTitle7SubTitle9Desc0' },
        { key: 'faqsTitle7SubTitle9Desc1' },
      ] },
      { index: 101, key: 'faqsTitle7SubTitle10', items: [
        { key: 'faqsTitle7SubTitle10Desc0' },
      ] },
    ],
  },
  {
    id: 'faqsTitle8',
    titleKey: 'faqsTitle8',
    items: [
      { index: 102, key: 'faqsTitle8SubTitle0', items: [
        { key: 'faqsTitle8SubTitle0Desc0' },
        { key: 'faqsTitle8SubTitle0Desc1' },
        { key: 'faqsTitle8SubTitle0Desc2' },
      ] },
      { index: 103, key: 'faqsTitle8SubTitle1', items: [
        { key: 'faqsTitle8SubTitle1Desc0' },
        { key: 'faqsTitle8SubTitle1Desc1' },
        { key: 'faqsTitle8SubTitle1Desc2' },
        { key: 'faqsTitle8SubTitle1Desc3' },
        { key: 'faqsTitle8SubTitle1Desc4' },
      ] },
      { index: 104, key: 'faqsTitle8SubTitle2', items: [
        { key: 'faqsTitle8SubTitle2Desc0' },
      ] },
      { index: 105, key: 'faqsTitle8SubTitle3', items: [
        { key: 'faqsTitle8SubTitle3Desc0' },
        { key: 'faqsTitle8SubTitle3Desc1' },
        { key: 'faqsTitle8SubTitle3Desc2' },
        { key: 'faqsTitle8SubTitle3Desc3' },
        { key: 'faqsTitle8SubTitle3Desc4' },
        { key: 'faqsTitle8SubTitle3Desc5' },
      ] },
    ],
  },
  {
    id: 'faqsTitle9',
    titleKey: 'faqsTitle9',
    items: [
      { index: 106, key: 'faqsTitle9SubTitle0', items: [
        { key: 'faqsTitle9SubTitle0Desc0' },
        { key: 'faqsTitle9SubTitle0Desc1' },
        { key: 'faqsTitle9SubTitle0Desc2' },
        { key: 'faqsTitle9SubTitle0Desc3' },
        { key: 'faqsTitle9SubTitle0Desc4' },
      ] },
      { index: 107, key: 'faqsTitle9SubTitle1', items: [
        { key: 'faqsTitle9SubTitle1Desc0' },
        { key: 'faqsTitle9SubTitle1Desc1' },
      ] },
    ],
  },
  {
    id: 'faqsTitle10',
    titleKey: 'faqsTitle10',
    items: [
      { index: 108, key: 'faqsTitle10SubTitle0', items: [
        { key: 'faqsTitle10SubTitle0Desc0' },
      ] },
      { index: 109, key: 'faqsTitle10SubTitle1', items: [
        { key: 'faqsTitle10SubTitle1Desc0' },
      ] },
      { index: 110, key: 'faqsTitle10SubTitle2', items: [
        { key: 'faqsTitle10SubTitle2Desc0' },
      ] },
      { index: 111, key: 'faqsTitle10SubTitle3', items: [
        { key: 'faqsTitle10SubTitle3Desc0' },
        { key: 'faqsTitle10SubTitle3Desc1' },
      ] },
      { index: 112, key: 'faqsTitle10SubTitle4', items: [
        { key: 'faqsTitle10SubTitle4Desc0' },
      ] },
      { index: 113, key: 'faqsTitle10SubTitle5', items: [
        { key: 'faqsTitle10SubTitle5Desc0' },
        { key: 'faqsTitle10SubTitle5Desc1' },
      ] },
      { index: 114, key: 'faqsTitle10SubTitle6', items: [
        { key: 'faqsTitle10SubTitle6Desc0' },
        { key: 'faqsTitle10SubTitle6Desc1' },
        { key: 'faqsTitle10SubTitle6Desc2' },
      ] },
      { index: 115, key: 'faqsTitle10SubTitle7', items: [
        { key: 'faqsTitle10SubTitle7Desc0' },
      ] },
      { index: 116, key: 'faqsTitle10SubTitle8', items: [
        { key: 'faqsTitle10SubTitle8Desc0' },
      ] },
      { index: 117, key: 'faqsTitle10SubTitle9', items: [
        { key: 'faqsTitle10SubTitle9Desc0' },
      ] },
      { index: 118, key: 'faqsTitle10SubTitle10', items: [
        { key: 'faqsTitle10SubTitle10Desc0' },
      ] },
      { index: 119, key: 'faqsTitle10SubTitle11', items: [
        { key: 'faqsTitle10SubTitle11Desc0' },
      ] },
      { index: 120, key: 'faqsTitle10SubTitle12', items: [
        { key: 'faqsTitle10SubTitle12Desc0' },
      ] },
      { index: 121, key: 'faqsTitle10SubTitle13', items: [
        { key: 'faqsTitle10SubTitle13Desc0' },
      ] },
      { index: 122, key: 'faqsTitle10SubTitle14', items: [
        { key: 'faqsTitle10SubTitle14Desc0' },
      ] },
      { index: 123, key: 'faqsTitle10SubTitle15', items: [
        { key: 'faqsTitle10SubTitle15Desc0' },
      ] },
      { index: 124, key: 'faqsTitle10SubTitle16', items: [
        { key: 'faqsTitle10SubTitle16Desc0' },
      ] },
    ],
  },
  /* {
    id: 'faqsTitle11',
    titleKey: 'faqsTitle11',
    items: [
      { index: 125, key: 'faqsTitle11SubTitle0', items: [
        { key: 'faqsTitle11SubTitle0Desc0' },
      ] },
      { index: 126, key: 'faqsTitle11SubTitle1', items: [
        { key: 'faqsTitle11SubTitle1Desc0' },
      ] },
      { index: 127, key: 'faqsTitle11SubTitle2', items: [
        { key: 'faqsTitle11SubTitle2Desc0' },
      ] },
      { index: 128, key: 'faqsTitle11SubTitle3', items: [
        { key: 'faqsTitle11SubTitle3Desc0' },
        { key: 'faqsTitle11SubTitle3Desc1' },
        { key: 'faqsTitle11SubTitle3Desc2' },
        { key: 'faqsTitle11SubTitle3Desc3' },
      ] },
      { index: 129, key: 'faqsTitle11SubTitle4', items: [
        { key: 'faqsTitle11SubTitle4Desc0' },
        { key: 'faqsTitle11SubTitle4Desc1' },
        { key: 'faqsTitle11SubTitle4Desc2' },
      ] },
      { index: 130, key: 'faqsTitle11SubTitle5', items: [
        { key: 'faqsTitle11SubTitle5Desc0' },
      ] },
      { index: 131, key: 'faqsTitle11SubTitle6', items: [
        { key: 'faqsTitle11SubTitle6Desc0' },
      ] },
      { index: 132, key: 'faqsTitle11SubTitle7', items: [
        { key: 'faqsTitle11SubTitle7Desc0' },
      ] },
      { index: 133, key: 'faqsTitle11SubTitle8', items: [
        { key: 'faqsTitle11SubTitle8Desc0' },
      ] },
      { index: 134, key: 'faqsTitle11SubTitle9', items: [
        { key: 'faqsTitle11SubTitle9Desc0' },
      ] },
      { index: 135, key: 'faqsTitle11SubTitle10', items: [
        { key: 'faqsTitle11SubTitle10Desc0' },
      ] },
      { index: 136, key: 'faqsTitle11SubTitle11', items: [
        { key: 'faqsTitle11SubTitle11Desc0' },
      ] },
      { index: 137, key: 'faqsTitle11SubTitle12', items: [
        { key: 'faqsTitle11SubTitle12Desc0' },
        { key: 'faqsTitle11SubTitle12Desc1' },
      ] },
      { index: 138, key: 'faqsTitle11SubTitle13', items: [
        { key: 'faqsTitle11SubTitle13Desc0' },
      ] },
      { index: 139, key: 'faqsTitle11SubTitle14', items: [
        { key: 'faqsTitle11SubTitle14Desc0' },
      ] },
    ],
  }, */
]
// 5个FAQ的展开状态
const openList = ref([false, false, false, false, false])
function toggle(idx: number) {
  openList.value[idx] = !openList.value[idx]
}
// 获取当前语言
const currentLanguage = ref(getLang())
// 获取文本的方法
function getText(key: string): string {
  const textMap = i18nMap[key]
  if (!textMap) {
    console.warn(`Translation key "${key}" not found`)
    return key
  }

  return textMap[currentLanguage.value] || textMap['en-US'] || key
}

onMounted(() => {
  setTitle(t('常见问题'))
})
</script>

<template>
  <!-- faqs-parent -->
  <div v-for="(section, index) in contentSections" :key="section.id" class="parent leading-[1.15]" :class="section.id === 'faqsTitle1' ? '' : 'mt-[8px]'">
    <div>
      <!-- faqs-title -->
      <div class="faqs-title-text" :class="[index === 0 && 'mt-0!']">
        {{ getText(section.titleKey) }}
      </div>
      <!-- faqs-content -->
      <div>
        <!-- FAQ -->
        <div v-for="item in section.items" :key="item.key">
          <AfunBaseCell class="mb-[8px]" @click="toggle(item.index)">
            <template #title>
              <span class="font-[500]">{{ getText(item.key) }}</span>
            </template>
            <template #right>
              <div class="faqs-item-content">
                <AfunBaseArrow :direction="openList[item.index] ? 'top' : 'bottom'" />
              </div>
            </template>
            <div>
              <div v-if="openList[item.index]" class="divider1" />
              <div v-show="openList[item.index]">
                <div v-for="subItem in item.items" :key="subItem.key">
                  <div class="item-answer">
                    <span class="title-text">{{ getText(subItem.key) }}</span>
                  </div>
                  <div v-if="subItem.items">
                    <div v-for="subSubItem in subItem.items" :key="subSubItem.key">
                      <div class="faqs-item-detail">
                        <div class="item-circle-parent-layout">
                          <div class="item-circle" />
                        </div><span class="item-detail">{{ getText(subSubItem.key) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AfunBaseCell>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.parent {
  position: relative;
  border-radius: 4px;
}
.faqs-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 52px;
  padding: 8px 12px;
  gap: 6px;
  .title-indicator {
    position: relative;
    display: block;
    content-visibility: auto;
    width: 2px;
    height: 18px;
    aspect-ratio: 0.222222 / 1;
    background: #24ee89;
    border-radius: 5px;
  }
}
.faqs-title-icon {
  position: relative;
  display: block;
  content-visibility: auto;
  width: 4px;
  height: 18px;
  aspect-ratio: 0.222222 / 1;
}
.faqs-title-text {
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  margin-bottom: 8px;
  margin-top: 16px;
}
.faqs-item {
  font-weight: 400;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 52px;
  padding: 8px 12px;
  cursor: pointer;
}
.faqs-item-title {
  flex: 1;
  color: #b1bad3;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
}
.faqs-item-title-active {
  flex: 1;
  color: #fff;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
}
.faqs-item-content-icon {
  position: relative;
  display: block;
  content-visibility: auto;
  width: 12px;
  height: 12px;
  aspect-ratio: 1 / 1;
}
.item-answer {
  padding: 6px 12px;
  font-size: 14px;
  color: #fff;
  line-height: 24px;
}
.item-detail {
  padding-left: 5px;
  font-size: 12px;
  line-height: 1.5;
  flex: 1;
  color: #b1bad3;
}

.faqs-item-detail {
  display: flex;
  flex-direction: row;
  padding: 2px 20px;
  line-height: 15px;
}
.item-circle-parent-layout {
  height: 18px;
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
.divider1 {
  height: 1px;
  background-color: #2f4553;
  width: calc(100% - 24px);
  margin: 1px auto;
}
</style>
