# MK Creative — refinamento 2.1

Código completo Next.js/React/TypeScript. Esta revisão evolui o projeto 2.0, mantém a composição do header, o painel, as APIs e o schema PostgreSQL. Não houve publicação ou acesso ao banco de produção.

## Direção visual

- Paleta marfim, grafite e laranja, alinhada à identidade existente; o verde da composição anterior dá lugar a cores mais coerentes com a marca.
- Hero com contraste tipográfico, chamada editável, ilustração 3D exclusiva e seletor de canais com texto e destino próprios.
- Serviços com melhor hierarquia, ícones coerentes com cada oferta e destaque para criação de sites.
- Rede indoor com fotografia existente, fundo grafite e títulos editoriais. Galeria assimétrica no desktop, linear no celular.
- Manifesto laranja, processo, conteúdo, FAQ e formulário com espaçamento e acabamento revisados.
- Header mantém estrutura e estilo de navegação. Apenas paleta, áreas de toque e comportamento acessível foram ajustados.
- Regras responsivas para celular, tablet e desktop; botões com área mínima de toque, campos de 16 px e respeito a movimento reduzido.

## Correções e performance

- Lockfile reparado: a versão recebida falhava em npm ci com dependências ausentes de ajv/json-schema-traverse.
- Painel administrativo carregado sob demanda, em vez de entrar diretamente na carga inicial da página pública.
- Galeria ampliada agora navega apenas pelas peças do filtro selecionado.
- Lightbox com contenção de foco, Escape, setas, restauração de foco e preservação do estado anterior de rolagem.
- Menu mobile sem link contendo botão, com vínculo aria-controls, fechamento por Escape, contenção de foco, bloqueio de rolagem de fundo e fechamento ao entrar em desktop.
- Respostas fechadas do FAQ deixam de ser anunciadas como conteúdo aberto.
- Imagem principal com srcset, sizes, dimensões explícitas e prioridade de carregamento; sem nova biblioteca de animação.
- npm start usa Node.js e copia os arquivos estáticos necessários para a saída standalone; não exige mais Bun.

## Executar

1. Use Node.js 20.9 ou superior e npm.
2. Execute `npm ci`.
3. Copie `.env.example` para `.env` e configure seu PostgreSQL em `DATABASE_URL`.
4. Execute `npm run db:generate`.
5. Em banco novo, prepare o schema com `npm run db:push`. Esta atualização visual não requer migração ou alteração de tabelas existentes.
6. Desenvolvimento: `npm run dev`.
7. Produção local: `npm run build` e `npm start`.

Vercel: instalação `npm ci`, build `npm run build` e variável `DATABASE_URL`. A configuração Next.js standalone original foi mantida. Não envie credenciais no ZIP ou repositório.

## Conteúdo e edição

O banco continua tendo prioridade sobre os textos padrão. Os três títulos, subtítulo e selo da hero permanecem editáveis; a mudança não sobrescreve registros existentes. Serviços, URLs e textos editoriais estão em `src/components/site/pages/home.tsx`. O novo visual está em `home-studio.css`. FAQs, processo, indicadores, informações de contato e controles de visibilidade continuam usando os dados existentes.

A arte nova é conceitual: representa a conexão entre presença digital e física, não um cliente, instalação real ou resultado comercial. As peças da galeria são apresentadas como materiais dos serviços, não como cases comprovados de clientes.

A imagem principal cadastrada no painel continua na seção de rede. A ilustração da hero é um ativo fixo em `public/images/`, substituível no código. As rotas por hash foram preservadas; a migração para URLs reais e SEO renderizado no servidor continua sendo uma evolução separada.

## Validação desta versão

- Prisma Client gerado com sucesso.
- TypeScript: `npx tsc --noEmit` concluído sem erros.
- Build de produção Next.js concluído com sucesso, incluindo as rotas de API.
- Lockfile aceito por `npm ci --ignore-scripts --dry-run --no-audit --no-fund` após a correção. As dependências foram instaladas para compilar o projeto.
- Os arquivos WebP foram abertos e verificados; tamanhos aproximados: 640 px / 24 KB, 960 px / 44 KB, 1440 px / 85 KB.
- Limitação: o navegador do ambiente bloqueou acesso à prévia. Não foi possível concluir revisão visual renderizada em desktop/celular nem testes de interação no navegador. As regras responsivas e de teclado foram revisadas no código, mas precisam de homologação visual no ambiente de execução.
- Não foram testados login, leads, uploads, integrações ou banco de produção. O formulário mantém a integração existente.
- As capturas antigas da versão 2.0 não estão neste pacote para evitar confusão com a nova interface. O LEIA-ME-V2.md é histórico; suas afirmações de testes não representam a versão 2.1.

## Referências

Pesquisa de direção, sem copiar ativos, código ou layouts:
- https://www.instrument.com/ — apresentação integrada de marca, produto e marketing.
- https://www.instrument.com/work/ — organização de trabalhos e experiências digitais.
- https://wearecollins.com/case-studies/ — expressão de identidade e apresentação de projetos.

## Arte gerada

Criada com a ferramenta integrada GPT Image. Arquivos no projeto: `public/images/mk-conexao-640.webp`, `mk-conexao-960.webp` e `mk-conexao-1440.webp`.

Prompt utilizado: “Use case: stylized-concept. Asset type: premium Brazilian creative agency website hero artwork. Create a stunning editorial 3D still life representing the connection of digital design and physical advertising: a large sculptural continuous orange ribbon forming an upward looping arrow, weaving around a matte graphite standing rectangular outdoor display and a smaller brushed aluminium floating browser-like rectangular frame. Display faces contain bold minimalist abstract orange and cream geometric graphic compositions, NO letters, NO words, NO logos, NO small UI. Sophisticated art direction, sculptural objects, tangible matte and polished material contrast, dramatic soft studio shadows, warm ivory seamless background #f5f3ed. Composition is square, object ensemble centered with ample 12% clear margin, angled perspective, physical credible lighting, ultra refined high-end design studio campaign photography meets 3D illustration. Restrained orange #f56a23, carbon black, ivory, silver. No gradients as backgrounds, no purple, no stock business icons, no people, no rockets.”
