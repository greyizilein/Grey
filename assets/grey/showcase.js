/* ==========================================================
   GREY — book showcase on the home page
   One slide per book, laid out like the book's own page. Slides
   advance on their own (a progress line shows when), can be swiped
   or stepped through, and open the book's page when clicked.
   Auto-advance pauses on hover, on focus, when off screen, and is
   off for people who ask for less motion.
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, esc = G.esc, money = G.money, ROMAN = G.ROMAN;
  var root = document.getElementById("gsc");
  var books = G.books || [];
  if (!root || !books.length || !G.bookCover) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DWELL = 6500;

  function excerpt(b) {
    var text = b.blurb[0] || "";
    var cut = text.match(/^(.{60,220}?[.!?])\s/);
    return cut ? cut[1] : text.slice(0, 200) + "…";
  }

  var track = root.querySelector(".gsc-track");
  track.innerHTML = books.map(function (b, i) {
    var label = b.series ? b.series + " · Book " + ROMAN[b.number] : "A novel";
    var price = G.bookOnSale(b) ? money(b.price) : "Coming soon";
    var cover = b.cover ? ' style="--gsc-cover:url(&quot;' + esc(new URL(b.cover, location.href).href) + '&quot;)"' : "";
    return '<a class="gsc-slide" href="book.html?b=' + encodeURIComponent(b.id) + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + books.length + ": " + esc(b.title) + '"' + cover + ">" +
      '<span class="gsc-cover">' + G.bookCover(b, "gb-book-lg") + "</span>" +
      '<span class="gsc-meta">' +
        '<span class="gsc-label">' + esc(label) + "</span>" +
        '<span class="gsc-title">' + esc(b.title) + "</span>" +
        (b.subtitle ? '<span class="gsc-sub">' + esc(b.subtitle) + "</span>" : "") +
        '<span class="gsc-text">' + esc(excerpt(b)) + "</span>" +
        '<span class="gsc-foot"><span class="gsc-price' + (G.bookOnSale(b) ? "" : " gsc-soon") + '">' + price + "</span>" +
        '<span class="gsc-cta">Read more →</span></span>' +
      "</span></a>";
  }).join("");

  var slides = Array.prototype.slice.call(track.children);
  var dots = root.querySelector(".gsc-dots");
  dots.innerHTML = books.map(function (b, i) {
    return '<button type="button" class="gsc-dot" aria-label="Show ' + esc(b.title) + '"><i></i></button>';
  }).join("");
  var dotEls = Array.prototype.slice.call(dots.children);
  var current = 0, timer = null, started = 0, paused = false, visible = false;

  function mark(i) {
    current = i;
    slides.forEach(function (s, n) { s.classList.toggle("gsc-on", n === i); s.setAttribute("aria-hidden", String(n !== i)); s.tabIndex = n === i ? 0 : -1; });
    dotEls.forEach(function (d, n) { d.classList.toggle("gsc-dot-on", n === i); d.setAttribute("aria-current", n === i ? "true" : "false"); });
    restartBar();
  }
  function go(i, smooth) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: smooth === false || reduce ? "auto" : "smooth" });
    mark(i);
  }
  function restartBar() {
    var bar = dotEls[current] && dotEls[current].querySelector("i");
    dotEls.forEach(function (d) { var x = d.querySelector("i"); x.style.animation = "none"; void x.offsetWidth; x.style.animation = ""; });
    if (bar && !reduce) bar.style.animationDuration = DWELL + "ms";
    root.classList.toggle("gsc-running", !paused && visible && !reduce);
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (paused || !visible || reduce) return;
    timer = setTimeout(function () { go(current + 1); }, DWELL);
  }
  function setPaused(p) { paused = p; root.classList.toggle("gsc-running", !paused && visible && !reduce); if (paused) clearTimeout(timer); else restartBar(); }

  root.querySelector(".gsc-prev").addEventListener("click", function () { go(current - 1); });
  root.querySelector(".gsc-next").addEventListener("click", function () { go(current + 1); });
  dotEls.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });
  root.addEventListener("mouseenter", function () { setPaused(true); });
  root.addEventListener("mouseleave", function () { setPaused(false); });
  root.addEventListener("focusin", function () { setPaused(true); });
  root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) setPaused(false); });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1); }
  });

  // Swipes: follow wherever the visitor scrolls the track to.
  var settle;
  track.addEventListener("scroll", function () {
    clearTimeout(settle);
    settle = setTimeout(function () {
      var x = track.scrollLeft, best = 0, bestD = Infinity;
      slides.forEach(function (s, n) { var d = Math.abs(s.offsetLeft - track.offsetLeft - x); if (d < bestD) { bestD = d; best = n; } });
      if (best !== current) mark(best);
    }, 120);
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; restartBar(); }, { threshold: 0.35 }).observe(root);
  } else { visible = true; }
  mark(0);
})();
