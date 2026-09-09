(function () {
  "use strict";

  /* Menu mobile acessível */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
      document.body.classList.toggle("nav-open", isOpen);
    });

    // Fecha o menu ao clicar em um link
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (mainNav.classList.contains("is-open")) {
          mainNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
          document.body.classList.remove("nav-open");
        }
      });
    });

    // Fecha o menu com a tecla Esc
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        document.body.classList.remove("nav-open");
        navToggle.focus();
      }
    });
  }

  /* FAQ acessível (accordion) */
  var faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(function (button) {
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      var answer = document.getElementById(button.getAttribute("aria-controls"));

      button.setAttribute("aria-expanded", String(!expanded));
      if (answer) {
        answer.setAttribute("data-open", String(!expanded));
      }
    });
  });

  /* Ano corrente no rodapé */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     Espaços de fotografia real (hero, quem-somos, antes/depois)
     Nenhuma foto real foi fornecida ainda. Em vez de simular com
     CSS, cada espaço usa uma <img> real apontando para o arquivo
     esperado; se o arquivo não existir, o espaço assume o estado
     "pendente" (rótulo com o caminho exato do arquivo faltante)
     em vez do ícone padrão de imagem quebrada do navegador.

     A <img> começa com opacity:0 em CSS (nunca mostra o ícone nativo
     de imagem quebrada, mesmo por um instante) e só fica visível no
     evento "load". Como as imagens começam a carregar assim que o
     HTML é parseado — antes deste script (carregado no fim do body)
     — uma imagem já pode ter falhado e perdido o evento "error" por
     esse motivo; por isso cada <img> também é checada de forma
     síncrona (img.complete && naturalWidth === 0 = já falhou). */
  function markPending(img) {
    var slot = img.closest("[data-photo-slot]");
    if (slot) slot.classList.add("is-pending");
    img.remove();
  }

  document.querySelectorAll(".js-photo-slot-img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      markPending(img);
      return;
    }
    img.addEventListener("error", function () {
      markPending(img);
    });
    img.addEventListener("load", function () {
      img.classList.add("is-loaded");
    });
  });

  /* ============================================================
     Comparador base × acabamento (único na página — seção Antes e
     Depois). Revelação controlada por arraste (mouse/toque) ou
     pelo range (teclado/acessível). Sem entrada teatral, sem
     parallax.
     ============================================================ */
  function initCompareSlider(panelId, finishId, handleId, rangeId) {
    var panel = document.getElementById(panelId);
    var finish = document.getElementById(finishId);
    var handle = document.getElementById(handleId);
    var range = document.getElementById(rangeId);

    if (!panel || !finish || !handle || !range) return;

    var setCompare = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      finish.style.clipPath = "inset(0 0 0 " + pct + "%)";
      handle.style.left = pct + "%";
      range.value = String(pct);
    };

    range.addEventListener("input", function () {
      setCompare(Number(range.value));
    });

    var dragging = false;
    var pctFromEvent = function (event) {
      var rect = panel.getBoundingClientRect();
      var clientX = event.touches ? event.touches[0].clientX : event.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    };
    panel.addEventListener("pointerdown", function (event) {
      dragging = true;
      setCompare(pctFromEvent(event));
    });
    window.addEventListener("pointermove", function (event) {
      if (dragging) setCompare(pctFromEvent(event));
    });
    window.addEventListener("pointerup", function () {
      dragging = false;
    });
  }

  initCompareSlider("beforeAfterHero", "beforeAfterFinish", "beforeAfterHandle", "beforeAfterRange");
})();
