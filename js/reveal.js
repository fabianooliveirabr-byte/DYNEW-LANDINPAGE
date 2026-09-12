(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-reveal], [data-reveal-item]");
  if (!targets.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  /* Stagger dentro de cada grupo — atraso vem do índice do item, não de
     scroll contínuo (dispara uma vez, ao entrar). */
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var items = group.querySelectorAll("[data-reveal-item]");
    items.forEach(function (item, index) {
      item.style.setProperty("--reveal-delay", index * 90 + "ms");
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
