/* ==========================================================
   GREY — the sample reader (reader.html?b=<id>)
   The sample's text comes from assets/grey/samples/<id>.json:
     { "chapters": [ { "label": "Chapter 1", "title": "…",
                       "paras": [ "text", { "b": 1 }, { "d": "Israel, 1028 BC" } ],
                       "front": 1 } ] }
   ({ "b": 1 } is a scene break, { "d": … } a dateline, "front"
   marks a note before the story, which gets no drop cap.)
   The whole sample flows through CSS columns; a "page" is one
   column on phones and two side by side on wide screens. Turning
   a page slides the columns along. Where you are is kept per book,
   by paragraph, so it survives a change of text size or screen.
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY || {}, esc = G.esc, ROMAN = G.ROMAN || [];
  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement, body = document.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SIZES = [15, 16, 17, 18, 20, 22];
  var WPM = 230;

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  var id = new URLSearchParams(location.search).get("b");
  var book = (G.books || []).filter(function (x) { return x.id === id; })[0];
  var stage = $("gr-stage"), bookEl = $("gr-book"), view = $("gr-view"), flow = $("gr-flow");

  function missing() {
    $("gr-loading").hidden = true;
    $("gr-missing").hidden = false;
    $("gr-intro").classList.add("gr-intro-done");
    body.classList.add("gr-ready");
    $("gr-booktitle").textContent = "Grey bookshop";
    ["gr-toc-btn", "gr-set-btn"].forEach(function (x) { $(x).hidden = true; });
    document.querySelector(".gr-bottom").hidden = true;
  }
  if (!book || !book.sample) { missing(); return; }

  var bookHref = "book.html?b=" + encodeURIComponent(book.id);
  var seriesLabel = book.series ? book.series + " · Book " + ROMAN[book.number] : "A novel";
  document.title = "Reading " + book.title + " | Grey";
  $("gr-booktitle").textContent = book.title;
  $("gr-close").href = bookHref;
  $("gr-intro-title").textContent = book.title;
  $("gr-intro-cover").innerHTML = G.bookCover ? G.bookCover(book) : "";
  var introImg = $("gr-intro-cover").querySelector("img");
  if (introImg) introImg.loading = "eager";

  /* ── The opening ── */
  var intro = $("gr-intro"), introDone = false, introReady = false, textReady = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    intro.classList.add("gr-intro-done");
    body.classList.add("gr-ready");
  }
  if (reduce) { introReady = true; }
  else {
    var skip = document.createElement("span");
    skip.className = "gr-intro-skip";
    skip.textContent = "Tap to skip";
    intro.appendChild(skip);
    setTimeout(function () { intro.classList.add("gr-intro-1"); }, 60);
    setTimeout(function () { intro.classList.add("gr-intro-2"); G.sound && G.sound.play("page"); }, 850);
    setTimeout(function () {
      introReady = true;
      if (textReady) { intro.classList.add("gr-intro-3"); setTimeout(finishIntro, 450); }
    }, 2050);
    intro.addEventListener("click", function () { introReady = true; if (textReady) finishIntro(); });
  }

  /* ── Build the pages ── */
  var chapters = [], blocks = [], totalWords = 0;
  function words(s) { return (String(s).match(/\S+/g) || []).length; }

  function build(data) {
    chapters = data.chapters || [];
    var h = [];
    var globe = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="white" stroke-width="2"/></svg>';
    h.push('<section class="gr-titlepage" data-kind="title">' +
      '<span class="gr-kicker">A free sample</span>' +
      '<span class="gr-tp-series">' + esc(seriesLabel) + "</span>" +
      '<h1 class="gr-tp-title">' + esc(book.title) + "</h1>" +
      (book.subtitle ? '<span class="gr-tp-sub">' + esc(book.subtitle) + "</span>" : "") +
      '<span class="gr-tp-rule"></span>' +
      '<span class="gr-tp-author">' + esc(book.author || "Grey Izilein") + "</span>" +
      (book.note ? '<p class="gr-tp-note"><b>Before you read</b>' + esc(book.note) + "</p>" : "") +
      '<span class="gr-tp-mark"><i>' + globe + "</i>Grey</span>" +
      "</section>");
    var n = 0;
    chapters.forEach(function (c, ci) {
      h.push('<section class="gr-chapter' + (c.front ? " gr-front" : "") + '" data-ch="' + ci + '">' +
        '<header class="gr-ch-open" data-i="' + (n++) + '">' +
          '<span class="gr-ch-label">' + esc(c.label || "") + "</span>" +
          (c.front ? "" : '<span class="gr-ch-num" aria-hidden="true">' + esc(String(c.label || "").replace(/^\D+/, "")) + "</span>") +
          '<h2 class="gr-ch-title">' + esc(c.title) + "</h2>" +
          '<span class="gr-ch-rule"></span>' +
        "</header>");
      var first = !c.front, after = true;
      (c.paras || []).forEach(function (p) {
        if (p && p.b) { h.push('<div class="gr-break" data-i="' + (n++) + '" role="separator"><span></span></div>'); return; }
        if (p && p.d) { h.push('<p class="gr-date" data-i="' + (n++) + '">' + esc(p.d) + "</p>"); return; }
        totalWords += words(p);
        var cls = first ? "gr-first" : after ? "gr-noindent" : "";
        var text = esc(p);
        if (first) {
          // The opening words set in small capitals after the drop cap, as in a printed book
          var m = text.match(/^(\S+(?:\s+\S+){0,2})(\s[\s\S]*)?$/);
          if (m) text = '<span class="gr-lead">' + m[1] + "</span>" + (m[2] || "");
        }
        h.push("<p" + (cls ? ' class="' + cls + '"' : "") + ' data-i="' + (n++) + '">' + text + "</p>");
        first = false; after = false;
      });
      h.push("</section>");
    });
    h.push(endCard());
    h.push('<span class="gr-endmark" aria-hidden="true"></span>');
    flow.innerHTML = h.join("");
    blocks = Array.prototype.slice.call(flow.querySelectorAll("[data-i]"));
    var endCover = flow.querySelector(".gr-end-cover img");
    if (endCover) endCover.loading = "eager";
  }

  function endCard() {
    var sale = G.bookOnSale && G.bookOnSale(book);
    return '<section class="gr-end" data-kind="end">' +
      '<span class="gr-kicker">End of the sample</span>' +
      '<div class="gr-end-cover">' + (G.bookCover ? G.bookCover(book) : "") + "</div>" +
      "<h2>The story doesn't stop here.</h2>" +
      "<p>" + (sale
        ? "Get the whole of " + esc(book.title) + ". Pay once and the book is yours to download and keep."
        : esc(book.title) + " isn't on sale just yet. It will be in the bookshop soon.") + "</p>" +
      (sale ? '<span class="gr-end-price">' + G.money(book.price) + "</span>" : '<span class="gr-end-soon">Coming soon</span>') +
      '<div class="gr-end-actions">' +
        (sale ? '<a class="gr-btn gr-btn-solid" href="' + esc(book.buyLink) + '" target="_blank" rel="noopener noreferrer" data-bell>Buy &amp; download ↗</a>' : "") +
        '<a class="gr-btn" href="' + bookHref + '">About the book</a>' +
        '<a class="gr-btn" href="products.html#books">The bookshop</a>' +
      "</div>" +
      '<button type="button" class="gr-end-again" id="gr-again">↺ Read from the start</button>' +
      "</section>";
  }

  /* ── Layout ── */
  var L = {}, page = 0, pages = 1, chapterCols = [], openCols = {}, lastCol = 0, endCol = 0;

  function colOf(el) { return Math.max(0, Math.round((el.offsetLeft - 2) / L.colStep - 0.49)); }

  function layout() {
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var spread = sw >= 1060 && sh >= 480, narrow = sw < 640;
    var padX, padY, W, G2, bookH;
    if (spread) {
      padX = 60; padY = 58; G2 = 2 * padX;
      W = Math.min(470, Math.floor((sw - 2 * 92 - 2 * padX - G2) / 2));
      bookH = Math.min(sh - 28, 940);
    } else if (narrow) {
      padX = 24; padY = 46; G2 = 2 * padX;
      W = sw - 2 * padX;
      bookH = sh;
    } else {
      padX = 56; padY = 56; G2 = 2 * padX;
      W = Math.min(600, sw - 2 * 92 - 2 * padX);
      bookH = Math.min(sh - 28, 940);
    }
    var per = spread ? 2 : 1, viewW = per * W + (per - 1) * G2, H = bookH - 2 * padY;
    L = { per: per, W: W, G: G2, H: H, colStep: W + G2, pageStep: per * (W + G2), padX: padX };
    body.classList.toggle("gr-spread", spread);
    body.classList.toggle("gr-single", !spread);
    body.classList.toggle("gr-narrow", narrow);
    bookEl.style.width = viewW + 2 * padX + "px";
    bookEl.style.height = bookH + "px";
    view.style.cssText = "position:absolute;left:" + padX + "px;top:" + padY + "px;width:" + viewW + "px;height:" + H + "px";
    flow.style.width = viewW + "px";
    flow.style.columnCount = per;
    flow.style.columnGap = G2 + "px";
    document.querySelectorAll(".gr-heads, .gr-folios").forEach(function (x) { x.style.padding = "0 " + padX + "px"; });

    endCol = colOf(flow.querySelector(".gr-end"));
    lastCol = Math.max(endCol, colOf(flow.querySelector(".gr-endmark")));
    pages = Math.floor(lastCol / per) + 1;
    chapterCols = Array.prototype.map.call(flow.querySelectorAll(".gr-chapter"), function (s) { return colOf(s); });
    openCols = {};
    chapterCols.forEach(function (c) { openCols[c] = true; });
    var scrub = $("gr-scrub");
    scrub.max = pages - 1;
  }

  /* ── Where you are ── */
  function chapterAt(col) {
    var ci = -1;
    chapterCols.forEach(function (c, i) { if (c <= col) ci = i; });
    return ci;
  }
  function anchor() {
    var start = page * L.per;
    for (var i = 0; i < blocks.length; i++) if (colOf(blocks[i]) >= start) return i;
    return blocks.length;
  }
  function pageOfBlock(i) {
    if (i >= blocks.length) return pages - 1;
    return Math.min(pages - 1, Math.floor(colOf(blocks[i]) / L.per));
  }
  function save() { store("grey-reader:" + book.id, JSON.stringify({ a: anchor(), t: Date.now() })); }

  function headFor(col) {
    if (col === 0 || col >= endCol || openCols[col]) return "";
    var ci = chapterAt(col);
    return ci < 0 ? "" : chapters[ci].title;
  }
  function folioFor(col) { return col === 0 || col >= endCol || col > lastCol ? "" : String(col); }

  function paint() {
    var first = page * L.per, ci = chapterAt(first + L.per - 1);
    if (L.per === 2) {
      $("gr-head-l").textContent = first === 0 || first >= endCol || openCols[first] ? "" : book.title;
      $("gr-head-r").textContent = headFor(first + 1);
      $("gr-folio-l").textContent = folioFor(first);
      $("gr-folio-r").textContent = folioFor(first + 1);
    } else {
      $("gr-head-r").textContent = headFor(first);
      $("gr-folio-r").textContent = folioFor(first);
    }
    var atEnd = first + L.per - 1 >= endCol;
    $("gr-chap").textContent = page === 0 ? "Title page" : atEnd ? "End of the sample" : ci >= 0 ? (chapters[ci].label ? chapters[ci].label + " · " : "") + chapters[ci].title : "";
    var pct = pages > 1 ? page / (pages - 1) : 1;
    var left = "";
    if (!atEnd && ci >= 0 && page > 0) {
      var nextStart = ci + 1 < chapterCols.length ? chapterCols[ci + 1] : endCol;
      var textCols = Math.max(1, endCol - 1);
      var wpc = totalWords / textCols;
      var mins = Math.ceil(Math.max(0, nextStart - (first + L.per)) * wpc / WPM);
      left = mins > 0 ? mins + " min left in chapter" : "Last page of the chapter";
    }
    $("gr-left").textContent = (left ? left + " · " : "") + Math.round(pct * 100) + "%";
    $("gr-bar").style.transform = "scaleX(" + pct + ")";
    var scrub = $("gr-scrub");
    scrub.value = page;
    scrub.style.setProperty("--gr-p", pct * 100 + "%");
    scrub.setAttribute("aria-valuetext", "Page " + (page + 1) + " of " + pages);
    $("gr-prev").disabled = page === 0;
    $("gr-next").disabled = page >= pages - 1;
    // Contents: mark the chapter you're in
    Array.prototype.forEach.call($("gr-toc-list").querySelectorAll("button"), function (b) {
      b.setAttribute("aria-current", String(+b.dataset.ch === ci && !atEnd && page > 0));
      if (b.dataset.ch !== undefined) b.querySelector(".gr-toc-p").textContent = "p. " + (chapterCols[+b.dataset.ch] || 0);
    });
  }

  function place(animate) {
    body.classList.toggle("gr-turning", !!animate && !reduce);
    flow.style.transform = "translate3d(" + -page * L.pageStep + "px,0,0)";
  }

  function go(p, opts) {
    opts = opts || {};
    p = Math.max(0, Math.min(pages - 1, p));
    var moved = p !== page;
    var dir = p > page ? "gr-fwd" : "gr-back";
    page = p;
    place(opts.animate !== false);
    paint();
    if (moved) {
      save();
      if (opts.animate !== false && !reduce && Math.abs(opts.step || 1) === 1) {
        var sh = $("gr-sheen");
        sh.classList.remove("gr-fwd", "gr-back"); void sh.offsetWidth; sh.classList.add(dir);
      }
      if (opts.sound !== false) G.sound && G.sound.play("page");
      if (opts.immerse !== false) immerse(true);
    }
  }
  function next() { go(page + 1); }
  function prev() { go(page - 1); }

  /* ── Chrome that gets out of the way ── */
  function immerse(on) {
    if (on && (panelOpen() || page === 0)) return;
    body.classList.toggle("gr-immersed", on);
  }
  function panelOpen() { return !$("gr-toc").hidden || !$("gr-set").hidden; }
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    if (e.clientY < 90 || e.clientY > innerHeight - 90) immerse(false);
  }, { passive: true });

  /* ── Turning pages: tap, click, swipe, wheel, keys ── */
  var drag = null, dragged = false;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" || !body.classList.contains("gr-ready")) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, live: false };
  });
  stage.addEventListener("pointermove", function (e) {
    if (!drag) return;
    drag.dx = e.clientX - drag.x;
    var dy = e.clientY - drag.y;
    if (!drag.live && Math.abs(drag.dx) > 10 && Math.abs(drag.dx) > Math.abs(dy)) drag.live = true;
    if (!drag.live) return;
    var edge = (page === 0 && drag.dx > 0) || (page === pages - 1 && drag.dx < 0);
    var dx = edge ? drag.dx / 4 : drag.dx;
    body.classList.remove("gr-turning");
    flow.style.transform = "translate3d(" + (-page * L.pageStep + dx) + "px,0,0)";
  }, { passive: true });
  function endDrag() {
    if (!drag) return;
    var d = drag; drag = null;
    if (!d.live) return;
    dragged = true;
    setTimeout(function () { dragged = false; }, 60);
    var need = Math.min(70, L.W * 0.18);
    if (d.dx < -need && page < pages - 1) next();
    else if (d.dx > need && page > 0) prev();
    else place(true);
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  stage.addEventListener("click", function (e) {
    if (dragged || !body.classList.contains("gr-ready")) return;
    if (e.target.closest("a, button, input, .gr-tp-note")) return;
    var sel = window.getSelection && String(window.getSelection());
    if (sel) return;
    var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (x < 0.3) prev();
    else if (x > 0.7) next();
    else immerse(!body.classList.contains("gr-immersed"));
  });
  $("gr-prev").addEventListener("click", function (e) { e.stopPropagation(); prev(); });
  $("gr-next").addEventListener("click", function (e) { e.stopPropagation(); next(); });

  var wheelAcc = 0, wheelLock = 0;
  stage.addEventListener("wheel", function (e) {
    e.preventDefault();
    var now = Date.now();
    if (now < wheelLock) return;
    wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(wheelAcc) > 40) {
      wheelAcc > 0 ? next() : prev();
      wheelAcc = 0;
      wheelLock = now + 520;
    }
  }, { passive: false });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (panelOpen()) { closePanels(); e.preventDefault(); } return; }
    if (!body.classList.contains("gr-ready") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!introDone) { introReady = true; if (textReady) finishIntro(); }
    var t = e.target;
    if (t && (t.matches("input, textarea") || (t.closest && t.closest(".gr-set, .gr-toc")))) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !e.shiftKey)) { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp" || (k === " " && e.shiftKey)) { e.preventDefault(); prev(); }
    else if (k === "Home") { e.preventDefault(); go(0, { step: 2 }); }
    else if (k === "End") { e.preventDefault(); go(pages - 1, { step: 2 }); }
  });

  // Tabbing to a link on another page (the end card) turns to that page
  flow.addEventListener("focusin", function (e) {
    var p = Math.floor(colOf(e.target) / L.per);
    if (p !== page) go(p, { step: 2, sound: false, immerse: false });
    view.scrollLeft = 0;
  });
  view.addEventListener("scroll", function () { view.scrollLeft = 0; view.scrollTop = 0; });

  /* ── Scrubber ── */
  var tip = $("gr-scrub-tip");
  function showTip() {
    var s = $("gr-scrub"), p = +s.value, f = pages > 1 ? p / (pages - 1) : 0;
    var col = p * L.per, ci = chapterAt(col);
    tip.textContent = "p. " + (col || 1) + (col >= endCol ? " · The end" : ci >= 0 ? " · " + chapters[ci].title : " · Title page");
    tip.style.left = "calc(" + f * 100 + "% + " + (7 - f * 14) + "px)";
    tip.classList.add("gr-on");
  }
  $("gr-scrub").addEventListener("input", function () {
    showTip();
    go(+this.value, { step: 2, sound: false, immerse: false });
  });
  ["change", "pointerup", "blur"].forEach(function (ev) { $("gr-scrub").addEventListener(ev, function () { setTimeout(function () { tip.classList.remove("gr-on"); }, 500); }); });

  /* ── Contents ── */
  function buildToc() {
    var items = [{ l: "A free sample", t: book.title, p: 0, ch: null }].concat(chapters.map(function (c, i) {
      return { l: c.label, t: c.title, ch: i };
    }));
    $("gr-toc-list").innerHTML = items.map(function (it) {
      return "<li><button type=\"button\"" + (it.ch === null ? ' data-start' : ' data-ch="' + it.ch + '"') + ">" +
        '<span class="gr-toc-l">' + esc(it.l || "") + "</span>" +
        '<span class="gr-toc-t">' + esc(it.t) + "</span>" +
        '<span class="gr-toc-p"></span></button></li>';
    }).join("") + '<li><button type="button" data-end><span class="gr-toc-l">After the sample</span><span class="gr-toc-t">Get the book</span><span class="gr-toc-p"></span></button></li>';
    $("gr-toc-list").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      closePanels();
      if (b.hasAttribute("data-start")) go(0, { step: 2, immerse: false });
      else if (b.hasAttribute("data-end")) go(pages - 1, { step: 2 });
      else go(Math.floor(chapterCols[+b.dataset.ch] / L.per), { step: 2 });
    });
  }

  /* ── Panels ── */
  var scrim = $("gr-scrim");
  function openPanel(which) {
    var p = $(which), btn = $(which + "-btn");
    var was = !p.hidden;
    closePanels();
    if (was) return;
    p.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    if (which === "gr-toc") scrim.hidden = false;
    immerse(false);
    G.sound && G.sound.play("open");
    var f = p.querySelector("[aria-current='true'], [aria-checked='true'], button");
    if (f && which === "gr-toc") f.focus({ preventScroll: false });
  }
  function closePanels() {
    ["gr-toc", "gr-set"].forEach(function (w) {
      if ($(w).hidden) return;
      $(w).hidden = true;
      $(w + "-btn").setAttribute("aria-expanded", "false");
    });
    scrim.hidden = true;
  }
  $("gr-toc-btn").addEventListener("click", function (e) { e.stopPropagation(); openPanel("gr-toc"); });
  $("gr-set-btn").addEventListener("click", function (e) { e.stopPropagation(); openPanel("gr-set"); });
  scrim.addEventListener("click", closePanels);
  $("gr-toc").querySelector("[data-close]").addEventListener("click", closePanels);
  document.addEventListener("click", function (e) {
    if (!$("gr-set").hidden && !e.target.closest("#gr-set, #gr-set-btn")) closePanels();
  });

  /* ── Settings: light and text size ── */
  function setTheme(t) {
    root.setAttribute("data-gr", t);
    store("grey-reader-theme", t);
    Array.prototype.forEach.call(document.querySelectorAll(".gr-theme"), function (b) { b.setAttribute("aria-checked", String(b.dataset.t === t)); });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--r-desk").trim() || "#000";
  }
  Array.prototype.forEach.call(document.querySelectorAll(".gr-theme"), function (b) {
    b.addEventListener("click", function () { setTheme(b.dataset.t); });
  });
  setTheme(root.getAttribute("data-gr") || "night");

  var sizeI = +store("grey-reader-size");
  if (!(sizeI >= 0 && sizeI < SIZES.length)) sizeI = stage.clientWidth < 640 ? 2 : 3;
  $("gr-size-dots").innerHTML = SIZES.map(function () { return "<i></i>"; }).join("");
  function setSize(i, relayout) {
    sizeI = Math.max(0, Math.min(SIZES.length - 1, i));
    store("grey-reader-size", sizeI);
    root.style.setProperty("--gr-size", SIZES[sizeI] + "px");
    Array.prototype.forEach.call($("gr-size-dots").children, function (d, n) { d.classList.toggle("gr-on", n === sizeI); });
    $("gr-smaller").disabled = sizeI === 0;
    $("gr-bigger").disabled = sizeI === SIZES.length - 1;
    if (relayout) reflow();
  }
  $("gr-smaller").addEventListener("click", function () { setSize(sizeI - 1, true); });
  $("gr-bigger").addEventListener("click", function () { setSize(sizeI + 1, true); });
  setSize(sizeI, false);

  function reflow() {
    if (!blocks.length) return;
    var a = page === 0 ? -1 : anchor();
    layout();
    page = a < 0 ? 0 : pageOfBlock(a);
    place(false);
    paint();
  }
  var rt;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(reflow, 120); });

  /* ── Toast ── */
  function toast(text, act, fn) {
    var t = $("gr-toast");
    $("gr-toast-text").textContent = text;
    var b = $("gr-toast-act");
    b.textContent = act;
    b.onclick = function () { t.hidden = true; fn(); };
    t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.hidden = true; }, 6500);
  }

  /* ── Go ── */
  var src = "assets/grey/samples/" + encodeURIComponent(book.id) + ".json";
  Promise.all([
    fetch(src, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }),
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
  ]).then(function (res) {
    build(res[0]);
    buildToc();
    var cover = flow.querySelector(".gr-end-cover img");
    return cover && !cover.complete ? new Promise(function (ok) { cover.onload = cover.onerror = ok; setTimeout(ok, 1500); }) : null;
  }).then(function () {
    layout();
    var again = $("gr-again");
    if (again) again.addEventListener("click", function () { go(0, { step: 2, immerse: false }); });
    var saved = null;
    try { saved = JSON.parse(store("grey-reader:" + book.id) || "null"); } catch (e) {}
    page = 0;
    if (saved && saved.a > 0) {
      page = pageOfBlock(saved.a);
      if (page > 0) toast("Picking up where you left off.", "Start over", function () { go(0, { step: 2, immerse: false }); });
    }
    place(false);
    paint();
    textReady = true;
    if (introReady) {
      if (!reduce && !introDone) { intro.classList.add("gr-intro-3"); setTimeout(finishIntro, 450); }
      else finishIntro();
    }
  }).catch(function () { missing(); });
})();
