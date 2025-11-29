export const hotFaqCategory = [
  {
    title: {
      'zh-CN': '热门问题',
      'en-US': 'Popular Questions',
      'pt-BR': 'Perguntas Populares',
    },
    type: 'hot',
  },
  {
    title: {
      'zh-CN': '现金钱包与奖金钱包规则',
      'en-US': 'Rules of the Cash Wallet and Bonus Wallet',
      'pt-BR': 'Regras da carteira',
    },
    type: 'wallet',
  },
  {
    title: {
      'zh-CN': '充值相关问题',
      'en-US': 'Problems related to deposits',
      'pt-BR': 'Problema de depósito',
    },
    type: 'deposit',
  },
  {
    title: {
      'zh-CN': '提现相关问题',
      'en-US': 'Withdrawal-related issues',
      'pt-BR': 'Problema de saque',
    },
    type: 'withdraw',
  },
  {
    title: {
      'zh-CN': '游戏相关问题',
      'en-US': 'Problems related to games',
      'pt-BR': 'Problema no jogo',
    },
    type: 'game',
  },
  {
    title: {
      'zh-CN': '代理/佣金相关问题',
      'en-US': 'Issues related to Agent/Commission',
      'pt-BR': 'Problema com agente/comissão',
    },
    type: 'agent',
  },
  {
    title: {
      'zh-CN': '官网与账户相关问题',
      'en-US': 'Issues related to the official website and account',
      'pt-BR': 'Problema com o site/conta',
    },
    type: 'account',
  },
  {
    title: {
      'zh-CN': '常见奖金问题',
      'en-US': 'Common bonus issues',
      'pt-BR': 'Problemas comuns com bônus',
    },
    type: 'bonus',
  },
]

export const faqs = [
  // ===== HOT / 通用 =====
  {
    title: {
      'zh-CN': '相关问题',
      'en-US': 'Related questions',
      'pt-BR': 'Questões relacionadas',
    },
    content: {
      'zh-CN':
        '尊敬的用户，非常抱歉给您带来不便。我们注意到您可能遇到：\n• 无法进入游戏；\n• 无法进行存款；\n• 存款无法提款；\n• 游戏网址错误。\n请通过在线客服与我们联系，我们的客服全年无休，将尽快为您解决问题。',
      'en-US':
        'Dear user, we apologize for the inconvenience. You might be experiencing:\n• Unable to access the game;\n• Unable to make a deposit;\n• Deposit cannot be withdrawn;\n• Incorrect game website.\nPlease contact Live Chat. Our 24/7 support will assist you as soon as possible.',
      'pt-BR':
        'Prezado usuário, pedimos desculpas pelo inconveniente. Você pode estar enfrentando:\n• Não consegue acessar o jogo;\n• Não consegue fazer depósitos;\n• O depósito não pode ser sacado;\n• Endereço do site do jogo incorreto.\nEntre em contato com o Bate-papo ao vivo. Nosso suporte 24/7 irá ajudá-lo o quanto antes.',
    },
    type: 'hot',
    expand: false,
  },

  // ===== WALLET / 钱包与基础说明 =====
  {
    title: {
      'zh-CN': '基本信息',
      'en-US': 'Basic information',
      'pt-BR': 'Informações básicas',
    },
    content: {
      'zh-CN':
        '每次您进行现金存款时，系统都会将金额发送至您的现金钱包。\n该金额可用于平台上任意游戏的投注。\n存款页面会显示可用的最低和最高存款金额',
      'en-US':
        'Every time you make a cash deposit, the system will send the amount to your cash wallet.\nThis amount will be available for use in bets on any game on the platform.\nThe minimum and maximum amounts available for deposit will always be shown in the deposit tab.',
      'pt-BR':
        'Toda vez que fizer uma recarga em dinheiro, o sistema enviará o valor para sua carteira de dinheiro.\nEste valor ficará disponível para ser usado em apostas em qualquer jogo da plataforma.\nO valor mínimo e máximo disponíveis para recarga serão sempre mostrados na aba de recarga.',
    },
    type: 'wallet',
    expand: false,
  },

  {
    title: {
      'zh-CN': '流水 / 投注要求',
      'en-US': 'Rollover/ Bets required to withdraw the cash deposit amount',
      'pt-BR': 'Rollover/ Apostas necessárias para o saque do valor de recarga em dinheiro',
    },
    content: {
      'zh-CN':
        '系统要求您完成与存款金额等额的一倍投注后，才可进行提款操作。',
      'en-US': 'It will be necessary to complete the deposit amount in bets once for the system to allow you to withdraw.',
      'pt-BR': 'Será necessário concluir 1 vez o valor da recarga em apostas para que o sistema te libere o saque.',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何使用法币方式存入现金钱包（根据国家/地区）？',
      'en-US': 'How to deposit into the cash wallet using fiat currency methods according to the country?',
      'pt-BR': 'Como depositar na carteira dinheiro usando método moedas fiat de acordo com o país?',
    },
    content: {
      'zh-CN':
        '1. 点击平台上的【存款】按钮。\n 2. 在存款页面选择您的国家/地区。\n 3. 根据所选国家/地区，选择对应的法币或加密货币进行存款。',
      'en-US': '1.Click the "Deposit" button on the platform. \n 2.On the deposit page, select your country/region. \n 3.Based on the selected country/region, choose the corresponding fiat currency or cryptocurrency for the deposit.',
      'pt-BR': '1.Clique no botão "Depositar" na plataforma. \n 2.Na página de depósito, selecione o seu país/região. \n 3.Com base no país/região selecionado, escolha a moeda fiduciária ou criptomoeda correspondente para o depósito.',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何使用加密货币/数字货币方式存入现金钱包？',
      'en-US': 'How to deposit into the cash wallet using cryptocurrency/digital currency methods?',
      'pt-BR': 'Como depositar na carteira dinheiro usando método de criptomoedas/moedas digitais?',
    },
    content: {
      'zh-CN':
        '首先，在任意数字货币平台绑定一个 USDT 钱包。\n 在本平台选择所需币种（共 19 种可选），并选择网络（如 TRC20 / ERC20 / BEP20 等）。 复制系统在【存款】页面提供的充值地址。\n 进入您的数字货币钱包，选择相同币种与网络，依次执行以下操作：\n 点击顶部导航栏的【资产】，选择【提现】。\n 选择【链上提现】方式。\n 输入提现地址、网络及转账金额，请仔细核对信息避免损失。\n 点击【继续】并按照账户安全验证步骤确认交易。确认后，资金将转入指定钱包。到账时间取决于区块网络速度。\n 请务必仅向本平台生成的充值地址发送所选币种。\n 系统将在 6 次网络确认 后自动入账。\n 支持币种：USDT、USDC、ETH、TRX、BTC、BNB、LTC、CRO、DAI、LINK、UNI、WBTC、WETH、SHIB、POL、OP、ARB、DOGE、SAND。',
      'en-US': 'First, link a USDT wallet on any digital currency/cryptocurrency platform. \n On our platform, select the desired currency from the 19 available options and choose the network (TRC20/ ERC20/ BEP20 and others). Copy the deposit address provided by the system on the deposit tab.\n Access your digital currency wallet and select the chosen currency, ensuring to select the same network. Follow these steps:\n Go to "Assets" in the top navigation menu and select "Withdraw". \n Choose on-chain withdrawal as the method. \n At this stage, you can enter the address, network, and amount of the currency you want to transfer. Double-check each field to avoid losses. \n Click "Continue" and authenticate the transaction using your account\'s security settings. \n Once the withdrawal is authenticated, the currency will arrive in the selected wallet. It may take a few minutes depending on the withdrawal network.\n Only send the currency selected on our platform to the deposit address generated in the digital currency app. \n The funds will be automatically deposited after 6 network confirmations. \n Available currencies: USDT, USDC, ETH, TRX, BTC, BNB, LTC, CRO, DAI, LINK, UNI, WBTC, WETH, SHIB, POL, OP, ARB, DOGE, SAND.',
      'pt-BR': 'Primeiro, vincule uma carteira de USDT em alguma plataforma de moedas digitais/criptomoedas. \n Na nossa plataforma, selecione a moeda desejada entre as 19 opções disponíveis e escolha a rede (TRC20/ ERC20/ BEP20 e outras). Copie o endereço de depósito fornecido pelo sistema na aba de depósito. \n Acesse sua carteira de moedas digitais e selecione a moeda escolhida, lembrando de escolher a mesma rede. Siga osseguintes passos: \n Acesse "Ativos" no menu de navegação superior e selecione "Sacar". \n Escolha saque on-chain como forma de retirada. \n Nesta etapa, insira o endereço, a rede e o valor da moeda que deseja transferir. Verifique cada campo para evitar perdas. \n Clique em "Continuar" e autentique a transação usando as configurações de segurança da sua conta. \n Após a autenticação, o valor será transferido para a carteira escolhida. Pode levar alguns minutos, dependendo da rede de saque. \n Envie apenas a moeda selecionada em nossa plataforma para o endereço de depósito gerado no aplicativo de moedas digitais. \n Os fundos serão depositados automaticamente após 6 confirmações de rede. \n Moedas disponiveis:USDT, USDC, ETH, TRX, BTC, BNB, LTC, CRO, DAI, LINK, UNI, WBTC, WETH, SHIB, POL, OP, ARB, DOGE, SAND.',
    },
    type: 'wallet',
    expand: false,
  },

  // ===== DEPOSIT / 充值存款 =====
  {
    title: {
      'zh-CN': '如何存款？',
      'en-US': 'How to deposit?',
      'pt-BR': 'Como depositar?',
    },
    content: {
      'zh-CN':
        '点击平台右上角的【存款】选项，选择您要使用的币种，输入想要的金额并确认。\n系统将生成一个存款二维码，您可以使用手机扫码支付。\n支付完成后，金额会立即到账至您的账户。注意：存款二维码会频繁更新，请每次存款时都重新生成新的二维码，以避免出现问题。',
      'en-US':
        'Click on the "Deposit" tab at the top right of the platform, select the currency type you wish to use, choose the desired amount, and confirm.\nA deposit QR code will be generated. You can scan it with your mobile phone.\nAfter the payment, the amount will be credited to your account immediately. Attention: The deposit QR code is frequently updated. Always generate a new code when making a deposit to avoid issues.',
      'pt-BR':
        'Clique na aba "Depósito" no canto superior direito da plataforma, selecione qual modalidade de moeda deseja utilizar, selecione o valor desejado e confirme.\nUm código QR de depósito será gerado. Você pode escaneá-lo com seu celular.\nApós o pagamento, o valor será creditado em sua conta imediatamente. Atenção: O código QR do depósito é atualizado com frequência. Sempre gere um novo código ao fazer um depósito para evitar problemas.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '重要提示',
      'en-US': 'Important information',
      'pt-BR': 'Informações importantes',
    },
    content: {
      'zh-CN':
        '为确保存款的安全与高效，存款二维码会定期更新。请在每次支付前，于【存款】页面重新生成新的二维码，以避免出现问题。',
      'en-US':
        'To ensure the security and efficiency of deposits, the deposit QR code is updated regularly. Always generate a new code in the "Deposit" tab before making a payment to avoid issues.',
      'pt-BR':
        'Para garantir a segurança e eficiência dos depósitos, o código QR do depósito é alterado regularmente. Sempre gere um novo código na aba "Depósito" antes de efetuar um pagamento para evitar problemas.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '存款未到账',
      'en-US': 'Deposit not credited',
      'pt-BR': 'Depósito não creditado',
    },
    content: {
      'zh-CN':
        '一般情况下，存款会在 3 分钟内到账，请耐心等待。\n如超过 3 分钟仍未到账，请点击【在线客服】，选择选项 1【存款】，将有客服人员与您联系。\n为加快处理，请提供以下信息：\n游戏ID：\n存款金额：\n存款日期：\n存款时间：\n转账凭证（交易截图）',
      'en-US':
        'The deposited amount is usually credited within 3 minutes. Please wait.\nIf more than 3 minutes have passed, select "Live Chat" and type option 1 "Deposit," and a support agent will contact you. \nTo expedite support, please provide the following information:\nGame ID: \nDeposited amount: \nDeposit date: \nDeposit time: \nTransfer receipt (screenshot of the transaction)',
      'pt-BR':
        'O valor depositado geralmente é creditado em até 3 minutos. Por favor, aguarde.\nSe já passou mais de 3 minutos, selecione "Bate-papo ao vivo" e digite a opção 1 "Depósito", e um atendente entrará em contato. \nPara agilizar o suporte, envie as seguintes informações:\nID do jogo: \nValor depositado: \nData do depósito: \nHorário do depósito: \nComprovante de transferência (print da transação)',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '二维码生成错误或无法获取二维码',
      'en-US': 'Error generating QR code or unable to obtain a QR code',
      'pt-BR': 'Erro ao gerar código QR ou não consigo obter um código QR',
    },
    content: {
      'zh-CN': '可能由于网络连接不稳定导致。请刷新页面后，尝试使用其他网络重新生成。',
      'en-US': 'This may be caused by an unstable internet connection. Refresh the page and try again using a different network.',
      'pt-BR': 'Isso pode ser causado por instabilidade na conexão de internet. Recarregue a página e tente novamente utilizando uma rede diferente.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '最低存款金额是多少？',
      'en-US': 'What is the minimum deposit amount?',
      'pt-BR': 'Qual é o valor mínimo de depósito?',
    },
    content: {
      'zh-CN': '建议您打开平台右上角的【存款】界面查看，充值页面显示的限额为准。',
      'en-US': 'It is recommended that you open the deposit interface in the upper right corner of the platform to check, as the limit displayed on the recharge page should be considered.',
      'pt-BR': 'Recomenda-se que você abra a interface de depósito no canto superior direito da plataforma para verificar, sendo o limite exibido na página de recarga o que deve ser considerado.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '最高存款金额是多少？',
      'en-US': 'What is the maximum deposit amount?',
      'pt-BR': 'Qual é o valor máximo de depósito?',
    },
    content: {
      'zh-CN': '建议您打开平台右上角的【存款】界面查看，充值页面显示的限额为准。',
      'en-US': 'It is recommended that you open the deposit interface in the upper right corner of the platform to check, as the limit displayed on the recharge page should be considered.',
      'pt-BR': 'Recomenda-se que você abra a interface de depósito no canto superior direito da plataforma para verificar, sendo o limite exibido na página de recarga o que deve ser considerado.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我想使用的支付方式不可用',
      'en-US': 'The payment method I want is not available.',
      'pt-BR': 'O método de pagamento que desejo não está disponível.',
    },
    content: {
      'zh-CN': '如果您希望的支付方式暂不可用，请将建议反馈给我们。我们会持续优化服务体验。',
      'en-US': 'If the method you want is not available, send us your suggestion. We are always working to improve our services.',
      'pt-BR': 'Caso o método que deseja não esteja disponível, envie sua sugestão. Estamos sempre trabalhando para melhorar nossos serviços.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '请勿重复使用旧二维码进行存款',
      'en-US': 'Do not reuse old QR codes for deposits.',
      'pt-BR': 'Não reutilize códigos QR antigos para depósito.',
    },
    content: {
      'zh-CN': '为确保存款安全，二维码会定期更新。每次存款前请重新生成二维码，以避免错误。',
      'en-US': 'To ensure the security of deposits, QR codes are changed regularly. Always generate a new QR code when making a deposit to avoid errors.',
      'pt-BR': 'Para garantir a segurança dos depósitos, os códigos QR são alterados regularmente. Sempre gere um novo código QR ao fazer um depósito para evitar erros.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '请勿对同一笔存款记录重复付款',
      'en-US': 'Do not pay the same deposit record more than once.',
      'pt-BR': 'Não pague um mesmo registro de depósito mais de uma vez.',
    },
    content: {
      'zh-CN': '平台的存款系统会自动匹配余额。提交存款记录后，系统会检测支付成功并自动加款。\n一笔订单只能匹配一次付款。为避免损失，请勿对同一笔订单重复支付。若遇到问题，请咨询平台24小时在线客服。',
      'en-US': 'All our deposit systems are automatically matched with the balance. After you submit the deposit record, the system will detect that the payment was successful and automatically add it for you.\nAn order can only be automatically matched to one payment. To avoid any loss, please do not make multiple payments for a single order. If you encounter any issues, you can consult the platform\'s 24/7 online customer service.',
      'pt-BR': 'Todos os nossos sistemas de depósito são automaticamente correspondidos ao saldo. Após você enviar o registro de depósito, o sistema detectará que o pagamento foi bem- sucedido e o adicionará automaticamente para você.\nUm pedido só pode ser automaticamente correspondido a um pagamento. Para evitar qualquer perda, por favor, não faça múltiplos pagamentos para um único pedido. Se você encontrar qualquer problema, pode consultar o atendimento ao cliente online da plataforma 24 horas por dia, 7 dias por semana.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '存入金额与支付金额不一致。',
      'en-US': 'The amount sent and the amount paid do not match.',
      'pt-BR': 'O valor enviado e o valor pago não coincidem.',
    },
    content: {
      'zh-CN': '我们的存款系统均为自动匹配。若您提交的存款金额与实际支付金额不一致，系统将无法自动识别该笔存款。为避免损失并确保您的存款能及时到账，请在支付时确认支付金额与订单金额一致。若遇到问题，可咨询平台 24 小时在线客服。\n游戏ID：\n存款金额：\n存款日期：\n存款时间：\n转账明细截图：',
      'en-US': 'All our deposit systems are automatically matched. When the deposit amount you sent does not match the actual payment amount, the system cannot automatically recognize the deposit. To avoid losses and ensure that your deposit is credited on time, please confirm that the payment amount matches the order amount at the time of payment. If you encounter any issues, you can consult the platform\'s 24/7 online customer service.\nYour game ID:\nDeposit amount:\nDeposit date:\nDeposit time:\nScreenshot of the details of your transfer',
      'pt-BR': 'Todos os nossos sistemas de depósito são automaticamente correspondidos. Quando o valor do depósito que você enviou não corresponde ao valor real do pagamento, o sistema não consegue reconhecer automaticamente o depósito. Para evitar perdas e garantir que seu depósito seja creditado a tempo, por favor, confirme que o valor do pagamento corresponde ao valor do pedido no momento do pagamento. Se você encontrar qualquer problema, pode consultar o atendimento ao cliente online da plataforma 24 horas por dia, 7 dias por semana.\nSeu ID de jogo:\nValor do depósito:\nData do depósito:\nHora do depósito:\nCaptura de tela dos detalhes da sua transferência',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何查看存款记录？',
      'en-US': 'How to check the deposit history',
      'pt-BR': 'Como verificar o histórico de depósitos',
    },
    content: {
      'zh-CN': '点击右上角头像并选择【交易记录】，再点击【存款】即可查看您的历史记录。',
      'en-US': 'Click on the profile icon in the top right corner of the screen and select "Transactions," then choose "Deposit" to view your history.',
      'pt-BR': 'Clique no ícone do seu perfil no canto direito da tela e selecione "Transações" e, após, selecione "Depósito" para visualizar seu histórico.',
    },
    type: 'deposit',
    expand: false,
  },
  {
    title: {
      'zh-CN': '存款未到账',
      'en-US': 'Deposit not credited',
      'pt-BR': 'Depósito não creditado',
    },
    content: {
      'zh-CN':
        '一般情况下，存款会在 3 分钟内到账，请耐心等待。\n如超过 3 分钟仍未到账，请点击【在线客服】，选择选项 1【存款】，将有客服人员与您联系。\n为加快处理，请提供以下信息：\n游戏ID：\n存款金额：\n存款日期：\n存款时间：\n转账凭证（交易截图）',
      'en-US':
        'The deposited amount is usually credited within 3 minutes. Please wait.\nIf more than 3 minutes have passed, select "Live Chat" and type option 1 "Deposit," and a support agent will contact you. \nTo expedite support, please provide the following information:\nGame ID: \nDeposited amount: \nDeposit date: \nDeposit time: \n转账凭证（交易截图）',
      'pt-BR':
        'O valor depositado geralmente é creditado em até 3 minutos. Por favor, aguarde.\nSe já passou mais de 3 minutos, selecione "Bate-papo ao vivo" e digite a opção 1 "Depósito", e um atendente entrará em contato. \nPara agilizar o suporte, envie as seguintes informações:\nID do jogo: \nValor depositado: \nData do depósito: \nHorário do depósito: \nComprovante de transferência (print da transação)',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN':
        '奖金钱包 / 奖励说明',
      'en-US':
        'BONUS wallet / reward How it works',
      'pt-BR':
        'Carteira BONUS / recompensa Como funciona',
    },
    content: {
      'zh-CN': '平台每日在【BAU】栏目中提供可领取的奖金，您只需申请即可领取，也可在我们的 Telegram 群中获取。\n这些奖金可通过平台活动获得。\n您在平台获得的所有奖金将存入【奖金钱包】。\n【奖金钱包】中的金额无法直接提现。只有在完成相应流水要求后，才能将奖金转换为【现金钱包】余额。\n当玩家的【现金钱包】有余额并进行投注时，系统将优先从现金钱包中扣除投注金额；当现金钱包余额用完后，系统将开始从【奖金钱包】中扣除投注金额。\n当现金钱包余额为 0 时，系统才会从【奖金钱包】余额中扣除投注金额。\n请注意：兑换金额不得超过最初获得的奖金金额。',
      'en-US': 'The bonuses are available on the platform daily in the BAU tab. You just need to apply to receive them, and they are also available in our Telegram group.\nThese bonuses can be collected through activities on the platform.\nAll the bonuses you win on the platform will go to your bonus wallet.\nThe money in the bonus wallet cannot be withdrawn directly. You can only convert them into the cash wallet balance when your bonuses reach the requested rollover.\nWhen the player has a balance in the cash wallet and wants to place a bet, the system will first deduct the betting amount from the cash wallet. When the cash wallet balance runs out, the system will begin deducting the bets from the bonus wallet balance.\nOnly when the cash wallet balance is 0 (zero) will the player be able to use the bonus wallet balance for betting.\nRemember that the redemption amount cannot exceed the amount of the initial bonus received.',
      'pt-BR': 'Os bônus estão disponíveis na plataforma diariamente na aba BAU, bastando aplicar para recebê-los e também estão disponíveis no nosso grupo Telegram.\nEsses bônus podem ser recolhidos através de atividades na plataforma.\nTodos os bônus que você ganhar na plataforma irão para sua carteira de bônus.\nO dinheiro da carteira de bônus não pode ser sacado diretamente. Somente quando seus bônus atingirem o rollover solicitado você poderá convertê-los no saldo da carteira de dinheiro.\nQuando o jogador tiver saldo na carteira de dinheiro e quiser apostar, o sistema deduzirá primeiro o valor das apostas da carteira dele em dinheiro e, quando o saldo da carteira de dinheiro acabar, o sistema começará a deduzir as apostas do saldo da carteira de bônus.\nSomente quando o saldo da carteira de dinheiro for 0 (zero) o jogador poderá utilizar o saldo da carteira de bônus para apostas.\n',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN':
        '流水 / 提款要求',
      'en-US':
        'Rollover/ necessary bets to withdraw the bonus',
      'pt-BR':
        'Rollover/ apostas necessárias para saque do bônus',
    },
    content: {
      'zh-CN': '每次领取奖金后，请查看该奖金对应的提款规则。',
      'en-US': 'Whenever you receive a bonus, check the withdrawal rules for that bonus.',
      'pt-BR': 'Sempre que receber um bônus, verifique as regras de saque desse bônus.',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN':
        '如何查看我的奖金钱包及流水要求？',
      'en-US':
        'How to find my bonus wallet and know the rollover amount.',
      'pt-BR':
        'Como encontrar minha carteira de bônus e saber o valor de rollover.',
    },
    content: {
      'zh-CN': '点击头像或底部的【账户】，选择【提现】，再点击【问号】图标，系统会显示每个钱包尚需完成的投注金额以解锁提现。',
      'en-US': 'Just click on your avatar or on ACCOUNT at the bottom of the page and select WITHDRAWAL, then click on the question mark symbol, and the system will show you the value that still needs to be met in bets to release the withdrawal for each wallet.',
      'pt-BR': 'Basta clicar no seu avatar ou em CONTA no canto inferior da página e selecionar SAQUE, então clique no símbolo de interrogação, e o sistema irá te mostrar o valor que ainda será necessário cumprir em apostas para liberar o saque de cada carteira.',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN':
        '奖金钱包转换为现金钱包规则',
      'en-US':
        'Rules for converting the bonus wallet to the cash wallet',
      'pt-BR':
        'Regras de conversão da carteira de bônus para a carteira de dinheiro',
    },
    content: {
      'zh-CN': '现金钱包余额在满足1倍流水后即可直接提现。\n奖金钱包余额不可直接提现。满足流水要求后，请进入转换页面将奖金兑换为现金，之后即可提现。',
      'en-US': 'The balance of the cash wallet can be withdrawn directly after fulfilling the 1x rollover requirement.\nThe balance of the bonus wallet cannot be withdrawn directly. After fulfilling the rollover requirement, you need to access the conversion interface to exchange the bonus for cash, and then you can withdraw.',
      'pt-BR': 'O saldo da carteira de dinheiro pode ser sacado diretamente após cumprir o requisito de rollover de 1x.\nO saldo da carteira de bônus não pode ser sacado diretamente. Após cumprir o requisito de rollover, você precisa acessar a interface de conversão para trocar o bônus por dinheiro, e então poderá sacar.',
    },
    type: 'wallet',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何提款？',
      'en-US': 'How to make a withdrawal',
      'pt-BR': 'Como realizar um saque',
    },
    content: {
      'zh-CN': '提款步骤：\n请先确认您的钱包余额充足，点击个人头像并选择【提款】。\n请确保您已完成流水要求。\n选择您要提取的币种，输入提款金额后点击确认。\n若您尚未绑定 CPF，需要在此页面输入您的 CPF 号码和姓名以完成绑定。',
      'en-US': 'Steps for withdrawal:\nCheck if you have sufficient balance in your wallet, click on your profile icon and select Withdrawal.\nMake sure you have met the rollover requirements.\nYou need to choose the currency you wish to withdraw, enter the amount you want to withdraw, and click confirm.\nIf you have not linked your CPF, you will need to enter your CPF number and name in this interface to link it.',
      'pt-BR': 'Passos para saque:\nVerifique se há saldo suficiente em sua carteira, clique no ícone de seu perfil e selecione Saque.\nVerifique se você já atendeu aos requisitos de rollover.\nVocê precisa escolher a modalidade de moeda que deseja sacar, preencher o valor que deseja sacar e clicar em confirmar.\nSe você não vinculou seu CPF, precisará preencher seu número de CPF e nome nesta interface para vinculação.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '提款要求',
      'en-US': 'Withdrawal requirements',
      'pt-BR': 'Requisitos para saque',
    },
    content: {
      'zh-CN': '进行提款前，您需满足以下条件\n进入右上角菜单，点击个人资料后选择【提款】。\n流水需已完全清零（达到 100%）\n提款页面会显示可提取的最低余额。\n您必须至少完成过一次存款。',
      'en-US': 'To make a withdrawal, you must meet the following requirements:\nAccess the menu in the top right corner, click on your profile, and then select "Withdrawal."\nYour rollover must be cleared (100% completed). \nThe minimum available balance for withdrawal can be checked directly on the platform in the withdrawal tab.\nYou must have made at least one deposit previously.',
      'pt-BR': 'Para realizar um saque, você deve atender aos seguintes requisitos:\nAcesse o menu no canto superior direito, clique em seu perfil e depois em "Saque."\nSeu rollover deve estar zerado (100% concluído).\nO saldo mínimo disponível para saque pode ser checado na própria plataforma na aba saque.\nÉ necessário ter feito pelo menos um depósito anteriormente.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何查询提款状态？',
      'en-US': 'How to check the status of the withdrawal after the request',
      'pt-BR': 'Como verificar o status do saque após a solicitação',
    },
    content: {
      'zh-CN': '点击屏幕右上角的个人头像，选择【交易记录】-【提款】，即可查看历史记录。',
      'en-US': 'Click on the profile icon in the top right corner of the screen and select "Transactions," then "Withdrawal" to view your history.',
      'pt-BR': 'Clique no ícone do seu perfil no canto direito da tela e selecione "Transações" e em seguida "Saque" para visualizar seu histórico.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何查看提款记录？',
      'en-US': 'How to view the withdrawal history',
      'pt-BR': 'Como ver o histórico de saques',
    },
    content: {
      'zh-CN': '点击屏幕右上角的个人头像，选择【交易记录】，再点击【提款】即可查看历史记录。',
      'en-US': 'Click on the profile icon in the top right corner of the screen and select "Transactions," then select "Withdrawal" to view your history.',
      'pt-BR': 'Clique no ícone do seu perfil no canto direito da tela e selecione "Transações" e após selecione "Saque" para visualizar seu histórico.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '系统显示“审核中”',
      'en-US': 'The system displays "Under review"',
      'pt-BR': 'O sistema exibe "Em análise"',
    },
    content: {
      'zh-CN': '您的提款申请正在审核中。我们正在加快处理进度。如审核未通过，款项将自动退回至您的账户。',
      'en-US': 'Your withdrawal request is being processed. We are working to expedite the review. If the withdrawal is not approved, the amount will be automatically refunded to your account.',
      'pt-BR': 'Seu pedido de saque está sendo processado. Estamos trabalhando para agilizar a análise. Caso o saque não seja aprovado, o valor será automaticamente estornado para sua conta.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '系统显示您的提款已通过审核',
      'en-US': 'The system showed that your withdrawal was approved.',
      'pt-BR': 'O sistema mostrou que seu saque foi aprovado.',
    },
    content: {
      'zh-CN': '提款审核通过后，到账可能需要几分钟时间。夜间处理时可能会有轻微延迟。',
      'en-US': 'After the withdrawal is approved, the payment may take a few minutes to be completed. At night, there may be a slight delay.',
      'pt-BR': 'Após a aprovação do saque, o pagamento pode levar alguns minutos para ser concluído. À noite, pode haver um pequeno atraso.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '提款已超过30分钟仍未到账。',
      'en-US': 'Your withdrawal has already exceeded 30 minutes.',
      'pt-BR': 'Seu saque já ultrapassou 30 minutos.',
    },
    content: {
      'zh-CN': '若提款超过30分钟未到账，请点击屏幕左侧的【在线客服】，客服人员将协助您处理。\n为加快处理，请提供以下信息：\n游戏ID：\n提款金额：\n提款日期：\n提款时间：\n',
      'en-US': 'If more than 30 minutes have passed, select "Live Chat" on the left side of the screen, and an agent will assist you.\nPlease send the following information to expedite support:\nGame ID:\nWithdrawal amount:\nWithdrawal date:\nWithdrawal time:',
      'pt-BR': 'Se já passaram mais de 30 minutos, selecione "Bate papo ao vivo no lado esquerdo da tela", e um atendente irá ajudá-lo.\nEnvie as seguintes informações para agilizar o suporte:\nID do jogo:\nValor do saque:\nData do saque:\nHorário do saque:',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '提现退回',
      'en-US': 'Withdrawal returned',
      'pt-BR': 'Saque devolvido',
    },
    content: {
      'zh-CN': '我的提现被拒绝并退回了金额。\n这可能是由于以下两种原因造成的：\n银行账户信息填写错误。\n银行网络故障，请重新提交提现申请。',
      'en-US': 'My withdrawal was declined and the amount was refunded.\nThis can happen for two reasons:\nIncorrect bank details.\nBank network failure. Just redo the request.',
      'pt-BR': 'Meu saque foi recusado e o valor devolvido. \nIsso pode ocorrer por dois motivos:\nDados bancários incorretos.\nFalha na rede bancária. Basta refazer a solicitação.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我无法点击“提现”按钮（Withdrawal）。',
      'en-US': 'I can\'t click the "Withdrawal" button (Withdrawal).',
      'pt-BR': 'Não consigo clicar no botão "Saque" (Saque).',
    },
    content: {
      'zh-CN': '未达流水要求： 您可以点击右上角头像并选择【钱包】，查看您的流水状态。完成流水要求后即可提现。\n未绑定CPF提现账户： 您需要先绑定您的CPF Pix并完成验证，之后才能提现。\n网络问题： 如果提现时网络不佳，请先退出账户并重新登录后再尝试提现。',
      'en-US': 'Rollover not met: You can click on the top right corner, click on your profile, and select wallet to check your Rollover status. You need to complete the Rollover before you can withdraw.\nCPF not linked to your withdrawal: You need to link your CPF Pix and complete the verification before you can withdraw.\nNetwork issues: If the network is poor during withdrawal, log out of your account and log in again to withdraw.',
      'pt-BR': 'Rollover não atendido: Você pode clicar no canto superior direito, clicar em seu perfil e selecionar carteira para verificar sua situação de Rollover. Você precisa completar o Rollover antes de poder retirar.\nCPF não vinculado à sua retirada: Você precisa vincular seu CPF Pix e realizar a verificação antes de poder fazer a retirada.\nProblemas de rede: Se a rede estiver ruim durante a retirada, saia da conta e faça login novamente para retirar.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '系统提示我的CPF Pix在注册时无法绑定。',
      'en-US': 'The system shows that my CPF Pix cannot be linked during registration.',
      'pt-BR': 'O sistema exibe que meu CPF Pix não pode ser vinculado ao cadastrar.',
    },
    content: {
      'zh-CN': '每个CPF仅能绑定一个账户。请确认您的CPF未被绑定至其他账户。若有问题，请联系24小时在线客服。',
      'en-US': 'A CPF can only be linked to one ID. Please make sure that your CPF is not linked to other accounts. If you encounter any issues, you can contact the platform\'s customer support online, available 24/7.',
      'pt-BR': 'Um CPF só pode estar vinculado a um ID, por favor, certifique-se de que seu CPF não está vinculado a outras contas. Se você encontrar qualquer problema, pode consultar o atendimento ao cliente online da plataforma 24 horas por dia, 7 dias por semana.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '账户被封禁。',
      'en-US': 'Account blocked',
      'pt-BR': 'Conta bloqueada',
    },
    content: {
      'zh-CN': '系统检测到可疑操作或违反规则，您的账户已被自动封禁。此类情况我们无法干预，请务必遵守平台规则进行游戏。',
      'en-US': 'The system detected suspicious activity or rule violations, and your account has been automatically blocked. We cannot intervene in this case. Please make sure to follow the platform\'s rules while playing.',
      'pt-BR': 'O sistema detectou atividade suspeita ou violação das regras, e sua conta foi bloqueada automaticamente. Não podemos intervir nesse caso. Certifique-se de seguir as regras da plataforma ao jogar.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何绑定CPF Pix？',
      'en-US': 'How to link my CPF Pix?',
      'pt-BR': 'Como vincular meu CPF Pix?',
    },
    content: {
      'zh-CN': '点击右侧菜单栏中的【个人资料】，再选择【提现】。输入提现金额并点击【确认】，在同一页面填写CPF和姓名即可完成绑定。',
      'en-US': 'Click on the right sidebar menu, select your profile, then select "Withdrawal." Enter the desired amount and click Confirm. In the same location, fill in your CPF and full name to link.',
      'pt-BR': 'Clique no menu lateral direito e selecione seu perfil e após "Saque". Insira o valor desejado e clique em Confirmar. No mesmo local, preencha seu CPF e nome completo para vincular.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '系统提示我的CPF Pix已被使用',
      'en-US': 'The system says my CPF Pix is already in use.',
      'pt-BR': 'O sistema diz que meu CPF Pix já está em uso.',
    },
    content: {
      'zh-CN': '一个CPF Pix只能绑定一个游戏ID，已绑定其他账户的CPF无法再次绑定。如遇问题，可咨询平台7×24小时在线客服。',
      'en-US': 'A CPF Pix can only be linked to one game ID, and the CPF linked to another game account cannot be linked again. If you encounter any issues, you can consult the platform\'s 24/7 online customer service.',
      'pt-BR': 'Um CPF Pix só pode ser vinculado a um ID de jogo, e o CPF vinculado a outra conta de jogo não pode ser vinculado novamente. Se você encontrar qualquer problema, pode consultar o atendimento ao cliente online da plataforma 7*24 horas.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '游戏类型介绍',
      'en-US': 'Introduction to the different types of games',
      'pt-BR': 'Introdução aos diferentes tipos de jogos (original)',
    },
    content: {
      'zh-CN': '原创游戏：平台独家开发的原创游戏，为您带来独特且与众不同的游戏体验。\n老虎机：多款刺激有趣的老虎机游戏，畅享无限乐趣！',
      'en-US': 'Originals: Exclusive games from our platform, developed to offer a unique and differentiated experience.\nSlots: Various exciting slot games, providing unlimited fun!',
      'pt-BR': 'Originais : Jogos exclusivos da nossa plataforma, desenvolvidos para oferecer uma experiência única e diferenciada. (original)\nSlots: Diversos jogos de caça-níqueis emocionantes, proporcionando diversão ilimitada! (original)',
    },
    type: 'game',
    expand: false,
  },
  {
    title: {
      'zh-CN': '游戏在免费旋转期间卡住或崩溃',
      'en-US': 'My game froze or crashed during a free round.',
      'pt-BR': 'Meu jogo travou ou caiu durante uma rodada grátis. (original)',
    },
    content: {
      'zh-CN': '若游戏在免费旋转过程中卡顿或断线，请重新登录并检查游戏界面。若未显示该轮旋转，表示系统已自动完成该局。您可以在游戏中奖记录中查看详细结果。',
      'en-US': 'If the game freezes or disconnects during a free round, log in again and check. If the round is not displayed, it means the system has already automatically completed the spin. You can check the game\'s win history.',
      'pt-BR': 'Caso o jogo trave ou desconecte durante uma rodada grátis, faça o login novamente e verifique. Se a rodada não for exibida, significa que o sistema já completou automaticamente a jogada. Você pode conferir o histórico de ganhos no jogo. (original)',
    },
    type: 'game',
    expand: false,
  },
  {
    title: {
      'zh-CN': '游戏中奖未正确发放',
      'en-US': 'The prize from my game was not paid correctly.',
      'pt-BR': 'O prêmio do meu jogo não foi pago corretamente. (original)',
    },
    content: {
      'zh-CN': '系统将根据游戏规则发放奖金。您可在游戏中查看具体中奖规则。如有疑问，请联系平台 7×24 小时在线客服。',
      'en-US': 'The system will distribute prizes according to the prize rules. You can check the specific prize rules displayed in the game. If you have any questions, you can contact the platform\'s customer support, available 24 hours a day, 7 days a week.',
      'pt-BR': 'O sistema distribuirá prêmios de acordo com as regras de premiação. Você pode consultar as regras específicas de premiação exibidas no jogo. Se tiver dúvidas, você pode entrar em contato com o atendimento ao cliente da plataforma, disponível 24 horas por dia, 7 dias por semana. (original)',
    },
    type: 'game',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何邀请好友？',
      'en-US': ' How can I invite friends?',
      'pt-BR': 'Como posso convidar amigos? (original)',
    },
    content: {
      'zh-CN': '进入平台左侧菜单，点击【联盟】。\n在菜单中找到您的推荐链接【我的链接】。\n将您的专属链接分享给好友，让他们通过您的推荐进行注册。',
      'en-US': 'Access the left side menu of the platform and click on "Affiliate."\nIn the menu, find your referral "My Link."\nShare your link with your friends so they can register using your referral.',
      'pt-BR': 'Acesse o menu lateral esquerdo da plataforma e clique em "Afiliado".\nNo menu, encontre "Meu Link" de indicação.\nCompartilhe seu link com seus amigos para que eles se cadastrem com sua indicação.',
    },
    type: 'agent',
    expand: false,
  },
  {
    title: {
      'zh-CN': '每日佣金发放时间',
      'en-US': 'What time are the daily commissions paid?',
      'pt-BR': 'Qual é o horário de pagamento das comissões diárias? (original)',
    },
    content: {
      'zh-CN': '佣金每 24 小时计算并发放一次。\n看及领取佣金的方法：\n进入平台左侧主菜单，点击【联盟】。\n选择【佣金】即可查看金额。\n点击【领取】，佣金将转入您的账户。\n提示：佣金无流水要求，可随时提款。',
      'en-US': 'Commissions are calculated and distributed every 24 hours. \nTo check and receive your commission:\nAccess the main menu on the left side of the platform and click on affiliates. \nSelect "Commission" to view the amounts. \nClick "Receive" to transfer your commission to your account.\nTip: Commissions have no rollover and can be withdrawn immediately.',
      'pt-BR': 'As comissões são calculadas e distribuídas a cada 24 horas. \nPara verificar e receber sua comissão:\nAcesse o menu principal à esquerda da plataforma e clique em afiliados. \nSelecione "Comissão" para visualizar os valores. \nClique em "Receber" para transferir sua comissão parasua conta.\nDica: As comissões não têm rollover e podem ser sacadas imediatamente.',
    },
    type: 'agent',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何领取每日佣金？',
      'en-US': 'How can I withdraw my daily commission?',
      'pt-BR': 'Como posso sacar minha comissão diária? (original)',
    },
    content: {
      'zh-CN': '佣金每 24 小时结算一次。\n查看及领取方法：\n进入【联盟】菜单。\n选择【未领取佣金】查看金额。点击【领取】将佣金转入账户。\n提示：佣金无流水要求，可立即提款。',
      'en-US': 'Commissions are calculated every 24 hours. \nTo check and receive your commission:\nAccess the "Affiliate" menu. \nSelect "Uncollected Commission" to view the amounts. Click "Claim" to transfer your commission to your account. \nTip: Commissions have no rollover and can be withdrawn immediately.',
      'pt-BR': 'As comissões são calculadas a cada 24 horas. \nPara verificar e receber sua comissão:\nAcesse o menu "Afiliado".\nSelecione "Comissão não coletada" para visualizar os valores. Clique em "Reivindicar" para transferir sua comissão para sua conta.\nDica: As comissões não têm rollover e podem ser sacadas imediatamente.',
    },
    type: 'agent',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我忘记密码了',
      'en-US': 'I forgot my password',
      'pt-BR': 'Esqueci minha senha (original)',
    },
    content: {
      'zh-CN': '请点击【在线客服】，我们将为您转接至实时客服支持。\n您需要向客服提供以下信息，工作人员将协助您重置密码：用户ID / 手机号码：\n姓名：\n身份证件照片：\n此账号最近一次存款的交易截图',
      'en-US': 'Please select "Live chat" and we will forward you to live support.\nYou will need to provide the following information to our support, and they will help you reset your password:\nID/Phone number:\nName:\nPhoto of the identification document:\nScreenshot of the last deposit transaction for this ID',
      'pt-BR': 'Por favor, selecione "Bate papo ao vivo" e iremos encaminhá-lo para o atendimento ao vivo.\nVocê precisará fornecer as seguintes informações ao nosso suporte, e eles irão ajudá-lo a redefinir sua senha:\nID/Número de telefone:\nNome:\nFoto do documento de identificação:\nCaptura de tela da última transação de depósito deste ID',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '修改密码',
      'en-US': 'I want to change my password',
      'pt-BR': 'Quero alterar minha senha (original)',
    },
    content: {
      'zh-CN': '点击平台右上角的个人头像，选择个人资料，再进入【设置】\n在菜单中找到【密码】选项。\n打开后即可自由设置新密码。\n',
      'en-US': 'You need to click on your profile button at the top right corner of the platform, select your profile, and then select "Settings". \nInside the menu, you will see the "Password" option.\nOpen the "Password" option, and you will be able to set your new password freely.',
      'pt-BR': 'Você precisa clicar no botão de seu perfil no canto superior direito da plataforma, selecione seu perfil e selecione "Configuração". \nDentro do menu, você verá a opção "Senha".\nAbra a opção "Senha" e você poderá definir sua nova senha livremente.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何绑定手机号',
      'en-US': 'How to link my mobile number',
      'pt-BR': 'Como vincular meu número de celular (original)',
    },
    content: {
      'zh-CN': '您在注册账号时填写的手机号即为当前绑定的号码，暂不支持更改。',
      'en-US': 'The phone number you entered when registering your account is your currently linked phone number. It cannot be changed.',
      'pt-BR': 'O número de telefone que você preencheu ao registrar sua conta é o seu número de telefone vinculado atualmente. Ele não pode ser alterado.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '需要更改绑定手机号',
      'en-US': 'I need to change my linked phone number',
      'pt-BR': 'Eu preciso alterar o meu número de telefone vinculado (original)',
    },
    content: {
      'zh-CN': '为确保账户安全，绑定手机号暂不支持更改。',
      'en-US': 'To ensure the security of the user\'s account, the linked phone number cannot be changed.',
      'pt-BR': 'Para garantir a segurança da conta do usuário, o número de telefone vinculado não pode ser alterado.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何绑定邮箱？',
      'en-US': 'How to link my email',
      'pt-BR': 'Como vincular meu e-mail (original)',
    },
    content: {
      'zh-CN': '您用于提款的提现账户邮箱即为绑定邮箱。',
      'en-US': 'The email of the linked withdrawal account that you used to withdraw is your linked email account.',
      'pt-BR': 'O e-mail da conta de saque vinculado que você usou ao retirar é a sua conta de e-mail vinculada.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '需要更改绑定邮箱',
      'en-US': 'I need to change my linked email',
      'pt-BR': 'Eu preciso alterar o meu e-mail vinculado (original)',
    },
    content: {
      'zh-CN': '为确保账户安全，绑定邮箱暂不支持更改。',
      'en-US': 'To ensure the security of the user\'s account, the linked email cannot be changed.',
      'pt-BR': 'Para garantir a segurança da conta do usuário, o e-mail vinculado não pode ser alterado.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '无法登录账户',
      'en-US': 'I can\'t access my account',
      'pt-BR': 'Não consigo acessar minha conta (original)',
    },
    content: {
      'zh-CN': '请点击【在线客服】，我们将为您转接至人工客服。\n若您忘记登录密码，请提供以下信息，客服人员将协助您重置密码：用户ID / 手机号码：\n姓名：\n身份证件照片：\n此账号最近一次充值转账截图：\n如遇其他问题，请截图保存错误页面并发送给人工客服，工作人员将协助您解决登录问题。',
      'en-US': 'Please select the Live Chat option, and we will transfer you to human customer support.\nIf you have forgotten your login password, you need to provide the following information to human customer support, and they will help you reset your password:\nID/Phone number:\nName:\nPhoto of your identification document\nScreenshot of the last recharge transfer for this ID\nFor other issues, you need to save a screenshot of the error page and send it to human customer support, and they will help you resolve the login issue.',
      'pt-BR': 'Por favor, escolha a opção Bate papo ao vivo, nós iremos transferi-lo para o atendimento ao cliente humano.\nSe você esqueceu a senha de login, você precisa fornecer as seguintes informações ao atendimento ao cliente humano, ela irá ajudá-lo a redefinir a senha:\nID/número de telefone:\nNome:\nFoto do documento de identificação\nCaptura de tela da transferência da última recarga deste ID \nPara outros problemas, você precisa salvar a captura de tela da página de erro e enviá-la ao atendimento ao cliente humano, ela irá ajudá-lo a resolver o problema de login.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '系统提示“账号不存在”',
      'en-US': 'The system says that my account does not exist.',
      'pt-BR': 'O sistema informa que minha conta não existe (original).',
    },
    content: {
      'zh-CN': '请检查您输入的手机号和密码是否正确。\n如果确认信息无误，请选择【在线客服】，我们将为您转接人工客服。\n为协助您重置密码，请向客服提供以下信息：\nID/手机号：\n姓名：\nCPF照片：\n该ID最近一次存款的交易截图：',
      'en-US': 'Please check if the phone number and password you entered are correct.\nIf you are sure that the information is correct, select "Live Chat", and we will transfer you to live customer support.\nTo help you reset your password, please provide the following information to our support:\nID/Phone number:\nName:\nPhoto of your CPF:\nScreenshot of the last deposit transaction for this ID',
      'pt-BR': 'Por favor, verifique se o número de telefone e a senha que você digitou estão corretos.\nSe você tiver certeza de que as informações estão corretas, selecione "Bate papo ao vivo", e iremos encaminhá-lo para o atendimento ao vivo.\nPara que nosso suporte possa ajudá-lo a redefinir sua senha, forneça as seguintes informações:\nID/Número de telefone:\nNome:\nFoto do CPF:\nCaptura de tela da última transação de depósito deste ID',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我下载的APP打不开。',
      'en-US': 'The app I downloaded is not opening.',
      'pt-BR': 'O aplicativo que baixei não está abrindo (original).',
    },
    content: {
      'zh-CN': '这可能是因为您的APP版本过旧。请通过浏览器访问我们的平台，下载最新版本的APP以确保正常使用。',
      'en-US': 'This may happen because your app version is outdated. Please access our platform through the browser and download the latest version of the app to ensure it works properly.',
      'pt-BR': 'Isso pode ocorrer porque sua versão do aplicativo está desatualizada (original). Acesse nossa plataforma pelo navegador e baixe a versão mais recente do aplicativo para garantir seu funcionamento correto.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '无法下载APP。',
      'en-US': 'I can\'t download the app.',
      'pt-BR': 'Eu não consigo baixar o APP (original).',
    },
    content: {
      'zh-CN': '请按以下步骤操作：\n使用Google Chrome打开平台链接。\n清除Google Chrome缓存。\n重新进入平台链接并点击【下载】。\n如果仍无法下载，请录制视频并发送给【在线客服】。',
      'en-US': 'Please follow the steps below:\nOpen the link to our platform using Google Chrome.\nClear the Google Chrome cache.\nEnter the platform link and click download.\nIf you still can\'t download, record a video and send it to online customer support.',
      'pt-BR': 'Por favor, siga os passos abaixo:\nAbra o link da nossa plataforma usando o Google Chrome.\nLimpe o cache do Google Chrome.\nDigite o link da plataforma e clique em baixar.\nSe ainda não conseguir baixar, grave um vídeo e envie para o atendimento ao cliente online.\n',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '下载APP',
      'en-US': 'Download the app',
      'pt-BR': 'Baixar o APP',
    },
    content: {
      'zh-CN': '下载APP后，游戏体验更流畅，赢奖更轻松！',
      'en-US': 'After downloading the app, the gaming experience becomes smoother, and winning prizes is easier!',
      'pt-BR': 'Após baixar o APP, a experiência de jogo fica mais fluida e ganhar prêmios é mais fácil!',
    },
    type: 'account,bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何成为合作伙伴/代理？',
      'en-US': 'How can I become a partner/agent?',
      'pt-BR': 'Como posso me tornar um parceiro/Agente?',
    },
    content: {
      'zh-CN': '请选择【在线客服】，客服代表将与您联系。为加快审核，请提供以下信息：账户ID、姓名、电话/WhatsApp/Telegram、社交媒体。我们的团队将与您联系洽谈合作细节。',
      'en-US': 'Select "Live chat," and a representative will contact you. To speed up the analysis, please send the following information: Account ID, Full name, Phone/WhatsApp/Telegram, Social media. Our team will get in touch to discuss the partnership details.',
      'pt-BR': 'Selecionar "Bate papo ao vivo", e um atendente entrará em contato com você. Para agilizar a análise, envie as seguintes informações: ID da conta, Nome completo, Telefone/WhatsApp/Telegram, Redes sociais. Nossa equipe entrará em contato para discutir os detalhes da parceria.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何注册？',
      'en-US': 'How to register',
      'pt-BR': 'Como se registrar',
    },
    content: {
      'zh-CN': '您好，开户仅需10秒即可完成。请点击平台上的【注册】按钮，填写邮箱地址，设置8至20位由字母与数字组成的密码，并妥善保管。',
      'en-US': 'Hello, opening an account takes only 10 seconds, and you will already have an account. Please click the "Register" button on the platform. Fill in your email address. The password must be composed of 8 to 20 alphanumeric characters, and we ask that you keep your password confidential.',
      'pt-BR': 'Olá, a abertura de conta leva apenas 10 segundos e você já terá uma conta. Por favor, clique no botão "Registrar" da plataforma. Preencha seu endereço de e-mail. A senha deve ser composta por 8 a 20 caracteres alfanuméricos, e pedimos que mantenha sua senha em sigilo.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何充值？',
      'en-US': 'How to deposit?',
      'pt-BR': 'Como depositar?',
    },
    content: {
      'zh-CN': '请点击平台上的【充值】按钮。\n在充值页面选择您的国家/地区。\n根据选择的国家/地区，选择对应的法币或虚拟币进行充值。',
      'en-US': 'Please click the "Deposit" button on the platform.\nOn the deposit page, select your country/region.\nBased on the selected country/region, choose the corresponding fiat currency or cryptocurrency to make the deposit.',
      'pt-BR': 'Por favor, clique no botão "Depósito" na plataforma.\nNa página de depósito, selecione o seu país/região.\nCom base no país/região selecionado, escolha a moeda fiduciária ou criptomoeda correspondente para realizar o depósito.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何投注？',
      'en-US': 'How to bet?',
      'pt-BR': 'Como apostar?',
    },
    content: {
      'zh-CN': '您可以在游戏大厅中选择喜欢的游戏。\n在游戏界面中，选择要投注的金额。\n请确保账户余额大于投注金额。您可在任意游戏界面中进行投注。',
      'en-US': 'You can choose your preferred game in the game lobby.\nIn the game interface, select the bet amount you want to place.\nMake sure that your account balance is greater than the selected bet amount. You can choose any game you prefer in the game interface to place your bet.',
      'pt-BR': 'Você pode escolher o jogo de sua preferência no lobby do jogo.\nNa interface do jogo, selecione o valor da aposta que deseja fazer.\nCertifique-se de que o saldo da sua conta seja maior que o valor da aposta selecionada. Você pode escolher qualquer jogo de sua preferência na interface do jogo para apostar.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何提现？',
      'en-US': 'How to withdraw?',
      'pt-BR': 'Como sacar?',
    },
    content: {
      'zh-CN': '提现步骤：\n确认钱包中余额充足，点击个人头像并选择【提现】。\n确保已完成流水要求。\n选择提现币种，输入金额并点击确认。\n若尚未绑定提现账户，请在该页面填写相关信息完成绑定。\n',
      'en-US': 'Steps to withdraw:\nCheck if there is enough balance in your wallet, click on your profile icon, and select Withdraw.\nEnsure you have met the rollover requirements.\nChoose the currency type you want to withdraw, enter the amount, and click confirm.\nIf you have not linked a withdrawal account yet, you will need to fill in the relevant information on this interface to complete the account linking.',
      'pt-BR': 'Passos para saque:\nVerifique se há saldo suficiente em sua carteira, clique no ícone de seu perfil e selecione Saque.\nVerifique se você já atendeu aos requisitos de rollover.\nVocê precisa escolher a modalidade de moeda que deseja sacar, preencher o valor que deseja sacar e clicar em confirmar.Se você ainda não vinculou uma conta de saque, será necessário preencher as informações relevantes nesta interface para concluir o vínculo da conta.',
    },
    type: 'account',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何使用奖金？',
      'en-US': 'How can I use my bonus?',
      'pt-BR': 'Como posso utilizar meu bônus?',
    },
    content: {
      'zh-CN': '奖金可用于平台上任意游戏的投注。',
      'en-US': 'The bonus can be used to bet on any game on the platform.',
      'pt-BR': 'O bônus pode ser usado para apostar em qualquer jogo da plataforma.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何提取奖金？',
      'en-US': 'How can I withdraw my bonus?',
      'pt-BR': 'Como posso sacar meu bônus?',
    },
    content: {
      'zh-CN': '存款余额与奖金余额分属不同钱包。用户首次领取奖金后，原有余额将清空。两者的流水要求也独立计算。完成相应流水后，即可正常提款。',
      'en-US': 'The deposit balance and the bonus balance are accumulated in different wallets. After the user redeems the bonus for the first time, the balance will disappear completely. The rollover is also separate between the two. Once you meet the rollover requirement, you can withdraw the balance normally.',
      'pt-BR': 'O saldo dos depósitos e o saldo dos bônus são acumulados em carteiras diferentes. Depois que o usuário resgatar o bônus pela primeira vez, o saldo desaparecerá completamente. O rollover também é distinto entre os dois. Assim que você atingir o requisito de rollover, poderá sacar o saldo normalmente.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '提款所需流水是多少？',
      'en-US': 'What is the required rollover to withdraw the bonus?',
      'pt-BR': 'Qual é o rollover exigido para sacar o bônus?',
    },
    content: {
      'zh-CN': '所需流水根据不同奖金类型而异。领取奖金前，请先查看相应规则与条款。您可在【提款】页面查看具体所需流水进度。',
      'en-US': 'The rollover varies according to the type of bonus. Before accepting a bonus, check the applicable rules and conditions. You can view the total rollover required by accessing the "Withdrawal" tab.',
      'pt-BR': 'O rollover varia de acordo com o tipo de bônus. Antes de aceitar um bônus, verifique as regras e condições aplicáveis. Você pode visualizar o rollover total necessário acessando a aba "Saque".',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我的奖金未到账',
      'en-US': 'My bonus was not credited.',
      'pt-BR': 'Meu bônus não foi creditado.',
    },
    content: {
      'zh-CN': '每个奖金都有特定的发放条件。\n请检查：\n是否已满足活动要求；\n如有需要，请在活动页面手动领取奖金；\n若问题仍未解决，请联系在线客服。',
      'en-US': 'Each bonus follows specific release criteria. \nCheck:\nIf you have met the promotion requirements.\nIf necessary, click on the promotion page to manually claim the bonus.\nIf the problem persists, contact support.',
      'pt-BR': 'Cada bônus segue critérios específicos de liberação.\nVerifique:\nSe você atendeu aos requisitos da promoção.\nSe for necessário, clique na página da promoção para resgatar manualmente o bônus. \nSe o problema persistir, entre em contato com o suporte.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '兑换码无法使用',
      'en-US': 'The promotional code is not working.',
      'pt-BR': 'O código promocional não está funcionando.',
    },
    content: {
      'zh-CN': '兑换码可能有使用次数限制或有效期。若无法使用，请检查：\n兑换码是否仍在有效期内。\n是否符合活动要求。\n若兑换码已过期，请关注后续活动信息。',
      'en-US': 'Promotional codes may have usage limits or expiration dates. If the code cannot be redeemed:\nCheck if it is still valid. \nConfirm if you meet the promotion\'s requirements.\nIf it has already expired, stay tuned for future promotions.',
      'pt-BR': 'Os códigos promocionais podem ter limite de uso ou validade. Se o código não puder ser resgatado:\nVerifique se ainda está válido.\nConfirme se atende aos requisitos da promoção.\nCaso já tenha expirado, fique atento para futuras promoções.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '如何查看奖金记录？',
      'en-US': 'How to view the bonus record',
      'pt-BR': 'Como ver o registro de bônus',
    },
    content: {
      'zh-CN': '点击屏幕右侧的个人头像，选择【钱包】即可查看。',
      'en-US': 'You can click on your profile button on the right side of the screen and then select Wallet to view it.',
      'pt-BR': 'Você pode clicar no botão de seu perfil no lado direito da tela e, em seguida, selecionar Carteira para visualizar.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我想取消已领取的奖金',
      'en-US': 'I want to cancel the bonus I received.',
      'pt-BR': 'Eu quero cancelar o bônus que recebi.',
    },
    content: {
      'zh-CN': '若您尚未投注，我们可以协助处理。请提供以下信息以便尽快为您解决：\n游戏ID：\n奖金金额：\n领取日期：\n领取时间：\n请选择【问题未解决】，我们将为您转接人工客服。',
      'en-US': 'If you have not yet placed a bet, we can help you process it. You need to provide the following information to help us resolve it more quickly:\nYour game ID:\nBonus amount:\nBonus receipt date:\nBonus receipt time:\nPlease select "unresolved issue," and we will transfer you to human customer support.',
      'pt-BR': 'Se você ainda não fez a aposta, podemos ajudá-lo a processá- la. Você precisa fornecer as seguintes informações para nos ajudar a resolver isso mais rapidamente:\nSeu ID de jogo:\nValor do bônus:\nData de recebimento do bônus:\nHora de recebimento do bônus:\nPor favor, selecione "problema não resolvido", e nós o transferiremos para o atendimento ao cliente humano.',
    },
    type: 'bonus',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我的奖金消失了。',
      'en-US': 'My bonus disappeared.',
      'pt-BR': 'Meu bônus desapareceu.',
    },
    content: {
      'zh-CN': '请选择【在线客服】，客服人员将为您提供协助。\n为加快处理，请提供以下信息：\n账户ID\n奖金消失的游戏名称\n投注金额\n投注时间\n投注日期\n投注单号\n',
      'en-US': 'Select "Live chat," and an agent will assist you.\nTo expedite support, please provide the following information:\nAccount ID\nGame name where the bonus disappeared\nBet amount\nBet time\nBet date\nBet number',
      'pt-BR': 'Selecione "Bate papo ao vivo", e um atendente ajudará você.\nPara agilizar o suporte, envie as seguintes informações:\nID da conta\nNome do jogo onde o bônus desapareceu\nValor da aposta\nHorário da aposta\nData da aposta\nNúmero da aposta',
    },
    type: 'bonus',
    expand: false,
  },

  {
    title: {
      'zh-CN': '我填写的CPF或姓名错误',
      'en-US': 'I entered my CPF or name incorrectly.',
      'pt-BR': 'Preenchi meu CPF ou nome incorretamente.',
    },
    content: {
      'zh-CN': '注册姓名与CPF Pix持有人不一致。\n填写的CPF号码有误。请选择【在线客服】，客服人员将协助您解决。',
      'en-US': 'The registered name does not match the CPF Pix holder.\nThe CPF number provided is incorrect.\nSelect "Live Chat," and a support agent will assist you in resolving the issue.',
      'pt-BR': 'O nome cadastrado não corresponde ao titular do CPF Pix.\nO número do CPF informado está incorreto.\nSelecione "Bate papo ao vivo", e um atendente ajudará você a corrigir o problema.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我想更换账户绑定的CPF',
      'en-US': 'I want to change the CPF linked to my account.',
      'pt-BR': 'Quero trocar o CPF vinculado à minha conta.',
    },
    content: {
      'zh-CN': '注册姓名与CPF Pix持有人不一致。\n填写的CPF号码错误。\n每个CPF只能绑定一个账户ID。\n请选择【在线客服】，客服人员将协助您处理。',
      'en-US': 'The registered name does not match the CPF Pix holder.\nThe CPF number was entered incorrectly.\nEach CPF can only be linked to a single ID.\nSelect "Live chat," and an agent will assist you.',
      'pt-BR': 'O nome informado não corresponde ao titular do CPF Pix.\nO número do CPF foi cadastrado incorretamente.\nCada CPF pode ser vinculado apenas a um único ID.\nSelecione "Bate papo ao vivo", e um atendente ajudará você.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '每日是否有限制提现次数',
      'en-US': 'Is there a withdrawal limit per day?',
      'pt-BR': 'Existe um limite de saques por dia?',
    },
    content: {
      'zh-CN': '每日提现次数不限。您可进入平台【提现】页面查看最低及最高提现限额。',
      'en-US': 'There is no limit on the number of withdrawals per day. You can check the minimum and maximum withdrawal amounts by accessing the "Withdraw" tab on the platform.',
      'pt-BR': 'Não há limite de quantidade de saques por dia. Você pode consultar o valor mínimo e máximo de saque acessando a aba "Saque" na plataforma.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '可用的提现方式有哪些',
      'en-US': 'What are the available withdrawal options?',
      'pt-BR': 'Quais são as opções de saque disponíveis?',
    },
    content: {
      'zh-CN': '提现方式请以提现页面显示为准，目前支持CPF PIX提现。',
      'en-US': 'The withdrawal methods are as shown on the withdrawal page. We currently support CPF PIX for withdrawals.',
      'pt-BR': 'Os métodos de retirada são conforme exibido na página de retirada, atualmente suportamos CPF PIX para saque.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '最低提现金额是多少',
      'en-US': 'What is the minimum withdrawal amount?',
      'pt-BR': 'Qual é o valor mínimo de saque?',
    },
    content: {
      'zh-CN': '建议您打开平台右上角的提现页面查看，提现页面显示的限额为准。',
      'en-US': 'It is recommended that you open the withdrawal interface in the upper right corner of the platform to check, as the limit displayed on the withdrawal page should be considered.',
      'pt-BR': 'Recomenda-se que você abra a interface de saque no canto superior direito da plataforma para verificar, sendo o limite exibido na página de recarga o que deve ser considerado.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '最高提现金额是多少',
      'en-US': 'What is the maximum withdrawal amount?',
      'pt-BR': 'Qual é o valor máximo de saque?',
    },
    content: {
      'zh-CN': '建议您打开平台右上角的提现页面查看，以充值页面显示的限额为准。',
      'en-US': 'It is recommended that you open the withdrawal interface in the top right corner of the platform to check, with the limit displayed on the recharge page being the one to consider.',
      'pt-BR': 'Recomenda-se que você abra a interface de saque no canto superior direito da plataforma para verificar, sendo o limite exibido na página de recarga o que deve ser considerado.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我已成功提现，但想取消提现',
      'en-US': 'I managed to withdraw, but I want to cancel the withdrawal.',
      'pt-BR': 'Eu consegui retirar, mas quero cancelar a retirada.',
    },
    content: {
      'zh-CN': '提现已成功，表示财务部门已将款项转入您绑定的Pix账户，已转账的资金无法撤回。\n提现状态显示处理中，想取消提现\n请提供以下信息，以便我们尽快协助您：\n游戏ID：\n提现金额：\n提现日期：\n提现时间：\n请选择“在线客服”，我们将转接人工客服。',
      'en-US': 'The withdrawal was successful, which means the finance department has successfully transferred the funds to your linked Pix account. We cannot reverse the funds that have been transferred.\nMy withdrawal is showing as processing, I want to cancel the withdrawal.\nYou need to provide the following information to help us resolve this issue more quickly:\nYour game ID:\nWithdrawal amount:\nWithdrawal date:\nWithdrawal time:\nPlease select Live Chat, and we will transfer you to human customer support.',
      'pt-BR': 'A retirada foi bem-sucedida, o que significa que o departamento financeiro já transferiu com sucesso os fundos para a sua conta Pix vinculada. Não podemos reverter os fundos que foram transferidos.\nMeu saque está mostrando que está em processamento, eu quero cancelar o saque.\nVocê precisa fornecer as seguintes informações para nos ajudar a resolver esse problema mais rapidamente:\nSeu ID de jogo:\nValor do saque:\nData do saque:\nHora do saque:\nPor favor, selecione Bate papo ao vivo, e nós o transferiremos para o atendimento ao cliente humano.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '提现状态显示处理中，想取消提现',
      'en-US': 'My withdrawal is showing as processing, I want to cancel the withdrawal.',
      'pt-BR': 'Meu saque está mostrando que está em processamento, eu quero cancelar o saque.',
    },
    content: {
      'zh-CN': '请提供以下信息，以便我们尽快协助您：\n游戏ID：\n提现金额：\n提现日期：\n提现时间：\n请选择“在线客服”，我们将转接人工客服。',
      'en-US': 'You need to provide the following information to help us resolve this issue more quickly:\nYour game ID:\nWithdrawal amount:\nWithdrawal date:\nWithdrawal time:\nPlease select Live Chat, and we will transfer you to human customer support.',
      'pt-BR': 'Você precisa fornecer as seguintes informações para nos ajudar a resolver esse problema mais rapidamente:\nSeu ID de jogo:\nValor do saque:\nData do saque:\nHora do saque:\nPor favor, selecione Bate papo ao vivo, e nós o transferiremos para o atendimento ao cliente humano.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我该怎么办？',
      'en-US': 'What should I do?',
      'pt-BR': 'O que eu devo fazer?',
    },
    content: {
      'zh-CN': '当提现请求失败时，系统会提示失败原因。按照提示操作后即可重新发起提现。',
      'en-US': 'When your withdrawal request fails, the system will inform you of the reason for the failure. After following the instructions, you can initiate the withdrawal again.',
      'pt-BR': 'Quando sua solicitação de saque falhar, o sistema informará o motivo da falha. Após seguir as instruções, você pode iniciar o saque novamente.',
    },
    type: 'withdraw',
    expand: false,
  },
  {
    title: {
      'zh-CN': '我想知道提现失败的原因。',
      'en-US': 'I want to know the reason for the withdrawal failure.',
      'pt-BR': 'Eu quero saber o motivo da falha na retirada.',
    },
    content: {
      'zh-CN': '当提现请求失败时，系统会提示失败原因。按照提示操作后即可重新发起提现。\n如有疑问，请选择【在线客服】，我们将转接人工客服。\n请提供以下信息以便我们更快为您解决：\n游戏ID：\n提现金额：\n提现日期：\n提现时间：',
      'en-US': 'When your withdrawal request fails, the system will inform you of the reason for the failure. You can initiate the withdrawal again after following the instructions.\nIf you have any questions, please select "Live chat," and we will transfer you to human customer support.\nYou need to provide the following information to help us resolve this issue faster:\nYour game ID:\nWithdrawal amount:\nDate of withdrawal:\nTime of withdrawal:',
      'pt-BR': 'Quando sua solicitação de saque falhar, o sistema informará o motivo da falha. Você pode iniciar o saque novamente após seguir as instruções.\nSe você tiver alguma dúvida, por favor, selecione "Bate papo ao vivo" e nós o transferiremos para o atendimento ao cliente humano.\nVocê precisa fornecer as seguintes informações para nos ajudar a resolver esse problema mais rapidamente:\nSeu ID de jogo:\nValor do saque:\nData do saque:\nHora do saque:',
    },
    type: 'withdraw',
    expand: false,
  },
]
