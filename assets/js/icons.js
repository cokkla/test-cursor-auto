/* ==========================================================
 * icons.js —— 内联 SVG 图标字符串集合
 * 全部为 24x24 线性图标，stroke="currentColor"，颜色随文字继承。
 * 使用：element.innerHTML = ICONS.mail;
 * ========================================================== */

(function (global) {
  "use strict";

  // 统一的 <svg> 包裹，减少重复。fill 用 none、stroke 用 currentColor，
  // 这样图标颜色会跟随所在元素的 color，天然响应主题切换。
  function svg(paths) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      paths +
      "</svg>"
    );
  }

  var ICONS = {
    /* --- 主题切换 --- */
    sun: svg(
      '<circle cx="12" cy="12" r="4" />' +
        '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41' +
        'M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />'
    ),
    moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />'),

    /* --- 技能分组 --- */
    brain: svg(
      '<path d="M9.5 4.5a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1 4.8V16a2.5 2.5 0 0 0 4 2" />' +
        '<path d="M14.5 4.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1 1 4.8V16a2.5 2.5 0 0 1-4 2" />' +
        '<path d="M12 5v14" />'
    ),
    sparkles: svg(
      '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />' +
        '<path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />'
    ),
    code: svg('<path d="M8 6l-6 6 6 6" /><path d="M16 6l6 6-6 6" />'),
    server: svg(
      '<rect x="3" y="4" width="18" height="7" rx="2" />' +
        '<rect x="3" y="13" width="18" height="7" rx="2" />' +
        '<path d="M7 7.5h.01M7 16.5h.01" />'
    ),

    /* --- 关于我 · 信息卡片 --- */
    user: svg(
      '<circle cx="12" cy="8" r="4" />' +
        '<path d="M4 21a8 8 0 0 1 16 0" />'
    ),
    calendar: svg(
      '<rect x="3" y="4.5" width="18" height="16" rx="2" />' +
        '<path d="M3 9h18M8 2.5v4M16 2.5v4" />'
    ),
    gender: svg(
      '<circle cx="12" cy="9" r="5" />' +
        '<path d="M12 14v7M9 18h6" />'
    ),
    location: svg(
      '<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" />' +
        '<circle cx="12" cy="10" r="2.5" />'
    ),
    education: svg(
      '<path d="M2 9l10-4 10 4-10 4L2 9z" />' +
        '<path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />'
    ),
    mail: svg(
      '<rect x="3" y="5" width="18" height="14" rx="2" />' +
        '<path d="M3 7l9 6 9-6" />'
    ),
    github: svg(
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.2 3.3 5.1 3.6 5.1 3.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.7 10c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />'
    ),
    briefcase: svg(
      '<rect x="3" y="7" width="18" height="13" rx="2" />' +
        '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />'
    ),

    /* --- 时间线 --- */
    book: svg(
      '<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" />' +
        '<path d="M18 3v18M8 7h6M8 11h6" />'
    ),

    /* --- 联系方式 --- */
    wechat: svg(
      '<path d="M9 4C5.1 4 2 6.6 2 9.9c0 1.8 1 3.4 2.5 4.5L4 17l2.7-1.4c.7.2 1.5.3 2.3.3h.6" />' +
        '<path d="M22 15.4c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3L21 21l-.4-1.8c.9-.8 1.4-1.8 1.4-2.8z" />' +
        '<path d="M7 9h.01M11 9h.01M14 15h.01M18 15h.01" />'
    ),

    /* --- 通用 --- */
    download: svg(
      '<path d="M12 3v12M7 10l5 5 5-5" />' +
        '<path d="M4 20h16" />'
    ),
    externalLink: svg(
      '<path d="M15 3h6v6" />' +
        '<path d="M10 14L21 3" />' +
        '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />'
    ),
    arrowDown: svg('<path d="M12 4v16M6 14l6 6 6-6" />'),
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16" />'),
    close: svg('<path d="M6 6l12 12M18 6L6 18" />'),
    inbox: svg(
      '<path d="M3 13h4l1.5 3h7L17 13h4" />' +
        '<path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5l2-8z" />'
    ),
  };

  global.ICONS = ICONS;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { ICONS: ICONS };
  }
})(typeof window !== "undefined" ? window : globalThis);
