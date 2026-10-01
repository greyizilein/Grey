/* ==========================================================
   GREY — bookshop (products.html)
   Books come from GREY.books in config.js. Paystack takes the
   payment and delivers the download.
   Add ?preview to the page address to see sample books before
   the real ones are added.
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, money = G.money;
  var shelf = document.getElementById("gb-shelf");
  if (!shelf) return;
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  var books = G.books || [];
  var preview = !books.length && /[?&]preview\b/.test(location.search);
  if (preview) {
    books = [
      { id: "sample-1", title: "Life as an Experience", subtitle: "Sample title", author: "Asher Izilein", price: 7500, format: "PDF · 140 pages", blurb: "A sample entry so the shop can be previewed. Replace it in config.js with a real book." },
      { id: "sample-2", title: "Build Better", subtitle: "Sample title", author: "Asher Izilein", price: 5000, format: "EPUB + PDF", blurb: "Another sample. Covers you upload replace these drawn ones." },
      { id: "sample-3", title: "Think Deeper", subtitle: "Sample title", author: "Asher Izilein", price: 4000, format: "PDF · 96 pages", blurb: "A third sample, to show how the shelf fills a row." },
    ];
  }

  if (!books.length) {
    shelf.innerHTML = '<p class="gb-empty">New titles are on their way. Meanwhile, the full storefront is on <a href="https://paystack.shop/greysllc" target="_blank" rel="noopener noreferrer">Paystack ↗</a>.</p>';
    return;
  }

  function cover(b) {
    if (b.cover) return '<img src="' + esc(b.cover) + '" alt="Cover of ' + esc(b.title) + '" loading="lazy">';
    // A drawn cover in Grey's style when no image is supplied.
    return '<span class="gb-drawn" aria-hidden="true">' +
      '<span class="gb-drawn-mark"></span>' +
      '<span class="gb-drawn-title">' + esc(b.title) + "</span>" +
      (b.subtitle ? '<span class="gb-drawn-sub">' + esc(b.subtitle) + "</span>" : "") +
      '<span class="gb-drawn-author">' + esc(b.author || "Grey") + "</span></span>";
  }

  shelf.innerHTML = books.map(function (b) {
    var buy = b.buyLink
      ? '<a class="gh-btn gh-btn-solid" href="' + esc(b.buyLink) + '" target="_blank" rel="noopener noreferrer" data-bell>Buy &amp; download ↗</a>'
      : '<span class="gb-soon">Coming soon</span>';
    return '<article class="bk-card gx-card">' +
      '<div class="gb-book"><div class="gb-book-inner">' + cover(b) + '<span class="gb-spine" aria-hidden="true"></span></div></div>' +
      '<div class="gb-info">' +
        (preview ? '<span class="gb-tag">Sample</span>' : "") +
        "<h3>" + esc(b.title) + "</h3>" +
        (b.subtitle && !preview ? '<p class="gb-sub">' + esc(b.subtitle) + "</p>" : "") +
        '<p class="gb-meta">' + esc(b.author || "") + (b.format ? " · " + esc(b.format) : "") + "</p>" +
        '<p class="gb-blurb">' + esc(b.blurb || "") + "</p>" +
        '<div class="gb-buy"><span class="gb-price">' + money(b.price) + "</span>" + buy + "</div>" +
        '<a class="gb-ticket" href="quote.html?desk=books&amp;book=' + encodeURIComponent(b.id) + '">Buying for a group or paying by transfer? Add it to a ticket →</a>' +
      "</div></article>";
  }).join("");
})();
