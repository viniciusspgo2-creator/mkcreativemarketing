# MK Creative 3.0

Projeto completo Next.js/React/TypeScript, com painel, APIs e PostgreSQL. Evolui a versão 2.1. Não houve publicação nem acesso ao banco de produção. O estilo de navegação do header foi mantido.

## Direção visual

Preto, laranja, branco e cinza neutro. Fundos claros sem o tom bege/verde anterior, tipografia mais direta, espaçamentos revisados, molduras discretas e contraste reforçado nas áreas escuras. A regra global de `.text-lead` que se sobrepunha às classes claras foi corrigida. Miniaturas de vídeos inativas deixam de ser escurecidas. A hero preserva a arte GPT Image anterior, agora substituível no painel. A página A MK ganhou uma faixa de fotografias também editáveis.

## Portfólio de sites

Na página Criação de Sites há três conceitos: Alva Arquitetura, Vértice Studio e Casa do Grão. São projetos fictícios, identificados como demonstração tanto no portfólio como nas páginas dos exemplos. Cada projeto tem imagem e uma página HTML navegável com seções, versão responsiva e contato da MK. Não há formulário que finja enviar dados ou clientes inexistentes apresentados como reais.

No painel, em **Portfólio**, é possível adicionar/remover, ordenar, ocultar, alterar textos, imagem e URL. Ao substituir um exemplo por trabalho real, atualize seus dados e desative o selo de demonstração. Itens novos começam ocultos.

## Vimeo e vídeos sem áudio

O cadastro e a edição agora preservam o endereço completo e o hash de privacidade `h` do Vimeo — antes esse código era descartado ao salvar. São aceitos links públicos, não listados com hash no caminho ou na query, URLs de player e iframe oficial copiado do Vimeo.

Selecionar uma miniatura inicia aquele vídeo. Apenas o player ativo é montado, mantendo desempenho. Vídeos verticais usam proporção vertical. O player configura reprodução inline e mudo. Para Vimeo, o SDK oficial mantém o volume zerado e o estado mudo inclusive em eventos de mudança de volume, oculta volume/unmute e desativa atalhos nativos. Há controles de pausar/reproduzir, indicação “Sem áudio” e mensagem de erro com tentativa novamente. YouTube usa embed mudo e comandos da API para manter silêncio. O vídeo local do menu continua mudo.

Se um vídeo não listado antigo perdeu seu hash na versão anterior, o código não pode reconstruí-lo. Em **Mídia Indoor**, edite a mídia e cole novamente o link completo de compartilhamento ou embed. O Vimeo também deve permitir incorporação no domínio onde o site estiver hospedado. Não foram alteradas permissões da conta Vimeo e não foi possível homologar streams reais no navegador deste ambiente.

## Content Studio

| Área | Controles |
|---|---|
| Home | Hero, títulos, CTA e destinos, processo, FAQ, compromissos, indicadores, visibilidade e ordem das seções |
| Textos das páginas | Catálogo pesquisável de textos da home, serviços, indoor, A MK, contato, blog, documentos, header, rodapé, formulários e componentes |
| Serviços | Nomes de exibição, introduções, entregas, público, processo, FAQ, CTA e SEO das seis páginas existentes |
| Portfólio | Projetos, imagens, links, categorias, descrições, ordem e status de demonstração |
| Imagens | Hero, fotos da rede e A MK, imagens dos serviços, logos, favicon, imagem social, vídeo/capa do menu e galeria da home |
| Rede | FAQ, etapas, formatos e canais da hero. Cidades e mídias reais continuam no gerenciador Mídia Indoor |
| SEO | Título e descrição por página, imagem social, Analytics, Search Console e Meta Pixel |
| Empresa | Dados institucionais, endereço, contato, redes sociais e contador público |
| Aparência | Cores base, fonte dos títulos, tamanho base, arredondamento, manutenção e ativação das métricas internas |

O layout é composto por componentes do projeto. O editor controla conteúdo e opções disponibilizadas; não é um construtor visual livre de HTML/CSS. URLs e identificadores internos dos serviços são preservados para não quebrar links. Não se promete criação arbitrária de novos tipos de página pelo painel.

O editor tem busca, rascunho local recuperável, aviso ao sair com alterações, desfazer, exportação/importação JSON validada e barra persistente de salvamento. As configurações são validadas e gravadas em transação. Um identificador de revisão detecta alterações de outra sessão para evitar sobrescrita silenciosa; em conflito, exporte seu rascunho e recarregue para comparar.

A rota de upload ausente foi implementada: sessão autenticada, arquivo de até 4 MB, validação, conversão em WebP e armazenamento no banco. SVG enviado é rasterizado, sem servir código ativo. Campos de imagem também permitem reutilizar arquivos já enviados. Ativos incluídos no código continuam como arquivos estáticos.

Blog, leads, cidades, mídias, tarefas e configurações de conta foram mantidos. O painel recebeu organização e acabamento novos. Foram corrigidos estados de erro no editor, upload, salvamento de mídia, dashboard e carregamento do blog; campos e formulários usam IDs estáveis e únicos.

## Métricas, integrações e SEO

É possível ocultar o contador público e desativar as métricas internas. A navegação administrativa não é contabilizada como visita pública. A contagem de 30 dias deixa de depender do filtro de 7/30/90 dias do dashboard.

Google Analytics e Meta Pixel só carregam com IDs válidos configurados e aceite no banner. Revogação atualiza o estado das integrações. Páginas vistas são enviadas ao trocar a rota. No GA4, desative a medição automática de mudanças de histórico quando usar o envio manual da SPA para evitar duplicação. Integrações não foram verificadas com contas reais.

Favicon, imagem social e verificação Search Console editáveis são aplicados no cliente. A arquitetura por hash foi preservada. A migração para URLs independentes com metadados renderizados no servidor continua sendo uma mudança de arquitetura separada.

## Executar e acessar o painel

1. Node.js 20.9 ou superior e npm.
2. Execute `npm ci`.
3. Copie `.env.example` para `.env` e configure o PostgreSQL em `DATABASE_URL`.
4. Execute `npm run db:generate`.
5. Em banco novo, prepare tabelas com `npm run db:push`. A revisão usa Setting e MediaAsset existentes, sem novas tabelas no schema de produção.
6. Desenvolvimento: `npm run dev`. Produção local: `npm run build` e `npm start`.

Vercel: instalação `npm ci`, build `npm run build` e variáveis de ambiente no projeto. Não envie o `.env` com credenciais.

Painel em `/#/admin`. Usuários já cadastrados continuam com suas credenciais. A senha universal e sua exibição na tela foram removidas. Para banco sem usuários, configure `ADMIN_BOOTSTRAP_EMAIL` e `ADMIN_BOOTSTRAP_PASSWORD` (senha exclusiva com pelo menos 16 caracteres) e use essas credenciais no primeiro login. Remova as variáveis após criar o administrador. O seed CLI também usa essas variáveis, sem senha embutida. A troca de senha continua em Configurações.

## Validação

- Build Next.js de produção e TypeScript concluídos.
- 32 verificações de integração em SQLite isolado: parser de vídeo, hosts inválidos, preservação de hash, autenticação, gravação do CMS, conflito de revisão, configuração inválida, retorno público dos dados, cadastro/edição de vídeo, upload e entrega de WebP, listagem de arquivos e renderização da home e do portfólio com dados editados.
- Renderização React em servidor comprovou ligação entre conteúdo salvo, títulos, botões, galeria e links. Não substitui teste de interação ou revisão visual no navegador.
- Os testes usaram banco local e usuário descartáveis, fora do pacote, sem modificar o PostgreSQL do cliente.
- Limites: não foi possível concluir revisão visual/interativa no navegador do ambiente, reproduzir streams reais nem testar contas Analytics/Meta, login ou submissões no banco de produção. Homologue em celular e desktop antes de publicar.
- Capturas antigas não estão no ZIP para não representar a interface nova. Os LEIA-ME de 2.0/2.1 são históricos e seus testes não se aplicam à versão 3.0.

## Referências técnicas

- Vimeo e privacidade: https://help.vimeo.com/hc/en-us/articles/12426470858001-Embedded-player-displays-This-video-does-not-exist-message
- SDK Vimeo: https://developer.vimeo.com/player/sdk/embed e https://github.com/vimeo/player.js/
- Google: https://developers.google.com/tag-platform/security/guides/consent e https://developers.google.com/analytics/devguides/collection/ga4/views

A arte GPT Image da revisão anterior foi preservada. Os três sites de demonstração e suas ilustrações SVG são ativos do projeto, sem recursos de clientes reais.
