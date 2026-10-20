// Blog seed — MK Creative
// 7 artigos em pt-BR. Regras: honestidade (números/promessas inventados, nunca),
// "gerenciar" (nunca "gestir"), "Perfil da Empresa no Google" (nunca "Google Meu Negócio").
// Conteúdo é HTML sanitizado: apenas h2, h3, p, ul, li, blockquote, strong, em, a.

export type BlogSeedPost = {
  title: string;
  slug: string; // kebab-case, sem acentos
  category: string; // deve bater com um nome de BLOG_CATEGORIES
  tags: string[]; // 2-4 tags
  excerpt: string; // 140-180 caracteres
  content: string; // HTML sanitizado
  coverAlt: string; // texto alternativo da capa
  seoTitle: string; // até 60 caracteres
  seoDescription: string; // 140-160 caracteres
  focusKeyword: string;
  featured: boolean;
};

export const BLOG_CATEGORIES: { name: string; slug: string; color: string }[] = [
  { name: "Google & SEO Local", slug: "google-seo-local", color: "#F3640A" },
  { name: "Marketing Digital", slug: "marketing-digital", color: "#C2500A" },
  { name: "Redes Sociais", slug: "redes-sociais", color: "#F3640A" },
  { name: "Mídia Indoor", slug: "midia-indoor", color: "#C2500A" },
  { name: "Sites e SEO", slug: "sites-e-seo", color: "#F3640A" },
  { name: "Comunicação e Marca", slug: "comunicacao-e-marca", color: "#C2500A" },
];

export const BLOG_SEED: BlogSeedPost[] = [
  {
    title: "Perfil da Empresa no Google: o básico que muita empresa ainda deixa passar",
    slug: "perfil-da-empresa-no-google-o-basico-que-muita-empresa-deixa-passar",
    category: "Google & SEO Local",
    tags: ["perfil da empresa no google", "seo local", "google"],
    excerpt:
      "Informações completas, fotos atualizadas e avaliações respondidas: o básico do Perfil da Empresa no Google que decide se o cliente local liga para você ou passa direto.",
    content: `<p>Quando alguém da sua cidade procura um produto ou serviço, a primeira conversa acontece no Google. Antes de ligar, antes de visitar, a pessoa encontra o seu Perfil da Empresa no Google — e decide em segundos se vale o contato.</p>
<p>O lado bom dessa história é que cuidar do perfil não exige conhecimento técnico avançado. Exige atenção ao básico. E é exatamente o básico que muita empresa ainda deixa passar.</p>
<h2>O que é o Perfil da Empresa no Google?</h2>
<p>É a ficha da sua empresa que aparece nas buscas e no Google Maps, com nome, endereço, telefone, horários, fotos e avaliações. É por ali que muita gente tira dúvidas, confere como chegar e decide onde comprar. Pense nele como a vitrine digital da sua empresa: se está bagunçada ou desatualizada, a impressão que fica é essa mesma.</p>
<h2>Quais informações não podem faltar?</h2>
<p>Parece óbvio, mas perfis incompletos ainda são comuns. Antes de pensar em qualquer estratégia mais avançada, confira se o essencial está resolvido:</p>
<ul>
<li><strong>Nome correto</strong> — o mesmo que aparece na fachada e nos documentos da empresa.</li>
<li><strong>Categorias certas</strong> — elas dizem ao Google o que a sua empresa faz e ajudam a aparecer nas buscas certas.</li>
<li><strong>Horários atualizados</strong> — inclusive feriados e mudanças de temporada. Horário errado afasta cliente.</li>
<li><strong>Telefone e WhatsApp</strong> — com um número que alguém realmente atende.</li>
<li><strong>Endereço conferido</strong> — com rota funcionando certinho no Maps.</li>
<li><strong>Link do site</strong> — para quem quer saber mais antes de falar com você.</li>
</ul>
<h2>Fotos importam mesmo?</h2>
<p>Importam. Foto boa de fachada, de interior, de produto e de equipe ajuda o cliente a reconhecer o seu negócio e a criar uma expectativa realista. Fotos antigas ou escuras comunicam descuido. Não precisa de produção sofisticada: precisa de luz, limpeza e atualização frequente. Se você reformou a loja, registre. Se trocou o cardápio, fotografe.</p>
<h2>E as avaliações dos clientes?</h2>
<p>Avaliações são uma das primeiras coisas que as pessoas leem. Incentive clientes satisfeitos a avaliar — de forma honesta, sem comprar avaliação nem prometer brinde em troca de nota. E responda todas: as boas com gratidão, as críticas com serenidade e solução. A resposta pública mostra para os próximos leitores como a sua empresa trata gente.</p>
<h2>Vale a pena usar publicações no perfil?</h2>
<p>Vale. O Perfil da Empresa no Google permite publicar novidades, avisos e destaques que aparecem direto na ficha. É um espaço pouco usado pela maioria das empresas locais — e justamente por isso chama atenção quando é bem usado. Uma publicação simples sobre horário especial ou lançamento já comunica que alguém cuida daquele perfil.</p>
<blockquote>Um perfil completo não garante a primeira posição no Google. Mas um perfil parado, com horário errado e sem resposta, praticamente garante que o cliente passe direto.</blockquote>
<h2>Por onde começar hoje?</h2>
<p>Faça uma revisão honesta: abra o perfil como se fosse um cliente, confira cada informação, atualize as fotos, responda o que está pendente e marque um lembrete mensal para repetir o processo. Gerenciar o perfil é rotina, não evento de uma vez só. Consistência vence esforço isolado.</p>
<p>Se quiser uma ajuda para organizar essa rotina — ou para integrar o perfil com o resto da sua presença digital — fale com a MK Creative. Converse com a nossa equipe de <a href="/#/servicos/google-seo-local">Google &amp; SEO Local</a>: a gente senta junto, olha o perfil com calma e monta um plano que caiba na sua realidade. Sem promessa mágica, com trabalho bem feito.</p>`,
    coverAlt:
      "Tela de celular exibindo o Perfil da Empresa no Google com fotos, horários e avaliações visíveis",
    seoTitle: "Perfil da Empresa no Google: o básico esquecido",
    seoDescription:
      "Informações completas, categorias, horários, fotos e avaliações: o essencial do Perfil da Empresa no Google que decide se o cliente local fala com você.",
    focusKeyword: "perfil da empresa no google",
    featured: false,
  },
  {
    title: "Redes sociais de empresa local: consistência vale mais do que viralizar",
    slug: "redes-sociais-de-empresa-local-consistencia-vale-mais-que-viralizar",
    category: "Redes Sociais",
    tags: ["redes sociais para empresas", "linha editorial", "marketing local"],
    excerpt:
      "Viralizar é loteria; constância é patrimônio. Entenda como linha editorial, identidade e calendário realista constroem redes sociais que geram confiança para empresas locais.",
    content: `<p>Todo mundo quer aquele post que estoura. Mas negócio local não se constrói em um pico de alcance: se constrói em presença constante, com uma comunicação que a cidade reconhece. Consistência vale mais do que viralizar.</p>
<h2>O problema de correr atrás da viralização</h2>
<p>Post viral é loteria: depende de algoritmo, timing e sorte. Quando acontece, é ótimo. Mas quem monta a estratégia em cima disso vive na montanha-russa — uma semana com alcance alto, o mês seguinte com feed parado. Para uma empresa local, o que gera negócio não é o alcance de um dia, é a lembrança acumulada de meses.</p>
<h2>Por que uma linha editorial muda o jogo</h2>
<p>Linha editorial é um nome sofisticado para algo simples: definir o que a sua empresa fala, como fala e com que frequência. Com ela definida, o feed deixa de depender de inspiração do dia e passa a ter direção. Um ponto de partida enxuto:</p>
<ul>
<li><strong>O que você faz</strong> — serviços e produtos explicados com clareza, sem jargão.</li>
<li><strong>Bastidores</strong> — como o trabalho acontece, quem faz, com que cuidado.</li>
<li><strong>Rotina e clientes</strong> — entregas, atendimentos, o dia a dia que gera confiança.</li>
<li><strong>Cidade e região</strong> — datas, parceiros e pautas locais que aproximam.</li>
</ul>
<h3>Identidade: ser reconhecido antes do clique</h3>
<p>Cores, tipografia, tom de voz, jeito de escrever legenda. Quando tudo conversa, o seguidor reconhece o seu post antes de ler o nome da empresa. Esse reconhecimento é patrimônio: ele encurta a distância entre ver e confiar — e é o que diferencia um perfil amador de uma marca cuidada.</p>
<h2>Constância: o calendário que você consegue cumprir</h2>
<p>Melhor dois posts por semana durante o ano inteiro do que sete em uma semana e sumir no mês seguinte. Escolha uma frequência realista, monte um calendário simples e respeite o combinado consigo mesmo. Constância também é sinal de profissionalismo para quem visita o seu perfil: feed vivo indica empresa viva.</p>
<p>Se a rotina de conteúdo não está rolando, o problema costuma ser outro: tentar fazer tudo sozinho, sem pauta e sem processo. Definir responsáveis, antecipar ideias e aprovar antes da semana começar resolve mais do que qualquer truque de alcance.</p>
<h3>Formatos: escolha os que você sustenta</h3>
<p>Reels, stories, carrossel, foto simples: cada formato pede um esforço diferente. Vale mais dominar um ou dois formatos do que tentar estar em todos com pressa. O vídeo curto ajuda a mostrar bastidores e rosto — e rosto gera conexão. O carrossel serve para explicar processo. A foto direta resolve o dia em que a rotina não colaborou. O formato certo é aquele que você consegue produzir com qualidade, toda semana.</p>
<h2>O que esperar (e o que não prometer)</h2>
<p>Trabalho bem feito em redes sociais constrói reconhecimento, aproxima clientes e sustenta a reputação da marca. O que ninguém honesto pode prometer é faturamento certo ou engajamento garantido. Desconfie de quem vende número fechado. Prefira combinados claros: pautas, frequência, prazos e acompanhamento.</p>
<blockquote>Viralizar é sorte. Ser reconhecido na sua cidade é construção — post após post, semana após semana.</blockquote>
<p>Se as suas redes precisam de direção em vez de improviso, converse com a MK Creative. A gente ajuda a definir a linha editorial e a manter o ritmo — <a href="/#/servicos/redes-sociais">conheça nosso trabalho com redes sociais</a>. Sem pressão e sem promessa mágica: primeiro entendemos o seu negócio, depois montamos uma rotina que você consegue sustentar.</p>`,
    coverAlt:
      "Celular sobre o balcão de um comércio local mostrando um feed de redes sociais em construção",
    seoTitle: "Redes sociais para empresas: constância vale mais",
    seoDescription:
      "Linha editorial, identidade visual e constância: como redes sociais para empresas locais constroem reconhecimento real, sem depender de viralizar.",
    focusKeyword: "redes sociais para empresas",
    featured: false,
  },
  {
    title: "Mídia indoor: o que é e por que ela funciona para negócios locais",
    slug: "midia-indoor-o-que-e-e-por-que-funciona-para-negocios-locais",
    category: "Mídia Indoor",
    tags: ["mídia indoor", "publicidade local", "midia digital"],
    excerpt:
      "A tela que anuncia na fila do mercado, na farmácia e no salão: entenda o que é mídia indoor, por que a repetição fixa a marca e como funciona a rede própria da MK Creative.",
    content: `<p>Existe um tipo de publicidade que ninguém consegue rolar para cima nem pular: a tela que está ali, no balcão do mercado, na sala de espera da clínica, na parede da lanchonete. É a mídia indoor — e, para negócios locais, ela é uma das ferramentas mais subestimadas que existem.</p>
<h2>O que é mídia indoor?</h2>
<p>Mídia indoor é a veiculação de anúncios em telas digitais instaladas em pontos com circulação de pessoas: mercados, farmácias, salões, clínicas, pizzarias, academias. O conteúdo roda em loop, misturando informações do próprio estabelecimento com anúncios de outras empresas da região. Funciona como uma televisão em escala de cidade: quem está ali assiste, mesmo sem estar procurando nada.</p>
<h2>Por que a repetição ajuda a memorizar a marca</h2>
<p>Nenhuma marca é lembrada no primeiro contato. Memorização vem de exposição repetida — e o indoor entrega isso quase sem esforço. Quem está na fila do caixa vê a mesma sequência de anúncios por alguns minutos. Volta na semana seguinte e vê de novo. Esses encontros curtos e recorrentes acumulam familiaridade. E, quando a necessidade aparece, a marca familiar entra primeiro na lista de opções.</p>
<h2>Permanência e circulação: o contexto manda</h2>
<p>O grande diferencial do indoor é onde ele aparece. Diferente do outdoor, visto em segundos por quem passa de carro, o indoor atinge gente parada: fila, espera, atendimento. E diferente do celular — onde o seu anúncio disputa atenção com conversas, grupos e vídeos —, a tela indoor tem pouquíssima concorrência pelo olhar. O público está presente, com tempo e sem distração maior. Para o pequeno negócio, isso significa conversar com a vizinhança real, sem pagar por alcance que não serve.</p>
<h2>A rede própria da MK Creative</h2>
<p>Aqui vai um fato que faz diferença na hora de decidir: a MK Creative mantém <strong>rede própria de telas de mídia indoor</strong> em quatro cidades da região — <strong>Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio</strong>. Não somos intermediários de espaço de terceiros: cuidamos da rede, da programação e do conteúdo que roda nas telas. Para o anunciante, isso significa um canal local organizado, com peças produzidas pela mesma equipe que pensa a comunicação da sua marca de ponta a ponta. <a href="/#/midia-indoor">Conheça a rede de mídia indoor da MK Creative</a>.</p>
<h3>Como deve ser um bom anúncio de indoor</h3>
<p>Como a leitura é rápida e em movimento, a peça precisa respeitar o contexto:</p>
<ul>
<li>Uma ideia por anúncio: nome, o que você faz e como falar com você.</li>
<li>Texto grande e legível de longe, sem parágrafo dentro da tela.</li>
<li>Identidade visual coerente com o resto da marca — a tela reforça o que o cliente já viu em outros canais.</li>
</ul>
<h2>Quais negócios se beneficiam?</h2>
<ul>
<li>Comércios e serviços que dependem da vizinhança: mercados, oficinas, clínicas, salões e afins.</li>
<li>Empresas que precisam explicar o que fazem — o loop dá espaço para mensagem simples e direta.</li>
<li>Marcas novas na cidade, que precisam construir familiaridade com repetição constante.</li>
<li>Negócios que querem falar com cidades específicas, sem investir em mídia ampla demais.</li>
</ul>
<blockquote>Ninguém decide no primeiro contato. A mídia indoor existe para a sua marca estar presente, na cidade certa, quando a decisão amadurecer.</blockquote>
<p>Quer ver a sua marca girando nas telas da região? Fale com a MK Creative. A gente explica como a rede funciona, mostra os pontos e produz a peça junto com você — sem enrolação e sem promessa de milagre.</p>`,
    coverAlt:
      "Tela de mídia indoor em ponto de circulação local exibindo anúncios de empresas da região",
    seoTitle: "Mídia indoor: o que é e por que funciona",
    seoDescription:
      "Entenda o que é mídia indoor, como a repetição em telas locais constrói memorização e como funciona a rede própria da MK Creative em quatro cidades da região.",
    focusKeyword: "mídia indoor",
    featured: true,
  },
  {
    title: "Tráfego pago sem promessa mágica: o que avaliar antes de investir",
    slug: "trafego-pago-sem-promessa-magica-o-que-avaliar-antes-de-investir",
    category: "Marketing Digital",
    tags: ["tráfego pago", "anúncios", "marketing digital"],
    excerpt:
      "Anúncio não é botão mágico. Objetivo, oferta, público, destino do clique e acompanhamento: o que avaliar antes de investir em tráfego pago, sem promessa mágica de resultado.",
    content: `<p>“Investe que o retorno é garantido”: se alguém te vende tráfego pago com essa frase, desconfie. Anúncio pago é uma ferramenta séria, com lógica própria — e essa lógica começa muito antes de apertar o botão de impulsionar.</p>
<h2>Primeiro: qual é o objetivo?</h2>
<p>Campanha sem objetivo definido vira dinheiro aquecido. Vender mais? Fazer o telefone tocar? Divulgar um serviço novo? Cada objetivo pede formato, segmentação e mensagem diferentes. Antes de investir um real, escreva em uma frase o que precisa acontecer para a campanha ter valido a pena.</p>
<h2>A sua oferta está pronta para receber cliques?</h2>
<p>Anúncio bom não salva oferta confusa. Antes de escalar o investimento, avalie: o que você oferece, para quem, com que diferencial e com que chamada para ação clara. Se você mesmo não sabe responder rápido por que alguém escolheria a sua empresa em vez do concorrente, o anúncio vai amplificar essa dúvida — com verba.</p>
<h2>Para quem você vai falar?</h2>
<p>Segmentação é o coração do tráfego pago. Cidade, bairro, perfil de interesse, momento de compra: quanto mais honesto for o recorte, mais útil tende a ser cada clique. Alcance amplo parece bonito no relatório, mas clique errado custa igual. Para negócio local, vale focar em quem realmente pode comprar perto de você.</p>
<h2>Para onde o clique vai?</h2>
<p>Enviar tráfego para qualquer lugar é um dos desperdícios mais comuns. O destino precisa corresponder à promessa do anúncio: se o anúncio fala de um serviço específico, o clique deve cair numa página sobre esse serviço — <a href="/#/servicos/criacao-de-sites">com site preparado para receber esse visitante</a> — e não na home genérica, onde a pessoa se perde. Página lenta, sem informação de contato e sem próximos passos claros queima verba em tempo recorde.</p>
<h2>Acompanhamento: o que olhar toda semana</h2>
<ul>
<li>Quanto entrou e quanto saiu — investimento e o que ele gerou de contato.</li>
<li>De onde vieram os cliques e o que as pessoas fizeram depois de chegar.</li>
<li>Quais criações e mensagens se sustentam — e quais só gastam.</li>
<li>O que pode ser ajustado: público, texto, imagem ou destino.</li>
</ul>
<h2>Comece pequeno, aprenda rápido</h2>
<p>Outro erro comum é começar grande. Verba alta em campanha sem histórico é aprender no modo caro. Faz mais sentido começar com um investimento que não aperte, aprender com os primeiros contatos e escalar o que se sustenta. Anúncio é afinação: cada semana de dados reais vale mais do que qualquer palpite inicial — inclusive o nosso.</p>
<h2>O que ninguém deveria prometer</h2>
<p>Nenhum trabalho sério garante resultado. O que existe é método: hipótese, teste, leitura de dados e ajuste constante. Transparência sobre o que está funcionando — e sobre o que não está — vale mais do que projeção otimista em planilha. Exija acompanhamento de verdade, <em>não só print de alcance</em>.</p>
<blockquote>Tráfego pago não é botão mágico. É investimento com método: objetivo claro, oferta honesta, público certo e ajuste semanal.</blockquote>
<p>Se você quer investir em anúncios com os pés no chão, converse com a MK Creative. Nosso time de <a href="/#/servicos/trafego-pago">tráfego pago</a> começa entendendo o seu negócio — e só depois sugere verba. Sem promessa mágica, com trabalho de verdade.</p>`,
    coverAlt:
      "Notebook com painel de campanhas de tráfego pago aberto sobre uma mesa de trabalho",
    seoTitle: "Tráfego pago: o que avaliar antes de investir",
    seoDescription:
      "Objetivo, oferta, público, destino do clique e acompanhamento: o que avaliar antes de investir em tráfego pago, sem promessa mágica de resultado.",
    focusKeyword: "trafego pago",
    featured: false,
  },
  {
    title: "Site institucional: 7 pontos que ajudam sua empresa a ser encontrada",
    slug: "site-institucional-7-pontos-para-ser-encontrada",
    category: "Sites e SEO",
    tags: ["site institucional", "seo", "presença digital"],
    excerpt:
      "Estrutura clara, títulos, velocidade, mobile, conteúdo útil e Google integrado: 7 pontos que fazem o seu site institucional trabalhar de verdade para ser encontrado.",
    content: `<p>Ter um site hoje é fácil; ser encontrado é que é o trabalho. Um site institucional bem construído não é só cartão de visita bonito — é estrutura que ajuda o Google a entender quem você é, o que faz e para quem.</p>
<p>A boa notícia: nenhum dos pontos abaixo depende de truque. São decisões de construção e de manutenção que qualquer empresa pode cobrar de quem cuida do seu site — e que fazem diferença na hora de aparecer na busca certa, para o cliente certo. E eles se somam: um site rápido com estrutura confusa não resolve; conteúdo bom em site lento também não.</p>
<h2>Os 7 pontos que fazem diferença</h2>
<h3>1. Estrutura clara</h3>
<p>Menu simples, seções organizadas, caminho óbvio do primeiro clique até o contato. Se o visitante se perde, o Google também entende menos. Pense no site como uma loja: corredor largo, placa legível, caixa fácil de achar.</p>
<h3>2. Títulos e descrições que explicam</h3>
<p>Cada página precisa de título e descrição que digam, com palavras claras, do que ela trata. É por ali que o Google decide quando mostrar a sua página — e é ali também que a pessoa decide clicar. Título genérico vira invisibilidade.</p>
<h3>3. Velocidade</h3>
<p>Site pesado perde visitante antes da primeira rolagem. Imagem otimizada, código enxuto e hospedagem decente não são detalhe técnico: são respeito pelo tempo de quem chegou até você.</p>
<h3>4. Mobile de verdade</h3>
<p>Boa parte das buscas locais acontece pelo celular. Se o site não funciona bem na tela pequena — botão apertado, texto minúsculo, telefone impossível de clicar —, o visitante volta para o resultado da busca e escolhe o concorrente.</p>
<h3>5. Conteúdo útil</h3>
<p>Uma página de serviço bem explicada vale mais que dezenas de posts vazios. Descreva o que você faz, para quem, como funciona e quais dúvidas costumam aparecer. Conteúdo útil atrai a busca certa e separa o curioso do cliente de verdade.</p>
<h3>6. Dados de contato acessíveis</h3>
<p>Telefone, WhatsApp, endereço e horários à mão, em todas as páginas. Se encontrar o seu contato for um quebra-cabeça, a maioria desiste antes de terminar. Facilite até para quem tem pressa.</p>
<h3>7. Google integrado</h3>
<p>Site e <strong>Perfil da Empresa no Google</strong> precisam trabalhar juntos: mesmas informações, mesmo horário, mesmo endereço. Essa coerência ajuda o Google a confiar nos seus dados — e ajuda o cliente a não se confundir. Se quiser ir além, converse com a nossa equipe de <a href="/#/servicos/google-seo-local">Google &amp; SEO Local</a>.</p>
<h2>Encontrável é um trabalho contínuo</h2>
<p>Site não é contrato de uma vez: é presença que se mantém. Conteúdo atualizado, correções, páginas novas de serviço, acompanhamento de como as pessoas chegam até você. Nada disso exige milagre — exige rotina. E rotina é o que separa um site que trabalha de um site que apenas existe.</p>
<blockquote>Site bonito que ninguém encontra é cartão de visita guardado na gaveta. Encontrável é o que transforma site em porta de entrada.</blockquote>
<p>Quer avaliar se o seu site passa nesses 7 pontos? Fale com a MK Creative. A gente analisa, aponta o que dá para melhorar e, se fizer sentido, propõe um projeto — <a href="/#/servicos/criacao-de-sites">conheça nosso trabalho de criação de sites</a>. Sem compromisso e sem pressão.</p>`,
    coverAlt:
      "Notebook exibindo um site institucional com menu claro e páginas de serviço organizadas",
    seoTitle: "Site institucional: 7 pontos para ser encontrado",
    seoDescription:
      "Estrutura, títulos, velocidade, mobile, conteúdo útil, contato e integração com o Google: 7 pontos que ajudam seu site institucional a ser encontrado.",
    focusKeyword: "site institucional",
    featured: false,
  },
  {
    title: "Da tela do celular à fachada: por que presença digital e física precisam conversar",
    slug: "da-tela-do-celular-a-fachada-presenca-digital-e-fisica-precisam-conversar",
    category: "Comunicação e Marca",
    tags: ["presença digital e física", "marca", "jornada do cliente"],
    excerpt:
      "Do Google à fachada: o cliente cruza o digital e o físico antes de comprar. Entenda por que presença digital e física precisam conversar — e como alinhar os pontos.",
    content: `<p>O cliente de hoje não vive em um só mundo. Ele te encontra no Google, te vê no feed, entra no site, passa pela sua tela na fila do mercado e chega na porta da loja. Se cada um desses encontros contar uma história diferente, a marca vira ruído.</p>
<h2>A jornada não é só digital — nem só física</h2>
<p>Existe uma disputa antiga entre “marketing digital” e “marketing tradicional”, como se fossem times rivais. Para quem tem negócio local, essa divisão não ajuda em nada. O cliente transita: pesquisa no celular, anota, passa na rua, reconhece (ou não) a fachada, lembra do anúncio que viu no balcão. Cada toque alimenta a mesma decisão.</p>
<h2>Como os pontos se conectam</h2>
<p>Veja um caminho comum, feito de encontros pequenos:</p>
<ul>
<li><strong>Google</strong> — a pessoa busca o serviço e encontra o seu Perfil da Empresa, com horário, fotos e avaliações.</li>
<li><strong>Feed</strong> — segue o perfil, vê bastidores, começa a reconhecer o jeito da sua marca falar.</li>
<li><strong>Site</strong> — quer detalhe e acha a página certa, com contato fácil de achar.</li>
<li><strong>Tela indoor</strong> — dias depois, na fila do mercado da cidade, a sua marca aparece de novo.</li>
<li><strong>Fachada</strong> — passa na rua e reconhece a loja: mesma cor, mesmo nome, mesma cara do digital.</li>
</ul>
<p>Nenhum desses toques, sozinho, fecha negócio. A soma deles constrói confiança — e confiança é o que encurta a decisão de compra.</p>
<h2>O que quebra essa conversa</h2>
<p>Quase sempre são detalhes: logo com cor diferente em cada canal, horário divergente entre Google e fachada, site sem telefone, comunicação visual desalinhada com a identidade que a empresa usa online. Nada disso é crime — mas tudo isso cobra juros em confusão e desconfiança.</p>
<h2>Como alinhar o digital e o físico</h2>
<ul>
<li>Padronize a identidade: cores, tipografia e tom de voz em todos os canais.</li>
<li>Confirme as informações: horário, endereço e contato iguais no Google, no site, nas redes e na fachada.</li>
<li>Pense em campanhas de ponta a ponta: o que roda na <a href="/#/midia-indoor">mídia indoor</a> pode ecoar no feed — e vice-versa.</li>
<li>Cuide do mundo físico com o mesmo capricho do mundo digital.</li>
</ul>
<h2>Um teste simples para fazer hoje</h2>
<p>Percorra a jornada do seu próprio negócio como cliente: busque a empresa no Google, entre no perfil, visite o site, veja as redes, passe em frente à loja. Anote cada vez que algo parecer de outra marca — cor diferente, horário diferente, tom diferente. Essa lista de atritos é o seu mapa de correção. Alinhar é mais barato do que reconquistar quem desistiu no meio do caminho.</p>
<blockquote>A sua marca não vive em um canal. Ela vive na soma de todos os encontros que o cliente tem com ela — da tela do celular à fachada.</blockquote>
<h2>A ideia que resume a MK Creative</h2>
<p>Do Google à fachada. Da tela do celular à presença da sua marca no mundo real. É assim que a gente enxerga comunicação: digital e físico não competem, se completam. Se essa visão faz sentido para você, <a href="/#/">converse com a gente</a> — a primeira conversa serve para entender o seu momento, não para vender pressa.</p>`,
    coverAlt:
      "Fachada de comércio local com identidade visual alinhada à marca digital, ao lado de um celular exibindo o perfil da empresa",
    seoTitle: "Presença digital e física: por que precisam conversar",
    seoDescription:
      "Google, feed, site, tela indoor e fachada: entenda por que presença digital e física precisam conversar para a sua marca ser lembrada na sua cidade.",
    focusKeyword: "presença digital e física",
    featured: true,
  },
  {
    title: "Comunicação visual: como a fachada influencia a decisão de entrar na loja",
    slug: "comunicacao-visual-como-a-fachada-influencia-a-decisao-de-entrar-na-loja",
    category: "Comunicação e Marca",
    tags: ["comunicação visual", "fachada", "letras caixa"],
    excerpt:
      "ACM, letras caixa e letreiro com coerência digital: como a comunicação visual da fachada trabalha todos os dias na decisão do cliente de entrar na loja.",
    content: `<p>Antes do anúncio, antes do post, antes do site: existe a fachada. Ela trabalha todos os dias, para quem passa a pé, para quem passa de carro e para quem só lembra dela depois. Para um comércio local, é o primeiro — e mais constante — anúncio da marca.</p>
<h2>A fachada é o primeiro anúncio da sua empresa</h2>
<p>Pense em quão rápido uma decisão acontece na rua: poucos segundos para notar, entender o que é a loja e decidir se entra, volta depois ou passa direto. Nesse instante, a fachada fala por você. Uma fachada clara, iluminada e bem cuidada convida. Uma fachada apagada, com placa danificada ou informação confusa, pede desculpas antes de se apresentar. E, diferente do anúncio digital, ela não tem botão de pausa: ou está bem cuidada, ou está comunicando o contrário.</p>
<h2>ACM, letras caixa e letreiro: o que cada elemento faz</h2>
<p>Comunicação visual bem feita é escolha de material, desenho e execução trabalhando juntos. Alguns componentes resolvem quase tudo:</p>
<ul>
<li><strong>ACM</strong> — o revestimento que dá acabamento limpo e resistência à fachada, base para o resto da composição.</li>
<li><strong>Letras caixa</strong> — volume e presença: o nome ganha relevo, sombra e leitura de longe, de dia e de noite com iluminação.</li>
<li><strong>Letreiro</strong> — a comunicação direta: o que a loja é e o que oferece, em leitura rápida.</li>
</ul>
<p>O conjunto certo depende do ponto, do movimento da rua e da identidade da marca. Não existe receita única — existe projeto pensado.</p>
<h2>Coerência com a identidade digital</h2>
<p>Aqui está o detalhe que muita empresa esquece: a fachada precisa conversar com o que o cliente já viu no celular. Mesma cor, mesmo logo, mesma cara. Quando a pessoa reconhece a loja por causa do perfil que segue, o caminho até a entrada fica mais curto. Quando as versões não batem, nasce aquela hesitação: “é essa mesma?”. E hesitação é espaço aberto para o concorrente.</p>
<h2>A rua também define o projeto</h2>
<p>Fachada boa começa com leitura do contexto. De que lado o sol bate? A rua tem movimento de pedestre ou de carro? O ponto é estreito ou largo? Cada resposta muda a decisão de material, de altura da letra, de iluminação e de contraste. Projeto copiado de outra loja quase sempre desperdiça dinheiro — o que funcionou ali pode não funcionar no seu ponto. Por isso, avaliação presencial vem antes de qualquer proposta.</p>
<h2>O que avaliar antes de investir</h2>
<ul>
<li>Leitura de longe: o nome se entende a quantos passos de distância?</li>
<li>Iluminação: à noite, a fachada continua trabalhando por você?</li>
<li>Conservação: peça amarelada, ferrugem ou lâmpada queimada comunicam mais do que qualquer frase.</li>
<li>Padronização: as cores e o logo batem com o que a marca usa no digital?</li>
</ul>
<blockquote>O cliente decide em segundos se entra ou passa direto. A fachada é o seu argumento nesse exato instante.</blockquote>
<p>Se chegou a hora de a sua fachada trabalhar como anúncio de verdade, fale com a MK Creative. Nosso time de <a href="/#/servicos/comunicacao-visual">comunicação visual</a> avalia o ponto, propõe o projeto e executa — do ACM às letras caixa. Sem pressão: a conversa começa com uma visita e termina (ou não) com um orçamento honesto.</p>`,
    coverAlt:
      "Fachada de loja com revestimento de ACM e letras caixa iluminadas ao anoitecer",
    seoTitle: "Comunicação visual: a fachada que faz entrar",
    seoDescription:
      "ACM, letras caixa e letreiro com coerência digital: como a comunicação visual da fachada influencia a decisão do cliente de entrar na loja todos os dias.",
    focusKeyword: "comunicação visual",
    featured: false,
  },
];
