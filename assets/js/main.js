/* ==========================================================
 * main.js —— 唯一启动入口与页面级交互编排
 * 职责：初始化主题/渲染/形象，导航滚动态与锚点高亮、
 *       移动端汉堡菜单、章节滚动进场、作品集筛选、页脚年份。
 * 纯逻辑函数集中在顶部并导出，供单元测试。
 * ========================================================== */

(function (global) {
  "use strict";

  var SCROLL_THRESHOLD = 80; // 导航追加阴影描边的滚动阈值（px）

  /* ---------------- 纯逻辑函数（可单元测试） ---------------- */

  /** 是否已滚动超过阈值（用于导航 .is-scrolled 态） */
  function isScrolled(scrollY, threshold) {
    return Number(scrollY) > (threshold || 0);
  }

  /** 汉堡菜单的无障碍文案 */
  function navToggleLabel(isOpen) {
    return isOpen ? "关闭导航菜单" : "打开导航菜单";
  }

  /**
   * 依据选中分类，统计一组卡片分类中有多少可见。
   * 用于筛选后判断是否需要显示空状态。
   */
  function countVisible(categories, selected) {
    if (!Array.isArray(categories)) return 0;
    return categories.filter(function (c) {
      return selected === "all" || c === selected;
    }).length;
  }

  var pureApi = {
    isScrolled: isScrolled,
    navToggleLabel: navToggleLabel,
    countVisible: countVisible,
    SCROLL_THRESHOLD: SCROLL_THRESHOLD,
  };

  global.MainUtils = pureApi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = pureApi;
  }

  // 无 DOM 环境（如 Node 单元测试）到此为止，不执行任何页面逻辑
  if (typeof document === "undefined") return;

  /* ---------------- 启动编排 ---------------- */

  function boot() {
    if (typeof initTheme === "function") initTheme();
    renderThemeIcon();
    renderBurgerIcon();
    renderScrollIcon();

    if (typeof renderProfile === "function") renderProfile();
    if (typeof renderSkills === "function") renderSkills();
    if (typeof renderProjects === "function") renderProjects();
    if (typeof renderTimeline === "function") renderTimeline();
    if (typeof renderContact === "function") renderContact();
    if (typeof renderFooter === "function") renderFooter();
    if (typeof initCharacter === "function") initCharacter();

    setupNavScroll();
    setupSectionObserver();
    setupHamburger();
    setupFilters();
    setupReveal();
    setFooterYear();
  }

  /* 主题按钮内的太阳/月亮图标随主题切换 */
  function renderThemeIcon() {
    var slot = document.querySelector("[data-theme-icon]");
    if (!slot || !global.ICONS) return;
    var paint = function () {
      var dark =
        document.documentElement.getAttribute("data-theme") === "dark";
      slot.innerHTML = dark ? global.ICONS.sun : global.ICONS.moon;
    };
    paint();
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.addEventListener("click", paint);
  }

  function renderBurgerIcon() {
    var slot = document.querySelector("[data-nav-toggle-icon]");
    if (slot && global.ICONS) slot.innerHTML = global.ICONS.menu;
  }

  function renderScrollIcon() {
    var slot = document.querySelector("[data-scroll-icon]");
    if (slot && global.ICONS) slot.innerHTML = global.ICONS.arrowDown;
  }

  /** 页脚版权年份用 JS 写入，避免每年手改 */
  function setFooterYear() {
    var el = document.querySelector("[data-footer-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* --- 导航滚动态：超过阈值追加 .is-scrolled --- */
  function setupNavScroll() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle(
          "is-scrolled",
          isScrolled(window.scrollY, SCROLL_THRESHOLD)
        );
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 锚点高亮：当前章节对应链接加 .is-active --- */
  function setupSectionObserver() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".site-nav__links a")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) byId[id] = a;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var link = byId[entry.target.id];
          if (!link) return;
          links.forEach(function (a) {
            a.classList.remove("is-active");
          });
          link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* --- 移动端汉堡菜单 --- */
  function setupHamburger() {
    var btn = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector(".site-nav");
    if (!btn || !nav) return;

    var setOpen = function (open) {
      nav.classList.toggle("is-menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", navToggleLabel(open));
      var slot = document.querySelector("[data-nav-toggle-icon]");
      if (slot && global.ICONS) {
        slot.innerHTML = open ? global.ICONS.close : global.ICONS.menu;
      }
    };

    btn.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-menu-open"));
    });

    // 点击任意锚点后自动收起
    document
      .querySelectorAll(".site-nav__links a")
      .forEach(function (a) {
        a.addEventListener("click", function () {
          setOpen(false);
        });
      });
  }

  /* --- 作品集筛选 + 空状态 --- */
  function setupFilters() {
    var buttons = Array.prototype.slice.call(
      document.querySelectorAll("[data-filter]")
    );
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(".project-card")
    );
    var empty = document.querySelector("[data-projects-empty]");
    if (!buttons.length || !cards.length) return;

    var apply = function (selected) {
      var visible = 0;
      cards.forEach(function (card) {
        var match =
          selected === "all" ||
          card.getAttribute("data-category") === selected;
        card.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });
      if (empty) {
        empty.hidden = visible > 0;
        if (visible === 0) {
          empty.innerHTML =
            (global.ICONS ? global.ICONS.inbox : "") +
            "<span>该分类下暂无项目</span>";
        }
      }
    };

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        apply(btn.getAttribute("data-filter"));
      });
    });
  }

  /* --- 章节滚动进场（Hero 除外） --- */
  function setupReveal() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main .section:not(.section--hero)")
    );
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      // 不支持则直接显示，绝不把内容藏起来
      return;
    }

    // 初始隐藏态由 JS 添加，保证无 JS 时内容依然可见
    sections.forEach(function (s) {
      s.classList.add("reveal");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : globalThis);
