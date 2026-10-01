/* ==========================================================
   GREY — service tickets (invoices)
   A ticket travels inside its own link (invoice.html#i=…), so
   there is no server to run. A checksum flags edited links.
   ========================================================== */
(function () {
  "use strict";
  var G = (window.GREY = window.GREY || {});

  function b64encode(str) {
    return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64decode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return decodeURIComponent(escape(atob(str)));
  }
  // FNV-1a: not security, just enough to notice a hand-edited link.
  function checksum(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(36);
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addMonths(iso, months) {
    var d = new Date(iso + "T12:00:00");
    d.setMonth(d.getMonth() + months);
    return isoDate(d);
  }
  function addDays(iso, days) {
    var d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + days);
    return isoDate(d);
  }
  function niceDate(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function newNumber(iso) {
    var rand = "";
    var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    for (var i = 0; i < 4; i++) rand += chars[(Math.random() * chars.length) | 0];
    return "GRY-" + iso.slice(2).replace(/-/g, "") + "-" + rand;
  }

  G.ticket = {
    isoDate: isoDate,
    addMonths: addMonths,
    addDays: addDays,
    niceDate: niceDate,

    // Line items: { k: kind, t: title, s: detail, q: quantity, p: unit price, est: estimate?, mat: maturity date, pay: payout }
    total: function (items) {
      return items.reduce(function (sum, it) { return sum + it.q * it.p; }, 0);
    },

    create: function (customer, items) {
      var today = isoDate(new Date());
      return {
        v: 1,
        n: newNumber(today),
        d: today,
        valid: addDays(today, G.quoteValidDays || 14),
        c: customer,
        items: items,
      };
    },

    link: function (ticket) {
      var json = JSON.stringify(ticket);
      var base = location.href.replace(/[^/]*([?#].*)?$/, "");
      return base + "invoice.html#i=" + b64encode(json) + "." + checksum(json);
    },

    read: function (hash) {
      var m = /[#&]i=([A-Za-z0-9_-]+)\.([a-z0-9]+)/.exec(hash || "");
      if (!m) return null;
      try {
        var json = b64decode(m[1]);
        var t = JSON.parse(json);
        t.edited = checksum(json) !== m[2];
        return t;
      } catch (e) {
        return null;
      }
    },

    // The last few tickets made on this device, so people can find them again.
    remember: function (ticket, link) {
      try {
        var list = JSON.parse(localStorage.getItem("grey-tickets") || "[]");
        list = list.filter(function (x) { return x.n !== ticket.n; });
        list.unshift({ n: ticket.n, d: ticket.d, total: G.ticket.total(ticket.items), link: link });
        localStorage.setItem("grey-tickets", JSON.stringify(list.slice(0, 6)));
      } catch (e) {}
    },
    recent: function () {
      try { return JSON.parse(localStorage.getItem("grey-tickets") || "[]"); } catch (e) { return []; }
    },
  };
})();
