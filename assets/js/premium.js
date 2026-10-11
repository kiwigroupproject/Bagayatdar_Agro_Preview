/* Premium interactions: progress bar, sticky-header state, card tilt + spotlight,
   count-up numbers, hero sparkles & parallax, headline split, marquee duplication, reveal stagger. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  // scroll progress + header state
  const bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
  function onScroll() {
    const h = document.documentElement, max = h.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
    const hd = $(".hdr"); if (hd) hd.classList.toggle("scrolled", scrollY > 30);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // card spotlight + 3D tilt (event delegation, cards are rendered by app.js)
  if (fine && !reduce) {
    document.addEventListener("mousemove", e => {
      const c = e.target.closest && e.target.closest(".pcard, .ccard"); if (!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
      c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg) translateY(-8px)`;
    });
    document.addEventListener("mouseout", e => {
      const c = e.target.closest && e.target.closest(".pcard, .ccard"); if (c && !c.contains(e.relatedTarget)) c.style.transform = "";
    });
  }
  // add spotlight layer to cards as they appear
  new MutationObserver(() => $$(".pcard:not([data-sp]), .ccard:not([data-sp])").forEach(c => { c.dataset.sp = 1; c.insertAdjacentHTML("afterbegin", '<span class="spot"></span>'); }))
    .observe(document.body, { childList: true, subtree: true });
  $$(".pcard, .ccard").forEach(c => { c.dataset.sp = 1; c.insertAdjacentHTML("afterbegin", '<span class="spot"></span>'); });

  // stagger reveals inside grids
  function stagger() { $$(".pgrid, .cats, .ben, .track").forEach(g => [...g.children].forEach((el, i) => el.style.setProperty("--d", Math.min(i, 8) * 0.08 + "s"))); }
  stagger(); new MutationObserver(stagger).observe(document.body, { childList: true, subtree: true });

  // hero headline: split into animated words
  const h1 = $(".hero h1");
  if (h1 && !reduce) {
    let i = 0;
    const wrap = node => { if (node.nodeType === 3) { const f = document.createDocumentFragment(); node.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) f.append(t); else { const s = document.createElement("span"); s.className = "w"; s.style.animationDelay = (.25 + i++ * .12) + "s"; s.textContent = t; f.append(s); } }); node.replaceWith(f); } else if (node.nodeType === 1) { [...node.childNodes].forEach(wrap); if (node.tagName === "EM") node.querySelectorAll(".w").forEach(w => { w.style.display = "inline-block"; }); } };
    [...h1.childNodes].forEach(wrap);
  }

  // count-up numbers
  const nums = $$("[data-count]");
  if (nums.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
      (function tick(t) { const p = Math.min(1, (t - t0) / 1600), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = v + suf; if (p < 1 && !reduce) requestAnimationFrame(tick); else el.textContent = end + suf; })(t0);
    }), { threshold: .5 });
    nums.forEach(n => io.observe(n));
  }

  // marquees: duplicate content for a seamless loop
  const wide = matchMedia("(min-width:821px)").matches;
  $$(".marq, .reviews .tgrid").forEach(m => { if (!reduce && (wide || m.classList.contains("marq"))) m.innerHTML += m.innerHTML; });

  // hero: sparkles + mouse parallax
  const hero = $(".hero");
  if (hero && !reduce) {
    const cv = $("#sparks"), ctx = cv && cv.getContext("2d");
    if (ctx) {
      let W, H, P = [];
      const size = () => { W = cv.width = hero.clientWidth; H = cv.height = hero.clientHeight; };
      size(); addEventListener("resize", size);
      for (let i = 0; i < 46; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, s: Math.random() * .0004 + .0001, a: Math.random() * 6.28 });
      (function draw(t) {
        ctx.clearRect(0, 0, W, H);
        P.forEach(p => { p.y -= p.s; if (p.y < -.02) p.y = 1.02; const o = .25 + .5 * Math.abs(Math.sin(t / 1100 + p.a)); ctx.beginPath(); ctx.arc(p.x * W + Math.sin(t / 2000 + p.a) * 12, p.y * H, p.r, 0, 6.28); ctx.fillStyle = `rgba(243,217,138,${o})`; ctx.shadowColor = "#f3d98a"; ctx.shadowBlur = 8; ctx.fill(); });
        requestAnimationFrame(draw);
      })(0);
    }
    if (fine) hero.addEventListener("mousemove", e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $$(".arch", hero).forEach((a, i) => { const k = (i + 1) * 8; a.style.translate = `${-x * k}px ${-y * k}px`; });
      $$(".orb", hero).forEach((o, i) => { o.style.translate = `${x * 40 * (i + 1)}px ${y * 30 * (i + 1)}px`; });
    });
  }
})();
