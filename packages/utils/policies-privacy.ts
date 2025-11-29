import { getEnv } from './main'

const { VITE_OFFICIAL_NAME } = getEnv()

export const privacy = {
  'en-US': {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Overview',
        paragraphs: [
          `This is the Privacy Policy of Medium Rare N.V. (owner and operator of ${VITE_OFFICIAL_NAME}). This policy explains how ${VITE_OFFICIAL_NAME} handles your personal information when you become a ${VITE_OFFICIAL_NAME} member, use our website, any pages or sites under the “${VITE_OFFICIAL_NAME}” brand (including any mobile or tablet apps we own or operate), or interact with us.`,
          'We are committed to protecting your personal data and using, storing, and disclosing it in accordance with privacy laws and this policy.',
        ],
      },
      {
        heading: '1. Website Use',
        paragraphs: [
          'By using the website, you agree to this Privacy Policy.',
          `${VITE_OFFICIAL_NAME} may review and update this policy regularly and reserves the right to make changes at any time. Updates take effect immediately when posted on the website. Your continued use of the site constitutes acceptance of these changes.`,
          `This Privacy Policy does not apply to websites linked to the site that ${VITE_OFFICIAL_NAME} does not control.`,
        ],
      },
      {
        heading: '2. Personal Information',
        paragraphs: [
          `Types of personal information ${VITE_OFFICIAL_NAME} may collect include:`,
          '- Name',
          '- Email address',
          '- Submitted preferences',
          '- Date of birth',
          '- Country of citizenship',
          '- Physical address',
          '- ID number',
          '- Government-issued identification',
          '- Location data',
          '- Device information',
          '- IP address',
          'We may collect this information through:',
          '- Data entered during account registration',
          '- Communication with our customers',
        ],
      },
      {
        heading: '3. Purpose of Collection',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} collects your personal information lawfully and fairly for the following purposes as a licensed online gambling operator:`,
          '- Verify your identity (KYC)',
          '- Send marketing communications if you subscribe',
          `- Process your membership application for ${VITE_OFFICIAL_NAME} or any hosted subdomain`,
          '- Provide and improve member services',
          '- Identify members and verify identity to ensure security and legal compliance',
          '- Maintain member accounts',
          '- Enhance your website or phone experience, or tailor information, services, or products to your needs, including market research and promotions',
          `- Create aggregated demographic data about members for stakeholders and to improve ${VITE_OFFICIAL_NAME}’s operations`,
          '- Notify you of products or services you may be interested in via email, SMS, or phone',
          '- Respond to your questions, comments, or requests',
          '- Determine tax responsibilities for goods and services',
          `- Comply with ${VITE_OFFICIAL_NAME}’s contracts, laws, and legal obligations`,
          '- Take appropriate action if we suspect serious unlawful activity or misconduct related to our operations',
          '- Establish, exercise, or defend legal claims',
          '- Manage job applications',
          `If you do not provide the personal information requested by ${VITE_OFFICIAL_NAME}, we may not be able to process your membership application, provide services, or respond to your queries or complaints.`,
          `By using ${VITE_OFFICIAL_NAME}, becoming a member, or providing personal information, you consent to ${VITE_OFFICIAL_NAME} collecting, using, processing, and possibly disclosing your personal information for the purposes described above.`,
        ],
      },
      {
        heading: '4. Direct Marketing & Opt-Out',
        paragraphs: [
          'We may use your personal information to periodically share products, services, or promotions we think may interest or benefit you. This may be via email, SMS, phone, or mail.',
          `If you no longer wish to receive ${VITE_OFFICIAL_NAME} marketing or promotional materials, in full or in any form, you can contact us anytime at support@${VITE_OFFICIAL_NAME} to opt-out, and we will comply promptly.`,
          `We may also contact you occasionally to manage or service your ${VITE_OFFICIAL_NAME} account. These communications will not affect your direct marketing opt-out preferences.`,
        ],
      },
      {
        heading: '5. Managing Personal Information',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} takes reasonable steps to ensure the personal information it collects, uses, or discloses is accurate and stored securely, accessible only to authorized personnel.`,
          'We store personal data to provide our services, resolve disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, enforce agreements, and comply with applicable laws.',
          'We will delete or permanently anonymize personal information when it is no longer needed for the purposes allowed by the apps, including legal obligations.',
        ],
      },
      {
        heading: '6. Personal Information Security',
        paragraphs: [
          `You acknowledge that internet data transmission is not completely secure. ${VITE_OFFICIAL_NAME} cannot guarantee the security of any information you transmit. Transmission is at your own risk.`,
          `Once received, ${VITE_OFFICIAL_NAME} takes reasonable measures to protect your information from misuse, loss, or unauthorized access, modification, and disclosure, including password-protected systems and SSL technology.`,
          'By using our services, you consent to electronic communication about security, privacy, or account management matters.',
          'Employees, agents, and contractors must keep member information and transaction data confidential.',
          `Public postings on message boards or social media (e.g., Facebook, Twitter, chat rooms) are public, and ${VITE_OFFICIAL_NAME} cannot guarantee their security.`,
          'We take child protection seriously and do not accept information from minors to open gambling accounts. Parents or guardians are responsible for monitoring children’s internet use, including using internet filtering tools where appropriate.',
          'Always log out after using the site, especially if sharing a computer. You are responsible for the security and access of your devices. Keep your username, password, and account details confidential and use caution online.',
        ],
      },
      {
        heading: '7. Accessing Personal Information',
        paragraphs: [
          `You can access personal information collected by ${VITE_OFFICIAL_NAME} via the “Settings” link on the website or by contacting customer support.`,
          'We will provide access in the requested manner within a reasonable time if possible. If we cannot provide access as requested, we will try to accommodate you in other ways.',
          'Access may be refused if it unreasonably affects others’ privacy. In such cases, we will notify you in writing with reasons and available complaint mechanisms.',
        ],
      },
      {
        heading: '8. Deleting Personal Data',
        paragraphs: [
          `You may request deletion of your personal data if ${VITE_OFFICIAL_NAME} no longer has a legal reason to process or store it.`,
          `Note this right is not absolute—${VITE_OFFICIAL_NAME} must comply with legal obligations that require retention.`,
          'Requests can be made via website customer support.',
        ],
      },
      {
        heading: '9. Contact Information',
        paragraphs: [
          'For questions, access, correction requests, or complaints regarding your personal information, contact us via the website chat feature.',
        ],
      },
      {
        heading: '10. International Data Transfer',
        paragraphs: [
          'Information may be transferred, processed, and stored worldwide, including in countries with different data protection laws.',
          'We aim to protect your information according to applicable laws.',
        ],
      },
      {
        heading: '11. Legal Basis for Processing',
        paragraphs: [
          `Under the GDPR, ${VITE_OFFICIAL_NAME} processes personal information based on:`,
          '- Contractual necessity: To fulfill contracts with you or our customers.',
          `- Legitimate interests: To promote ${VITE_OFFICIAL_NAME}’s legitimate business interests, provided they do not override your rights.`,
          '- Consent: In some cases, processing is based on your consent.',
          '- Legal obligations: To comply with applicable laws.',
        ],
      },
      {
        heading: '12. Regulatory Authorities',
        paragraphs: [
          'If you are in the EEA and believe our processing of your personal data violates applicable law, you have the right to lodge a complaint with a regulatory authority.',
        ],
      },
      {
        heading: '13. Updating Privacy Policy',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} may review, revise, and update this Privacy Policy from time to time.`,
          'Changes take effect when posted. You should review this policy regularly and stay familiar with its terms.',
        ],
      },
    ],
  },
  'tl-PH': {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Pangkalahatang-ideya',
        paragraphs: [
          `Ito ang Privacy Policy ng Medium Rare N.V. (may-ari at operator ng ${VITE_OFFICIAL_NAME}). Ipinapaliwanag ng patakarang ito kung paano hinahandle ng ${VITE_OFFICIAL_NAME} ang iyong personal na impormasyon kapag naging miyembro ka ng ${VITE_OFFICIAL_NAME}, gumamit ng aming website, anumang pahina o site sa ilalim ng brand na “${VITE_OFFICIAL_NAME}” (kasama ang anumang mobile o tablet apps na pagmamay-ari o pinapatakbo namin), o nakipag-ugnayan sa amin.`,
          'Nakatuon kami sa pagprotekta ng iyong personal na datos at paggamit, pag-iimbak, at pagsisiwalat nito alinsunod sa mga batas sa privacy at sa patakarang ito.',
        ],
      },
      {
        heading: '1. Paggamit ng Website',
        paragraphs: [
          'Sa paggamit ng website, sumasang-ayon ka sa Privacy Policy na ito.',
          `Maaaring suriin at i-update ng ${VITE_OFFICIAL_NAME} ang patakarang ito nang regular at may karapatang gumawa ng pagbabago anumang oras. Epektibo agad ang mga update kapag nailathala sa website. Ang patuloy na paggamit mo ng site ay nangangahulugang pagtanggap sa mga pagbabagong ito.`,
          `Hindi naaangkop ang Privacy Policy na ito sa mga website na naka-link sa site na hindi kontrolado ng ${VITE_OFFICIAL_NAME}.`,
        ],
      },
      {
        heading: '2. Personal na Impormasyon',
        paragraphs: [
          `Mga uri ng personal na impormasyon na maaaring kolektahin ng ${VITE_OFFICIAL_NAME}:`,
          '• Pangalan',
          '• Email address',
          '• Ipinasa na mga preferences',
          '• Petsa ng kapanganakan',
          '• Bansa ng pagkamamamayan',
          '• Pisikal na address',
          '• ID number',
          '• Government-issued identification',
          '• Lokasyon',
          '• Impormasyon ng device',
          '• IP address',
          'Maaaring kolektahin ang impormasyong ito sa pamamagitan ng:',
          '• Data na inilagay sa panahon ng account registration',
          '• Komunikasyon sa aming mga customer',
        ],
      },
      {
        heading: '3. Layunin ng Pagkolekta',
        paragraphs: [
          `Kinokolekta ng ${VITE_OFFICIAL_NAME} ang iyong personal na impormasyon nang legal at patas para sa mga sumusunod na layunin bilang lisensyadong online gambling operator:`,
          '• Beripikahin ang iyong pagkakakilanlan (KYC)',
          '• Magpadala ng marketing communications kung nag-subscribe ka',
          `• Proseso ang iyong membership application para sa ${VITE_OFFICIAL_NAME} o anumang hosted subdomain`,
          '• Magbigay at pagbutihin ang serbisyo para sa miyembro',
          '• Tukuyin ang mga miyembro at beripikahin ang pagkakakilanlan upang matiyak ang seguridad at pagsunod sa batas',
          '• Panatilihin ang mga account ng miyembro',
          '• Pahusayin ang iyong website o phone experience, o i-tailor ang impormasyon, serbisyo, o produkto sa iyong pangangailangan, kabilang ang market research at promotions',
          `• Lumikha ng aggregated demographic data tungkol sa mga miyembro para sa stakeholders at upang mapabuti ang operasyon ng ${VITE_OFFICIAL_NAME}`,
          '• Ipaalam sa iyo ang mga produkto o serbisyo na maaaring interesado ka sa pamamagitan ng email, SMS, o telepono',
          '• Tumugon sa iyong mga katanungan, komento, o kahilingan',
          '• Tukuyin ang tax responsibilities para sa goods at services',
          `• Sumunod sa mga kontrata, batas, at legal obligations ng ${VITE_OFFICIAL_NAME}`,
          '• Gumawa ng angkop na aksyon kung may hinala ng seryosong ilegal na aktibidad o maling gawain kaugnay sa operasyon namin',
          '• Magtaguyod, mag-eksersisyo, o ipagtanggol ang legal claims',
          '• Pamahalaan ang mga job application',
          `Kung hindi mo ibibigay ang personal na impormasyon na hinihingi ng ${VITE_OFFICIAL_NAME}, maaaring hindi namin maproseso ang iyong membership application, maibigay ang serbisyo, o matugunan ang iyong mga katanungan o reklamo.`,
          `Sa paggamit ng ${VITE_OFFICIAL_NAME}, pagiging miyembro, o pagbibigay ng personal na impormasyon, pumapayag ka sa ${VITE_OFFICIAL_NAME} na kolektahin, gamitin, iproseso, at posibleng isiwalat ang iyong personal na impormasyon para sa mga layuning inilarawan sa itaas.`,
        ],
      },
      {
        heading: '4. Direct Marketing at Opt-Out',
        paragraphs: [
          `Maaaring gamitin ng ${VITE_OFFICIAL_NAME} ang iyong personal na impormasyon upang paminsan-minsan ibahagi ang mga produkto, serbisyo, o promotions na sa tingin namin ay maaaring interesado o makikinabang ka.`,
          'Maaari itong gawin sa pamamagitan ng email, SMS, telepono, o sulat.',
          `Kung ayaw mo nang makatanggap ng ${VITE_OFFICIAL_NAME} marketing o promotional materials, sa kabuuan o sa anumang anyo, maaari kang makipag-ugnayan sa amin anumang oras sa support@${VITE_OFFICIAL_NAME} upang mag-opt-out, at agad naming ipatutupad ito.`,
          `Maaaring kontakin ka rin paminsan-minsan upang pamahalaan o serbisyuhan ang iyong ${VITE_OFFICIAL_NAME} account. Ang mga komunikasyong ito ay hindi makakaapekto sa iyong direct marketing opt-out preferences.`,
        ],
      },
      {
        heading: '5. Pamamahala ng Personal na Impormasyon',
        paragraphs: [
          `Gumagawa ang ${VITE_OFFICIAL_NAME} ng makatwirang hakbang upang matiyak na ang personal na impormasyon na kinokolekta, ginagamit, o isiniwalat ay tama at ligtas na nakaimbak, at naa-access lamang ng awtorisadong tauhan.`,
          'Iniimbak namin ang personal na datos upang maibigay ang aming mga serbisyo, lutasin ang mga alitan, magtatag ng legal na depensa, magsagawa ng audit, itaguyod ang lehitimong layunin sa negosyo, ipatupad ang mga kasunduan, at sumunod sa naaangkop na batas.',
          'Babura o permanenteng ia-anonymize ang personal na impormasyon kapag hindi na ito kailangan para sa mga layuning pinapayagan ng apps, kabilang ang mga legal na obligasyon.',
        ],
      },
      {
        heading: '6. Seguridad ng Personal na Impormasyon',
        paragraphs: [
          `Kinukumpirma mo na ang internet data transmission ay hindi ganap na ligtas. Hindi maipapangako ng ${VITE_OFFICIAL_NAME} ang seguridad ng anumang impormasyong ipinapadala mo. Ang transmission ay nasa iyong sariling panganib.`,
          `Kapag natanggap na, gumagawa ang ${VITE_OFFICIAL_NAME} ng makatwirang hakbang upang protektahan ang iyong impormasyon mula sa maling paggamit, pagkawala, o hindi awtorisadong access, pagbabago, at pagsisiwalat, kabilang ang mga password-protected systems at SSL technology.`,
          'Sa paggamit ng aming serbisyo, pumapayag ka sa electronic communication tungkol sa seguridad, privacy, o account management matters.',
          'Dapat panatilihin ng mga empleyado, ahente, at kontratista ang pagiging kumpidensyal ng impormasyon ng miyembro at transaction data.',
          `Ang mga pampublikong post sa message boards o social media (hal. Facebook, Twitter, chat rooms) ay pampubliko, at hindi maipapangako ng ${VITE_OFFICIAL_NAME} ang kanilang seguridad.`,
          'Seryoso naming tinuturing ang proteksyon ng bata at hindi tumatanggap ng impormasyon mula sa mga menor de edad upang magbukas ng gambling accounts.',
          'Responsibilidad ng mga magulang o guardian ang pagmamanman sa paggamit ng internet ng mga bata, kabilang ang paggamit ng internet filtering tools kung naaangkop.',
          'Laging mag-log out pagkatapos gamitin ang site, lalo na kung nagbabahagi ng computer.',
          'Ikaw ang responsable sa seguridad at access ng iyong mga device. Panatilihin ang iyong username, password, at detalye ng account na kumpidensyal at maging maingat sa online na paggamit.',
        ],
      },
      {
        heading: '7. Pag-access sa Personal na Impormasyon',
        paragraphs: [
          `Maaari mong i-access ang personal na impormasyon na kinokolekta ng ${VITE_OFFICIAL_NAME} sa pamamagitan ng link na “Settings” sa website o sa pakikipag-ugnayan sa customer support.`,
          'Ibibigay namin ang access sa nais na paraan sa loob ng makatwirang panahon kung posible.',
          'Kung hindi namin maibigay ang access ayon sa kahilingan, susubukan naming tugunan ka sa ibang paraan.',
          'Maaaring tanggihan ang access kung ito ay hindi makatwirang nakakaapekto sa privacy ng iba. Sa ganitong kaso, ipapaalam namin sa iyo sa pamamagitan ng sulat kasama ang mga dahilan at mekanismo ng reklamo.',
        ],
      },
      {
        heading: '8. Pagtanggal ng Personal na Datos',
        paragraphs: [
          `Maaari kang humiling ng pagtanggal ng iyong personal na datos kung wala nang legal na dahilan ang ${VITE_OFFICIAL_NAME} upang iproseso o itago ito.`,
          `Tandaan na ang karapatang ito ay hindi ganap—dapat sumunod ang ${VITE_OFFICIAL_NAME} sa mga legal na obligasyon na nangangailangan ng retention.`,
          'Maaaring isumite ang kahilingan sa pamamagitan ng customer support ng website.',
        ],
      },
      {
        heading: '9. Impormasyon sa Pakikipag-ugnayan',
        paragraphs: [
          'Para sa mga katanungan, pag-access, kahilingan sa pagwawasto, o reklamo tungkol sa iyong personal na impormasyon, makipag-ugnayan sa amin sa pamamagitan ng website chat feature.',
        ],
      },
      {
        heading: '10. Pandaigdigang Paglipat ng Datos',
        paragraphs: [
          'Ang impormasyon ay maaaring ilipat, iproseso, at iimbak sa buong mundo, kabilang ang mga bansa na may iba\'t ibang batas sa proteksyon ng datos.',
          'Nilalayon naming protektahan ang iyong impormasyon alinsunod sa naaangkop na batas.',
        ],
      },
      {
        heading: '11. Legal na Batayan para sa Pagproseso',
        paragraphs: [
          `Sa ilalim ng GDPR, pinoproseso ng ${VITE_OFFICIAL_NAME} ang personal na impormasyon batay sa:`,
          '• Contractual necessity: Upang tuparin ang kontrata sa iyo o sa aming mga customer.',
          `• Legitimate interests: Upang itaguyod ang lehitimong interes ng negosyo ng ${VITE_OFFICIAL_NAME}, basta hindi nito nilalabag ang iyong mga karapatan.`,
          '• Consent: Sa ilang kaso, batay sa iyong pahintulot ang pagproseso.',
          '• Legal obligations: Upang sumunod sa naaangkop na batas.',
        ],
      },
      {
        heading: '12. Regulatory Authorities',
        paragraphs: [
          'Kung ikaw ay nasa EEA at naniniwala na ang pagproseso ng iyong personal na datos ay lumalabag sa naaangkop na batas, may karapatan kang maghain ng reklamo sa regulatory authority.',
        ],
      },
      {
        heading: '13. Pag-update ng Privacy Policy',
        paragraphs: [
          `Maaaring suriin, rebisihin, at i-update ng ${VITE_OFFICIAL_NAME} ang Privacy Policy na ito paminsan-minsan.`,
          'Epektibo ang mga pagbabago kapag nailathala.',
          'Dapat mong suriin ang patakarang ito nang regular at maging pamilyar sa mga nilalaman nito.',
        ],
      },
    ],
  },
  'pt-BR': {
    title: 'Política de Privacidade',
    sections: [
      {
        heading: 'Visão Geral',
        paragraphs: [
          `Esta é a Política de Privacidade da Medium Rare N.V. (proprietária e operadora da ${VITE_OFFICIAL_NAME}). Esta política explica como a ${VITE_OFFICIAL_NAME} lida com suas informações pessoais quando você se torna um membro da ${VITE_OFFICIAL_NAME}, usa nosso site, quaisquer páginas ou sites sob a marca “${VITE_OFFICIAL_NAME}” (incluindo quaisquer aplicativos móveis ou para tablets que possuímos ou operamos) ou interage conosco.`,
          'Estamos comprometidos em proteger seus dados pessoais e usá-los, armazená-los e divulgá-los de acordo com as leis de privacidade e esta política.',
        ],
      },
      {
        heading: '1. Uso do Site',
        paragraphs: [
          'Ao usar o site, você concorda com esta Política de Privacidade.',
          `A ${VITE_OFFICIAL_NAME} pode revisar e atualizar esta política regularmente e reserva-se o direito de fazer alterações a qualquer momento. As atualizações entram em vigor imediatamente após serem publicadas no site. Seu uso contínuo do site constitui aceitação dessas alterações.`,
          `Esta Política de Privacidade não se aplica a sites vinculados ao site que a ${VITE_OFFICIAL_NAME} não controla.`,
        ],
      },
      {
        heading: '2. Informações Pessoais',
        paragraphs: [
          `Os tipos de informações pessoais que a ${VITE_OFFICIAL_NAME} pode coletar incluem:`,
          '• Nome',
          '• Endereço de e-mail',
          '• Preferências enviadas',
          '• Data de nascimento',
          '• País de cidadania',
          '• Endereço físico',
          '• Número de identificação',
          '• Documento de identificação emitido pelo governo',
          '• Dados de localização',
          '• Informações do dispositivo',
          '• Endereço IP',
          'Podemos coletar essas informações por meio de:',
          '• Dados inseridos durante o cadastro da conta',
          '• Comunicação com nossos clientes',
        ],
      },
      {
        heading: '3. Finalidade da Coleta',
        paragraphs: [
          `A ${VITE_OFFICIAL_NAME} coleta suas informações pessoais de forma lícita e justa para as seguintes finalidades, como operadora de jogos de azar online licenciada:`,
          '• Verificar sua identidade (KYC)',
          '• Enviar comunicações de marketing, caso você se inscreva',
          `• Processar sua solicitação de associação à ${VITE_OFFICIAL_NAME} ou a qualquer subdomínio hospedado`,
          '• Fornecer e aprimorar os serviços aos membros',
          '• Identificar membros e verificar a identidade para garantir a segurança e a conformidade legal',
          '• Manter contas de membros',
          '• Aprimorar sua experiência no site ou por telefone, ou personalizar informações, serviços ou produtos de acordo com suas necessidades, incluindo pesquisas de mercado e promoções',
          `• Criar dados demográficos agregados sobre os membros para as partes interessadas e para aprimorar as operações da ${VITE_OFFICIAL_NAME}`,
          '• Notificar você sobre produtos ou serviços que possam ser do seu interesse por e-mail, SMS ou telefone',
          '• Responder às suas perguntas, comentários ou solicitações',
          '• Determinar as obrigações tributárias sobre bens e serviços',
          `• Cumprir os contratos, leis e obrigações legais da ${VITE_OFFICIAL_NAME}`,
          '• Tomar as medidas cabíveis caso suspeitemos de atividades ilegais graves ou conduta imprópria relacionada às nossas operações',
          '• Estabelecer, exercer ou defender direitos legais',
          '• Gerenciar candidaturas a vagas de emprego',
          `Caso você não forneça as informações pessoais solicitadas pela ${VITE_OFFICIAL_NAME}, talvez não possamos processar sua solicitação de adesão, prestar serviços ou responder às suas dúvidas ou reclamações.`,
          `Ao usar o ${VITE_OFFICIAL_NAME}, tornar-se membro ou fornecer informações pessoais, você concorda que o ${VITE_OFFICIAL_NAME} colete, use, processe e possivelmente divulgue suas informações pessoais para os fins descritos acima.`,
        ],
      },
      {
        heading: '4. Marketing Direto e Opção de Cancelamento',
        paragraphs: [
          'Podemos usar suas informações pessoais para compartilhar periodicamente produtos, serviços ou promoções que acreditamos que possam lhe interessar ou beneficiar. Isso pode ser feito por e-mail, SMS, telefone ou correio.',
          `Se você não deseja mais receber materiais de marketing ou promocionais do ${VITE_OFFICIAL_NAME}, integralmente ou em qualquer formato, entre em contato conosco a qualquer momento pelo endereço support@${VITE_OFFICIAL_NAME}.com para cancelar o recebimento, e atenderemos prontamente à sua solicitação.`,
          `Também podemos entrar em contato com você ocasionalmente para gerenciar ou prestar serviços à sua conta ${VITE_OFFICIAL_NAME}. Essas comunicações não afetarão suas preferências de cancelamento de marketing direto.`,
        ],
      },
      {
        heading: '5. Gerenciamento de Informações Pessoais',
        paragraphs: [
          `O ${VITE_OFFICIAL_NAME} toma medidas razoáveis para garantir que as informações pessoais que coleta, usa ou divulga sejam precisas e armazenadas com segurança, acessíveis apenas a pessoal autorizado.`,
          'Armazenamos dados pessoais para fornecer nossos serviços, resolver disputas, estabelecer defesas legais, realizar auditorias, buscar objetivos comerciais legítimos, fazer cumprir contratos e cumprir as leis aplicáveis.',
          'Excluiremos ou anonimizaremos permanentemente as informações pessoais quando elas não forem mais necessárias para os fins permitidos pelos aplicativos, incluindo obrigações legais.',
        ],
      },
      {
        heading: '6. Segurança das Informações Pessoais',
        paragraphs: [
          `Você reconhece que a transmissão de dados pela internet não é completamente segura. A ${VITE_OFFICIAL_NAME} não pode garantir a segurança de nenhuma informação que você transmita. A transmissão é por sua conta e risco.`,
          `Após o recebimento, a ${VITE_OFFICIAL_NAME} toma medidas razoáveis para proteger suas informações contra uso indevido, perda ou acesso, modificação e divulgação não autorizados, incluindo sistemas protegidos por senha e tecnologia SSL.`,
          'Ao usar nossos serviços, você concorda com a comunicação eletrônica sobre assuntos de segurança, privacidade ou gerenciamento de conta.',
          'Funcionários, agentes e contratados devem manter as informações dos membros e os dados de transação confidenciais.',
          `Postagens públicas em fóruns de mensagens ou mídias sociais (por exemplo, Facebook, Twitter, salas de bate-papo) são públicas, e a ${VITE_OFFICIAL_NAME} não pode garantir sua segurança.`,
          'Levamos a proteção infantil a sério e não aceitamos informações de menores para abrir contas de jogos de azar. Os pais ou responsáveis são responsáveis por monitorar o uso da internet pelas crianças, incluindo o uso de ferramentas de filtragem da internet quando apropriado.',
          'Sempre faça logout após usar o site, especialmente se estiver compartilhando um computador. Você é responsável pela segurança e pelo acesso aos seus dispositivos. Mantenha seu nome de usuário, senha e dados da conta em sigilo e tenha cautela ao navegar na internet.',
        ],
      },
      {
        heading: '7. Acesso a Informações Pessoais',
        paragraphs: [
          `Você pode acessar as informações pessoais coletadas pela ${VITE_OFFICIAL_NAME} através do link “Configurações” no site ou entrando em contato com o suporte ao cliente.`,
          'Forneceremos o acesso da maneira solicitada dentro de um prazo razoável, se possível.',
          'Caso não possamos fornecer o acesso conforme solicitado, tentaremos atendê-lo de outras maneiras.',
          'O acesso poderá ser negado se afetar indevidamente a privacidade de terceiros. Nesses casos, notificaremos você por escrito, informando os motivos e os mecanismos de reclamação disponíveis.',
        ],
      },
      {
        heading: '8. Exclusão de Dados Pessoais',
        paragraphs: [
          `Você pode solicitar a exclusão de seus dados pessoais caso a ${VITE_OFFICIAL_NAME} não tenha mais uma base legal para processá-los ou armazená-los.`,
          `Observe que esse direito não é absoluto — a ${VITE_OFFICIAL_NAME} deve cumprir obrigações legais que exigem a retenção dos dados.`,
          'As solicitações podem ser feitas através do suporte ao cliente no site.',
        ],
      },
      {
        heading: '9. Informações de Contato',
        paragraphs: [
          'Para dúvidas, solicitações de acesso, correção ou reclamações referentes às suas informações pessoais, entre em contato conosco através do chat do site.',
        ],
      },
      {
        heading: '10. Transferência Internacional de Dados',
        paragraphs: [
          'As informações podem ser transferidas, processadas e armazenadas em todo o mundo, inclusive em países com leis de proteção de dados diferentes.',
          'Nosso objetivo é proteger suas informações de acordo com as leis aplicáveis.',
        ],
      },
      {
        heading: '11. Fundamento Jurídico para o Processamento',
        paragraphs: [
          `De acordo com o RGPD, a ${VITE_OFFICIAL_NAME} processa informações pessoais com base em:`,
          '• Necessidade contratual: Para cumprir contratos com você ou com nossos clientes.',
          `• Interesses legítimos: Para promover os interesses comerciais legítimos da ${VITE_OFFICIAL_NAME}, desde que não se sobreponham aos seus direitos.`,
          '• Consentimento: Em alguns casos, o processamento é baseado no seu consentimento.',
          '• Obrigações legais: Para cumprir as leis aplicáveis.',
        ],
      },
      {
        heading: '12. Autoridades Reguladoras',
        paragraphs: [
          'Se você reside no EEE e acredita que o nosso processamento dos seus dados pessoais viola a legislação aplicável, você tem o direito de apresentar uma reclamação a uma autoridade reguladora.',
        ],
      },
      {
        heading: '13. Atualização da Política de Privacidade',
        paragraphs: [
          `A ${VITE_OFFICIAL_NAME} poderá revisar, alterar e atualizar esta Política de Privacidade periodicamente.`,
          'As alterações entram em vigor assim que forem publicadas.',
          'Você deve revisar esta política regularmente e manter-se familiarizado com seus termos.',
        ],
      },
    ],
  },
  'zh-CN': {
    title: '隐私政策',
    sections: [
      {
        heading: '简介',
        paragraphs: [
          `这是 Medium Rare N.V.（${VITE_OFFICIAL_NAME} 的所有者和运营商）的隐私政策。`,
          `本隐私政策规定了 ${VITE_OFFICIAL_NAME} 在您成为 ${VITE_OFFICIAL_NAME} 会员、使用我们的网站及“${VITE_OFFICIAL_NAME}”品牌下的任何页面或网站（包括我们拥有和/或运营的移动/平板应用）或与我们交互时如何管理您的个人信息。`,
          '我们致力于确保关于您的个人信息受到保护，并依据隐私法与本隐私政策进行使用、存储与披露。',
        ],
      },
      {
        heading: '1. 网站使用',
        paragraphs: [
          '使用网站即表示您同意受本隐私政策的条款约束。',
          `${VITE_OFFICIAL_NAME} 可能会定期审核并通过在网站上发布更新来变更本政策，变更自发布起立即生效。`,
          '您继续使用网站即表示您接受这些变更。',
          `本隐私政策不适用于与网站链接且 ${VITE_OFFICIAL_NAME} 无法控制的第三方网站。`,
        ],
      },
      {
        heading: '2. 个人信息',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} 可能从您收集的个人信息类型包括：`,
          '- 姓名',
          '- 电子邮件地址',
          '- 个人提交的偏好',
          '- 出生日期',
          '- 公民身份国家',
          '- 实际地址',
          '- 身份证号码',
          '- 政府颁发的身份证明',
          '- 位置数据',
          '- 设备信息',
          '- IP 地址',
          '我们通过以下方式收集或可能收集到这些信息：',
          '- 在账户注册过程中输入的数据',
          '- 与客户的通信',
        ],
      },
      {
        heading: '3. 收集目的',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} 将以合法与公平的方式，仅为以下目的收集您的个人信息，以作为持牌在线博彩公司开展运营：`,
          '- 了解并核验您的身份（KYC）。',
          `- 如您选择订阅，向您发送 ${VITE_OFFICIAL_NAME} 的营销通信。`,
          `- 处理您成为 ${VITE_OFFICIAL_NAME} 会员或任何托管子域的申请。`,
          '- 为您（作为会员）提供与改进服务。',
          '- 识别会员并验证身份，以确保安全并遵守法定义务。',
          '- 维护您的会员账户。',
          '- 升级与改进您在网站或电话中的体验，或为满足您的需求定制/开发信息、服务或产品（可能包括市场研究与促销活动）。',
          `- 通过人口统计分析数据库创建关于会员的聚合数据，以提供给潜在与现有的利益相关者，并提升 ${VITE_OFFICIAL_NAME} 的运营效率。`,
          '- 通过电子邮件、短信或电话告知我们认为您可能感兴趣的产品或服务。',
          '- 回答您的问题、评论或请求。',
          '- 确定商品和服务税及其他适用税收的责任。',
          `- 遵守 ${VITE_OFFICIAL_NAME} 的合同、法律与法定义务。`,
          '- 如有理由怀疑与我们职能和活动相关的严重违法或不端行为已发生、正在发生或可能发生，采取适当行动。',
          '- 建立、行使或捍卫任何法律权利主张。',
          '- 管理工作申请。',
          `若您不提供 ${VITE_OFFICIAL_NAME} 要求的个人信息，我们可能无法处理入会申请、提供服务或回应您的查询/投诉。`,
          `使用 ${VITE_OFFICIAL_NAME}、成为会员或以其他方式提供个人信息，即表示您同意 ${VITE_OFFICIAL_NAME} 基于本隐私政策为上述目的收集、使用、处理并可能披露您的个人信息。`,
        ],
      },
      {
        heading: '4. 直接营销和选择退出',
        paragraphs: [
          '我们可能定期使用您的个人信息向您介绍可能感兴趣或有益的产品、服务或促销活动（通过电子邮件、短信、电话或邮件）。',
          `如您不再希望完全或以任何形式接收 ${VITE_OFFICIAL_NAME} 的营销或促销材料，可随时发送邮件至 support@${VITE_OFFICIAL_NAME} 提出选择退出请求，我们将尽快遵守。`,
          `我们亦可能不时为管理与处理您的 ${VITE_OFFICIAL_NAME} 账户而与您联系，此类通信不影响您对直接营销的选择退出状态。`,
        ],
      },
      {
        heading: '5. 个人信息的管理',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} 将采取一切合理措施，确保其收集、使用或披露的个人信息准确并安全存储，且仅供授权人员访问。`,
          '我们按本隐私政策所述存储个人信息，用于提供服务、解决纠纷、建立法律防御、进行审计、追求合法业务目的、履行协议以及遵守适用法律要求。',
        ],
      },
      {
        heading: '6. 个人信息的安全',
        paragraphs: [
          `您承认通过互联网进行的数据传输并非完全安全，${VITE_OFFICIAL_NAME} 不保证或担保您传输信息的安全性，传输风险由您自行承担。`,
          `一旦接收您的信息，${VITE_OFFICIAL_NAME} 将采取合理措施保护其免遭滥用、丢失及未经授权的访问、修改与披露，包括使用受密码保护的系统/数据库与 SSL 技术。`,
          '通过使用我们的服务或向我们提供个人信息，您同意我们可就安全、隐私与账户管理相关事项以电子方式与您沟通。',
          `${VITE_OFFICIAL_NAME} 的雇员、代理与承包商必须对会员个人信息与交易数据保密。`,
          `在公告板发布的信息或在社交媒体环境（如 Facebook、Twitter、聊天室）中的通信为公开信息，${VITE_OFFICIAL_NAME} 无法保证此类披露信息的安全性。`,
          '我们严格履行排除儿童使用服务的责任，不会接受未成年人信息用于开设博彩账户；父母或监护人应负责监控未成年人的上网活动（必要时使用互联网过滤软件）。',
          '请在使用网站后始终注销账户，尤以与他人共享电脑时为要；您对用于访问网站的设备安全与访问负责，并应妥善保管用户名、密码及账户信息并谨慎上网。',
        ],
      },
      {
        heading: '7. 访问个人信息',
        paragraphs: [
          `您可通过网站“设置”链接或联系网站客服访问 ${VITE_OFFICIAL_NAME} 收集的您的个人信息。`,
          '在可能且合理的时间内，我们将按照您请求的方式提供访问；若无法依请求方式提供，我们将尽力以其他方式满足。',
          '在访问可能对他人隐私造成不合理影响等情形下，访问请求可被拒绝；若因上述原因拒绝，我们将以书面形式告知拒绝理由及可用的投诉机制。',
        ],
      },
      {
        heading: '8. 删除个人数据',
        paragraphs: [
          `如 ${VITE_OFFICIAL_NAME} 不再具有继续处理或存储您的个人数据的法律依据，您可要求删除。`,
          `该权利并非绝对；若受法律义务要求需保留数据，${VITE_OFFICIAL_NAME} 可能无法满足您的删除请求。`,
          '您可通过联系网站客服提出删除请求。',
        ],
      },
      {
        heading: '9. 联系方式',
        paragraphs: [
          '如对处理您的个人信息有任何疑问、访问或更正请求或投诉，请通过网站聊天功能与我们联系。',
        ],
      },
      {
        heading: '10. 国际数据传输',
        paragraphs: [
          '我们处理的信息可能在全球范围内传输、处理与存储（包括数据保护法律与您所在法域不同的国家/地区）。',
          '我们将尽力按照适用法律要求保护您的信息。',
        ],
      },
      {
        heading: '11. 处理的法律基础',
        paragraphs: [
          `根据《通用数据保护条例》（GDPR），${VITE_OFFICIAL_NAME} 处理您的个人信息的法律基础包括：`,
          '- 合同履行：为履行与您或我们客户的合同所必需；',
          `- 正当利益：为促进 ${VITE_OFFICIAL_NAME} 的正当商业利益，且不凌驾于您的利益或基本权利与自由之上；`,
          '- 同意：在某些情况下基于您的同意进行处理；',
          '- 遵守法律义务：为遵守适用法律所必需。',
        ],
      },
      {
        heading: '12. 监管机构',
        paragraphs: [
          '若您位于欧洲经济区（EEA），并认为我们对您个人信息的处理违反适用法律，您有权向监管机构提出投诉。',
        ],
      },
      {
        heading: '13. 更新隐私政策',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} 可能不时审查、变更并更新本隐私政策，以反映当前实践与义务。`,
          '变更自发布时起生效；建议您定期查阅并熟悉本政策条款。',
        ],
      },
    ],
  },
  'ko-KR': {
    title: '개인정보 처리방침 (Privacy Policy)',
    sections: [
      {
        heading: '개요',
        paragraphs: [
          `본 개인정보 처리방침은 Medium Rare N.V.(${VITE_OFFICIAL_NAME}의 소유자 및 운영자)의 개인정보 처리방침입니다.`,
          `본 방침은 회원이 ${VITE_OFFICIAL_NAME}에 가입하거나, 당사 웹사이트, “${VITE_OFFICIAL_NAME}” 브랜드 하의 모든 페이지 또는 사이트(당사가 소유하거나 운영하는 모바일/태블릿 앱 포함)를 이용하거나, 당사와 상호작용할 때 ${VITE_OFFICIAL_NAME}가 귀하의 개인정보를 어떻게 처리하는지 설명합니다.`,
          '당사는 개인정보 보호법 및 본 방침에 따라 귀하의 개인정보를 보호하고 사용, 저장, 공개하는 데 최선을 다합니다.',
        ],
      },
      {
        heading: '1. 웹사이트 이용',
        paragraphs: [
          '웹사이트를 이용함으로써 귀하는 본 개인정보 처리방침에 동의하는 것으로 간주됩니다.',
          `${VITE_OFFICIAL_NAME}는 본 방침을 정기적으로 검토 및 업데이트할 수 있으며, 언제든지 변경할 권리를 보유합니다.`,
          '업데이트는 웹사이트에 게시되는 즉시 효력이 발생합니다.',
          '사이트를 계속 이용하는 것은 이러한 변경 사항에 대한 동의로 간주됩니다.',
          `본 개인정보 처리방침은 ${VITE_OFFICIAL_NAME}가 통제하지 않는 링크된 웹사이트에는 적용되지 않습니다.`,
        ],
      },
      {
        heading: '2. 개인정보',
        paragraphs: [
          `${VITE_OFFICIAL_NAME}가 수집할 수 있는 개인정보의 유형은 다음과 같습니다:`,
          '• 이름',
          '• 이메일 주소',
          '• 제출된 선호 정보',
          '• 생년월일',
          '• 국적',
          '• 실제 주소',
          '• 신분증 번호',
          '• 정부 발급 신분증',
          '• 위치 데이터',
          '• 장치 정보',
          '• IP 주소',
          '다음과 같은 방법으로 정보를 수집할 수 있습니다:',
          '• 계정 등록 시 입력된 데이터',
          '• 고객과의 커뮤니케이션',
        ],
      },
      {
        heading: '3. 수집 목적',
        paragraphs: [
          `${VITE_OFFICIAL_NAME}는 합법적이고 공정한 방법으로 다음과 같은 목적으로 귀하의 개인정보를 수집합니다(온라인 도박 사업자로서 라이선스 보유):`,
          '• 신원 확인(KYC)',
          '• 구독 시 마케팅 커뮤니케이션 발송',
          `• ${VITE_OFFICIAL_NAME} 또는 호스팅되는 서브도메인 회원 신청 처리`,
          '• 회원 서비스 제공 및 개선',
          '• 회원 식별 및 신원 확인을 통해 보안 및 법적 준수 보장',
          '• 회원 계정 관리',
          '• 웹사이트 또는 모바일 경험 개선, 정보·서비스·제품 맞춤 제공, 시장 조사 및 프로모션 포함',
          `• 이해관계자를 위한 회원 집계 인구통계 데이터 생성 및 ${VITE_OFFICIAL_NAME} 운영 개선`,
          '• 이메일, SMS, 전화 등을 통해 관심 있을 수 있는 상품/서비스 안내',
          '• 질문, 의견, 요청에 응답',
          '• 상품 및 서비스 관련 세금 책임 결정',
          `• ${VITE_OFFICIAL_NAME} 계약, 법률 및 법적 의무 준수`,
          '• 운영과 관련된 중대한 불법 활동 또는 위법 행위가 의심될 경우 적절한 조치 수행',
          '• 법적 청구권 설정, 행사 또는 방어',
          '• 채용 신청 관리',
          `${VITE_OFFICIAL_NAME}가 요청한 개인정보를 제공하지 않으면 회원 신청 처리, 서비스 제공, 문의 또는 불만 처리에 제한이 있을 수 있습니다.`,
          `${VITE_OFFICIAL_NAME}를 이용하거나 회원이 되거나 개인정보를 제공함으로써, 귀하는 위에서 설명한 목적을 위해 ${VITE_OFFICIAL_NAME}가 귀하의 개인정보를 수집, 사용, 처리 및 공개할 수 있음에 동의하게 됩니다.`,
        ],
      },
      {
        heading: '4. 직접 마케팅 및 수신거부(Opt-Out)',
        paragraphs: [
          '당사는 귀하에게 관심이나 유용할 수 있는 제품, 서비스 또는 프로모션을 주기적으로 공유하기 위해 개인정보를 사용할 수 있습니다.',
          '이는 이메일, SMS, 전화, 우편을 통해 이루어질 수 있습니다.',
          `더 이상 ${VITE_OFFICIAL_NAME}의 마케팅 또는 프로모션 자료를 수신하고 싶지 않은 경우, support@${VITE_OFFICIAL_NAME}로 언제든지 연락하여 수신거부를 요청할 수 있으며, 당사는 신속히 처리합니다.`,
          `또한, ${VITE_OFFICIAL_NAME} 계정 관리 또는 서비스 제공을 위해 가끔 연락할 수 있습니다.`,
          '이러한 연락은 직접 마케팅 수신거부 설정에 영향을 미치지 않습니다.',
        ],
      },
      {
        heading: '5. 개인정보 관리 (Managing Personal Information)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME}는 수집, 사용 또는 공개하는 개인정보가 정확하며 안전하게 저장되고 권한 있는 직원만 접근할 수 있도록 합리적인 조치를 취합니다.`,
          '당사는 서비스를 제공하고, 분쟁을 해결하며, 법적 방어를 구축하고, 감사를 수행하고, 정당한 사업 목적을 추구하며, 계약을 이행하고, 적용 가능한 법률을 준수하기 위해 개인정보를 저장합니다.',
          '앱에서 허용된 목적(법적 의무 포함)에 더 이상 필요하지 않은 개인정보는 삭제하거나 영구적으로 익명화합니다.',
        ],
      },
      {
        heading: '6. 개인정보 보안 (Personal Information Security)',
        paragraphs: [
          '귀하는 인터넷 데이터 전송이 완전히 안전하지 않다는 점을 인정합니다.',
          `${VITE_OFFICIAL_NAME}는 귀하가 전송하는 정보의 보안을 보장할 수 없으며, 전송은 귀하의 책임 하에 이루어집니다.`,
          `일단 수신된 정보에 대해서는, ${VITE_OFFICIAL_NAME}는 비밀번호 보호 시스템 및 SSL 기술을 포함하여 정보 오용, 분실, 무단 접근, 수정, 공개로부터 보호하기 위한 합리적인 조치를 취합니다.`,
          '당사의 서비스를 이용함으로써 귀하는 보안, 개인정보 또는 계정 관리 관련 전자 커뮤니케이션에 동의하게 됩니다.',
          '직원, 대리인 및 계약자는 회원 정보와 거래 데이터를 비밀로 유지해야 합니다.',
          `게시판이나 소셜 미디어(예: Facebook, Twitter, 채팅방)에 게시된 내용은 공개 정보이며, ${VITE_OFFICIAL_NAME}는 보안을 보장할 수 없습니다.`,
          '당사는 아동 보호를 중요하게 여기며, 미성년자의 도박 계정 개설 정보를 수락하지 않습니다.',
          '부모 또는 보호자는 인터넷 필터링 도구 사용 등 아동의 인터넷 사용을 모니터링할 책임이 있습니다.',
          '특히 공용 컴퓨터를 사용할 경우, 사이트 이용 후 반드시 로그아웃하십시오.',
          '장치의 보안과 접근은 귀하의 책임입니다.',
          '사용자 이름, 비밀번호 및 계정 정보를 비밀로 유지하고 온라인에서 주의하여 사용하십시오.',
        ],
      },
      {
        heading: '7. 개인정보 접근 (Accessing Personal Information)',
        paragraphs: [
          `귀하는 웹사이트의 “설정” 링크를 통해 또는 고객 지원팀에 연락하여 ${VITE_OFFICIAL_NAME}가 수집한 개인정보에 접근할 수 있습니다.`,
          '요청된 방식으로 합리적인 시간 내에 접근을 제공하며, 요청대로 제공할 수 없는 경우 다른 방법으로 지원하려고 합니다.',
          '다른 사람의 개인정보에 부당한 영향을 미치는 경우 접근이 거부될 수 있으며, 이러한 경우 사유와 가능한 불만 처리 절차를 서면으로 통지합니다.',
        ],
      },
      {
        heading: '8. 개인정보 삭제 (Deleting Personal Data)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME}가 더 이상 법적 사유 없이 개인정보를 처리하거나 저장할 필요가 없는 경우, 귀하는 개인정보 삭제를 요청할 수 있습니다.`,
          `다만, 이 권리는 절대적이지 않으며, ${VITE_OFFICIAL_NAME}는 보존이 요구되는 법적 의무를 준수해야 합니다.`,
          '요청은 웹사이트 고객 지원을 통해 할 수 있습니다.',
        ],
      },
      {
        heading: '9. 연락처 정보 (Contact Information)',
        paragraphs: [
          '귀하의 개인정보와 관련한 질문, 접근, 수정 요청 또는 불만 사항은 웹사이트 채팅 기능을 통해 문의하시기 바랍니다.',
        ],
      },
      {
        heading: '10. 국제 데이터 전송 (International Data Transfer)',
        paragraphs: [
          '정보는 전 세계적으로 전송, 처리, 저장될 수 있으며, 데이터 보호 법률이 다른 국가에서도 이루어질 수 있습니다.',
          '당사는 적용 가능한 법률에 따라 귀하의 정보를 보호하기 위해 노력합니다.',
        ],
      },
      {
        heading: '11. 개인정보 처리의 법적 근거 (Legal Basis for Processing)',
        paragraphs: [
          `GDPR에 따라, ${VITE_OFFICIAL_NAME}는 다음을 근거로 개인정보를 처리합니다:`,
          '• 계약 필요성: 귀하 또는 고객과의 계약 이행',
          `• 정당한 이익: 귀하의 권리를 침해하지 않는 범위 내에서 ${VITE_OFFICIAL_NAME}의 정당한 사업 이익 추구`,
          '• 동의: 일부 경우 처리에 대해 귀하의 동의 기반',
          '• 법적 의무: 적용 법률 준수',
        ],
      },
      {
        heading: '12. 규제 기관 (Regulatory Authorities)',
        paragraphs: [
          `귀하가 EEA(유럽경제지역) 내 거주하며 ${VITE_OFFICIAL_NAME}의 개인정보 처리 방식이 적용 법률을 위반한다고 판단하는 경우, 규제 기관에 불만을 제기할 권리가 있습니다.`,
        ],
      },
      {
        heading: '13. 개인정보 처리방침 업데이트 (Updating Privacy Policy)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME}는 본 개인정보 처리방침을 수시로 검토, 수정 및 업데이트할 수 있습니다.`,
          '변경 사항은 게시 시 효력을 발생하며, 귀하는 이 방침을 정기적으로 검토하고 내용을 숙지해야 합니다.',
        ],
      },
    ],
  },
  'hi-IN': {
    title: 'गोपनीयता नीति (Privacy Policy)',
    sections: [
      {
        heading: 'परिचय',
        paragraphs: [
          `यह Medium Rare N.V. (${VITE_OFFICIAL_NAME} का मालिक और ऑपरेटर) की गोपनीयता नीति है।`,
          `यह नीति समझाती है कि जब आप ${VITE_OFFICIAL_NAME} के सदस्य बनते हैं, हमारी वेबसाइट या “${VITE_OFFICIAL_NAME}” ब्रांड के अंतर्गत किसी भी पृष्ठ/साइट (हमारे द्वारा संचालित मोबाइल/टैबलेट ऐप्स सहित) का उपयोग करते हैं, या हमसे संपर्क करते हैं, तब ${VITE_OFFICIAL_NAME} आपके व्यक्तिगत डेटा को कैसे संभालता है।`,
          'हम आपके व्यक्तिगत डेटा की सुरक्षा के प्रति प्रतिबद्ध हैं और इसे गोपनीयता कानूनों तथा इस नीति के अनुसार उपयोग, संग्रह और प्रकट करते हैं।',
        ],
      },
      {
        heading: '1. वेबसाइट का उपयोग (Website Use)',
        paragraphs: [
          'वेबसाइट का उपयोग करके, आप इस गोपनीयता नीति से सहमत होते हैं।',
          `${VITE_OFFICIAL_NAME} इस नीति की नियमित समीक्षा और अद्यतन कर सकता है तथा किसी भी समय परिवर्तन करने का अधिकार सुरक्षित रखता है।`,
          'अद्यतन वेबसाइट पर पोस्ट होते ही तुरंत प्रभावी हो जाते हैं।',
          'साइट का आपका निरंतर उपयोग इन परिवर्तनों की स्वीकृति माना जाएगा।',
          `यह गोपनीयता नीति उन लिंक्ड वेबसाइटों पर लागू नहीं होती जिन्हें ${VITE_OFFICIAL_NAME} नियंत्रित नहीं करता।`,
        ],
      },
      {
        heading: '2. व्यक्तिगत जानकारी (Personal Information)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} द्वारा एकत्र की जाने वाली व्यक्तिगत जानकारी के प्रकार में शामिल हो सकते हैं:`,
          '• नाम',
          '• ईमेल पता',
          '• सबमिट की गई प्राथमिकताएँ',
          '• जन्म तिथि',
          '• नागरिकता का देश',
          '• भौतिक पता',
          '• आईडी नंबर',
          '• सरकार द्वारा जारी पहचान पत्र',
          '• स्थान डेटा',
          '• डिवाइस जानकारी',
          '• आईपी पता',
          'हम यह जानकारी निम्न माध्यमों से एकत्र कर सकते हैं:',
          '• खाता पंजीकरण के दौरान दर्ज किया गया डेटा',
          '• हमारे ग्राहकों के साथ संचार',
        ],
      },
      {
        heading: '3. संग्रह का उद्देश्य (Purpose of Collection)',
        paragraphs: [
          `एक लाइसेंस प्राप्त ऑनलाइन गेमिंग ऑपरेटर के रूप में, ${VITE_OFFICIAL_NAME} आपकी व्यक्तिगत जानकारी निम्न विधिक और उचित उद्देश्यों के लिए एकत्र करता है:`,
          '• आपकी पहचान सत्यापित करना (KYC)',
          '• यदि आपने सदस्यता ली है, तो विपणन संचार भेजना',
          `• ${VITE_OFFICIAL_NAME} या किसी होस्टेड सबडोमेन के लिए आपकी सदस्यता आवेदन प्रक्रिया`,
          '• सदस्य सेवाएँ प्रदान करना और सुधारना',
          '• सुरक्षा और कानूनी अनुपालन सुनिश्चित करने के लिए सदस्यों की पहचान और सत्यापन',
          '• सदस्य खाते बनाए रखना',
          '• आपकी वेबसाइट या फोन अनुभव को बेहतर बनाना, या आपकी आवश्यकताओं के अनुसार जानकारी/सेवाएँ/उत्पाद अनुकूलित करना (मार्केट रिसर्च और प्रचार सहित)',
          `• हितधारकों के लिए सदस्यों के बारे में सांख्यिकीय/समष्टिगत डेटा तैयार करना और ${VITE_OFFICIAL_NAME} के संचालन में सुधार करना`,
          '• आपको ईमेल, SMS या फोन के माध्यम से संभावित रुचिकर उत्पादों/सेवाओं के बारे में सूचित करना',
          '• आपके सवालों, टिप्पणियों या अनुरोधों का जवाब देना',
          '• वस्तुओं और सेवाओं के लिए कर दायित्व निर्धारित करना',
          `• ${VITE_OFFICIAL_NAME} के अनुबंधों, कानूनों और कानूनी दायित्वों का पालन करना`,
          '• संचालन से संबंधित गंभीर अवैध गतिविधि या कदाचार का संदेह होने पर उचित कार्रवाई करना',
          '• कानूनी दावे स्थापित करना, उनका प्रयोग करना या उनका बचाव करना',
          '• नौकरी आवेदन प्रबंधित करना',
          'यदि आप अनुरोधित व्यक्तिगत जानकारी प्रदान नहीं करते, तो हम आपकी सदस्यता आवेदन प्रक्रिया को पूरा करने, सेवाएँ प्रदान करने, या आपके प्रश्नों/शिकायतों का उत्तर देने में सक्षम न हो सकते हैं।',
          `${VITE_OFFICIAL_NAME} का उपयोग करके, सदस्य बनकर या व्यक्तिगत जानकारी प्रदान करके, आप सहमति देते हैं कि ${VITE_OFFICIAL_NAME} उपर्युक्त उद्देश्यों के लिए आपके व्यक्तिगत डेटा को एकत्र, उपयोग, संसाधित और संभवतः प्रकट कर सकता है।`,
        ],
      },
      {
        heading: '4. प्रत्यक्ष विपणन और ऑप्ट-आउट (Direct Marketing & Opt-Out)',
        paragraphs: [
          'हम समय-समय पर ऐसे उत्पाद, सेवाएँ या प्रचार साझा करने के लिए आपके डेटा का उपयोग कर सकते हैं जो आपके लिए रुचिकर/लाभकारी हो सकते हैं (ईमेल, SMS, फोन या डाक से)।',
          `यदि आप ${VITE_OFFICIAL_NAME} विपणन/प्रचार सामग्री प्राप्त नहीं करना चाहते, पूर्ण या आंशिक रूप में, तो आप कभी भी support@${VITE_OFFICIAL_NAME} पर संपर्क कर ऑप्ट-आउट कर सकते हैं; हम तुरंत पालन करेंगे।`,
          `हम आपके ${VITE_OFFICIAL_NAME} खाते का प्रबंधन/सेवा देने हेतु समय-समय पर संपर्क कर सकते हैं; ये संचार आपके मार्केटिंग ऑप्ट-आउट प्राथमिकताओं को प्रभावित नहीं करेंगे।`,
        ],
      },
      {
        heading: '5. व्यक्तिगत जानकारी का प्रबंधन (Managing Personal Information)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} यह सुनिश्चित करने के लिए उचित कदम उठाता है कि एकत्र/प्रयुक्त/प्रकाशित व्यक्तिगत जानकारी सटीक हो और सुरक्षित रूप से संग्रहीत हो तथा केवल अधिकृत कर्मियों द्वारा सुलभ हो।`,
          'हम सेवाएँ प्रदान करने, विवाद हल करने, कानूनी बचाव स्थापित करने, ऑडिट करने, वैध व्यावसायिक उद्देश्यों का पीछा करने, समझौतों को लागू करने और लागू कानूनों का पालन करने हेतु डेटा संग्रहीत करते हैं।',
          'जब अनुमत उद्देश्यों (कानूनी दायित्व सहित) के लिए डेटा आवश्यक न रहे, तो हम उसे हटा देंगे या स्थायी रूप से गुमनाम कर देंगे।',
        ],
      },
      {
        heading: '6. व्यक्तिगत जानकारी की सुरक्षा (Personal Information Security)',
        paragraphs: [
          'आप स्वीकार करते हैं कि इंटरनेट डेटा ट्रांसमिशन पूर्णतः सुरक्षित नहीं है; प्रेषण आपकी अपनी जिम्मेदारी पर है।',
          `प्राप्ति के बाद, ${VITE_OFFICIAL_NAME} दुरुपयोग, हानि, अनधिकृत पहुँच/संशोधन/प्रकटीकरण से सुरक्षा हेतु उचित कदम उठाता है (पासवर्ड-संरक्षित सिस्टम, SSL तकनीक सहित)।`,
          'हमारी सेवाओं का उपयोग करके, आप सुरक्षा, गोपनीयता, या खाते के प्रबंधन संबंधी इलेक्ट्रॉनिक संचार के लिए सहमति देते हैं।',
          'कर्मचारी, एजेंट और ठेकेदार सदस्य जानकारी और लेनदेन डेटा को गोपनीय रखें।',
          `संदेश बोर्ड/सोशल मीडिया पर सार्वजनिक पोस्ट सार्वजनिक होती हैं; ${VITE_OFFICIAL_NAME} उनकी सुरक्षा की गारंटी नहीं दे सकता।`,
          'हम बाल सुरक्षा को गंभीरता से लेते हैं और नाबालिगों से जुआ खाते खोलने हेतु जानकारी स्वीकार नहीं करते; माता-पिता/अभिभावक निगरानी के उत्तरदायी हैं (आवश्यकतानुसार इंटरनेट फ़िल्टरिंग टूल्स सहित)।',
          'विशेषकर साझा कंप्यूटर पर, साइट उपयोग के बाद हमेशा लॉग आउट करें; अपने उपकरणों की सुरक्षा/एक्सेस के आप स्वयं जिम्मेदार हैं; अपने यूज़रनेम/पासवर्ड/खाता विवरण गोपनीय रखें और ऑनलाइन सतर्क रहें।',
        ],
      },
      {
        heading: '7. व्यक्तिगत जानकारी तक पहुँच (Accessing Personal Information)',
        paragraphs: [
          `आप वेबसाइट के “Settings” लिंक से या ग्राहक सहायता से संपर्क करके ${VITE_OFFICIAL_NAME} द्वारा एकत्र व्यक्तिगत जानकारी तक पहुँच सकते हैं।`,
          'यदि संभव हो तो हम अनुरोधित तरीके से उचित समय में पहुँच प्रदान करेंगे; यदि न हो सके तो अन्य तरीकों से सुविधा देंगे।',
          'यदि इससे अन्य व्यक्तियों की गोपनीयता पर अनुचित प्रभाव पड़े, तो पहुँच अस्वीकार की जा सकती है; ऐसे मामलों में, कारणों और उपलब्ध शिकायत तंत्र सहित लिखित सूचना दी जाएगी।',
        ],
      },
      {
        heading: '8. व्यक्तिगत डेटा हटाना (Deleting Personal Data)',
        paragraphs: [
          `यदि ${VITE_OFFICIAL_NAME} के पास आपके व्यक्तिगत डेटा को संसाधित/संग्रहीत करने का अब कोई कानूनी आधार नहीं है, तो आप हटाने का अनुरोध कर सकते हैं।`,
          `यह अधिकार पूर्ण नहीं है—${VITE_OFFICIAL_NAME} को डेटा-रिटेंशन की कानूनी बाध्यताओं का पालन करना होगा।`,
          'अनुरोध वेबसाइट ग्राहक सहायता के माध्यम से किए जा सकते हैं।',
        ],
      },
      {
        heading: '9. संपर्क जानकारी (Contact Information)',
        paragraphs: [
          'आपकी व्यक्तिगत जानकारी संबंधी प्रश्न, पहुँच/सुधार अनुरोध या शिकायतों के लिए, वेबसाइट चैट फीचर के माध्यम से हमसे संपर्क करें।',
        ],
      },
      {
        heading: '10. अंतरराष्ट्रीय डेटा स्थानांतरण (International Data Transfer)',
        paragraphs: [
          'जानकारी विश्वभर में स्थानांतरित, संसाधित और संग्रहीत की जा सकती है, जिनमें अलग डेटा-सुरक्षा कानून वाले देश भी शामिल हैं।',
          'हम लागू कानूनों के अनुसार आपकी जानकारी की सुरक्षा का लक्ष्य रखते हैं।',
        ],
      },
      {
        heading: '11. प्रसंस्करण के लिए कानूनी आधार (Legal Basis for Processing)',
        paragraphs: [
          `GDPR के तहत, ${VITE_OFFICIAL_NAME} निम्न आधारों पर व्यक्तिगत जानकारी संसाधित करता है:`,
          '• अनुबंध आवश्यकता (Contractual necessity): आपके या हमारे ग्राहकों के साथ अनुबंध पूरा करने के लिए।',
          `• वैध हित (Legitimate interests): ${VITE_OFFICIAL_NAME} के वैध व्यावसायिक हितों को बढ़ावा देना, बशर्ते यह आपके अधिकारों को अधिभारित न करे।`,
          '• सहमति (Consent): कुछ मामलों में, प्रसंस्करण आपकी सहमति पर आधारित है।',
          '• कानूनी दायित्व (Legal obligations): लागू कानूनों का पालन करने के लिए।',
        ],
      },
      {
        heading: '12. नियामक प्राधिकरण (Regulatory Authorities)',
        paragraphs: [
          `यदि आप EEA में हैं और मानते हैं कि आपका व्यक्तिगत डेटा संसाधित करने में ${VITE_OFFICIAL_NAME} लागू कानून का उल्लंघन कर रहा है, तो आपके पास नियामक प्राधिकरण के पास शिकायत दर्ज करने का अधिकार है।`,
        ],
      },
      {
        heading: '13. गोपनीयता नीति अद्यतन (Updating Privacy Policy)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} समय-समय पर इस गोपनीयता नीति की समीक्षा, संशोधन और अद्यतन कर सकता है।`,
          'परिवर्तन पोस्ट होते ही प्रभावी होते हैं।',
          'आपको इस नीति की नियमित समीक्षा करनी चाहिए और इसकी शर्तों से परिचित रहना चाहिए।',
        ],
      },
    ],
  },
  'in-ID': {
    title: 'Kebijakan Privasi',
    sections: [
      {
        heading: 'Pendahuluan',
        paragraphs: [
          `Ini adalah Kebijakan Privasi dari Medium Rare N.V. (pemilik dan operator ${VITE_OFFICIAL_NAME}).`,
          `Kebijakan ini menjelaskan bagaimana ${VITE_OFFICIAL_NAME} menangani informasi pribadi Anda saat Anda menjadi anggota ${VITE_OFFICIAL_NAME}, menggunakan situs web kami, halaman atau situs apa pun di bawah merek “${VITE_OFFICIAL_NAME}” (termasuk aplikasi seluler atau tablet yang kami miliki atau operasikan), atau berinteraksi dengan kami.`,
          'Kami berkomitmen untuk melindungi data pribadi Anda serta menggunakan, menyimpan, dan mengungkapkannya sesuai dengan undang-undang privasi dan kebijakan ini.',
        ],
      },
      {
        heading: '1. Penggunaan Situs Web',
        paragraphs: [
          'Dengan menggunakan situs web ini, Anda menyetujui Kebijakan Privasi ini.',
          `${VITE_OFFICIAL_NAME} dapat meninjau dan memperbarui kebijakan ini secara berkala dan berhak melakukan perubahan kapan saja.`,
          'Pembaruan berlaku segera setelah diposting di situs web.',
          'Penggunaan situs yang terus-menerus oleh Anda menandakan penerimaan atas perubahan tersebut.',
          `Kebijakan Privasi ini tidak berlaku untuk situs web yang ditautkan ke situs ini yang tidak dikendalikan oleh ${VITE_OFFICIAL_NAME}.`,
        ],
      },
      {
        heading: '2. Informasi Pribadi',
        paragraphs: [
          `Jenis informasi pribadi yang dapat dikumpulkan ${VITE_OFFICIAL_NAME} meliputi:`,
          '• Nama',
          '• Alamat email',
          '• Preferensi yang dikirimkan',
          '• Tanggal lahir',
          '• Negara kewarganegaraan',
          '• Alamat fisik',
          '• Nomor identitas',
          '• Identifikasi resmi yang diterbitkan pemerintah',
          '• Data lokasi',
          '• Informasi perangkat',
          '• Alamat IP',
          'Kami dapat mengumpulkan informasi ini melalui:',
          '• Data yang dimasukkan saat pendaftaran akun',
          '• Komunikasi dengan pelanggan kami',
        ],
      },
      {
        heading: '3. Tujuan Pengumpulan',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} mengumpulkan informasi pribadi Anda secara sah dan adil untuk tujuan berikut sebagai operator perjudian online berlisensi:`,
          '• Memverifikasi identitas Anda (KYC)',
          '• Mengirimkan komunikasi pemasaran jika Anda berlangganan',
          `• Memproses aplikasi keanggotaan Anda untuk ${VITE_OFFICIAL_NAME} atau subdomain yang dihosting`,
          '• Memberikan dan meningkatkan layanan untuk anggota',
          '• Mengidentifikasi anggota dan memverifikasi identitas untuk memastikan keamanan dan kepatuhan hukum',
          '• Memelihara akun anggota',
          '• Meningkatkan pengalaman Anda di situs web atau aplikasi, atau menyesuaikan informasi, layanan, atau produk sesuai kebutuhan Anda, termasuk riset pasar dan promosi',
          `• Membuat data demografis agregat tentang anggota untuk pemangku kepentingan dan untuk meningkatkan operasi ${VITE_OFFICIAL_NAME}`,
          '• Memberitahukan Anda tentang produk atau layanan yang mungkin menarik bagi Anda melalui email, SMS, atau telepon',
          '• Menanggapi pertanyaan, komentar, atau permintaan Anda',
          '• Menentukan tanggung jawab pajak untuk barang dan jasa',
          `• Mematuhi kontrak, hukum, dan kewajiban hukum ${VITE_OFFICIAL_NAME}`,
          '• Mengambil tindakan yang sesuai jika kami mencurigai aktivitas ilegal serius atau pelanggaran terkait operasi kami',
          '• Mendirikan, menjalankan, atau membela klaim hukum',
          '• Mengelola aplikasi pekerjaan',
          `Jika Anda tidak memberikan informasi pribadi yang diminta ${VITE_OFFICIAL_NAME}, kami mungkin tidak dapat memproses aplikasi keanggotaan Anda, menyediakan layanan, atau menanggapi pertanyaan atau keluhan Anda.`,
          `Dengan menggunakan ${VITE_OFFICIAL_NAME}, menjadi anggota, atau memberikan informasi pribadi, Anda menyetujui ${VITE_OFFICIAL_NAME} untuk mengumpulkan, menggunakan, memproses, dan kemungkinan mengungkapkan informasi pribadi Anda untuk tujuan yang dijelaskan di atas.`,
        ],
      },
      {
        heading: '4. Pemasaran Langsung & Opsi Keluar',
        paragraphs: [
          'Kami dapat menggunakan informasi pribadi Anda untuk sesekali membagikan produk, layanan, atau promosi yang kami pikir mungkin menarik atau bermanfaat bagi Anda.',
          'Ini dapat dilakukan melalui email, SMS, telepon, atau surat.',
          `Jika Anda tidak lagi ingin menerima materi pemasaran atau promosi ${VITE_OFFICIAL_NAME}, secara keseluruhan atau dalam bentuk apa pun, Anda dapat menghubungi kami kapan saja di support@${VITE_OFFICIAL_NAME} untuk keluar (opt-out), dan kami akan menindaklanjuti dengan segera.`,
          `Kami juga dapat menghubungi Anda sesekali untuk mengelola atau melayani akun ${VITE_OFFICIAL_NAME} Anda.`,
          'Komunikasi ini tidak akan memengaruhi preferensi opt-out pemasaran langsung Anda.',
        ],
      },
      {
        heading: '5. Pengelolaan Informasi Pribadi',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} mengambil langkah-langkah yang wajar untuk memastikan informasi pribadi yang dikumpulkan, digunakan, atau diungkapkannya akurat dan disimpan dengan aman, hanya dapat diakses oleh personel yang berwenang.`,
          'Kami menyimpan data pribadi untuk menyediakan layanan kami, menyelesaikan sengketa, membangun pembelaan hukum, melakukan audit, mengejar tujuan bisnis yang sah, menegakkan perjanjian, dan mematuhi hukum yang berlaku.',
          'Kami akan menghapus atau menganonimkan informasi pribadi secara permanen ketika informasi tersebut tidak lagi diperlukan untuk tujuan yang diizinkan oleh aplikasi, termasuk kewajiban hukum.',
        ],
      },
      {
        heading: '6. Keamanan Informasi Pribadi',
        paragraphs: [
          'Anda menyadari bahwa transmisi data melalui internet tidak sepenuhnya aman.',
          `${VITE_OFFICIAL_NAME} tidak dapat menjamin keamanan informasi apa pun yang Anda kirimkan. Transmisi dilakukan atas risiko Anda sendiri.`,
          `Setelah diterima, ${VITE_OFFICIAL_NAME} mengambil langkah-langkah wajar untuk melindungi informasi Anda dari penyalahgunaan, kehilangan, atau akses, modifikasi, dan pengungkapan yang tidak sah, termasuk sistem yang dilindungi kata sandi dan teknologi SSL.`,
          'Dengan menggunakan layanan kami, Anda menyetujui komunikasi elektronik terkait masalah keamanan, privasi, atau pengelolaan akun.',
          'Karyawan, agen, dan kontraktor harus menjaga kerahasiaan informasi anggota dan data transaksi.',
          `Posting publik di papan pesan atau media sosial (mis. Facebook, Twitter, ruang obrolan) bersifat publik, dan ${VITE_OFFICIAL_NAME} tidak dapat menjamin keamanannya.`,
          'Kami serius dalam perlindungan anak dan tidak menerima informasi dari anak di bawah umur untuk membuka akun perjudian.',
          'Orang tua atau wali bertanggung jawab memantau penggunaan internet anak, termasuk menggunakan alat penyaring internet bila perlu.',
          'Selalu keluar (log out) setelah menggunakan situs, terutama jika berbagi komputer.',
          'Anda bertanggung jawab atas keamanan dan akses perangkat Anda. Jaga kerahasiaan nama pengguna, kata sandi, dan detail akun, serta berhati-hati saat online.',
        ],
      },
      {
        heading: '7. Mengakses Informasi Pribadi',
        paragraphs: [
          `Anda dapat mengakses informasi pribadi yang dikumpulkan ${VITE_OFFICIAL_NAME} melalui tautan “Pengaturan” di situs web atau dengan menghubungi layanan pelanggan.`,
          'Kami akan memberikan akses sesuai permintaan dalam jangka waktu yang wajar jika memungkinkan.',
          'Jika kami tidak dapat memberikan akses seperti yang diminta, kami akan mencoba memfasilitasi dengan cara lain.',
          'Akses dapat ditolak jika secara tidak wajar memengaruhi privasi orang lain.',
          'Dalam kasus tersebut, kami akan memberi tahu Anda secara tertulis beserta alasan dan mekanisme pengaduan yang tersedia.',
        ],
      },
      {
        heading: '8. Menghapus Data Pribadi',
        paragraphs: [
          `Anda dapat meminta penghapusan data pribadi Anda jika ${VITE_OFFICIAL_NAME} tidak lagi memiliki alasan hukum untuk memproses atau menyimpannya.`,
          `Perlu dicatat bahwa hak ini tidak mutlak—${VITE_OFFICIAL_NAME} harus mematuhi kewajiban hukum yang mengharuskan penyimpanan data.`,
          'Permintaan dapat diajukan melalui layanan pelanggan di situs web.',
        ],
      },
      {
        heading: '9. Informasi Kontak',
        paragraphs: [
          'Untuk pertanyaan, akses, permintaan koreksi, atau keluhan terkait informasi pribadi Anda, hubungi kami melalui fitur obrolan di situs web.',
        ],
      },
      {
        heading: '10. Transfer Data Internasional',
        paragraphs: [
          'Informasi dapat ditransfer, diproses, dan disimpan di seluruh dunia, termasuk di negara dengan undang-undang perlindungan data yang berbeda.',
          'Kami bertujuan melindungi informasi Anda sesuai hukum yang berlaku.',
        ],
      },
      {
        heading: '11. Dasar Hukum untuk Pemrosesan',
        paragraphs: [
          `Berdasarkan GDPR, ${VITE_OFFICIAL_NAME} memproses informasi pribadi berdasarkan:`,
          '• Kebutuhan kontraktual: Untuk memenuhi kontrak dengan Anda atau pelanggan kami.',
          `• Kepentingan sah: Untuk mempromosikan kepentingan bisnis sah ${VITE_OFFICIAL_NAME}, selama tidak mengesampingkan hak Anda.`,
          '• Persetujuan: Dalam beberapa kasus, pemrosesan didasarkan pada persetujuan Anda.',
          '• Kewajiban hukum: Untuk mematuhi hukum yang berlaku.',
        ],
      },
      {
        heading: '12. Otoritas Regulasi',
        paragraphs: [
          'Jika Anda berada di EEA dan percaya pemrosesan data pribadi Anda oleh kami melanggar hukum yang berlaku, Anda memiliki hak untuk mengajukan keluhan ke otoritas regulasi.',
        ],
      },
      {
        heading: '13. Pembaruan Kebijakan Privasi',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} dapat meninjau, merevisi, dan memperbarui Kebijakan Privasi ini dari waktu ke waktu.`,
          'Perubahan berlaku saat diposting.',
          'Anda disarankan meninjau kebijakan ini secara rutin dan tetap familiar dengan ketentuannya.',
        ],
      },
    ],
  },
  'ja-JP': {
    title: 'プライバシーポリシー',
    sections: [
      {
        heading: '概要',
        paragraphs: [
          `これは Medium Rare N.V.（${VITE_OFFICIAL_NAME} の所有者および運営者）のプライバシーポリシーです。`,
          `本ポリシーでは、${VITE_OFFICIAL_NAME} メンバーになったとき、当社のウェブサイト、または「${VITE_OFFICIAL_NAME}」ブランドの下にあるページやサイト（当社が所有または運営するモバイルやタブレットアプリを含む）を利用したとき、あるいは当社とやり取りをしたときに、${VITE_OFFICIAL_NAME} が個人情報をどのように取り扱うかを説明します。`,
          '当社は、個人データの保護および本ポリシーとプライバシー法に従った使用、保管、開示に努めます。',
        ],
      },
      {
        heading: '1. ウェブサイトの利用',
        paragraphs: [
          'ウェブサイトを利用することで、本プライバシーポリシーに同意したものとみなされます。',
          `${VITE_OFFICIAL_NAME} は本ポリシーを定期的に見直し、必要に応じて随時変更する権利を保有します。`,
          '更新はウェブサイトに掲載された時点で直ちに有効となります。',
          'ウェブサイトの継続的な利用は、これらの変更に対する同意を意味します。',
          `本プライバシーポリシーは、${VITE_OFFICIAL_NAME} が管理していないリンク先のウェブサイトには適用されません。`,
        ],
      },
      {
        heading: '2. 個人情報',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} が収集する可能性のある個人情報の種類には以下が含まれます：`,
          '• 氏名',
          '• メールアドレス',
          '• 提出された好みや設定',
          '• 生年月日',
          '• 国籍',
          '• 住所',
          '• ID番号',
          '• 政府発行の身分証明書',
          '• 位置情報データ',
          '• デバイス情報',
          '• IPアドレス',
          '当社は以下を通じてこれらの情報を収集する場合があります：',
          '• アカウント登録時に入力されたデータ',
          '• お客様とのやり取り',
        ],
      },
      {
        heading: '3. 収集目的',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} は、ライセンスを取得したオンラインギャンブル運営者として、以下の目的で個人情報を合法的かつ公正に収集します：`,
          '• 本人確認（KYC）',
          '• 購読した場合のマーケティング通信の送信',
          `• ${VITE_OFFICIAL_NAME} または関連サブドメインの会員申請処理`,
          '• 会員向けサービスの提供および改善',
          '• 会員の特定および本人確認によるセキュリティと法令遵守の確保',
          '• 会員アカウントの維持',
          '• ウェブサイトやスマートフォンでの体験向上、または情報・サービス・製品のカスタマイズ（市場調査やプロモーションを含む）',
          `• 会員の統計データを作成し、${VITE_OFFICIAL_NAME} の運営改善や関係者向け情報提供に利用`,
          '• メール、SMS、電話を通じて興味・関心がある可能性のある製品やサービスの通知',
          '• お問い合わせ、コメント、リクエストへの対応',
          '• 商品やサービスに関する税務上の責任の判断',
          `• ${VITE_OFFICIAL_NAME} の契約、法令、法的義務の遵守`,
          '• 重大な不法行為や不正行為が疑われる場合の適切な対応',
          '• 法的請求権の確立、行使、または防御',
          '• 求人応募の管理',
          `${VITE_OFFICIAL_NAME} が求める個人情報を提供いただけない場合、会員申請の処理、サービス提供、問い合わせや苦情への対応ができない場合があります。`,
          `${VITE_OFFICIAL_NAME} を利用し、会員登録し、または個人情報を提供することにより、上記の目的で ${VITE_OFFICIAL_NAME} が個人情報を収集、使用、処理、場合によっては開示することに同意したものとみなされます。`,
        ],
      },
      {
        heading: '4. ダイレクトマーケティングおよびオプトアウト',
        paragraphs: [
          '当社は、お客様に興味や利益があると思われる製品、サービス、プロモーションを定期的に共有するために個人情報を使用する場合があります。',
          'これにはメール、SMS、電話、郵送が含まれることがあります。',
          `${VITE_OFFICIAL_NAME} のマーケティングやプロモーション資料の受信を希望されない場合は、support@${VITE_OFFICIAL_NAME} までご連絡いただければ、迅速に対応いたします。`,
          `また、${VITE_OFFICIAL_NAME} アカウントの管理やサービス提供のために、時折ご連絡する場合がありますが、これらの通信はダイレクトマーケティングのオプトアウト設定には影響しません。`,
        ],
      },
      {
        heading: '5. 個人情報の管理',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} は、収集、使用、開示する個人情報が正確で安全に保管され、権限のある担当者のみがアクセスできるよう、合理的な措置を講じます。`,
          '当社は、サービス提供、紛争解決、法的防御の確立、監査の実施、正当な業務目的の追求、契約の履行、および適用法令の遵守のために個人データを保管します。',
          'アプリが許可する目的（法的義務を含む）のために個人情報が不要になった場合、当社は個人情報を削除するか、恒久的に匿名化します。',
        ],
      },
      {
        heading: '6. 個人情報のセキュリティ',
        paragraphs: [
          'インターネットを通じたデータ送信が完全に安全でないことを承知してください。',
          `${VITE_OFFICIAL_NAME} は送信された情報の安全性を保証できません。送信は自己責任で行ってください。`,
          `受信後、${VITE_OFFICIAL_NAME} はパスワード保護システムや SSL 技術などを使用して、情報の誤用、紛失、無断アクセス、改ざん、開示から保護するために合理的な措置を講じます。`,
          '当社サービスの利用により、セキュリティ、プライバシー、アカウント管理に関する電子的通信に同意したものとみなされます。',
          '従業員、代理人、契約者は、会員情報および取引データを機密として保持する必要があります。',
          `掲示板やソーシャルメディア（Facebook、Twitter、チャットルームなど）での公開投稿は公開情報であり、${VITE_OFFICIAL_NAME} はその安全性を保証できません。`,
          '当社は児童保護を重視しており、未成年者からのギャンブルアカウント登録情報は受け付けません。',
          '保護者は、適切な場合にインターネットフィルタリングツールを使用するなど、子供のインターネット利用を監督する責任があります。',
          'サイト使用後は必ずログアウトしてください。特に共用コンピュータを使用する場合は注意が必要です。',
          'デバイスのセキュリティとアクセスは利用者の責任です。ユーザー名、パスワード、アカウント情報は機密として保持し、オンラインでの取り扱いには十分注意してください。',
        ],
      },
      {
        heading: '7. 個人情報へのアクセス',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} が収集した個人情報には、ウェブサイトの「設定」リンクやカスタマーサポートへの問い合わせを通じてアクセスできます。`,
          '可能な場合、当社は合理的な期間内にご希望の方法でアクセスを提供します。',
          '希望通りに提供できない場合は、別の方法で対応するよう努めます。',
          'アクセスが他者のプライバシーに不当な影響を与える場合は拒否されることがあります。',
          'その場合、理由と利用可能な苦情手段を文書で通知します。',
        ],
      },
      {
        heading: '8. 個人データの削除',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} が個人データを処理または保管する法的理由がなくなった場合、データ削除をリクエストできます。`,
          `この権利は絶対ではなく、${VITE_OFFICIAL_NAME} は保持が法的に義務付けられている場合には従う必要があります。`,
          'リクエストはウェブサイトのカスタマーサポートを通じて行えます。',
        ],
      },
      {
        heading: '9. 連絡先情報',
        paragraphs: [
          '個人情報に関する質問、アクセス、訂正リクエスト、苦情は、ウェブサイトのチャット機能を通じてご連絡ください。',
        ],
      },
      {
        heading: '10. 国際的なデータ転送',
        paragraphs: [
          '情報は、異なるデータ保護法が適用される国を含め、世界中で転送、処理、保管される場合があります。',
          '当社は適用法に従い、情報の保護に努めます。',
        ],
      },
      {
        heading: '11. 処理の法的根拠',
        paragraphs: [
          `GDPR に基づき、${VITE_OFFICIAL_NAME} は以下に基づき個人情報を処理します：`,
          '• 契約上の必要性：お客様または当社の顧客との契約履行のため。',
          `• 正当な利益：お客様の権利を侵害しない範囲で、${VITE_OFFICIAL_NAME} の正当な事業利益を促進するため。`,
          '• 同意：場合によっては、お客様の同意に基づいて処理。',
          '• 法的義務：適用法令を遵守するため。',
        ],
      },
      {
        heading: '12. 規制当局',
        paragraphs: [
          'EEA 内に居住しており、当社の個人データ処理が適用法に違反していると思われる場合、規制当局に苦情を申し立てる権利があります。',
        ],
      },
      {
        heading: '13. プライバシーポリシーの更新',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} は、プライバシーポリシーを随時見直し、改訂、更新する場合があります。`,
          '変更は掲載時に有効となります。',
          '定期的に本ポリシーを確認し、その内容を把握しておくことを推奨します。',
        ],
      },
    ],
  },
  'th-TH': {
    title: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
    sections: [
      {
        heading: 'บทนำ',
        paragraphs: [
          `นี่คือนโยบายความเป็นส่วนตัวของ Medium Rare N.V. (เจ้าของและผู้ดำเนินงาน ${VITE_OFFICIAL_NAME})`,
          `นโยบายนี้อธิบายวิธีที่ ${VITE_OFFICIAL_NAME} จัดการข้อมูลส่วนบุคคลของคุณเมื่อคุณเป็นสมาชิก ใช้เว็บไซต์ หน้า/ไซต์ภายใต้แบรนด์ “${VITE_OFFICIAL_NAME}” (รวมถึงแอปมือถือหรือแท็บเล็ตที่เราครอบครองหรือดำเนินการ) หรือมีปฏิสัมพันธ์กับเรา`,
          'เรามุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณ และใช้ เก็บรักษา และเปิดเผยข้อมูลนั้นตามกฎหมายความเป็นส่วนตัวและนโยบายนี้',
        ],
      },
      {
        heading: '1. การใช้เว็บไซต์ (Website Use)',
        paragraphs: [
          'โดยการใช้เว็บไซต์นี้ คุณยอมรับนโยบายความเป็นส่วนตัวนี้',
          `${VITE_OFFICIAL_NAME} อาจตรวจสอบและปรับปรุงนโยบายนี้เป็นประจำ และสงวนสิทธิ์ในการเปลี่ยนแปลงได้ทุกเวลา`,
          'การอัปเดตมีผลทันทีเมื่อโพสต์บนเว็บไซต์',
          'การใช้งานเว็บไซต์ต่อไปถือเป็นการยอมรับการเปลี่ยนแปลงเหล่านี้',
          `นโยบายความเป็นส่วนตัวนี้ไม่ครอบคลุมเว็บไซต์ที่เชื่อมโยงซึ่ง ${VITE_OFFICIAL_NAME} ไม่ควบคุม`,
        ],
      },
      {
        heading: '2. ข้อมูลส่วนบุคคล (Personal Information)',
        paragraphs: [
          `ประเภทของข้อมูลส่วนบุคคลที่ ${VITE_OFFICIAL_NAME} อาจเก็บรวบรวม ได้แก่:`,
          '• ชื่อ',
          '• ที่อยู่อีเมล',
          '• การตั้งค่าหรือความชอบที่ส่งมา',
          '• วันเกิด',
          '• สัญชาติ',
          '• ที่อยู่ทางกายภาพ',
          '• หมายเลขประจำตัว',
          '• เอกสารระบุตัวตนที่ออกโดยรัฐบาล',
          '• ข้อมูลตำแหน่งที่ตั้ง',
          '• ข้อมูลอุปกรณ์',
          '• ที่อยู่ IP',
          'เราอาจเก็บข้อมูลนี้ผ่าน:',
          '• ข้อมูลที่ป้อนในระหว่างการลงทะเบียนบัญชี',
          '• การสื่อสารกับลูกค้าของเรา',
        ],
      },
      {
        heading: '3. วัตถุประสงค์ในการเก็บข้อมูล (Purpose of Collection)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} เก็บรวบรวมข้อมูลส่วนบุคคลของคุณอย่างถูกกฎหมายและเป็นธรรม เพื่อวัตถุประสงค์ดังต่อไปนี้ในฐานะผู้ให้บริการการพนันออนไลน์ที่ได้รับอนุญาต:`,
          '• ตรวจสอบตัวตนของคุณ (KYC)',
          '• ส่งข้อความการตลาดหากคุณสมัครรับข่าวสาร',
          `• ประมวลผลคำขอเป็นสมาชิกของคุณสำหรับ ${VITE_OFFICIAL_NAME} หรือซับโดเมนที่จัดโฮสต์`,
          '• ให้บริการสมาชิกและปรับปรุงบริการ',
          '• ระบุสมาชิกและตรวจสอบตัวตนเพื่อให้มั่นใจในความปลอดภัยและการปฏิบัติตามกฎหมาย',
          '• ดูแลบัญชีสมาชิก',
          '• ปรับปรุงประสบการณ์การใช้งานเว็บไซต์หรือมือถือ หรือปรับข้อมูล บริการ หรือผลิตภัณฑ์ให้ตรงกับความต้องการ (รวมถึงวิจัยตลาดและโปรโมชัน)',
          `• สร้างข้อมูลประชากรรวมเกี่ยวกับสมาชิกสำหรับผู้มีส่วนได้ส่วนเสียและปรับปรุงการดำเนินงานของ ${VITE_OFFICIAL_NAME}`,
          '• แจ้งข้อมูลเกี่ยวกับผลิตภัณฑ์หรือบริการที่คุณอาจสนใจผ่านอีเมล SMS หรือโทรศัพท์',
          '• ตอบคำถาม ความคิดเห็น หรือคำร้องขอของคุณ',
          '• กำหนดความรับผิดชอบด้านภาษีสำหรับสินค้าและบริการ',
          `• ปฏิบัติตามสัญญา กฎหมาย และภาระหน้าที่ทางกฎหมายของ ${VITE_OFFICIAL_NAME}`,
          '• ดำเนินการที่เหมาะสมหากสงสัยว่ามีกิจกรรมผิดกฎหมายหรือการประพฤติผิดร้ายแรง',
          '• จัดตั้ง ใช้ หรือป้องกันสิทธิเรียกร้องทางกฎหมาย',
          '• จัดการใบสมัครงาน',
          'หากคุณไม่ให้ข้อมูลส่วนบุคคลตามที่ร้องขอ เราอาจไม่สามารถประมวลผลการสมัคร ให้บริการ หรือตอบคำถาม/ข้อร้องเรียนได้',
          `การใช้ ${VITE_OFFICIAL_NAME} การเป็นสมาชิก หรือการให้ข้อมูลส่วนบุคคล ถือเป็นการยินยอมให้ ${VITE_OFFICIAL_NAME} เก็บ ใช้ ประมวลผล และอาจเปิดเผยข้อมูลเพื่อวัตถุประสงค์ข้างต้น`,
        ],
      },
      {
        heading: '4. การตลาดโดยตรง & การเลือกไม่รับ (Direct Marketing & Opt-Out)',
        paragraphs: [
          'เราอาจใช้ข้อมูลส่วนบุคคลเพื่อส่งผลิตภัณฑ์ บริการ หรือโปรโมชั่นที่อาจเป็นประโยชน์แก่คุณเป็นระยะ ๆ ผ่านอีเมล SMS โทรศัพท์ หรือไปรษณีย์',
          `หากไม่ประสงค์รับสื่อการตลาด/โปรโมชันของ ${VITE_OFFICIAL_NAME} อีกต่อไป คุณสามารถติดต่อที่ support@${VITE_OFFICIAL_NAME} เพื่อเลือกไม่รับ และเราจะดำเนินการทันที`,
          'เราอาจติดต่อเพื่อจัดการหรือให้บริการบัญชีของคุณเป็นครั้งคราว ซึ่งจะไม่กระทบการตั้งค่า opt-out',
        ],
      },
      {
        heading: '5. การจัดการข้อมูลส่วนบุคคล (Managing Personal Information)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} ดำเนินมาตรการที่เหมาะสมเพื่อให้ข้อมูลส่วนบุคคลถูกต้อง ปลอดภัย และเข้าถึงได้เฉพาะบุคลากรที่ได้รับอนุญาต`,
          'เราจัดเก็บข้อมูลเพื่อให้บริการ แก้ไขข้อพิพาท จัดตั้งการป้องกันทางกฎหมาย ตรวจสอบบัญชี ดำเนินธุรกิจตามความชอบธรรม บังคับใช้ข้อตกลง และปฏิบัติตามกฎหมาย',
          'เราจะลบหรือทำให้ข้อมูลไม่ระบุตัวตนอย่างถาวรเมื่อไม่จำเป็นต่อวัตถุประสงค์ที่แอปอนุญาต รวมถึงภาระหน้าที่ทางกฎหมาย',
        ],
      },
      {
        heading: '6. ความปลอดภัยของข้อมูลส่วนบุคคล (Personal Information Security)',
        paragraphs: [
          `คุณรับทราบว่าการส่งข้อมูลผ่านอินเทอร์เน็ตไม่ปลอดภัยอย่างสมบูรณ์ และ ${VITE_OFFICIAL_NAME} ไม่สามารถรับประกันความปลอดภัยของข้อมูลที่ส่งได้ การส่งเป็นความเสี่ยงของคุณเอง`,
          `เมื่อได้รับข้อมูลแล้ว ${VITE_OFFICIAL_NAME} ใช้มาตรการที่เหมาะสมเพื่อปกป้องข้อมูลจากการใช้งานผิดพลาด การสูญหาย การเข้าถึง แก้ไข และการเปิดเผยโดยไม่ได้รับอนุญาต รวมถึงระบบที่ป้องกันด้วยรหัสผ่านและเทคโนโลยี SSL`,
          'การใช้บริการถือเป็นความยินยอมให้สื่อสารทางอิเล็กทรอนิกส์เกี่ยวกับความปลอดภัย ความเป็นส่วนตัว หรือการจัดการบัญชี',
          'พนักงาน ตัวแทน และผู้รับจ้างต้องเก็บข้อมูลสมาชิกและข้อมูลธุรกรรมเป็นความลับ',
          `การโพสต์สาธารณะบนบอร์ดข้อความหรือโซเชียลมีเดียเป็นสาธารณะ และ ${VITE_OFFICIAL_NAME} ไม่สามารถรับประกันความปลอดภัยได้`,
          'เราให้ความสำคัญกับการคุ้มครองเด็กและไม่รับข้อมูลจากผู้เยาว์เพื่อเปิดบัญชีการพนัน',
          'ผู้ปกครองต้องรับผิดชอบในการดูแลการใช้อินเทอร์เน็ตของบุตร รวมถึงการใช้เครื่องมือกรองอินเทอร์เน็ตตามความเหมาะสม',
          'ควรออกจากระบบหลังใช้งานทุกครั้ง โดยเฉพาะเมื่อใช้คอมพิวเตอร์ร่วมกัน',
          'คุณต้องรับผิดชอบต่อความปลอดภัยและการเข้าถึงอุปกรณ์ของคุณ และเก็บรักษาชื่อผู้ใช้ รหัสผ่าน และรายละเอียดบัญชีเป็นความลับ',
        ],
      },
      {
        heading: '7. การเข้าถึงข้อมูลส่วนบุคคล (Accessing Personal Information)',
        paragraphs: [
          `คุณสามารถเข้าถึงข้อมูลส่วนบุคคลที่ ${VITE_OFFICIAL_NAME} เก็บรวบรวมผ่านลิงก์ “Settings” บนเว็บไซต์ หรือโดยติดต่อฝ่ายบริการลูกค้า`,
          'เราจะให้การเข้าถึงในลักษณะที่ร้องขอภายในระยะเวลาที่เหมาะสมหากเป็นไปได้',
          'หากไม่สามารถให้ตามที่ร้องขอ เราจะพยายามอำนวยความสะดวกด้วยวิธีอื่น',
          'อาจปฏิเสธการเข้าถึงหากกระทบต่อความเป็นส่วนตัวของผู้อื่นอย่างไม่สมเหตุสมผล และจะแจ้งเหตุผลและกลไกร้องเรียนเป็นลายลักษณ์อักษร',
        ],
      },
      {
        heading: '8. การลบข้อมูลส่วนบุคคล (Deleting Personal Data)',
        paragraphs: [
          `คุณสามารถขอลบข้อมูลส่วนบุคคลได้ หาก ${VITE_OFFICIAL_NAME} ไม่มีเหตุผลทางกฎหมายในการประมวลผลหรือจัดเก็บอีกต่อไป`,
          `สิทธิ์นี้ไม่ใช่สิทธิ์สมบูรณ์ ${VITE_OFFICIAL_NAME} ต้องปฏิบัติตามภาระหน้าที่ทางกฎหมายที่กำหนดให้เก็บรักษาข้อมูล`,
          'สามารถยื่นคำขอผ่านฝ่ายบริการลูกค้าในเว็บไซต์',
        ],
      },
      {
        heading: '9. ข้อมูลการติดต่อ (Contact Information)',
        paragraphs: [
          'สำหรับคำถาม การเข้าถึง คำขอแก้ไข หรือข้อร้องเรียนเกี่ยวกับข้อมูลส่วนบุคคลของคุณ โปรดติดต่อผ่านฟีเจอร์แชทบนเว็บไซต์',
        ],
      },
      {
        heading: '10. การโอนข้อมูลระหว่างประเทศ (International Data Transfer)',
        paragraphs: [
          'ข้อมูลอาจถูกโอน ประมวลผล และจัดเก็บทั่วโลก รวมถึงในประเทศที่มีกฎหมายคุ้มครองข้อมูลแตกต่างกัน',
          'เรามุ่งมั่นปกป้องข้อมูลของคุณตามกฎหมายที่ใช้บังคับ',
        ],
      },
      {
        heading: '11. พื้นฐานทางกฎหมายสำหรับการประมวลผล (Legal Basis for Processing)',
        paragraphs: [
          `ภายใต้ GDPR ${VITE_OFFICIAL_NAME} ประมวลผลข้อมูลส่วนบุคคลโดยอิงจาก:`,
          '• ความจำเป็นตามสัญญา (Contractual necessity): เพื่อปฏิบัติตามสัญญากับคุณหรือกับลูกค้าของเรา',
          `• ผลประโยชน์ชอบธรรม (Legitimate interests): เพื่อส่งเสริมผลประโยชน์ทางธุรกิจที่ชอบธรรมของ ${VITE_OFFICIAL_NAME} ตราบใดที่ไม่ละเมิดสิทธิของคุณ`,
          '• ความยินยอม (Consent): ในบางกรณี การประมวลผลอิงตามความยินยอมของคุณ',
          '• ภาระหน้าที่ทางกฎหมาย (Legal obligations): เพื่อปฏิบัติตามกฎหมายที่เกี่ยวข้อง',
        ],
      },
      {
        heading: '12. หน่วยงานกำกับดูแล (Regulatory Authorities)',
        paragraphs: [
          'หากคุณอยู่ใน EEA และเชื่อว่าการประมวลผลข้อมูลส่วนบุคคลของคุณละเมิดกฎหมายที่ใช้บังคับ คุณมีสิทธิ์ยื่นเรื่องร้องเรียนต่อหน่วยงานกำกับดูแล',
        ],
      },
      {
        heading: '13. การปรับปรุงนโยบายความเป็นส่วนตัว (Updating Privacy Policy)',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} อาจตรวจสอบ แก้ไข และปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นระยะ ๆ`,
          'การเปลี่ยนแปลงมีผลเมื่อโพสต์',
          'ควรตรวจสอบนโยบายนี้เป็นประจำและทำความคุ้นเคยกับข้อกำหนด',
        ],
      },
    ],
  },
  'vi-VN': {
    title: 'CHÍNH SÁCH BẢO MẬT',
    sections: [
      {
        heading: 'Giới thiệu',
        paragraphs: [
          `Đây là chính sách bảo mật của Medium Rare N.V. (chủ sở hữu và nhà điều hành ${VITE_OFFICIAL_NAME}).`,
          `Chính sách này nêu rõ cách ${VITE_OFFICIAL_NAME} quản lý thông tin cá nhân của bạn khi bạn trở thành thành viên ${VITE_OFFICIAL_NAME}, sử dụng trang web của chúng tôi và bất kỳ trang/website nào thuộc thương hiệu "${VITE_OFFICIAL_NAME}" (bao gồm các ứng dụng di động hoặc máy tính bảng do chúng tôi sở hữu/vận hành), hoặc khi chúng tôi tương tác với bạn.`,
          'Chúng tôi cam kết đảm bảo rằng thông tin cá nhân của bạn được bảo vệ, sử dụng, lưu trữ và tiết lộ theo luật bảo mật và chính sách này.',
        ],
      },
      {
        heading: '1. Sử dụng Trang web',
        paragraphs: [
          'Khi sử dụng trang web, bạn đồng ý bị ràng buộc bởi các điều khoản của Chính sách Bảo mật này.',
          `${VITE_OFFICIAL_NAME} có thể xem xét và cập nhật chính sách này định kỳ, bảo lưu quyền thay đổi bất kỳ lúc nào bằng cách đăng lên trang web.`,
          'Các thay đổi có hiệu lực ngay sau khi đăng.',
          'Việc tiếp tục sử dụng trang web đồng nghĩa với việc bạn chấp nhận những thay đổi này.',
          `Chính sách này không áp dụng cho các website liên kết nằm ngoài tầm kiểm soát của ${VITE_OFFICIAL_NAME}.`,
        ],
      },
      {
        heading: '2. Thông tin Cá nhân',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} có thể thu thập các loại thông tin cá nhân sau:`,
          '- Tên',
          '- Địa chỉ Email',
          '- Sở thích Cá nhân',
          '- Ngày sinh',
          '- Quốc tịch',
          '- Địa chỉ Thực tế',
          '- Số CMND/CCCD',
          '- Giấy tờ tùy thân do chính phủ cấp',
          '- Dữ liệu vị trí',
          '- Thông tin thiết bị',
          '- Địa chỉ IP',
          'Chúng tôi thu thập (hoặc có thể thu thập) thông tin này thông qua:',
          '- Dữ liệu được nhập trong quá trình đăng ký tài khoản',
          '- Thông tin liên lạc với khách hàng',
        ],
      },
      {
        heading: '3. Mục đích thu thập',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} thu thập thông tin cá nhân của bạn một cách hợp pháp và công bằng, nhằm các mục đích sau với tư cách là công ty trò chơi trực tuyến được cấp phép:`,
          '- Xác minh danh tính khách hàng (KYC).',
          '- Gửi thông tin tiếp thị nếu bạn đăng ký nhận.',
          `- Xử lý đơn đăng ký thành viên ${VITE_OFFICIAL_NAME} hoặc bất kỳ tên miền phụ được lưu trữ.`,
          '- Cung cấp và cải thiện dịch vụ cho thành viên.',
          '- Xác định và xác minh danh tính để đảm bảo an ninh và tuân thủ pháp lý.',
          '- Duy trì tài khoản thành viên.',
          '- Nâng cấp trải nghiệm trên web/điện thoại hoặc tùy chỉnh thông tin, dịch vụ, sản phẩm (bao gồm nghiên cứu thị trường và quảng cáo).',
          `- Tạo dữ liệu nhân khẩu học tổng hợp cho các bên liên quan và cải thiện hoạt động của ${VITE_OFFICIAL_NAME}.`,
          '- Thông báo về sản phẩm/dịch vụ có thể bạn quan tâm qua email, SMS hoặc điện thoại.',
          '- Trả lời câu hỏi, bình luận hoặc yêu cầu của bạn.',
          '- Xác định trách nhiệm thuế đối với hàng hóa và dịch vụ.',
          `- Tuân thủ các nghĩa vụ theo hợp đồng, pháp lý và luật định của ${VITE_OFFICIAL_NAME}.`,
          '- Thực hiện hành động thích hợp khi nghi ngờ hoạt động bất hợp pháp hoặc hành vi sai trái nghiêm trọng liên quan đến hoạt động của chúng tôi.',
          '- Thiết lập, thực hiện hoặc bảo vệ khiếu nại pháp lý.',
          '- Quản lý đơn xin việc.',
          'Nếu bạn không cung cấp thông tin theo yêu cầu, chúng tôi có thể không xử lý được đơn đăng ký, cung cấp dịch vụ hoặc phản hồi câu hỏi/khiếu nại của bạn.',
          `Bằng cách sử dụng ${VITE_OFFICIAL_NAME}, trở thành thành viên hoặc cung cấp thông tin cá nhân, bạn đồng ý để ${VITE_OFFICIAL_NAME} thu thập, sử dụng, xử lý và có thể tiết lộ thông tin cho các mục đích nêu trên.`,
        ],
      },
      {
        heading: '4. Tiếp thị trực tiếp và từ chối nhận thông tin',
        paragraphs: [
          'Chúng tôi có thể sử dụng thông tin cá nhân để định kỳ giới thiệu sản phẩm, dịch vụ hoặc khuyến mãi qua email, SMS, điện thoại hoặc thư.',
          `Nếu không muốn nhận tài liệu tiếp thị/quảng cáo của ${VITE_OFFICIAL_NAME} (toàn bộ hoặc một phần), bạn có thể liên hệ support@${VITE_OFFICIAL_NAME} để yêu cầu từ chối nhận; chúng tôi sẽ xử lý ngay.`,
          `Chúng tôi cũng có thể liên hệ để quản lý hoặc phục vụ tài khoản ${VITE_OFFICIAL_NAME} của bạn; các liên hệ này không ảnh hưởng đến trạng thái từ chối nhận tiếp thị trực tiếp.`,
        ],
      },
      {
        heading: '5. Quản lý Thông tin cá nhân',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} thực hiện các biện pháp hợp lý để bảo đảm thông tin cá nhân thu thập/sử dụng/tiết lộ là chính xác, được lưu trữ an toàn và chỉ nhân sự được ủy quyền mới truy cập.`,
          'Chúng tôi lưu trữ dữ liệu để cung cấp dịch vụ, giải quyết tranh chấp, thiết lập biện pháp bảo vệ pháp lý, kiểm toán, theo đuổi mục tiêu kinh doanh hợp pháp, thực thi thỏa thuận và tuân thủ luật áp dụng.',
          'Chúng tôi sẽ hủy hoặc ẩn danh vĩnh viễn thông tin khi không còn cần cho các mục đích được ứng dụng cho phép, bao gồm nghĩa vụ pháp lý.',
        ],
      },
      {
        heading: '6. Bảo mật Thông tin cá nhân',
        paragraphs: [
          `Không có truyền dữ liệu Internet nào hoàn toàn an toàn; ${VITE_OFFICIAL_NAME} không bảo đảm tính bảo mật của thông tin bạn truyền và bạn tự chịu rủi ro khi truyền.`,
          `Sau khi nhận, ${VITE_OFFICIAL_NAME} áp dụng biện pháp hợp lý để bảo vệ thông tin khỏi sử dụng sai mục đích, mất mát, truy cập/sửa đổi/tiết lộ trái phép, bao gồm hệ thống bảo vệ bằng mật khẩu và công nghệ SSL.`,
          'Khi sử dụng dịch vụ hoặc cung cấp thông tin, bạn đồng ý nhận liên lạc điện tử về bảo mật, quyền riêng tư và quản trị tài khoản.',
          'Nhân viên, đại lý và nhà thầu phải bảo mật thông tin thành viên và dữ liệu giao dịch.',
          `Bài đăng công khai trên bảng tin/mạng xã hội là thông tin công khai; ${VITE_OFFICIAL_NAME} không thể bảo đảm tính bảo mật của các thông tin này.`,
          'Chúng tôi loại trừ trẻ em khỏi dịch vụ: không chấp nhận thông tin của trẻ em để mở tài khoản cá cược; cha mẹ/người giám hộ chịu trách nhiệm giám sát hoạt động trực tuyến của trẻ, kể cả dùng phần mềm kiểm duyệt khi cần.',
          'Luôn đăng xuất sau khi dùng trang web, đặc biệt khi dùng chung máy tính; bạn chịu trách nhiệm về an ninh và quyền truy cập thiết bị; giữ bí mật tên đăng nhập, mật khẩu và thông tin tài khoản.',
        ],
      },
      {
        heading: '7. Truy cập Thông tin cá nhân',
        paragraphs: [
          `Bạn có thể truy cập thông tin cá nhân do ${VITE_OFFICIAL_NAME} thu thập qua liên kết "Cài đặt" trên trang web hoặc liên hệ bộ phận chăm sóc khách hàng.`,
          'Chúng tôi sẽ cung cấp quyền truy cập theo cách bạn yêu cầu trong thời gian hợp lý nếu có thể; nếu không, chúng tôi sẽ cố gắng hỗ trợ bằng phương thức khác.',
          'Quyền truy cập có thể bị từ chối nếu ảnh hưởng bất hợp lý đến quyền riêng tư của người khác; khi đó, chúng tôi sẽ thông báo bằng văn bản lý do và cơ chế khiếu nại.',
        ],
      },
      {
        heading: '8. Xóa Dữ liệu cá nhân',
        paragraphs: [
          `Bạn có thể yêu cầu xóa dữ liệu nếu ${VITE_OFFICIAL_NAME} không còn cơ sở pháp lý để tiếp tục xử lý hoặc lưu trữ.`,
          `Quyền này không tuyệt đối: ${VITE_OFFICIAL_NAME} phải tuân thủ các nghĩa vụ pháp lý yêu cầu lưu trữ dữ liệu.`,
          'Yêu cầu có thể gửi qua bộ phận chăm sóc khách hàng của trang web.',
        ],
      },
      {
        heading: '9. Liên hệ với chúng tôi',
        paragraphs: [
          'Đối với câu hỏi, yêu cầu truy cập/chỉnh sửa hoặc khiếu nại liên quan đến xử lý thông tin cá nhân, vui lòng liên hệ qua chức năng trò chuyện trên trang web.',
        ],
      },
      {
        heading: '10. Chuyển giao dữ liệu quốc tế',
        paragraphs: [
          'Thông tin có thể được chuyển giao, xử lý và lưu trữ trên toàn thế giới, bao gồm các quốc gia có luật bảo vệ dữ liệu khác nhau.',
          'Chúng tôi nỗ lực bảo vệ thông tin của bạn theo luật hiện hành.',
        ],
      },
      {
        heading: '11. Cơ sở pháp lý cho việc xử lý',
        paragraphs: [
          `Theo GDPR, việc ${VITE_OFFICIAL_NAME} xử lý thông tin cá nhân dựa trên:`,
          '- Thực hiện hợp đồng: cần thiết để thực hiện hợp đồng với bạn hoặc khách hàng của chúng tôi.',
          `- Lợi ích hợp pháp: thúc đẩy lợi ích hợp pháp của ${VITE_OFFICIAL_NAME}, miễn là không bị lợi ích/quyền và tự do cơ bản của bạn lấn át.`,
          '- Sự đồng ý: trong một số trường hợp, dựa trên sự đồng ý của bạn.',
          '- Tuân thủ nghĩa vụ pháp lý: để đáp ứng các nghĩa vụ pháp lý áp dụng.',
        ],
      },
      {
        heading: '12. Cơ quan quản lý',
        paragraphs: [
          'Nếu bạn ở EEA và tin rằng việc xử lý dữ liệu cá nhân của bạn vi phạm pháp luật hiện hành, bạn có quyền khiếu nại với cơ quan quản lý.',
        ],
      },
      {
        heading: '13. Cập nhật Chính sách Quyền riêng tư',
        paragraphs: [
          `${VITE_OFFICIAL_NAME} có thể xem xét, thay đổi và cập nhật chính sách này theo thời gian để phản ánh thực tiễn và nghĩa vụ hiện hành.`,
          'Các thay đổi có hiệu lực sau khi công bố.',
          'Bạn nên xem lại chính sách này định kỳ và làm quen với các điều khoản của nó.',
        ],
      },
    ],
  },
}
