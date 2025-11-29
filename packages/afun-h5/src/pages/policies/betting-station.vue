<script setup lang='ts'>
import { AfunBaseImage, BaseButton } from '@tg/bccomponents'
import { getEnv } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'BettingStation' })

const { t } = useI18n()
// 使用语言store
const { VITE_OFFICIAL_NAME } = getEnv()
const setTitle = inject('setTitle', (v: string) => {})

// 获取当前语言
const currentLanguage = ref(getLang())

//  对象
const i18nMap: any = {
  okbet: {
    'zh-CN': VITE_OFFICIAL_NAME,
    'en-US': VITE_OFFICIAL_NAME,
  },
  bettingStation: {
    'zh-CN': '投注站',
    'en-US': 'Betting Station',
  },
  title0: {
    'zh-CN': `帕赛 ${VITE_OFFICIAL_NAME} 投注站 – 已关闭`,
    'en-US': `Pasay ${VITE_OFFICIAL_NAME} Station – Closed`,
  },
  title1: {
    'zh-CN': '纽波特世界度假村 – 已关闭',
    'en-US': 'Newport World Resort – Closed',
  },
  title2: {
    'zh-CN': `曼达维 ${VITE_OFFICIAL_NAME} 投注站 (宾果蜜蜂)`,
    'en-US': `Mandaue ${VITE_OFFICIAL_NAME} Station (Bingo BEE)`,
  },
  title3: {
    'zh-CN': `莫龙 ${VITE_OFFICIAL_NAME} 投注站 (宾果蜜蜂)`,
    'en-US': `Morong ${VITE_OFFICIAL_NAME} Station (Bingo Bee)`,
  },
  title4: {
    'zh-CN': `新怡诗夏 ${VITE_OFFICIAL_NAME} 投注站 (投注赢利)`,
    'en-US': `Nueva Ecija ${VITE_OFFICIAL_NAME} Station (Bet & Win)`,
  },
  title5: {
    'zh-CN': `黎牙实比 ${VITE_OFFICIAL_NAME} 投注站 (777-电子游戏)`,
    'en-US': `Legazpi ${VITE_OFFICIAL_NAME} Station (777-Egaming)`,
  },
  title6: {
    'zh-CN': `圣罗莎 ${VITE_OFFICIAL_NAME} 投注站 (欢乐工厂)`,
    'en-US': `Santa Rosa ${VITE_OFFICIAL_NAME} Station (Fun Factory)`,
  },
  title7: {
    'zh-CN': `奎松 ${VITE_OFFICIAL_NAME} 投注站 (穆尼奥斯宾果)`,
    'en-US': `Quezon ${VITE_OFFICIAL_NAME} Station (Muñoz Bingo)`,
  },
  title8: {
    'zh-CN': `帕索德布拉斯 ${VITE_OFFICIAL_NAME} 投注站 (BFC 电子宾果)`,
    'en-US': `Paso De Blas ${VITE_OFFICIAL_NAME} Station (BFC E-Bingo)`,
  },
  title9: {
    'zh-CN': `打拉 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Tarlac ${VITE_OFFICIAL_NAME} station (E-Games)`,
  },
  title10: {
    'zh-CN': `罗德里格斯 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Rodriguez ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title11: {
    'zh-CN': `拉乌尼翁 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `La Union ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title12: {
    'zh-CN': `帕克购物 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Park n\'shop ${VITE_OFFICIAL_NAME} Station (E-games)`,
  },
  title13: {
    'zh-CN': `盖萨诺 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Gaisano ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title14: {
    'zh-CN': `泰泰 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Taytay ${VITE_OFFICIAL_NAME} Station (E-games)`,
  },
  title15: {
    'zh-CN': `佬沃 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Laoag ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title16: {
    'zh-CN': `CK 购物中心 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `CK Mall ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title17: {
    'zh-CN': `布恩迪亚 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Buendia ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title18: {
    'zh-CN': `多娜胡安娜 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Dona Juana ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title19: {
    'zh-CN': `巴永邦 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Bayombong ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title20: {
    'zh-CN': `普韦布洛德奥罗 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Pueblo De Oro ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title21: {
    'zh-CN': `诺瓦购物中心 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Nova Mall ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title22: {
    'zh-CN': `卡拉亚安 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Kalayaan ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title23: {
    'zh-CN': `卡拉潘 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Calapan ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title24: {
    'zh-CN': `阿拉米诺斯 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Alaminos ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title25: {
    'zh-CN': `城市购物中心 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Citi Mall ${VITE_OFFICIAL_NAME} Station (E-Games)`,
  },
  title26: {
    'zh-CN': `凯购物中心 ${VITE_OFFICIAL_NAME} 投注站 (电子游戏)`,
    'en-US': `Kai Mall ${VITE_OFFICIAL_NAME} Station( E-Games )`,
  },
  mobile: {
    'zh-CN': '手机 :',
    'en-US': 'Mobile :',
  },
  mobile0: {
    'zh-CN': '9604740119',
    'en-US': '9604740119',
  },
  mobile1: {
    'zh-CN': '9604740119',
    'en-US': '9604740119',
  },
  mobile2: {
    'zh-CN': '9669807486',
    'en-US': '9669807486',
  },
  mobile3: {
    'zh-CN': '9773858520',
    'en-US': '9773858520',
  },
  mobile4: {
    'zh-CN': '9271524769',
    'en-US': '9271524769',
  },
  mobile5: {
    'zh-CN': '9778228825',
    'en-US': '9778228825',
  },
  mobile6: {
    'zh-CN': '9778228825',
    'en-US': '9778228825',
  },
  mobile7: {
    'zh-CN': '9334577053',
    'en-US': '9334577053',
  },
  mobile8: {
    'zh-CN': '9388617630',
    'en-US': '9388617630',
  },
  mobile9: {
    'zh-CN': '0270903327',
    'en-US': '0270903327',
  },
  mobile10: {
    'zh-CN': '09695712236',
    'en-US': '09695712236',
  },
  mobile11: {
    'zh-CN': '09433733736',
    'en-US': '09433733736',
  },
  mobile12: {
    'zh-CN': '7421062',
    'en-US': '7421062',
  },
  mobile13: {
    'zh-CN': '09772415244',
    'en-US': '09772415244',
  },
  mobile14: {
    'zh-CN': '09212675459',
    'en-US': '09212675459',
  },
  mobile15: {
    'zh-CN': '09505463818',
    'en-US': '09505463818',
  },
  mobile16: {
    'zh-CN': '09998877562',
    'en-US': '09998877562',
  },
  mobile17: {
    'zh-CN': '09089148474',
    'en-US': '09089148474',
  },
  mobile18: {
    'zh-CN': '09569323747',
    'en-US': '09569323747',
  },
  mobile19: {
    'zh-CN': '09560254232',
    'en-US': '09560254232',
  },
  mobile20: {
    'zh-CN': '09983179700',
    'en-US': '09983179700',
  },
  mobile21: {
    'zh-CN': '09664179660',
    'en-US': '09664179660',
  },
  mobile22: {
    'zh-CN': '09999546029',
    'en-US': '09999546029',
  },
  mobile23: {
    'zh-CN': '09498468342',
    'en-US': '09498468342',
  },
  mobile24: {
    'zh-CN': '09701486233',
    'en-US': '09701486233',
  },
  mobile25: {
    'zh-CN': '09563008319',
    'en-US': '09563008319',
  },
  mobile26: {
    'zh-CN': '09397297695',
    'en-US': '09397297695',
  },
  openingHour: {
    'zh-CN': '营业时间 :',
    'en-US': 'Opening Hour :',
  },

  openingHour0: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  openingHour1: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  openingHour2: {
    'zh-CN': '07:00 - 04:00',
    'en-US': '07:00 - 04:00',
  },
  openingHour3: {
    'zh-CN': '09:00 - 05:00',
    'en-US': '09:00 - 05:00',
  },
  openingHour4: {
    'zh-CN': '10:00 - 23:00',
    'en-US': '10:00 - 23:00',
  },
  openingHour5: {
    'zh-CN': '09:00 - 03:00',
    'en-US': '09:00 - 03:00',
  },
  openingHour6: {
    'zh-CN': '06:00 - 05:00',
    'en-US': '06:00 - 05:00',
  },
  openingHour7: {
    'zh-CN': '10:00 - 05:00',
    'en-US': '10:00 - 05:00',
  },
  openingHour8: {
    'zh-CN': '10:00 - 04:00',
    'en-US': '10:00 - 04:00',
  },
  openingHour9: {
    'zh-CN': '12:00 - 11:59',
    'en-US': '12:00 - 11:59',
  },
  openingHour10: {
    'zh-CN': '14:00 - 02:00',
    'en-US': '14:00 - 02:00',
  },
  openingHour11: {
    'zh-CN': '12:00 - 06:00',
    'en-US': '12:00 - 06:00',
  },
  openingHour12: {
    'zh-CN': '12:00 - 06:00',
    'en-US': '12:00 - 06:00',
  },
  openingHour13: {
    'zh-CN': '10:00 - 06:00',
    'en-US': '10:00 - 06:00',
  },
  openingHour14: {
    'zh-CN': '10:00 - 02:00',
    'en-US': '10:00 - 02:00',
  },
  openingHour15: {
    'zh-CN': '10:00 - 06:00',
    'en-US': '10:00 - 06:00',
  },
  openingHour16: {
    'zh-CN': '10:00 - 04:00',
    'en-US': '10:00 - 04:00',
  },
  openingHour17: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  openingHour18: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  openingHour19: {
    'zh-CN': '10:00 - 06:00',
    'en-US': '10:00 - 06:00',
  },
  openingHour20: {
    'zh-CN': '10:00 - 00:00',
    'en-US': '10:00 - 00:00',
  },
  openingHour21: {
    'zh-CN': '09:00 - 04:00',
    'en-US': '09:00 - 04:00',
  },
  openingHour22: {
    'zh-CN': '09:00 - 04:00',
    'en-US': '09:00 - 04:00',
  },
  openingHour23: {
    'zh-CN': '06:00 - 06:00',
    'en-US': '06:00 - 06:00',
  },
  openingHour24: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  openingHour25: {
    'zh-CN': '12:00 - 06:00',
    'en-US': '12:00 - 06:00',
  },
  openingHour26: {
    'zh-CN': '00:00 - 00:00',
    'en-US': '00:00 - 00:00',
  },
  location: {
    'zh-CN': '地址 :',
    'en-US': 'Location :',
  },
  location0: {
    'zh-CN': '帕赛市圣罗克区第147区S区唐卡洛斯雷维拉街346号EDSA转角2单元',
    'en-US': 'Unit 2 346 Edsa Cor. Don Carlos Revilla St. Brgy 147 District S,San Roque Pasay City',
  },
  location1: {
    'zh-CN': '花园翼楼 - 纽波特，帕赛市，大马尼拉',
    'en-US': 'Garden Wing - Newport, Pasay, Metro Manila',
  },
  location2: {
    'zh-CN': '宾果蜜蜂2楼，柱廊超市，B.塞尼萨街P.戈麦斯转角，曼达维市中心区',
    'en-US': 'Bingo Bee 2nd Floor, Colonnade Supermarket, B. Ceniza St. Corner P. Gomez. Brgy. Centro Mandaue City',
  },
  location3: {
    'zh-CN': 'T.克劳迪奥052号，莫龙，1960年黎刹',
    'en-US': '052 T. Claudio, Morong, 1960 Rizal',
  },
  location4: {
    'zh-CN': '马文活动中心，圣莱昂纳多，新怡诗夏',
    'en-US': 'Mavin\'s Event Center, San Leonardo, Nueva Ecija',
  },
  location5: {
    'zh-CN': '塔楼购物中心4号楼3楼，兰德科商业园，F.帝国街，卡潘塔万区，黎牙实比市，阿尔拜',
    'en-US': '3/F Tower Mall Building 4, Landco Business Park, F. Imperial St., Brgy. Capantawan Legazpi City, Albay',
  },
  location6: {
    'zh-CN': '玉髓街，巴利巴戈综合楼，圣罗莎，拉古纳',
    'en-US': 'Chalcedony ST. BaliBago Complex Santa Rosa Laguna',
  },
  location7: {
    'zh-CN': '塔楼购物中心4号楼3楼，兰德科商业园，F.帝国街，卡潘塔万区，黎牙实比市，阿尔拜',
    'en-US': '3/F Tower Mall Building 4, Landco Business Park, F. Imperial St., Brgy. Capantawan Legazpi City, Albay',
  },
  location8: {
    'zh-CN': '玉髓街，巴利巴戈综合楼，圣罗莎，拉古纳',
    'en-US': 'Chalcedony ST. BaliBago Complex Santa Rosa Laguna',
  },
  location9: {
    'zh-CN': '穆尼奥斯广场大楼3楼，EDSA罗斯福大道转角，奎松市',
    'en-US': '3/F Munoz Plaza Building, EDSA Corner Roosevelt Avenue,Quezon City',
  },
  location10: {
    'zh-CN': 'LB大楼，帕索德布拉斯515号，瓦伦苏埃拉市',
    'en-US': 'LB Building, No 515 Paso de Blas, Valenzuela City',
  },
  location11: {
    'zh-CN': '奥罗广场拱廊，胡安卢纳延伸段，圣克里斯托区，打拉市',
    'en-US': 'Plaza de Oro Arcade, Juan Luna Ext.,Brgy.Sto.Cristo,Tarlac City',
  },
  location12: {
    'zh-CN': '祖尼加大楼2楼，E.罗德里格斯高速公路137号，曼加汉区，罗德里格斯1860年黎刹',
    'en-US': '2/F Zuniga Bulding, No. 137 E. Rodriguez Hiway, Brgy. Manggahan, Rodriguez 1860 Rizal',
  },
  location13: {
    'zh-CN': '祖尼加大楼2楼，E.罗德里格斯高速公路137号，曼加汉区，罗德里格斯1860年黎刹',
    'en-US': '2/F Zuniga Bulding, No. 137 E. Rodriguez Hiway, Brgy. Manggahan, Rodriguez 1860 Rizal',
  },
  location14: {
    'zh-CN': '3&4单元，马兰德别墅，麦克阿瑟高速公路，巴库特南，包昂，拉乌尼翁',
    'en-US': 'Unit 3 & 4, Villa Marand, Mc Arthur Highway, Baccuit  Sur, Bauang, La Union ',
  },
  location15: {
    'zh-CN': '8300帕克购物，A.桑托斯博士大道苏卡特路，BF区，帕拉纳克市',
    'en-US': '8300 Park and shop,DR. A. Santos Ave. Sucat Rd. Brgy. BF, Paranaque City',
  },
  location16: {
    'zh-CN': '一楼，盖萨诺首都卡孙廷甘，M.L奎松街，曼达维市',
    'en-US': 'Ground Floor, Gaisano Capital Casuntingan, M.L Quezon St., Mandaue City',
  },
  location17: {
    'zh-CN': 'PBWY综合楼，贝拉斯克斯街，班吉亚德社区，圣胡安泰泰，黎刹',
    'en-US': 'PBWY Complex, Velasquez St.,Sitio Bangiad, San Juan Taytay,Rizal',
  },
  location18: {
    'zh-CN': '一楼，1&2单元，绕行中心，48-A区，北卡邦安，佬沃市，北伊罗戈斯',
    'en-US': 'Ground Floor, Unit 1&2, By-Pass center, Brgy.48-A, Cabungaan North. Laoag City, ilosos Norte',
  },
  location19: {
    'zh-CN': 'CK广场购物中心，奥尔蒂加斯大道延伸段，圣尼诺区，凯因塔黎刹',
    'en-US': 'CK Square Mall, Ortigas Ave. Ext,. Brgy. Sto Nino, Cainta Rizal',
  },
  location20: {
    'zh-CN': 'B02，IPI布恩迪亚塔公寓，501参议员吉尔普亚特大道，帕赛市',
    'en-US': 'B02, IPI Buendia Tower Condominium, 501 Sen. Gil Puyat Ave., Pasay City',
  },
  location21: {
    'zh-CN': '8单元百老汇公园，多娜胡安娜，罗德里格斯大道，第一街转角，新马尼拉，奎松市',
    'en-US': 'Unit 8 Broadway Parke, Dona Juana, Rodriguez Ave., corner 1st St., New Manila,  Quezon City',
  },
  location22: {
    'zh-CN': '2楼，罗温商业空间租赁，1号社区，卢扬区，巴永邦，新比斯开',
    'en-US': '2nd Floor, Rowin Commercial Space Rental,Purok 1, Brgy. Luyang, Bayombong, Nueva Vizcaya',
  },
  location23: {
    'zh-CN': 'VLC一号塔，L1 B1商业园普韦布洛德奥罗姆卡门，卡加延德奥罗',
    'en-US': 'VLC Tower One,L1 B1 Business Park Pueblo De Orom Carmen, Cagayan de oro',
  },
  location24: {
    'zh-CN': '下6楼，1123诺瓦利切斯广场购物中心，基里诺高速公路拉米雷斯转角，诺瓦利切斯本区，奎松市',
    'en-US': 'Lower 6f , 1123 Novaliches Plaza mall , Quirino Highway cor. Ramirez, Novaliches proper , Quezon City.',
  },
  location25: {
    'zh-CN': '一楼，卡拉亚安中心点，24卡拉亚安V转角，卢纳街，奎松市',
    'en-US': 'Ground Floor , Kalayaan centerpoint, 24 Kalayaan corner v , luna st, Quezon City',
  },
  location26: {
    'zh-CN': 'NCC-SB1-GS-03努西蒂中央购物中心，J.P.黎刹街卡米尔米尔卡拉潘市，东民都洛',
    'en-US': 'NCC- SB1- GS- 03 Nuciti Central mall, J.P.Rizal st camilmil Calapan city , Oriental Mindoro',
  },
  viewMap: {
    'zh-CN': '查看地图',
    'en-US': 'View Map',
  },
}

// 投注站经纬度数据
const stationCoordinates = [
  { lat: 14.5378, lng: 121.0014 }, // Pasay  Station
  { lat: 14.5236, lng: 121.0194 }, // Newport World Resort
  { lat: 10.3233, lng: 123.9400 }, // Mandaue  Station
  { lat: 14.5183, lng: 121.2375 }, // Morong  Station
  { lat: 15.5270, lng: 120.9690 }, // Nueva Ecija  Station
  { lat: 13.1390, lng: 123.7330 }, // Legazpi  Station
  { lat: 14.3167, lng: 121.1167 }, // Santa Rosa  Station
  { lat: 14.6760, lng: 121.0437 }, // Quezon  Station
  { lat: 14.6969, lng: 120.9821 }, // Paso De Blas  Station
  { lat: 15.4800, lng: 120.5970 }, // Tarlac  station
  { lat: 14.7234, lng: 121.1200 }, // Rodriguez  Station
  { lat: 16.6167, lng: 120.3167 }, // La Union  Station
  { lat: 14.4790, lng: 121.0360 }, // Park n'shop  Station
  { lat: 10.3233, lng: 123.9400 }, // Gaisano  Station
  { lat: 14.5690, lng: 121.1320 }, // Taytay  Station
  { lat: 18.1960, lng: 120.5950 }, // Laoag  Station
  { lat: 14.5890, lng: 121.1220 }, // CK Mall  Station
  { lat: 14.5378, lng: 121.0014 }, // Buendia  Station
  { lat: 14.6230, lng: 121.0160 }, // Dona Juana  Station
  { lat: 16.4810, lng: 121.1490 }, // Bayombong  Station
  { lat: 8.4790, lng: 124.6430 }, // Pueblo De Oro  Station
  { lat: 14.7234, lng: 121.1200 }, // Nova Mall  Station
  { lat: 14.6230, lng: 121.0160 }, // Kalayaan  Station
  { lat: 13.4100, lng: 121.1790 }, // Calapan  Station
  { lat: 16.1550, lng: 119.9810 }, // Alaminos  Station
  { lat: 14.4790, lng: 121.0360 }, // Citi Mall  Station
  { lat: 14.5890, lng: 121.1220 }, // Kai Mall  Station
]

// 结构
const contentSections = [
  {
    id: 'mapId0',
    titleKey: 'title0',
    titile: 'title0',
    mobile: 'mobile0',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour0',
    locationText: 'location',
    location: 'location0',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[0],
  },
  {
    id: 'mapId1',
    titleKey: 'title1',
    titile: 'title1',
    mobile: 'mobile1',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour1',
    locationText: 'location',
    location: 'location1',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[1],
  },
  {
    id: 'mapId2',
    titleKey: 'title2',
    titile: 'title2',
    mobile: 'mobile2',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour2',
    locationText: 'location',
    location: 'location2',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[2],
  },
  {
    id: 'mapId3',
    titleKey: 'title3',
    titile: 'title3',
    mobile: 'mobile3',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour3',
    locationText: 'location',
    location: 'location3',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[3],
  },
  {
    id: 'mapId4',
    titleKey: 'title4',
    titile: 'title4',
    mobile: 'mobile4',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour4',
    locationText: 'location',
    location: 'location4',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[4],
  },
  {
    id: 'mapId5',
    titleKey: 'title5',
    titile: 'title5',
    mobile: 'mobile5',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour5',
    locationText: 'location',
    location: 'location5',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[5],
  },
  {
    id: 'mapId6',
    titleKey: 'title6',
    titile: 'title6',
    mobile: 'mobile6',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour6',
    locationText: 'location',
    location: 'location6',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[6],
  },
  {
    id: 'mapId7',
    titleKey: 'title7',
    titile: 'title7',
    mobile: 'mobile7',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour7',
    locationText: 'location',
    location: 'location7',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[7],
  },
  {
    id: 'mapId8',
    titleKey: 'title8',
    titile: 'title8',
    mobile: 'mobile8',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour8',
    locationText: 'location',
    location: 'location8',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[8],
  },
  {
    id: 'mapId9',
    titleKey: 'title9',
    titile: 'title9',
    mobile: 'mobile9',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour9',
    locationText: 'location',
    location: 'location9',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[9],
  },
  {
    id: 'mapId10',
    titleKey: 'title10',
    titile: 'title10',
    mobile: 'mobile10',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour10',
    locationText: 'location',
    location: 'location10',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[10],
  },
  {
    id: 'mapId11',
    titleKey: 'title11',
    titile: 'title11',
    mobile: 'mobile11',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour11',
    locationText: 'location',
    location: 'location11',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[11],
  },
  {
    id: 'mapId12',
    titleKey: 'title12',
    titile: 'title12',
    mobile: 'mobile12',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour12',
    locationText: 'location',
    location: 'location12',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[12],
  },
  {
    id: 'mapId13',
    titleKey: 'title13',
    titile: 'title13',
    mobile: 'mobile13',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour13',
    locationText: 'location',
    location: 'location13',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[13],
  },
  {
    id: 'mapId14',
    titleKey: 'title14',
    titile: 'title14',
    mobile: 'mobile14',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour14',
    locationText: 'location',
    location: 'location14',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[14],
  },
  {
    id: 'mapId15',
    titleKey: 'title15',
    titile: 'title15',
    mobile: 'mobile15',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour15',
    locationText: 'location',
    location: 'location15',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[15],
  },
  {
    id: 'mapId16',
    titleKey: 'title16',
    titile: 'title16',
    mobile: 'mobile16',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour16',
    locationText: 'location',
    location: 'location16',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[16],
  },
  {
    id: 'mapId17',
    titleKey: 'title17',
    titile: 'title17',
    mobile: 'mobile17',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour17',
    locationText: 'location',
    location: 'location17',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[17],
  },
  {
    id: 'mapId18',
    titleKey: 'title18',
    titile: 'title18',
    mobile: 'mobile18',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour18',
    locationText: 'location',
    location: 'location18',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[18],
  },
  {
    id: 'mapId19',
    titleKey: 'title19',
    titile: 'title19',
    mobile: 'mobile19',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour19',
    locationText: 'location',
    location: 'location19',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[19],
  },
  {
    id: 'mapId20',
    titleKey: 'title20',
    titile: 'title20',
    mobile: 'mobile20',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour20',
    locationText: 'location',
    location: 'location20',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[20],
  },
  {
    id: 'mapId21',
    titleKey: 'title21',
    titile: 'title21',
    mobile: 'mobile21',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour21',
    locationText: 'location',
    location: 'location21',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[21],
  },
  {
    id: 'mapId22',
    titleKey: 'title22',
    titile: 'title22',
    mobile: 'mobile22',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour22',
    locationText: 'location',
    location: 'location22',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[22],
  },
  {
    id: 'mapId23',
    titleKey: 'title23',
    titile: 'title23',
    mobile: 'mobile23',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour23',
    locationText: 'location',
    location: 'location23',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[23],
  },
  {
    id: 'mapId24',
    titleKey: 'title24',
    titile: 'title24',
    mobile: 'mobile24',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour24',
    locationText: 'location',
    location: 'location24',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[24],
  },
  {
    id: 'mapId25',
    titleKey: 'title25',
    titile: 'title25',
    mobile: 'mobile25',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour25',
    locationText: 'location',
    location: 'location25',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[25],
  },
  {
    id: 'mapId26',
    titleKey: 'title26',
    titile: 'title26',
    mobile: 'mobile26',
    mobileText: 'mobile',
    openingHourText: 'openingHour',
    openingHour: 'openingHour26',
    locationText: 'location',
    location: 'location26',
    viewMapText: 'viewMap',
    coordinates: stationCoordinates[26],
  },
]

// 获取文本
function getText(key: string): string {
  const textMap = i18nMap[key]
  if (!textMap) {
    console.warn(`Translation key "${key}" not found`)
    return key // 如果没有找到key，返回key本身
  }
  return textMap[currentLanguage.value] || textMap['en-US'] || key
}

// 跳转到地图
function openMap(coordinates: { lat: number, lng: number }, locationName: string) {
  // 检测设备类型
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)

  // 构建地图URL
  let mapUrl = ''

  if (isIOS) {
    // iOS设备使用Apple Maps
    mapUrl = `http://maps.apple.com/?q=${encodeURIComponent(locationName)}&ll=${coordinates.lat},${coordinates.lng}`
  }
  else if (isAndroid) {
    // Android设备使用Google Maps
    mapUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
  }
  else {
    // 桌面设备使用Google Maps
    mapUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
  }

  // 打开地图
  window.open(mapUrl, '_blank')
}

onMounted(() => {
  setTitle(t('投注站'))
})
</script>

<template>
  <div class="parent">
    <div class="img-box-parent">
      <div class="img-box">
        <AfunBaseImage url="/m/afun-h5/png/betting-station.png" />
        <span class="img-box-text" />
      </div>
    </div>
    <div class="divider-24" />
    <div class="img-wh">
      <div class="txt-24">
        <span>{{ getText('okbet') }}</span> {{ getText('bettingStation') }}
      </div>
    </div>
    <div class="contact-parent">
      <!-- 地址信息 -->
      <div v-for="section in contentSections" :key="section.id" class="contact-box">
        <span class="text-title">{{ getText(section.titleKey) }}</span>
        <div class="contact-item">
          <span class="contact-item-span">
            <AfunBaseImage url="/m/afun-h5/png/icon-phone.png" />
          </span>
          <div class="contact-last">
            <span class="contact-middle-text">{{ getText(section.mobileText) }}</span>
            <span class="contact-content-text">{{ getText(section.mobile) }}</span>
          </div>
        </div>
        <div class="divider-1" />
        <div class="contact-item">
          <span class="contact-item-span">
            <AfunBaseImage url="/m/afun-h5/png/icon-clock.png" />
          </span>
          <div class="contact-last">
            <span class="contact-middle-text">{{ getText(section.openingHourText) }}</span>
            <span class="contact-content-text">{{ getText(section.openingHour) }}</span>
          </div>
        </div>
        <div class="divider-1" />
        <div class="contact-item">
          <span class="contact-item-span">
            <AfunBaseImage url="/m/afun-h5/png/icon-location.png" />
          </span>
          <div class="contact-last">
            <span class="contact-middle-text">{{ getText(section.locationText) }}</span>
            <span class="contact-content-text">{{ getText(section.location) }}</span>
          </div>
        </div>
        <BaseButton class="view-map-btn" @click="openMap(section.coordinates, getText(section.location))">
          <span class="icon-map">
            <AfunBaseImage url="/m/afun-h5/png/icon-map.png" />
          </span>
          <span>{{ getText(section.viewMapText) }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.parent {
  position: relative;
  background-color: #f6f7f8;
}
.img-box-parent {
  width: 100%;
  padding-top: 91.28%;
  position: relative;
}
.img-box {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.img-box-text {
  position: absolute;
  display: block;
  content-visibility: auto;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
}
.divider-24 {
  height: 24px;
}
.img-wh {
  width: 100%;
  height: 70px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.txt-24 {
  width: 300px;
  color: #0d2245;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: uppercase;
  text-align: center;
  & span {
    color: #025be8;
  }
}
.contact-parent {
  position: relative;
  padding: 12px;
}
.contact-box {
  flex-direction: column;
  border-radius: 12px;
  border: 15px solid #fff;
  padding: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.text-title {
  color: #0d2245;
  font-size: 16px;
  font-weight: 700;
  padding-left: 9px;
  padding-right: 9px;
  padding-bottom: 7px;
}
.contact-item {
  display: flex;
  flex-direction: row;
  justify-content: start;
  padding: 2px;
  gap: 6px;
}
.contact-item-span {
  position: relative;
  display: block;
  content-visibility: auto;
  width: 18px;
  height: 18px;
  aspect-ratio: 1 / 1;
}
.contact-last {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 6px;
}
.contact-middle-text {
  font-weight: 274;
  font-size: 12px;
  line-height: 20px;
  color: #6d7693;
}
.contact-content-text {
  font-weight: 274;
  font-size: 12px;
  text-align: start;
  color: #0d2245;
  flex: 1;
}
.divider-1 {
  height: 1px;
  background-color: #ebebeb;
  width: 100%;
  margin-top: 1px;
  margin-bottom: 1px;
}
.icon-map {
  position: relative;
  display: block;
  content-visibility: auto;
  width: 20px;
  height: 20px;
  aspect-ratio: 1 / 1;
}
.view-map-btn {
  font-size: 14px;
  height: 32px;
  padding: 0px 15px;
  border-radius: 8px;
  background: #025be8;
  color: #fff;
  box-shadow: none;
  gap: 8px;
  margin-top: 10px;
}
</style>
