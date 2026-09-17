/* =========================================================
   赵赵的岛 · script.js
   滚动浮现 / 主题切换 / 导航滚动高亮 / 相册灯箱
   ========================================================= */

(function () {
  "use strict";

  /* ---------- ① 滚动浮现动画 ---------- */
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- ①.5 技能条填充动画 ---------- */
  var skillObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var fill = entry.target;
        // 「增长中」那条不按百分比填充，保持流动；其余按 data-w 撑开
        if (!fill.classList.contains("growing")) {
          var w = parseInt(fill.getAttribute("data-w"), 10) || 0;
          fill.style.width = w + "%";
        } else {
          fill.style.width = "100%";
        }
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll(".skill-fill").forEach(function (fill) {
    skillObserver.observe(fill);
  });

  /* ---------- ② 主题切换（深/浅，记忆在 localStorage） ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");

  var STORAGE_KEY = "zhaozhao-theme";
  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", theme === "dark" ? "切换到浅色主题" : "切换到深色主题");
    }
  }

  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) { /* 忽略隐私模式写失败 */ }
    });
  }

  /* ---------- ③ 导航滚动高亮 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach(function (sec) {
    sectionObserver.observe(sec);
  });

  /* ---------- ④ 相册灯箱 ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbFig = document.getElementById("lbFig");
  var lbTitle = document.getElementById("lbTitle");

  function openLightbox(figure) {
    if (!lightbox) return;
    var slot = figure.querySelector(".ph-slot");
    var fig = figure.querySelector("svg, img");
    // 灯箱里展示放大的图（若是占位 SVG 则原样放大）
    lbFig.innerHTML = "";

    if (fig) {
      if (fig.tagName === "img") {
        var img = document.createElement("img");
        img.src = fig.getAttribute("src");
        img.alt = fig.getAttribute("alt") || "";
        lbFig.appendChild(img);
      } else {
        // SVG：原样克隆并放大
        fig.parentNode.querySelector("svg") &&
          lbFig.appendChild(fig.cloneNode(true));
      }
    }
    // 若上面没拿到图，给个默认占位
    if (!lbFig.firstChild) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 120 120");
      svg.innerHTML =
        '<rect x="20" y="30" width="80" height="56" rx="8" fill="#FFFBE9" stroke="#1C2836" stroke-width="4"/>' +
        '<circle cx="60" cy="58" r="16" fill="#9DC0DD" stroke="#1C2836" stroke-width="4"/>' +
        '<circle cx="88" cy="40" r="3" fill="#F5A623"/>';
      lbFig.appendChild(svg);
    }

    lbTitle.textContent = figure.getAttribute("data-title") || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbFig.innerHTML = "";
  }

  document.querySelectorAll(".ph").forEach(function (figure) {
    figure.addEventListener("click", function () {
      openLightbox(figure);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-lbclose]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();

/* =========================================================
   ⑤ 点击彩蛋：点哪儿就均匀爆出
      🐷 小猪猪 · 🎀 小蝴蝶结 · 🌈 小彩虹 · 😊 小笑脸 · 🎊 小彩带
   ========================================================= */
(function () {
  "use strict";

  // 尊重系统「减少动态效果」设置
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // 五种小可爱，每次点击都尽量让五种都出现
  var SYMBOLS = ["🐷", "🎀", "🌈", "😊", "🎊"];

  var layer = null;

  function getLayer() {
    if (layer && document.body.contains(layer)) return layer;
    layer = document.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    return layer;
  }

  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- 音效：用 Web Audio 合成一声轻轻的「啵」 ---------- */
  var audioCtx = null;
  function playPop() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();

      var t = audioCtx.currentTime;
      var base = 680 + Math.random() * 260;

      // 主音：快速下滑的「啵」
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 0.32, t + 0.18);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.26);

      // 高频小点缀，听起来更亮更甜
      var o2 = audioCtx.createOscillator();
      var g2 = audioCtx.createGain();
      o2.type = "triangle";
      o2.frequency.setValueAtTime(base * 2.1, t);
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o2.connect(g2);
      g2.connect(audioCtx.destination);
      o2.start(t);
      o2.stop(t + 0.16);
    } catch (e) { /* 静默失败，不影响动画 */ }
  }

  function spawn(host, x, y, symbol, o) {
    var el = document.createElement("span");
    el.className = "fx-emoji";
    el.textContent = symbol;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.fontSize = o.size + "px";
    host.appendChild(el);

    var base = "translate(-50%, -50%) translate(";
    var frames = [
      { transform: base + "0px, 0px) scale(.3) rotate(0deg)", opacity: 0.15, offset: 0 },
      { transform: base + o.dx * 0.6 + "px, " + o.dy * 0.6 + "px) scale(" + o.scale + ") rotate(" + o.rot * 0.5 + "deg)", opacity: 1, offset: 0.5 },
      { transform: base + o.dx + "px, " + o.dy + "px) scale(" + o.scale * 0.6 + ") rotate(" + o.rot + "deg)", opacity: 0, offset: 1 }
    ];

    var anim = el.animate(frames, {
      duration: o.dur,
      easing: "cubic-bezier(.22,.61,.36,1)",
      fill: "forwards"
    });
    anim.onfinish = function () { removeNode(el); };
  }

  function burst(x, y) {
    var host = getLayer();
    var count = 12;                 // 固定 12 个，方便均匀铺满一圈
    var order = shuffle(SYMBOLS);   // 打乱后循环取，保证五种都出现

    // 均匀四散：角度平均分配，飞行距离也基本一致
    for (var i = 0; i < count; i++) {
      var symbol = order[i % order.length];
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
      var dist = 120 + Math.random() * 30;

      spawn(host, x, y, symbol, {
        size: 11 + Math.random() * 8,          // 大小约为原来的一半（11~19px）
        scale: 0.9 + Math.random() * 0.4,
        rot: (Math.random() - 0.5) * 220,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        dur: 1300 + Math.random() * 700        // 放慢：1.3~2.0s
      });
    }

    // 点击处的小光环（也放慢一点）
    var ring = document.createElement("span");
    ring.className = "fx-ring";
    ring.style.left = x + "px";
    ring.style.top = y + "px";
    host.appendChild(ring);

    var ringAnim = ring.animate(
      [
        { transform: "translate(-50%, -50%) scale(.2)", opacity: 0.7 },
        { transform: "translate(-50%, -50%) scale(1.9)", opacity: 0 }
      ],
      { duration: 900, easing: "ease-out", fill: "forwards" }
    );
    ringAnim.onfinish = function () { removeNode(ring); };
  }

  document.addEventListener(
    "click",
    function (e) {
      if (typeof e.button === "number" && e.button !== 0) return; // 只响应左键
      playPop();
      burst(e.clientX, e.clientY);
    },
    true
  );
})();

/* =========================================================
   ⑥ 标题彩虹字：每个字都不一样颜色，还轻轻高低错落
   ========================================================= */
(function () {
  "use strict";

  var COLORS = ["#F5A623", "#E94F37", "#7CBF43", "#3D9BE9", "#B36BE0", "#F15BB5", "#12B5A5"];

  function rainbow(el) {
    if (!el || el.getAttribute("data-rainbow") === "1") return;
    var text = el.textContent;
    if (!text || !text.trim()) return;
    el.setAttribute("data-rainbow", "1");
    el.textContent = "";

    var chars = Array.from(text);
    var idx = 0;

    chars.forEach(function (ch) {
      if (ch === " " || ch === "\n" || ch === "\t") {
        el.appendChild(document.createTextNode(ch));
        return;
      }
      var span = document.createElement("span");
      span.textContent = ch;
      span.style.color = COLORS[idx % COLORS.length];
      span.style.display = "inline-block";
      // 每个字轻微上下错落，更像小朋友随手写的
      span.style.transform = "translateY(" + ((Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2)).toFixed(1) + "px)";
      idx++;
      el.appendChild(span);
    });
  }

  var targets = document.querySelectorAll(".brand-name, .eyebrow, .name, .tagline, section h2");
  targets.forEach(rainbow);
})();

/* =========================================================
   ⑦ 留言反馈：弹窗开合 + 提交到 Netlify Forms
      访客提交后，内容会出现在 Netlify 后台 → Forms → feedback
   ========================================================= */
(function () {
  "use strict";

  var modal = document.getElementById("fbModal");
  var form = document.getElementById("fbForm");
  if (!modal || !form) return;

  var formView = document.getElementById("fbFormView");
  var doneView = document.getElementById("fbDoneView");
  var statusEl = document.getElementById("fbStatus");
  var msgEl = document.getElementById("fbMsg");
  var countEl = document.getElementById("fbCount");
  var submitBtn = document.getElementById("fbSubmit");
  var ratingInput = document.getElementById("fbRating");
  var scoreEl = document.getElementById("fbScore");
  var stars = Array.prototype.slice.call(document.querySelectorAll(".fb-star"));
  var lastFocus = null;

  // 本地预览（python http.server）没有后端，提交只做模拟，方便看效果
  var IS_LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(location.hostname);

  // GitHub Pages 没有表单后端（Netlify Forms 只在 Netlify 上生效），
  // 所以在 Pages 上退化成「打开邮件草稿」，并把访客引导到 Netlify 站留言。
  var IS_PAGES = /\.github\.io$/i.test(location.hostname);
  var MAIL_TO = "2872856817@qq.com";
  var NETLIFY_URL = "https://zhaozhaoisland.netlify.app/";

  /* ---------- 复用点击彩蛋：在该位置爆一次 ---------- */
  function celebrate(x, y) {
    try {
      document.dispatchEvent(
        new MouseEvent("click", { clientX: x, clientY: y, bubbles: true, cancelable: true })
      );
    } catch (e) { /* 老浏览器忽略 */ }
  }

  function setStatus(text, kind) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
    statusEl.className = "fb-status" + (kind ? " " + kind : "");
  }

  /* ---------- 开 / 关 ---------- */
  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (formView) formView.hidden = false;
    if (doneView) doneView.hidden = true;
    setStatus("");
    window.setTimeout(function () {
      var first = modal.querySelector('input[type="text"], textarea');
      if (first) first.focus();
    }, 120);
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-fbopen]"), function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  Array.prototype.forEach.call(modal.querySelectorAll("[data-fbclose]"), function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  /* ---------- 字数统计 ---------- */
  if (msgEl && countEl) {
    var syncCount = function () {
      countEl.textContent = msgEl.value.length + " / 800";
    };
    msgEl.addEventListener("input", syncCount);
    syncCount();
  }

  /* ---------- 星星打分（再点同一颗可取消） ---------- */
  var rating = 0;
  function paintStars(v) {
    stars.forEach(function (s) {
      s.classList.toggle("on", parseInt(s.getAttribute("data-v"), 10) <= v);
    });
    if (scoreEl) scoreEl.textContent = v ? v + " 分" + (v === 5 ? "，谢谢！" : "") : "还没打分";
    if (ratingInput) ratingInput.value = v ? String(v) : "";
  }

  stars.forEach(function (s) {
    s.addEventListener("click", function () {
      var v = parseInt(s.getAttribute("data-v"), 10);
      rating = rating === v ? 0 : v;
      paintStars(rating);
      var r = s.getBoundingClientRect();
      celebrate(r.left + r.width / 2, r.top + r.height / 2);
    });
  });

  /* ---------- 提交 ---------- */
  function showDone() {
    if (formView) formView.hidden = true;
    if (doneView) doneView.hidden = false;
    form.reset();
    rating = 0;
    paintStars(0);
    if (countEl) countEl.textContent = "0 / 800";
    var r = modal.getBoundingClientRect();
    celebrate(r.left + r.width / 2, r.top + r.height / 3);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var msg = msgEl ? msgEl.value.trim() : "";
    if (!msg) {
      setStatus("至少写一句话嘛～", "err");
      if (msgEl) msgEl.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "发送中…";
    }
    setStatus("正在发送…");

    function restore() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "发送留言";
      }
    }

    if (IS_LOCAL) {
      window.setTimeout(function () {
        showDone();
        restore();
        setStatus("本地预览：已模拟发送成功（部署到线上才会真正保存）", "ok");
      }, 400);
      return;
    }

    if (IS_PAGES) {
      var nickEl = form.querySelector('[name="nickname"]');
      var contactEl = form.querySelector('[name="contact"]');
      var nick = nickEl ? nickEl.value.trim() : "";
      var contact = contactEl ? contactEl.value.trim() : "";
      var lines = [msg];
      if (rating) lines.push("", "评分：" + rating + " / 5");
      if (contact) lines.push("联系方式：" + contact);
      restore();
      setStatus(
        "GitHub Pages 版没有留言后端，已帮你把内容填进邮件草稿～" +
          "也可以直接去 " + NETLIFY_URL + " 留言。", "ok"
      );
      window.location.href =
        "mailto:" + MAIL_TO +
        "?subject=" + encodeURIComponent("【赵赵的岛】网站留言" + (nick ? "｜" + nick : "")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      return;
    }

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        showDone();
        restore();
      })
      .catch(function (err) {
        restore();
        setStatus("发送失败了，稍后再试试～（" + (err && err.message ? err.message : "网络问题") + "）", "err");
      });
  });

  /* ---------- 没开 JS 时表单会跳回 ?fb=thanks，这里给个提示条 ---------- */
  if (/[?&]fb=thanks/.test(location.search)) {
    var toast = document.createElement("div");
    toast.className = "fb-toast";
    toast.textContent = "🎉 留言已收到，谢谢你！";
    document.body.appendChild(toast);
    window.setTimeout(function () { toast.classList.add("show"); }, 80);
    window.setTimeout(function () { toast.classList.remove("show"); }, 4200);
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4800);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, "", location.pathname);
    }
  }
})();
