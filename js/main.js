// FELU portfolio — vanilla JS only. Each behaviour has a reason.
(function(){
  "use strict";
  document.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hero headline: word-by-word boot reveal (progressive enhancement only).
  // NOTE: element nodes (e.g. <em>) are wrapped ATOMICALLY, never split open:
  // background-clip:text on an ancestor fails in Chromium when the text runs
  // through overflow:hidden + transformed descendants, painting nothing.
  (function(){
    var h1 = document.getElementById("h1");
    if(!h1 || reduce) return;
    function wrapWords(el){
      var c = { i: 0 };
      function shell(){
        var w = document.createElement("span"); w.className = "w";
        var wi = document.createElement("span"); wi.className = "wi";
        wi.style.animationDelay = (c.i * 45) + "ms"; c.i++;
        w.appendChild(wi);
        return { w: w, wi: wi };
      }
      function walk(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(n){
          if(n.nodeType === 3){
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(part){
              if(!part) return;
              if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(" ")); return; }
              var s = shell(); s.wi.textContent = part; frag.appendChild(s.w);
            });
            node.replaceChild(frag, n);
          } else if(n.nodeType === 1){
            var s2 = shell();
            node.replaceChild(s2.w, n); s2.wi.appendChild(n);
          }
        });
      }
      walk(el);
    }
    wrapWords(h1);
    h1.classList.add("words");
    // failsafe: never leave text hidden behind a stuck animation
    setTimeout(function(){ h1.classList.add("settled"); }, 2500);
  })();

  // Pipeline background: freeze SMIL + hide pulses for reduced motion
  document.querySelectorAll("svg.pipe-bg").forEach(function(svg){
    if(!reduce) return;
    svg.classList.add("rm");
    try { svg.pauseAnimations(); } catch(e){}
  });

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

  // Hero background parallax — two depth layers, rAF-throttled transform only
  var hgrid = document.querySelector(".hero-grid-bg"), pbg = document.querySelector("svg.pipe-bg");
  if((hgrid || pbg) && !reduce){
    var ptick = false;
    window.addEventListener("scroll", function(){
      if(ptick) return; ptick = true;
      requestAnimationFrame(function(){
        var y = window.scrollY || 0;
        if(hgrid) hgrid.style.transform = "translateY(" + (y * -.06) + "px)";
        if(pbg) pbg.style.transform = "translateY(" + (y * -.03) + "px)";
        ptick = false;
      });
    }, {passive:true});
  }

  // 2. Mobile menu
  var burger = document.querySelector(".burger"), menu = document.querySelector(".mobile-menu");
  if(burger && menu){
    burger.addEventListener("click", function(){ menu.classList.add("on"); burger.setAttribute("aria-expanded","true"); var c = menu.querySelector(".close"); if(c) c.focus(); });
    menu.querySelector(".close").addEventListener("click", function(){ menu.classList.remove("on"); burger.setAttribute("aria-expanded","false"); burger.focus(); });
    menu.addEventListener("keydown", function(e){ if(e.key === "Escape"){ menu.classList.remove("on"); burger.focus(); } });
  }

  // 3. Scroll reveals — IntersectionObserver, GPU props only (transform/opacity/clip-path)
  var els = document.querySelectorAll(".rv,.rv-scale,.wipe");
  if("IntersectionObserver" in window && !reduce){
    // NOTE: clip-path: inset() clips an element to zero visible area, and
    // IntersectionObserver then reports ratio 0 forever. So .wipe rows are
    // revealed by observing their SECTION (unclipped ancestor), not the row.
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var list = en.target._reveals || [en.target];
        list.forEach(function(el){ el.classList.add("in"); });
        io.unobserve(en.target);
      });
    }, {threshold:.12, rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(el){
      var watch = el;
      if(el.classList && el.classList.contains("wipe") && el.closest("section")) watch = el.closest("section");
      watch._reveals = (watch._reveals || []).concat([el]);
      io.observe(watch);
    });
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
      if(p < 1){ requestAnimationFrame(step); }
      else if(!reduce){ el.classList.add("done"); setTimeout(function(){ el.classList.remove("done"); }, 600); }
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
  // Hard rules: 180ms hover intent; hidden instantly on scroll/mouseleave;
  // re-arms ONLY on genuine mouse movement while a row is hovered at rest;
  // clamped above the cursor so it never covers the row's own metadata.
  var prev = document.getElementById("cursorPrev");
  if(prev && window.matchMedia("(pointer:fine)").matches && !reduce){
    var panes = prev.querySelectorAll(".pv"), x = 0, y = 0, cx = 0, cy = 0, raf = null;
    var showTimer = null, scrollTimer = null, scrolling = false, activeRow = null;
    var PW = 320, PH = 210;
    function target(){
      var vw = window.innerWidth || 1440;
      var px = Math.min(Math.max(x - PW / 2, 8), Math.max(8, vw - PW - 8));
      var py = y - PH - 16;
      if(py < 8) py = y + 24; // near viewport top: fall below the cursor
      return [px, py];
    }
    function loop(){
      var t = target();
      cx += (t[0] - cx) * .2; cy += (t[1] - cy) * .2;
      prev.style.transform = "translate(" + cx + "px," + cy + "px)" + (prev.classList.contains("on") ? " scale(1)" : " scale(.92)");
      if(prev.classList.contains("on") || activeRow){ raf = requestAnimationFrame(loop); }
      else { raf = null; } }
    function hidePreview(){
      if(showTimer){ clearTimeout(showTimer); showTimer = null; }
      activeRow = null;
      prev.classList.remove("on");
    }
    function armPreview(row){
      if(showTimer){ clearTimeout(showTimer); showTimer = null; }
      activeRow = row;
      var enteredAtRest = !scrolling; // entries made mid-scroll never fire — re-enter or move after rest
      showTimer = setTimeout(function(){
        showTimer = null;
        if(scrolling || !enteredAtRest || activeRow !== row) return;
        panes.forEach(function(p){ p.classList.toggle("on", p.dataset.k === row.dataset.prev); });
        var t = target(); cx = t[0]; cy = t[1]; // start placed — no swoop, no stale coords
        prev.classList.add("on");
        if(!raf) loop();
      }, 180);
    }
    window.addEventListener("scroll", function(){
      scrolling = true;
      hidePreview(); // gone on first scroll tick — never sticks mid-scroll
      if(scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function(){ scrolling = false; }, 160);
    }, {passive:true});
    document.querySelectorAll(".prow[data-prev]").forEach(function(row){
      row.addEventListener("mouseenter", function(){ armPreview(row); });
      row.addEventListener("mouseleave", function(){ hidePreview(); });
      row.addEventListener("click", function(){ window.location.href = row.dataset.href; });
    });
    window.addEventListener("mousemove", function(e){
      x = e.clientX; y = e.clientY;
      if(scrolling) return;
      var t = e.target;
      var overRow = t && t.closest ? t.closest(".prow[data-prev]") : null;
      if(prev.classList.contains("on") && !overRow){ hidePreview(); return; } // failsafe: not over a row = hidden
      if(!prev.classList.contains("on") && overRow){ armPreview(overRow); } // genuine movement re-arms at rest
    }, {passive:true});
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
        b.style.setProperty("--mx", (dx * .12) + "px");
        b.style.setProperty("--my", (dy * .18) + "px");
      });
      b.addEventListener("mouseleave", function(){ b.style.removeProperty("--mx"); b.style.removeProperty("--my"); });
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
    var submitBtn = form.querySelector("[type=submit]");
    var msg = form.querySelector("#cf-msg");
    // auto-grow textarea, capped with internal scroll
    function grow(){ msg.style.height = "auto"; msg.style.height = Math.min(msg.scrollHeight, 320) + "px"; }
    msg.addEventListener("input", grow); grow();
    // clear an error as soon as the user fixes the field
    form.querySelectorAll("input,textarea").forEach(function(el){
      el.addEventListener("input", function(){
        el.closest(".field").classList.remove("err");
        var err = el.closest(".field").querySelector(".ferr");
        if(err) err.classList.remove("on");
        el.removeAttribute("aria-invalid");
      });
    });
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = form.querySelector("#cf-name"), email = form.querySelector("#cf-email");
      var ok = true, firstBad = null;
      [["#cf-name-err", name, name.value.trim().length >= 2],
       ["#cf-email-err", email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
       ["#cf-msg-err", msg, msg.value.trim().length >= 10]].forEach(function(p){
        var errEl = form.querySelector(p[0]), field = p[1].closest(".field");
        var bad = !p[2];
        errEl.classList.toggle("on", bad);
        field.classList.toggle("err", bad);
        if(bad){ p[1].setAttribute("aria-invalid", "true"); if(!firstBad) firstBad = p[1]; } else { p[1].removeAttribute("aria-invalid"); }
        if(bad) ok = false;
      });
      if(!ok){ firstBad.focus(); return; }
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending… ";
      setTimeout(function(){
        var subject = encodeURIComponent("Project inquiry from " + name.value.trim());
        var body = encodeURIComponent(msg.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
        window.location.href = "mailto:favouradeleye71@gmail.com?subject=" + subject + "&body=" + body;
        document.getElementById("formOk").classList.add("on");
        form.reset(); grow();
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Inquiry →";
      }, 900);
    });
  }

  // CTA click: glow-ring expansion (transform/opacity only)
  if(!reduce){
    document.addEventListener("click", function(e){
      var b = e.target && e.target.closest ? e.target.closest(".btn") : null;
      if(!b) return;
      b.classList.remove("ping");
      void b.offsetWidth;
      b.classList.add("ping");
      setTimeout(function(){ b.classList.remove("ping"); }, 650);
    });
  }

  // footer year
  var yr = document.getElementById("yr"); if(yr) yr.textContent = new Date().getFullYear();

  // Ambient node-graph background — fixed canvas behind everything, own layer.
  // Unlabeled texture only (no nodes/labels with meaning); the scoped pipeline
  // section keeps its separate animation untouched. Exposes window.__netbg
  // ({ticks, nodes, pulses}) for testing.
  (function(){
    if(!("requestAnimationFrame" in window) || !document.body) return;
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.9";
    if(document.body.firstChild) document.body.insertBefore(cv, document.body.firstChild);
    else document.body.appendChild(cv);
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, DPR = 1, nodes = [], pulses = [];
    var MOBILE = window.matchMedia("(max-width: 900px)").matches;
    var COUNT = MOBILE ? 18 : 45;
    var LINK = MOBILE ? 130 : 150;
    var api = window.__netbg = { ticks: 0, nodes: 0, pulses: 0 };
    function resize(){
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function seed(){
      nodes = [];
      for(var i = 0; i < COUNT; i++){
        var a = Math.random() * Math.PI * 2, s = .1 + Math.random() * .12;
        nodes.push({ x: Math.random() * W, y: Math.random() * H,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1 + Math.random() * 1.2 });
      }
      api.nodes = nodes.length;
    }
    function links(){
      var out = [], i, j, dx, dy, d2 = LINK * LINK;
      for(i = 0; i < nodes.length; i++){
        for(j = i + 1; j < nodes.length; j++){
          dx = nodes[i].x - nodes[j].x; dy = nodes[i].y - nodes[j].y;
          if(dx * dx + dy * dy < d2) out.push([i, j]);
        }
      }
      return out;
    }
    function draw(staticFrame){
      ctx.clearRect(0, 0, W, H);
      var ls = links(), k, a, b, px, py;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.beginPath();
      for(k = 0; k < ls.length; k++){
        a = nodes[ls[k][0]]; b = nodes[ls[k][1]];
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.09)";
      for(k = 0; k < nodes.length; k++){
        ctx.beginPath(); ctx.arc(nodes[k].x, nodes[k].y, nodes[k].r, 0, 6.2832); ctx.fill();
      }
      for(k = pulses.length - 1; k >= 0; k--){
        var p = pulses[k];
        if(!staticFrame) p.t += .016;
        a = nodes[p.a]; b = nodes[p.b];
        if(!a || !b || p.t >= 1){ pulses.splice(k, 1); continue; }
        px = a.x + (b.x - a.x) * p.t; py = a.y + (b.y - a.y) * p.t;
        ctx.strokeStyle = "rgba(198,241,53,.35)";
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        var g = ctx.createRadialGradient(px, py, 0, px, py, 7);
        g.addColorStop(0, "rgba(198,241,53,.9)"); g.addColorStop(1, "rgba(198,241,53,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, 7, 0, 6.2832); ctx.fill();
      }
      api.pulses = pulses.length;
    }
    var lastPulse = 0, raf = null, running = false;
    function frame(now){
      api.ticks++;
      var i, n;
      for(i = 0; i < nodes.length; i++){
        n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if(n.x < -20) n.x = W + 20; else if(n.x > W + 20) n.x = -20;
        if(n.y < -20) n.y = H + 20; else if(n.y > H + 20) n.y = -20;
      }
      if(now - lastPulse > 2200 + Math.random() * 2200 && pulses.length < 2){
        lastPulse = now;
        var ls = links();
        if(ls.length){ var pick = ls[(Math.random() * ls.length) | 0]; pulses.push({ a: pick[0], b: pick[1], t: 0 }); }
      }
      draw(false);
      raf = requestAnimationFrame(frame);
    }
    function start(){ if(running || reduce) return; running = true; raf = requestAnimationFrame(frame); }
    function stop(){ running = false; if(raf && window.cancelAnimationFrame) window.cancelAnimationFrame(raf); raf = null; }
    resize(); seed();
    if(reduce){ draw(true); return; } // static single frame, no motion
    var rzT = null;
    window.addEventListener("resize", function(){
      if(rzT) clearTimeout(rzT);
      rzT = setTimeout(function(){ resize(); seed(); }, 200);
    });
    document.addEventListener("visibilitychange", function(){
      if(document.hidden) stop(); else start();
    });
    start();
  })();
})();
