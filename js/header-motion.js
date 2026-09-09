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
  var whatsappFloat = document.querySelector(".whatsapp-float");

  if (!header || !logo || !brandLine || !brandCredential) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isMobile() {
    return window.innerWidth < 700;
  }

  // Interpolação linear entre dois pontos calibrados (vw -> alvo em px).
  function lerp(x0, y0, x1, y1, x) {
    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
  }

  // Largura-alvo do estado inicial/expandido (hero). Mobile preserva o
  // valor fixo já aprovado (165px — nenhum "salto" monumental no mobile).
  // Desktop passa a variar por vw (calibrado nos 3 breakpoints pedidos:
  // ~34.7% em 1440 (500px), ~34% em 1280 (435px), ~29% em 1024 (297px),
  // interpolado entre eles e plano fora desse intervalo) em vez de um
  // valor fixo — isso é o que dá o salto visual marcante pedido, mantendo
  // o menu em uma única linha sem colisão em 1024px. O estado final
  // (docked) continua sendo o próprio tamanho renderizado da logo em CSS
  // (.logo, 2.05rem, nenhuma transformação aplicada) — não muda.
  function targetInitialPx() {
    if (isMobile()) return 165;
    var vw = window.innerWidth;
    if (vw >= 1440) return 500;
    if (vw >= 1280) return lerp(1280, 435, 1440, 500, vw);
    if (vw >= 1024) return lerp(1024, 297, 1280, 435, vw);
    return 297;
  }

  // Mede a largura-base real (sem nenhum transform), nunca a largura já
  // escalada — chamada de novo em resize/font-ready, quando a logo já pode
  // estar com um scale() anterior aplicado; medir com o transform ainda
  // ativo contaminaria a razão alvo/base e colapsaria o salto de volta a
  // ~1. A troca de style é síncrona, sem repaint entre as duas escritas.
  function measureBaseWidth() {
    var prevTransform = logo.style.transform;
    logo.style.transform = "none";
    var width = logo.getBoundingClientRect().width;
    logo.style.transform = prevTransform;
    return width;
  }

  function initialScale() {
    var finalWidth = measureBaseWidth();
    if (!finalWidth) return 1;
    return targetInitialPx() / finalWidth;
  }

  function setDockedState(isDocked) {
    header.classList.toggle("is-docked", isDocked);
    brandCredential.classList.toggle("is-visible", isDocked);
    logo.style.transform = isDocked ? "scale(1)" : "scale(" + initialScale() + ")";
    brandLine.style.transform = isDocked ? "scaleX(1)" : "scaleX(0)";
    if (navList) navList.style.opacity = isDocked ? "1" : "0.78";
  }

  // --- prefers-reduced-motion: dois estados instantâneos a 24px, sem scrub ---
  if (reduceMotion || typeof gsap === "undefined") {
    logo.style.transformOrigin = "left top";
    var applyState = function () {
      setDockedState(window.scrollY > 24);
      // Reaproveita este mesmo listener/estado de scroll (nenhum novo é
      // criado) para o WhatsApp: some no topo, aparece após ~80px.
      if (whatsappFloat) whatsappFloat.classList.toggle("is-visible", window.scrollY > 80);
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

  // --- movimento completo: UMA timeline de estado (expanded <-> docked) ---
  // Antes: ScrollTrigger com scrub 0.35 escrevia gsap.set() a cada pixel de
  // scroll (0-160px) — a marca reescalava continuamente junto com a posição
  // do scroll, o que na referência Lages não existe: lá o logo recebe um
  // "comando" de fechar/abrir, uma única transição, não um acompanhamento
  // contínuo. Isso é o oposto de scrub: uma timeline pausada, disparada uma
  // única vez por direção (play/reverse) quando o estado muda.
  logo.style.transformOrigin = "left top";
  brandLine.style.transformOrigin = "left center";
  brandCredential.style.transition = "none";

  var scale0 = initialScale();
  gsap.set(logo, { scale: scale0 });
  gsap.set(brandLine, { scaleX: 0 });
  gsap.set(navList, { opacity: 0.78 });
  header.style.backgroundColor = "rgba(17, 19, 21, 0)";
  header.style.backdropFilter = "blur(0px)";
  header.style.webkitBackdropFilter = "blur(0px)";

  var DOCK_DURATION = 0.6; // dentro de 0.55–0.7s pedido
  var DOCK_EASE = "power3.inOut"; // suave, sem bounce/elastic/overshoot
  var DOCK_SCROLL_Y = 80; // dock ao ultrapassar ~80px
  var EXPAND_SCROLL_Y = 20; // só expande de volta perto do topo (histerese)

  // Proxy numérico (0->1) só para dirigir, dentro da MESMA timeline/duração/
  // easing de tudo o mais, o fundo+blur do header — que não são propriedades
  // "limpas" o bastante para o parser genérico de valores complexos do GSAP
  // (blur() dentro de backdrop-filter). Continua sendo UMA única fonte de
  // verdade: não é um listener de scroll novo, só onUpdate desta tween.
  var headerFade = { t: 0 };

  var headerDockTimeline = gsap.timeline({
    paused: true,
    onStart: function () {
      header.style.willChange = "background-color, backdrop-filter";
      logo.style.willChange = "transform";
    },
    onComplete: function () {
      header.style.willChange = "auto";
      logo.style.willChange = "auto";
    },
    onReverseComplete: function () {
      header.style.willChange = "auto";
      logo.style.willChange = "auto";
    },
  })
    .to(logo, { scale: 1, duration: DOCK_DURATION, ease: DOCK_EASE }, 0)
    .to(brandLine, { scaleX: 1, duration: DOCK_DURATION, ease: DOCK_EASE }, 0)
    .to(
      headerFade,
      {
        t: 1,
        duration: DOCK_DURATION,
        ease: DOCK_EASE,
        onUpdate: function () {
          var p = headerFade.t;
          header.style.backgroundColor = "rgba(17, 19, 21, " + (0.94 * p).toFixed(3) + ")";
          var blurPx = (14 * p).toFixed(2) + "px";
          header.style.backdropFilter = "blur(" + blurPx + ")";
          header.style.webkitBackdropFilter = "blur(" + blurPx + ")";
        },
      },
      0
    );
  if (navList) {
    headerDockTimeline.to(navList, { opacity: 1, duration: DOCK_DURATION, ease: DOCK_EASE }, 0);
  }

  // Estado guardado explicitamente — só chama play()/reverse() quando ele
  // realmente muda (nunca a cada evento de scroll). A mesma timeline sempre;
  // mudar de direção no meio simplesmente inverte a partir do progresso
  // atual (comportamento nativo do GSAP), sem tween concorrente/acumulada.
  var isDocked = false;

  function applyWhatsappVisibility() {
    // Continua o mesmo listener de scroll (nenhum novo criado); o show/hide
    // do WhatsApp é uma opacidade simples via classe, não faz parte do
    // "tremor" do logo e não precisa de timeline própria.
    if (whatsappFloat) whatsappFloat.classList.toggle("is-visible", window.scrollY > 80);
  }

  function handleScroll() {
    var y = window.scrollY;
    if (!isDocked && y >= DOCK_SCROLL_Y) {
      isDocked = true;
      header.classList.add("is-docked");
      headerDockTimeline.play();
    } else if (isDocked && y <= EXPAND_SCROLL_Y) {
      isDocked = false;
      header.classList.remove("is-docked");
      headerDockTimeline.reverse();
    }
    applyWhatsappVisibility();
  }

  // Sincroniza o estado inicial sem animar (ex.: página carregando já rolada
  // por retorno de navegação/âncora) — pula direto para o fim da timeline em
  // vez de tocar a transição na carga da página.
  if (window.scrollY >= DOCK_SCROLL_Y) {
    isDocked = true;
    header.classList.add("is-docked");
    headerDockTimeline.progress(1);
  }
  applyWhatsappVisibility();

  window.addEventListener("scroll", handleScroll, { passive: true });

  window.addEventListener("resize", function () {
    scale0 = initialScale();
    // O alvo do estado expandido varia por vw (seção acima) — invalida a
    // timeline para ela recalcular o valor de partida do logo na próxima
    // vez que rodar, e já reaplica na hora se estiver expandido agora
    // (dockado não muda: o alvo final continua sendo scale(1) sempre).
    headerDockTimeline.invalidate();
    if (!isDocked && !headerDockTimeline.isActive()) {
      gsap.set(logo, { scale: scale0 });
    }
  });

  // Corrige a medida inicial da logo caso o scale0 tenha sido calculado
  // antes da fonte Manrope terminar de carregar (largura do fallback do
  // navegador é diferente da fonte real).
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(function () {
      scale0 = initialScale();
      headerDockTimeline.invalidate();
      if (!isDocked) {
        gsap.set(logo, { scale: scale0 });
      }
    }).catch(function () {});
  }
})();
