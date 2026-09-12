(function () {
  "use strict";

  var DINOC_MATERIALS = {
    "1": { name: "Pedra", code: "3M™ DI-NOC™ ST-2532MT" },
    "2": { name: "Teca", code: "3M™ DI-NOC™ PW-2325MT · Premium Wood" },
    "3": { name: "Koa Havaiano", code: "3M™ DI-NOC™ PW-2327MT · Premium Wood" },
    "4": { name: "Metal", code: "3M™ DI-NOC™ ME-2353 · Metallic Palette" },
    "5": { name: "Metal Oxidado", code: "3M™ DI-NOC™ ME-2564 · Oxidized Metal" },
    "6": { name: "Marrom Terracota", code: "3M™ DI-NOC™ PS-2401MTRC · E-Series RC" },
    "7": { name: "Concreto", code: "3M™ DI-NOC™ AE-2508 · Concrete / Mortar" },
    "8": { name: "Pedra", code: "3M™ DI-NOC™ ST-2536MT" },
    "9": { name: "Ferro Preto", code: "3M™ DI-NOC™ ME-2551 · Black Iron" }
  };

  var media = document.querySelector("[data-dinoc-media]");
  if (!media) return;

  var hotspots = media.querySelectorAll(".dinoc-hotspot");
  var tip = media.querySelector("[data-dinoc-tip]");
  var tipName = tip ? tip.querySelector(".dinoc-tip-name") : null;
  var tipCode = tip ? tip.querySelector(".dinoc-tip-code") : null;

  var mobilePanel = document.querySelector("[data-dinoc-panel-mobile]");
  var mobileName = mobilePanel ? mobilePanel.querySelector(".dinoc-tip-name") : null;
  var mobileCode = mobilePanel ? mobilePanel.querySelector(".dinoc-tip-code") : null;

  var pinned = null;

  function render(index) {
    var data = DINOC_MATERIALS[index];
    if (!data) return;
    if (tipName) tipName.textContent = data.name;
    if (tipCode) tipCode.textContent = data.code;
    if (mobileName) mobileName.textContent = data.name;
    if (mobileCode) mobileCode.textContent = data.code;
  }

  function show(index) {
    render(index);
    if (tip) tip.classList.add("is-visible");
  }

  function hide() {
    if (tip) tip.classList.remove("is-visible");
  }

  function setActiveButton(btn, active) {
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-expanded", String(active));
  }

  hotspots.forEach(function (btn) {
    var index = btn.getAttribute("data-hotspot");

    btn.addEventListener("mouseenter", function () {
      show(index);
    });

    btn.addEventListener("mouseleave", function () {
      if (pinned !== index) hide();
    });

    btn.addEventListener("focus", function () {
      show(index);
    });

    btn.addEventListener("blur", function () {
      if (pinned !== index) hide();
    });

    btn.addEventListener("click", function () {
      render(index);

      if (pinned === index) {
        pinned = null;
        setActiveButton(btn, false);
        hide();
        return;
      }

      hotspots.forEach(function (other) {
        setActiveButton(other, other === btn);
      });
      pinned = index;
      show(index);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && pinned !== null) {
      hotspots.forEach(function (other) {
        setActiveButton(other, false);
      });
      pinned = null;
      hide();
    }
  });

  /* Revelação progressiva dos hotspots ao entrar no viewport — nunca no
     parse da página, a seção fica bem abaixo da dobra. */
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            media.classList.add("is-visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(media);
  } else {
    media.classList.add("is-visible");
  }
})();
