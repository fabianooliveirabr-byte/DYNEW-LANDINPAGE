# DYNEW — Checklist de Requisitos (derivado de `docs/BRIEF-DYNEW.md`)

Gerado em 2026-09-08, na ETAPA 0 (registro e auditoria), conforme instrução do usuário. Cada item do briefing foi transformado em um item verificável. Status refletem o estado **real do projeto neste momento** — parte do briefing já foi implementada em uma rodada anterior desta mesma sessão (Fases 3–5), antes desta ETAPA 0 formal ser solicitada; isso está registrado item a item, não escondido.

Legenda: `[x]` concluído e verificado · `[~]` parcial · `[ ]` pendente · `[!]` bloqueado por limitação técnica do ambiente ou por depender de terceiro.

## Princípios obrigatórios — Precisão

- [x] Nenhum preço, desconto, certificação, estoque, prazo, garantia, métrica de cliente, projeto executado, depoimento, diferencial não confirmado, aplicação não autorizada, código ou característica técnica foi inventado.
- [x] Ausência de preço tratada com "Solicite uma avaliação" / "Consulte disponibilidade e orçamento" (FAQ, seção Oferta).
- [x] Ausência de confirmação de disponibilidade tratada com "Disponibilidade sujeita a consulta" (todo item do catálogo).

## Princípios obrigatórios — Disponibilidade de produtos

- [x] Cada um dos 27 códigos tem `market_status` em `data/catalog.json` / `data/materiais.js`.
- [x] Nenhum código classificado `CURRENT_BR_CONFIRMED` sem fonte brasileira (nenhum tem essa fonte ainda — todos ficaram `CURRENT_GLOBAL_ONLY` ou `UNVERIFIED`).
- [x] Nenhum código classificado `DISCONTINUED_CONFIRMED` (nenhuma fonte de descontinuação foi consultada/encontrada).
- [ ] Confirmação de disponibilidade Brasil por código junto a Layers Brasil/3M Brasil — `[!]` depende de contato humano, fora do alcance deste agente.

## Princípios obrigatórios — Direitos de imagem

- [x] Nenhuma imagem da Layers Brasil foi usada ou tem hotlink.
- [x] Nenhuma imagem foi extraída do PDF ainda — logo, nenhuma das regras de alteração de cor/uso indevido pôde ser violada porque nada foi publicado.
- [!] Extração de ativos oficiais (`pdfimages -list`, conversão WebP/AVIF, `multimedia.3m.com`) — ambiente não tem `pdfimages`/`pdftoppm`/ImageMagick/Ghostscript instalados; URLs oficiais 3M ainda não foram consultadas nesta sessão. Ver `THIRD_PARTY_ASSETS.md`.
- [x] `THIRD_PARTY_ASSETS.md` criado e documenta essa pendência explicitamente.

## FASE 0 — Auditoria e requisitos

- [x] `PRODUCT.md` lido e atualizado com fatos confirmados.
- [x] `index.html`, CSS, JS lidos integralmente (múltiplas vezes, a cada rodada de edição).
- [x] Relatório mais recente do Impeccable lido (`.impeccable/critique/2026-09-08T00-58-17Z__index-html.md`) na rodada de crítica desta sessão.
- [x] Catálogo PDF lido (texto completo via `pdftotext`) — 27/27 códigos prioritários confirmados.
- [ ] Fontes oficiais `3m.com.br` (6 URLs) — `[!]` ainda não consultadas nesta sessão.
- [x] Estado do Git inspecionado a cada rodada (`git status --short`) — nenhum commit feito.
- [x] Dependências inspecionadas — confirmado: sem `package.json`, sem GSAP, sem outra lib de animação (ver seção "Diagnóstico técnico" abaixo).
- [x] Estrutura, imagens, metadados, links, contatos, componentes interativos e comportamento mobile inspecionados.
- [x] `[e-mail interno]` removido de todo conteúdo público (verificado via `grep`, zero ocorrências em `index.html`).
- [x] Linhas decorativas sem função removidas (`.scale-rule`, textura diagonal genérica).
- [x] Caixas de "conteúdo pendente" (`.pending-note`) removidas.
- [x] Placeholders públicos removidos (galeria de 4 reservas genéricas da rodada anterior).
- [x] CTAs duplicados eliminados (um rótulo de intenção "Falar sobre meu projeto" para conversa comercial; CTA contextual do catálogo tem intenção distinta e nomeada — "Consultar no WhatsApp").
- [x] Matriz de requisitos criada — `review/DYNEW-matriz-requisitos.md` (rodada anterior; este checklist é o registro formal complementar pedido agora).
- [x] Three.js não foi iniciado antes da auditoria (nunca foi iniciado — ver Fase 2).

## FASE 1 — Direção de arte e conceito visual

- [~] Três conceitos formais com as 5 subseções completas (ideia central, direção de arte, objeto do hero descrito matematicamente, psicologia, análise anti-template) — na rodada anterior foi feita uma versão **condensada** (tabela comparativa A/B/C com pontuação, sem a descrição matemática detalhada do objeto-hero nem o texto de psicologia por extenso). `[ ]` Registro formal completo pendente, se você quiser esse nível de detalhe arquivado.
- [x] Conceito selecionado automaticamente sem interromper para aprovação (conceito "C — Camadas da Superfície", refinado com espaço negativo e precisão tipográfica dos outros dois).
- [x] Hero não usa esfera abstrata/blob/planeta metálico — usa painel base×acabamento (traduzido em produção como o slider de comparação real).

## FASE 2 — Engenharia da cena 3D

- [x] As 7 perguntas técnicas foram respondidas antes de qualquer implementação: informação comunicada (transformação de superfície) → resolvida em HTML/CSS/JS nativo; comparação com imagem estática → suficiente; custo de carregamento 3D → não incorrido; fallback → é o próprio hero HTML/CSS; comportamento sem WebGL/`prefers-reduced-motion`/dispositivo fraco → nativamente correto, pois não há WebGL.
- [x] Decisão: **3D não implementado**. A regra de plataforma já proíbe depender de WebGL para a proposta principal — as respostas não eram fortes o suficiente para justificar Three.js.
- [x] Three.js não foi instalado nem carregado (confirmado: nenhum script externo além de Google Fonts).

## FASE 3 — Roteiro (5 macrosseções)

### 1. Hero
- [x] Eyebrow "REVESTIMENTOS ARQUITETÔNICOS", headline, subheadline, CTA principal e secundário — texto idêntico ao briefing.
- [x] Revelação controlada base×acabamento via arraste e `<input type="range">` — sem entrada teatral, sem parallax, conteúdo legível antes da animação.
- [x] Transição textual "Escolher o acabamento começa pela superfície existente."

### 2. Problema
- [x] 6 dores concretas listadas, sem quantificar economia.
- [x] Comparação visual substituir/manter/revestir (tabela, 4 dimensões).
- [x] Transição textual "Quando a estrutura pode permanecer, a superfície assume o projeto."

### 3. Mecanismo — Biblioteca de Superfícies
- [x] Catálogo filtrável por família (5 famílias ativas com dados reais).
- [~] Filtro por aparência/ambiente/necessidade/uso interno-externo — não implementado porque os dados confirmados não incluem esses atributos por item (regra do próprio briefing: "somente quando esses dados estiverem disponíveis").
- [~] Aplicações funcionais (AR/TIL/EX/DG/WH-111/PWF-500/RC/PO) — apenas `RC` está confirmado nos 27 códigos verificados; os demais códigos funcionais não fazem parte da curadoria atual.
- [x] Drawer com código, família, características, limitações, fonte, status, disponibilidade, CTA contextual.
- [!] Drawer com **imagem** — campo existe na estrutura de dados mas fica vazio; nenhuma imagem foi extraída (ver Direitos de Imagem acima).
- [x] CTA preenche WhatsApp com código selecionado — testado com `PS-2401MTRC`, texto idêntico ao exemplo do briefing.
- [x] Transição textual "Não basta escolher uma textura. É preciso verificar onde ela funciona."

### 4. Confiança — Evidência técnica
- [x] 8 fatos técnicos sourced (adesivo Comply, renovação/reutilização, menor interrupção, limpeza, variedade de padrões, famílias funcionais, rastreabilidade de código, consulta técnica).
- [x] Atribuição de marca — texto idêntico ao briefing.
- [x] Nenhum logotipo de cliente, depoimento, avaliação, número de projeto ou selo inventado.
- [x] Transição textual "Cada projeto começa pela análise da superfície."

### 5. Oferta — Contato
- [x] Processo de 4 etapas nomeadas.
- [x] Headline e texto idênticos ao briefing.
- [x] CTA único "Falar sobre meu projeto".
- [x] Contatos +55 11 92503-9297 e contato@dynew.com.br visíveis.
- [x] Sem urgência falsa, cronômetro, desconto ou escassez.

### Regras de animação
- [x] Durações dentro de 140–480ms (transições usam tokens `--transition-fast`/`--transition-base`, 160–280ms).
- [x] Nenhuma animação obrigatória para compreender conteúdo (grid/lista sempre visível, animação só em estado de interação).
- [x] Sem scroll hijacking, sem cursor personalizado, sem movimento infinito, sem animação por card, sem conteúdo essencial revelado só após scroll.
- [x] Mobile: slider funciona por toque; sem paralaxe pesada; sem sticky prolongado; sem blur caro.
- [ ] "No máximo um grande momento sticky" — nenhum momento sticky de scroll foi implementado (a bandeja de comparação usa `position: sticky` dentro da própria seção do catálogo, não é um momento de scroll-driven da página). `[ ]` Registro: não há scroll-driven storytelling (pin/scrub) nesta implementação — motion é toda por estado de interação (hover/click/drag), não por posição de scroll.

## FASE 4 — Copywriting

- [x] Headline, subheadline, dor reconhecida, mecanismo (3 dimensões), benefícios tangíveis, 4 objeções e CTA — texto idêntico ao briefing, aplicado em `index.html`.
- [x] Microcopy do CTA idêntica.
- [x] Frases curtas, vocabulário arquitetônico, sem clichê corporativo, sem métrica inventada.

## Catálogo e dados

- [x] `data/catalog.json` criado seguindo o schema mínimo pedido (campos extras adicionados: `_meta`, `functional_series` como array — compatível, não removeu nenhum campo do schema original).
- [x] 27 códigos da lista de prioridade — todos confirmados no PDF (mais que os 12–18 mínimos pedidos).
- [x] Lista não interpretada como confirmação automática de estoque (ver `market_status`).

## Governança de imagens

- [x] `THIRD_PARTY_ASSETS.md` criado com arquivo, produto/código, URL, domínio, página, data, titular, condição de uso, finalidade, status, obrigação de remoção, última verificação.
- [ ] Pipeline de imagem (itens 1–14 do briefing: `pdfimages -list`, conversão WebP/AVIF, `srcset`, lazy loading, alt text) — `[!]` bloqueado no passo 1 (sem `pdfimages`); passos 2–14 não podem começar sem imagem extraída.

## FASE 5 — Engenharia e handoff

- [~] Arquitetura "por responsabilidade" (`SiteHeader`, `HeroSurface`, etc.) — o projeto é HTML/CSS/JS nativo sem componentização formal em arquivos separados; a separação existe por seção/classe CSS e por responsabilidade de arquivo JS (`script.js` = navegação/FAQ/hero slider, `materials-catalog.js` = catálogo), não por componente nomeado individualmente. Estrutura HTML semântica (`header`, `nav`, `main`, `section`, `footer`) está correta.
- [x] Botões reais (`<button>`) e links reais (`<a>`) para toda ação/navegação.
- [ ] LCP < 1,8s / CLS < 0,05 / INP < 150ms — `[!]` não medido; sem Lighthouse/CDP disponível neste ambiente.
- [x] `font-display: swap` (via parâmetro da URL do Google Fonts), preload apenas de fontes essenciais.
- [x] JavaScript não bloqueante (scripts no fim do `<body>`, sem `defer` necessário pois já estão no fim).
- [x] Nenhum PDF pesado carregado na página (o PDF de 171MB fica em `assets/catalogo/raw/`, fora do que é servido/linkado publicamente).
- [x] Nenhuma biblioteca de animação adicionada — CSS/Web Animations API resolveram tudo.
- [x] Contraste WCAG AA — `impeccable detect` limpo (0 achados).
- [x] Navegação por teclado, foco visível, skip link, `aria-expanded`, `aria-controls`.
- [x] Modal (drawer do catálogo) com fechamento por Escape e restauração de foco ao elemento que abriu.
- [x] Estados não comunicados só por cor (ex.: filtro ativo usa `aria-pressed`, não só cor).
- [x] `prefers-reduced-motion` respeitado (bloco global em `css/style.css`).
- [x] Sem canvas/WebGL — não há fallback de canvas a fazer.
- [x] Title, meta description, canonical, Open Graph, Twitter Card, favicon, hierarquia de heading (H1 único) atualizados.
- [x] Dados estruturados `Organization` + `FAQPage` (só com conteúdo visível na página).
- [x] Nenhum schema de produto com preço/estoque/avaliação inventados (nenhum schema de produto foi usado).
- [x] `rel="noopener noreferrer"` em todos os links externos/`target="_blank"`.
- [x] Nenhum e-mail pessoal exposto publicamente; nenhum token/segredo no código.

## FASE 1 — Identidade e primeira dobra (concluída, aprovada em 2026-09-08)

- [x] Header + hero reconstruídos com eyebrow "DYNEW · Especialista em 3M™ DI-NOC™", headline "Revestimentos arquitetônicos. Transformações inteligentes.", subheadline cobrindo DI-NOC/paredes-portas-painéis-tetos-mobiliário/preparação.
- [x] Claim de certificação não verificável ("DYNEW — APLICAÇÃO CERTIFICADA 3M") substituído por linguagem confirmada ("Especialista em 3M™ DI-NOC™") — sinalizado ao usuário, aceito.
- [x] Barra de credibilidade (5 itens) e seção "Quem somos" adicionadas.
- [x] Correção pontual 1 — frase negativa ("Não uma loja de películas...") removida do topo/Quem-somos; reposicionada como nota institucional discreta antes do rodapé.
- [x] Correção pontual 2 — Biblioteca de Materiais removida da home; extraída para `materiais.html` (nova página); home passou a ter apenas chamada curta + botão. Aviso de disponibilidade preservado. Nenhuma duplicação.
- [x] Link do hero/nav para `#acabamentos` corrigido para `materiais.html` (fix técnico necessário, não mudança discricionária).

## FASE 2 — Valor e demonstração (concluída em 2026-09-08, aguardando aprovação)

- [x] Seção "Antes e Depois" — comparador funcional independente (`beforeAfterHero`/`beforeAfterFinish`/`beforeAfterHandle`/`beforeAfterRange`), reutilizando `initCompareSlider` de forma genérica sem alterar o comparador do hero. Headline/corpo idênticos ao briefing. Rotulado "Simulação visual de aplicação" — não há foto real, texturas CSS aplicadas sobre a mesma geometria (mesma superfície, dois acabamentos), evitando a falsa impressão de duas fotos de projetos diferentes.
- [x] Seção "Por que revestir" — comparação editorial 3 caminhos (Substituir / Manter como está / Revestir), Revestir destacado visualmente (fundo grafite, tipografia champanhe), listas com a linguagem exata e hedged do briefing.
- [x] Seção "Diferencial de peso" — copy exata, tags de aplicação, diagrama esquemático não numérico (`.weight-diagram`, dois blocos de alturas diferentes, sem eixo/unidade), legenda "Representação esquemática", nota de viabilidade exata no rodapé da seção.
- [x] Seção "Tetos" — copy exata, lista de 6 benefícios, nota de não-reivindicações exata (não substitui avaliação estrutural, não resolve infiltração/umidade, não é isolamento térmico/acústico, não é universalmente compatível).
- [x] Transições entre seções por progressão de cor (`bg-alt`/`section-dark`/padrão), sem linhas decorativas.
- [x] Hero, Quem-somos, `materiais.html` e nota institucional não alterados nesta fase (verificado por diff visual/estrutural).
- [x] Nenhuma imagem real usada — todas as superfícies visuais desta fase são CSS puro (gradientes/texturas repetidas), classificadas como "Simulação visual de aplicação" (Antes e Depois) ou "Representação esquemática" (diagrama de peso). Nenhuma imagem de concorrente/Layers usada.
- [x] GSAP/ScrollTrigger/Draggable/ScrollSmoother — não instalados, não referenciados (confirmado via grep, zero ocorrências).
- [x] FAQ, sustentabilidade, extração de PDF, Lighthouse — não tocados nesta fase, conforme instrução.
- [x] `impeccable detect` limpo (0 achados) após as mudanças de CSS/HTML desta fase.
- [x] HTML: tags balanceadas (23 `<li>` / 23 `</li>` confirmados; contagem inicial via regex estava incorreta por casar `<link>`, corrigida).
- [x] JS: `js/script.js` sintaticamente válido (`new Function` sobre o arquivo, sem erro); `initCompareSlider` testado nas duas instâncias.
- [x] Comparador testado com mouse (evento `pointerdown`/`pointermove`/`pointerup` sintético, arraste de 50%→75% confirmado via `clip-path`/`handle.style.left`).
- [x] Comparador testado com teclado (foco no `<input type="range">` confirmado via `document.activeElement`; alteração de valor + evento `input` propaga corretamente ao `clip-path`).
- [x] Comparador testado em comportamento mobile/touch (viewport 390×844, `PointerEvent` com `pointerType:'touch'`, arraste até 35% confirmado).
- [x] Comparador original do hero confirmado intacto após o refactor (`compareRange`/`compareFinish` testados isoladamente, resposta correta).
- [x] Nenhuma rolagem horizontal indesejada — verificado em 1440×900 (`scrollWidth === clientWidth`) e 390×844, incluindo `getBoundingClientRect`/`scrollWidth` das 4 novas seções individualmente.
- [x] Nenhum texto cortado identificado — confirmado por inspeção visual de screenshots full-page desktop e mobile, e captura isolada da seção Tetos.
- [x] Nenhum espaçamento excessivo entre as novas seções — transições de cor absorvem o espaço em vez de gaps vazios.
- [x] Screenshots finais gerados: `review/DYNEW-fase2-desktop-full.png` (1440×900, página completa) e `review/DYNEW-fase2-mobile-full.png` (390×844, página completa).
- [x] Arquivos temporários de QA (`qa-*.png`) removidos da raiz do projeto; `.playwright-mcp` removido.
- [x] Servidor local (porta 8796) encerrado ao final da rodada.
- [x] Nenhum commit, push ou publish realizado nesta fase.
- [ ] Aprovação do usuário para iniciar a Fase 3 — pendente.

## Guia "Site Premium 3M DI-NOC" — triagem (2026-09-08)

Ver `docs/BRIEF-DYNEW.md` → "ANEXO (2026-09-08)" para o texto completo. Resumo do status:

- [x] PDF fonte lido integralmente (`[caminho local do usuário]\Guia_Site_Premium_3M_DiNoc.pdf`, 4 páginas).
- [x] 10 princípios aprovados — cada um triado individualmente e registrado com status (aplicado / já satisfeito / pendente de material real / adiado para Etapa 2).
- [x] 10 diretrizes do manual explicitamente marcadas como NÃO aplicadas (Lenis/Locomotive, ScrollSmoother, WebGL/liquid, cursor customizado, vermelho 3M como cor de marca, vídeo 4K direto, scroll horizontal longo, efeitos decorativos sem função, promessas absolutas, espaço vazio artificial) — nenhuma instalada nem referenciada.
- [x] Direção técnica definitiva (GSAP Core/ScrollTrigger/Draggable + o resto do stack nativo) registrada; GSAP explicitamente NÃO instalado nesta rodada.
- [x] Correção do Antes e Depois aplicada dentro do limite honesto possível (sem fotografia real): iluminação/sombra consistente entre os dois estados, textura "antes" mais parecida com superfície real, padrão "depois" lendo como veio de madeira, identificação real (3M™ DI-NOC™ · PW-2322MT · Coleção Premium Wood · Disponibilidade sujeita a consulta) sourced em `data/catalog.json`. Perspectiva 3D real e fotografia genuína continuam como pendência documentada, não fabricada.

## ETAPA 1 — Estrutura completa (novo método de execução, concluída em 2026-09-08)

- [x] Hero — mantido (aprovado nas rodadas anteriores), CTA principal atualizado para "Solicitar avaliação técnica".
- [x] Quem somos — mantido sem alteração de conteúdo.
- [x] Antes/depois — corrigido (ver seção acima); permanece como demonstração central, logo após Quem somos.
- [x] Por que revestir — mantido sem alteração de conteúdo.
- [x] Menor peso — mantido sem alteração de conteúdo.
- [x] Tetos — mantido sem alteração de conteúdo.
- [x] Aplicações — **nova seção** (`#aplicacoes`, entre "Por que revestir" e "Menor peso"): 6 categorias de aplicação (Paredes, Portas e painéis, Mobiliário, Tetos, Balcões e elevadores, Corporativo/hotelaria/retrofit), copy derivada de conteúdo já confirmado (hero, FAQ, `.applications-tags`), sem dado novo inventado.
- [x] DI-NOC™ como tecnologia do serviço — **satisfeito pela seção existente** `#confianca` (ancorada por "3M™ DI-NOC™" no menu); decisão de não duplicar registrada no anexo do brief, não aplicada silenciosamente.
- [x] Padrão DYNEW — **nova seção** (`#padrao`, logo após `#confianca`): 4 passos numerados (Leitura do substrato, Preparação da superfície, Execução especializada, Verificação final), copy derivada do diferenciador já confirmado em `PRODUCT.md` ("O material importa. A execução define o resultado").
- [x] Processo — **consolidado dentro de Padrão DYNEW**, em vez de duplicado; o bloco de 4 caixas sem descrição que existia dentro de `#contato` foi removido (e o CSS morto `.contact-process`/`.process-step` removido junto) para não repetir o mesmo conteúdo em dois lugares.
- [x] Sustentabilidade — **nova seção** (`#sustentabilidade`, antes do FAQ): copy honesta baseada em fatos já confirmados (conservação da base existente, menor geração potencial de resíduo, menor interrupção), com nota explícita de não-reivindicação ("Isso não é uma certificação ou selo ambiental...") — nenhuma certificação, métrica quantificada ou selo ambiental inventado.
- [x] FAQ — mantido sem alteração.
- [x] Contato — simplificado (bloco de processo removido, ver acima); CTA principal atualizado.
- [x] Página separada de materiais (`materiais.html`) — mantida separada; apenas rótulo/mensagem do CTA WhatsApp atualizados para consistência com o resto do site.
- [x] GSAP — confirmado NÃO instalado (`grep` por `gsap`/`ScrollTrigger`/`Draggable` em todo o projeto: zero ocorrências além deste texto de documentação).
- [x] `impeccable detect` limpo (0 achados) após todas as mudanças de HTML/CSS.
- [x] Tags HTML balanceadas em `index.html` e `materiais.html` (checado programaticamente).
- [x] Console limpo (0 erros) em desktop (1440×900).
- [x] Comparador Antes/Depois testado após as mudanças de CSS — `clip-path` responde corretamente a um novo valor de range.
- [x] Sem rolagem horizontal — checado em 1440×900 e 390×844, incluindo as 3 seções novas individualmente.
- [x] Grade da seção Aplicações ajustada de 4 para 3 colunas (6 itens) para evitar uma última linha com vão vazio — não para aumentar espaço, para eliminar um espaço desnecessário.
- [x] Screenshots gerados: `review/DYNEW-etapa1-desktop-full.png` (1440×900) e `review/DYNEW-etapa1-mobile-full.png` (390×844).
- [x] Nenhum commit, push ou publish realizado.
- [ ] Aprovação do usuário para iniciar a ETAPA 2 (GSAP/ScrollTrigger/Draggable) — pendente.

### Pendências que dependem de conteúdo real da DYNEW (não podem ser resolvidas por este agente)

- [!] Fotografia e/ou vídeo real de aplicação profissional (item 4 dos princípios aprovados) — sem esse material, o Antes/Depois permanece uma simulação em CSS, por mais refinada que fique.
- [!] Documentação de certificação 3M, se existir — sem ela, "serviço certificado" continua não podendo ser afirmado; a página usa "execução técnica especializada" como alternativa honesta.
- [!] Confirmação de disponibilidade Brasil por código junto a Layers Brasil/3M Brasil (pendência já registrada na Fase 0).

## Skills e ferramentas

- [ ] `design-taste-frontend`, `find-animation-opportunities`, `emil-design-eng`, `review-animations` executadas formalmente como passo próprio (recomendação → decisão → mudança registrada) — `[ ]` os princípios dessas skills foram aplicados de forma implícita ao longo do trabalho (sem eyebrow repetido, sem cards genéricos, motion restrito a `transform`/`opacity`/`clip-path`, sem `ease-in`, hairlines em vez de caixas), mas não houve uma passada formal e documentada skill a skill.
- [x] `/impeccable critique` — executado uma vez nesta sessão (antes da Fase 2/3, sobre a versão anterior do site); não repetido sobre a versão atual pós-Fase 3–5.
- [x] Playwright — usado extensivamente para QA (ver `review/DYNEW-matriz-requisitos.md`, seção de testes).
- [x] No máximo um agente auxiliar em paralelo — nenhum subagente foi usado nesta sessão; todo trabalho foi feito diretamente.

## QA e validação

- [x] Testado em 1440×900 (desktop) e 390×844 (mobile) via Playwright.
- [ ] Testado nos demais breakpoints pedidos (360×800, 768×1024, 1280×720, 1920×1080) — `[ ]` apenas 2 dos 6 breakpoints foram exercitados nesta sessão.
- [x] Console limpo (0 erros) nos dois breakpoints testados.
- [x] Sem scroll horizontal (verificado `scrollWidth === innerWidth` no mobile).
- [x] WhatsApp, e-mail, FAQ, teclado, Escape testados.
- [x] `prefers-reduced-motion` — implementado; não testado ativamente com a preferência do SO simulada nesta rodada.
- [!] Fallback WebGL — não aplicável (sem WebGL no projeto).
- [ ] Performance real medida — `[!]` sem Lighthouse disponível.

## Entregáveis

- [x] `review/DYNEW-desktop.png`
- [x] `review/DYNEW-mobile.png`
- [x] `review/DYNEW-preview-final.pdf` (conteúdo verificado via extração de texto; inspeção visual página a página não foi possível — sem `pdftoppm`)
- [x] `review/DYNEW-auditoria-catalogo.md`
- [x] `review/DYNEW-fontes-e-alegacoes.md`
- [ ] `review/DYNEW-performance.md` — `[!]` não gerado; sem dado real de performance para reportar (preferiu-se não gerar o arquivo a preenchê-lo com números inventados).
- [x] `THIRD_PARTY_ASSETS.md`
- [x] `data/catalog.json`
- [x] `docs/BRIEF-DYNEW.md` (este ciclo)
- [x] `docs/CHECKLIST-DYNEW.md` (este arquivo)
- [x] `review/DYNEW-fase2-desktop-full.png` (Fase 2)
- [x] `review/DYNEW-fase2-mobile-full.png` (Fase 2)

## Critérios de aceite (avaliação honesta)

- [x] Não parece template genérico / blog / vlog (removidos placeholders, eyebrows repetidos, cards genéricos).
- [x] Materialidade vem dos produtos (catálogo real, não decoração abstrata).
- [x] Hero tem função comercial (CTA duplo, não é só estética).
- [x] Catálogo é navegável (filtro, drawer, comparação).
- [~] Imagens com rastreabilidade — rastreabilidade **documentada** (`THIRD_PARTY_ASSETS.md`), mas não há imagem publicada ainda para rastrear de fato.
- [x] Códigos têm status.
- [x] Nenhum preço inventado.
- [x] Nenhum produto com disponibilidade garantida sem fonte.
- [x] Nenhuma imagem da Layers usada.
- [x] Nenhuma certificação inventada.
- [x] WhatsApp correto em todos os CTAs.
- [x] `contato@dynew.com.br` em toda a página pública.
- [x] `[e-mail interno]` não exposto.
- [~] Mobile "resolvido" — testado em 1 breakpoint mobile (390×844); os demais breakpoints pedidos não foram exercitados nesta sessão.
- [x] Funciona sem WebGL (não usa WebGL).
- [x] Funciona com redução de movimento.
- [x] Sem linhas decorativas desnecessárias.
- [x] Sem placeholders públicos.
- [x] Sem CTAs excessivos.
- [x] Console limpo.
- [x] Screenshots e PDF gerados.
- [x] Nenhum commit ou push realizado.

---

# Diagnóstico técnico do projeto (ETAPA 0)

## Estrutura de arquivos atual

```
index.html
css/variables.css, css/style.css
js/script.js, js/materials-catalog.js
data/catalog.json, data/materiais.js, data/README.md
assets/catalogo/raw/3m-dinoc-architectural-finishes-sample-book-high-res.pdf  (171 MB, não servido publicamente)
assets/img/README.md, assets/favicon/README.md  (pastas ainda vazias de imagens reais)
review/  (5 entregáveis desta sessão)
docs/  (este ciclo: BRIEF-DYNEW.md, CHECKLIST-DYNEW.md)
PRODUCT.md, THIRD_PARTY_ASSETS.md, README.md
robots.txt, sitemap.xml
.impeccable/  (config e histórico de crítica)
.agents/skills/  (5 skills locais: design-taste-frontend, emil-design-eng, find-animation-opportunities, review-animations, prototype)
.tmp-audit/  (texto extraído do PDF para auditoria — no .gitignore)
```

Tamanho dos arquivos principais: `index.html` 478 linhas · `css/style.css` 1178 linhas · `css/variables.css` 66 linhas · `js/script.js` 100 linhas · `js/materials-catalog.js` 412 linhas · `data/materiais.js` 522 linhas (gerado) · `data/catalog.json` 308 linhas.

## Dependências

- **Nenhum `package.json`** — não há gerenciador de pacotes Node configurado. Stack 100% estática (HTML/CSS/JS nativo), conforme exigido.
- **Nenhuma biblioteca de animação instalada.** Busca por `gsap`, `framer-motion`, `anime.js`, `scrollmagic`, `aos.js`, `lottie` em todo o projeto: **zero ocorrências.**
- Único recurso externo carregado: Google Fonts (`Manrope` + `Newsreader`), via `<link>` no `<head>`.
- Três `<script src>` locais, todos vanilla JS: `data/materiais.js` → `js/materials-catalog.js` → `js/script.js`.

## Animações existentes hoje (todas em CSS puro, sem biblioteca)

| Onde | Propriedade | Duração |
|---|---|---|
| Skip link (foco) | `top` | 150ms (`--transition-fast`) |
| Botões (`.btn`) | `background-color`, `border-color`, `color`, `transform` | 160ms |
| Ícone do menu mobile | `transform`, `opacity` | 160ms |
| Menu mobile (abrir/fechar) | `transform` | 280ms (`--transition-base`) |
| Sublinhado do link de navegação (hover) | `right` (largura do filete) | 160ms |
| Chip de filtro do catálogo | `background-color`, `color`, `border-color` | 160ms |
| Backdrop do painel do catálogo | `opacity` | 280ms |
| Painel lateral do catálogo (abrir/fechar) | `transform` | 280ms |
| Ícone do FAQ (+/×) | `transform` (rotação) | 160ms |
| Resposta do FAQ (abrir/fechar) | `grid-template-rows` | 280ms |
| Botão flutuante do WhatsApp (hover) | `background-color`, `transform` | 160ms |
| Slider do hero (arraste) | `clip-path` via JS a cada `pointermove`/`input` — sem transição CSS (resposta imediata ao arraste, intencional) | instantâneo |

Nenhuma animação usa `@keyframes`; tudo é `transition` orientado a estado (hover/focus/aria-expanded/data-open/aria-pressed). Nenhum scroll-driven, nenhum sticky de página, nenhum movimento infinito.

## Sobre GSAP especificamente

Não está instalado, não está referenciado em nenhum arquivo, e o briefing (`FASE 5 — Performance`) recomenda explicitamente **evitar biblioteca de animação quando CSS e Web Animations API resolverem** — o que tem sido o caso até aqui: todas as interações do briefing (revelação do hero, filtro, drawer, comparação, FAQ) foram resolvidas com `transition`/`clip-path`/`grid-template-rows` nativos, sem necessidade de JS de animação dedicado.

Se uma fase futura pedir GSAP especificamente para scroll-driven storytelling (pin/scrub, o "momento sticky" da Fase 3 que ainda não foi implementado), a instalação exigiria: (a) decidir entre CDN externo (`<script src="https://cdn.jsdelivr.net/...">`, mais simples, sem `package.json`) ou pacote npm (exigiria criar `package.json` + bundler, mudança de arquitetura maior); (b) justificar por que CSS `scroll-timeline`/`animation-timeline` (nativo, sem dependência, mas suporte de navegador ainda parcial em 2026) não resolve o mesmo caso antes de adicionar uma dependência externa, conforme a própria regra do briefing.

## Possíveis conflitos e limitações técnicas identificados

1. **Sem ferramenta de extração de imagem de PDF** (`pdfimages`/`pdftoppm`/ImageMagick/Ghostscript ausentes) — bloqueia toda a pipeline de imagens do catálogo (Fase 3.3, Governança de Imagens). Não é um conflito de decisão, é uma lacuna de ferramentas do ambiente.
2. **Sem Lighthouse/Chrome DevTools Protocol completo** — bloqueia medição real de LCP/CLS/INP (Fase 5). Reportar número estimado seria inventar dado, o que o próprio briefing proíbe.
3. **URLs oficiais `3m.com.br`** ainda não foram consultadas nesta sessão — pendente para complementar a Fase 0/Governança de Imagens.
4. **Nenhum breakpoint sticky/scroll-driven foi implementado** — se isso for um requisito não negociável da Fase 3 (não apenas "no máximo um"), é uma decisão de produto a confirmar, não uma limitação técnica.
5. **Fase 1 registrada de forma condensada**, não com o detalhamento matemático completo do objeto-hero pedido no formato original — disponível para expandir se necessário.
