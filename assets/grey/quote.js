/* ==========================================================
   GREY — quote builder (quote.html)
   Four desks (investments, consultation, everyday services,
   books) add lines to one ticket, which becomes an invoice.
   Links can open a desk pre-filled:
     quote.html?desk=invest&crop=rice&units=2&months=6
     quote.html?desk=consult&plan=standard
     quote.html?desk=services&service=cleaning
     quote.html?desk=books&book=<id>
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, T = G.ticket, money = G.money;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);
  var lines = [];
  try { lines = JSON.parse(sessionStorage.getItem("grey-quote-lines") || "[]"); } catch (e) {}

  function saveLines() {
    try { sessionStorage.setItem("grey-quote-lines", JSON.stringify(lines)); } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function pills(container, options, value, onPick) {
    container.innerHTML = options.map(function (o) {
      return '<button type="button" class="gq-pill" data-v="' + esc(o.v) + '" aria-pressed="' + (String(o.v) === String(value)) + '">' + o.html + "</button>";
    }).join("");
    container.addEventListener("click", function (e) {
      var b = e.target.closest(".gq-pill");
      if (!b) return;
      $$(".gq-pill", container).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      onPick(b.dataset.v);
    });
  }
  function stepper(root, min, max, value, onChange) {
    var out = $("output", root);
    function set(v) {
      value = Math.max(min, Math.min(max, v));
      out.textContent = value;
      onChange(value);
    }
    $(".gq-minus", root).addEventListener("click", function () { set(value - 1); });
    $(".gq-plus", root).addEventListener("click", function () { set(value + 1); });
    set(value);
    return function () { return value; };
  }
  function added(btn) {
    btn.classList.add("gq-added");
    var label = btn.dataset.label || btn.textContent;
    btn.dataset.label = label;
    btn.firstChild.nodeValue = "Added to your ticket ";
    setTimeout(function () { btn.classList.remove("gq-added"); btn.firstChild.nodeValue = label.replace(/\s*$/, " "); }, 1400);
  }

  /* ── Desks ── */
  function switchDesk(id) {
    $$(".gq-tab").forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.desk === id)); });
    $$(".gq-desk").forEach(function (d) { d.hidden = d.id !== "desk-" + id; });
  }
  $$(".gq-tab").forEach(function (t) { t.addEventListener("click", function () { switchDesk(t.dataset.desk); }); });

  // Investments
  (function () {
    var C = G.investments.commodities, D = G.investments.durations;
    var crop = C[params.get("crop")] ? params.get("crop") : "maize";
    var months = +params.get("months") || 12;
    if (!D.some(function (d) { return d.months === months; })) months = 12;
    var units = 1;
    function roi() { return D.filter(function (d) { return d.months === months; })[0].roi; }
    function draw() {
      var capital = C[crop].unitPrice * units, profit = capital * roi() / 100;
      $("#inv-capital").textContent = money(capital);
      $("#inv-profit").textContent = money(profit) + " (" + roi() + "%)";
      $("#inv-payout").textContent = money(capital + profit);
      $("#inv-maturity").textContent = T.niceDate(T.addMonths(T.isoDate(new Date()), months));
    }
    pills($("#inv-crops"), Object.keys(C).map(function (k) {
      return { v: k, html: esc(C[k].label) + "<small>" + money(C[k].unitPrice) + "/unit</small>" };
    }), crop, function (v) { crop = v; draw(); });
    pills($("#inv-months"), D.map(function (d) {
      return { v: d.months, html: d.months + " months<small>" + d.roi + "% return</small>" };
    }), months, function (v) { months = +v; draw(); });
    stepper($("#inv-units"), 1, 200, Math.max(1, +params.get("units") || 1), function (v) { units = v; draw(); });
    $("#inv-add").addEventListener("click", function () {
      var capital = C[crop].unitPrice * units;
      var start = T.isoDate(new Date());
      lines.push({
        k: "invest",
        t: C[crop].label + " investment",
        s: units + " unit" + (units > 1 ? "s" : "") + " · " + months + " months · " + roi() + "% return",
        q: units,
        p: C[crop].unitPrice,
        mat: T.addMonths(start, months),
        pay: Math.round(capital * (1 + roi() / 100)),
      });
      saveLines(); renderTicket(); added(this);
    });
  })();

  // Consultation
  (function () {
    var plans = G.consultation;
    var pick = plans.some(function (p) { return p.id === params.get("plan"); }) ? params.get("plan") : plans[1].id;
    $("#con-plans").innerHTML = plans.map(function (p) {
      return '<label class="gq-plan gx-card"><input type="radio" name="con-plan" value="' + p.id + '"' + (p.id === pick ? " checked" : "") + ">" +
        '<span class="gq-plan-name">' + esc(p.label) + "</span>" +
        '<span class="gq-plan-price">' + money(p.price) + (p.fee ? "<small>+ " + money(p.fee) + " consultation fee</small>" : "") + "</span>" +
        '<span class="gq-plan-note">' + esc(p.note) + "</span></label>";
    }).join("");
    $("#con-add").addEventListener("click", function () {
      var id = ($("input[name=con-plan]:checked") || {}).value;
      var p = plans.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      lines.push({ k: "consult", t: "Business consultation — " + p.label, s: p.note, q: 1, p: p.price });
      if (p.fee) lines.push({ k: "consult", t: "Consultation fee", s: p.label, q: 1, p: p.fee });
      saveLines(); renderTicket(); added(this);
    });
  })();

  // Everyday services
  (function () {
    var S = G.services, disc = G.subscriptionDiscount || 0;
    var pick = S.some(function (s) { return s.id === params.get("service"); }) ? params.get("service") : S[0].id;
    var plan = "once", qty = 1;
    function svc() { return S.filter(function (s) { return s.id === pick; })[0]; }
    function unitPrice() { return plan === "monthly" ? svc().price * (1 - disc / 100) : svc().price; }
    function draw() {
      $("#svc-unit").textContent = money(svc().price) + " " + svc().unit;
      $("#svc-total").textContent = money(unitPrice() * qty) + (plan === "monthly" ? " / month" : "");
      $("#svc-disc").hidden = plan !== "monthly" || !disc;
    }
    pills($("#svc-list"), S.map(function (s) { return { v: s.id, html: esc(s.label) + "<small>from " + money(s.price) + "</small>" }; }), pick,
      function (v) { pick = v; draw(); });
    pills($("#svc-plan"), [
      { v: "once", html: "One-off<small>book once</small>" },
      { v: "monthly", html: "Monthly<small>" + (disc ? disc + "% off, recurring" : "recurring") + "</small>" },
    ], plan, function (v) { plan = v; draw(); });
    $("#svc-disc").textContent = "Subscription saving: " + disc + "% off every visit.";
    stepper($("#svc-qty"), 1, 60, 1, function (v) { qty = v; draw(); });
    $("#svc-add").addEventListener("click", function () {
      var s = svc();
      lines.push({
        k: "service",
        t: s.label + (plan === "monthly" ? " — monthly" : ""),
        s: qty + " × " + s.unit.replace(/^per /, "") + (plan === "monthly" ? " per month · " + disc + "% subscription saving" : ""),
        q: qty,
        p: Math.round(unitPrice()),
        est: true,
      });
      saveLines(); renderTicket(); added(this);
    });
  })();

  // Books
  (function () {
    var B = G.books || [];
    var box = $("#book-list");
    if (!B.length) {
      box.innerHTML = '<p class="gq-empty">New titles are on their way. In the meantime, browse the <a href="products.html">bookshop</a>.</p>';
      $("#book-add-note").hidden = true;
      return;
    }
    var wanted = params.get("book");
    box.innerHTML = B.map(function (b) {
      return '<div class="gq-book gx-card" data-id="' + esc(b.id) + '">' +
        '<span class="gq-book-name">' + esc(b.title) + "<small>" + esc(b.format || "") + "</small></span>" +
        '<span class="gq-book-price">' + money(b.price) + "</span>" +
        '<span class="gq-stepper" data-book="' + esc(b.id) + '"><button type="button" class="gq-minus" aria-label="One fewer">−</button><output>0</output><button type="button" class="gq-plus" aria-label="One more">+</button></span>' +
        '<button type="button" class="gq-mini" data-add="' + esc(b.id) + '">Add</button></div>';
    }).join("");
    var qty = {};
    $$(".gq-stepper", box).forEach(function (st) {
      var id = st.dataset.book;
      stepper(st, 0, 500, id === wanted ? 1 : 0, function (v) { qty[id] = v; });
    });
    box.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add]");
      if (!btn) return;
      var b = B.filter(function (x) { return x.id === btn.dataset.add; })[0];
      var q = qty[b.id] || 1;
      lines.push({ k: "book", t: b.title, s: (b.format || "Digital edition") + " · download sent to your email after payment", q: q, p: b.price });
      saveLines(); renderTicket();
      btn.textContent = "Added";
      setTimeout(function () { btn.textContent = "Add"; }, 1200);
    });
  })();

  /* ── The ticket on the right ── */
  function renderTicket() {
    var list = $("#gq-lines"), total = T.total(lines);
    list.innerHTML = lines.length ? lines.map(function (l, i) {
      return '<li><span class="gq-line-t">' + esc(l.t) + "<small>" + esc(l.s || "") + "</small></span>" +
        '<span class="gq-line-a">' + money(l.q * l.p) + "</span>" +
        '<button type="button" class="gq-x" data-i="' + i + '" aria-label="Remove ' + esc(l.t) + '">×</button></li>';
    }).join("") : '<li class="gq-none">Nothing on your ticket yet. Add something from a desk.</li>';
    $("#gq-total").textContent = money(total);
    $("#gq-count").textContent = lines.length;
    var hasEst = lines.some(function (l) { return l.est; });
    var hasBook = lines.some(function (l) { return l.k === "book"; });
    $("#gq-est-row").hidden = !hasEst;
    $("#gq-est").required = hasEst;
    $("#gq-email").required = hasBook;
    $("#gq-email-hint").hidden = !hasBook;
    $("#gq-issue").disabled = !lines.length;
  }
  $("#gq-lines").addEventListener("click", function (e) {
    var x = e.target.closest(".gq-x");
    if (!x) return;
    lines.splice(+x.dataset.i, 1);
    saveLines(); renderTicket();
  });

  $("#gq-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!lines.length) return;
    var f = e.target;
    var t = T.create({
      name: f.name.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      note: f.note.value.trim(),
    }, lines);
    var link = T.link(t);
    T.remember(t, link);
    lines = []; saveLines();
    location.href = link;
  });

  function renderRecent() {
    var r = T.recent(), box = $("#gq-recent");
    if (!r.length) { box.hidden = true; return; }
    box.hidden = false;
    $("ul", box).innerHTML = r.map(function (x) {
      return '<li><a href="' + esc(x.link) + '">' + esc(x.n) + "</a><span>" + T.niceDate(x.d) + " · " + money(x.total) + "</span></li>";
    }).join("");
  }

  var desk = params.get("desk");
  switchDesk(["invest", "consult", "services", "books"].indexOf(desk) > -1 ? desk : "invest");
  renderTicket();
  renderRecent();
})();
