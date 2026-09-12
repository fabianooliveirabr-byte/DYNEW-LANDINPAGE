# Biblioteca de Materiais — processo de recebimento de imagens

Este diretório guarda `materiais.js` (a estrutura de dados da biblioteca de
materiais — ver comentário no topo do arquivo) e este guia de processo. Nenhuma
imagem real foi recebida ainda; siga estes passos quando a DYNEW fornecer
material autorizado (catálogo 3M DI-NOC ou fotografia própria).

## Ao receber imagens autorizadas

1. **Copiar os arquivos originais** para `assets/img/materiais/<coleção>/original/`
   — nunca depender de URL externa (Layers Brasil ou qualquer outro site de
   terceiros). Cada coleção/família em sua própria subpasta.
2. **Gerar cópias em WebP/AVIF** a partir do original, preservando o arquivo
   original intacto na pasta `original/`. Não distorcer cor, veio ou
   acabamento da amostra; não aplicar filtro que altere a percepção real do
   material.
3. **Gerar tamanhos responsivos** (ex.: 480/960/1440px de largura) para
   desktop e celular a partir de cada imagem convertida.
4. **Registrar proveniência e autorização** para cada arquivo em
   `data/proveniencia.json` (criar na primeira importação) com o formato:
   ```json
   {
     "arquivo": "assets/img/materiais/madeira/original/dw-1889mt.jpg",
     "origem": "Catálogo 3M DI-NOC 2026, recebido do cliente em DD/MM/AAAA",
     "autorizacao": "Autorizado pela DYNEW em DD/MM/AAAA"
   }
   ```
   Os mesmos textos alimentam os campos `origemArquivo` e `autorizacaoUso`
   de cada item em `materiais.js`.
5. **Só então** criar o item correspondente em `window.DYNEW_MATERIALS`
   (`materiais.js`), preenchendo apenas campos confirmados — nunca inventar
   `acabamento`, `tonalidade`, `dimensao` ou `infoTecnica` que não constem no
   material recebido.
6. Imagens fora da primeira dobra devem carregar com `loading="lazy"` — o
   renderizador (`js/materials-catalog.js`) já aplica isso automaticamente a
   cada item.

## Catálogo virtual 3M DI-NOC

Quando o arquivo do catálogo (PDF ou equivalente) for fornecido, copie-o para
`assets/catalogo/` e aponte `window.DYNEW_CATALOG_FILE` (em `materiais.js`)
para o caminho local. Não usar o logotipo 3M nem qualquer selo de
"distribuidor autorizado" sem confirmação explícita da DYNEW.
