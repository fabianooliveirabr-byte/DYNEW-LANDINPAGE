# Governança de imagens e materiais de terceiros — DYNEW

Registro de todo ativo de terceiros (3M™ DI-NOC™, Layers Brasil como referência de pesquisa, etc.) usado ou pesquisado neste projeto. Nada aqui é publicado sem constar deste arquivo.

## Fonte principal: catálogo PDF 3M DI-NOC 2024

- **Arquivo:** `assets/catalogo/raw/3m-dinoc-architectural-finishes-sample-book-high-res.pdf`
- **Origem:** fornecido pelo usuário (cópia local, recebida antes desta sessão); copiado de `[caminho local do usuário]` para o projeto em 2026-09-08.
- **Titular:** 3M Company.
- **Conteúdo:** catálogo global 2024, "Design Description Guide", 85 páginas, >900 padrões, famílias Standard/Functional/E-Series. Não contém preços nem confirmação de estoque no Brasil.
- **Condição de uso declarada pelo usuário:** as imagens oficiais de página de produto da 3M podem ser usadas para promover o uso ou considerar a compra do produto representado; uso deve cessar e o arquivo removido se a 3M anunciar descontinuação. Esta condição foi informada pelo usuário nesta sessão — **não foi verificada de forma independente por este agente** e deve ser confirmada com a 3M/Layers antes de uso comercial em escala.
- **Status de extração de texto:** ✅ concluída via `pdftotext -layout` (ver `data/catalog.json` para os 27 códigos verificados e suas páginas aproximadas).
- **Status de extração de imagem:** ⛔ **não realizada nesta sessão** — o ambiente não tem `pdfimages`, `pdftoppm`, ImageMagick nem Ghostscript instalados, apenas `pdftotext`. Nenhuma imagem foi extraída, copiada, convertida ou publicada. Ver "Pendências" abaixo.

## Códigos pesquisados (ver `data/catalog.json`)

27 códigos fornecidos pelo usuário — todos os 27 foram localizados e confirmados no texto do PDF (não fabricados). Nomes de padrão comercial só foram preenchidos quando encontrados de forma inequívoca junto ao código (6 itens da família E-Series RC / Solid Color); os demais 21 aparecem com o próprio código como `name`, sem nome de padrão inventado. Nenhum foi classificado como `CURRENT_BR_CONFIRMED` — essa confirmação exige contato direto com a Layers Brasil (distribuidor nacional) ou com a 3M Brasil, não realizado nesta sessão.

## Fontes oficiais 3M consultadas (somente leitura, IA/UX e verificação — não extração de imagem)

As 6 URLs oficiais `3m.com.br` fornecidas pelo usuário ainda não foram consultadas nesta sessão (prioridade dada à extração do PDF, que é a fonte primária declarada). Pendente para a próxima etapa.

## Referências secundárias — Layers Brasil

Usadas **somente** para estudar agrupamento comercial, famílias percebidas pelo cliente, sequência de apresentação e navegação (pesquisa de IA/UX já registrada em sessão anterior deste projeto, ver histórico). Nenhuma imagem, texto, HTML, CSS ou composição da Layers foi copiada, baixada ou terá hotlink neste projeto.

## Pendências (dependem de ação humana ou de ferramentas adicionais)

1. **Extração de imagens do PDF**: requer instalar `poppler-utils` (`pdftoppm`/`pdfimages`) ou equivalente — não instalado nesta sessão por não ter sido autorizado/necessário até este ponto. Alternativa: exportar manualmente as páginas relevantes do PDF (ex.: via Acrobat) para `assets/catalogo/raw/paginas/`.
2. **Confirmação de disponibilidade no Brasil** de qualquer código específico — exige contato com Layers Brasil/3M Brasil.
3. **Asset oficial 3M™ DI-NOC™** (logotipo/selo autorizado) — segundo `STATUS_PROJETO.md` do próprio usuário, ainda não foi recebido. Nenhum selo foi recriado.
4. **Imagens reais de projeto DYNEW** (categorias AMBIENTE / SUPERFÍCIE / DETALHE) — nenhuma foi fornecida ainda.

## Regra permanente

Nunca hotlink. Nunca copiar arquivo da Layers Brasil. Nunca usar imagem de um código para representar outro. Nunca alterar cor/veio/acabamento de uma amostra. Nunca apresentar imagem ilustrativa como obra realizada pela DYNEW. Remover o ativo se a 3M anunciar descontinuação do produto representado.
