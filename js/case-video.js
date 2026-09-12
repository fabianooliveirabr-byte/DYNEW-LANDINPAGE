(function () {
  "use strict";

  var videos = document.querySelectorAll("[data-case-video]");
  if (!videos.length) return;

  /* prefers-reduced-motion: nunca depende de autoplay — o poster já
     apresenta o projeto adequadamente. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Histerese entre tocar e pausar: um único threshold (ex.: 0.35) fazia o
     vídeo pausar assim que o ratio de interseção caísse um pouco abaixo
     dele — o que acontece facilmente durante o scroll real (bounce de
     rubber-band no iOS, barra de endereço do mobile escondendo/mostrando e
     mudando a altura da viewport, reflow enquanto pôsteres/imagens
     carregam). Resultado: o vídeo tocava um instante e pausava de novo
     antes do usuário perceber. Tocar cedo (15%) e só pausar quase saindo
     de vez da tela (5%) resolve isso sem exigir sincronizar os frames dos
     dois vídeos. */
  var PLAY_THRESHOLD = 0.15;
  var PAUSE_THRESHOLD = 0.05;

  /* Rede de segurança: por ~5s depois de entrar na seção, reconfirma
     periodicamente que todo vídeo marcado "deveria estar tocando" está de
     fato tocando. Cobre o caso de conexões lentas (preload="auto" é só uma
     dica — navegadores em economia de dados/dados móveis podem ignorá-lo)
     e o caso de um play() que ficou pendente e foi abortado por um pause()
     quase simultâneo (AbortError), sem depender só do evento de retry. */
  var SAFETY_POLL_MS = 600;
  var SAFETY_POLL_ATTEMPTS = 8;

  function forceMuted(video) {
    /* Garante muted=true na propriedade (não só no atributo HTML)
       imediatamente antes de cada play() — remove qualquer ambiguidade de
       estado em navegadores que reavaliam a política de autoplay no
       momento exato da chamada. */
    video.muted = true;
    video.defaultMuted = true;
  }

  /* play() defensivo: alguns navegadores mobile rejeitam (ou simplesmente
     não avançam) um play() disparado antes do vídeo ter dados suficientes
     no buffer, ou quando duas chamadas de play() acontecem no mesmo tick
     (heurística de "autoplay simultâneo"). Tenta de novo em eventos de
     progresso de carregamento e, por segurança, mais uma vez com um
     pequeno atraso — sem isso, uma falha silenciosa do play() deixa o
     vídeo parado no poster indefinidamente. */
  function attemptPlay(video) {
    if (!video.paused) return;
    forceMuted(video);
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        setTimeout(function () {
          /* Reconfere _caseVideoShouldPlay antes de tentar de novo — sem
             isso, um retry atrasado podia religar um vídeo que o usuário
             já tinha deixado de ver (saiu da seção antes do retry disparar). */
          if (video._caseVideoShouldPlay && video.paused) {
            forceMuted(video);
            video.play().catch(function () {});
          }
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

  function startSafetyPoll(list) {
    var attempts = 0;
    var id = setInterval(function () {
      attempts++;
      var stillNeeded = false;
      list.forEach(function (video) {
        if (video._caseVideoShouldPlay && video.paused) {
          stillNeeded = true;
          attemptPlay(video);
        }
      });
      if (!stillNeeded || attempts >= SAFETY_POLL_ATTEMPTS) clearInterval(id);
    }, SAFETY_POLL_MS);
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
    startSafetyPoll(list);
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
     grupo (antes/depois da piscina de bolinha) todos tocam/pausam SEMPRE
     juntos, nunca um congelado enquanto o outro roda. O gatilho de
     visibilidade é a seção inteira, não cada vídeo isoladamente. */
  var groups = [];
  videos.forEach(function (video) {
    var section = video.closest("section") || video.parentElement;
    var group = groups.filter(function (g) {
      return g.section === section;
    })[0];
    if (!group) {
      group = { section: section, videos: [], playing: false };
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
        var ratio = entry.intersectionRatio;
        if (!group.playing && ratio >= PLAY_THRESHOLD) {
          group.playing = true;
          playAll(group.videos);
        } else if (group.playing && ratio <= PAUSE_THRESHOLD) {
          group.playing = false;
          pauseAll(group.videos);
        }
      });
    },
    { threshold: [0, PAUSE_THRESHOLD, PLAY_THRESHOLD, 0.5, 1] }
  );

  groups.forEach(function (group) {
    observer.observe(group.section);
  });
})();
