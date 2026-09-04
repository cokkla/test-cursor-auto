/* ==========================================================
 * theme.js —— 亮暗主题切换与 localStorage 记忆
 * 防 FOUC 的首次读取写在 <head> 内联脚本中提前执行，
 * 本文件只负责后续的按钮绑定、切换与图标同步。
 * ========================================================== */

(function (global) {
  "use strict";

  var THEME_STORAGE_KEY = "site-theme";
  var THEMES = { LIGHT: "light", DARK: "dark" };

  /**
   * 解析初始主题：已存储的优先，否则跟随系统偏好。
   * 纯函数，便于单元测试，也被 <head> 内联脚本复用。
   */
  function resolveInitialTheme(storedTheme, prefersDark) {
    if (storedTheme === THEMES.LIGHT || storedTheme === THEMES.DARK) {
      return storedTheme;
    }
    return prefersDark ? THEMES.DARK : THEMES.LIGHT;
  }

  /** 计算切换后的主题（纯函数）。非 dark 一律视为 light。 */
  function nextTheme(current) {
    return current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  }

  /** 主题切换按钮的无障碍文案：描述“点击后会切到哪个主题”。 */
  function themeToggleLabel(current) {
    return current === THEMES.DARK ? "切换到亮色主题" : "切换到暗色主题";
  }

  /* --- 以下为依赖 DOM 的逻辑，仅在浏览器环境执行 --- */

  function applyTheme(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage 不可用（隐私模式等）时静默降级，不影响主题切换 */
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute("aria-label", themeToggleLabel(theme));
      btn.setAttribute("aria-pressed", String(theme === THEMES.DARK));
    }
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === THEMES.DARK
      ? THEMES.DARK
      : THEMES.LIGHT;
  }

  function initTheme() {
    // data-theme 已由 <head> 内联脚本设置，这里只补齐按钮状态与事件
    applyTheme(getCurrentTheme());
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      applyTheme(nextTheme(getCurrentTheme()));
    });
  }

  global.initTheme = initTheme;

  // 同时挂到命名空间，供其它脚本与测试引用纯逻辑
  global.ThemeUtils = {
    THEME_STORAGE_KEY: THEME_STORAGE_KEY,
    THEMES: THEMES,
    resolveInitialTheme: resolveInitialTheme,
    nextTheme: nextTheme,
    themeToggleLabel: themeToggleLabel,
  };

  // Node 环境下导出纯函数供单元测试；浏览器中 module 未定义，不受影响
  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.ThemeUtils;
  }
})(typeof window !== "undefined" ? window : globalThis);
