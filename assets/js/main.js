/* ==========================================================
 * main.js —— 唯一启动入口
 * 在 DOMContentLoaded 中按序调用各初始化函数。
 * 用 typeof 判断保证在各模块尚未全部就位时也不报错。
 * ========================================================== */

(function () {
  "use strict";

  function boot() {
    if (typeof initTheme === "function") initTheme();
    if (typeof renderProfile === "function") renderProfile();
    if (typeof renderSkills === "function") renderSkills();
    if (typeof renderProjects === "function") renderProjects();
    if (typeof renderTimeline === "function") renderTimeline();
    if (typeof renderContact === "function") renderContact();
    if (typeof initCharacter === "function") initCharacter();

    setFooterYear();
  }

  /** 页脚版权年份用 JS 写入，避免每年手改 */
  function setFooterYear() {
    var el = document.querySelector("[data-footer-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
