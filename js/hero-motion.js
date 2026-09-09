/**
 * DYNEW CAMADA — hero cinematográfico em crossfade.
 * Ver docs/DYNEW-CAMADA-design-system-v1.md, seções 8, 9 e 10 ("Hero").
 *
 * Nenhuma foto/vídeo real foi fornecido ainda — cada cena é um espaço de
 * mídia real pendente (ver assets/img/README.md e os data-scene abaixo).
 * O timeline de movimento já está pronto para receber as mídias reais
 * assim que existirem, sem precisar reescrever este arquivo.
 *
 * Timing: permanência 4s por cena (dentro de 3,5–4,5s), crossfade 1000ms
 * (dentro de 900–1200ms), zoom sutil scale(1.025) -> scale(1). Sem flashes
 * brancos: o palco (.hero-camada-stage) é sempre Carbon por baixo.
 */
(function () {
  "use strict";

  var stage = document.getElementById("heroStage");
  if (!stage) return;

  var scenes = Array.prototype.slice.call(stage.querySelectorAll(".hero-scene"));
  if (scenes.length < 2) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     Rail CAMADA (01 / 04) — indicador editorial que reage à cena
     ativa do hero. Não é um estado paralelo: o passo do rail é
     sempre derivado do mesmo índice de cena que já controla o
     crossfade, no único ponto em que esse índice muda (abaixo).
     5 cenas reais agrupam-se em 4 passos do rail:
       inspeção + preparação -> 01 Base
       aplicação              -> 02 Camada
       acabamento             -> 03 Pressão
       resultado              -> 04 Revelação
     ============================================================ */
  var rail = document.getElementById("camadaRail");
  var railCurrentEl = rail && rail.querySelector(".camada-rail-current");
  var railFillEl = rail && rail.querySelector(".camada-rail-fill");
  var SCENE_TO_STEP = [1, 1, 2, 3, 4];
  var STEP_LABELS = [
    "Base — leitura e preparação do substrato",
    "Camada — aplicação do revestimento",
    "Pressão — acabamento de cantos e emendas",
    "Revelação — resultado final",
  ];
  var currentRailStep = 0;

  function setRailStep(step, animate) {
    if (!rail || step === currentRailStep) return;
    currentRailStep = step;
    rail.setAttribute("aria-label", "Etapa " + step + " de 4: " + STEP_LABELS[step - 1]);
    var target = step / 4;
    if (animate && typeof gsap !== "undefined") {
      var railTl = gsap.timeline();
      railTl
        .to(railCurrentEl, { autoAlpha: 0, duration: 0.15, ease: "power1.in" })
        .call(function () {
          railCurrentEl.textContent = step < 10 ? "0" + step : String(step);
        })
        .to(railCurrentEl, { autoAlpha: 1, duration: 0.15, ease: "power1.out" });
      if (railFillEl) {
        gsap.to(railFillEl, { scaleX: target, duration: 0.5, ease: "power2.out" });
      }
    } else {
      if (railCurrentEl) railCurrentEl.textContent = step < 10 ? "0" + step : String(step);
      if (railFillEl) railFillEl.style.transform = "scaleX(" + target + ")";
    }
  }

  // prefers-reduced-motion: mostra só a primeira cena, sem timeline.
  if (reduceMotion || typeof gsap === "undefined") {
    scenes.forEach(function (scene, i) {
      scene.classList.toggle("is-active", i === 0);
    });
    setRailStep(1, false);
    // Sem GSAP/ScrollTrigger neste modo — visibilidade do rail via scroll
    // simples (mesmo padrão do fallback de header-motion.js), não é um
    // ScrollTrigger novo nem um estado de cena paralelo.
    if (rail) {
      var heroSectionEl = document.getElementById("heroCamada");
      var applyRailVisibility = function () {
        if (!heroSectionEl) return;
        var rect = heroSectionEl.getBoundingClientRect();
        rail.classList.toggle("is-visible", rect.bottom > 0 && rect.top < window.innerHeight);
      };
      applyRailVisibility();
      window.addEventListener("scroll", applyRailVisibility, { passive: true });
      window.addEventListener("resize", applyRailVisibility);
    }
    return;
  }

  setRailStep(1, false);

  var HOLD = 4; // segundos por cena (3.5–4.5s)
  var CROSSFADE = 1; // segundos de transição (900–1200ms)

  scenes.forEach(function (scene, i) {
    gsap.set(scene, { autoAlpha: i === 0 ? 1 : 0, scale: 1 });
  });

  // Pausa/retoma o loop conforme o hero entra/sai da viewport — sem isso o
  // crossfade continuava rodando (e consumindo GPU) para sempre, mesmo com
  // o hero há muito fora de tela. Usa toggleActions em vez de scrub: não
  // amarra o progresso ao scroll, só o play/pause; preserva a cena e o
  // tempo exato em que a timeline estava ao pausar (nenhum reinício).
  var heroSection = document.getElementById("heroCamada");
  var hasScrollTrigger = heroSection && typeof ScrollTrigger !== "undefined";
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var tl = gsap.timeline({
    repeat: -1,
    paused: false,
    scrollTrigger: hasScrollTrigger
      ? {
          trigger: heroSection,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
          // Reaproveita o MESMO ScrollTrigger (nenhum novo é criado) para
          // mostrar/ocultar o rail — ele só deve existir enquanto o hero
          // está na tela.
          toggleClass: rail ? { targets: rail, className: "is-visible" } : undefined,
        }
      : undefined,
  });

  scenes.forEach(function (scene, i) {
    var next = scenes[(i + 1) % scenes.length];
    var holdStart = i * HOLD;

    // Zoom respirado na cena ativa durante a permanência.
    tl.fromTo(
      scene,
      { scale: 1.025 },
      { scale: 1, duration: HOLD, ease: "none" },
      holdStart
    );

    // Crossfade para a próxima cena, sobrepondo o fim da permanência —
    // nunca chega a opacity 0 total nas duas ao mesmo tempo (sem flash).
    tl.to(scene, { autoAlpha: 0, duration: CROSSFADE, ease: "power1.inOut" }, holdStart + HOLD - CROSSFADE);
    tl.to(next, { autoAlpha: 1, duration: CROSSFADE, ease: "power1.inOut" }, holdStart + HOLD - CROSSFADE);
    tl.call(
      function () {
        var nextIndex = (i + 1) % scenes.length;
        scenes.forEach(function (s, si) {
          s.classList.toggle("is-active", si === nextIndex);
        });
        setRailStep(SCENE_TO_STEP[nextIndex], true);
      },
      [],
      holdStart + HOLD
    );
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      tl.pause();
    } else if (!tl.scrollTrigger || tl.scrollTrigger.isActive) {
      // Só retoma ao voltar para a aba se o hero também estiver visível na
      // tela — evita reativar o loop se o usuário já rolou para longe dele.
      tl.play();
    }
  });
})();
