/* ==========================================================
   GREY — service ticket page (invoice.html)
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, T = G.ticket, money = G.money;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  var t = T.read(location.hash);
  if (!t || !t.items || !t.items.length) {
    $("#gt-missing").hidden = false;
    return;
  }
  $("#gt-ticket").hidden = false;
  $("#gt-actions").hidden = false;
  document.title = t.n + " | Grey service ticket";

  var total = T.total(t.items);
  var hasEst = t.items.some(function (i) { return i.est; });
  var hasInvest = t.items.some(function (i) { return i.k === "invest"; });
  var hasBook = t.items.some(function (i) { return i.k === "book"; });
  var expired = t.valid < T.isoDate(new Date());

  $("#gt-number").textContent = t.n;
  $("#gt-stub-number").textContent = t.n;
  $("#gt-issued").textContent = T.niceDate(t.d);
  $("#gt-valid").textContent = T.niceDate(t.valid);
  $("#gt-name").textContent = t.c.name || "—";
  $("#gt-contact").textContent = [t.c.phone, t.c.email].filter(Boolean).join(" · ") || "—";
  if (t.c.note) { $("#gt-note").hidden = false; $("#gt-note-text").textContent = t.c.note; }
  $("#gt-total").textContent = money(total);
  $("#gt-due").textContent = money(total);
  $("#gt-stamp").hidden = !hasEst;
  $("#gt-edited").hidden = !t.edited;
  $("#gt-expired").hidden = !expired;

  $("#gt-lines").innerHTML = t.items.map(function (i) {
    var extra = i.k === "invest" && i.mat
      ? '<span class="gt-mature">Matures ' + esc(T.niceDate(i.mat)) + " · payout " + esc(money(i.pay)) + "</span>"
      : "";
    return "<tr><td><strong>" + esc(i.t) + "</strong><small>" + esc(i.s) + "</small>" + extra + "</td>" +
      '<td class="gt-num">' + i.q + '</td><td class="gt-num">' + money(i.p) + '</td><td class="gt-num">' + money(i.q * i.p) + "</td></tr>";
  }).join("");

  var notes = [];
  if (hasInvest) notes.push("Investments: your capital and profit are paid together in one transfer at maturity. Maturity dates count from the day payment is received.");
  if (hasEst) notes.push("Everyday services are an estimate. Grey confirms the scope and final price with you before any work begins.");
  if (hasBook) notes.push("Books: download links are sent to " + (t.c.email ? esc(t.c.email) : "your email") + " once your payment is confirmed.");
  notes.push("This ticket is valid until " + T.niceDate(t.valid) + ". Use " + esc(t.n) + " as your payment reference.");
  $("#gt-notes").innerHTML = notes.map(function (n) { return "<li>" + n + "</li>"; }).join("");

  // Payment
  var payUrl = G.paystackPayLink + "?" + new URLSearchParams({ reference: t.n, amount: String(Math.round(total * 100)) });
  $("#gt-pay").href = payUrl;
  $("#gt-pay-2").href = payUrl;
  if (G.bank && G.bank.accountNumber) {
    $("#gt-bank").hidden = false;
    $("#gt-bank-name").textContent = G.bank.name;
    $("#gt-bank-acct").textContent = G.bank.accountNumber;
    $("#gt-bank-holder").textContent = G.bank.accountName;
  }

  // QR code of this ticket's link
  try {
    var qr = qrcode(0, "L");
    qr.addData(location.href);
    qr.make();
    $("#gt-qr").innerHTML = qr.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
  } catch (e) { $("#gt-qr").hidden = true; }

  // WhatsApp messages
  var intro = "Hi Grey, ";
  $("#gt-paid").href = G.waLink(intro + "I've paid for service ticket " + t.n + " (" + money(total) + "). Here's my ticket: " + location.href);
  $("#gt-send").href = G.waLink(intro + "here's my service ticket " + t.n + " for " + money(total) + ": " + location.href);

  $("#gt-print").addEventListener("click", function () { window.print(); });
  $("#gt-share").addEventListener("click", function () {
    var btn = this;
    if (navigator.share) {
      navigator.share({ title: "Grey service ticket " + t.n, url: location.href }).catch(function () {});
      return;
    }
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject())
      .then(function () { btn.firstChild.nodeValue = "Link copied "; setTimeout(function () { btn.firstChild.nodeValue = "Share link "; }, 1600); })
      .catch(function () { prompt("Copy this link:", location.href); });
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var text = document.getElementById(b.dataset.copy).textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
      b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1400);
    });
  });

  // Keep the ticket in this device's recent list.
  T.remember(t, location.href);
})();
