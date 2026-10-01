/* ==========================================================
   GREY — bookshop shelves (products.html)
   Books come from GREY.books in catalogue.js, grouped by series.
   Every card opens the book's own page (book.html?b=<id>).
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, money = G.money;
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  var ROMAN = (G.ROMAN = ["", "I", "II", "III", "IV", "V", "VI"]);
  G.esc = esc;

  G.bookCover = function (b, cls) {
    var inner = b.cover
      ? '<img src="' + esc(b.cover) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy" decoding="async">'
      : '<span class="gb-drawn" aria-hidden="true"><span class="gb-drawn-mark"></span>' +
        (b.series ? '<span class="gb-drawn-sub">' + esc(b.series) + "</span>" : "") +
        '<span class="gb-drawn-title">' + esc(b.title) + "</span>" +
        '<span class="gb-drawn-author">' + esc(b.author || "Grey Izilein") + "</span></span>";
    return '<div class="gb-book ' + (cls || "") + '"><div class="gb-book-inner">' + inner + '<span class="gb-spine" aria-hidden="true"></span></div></div>';
  };
  G.bookOnSale = function (b) { return !!(b.buyLink && b.price); };

  var shelf = document.getElementById("gb-shelf");
  if (!shelf) return;
  var books = G.books || [];

  if (!books.length) {
    shelf.innerHTML = '<p class="gb-empty">New titles are on their way.</p>';
    return;
  }

  function card(b) {
    var href = "book.html?b=" + encodeURIComponent(b.id);
    var tag = b.series ? "Book " + ROMAN[b.number] : "Novel";
    var price = G.bookOnSale(b) ? '<span class="gb-price">' + money(b.price) + "</span>" : '<span class="gb-soon">Coming soon</span>';
    return '<article class="bk-card gx-card">' +
      '<a class="gb-cover-link" href="' + href + '" aria-label="' + esc(b.title) + '">' + G.bookCover(b) + "</a>" +
      '<div class="gb-info">' +
        '<span class="gb-tag">' + tag + "</span>" +
        '<h3><a href="' + href + '">' + esc(b.title) + "</a></h3>" +
        (b.subtitle ? '<p class="gb-sub">' + esc(b.subtitle) + "</p>" : "") +
        '<p class="gb-blurb">' + esc(b.blurb[0] || "") + "</p>" +
        '<div class="gb-buy">' + price + '<a class="gb-more" href="' + href + '">Read more →</a></div>' +
      "</div></article>";
  }

  // Group in catalogue order: each series once, standalone books last.
  var groups = [], seen = {};
  books.forEach(function (b) {
    var key = b.series || "";
    if (!seen[key]) { seen[key] = { name: key, books: [] }; groups.push(seen[key]); }
    seen[key].books.push(b);
  });
  groups.sort(function (a, b) { return (a.name ? 0 : 1) - (b.name ? 0 : 1); });

  shelf.innerHTML = groups.map(function (g) {
    var title = g.name ? esc(g.name) : "Also by " + esc((G.author || {}).name || "Grey Izilein");
    var kind = g.name ? (g.books.length === 3 ? "The trilogy" : "The series") : "Standalone";
    var desc = g.name && G.series && G.series[g.name] ? '<p>' + esc(G.series[g.name]) + "</p>" : "";
    return '<section class="gb-series">' +
      '<header class="gb-series-head"><span class="gx-flap gb-series-kind">' + kind + "</span><h3>" + title + "</h3>" + desc + "</header>" +
      '<div class="gb-row">' + g.books.map(card).join("") + "</div></section>";
  }).join("");
})();
