<script lang="ts" setup>
import { getLang } from '@tg/vue-i18n'
import { IconUniJumpPage } from '@tg/icons'

const { VITE_OFFICIAL_NAME } = getEnv()
const { theme } = storeToRefs(useAppStore())
const lang = getLang()

const doc = [
  // 0 主标题
  {
    'en-US': 'Solving the Trust Issue with Online Gambling',
    'zh-CN': '解决在线博彩中的信任问题',
    'th-TH': 'การแก้ไขปัญหาความไว้วางใจในการพนันออนไลน์',
    'ja-JP': 'オンラインギャンブルにおける信頼問題の解決',
    'ko-KR': '온라인 도박의 신뢰 문제 해결',
    'vi-VN': 'Giải quyết vấn đề niềm tin trong cờ bạc trực tuyến',
    'in-ID': 'Memecahkan Masalah Kepercayaan dalam Perjudian Online',
    'hi-IN': 'ऑनलाइन जुए में विश्वास की समस्या का समाधान',
    'pt-BR': 'Resolvendo o problema da confiança nos jogos de azar online',
    'tl-PH': 'Paglutas ng Problema sa Pagtitiwala sa Online na Pagsusugal',
    'es-ES': 'Resolver el problema de la confianza en las apuestas en línea',
  },

  // 1 概览第一段（含链接）
  {
    'en-US': 'The underlying concept of provable fairness is that players have the ability to prove and verify that their results are fair and unmanipulated. This is achieved through the use of a commitment scheme, along with cryptographic hashing.',
    'zh-CN': '可验证公平机制的核心理念，是让玩家能够自行验证游戏结果是否真实、公正、未被人为操控。这一机制通过承诺方案与加密哈希技术实现。',
    'th-TH': 'แนวคิดพื้นฐานของความยุติธรรมที่พิสูจน์ได้คือผู้เล่นมีความสามารถในการพิสูจน์และยืนยันว่าผลลัพธ์ของพวกเขานั้นยุติธรรมและไม่ถูกบิดเบือน ซึ่งทำได้โดยการใช้โครงการความมุ่งมั่นพร้อมกับการแฮชเข้ารหัส',
    'ja-JP': '証明可能公平性の根底にある概念は、プレイヤーが自分の結果が公正で不正操作されていないことを自分で証明・検証できる能力を持つことです。これはコミットメントスキームと暗号ハッシュを併用することで実現されています。',
    'ko-KR': '공정성이 입증 가능한 기본 개념은 플레이어가 자신의 결과가 공정하고 조작되지 않았음을 스스로 증명하고 확인할 수 있다는 점입니다. 이는 약속 스킴(Commitment Scheme)과 암호화 해싱을 함께 사용함으로써 구현됩니다.',
    'vi-VN': 'Khái niệm cốt lõi của Công bằng có thể chứng minh là người chơi có thể tự chứng minh và xác minh kết quả của mình là công bằng và không bị thao túng. Điều này được thực hiện thông qua chương trình cam kết (commitment scheme) kết hợp công nghệ băm mật mã.',
    'in-ID': 'Konsep dasar dari keadilan yang dapat dibuktikan adalah pemain memiliki kemampuan untuk membuktikan dan memverifikasi bahwa hasil mereka adil dan tidak dimanipulasi. Hal ini dicapai melalui skema komitmen bersama dengan hash kriptografi.',
    'hi-IN': 'प्रमाणित  निष्पक्षता की अंतर्निहित अवधारणा यह है कि खिलाड़ियों के पास यह साबित करने और सत्यापित करने की क्षमता होती है कि उनके परिणाम निष्पक्ष और बिना किसी छेड़छाड़ के हैं। यह प्रतिबद्धता योजना (commitment scheme) और क्रिप्टोग्राफ़िक हैशिंग के उपयोग से प्राप्त किया जाता है।',
    'pt-BR': 'O conceito central da justiça comprovável é que os jogadores têm a capacidade de provar e verificar que seus resultados são justos e não manipulados. Isso é alcançado por meio do uso de um esquema de compromisso (commitment scheme) junto com hash criptográfico.',
    'tl-PH': 'Ang pinagbabatayan ng konsepto ng mapatunayang pagiging patas ay ang mga manlalaro ay may kakayahan na patunayan at i-verify na ang kanilang mga resulta ay patas at hindi manipulahin. Ito ay nakakamit sa pamamagitan ng paggamit ng scheme ng pangako, kasama ng cryptographic hashing.',
    'es-ES': 'El concepto subyacente de imparcialidad demostrable es que los jugadores tengan la capacidad de demostrar y verificar que sus resultados son justos y no manipulados. Esto se logra mediante el uso de un esquema de compromiso, junto con el hash criptográfico.',
  },

  // 2 承诺方案 + 哈希解释
  {
    'en-US': 'The commitment scheme is used to ensure that the player has an influence on all results generated. Cryptographic hashing is used to ensure that the casino also remains honest to this commitment scheme. Both concepts combined create a trust-less environment when gambling online.',
    'zh-CN': '承诺方案确保玩家对最终结果拥有参与影响；而加密哈希则确保平台对该承诺过程保持诚实透明。两者结合，为玩家构建了一个无需信任的透明投注环境。',
    'th-TH': 'มีการใช้ระบบการผูกมัดเพื่อให้แน่ใจว่าผู้เล่นมีอิทธิพลต่อผลลัพธ์ทั้งหมดที่สร้างขึ้น มีการใช้การเข้ารหัสแฮชเพื่อให้มั่นใจว่าคาสิโนยังคงซื่อสัตย์ต่อระบบการผูกมัดนี้ แนวคิดทั้งสองนี้เมื่อนำมารวมกันจะสร้างสภาพแวดล้อมที่ไร้ความน่าเชื่อถือเมื่อเล่นการพนันออนไลน์',
    'ja-JP': 'コミットメントスキームは、プレイヤーが生成されるすべての結果に影響を与えることを保証するために使用されます。暗号ハッシュは、カジノ側もこのコミットメントスキームに対して誠実であることを保証するために使用されます。この2つの概念を組み合わせることで、オンラインギャンブルにおいて信頼不要（トラストレス）な環境が実現します。',
    'ko-KR': '약속 스킴은 플레이어가 생성되는 모든 결과에 영향을 미칠 수 있도록 보장합니다. 암호화 해싱은 카지노 측도 이 약속 스킴에 정직하게 따르도록 보장합니다. 이 두 개념이 결합되어 온라인 도박에서 신뢰가 필요 없는(Trust-less) 환경을 만듭니다.',
    'vi-VN': 'Chương trình cam kết đảm bảo người chơi có ảnh hưởng đến mọi kết quả được tạo ra; băm mật mã đảm bảo nền tảng luôn trung thực với cam kết đó. Hai khái niệm kết hợp tạo nên môi trường cá cược trực tuyến không cần tin tưởng (trust-less).',
    'in-ID': 'Skema komitmen digunakan untuk memastikan pemain memiliki pengaruh terhadap semua hasil yang dihasilkan. Hash kriptografi digunakan untuk memastikan kasino tetap jujur terhadap skema komitmen ini. Kedua konsep ini ketika digabungkan menciptakan lingkungan tanpa kepercayaan (trust-less) saat berjudi online.',
    'hi-IN': 'प्रतिबद्धता योजना का उपयोग यह सुनिश्चित करने के लिए किया जाता है कि खिलाड़ी का उत्पन्न सभी परिणामों पर प्रभाव हो। क्रिप्टोग्राफ़िक हैशिंग का उपयोग यह सुनिश्चित करने के लिए किया जाता है कि कैसीनो भी इस प्रतिबद्धता योजना के प्रति ईमानदार रहे। दोनों अवधारणाएँ मिलकर ऑनलाइन जुआ खेलते समय एक अविश्वसनीय (trust-less) वातावरण बनाती हैं।',
    'pt-BR': 'O esquema de compromisso é usado para garantir que o jogador tenha influência sobre todos os resultados gerados. O hash criptográfico garante que o cassino também permaneça honesto com esse esquema. A combinação dos dois cria um ambiente sem necessidade de confiança (trust-less) ao jogar online.',
    'tl-PH': 'Ang scheme ng pangako ay ginagamit upang matiyak na ang manlalaro ay may impluwensya sa lahat ng resultang nabuo. Ginagamit ang cryptographic hashing upang matiyak na nananatiling tapat din ang casino sa scheme ng commitment na ito. Ang parehong mga konsepto na pinagsama ay lumikha ng isang hindi mapagkakatiwalaang kapaligiran kapag nagsusugal online.',
    'es-ES': 'El esquema de compromiso garantiza que el jugador tenga influencia sobre todos los resultados generados. El hash criptográfico asegura que el casino también cumpla con este esquema. La combinación de ambos conceptos crea un entorno sin necesidad de confianza (trust-less) al apostar en línea.',
  },

  // 3 公式前引导文
  {
    'en-US': 'This is simplified in the following representation:',
    'zh-CN': '可用以下公式简单表示：',
    'th-TH': 'เรื่องนี้ได้รับการทำให้เรียบง่ายขึ้นด้วยการแสดงดังต่อไปนี้:',
    'ja-JP': 'これを簡略化すると次のようになります。',
    'ko-KR': '이는 다음과 같이 간단하게 표현됩니다.',
    'vi-VN': 'Điều này có thể được diễn đạt đơn giản như sau:',
    'in-ID': 'Hal ini disederhanakan dalam representasi berikut:',
    'hi-IN': 'इसे निम्नलिखित उदाहरण में सरल बनाया गया है:',
    'pt-BR': 'Isso é simplificado na seguinte representação:',
    'tl-PH': 'Ito ay pinasimple sa sumusunod na representasyon:',
    'es-ES': 'Esto se simplifica en la siguiente representación:',
  },

  // 4 公式
  {
    'en-US': 'fair result = operators input (hashed) + customers input',
    'zh-CN': '公平结果 = 平台输入（哈希值） + 玩家输入',
    'th-TH': 'ผลลัพธ์ที่ยุติธรรม = อินพุตของผู้ปฏิบัติงาน (แฮช) + อินพุตของลูกค้า',
    'ja-JP': '公正な結果 = オペレーターの入力（ハッシュ化） + 顧客の入力',
    'ko-KR': '공정한 결과 = 운영자 입력(해시) + 고객 입력',
    'vi-VN': 'Kết quả công bằng = Đầu vào của nền tảng (đã băm) + Đầu vào của người chơi',
    'in-ID': 'hasil yang adil = input operator (di-hash) + input pelanggan',
    'hi-IN': 'निष्पक्ष परिणाम = ऑपरेटर का इनपुट (हैश किया गया) + ग्राहक का इनपुट',
    'pt-BR': 'Resultado justo = entrada do operador (com hash) + entrada do cliente',
    'tl-PH': 'patas na resulta = input ng operator (hashed) + input ng mga customer',
    'es-ES': 'resultado justo = entrada del operador (codificada) + entrada del cliente',
  },

  // 5 第三方验证标题
  {
    'en-US': '3rd Party Verification',
    'zh-CN': '第三方验证',
    'th-TH': 'การตรวจสอบบุคคลที่สาม',
    'ja-JP': '第三者による検証',
    'ko-KR': '제3자 검증',
    'vi-VN': 'Xác minh bởi bên thứ ba',
    'in-ID': 'Verifikasi Pihak Ketiga',
    'hi-IN': 'तृतीय-पक्ष सत्यापन',
    'pt-BR': 'Verificação por Terceiros',
    'tl-PH': 'Pagpapatunay ng 3rd Party',
    'es-ES': 'Verificación de terceros',
  },

  // 6 第三方验证正文
  {
    'en-US': `All ${VITE_OFFICIAL_NAME} Originals played on ${VITE_OFFICIAL_NAME} can be verified both here and via 3rd party websites who have also open sourced the verification procedure. You can find them via a google search, or simply check out some of these that have been put together by our community:`,
    'zh-CN': `所有在 ${VITE_OFFICIAL_NAME} 平台上运行的 ${VITE_OFFICIAL_NAME} Originals 游戏，均可在本页面或通过第三方验证网站进行校验。这些网站已将验证流程完全开源，玩家可通过 Google 搜索找到，或直接访问由社区整理的站点：`,
    'th-TH': `คุณสามารถตรวจสอบเพลงต้นฉบับของ ${VITE_OFFICIAL_NAME} ทั้งหมดที่เล่นบน ${VITE_OFFICIAL_NAME} ได้ทั้งที่นี่และผ่านเว็บไซต์บุคคลที่สามซึ่งได้เปิดเผยขั้นตอนการตรวจสอบนี้ไว้ คุณสามารถค้นหาเพลงเหล่านี้ได้ผ่านการค้นหาใน Google หรือลองดูเพลงบางส่วนที่จัดทำโดยชุมชนของเรา:`,
    'ja-JP': `${VITE_OFFICIAL_NAME} でプレイできるすべての ${VITE_OFFICIAL_NAME} Originals は、ここおよび検証手順をオープンソース化した第三者ウェブサイトの両方で検証可能です。Google 検索で探すか、コミュニティがまとめた以下のリンクをご利用ください：`,
    'ko-KR': `${VITE_OFFICIAL_NAME}에서 플레이되는 모든 ${VITE_OFFICIAL_NAME} Originals는 본 페이지와 검증 절차를 오픈소스로 공개한 제3자 웹사이트를 통해 확인할 수 있습니다. Google 검색으로 찾거나, 커뮤니티에서 정리한 다음 사이트를 확인해 보세요:`,
    'vi-VN': `Tất cả trò chơi ${VITE_OFFICIAL_NAME} Originals trên nền tảng ${VITE_OFFICIAL_NAME} đều có thể được xác minh ngay tại đây hoặc thông qua các trang web xác minh bên thứ ba đã công khai toàn bộ mã nguồn quy trình xác minh. Bạn có thể tìm thấy chúng qua Google hoặc truy cập trực tiếp các trang do cộng đồng tổng hợp:`,
    'in-ID': `Semua ${VITE_OFFICIAL_NAME} Originals yang dimainkan di ${VITE_OFFICIAL_NAME} dapat diverifikasi di sini dan melalui situs web pihak ketiga yang juga telah membuka kode sumber prosedur verifikasi. Anda dapat menemukannya lewat pencarian Google, atau cukup kunjungi beberapa situs yang telah disusun oleh komunitas kami:`,
    'hi-IN': `Meibo पर खेले जाने वाले सभी ${VITE_OFFICIAL_NAME} Originals को यहाँ और तृतीय-पक्ष वेबसाइटों के माध्यम से सत्यापित किया जा सकता है, जिन्होंने सत्यापन प्रक्रिया को ओपन-सोर्स भी किया है। आप उन्हें Google खोज के माध्यम से पा सकते हैं, या हमारे समुदाय द्वारा संकलित इनमें से कुछ को देख सकते हैं:`,
    'pt-BR': `Todos os ${VITE_OFFICIAL_NAME} Originals jogados no ${VITE_OFFICIAL_NAME} podem ser verificados aqui e também em sites de terceiros que disponibilizaram o código-fonte do processo de verificação. Você pode encontrá-los com uma busca no Google ou simplesmente conferir alguns compilados pela nossa comunidade:`,
    'tl-PH': `Ang lahat ng ${VITE_OFFICIAL_NAME} Originals na nilalaro sa ${VITE_OFFICIAL_NAME} ay maaaring ma-verify dito at sa pamamagitan ng mga 3rd party na website na nagbukas din ng pamamaraan ng pag-verify. Maaari mong mahanap ang mga ito sa pamamagitan ng paghahanap sa Google, o tingnan lamang ang ilan sa mga ito na pinagsama-sama ng aming komunidad:`,
    'es-ES': `Todos los ${VITE_OFFICIAL_NAME} Originals reproducidos en ${VITE_OFFICIAL_NAME} se pueden verificar tanto aquí como a través de sitios web de terceros que también han publicado el procedimiento de verificación. Puedes encontrarlos mediante una búsqueda en Google o simplemente consultar algunos de los que ha recopilado nuestra comunidad:`,
  },

  // 7 基金会标题
  {
    'en-US': 'Crypto Gambling Foundation',
    'zh-CN': '加密博彩基金会',
    'th-TH': 'มูลนิธิการพนันคริปโต',
    'ja-JP': '暗号ギャンブル財団',
    'ko-KR': '암호화폐 도박 재단',
    'vi-VN': 'Quỹ trò chơi tiền điện tử',
    'in-ID': 'Yayasan Perjudian Kripto',
    'hi-IN': 'क्रिप्टो गैंबलिंग फ़ाउंडेशन',
    'pt-BR': 'Crypto Gambling Foundation',
    'tl-PH': 'Crypto Gambling Foundation',
    'es-ES': 'Fundación de Juegos de Azar con Criptomonedas',
  },

  // 8 基金会正文
  {
    'en-US': `${VITE_OFFICIAL_NAME} is a verified operator on the Crypto Gambling Foundation network. This foundation aims to uphold the highest standard of provably fair gambling and we are proud to be a part of their network. You can find further information and insights about provable fairness and the power it has in this industry on the Crypto Gambling Foundation website:`,
    'zh-CN': `${VITE_OFFICIAL_NAME} 是加密博彩基金会（Crypto Gambling Foundation）网络认证的运营商。该基金会旨在维护可验证公平博彩的最高标准，我们很自豪成为其网络的一部分。您可以访问加密博彩基金会官网获取更多关于可验证公平的内容：`,
    'th-TH': `${VITE_OFFICIAL_NAME} เป็นผู้ให้บริการที่ได้รับการรับรองในเครือข่าย Crypto Gambling Foundation มูลนิธินี้มุ่งมั่นที่จะรักษามาตรฐานสูงสุดของการพนันที่ยุติธรรมและพิสูจน์ได้ และเราภูมิใจที่ได้เป็นส่วนหนึ่งของเครือข่ายของพวกเขา คุณสามารถค้นหาข้อมูลเพิ่มเติมและข้อมูลเชิงลึกเกี่ยวกับความยุติธรรมที่พิสูจน์ได้และอำนาจที่มีอยู่ในอุตสาหกรรมนี้ ตรวจสอบ Crypto Gambling Foundation ผ่านทางเว็บไซต์ของพวกเขา:`,
    'ja-JP': `${VITE_OFFICIAL_NAME} は Crypto Gambling Foundation ネットワークの認定オペレーターです。この財団は証明可能公正なギャンブルの最高水準を維持することを目的としており、当社は同ネットワークの一員であることを誇りに思います。証明可能公正性とその業界への影響について詳しくは、Crypto Gambling Foundation のウェブサイトをご覧ください：`,
    'ko-KR': `${VITE_OFFICIAL_NAME}는 Crypto Gambling Foundation 네트워크의 공식 인증 운영자입니다. 이 재단은 공정성이 입증 가능한 도박의 최고 기준을 유지하는 것을 목표로 하며, 저희는 그 네트워크의 일원이 된 것을 자랑스럽게 생각합니다. 공정성 입증과 업계에서의 영향력에 대한 자세한 정보는 Crypto Gambling Foundation 웹사이트에서 확인하세요:`,
    'vi-VN': `${VITE_OFFICIAL_NAME} là nhà điều hành được chứng nhận thuộc mạng lưới Quỹ trò chơi tiền điện tử (Crypto Gambling Foundation). Quỹ này đặt mục tiêu duy trì tiêu chuẩn cao nhất về cờ bạc công bằng có thể chứng minh, và chúng tôi tự hào là một phần của mạng lưới đó. Thông tin chi tiết về tính công bằng có thể chứng minh và sức mạnh mẽ của nó trong ngành có tại trang web của Quỹ:`,
    'in-ID': `${VITE_OFFICIAL_NAME} adalah operator terverifikasi di jaringan Yayasan Perjudian Kripto. Yayasan ini bertujuan untuk menegakkan standar tertinggi perjudian yang terbukti adil dan kami bangga menjadi bagian dari jaringan mereka. Informasi lebih lanjut dan wawasan tentang keadilan yang dapat dibuktikan serta kekuatannya di industri ini dapat Anda temukan di situs web Yayasan Perjudian Kripto:`,
    'hi-IN': `${VITE_OFFICIAL_NAME} क्रिप्टो गैंबलिंग फ़ाउंडेशन नेटवर्क पर एक सत्यापित ऑपरेटर है। इस फ़ाउंडेशन का उद्देश्य प्रमाणित रूप से निष्पक्ष जुए के उच्चतम मानकों को बनाए रखना है और हमें उनके नेटवर्क का हिस्सा होने पर गर्व है। प्रमाणित निष्पक्षता और इस उद्योग में इसकी शक्ति के बारे में अधिक जानकारी और अंतर्दृष्टि आप क्रिप्टो गैंबलिंग फ़ाउंडेशन की वेबसाइट पर प्राप्त कर सकते हैं:`,
    'pt-BR': `${VITE_OFFICIAL_NAME} é uma operadora verificada na rede Crypto Gambling Foundation. Esta fundação tem como objetivo manter o mais alto padrão de jogos comprovadamente justos e temos orgulho de fazer parte da sua rede. Mais informações e insights sobre justiça comprovável e seu impacto na indústria estão disponíveis no site da Crypto Gambling Foundation:`,
    'tl-PH': `Ang ${VITE_OFFICIAL_NAME} ay isang na-verify na operator sa network ng Crypto Gambling Foundation. Ang pundasyong ito ay naglalayon na itaguyod ang pinakamataas na pamantayan ng mapatunayang patas na pagsusugal at ipinagmamalaki naming maging bahagi ng kanilang network. Makakahanap ka ng karagdagang impormasyon at mga insight tungkol sa mapapatunayang pagiging patas at ang kapangyarihan nito sa industriyang ito sa website ng Crypto Gambling Foundation:`,
    'es-ES': `${VITE_OFFICIAL_NAME} es un operador verificado en la red de la Crypto Gambling Foundation. Esta fundación tiene como objetivo mantener los más altos estándares de juego demostrablemente justo y nos enorgullece formar parte de su red. Puede encontrar más información y análisis sobre la imparcialidad demostrable y su importancia en esta industria en el sitio web de la Crypto Gambling Foundation:`,
  },
]
</script>

<template>
  <div class="text-[#b1bad3]">
    <!-- 主标题 -->
    <div class="text-[#fff] text-[16px] font-[700] leading-[1.32] xl:text-[24px]">
      {{ doc[0][lang] }}
    </div>

    <!-- 概览段落 1（带链接） -->
    <div class="mt-[16px] text-[14px] leading-[1.5] xl:text-[18px]">
      {{ doc[1][lang] }}
      <a class="text-[#fff] underline" href="https://en.wikipedia.org/wiki/Provable_fairness" target="_blank">
        {{
          lang === 'zh-CN' ? '可验证公平机制'
          : lang === 'th-TH' ? 'ความยุติธรรมที่พิสูจน์ได้'
            : lang === 'ja-JP' ? '証明可能公平性'
              : lang === 'ko-KR' ? '공정성이 입증 가능한'
                : lang === 'vi-VN' ? 'Công bằng có thể chứng minh'
                  : lang === 'in-ID' ? 'Keadilan yang dapat dibuktikan'
                    : lang === 'hi-IN' ? 'प्रमाणित निष्पक्षता'
                      : lang === 'pt-BR' ? 'justiça comprovável'
                        : lang === 'tl-PH' ? 'mapatunayang pagiging patas'
                          : lang === 'es-ES' ? 'imparcialidad demostrable'
                            : 'provable fairness'
        }}
       <IconUniJumpPage class="text-[12px]"  />
        
      </a>
      <template v-if="lang !== 'zh-CN' && lang !== 'th-TH'">
        {{
          lang === 'ja-JP' ? 'と'
          : lang === 'ko-KR' ? '과'
            : lang === 'vi-VN' ? 'và'
              : lang === 'in-ID' ? 'bersama'
                : lang === 'hi-IN' ? 'के साथ'
                  : lang === 'pt-BR' ? 'junto com'
                    : lang === 'tl-PH' ? 'kasama ang'
                      : lang === 'es-ES' ? 'junto con'
                        : ' … '
        }}
      </template>
      <a class="text-[#fff] underline" href="https://en.wikipedia.org/wiki/Commitment_scheme" target="_blank">
        {{
          lang === 'zh-CN' ? '承诺方案'
          : lang === 'th-TH' ? 'โครงการความมุ่งมั่น'
            : lang === 'ja-JP' ? 'コミットメントスキーム'
              : lang === 'ko-KR' ? '약속 스킴'
                : lang === 'vi-VN' ? 'chương trình cam kết'
                  : lang === 'in-ID' ? 'skema komitmen'
                    : lang === 'hi-IN' ? 'प्रतिबद्धता योजना'
                      : lang === 'pt-BR' ? 'esquema de compromisso'
                        : lang === 'tl-PH' ? 'scheme ng pangako'
                          : lang === 'es-ES' ? 'esquema de compromiso'
                            : 'commitment scheme'
        }}
        <BaseIcon class="inline-block ml-1 align-middle" name="uni-jump-page" width="12" height="12" />
      </a>
      {{
        lang === 'zh-CN' ? '与加密哈希技术实现。'
        : lang === 'th-TH' ? ''
          : lang === 'ja-JP' ? 'を併用することで実現されています。'
            : lang === 'ko-KR' ? '을 함께 사용합니다.'
              : lang === 'vi-VN' ? '.'
                : lang === 'in-ID' ? '.'
                  : lang === 'hi-IN' ? ' का उपयोग करके प्राप्त किया जाता है।'
                    : lang === 'pt-BR' ? '.'
                      : lang === 'tl-PH' ? '.'
                        : lang === 'es-ES' ? '.'
                          : ', along with cryptographic hashing.'
      }}
    </div>

    <!-- 其余部分保持不变 -->
    <div class="mt-[16px] text-[14px] leading-[1.5] xl:text-[18px]">
      {{ doc[2][lang] }}
    </div>
    <div class="mt-[16px] text-[14px] leading-[1.5] xl:text-[18px]">
      {{ doc[3][lang] }}
    </div>
    <div class="text-[#fff] bg-[#213743] mt-[16px] rounded-[4px] px-[14px] py-[14px] text-[14px] leading-[1.5] xl:text-[18px] font-mono">
      {{ doc[4][lang] }}
    </div>

    <div class="text-[#fff] mt-[32px] text-[16px] font-[700] leading-[1.32] xl:text-[24px]">
      {{ doc[5][lang] }}
    </div>
    <div class="mt-[16px] text-[14px] leading-[1.5] xl:text-[18px]">
      {{ doc[6][lang] }}
    </div>
    <div class="mt-[16px] pt-2 text-[#fff]">
      <ul class="ml-[32px] list-disc space-y-2">
        <li>
          <a class="text-[#fff] underline text-[14px]" href="https://provablyfair.me" target="_blank">
            https://provablyfair.me
            <BaseIcon class="inline-block ml-1 align-middle" name="uni-jump-page" width="12" height="12" />
          </a>
        </li>
      </ul>
    </div>

    <div class="text-[#fff] mt-[32px] text-[16px] font-[700] leading-[1.32] xl:text-[24px]">
      {{ doc[7][lang] }}
    </div>
    <div class="mt-[16px] text-[14px] leading-[1.5] xl:text-[18px]">
      {{ doc[8][lang] }}
      <a class="text-[#fff] underline text-[14px]" href="https://cryptogambling.org" target="_blank">
        cryptogambling.org
        <BaseIcon class="inline-block ml-1 align-middle" name="uni-jump-page" width="12" height="12" />
      </a>
    </div>

    <div class="mt-[32px]">
      <BaseImage v-if="theme === 'white'" width="120px" url="/png/footer/verified_white.png" />
      <BaseImage v-else width="120px" url="/png/footer/verified.png" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  @apply hover:opacity-80 transition-opacity;
}
</style>
