/* ==========================================================
   GREY — experience layer
   Shared by every page:
   - Sound: a synthesised service bell and clock ticks (off by default)
   - Departure-board text on small labels as they come into view
   - Orange spotlight that follows the pointer across cards
   - Numbers that count up when they appear
   - Arrows that move on hover
   - "Right on time" opening sweep, once per visit
   - Scroll progress line under the header
   Motion is skipped for people who ask their device for less motion.
   ========================================================== */
(function () {
  "use strict";

  var G = (window.GREY = window.GREY || {});
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ── Helpers shared with the quote builder and invoice ── */
  G.money = function (n) {
    return (G.currency || "₦") + Math.round(n).toLocaleString("en-NG");
  };
  G.waLink = function (text) {
    return "https://wa.me/" + (G.whatsapp || "") + "?text=" + encodeURIComponent(text);
  };

  /* ── Sound ─────────────────────────────────────────────── */
  var Sound = (function () {
    var ctx = null;
    var on = store("grey-sound") === "on";

    function ac() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function partial(c, freq, start, dur, gain, type) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(gain, start + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g).connect(c.destination);
      o.start(start);
      o.stop(start + dur + 0.02);
    }
    var voices = {
      // A clock tick: a very short, filtered click.
      tick: function (c, t) {
        var len = Math.floor(c.sampleRate * 0.012);
        var buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
        var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
        f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 6;
        g.gain.value = 0.35;
        s.buffer = buf; s.connect(f).connect(g).connect(c.destination); s.start(t);
      },
      // A front-desk service bell: a bright strike with inharmonic overtones and a long ring.
      bell: function (c, t) {
        var base = 1318;
        partial(c, base, t, 1.6, 0.16);
        partial(c, base * 2.76, t, 0.9, 0.06);
        partial(c, base * 5.4, t, 0.35, 0.03);
        partial(c, base * 0.5, t, 0.5, 0.03, "triangle");
      },
      // Day/night: a short rising (sunrise) or falling (sunset) phrase.
      sunrise: function (c, t) { [523, 659, 784].forEach(function (f, i) { partial(c, f, t + i * 0.07, 0.5, 0.07); }); },
      sunset:  function (c, t) { [784, 659, 523].forEach(function (f, i) { partial(c, f, t + i * 0.07, 0.5, 0.06); }); },
      // Menus opening and closing.
      open:  function (c, t) { partial(c, 880, t, 0.12, 0.05, "triangle"); partial(c, 1320, t + 0.04, 0.14, 0.04, "triangle"); },
      close: function (c, t) { partial(c, 1320, t, 0.1, 0.04, "triangle"); partial(c, 880, t + 0.04, 0.12, 0.04, "triangle"); },
      // A page turning: a soft breath of paper, brightening as the leaf lifts and falls.
      page: function (c, t) {
        var dur = 0.32, len = Math.floor(c.sampleRate * dur);
        var buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) { var x = i / len; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * Math.pow(x, 0.6)) * (1 - x); }
        var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
        f.type = "bandpass"; f.Q.value = 0.9;
        f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3800, t + dur * 0.45); f.frequency.exponentialRampToValueAtTime(1400, t + dur);
        g.gain.value = 0.22;
        s.buffer = buf; s.connect(f).connect(g).connect(c.destination); s.start(t);
      },
    };
    function play(name) {
      if (!on || !voices[name]) return;
      var c = ac();
      if (c) voices[name](c, c.currentTime + 0.005);
    }
    function set(next) {
      on = next;
      store("grey-sound", on ? "on" : "off");
      document.documentElement.classList.toggle("gx-sound-on", on);
      document.querySelectorAll(".gx-sound").forEach(function (b) {
        b.setAttribute("aria-pressed", String(on));
        b.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      });
      if (on) play("bell");
    }
    return { play: play, set: set, isOn: function () { return on; } };
  })();
  G.sound = Sound;

  function wireSound() {
    document.documentElement.classList.toggle("gx-sound-on", Sound.isOn());
    document.querySelectorAll(".gx-sound").forEach(function (b) {
      b.setAttribute("aria-pressed", String(Sound.isOn()));
      b.setAttribute("aria-label", Sound.isOn() ? "Turn sound off" : "Turn sound on");
      b.addEventListener("click", function (e) { e.stopPropagation(); Sound.set(!Sound.isOn()); });
    });
    // One listener for the whole page: what was pressed decides the sound. It listens early
    // (menus stop clicks from bubbling) and waits a tick so the theme or menu has already changed.
    document.addEventListener("click", function (e) {
      var el = e.target.closest("a, button");
      if (!el || !Sound.isOn() || el.classList.contains("gx-sound")) return;
      setTimeout(function () {
        if (el.id === "themeToggle") {
          Sound.play(document.documentElement.getAttribute("data-theme") === "light" ? "sunrise" : "sunset");
        } else if (el.matches(".gh-has-menu > .gh-link, #navDots")) {
          Sound.play(el.getAttribute("aria-expanded") === "true" ? "open" : "close");
        } else if (el.matches("[data-bell], .btn-primary, .gh-btn-solid, .drop-cta, .calc-cta-btn, .p-cta, [href*='wa.me'], [href*='paystack']")) {
          Sound.play("bell");
        } else {
          Sound.play("tick");
        }
      }, 0);
    }, true);
  }

  /* ── Departure-board labels ───────────────────────────── */
  var FLAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function flap(el) {
    if (el.dataset.gxFlapped) return;
    el.dataset.gxFlapped = "1";
    // Only plain-text labels: leave anything with child elements alone.
    if (el.children.length) return;
    var target = el.textContent;
    if (!target.trim() || target.length > 60) return;
    el.style.minWidth = el.offsetWidth + "px";
    var frame = 0, settle = 2;
    function step() {
      frame++;
      var out = "";
      for (var i = 0; i < target.length; i++) {
        var ch = target[i];
        if (ch === " " || i < frame / settle) out += ch;
        else out += FLAP[(Math.random() * FLAP.length) | 0];
      }
      el.textContent = out;
      if (frame / settle < target.length) requestAnimationFrame(step);
      else { el.textContent = target; el.style.minWidth = ""; }
    }
    requestAnimationFrame(step);
  }

  /* ── Counting numbers ─────────────────────────────────── */
  function countUp(el) {
    if (el.dataset.gxCounted || el.children.length) return;
    el.dataset.gxCounted = "1";
    var text = el.textContent.trim();
    var m = text.match(/^([^0-9]*)([0-9][0-9,]*)(.*)$/);
    if (!m) return;
    var pre = m[1], num = parseInt(m[2].replace(/,/g, ""), 10), post = m[3], comma = m[2].indexOf(",") > -1;
    if (!isFinite(num) || num === 0) return;
    var start = null, dur = Math.min(1400, 500 + num.toString().length * 150);
    function fmt(n) { return comma ? n.toLocaleString("en-NG") : String(n); }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(num * eased)) + post;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = text;
    }
    requestAnimationFrame(step);
  }

  /* ── Arrows that move ─────────────────────────────────── */
  function wrapArrows() {
    var arrows = /([→↗])\s*$/;
    document.querySelectorAll("a, button").forEach(function (el) {
      if (el.querySelector(".gx-arrow, svg")) return;
      var last = el.lastChild;
      if (!last || last.nodeType !== 3 || !arrows.test(last.nodeValue)) return;
      var m = last.nodeValue.match(arrows);
      last.nodeValue = last.nodeValue.replace(arrows, "");
      var s = document.createElement("span");
      s.className = "gx-arrow" + (m[1] === "↗" ? " gx-arrow-ne" : "");
      s.setAttribute("aria-hidden", "true");
      s.textContent = m[1];
      el.appendChild(s);
    });
  }

  /* ── Spotlight on cards ───────────────────────────────── */
  var SPOT = [".service-card", ".t-card", ".plan", ".pricing-card", ".p-card", ".method-card", ".area", ".comm", ".dur",
    ".feat-item", ".step", ".hstat", ".product-card", ".team-card", ".gx-card", ".bk-card"].join(",");
  function spotlight() {
    if (!finePointer) return;
    document.querySelectorAll(SPOT).forEach(function (el) { el.classList.add("gx-spot"); });
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".gx-spot");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--gx-x", (e.clientX - r.left) + "px");
      el.style.setProperty("--gx-y", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ── "Right on time": a clock-hand sweep the first time Grey opens in a visit ── */
  function opening() {
    if (document.documentElement.hasAttribute("data-gx-quiet")) return;
    var seen = false;
    try { seen = sessionStorage.getItem("grey-opened") === "1"; sessionStorage.setItem("grey-opened", "1"); } catch (e) { seen = true; }
    if (seen || reduceMotion) return;
    var t = new Date();
    var lagos = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(t);
    var o = document.createElement("div");
    o.className = "gx-open";
    o.setAttribute("aria-hidden", "true");
    o.innerHTML =
      '<div class="gx-open-dial">' +
        '<svg viewBox="0 0 120 120"><circle class="gx-open-track" cx="60" cy="60" r="54"/><circle class="gx-open-sweep" cx="60" cy="60" r="54"/></svg>' +
        '<span class="gx-open-hand"></span>' +
        '<span class="gx-open-mark"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="white" stroke-width="1.5"/></svg></span>' +
      "</div>" +
      '<div class="gx-open-time">' + lagos + ' <span>LAGOS</span></div>' +
      '<div class="gx-open-line">Right on time.</div>';
    document.body.appendChild(o);
    setTimeout(function () { o.classList.add("gx-open-out"); }, 1050);
    setTimeout(function () { o.remove(); }, 1700);
  }

  /* ── Scroll progress line ─────────────────────────────── */
  function progress() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var bar = document.createElement("span");
    bar.className = "gx-progress";
    bar.setAttribute("aria-hidden", "true");
    nav.appendChild(bar);
    var ticking = false;
    function update() {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
    }
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ── Watch things come into view ──────────────────────── */
  function reveal() {
    var labels = document.querySelectorAll(".hero-eyebrow, .section-label, .eyebrow, .hero-tag, .row-lbl, .plans-lbl, .gx-flap");
    var numbers = document.querySelectorAll(".stat-num, .hstat-n, .cstat-n, .gx-count");
    if (!("IntersectionObserver" in window) || reduceMotion) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.dataset.gxKind === "num") countUp(en.target); else flap(en.target);
      });
    }, { threshold: 0.6 });
    labels.forEach(function (el) { io.observe(el); });
    numbers.forEach(function (el) { el.dataset.gxKind = "num"; io.observe(el); });
  }

  function init() {
    wireSound();
    wrapArrows();
    progress();
    if (!reduceMotion) {
      opening();
      spotlight();
      reveal();
    }
  }
  // Deferred scripts run before DOMContentLoaded; waiting for it lets page scripts
  // (bookshop, quote builder) draw their buttons and cards first.
  if (document.readyState === "complete") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
