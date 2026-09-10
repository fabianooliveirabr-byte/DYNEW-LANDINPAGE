/**
 * DYNEW CAMADA — transição do header/logo no primeiro scroll.
 * Ver docs/DYNEW-CAMADA-design-system-v1.md, seção 10 ("Transição do topo").
 *
 * Anima apenas opacity, cor e backdrop (nunca largura/altura) para não
 * causar layout shift. A altura real do header já nasce no tamanho final
 * (css/style.css, .header-inner).
 *
 * Logo: dois recortes do MESMO arquivo oficial (assets/images/brand/,
 * derivados de LOGO DOURADO.png) — .brand-lockup-full (símbolo+palavra,
 * estado expandido) e .brand-wordmark-docked (só a palavra, estado
 * dockado) — cada um com seu próprio tamanho responsivo em CSS puro. A
 * transição entre os dois é um crossfade de opacity na mesma timeline de
 * estado do header, não mais um transform:scale() sobre um único elemento
 * de texto.
 */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var headerBlur = document.querySelector(".site-header-blur");
  var logo = document.getElementById("siteLogo");
  var brandLockup = document.querySelector(".brand-lockup-full");
  var brandWordmark = document.querySelector(".brand-wordmark-docked");
  var brandLine = document.getElementById("brandLine");
  var brandCredential = document.getElementById("brandCredential");
  var navList = document.querySelector(".main-nav .nav-list");
  var whatsappFloat = document.querySelector(".whatsapp-float");

  if (!header || !logo || !brandLockup || !brandWordmark || !brandLine || !brandCredential) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setDockedState(isDocked) {
    header.classList.toggle("is-docked", isDocked);
    brandCredential.classList.toggle("is-visible", isDocked);
    brandLockup.style.opacity = isDocked ? "0" : "1";
    brandWordmark.style.opacity = isDocked ? "1" : "0";
    brandLine.style.transform = isDocked ? "scaleX(1)" : "scaleX(0)";
    if (navList) navList.style.opacity = isDocked ? "1" : "0.78";
  }

  // --- prefers-reduced-motion: dois estados instantâneos a 24px, sem scrub ---
  if (reduceMotion || typeof gsap === "undefined") {
    var applyState = function () {
      setDockedState(window.scrollY > 24);
      // Reaproveita este mesmo listener/estado de scroll (nenhum novo é
      // criado) para o WhatsApp: some no topo, aparece após ~80px.
      if (whatsappFloat) whatsappFloat.classList.toggle("is-visible", window.scrollY > 80);
    };
    applyState();
    window.addEventListener("scroll", applyState, { passive: true });
    window.addEventListener("resize", applyState);
    return;
  }

  // --- movimento completo: UMA timeline de estado (expanded <-> docked) ---
  // Uma timeline pausada, disparada uma única vez por direção (play/reverse)
  // quando o estado muda — nunca scrub, nunca amarrada ao progresso do
  // scroll pixel a pixel.
  brandLine.style.transformOrigin = "left center";
  brandCredential.style.transition = "none";

  gsap.set(brandLockup, { opacity: 1 });
  gsap.set(brandWordmark, { opacity: 0 });
  gsap.set(brandLine, { scaleX: 0 });
  gsap.set(navList, { opacity: 0.78 });
  header.style.backgroundColor = "rgba(17, 19, 21, 0)";
  if (headerBlur) {
    headerBlur.style.backdropFilter = "blur(0px)";
    headerBlur.style.webkitBackdropFilter = "blur(0px)";
  }

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
      header.style.willChange = "background-color";
      if (headerBlur) headerBlur.style.willChange = "backdrop-filter";
      brandLockup.style.willChange = "opacity";
      brandWordmark.style.willChange = "opacity";
    },
    onComplete: function () {
      header.style.willChange = "auto";
      if (headerBlur) headerBlur.style.willChange = "auto";
      brandLockup.style.willChange = "auto";
      brandWordmark.style.willChange = "auto";
    },
    onReverseComplete: function () {
      header.style.willChange = "auto";
      if (headerBlur) headerBlur.style.willChange = "auto";
      brandLockup.style.willChange = "auto";
      brandWordmark.style.willChange = "auto";
    },
  })
    // Crossfade do lockup completo -> wordmark dockado, rodando pela mesma
    // duração/easing das demais tweens (0.55-0.7s), com sobreposição total
    // (as duas rodam juntas o tempo inteiro) — não é uma troca seca.
    .to(brandLockup, { opacity: 0, duration: DOCK_DURATION, ease: DOCK_EASE }, 0)
    .to(brandWordmark, { opacity: 1, duration: DOCK_DURATION, ease: DOCK_EASE }, 0)
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
          if (headerBlur) {
            var blur = "blur(" + (14 * p).toFixed(2) + "px)";
            headerBlur.style.backdropFilter = blur;
            headerBlur.style.webkitBackdropFilter = blur;
          }
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
    // do WhatsApp é uma opacidade simples via classe, não faz parte da
    // transição do logo e não precisa de timeline própria.
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
})();
