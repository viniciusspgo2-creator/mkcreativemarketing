// ─────────────────────────────────────────────────────────────
// MK Creative — Conteúdo institucional dos 6 serviços
// Regras: nada inventado — sem números, prazos, preços, clientes,
// promessas de ranking. Português revisado ("gerenciar").
// ─────────────────────────────────────────────────────────────

export type ServiceKey =
  | "GOOGLE_SEO"
  | "REDES_SOCIAIS"
  | "TRAFEGO_PAGO"
  | "CRIACAO_SITES"
  | "MIDIA_INDOOR"
  | "COMUNICACAO_VISUAL";

export type Service = {
  key: ServiceKey;
  slug: string;
  nav: string;
  icon: "google" | "social" | "target" | "site" | "screen" | "store";
  cardTitle: string;
  cardText: string;
  cardCta: string;
  accent?: boolean;
  h1: string;
  heroKicker: string;
  lead: string;
  intro: string[];
  deliverablesTitle: string;
  deliverables: { title: string; text: string }[];
  forWho?: string;
  process?: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  cta: { title: string; text: string; label: string };
  seo: { title: string; description: string };
};

export const SERVICES: Service[] = [
  {
    key: "GOOGLE_SEO",
    slug: "google-seo-local",
    nav: "Google & SEO Local",
    icon: "google",
    cardTitle: "Google & SEO Local",
    cardText: "Gestão estratégica do Perfil da Empresa no Google com foco no fortalecimento da presença local na Pesquisa Google e no Google Maps.",
    cardCta: "Conheça nossa gestão Google",
    h1: "Google & SEO Local",
    heroKicker: "Pesquisa Google · Google Maps · Perfil da Empresa",
    lead: "Quando alguém procura o que você oferece na sua região, a sua empresa precisa estar lá — completa, atualizada e bem apresentada.",
    intro: [
      "A MK Creative gerencia o Perfil da Empresa no Google (Google Business Profile) de negócios que dependem da presença local para atrair clientes. O trabalho vai muito além de criar o perfil: é uma gestão contínua de informações, conteúdo e presença visual.",
      "Trabalhamos a integração entre o perfil, o site e as informações comerciais da empresa, com monitoramento e melhoria contínua — sempre dentro das boas práticas e das diretrizes do Google.",
    ],
    deliverablesTitle: "O que trabalhamos na sua presença no Google",
    deliverables: [
      { title: "Gestão do Perfil da Empresa no Google", text: "Administração profissional do seu Google Business Profile, mantendo a presença da empresa ativa, correta e bem cuidada." },
      { title: "Otimização das informações comerciais", text: "Nome, categorias, endereço, horários, telefone e atributos organizados com consistência — o mesmo NAP (nome, endereço e telefone) em todos os canais." },
      { title: "SEO Local", text: "Estruturação das informações e do conteúdo para fortalecer a relevância da empresa nas buscas da sua região, na Pesquisa Google e no Maps." },
      { title: "Produtos e serviços", text: "Organização e descrição do que a empresa oferece, com destaque para os serviços que realmente importam para o cliente buscar." },
      { title: "Conteúdos e atualizações", text: "Publicações periódicas no perfil — novidades, ofertas e informações — para mostrar uma empresa ativa e presente." },
      { title: "Gestão de avaliações", text: "Acompanhamento das avaliações e suporte no processo de resposta, fortalecendo a confiança de quem está pesquisando." },
      { title: "Imagens e presença visual", text: "Curadoria e atualização de fotos que apresentam a empresa de forma profissional e convidativa." },
      { title: "Integração Google + site + informações comerciais", text: "Coerência entre o que o cliente encontra no Google, no site e nos demais canais da empresa." },
      { title: "Monitoramento e melhoria contínua", text: "Acompanhamento dos dados de desempenho da presença e evolução constante do trabalho." },
    ],
    forWho: "Para negócios locais de qualquer porte que atendem clientes na sua região — comércios, prestadores de serviço, clínicas, restaurantes, indústrias com atendimento direto. Se o seu cliente procura no Google antes de comprar, esse trabalho é para você.",
    faq: [
      { q: "A MK garante o primeiro lugar no Google?", a: "Não — e desconfie de quem prometer. O posicionamento nos resultados de busca é definido pelo Google e depende de diversos fatores, como concorrência e região. O que fazemos é um trabalho técnico e de conteúdo consistente para fortalecer a presença da sua empresa, sempre dentro das diretrizes do Google." },
      { q: "Em quanto tempo vejo resultado no Google?", a: "Cada caso é diferente. Correções de informações costumam refletir rápido; o fortalecimento da presença local é um trabalho contínuo, construído com consistência ao longo do tempo." },
      { q: "Minha empresa já tem um perfil no Google. Vale a pena a gestão?", a: "Ter o perfil criado é o primeiro passo. A gestão profissional trabalha otimização, conteúdo, avaliações e integração com o site — o que mantém a presença viva e competitiva." },
      { q: "O que minha empresa precisa fornecer?", a: "Informações comerciais corretas (endereço, horário, telefone), fotos reais e contexto sobre os serviços. A MK organiza tudo e conduz o trabalho." },
    ],
    cta: {
      title: "Sua empresa merece aparecer bem no Google",
      text: "Vamos entender a sua situação atual e mostrar como trabalhamos a presença local da sua empresa.",
      label: "Falar sobre Google & SEO Local",
    },
    seo: {
      title: "Google & SEO Local — Gestão do Perfil da Empresa no Google",
      description: "Gestão do Perfil da Empresa no Google, SEO Local, informações comerciais, produtos e serviços, avaliações e integração com o site. Para negócios locais em São José do Rio Preto e região.",
    },
  },
  {
    key: "REDES_SOCIAIS",
    slug: "gestao-redes-sociais",
    nav: "Redes Sociais",
    icon: "social",
    cardTitle: "Redes Sociais",
    cardText: "Planejamento, criação e gestão de conteúdo para empresas que precisam construir uma presença digital profissional, consistente e alinhada à sua identidade.",
    cardCta: "Conheça nossa gestão de redes sociais",
    h1: "Gestão de Redes Sociais",
    heroKicker: "Planejamento · Criação · Gestão de conteúdo",
    lead: "Presença digital profissional, consistente e alinhada à identidade da sua marca.",
    intro: [
      "As redes sociais são um dos principais pontos de contato entre a empresa e o cliente — e exigem muito mais do que publicar por publicar. A MK Creative planeja, cria e gerencia o conteúdo das redes da sua empresa com estratégia e identidade.",
      "Trabalhamos para que cada publicação tenha propósito: apresentar a empresa, gerar valor para o público e fortalecer a marca de forma consistente.",
    ],
    deliverablesTitle: "Como trabalhamos",
    deliverables: [
      { title: "Planejamento", text: "Entendimento do negócio, do público e dos objetivos para definir uma linha editorial com propósito — não apenas uma grade de posts." },
      { title: "Criação de conteúdo", text: "Produção de peças alinhadas à identidade visual da marca, com linguagem adequada para cada rede e cada momento." },
      { title: "Gestão e consistência", text: "Publicação organizada e recorrente, mantendo a presença da empresa ativa e profissional ao longo do tempo." },
      { title: "Alinhamento à identidade", text: "Conteúdo que respeita e reforça a identidade da marca em todos os pontos de contato digitais." },
    ],
    process: [
      { title: "Entendimento", text: "Conversamos sobre a sua empresa, seu público e seus objetivos nas redes." },
      { title: "Linha editorial", text: "Definimos temas, formatos e frequência adequados à sua realidade." },
      { title: "Produção", text: "Criamos o conteúdo com a identidade visual e a linguagem da sua marca." },
      { title: "Publicação e acompanhamento", text: "Gerenciamos a publicação e acompanhamos a resposta do público para evoluir o trabalho." },
    ],
    forWho: "Para empresas que querem tratar as redes sociais como um canal profissional de presença e relacionamento — não como uma obrigação aleatória.",
    faq: [
      { q: "Quais redes vocês gerenciam?", a: "Trabalhamos com as principais redes relevantes para o seu negócio — Instagram, Facebook, LinkedIn, entre outras — sempre priorizando onde o seu público realmente está." },
      { q: "Vocês criam as artes ou eu preciso fornecer?", a: "A MK cuida da criação do conteúdo a partir da identidade da sua marca. Materiais e fotos reais da empresa são sempre bem-vindos e enriquecem o trabalho." },
      { q: "Quantos posts por mês?", a: "A frequência é definida no planejamento, de acordo com os objetivos e a realidade da sua empresa. O que não muda é o padrão de qualidade e consistência." },
    ],
    cta: {
      title: "Sua marca presente nas redes do seu cliente",
      text: "Vamos conversar sobre a presença digital da sua empresa e como a MK pode gerenciar esse trabalho.",
      label: "Falar sobre Redes Sociais",
    },
    seo: {
      title: "Gestão de Redes Sociais para empresas",
      description: "Planejamento, criação e gestão de conteúdo para redes sociais: presença digital profissional, consistente e alinhada à identidade da sua empresa. MK Creative, São José do Rio Preto/SP.",
    },
  },
  {
    key: "TRAFEGO_PAGO",
    slug: "trafego-pago",
    nav: "Tráfego Pago",
    icon: "target",
    cardTitle: "Tráfego Pago",
    cardText: "Planejamento e gerenciamento de campanhas digitais para ampliar a exposição das empresas e conectar suas ofertas a públicos relevantes.",
    cardCta: "Conheça nossas soluções de tráfego",
    h1: "Tráfego Pago",
    heroKicker: "Campanhas digitais · Anúncios · Públicos",
    lead: "Ampliar a exposição da sua empresa e conectar as suas ofertas a públicos relevantes.",
    intro: [
      "O tráfego pago coloca a sua empresa na frente de quem está procurando — ou pronto para procurar — o que você oferece. A MK Creative planeja e gerencia campanhas digitais com foco em exposição qualificada e objetivos claros.",
      "Cada campanha nasce de um objetivo: apresentar a empresa, divulgar uma oferta, gerar contatos. A partir daí, estruturamos públicos, criativos e acompanhamento.",
    ],
    deliverablesTitle: "O que envolve o trabalho",
    deliverables: [
      { title: "Planejamento de campanhas", text: "Definição de objetivos, público-alvo e abordagem adequada para cada momento da empresa." },
      { title: "Estrutura de anúncios", text: "Montagem das campanhas com segmentação de públicos, formatos e criativos alinhados à mensagem." },
      { title: "Gerenciamento contínuo", text: "Acompanhamento das campanhas, com ajustes para melhorar o desempenho ao longo do tempo." },
      { title: "Conexão com a oferta", text: "Integração entre o anúncio, o destino (site, perfil, WhatsApp) e a oferta da empresa — para o clique virar conversa." },
    ],
    forWho: "Para empresas que querem acelerar a exposição de forma profissional, com campanhas planejadas e geridas — em vez de impulsionar posts sem estratégia.",
    faq: [
      { q: "Vocês garantem resultado nas campanhas?", a: "Nenhum trabalho sério de tráfego pode garantir resultados — o desempenho depende de oferta, mercado, concorrência e verba. O que garantimos é planejamento profissional, gestão ativa e transparência no acompanhamento." },
      { q: "Qual valor devo investir?", a: "O investimento em mídia é definido junto com você, de acordo com o objetivo e o momento da empresa. A gestão da MK é independente do valor aplicado em anúncios." },
      { q: "Preciso ter um site?", a: "Não necessariamente — depende da estratégia. Campanhas podem levar para o site, para o perfil da empresa ou para o WhatsApp. Definimos o melhor caminho no planejamento." },
    ],
    cta: {
      title: "Pronto para ampliar a exposição da sua empresa?",
      text: "Conte o seu objetivo para a MK e receba uma proposta de campanhas alinhada à sua realidade.",
      label: "Falar sobre Tráfego Pago",
    },
    seo: {
      title: "Tráfego Pago — Planejamento e gestão de campanhas digitais",
      description: "Planejamento e gerenciamento de campanhas digitais para ampliar a exposição da sua empresa e conectar ofertas a públicos relevantes. MK Creative, São José do Rio Preto/SP.",
    },
  },
  {
    key: "CRIACAO_SITES",
    slug: "criacao-de-sites",
    nav: "Criação de Sites",
    icon: "site",
    cardTitle: "Criação de Sites",
    cardText: "Desenvolvimento de sites institucionais e landing pages pensados para unir apresentação profissional, experiência do usuário, estrutura de conteúdo e fundamentos de SEO.",
    cardCta: "Conheça nossos projetos web",
    h1: "Criação de Sites",
    heroKicker: "Sites institucionais · Landing pages · Fundamentos de SEO",
    lead: "Apresentação profissional, boa experiência e um site preparado para ser encontrado.",
    intro: [
      "O site é a casa digital da empresa — onde o cliente encontra informações completas, conhece os serviços e decide entrar em contato. A MK Creative desenvolve sites institucionais e landing pages que unem design, conteúdo e técnica.",
      "Cada projeto é construído com estrutura de conteúdo clara, hierarquia correta e fundamentos de SEO desde o início — não como um acessório adicionado depois.",
    ],
    deliverablesTitle: "Como construímos",
    deliverables: [
      { title: "Sites institucionais", text: "Presença digital completa para apresentar a empresa, seus serviços e seus diferenciais." },
      { title: "Landing pages", text: "Páginas focadas em conversão para campanhas, ofertas e lançamentos específicos." },
      { title: "Experiência do usuário", text: "Navegação simples, leitura confortável e caminhos claros até o contato — no celular e no computador." },
      { title: "Estrutura de conteúdo", text: "Organização das informações com hierarquia clara, pensando em como o cliente procura e decide." },
      { title: "Fundamentos de SEO", text: "Estrutura técnica correta, títulos, descrições, URLs amigáveis e dados estruturados desde a concepção." },
      { title: "Performance", text: "Páginas rápidas e leves, porque velocidade é parte da experiência e do bom posicionamento." },
    ],
    process: [
      { title: "Briefing", text: "Entendemos a empresa, os objetivos do site e o público que ele precisa conversar." },
      { title: "Estrutura", text: "Definimos arquitetura da informação e o conteúdo de cada página." },
      { title: "Design e desenvolvimento", text: "Criamos o layout e desenvolvemos com performance e SEO embutidos." },
      { title: "Entrega e evolução", text: "Publicação, acompanhamento e estrutura pronta para crescer junto com a empresa." },
    ],
    faq: [
      { q: "O site já vem otimizado para o Google?", a: "Todo site da MK sai com os fundamentos de SEO implementados: estrutura técnica, títulos, descrições, URLs amigáveis, dados estruturados e performance. O alcance dos resultados depende também de conteúdo e contexto competitivo." },
      { q: "Consigo atualizar o conteúdo depois?", a: "Sim. Os sites da MK podem ser entregues com painel administrativo para você gerenciar textos, imagens, artigos e seções sem depender de desenvolvedor." },
      { q: "Fazem sites com loja online ou sistema próprio?", a: "O foco da MK é sites institucionais e landing pages. Para necessidades específicas, conversamos sobre o escopo e indicamos o melhor caminho." },
    ],
    cta: {
      title: "Sua empresa merece um site à altura",
      text: "Conte o seu objetivo e receba uma proposta de site com design, conteúdo e técnica trabalhados juntos.",
      label: "Falar sobre Criação de Sites",
    },
    seo: {
      title: "Criação de Sites institucionais e landing pages",
      description: "Desenvolvimento de sites institucionais e landing pages com apresentação profissional, experiência do usuário, estrutura de conteúdo e fundamentos de SEO. MK Creative, São José do Rio Preto/SP.",
    },
  },
  {
    key: "MIDIA_INDOOR",
    slug: "midia-indoor",
    nav: "Mídia Indoor",
    icon: "screen",
    cardTitle: "Mídia Indoor",
    cardText: "Rede de telas digitais instalada em estabelecimentos comerciais de quatro cidades da região: Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio. Campanhas recorrentes em ambientes com circulação e permanência de público.",
    cardCta: "Anuncie nas telas da MK",
    accent: true,
    h1: "Mídia Indoor",
    heroKicker: "Rede de telas digitais · 4 cidades da região",
    lead: "Sua marca em exibição recorrente nas telas que os seus clientes veem no dia a dia.",
    intro: [
      "A mídia indoor coloca a sua marca em telas digitais instaladas dentro de estabelecimentos comerciais — ambientes onde as pessoas circulam, esperam, consomem. É exposição recorrente, no momento certo, no lugar certo.",
      "A MK Creative possui e opera a própria rede de telas em quatro cidades da região de São José do Rio Preto, com campanhas exibidas de maneira recorrente para anunciantes locais.",
    ],
    deliverablesTitle: "Por que anunciar em telas indoor",
    deliverables: [
      { title: "Presença recorrente", text: "O anúncio entra na programação das telas e é exibido de forma recorrente, criando memorização da marca." },
      { title: "Ambientes com público", text: "As telas ficam em estabelecimentos comerciais com circulação e permanência de pessoas — o anúncio é visto durante o tempo de permanência." },
      { title: "Alcance local real", text: "Anúncio voltado para o público que circula nas cidades onde a sua empresa atua." },
      { title: "Produção da MK", text: "A MK produz a arte do anúncio no formato adequado para exibição nas telas, respeitando a identidade da sua marca." },
    ],
    faq: [],
    cta: {
      title: "Sua marca nas telas da sua cidade",
      text: "Fale com a MK e descubra como anunciar na rede de telas digitais.",
      label: "Quero anunciar",
    },
    seo: {
      title: "Mídia Indoor — Rede de telas digitais em 4 cidades",
      description: "Anuncie na rede de telas digitais da MK Creative: exibição recorrente em estabelecimentos comerciais de Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio.",
    },
  },
  {
    key: "COMUNICACAO_VISUAL",
    slug: "comunicacao-visual",
    nav: "Comunicação Visual",
    icon: "store",
    cardTitle: "Comunicação Visual",
    cardText: "Soluções de comunicação visual para empresas que querem transformar sua identidade em presença física.",
    cardCta: "Solicite um projeto",
    h1: "Comunicação Visual",
    heroKicker: "Fachadas · Letras caixa · Letreiros · Projetos empresariais",
    lead: "Transformar a identidade da sua marca em presença física.",
    intro: [
      "A comunicação visual é a sua marca no mundo real: na fachada, na entrada, no ambiente. É ela que faz o cliente reconhecer a empresa na rua e confiar antes mesmo de entrar.",
      "A MK Creative desenvolve projetos de comunicação visual que traduzem a identidade da marca em elementos físicos, com apresentação profissional e execução planejada.",
    ],
    deliverablesTitle: "O que projetamos",
    deliverables: [
      { title: "Fachadas comerciais", text: "Projetos de fachada que dão à sua empresa uma apresentação profissional e alinhada à identidade da marca." },
      { title: "Revestimentos em ACM", text: "Acabamentos em ACM para fachadas e ambientes, com aspecto moderno e durável." },
      { title: "Letras caixa", text: "Letras em relevo que dão profundidade e destaque à marca — iluminação e acabamentos conforme o projeto." },
      { title: "Letreiros e identificação visual", text: "Letreiros, placas e elementos de identificação para fachadas, interiores e pontos de atenção." },
      { title: "Projetos de comunicação visual empresarial", text: "Conjuntos completos de comunicação visual para empresas — do projeto à identificação dos espaços." },
    ],
    forWho: "Para empresas que estão abrindo, reformando ou querem elevar o padrão da sua apresentação física — da fachada ao ambiente interno.",
    faq: [
      { q: "Como funciona um projeto de comunicação visual?", a: "Começamos entendendo a sua marca, o espaço e o objetivo. A partir disso, desenvolvemos o projeto com apresentação visual, definição dos elementos e orientações para execução." },
      { q: "Vocês fazem a instalação?", a: "Cada projeto é conduzido de forma completa pela MK, do desenvolvimento à orientação para colocação. Os detalhes de cada etapa são definidos no escopo do projeto." },
    ],
    cta: {
      title: "Sua marca merece uma presença à altura",
      text: "Solicite um projeto de comunicação visual para a sua empresa.",
      label: "Solicite um projeto",
    },
    seo: {
      title: "Comunicação Visual — Fachadas, ACM, letras caixa e letreiros",
      description: "Projetos de comunicação visual: fachadas comerciais, revestimentos em ACM, letras caixa, letreiros, identificação visual e projetos empresariais. MK Creative, São José do Rio Preto/SP.",
    },
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const LEAD_SERVICES: { key: string; label: string }[] = [
  { key: "GOOGLE_SEO", label: "Google/SEO Local" },
  { key: "REDES_SOCIAIS", label: "Redes Sociais" },
  { key: "TRAFEGO_PAGO", label: "Tráfego Pago" },
  { key: "CRIACAO_SITES", label: "Criação de Site" },
  { key: "MIDIA_INDOOR", label: "Mídia Indoor" },
  { key: "COMUNICACAO_VISUAL", label: "Comunicação Visual" },
  { key: "OUTRO", label: "Outro" },
];

export const LEAD_STATUS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Novo", color: "bg-[#F3640A]/15 text-[#C2500A] border-[#F3640A]/30" },
  CONTACT: { label: "Em contato", color: "bg-amber-100 text-amber-800 border-amber-300" },
  PROPOSAL: { label: "Proposta", color: "bg-violet-100 text-violet-800 border-violet-300" },
  WON: { label: "Fechado", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  LOST: { label: "Perdido", color: "bg-stone-100 text-stone-600 border-stone-300" },
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
