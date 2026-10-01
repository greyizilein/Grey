/* ==========================================================
   GREY — a book's own page (book.html?b=<id>)
   ========================================================== */
(function () {
  "use strict";
  var G = window.GREY, esc = G.esc, money = G.money, ROMAN = G.ROMAN;
  var $ = function (s) { return document.querySelector(s); };
  var books = G.books || [];
  var id = new URLSearchParams(location.search).get("b");
  var b = books.filter(function (x) { return x.id === id; })[0];

  if (!b) {
    $("#gbk-missing").hidden = false;
    return;
  }
  $("#gbk").hidden = false;

  var seriesLabel = b.series ? b.series + " · Book " + ROMAN[b.number] : "A novel";
  document.title = b.title + " | Grey Izilein | Grey";
  var desc = document.querySelector('meta[name="description"]');
  if (!desc) { desc = document.createElement("meta"); desc.name = "description"; document.head.appendChild(desc); }
  desc.content = (b.blurb[0] || "").slice(0, 155);

  // Hero: the cover, also blurred behind the page as its backdrop
  // A full URL: a relative one inside a CSS variable would resolve against the stylesheet's folder.
  if (b.cover) $(".gbk-hero").style.setProperty("--gbk-cover", 'url("' + new URL(b.cover, location.href).href + '")');
  $("#gbk-cover").innerHTML = G.bookCover(b, "gb-book-lg");
  var coverImg = $("#gbk-cover img");
  if (coverImg) coverImg.loading = "eager";
  $("#gbk-series").textContent = seriesLabel;
  $("#gbk-title").textContent = b.title;
  $("#gbk-subtitle").textContent = b.subtitle || "";
  $("#gbk-subtitle").hidden = !b.subtitle;
  $("#gbk-author").textContent = "by " + (b.author || "Grey Izilein") + (b.format ? " · " + b.format : "");
  if (G.bookOnSale(b)) {
    $("#gbk-price").textContent = money(b.price);
    $("#gbk-buy").href = b.buyLink;
    $("#gbk-buy").hidden = false;
    $("#gbk-ticket").href = "quote.html?desk=books&book=" + encodeURIComponent(b.id);
    $("#gbk-ticket").hidden = false;
  } else {
    $("#gbk-price").textContent = "Coming soon";
    $("#gbk-price").classList.add("gbk-soon");
  }
  if (b.note) { $("#gbk-note").hidden = false; $("#gbk-note").textContent = b.note; }

  // Blurb and synopsis
  function paras(list) { return list.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); }
  $("#gbk-blurb").innerHTML = paras(b.blurb);
  if (b.synopsis && b.synopsis.length) {
    $("#gbk-synopsis").hidden = false;
    $("#gbk-synopsis-body").innerHTML = paras(b.synopsis);
  }

  // The rest of the series, with previous / next
  var same = books.filter(function (x) { return b.series ? x.series === b.series : !x.series; });
  if (same.length > 1 || b.series) {
    $("#gbk-series-wrap").hidden = false;
    $("#gbk-series-name").textContent = b.series || "Also by " + (b.author || "Grey Izilein");
    $("#gbk-series-row").innerHTML = (b.series ? same : books.filter(function (x) { return x.id !== b.id; }).slice(0, 4)).map(function (x) {
      var here = x.id === b.id;
      return '<a class="gbk-mini' + (here ? " gbk-here" : "") + '" href="book.html?b=' + encodeURIComponent(x.id) + '"' + (here ? ' aria-current="page"' : "") + ">" +
        G.bookCover(x) + '<span class="gbk-mini-n">' + (x.series ? "Book " + ROMAN[x.number] : "Novel") + "</span>" +
        '<span class="gbk-mini-t">' + esc(x.title) + "</span>" + (here ? '<span class="gbk-mini-here">You are here</span>' : "") + "</a>";
    }).join("");
    var i = same.indexOf(b);
    if (b.series && i > 0) { $("#gbk-prev").hidden = false; $("#gbk-prev").href = "book.html?b=" + same[i - 1].id; $("#gbk-prev-t").textContent = same[i - 1].title; }
    if (b.series && i < same.length - 1) { $("#gbk-next").hidden = false; $("#gbk-next").href = "book.html?b=" + same[i + 1].id; $("#gbk-next-t").textContent = same[i + 1].title; }
  }

  // Author
  if (G.author && G.author.bio) $("#gbk-bio").innerHTML = paras(G.author.bio);
})();
