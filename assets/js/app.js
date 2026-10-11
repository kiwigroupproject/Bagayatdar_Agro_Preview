/* Bagayatdar Agro Foods — shared site script (no dependencies) */
(function () {
  const S = window.SITE, P = window.PRODUCTS, C = window.CATEGORIES;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const inr = n => "₹" + n.toLocaleString("en-IN");
  const catName = id => (C.find(c => c.id === id) || {}).name || id;
  const fname = id => /^[0-9]+$/.test(String(id)) ? "p" + id : String(id);
  const portrait = id => !["2699", "2704", "2708", "2709"].includes(String(id));

  /* ---------- helpers ---------- */
  function img(id, alt, sizes, cls = "", eager = false) {
    const [a, b] = portrait(id) ? [560, 1100] : [800, 1600];
    return `<img class="${cls}" src="assets/img/${fname(id)}-${a}.webp" srcset="assets/img/${fname(id)}-${a}.webp ${a}w, assets/img/${fname(id)}-${b}.webp ${b}w" sizes="${sizes}" alt="${alt}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;
  }
  // Builds the wa.me order link — this is the "order request" message
  function waLink(p, variant, qty = 1) {
    const total = variant.price * qty;
    const msg = `Hello ${S.name}, I would like to order:\n\n• ${p.name} — ${variant.label} × ${qty}\n  Price: ${inr(variant.price)} each (Total ${inr(total)})\n\nName:\nDelivery address & pincode:\n\nPlease confirm availability and delivery details. Thank you!`;
    return `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
  const waGeneral = (t = `Hello ${S.name}, I have an enquiry.`) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(t)}`;
  const WA_ICON = '<svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9c1.8 1 3.8 1.500 5.800 1.500 7 0 12.600-5.600 12.600-12.500S23 3 16 3zm0 22.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.100 1.200-4.300-.3-.4a10.400 10.400 0 1 1 9.200 5.300zm5.700-7.800c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.500 8.500 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.200c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100 2.100 3.300 5.200 4.600c1.900.8 2.700.9 3.600.7.600-.1 1.800-.7 2.100-1.500s.3-1.300.2-1.400-.3-.2-.6-.4z"/></svg>';

  /* ---------- header / announcement / footer ---------- */
  const page = (location.pathname.split("/").pop() || "index.html");
  const nav = [["index.html", "Home"], ["shop.html", "Shop"], ["about.html", "About"], ["contact.html", "Contact"]];

  function buildChrome() {
    const h = $("#site-header");
    if (h) h.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <header class="hdr"><div class="wrap hdr-in">
        <a class="logo" href="index.html" aria-label="${S.name} — home"><img src="assets/img/logo.webp" alt="${S.name} logo" width="184" height="74"></a>
        <nav class="nav" id="nav" aria-label="Main">${nav.map(([u, t]) => `<a href="${u}"${u === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
        <form class="search" role="search" action="shop.html"><label class="sr" for="q">Search products</label><input id="q" name="q" type="search" placeholder="Search cashew, ghee…" autocomplete="off"><button aria-label="Search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.500-3.500"/></svg></button></form>
        <a class="btn btn-sm hdr-cta" href="${waGeneral()}" target="_blank" rel="noopener">${WA_ICON}<span>Order</span></a>
        <button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
      </div></header>`;
    const f = $("#site-footer");
    if (f) f.innerHTML = `
      <footer class="ftr"><div class="wrap ftr-grid">
        <div><img class="ftr-logo" src="assets/img/logo.webp" alt="${S.name}" width="170" height="72" loading="lazy">
          <p>${S.tagline}. Trusted second-generation agro-food business — PAN India delivery.</p>
          <p class="soc"><a href="${S.social.instagram}" aria-label="Instagram">Instagram</a> · <a href="${S.social.facebook}" aria-label="Facebook">Facebook</a> · <a href="${S.social.google}" aria-label="Google">Google</a></p></div>
        <div><h4>Quick links</h4><ul><li><a href="shop.html">Shop all</a></li><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li><li><a href="faq.html">FAQ</a></li></ul></div>
        <div><h4>Categories</h4><ul>${C.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("")}</ul></div>
        <div><h4>Contact</h4><ul class="ct"><li>${S.address}<br><a href="${S.maps}" target="_blank" rel="noopener">View on Google Maps ↗</a></li><li><a href="tel:+${S.whatsapp}">${S.phoneDisplay.join(" / ")}</a></li><li><a href="mailto:${S.email}">${S.email}</a></li></ul>
          <h4 class="mt">Policies</h4><ul><li><a href="shipping.html">Shipping & Returns</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms</a></li></ul></div>
      </div>
      <div class="wrap ftr-bot"><p>© ${new Date().getFullYear()} ${S.legalName}. All rights reserved. · LLPIN ${S.llpin} · GST ${S.gst} · FSSAI ${S.fssai}</p></div></footer>
      <a class="wa-float" href="${waGeneral()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_ICON}</a>`;
    const b = $(".burger");
    if (b) b.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); b.setAttribute("aria-expanded", o); });
  }

  /* ---------- product card ---------- */
  function card(p) {
    const v0 = p.variants[0];
    return `<article class="pcard reveal" data-id="${p.id}">
      <a class="pimg" href="product.html?id=${p.id}" aria-label="${p.name}">${img(p.images[0], `${p.name} — Bagayatdar pack`, "(min-width:900px) 24vw, (min-width:600px) 45vw, 90vw")}${p.best ? '<span class="badge">Bestseller</span>' : ""}</a>
      <div class="pbody"><p class="pcat">${catName(p.cat)}</p>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="psub">${p.sub}</p>
        <div class="prow"><label class="sr" for="v-${p.id}">Pack size</label>
          <select id="v-${p.id}" class="vsel">${p.variants.map((v, i) => `<option value="${i}">${v.label} — ${inr(v.price)}</option>`).join("")}</select></div>
        <p class="price"><span class="pv">${inr(v0.price)}</span> <small>per ${v0.label}</small></p>
        ${p.inStock === false ? '<span class="btn btn-wa disabled">Out of stock</span>' :
          `<a class="btn btn-wa" href="${waLink(p, v0)}" target="_blank" rel="noopener">${WA_ICON} Order on WhatsApp</a>`}
      </div></article>`;
  }
  function wireCards(root) {
    $$(".pcard", root).forEach(el => {
      const p = P.find(x => x.id === el.dataset.id), sel = $(".vsel", el);
      if (!sel) return;
      sel.addEventListener("change", () => {
        const v = p.variants[+sel.value];
        $(".pv", el).textContent = inr(v.price); $("small", el).textContent = "per " + v.label;
        const a = $(".btn-wa", el); if (a.href) a.href = waLink(p, v);
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  function reveal() {
    const els = $$(".reveal:not(.in), .reveal-l:not(.in)");
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }
  function parallax() {
    const h = $(".hero-bg"); if (!h || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    addEventListener("scroll", () => { h.style.transform = `translateY(${Math.min(scrollY, 600) * .12}px)`; }, { passive: true });
  }

  /* ---------- page: home ---------- */
  function home() {
    const cats = $("#cats"); if (cats) { cats.innerHTML = C.map(c => `<a class="ccard reveal" href="shop.html?cat=${c.id}">${img(c.img, c.name, "(min-width:900px) 20vw, 45vw")}<div><h3>${c.name}</h3><p>${c.blurb}</p></div></a>`).join(""); }
    const best = $("#best-track"); if (best) { best.innerHTML = P.filter(p => p.best).map(card).join(""); wireCards(best);
      $$("[data-slide]").forEach(b => b.addEventListener("click", () => best.scrollBy({ left: +b.dataset.slide * (best.clientWidth * .8), behavior: "smooth" }))); }
  }

  /* latest blog posts (data from posts-latest.js, written by the admin panel) */
  function latestPosts() {
    const box = $("#blog-grid"), L = window.LATEST_POSTS || [];
    if (!box) return; if (!L.length) { const s = box.closest("section"); if (s) s.hidden = true; return; }
    const fmt = d => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    box.innerHTML = L.map(p => `<a class="bcard reveal" href="blog/${p.slug}">${p.cover ? `<img src="assets/img/blog/${p.cover}-600.webp" alt="" loading="lazy">` : "<div class=bph></div>"}<div><time>${fmt(p.date)}</time><h3>${p.title.replace(/</g,"&lt;")}</h3><p>${p.excerpt.replace(/</g,"&lt;")}</p><span class="more">Read more →</span></div></a>`).join("");
  }

  /* ---------- page: shop ---------- */
  function shop() {
    const grid = $("#grid"); if (!grid) return;
    const qs = new URLSearchParams(location.search);
    const state = { cat: qs.get("cat") || "all", sort: "featured", pack: "all", max: 0, q: (qs.get("q") || "").toLowerCase() };
    $("#f-cat").innerHTML = `<option value="all">All products</option>` + C.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    $("#f-cat").value = state.cat; if (state.q) $("#f-q").value = qs.get("q");
    const packs = [...new Set(P.flatMap(p => p.variants.map(v => v.label)))];
    $("#f-pack").innerHTML = `<option value="all">Any pack size</option>` + packs.map(x => `<option>${x}</option>`).join("");
    const prices = P.map(p => p.variants[0].price), top = Math.max(...prices);
    $("#f-price").max = top; $("#f-price").value = top; state.max = top;
    function draw() {
      let list = P.filter(p => (state.cat === "all" || p.cat === state.cat) &&
        (state.pack === "all" || p.variants.some(v => v.label === state.pack)) &&
        p.variants[0].price <= state.max &&
        (!state.q || (p.name + " " + p.sub + " " + catName(p.cat)).toLowerCase().includes(state.q)));
      if (state.sort === "low") list.sort((a, b) => a.variants[0].price - b.variants[0].price);
      if (state.sort === "high") list.sort((a, b) => b.variants[0].price - a.variants[0].price);
      if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      grid.innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No products match these filters. <a href="shop.html">Clear filters</a></p>`;
      $("#count").textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
      $("#pmax").textContent = inr(state.max); wireCards(grid); reveal();
    }
    $("#f-cat").onchange = e => { state.cat = e.target.value; draw(); };
    $("#f-sort").onchange = e => { state.sort = e.target.value; draw(); };
    $("#f-pack").onchange = e => { state.pack = e.target.value; draw(); };
    $("#f-price").oninput = e => { state.max = +e.target.value; draw(); };
    $("#f-q").oninput = e => { state.q = e.target.value.toLowerCase(); draw(); };
    draw();
  }

  /* ---------- page: product detail ---------- */
  function product() {
    const root = $("#pdp"); if (!root) return;
    const p = P.find(x => x.id === new URLSearchParams(location.search).get("id")) || P[0];
    document.title = `${p.name} | ${S.name}`;
    const md = $('meta[name="description"]'); if (md) md.content = `${p.name} — ${p.desc}`;
    let vi = 0, qty = 1;
    const nut = p.nutrition ? `<h3>Nutrition</h3><table class="nut"><tbody>${p.nutrition.map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table><p class="note">${p.nutNote || ""}</p>` : "";
    root.innerHTML = `
      <div class="gallery"><div class="gmain" id="gmain">${img(p.images[0], p.name, "(min-width:900px) 45vw, 95vw", "", true)}<span class="zoomhint">Hover to zoom</span></div>
        <div class="thumbs">${p.images.map((id, i) => `<button class="th${i ? "" : " on"}" data-id="${id}" aria-label="View photo ${i + 1}"><img src="assets/img/${fname(id)}-560.webp" alt="${p.name} photo ${i + 1}" loading="lazy" width="80" height="80"></button>`).join("")}</div></div>
      <div class="pinfo"><p class="pcat">${catName(p.cat)}</p><h1>${p.name}</h1><p class="psub">${p.sub}</p>
        <p class="price big"><span id="pp"></span> <small id="pl"></small></p>
        <fieldset class="pack"><legend>Pack size</legend>${p.variants.map((v, i) => `<label><input type="radio" name="pack" value="${i}"${i ? "" : " checked"}><span>${v.label}<b>${inr(v.price)}</b></span></label>`).join("")}</fieldset>
        <div class="qtyrow"><span>Quantity</span><div class="qty"><button type="button" id="qm" aria-label="Decrease">−</button><output id="qv">1</output><button type="button" id="qp" aria-label="Increase">+</button></div></div>
        <a class="btn btn-wa btn-lg" id="wa" target="_blank" rel="noopener">${WA_ICON} Order on WhatsApp</a>
        <p class="note">Tap to open WhatsApp with your order request pre-filled. We'll confirm availability, delivery and payment with you there.</p>
        <p class="desc">${p.desc}</p>
        <div class="facts"><div><h3>Origin</h3><p>${p.origin}</p></div><div><h3>Storage</h3><p>${p.storage}</p></div></div>${nut}</div>`;
    let upd = function () { const v = p.variants[vi]; $("#pp").textContent = inr(v.price * qty); $("#pl").textContent = qty > 1 ? `${qty} × ${v.label}` : `per ${v.label}`; $("#qv").textContent = qty; $("#wa").href = waLink(p, v, qty); };
    $$('input[name=pack]').forEach(r => r.onchange = () => { vi = +r.value; upd(); });
    $("#qm").onclick = () => { qty = Math.max(1, qty - 1); upd(); }; $("#qp").onclick = () => { qty = Math.min(20, qty + 1); upd(); };
    // sticky buy bar (phones only, via CSS)
    const bar = document.createElement("div"); bar.className = "buybar";
    bar.innerHTML = `<div class="bp"><b></b><small></small></div><a class="btn btn-wa" target="_blank" rel="noopener">${WA_ICON} Order on WhatsApp</a>`;
    document.body.appendChild(bar); document.body.classList.add("has-buybar");
    const upd0 = upd; upd = function () { upd0(); const v = p.variants[vi]; $("b", bar).textContent = $("#pp").textContent; $("small", bar).textContent = qty > 1 ? qty + " × " + v.label : "per " + v.label; $(".btn", bar).href = waLink(p, v, qty); };
    upd();
    // gallery switch + hover zoom
    const gm = $("#gmain");
    $$(".th").forEach(b => b.onclick = () => { $$(".th").forEach(x => x.classList.remove("on")); b.classList.add("on"); gm.querySelector("img").outerHTML = img(b.dataset.id, p.name, "(min-width:900px) 45vw, 95vw", "", true); });
    gm.addEventListener("mousemove", e => { const r = gm.getBoundingClientRect(), im = gm.querySelector("img"); im.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; im.style.transform = "scale(1.8)"; });
    gm.addEventListener("mouseleave", () => { gm.querySelector("img").style.transform = ""; });
    // related
    const rel = $("#related"); if (rel) { rel.innerHTML = P.filter(x => x.id !== p.id && x.cat === p.cat).concat(P.filter(x => x.cat !== p.cat)).slice(0, 4).map(card).join(""); wireCards(rel); }
    // Product schema (JSON-LD)
    const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.desc, brand: { "@type": "Brand", name: "Bagayatdar" },
      image: p.images.map(i => `${S.domain}/assets/img/${fname(i)}-1100.webp`),
      offers: p.variants.map(v => ({ "@type": "Offer", priceCurrency: "INR", price: v.price, name: v.label, availability: p.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: `${S.domain}/product.html?id=${p.id}` })) };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
  }

  /* ---------- forms that send to WhatsApp ---------- */
  function forms() {
    $$("form[data-wa]").forEach(f => f.addEventListener("submit", e => {
      e.preventDefault();
      const d = new FormData(f), lines = [...d.entries()].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
      window.open(waGeneral(`${f.dataset.wa}\n\n${lines.join("\n")}`), "_blank", "noopener");
    }));
  }

  /* ---------- FAQ accordion uses <details>, nothing to do ---------- */
  buildChrome(); home(); latestPosts(); shop(); product(); forms(); reveal(); parallax();
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
