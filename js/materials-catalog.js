/**
 * DYNEW — Biblioteca de Materiais (catálogo dinâmico)
 * ============================================================
 * Lê window.DYNEW_MATERIALS (data/materiais.js). Se estiver vazio, a seção
 * #acabamentos e o link "Acabamentos" do menu continuam ocultos — nada é
 * renderizado ao visitante. Com itens reais, monta navegação por família,
 * biblioteca de cartões, painel lateral de detalhes (com status, fonte,
 * limitações e CTA contextual do WhatsApp) e comparação de até 3 amostras.
 * Nenhum campo é inventado — cartões sem imagem mostram formato tipográfico,
 * nunca uma caixa de placeholder.
 */
(function () {
  "use strict";

  var DATA = Array.isArray(window.DYNEW_MATERIALS) ? window.DYNEW_MATERIALS : [];
  if (!DATA.length) return;

  var WHATSAPP_NUMBER = "5511925039297";

  var section = document.getElementById("acabamentos");
  var navItem = document.getElementById("nav-acabamentos");
  var mount = document.getElementById("materials-mount");
  if (!section || !mount) return;

  var MAX_COMPARE = 3;
  var state = { familia: "todos", compare: [] };
  var gridEl = null;
  var trayEl = null;
  var lastFocused = null;

  var STATUS_LABEL = {
    CURRENT_BR_CONFIRMED: "Disponibilidade confirmada no Brasil",
    CURRENT_GLOBAL_ONLY: "Confirmado no catálogo global — disponibilidade no Brasil sujeita a consulta",
    UNVERIFIED: "Não verificado — confirmar antes de especificar",
    DISCONTINUED_CONFIRMED: "Descontinuado",
  };

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function waLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function uniqueValues(field, list) {
    var seen = {};
    var out = [];
    (list || DATA).forEach(function (item) {
      var v = item[field];
      if (v && !seen[v]) {
        seen[v] = true;
        out.push(v);
      }
    });
    return out;
  }

  function filteredData() {
    if (state.familia === "todos") return DATA;
    return DATA.filter(function (item) {
      return item.familia === state.familia;
    });
  }

  function byCodigo(codigo) {
    for (var i = 0; i < DATA.length; i++) {
      if (DATA[i].codigo === codigo) return DATA[i];
    }
    return null;
  }

  /* ============================================================
     Introdução + filtros + grade
     ============================================================ */

  function buildIntro() {
    var wrap = document.createElement("div");
    wrap.className = "section-header catalog-intro";

    var headWrap = document.createElement("div");
    var h2 = document.createElement("h2");
    h2.textContent = "Biblioteca de acabamentos";
    var p = document.createElement("p");
    p.textContent = "Códigos 3M™ DI-NOC™ confirmados no catálogo oficial. Explore por família e consulte a disponibilidade de cada um.";
    headWrap.appendChild(h2);
    headWrap.appendChild(p);
    wrap.appendChild(headWrap);

    if (window.DYNEW_CATALOG_FILE) {
      var a = document.createElement("a");
      a.href = window.DYNEW_CATALOG_FILE;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "btn btn-outline catalog-download";
      a.textContent = "Ver catálogo virtual 3M DI-NOC";
      wrap.appendChild(a);
    }
    return wrap;
  }

  function makeChip(label, pressed, onSelect) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "catalog-chip";
    btn.setAttribute("aria-pressed", String(pressed));
    btn.textContent = label;
    btn.addEventListener("click", function () {
      var group = btn.parentElement;
      group.querySelectorAll(".catalog-chip").forEach(function (s) {
        s.setAttribute("aria-pressed", "false");
      });
      btn.setAttribute("aria-pressed", "true");
      onSelect();
    });
    return btn;
  }

  function buildFilters() {
    var wrap = document.createElement("div");
    wrap.className = "catalog-filters";

    var familias = uniqueValues("familia");
    if (familias.length > 1) {
      var group = document.createElement("div");
      group.className = "catalog-filter-group";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", "Filtrar por família");

      group.appendChild(
        makeChip("Todas", true, function () {
          state.familia = "todos";
          refreshGrid();
        })
      );
      familias.forEach(function (f) {
        group.appendChild(
          makeChip(f, false, function () {
            state.familia = f;
            refreshGrid();
          })
        );
      });
      wrap.appendChild(group);
    }
    return wrap;
  }

  function buildTile(item) {
    var tile = document.createElement("button");
    tile.type = "button";
    tile.className = "catalog-tile";
    tile.setAttribute("aria-label", item.nome + (item.familia ? " — " + item.familia : ""));

    var family = document.createElement("span");
    family.className = "catalog-tile-family";
    family.textContent = item.familia;
    tile.appendChild(family);

    var name = document.createElement("span");
    name.className = "catalog-tile-name";
    name.textContent = item.nome;
    tile.appendChild(name);

    var meta = document.createElement("span");
    meta.className = "catalog-tile-meta";
    meta.textContent = item.codigo + (item.acabamento ? " · " + item.acabamento : "");
    tile.appendChild(meta);

    tile.addEventListener("click", function () {
      openDetailPanel(item, tile);
    });

    return tile;
  }

  function buildGrid() {
    var grid = document.createElement("div");
    grid.className = "catalog-grid";
    grid.setAttribute("role", "list");
    filteredData().forEach(function (item) {
      var tile = buildTile(item);
      tile.setAttribute("role", "listitem");
      grid.appendChild(tile);
    });
    return grid;
  }

  function refreshGrid() {
    var fresh = buildGrid();
    gridEl.replaceWith(fresh);
    gridEl = fresh;
  }

  /* ============================================================
     Bandeja de comparação
     ============================================================ */

  function buildTray() {
    var tray = document.createElement("div");
    tray.className = "compare-tray";
    tray.hidden = true;
    tray.setAttribute("aria-label", "Comparação de acabamentos selecionados");

    var items = document.createElement("div");
    items.className = "compare-tray-items";
    tray.appendChild(items);

    var action = document.createElement("button");
    action.type = "button";
    action.className = "btn btn-whatsapp";
    action.textContent = "Comparar";
    action.addEventListener("click", openComparePanel);
    tray.appendChild(action);

    return tray;
  }

  function renderTray() {
    var items = trayEl.querySelector(".compare-tray-items");
    items.innerHTML = "";
    state.compare.forEach(function (codigo) {
      var item = byCodigo(codigo);
      if (!item) return;
      var chip = document.createElement("span");
      chip.className = "compare-tray-item";
      chip.textContent = item.nome + " ";
      var remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", "Remover " + item.nome + " da comparação");
      remove.textContent = "×";
      remove.addEventListener("click", function () {
        toggleCompare(item.codigo);
      });
      chip.appendChild(remove);
      items.appendChild(chip);
    });
    trayEl.hidden = state.compare.length === 0;
  }

  function toggleCompare(codigo) {
    var idx = state.compare.indexOf(codigo);
    if (idx > -1) {
      state.compare.splice(idx, 1);
    } else {
      if (state.compare.length >= MAX_COMPARE) return false;
      state.compare.push(codigo);
    }
    renderTray();
    return true;
  }

  /* ============================================================
     Painel lateral — overlay compartilhado (detalhe e comparação)
     ============================================================ */

  var backdropEl, panelEl;

  function ensureOverlay() {
    if (panelEl) return;
    backdropEl = document.createElement("div");
    backdropEl.className = "catalog-backdrop";
    backdropEl.addEventListener("click", closePanel);
    document.body.appendChild(backdropEl);

    panelEl = document.createElement("div");
    panelEl.className = "catalog-panel";
    panelEl.setAttribute("role", "dialog");
    panelEl.setAttribute("aria-modal", "true");
    document.body.appendChild(panelEl);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panelEl.classList.contains("is-open")) {
        closePanel();
      }
    });
  }

  function openPanel(triggerEl) {
    ensureOverlay();
    lastFocused = triggerEl || document.activeElement;
    backdropEl.classList.add("is-open");
    panelEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var closeBtn = panelEl.querySelector(".catalog-panel-close");
    if (closeBtn) closeBtn.focus();
  }

  function closePanel() {
    if (!panelEl) return;
    backdropEl.classList.remove("is-open");
    panelEl.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function specRow(label, value) {
    if (!value) return "";
    return (
      '<div class="spec-row"><dt>' +
      escapeHtml(label) +
      "</dt><dd>" +
      escapeHtml(value) +
      "</dd></div>"
    );
  }

  function openDetailPanel(item, triggerEl) {
    ensureOverlay();
    panelEl.classList.remove("is-compare");

    var closeBtn = '<button type="button" class="catalog-panel-close" aria-label="Fechar detalhes">×</button>';
    var canAddCompare = state.compare.indexOf(item.codigo) > -1 || state.compare.length < MAX_COMPARE;
    var statusLabel = STATUS_LABEL[item.status] || item.status;
    var waMessage = "Olá, gostaria de consultar o acabamento " + item.codigo + " para um projeto.";

    panelEl.innerHTML =
      closeBtn +
      "<h3>" + escapeHtml(item.nome) + "</h3>" +
      '<p class="catalog-panel-meta">' + escapeHtml(item.familia) + (item.subfamilia ? " · " + escapeHtml(item.subfamilia) : "") + "</p>" +
      '<dl class="catalog-panel-specs">' +
      specRow("Código", item.codigo) +
      specRow("Acabamento", item.acabamento) +
      specRow("Dimensão", item.dimensao) +
      specRow("Série funcional", item.serieFuncional) +
      specRow("Status", statusLabel) +
      specRow("Disponibilidade", item.disponibilidade) +
      specRow("Fonte", item.origemArquivo) +
      "</dl>" +
      (item.infoTecnica ? '<p class="catalog-panel-note"><strong>Limitações e aplicação:</strong> ' + escapeHtml(item.infoTecnica) + "</p>" : "") +
      '<p class="catalog-panel-note">Imagem oficial pendente de extração/autorização — ver THIRD_PARTY_ASSETS.md.</p>' +
      '<div class="catalog-panel-actions">' +
      '<a class="btn btn-whatsapp" href="' + waLink(waMessage) + '" target="_blank" rel="noopener noreferrer">Consultar no WhatsApp</a>' +
      '<button type="button" class="btn btn-outline" data-action="compare"' + (canAddCompare ? "" : " disabled") + ">" +
      (state.compare.indexOf(item.codigo) > -1 ? "Remover da comparação" : "Adicionar à comparação") +
      "</button>" +
      "</div>";

    panelEl.querySelector(".catalog-panel-close").addEventListener("click", closePanel);

    var compareBtn = panelEl.querySelector('[data-action="compare"]');
    compareBtn.addEventListener("click", function () {
      var added = toggleCompare(item.codigo);
      if (added === false) return;
      compareBtn.textContent = state.compare.indexOf(item.codigo) > -1 ? "Remover da comparação" : "Adicionar à comparação";
    });

    openPanel(triggerEl);
  }

  function openComparePanel() {
    ensureOverlay();
    panelEl.classList.add("is-compare");
    var items = state.compare.map(byCodigo).filter(Boolean);

    var closeBtn = '<button type="button" class="catalog-panel-close" aria-label="Fechar comparação">×</button>';
    var columns = items
      .map(function (item) {
        return (
          '<div class="compare-column"><h4>' + escapeHtml(item.nome) + '</h4><dl class="catalog-panel-specs">' +
          specRow("Código", item.codigo) +
          specRow("Família", item.familia) +
          specRow("Acabamento", item.acabamento) +
          specRow("Dimensão", item.dimensao) +
          specRow("Status", STATUS_LABEL[item.status] || item.status) +
          "</dl></div>"
        );
      })
      .join("");

    panelEl.innerHTML = closeBtn + "<h3>Comparar acabamentos</h3>" + '<div class="compare-columns">' + columns + "</div>";
    panelEl.querySelector(".catalog-panel-close").addEventListener("click", closePanel);
    openPanel(trayEl.querySelector("button"));
  }

  /* ============================================================
     CTA consultivo (única, ao final da seção — não por amostra)
     ============================================================ */

  function buildConsultCTA() {
    var wrap = document.createElement("div");
    wrap.className = "catalog-consult";
    var p = document.createElement("p");
    p.textContent = "Encontrou um acabamento interessante? Fale com a equipe DYNEW sobre o seu projeto.";
    wrap.appendChild(p);
    var a = document.createElement("a");
    a.className = "btn btn-whatsapp";
    a.href = waLink("Olá, gostaria de falar sobre o meu projeto de revestimento arquitetônico.");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Falar sobre meu projeto";
    wrap.appendChild(a);
    return wrap;
  }

  /* ============================================================
     Montagem
     ============================================================ */

  mount.appendChild(buildIntro());
  mount.appendChild(buildFilters());
  gridEl = buildGrid();
  mount.appendChild(gridEl);
  trayEl = buildTray();
  mount.appendChild(trayEl);
  mount.appendChild(buildConsultCTA());

  section.hidden = false;
  if (navItem) navItem.hidden = false;
})();
