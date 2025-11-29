<script setup lang='ts'>
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'PrivacyPolicy' })

const { t } = useI18n()
const setTitle = inject('setTitle', (v: string) => { })
const { VITE_OFFICIAL_NAME } = getEnv()
// 使用语言store

//  映射对象
const i18nMap: any = {
  policyStatement: {
    'zh-CN': '政策声明',
    'en-US': 'Policy Statement',
  },
  policyStatementDesc1: {
    'zh-CN': `${VITE_OFFICIAL_NAME}非常重视您的隐私和与您个人数据相关的任何信息的安全。本政策将描述我们如何保护您提供的信息以及涉及的步骤。它还解释了我们在何处以及如何收集您的个人信息，以及您对我们根据2012年数据隐私法指南持有的任何个人信息的权利。`,
    'en-US': `${VITE_OFFICIAL_NAME} takes your privacy and the security of any information related to your personal data very seriously. This policy will describe how we protect the information you provide and the steps involved. It also explains how and where we collect your personal information and your rights with respect to any personal information we hold under our guidelines under the Data Privacy Act 2012.`,
  },
  policyStatementDesc2: {
    'zh-CN': '其他国家可能拥有与菲律宾不同的隐私保护法律。我们正在不断努力调整我们的政策，以实现私人数据安全和保护的最佳实践。相反，我们不保证我们的隐私政策和做法符合外国司法管辖区的要求。',
    'en-US': 'Other countries may have different privacy protection laws than the Philippines. We are constantly working to adjust our policies to achieve best practices in the security and protection of private data. Conversely, we do not guarantee that our privacy policies and practices comply with the requirements of foreign jurisdictions.',
  },
  policyStatementDesc3: {
    'zh-CN': '有关您个人信息的更多信息或您在我们的隐私政策中拥有的任何权利声明，请联系我们：',
    'en-US': 'For more information about your personal information or any statement of rights you have in our Privacy Policy, please contact us at ',
  },
  scopeAndCommitment: {
    'zh-CN': '范围和承诺',
    'en-US': 'Scope and Commitment',
  },
  scopeAndCommitmentDesc1: {
    'zh-CN': '隐私声明和我们的数据隐私政策适用于所有个人信息，无论是物理的还是数字的，手动或自动处理。当您使用公司提供的服务或登录注册时，您已接受我们的隐私声明并同意我们根据这些条款收集、使用、披露、保留和保护您的个人信息。',
    'en-US': 'The Privacy Statement and our Data Privacy Policy apply to all personal information, whether physical or digital, processed manually or automatically. When you use the services provided by the company or log in to register, you have accepted our privacy statement and agreed to our collection, use, disclosure, retention and protection of your personal information in accordance with these terms.',
  },
  scopeAndCommitmentDesc2: {
    'zh-CN': '如果您代表他人提交任何个人信息或敏感个人信息，您必须声明您有权提供此类信息并允许我们根据本隐私政策使用所述个人信息。如果您不希望提供个人信息供我们使用，公司可能无法提供或告知您所要求的产品和服务。',
    'en-US': 'If you submit any personal information or sensitive personal information on behalf of others, you must declare that you have the right to provide such information and allow us to use said personal information in accordance with this Privacy Policy. If you do not wish to provide personal information for us to use, the company may not be able to provide or inform you of the requested products and services.',
  },
  scopeAndCommitmentDesc3: {
    'zh-CN': `请注意，${VITE_OFFICIAL_NAME}的服务不适用于或反对：`,
    'en-US': `Please note that ${VITE_OFFICIAL_NAME}'s services are not intended for or against:`,
  },
  scopeAndCommitmentDesc4: {
    'zh-CN': '• 21岁以下的受试者。',
    'en-US': '• Subjects under the age of 21.',
  },
  scopeAndCommitmentDesc5: {
    'zh-CN': `• 在菲律宾政府、PAGCOR、${VITE_OFFICIAL_NAME}、执法部门或军队服役的任何人（包括直系亲属）。`,
    'en-US': `• Anyone (including immediate family members) serving in the Philippine government, PAGCOR, ${VITE_OFFICIAL_NAME}, law enforcement, or military personnel.`,
  },
  yourRightsAndPreferences: {
    'zh-CN': '您的权利和偏好',
    'en-US': 'Your Rights & Preferences',
  },
  yourRightsAndPreferencesDesc1: {
    'zh-CN': '根据数据隐私法，您拥有以下权利，公司有义务保护：',
    'en-US': 'Under the Data Privacy Act, you have the following rights the company is obligated to protect:',
  },
  yourRightsAndPreferencesDesc2: {
    'zh-CN': '(a) 您有权被告知与您相关的个人信息是否正在或已经被处理',
    'en-US': '(a) Your rights to be informed whether personal information pertaining to you, are being or have been processed',
  },
  yourRightsAndPreferencesDesc3: {
    'zh-CN': '(b) 您有权在您的个人信息进入个人信息控制者的处理系统之前，或在下一个实际机会时，获得以下信息：',
    'en-US': '(b) Your rights to be furnished the information indicated below before the entry of your personal information into the processing system of the personal information controller, or at the next practical opportunity:',
  },
  yourRightsAndPreferencesDesc4: {
    'zh-CN': '• 将要输入系统的个人信息的描述',
    'en-US': '• Description of the personal information to be entered into the system',
  },
  yourRightsAndPreferencesDesc5: {
    'zh-CN': '• 正在或将要处理的目的',
    'en-US': '• Purposes for which they are being or are to be processed',
  },
  yourRightsAndPreferencesDesc6: {
    'zh-CN': '• 个人信息处理的范围和方法',
    'en-US': '• Scope and method of the personal information processing',
  },
  yourRightsAndPreferencesDesc7: {
    'zh-CN': '• 向其披露或可能披露的接收者或接收者类别',
    'en-US': '• The recipients or classes of recipients to whom they are or may be disclosed',
  },
  yourRightsAndPreferencesDesc8: {
    'zh-CN': '• 如果数据主体允许，用于自动访问的方法，以及此类访问被授权的程度',
    'en-US': '• Methods utilized for automated access, if the same is allowed by the data subject, and the extent to which such access is authorized',
  },
  yourRightsAndPreferencesDesc9: {
    'zh-CN': '• 个人信息控制者或其代表的身份和联系详情',
    'en-US': '• The identity and contact details of the personal information controller or its representative',
  },
  yourRightsAndPreferencesDesc10: {
    'zh-CN': '• 信息将被存储的期限；以及',
    'en-US': '• The period for which the information will be stored; and',
  },
  yourRightsAndPreferencesDesc11: {
    'zh-CN': '• 您权利的存在，即访问、更正的权利，以及向国家隐私委员会(NPC)提出投诉的权利。',
    'en-US': '• The existence of your rights, i.e., to access, correction, as well as the right to lodge a complaint before the National Privacy Commission (NPC).',
  },
  yourRightsAndPreferencesDesc12: {
    'zh-CN': '(c) 您有权在要求时合理访问以下内容：',
    'en-US': '(c) Your rights of reasonable access to, upon demand, of the following:',
  },
  yourRightsAndPreferencesDesc13: {
    'zh-CN': '• 已处理的您的个人信息的内容',
    'en-US': '• Contents of your personal information that were processed',
  },
  yourRightsAndPreferencesDesc14: {
    'zh-CN': '• 获得个人信息的来源',
    'en-US': '• Sources from which personal information were obtained',
  },
  yourRightsAndPreferencesDesc15: {
    'zh-CN': '• 个人信息接收者的姓名和地址',
    'en-US': '• Names and addresses of recipients of the personal information',
  },
  yourRightsAndPreferencesDesc16: {
    'zh-CN': '• 此类数据的处理方式',
    'en-US': '• Manner by which such data were processed',
  },
  yourRightsAndPreferencesDesc17: {
    'zh-CN': '• 向接收者披露个人信息的原因',
    'en-US': '• Reasons for the disclosure of the personal information to recipients',
  },
  yourRightsAndPreferencesDesc18: {
    'zh-CN': '• 关于自动化过程的信息，其中数据将或可能作为对数据主体产生重大影响或将影响数据主体的任何决定的唯一基础',
    'en-US': '• Information on automated processes where the data will or likely to be made as the sole basis for any decision significantly affecting or will affect the data subject',
  },
  yourRightsAndPreferencesDesc19: {
    'zh-CN': '• 关于数据主体的您的个人信息最后被访问和修改的日期；以及',
    'en-US': '• Date when your personal information concerning the data subject were last accessed and modified; and',
  },
  yourRightsAndPreferencesDesc20: {
    'zh-CN': '• 个人信息控制者的指定、名称或身份和地址',
    'en-US': '• The designation, or name or identity and address of the personal information controller',
  },
  yourRightsAndPreferencesDesc21: {
    'zh-CN': '(d) 您有权对个人信息中的不准确或错误提出异议，并要求个人信息控制者立即相应地纠正，除非请求是恶意或无理的。如果个人信息已被纠正，个人信息控制者应确保新旧信息的可访问性，以及接收者同时接收新旧信息。',
    'en-US': '(d) Your rights to dispute the inaccuracy or error in the personal information and have the personal information controller correct it immediately and accordingly, unless the request is vexatious or otherwise unreasonable. If the personal information has been corrected, the personal information controller shall ensure the accessibility of both the new and the retracted information and the simultaneous receipt of the new and the retracted information by recipients thereof.',
  },
  yourRightsAndPreferencesDesc22: {
    'zh-CN': '(e) 您有权在发现并充分证明个人信息不完整、过时、虚假、非法获得、用于未经授权的目的或不再需要收集目的时，暂停、撤回或命令从个人信息控制者的文件系统中阻止、删除或销毁您的个人信息。在这种情况下，个人信息控制者可能会通知之前收到此类已处理个人信息的第三方；以及',
    'en-US': '(e) Your rights to suspend, withdraw or order the blocking, removal or destruction of your personal information from the personal information controller\'s filing system upon discovery and substantial proof that the personal information are incomplete, outdated, false, unlawfully obtained, used for unauthorized purposes or are no longer necessary for the purposes for which they were collected. In this case, the personal information controller may notify third parties who have previously received such processed personal information; and',
  },
  yourRightsAndPreferencesDesc23: {
    'zh-CN': '如果您认为您在数据隐私法下的权利被忽视，您有权提出投诉，并有权寻求损害赔偿（如有）。',
    'en-US': 'Should you feel that your rights under the Data Privacy Act was disregarded, you are granted the right to file a complaint, and the right to seek indemnity for damages sustained, if any.',
  },
  collectedPersonalInformation: {
    'zh-CN': '收集的个人信息',
    'en-US': 'Collected Personal Information',
  },
  collectedPersonalInformationDesc1: {
    'zh-CN': '个人数据（或个人信息）是指关于个人的任何信息，从中可以识别该人。它不包括身份已被删除的数据（匿名数据）。',
    'en-US': 'Personal data (or personal information) means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).',
  },
  collectedPersonalInformationDesc2: {
    'zh-CN': '我们可能会收集、使用、存储和传输关于您的不同类型的个人数据，我们将其分组如下：',
    'en-US': 'We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:',
  },
  collectedPersonalInformationDesc3: {
    'zh-CN': '身份数据包括名字、婚前姓氏、姓氏、用户名或类似标识符、出生日期和性别。',
    'en-US': 'Identity Data includes first name, maiden name, last name, username or similar identifier, date of birth and gender.',
  },
  collectedPersonalInformationDesc4: {
    'zh-CN': '联系数据包括账单地址、送货地址、电子邮件地址和电话号码。',
    'en-US': 'Contact Data includes billing address, delivery address, email address and telephone numbers.',
  },
  collectedPersonalInformationDesc5: {
    'zh-CN': '财务数据包括银行账户和支付卡详情。',
    'en-US': 'Financial Data includes bank account and payment card details.',
  },
  collectedPersonalInformationDesc6: {
    'zh-CN': '交易数据包括与您之间的付款详情以及您从我们这里购买的产品和服务的其他详情。',
    'en-US': 'Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.',
  },
  collectedPersonalInformationDesc7: {
    'zh-CN': '技术数据包括互联网协议(IP)地址、pc标签、您的登录数据、浏览器类型和版本、时区设置和位置、浏览器插件类型和版本、操作系统和平台以及您用于访问本网站的设备上的其他技术。',
    'en-US': 'Technical Data includes internet protocol (IP) address, pc tag, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.',
  },
  collectedPersonalInformationDesc8: {
    'zh-CN': '个人资料数据包括您的用户名和密码、您进行的购买或订单、您的兴趣、偏好、通信反馈和调查回复。',
    'en-US': 'Profile Data includes your username and password, purchases or orders made by you, your interests, preferences, correspondence feedback and survey responses.',
  },
  collectedPersonalInformationDesc9: {
    'zh-CN': '使用数据包括有关您如何使用我们的网站、产品和服务的信息。',
    'en-US': 'Usage Data includes information about how you use our website, products and services.',
  },
  collectedPersonalInformationDesc10: {
    'zh-CN': '营销和通信数据包括您接收我们和第三方营销的偏好以及您的通信偏好。',
    'en-US': 'Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.',
  },
  collectedPersonalInformationDesc11: {
    'zh-CN': '我们还收集、使用和共享聚合数据，如统计或人口统计数据，用于任何目的。聚合数据可能来自您的个人数据，但在法律上不被视为个人数据，因为此数据不会直接或间接揭示您的身份。例如，我们可能会聚合您的使用数据来计算访问特定网站功能的用户百分比。但是，如果我们将聚合数据与您的个人数据结合或连接，使其能够直接或间接识别您，我们将组合数据视为个人数据，将根据本隐私政策使用。',
    'en-US': 'We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data may be derived from your personal data but is not considered personal data in law as this data does not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy policy.',
  },
  howWeCollectYourPersonalData: {
    'zh-CN': '我们如何收集您的个人数据',
    'en-US': 'How We Collect Your Personal Data',
  },
  howWeCollectYourPersonalDataDesc1: {
    'zh-CN': '身份和联系信息',
    'en-US': 'Identification and Contact Information',
  },
  howWeCollectYourPersonalDataDesc2: {
    'zh-CN': '• 这些可能包括但不限于通过电子邮件、直邮、社交媒体、电话、短信和类似方法分享特殊信息、活动、优惠和促销。',
    'en-US': '• These may include, but are not limited to, sharing special information, events, offers, and promotions via email, direct mail, social media, phone, SMS, and similar methods.',
  },
  howWeCollectYourPersonalDataDesc3: {
    'zh-CN': '非营销目的',
    'en-US': 'Non-marketing Purposes',
  },
  howWeCollectYourPersonalDataDesc4: {
    'zh-CN': '• 这些可能包括但不限于验证身份、进行数字人口统计或性能分析、进行调查、处理预订、购买和相关交易、安全和监控，以及遵守法律和监管指南。',
    'en-US': '• These may include, but are not limited to, validating identity, conducting digital demographic or performance analysis, conducting surveys, handling reservations, purchases, and related transactions, security and surveillance, and in complying with laws and regulatory guidelines.',
  },
  howWeCollectYourPersonalDataDesc5: {
    'zh-CN': '通信和选择退出',
    'en-US': 'Communications and Opting Out',
  },
  howWeCollectYourPersonalDataDesc6: {
    'zh-CN': '• 我们只希望通过电子邮件等主要方式向您发送您可能觉得有用或想要接收的通信和通知。这些可能包括但不限于分享特殊信息、活动、优惠和促销；就某些预订和询问、预订或相关交易与您联系；以及与我们计划相关的特殊兴趣团体的定期更新。我们发送的电子邮件在消息本身中包含选择退出机制。通过点击取消订阅链接，您将免费从我们的邮件列表中退出。',
    'en-US': '• We only wish to message you, primarily via email, with communications and notifications that you might find useful or want to receive. These may include, but are not limited to, sharing special information, events, offers and promotions; contacting you regarding certain reservations and inquiries, bookings, or related transactions; and regular updates for special interest groups associated with our programs. The emails we send include an opt-out mechanism within the message itself. By clicking on the unsubscribe link, you will be opted-out from our mailing list at no cost.',
  },
  howWeShareYourPersonalInformation: {
    'zh-CN': '我们如何共享您的个人信息',
    'en-US': 'How We Share Your Personal Information',
  },
  howWeShareYourPersonalInformationDesc1: {
    'zh-CN': '我们只会在获得您的许可的情况下共享您的个人数据。根据情况，我们可能会与以下接收者共享您的个人数据：',
    'en-US': 'We will only share your personal data with your permission. Depending on the circumstances, we may share your personal data with the following recipients:',
  },
  howWeShareYourPersonalInformationDesc2: {
    'zh-CN': `• a. 出于反洗钱、欺诈检测和/或控制的目的，${VITE_OFFICIAL_NAME}有权将您的个人数据传输给第三方，包括但不限于第三方供应商，如反洗钱委员会、PAGCOR、其他金融机构等。诚信单位、银行、身份证和地址验证系统提供商、支付服务提供商和金融机构，但前提是我们保证他们在数据处理和安全方面达到相同标准。我们鼓励您阅读我们第三方供应商的隐私政策。`,
    'en-US': `• a. For the purpose of anti-money laundering, fraud detection and/or control, ${VITE_OFFICIAL_NAME} has the right to transfer your personal data to third parties, including but not limited to third-party suppliers such as the Anti-Money Laundering Commission, PAGCOR, other financial institutions, etc. Integrity Units, Banks, ID and Address Verification System Providers, Payment Service Providers and Financial Institutions, but only if we guarantee that they meet the same standards with regard to data processing and security. We encourage you to read the privacy policies of our third-party suppliers.`,
  },
  howWeShareYourPersonalInformationDesc3: {
    'zh-CN': `• b. 此外，我们保留向相关第三方披露您的个人数据的权利，如与${VITE_OFFICIAL_NAME}直接相关的集团、我们的监管机构、金融诚信单位，特别是当${VITE_OFFICIAL_NAME}有合理理由怀疑您的账户行为存在违规时。`,
    'en-US': `• b. We also reserve the right to disclose your personal data to relevant third parties, such as ${VITE_OFFICIAL_NAME}’s affiliated group companies, our regulators, and financial integrity units, especially if ${VITE_OFFICIAL_NAME} has reasonable grounds to suspect any irregular activity on your account.`,
  },
  howWeShareYourPersonalInformationDesc4: {
    'zh-CN': '• c. 您的数据还将与云服务、数据中心、支付服务、银行、身份验证工具、客户通信工具、游戏提供商等共享，用于日常运营目的。',
    'en-US': '• c. Your data will also be shared with cloud services, data centers, payment services, banks, authentication tools, customer communication tools, game providers, etc. for routine operational purposes.',
  },
  howWeShareYourPersonalInformationDesc5: {
    'zh-CN': '• d. 根据我们的监管责任，我们有权与体育组织共享我们持有的个人信息，包括个人统计数据和/或投注历史，以调查欺诈、洗钱或体育诚信问题。',
    'en-US': '• d. Subject to our regulatory responsibilities, we have the right to share personal information we hold, including personal statistics and/or betting history, with sports organisations to investigate fraud, money laundering or sports integrity issues.',
  },
  howWeShareYourPersonalInformationDesc6: {
    'zh-CN': '• e. 我们将采取所有合理步骤确保您的个人数据得到安全处理，并适当注意并遵守适用的法律要求。',
    'en-US': '• e. We will take all reasonable steps to ensure that your personal data is processed securely, with due care and in compliance with applicable legal requirements.',
  },
  howWeStoreAndSecureYourPersonalInformation: {
    'zh-CN': '我们如何存储和保护您的个人信息',
    'en-US': 'How We Store & Secure Your Personal Information',
  },
  howWeStoreAndSecureYourPersonalInformationDesc1: {
    'zh-CN': `${VITE_OFFICIAL_NAME}向您保证您的个人数据：`,
    'en-US': `${VITE_OFFICIAL_NAME} assures you that your personal data is:`,
  },
  howWeStoreAndSecureYourPersonalInformationDesc2: {
    'zh-CN': '• 根据您的权利进行处理；',
    'en-US': '• processed in accordance with your rights;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc3: {
    'zh-CN': '• 公平合法地处理；',
    'en-US': '• processed fairly and lawfully;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc4: {
    'zh-CN': '• 仅出于上述目的获得；',
    'en-US': '• obtained only for the above purposes;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc5: {
    'zh-CN': '• 对其目的而言是充分、相关且不过度的；',
    'en-US': '• adequate, relevant and not excessive for its purpose;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc6: {
    'zh-CN': '• 以安全方式保存；',
    'en-US': '• kept in a secure manner;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc7: {
    'zh-CN': '• 保存时间不超过其目的所需的时间。',
    'en-US': '• not kept longer than is necessary for its purposes.',
  },
  howWeStoreAndSecureYourPersonalInformationDesc8: {
    'zh-CN': `${VITE_OFFICIAL_NAME}应采取所有合理步骤确保您的信息得到安全保护。在这方面，我们保持适当的技术和组织措施来保护您的数据免受未经授权或非法的处理。`,
    'en-US': `${VITE_OFFICIAL_NAME} shall take all reasonable steps to ensure that your information is kept secure and protected. In this regard, we maintain appropriate technical and organizational measures to protect your data against unauthorized or unlawful processing.`,
  },
  howWeStoreAndSecureYourPersonalInformationDesc9: {
    'zh-CN': `当您是客户时，我们需要保留您的信息以满足我们的法律和合同要求。但是，当您停止使用${VITE_OFFICIAL_NAME}的服务时，我们仍将在一段时间内保留您的个人信息。我们保留您信息的几个原因包括：`,
    'en-US': `While you are a customer, we will need to retain your information to meet our legal and contractual requirements. However, when you cease using ${VITE_OFFICIAL_NAME}'s Services, we will still retain your personal information for a period of time. There are several reasons why we retain your information, these include:`,
  },
  howWeStoreAndSecureYourPersonalInformationDesc10: {
    'zh-CN': '• 遵守菲律宾当地法律下的法律义务（例如，反洗钱法规或许可法规）；',
    'en-US': '• To comply with legal obligations under Philippine local laws (for example, anti-money laundering regulations, or licensing regulations);',
  },
  howWeStoreAndSecureYourPersonalInformationDesc11: {
    'zh-CN': '• 建立或辩护可能对我们提出的法律索赔（例如过失索赔）；',
    'en-US': '• To establish or defend legal claims (for example negligence claims) which could be made against us;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc12: {
    'zh-CN': '• 遵守我们与所涉及信息相关的合同义务和权利；',
    'en-US': '• To comply with our contractual obligations and rights in relation to the information involved;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc13: {
    'zh-CN': '• 我们进行平衡测试的合法利益；',
    'en-US': '• Our legitimate interests where we have carried out balancing tests;',
  },
  howWeStoreAndSecureYourPersonalInformationDesc14: {
    'zh-CN': '• 遵守相关数据保护当局发布的指导方针。',
    'en-US': '• To comply with guidelines issued by relevant data protection authorities.',
  },
  howWeStoreAndSecureYourPersonalInformationDesc15: {
    'zh-CN': '我们正在加密敏感信息，如存储在数据库中的信用卡或借记卡号码、手机号码、电子邮件地址、用户名和密码。只有应用程序才能解密此类信息，并提供高级别的用户访问安全性，其中所有事件或活动都记录在安全服务器中。',
    'en-US': 'We are encrypting sensitive information such as credit card or debit card number, mobile number, email address, username and password stored in our databases. Only the application will be able to decrypt such information provided with high level of security of user access in which all events or activities are being logged in the secured server.',
  },
  howWeStoreAndSecureYourPersonalInformationDesc16: {
    'zh-CN': '但是，我们无法控制也无法对您用于访问我们网站或通过电子邮件、消息应用程序或我们的网站向我们发送信息的任何设备强制执行相同程度的安全性。因此，我们对在我们收到您的个人数据之前可能被拦截的信息的安全性和保护不承担责任。',
    'en-US': 'However, we have no control and therefore cannot enforce the same amount of security on any of the devices that you use to access our site, or to send us information via email, messaging apps, or our website. We are therefore not responsible for the security and protection of information that may have been intercepted prior to our receipt of your personal data.',
  },
  updatesToThisPrivacyStatement: {
    'zh-CN': '本隐私声明的更新',
    'en-US': 'Updates to this Privacy Statement',
  },
  updatesToThisPrivacyStatementDesc1: {
    'zh-CN': `本隐私政策可能会不时更新，以反映我们工作方式或我们工作监管方式的变化 - 因此您可能希望每次向我们提交个人信息时都检查它。最新修订的日期将显示在此页面上。如果您不同意这些更改，请不要继续向${VITE_OFFICIAL_NAME}提交个人信息或以任何方式使用我们的服务。否则，您将被视为已接受隐私政策的更改。您也可以随时删除您的${VITE_OFFICIAL_NAME}账户。如果隐私政策发生重大变化，例如影响我们想要如何使用您的个人信息，我们将提供更突出的通知（包括，对于某些服务，通过电子邮件通知隐私政策变更），您将被要求明确接受此类更改以继续使用服务，更改将在您接受更改后立即生效。`,
    'en-US': `This Privacy Policy may be updated from time to time to reflect changes in the way we work or the way our work is regulated - so you may wish to check it each time you submit personal information to us. The date of the most recent revision will be displayed on this page. If you do not agree to these changes, please do not continue to submit personal information to ${VITE_OFFICIAL_NAME} or use our services in any way. Otherwise, you will be deemed to have accepted the changes to the Privacy Policy. You can also delete your ${VITE_OFFICIAL_NAME}/account at any time. If there is a material change to the Privacy Policy, such as affecting how we want to use your personal information, we will provide a more prominent notice (including, for some services, notification of the Privacy Policy change by email), and you will be required to expressly accept this Class changes to continue to use the Service, the changes will apply immediately upon your acceptance of the changes.`,
  },
  yourObligation: {
    'zh-CN': '您的义务',
    'en-US': 'Your Obligation',
  },
  yourObligationDesc1: {
    'zh-CN': `通过使用我们的网站并提供您的个人数据，您承认您需要按照${VITE_OFFICIAL_NAME}的要求提供您的实际、准确和完整的数据。此外，您必须告知我们您信息的任何变更，以确保其保持最新和准确。`,
    'en-US': `By using our Website and by providing your personal data, you acknowledge that you are required to provide your actual, accurate and complete data as requested by ${VITE_OFFICIAL_NAME}. Furthermore, you must inform us of any changes to your information so as to ensure it is kept up-to-date and accurate.`,
  },
  yourObligationDesc2: {
    'zh-CN': '如果发现您违反义务或我们有合理怀疑您提供的信息是虚假或不完整的，或以任何方式违反2012年数据隐私法或本政策，我们保留拒绝您的注册申请或立即暂停或终止您的账户的权利，恕不另行通知。在这种情况下，您无权因拒绝您的申请或暂停或终止您的账户而获得任何补偿。',
    'en-US': 'If you are found to be in breach of your obligations or if we have reasonable suspicion that the information you provide is false or incomplete or in any way contrary to Data Privacy Act of 2012 or this Policy, we retain the right to reject your application for registration or to suspend or terminate your account immediately without notice. In this case, you have no right to any compensation due to the rejection of your application, or the suspension or termination of your account.',
  },
}

// 结构
const contentSections = [
  {
    id: 'policyStatement',
    titleKey: 'policyStatement',
    items: [
      { key: 'policyStatementDesc1' },
      { key: 'policyStatementDesc2' },
      // { key: 'policyStatementDesc3' },
    ],
  },
  {
    id: 'scopeAndCommitment',
    titleKey: 'scopeAndCommitment',
    items: [
      { key: 'scopeAndCommitmentDesc1' },
      { key: 'scopeAndCommitmentDesc2' },
      { key: 'scopeAndCommitmentDesc3' },
      { key: 'scopeAndCommitmentDesc4' },
      { key: 'scopeAndCommitmentDesc5' },
    ],
  },
  {
    id: 'yourRightsAndPreferences',
    titleKey: 'yourRightsAndPreferences',
    items: [
      { key: 'yourRightsAndPreferencesDesc1' },
      { key: 'yourRightsAndPreferencesDesc2' },
      { key: 'yourRightsAndPreferencesDesc3' },
      { key: 'yourRightsAndPreferencesDesc4' },
      { key: 'yourRightsAndPreferencesDesc5' },
      { key: 'yourRightsAndPreferencesDesc6' },
      { key: 'yourRightsAndPreferencesDesc7' },
      { key: 'yourRightsAndPreferencesDesc8' },
      { key: 'yourRightsAndPreferencesDesc9' },
      { key: 'yourRightsAndPreferencesDesc10' },
      { key: 'yourRightsAndPreferencesDesc11' },
      { key: 'yourRightsAndPreferencesDesc12' },
      { key: 'yourRightsAndPreferencesDesc13' },
      { key: 'yourRightsAndPreferencesDesc14' },
      { key: 'yourRightsAndPreferencesDesc15' },
      { key: 'yourRightsAndPreferencesDesc16' },
      { key: 'yourRightsAndPreferencesDesc17' },
      { key: 'yourRightsAndPreferencesDesc18' },
      { key: 'yourRightsAndPreferencesDesc19' },
      { key: 'yourRightsAndPreferencesDesc20' },
      { key: 'yourRightsAndPreferencesDesc21' },
      { key: 'yourRightsAndPreferencesDesc22' },
      { key: 'yourRightsAndPreferencesDesc23' },
    ],
  },
  {
    id: 'collectedPersonalInformation',
    titleKey: 'collectedPersonalInformation',
    items: [
      { key: 'collectedPersonalInformationDesc1' },
      { key: 'collectedPersonalInformationDesc2' },
      { key: 'collectedPersonalInformationDesc3' },
      { key: 'collectedPersonalInformationDesc4' },
      { key: 'collectedPersonalInformationDesc5' },
      { key: 'collectedPersonalInformationDesc6' },
      { key: 'collectedPersonalInformationDesc7' },
      { key: 'collectedPersonalInformationDesc8' },
      { key: 'collectedPersonalInformationDesc9' },
      { key: 'collectedPersonalInformationDesc10' },
      { key: 'collectedPersonalInformationDesc11' },
    ],
  },
  {
    id: 'howWeCollectYourPersonalData',
    titleKey: 'howWeCollectYourPersonalData',
    items: [
      { key: 'howWeCollectYourPersonalDataDesc1' },
      { key: 'howWeCollectYourPersonalDataDesc2' },
      { key: 'howWeCollectYourPersonalDataDesc3' },
      { key: 'howWeCollectYourPersonalDataDesc4' },
      { key: 'howWeCollectYourPersonalDataDesc5' },
      { key: 'howWeCollectYourPersonalDataDesc6' },
    ],
  },
  {
    id: 'howWeShareYourPersonalInformation',
    titleKey: 'howWeShareYourPersonalInformation',
    items: [
      { key: 'howWeShareYourPersonalInformationDesc1' },
      { key: 'howWeShareYourPersonalInformationDesc2' },
      { key: 'howWeShareYourPersonalInformationDesc3' },
      { key: 'howWeShareYourPersonalInformationDesc4' },
      { key: 'howWeShareYourPersonalInformationDesc5' },
      { key: 'howWeShareYourPersonalInformationDesc6' },
    ],
  },
  {
    id: 'howWeStoreAndSecureYourPersonalInformation',
    titleKey: 'howWeStoreAndSecureYourPersonalInformation',
    items: [
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc1' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc2' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc3' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc4' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc5' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc6' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc7' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc8' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc9' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc10' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc11' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc12' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc13' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc14' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc15' },
      { key: 'howWeStoreAndSecureYourPersonalInformationDesc16' },
    ],
  },
  {
    id: 'updatesToThisPrivacyStatement',
    titleKey: 'updatesToThisPrivacyStatement',
    items: [
      { key: 'updatesToThisPrivacyStatementDesc1' },
    ],
  },
  {
    id: 'yourObligation',
    titleKey: 'yourObligation',
    items: [
      { key: 'yourObligationDesc1' },
      { key: 'yourObligationDesc2' },
    ],
  },
]

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
  setTitle(t('隐私政策'))
})
</script>

<template>
  <div class="bg-[#f5f5f5] min-h-screen leading-[1.15]">
    <main class="main">
      <div class="parent-layout">
        <div v-for="section in contentSections" :key="section.id" class="content-parent">
          <div>
            <div class="faqs-title">
              <span class="title-indicator" />
              <span class="title-text">{{ getText(section.titleKey) }}</span>
            </div>
            <div class="divider" />
          </div>

          <div v-for="item in section.items" :key="item.key">
            <div class="item-answer">
              <span>{{ getText(item.key) }}</span>
              <span v-if="item.key.includes('policyStatementDesc3')" class="text-[#025be8]">{{ VITE_OFFICIAL_NAME }}</span>
            </div>
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
  background-color: var(--card_white_lv_1, #fff);
  padding-bottom: 6px;
  margin-top: 8px;
  border-radius: 0;
}

.item-answer {
  padding: 6px 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6d7693;
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
  width: 4px;
  height: 18px;
  aspect-ratio: 0.222222 / 1;
  background: linear-gradient(to bottom, #739ff8, #2a5ee1);
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
  font-size: 14rem;
  color: #0d2245;
}

.divider {
  height: 1px;
  background-color: var(--space_gap, #f1f1f1);
  width: calc(100% - 24px);
  margin: 0 auto;
}
</style>
