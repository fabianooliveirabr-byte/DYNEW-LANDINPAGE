(function () {
  "use strict";

  var track = document.querySelector("[data-carousel]");
  if (!track) return;

  var prevBtn = document.querySelector("[data-carousel-prev]");
  var nextBtn = document.querySelector("[data-carousel-next]");

  function step() {
    var card = track.querySelector(".applications-card");
    var gap = parseFloat(getComputedStyle(track).columnGap || 24);
    return card ? card.getBoundingClientRect().width + gap : 280;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  /* Drag-to-scroll no mouse (trackpad/touch já rolam nativamente via
     overflow-x). Usa scrollLeft nativo — sem transform, sem lib nova. */
  var isDragging = false;
  var dragStartX = 0;
  var dragStartScroll = 0;
  var dragMoved = false;

  track.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch") return;
    isDragging = true;
    dragMoved = false;
    dragStartX = event.clientX;
    dragStartScroll = track.scrollLeft;
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", function (event) {
    if (!isDragging) return;
    var delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 3) dragMoved = true;
    track.scrollLeft = dragStartScroll - delta;
  });

  function endDrag() {
    isDragging = false;
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", endDrag);

  /* Evita que o drag dispare clique acidental em algo dentro do card. */
  track.addEventListener(
    "click",
    function (event) {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );
})();
