# MK Creative — versão 2.0

Redesign da página inicial, refinamento do cabeçalho público e correções pontuais de navegação. Projeto completo em Next.js/React/TypeScript, preparado para continuar o fluxo de publicação na Vercel. Esta entrega não publica nem altera o banco de produção.

## O que mudou

- Hero com chamada curta, contraste reforçado, mockups de telas montados em CSS e seletor entre presença digital e mídia indoor. Usa as artes originais do projeto.
- Direção visual com fundo marfim, verde escuro, detalhes laranja, tipografia Bricolage Grotesque/Inter e espaçamentos responsivos.
- Serviços apresentados em seis cards com links diretos. A oferta aparece antes do aprofundamento em mídia indoor.
- Seção de rede com fotografia, mapa e indicadores do conteúdo existente.
- Galeria com filtros Digital/Mídia indoor e ampliação das peças; imagens com proporção preservada.
- Manifesto de marca, processo em quatro passos sem arraste obrigatório, compromisso/transparência, blog condicional, FAQ e formulário final.
- Nenhuma biblioteca de animação nova. Efeitos CSS leves, navegação por teclado e respeito à preferência por movimento reduzido.
- Conteúdos já editáveis (FAQ, processo, promessas, indicadores, contato e visibilidade de seções) continuam conectados ao painel. A chamada do hero continua editável. Textos editoriais novos e seleção da galeria estão em home.tsx.
- A imagem principal configurada no painel aparece na seção de rede. As outras duas imagens antigas do hero ficam preservadas no cadastro, mas não integram o novo layout.
- Componentes da home extraídos do padrão anterior de funções internas que remontavam a cada alteração de estado.

## Correções técnicas

- Categorias do blog reconhecidas em URLs como `#/blog?categoria=marketing`.
- Link “Pular para o conteúdo” move o foco sem disparar uma rota incorreta.
- Menu de soluções operado por clique e Escape, evitando conflito entre hover e clique.
- Botão compartilhado de WhatsApp sem botão interativo aninhado dentro de link.
- Erro de carregamento com opção de tentar novamente e limite de 15 segundos para o bootstrap.
- Importação de banco nos métodos de configuração passa a ocorrer dentro das operações de servidor, evitando inicialização de Prisma ao importar utilitários no cliente.
- Build não executa mais `db push --accept-data-loss`. Mudanças de schema são uma operação explícita e separada.
- Script de empacotamento portátil, sem caminho absoluto do computador anterior.
- `package-lock.json` acompanha as dependências efetivamente instaladas e verificadas. O ZIP usa npm e omite o bun.lock antigo.

## Como executar

1. Instale Node.js compatível com Next.js 16 (20.9 ou superior) e npm.
2. Execute `npm ci`.
3. Copie `.env.example` para `.env` e configure `DATABASE_URL` com o PostgreSQL da aplicação.
4. Execute `npm run db:generate`.
5. Para um banco novo, prepare o schema com `npm run db:push`. Para banco existente, revise o diff e mantenha backup antes de aplicar alterações de schema; o redesign não exige novas tabelas.
6. Execute `npm run dev` para desenvolvimento ou `npm run build` para compilação de produção.

Na Vercel: use instalação `npm ci`, build `npm run build` e a mesma variável `DATABASE_URL`. A estrutura de API e os schemas originais permanecem no projeto. Não envie `.env` com credenciais ao repositório.

## Se o site já tem conteúdo salvo

O banco tem prioridade sobre os valores padrão. Para obter a chamada das prévias, edite o hero no painel:

- Título A: `Sua marca.`
- Título B: `Impossível`
- Título C: `de ignorar.`
- Subtítulo: `Conectamos estratégia, design e mídia para colocar sua empresa em evidência. No digital, nas telas e na vida real.`

Nenhum conteúdo salvo foi sobrescrito automaticamente. O botão principal novo abre Contato; o secundário abre Mídia indoor. Seus rótulos e destinos estão em `src/components/site/pages/home.tsx`; os antigos campos de CTA do hero permanecem no modelo para compatibilidade, mas não são usados por essa composição.

## Validação e limites

- Build de produção Next.js concluído, incluindo TypeScript.
- ESLint dos arquivos alterados concluído sem erros.
- Chromium: larguras 375, 768 e 1440 px sem overflow horizontal.
- Troca de canal, filtros e ampliação da galeria verificados; nenhuma imagem quebrada ou exceção de JavaScript observada na home.
- Rotas Contato e Blog com categoria e estado de falha do bootstrap verificados.
- As prévias e verificações de interface usam respostas controladas da API com o conteúdo padrão e as cidades do seed original. Não representam uma conexão com o banco de produção.
- Cadastro real de leads, login administrativo, uploads e integrações externas não foram testados contra produção. Não houve publicação.
- A arquitetura de navegação por hash foi mantida. Para uma evolução de SEO, recomendo migrar páginas públicas para rotas reais do App Router com metadados gerados no servidor; isso exige um trabalho específico de URLs e redirecionamentos.
- O cabeçalho e estilos públicos receberam refinamentos compartilhados; as páginas internas e o painel administrativo não foram reconstruídos integralmente.

## Referências consultadas

A pesquisa orientou a direção; nenhum layout, script de terceiros ou ativo dessas empresas foi copiado.

- Locomotive: https://locomotive.ca/en/work — apresentação de trabalhos, disciplinas e contexto de projetos.
- Focus Media Brasil: https://focusmedia.com.br/ — comunicação de cobertura e presença de mídia indoor.
- Estação Indoor: https://estacaoindoor.com/ — organização de serviços de marketing digital.
- Motion, acessibilidade: https://motion.dev/docs/react-accessibility — referência sobre movimento reduzido.
- Motion no GitHub: https://github.com/motiondivision/motion — pesquisa de recursos; não foi necessário adicionar dependências.

As imagens em `previas/` são capturas da aplicação, não mockups gerados por IA.
