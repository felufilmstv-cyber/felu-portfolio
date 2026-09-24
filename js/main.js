// FELU portfolio — vanilla JS only. Each behaviour has a reason.
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Nav solid-state + scroll progress (mechanical 2px bar)
  var nav = document.querySelector(".nav"), prog = document.querySelector(".progress i");
  function onScroll(){
    var y = window.scrollY || 0;
    if(nav) nav.classList.toggle("solid", y > 40);
    if(prog){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }
  }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // 2. Mobile menu
  var burger = document.querySelector(".burger"), menu = document.querySelector(".mobile-menu");
  if(burger && menu){
    burger.addEventListener("click", function(){ menu.classList.add("on"); burger.setAttribute("aria-expanded","true"); var c = menu.querySelector(".close"); if(c) c.focus(); });
    menu.querySelector(".close").addEventListener("click", function(){ menu.classList.remove("on"); burger.setAttribute("aria-expanded","false"); burger.focus(); });
    menu.addEventListener("keydown", function(e){ if(e.key === "Escape"){ menu.classList.remove("on"); burger.focus(); } });
  }

  // 3. Scroll reveals — IntersectionObserver, clip translate only (GPU: transform/opacity)
  var els = document.querySelectorAll(".rv");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    }, {threshold:.12, rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add("in"); }); }

  // 4. Animated metrics — count up once in view
  function count(el){
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10);
    var suffix = el.dataset.suffix || "";
    if(reduce){ el.innerHTML = target.toFixed(dec) + "<i>" + suffix + "</i>"; return; }
    var t0 = null, dur = 1400;
    function step(t){
      if(!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.innerHTML = (target * e).toFixed(dec) + "<i>" + suffix + "</i>";
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var mets = document.querySelectorAll("[data-count]");
  if(mets.length && "IntersectionObserver" in window){
    var mo = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ count(en.target); mo.unobserve(en.target); } }); }, {threshold:.4});
    mets.forEach(function(m){ mo.observe(m); });
  } else { mets.forEach(count); }

  // 5. Skills accordion — one open at a time (system list, not icon grid)
  document.querySelectorAll(".skill").forEach(function(sk){
    var btn = sk.querySelector("button"), panel = sk.querySelector(".panel");
    btn.addEventListener("click", function(){
      var isOpen = sk.classList.contains("open");
      document.querySelectorAll(".skill.open").forEach(function(o){
        o.classList.remove("open"); o.querySelector(".panel").style.maxHeight = null;
        o.querySelector("button").setAttribute("aria-expanded","false");
      });
      if(!isOpen){ sk.classList.add("open"); panel.style.maxHeight = panel.scrollHeight + "px"; btn.setAttribute("aria-expanded","true"); }
    });
  });

  // 6. Cursor-follow project preview (desktop only; touch uses tap = link)
  var prev = document.getElementById("cursorPrev");
  if(prev && window.matchMedia("(pointer:fine)").matches && !reduce){
    var panes = prev.querySelectorAll(".pv"), x = 0, y = 0, cx = 0, cy = 0, raf = null;
    function loop(){ cx += (x - cx) * .16; cy += (y - cy) * .16;
      prev.style.transform = "translate(" + (cx + 24) + "px," + (cy - 105) + "px)" + (prev.classList.contains("on") ? " scale(1)" : " scale(.92)");
      raf = requestAnimationFrame(loop); }
    document.querySelectorAll(".prow[data-prev]").forEach(function(row){
      row.addEventListener("mouseenter", function(){
        panes.forEach(function(p){ p.classList.toggle("on", p.dataset.k === row.dataset.prev); });
        prev.classList.add("on");
        if(!raf) loop();
      });
      row.addEventListener("mouseleave", function(){ prev.classList.remove("on"); });
      row.addEventListener("click", function(){ window.location.href = row.dataset.href; });
    });
    window.addEventListener("mousemove", function(e){ x = e.clientX; y = e.clientY; }, {passive:true});
  } else {
    document.querySelectorAll(".prow[data-href]").forEach(function(row){
      row.addEventListener("click", function(){ window.location.href = row.dataset.href; });
    });
  }

  // 7. Magnetic buttons — subtle, precise (disabled on touch / reduced motion)
  if(window.matchMedia("(pointer:fine)").matches && !reduce){
    document.querySelectorAll(".btn").forEach(function(b){
      b.addEventListener("mousemove", function(e){
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (dx * .12) + "px," + (dy * .18) + "px)";
      });
      b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
    });
  }

  // 8. SIGNATURE — automation pipeline runner. Input → process → output, log streams.
  var runBtn = document.getElementById("pipeRun"), log = document.getElementById("pipeLog");
  if(runBtn && log){
    var lines = [
      ["› intake:  email.received  invoice#INV-2041.pdf", ""],
      ["› parse:   extract(vendor, total, due_date) … ok", ""],
      ["› decide:  llm.classify → route: finance/approve", ""],
      ["› act:     whatsapp.send(+[REDACTED]) + sheet.append", ""],
      ["<span class='ok'>✓ done in 1.8s — 0 manual steps. 6h/week → ~0.</span>", ""]
    ];
    var busy = false;
    function run(){
      if(busy) return; busy = true; log.innerHTML = ""; var i = 0;
      runBtn.disabled = true; runBtn.textContent = "Running…";
      (function next(){
        if(i >= lines.length){ busy = false; runBtn.disabled = false; runBtn.textContent = "↻ Run pipeline"; return; }
        var div = document.createElement("div"); div.innerHTML = lines[i][0];
        log.appendChild(div); i++; setTimeout(next, reduce ? 0 : 520);
      })();
    }
    runBtn.addEventListener("click", run);
    if("IntersectionObserver" in window){
      var po = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ run(); po.disconnect(); } }); }, {threshold:.35});
      po.observe(log);
    }
  }

  // 9. Contact form — labelled, validated, no backend (mailto compose + inline confirm)
  var form = document.getElementById("contactForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = form.querySelector("#cf-name"), email = form.querySelector("#cf-email"), msg = form.querySelector("#cf-msg");
      var ok = true;
      [["#cf-name-err", name.value.trim().length >= 2], ["#cf-email-err", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())], ["#cf-msg-err", msg.value.trim().length >= 10]].forEach(function(p){
        var el = form.querySelector(p[0]); el.classList.toggle("on", !p[1]); if(!p[1]) ok = false;
      });
      if(!ok){ form.querySelector(".ferr.on").previousElementSibling.focus(); return; }
      var subject = encodeURIComponent("Project inquiry from " + name.value.trim());
      var body = encodeURIComponent(msg.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
      window.location.href = "mailto:favouradeleye71@gmail.com?subject=" + subject + "&body=" + body;
      document.getElementById("formOk").classList.add("on");
      form.reset();
    });
  }

  // footer year
  var yr = document.getElementById("yr"); if(yr) yr.textContent = new Date().getFullYear();
})();
