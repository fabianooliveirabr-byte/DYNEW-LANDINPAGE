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

  // prefers-reduced-motion: mostra só a primeira cena, sem timeline.
  if (reduceMotion || typeof gsap === "undefined") {
    scenes.forEach(function (scene, i) {
      scene.classList.toggle("is-active", i === 0);
    });
    return;
  }

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
        scenes.forEach(function (s, si) {
          s.classList.toggle("is-active", si === (i + 1) % scenes.length);
        });
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
