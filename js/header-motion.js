/**
 * DYNEW CAMADA — transição do header/logo no primeiro scroll.
 * Ver docs/DYNEW-CAMADA-design-system-v1.md, seção 10 ("Transição do topo").
 *
 * Anima apenas transform, opacity, cor e backdrop (nunca largura/altura/
 * font-size) para não causar layout shift. A altura real do header já
 * nasce no tamanho final (css/style.css, .header-inner) — a logo grande
 * do estado inicial é só um transform:scale() por cima.
 */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var logo = document.getElementById("siteLogo");
  var brandLine = document.getElementById("brandLine");
  var brandCredential = document.getElementById("brandCredential");
  var navList = document.querySelector(".main-nav .nav-list");

  if (!header || !logo || !brandLine || !brandCredential) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isMobile() {
    return window.innerWidth < 700;
  }

  // Largura-alvo do estado inicial (dentro dos intervalos do design system:
  // desktop 280–520px, mobile 150–180px). O estado final é o próprio
  // tamanho renderizado da logo em CSS (nenhuma transformação aplicada).
  function initialScale() {
    var finalWidth = logo.getBoundingClientRect().width;
    if (!finalWidth) return 1;
    var targetInitial = isMobile() ? 165 : 400;
    return targetInitial / finalWidth;
  }

  function setDockedState(isDocked) {
    header.classList.toggle("is-docked", isDocked);
    brandCredential.classList.toggle("is-visible", isDocked);
    logo.style.transform = isDocked ? "scale(1)" : "scale(" + initialScale() + ")";
    brandLine.style.transform = isDocked ? "scaleX(1)" : "scaleX(0)";
    if (navList) navList.style.opacity = isDocked ? "1" : "0.78";
  }

  // --- prefers-reduced-motion: dois estados instantâneos a 24px, sem scrub ---
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    logo.style.transformOrigin = "left top";
    var applyState = function () {
      setDockedState(window.scrollY > 24);
    };
    applyState();
    window.addEventListener("scroll", applyState, { passive: true });
    window.addEventListener("resize", applyState);
    // Corrige a medida inicial da logo caso tenha sido calculada antes da
    // fonte Manrope terminar de carregar (fallback do navegador tem largura
    // diferente) — reaplica o estado assim que a fonte real estiver pronta.
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
      document.fonts.ready.then(applyState).catch(function () {});
    }
    return;
  }

  // --- movimento completo: GSAP ScrollTrigger, scrub 0.35, 0–160px ---
  gsap.registerPlugin(ScrollTrigger);
  logo.style.transformOrigin = "left top";
  brandLine.style.transformOrigin = "left center";
  // O fade do selo passa a ser escrito diretamente a partir do progresso do
  // scroll (única fonte de verdade); desliga a transition CSS para que ela
  // não fique competindo/suavizando por cima do valor já suavizado pelo scrub.
  brandCredential.style.transition = "none";

  var scale0 = initialScale();
  gsap.set(logo, { scale: scale0 });
  gsap.set(brandLine, { scaleX: 0 });
  gsap.set(navList, { opacity: 0.78 });

  var dock = { t: 0 };

  var st = ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "160px top",
    scrub: 0.35,
    onUpdate: function (self) {
      var t = self.progress;
      dock.t = t;

      header.style.backgroundColor = "rgba(17, 19, 21, " + (0.94 * t).toFixed(3) + ")";
      var blurPx = (14 * t).toFixed(2) + "px";
      header.style.backdropFilter = "blur(" + blurPx + ")";
      header.style.webkitBackdropFilter = "blur(" + blurPx + ")";
      header.style.borderBottomColor = "rgba(252, 251, 248, " + (0.08 * t).toFixed(3) + ")";

      gsap.set(logo, { scale: scale0 + (1 - scale0) * t });
      gsap.set(brandLine, { scaleX: t });
      if (navList) navList.style.opacity = String(0.78 + 0.22 * t);

      // Selo aparece só perto do fim do dock (mesmo ponto de antes, t=0.7),
      // mas agora como fade contínuo amarrado ao próprio progresso do scroll
      // em vez de uma classe + transition CSS correndo em paralelo.
      brandCredential.style.opacity = String(gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.7, 1, 0, 1, t)));
      header.classList.toggle("is-docked", t >= 0.999);
    },
    onEnter: function () {
      header.style.willChange = "background-color, backdrop-filter";
      logo.style.willChange = "transform";
    },
    onLeave: function () {
      header.style.willChange = "auto";
      logo.style.willChange = "auto";
    },
    onEnterBack: function () {
      header.style.willChange = "background-color, backdrop-filter";
      logo.style.willChange = "transform";
    },
    onLeaveBack: function () {
      header.style.willChange = "auto";
      logo.style.willChange = "auto";
    },
  });

  window.addEventListener("resize", function () {
    scale0 = initialScale();
    // ScrollTrigger.refresh() removido: este trigger usa document.body com
    // deslocamento fixo em px (não depende da altura de nenhum elemento), e
    // o próprio ScrollTrigger já reprocessa resize automaticamente (debounce
    // interno de 200ms) — chamar refresh() aqui era trabalho redundante a
    // cada evento de resize, sem nenhum recálculo útil.
  });

  // Corrige a medida inicial da logo caso o scale0 tenha sido calculado
  // antes da fonte Manrope terminar de carregar (largura do fallback do
  // navegador é diferente da fonte real) — reaplica preservando o progresso
  // de scroll atual (dock.t), sem resetar nem saltar visualmente.
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(function () {
      scale0 = initialScale();
      gsap.set(logo, { scale: scale0 + (1 - scale0) * dock.t });
    }).catch(function () {});
  }
})();
