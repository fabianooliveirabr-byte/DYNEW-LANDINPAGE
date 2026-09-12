(function () {
  "use strict";

  var videos = document.querySelectorAll("[data-case-video]");
  if (!videos.length) return;

  /* prefers-reduced-motion: nunca depende de autoplay — o poster já
     apresenta o projeto adequadamente. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* play() defensivo: alguns navegadores mobile rejeitam (ou simplesmente
     não avançam) um play() disparado antes do vídeo ter dados suficientes
     no buffer, ou quando duas chamadas de play() acontecem no mesmo tick
     (heurística de "autoplay simultâneo"). Tenta de novo em eventos de
     progresso de carregamento e, por segurança, mais uma vez com um
     pequeno atraso — sem isso, uma falha silenciosa do play() deixa o
     vídeo parado no poster indefinidamente, já que o observer só dispara
     play() uma vez por entrada na tela. */
  function attemptPlay(video) {
    if (!video.paused) return;
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        setTimeout(function () {
          if (video.paused) video.play().catch(function () {});
        }, 350);
      });
    }
  }

  function bindRetry(video) {
    if (video._caseVideoRetryBound) return;
    video._caseVideoRetryBound = true;
    ["loadeddata", "canplay", "canplaythrough"].forEach(function (evt) {
      video.addEventListener(evt, function () {
        if (video._caseVideoShouldPlay && video.paused) attemptPlay(video);
      });
    });
  }

  function playAll(list) {
    list.forEach(function (video, index) {
      video._caseVideoShouldPlay = true;
      bindRetry(video);
      /* Pequeno intervalo entre os play() do grupo (em vez de todos no
         mesmo tick) — evita a heurística de alguns navegadores mobile que
         rejeita autoplays disparados em lote. */
      setTimeout(function () {
        attemptPlay(video);
      }, index * 120);
    });
  }

  function pauseAll(list) {
    list.forEach(function (video) {
      video._caseVideoShouldPlay = false;
      video.pause();
    });
  }

  if (!("IntersectionObserver" in window)) {
    playAll(Array.prototype.slice.call(videos));
    return;
  }

  /* Agrupa os vídeos pela <section> ancestral comum — dentro do mesmo
     grupo (ex.: antes/depois da piscina de bolinha) todos tocam/pausam
     SEMPRE juntos, nunca um congelado enquanto o outro roda. O gatilho de
     visibilidade é a seção inteira, não cada vídeo isoladamente, então o
     início e o reinício ao rolar de volta são sempre coerentes entre os
     dois lados. */
  var groups = [];
  videos.forEach(function (video) {
    var section = video.closest("section") || video.parentElement;
    var group = groups.filter(function (g) {
      return g.section === section;
    })[0];
    if (!group) {
      group = { section: section, videos: [] };
      groups.push(group);
    }
    group.videos.push(video);
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var group = groups.filter(function (g) {
          return g.section === entry.target;
        })[0];
        if (!group) return;
        if (entry.isIntersecting) {
          playAll(group.videos);
        } else {
          pauseAll(group.videos);
        }
      });
    },
    { threshold: 0.35 }
  );

  groups.forEach(function (group) {
    observer.observe(group.section);
  });
})();
