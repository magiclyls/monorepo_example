<script setup lang='ts'>
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted } from 'vue'

defineOptions({ name: 'TermsOfUse' })
const setTitle = inject('setTitle', (v: string) => { })

// 使用语言store

// 导入官方名称常量
const { VITE_OFFICIAL_NAME } = getEnv()

// 替换文本中的品牌名称
function replaceBrandName(text: string): string {
  return text
    .replace(/OKBET\.com/g, VITE_OFFICIAL_NAME)
    .replace(/www\.OKBET\.com/g, `www.${VITE_OFFICIAL_NAME}`)
    .replace(/OKBET/g, VITE_OFFICIAL_NAME)
}

//  映射对象
const i18nMap: any = {
  termsOfUse: {
    'zh-CN': '使用条款',
    'en-US': 'Terms of Use',
  },
  generalIntroduction: {
    'zh-CN': '总则和定义',
    'en-US': 'General Introduction and Definitions',
  },
  generalIntroDesc1: {
    'zh-CN': `${VITE_OFFICIAL_NAME}是一家在菲律宾共和国法律下正式注册的公司，目前持有菲律宾娱乐和博彩公司(PAGCOR)颁发的许可证并受其监管，其官方注册网站为${VITE_OFFICIAL_NAME}。`,
    'en-US': `${VITE_OFFICIAL_NAME} is a company legally registered in the Republic of the Philippines, licensed and regulated by the Philippine Amusement and Gaming Corporation (PAGCOR). Its official registered website is ${VITE_OFFICIAL_NAME}.`,
  },
  generalIntroDesc2: {
    'zh-CN': '本使用条款构成账户持有人与OKBET之间完整、最终且排他性的协议，并管辖OKBET与账户持有人之间的合同关系。OKBET使用条款取代并合并账户持有人与OKBET之间的所有先前协议、陈述和理解。通过开设OKBET账户、注册、登录、使用服务、参与游戏或接受任何奖品，访客或账户持有人完全理解并同意：',
    'en-US': 'These Terms of Use constitute the complete, final, and exclusive agreement between the Account Holder and OKBET, and governing the contractual relationship between OKBET and the Account Holder. The OKBET Terms of Use supersede and merge all prior agreements, representations, and understandings between the Account Holder and OKBET. By opening an OKBET Account, registering, logging-in, using the Services, participating in the games, or accepting any Prize, a visitor or an Account Holder fully understands and agrees:',
  },
  generalIntroDesc3: {
    'zh-CN': '• 成为OKBET规则的缔约方',
    'en-US': '• to become a party to the OKBET Rules',
  },
  generalIntroDesc4: {
    'zh-CN': '• 他/她已经阅读、理解并将遵守这些使用条款',
    'en-US': '• that he/she has read, understood and will be adhering to these Terms of Use',
  },
  generalIntroDesc5: {
    'zh-CN': '• 他/她将遵守其所有条款。',
    'en-US': '• that he/she shall abide by all its terms.',
  },
  generalIntroDesc6: {
    'zh-CN': 'OKBET保留随时更新、修改、编辑和补充OKBET使用条款的权利。本OKBET使用条款的任何实质性修改应在生效前由OKBET提前通知账户持有人。',
    'en-US': 'OKBET reserves the right to update, amend, edit and supplement the OKBET Terms of Use at any time. Any substantial amendment to the OKBET Terms of Use herein shall be notified in advance by OKBET to the Account Holder before coming into effect.',
  },
  generalIntroDesc7: {
    'zh-CN': 'OKBET规则中对单数的所有引用应包括复数，反之亦然。对"the"的所有引用应包括"a/an"，反之亦然。',
    'en-US': 'All references in the OKBET Rules to the singular shall include the plural and vice versa. All references to "the" shall include "a/an" and vice versa.',
  },
  generalIntroDesc8: {
    'zh-CN': `账户持有人在接受服务之前必须仔细完整地阅读本协议。本协议构成账户持有人与${VITE_OFFICIAL_NAME}（以下简称"${VITE_OFFICIAL_NAME}”、”网站”或”站点”）之间的具有法律约束力的协议。`,
    'en-US': `${VITE_OFFICIAL_NAME} is a registered company under the laws of the Philippines, licensed and regulated by PAGCOR. The official website is ${VITE_OFFICIAL_NAME}.`,
  },
  generalIntroDesc9: {
    'zh-CN': '当账户持有人在注册过程中点击"注册"或"完成注册"按钮并使用下面指定的软件时，意味着他/她完全同意协议中列出的规则和条款、隐私保护规则以及其他相关赌博和网站的定期更新。任何违反本协议的行为都将产生以下后果（剥夺会员资格、账户关闭、没收资金或其他相关法律程序）。',
    'en-US': 'When an account holder clicks the "Register" or "Complete Registration" button during the registration process and use the software specified below, it means that he/she fully agrees to the rules and terms listed in the agreement, privacy protection rules, and other related gambling and website regular updates. Any violation of this agreement, will have the following consequences (deprivation of membership, account closure, confiscation of funds or other related legal proceedings).',
  },
  definitionOfTerms: {
    'zh-CN': '术语定义',
    'en-US': 'Definitions',
  },
  okbetAccount: {
    'zh-CN': '"OKBET账户"是账户持有人持有的账户，用于真实交易，严格目的是与OKBET建立正常的商业关系，并严格用于进行投注和其他游戏和赌博交易。',
    'en-US': '"OKBET account" is an account held by an Account Holder, for bona fide transactions, with a strict aim to establish a normal commercial relationship with OKBET and with the strict purpose of conducting betting and other gaming and gambling transactions.',
  },
  equipment: {
    'zh-CN': '"设备"指所有应用设备，包括用于访问在线服务的所有设备，但不限于个人电脑、笔记本电脑、手机、个人电子设备、PDA手机等。',
    'en-US': '"Equipment" refers to all application equipment, including all equipment used to access online services but not limited to personal computers, notebooks, mobile phones, personal electronic devices, PDA phones, etc.',
  },
  game: {
    'zh-CN': '"游戏"指网站上提供的在线娱乐系统。',
    'en-US': '"Game" refers to the online entertainment system provided on the website.',
  },
  software: {
    'zh-CN': '"软件"指安装在设备上的所有计算机程序、数据文件或任何其他要求，进而能够通过互联网访问网站和参与服务。',
    'en-US': '"Software" refers to all computer programs, data files, or any other requirements that are installed on a device and in turn capable of accessing websites and participating in services through the Internet.',
  },
  sportsBetting: {
    'zh-CN': '"体育博彩"指网站提供的"体育"、"赌场"或"扑克"以及其他相关服务和在线娱乐。',
    'en-US': '"Sports betting" refers to "sports", "casino" or "poker" and other related services and online entertainment provided by the website.',
  },
  information: {
    'zh-CN': '"信息"指网站上提供的信息，包括但不限于比赛结果、统计数据、体育数据、赔率等。',
    'en-US': '"Information" refers to the information provided on the website, including but not limited to match results, statistics, sports data, odds, etc.',
  },
  website: {
    'zh-CN': `"网站"是指通过互联网地址 www.OKBET.com可访问的互联网门户，其中发布有关 ${VITE_OFFICIAL_NAME} 运营的所有当前和相关信息，并通过该门户向账户持有人提供服务。`,
    'en-US': `"Website" refers to the online portal accessible via www.OKBET.com, where all current and relevant information about ${VITE_OFFICIAL_NAME}’s operations is published and services are provided to account holders.`,
  },
  service: {
    'zh-CN': '"服务"是指 OKBET 通过网站向账户持有人提供的游戏和博彩服务。',
    'en-US': '"Service" is the gaming and betting offers provided by OKBET to the Account Holder through the Website.',
  },
  card: {
    'zh-CN': '"卡"是指具有"支付"、"充值"、"借记"、"信用卡"、"虚拟"和/或类似功能的所有类型的卡。',
    'en-US': '"Card" refers to all types of cards with a function of "payment", "charge", "debit", "credit", "virtual" and/or similar.',
  },
  paymentSolutionProvider: {
    'zh-CN': '"支付解决方案提供商"是作为各种不同支付方式支付代理的中间商。',
    'en-US': '"Payment Solution Provider" is an intermediary acting as a payment agent for various different payment methods.',
  },
  regulator: {
    'zh-CN': '"监管机构"是指菲律宾娱乐和博彩公司（PAGCOR），这是根据菲律宾法律设立的监管机构，负责管理菲律宾境内的所有形式的博彩活动。更多信息，请访问 https://www.pagcor.ph/',
    'en-US': '"Regulator" is the Philippine Amusement and Gaming Corporation (PAGCOR), which is the regulatory authority established by Philippine law to govern all forms of gaming in the Philippines. For more information, please go to https://www.pagcor.ph/',
  },
  financialInstitution: {
    'zh-CN': '"金融机构"是指受适用的国内金融服务法案或类似法规监管的银行和/或其他机构。',
    'en-US': '"Financial Institution" is a bank and/or other institution regulated by an applicable domestic financial services Act or similar.',
  },
  clientApplication: {
    'zh-CN': '"客户端应用程序"是指账户持有人为了使用服务而打开的网页浏览器应用程序。',
    'en-US': '"Client Application" shall mean the web browser application opened by the Account Holder in order to use the Services.',
  },
  softwareDefinition: {
    'zh-CN': '"软件"是指 OKBET 用于提供和/或运营服务和/或运行客户端应用程序的所有软件。',
    'en-US': '"Software" shall mean all software used by OKBET to offer and/or operate the Services and/or run the Client Application.',
  },
  prize: {
    'zh-CN': '"奖品"是账户持有人可以赢得的金额、奖金或奖励。',
    'en-US': '"Prize" is an amount, a bonus, or a reward that can be won by the Account Holder.',
  },
  inactiveAccount: {
    'zh-CN': '"非活跃账户"是指连续6个月以上未记录任何登录和/或登出的 OKBET 账户。',
    'en-US': '"Inactive Account" is an OKBET Account which has not recorded any log-in and/or log-out for a period exceeding 6 consecutive months.',
  },
  licenseIntellectualProperty: {
    'zh-CN': '许可/知识产权',
    'en-US': 'License/Intellectual Property',
  },
  licenseDesc1: {
    'zh-CN': '软件的编码和组织结构属于 OKBET 的版权、商业秘密、知识产权和其他权利。账户持有人或访客不得：',
    'en-US': 'The coding and organizational structure of the software belong to OKBET\'s copyright, trade secrets, intellectual property rights, and other rights. An account holder or a visitor must not:',
  },
  licenseDesc2: {
    'zh-CN': '通过网站向任何其他人转发和/或传输流媒体服务和项目视频，或在任何第三方可访问的电子通信网站或服务网站上发布相关信息。',
    'en-US': 'Forward and/or transfer streaming media services and project videos to any other person through the website, or post relevant information on any electronic communication website or service website accessible by third parties.',
  },
  licenseDesc3: {
    'zh-CN': '复制、分发、发布、反向工程、反向编译、反汇编、修改或翻译软件，或尝试获取源代码制作衍生文件。',
    'en-US': 'Copy, distribute, publish, reverse engineer, reverse compile, disassemble, modify, or translate the software or try to obtain the source code to make derivative files.',
  },
  licenseDesc4: {
    'zh-CN': '销售、分发、再授权、转让、分发或出租软件。',
    'en-US': 'Sell, distribute, sublicense, transfer, distribute or rent the software.',
  },
  licenseDesc5: {
    'zh-CN': '通过互联网或其他方式向第三方提供软件。',
    'en-US': 'Provide the software to third parties via the Internet or other means.',
  },
  licenseDesc6: {
    'zh-CN': '未经OKBET书面许可，通过电子传输或其他方式将软件出口到任何国家。',
    'en-US': 'Export the software to any country through electronic transmission or other means without the written permission of OKBET.',
  },
  licenseDesc7: {
    'zh-CN': '将软件用于任何本质上非法的目的。',
    'en-US': 'Use the software for any illegal purposes by nature.',
  },
  licenseDesc8: {
    'zh-CN': '如果任何非法使用造成任何损失、费用或相关佣金费用，行为人应承担责任。',
    'en-US': 'If there are any losses, expenses, or related commission fees caused by any illegal use, the perpetrator shall bear the responsibility.',
  },
  licenseDesc9: {
    'zh-CN': '在网站、客户端应用程序及其所含材料中发现的所有商标、服务标记和商号以及图像、图形、文本、概念或方法（统称为"知识产权资产"）均为OKBET和/或OKBET供应商和合作伙伴的专有财产。账户持有人或任何网站访问者无权出于任何目的利用或以其他方式使用任何知识产权资产，法律允许的除外。',
    'en-US': 'All trademarks, service marks, and trade names as well as images, graphics, text, concepts, or methodologies (collectively the "Intellectual Assets") found on the Website, the Client Application, and the material contained therein are the exclusive property of OKBET and/or OKBET\'s suppliers and partners. The Account Holder or any website visitor is not entitled to exploit or otherwise use any Intellectual Asset for whatever purpose, except for what is allowed by law.',
  },
  financialSecurity: {
    'zh-CN': '财务安全',
    'en-US': 'Financial Security',
  },
  financialSecurityDesc1: {
    'zh-CN': 'OKBET注册会员的资金与公司资金分开存放在监管机构批准的金融机构持有的客户账户中。OKBET将采取措施确保客户资金与公司的任何资金没有直接联系。客户资金将受到全面保护。',
    'en-US': 'The funds of OKBET registered members are deposited separately from the company funds in a client account held with a Financial Institution approved by the Regulator. OKBET will take measures to ensure that customer funds are not directly connected to any funds of the company. Client\'s funds will be protected by all means.',
  },
  financialSecurityDesc2: {
    'zh-CN': 'OKBET保留随时调整其业务运营任何方面的权利，以遵守其他司法法规。',
    'en-US': 'OKBET reserves the right to adjust any aspect of its business operations at any time to comply with other judicial regulations.',
  },

  accountRegistration: {
    'zh-CN': '账户注册、访问和安全',
    'en-US': 'Account Registration, Access, and Security',
  },
  accountRegistrationDesc1: {
    'zh-CN': '1. OKBET承认客户使用OKBET网站软件、使用设备获取网站信息以及参与在线游戏的个人权利（不可转让且非独占）。',
    'en-US': '1. OKBET recognizes customers\' personal rights (non-transferable and not exclusive) to use OKBET website software, use equipment to obtain information on the website, and participate in online games.',
  },
  accountRegistrationDesc2: {
    'zh-CN': '2. OKBET网站软件不适用于以下人群：',
    'en-US': '2.The OKBET website software is not suitable for the following people:',
  },
  accountRegistrationDesc3: {
    'zh-CN': 'A. 21岁以下。',
    'en-US': 'A. Under 21 years old.',
  },
  accountRegistrationDesc4: {
    'zh-CN': 'B. 在其所属司法管辖区内，年龄低于法定年龄。',
    'en-US': 'B. Where in the jurisdiction where they belong, they are below their legal age.',
  },
  accountRegistrationDesc5: {
    'zh-CN': 'C. 根据当地司法法规，访问网站是非法的和/或OKBET无法识别客户行为在当地司法管辖区内是否合法，例如：',
    'en-US': 'C. According to local judicial regulations, visiting the website is illegal and/or OKBET cannot identify whether the customer\'s behavior is legal in the local jurisdiction such as:',
  },
  publicOfficials: {
    'zh-CN': 'a) 公职人员，包括选举和任命的官员和雇员，无论是永久或临时，无论是在职业或非职业服务中，无论是否获得补偿，无论金额多少。',
    'en-US': 'a) Public officials, which includes elective and appointive officials and employees, permanent or temporary, whether in the career or non-career service, whether or not they receive compensation, regardless of amount.',
  },
  armedForces: {
    'zh-CN': 'b) 菲律宾武装部队成员，包括陆军、海军、空军或菲律宾国家警察；',
    'en-US': 'b) Members of the Armed Forces of the Philippines, including the Army, Navy, Air Force or Philippine National Police;',
  },
  underageStudents: {
    'zh-CN': 'c) 21岁以下人员或菲律宾任何学校、学院或大学的学生；',
    'en-US': 'c) Persons under 21 years of age or students of any school, college or university in the Philippines;',
  },
  pagcorOfficials: {
    'zh-CN': 'd) PAGCOR官员和雇员；',
    'en-US': 'd) PAGCOR officials and employees;',
  },
  gamingSiteOperators: {
    'zh-CN': 'e) 游戏网站运营商和雇员；',
    'en-US': 'e) Gaming site Operators and employees;',
  },
  unregisteredPlayers: {
    'zh-CN': 'f) 未注册玩家；',
    'en-US': 'f) Unregistered players;',
  },
  bannedIndividuals: {
    'zh-CN': 'g) 被禁止的个人；',
    'en-US': 'g) Banned individuals;',
  },
  relativesOfOfficials: {
    'zh-CN': 'h) 官员的配偶、同居伴侣、子女、父母及上述(a)、(b)和(d)项中提及的人员；',
    'en-US': 'h) Spouse, common-law partner, children, parents of officials and persons mentioned in items (a), (b), and (d) above;',
  },
  playersOutsidePhilippines: {
    'zh-CN': 'i) 当前居住在菲律宾境外的玩家；',
    'en-US': 'i) Players currently residing outside of the Philippines;',
  },
  okbetEmployees: {
    'zh-CN': 'OKBET员工及其亲属（"亲属"指配偶、伴侣、父母、子女或兄弟姐妹），或任何OKBET相关离职员工或离职6个月内员工的亲属（包括与OKBET有关的任何关联）。',
    'en-US': 'OKBET employees and relatives of OKBET employees ("relatives" refer to spouses, partners, parents, children, or brothers and sisters), or any OKBET related former employees or relatives of former employees within 6 months of resignation (including anything connected with OKBET).',
  },
  accountRegistrationDesc6: {
    'zh-CN': '3. 为防止未达法定年龄者使用服务，OKBET保留随时要求客户提供年龄证明的权利。若账户持有人不符合年龄标准或我们怀疑其低于年龄标准，我们有权长期/短期暂停/取消OKBET账户以防止未经授权使用服务。',
    'en-US': '3. In order to prevent people who do not meet the legal age from using the services, OKBET reserves the right to require customers to provide proof of age at any time. If the account holder doesn\'t qualify for the age standard or we suspect that he/she is below the age standard, we have the right to suspend/cancel the OKBET account for a long-term/short-term period to prevent the unauthorized use of the services.',
  },
  accountRegistrationDesc7: {
    'zh-CN': '4. 个人除非成为账户持有人，否则不得参与金钱游戏。注册为玩家时，个人必须提交注册申请并如实理解并履行以下条款：',
    'en-US': '4. An individual cannot participate in a game for money unless that individual is an Account Holder. To be registered as a player, an individual must submit an application for registration and must faithfully understand and fulfill the following terms:',
  },
  accountRegistrationItem1: {
    'zh-CN': 'a) 账户持有人不是法律限制行为能力的个人；',
    'en-US': 'a) The account holder is not an individual whose capacity is restricted by law;',
  },
  accountRegistrationItem2: {
    'zh-CN': 'b) 账户持有人的法定行为仅代表其本人，不代表他人或其他公司；',
    'en-US': 'b) The account holder\'s statutory actions can only represent him/her personally, but not other people or other companies;',
  },
  accountRegistrationItem3: {
    'zh-CN': 'c) 账户持有人理解其参与OKBET服务纯属自愿；',
    'en-US': 'c) The account holder understands that his/her participation in OKBET services is purely voluntary;',
  },
  accountRegistrationItem4: {
    'zh-CN': 'd) 账户持有人未被诊断患有强迫性赌博障碍或未根据监管机构指南注册为自我排除玩家；',
    'en-US': 'd) The account holder is not experiencing nor diagnosed with Compulsive Gambling Disorder nor registered as a Self-Excluded player in accordance to the guidelines set by the Regulator;',
  },
  accountRegistrationItem5: {
    'zh-CN': 'e) 账户持有人完全同意在使用服务时必须向OKBET提供某些个人信息（包括支付方式的具体信息）以供确认。OKBET将按照隐私政策管理和控制所提供的信息；',
    'en-US': 'e) The account holder fully agrees that certain personal information (including specific information about payment methods) must be provided to OKBET for confirmation when using its services. OKBET will follow the privacy policy to manage and control the information provided;',
  },
  accountRegistrationItem6: {
    'zh-CN': 'f) 账户持有人负责缴纳游戏盈利产生的相关税款；',
    'en-US': 'f) The account holder is responsible for the relevant taxes arising from gaming profits;',
  },
  accountRegistrationItem7: {
    'zh-CN': 'g) 账户持有人只能将网站用于个人目的，投注应仅为个人娱乐；',
    'en-US': 'g) The account holder can only use the website for personal purposes. He/she shall only place bets for personal entertainment;',
  },
  accountRegistrationItem8: {
    'zh-CN': 'h) 账户持有人同意并能够承担使用本服务造成的损失风险，OKBET不承担任何损失责任；',
    'en-US': 'h) The account holder agrees and can bear the risk of loss caused by using this service, OKBET does not bear any risk for its loss;',
  },
  accountRegistrationItem9: {
    'zh-CN': 'i) 账户持有人所有存款均非来自非法或犯罪活动；',
    'en-US': 'i) All of the account holder\'s deposit is not from illegal or criminal activities;',
  },
  accountRegistrationItem10: {
    'zh-CN': 'j) 账户持有人不得利用其OKBET账户从事任何非法活动，或允许他人使用其账户从事违反当地和OKBET规则的活动；',
    'en-US': 'j) The account holder must not engage in any illegal activities by using his/her OKBET account, or allow others to use its account to engage in any activities that violate both local and OKBET rules;',
  },
  accountRegistrationItem11: {
    'zh-CN': 'k) 账户持有人应妥善保管账户凭证包括密码，不得允许他人使用。如密码遗忘或丢失，OKBET客服部将在全面验证流程后协助设置新的安全信息；',
    'en-US': 'k) The account holder shall keep the account credentials including the password properly and must not allow others to use it. If the password has been forgotten or lost, the OKBET Customer Service Department will assist in setting up new security information after a thorough authentication process;',
  },
  accountRegistrationItem12: {
    'zh-CN': 'l) 账户持有人负责确保OKBET账户和登录信息的保密性。任何使用账户持有人用户名和密码进行的在线赌博将被视为有效；',
    'en-US': 'l) The account holder is responsible for ensuring the confidentiality of the OKBET account and login information. Any online gambling conducted with the account holder\'s username and password will be considered valid;',
  },
  accountRegistrationItem13: {
    'zh-CN': 'm) 使用OKBET服务、网站、设备、软件或相关信息时，账户持有人或访客不得妨碍其他会员享受OKBET提供的服务；',
    'en-US': 'm) When using OKBET services, websites, equipment, software, or related information, the account holder or a visitor must not hinder other members from enjoying the services that OKBET provides;',
  },
  accountRegistrationItem14: {
    'zh-CN': 'n) 严禁窃取其他会员的相关信息；',
    'en-US': 'n) Stealing any relevant information of other members is strictly prohibited;',
  },
  accountRegistrationItem15: {
    'zh-CN': 'o) 严禁上传或发布任何携带病毒的程序、文件或数据，影响网站设备、软件、服务等的性能；',
    'en-US': 'o) Uploading or publishing any virus-bearing programs, files, or data that affect the performance of the website equipment, software, services, etc. is strictly prohibited;',
  },
  accountRegistrationItem16: {
    'zh-CN': 'p) 账户持有人不得以任何形式尝试修改、反向编译、逆向工程或分解软件；',
    'en-US': 'p) The account holder shall not attempt to modify, reverse compile, reverse engineer, or disassemble the software in any form;',
  },
  accountRegistrationItem17: {
    'zh-CN': 'q) 账户持有人不得使用任何设备、自动设备、软件、程序或其他方法（类似于前述方法）妨碍或试图干扰网站提供的服务、设备、软件、URL、信息或任何交易的正常运行。严禁使用人工智能（包括无限制插件系统）连接服务器。所有客服操作必须由玩家通过OKBET程序界面执行；',
    'en-US': 'q) The account holder must not use any equipment, automatic equipment, software, programs, or other methods (similar to the aforementioned) to hinder or attempt to interfere with the normal operation of the services, equipment, software, URL, information, or any transaction provided by the website. Use of artificial intelligence, including the unrestricted plug-in system, is strictly forbidden to connect to the server. All customer service operations must be performed by the player through the use of OKBET program interface;',
  },
  accountRegistrationItem18: {
    'zh-CN': 'r) 账户持有人不得在网站或设备上向其他用户发布任何关于骚扰、侮辱、诽谤、威胁、淫秽和煽动种族不满的非法信息，或任何构成或鼓励犯罪行为、导致民事责任事件等的犯罪行为及其他相关非法信息；',
    'en-US': 'r) The account holder must not post any illegal information about harassment, insults, defamation, threats, obscenity, and incitement to racial dissatisfaction on the website or equipment or to other users, or any criminal behavior that constitutes or encourages criminal acts, or causes civil liability incidents, etc., and other related illegal information;',
  },
  accountRegistrationItem19: {
    'zh-CN': 's) 账户持有人不得发起或参与针对OKBET的调查、测验或大规模发布连锁信/垃圾邮件、邮件兜售等活动；',
    'en-US': 's) The account holder is not allowed to initiate or participate in investigations, quizzes, or mass release of chain letters/spam mails, mail peddling, and other activities aimed at OKBET;',
  },
  accountRegistrationItem20: {
    'zh-CN': 't) 账户持有人不能同时拥有多个账户。若OKBET发现客户有多个账户，公司有权取消其账户和投注。公司保留取消或关闭重复账户的权利，并有权限制客户仅保留其中一个账户；',
    'en-US': 't) The account holder cannot have multiple accounts at the same time. If OKBET finds that a customer has multiple accounts, the company has the right to cancel their accounts and place bets. The company reserves the right to cancel or close the duplicate account. The company reserves the right to restrict customers to keep only one of the accounts;',
  },
  accountRegistrationItem21: {
    'zh-CN': 'u) 账户持有人不得是OKBET提供投注的任何体育项目、比赛或联盟的职业选手；',
    'en-US': 'u) The account holder must not be a professional player in any sport, competition, or league where OKBET offers betting;',
  },
  accountRegistrationItem22: {
    'zh-CN': 'v) 账户持有人不得通过未经授权使用的卡进行存款或取款，也不得在禁止投注和赌博的司法管辖区使用卡；',
    'en-US': 'v) The account holder must not deposit nor withdraw through a Card which the Account Holder is not authorized to use and/or utilizing a Card in a jurisdiction in which betting and gaming are prohibited;',
  },
  accountRegistrationItem23: {
    'zh-CN': 'w) 账户持有人不得雇用或使用利用系统（包括机器、机器人、计算机、软件或其他自动化系统）设计或能够击败客户端应用和/或软件的人员；',
    'en-US': 'w) The account holder must not be employed or employs individuals who make use of a system (including machines, robots, computers, software, or any other automated system) designed to defeat or capable of defeating the Client Application and/or Software;',
  },
  accountRegistrationItem24: {
    'zh-CN': `x) 账户持有人不得拥有与${VITE_OFFICIAL_NAME}同属一个集团的其他法律实体的活跃账户；`,
    'en-US': `x) Account holders may not have active accounts with other legal entities that belong to the same group as ${VITE_OFFICIAL_NAME}.`,
  },
  accountRegistrationItem25: {
    'zh-CN': 'y) 账户持有人不得认为网站或服务具有冒犯性、令人反感、不公平或下流；并需保持其OKBET账户详细信息最新，包括：姓名、有效电子邮件地址、电话号码及OKBET要求的任何重要信息；',
    'en-US': 'y) The account holder must not find the Website or the Services offensive, objectionable, unfair, nor indecent; and to maintain his/her OKBET Account details up-to-date in terms of the following: first and last name, valid email address, phone number, and any vital information as required by OKBET;',
  },
  accountRegistrationItem26: {
    'zh-CN': 'aa) 账户持有人不得允许任何其他个人（包括未成年人）使用或重复使用其创建的OKBET账户，访问和/或使用网站的任何材料或信息，接受任何奖品，或访问和/或参与服务；',
    'en-US': 'aa) The account holder shall not allow any other individual, including any minor, to use or reuse its created OKBET Account, access and/or use any material or information from the Website, accept any Prize, or access and/or participate in the Services;',
  },
  accountRegistrationItem27: {
    'zh-CN': 'bb) 账户持有人不得向其他玩家出售、转让或获取账户。资金不能在OKBET账户之间转移；',
    'en-US': 'bb) The account holder must not sell, transfer, or acquire an account from or to other players. Funds cannot be transferred between OKBET accounts;',
  },
  accountRegistrationItem28: {
    'zh-CN': 'cc) 玩家声明其提供的信息真实准确。他们理解任何信息伪造可能导致法律诉讼并需承担责任；',
    'en-US': 'cc) The player declares that the information they have provided is true and accurate to the best of their knowledge. They understand that any falsification of information may result in legal action and will be held accountable;',
  },
  accountRegistrationItem29: {
    'zh-CN': 'dd) 账户持有人不得通过使用代理服务器或任何干扰使用设备IP地址的工具访问网站，或采取任何措施阻止OKBET识别用于访问网站设备的正确IP地址；',
    'en-US': 'dd) The account holder is not allowed to access the website through the use of a proxy server or any tool that interferes with the IP address of the device being used, or to take any measure that will prevent OKBET from identifying the correct IP address of the device being used to access the website;',
  },
  accountRegistrationItem30: {
    'zh-CN': 'ee) 账户持有人同意适用上述一般条款，并同意若对客户行为有任何怀疑或违规，OKBET有权在不事先通知或解释的情况下向相关当局报告；',
    'en-US': 'ee) The account holder agrees with the application of the above general terms and agrees that if there is any suspicion or violation of the customer\'s behavior, OKBET has the right to report to the relevant authorities without prior notice or explanation;',
  },
  accountRegistrationItem31: {
    'zh-CN': 'ff) 最低初始存款设为500菲律宾比索。作为对玩家的礼遇，OKBET将通过向玩家的OKBET账户提供信用额度来承担任何交易费用。',
    'en-US': 'ff) The minimum sucheeding deposit is set at Php 500. As courtesy to its players, OKBET shall bear the cost of any transaction fees through providing a credit in the player\'s OKBET account.',
  },
  accountRegistrationItem32: {
    'zh-CN': 'gg) 每笔交易最低提款金额设为300菲律宾比索，普通账户每日提款限额设为1,250,000菲律宾比索。OKBET将通过向玩家的OKBET账户提供信用额度来承担每天最多3次提款请求的交易费用，否则所有后续提款将收取适用的交易费用。',
    'en-US': 'gg) Minimum withdrawal amount is set at Php 300 per transaction and the daily withdrawal limit for normal accounts is set at Php 1,250,000. OKBET will shoulder the transaction fee of up to 3 withdrawal requests per day through providing a credit in the player\'s OKBET account, otherwise all succeeding withdrawals are subject to applicable transaction fees.',
  },
  accountRegistrationItem33: {
    'zh-CN': 'hh) 每笔提款请求将实时记入收款人账户。但如果资金未立即到账，将在1至3个银行工作日内进行调查。若提款被退回，请核实账户是否已达到收款限额。对于50,000菲律宾比索或以上的提款，处理至少需要24小时，可能需要2至3个银行工作日。如果交易在此期限后仍处于待处理状态，将启动调查以确定最终状态。',
    'en-US': 'hh) Every withdrawal request will be credited to the recipient in real-time. However, if the funds are not received immediately, an investigation will be conducted within 1 to 3 banking days. In case the withdrawal is returned, please verify if the account has reached its collection limit. For withdrawals of Php 50,000 or more, processing will take at least 24 hours and may require 2 to 3 banking days. If the transaction remains pending beyond this period, an investigation will be initiated to determine the final status.',
  },
  accountRegistrationItem34: {
    'zh-CN': 'ii) 被发现不符合游戏资格的玩家账户中的资金或信用额度将意味着该资金/信用额度被没收归政府所有。',
    'en-US': 'ii) Funds or credits in the account of the player who is found ineligible to play shall mean forfeiture of said funds/credits in favor of the Government.',
  },

  accountManagement: {
    'zh-CN': '账户管理',
    'en-US': 'Account Management',
  },
  accountManagementDesc1: {
    'zh-CN': 'OKBET保留自行决定并始终拥有的权利：',
    'en-US': 'OKBET reserves the right at its own discretion and at all times, to:',
  },
  accountManagementDesc2: {
    'zh-CN': '1. 拒绝开设OKBET账户和/或关闭或暂停现有OKBET账户，无需任何解释。',
    'en-US': '1. Decline to open an OKBET Account and/or to close or suspend an existing OKBET Account without any explanation whatsoever.',
  },
  accountManagementDesc3: {
    'zh-CN': '2. 拒绝接受存款，无需任何解释。',
    'en-US': '2. Decline to accept deposits without any explanation whatsoever.',
  },
  accountManagementDesc4: {
    'zh-CN': '3. 要求提供文件以验证：',
    'en-US': '3. Request documents to verify:',
  },
  accountManagementDesc5: {
    'zh-CN': 'a. 账户持有人的身份，',
    'en-US': 'a. The identity of the Account Holder,',
  },
  accountManagementDesc6: {
    'zh-CN': 'b. 其使用特定卡或任何支付方式的授权；和/或',
    'en-US': 'b. His/her authorization to use a specific Card or any payment method; and/or',
  },
  accountManagementDesc7: {
    'zh-CN': 'c. 账户持有人提供的其他事实和信息。',
    'en-US': 'c. Other facts and information provided by the Account Holder.',
  },
  accountManagementDesc8: {
    'zh-CN': '4. 此类请求可在任何给定时刻提出，OKBET保留在调查期间暂停账户的权利。',
    'en-US': '4. Such request may be made at any given moment and OKBET reserves the right to suspend an account pending investigation.',
  },
  accountManagementDesc9: {
    'zh-CN': '5. 在不事先通知的情况下，将有关账户持有人的数据转让和/或授权给由GAVIN VENTURES, Inc.最终管理和控制的任何其他法律实体，在任何国家，前提是OKBET保证所述数据始终按照适用法律、数据保护法和/或类似规定进行转让和管理。',
    'en-US': '5. Transfer and/or license, without prior notice, data regarding an Account Holder to any other legal entity, in any country, ultimately managed and controlled by GAVIN VENTURES, Inc., subject to OKBET guaranteeing that the said data at all times is transferred and managed in accordance with applicable laws, data protection acts and/or similar.',
  },
  accountManagementDesc10: {
    'zh-CN': '6. 在不事先通知的情况下，将有关账户持有人的权利和责任转让和/或授权给由GAVIN VENTURES, Inc.最终管理和控制的任何其他法律实体，在任何国家，前提是OKBET保证履行责任。',
    'en-US': '6. Transfer and/or license, without prior notice, the rights and liabilities regarding an Account Holder to any other legal entity, in any country, ultimately managed and controlled by GAVIN VENTURES, Inc., subject to OKBET guaranteeing the liabilities being honored.',
  },
  accountManagementDesc11: {
    'zh-CN': '7. 按照关于此类资金现金管理的一般接受准则持有和管理属于账户持有人的资金；这可能包括委托金融机构和/或支付解决方案提供商以账户持有人的名义和/或为其利益持有资金。',
    'en-US': '7. Hold and manage funds belonging to Account Holders in accordance with generally accepted guidelines for cash management regarding such funds; this may include a Financial Institution and/or a Payment Solution Provider being entrusted to hold funds in the name of and/or for the benefit of Account Holders.',
  },
  accountManagementDesc12: {
    'zh-CN': 'a. 在以下情况下没收和/或没收OKBET账户上的可用资金和/或拒绝兑现索赔：',
    'en-US': 'a. Forfeit and/or confiscate funds available on an OKBET Account and/or refuse to honor a claim, in the event that, directly or indirectly:',
  },
  accountManagementDesc13: {
    'zh-CN': '(i) 违反了OKBET规则；和/或',
    'en-US': '(i) The OKBET Rules have been violated; and/or',
  },
  accountManagementDesc14: {
    'zh-CN': '(ii) 与投注事件和/或OKBET账户操作有关的其他未经授权的活动（例如但不限于违反法律或其他法规、侵犯第三方权利、欺诈和作弊）',
    'en-US': '(ii) Other unauthorized activities have occurred in connection with a betting event and/or the operation of an OKBET Account (such as, but not limited to, breach of the law or other regulations, breach of a third party\'s rights, fraud, and cheating)',
  },
  accountManagementDesc15: {
    'zh-CN': '• 作弊',
    'en-US': '• Cheating',
  },
  accountManagementDesc16: {
    'zh-CN': '• 不规则游戏，如等额、零或低保证金投注或对冲投注以规避奖金周转要求',
    'en-US': '• Irregular gaming such as equal, zero or low margin bets or hedge betting in order to circumvent the bonus turnover requirement',
  },
  accountManagementDesc17: {
    'zh-CN': '• 通过共享同一设备和/或使用任何其他相关指标（如IP地址和共享的共同投注行为）进行未经授权的账户接管。',
    'en-US': '• Unauthorized account takeover which is made through sharing the same device and/or using any other related indicators such as IP address and shared common betting behavior.',
  },
  accountManagementDesc18: {
    'zh-CN': '• 雇用或使用系统（包括机器、机器人、计算机、软件或任何其他自动化系统）设计或能够击败客户端应用和/或软件。',
    'en-US': '• Employing or using a system (including machines, robots, computers, software or any other automated system) designed to defeat or capable of defeating the Client Application and/or Software.',
  },
  accountManagementDesc19: {
    'zh-CN': '• 其他直接违反OKBET使用条款的方法。',
    'en-US': '• Other methods which are in direct violation of the OKBET Terms of Use.',
  },
  accountManagementDesc20: {
    'zh-CN': '9. 在验证这些资金令人满意之前，拒绝和/或撤销未使用或以其他方式未使用的存款的提款。',
    'en-US': '9. Decline and/or reverse the withdrawal of unspent or otherwise unused deposits until the verification of these funds is deemed satisfactory.',
  },
  accountManagementDesc21: {
    'zh-CN': '10.通讯选择加入',
    'en-US': '10.Communications Opt-in',
  },
  accountManagementDesc22: {
    'zh-CN': '为提升您的体验，OKBET可能会向您发送通讯材料。这些包括但不限于行政通知、法律要求的更新，以及关于项目、活动和促销优惠的信息。',
    'en-US': 'To enhance your experience, OKBET may send you communication materials. These include, but are not limited to, administrative notices, legally mandated updates, as well as information on projects, campaigns, and promotional offers.',
  },
  accountManagementDesc23: {
    'zh-CN': '通讯渠道：',
    'en-US': 'Channels of Communication:',
  },
  accountManagementDesc24: {
    'zh-CN': '• 电子邮件',
    'en-US': '• Email',
  },
  accountManagementDesc25: {
    'zh-CN': '• 短信',
    'en-US': '• SMS',
  },
  accountManagementDesc26: {
    'zh-CN': '• 电话',
    'en-US': '• Phone Calls',
  },
  accountManagementDesc27: {
    'zh-CN': '社交媒体（Facebook、Instagram、Twitter等）选择加入即表示您同意通过上述渠道接收这些材料。',
    'en-US': 'Social Media (Facebook, Instagram, Twitter, and others) By opting in, you agree to receive these materials through the above channels.',
  },

  ////
  accountDormancy: {
    'zh-CN': '账户休眠',
    'en-US': 'Account Dormancy',
  },
  accountDormancyDesc1: {
    'zh-CN': '若OKBET账户根据上述条款被暂停，且已暂停超过6个月，或OKBET账户自上次登录时间起休眠超过6个月，OKBET保留权利每月收取管理费，直至账户余额为零。从暂停账户中扣除的管理费归OKBET所有，并不再构成账户持有人资金的一部分。',
    'en-US': 'If the OKBET account has been suspended in accordance with the clauses above, and has already been suspended for more than 6 months or an OKBET account has been dormant for more than 6 months since the last login time, OKBET reserves the right to charge a monthly administrative fee until the account balance reaches zero. The administrative fee deducted shall vest in OKBET on deduction from the Suspended Account and will cease to form part of the Account Holder\'s funds.',
  },
  accountDormancyDesc2: {
    'zh-CN': '一旦账户余额为零，OKBET保留关闭暂停账户的权利。若账户无资金，将不收取费用并立即关闭。',
    'en-US': 'OKBET reserves the right to close the Suspended Account once the account reaches zero balance. If there are no funds on the account, the account will not be charged and it will be closed immediately.',
  },
  accountDormancyDesc3: {
    'zh-CN': 'OKBET保证并始终表示：',
    'en-US': 'OKBET warrants and represents at all times to:',
  },
  accountDormancyDesc4: {
    'zh-CN': '• 以安全适当的方式管理属于账户持有人的资金；和/或',
    'en-US': '• Manage funds belonging to Account Holders in a secure and appropriate manner; and/or',
  },
  accountDormancyDesc5: {
    'zh-CN': '• 按照适用法律、数据保护法和/或类似规定管理有关账户持有人的数据；',
    'en-US': '• Manage data regarding an Account Holder in accordance with applicable laws, data protection acts and/or similar;',
  },
  accountDormancyDesc6: {
    'zh-CN': '• 不向客户提供任何进行客户间资金转移的应急措施。',
    'en-US': '• Not offer contingencies to customers to proceed to any fund transfer between customers\' accounts.',
  },

  //////

  bettingRules: {
    'zh-CN': '投注规则和条例',
    'en-US': 'Betting Rules and Regulations',
  },
  bettingRulesDesc1: {
    'zh-CN': '1. OKBET网站上的所有投注必须遵守相关游戏规则和本协议。',
    'en-US': '1. All bets on the OKBET website must comply with relevant game rules and this agreement.',
  },
  bettingRulesDesc2: {
    'zh-CN': '2. 在公布赔率和/或结果时出现的任何印刷错误或无意的人为错误，OKBET不承担后果责任，并有权取消相关投注。',
    'en-US': '2. Any typographical error or unintentional human error in the announcement of the odds and/or result, OKBET is not responsible for the consequences, and OKBET has the right to cancel related bets.',
  },
  bettingRulesDesc3: {
    'zh-CN': '3. 在任何情况下，OKBET保留拒绝任何投注的权利，无需给出解释。',
    'en-US': '3. Under any circumstances, OKBET reserves the right to refuse any bet without giving an explanation.',
  },
  bettingRulesDesc4: {
    'zh-CN': '4. 只有通过OKBET网站或设备符合条款和协议的投注才被视为有效。无论结果如何，任何其他形式的投注（通过信件、邮件、传真或其他方式）将不被接受或视为无效。投注单在屏幕上出现确认消息时即生效。',
    'en-US': '4. Only bets that comply with the terms and agreements through the OKBET website or equipment will be considered valid. Regardless of the result, any other forms of betting (by letter, mail, fax, or other means) will not be accepted or deemed invalid. The bet slip takes effect as soon as the confirmation message appears on the screen.',
  },
  bettingRulesDesc5: {
    'zh-CN': '5. 账户持有人有责任了解比赛比分和所有相关比赛信息。建议客户在下注前核实比赛状态。',
    'en-US': '5. It is the account holder\'s responsibility to be aware of the match score and all relevant match information. It is advised that the customer verify the match status before placing a bet.',
  },
  bettingRulesDesc6: {
    'zh-CN': '6. 账户持有人承认，网站上提供的当前比分、经过时间和其他数据虽然来自第三方提供的"实时"信息流，但存在时间延迟和/或不准确，任何基于此数据的投注完全由客户自行承担风险。OKBET按原样提供此数据，不保证其准确性、完整性或及时性，也不对客户因依赖此数据而遭受的任何损失（直接或间接）承担责任。',
    'en-US': '6. The account holder acknowledges that the current score, time elapsed, and other data provided on the site, while coming from a "live" feed provided by a third party, is subject to a time delay and/or may be inaccurate, and that any bet placed based on this data is entirely at the customer\'s own risk. OKBET provides this data as-is with no warranty as to the accuracy, completeness, or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by the customer as a result of his reliance on it.',
  },
  bettingRulesDesc7: {
    'zh-CN': '7. 所有投注在满足以下条件时被视为有效：用户名和密码输入正确，且账户余额充足。',
    'en-US': '7. All bets are considered valid if they meet the following conditions: the username and password are entered correctly, and the account balance is sufficient.',
  },
  bettingRulesDesc8: {
    'zh-CN': '8. 账户持有人对其账户安全负责，这包括通过其账户发生的所有交易和行为，无论交易是否经过授权。',
    'en-US': '8. The account holder is responsible for the security of his account, and this includes all transactions and behaviors that occur through his/her account, regardless of whether the transaction is authorized or unauthorized.',
  },
  bettingRulesDesc9: {
    'zh-CN': '9. 如果提供的投注信息正确，账户持有人是唯一对此投注负责的人。一旦客户端应用确认投注，投注不能取消、撤回或更改，投注单将作为投注的有效证据。',
    'en-US': '9. If the supplied betting information is correct, the account holder is the only person responsible for this bet. Once the client application confirms the bet, the bet cannot be cancelled, withdrawn, or changed, and the bet slip will be regarded as the valid evidence of the bet.',
  },
  bettingRulesDesc10: {
    'zh-CN': '10. OKBET输入的所有投注记录将存储在OKBET交易数据库软件中，并将随时用作任何交易的有效依据。',
    'en-US': '10. All betting records entered by OKBET will be stored in the OKBET transaction database software and will be used as a valid basis for any transaction at any time.',
  },
  bettingRulesDesc11: {
    'zh-CN': '11. 所有在OKBET客户账户交易记录中显示确认状态的投注均被视为公司的有效投注。',
    'en-US': '11. All bets that show confirmed status in the transaction records of OKBET customer accounts are considered valid bets by the company.',
  },
  bettingRulesDesc12: {
    'zh-CN': '12. 除现场投注外，OKBET有权取消比赛预定开始时间后进行的投注。',
    'en-US': '12. Except for live betting, OKBET has the right to cancel bets placed after the scheduled start of the game.',
  },
  bettingRulesDesc13: {
    'zh-CN': '13. 所有投注时比赛结果已知的投注将被视为无效。OKBET保留取消此类投注的权利。',
    'en-US': '13. All bets for which the result of the match is already known at the time of betting will be considered invalid. OKBET reserves the right to cancel such bets.',
  },
  bettingRulesDesc14: {
    'zh-CN': '14. 网站上显示的比赛信息（比赛开始时间、红牌、比分或其他相关信息）仅供参考。',
    'en-US': '14. The event information (starting time of the event, red card, score, or other related information) displayed on the website is for reference only.',
  },
  bettingRulesDesc15: {
    'zh-CN': '比赛结果在比赛结束后确认，除非相关体育或赛事规则另有说明。对于比赛结束后72小时内已结算的投注，OKBET将不承认对结果进行的任何修改或变更。OKBET仅在72小时内纠正无意的人为错误或错误结果。',
    'en-US': 'The results of the event are confirmed after the event, unless otherwise stated in the relevant sport or event rules. OKBET will not recognize any amendments or changes made to results for bets that have already been settled 72 hours after the event ended. OKBET only corrects unintentional human errors or incorrect results within a period of 72 hours.',
  },
  bettingRulesDesc16: {
    'zh-CN': '15. 如果比赛场地变更，在原地点进行的所有投注将被取消，中立场地比赛仍被视为有效。',
    'en-US': '15. If the venue of the event changes, all bets placed at the original location will be cancelled, except for neutral ground events which will still be considered valid.',
  },
  bettingRulesDesc17: {
    'zh-CN': '16. 比赛的赢家或输家将根据相关规则在比赛结束后确认。',
    'en-US': '16. The winner or loser of the game will be confirmed after the end of the game in accordance with relevant rules.',
  },
  bettingRulesDesc18: {
    'zh-CN': '17. OKBET不承认中断的比赛和有争议的提议。',
    'en-US': '17. OKBET does not recognize interrupted matches and controversial proposals.',
  },
  bettingRulesDesc19: {
    'zh-CN': '18. 如果比赛中断并在初始开球后48小时内继续，所有未结算的投注将按最终结果结算。否则，所有未决定的投注视为无效。',
    'en-US': '18. If a match is interrupted and continued within 48 hours after the initial kick-off, all open bets will be settled with the final result. Otherwise, all undecided bets are considered void.',
  },
  bettingRulesDesc20: {
    'zh-CN': '19. 如果投注报价中有无效选项，投注将根据剩余有效选项进行调整和结算。',
    'en-US': '19. If there is an invalid option in the bet offer, the bet will be adjusted and settled according to the remaining valid options.',
  },
  bettingRulesDesc21: {
    'zh-CN': '20. 账户持有人知道并接受所有赔率和市场线不断变化，仅在投注时确定。OKBET保留自行和绝对酌情权随时更改投注类型、市场或赛事的赔率、价格或任何信息的权利。',
    'en-US': '20. The account holder knows and accepts that all odds and market lines are constantly changing and will only be determined at the moment of betting. OKBET reserves the right, at its sole and absolute discretion, to change the odds, prices, or any information on a bet type, market, or event at any time.',
  },
  bettingRulesDesc22: {
    'zh-CN': '21. OKBET同样保留自行决定在任何时候使任何受影响的投注无效或拒绝的权利，或在错误、遗漏或错误显示投注类型、市场或赛事的错误赔率、价格或任何信息时纠正错误。',
    'en-US': '21. OKBET likewise reserves the right at its sole discretion to either void or reject any affected bets at any time or to correct any error when by error, omission, or mistake the incorrect odds, prices, or any information on a bet type, market, or event are displayed.',
  },
  bettingRulesDesc23: {
    'zh-CN': '22. 如果玩家/队伍显示不正确，OKBET保留使投注无效的权利。',
    'en-US': '22. If the players/teams are displayed incorrectly, OKBET reserves the right to void betting.',
  },
  bettingRulesDesc24: {
    'zh-CN': '23. 如果市场以错误比分或错误比赛状态保持开放，对价格有重大影响，OKBET保留使投注无效的权利。',
    'en-US': '23. If markets remain open with an incorrect score or incorrect match status, which has a significant impact on the prices, OKBET reserves the right to void betting.',
  },
  bettingRulesDesc25: {
    'zh-CN': '24. 如果系统中存在任何技术问题，OKBET保留在交易恢复且技术问题解决后手动将待处理投注状态更改为"已确认"的权利。届时，账户余额将进行调整以反映会员当时的投注。',
    'en-US': '24. If there are any technical problems in the system, OKBET reserves the right to manually change the status of a pending bet to "confirmed" when the transaction resumes and as soon as the technical problem has been resolved. At that time, the account balance will be adjusted to reflect the member\'s betting at that time.',
  },
  bettingRulesDesc26: {
    'zh-CN': '25. 在同一时间对同一赛事进行的多次投注将不被承认。',
    'en-US': '25. Multiple bets placed on the same event at the same time will not be recognized.',
  },
  bettingRulesDesc27: {
    'zh-CN': '26. OKBET对任何相关投注和交易拥有最终决定权。',
    'en-US': '26. OKBET has the final decision on any related betting and transactions.',
  },
  bettingRulesDesc28: {
    'zh-CN': '27. 账户持有人完全接受扑克游戏中系统软件的随机洗牌，并接受其他随机游戏交易。',
    'en-US': '27. The account holder fully accepts the random shuffling of the system software in the poker game, and accepts other random game transactions.',
  },
  bettingRulesDesc29: {
    'zh-CN': '28. 账户持有人同意并接受WAP网络链接并不总是稳定。公司仅承认系统中记录的投注，OKBET对任何错放的投注不承担责任。',
    'en-US': '28. The account holder agrees and accepts that WAP network links are not always stable. The company only recognizes the bets recorded in the system, and OKBET is not responsible for any misplaced bets.',
  },
  bettingRulesDesc30: {
    'zh-CN': '29. 除非在投注报价中列出，或在体育特定规则中另有说明，否则所有投注应仅考虑"常规时间"或"全场时间"结束时的结果。"常规时间"或"全场时间"根据各自管理协会发布的官方规则解释定义。例如，足球的全场时间规定为90分钟，包括伤停补时。若管理协会在赛事开始前决定规定该赛事以不同时长进行，这将被视为赛事的官方规则（例如，以3 x 30分钟或2 x 40分钟形式进行的足球比赛）。尽管如此，此类情况仅限于"常规"比赛时间，不包括任何延长，如加时赛或额外时间，除非明确说明。',
    'en-US': '29. Unless listed either in conjunction with the bet offer, or else in the Sport Specific rules, all bets should be considered valid for the result at the end of the "Regular Time" or "Full Time" only. "Regular Time" or "Full Time" is defined as interpreted by the official rules published by the respective governing association. For example, in Football, full time is stipulated to be 90 minutes including injury time. Should the governing association decide to stipulate, before the start of the event, that the said event is to be played over a different duration, this will be treated as being the official rules for the event (for example, football matches played with 3 x 30 minutes or 2 x 40 minute formats). Nonetheless, such occurrence is limited to the "regular" playing time and does not include any prolongation such as extra time or overtime, unless explicitly stated.',
  },
  bettingRulesDesc31: {
    'zh-CN': '30. "现场投注"是指在正在进行的比赛或赛事中可以投注。如果无法投注或实时比分更新不正确，OKBET不承认或承担任何责任。账户持有人始终有责任了解比赛及其周围事件，如当前比分、进展和比赛完成前剩余时间。OKBET对现场投注时间表的更改或现场投注服务的中断不承担任何责任。',
    'en-US': '30. "Livebetting" is where it is possible to bet during an ongoing match or event. OKBET does not acknowledge or accept any liability whatsoever if it is not possible to place a bet or the live score update is not correct. At all times it is the Account Holder\'s responsibility to be aware of the match and the events surrounding it such as the current score, its progression, and how much time remains before the match is completed. OKBET does not accept any liability for changes to the Livebetting schedule or interruption of the Livebetting service.',
  },
  bettingRulesDesc32: {
    'zh-CN': '31. 一旦发现欺诈、假球或操纵比赛的证据，OKBET保留使投注无效或在任何调查结果出来前扣留付款的权利。',
    'en-US': '31. Whenever there\'s evidence of fraud, game-fixing or rigging, OKBET reserves the right to make bets void or withhold payment pending the outcome of any investigation.',
  },
  //////

  eventSpecificRules: {
    'zh-CN': '赛事特定规则',
    'en-US': 'Event-specific Rules',
  },
  soccer: {
    'zh-CN': '足球',
    'en-US': 'Soccer',
  },
  soccerRule1: {
    'zh-CN': '• 除非另有说明，所有足球投注将基于预定的"90分钟"比赛进行结算。"90分钟"比赛包括任何伤停补时。这不包括加时赛、金球制、点球大战或比赛后被官方裁判或相关管理机构更改的比赛结果。',
    'en-US': '• Unless otherwise stated, all Football bets will be settled based on the scheduled "90 minutes" play. The term "90 minutes" play includes any stoppage or injury time. This does not include the extra-time, golden goals, penalty shoot-outs, or a match result which was altered by the official referee or the relevant governing authority after the match.',
  },
  soccerRule2: {
    'zh-CN': '• 所有现场投注将基于预定的"90分钟"比赛结束时的结果进行结算，除非投注类型的个别规则中另有说明。',
    'en-US': '• All In Play bets will be settled based on the outcome at the end of the scheduled "90 minutes" play, unless otherwise stated in the individual rule for the bet type.',
  },
  soccerRule3: {
    'zh-CN': '• "45分钟"比赛包括上半场比赛的任何伤停补时。这不包括加时赛、金球制、点球大战或比赛后被官方裁判或相关管理机构更改的比赛结果。',
    'en-US': '• The term "45 minutes" play includes any stoppage or injury time for the first half of play. This does not include the extra-time, golden goals, penalty shoot-outs, or a match result which was altered by the official referee or the relevant governing authority after the match.',
  },
  soccerRule4: {
    'zh-CN': '• 对于某些比赛或友谊赛，预定比赛时间为80分钟（2 x 40分钟半场），投注将基于预定时间结算。',
    'en-US': '• For certain competitions or friendly matches where the scheduled play is 80 Minutes (2 x 40 minute halves), bets will be settled based on the scheduled time.',
  },
  soccerRule5: {
    'zh-CN': '• 若有青年或友谊比赛设定为70分钟（2 x 35分钟半场）或更短时间，公司将在比赛开始前宣布。否则，这些比赛的所有投注将被视为无效。',
    'en-US': '• Should there be any youth or friendly matches where play is set for 70 minutes (2 x 35 minute halves) or less, the company will announce before the start of the match. Otherwise, all bets on these matches will be considered void.',
  },
  soccerRule6: {
    'zh-CN': '• 如果比赛在比赛期间的任何时间暂停或推迟，且未在36小时内恢复，所有投注将被视为无效，除非在以下或个别投注类型规则中明确说明。',
    'en-US': '• If the match is suspended or postponed at any time during play, and fails to resume within 36 hours, all bets will be considered void, unless explicitly stated below or in the individual Bet Type rules.',
  },
  soccerRule7: {
    'zh-CN': '• 如果比赛宣布放弃，所有投注将被视为无效，除非在以下或个别投注类型规则中明确说明。如果比赛在上半场放弃，所有上半场投注视为无效。如果比赛在下半场放弃，所有下半场投注视为无效，除非个别投注类型规则另有说明。所有上半场投注仍有效。',
    'en-US': '• If the match is declared abandoned, all bets will be considered void, unless explicitly stated below or in the individual Bet Type rules. If a match is abandoned during the 1st half, all 1st half bets are considered void. If a match is abandoned during the 2nd half, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid.',
  },
  soccerRule8: {
    'zh-CN': '• 乌龙球计入结算目的，除非个别投注类型规则另有说明。如果预定场地变更，若原客队现在为主队，所有投注将被视为无效。',
    'en-US': '• Own goals are counted for settlement purposes, unless otherwise stated in the individual bet type rules. If the scheduled venue is changed, all bets will be considered void if the original away team is now the home team.',
  },
  soccerRule9: {
    'zh-CN': '• 对于国际比赛，只要场地变更在同一国家内，所有投注视为有效。',
    'en-US': '• For International matches, as long as the change in venue is within the same country, all bets are considered valid.',
  },
  soccerRule10: {
    'zh-CN': '• 对于国际比赛，只要场地在比赛原定举行的国家或地区内，所有投注视为有效。',
    'en-US': '• For International competitions, as long as the venue is within the country or countries where the competition was originally scheduled to be held, all bets are considered valid.',
  },
  soccerRule11: {
    'zh-CN': '10. 如果比赛开始时间未知（例如由于电视转播安排），我们保留在比赛开始前72小时内调整预定开始时间的权利。',
    'en-US': '10. If the start time of the match is unknown (e.g., due to television broadcast arrangements), we reserve the right to adjust the scheduled start time within 72 hours before the match starts.',
  },
  soccerRule12: {
    'zh-CN': '11. 比赛必须以双方人数相同进行，所有投注才有效。',
    'en-US': '11. The match must be played with teams of equal numbers for all bets to be valid.',
  },
  soccerRule13: {
    'zh-CN': '如果我们认为其他场地变更情况可能影响赛事结果，我们保留使所有投注无效的权利。',
    'en-US': 'We reserve the right to void all bets if we think other changes of venue scenarios could affect the outcome of the event.',
  },
  soccerRule14: {
    'zh-CN': '若比赛确切开始时间未知（例如由于电视安排），我们保留在官方开始时间72小时内调整原定时间的权利。',
    'en-US': 'Should the exact start time of a match be unknown (e.g., due to TV scheduling), we reserve the right to adjust the original stated time, once it is within 72 hours of the official start time.',
  },
  soccerRule15: {
    'zh-CN': '双方必须以相同人数开始比赛，所有投注才被视为有效。',
    'en-US': 'Both teams must start a match with the same number of players for all bets to be considered valid.',
  },
  basketball: {
    'zh-CN': '篮球',
    'en-US': 'Basketball',
  },
  basketballRule1: {
    'zh-CN': '1. 如果预定场地变更，所有投注将被视为无效。',
    'en-US': '1. If the scheduled venue is changed, all bets will be considered void.',
  },
  basketballRule2: {
    'zh-CN': '2. 如果比赛在上半场放弃，所有上半场投注视为无效。如果比赛在下半场放弃，所有下半场投注视为无效，除非个别投注类型规则另有说明。所有上半场投注仍有效。',
    'en-US': '2. If a game is abandoned during the 1st half, all 1st half bets are considered void. If a game is abandoned during the 2nd half, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid.',
  },
  basketballRule3: {
    'zh-CN': '3. 对于节/半场投注，该节必须完成投注才有效，除非在以下或个别投注类型规则中明确说明。',
    'en-US': '3. For Quarter / Half Betting, the period must be completed for bets to be valid, unless explicitly stated below or in the individual Bet Type rules.',
  },
  basketballRule4: {
    'zh-CN': '4. NCAA场地规则：请注意网站上标示的"主队"和"客队"场地仅供参考。无论场地变更为"主队"场地、"客队"场地或"中立"场地，投注均成立。',
    'en-US': '4. NCAA Venue Rule: Please note that the "Home" and "Away" venue indicated on the website is for reference only. Bets will stand regardless of the change of venue, be it to the "Home" team\'s venue, the "Away" team\'s venue, or to a "Neutral" venue.',
  },
  basketballRule5: {
    'zh-CN': '5. 如果比赛在预定时间前开始，只有在比赛开始前进行的投注被视为有效。比赛开始后进行的投注视为无效。这不包括现场投注类型。',
    'en-US': '5. If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.',
  },
  basketballRule6: {
    'zh-CN': '6. 加时赛包括在任何比赛、下半场投注或两回合平局的比赛中，除非另有说明。第四节投注不包括加时赛。',
    'en-US': '6. Overtime is included for any Game, 2nd Half betting, or 2-leg tied match, unless otherwise stated. 4th Quarter betting does not include overtime.',
  },
  basketballRule7: {
    'zh-CN': '7. 对于3x3篮球，结算将基于官方比赛规则，特别是街头篮球和Big 3比赛版本的体育项目。',
    'en-US': '7. For 3 x 3 Basketball, settlement will be based on official competition rules, especially for Street ball and Big 3 match versions of the sport.',
  },
  tableTennis: {
    'zh-CN': '乒乓球',
    'en-US': 'Table Tennis',
  },
  tableTennisRule1: {
    'zh-CN': '1. 所有投注仅在比赛完成时才被视为有效，除非另有说明。',
    'en-US': '1. All bets will be considered valid only when the match is finished, unless otherwise stated.',
  },
  tableTennisRule2: {
    'zh-CN': '2. 如果比赛的预定时长缩短或获胜点数增加，所有投注将被取消。',
    'en-US': '2. If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be voided.',
  },
  tableTennisRule3: {
    'zh-CN': '3. 如果比赛推迟或暂停，只要比赛完成，所有投注仍被视为有效。',
    'en-US': '3. If a match is postponed or suspended, all bets are still considered valid if the match is completed.',
  },
  tableTennisRule4: {
    'zh-CN': '4. 如果比赛提前开始，只有比赛开始前的交易被视为有效。比赛开始后的交易视为无效（不包括现场投注类型）。',
    'en-US': '4. If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).',
  },
  tennis: {
    'zh-CN': '网球',
    'en-US': 'Tennis',
  },
  tennisRule1: {
    'zh-CN': '1. 所有投注仅在比赛完成时才被视为有效，除非在以下或个别投注类型规则中明确说明。',
    'en-US': '1. All bets will be considered valid only when the match is finished, unless explicitly stated below or in the individual Bet Type rules.',
  },
  tennisRule2: {
    'zh-CN': '2. 如果选手未能参加任何锦标赛或比赛，所有关于该选手的投注（不包括最终市场）将被取消。',
    'en-US': '2. If a player fails to compete in any tournament or match, all bets on that player (excluding Outright Markets) will be voided.',
  },
  tennisRule3: {
    'zh-CN': '3. 如果选手或组合在比赛完成前退赛或被取消资格，所有关于该比赛的投注将被取消，除非在以下或个别投注类型规则中明确说明。',
    'en-US': '3. If a player or pairing retires or is disqualified during a match before its completion, all bets for the match will be voided, unless explicitly stated below or in the individual Bet Type rules.',
  },
  tennisRule5: {
    'zh-CN': '5. 如果比赛推迟或暂停，只要比赛完成，所有投注仍被视为有效。',
    'en-US': '5. If a match is postponed or suspended, all bets are still considered valid if the match is completed.',
  },
  tennisRule6: {
    'zh-CN': '6. 对于比赛中个别局或盘的市场，局或盘中退赛或取消资格将使该局或盘市场及所有个别局或盘市场无效，除非在个别投注类型规则中明确说明。',
    'en-US': '6. Where markets are offered on individual games or sets within a match, a retirement or disqualification during a game or set will render bets on that game or set market and all individual game or set markets void, unless explicitly stated in the individual Bet Type rules.',
  },
  tennisRule7: {
    'zh-CN': '7. 如果比赛提前开始，只有比赛开始前的交易被视为有效。比赛开始后的交易视为无效（不包括现场投注类型）。"超级抢七"被视为一局。',
    'en-US': '7.If a match starts before schedule, only the transactions before the match starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types). A "Super Tie-Break" is considered as a game.',
  },
  tennisRule8: {
    'zh-CN': '8. "超级抢七"被视为一局，当用于决定最后一盘时。',
    'en-US': '8. A "Super Tie-Break" is considered as a game, when used to decide a final set.',
  },
  tennisRule9: {
    'zh-CN': '9. 对于四大锦标赛（澳大利亚公开赛、美国公开赛、法国公开赛、温布尔登），比赛结果的确定方式为：',
    'en-US': '9. For the four championships (Australian Open, US Open, French Open, Wimbledon), the way to determine the result of the match is:',
  },
  tennisRule10: {
    'zh-CN': '10. 男子比赛：先赢得3盘的选手赢得比赛。',
    'en-US': '10.For men\'s match: the player, who wins 3 sets first, wins the match.',
  },
  tennisRule11: {
    'zh-CN': '11. 女子比赛：先赢得2盘的选手赢得比赛。',
    'en-US': '11.For women\'s match: the player, who wins 2 sets first, wins the match.',
  },
  volleyball: {
    'zh-CN': '排球',
    'en-US': 'Volleyball',
  },
  volleyballRule1: {
    'zh-CN': '1. 所有投注仅在比赛完成时才被视为有效，除非另有说明。',
    'en-US': '1. All bets will be considered valid only when the match is finished, unless otherwise stated.',
  },
  volleyballRule2: {
    'zh-CN': '2. 投注将基于在总共5盘中先赢得3盘的队伍结算。',
    'en-US': '2. Bets will be settled based on the team that wins the first 3 sets out of the total 5 sets played.',
  },
  volleyballRule3: {
    'zh-CN': '3. 如果比赛的预定时长缩短或获胜点数增加，所有投注将被取消。',
    'en-US': '3. If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be voided.',
  },
  volleyballRule4: {
    'zh-CN': '4. 如果比赛提前开始，只有比赛开始前的交易被视为有效。比赛开始后的交易视为无效（不包括现场投注类型）。',
    'en-US': '4. If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).',
  },

  /////

  tradingPolicy: {
    'zh-CN': '交易政策',
    'en-US': 'Trading Policy',
  },
  tradingPolicyDesc1: {
    'zh-CN': '对于使用信用卡/借记卡或任何其他类型支付方式的玩家，注册时银行卡名称必须与账户持有人姓名相同。如果注册时银行卡名称与账户持有人姓名不一致，OKBET保留拒绝任何请求的交易的权利。',
    'en-US': 'For players who use credit/debit cards or any other type of payment method, the bank card name must be the same as the account holder\'s name when registering. If the bank card name is inconsistent with the account holder\'s name when registering, OKBET reserves the right to refuse any transaction requested.',
  },
  tradingPolicyDesc2: {
    'zh-CN': '如果客户对OKBET或其任何成员有债务，客户必须承担偿还债务的责任。在付款方面，如果客户涉嫌欺诈，包括使用被盗信用卡或其他欺诈行为（如收回或颠覆付款或洗钱），OKBET有权立即冻结和/或关闭客户账户并没收账户余额，并将其信息（表明其身份）发布给任何有权访问此信息的在线娱乐网站、银行、信用卡公司和相关机构及个人。OKBET产生的任何费用将由参与所述恶意活动的行为人承担。',
    'en-US': 'If the customer has debts to OKBET or any of its members, the customer must bear the responsibility of repaying the debts. In terms of payment, if a customer is suspected of fraud, including the use of a stolen credit card, or other fraud (such as recovering or subverting payment or money laundering), OKBET has the right to immediately freeze and/or close the customer\'s account and confiscate the account balance, and publish its information (indicating its identity) to any online entertainment websites, banks, credit card companies, and related institutions and individuals that have the right to access this information. Any costs incurred by OKBET will be incurred by the perpetrator involved in the said malicious activities.',
  },
  ///

  refundPolicy: {
    'zh-CN': '退款政策',
    'en-US': 'Refund Policy',
  },
  refundPolicyDesc1: {
    'zh-CN': '1. 一旦涉嫌存款（包括奖金）已使用OKBET服务进行游戏，则无法完成退款。',
    'en-US': '1. No refund can be completed once the alleged deposit (including the bonus) has been played using the OKBET Services.',
  },
  refundPolicyDesc2: {
    'zh-CN': '2. 只有在涉嫌交易发生后的前二十四（24）小时内，或如果玩家声称其他个人（或未成年人）访问了其玩家账户或发生任何PAGCOR违规行为，则在三十（30）天内请求退款才会被考虑。',
    'en-US': '2. A refund request will only be considered if it is requested within the first twenty-four (24) hours of the alleged transaction, or within thirty (30) days if a Player alleges that another individual (or a minor) has accessed his/her Player Account or if there was any PAGCOR violation incurred.',
  },
  refundPolicyDesc3: {
    'zh-CN': '3. OKBET保留在玩家账户用户身份得到充分确认之前扣留任何退款或反向交易的权利，以确保退款后任何付款将得到兑现。玩家同意在要求时提供公证身份证明或根据适用菲律宾法律的任何其他认证身份证明。如果此类公证或认证身份证明未在请求后五（5）天内提供，则此类退款或反向交易将不受影响，玩家账户将被关闭，OKBET将没收玩家账户中的所有资金。此类决定为最终决定，具有约束力，且不可上诉。',
    'en-US': '3. OKBET reserves the right to withhold any refund or reverse transaction until the identity of the Player Account User is adequately established to its satisfaction, in order to ensure that any payment made will be honored after a refund has been made. The player agrees to provide, in case demanded, a notarized identification, or any other certified identification in accordance with the applicable Philippine laws. If such notarized or certified identification is not provided within five (5) days of the request, then such refund or reverse transaction shall not be affected, the Player Account shall be closed, and OKBET shall forfeit all funds in the Player Account. Such decision shall be final, binding, and not subject to appeal.',
  },
  refundPolicyDesc4: {
    'zh-CN': '4. 存款和提款交易的标准处理时间：',
    'en-US': '4. Standard Processing Times for Deposit and Withdrawal Transactions:',
  },
  refundPolicyDesc5: {
    'zh-CN': '• 对于因第三方支付提供商计划维护而延迟的存款和提款，账户将被监控24小时。',
    'en-US': '• For deposits and withdrawals delayed due to scheduled maintenance by third-party payment providers, the account will be monitored for 24 hours.',
  },
  refundPolicyDesc6: {
    'zh-CN': '• 如果金额未添加到玩家账户，玩家应报告回OKBET以确保资金正确记入。',
    'en-US': '• If the amount hasn\'t been added to the player\'s account, the player should report back to OKBET to ensure the funds are credited correctly.',
  },
  refundPolicyDesc7: {
    'zh-CN': '• 通过第三方提供商处理的存款和提款，从1菲律宾比索到50,000菲律宾比索，通常需要最多3个工作日。',
    'en-US': '• Deposits and withdrawals processed through third-party providers, from Php1 to Php50,000, usually take up to 3 business days.',
  },
  refundPolicyDesc8: {
    'zh-CN': '• OKBET对因超出其控制范围的问题（如由第三方支付提供商或供应商引起的问题）造成的任何延迟不承担责任。',
    'en-US': '• OKBET is not responsible for any delays due to issues beyond its control, such as those caused by third-party payment providers or vendors.',
  },
  ///

  kycPolicy: {
    'zh-CN': 'KYC政策',
    'en-US': 'KYC Policy',
  },
  kycPolicyDesc1: {
    'zh-CN': 'OKBET了解您的客户政策或KYC政策旨在预防和减轻OKBET涉及任何非法活动的可能风险。',
    'en-US': 'OKBET Know Your Customer Policy or the KYC Policy is designed to prevent and mitigate possible risks of OKBET being involved in any kind of illegal activity.',
  },
  kycPolicyDesc2: {
    'zh-CN': '国际和地方法规要求OKBET实施有效的内部程序和机制，以防止洗钱、恐怖主义融资、毒品和人口贩运、大规模毁灭性武器扩散、腐败和贿赂，并在其用户出现任何形式的可疑活动时采取行动。',
    'en-US': 'Both international and local regulations require OKBET to implement effective internal procedures and mechanisms to prevent money laundering, terrorist financing, drug and human trafficking, proliferation of weapons of mass destruction, corruption and bribery, and to take action in case of any form of suspicious activity from its Users.',
  },
  kycPolicyDesc3: {
    'zh-CN': 'KYC政策涵盖以下事项：',
    'en-US': 'KYC Policy covers the following matters:',
  },
  kycPolicyDesc4: {
    'zh-CN': '1. 验证程序。',
    'en-US': '1. Verification procedures.',
  },
  kycPolicyDesc5: {
    'zh-CN': '2. 制裁和PEP名单筛选。',
    'en-US': '2. Sanctions and PEP lists screening.',
  },
  kycPolicyDesc6: {
    'zh-CN': '3. 合规官。',
    'en-US': '3. Compliance Officer.',
  },
  kycPolicyDesc7: {
    'zh-CN': '4. 监控交易。',
    'en-US': '4. Monitoring Transactions.',
  },
  kycPolicyDesc8: {
    'zh-CN': '5. 风险评估。',
    'en-US': '5. Risk Assessment.',
  },
  kycPolicyDesc9: {
    'zh-CN': '验证程序',
    'en-US': 'Verification Procedures',
  },
  kycPolicyDesc10: {
    'zh-CN': '防止非法活动的国际标准之一是客户尽职调查（CDD）。基于CDD标准，OKBET建立了符合反洗钱和"了解您的客户"框架要求的验证程序。',
    'en-US': 'One of the international standards to prevent illegal activities is Customer Due Diligence (CDD). Based on CDD standards, OKBET has established verification procedures that comply with anti-money laundering and “Know Your Customer” framework requirements.',
  },
  verificationProcedures: {
    'zh-CN': '验证程序',
    'en-US': 'Verification procedures',
  },
  verificationProceduresDesc1: {
    'zh-CN': '防止非法活动的国际标准之一是客户尽职调查（"CDD"）。根据CDD，OKBET在反洗钱和"了解您的客户"框架标准内建立了自己的验证程序。',
    'en-US': 'One of the international standards for preventing illegal activity is customer due diligence (“CDD”). According to CDD, OKBET establishes its own verification procedures within the standards of anti-money laundering and “Know Your Customer” frameworks.',
  },
  identityVerification: {
    'zh-CN': '身份验证',
    'en-US': 'Identity verification',
  },
  identityVerificationDesc1: {
    'zh-CN': 'OKBET的身份验证程序要求用户向OKBET提供可靠、独立的来源文件、数据或信息（例如国民身份证、国际护照、银行对账单、公用事业账单）、一次性视频通话验证和与有效身份证的自拍。为此目的，OKBET保留收集用户身份信息用于KYC政策目的并在24小时内验证的权利。',
    'en-US': 'OKBET’s identity verification procedure requires the User to provide OKBET with reliable, independent source documents, data or information (e.g., national ID, international passport, bank statement, utility bill), one-time video call verification and selfie with the valid ID. For such purposes, OKBET reserves the right to collect User’s identification information for the KYC Policy purposes and verify it within 24 hours.',
  },
  identityVerificationDesc2: {
    'zh-CN': '根据PAGCOR监管框架，以下文件将被视为可接受的身份证件：',
    'en-US': 'The following documents will be the acceptable IDs according to the PAGCOR Regulatory Framework:',
  },
  identityVerificationDesc3: {
    'zh-CN': '• 驾驶执照',
    'en-US': '• Driver’s License',
  },
  identityVerificationDesc4: {
    'zh-CN': '• 菲律宾健康保险卡',
    'en-US': '• PhilHealth ID',
  },
  identityVerificationDesc5: {
    'zh-CN': '• 邮政身份证',
    'en-US': '• Postal ID',
  },
  identityVerificationDesc6: {
    'zh-CN': '• NBI无犯罪记录证明',
    'en-US': '• NBI Clearance',
  },
  identityVerificationDesc7: {
    'zh-CN': '• 老年公民卡',
    'en-US': '• Senior Citizen Card',
  },
  identityVerificationDesc8: {
    'zh-CN': '• 海外工人福利管理局（OWWA）',
    'en-US': '• Overseas Workers Welfare Administration (OWWA)',
  },
  identityVerificationDesc9: {
    'zh-CN': '• 护照（菲律宾/外国）',
    'en-US': '• ID Passport (Philippine/Foreign)',
  },
  identityVerificationDesc10: {
    'zh-CN': '• 枪支许可证',
    'en-US': '• Firearms License',
  },
  identityVerificationDesc11: {
    'zh-CN': '• 警方无犯罪记录证明',
    'en-US': '• Police Clearance',
  },
  identityVerificationDesc12: {
    'zh-CN': '• 菲律宾律师协会ID',
    'en-US': '• Integrated Bar of the Philippines ID',
  },
  identityVerificationDesc13: {
    'zh-CN': '• 海员证',
    'en-US': '• Seaman’s Book',
  },
  identityVerificationDesc14: {
    'zh-CN': '• 专业监管委员会',
    'en-US': '• Professional Regulations Commission',
  },
  identityVerificationDesc15: {
    'zh-CN': '• 海外菲律宾工人（OFW）ID',
    'en-US': '• Overseas Filipino Workers (OFW) ID',
  },
  identityVerificationDesc16: {
    'zh-CN': '• 社会保障系统（SSS）卡',
    'en-US': '• Social Security System (SSS) Card',
  },
  identityVerificationDesc17: {
    'zh-CN': '• 税务识别号（TIN）',
    'en-US': '• Tax Identification (TIN)',
  },
  identityVerificationDesc18: {
    'zh-CN': '• 统一多功能ID（UMID）',
    'en-US': '• Unified Multi-Purpose ID (UMID)',
  },
  identityVerificationDesc19: {
    'zh-CN': '• 选民证书和/或选民ID',
    'en-US': '• Voter’s Certificate and/or Voter’s ID',
  },
  identityVerificationDesc20: {
    'zh-CN': '• 海事工业局（MARINA）ID',
    'en-US': '• Maritime Industry Authority (MARINA) ID',
  },
  identityVerificationDesc21: {
    'zh-CN': '• 菲律宾国民ID',
    'en-US': '• Philippine National ID',
  },
  identityVerificationDesc22: {
    'zh-CN': '• 有效护照',
    'en-US': '• Valid Passport',
  },
  identityVerificationDesc23: {
    'zh-CN': '• 外国人登记证',
    'en-US': '• Alien Certificate of Registration',
  },
  identityVerificationDesc24: {
    'zh-CN': '• 移民登记证',
    'en-US': '• Immigrant Certificate of Registration',
  },
  identityVerificationDesc25: {
    'zh-CN': '• 国民身份证',
    'en-US': '• National ID',
  },
  identityVerificationDesc26: {
    'zh-CN': 'OKBET将采取措施确认用户提供的文件和信息的真实性。将使用所有合法方法双重检查身份信息，OKBET保留调查被确定为有风险或可疑的某些用户的权利。',
    'en-US': 'OKBET will take steps to confirm the authenticity of documents and information provided by the Users. All legal methods for double-checking identification information will be used and OKBET reserves the right to investigate certain Users who have been determined to be risky or suspicious.',
  },
  identityVerificationDesc27: {
    'zh-CN': 'OKBET保留持续验证用户身份的权利，特别是当其身份信息已更改或其活动看起来可疑（对该特定用户不寻常）时。此外，即使过去已通过身份验证，OKBET保留向用户请求最新文件的权利。',
    'en-US': 'OKBET reserves the right to verify User’s identity on an on-going basis, especially when their identification information has been changed or their activity seems to be suspicious (unusual for the particular User). In addition, OKBET reserves the right to request up-to-date documents from the Users, even though they have passed identity verification in the past.',
  },
  identityVerificationDesc28: {
    'zh-CN': '用户的身份信息将严格按照OKBET的隐私政策和相关法规收集、存储、共享和保护。',
    'en-US': 'User’s identification information will be collected, stored, shared, and protected strictly in accordance with OKBET’s Privacy Policy and related regulations.',
  },
  identityVerificationDesc29: {
    'zh-CN': '一旦用户身份得到验证，OKBET能够在服务被用于进行非法活动的情况下免除潜在的法律责任。',
    'en-US': 'Once the User’s identity has been verified, OKBET is able to remove itself from potential legal liability in a situation where its Services are used to conduct illegal activity.',
  },
  cardVerification: {
    'zh-CN': '卡验证',
    'en-US': 'Card verification',
  },
  cardVerificationDesc1: {
    'zh-CN': '• 打算使用支付卡与OKBET服务连接的用户需要按照OKBET网站上提供的说明进行验证过程。',
    'en-US': '• The Users who are intended to use payment cards in connection with OKBET’s Services are required to undergo a verification process in accordance with instructions available on the OKBET’s Site.',
  },
  cardVerificationDesc2: {
    'zh-CN': '• 制裁、未成年人、政府官员、PNP/AFP、排除和PEP名单筛选。OKBET对申请人进行制裁、未成年人、政府官员、PNP/AFP、排除和政治敏感人物（PEPs）名单筛选。',
    'en-US': '• Sanctions, Minor, Government Officials, PNP/AFP, excluded, and PEP lists screening. OKBET screens applicants against recognized Sanctions, Minor, Government Officials, PNP/AFP, excluded, and Politically Exposed Persons (PEPs) lists.',
  },
  cardVerificationDesc3: {
    'zh-CN': '• 对个人和法律实体进行上述名单筛选：',
    'en-US': '• Individuals and legal entities are screened against mentioned lists:',
  },
  cardVerificationDesc4: {
    'zh-CN': '1. 在用户提交申请的入职阶段；',
    'en-US': '1. On the onboarding stage when the user is submitting the application;',
  },
  cardVerificationDesc5: {
    'zh-CN': '2. 在每次反欺诈和反洗钱说明中由合规官手动进行；',
    'en-US': '2. On each anti-fraud and AML captions manually by Compliance Officer;',
  },
  cardVerificationDesc6: {
    'zh-CN': '3. 每月通过脚本自动重新检查所有客户数据库。',
    'en-US': '3. Monthly by running automatically with a script to re-check all DB of customers.',
  },
  cardVerificationDesc7: {
    'zh-CN': '4. 对于筛选过程，OKBET使用PAGCOR制裁、未成年人、政府官员、PNP/AFP、排除和政治敏感人物（PEPs）数据库进行手动确认。',
    'en-US': '4. For the screening process, OKBET uses PAGCOR Sanctions, Minor, Government Officials, PNP/AFP, excluded, and Politically Exposed Persons (PEPs) database for manual confirmation.',
  },
  cardVerificationDesc8: {
    'zh-CN': '• OKBET保留要求用户提供额外证明以确认其当前位置的权利，以符合当前PAGCOR指南，该指南规定仅允许居住在菲律宾境内的个人进行游戏。',
    'en-US': '• OKBET reserves the right to ask for additional proof regarding a player’s current location by whatever means necessary in compliance with the current PAGCOR guideline stating that only individuals residing inside the Philippines shall be allowed to play.',
  },
  cardVerificationDesc9: {
    'zh-CN': 'OKBET保留要求用户提供额外证明以确认其当前位置的权利，以符合PAGCOR的要求，因为仅允许在菲律宾境内的个人参与赌博。',
    'en-US': 'OKBET reserves the right to request additional proof from users to confirm their current location, in compliance with PAGCOR’s requirements, as only individuals within the Philippines are allowed to participate in gambling.',
  },
  complianceOfficer: {
    'zh-CN': '合规官',
    'en-US': 'Compliance Officer',
  },
  complianceOfficerDesc1: {
    'zh-CN': '合规官是由OKBET正式授权的人员，其职责是确保KYC政策的有效实施和执行。合规官负责监督OKBET反洗钱和反恐融资的各个方面，包括但不限于：',
    'en-US': 'The Compliance Officer is the person, duly authorized by OKBET, whose duty is to ensure the effective implementation and enforcement of the KYC Policy. It is the Compliance Officer’s responsibility to supervise all aspects of OKBET’s anti-money laundering and counter-terrorist financing, including but not limited to:',
  },
  complianceOfficerDesc2: {
    'zh-CN': '1. 收集用户的身份信息。',
    'en-US': '1. Collecting Users’ identification information.',
  },
  complianceOfficerDesc3: {
    'zh-CN': '2. 建立和更新内部政策和程序，以完成、审查、提交和保留适用法律和法规要求的所有报告和记录。',
    'en-US': '2. Establishing and updating internal policies and procedures for the completion, review, submission, and retention of all reports and records required under the applicable laws and regulations.',
  },
  complianceOfficerDesc4: {
    'zh-CN': '3. 监控交易并调查任何与正常活动的重大偏差。',
    'en-US': '3. Monitoring transactions and investigating any significant deviations from normal activity.',
  },
  complianceOfficerDesc5: {
    'zh-CN': '4. 实施记录管理系统，以适当存储和检索文件、档案、表格和日志。',
    'en-US': '4. Implementing a records management system for appropriate storage and retrieval of documents, files, forms, and logs.',
  },
  complianceOfficerDesc6: {
    'zh-CN': '5. 定期更新风险评估。',
    'en-US': '5. Updating risk assessment regularly.',
  },
  complianceOfficerDesc7: {
    'zh-CN': '6. 根据适用法律和法规向执法部门提供信息。',
    'en-US': '6. Providing law enforcement with information as required under the applicable laws and regulations.',
  },
  complianceOfficerDesc8: {
    'zh-CN': '合规官有权与参与预防洗钱、恐怖主义融资和其他非法活动的执法部门互动。',
    'en-US': 'The Compliance Officer is entitled to interact with law enforcement, which are involved in the prevention of money laundering, terrorist financing, and other illegal activity.',
  },
  monitoringTransactions: {
    'zh-CN': '监控交易',
    'en-US': 'Monitoring Transactions',
  },
  monitoringTransactionsDesc1: {
    'zh-CN': '用户不仅通过验证其身份（他们是谁）来识别，更重要的是通过分析其交易模式（他们做什么）来识别。因此，OKBET依赖数据分析作为风险评估和可疑检测工具。OKBET执行各种合规相关任务，包括捕获数据、过滤、记录保存、调查管理和报告。系统功能包括：',
    'en-US': 'The Users are known not only by verifying their identity (who they are) but, more importantly, by analyzing their transactional patterns (what they do). Therefore, OKBET relies on data analysis as a risk-assessment and suspicion detection tool. OKBET performs a variety of compliance-related tasks, including capturing data, filtering, record-keeping, investigation management, and reporting. System functionalities include:',
  },
  monitoringTransactionsDesc2: {
    'zh-CN': '每日检查用户是否在公认的"黑名单"上（例如PAGCOR国家限制人员数据库），通过多个数据点汇总转账，将用户列入观察和服务拒绝名单，在需要时开启调查案例，发送内部通讯，并填写法定报告（如适用）。',
    'en-US': 'Daily check of Users against recognized “black lists” (e.g., PAGCOR National Database of Restricted Persons), aggregating transfers by multiple data points, placing Users on watch and service denial lists, opening cases for investigation where needed, sending internal communications, and filling out statutory reports, if applicable.',
  },
  caseDocumentManagement: {
    'zh-CN': '案例和文件管理',
    'en-US': 'Case and Document Management',
  },
  caseDocumentManagementDesc1: {
    'zh-CN': '关于KYC政策，OKBET将监控所有交易，并保留以下权利：',
    'en-US': 'With regard to the KYC Policy, OKBET will monitor all transactions and it reserves the right to:',
  },
  caseDocumentManagementDesc2: {
    'zh-CN': '1. 确保将可疑性质的交易通过合规官报告给适当的执法部门。',
    'en-US': '1. Ensure that transactions of suspicious nature are reported to the proper law enforcement through the Compliance Officer.',
  },
  caseDocumentManagementDesc3: {
    'zh-CN': '2. 在可疑交易的情况下，要求用户提供任何额外的信息和文件。',
    'en-US': '2. Request the User to provide any additional information and documents in case of suspicious transactions.',
  },
  caseDocumentManagementDesc4: {
    'zh-CN': '3. 当OKBET有合理怀疑该用户从事非法活动时，暂停或终止用户账户。',
    'en-US': '3. Suspend or terminate User’s Account when OKBET has reasonable suspicion that such User engaged in illegal activity.',
  },
  caseDocumentManagementDesc5: {
    'zh-CN': '4. 上述列表并非详尽无遗，合规官将每天监控用户的交易，以确定此类交易是否应被报告并视为可疑或被视为善意。',
    'en-US': '4. The above list is not exhaustive, and the Compliance Officer will monitor Users’ transactions on a day-to-day basis in order to define whether such transactions are to be reported and treated as suspicious or are to be treated as bona fide.',
  },
  riskAssessment: {
    'zh-CN': '风险评估',
    'en-US': 'Risk Assessment',
  },
  riskAssessmentDesc1: {
    'zh-CN': 'OKBET根据PAGCOR合规要求，采用基于风险的方法打击洗钱和恐怖主义融资。通过采用基于风险的方法，OKBET能够确保防止或减轻洗钱和恐怖主义融资的措施与已识别的风险相称。这将使资源以最有效的方式分配。原则是资源应根据优先级分配，以便最高风险获得最高关注。',
    'en-US': 'OKBET, in line with the PAGCOR compliance, has adopted a risk-based approach to combating money laundering and terrorist financing. By adopting a risk-based approach, OKBET is able to ensure that measures to prevent or mitigate money laundering planting and terrorist financing are commensurate to the identified risks. This will allow resources to be allocated in the most efficient ways. The principle is that resources should be directed in accordance with priorities so that the greatest risks receive the highest attention.',
  },
  antiMoneyLaunderingPolicy: {
    'zh-CN': '反洗钱（AML）政策',
    'en-US': 'Anti-Money Laundering (AML) Policy',
  },
  antiMoneyLaunderingPolicyDesc1: {
    'zh-CN': '洗钱被定义为旨在掩盖从严重刑事犯罪或犯罪行为中获得的利益的过程，如2001年《反洗钱法》第9160号共和国法案所述，使其看起来这些利益来自合法来源。一般来说，洗钱由三（3）个阶段组成，涉及多个交易，这些交易可能提醒中介机构（如公司）注意洗钱活动：',
    'en-US': 'Money laundering is defined as the process intended to mask benefits derived from serious criminal offenses or criminal conduct, as described under the Anti-Money Laundering Act of 2001 REPUBLIC ACT NO. 9160, to make it appear that such benefits originated from a legitimate source. Generally, money laundering is composed of three (3) stages involving several transactions which could alert an intermediary such as the Company to the money laundering activity:',
  },
  antiMoneyLaunderingPolicyDesc2: {
    'zh-CN': '• 放置 - 处置从非法活动中获得的现金收益的物理行为',
    'en-US': '• Placement – the physical act of disposing of the cash proceeds drawn from illegal activities',
  },
  antiMoneyLaunderingPolicyDesc3: {
    'zh-CN': '• 分层 - 通过创建复杂的金融交易层次将非法收益与其来源分离的行为，以掩盖审计线索并提供匿名性',
    'en-US': '• Layering – the act of separating illicit proceeds from their source by creating complex tiers of financial transactions in order to disguise the audit trail and provide anonymity',
  },
  antiMoneyLaunderingPolicyDesc4: {
    'zh-CN': '• 整合 - 为犯罪所得的财富提供合法外观的行为。如果分层过程成功，整合步骤将洗过的收益重新投入经济，使其重新进入金融系统时具有正常商业资金的外观。',
    'en-US': '• Integration – the act of providing an appearance of legitimacy to criminally-derived wealth. If the layering process is successful, the integration step places the laundered proceeds back into the economy in a manner that their re-entry into the financial system has the appearance of being normal business funds.',
  },
  okbetAntiMoneyLaunderingStrategies: {
    'zh-CN': 'OKBET反洗钱策略',
    'en-US': 'OKBET Anti-Money Laundering Strategies',
  },
  okbetAntiMoneyLaunderingStrategiesDesc1: {
    'zh-CN': 'OKBET努力应用以下原则，以检测、预防和反对使用公司服务进行洗钱和恐怖主义融资：',
    'en-US': 'OKBET endeavors to apply the following principles in order to detect, prevent and oppose the use of the Company’s services for money laundering and terrorist financing:',
  },
  okbetAntiMoneyLaunderingStrategiesDesc2: {
    'zh-CN': '1. 设立并正式任命的合规官员',
    'en-US': '1. Established and duly appointed Compliance Official',
  },
  okbetAntiMoneyLaunderingStrategiesDesc3: {
    'zh-CN': '2. 了解您的客户流程（CDD和EDD）',
    'en-US': '2. Know-Your-Customer Process (CDD and EDD)',
  },
  okbetAntiMoneyLaunderingStrategiesDesc4: {
    'zh-CN': '3. 向AMLC报告',
    'en-US': '3. Reporting to the AMLC',
  },
  okbetAntiMoneyLaunderingStrategiesDesc5: {
    'zh-CN': '4. 持续的员工培训',
    'en-US': '4. Ongoing Employee Training',
  },
  okbetAntiMoneyLaunderingStrategiesDesc6: {
    'zh-CN': '5. 持续监控和合规测试',
    'en-US': '5. Ongoing monitoring and Compliance Testing',
  },
  okbetAntiMoneyLaunderingStrategiesDesc7: {
    'zh-CN': '6. 根据反洗钱法律和法规进行记录保存和数据保留',
    'en-US': '6. Record Keeping and Data Retention in accordance with AML laws and regulations',
  },
  okbetAntiMoneyLaunderingStrategiesDesc8: {
    'zh-CN': '7. 内部审计功能',
    'en-US': '7. Internal Audit Function',
  },
  regulatoryCompliance: {
    'zh-CN': '法规合规',
    'en-US': 'Regulatory Compliance',
  },
  regulatoryComplianceDesc1: {
    'zh-CN': '• OKBET确保其业务按照最高道德标准进行，尽可能尊重和遵守法律法规，并且在有充分理由相信交易与洗钱活动相关时不提供服务。',
    'en-US': '• OKBET ensures that its business is conducted in conformity with the highest ethical standards, that laws and regulations are respected and complied with whenever possible, and that service is not provided where there is good reason to believe that transactions are associated with money laundering activities.',
  },
  regulatoryComplianceDesc2: {
    'zh-CN': '• 与菲律宾执法机构合作',
    'en-US': '• Partnership with Philippine Law Enforcement Agencies',
  },
  regulatoryComplianceDesc3: {
    'zh-CN': '• 在客户保密的法律限制范围内，OKBET与执法机构合作。这包括在有合理理由怀疑洗钱时在法律范围内采取适当措施。根据该法案作出的任何披露应向适用的管理机构作出。',
    'en-US': '• Within the legal constraints relative to client confidentiality, OKBET cooperates with law enforcement agencies. This includes taking appropriate measures within the law if there are reasonable grounds for suspecting money laundering. Any disclosure made in conjunction with the Act shall be made to the applicable governing body.',
  },
  bonus: {
    'zh-CN': '奖金',
    'en-US': 'Bonus',
  },
  bonusDesc1: {
    'zh-CN': '• 当账户持有人有机会从OKBET赢得奖金时，任何奖金必须符合本协议和提供的相关附加条款。',
    'en-US': '• When an account holder gets a chance to win a bonus from OKBET, any bonus must comply with this agreement and the relevant additional terms provided.',
  },
  bonusDesc2: {
    'zh-CN': '• OKBET保留向特定客户或客户群提供特定奖金的权利。',
    'en-US': '• OKBET reserves the right to offer a specific bonus to a specific customer or group of customers.',
  },
  bonusDesc3: {
    'zh-CN': '• 玩家必须遵守相关规定和限制，才能从账户中提取奖金金额，否则将不予处理。',
    'en-US': '• Players must comply with the relevant provisions and restrictions before withdrawing the bonus amount from the account, otherwise, they will not be processed.',
  },
  bonusDesc4: {
    'zh-CN': '• 账户持有人的提款货币必须与存款货币一致。',
    'en-US': '• The account holder’s withdrawal currency must be consistent with the deposit currency.',
  },
  bonusDesc5: {
    'zh-CN': '• OKBET保留随时撤回或修改奖金或促销活动和/或相关特定条款和规则的权利，并不承担向客户或第三方解释的责任。',
    'en-US': '• OKBET reserves the right to withdraw or modify bonuses or promotional activities and/or related specific terms and rules at any time, and does not assume the responsibility of explaining to customers or third parties.',
  },
  bonusDesc6: {
    'zh-CN': '• 如果账户持有人处于自我排除状态，OKBET将根据现有使用条款合理努力返还账户余额。更多信息请参阅负责任游戏指南。',
    'en-US': '• If an account holder is under self-exclusion, OKBET will make reasonable efforts to return the account balance in accordance with existing Terms of Use. Please see Responsible Gaming guidelines for more information.',
  },
  bonusDesc7: {
    'zh-CN': '• 使用免费投注或无存款奖金的最大允许赢利不得超过5000菲律宾比索。超出此限制的任何赢利将被视为无效。',
    'en-US': '• The maximum winnings allowable with freebet or no-deposit-bonus shall not exceed the Php5000. Any winnings beyond this limit will be considered null and void.',
  },
  bonusAbuse: {
    'zh-CN': '奖金滥用',
    'en-US': 'Bonus Abuse',
  },
  bonusAbuseDesc1: {
    'zh-CN': '"奖金滥用"包括但不限于：',
    'en-US': '“Bonus Abuse” includes, but is not limited to:',
  },
  bonusAbuseDesc2: {
    'zh-CN': '1. 违反奖金、免费投注或任何其他促销优惠的使用条款；',
    'en-US': '1. Breach of Terms of Use of a bonus, free bets, or any other promotional offer;',
  },
  bonusAbuseDesc3: {
    'zh-CN': '2. 开设多个账户以领取多个奖金；',
    'en-US': '2. The opening of multiple accounts to claim multiple bonuses;',
  },
  bonusAbuseDesc4: {
    'zh-CN': '如果有合理怀疑账户持有人单独或作为团体成员已实施或试图实施奖金滥用，OKBET保留以下权利：',
    'en-US': 'Where there is a reasonable suspicion that the Account Holder has committed or attempted to commit a bonus abuse, either on their own or as part of a group, OKBET reserves the right to:',
  },
  bonusAbuseDesc5: {
    'zh-CN': '1. 没收分配给账户持有人的奖金及该奖金的任何赢利，和/或；',
    'en-US': '1. Forfeit the bonus allocated to the Account Holder and any winnings from that bonus, and/or;',
  },
  bonusAbuseDesc6: {
    'zh-CN': '2. 撤销、拒绝或撤回账户持有人的奖金优惠，和/或；',
    'en-US': '2. Revoke, deny, or withdraw a bonus offer from the Account Holder, and/or;',
  },
  bonusAbuseDesc7: {
    'zh-CN': '3. 阻止访问特定产品，和/或；',
    'en-US': '3. Block access to particular products, and/or;',
  },
  bonusAbuseDesc8: {
    'zh-CN': '4. 将账户持有人排除在未来的促销优惠之外，和/或；',
    'en-US': '4. Exclude the Account Holder from any future promotional offers, and/or;',
  },
  bonusAbuseDesc9: {
    'zh-CN': '5. 立即终止账户持有人的账户。',
    'en-US': '5. Terminate the Account Holder’s account with immediate effect.',
  },
  turnoverCalculationExclusions: {
    'zh-CN': '周转计算排除项',
    'en-US': 'Turnover Calculation Exclusions',
  },
  turnoverCalculationExclusionsDesc1: {
    'zh-CN': '1. 平局',
    'en-US': '1. Draws',
  },
  turnoverCalculationExclusionsDesc2: {
    'zh-CN': '2. 双方投注',
    'en-US': '2. Betting on both sides',
  },
  turnoverCalculationExclusionsDesc3: {
    'zh-CN': '3. 无效/取消的比赛',
    'en-US': '3. Voided/Cancelled games',
  },
  bettingRulesa: {
    'zh-CN': '投注规则',
    'en-US': 'Betting Rules',
  },
  bettingRulesaDesc1: {
    'zh-CN': '1. 投注输 = 您损失全部投注金额。',
    'en-US': '1. Bet Lose = You lose the entire bet amount.',
  },
  bettingRulesaDesc2: {
    'zh-CN': '2. 投注赢 = 如果您的赢利超过您的投注，则计算全额投注。如果您的赢利少于投注，则仅计算实际赢利（不包括本金）。',
    'en-US': '2. Bet Win = If your win is more than your bet, the full bet counts. If your win is less, only the actual win counts (excluding the stake).',
  },
  disclaimer: {
    'zh-CN': '免责声明',
    'en-US': 'Disclaimer',
  },
  disclaimerDesc1: {
    'zh-CN': '• 如果OKBET被具有法律权限和/或管辖权的法院和/或类似机构认定在任何方面负有责任，则OKBET的责任限于投注金额或账户持有人的净赢利，以较少者为准。或者，在相关和适用的情况下，记录在OKBET账户中的金额或转入或转出OKBET账户的金额，以较少者为准。',
    'en-US': '• In the event of OKBET being found liable in any way by a court of law and/or a similar authority with legal competence and/or jurisdiction over OKBET, then OKBET’s liability is limited to the amount of the stake, or the Account Holder’s net winnings, whichever is the lesser. Alternatively, when relevant and applicable, the amount recorded in the OKBET Account or the amount transferred into or out of the OKBET Account, whichever is the lesser.',
  },
  disclaimerDesc2: {
    'zh-CN': '• OKBET与其网站上显示的体育队伍、赛事组织者或玩家无关或连接，也不对其名称和形象主张任何知识产权，这些名称和形象仅用于提供服务。',
    'en-US': '• OKBET is not affiliated or connected with sports teams, event organizers, or players displayed on its websites, and does not claim any intellectual property rights relating to their name and image, which are used strictly in order to provide the Services.',
  },
  disclaimerDesc3: {
    'zh-CN': '• OKBET不作任何明示或暗示的陈述或保证，关于账户持有人参与服务的法律权利，OKBET的任何员工、被许可人、分销商、批发商、附属公司、子公司、广告、促销或其他机构、媒体合作伙伴、代理或零售商均无权作出任何此类陈述或保证。如果账户持有人不完全理解、不同意、不希望成为一方并毫无例外地遵守本文中包含的所有OKBET规则，以及这些规则可能不时修订的内容，则不得使用服务、开设、使用或重新使用OKBET账户、进入网站或接受任何奖品。',
    'en-US': '• OKBET makes no representation or warranty, explicit or implicit, as to the legal rights of the Account Holder to participate in the Services, nor shall any of OKBET’s employees, licensees, distributors, wholesalers, affiliates, subsidiaries, advertising, promotion or other agencies, media partners, agents, or retailers have the authority to make any such representation or warranty. The Account Holder shall not use the Services, open, use, or reuse an OKBET Account, enter the Website, nor accept any Prize if the Account Holder does not fully understand, agree to, wish to become a party to, and comply with, without exception, all the OKBET Rules contained herein, and as these may be amended from time to time.',
  },
  disclaimerDesc4: {
    'zh-CN': 'OKBET责任免责声明',
    'en-US': 'OKBET Liability Disclaimer',
  },
  disclaimerDesc5: {
    'zh-CN': 'OKBET不承认或接受对账户持有人和/或第三方因账户持有人直接和/或间接造成的任何损害和/或损失的责任：',
    'en-US': 'OKBET does not acknowledge or accept any liability for damage and/or losses to an Account Holder and/or a third party caused directly and/or indirectly due to the Account Holder:',
  },
  disclaimerDesc6: {
    'zh-CN': '1. 通过第三方的卡或账户向其OKBET账户存款；',
    'en-US': '1. Making deposits to his OKBET Account via a third party’s Card or account;',
  },
  disclaimerDesc7: {
    'zh-CN': '2. 从其OKBET账户向第三方账户请求提款；',
    'en-US': '2. Requesting withdrawals from his OKBET Account to a third party’s account;',
  },
  disclaimerDesc8: {
    'zh-CN': '3. 为其OKBET账户提款提供其个人账户的错误详细信息；',
    'en-US': '3. Providing incorrect details of his personal account for the purpose of withdrawals from his OKBET Account;',
  },
  disclaimerDesc9: {
    'zh-CN': '4. 允许第三方使用其OKBET账户向其OKBET账户存款或提款。',
    'en-US': '4. Allowing third parties to use his OKBET Account to make deposits to or withdraw from his OKBET Account.',
  },
  disclaimerDesc10: {
    'zh-CN': 'OKBET不承认或接受对账户持有人和/或第三方因以下任何原因直接和/或间接造成的任何损害和/或损失的责任：',
    'en-US': 'OKBET does not acknowledge or accept any liability whatsoever for damage and/or losses to an Account Holder and/or a third party caused directly and/or indirectly due to any of the following:',
  },
  disclaimerDesc11: {
    'zh-CN': '1. 错误、印刷错误、误解、听错、读错、翻译错误、拼写错误、阅读错误、交易错误、技术故障、技术危害、注册错误、明显错误、因任何原因取消游戏，和/或任何其他类似事件；',
    'en-US': '1. Mistake, misprint, misinterpretation, mishearing, misreading, mistranslation, spelling mistake, fault in reading, transaction error, technical failure, technical hazard, registration error, manifest error, cancellation of a game for any reason, and/or any other similar event;',
  },
  disclaimerDesc12: {
    'zh-CN': '2. 违反OKBET规则；',
    'en-US': '2. Violation of the OKBET Rules;',
  },
  disclaimerDesc13: {
    'zh-CN': '3. 串谋和/或犯罪行为；',
    'en-US': '3. Collusion and/or criminal actions;',
  },
  disclaimerDesc14: {
    'zh-CN': '4. OKBET提供的建议；',
    'en-US': '4. Advice provided by OKBET;',
  },
  disclaimerDesc15: {
    'zh-CN': '5. OKBET中央计算机系统或其任何部分的故障；由于任何电信或其他数据传输系统故障导致的延迟、损失、错误或遗漏；和/或',
    'en-US': '5. Failure of OKBET’s central computer system or any part thereof; delays, losses, errors or omissions resulting from failure of any telecommunications or any other data transmission system; and/or',
  },
  disclaimerDesc16: {
    'zh-CN': '6. 财务风险和损失，包括但不限于汇率变动；',
    'en-US': '6. Financial risk and loss, including but not limited to variances in exchange rates;',
  },
  disclaimerDesc17: {
    'zh-CN': '网站上显示的所有信息（包括但不限于比分、结果、赛事时间、统计数据、编辑文本等）仅供信息参考，不构成任何形式的专业建议。OKBET及其任何独立提供商均不对任何信息错误、不完整、不准确或延迟，或因依赖其中包含的信息而采取的任何行动负责。',
    'en-US': 'All information displayed on the Website (including but not limited to scores, results, time of the event, statistics, editorial text, etc.) is provided for information purposes only, and not intended to constitute professional advice of any kind. Neither OKBET nor any of its independent providers is liable for any information errors, incompleteness, inaccuracy or delays, or for any actions taken in reliance on information contained therein.',
  },
  disclaimerDesc18: {
    'zh-CN': '账户持有人应保证OKBET、其员工、管理人员、董事、被许可人、分销商、批发商、附属公司、子公司、广告、促销或其他机构、媒体合作伙伴、代理和零售商免受任何及所有因账户持有人的以下行为而产生的成本、费用、责任和损害：',
    'en-US': 'The Account Holder shall hold OKBET, its employees, officers, directors, licensees, distributors, wholesalers, affiliates, subsidiaries, advertising, promotion or other agencies, media partners, agents, and retailers harmless and shall fully indemnify the same from any and all costs, expenses, liabilities, and damages whatsoever that may arise as a result of Account Holder’s:',
  },
  disclaimerDesc19: {
    'zh-CN': '1. 进入、使用或重新使用网站；',
    'en-US': '1. Entry, use or reuse of the Website;',
  },
  disclaimerDesc20: {
    'zh-CN': '2. 使用任何网站材料；',
    'en-US': '2. Use of any Website material;',
  },
  disclaimerDesc21: {
    'zh-CN': '3. 进入、使用或重新使用用于提供服务的服务器；',
    'en-US': '3. Entry, use or reuse of the servers used to provide the Services;',
  },
  disclaimerDesc22: {
    'zh-CN': '4. 进入、使用或重新使用客户端应用；',
    'en-US': '4. Entry, use or reuse of a Client Application;',
  },
  disclaimerDesc23: {
    'zh-CN': '5. 参与游戏、聊天功能和服务；',
    'en-US': '5. Participation in the games, chat functionalities and Services;',
  },
  disclaimerDesc24: {
    'zh-CN': '6. 接受任何奖品。',
    'en-US': '6. The acceptance of any Prize.',
  },
  disclaimerDesc25: {
    'zh-CN': '在任何情况下，包括但不限于疏忽，OKBET、其软件和客户端应用、软件供应商、子公司或附属公司均不对因使用或无法使用OKBET或其供应商的产品、客户端应用和/或材料而导致的任何直接、间接、附带、特殊或后果性损害负责。账户持有人特别承认并同意OKBET不对任何账户持有人的诽谤、冒犯或非法行为负责。如果账户持有人对任何服务或本OKBET规则不满意，账户持有人唯一和排他的补救措施是停止使用服务。',
    'en-US': 'Under no circumstances, including but not limited to negligence, shall OKBET, its Software and Client application, software suppliers, subsidiary companies, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of or the inability to use OKBET’s or its suppliers’ products, Client Application, and/or materials. The Account Holder specifically acknowledges and agrees that OKBET is not liable for any defamatory, offensive, or illegal conduct of any Account Holder. If the Account Holder is dissatisfied with any Service, or with any of the present OKBET Rules, the Account Holder’s sole and exclusive remedy is to discontinue using the Services.',
  },
  disclaimerDesc26: {
    'zh-CN': '• 账户持有人理解、承认并接受，网站上运营的游戏中使用、描绘、描述或建议的名称、情况或条件与现实的任何相似之处纯属巧合且无意。',
    'en-US': '• The Account Holder understands, acknowledges, and accepts that any resemblance of names, circumstances, or conditions used, depicted, described, or suggested in the games operated on the Website with reality is entirely coincidental and unintended.',
  },
  disclaimerDesc27: {
    'zh-CN': '• 账户持有人理解OKBET保留随时更改或删除其任何服务的权利。',
    'en-US': '• The Account Holder understands that OKBET reserves the right to change or remove any of its Services at any time.',
  },
  disclaimerDesc28: {
    'zh-CN': '• 账户持有人应定期（不少于每月一次）查看网站上发布的OKBET规则。',
    'en-US': '• The Account Holder shall review the OKBET Rules as posted on the Website on a regular basis, and not less than once a month.',
  },
  disclaimerDesc29: {
    'zh-CN': '• 账户持有人可以从网站访问由第三方播放的内容（例如：流媒体）。账户持有人因此承认此内容不属于OKBET，由第三方提供。访问网站上的内容时，账户持有人或访客自行承担风险。OKBET不控制此类内容提供的图形、声音或图像，仅供观看。OKBET明确声明与此类内容相关的任何和所有责任。',
    'en-US': '• An account holder can access content played by third parties from the website (for example: streaming media). The account holder consequently acknowledges that this content does not belong to OKBET and is provided by a third party. When accessing content on the website, the account holder or a visitor is at their own risk. OKBET does not control the graphics, sounds, or images provided by such content, but it is for viewing purposes only. OKBET expressly disclaims any and all responsibilities related to such content.',
  },
  disclaimerDesc30: {
    'zh-CN': '• 在任何情况下，OKBET不对因使用网站服务时卫星接收不良或延迟、网络中断、个人错误、疏忽或对网站内容的误解而造成的任何损失负责。',
    'en-US': '• In any case, OKBET is not responsible for any losses caused by poor or delayed satellite reception, network interruption, personal errors, negligence, or misunderstanding of the website content when using the website services.',
  },
  disclaimerDesc31: {
    'zh-CN': '• 公司不提供保证，也不对由于公司网站和信息提供的第三方服务（如无线通信提供商等）造成的延迟、违约或服务不提供承担责任。',
    'en-US': '• The company does not provide guarantees and assumes no liability for delays, breach of contract, or non-service provision due to third-party services provided by the company’s website and information (such as wireless communication providers, etc.).',
  },
  disclaimerDesc32: {
    'zh-CN': '• 客户访问或使用网站服务、软件、信息服务或下载、安装或使用软件造成的任何直接、间接、重大或普通损失或经济损失，无论OKBET是否已被告知其可能性，OKBET及相关合作伙伴、公司、合伙人、员工和代理人均不承担责任。',
    'en-US': '• Any direct, indirect, major, or ordinary loss or economic loss caused by customers accessing or using the website services, software, information services, or downloading, installing, or using the software, regardless of whether OKBET has been notified of its possibility, OKBET and related partners, companies, partners, employees, and agents will not be liable.',
  },
  disclaimerDesc33: {
    'zh-CN': '• 如果客户计算机配件上的比赛结果与OKBET服务器上的比赛结果不一致，服务器显示的结果将是最终比赛结果。此外，客户还同意OKBET拥有最终解释其服务中客户参与的游戏规则和投注状态的权利。',
    'en-US': '• If there is an inconsistency between the match result on the client’s computer accessories and the match result of OKBET’s server, the result displayed by the server will be the final match result. In addition, customers also agree that OKBET has the final right to interpret the game rules and betting status of customers participating in its services.',
  },
  disclaimerDesc34: {
    'zh-CN': '• OKBET不提供任何明示或暗示的保证，也不对其当前提供的服务的质量、适用性、完整性或准确性提供任何保证或解释。',
    'en-US': '• OKBET does not provide any express or implied guarantees for the services currently provided, nor does it provide any guarantees or explanations for the quality, suitability, completeness, or accuracy of its services.',
  },
  disclaimerDesc35: {
    'zh-CN': '• OKBET尽力为客户提供最高质量、最安全和最可靠的服务。然而，它不保证我们提供的服务的稳定性、及时性和准确性，或错误会及时纠正或网站不会受到病毒或蠕虫的干扰。',
    'en-US': '• OKBET does its best to provide customers with the highest quality, safest, and most reliable services. However, it does not guarantee the stability, timeliness, and accuracy of the services we provide, or that errors will be corrected in time or that the website will not be interfered with by viruses or worms.',
  },
  disclaimerDesc36: {
    'zh-CN': '• OKBET拥有绝对权利立即暂时或永久暂停、终止、修改、删除或添加服务内容，无需通知客户。OKBET不对由此产生的任何损失负责。',
    'en-US': '• OKBET has the absolute right to temporarily or permanently suspend, terminate, modify, delete, or add service content immediately, without notifying the customer. OKBET is not responsible for any losses arising therefrom.',
  },

  breachOfAgreementAndClaim: {
    'zh-CN': '违反协议和索赔',
    'en-US': 'Breach of Agreement and Claim',
  },
  breachOfAgreementAndClaimDesc1: {
    'zh-CN': '• 如果账户持有人违反本协议或其部分条款，OKBET有权采取适当的相应措施，包括终止协议、立即拦截和阻止访问其网站和服务、关闭账户、没收账户资金和/或采取必要的法律程序。',
    'en-US': '• If the account holder violates this agreement or part of its terms, OKBET has the right to take appropriate corresponding measures, including terminating the agreement, immediately intercepting and preventing access to its website and services, closing the account, confiscating account funds, and/or taking necessary legal proceedings.',
  },
  breachOfAgreementAndClaimDesc2: {
    'zh-CN': '• 账户持有人保证，如果OKBET及其股东、员工、工作人员、许可证持有人、被许可人、合作伙伴和附属公司发生以下情况，账户持有人将全额赔偿损失、成本、费用、律师费和其他费用，并保护其合法权益免受责任和负面影响。',
    'en-US': '• The account holder guarantees that if the following circumstances occur to OKBET and its shareholders, employees, staff, license holders, licensees, partners, and affiliates, the account holder will be fully responsible for compensation for losses, costs, expenses, attorney fees, and other charges, and will protect their legitimate rights and interests from liability and negative influences.',
  },
  breachOfAgreementAndClaimDesc3: {
    'zh-CN': '1. 账户持有人违反协议或部分协议。',
    'en-US': '1. Violation of the agreement or part of the agreement by the account holder.',
  },
  breachOfAgreementAndClaimDesc4: {
    'zh-CN': '2. 账户持有人违反法律法规或影响第三方的合法权利。',
    'en-US': '2. Violation of laws or regulations or affecting the legal rights of third parties by the account holder.',
  },
  breachOfAgreementAndClaimDesc5: {
    'zh-CN': '3. 账户持有人使用OKBET网站服务或其他人使用账户信息登录造成的其他负面结果，无论是否经过授权。',
    'en-US': '3. Other negative results caused by the account holder’s use of OKBET’s website services, or other people’s use of account information to log in, regardless of whether authorized or not.',
  },
  priority: {
    'zh-CN': '优先权',
    'en-US': 'Priority',
  },
  priorityDesc1: {
    'zh-CN': '• 游戏规则和关于访问和使用网站服务的任何其他协议条款将构成完整的协议。',
    'en-US': '• The rules of the game and any other terms of agreement regarding access to and use of the website services will form a complete agreement.',
  },
  priorityDesc2: {
    'zh-CN': '• 除非有明确规定，如果游戏规则与关于访问和使用网站服务的任何协议条款或协议的其他部分冲突，游戏规则将优先。',
    'en-US': '• Unless there are express provisions, if the game rules conflict with any agreement terms or other parts of the agreement about accessing and using the website services, the game rules will prevail.',
  },
  governingLaw: {
    'zh-CN': '适用法律',
    'en-US': 'Governing Law',
  },
  governingLawDesc1: {
    'zh-CN': '• 本协议及相关条款受菲律宾共和国相关法律的约束和监督。关于本条款及由此产生的任何诉讼、争议或分歧，菲律宾共和国的相关法院拥有唯一的解释和裁决权。各方不可撤销地放弃以下权利：否认菲律宾共和国审判，或声称菲律宾共和国法院没有管辖权，或应采用法院不便原则。',
    'en-US': '• This agreement and related clauses are subject to and supervised by the relevant laws of the Republic of the Philippines. Regarding any litigation, dispute, or disagreement on this clause and any matters arising therefrom, the relevant courts in the Republic of the Philippines have the sole right of interpretation and ruling. Each party irrevocably waives the following rights: deny the Republic of the Philippines trial, or claim that the Republic of the Philippines court does not have jurisdiction, or that the principle of court inconvenience should be adopted.',
  },
  issueResolution: {
    'zh-CN': '问题解决',
    'en-US': 'Issue Resolution',
  },
  issueResolutionDesc1: {
    'zh-CN': '• 如果任何个人想投诉OKBET产品或服务的任何方面，建议联系OKBET客服团队。',
    'en-US': '• If any individual wants to complain about any aspect of OKBET’s products or services, they are advised to contact the OKBET customer service team.',
  },
  issueResolutionDesc2: {
    'zh-CN': '• 在账户持有人投诉的初始阶段，OKBET将以公平和客观的方式调查此事，并尽可能提供实际结果和最终决定。',
    'en-US': '• In the initial stage of an account holder’s complaint, OKBET will investigate the matter in a fair and objective manner, and will provide practical results and final decisions as much as possible.',
  },
  issueResolutionDesc3: {
    'zh-CN': '• 可能会要求客户提供额外的信息、数据或适当的证据以帮助处理所述投诉。',
    'en-US': '• The customer might be asked to provide additional information, data, or appropriate evidence to help in handling the said complaint.',
  },
  issueResolutionDesc4: {
    'zh-CN': '• 替代争议解决 - 所有投诉在上诉过程中无法解决的，可以提交给相关独立机构裁决。',
    'en-US': '• Alternative dispute resolution – All complaints cannot be resolved during the appeal process and can be submitted to relevant independent agencies for adjudication.',
  },
  issueResolutionDesc5: {
    'zh-CN': '• 任何涉及相关独立机构的争议将由特定相关独立机构依法和争议解决程序处理。由此产生的决定为最终决定并具有执行力。',
    'en-US': '• Any disputes that refer to relevant independent institutions will be handled by specific relevant independent institutions in accordance with the law and the dispute resolution process. The resulting decision is final and executory.',
  },
  otherTerms: {
    'zh-CN': '其他条款',
    'en-US': 'Other Terms',
  },
  otherTermsDesc1: {
    'zh-CN': '• 官方使用条款以英文起草。翻译成其他语言是作为一种服务和善意进行的。如果英文版本与翻译版本之间存在差异，英文版本将取代并优先。',
    'en-US': '• The official Terms of Use have been drafted in English. Translations into other languages are made as a service and in good faith. In the event of discrepancy between the English version and a translation, the English version shall supersede and prevail.',
  },
  otherTermsDesc2: {
    'zh-CN': '• 如果协议中的条款被裁定为在某一法律类别中非法、无效或不可执行，这将不影响该条款在其他法律领域的适用，也不影响协议中其他条款在该法律类别中的适用，或其他条款在其他法律领域的适用。',
    'en-US': '• If a clause in the agreement is ruled as illegal, invalid, or unenforceable in a certain legal category, it will not affect the application of that clause in other legal areas, nor will it affect the application of other clauses in the agreement in that legal category, or other clauses. Application in other legal areas.',
  },
  otherTermsDesc3: {
    'zh-CN': '• 协议的标题仅供参考，不影响任何条款的组成或解释。',
    'en-US': '• The title of the agreement is for reference only, and it does not affect the composition or interpretation of any clause.',
  },
  otherTermsDesc4: {
    'zh-CN': '• 如果OKBET由于以下原因（包括自然灾害、政府控制、战争、骚乱、传输中断、系统崩溃、电信或宽带服务中断、电力中断等）未能按照协议规定履行其义务，则不构成违约。',
    'en-US': '• If OKBET fails to perform its obligations in accordance with the provisions of the agreement due to the following reasons (including natural disasters, government control, war, riots, transmission interruption, system crash, telecommunications or broadband service interruption, power interruption, etc.), it will not constitute a breach of contract.',
  },
  otherTermsDesc5: {
    'zh-CN': '• 在本协议中，OKBET未能或延迟行使或履行任何权利、补救措施或特权并不意味着OKBET已放弃此特权。',
    'en-US': '• In this agreement, OKBET’s failure or delay to exercise or perform any rights, remedies, or privileges do not mean that OKBET has waived this privilege.',
  },
  otherTermsDesc6: {
    'zh-CN': '• OKBET保留随时转让协议或部分内容的权利，无需通知。然而，账户持有人或任何访客无权转让OKBET关于本协议的权利或义务。',
    'en-US': '• OKBET reserves the right to transfer the agreement or part of the content at any time without notice. However, the account holder or any visitor has no right to transfer OKBET rights or obligations with respect to this agreement.',
  },
  otherTermsDesc7: {
    'zh-CN': '• 本协议不能产生或授予与本协议无关的第三方任何权利或其他利益。',
    'en-US': '• This agreement cannot generate or grant any rights or other benefits to third parties unrelated to this agreement.',
  },
  otherTermsDesc8: {
    'zh-CN': '• 本协议不能创建或被视为在OKBET与账户持有人之间创建合作、代理、信托或合资关系。',
    'en-US': '• This agreement cannot be created or cannot be regarded as creating a cooperation, agency, trust or joint venture relationship between OKBET and the account holder.',
  },
  otherTermsDesc9: {
    'zh-CN': '• 本协议是账户持有人或访客与OKBET之间关于网站服务使用的最新完整版本，将取代之前的版本。',
    'en-US': '• This agreement is the latest and complete version of the website service usage agreement between the account holder or a visitor and OKBET, and it will replace the previous version.',
  },

}
//  数据结构
const contentSections = [
  {
    id: 'generalIntroduction',
    titleKey: 'generalIntroduction',
    items: [
      { key: 'generalIntroDesc1' },
      { key: 'generalIntroDesc2' },
      { key: 'generalIntroDesc3' },
      { key: 'generalIntroDesc4' },
      { key: 'generalIntroDesc5' },
      { key: 'generalIntroDesc6' },
      { key: 'generalIntroDesc7' },
      { key: 'generalIntroDesc8' },
      { key: 'generalIntroDesc9' },
    ],
  },
  {
    id: 'definitionOfTerms',
    titleKey: 'definitionOfTerms',
    items: [
      { key: 'okbetAccount' },
      { key: 'equipment' },
      { key: 'game' },
      { key: 'software' },
      { key: 'sportsBetting' },
      { key: 'information' },
      { key: 'website' },
      { key: 'service' },
      { key: 'card' },
      { key: 'paymentSolutionProvider' },
      { key: 'regulator' },
      { key: 'financialInstitution' },
      { key: 'clientApplication' },
      { key: 'softwareDefinition' },
      { key: 'prize' },
      { key: 'inactiveAccount' },
    ],
  },
  {
    id: 'licenseIntellectualProperty',
    titleKey: 'licenseIntellectualProperty',
    items: [
      { key: 'licenseDesc1' },
      { key: 'licenseDesc2' },
      { key: 'licenseDesc3' },
      { key: 'licenseDesc4' },
      { key: 'licenseDesc5' },
      { key: 'licenseDesc6' },
      { key: 'licenseDesc7' },
      { key: 'licenseDesc8' },
      { key: 'licenseDesc9' },
    ],
  },
  {
    id: 'financialSecurity',
    titleKey: 'financialSecurity',
    items: [
      { key: 'financialSecurityDesc1' },
      { key: 'financialSecurityDesc2' },
    ],
  },
  {
    id: 'accountRegistration',
    titleKey: 'accountRegistration',
    items: [
      { key: 'accountRegistrationDesc1' },
      { key: 'accountRegistrationDesc2' },
      { key: 'accountRegistrationDesc3' },
      { key: 'accountRegistrationDesc4' },
      { key: 'accountRegistrationDesc5' },
      { key: 'publicOfficials' },
      { key: 'armedForces' },
      { key: 'underageStudents' },
      { key: 'pagcorOfficials' },
      { key: 'gamingSiteOperators' },
      { key: 'unregisteredPlayers' },
      { key: 'bannedIndividuals' },
      { key: 'relativesOfOfficials' },
      { key: 'playersOutsidePhilippines' },
      { key: 'okbetEmployees' },
      { key: 'accountRegistrationDesc6' },
      { key: 'accountRegistrationDesc7' },
      { key: 'accountRegistrationItem1' },
      { key: 'accountRegistrationItem2' },
      { key: 'accountRegistrationItem3' },
      { key: 'accountRegistrationItem4' },
      { key: 'accountRegistrationItem5' },
      { key: 'accountRegistrationItem6' },
      { key: 'accountRegistrationItem7' },
      { key: 'accountRegistrationItem8' },
      { key: 'accountRegistrationItem9' },
      { key: 'accountRegistrationItem10' },
      { key: 'accountRegistrationItem11' },
      { key: 'accountRegistrationItem12' },
      { key: 'accountRegistrationItem13' },
      { key: 'accountRegistrationItem14' },
      { key: 'accountRegistrationItem15' },
      { key: 'accountRegistrationItem16' },
      { key: 'accountRegistrationItem17' },
      { key: 'accountRegistrationItem18' },
      { key: 'accountRegistrationItem19' },
      { key: 'accountRegistrationItem20' },
      { key: 'accountRegistrationItem21' },
      { key: 'accountRegistrationItem22' },
      { key: 'accountRegistrationItem23' },
      { key: 'accountRegistrationItem24' },
      { key: 'accountRegistrationItem25' },
      { key: 'accountRegistrationItem26' },
      { key: 'accountRegistrationItem27' },
      { key: 'accountRegistrationItem28' },
      { key: 'accountRegistrationItem29' },
      { key: 'accountRegistrationItem30' },
      { key: 'accountRegistrationItem31' },
      { key: 'accountRegistrationItem32' },
      { key: 'accountRegistrationItem33' },
      { key: 'accountRegistrationItem34' },
    ],
  },
  {
    id: 'accountManagement',
    titleKey: 'accountManagement',
    items: [
      { key: 'accountManagementDesc1' },
      { key: 'accountManagementDesc2' },
      { key: 'accountManagementDesc3' },
      { key: 'accountManagementDesc4' },
      { key: 'accountManagementDesc5' },
      { key: 'accountManagementDesc6' },
      { key: 'accountManagementDesc7' },
      { key: 'accountManagementDesc8' },
      { key: 'accountManagementDesc9' },
      { key: 'accountManagementDesc10' },
      { key: 'accountManagementDesc11' },
      { key: 'accountManagementDesc12' },
      { key: 'accountManagementDesc13' },
      { key: 'accountManagementDesc14' },
      { key: 'accountManagementDesc15' },
      { key: 'accountManagementDesc16' },
      { key: 'accountManagementDesc17' },
      { key: 'accountManagementDesc18' },
      { key: 'accountManagementDesc19' },
      { key: 'accountManagementDesc20' },
      { key: 'accountManagementDesc21' },
      { key: 'accountManagementDesc22' },
      { key: 'accountManagementDesc23' },
      { key: 'accountManagementDesc24' },
      { key: 'accountManagementDesc25' },
      { key: 'accountManagementDesc26' },
      { key: 'accountManagementDesc27' },
    ],
  },
  {
    id: 'accountDormancy',
    titleKey: 'accountDormancy',
    items: [
      { key: 'accountDormancyDesc1' },
      { key: 'accountDormancyDesc2' },
      { key: 'accountDormancyDesc3' },
      { key: 'accountDormancyDesc4' },
      { key: 'accountDormancyDesc5' },
      { key: 'accountDormancyDesc6' },
    ],
  },
  {
    id: 'bettingRules',
    titleKey: 'bettingRules',
    items: [
      { key: 'bettingRulesDesc1' },
      { key: 'bettingRulesDesc2' },
      { key: 'bettingRulesDesc3' },
      { key: 'bettingRulesDesc4' },
      { key: 'bettingRulesDesc5' },
      { key: 'bettingRulesDesc6' },
      { key: 'bettingRulesDesc7' },
      { key: 'bettingRulesDesc8' },
      { key: 'bettingRulesDesc9' },
      { key: 'bettingRulesDesc10' },
      { key: 'bettingRulesDesc11' },
      { key: 'bettingRulesDesc12' },
      { key: 'bettingRulesDesc13' },
      { key: 'bettingRulesDesc14' },
      { key: 'bettingRulesDesc15' },
      { key: 'bettingRulesDesc16' },
      { key: 'bettingRulesDesc17' },
      { key: 'bettingRulesDesc18' },
      { key: 'bettingRulesDesc19' },
      { key: 'bettingRulesDesc20' },
      { key: 'bettingRulesDesc21' },
      { key: 'bettingRulesDesc22' },
      { key: 'bettingRulesDesc23' },
      { key: 'bettingRulesDesc24' },
      { key: 'bettingRulesDesc25' },
      { key: 'bettingRulesDesc26' },
      { key: 'bettingRulesDesc27' },
      { key: 'bettingRulesDesc28' },
      { key: 'bettingRulesDesc29' },
      { key: 'bettingRulesDesc30' },
      { key: 'bettingRulesDesc31' },
      { key: 'bettingRulesDesc32' },
    ],
  },

  {
    id: 'eventSpecificRules',
    titleKey: 'eventSpecificRules',
    items: [
      { key: 'soccer' },
      { key: 'soccerRule1' },
      { key: 'soccerRule2' },
      { key: 'soccerRule3' },
      { key: 'soccerRule4' },
      { key: 'soccerRule5' },
      { key: 'soccerRule6' },
      { key: 'soccerRule7' },
      { key: 'soccerRule8' },
      { key: 'soccerRule9' },
      { key: 'soccerRule10' },
      { key: 'soccerRule11' },
      { key: 'soccerRule12' },
      { key: 'soccerRule13' },
      { key: 'soccerRule14' },
      { key: 'soccerRule15' },
      { key: 'basketball' },
      { key: 'basketballRule1' },
      { key: 'basketballRule2' },
      { key: 'basketballRule3' },
      { key: 'basketballRule4' },
      { key: 'basketballRule5' },
      { key: 'basketballRule6' },
      { key: 'basketballRule7' },
      { key: 'tableTennis' },
      { key: 'tableTennisRule1' },
      { key: 'tableTennisRule2' },
      { key: 'tableTennisRule3' },
      { key: 'tableTennisRule4' },
      { key: 'tennis' },
      { key: 'tennisRule1' },
      { key: 'tennisRule2' },
      { key: 'tennisRule3' },
      { key: 'tennisRule5' },
      { key: 'tennisRule6' },
      { key: 'tennisRule7' },
      { key: 'tennisRule8' },
      { key: 'tennisRule9' },
      { key: 'tennisRule10' },
      { key: 'tennisRule11' },
      { key: 'volleyball' },
      { key: 'volleyballRule1' },
      { key: 'volleyballRule2' },
      { key: 'volleyballRule3' },
      { key: 'volleyballRule4' },
    ],
  },
  {
    id: 'tradingPolicy',
    titleKey: 'tradingPolicy',
    items: [
      { key: 'tradingPolicyDesc1' },
      { key: 'tradingPolicyDesc2' },
    ],
  },

  {
    id: 'refundPolicy',
    titleKey: 'refundPolicy',
    items: [
      { key: 'refundPolicyDesc1' },
      { key: 'refundPolicyDesc2' },
      { key: 'refundPolicyDesc3' },
      { key: 'refundPolicyDesc4' },
      { key: 'refundPolicyDesc5' },
      { key: 'refundPolicyDesc6' },
      { key: 'refundPolicyDesc7' },
      { key: 'refundPolicyDesc8' },
    ],
  },

  {
    id: 'kycPolicy',
    titleKey: 'kycPolicy',
    items: [
      { key: 'kycPolicyDesc1' },
      { key: 'kycPolicyDesc2' },
      { key: 'kycPolicyDesc3' },
      { key: 'kycPolicyDesc4' },
      { key: 'kycPolicyDesc5' },
      { key: 'kycPolicyDesc6' },
      { key: 'kycPolicyDesc7' },
      { key: 'kycPolicyDesc8' },
      { key: 'kycPolicyDesc9' },
      { key: 'kycPolicyDesc10' },
    ],
  },
  {
    id: 'verificationProcedures',
    titleKey: 'verificationProcedures',
    items: [
      { key: 'verificationProceduresDesc1' },
    ],
  },
  {
    id: 'identityVerification',
    titleKey: 'identityVerification',
    items: [
      { key: 'identityVerificationDesc1' },
      { key: 'identityVerificationDesc2' },
      { key: 'identityVerificationDesc3' },
      { key: 'identityVerificationDesc4' },
      { key: 'identityVerificationDesc5' },
      { key: 'identityVerificationDesc6' },
      { key: 'identityVerificationDesc7' },
      { key: 'identityVerificationDesc8' },
      { key: 'identityVerificationDesc9' },
      { key: 'identityVerificationDesc10' },
      { key: 'identityVerificationDesc11' },
      { key: 'identityVerificationDesc12' },
      { key: 'identityVerificationDesc13' },
      { key: 'identityVerificationDesc14' },
      { key: 'identityVerificationDesc15' },
      { key: 'identityVerificationDesc16' },
      { key: 'identityVerificationDesc17' },
      { key: 'identityVerificationDesc18' },
      { key: 'identityVerificationDesc19' },
      { key: 'identityVerificationDesc20' },
      { key: 'identityVerificationDesc21' },
      { key: 'identityVerificationDesc22' },
      { key: 'identityVerificationDesc23' },
      { key: 'identityVerificationDesc24' },
      { key: 'identityVerificationDesc25' },
      { key: 'identityVerificationDesc26' },
      { key: 'identityVerificationDesc27' },
      { key: 'identityVerificationDesc28' },
      { key: 'identityVerificationDesc29' },
    ],
  },
  {
    id: 'cardVerification',
    titleKey: 'cardVerification',
    items: [
      { key: 'cardVerificationDesc1' },
      { key: 'cardVerificationDesc2' },
      { key: 'cardVerificationDesc3' },
      { key: 'cardVerificationDesc4' },
      { key: 'cardVerificationDesc5' },
      { key: 'cardVerificationDesc6' },
      { key: 'cardVerificationDesc7' },
      { key: 'cardVerificationDesc8' },
      { key: 'cardVerificationDesc9' },
    ],
  },
  {
    id: 'complianceOfficer',
    titleKey: 'complianceOfficer',
    items: [
      { key: 'complianceOfficerDesc1' },
      { key: 'complianceOfficerDesc2' },
      { key: 'complianceOfficerDesc3' },
      { key: 'complianceOfficerDesc4' },
      { key: 'complianceOfficerDesc5' },
      { key: 'complianceOfficerDesc6' },
      { key: 'complianceOfficerDesc7' },
      { key: 'complianceOfficerDesc8' },
    ],
  },
  {
    id: 'monitoringTransactions',
    titleKey: 'monitoringTransactions',
    items: [
      { key: 'monitoringTransactionsDesc1' },
      { key: 'monitoringTransactionsDesc2' },
    ],
  },
  {
    id: 'caseDocumentManagement',
    titleKey: 'caseDocumentManagement',
    items: [
      { key: 'caseDocumentManagementDesc1' },
      { key: 'caseDocumentManagementDesc2' },
      { key: 'caseDocumentManagementDesc3' },
      { key: 'caseDocumentManagementDesc4' },
      { key: 'caseDocumentManagementDesc5' },
    ],
  },
  {
    id: 'riskAssessment',
    titleKey: 'riskAssessment',
    items: [
      { key: 'riskAssessmentDesc1' },
    ],
  },
  {
    id: 'antiMoneyLaunderingPolicy',
    titleKey: 'antiMoneyLaunderingPolicy',
    items: [
      { key: 'antiMoneyLaunderingPolicyDesc1' },
      { key: 'antiMoneyLaunderingPolicyDesc2' },
      { key: 'antiMoneyLaunderingPolicyDesc3' },
      { key: 'antiMoneyLaunderingPolicyDesc4' },
    ],
  },
  {
    id: 'okbetAntiMoneyLaunderingStrategies',
    titleKey: 'okbetAntiMoneyLaunderingStrategies',
    items: [
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc1' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc2' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc3' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc4' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc5' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc6' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc7' },
      { key: 'okbetAntiMoneyLaunderingStrategiesDesc8' },
    ],
  },
  {
    id: 'regulatoryCompliance',
    titleKey: 'regulatoryCompliance',
    items: [
      { key: 'regulatoryComplianceDesc1' },
      { key: 'regulatoryComplianceDesc2' },
      { key: 'regulatoryComplianceDesc3' },
    ],
  },
  {
    id: 'bonus',
    titleKey: 'bonus',
    items: [
      { key: 'bonusDesc1' },
      { key: 'bonusDesc2' },
      { key: 'bonusDesc3' },
      { key: 'bonusDesc4' },
      { key: 'bonusDesc5' },
      { key: 'bonusDesc6' },
      { key: 'bonusDesc7' },
    ],
  },
  {
    id: 'bonusAbuse',
    titleKey: 'bonusAbuse',
    items: [
      { key: 'bonusAbuseDesc1' },
      { key: 'bonusAbuseDesc2' },
      { key: 'bonusAbuseDesc3' },
      { key: 'bonusAbuseDesc4' },
      { key: 'bonusAbuseDesc5' },
      { key: 'bonusAbuseDesc6' },
      { key: 'bonusAbuseDesc7' },
      { key: 'bonusAbuseDesc8' },
      { key: 'bonusAbuseDesc9' },
    ],
  },
  {
    id: 'turnoverCalculationExclusions',
    titleKey: 'turnoverCalculationExclusions',
    items: [
      { key: 'turnoverCalculationExclusionsDesc1' },
      { key: 'turnoverCalculationExclusionsDesc2' },
      { key: 'turnoverCalculationExclusionsDesc3' },
    ],
  },
  {
    id: 'bettingRulesa',
    titleKey: 'bettingRulesa',
    items: [
      { key: 'bettingRulesaDesc1' },
      { key: 'bettingRulesaDesc2' },
    ],
  },
  {
    id: 'disclaimer',
    titleKey: 'disclaimer',
    items: [
      { key: 'disclaimerDesc1' },
      { key: 'disclaimerDesc2' },
      { key: 'disclaimerDesc3' },
      { key: 'disclaimerDesc4' },
      { key: 'disclaimerDesc5' },
      { key: 'disclaimerDesc6' },
      { key: 'disclaimerDesc7' },
      { key: 'disclaimerDesc8' },
      { key: 'disclaimerDesc9' },
      { key: 'disclaimerDesc10' },
      { key: 'disclaimerDesc11' },
      { key: 'disclaimerDesc12' },
      { key: 'disclaimerDesc13' },
      { key: 'disclaimerDesc14' },
      { key: 'disclaimerDesc15' },
      { key: 'disclaimerDesc16' },
      { key: 'disclaimerDesc17' },
      { key: 'disclaimerDesc18' },
      { key: 'disclaimerDesc19' },
      { key: 'disclaimerDesc20' },
      { key: 'disclaimerDesc21' },
      { key: 'disclaimerDesc22' },
      { key: 'disclaimerDesc23' },
      { key: 'disclaimerDesc24' },
      { key: 'disclaimerDesc25' },
      { key: 'disclaimerDesc26' },
      { key: 'disclaimerDesc27' },
      { key: 'disclaimerDesc28' },
      { key: 'disclaimerDesc29' },
      { key: 'disclaimerDesc30' },
      { key: 'disclaimerDesc31' },
      { key: 'disclaimerDesc32' },
      { key: 'disclaimerDesc33' },
      { key: 'disclaimerDesc34' },
      { key: 'disclaimerDesc35' },
      { key: 'disclaimerDesc36' },
    ],
  },

  {
    id: 'breachOfAgreementAndClaim',
    titleKey: 'breachOfAgreementAndClaim',
    items: [
      { key: 'breachOfAgreementAndClaimDesc1' },
      { key: 'breachOfAgreementAndClaimDesc2' },
      { key: 'breachOfAgreementAndClaimDesc3' },
      { key: 'breachOfAgreementAndClaimDesc4' },
      { key: 'breachOfAgreementAndClaimDesc5' },
    ],
  },
  {
    id: 'priority',
    titleKey: 'priority',
    items: [
      { key: 'priorityDesc1' },
      { key: 'priorityDesc2' },
    ],
  },
  {
    id: 'governingLaw',
    titleKey: 'governingLaw',
    items: [
      { key: 'governingLawDesc1' },
    ],
  },
  {
    id: 'issueResolution',
    titleKey: 'issueResolution',
    items: [
      { key: 'issueResolutionDesc1' },
      { key: 'issueResolutionDesc2' },
      { key: 'issueResolutionDesc3' },
      { key: 'issueResolutionDesc4' },
      { key: 'issueResolutionDesc5' },
    ],
  },
  {
    id: 'otherTerms',
    titleKey: 'otherTerms',
    items: [
      { key: 'otherTermsDesc1' },
      { key: 'otherTermsDesc2' },
      { key: 'otherTermsDesc3' },
      { key: 'otherTermsDesc4' },
      { key: 'otherTermsDesc5' },
      { key: 'otherTermsDesc6' },
      { key: 'otherTermsDesc7' },
      { key: 'otherTermsDesc8' },
      { key: 'otherTermsDesc9' },
    ],
  },

]

// 获取文本的方法
function getText(key: string): string {
  const textMap = i18nMap[key]
  if (!textMap) {
    console.warn(`Translation key "${key}" not found`)
    return key
  }
  // 根据当前站点语言获取对应字段
  const currentLang = getLang()
  const text = textMap[currentLang] || textMap['en-US'] || key
  return replaceBrandName(text)
}

onMounted(() => {
  setTitle(getText('termsOfUse'))
})
</script>

<template>
  <div class="bg-[#f5f5f5] min-h-screen leading-[1.15]">
    <!-- 语言切换按钮 -->
    <!-- <div class="bg-[#fff] p-[16rem] border-b border-[#e0e0e0] flex justify-end">
      <button
        @click="setLanguage('zh-CN')"
        :class="{ 'bg-[#007bff] text-white': getCurrentLanguage() === 'zh-CN' }"
        class="px-[12rem] py-[6rem] mr-[8rem] border border-[#007bff] text-[#007bff] rounded-[4rem] text-[12rem]"
      >
        中文
      </button>
      <button
        @click="setLanguage('en-US')"
        :class="{ 'bg-[#007bff] text-white': getCurrentLanguage() === 'en-US' }"
        class="px-[12rem] py-[6rem] border border-[#007bff] text-[#007bff] rounded-[4rem] text-[12rem]"
      >
        English
      </button>
    </div> -->

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
  background-color: var(--space_gap, #f0f0f0);
  width: calc(100% - 24px);
  margin: 0 auto;
}
</style>
