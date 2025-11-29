<script lang="ts" setup>
import { getLang } from '@tg/vue-i18n'

const lang = getLang()

const translations = {
  'en-US': {
    title: 'Game Events',
    intro1: 'Game events are translation of the randomly generated floats into a relatable outcome that is game specific. This includes anything from the outcome of a dice roll to the order of the cards in a deck, or even the location of every bomb in a game of mines.',
    intro2: 'Below is a detailed explanation as to how we translate floats into events for each particular different game on our platform.',
    dice: {
      title: 'Dice Roll',
      desc: 'In our version of dice, we cover a possible roll spread of 00.00 to 100.00, which has a range of 10,001 possible outcomes. The game event translation is done by multiplying the float by number of possible outcomes and then dividing by 100 so that the resulting number fits the constraints of our stated dice range.',
      code: `// Game event translation
const roll = (float * 10001) / 100;`,
    },
    limbo: {
      title: 'Limbo',
      desc: 'When it comes to Limbo, we use a two-step process. Firstly, we take the float and multiply it by both the maximum possible multiplier and the house edge. Then, in order to generate a game event that has probability distribution, we divide the maximum possible multiplier by the result of the first step to create the game event in the form of a crash point.',
      code: `// Game event translation with houseEdge of 0.99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Crash point rounded down to required denominator
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Consolidate all crash points below 1
const result = Math.max(crashPoint, 1);`,
    },
    plinko: {
      title: 'Plinko',
      desc: 'For any game of Plinko, the generated outcome is based on the path of the falling ball. The game event determines the direction of the falling ball for each level in the falling process. Players can choose between 8 and 16 pins of play, which determines the number of game events required to generate a complete path from top to bottom. Since there are only two possible directions (left or right) the translation is done by multiplying each float by 2, which maps to the following index:',
      code: `// Index of 0 to 1 : left to right
const DIRECTIONS = [ left, right ];

// Game event translation
const direction = CARDS[Math.floor(float * 2)];`,
    },
    probabilityLink: 'probability distribution',
  },

  'zh-CN': {
    title: '游戏事件',
    intro1: '游戏事件是将随机生成的浮点数转换为特定游戏相关的结果。这包括从掷骰子的结果，到牌堆中牌的顺序，甚至到 Mines 游戏中每颗炸弹的位置。',
    intro2: '下面对我们平台上每种不同游戏的浮点数到游戏事件的转换方式进行详细说明。',
    dice: { title: '掷骰子', desc: '在我们的骰子游戏中，可能的掷骰范围为 00.00 到 100.00，共有 10,001 种可能结果。游戏事件的转换方式是将浮点数乘以可能结果数，再除以 100，以确保生成的数字符合我们规定的骰子范围。', code: `// 游戏事件转换
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: '在 Limbo 游戏中，我们使用两步转换过程。首先，将浮点数乘以最大可能倍数和庄家优势。然后，为生成具有概率分布的游戏事件，我们用最大可能倍数除以第一步的结果，从而生成 crash point 形式的游戏事件。', code: `// 带庄家优势 0.99（1%）的游戏事件转换
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// 将 crash point 四舍五入到所需分母
const crashPoint = Math.floor(floatPoint * 100) / 100;

// 合并所有小于 1 的 crash points
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: '在任何 Plinko 游戏中，生成的结果基于落球路径。游戏事件决定落球在每一层的方向。玩家可以选择 8 到 16 个钉子（pins）进行游戏，这决定了生成完整路径所需的游戏事件数量。由于每次落球只有两个可能方向（左或右），转换方式是将每个浮点数乘以 2，对应到以下索引：', code: `// 索引 0 到 1：从左到右
const DIRECTIONS = [ left, right ];

// 游戏事件转换
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: '概率分布',
  },

  'pt-BR': {
    title: 'Eventos de jogos',
    intro1: 'Os eventos do jogo são a tradução dos valores aleatórios gerados em um resultado compreensível e específico do jogo. Isso inclui desde o resultado de um lançamento de dados até a ordem das cartas em um baralho, ou mesmo a localização de cada bomba em um jogo de minas.',
    intro2: 'A seguir, apresentamos uma explicação detalhada de como convertemos valores de ponto flutuante em eventos para cada jogo específico em nossa plataforma.',
    dice: { title: 'Lançamento de dados', desc: 'Em nossa versão de dados, cobrimos uma faixa de resultados possíveis de 00,00 a 100,00, o que resulta em 10.001 resultados possíveis. A tradução do evento do jogo é feita multiplicando o valor decimal pelo número de resultados possíveis e, em seguida, dividindo por 100, de forma que o número resultante se ajuste às restrições da nossa faixa de dados.', code: `// Tradução de eventos do jogo
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: 'No jogo Limbo, usamos um processo de duas etapas. Primeiro, pegamos o valor de float e o multiplicamos pelo multiplicador máximo possível e pela vantagem da casa. Em seguida, para gerar um evento de jogo que tenha distribuição de probabilidade, dividimos o multiplicador máximo possível pelo resultado da primeira etapa para criar o evento do jogo na forma de um ponto de colisão.', code: `// Tradução de evento de jogo com houseEdge de 0,99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Ponto de falha arredondado para baixo até o denominador necessário
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Consolidar todos os pontos de falha abaixo de 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: 'Em qualquer partida de Plinko, o resultado gerado é baseado na trajetória da bola em queda. O evento do jogo determina a direção da queda da bola em cada nível do processo. Os jogadores podem escolher entre 8 e 16 pinos, o que determina o número de eventos necessários para gerar uma trajetória completa de cima para baixo. Como existem apenas duas direções possíveis (esquerda ou direita), a conversão é feita multiplicando cada número de ponto flutuante por 2, o que corresponde ao seguinte índice:', code: `// Índice de 0 a 1: da esquerda para a direita
const DIRECTIONS = [ esquerda, direita ];

// Tradução de eventos do jogo
const direção = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'distribuição de probabilidade',
  },

  'vi-VN': {
    title: 'Sự kiện trò chơi',
    intro1: 'Sự kiện trò chơi là việc chuyển đổi các số dấu phẩy động được tạo ngẫu nhiên thành các kết quả cụ thể của trò chơi. Kết quả này bao gồm từ kết quả của một lần tung xúc xắc đến thứ tự các lá bài trong bộ bài, và thậm chí cả vị trí của từng quả bom trong trò chơi Mines.',
    intro2: 'Dưới đây là giải thích chi tiết về cách chuyển đổi số dấu phẩy động thành sự kiện trò chơi cho từng trò chơi khác nhau trên nền tảng của chúng tôi.',
    dice: { title: 'Lăn xúc xắc', desc: 'Trong trò chơi xúc xắc của chúng tôi, phạm vi tung xúc xắc có thể là từ 00.00 đến 100.00, dẫn đến 10.001 kết quả có thể xảy ra. Việc chuyển đổi sự kiện trò chơi bao gồm việc nhân số dấu phẩy động với số kết quả có thể xảy ra, sau đó chia cho 100 để đảm bảo số được tạo ra phù hợp với phạm vi xúc xắc đã xác định.', code: `// Chuyển đổi Sự kiện Trò chơi
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: 'Trong trò chơi Limbo, chúng tôi sử dụng quy trình chuyển đổi hai bước. Đầu tiên, số dấu phẩy động được nhân với Hệ số nhân Tối đa và Lợi thế Nhà cái. Sau đó, để tạo ra các sự kiện trò chơi với phân phối xác suất, chúng ta chia kết quả của bước đầu tiên cho bội số lớn nhất có thể, do đó tạo ra các sự kiện trò chơi dưới dạng điểm va chạm.', code: `// Chuyển đổi sự kiện trò chơi với lợi thế nhà cái 0,99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Làm tròn điểm va chạm đến mẫu số mong muốn
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Gộp tất cả các điểm va chạm nhỏ hơn 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: 'Trong bất kỳ trò chơi Plinko nào, kết quả được tạo ra dựa trên đường đi của quả bóng. Các sự kiện trò chơi xác định hướng bóng rơi trên mỗi tầng. Người chơi có thể chọn từ 8 đến 16 pin để chơi, điều này xác định số lượng sự kiện trò chơi cần thiết để tạo ra đường đi hoàn chỉnh. Vì bóng chỉ có thể rơi theo hai hướng (trái hoặc phải), nên phương pháp chuyển đổi là nhân mỗi số dấu phẩy động với 2, tương ứng với các chỉ số sau:', code: `// Chỉ số từ 0 đến 1: từ trái sang phải
const DIRECTIONS = [ left, right ];

// Chuyển đổi sự kiện trò chơi
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'phân phối xác suất',
  },

  'th-TH': {
    title: 'กิจกรรมเกม',
    intro1: 'เหตุการณ์ในเกมคือการแปลผลลอยตัวแบบสุ่มให้เป็นผลลัพธ์ที่เข้าใจได้และเฉพาะเจาะจงกับเกม ซึ่งรวมถึงทุกสิ่งตั้งแต่ผลลัพธ์ของการทอยลูกเต๋า ลำดับของไพ่ในสำรับ หรือแม้แต่ตำแหน่งของระเบิดแต่ละลูกในเกมทุ่นระเบิด',
    intro2: 'ด้านล่างนี้เป็นคำอธิบายโดยละเอียดเกี่ยวกับวิธีการที่เราแปลข้อมูลลอยตัวเป็นกิจกรรมสำหรับเกมแต่ละเกมที่แตกต่างกันบนแพลตฟอร์มของเรา',
    dice: { title: 'ทอยลูกเต๋า', desc: 'ในลูกเต๋าเวอร์ชันของเรา เราครอบคลุมช่วงการทอยลูกเต๋าที่เป็นไปได้ตั้งแต่ 00.00 ถึง 100.00 ซึ่งมีช่วงผลลัพธ์ที่เป็นไปได้ 10,001 แบบ การแปลเหตุการณ์ในเกมทำได้โดยการคูณค่าทอยด้วยจำนวนผลลัพธ์ที่เป็นไปได้ แล้วหารด้วย 100 เพื่อให้ตัวเลขที่ได้สอดคล้องกับเงื่อนไขของช่วงลูกเต๋าที่เรากำหนดไว้', code: `// การแปลเหตุการณ์เกม
const roll = (float * 10001) / 100;` },
    limbo: { title: 'ลิมโบ้', desc: 'เมื่อพูดถึง Limbo เราใช้กระบวนการสองขั้นตอน ขั้นแรก เรานำตัวเลขลอยตัวมาคูณด้วยตัวคูณสูงสุดที่เป็นไปได้และอัตราส่วนความได้เปรียบของเจ้ามือ จากนั้น เพื่อสร้างเหตุการณ์เกมที่มีการแจกแจงความน่าจะเป็นเราหารตัวคูณที่เป็นไปได้สูงสุดด้วยผลลัพธ์ของขั้นตอนแรกเพื่อสร้างเหตุการณ์เกมในรูปแบบของจุดที่เกิดการขัดข้อง', code: `// การแปลเหตุการณ์เกมด้วย houseEdge 0.99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// จุดชนถูกปัดลงเป็นตัวส่วนที่ต้องการ
const crashPoint = Math.floor(floatPoint * 100) / 100;

// รวมจุดชนทั้งหมดที่ต่ำกว่า 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'พลิงโก้', desc: 'สำหรับเกม Plinko ทุกเกม ผลลัพธ์ที่เกิดขึ้นจะขึ้นอยู่กับเส้นทางของลูกบอลที่ตกลงมา เหตุการณ์ในเกมจะกำหนดทิศทางของลูกบอลที่ตกลงมาในแต่ละด่านในกระบวนการตก ผู้เล่นสามารถเลือกพินการเล่นได้ระหว่าง 8 ถึง 16 พิน ซึ่งเป็นตัวกำหนดจำนวนเหตุการณ์ในเกมที่จำเป็นในการสร้างเส้นทางที่สมบูรณ์จากบนลงล่าง เนื่องจากมีเพียงสองทิศทางที่เป็นไปได้ (ซ้ายหรือขวา) การแปลจึงทำได้โดยการคูณทศนิยมแต่ละตัวด้วย 2 ซึ่งจะแมปกับดัชนีต่อไปนี้:', code: `// ดัชนี 0 ถึง 1 : ซ้ายไปขวา
const DIRECTIONS = [ ซ้าย, ขวา ];

// การแปลเหตุการณ์เกม
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'การแจกแจงความน่าจะเป็น',
  },

  'hi-IN': {
    title: 'खेल की घटनाएँ',
    intro1: 'खेल की घटनाएँ, बेतरतीब ढंग से उत्पन्न फ़्लोट का एक संबंधित परिणाम में अनुवाद हैं जो खेल-विशिष्ट होता है। इसमें पासा फेंकने के परिणाम से लेकर डेक में पत्तों के क्रम, या यहाँ तक कि खानों के खेल में प्रत्येक बम का स्थान भी शामिल है।',
    intro2: 'नीचे एक विस्तृत विवरण दिया गया है कि हम अपने प्लेटफ़ॉर्म पर प्रत्येक विशिष्ट खेल के लिए फ़्लोट को घटनाओं में कैसे बदलते हैं।',
    dice: { title: 'पांसा रोल', desc: 'हमारे पासा संस्करण में, हम 00.00 से 100.00 के संभावित रोल स्प्रेड को कवर करते हैं, जिसकी सीमा 10,001 संभावित परिणामों की होती है। खेल की घटनाओं का अनुवाद फ़्लोट को संभावित परिणामों की संख्या से गुणा करके और फिर 100 से विभाजित करके किया जाता है ताकि परिणामी संख्या हमारी बताई गई पासा सीमा की सीमाओं के अनुरूप हो।', code: `// खेल की घटनाओं का अनुवाद
const roll = (float * 10001) / 100;` },
    limbo: { title: 'लिम्बो', desc: 'लिम्बो की बात करें तो, हम दो-चरणीय प्रक्रिया का उपयोग करते हैं। सबसे पहले, हम फ़्लोट लेते हैं और उसे अधिकतम संभव गुणक और हाउस एज दोनों से गुणा करते हैं। फिर, एक ऐसा गेम इवेंट बनाने के लिए जिसका प्रायिकता वितरण हो, हम क्रैश पॉइंट के रूप में गेम इवेंट बनाने के लिए पहले चरण के परिणाम से अधिकतम संभव गुणक को विभाजित करते हैं।', code: `// हाउस एज 0.99 (1%) के साथ गेम इवेंट ट्रांसलेशन
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// क्रैश पॉइंट को आवश्यक हर तक पूर्णांकित किया गया है
const crashPoint = Math.floor(floatPoint * 100) / 100;

// 1 से नीचे के सभी क्रैश पॉइंट्स को समेकित करें
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'प्लिंको', desc: 'प्लिंको के किसी भी गेम के लिए, उत्पन्न परिणाम गिरती हुई गेंद के पथ पर आधारित होता है। गेम इवेंट गिरने की प्रक्रिया में प्रत्येक स्तर के लिए गिरती हुई गेंद की दिशा निर्धारित करता है। खिलाड़ी 8 से 16 पिनों के बीच खेल चुन सकते हैं, जो ऊपर से नीचे तक एक पूर्ण पथ बनाने के लिए आवश्यक खेल घटनाओं की संख्या निर्धारित करता है। चूँकि केवल दो संभावित दिशाएँ (बाएँ या दाएँ) हैं, इसलिए अनुवाद प्रत्येक फ़्लोट को 2 से गुणा करके किया जाता है, जो निम्नलिखित सूचकांक से मेल खाता है:', code: `// 0 से 1 का सूचकांक: बाएँ से दाएँ
const DIRECTIONS = [बाएँ, दाएँ];

// खेल घटना अनुवाद
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'प्रायिकता वितरण',
  },

  'in-ID': {
    title: 'Acara Permainan',
    intro1: 'Acara permainan adalah terjemahan dari float yang dihasilkan secara acak ke dalam hasil yang mudah dipahami dan spesifik untuk permainan tertentu. Ini mencakup segala hal mulai dari hasil lemparan dadu hingga urutan kartu dalam satu dek, atau bahkan lokasi setiap bom dalam permainan mines.',
    intro2: 'Berikut adalah penjelasan rinci tentang bagaimana kami menerjemahkan float menjadi acara untuk setiap permainan yang berbeda di platform kami.',
    dice: { title: 'Lemparan Dadu', desc: 'Dalam versi dadu kami, kami mencakup kemungkinan penyebaran lemparan 00,00 hingga 100,00, yang memiliki rentang 10.001 kemungkinan hasil. Translasi acara permainan dilakukan dengan mengalikan float dengan jumlah kemungkinan hasil, lalu membaginya dengan 100 sehingga angka yang dihasilkan sesuai dengan batasan rentang dadu yang kami tetapkan.', code: `// Translasi acara permainan
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: 'Dalam Limbo, kami menggunakan proses dua langkah. Pertama, kami mengambil float dan mengalikannya dengan pengali maksimum yang mungkin dan keunggulan bandar. Kemudian, untuk menghasilkan acara permainan yang memiliki distribusi probabilitas, kami membagi pengali maksimum yang mungkin dengan hasil langkah pertama untuk membuat acara permainan dalam bentuk titik crash.', code: `// Translasi acara permainan dengan houseEdge 0,99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Titik crash dibulatkan ke bawah ke penyebut yang dibutuhkan
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Konsolidasikan semua titik crash di bawah 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: 'Untuk setiap permainan Plinko, hasil yang dihasilkan didasarkan pada jalur bola jatuh. Acara permainan menentukan arah bola jatuh untuk setiap level dalam proses jatuhnya. Pemain dapat memilih antara 8 dan 16 pin permainan, yang menentukan jumlah acara permainan yang diperlukan untuk menghasilkan jalur lengkap dari atas ke bawah. Karena hanya ada dua kemungkinan arah (kiri atau kanan), translasi dilakukan dengan mengalikan setiap float dengan 2, yang memetakan ke indeks berikut:', code: `// Indeks 0 hingga 1: kiri ke kanan
const DIRECTIONS = [ kiri, kanan ];

// Translasi kejadian permainan
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'distribusi probabilitas',
  },

  'ko-KR': {
    title: '게임 이벤트',
    intro1: '게임 이벤트는 무작위로 생성된 플로트를 게임 고유의 공감할 수 있는 결과로 변환하는 것입니다. 여기에는 주사위 굴림 결과부터 덱에 있는 카드의 순서, 심지어 지뢰 게임에서 모든 폭탄의 위치까지 포함됩니다.',
    intro2: '아래는 플랫폼의 각 특정 게임에서 플로트를 이벤트로 변환하는 방법에 대한 자세한 설명입니다.',
    dice: { title: '주사위 굴리기', desc: '저희 주사위 게임에서는 00.00에서 100.00까지의 가능한 주사위 굴림 범위를 다루며, 이는 10,001가지의 가능한 결과 범위를 갖습니다. 게임 이벤트 변환은 부동 소수점 수에 가능한 결과의 개수를 곱한 후 100으로 나누어 결과 값이 명시된 주사위 범위의 제약 조건에 맞도록 합니다.', code: `// 게임 이벤트 번역
const roll = (float * 10001) / 100;` },
    limbo: { title: '림보', desc: '림보에서는 두 단계의 과정을 거칩니다. 첫째, 부동 소수점에 가능한 최대 승수와 하우스 엣지를 곱합니다. 그런 다음, 확률 분포를 가진 게임 이벤트를 생성하기 위해 첫 번째 단계의 결과로 가능한 최대 승수를 나누어 충돌 지점의 형태로 게임 이벤트를 생성합니다.', code: `// houseEdge가 0.99(1%)인 게임 이벤트 번역
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// 충돌 지점을 필요한 분모로 반올림했습니다.
const crashPoint = Math.floor(floatPoint * 100) / 100;

// 1 이하의 모든 충돌 지점을 통합합니다.
const result = Math.max(crashPoint, 1);` },
    plinko: { title: '플링코', desc: '플링코 게임에서는 공이 떨어지는 경로를 기반으로 결과가 생성됩니다. 게임 이벤트는 각 레벨에서 공이 떨어지는 방향을 결정합니다. 플레이어는 8핀에서 16핀까지 플레이할 수 있으며, 이는 위에서 아래로 완전한 경로를 생성하는 데 필요한 게임 이벤트 수를 결정합니다. 왼쪽 또는 오른쪽 두 가지 방향만 가능하므로, 각 부동 소수점에 2를 곱하여 변환을 수행하며, 이는 다음 인덱스에 매핑됩니다.', code: `// 0~1까지의 인덱스 : 왼쪽에서 오른쪽으로
const DIRECTIONS = [ left, right ];

// 게임 이벤트 번역
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: '확률 분포',
  },

  'ja-JP': {
    title: 'ゲームイベント',
    intro1: 'ゲームイベントとは、ランダムに生成されたフロートを、ゲーム固有の意味を持つ結果に変換することです。これには、サイコロの出目からデッキ内のカードの順番、さらには地雷ゲームにおける各爆弾の位置まで、あらゆるものが含まれます。',
    intro2: '以下では、プラットフォーム上のそれぞれのゲームでフロートをイベントに変換する方法について詳しく説明します。',
    dice: { title: 'サイコロを振る', desc: '当社のサイコロでは、00.00から100.00までの出目の範囲をカバーしており、出目の可能性は10,001通りあります。ゲームイベントの変換は、浮動小数点数に可能な出目の数を掛け、100で割ることで行われます。これにより、結果の数値は当社の規定のサイコロ範囲の制約に適合します。', code: `// ゲームイベントの翻訳
const roll = (float * 10001) / 100;` },
    limbo: { title: 'リンボ', desc: 'Limboでは、2段階のプロセスを採用しています。まず、フロートを最大乗数とハウスエッジの両方で乗算します。次に、確率分布を持つゲームイベントを生成するために、最初のステップの結果で最大可能乗数を割り、クラッシュポイントの形式でゲームイベントを作成します。', code: `// ハウスエッジ0.99（1%）のゲームイベント翻訳
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// クラッシュポイントは必要な分母に切り捨てられます
const crashPoint = Math.floor(floatPoint * 100) / 100;

// 1 未満のすべてのクラッシュポイントを統合します
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'プリンコ', desc: 'どのPlinkoゲームでも、生成される結果は落下するボールの軌道に基づいています。ゲームイベントは、落下プロセスの各レベルにおけるボールの落下方向を決定します。プレイヤーはプレイするピンの数を8本から16本まで選択でき、これにより上から下までの完全な軌道を生成するために必要なゲームイベントの数が決まります。方向は左または右の2つしかないため、変換は各浮動小数点数に2を掛けることで行われ、これは以下のインデックスにマッピングされます。', code: `// 0から1のインデックス：左から右
const DIRECTIONS = [ left, right ];

// ゲームイベントの翻訳
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: '確率分布',
  },

  'tl-PH': {
    title: 'Mga Kaganapan sa Laro',
    intro1: 'Ang mga kaganapan sa laro ay pagsasalin ng mga random na nabuong float sa isang relatable na kinalabasan na partikular sa laro. Kabilang dito ang anumang bagay mula sa kinalabasan ng isang dice roll hanggang sa pagkakasunud-sunod ng mga card sa isang deck, o maging ang lokasyon ng bawat bomba sa isang laro ng mga mina.',
    intro2: 'Nasa ibaba ang isang detalyadong paliwanag kung paano namin isinasalin ang mga float sa mga kaganapan para sa bawat partikular na magkakaibang laro sa aming platform.',
    dice: { title: 'Dice Roll', desc: 'Sa aming bersyon ng dice, sinasaklaw namin ang posibleng roll spread na 00.00 hanggang 100.00, na may hanay na 10,001 posibleng resulta. Ang pagsasalin ng kaganapan sa laro ay ginagawa sa pamamagitan ng pagpaparami ng float sa bilang ng mga posibleng resulta at pagkatapos ay paghahati sa 100 upang ang resultang numero ay umaangkop sa mga hadlang ng aming nakasaad na hanay ng dice.', code: `// Pagsasalin ng kaganapan sa laro
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: 'Pagdating sa Limbo, gumagamit kami ng dalawang hakbang na proseso. Una, kinuha namin ang float at i-multiply ito sa parehong maximum na posibleng multiplier at sa gilid ng bahay. Pagkatapos, upang makabuo ng isang kaganapan sa laro na mayroon pamamahagi ng posibilidad, hinahati namin ang maximum na posibleng multiplier sa resulta ng unang hakbang upang gawin ang kaganapan ng laro sa anyo ng isang crash point.', code: `// Pagsasalin ng kaganapan sa laro na may houseEdge na 0.99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Ang crash point ay ni-round down sa kinakailangang denominator
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Pagsama-samahin ang lahat ng mga crash point sa ibaba 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: 'Para sa anumang laro ng Plinko, ang nabuong kinalabasan ay batay sa landas ng bumabagsak na bola. Tinutukoy ng kaganapan sa laro ang direksyon ng bumabagsak na bola para sa bawat antas sa proseso ng pagbagsak. Ang mga manlalaro ay maaaring pumili sa pagitan ng 8 at 16 na pin ng paglalaro, na tumutukoy sa bilang ng mga kaganapan sa laro na kinakailangan upang makabuo ng kumpletong landas mula sa itaas hanggang sa ibaba. Dahil dalawa lang ang posibleng direksyon (kaliwa o kanan) ang pagsasalin ay ginagawa sa pamamagitan ng pagpaparami ng bawat float sa 2, na nagmamapa sa sumusunod na index:', code: `// Index ng 0 hanggang 1 : kaliwa pakanan
const DIRECTIONS = [ kaliwa, kanan ];

// Pagsasalin ng kaganapan sa laro
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'pamamatnubay ng probabilidad',
  },

  'es-ES': {
    title: 'Eventos de juegos',
    intro1: 'Los eventos del juego son la traducción de los valores aleatorios generados a un resultado comprensible y específico del juego. Esto incluye desde el resultado de una tirada de dados hasta el orden de las cartas en una baraja, o incluso la ubicación de cada bomba en un juego de minas.',
    intro2: 'A continuación se ofrece una explicación detallada de cómo traducimos los valores flotantes en eventos para cada juego específico en nuestra plataforma.',
    dice: { title: 'Tirada de dados', desc: 'En nuestra versión de dados, abarcamos un rango de tiradas posibles de 00.00 a 100.00, lo que da como resultado 10 001 posibles resultados. La conversión del evento del juego se realiza multiplicando el valor decimal por la cantidad de resultados posibles y dividiendo el resultado entre 100 para que el número resultante se ajuste al rango de dados especificado.', code: `// Traducción de eventos del juego
const roll = (float * 10001) / 100;` },
    limbo: { title: 'Limbo', desc: 'En Limbo, utilizamos un proceso de dos pasos. Primero, tomamos el número flotante y lo multiplicamos por el multiplicador máximo posible y la ventaja de la casa. Luego, para generar un evento de juego que tenga distribución de probabilidad, dividimos el multiplicador máximo posible por el resultado del primer paso para crear el evento del juego en forma de punto de choque.', code: `// Traducción de eventos del juego con ventaja de casa de 0,99 (1%)
const floatPoint = 1e8 / (float * 1e8) * houseEdge;

// Punto de choque redondeado a la baja al denominador requerido
const crashPoint = Math.floor(floatPoint * 100) / 100;

// Consolidar todos los puntos de fallo por debajo de 1
const result = Math.max(crashPoint, 1);` },
    plinko: { title: 'Plinko', desc: 'En cualquier partida de Plinko, el resultado se basa en la trayectoria de la bola al caer. El evento del juego determina la dirección de la bola en cada nivel. Los jugadores pueden elegir entre 8 y 16 bolos, lo que determina el número de eventos necesarios para completar la trayectoria de arriba abajo. Dado que solo hay dos direcciones posibles (izquierda o derecha), la conversión se realiza multiplicando cada valor por 2, lo que se traduce al siguiente índice:', code: `// Índice de 0 a 1: de izquierda a derecha
const DIRECTIONS = [ izquierda, derecha ];

// Traducción de eventos del juego
const direction = CARDS[Math.floor(float * 2)];` },
    probabilityLink: 'distribución de probabilidad',
  },
}

const t = translations[lang] || translations['en-US']
</script>

<template>
  <div>
    <div class="text-[#b1bad3] text-[14px] leading-[1.5] @md:text-[18px]">
      {{ t.intro1 }}
    </div>
    <div class="text-[#b1bad3] mt-[16px] text-[14px] leading-[1.5] @md:text-[18px]">
      {{ t.intro2 }}
    </div>

    <!-- Dice Roll -->
    <div class="text-[#fff] mt-[16px] text-[16px] font-semibold leading-[1.32] @md:text-[28px]">
      {{ t.dice.title }}
    </div>
    <div class="text-[#b1bad3] mt-[16px] text-[14px] leading-[1.5] @md:text-[18px]">
      {{ t.dice.desc }}
    </div>
    <div class="text-[#fff] bg-[#213743] mt-[16px] rounded-[4px] p-[16px] text-[14px] leading-[1.5] overflow-x-auto">
      <pre><code class="font-mono text-[1em]">{{ t.dice.code }}</code></pre>
    </div>

    <!-- Limbo -->
    <div class="text-[#fff] mt-[16px] text-[16px] font-semibold leading-[1.32] @md:text-[28px]">
      {{ t.limbo.title }}
    </div>
    <div class="text-[#b1bad3] mt-[16px] text-[14px] leading-[1.5] @md:text-[18px]">
      When it comes to Limbo, we use a two-step process. Firstly, we take the float and multiply it by both the maximum possible multiplier and the house edge. Then, in order to generate a game event that has
      <a class="text-[#fff] underline" href="https://en.wikipedia.org/wiki/Probability_distribution" target="_blank">
        {{ t.probabilityLink }}
        <BaseIcon class="inline-block ml-1 w-4 h-4" name="uni-jump-page" />
      </a>, we divide the maximum possible multiplier by the result of the first step to create the game event in the form of a crash point.
    </div>
    <div class="text-[#fff] bg-[#213743] mt-[16px] rounded-[4px] p-[16px] text-[14px] leading-[1.5] overflow-x-auto">
      <pre><code class="font-mono text-[1em]">{{ t.limbo.code }}</code></pre>
    </div>

    <!-- Plinko -->
    <div class="text-[#fff] mt-[16px] text-[16px] font-semibold leading-[1.32] @md:text-[28px]">
      {{ t.plinko.title }}
    </div>
    <div class="text-[#b1bad3] mt-[16px] text-[14px] leading-[1.5] @md:text-[18px]">
      {{ t.plinko.desc }}
    </div>
    <div class="text-[#fff] bg-[#213743] mt-[16px] rounded-[4px] p-[16px] text-[14px] leading-[1.5] overflow-x-auto">
      <pre><code class="font-mono text-[1em]">{{ t.plinko.code }}</code></pre>
    </div>
  </div>
</template>

<style lang="scss" scoped>
code {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
}
</style>
