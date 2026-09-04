/* ==========================================================
 * character.js —— 漫画形象交互
 * 瞳孔跟随鼠标、挥手、眨眼、呼吸浮动（浮动由 CSS 负责）。
 * 尊重 prefers-reduced-motion：为真时保持静态。
 * 纯算法函数集中在顶部并导出，供单元测试。
 * ========================================================== */

(function (global) {
  "use strict";

  var MAX_OFFSET = 3; // 瞳孔位移上限（SVG 用户单位）
  var FALLOFF = 160; // 距离衰减基准（px），越小越灵敏
  var BLINK_MIN = 4000;
  var BLINK_MAX = 6500;
  var WAVE_DELAY = 800; // 加载后自动挥手的延迟（ms）

  /* ---------------- 纯算法函数（可单元测试） ---------------- */

  /**
   * 计算瞳孔相对眼心的位移，随距离衰减并限制在 MAX_OFFSET 内。
   * 返回的位移大小恒不超过 maxOffset，避免瞳孔脱离眼白。
   */
  function pupilOffset(mouseX, mouseY, eyeCx, eyeCy, maxOffset, falloff) {
    var max = maxOffset === undefined ? MAX_OFFSET : maxOffset;
    var fall = falloff === undefined ? FALLOFF : falloff;
    var dx = mouseX - eyeCx;
    var dy = mouseY - eyeCy;
    var dist = Math.hypot(dx, dy);
    if (dist === 0) return { ox: 0, oy: 0 };
    var ratio = Math.min(dist / fall, 1);
    var angle = Math.atan2(dy, dx);
    return {
      ox: Math.cos(angle) * max * ratio,
      oy: Math.sin(angle) * max * ratio,
    };
  }

  /** 把 [0,1) 的随机值映射到 [BLINK_MIN, BLINK_MAX] 的眨眼间隔 */
  function randomBlinkInterval(rand) {
    var r = Math.max(0, Math.min(1, Number(rand) || 0));
    return Math.round(BLINK_MIN + r * (BLINK_MAX - BLINK_MIN));
  }

  var pureApi = {
    pupilOffset: pupilOffset,
    randomBlinkInterval: randomBlinkInterval,
    MAX_OFFSET: MAX_OFFSET,
    FALLOFF: FALLOFF,
    BLINK_MIN: BLINK_MIN,
    BLINK_MAX: BLINK_MAX,
  };

  global.CharacterUtils = pureApi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = pureApi;
  }

  // 无 DOM 环境（Node 单元测试）到此为止
  if (typeof document === "undefined") return;

  /* ---------------- DOM 交互 ---------------- */

  function prefersReducedMotion() {
    return (
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function initCharacter() {
    var svg = document.getElementById("avatar");
    if (!svg) return;

    // 降级：减少动效时保持静态，不绑定任何交互
    if (prefersReducedMotion()) return;

    setupPupils();
    setupWave();
    setupBlink();
  }

  /* --- 瞳孔跟随鼠标 --- */
  function setupPupils() {
    // 仅在真正的鼠标设备上启用；触屏设备瞳孔保持居中
    if (
      typeof matchMedia === "function" &&
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    var eyes = [
      { group: document.getElementById("eyeLeft"), pupil: document.getElementById("pupilLeft"), cx: 0, cy: 0 },
      { group: document.getElementById("eyeRight"), pupil: document.getElementById("pupilRight"), cx: 0, cy: 0 },
    ].filter(function (e) {
      return e.group && e.pupil;
    });
    if (!eyes.length) return;

    var mouseX = 0;
    var mouseY = 0;
    var ticking = false;

    // 缓存每只眼睛在屏幕上的中心坐标；滚动/缩放后需重算
    function recalcCenters() {
      eyes.forEach(function (e) {
        var r = e.group.getBoundingClientRect();
        e.cx = r.left + r.width / 2;
        e.cy = r.top + r.height / 2;
      });
    }

    function update() {
      eyes.forEach(function (e) {
        var off = pupilOffset(mouseX, mouseY, e.cx, e.cy, MAX_OFFSET, FALLOFF);
        // 用 setAttribute 而非 CSS transform，规避 transform-box 的坐标系差异
        e.pupil.setAttribute(
          "transform",
          "translate(" + off.ox.toFixed(2) + ", " + off.oy.toFixed(2) + ")"
        );
      });
      ticking = false;
    }

    window.addEventListener("mousemove", function (ev) {
      mouseX = ev.clientX;
      mouseY = ev.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    });

    window.addEventListener("resize", recalcCenters, { passive: true });
    window.addEventListener("scroll", recalcCenters, { passive: true });
    recalcCenters();
  }

  /* --- 挥手 --- */
  function setupWave() {
    var arm = document.getElementById("armWave");
    var wrap = document.getElementById("avatarWrap");
    if (!arm) return;

    function triggerWave() {
      if (arm.classList.contains("is-waving")) return; // 防抖：进行中忽略
      arm.classList.add("is-waving");
    }

    // 用 animationend 移除类，避免残留导致下次无法触发
    arm.addEventListener("animationend", function () {
      arm.classList.remove("is-waving");
    });

    setTimeout(triggerWave, WAVE_DELAY);

    if (wrap) {
      wrap.addEventListener("mouseenter", triggerWave);
      wrap.addEventListener("click", triggerWave);
      wrap.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          triggerWave();
        }
      });
    }
  }

  /* --- 眨眼：随机间隔递归 setTimeout，后台时暂停 --- */
  function setupBlink() {
    var eyes = [
      document.getElementById("eyeLeft"),
      document.getElementById("eyeRight"),
    ].filter(Boolean);
    if (!eyes.length) return;

    var timer = null;

    function doBlink() {
      eyes.forEach(function (eye) {
        eye.classList.add("is-blinking");
        eye.addEventListener(
          "animationend",
          function handler() {
            eye.classList.remove("is-blinking");
            eye.removeEventListener("animationend", handler);
          }
        );
      });
    }

    function schedule() {
      timer = setTimeout(function () {
        if (!document.hidden) doBlink();
        schedule();
      }, randomBlinkInterval(Math.random()));
    }

    // 页面切到后台时清除定时器，回到前台再恢复，避免无意义计时堆积
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearTimeout(timer);
      } else {
        schedule();
      }
    });

    schedule();
  }

  global.initCharacter = initCharacter;
})(typeof window !== "undefined" ? window : globalThis);
