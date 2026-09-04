/* ==========================================================
 * render.js —— 依据 data.js 渲染各章节 DOM
 * 纯工具函数集中在顶部并导出，DOM 渲染函数按章节拆分。
 * 约定：凡插入来自数据的文本，一律先经 escapeHtml 转义，
 * 防止内容里的尖括号破坏结构或引入 XSS。
 * ========================================================== */

(function (global) {
  "use strict";

  /* ---------------- 纯工具函数（可单元测试） ---------------- */

  /** 判断是否为“有内容”的非空字符串（去除首尾空白后仍非空） */
  function hasValue(v) {
    return typeof v === "string" && v.trim().length > 0;
  }

  /** HTML 转义，防止数据中的特殊字符破坏结构 */
  function escapeHtml(v) {
    if (v === null || v === undefined) return "";
    return String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** 生成技能熟练度三档圆点的 HTML，实心数量 = level（1~3） */
  function skillDots(level) {
    var n = Math.max(0, Math.min(3, Number(level) || 0));
    var dots = "";
    for (var i = 1; i <= 3; i++) {
      var cls = i <= n ? "skill-dot skill-dot--on" : "skill-dot";
      dots += '<span class="' + cls + '" aria-hidden="true"></span>';
    }
    return dots;
  }

  /** 图标取值，键不存在时返回空串（不抛错、不渲染 undefined） */
  function icon(name) {
    var dict = global.ICONS || {};
    return dict[name] || "";
  }

  /** 标签裁剪：最多展示 max 个，其余折叠为 +N */
  function clampTags(tags, max) {
    var limit = max || 5;
    var list = Array.isArray(tags) ? tags.filter(hasValue) : [];
    return {
      shown: list.slice(0, limit),
      extra: Math.max(0, list.length - limit),
    };
  }

  /** 分类匹配：all 命中全部，否则要求分类相等 */
  function matchesCategory(cardCategory, selected) {
    return selected === "all" || cardCategory === selected;
  }

  /* ---------------- DOM 渲染：Hero + 关于我 ---------------- */

  function renderProfile() {
    renderHeroText();
    renderAbout();
  }

  function renderHeroText() {
    var host = document.querySelector("[data-hero-text]");
    if (!host || typeof profile === "undefined") return;

    var social = "";
    if (hasValue(profile.github)) {
      social +=
        '<a class="hero__social-link" href="' +
        escapeHtml(profile.github) +
        '" target="_blank" rel="noopener noreferrer" aria-label="GitHub">' +
        icon("github") +
        "</a>";
    }
    if (hasValue(profile.email)) {
      social +=
        '<a class="hero__social-link" href="mailto:' +
        escapeHtml(profile.email) +
        '" aria-label="邮箱">' +
        icon("mail") +
        "</a>";
    }

    var resumeBtn = hasValue(profile.resume)
      ? '<a class="btn btn--ghost" href="' +
        escapeHtml(profile.resume) +
        '" download>' +
        icon("download") +
        "<span>下载简历</span></a>"
      : "";

    var englishName = hasValue(profile.englishName)
      ? '<span class="hero__english">' + escapeHtml(profile.englishName) + "</span>"
      : "";

    host.innerHTML =
      '<p class="hero__greeting">👋 你好，我是</p>' +
      '<h1 class="hero__name">' +
      escapeHtml(profile.name) +
      englishName +
      "</h1>" +
      '<p class="hero__role"><span class="hero__role-mark">' +
      escapeHtml(profile.title) +
      "</span></p>" +
      '<p class="hero__tagline">' +
      escapeHtml(profile.tagline) +
      "</p>" +
      '<div class="hero__cta">' +
      '<a class="btn btn--primary" href="#projects">查看作品集</a>' +
      resumeBtn +
      "</div>" +
      '<div class="hero__social">' +
      social +
      "</div>";
  }

  function renderAbout() {
    var host = document.querySelector("[data-about]");
    if (!host || typeof profile === "undefined") return;

    // 关键词标签
    var keywords = "";
    if (Array.isArray(profile.keywords) && profile.keywords.length) {
      keywords =
        '<ul class="about__keywords">' +
        profile.keywords
          .filter(hasValue)
          .map(function (k) {
            return '<li class="tag">' + escapeHtml(k) + "</li>";
          })
          .join("") +
        "</ul>";
    }

    // 基本信息卡片：字段名 / 图标 / 值（可选字段为空则跳过）
    var infoDefs = [
      { icon: "user", label: "姓名", value: profile.name },
      {
        icon: "calendar",
        label: "年龄",
        value: hasValue(profile.age) ? profile.age + " 岁" : "",
      },
      { icon: "gender", label: "性别", value: profile.gender },
      { icon: "location", label: "所在城市", value: profile.location },
      { icon: "education", label: "学历专业", value: profile.education },
      {
        icon: "mail",
        label: "邮箱",
        value: profile.email,
        href: hasValue(profile.email) ? "mailto:" + profile.email : "",
      },
      {
        icon: "github",
        label: "GitHub",
        value: profile.github,
        href: profile.github,
        external: true,
      },
      { icon: "briefcase", label: "求职状态", value: profile.jobStatus },
    ];

    var cards = infoDefs
      .filter(function (d) {
        return hasValue(d.value);
      })
      .map(function (d) {
        var valueHtml;
        if (hasValue(d.href)) {
          var attrs = d.external
            ? ' target="_blank" rel="noopener noreferrer"'
            : "";
          valueHtml =
            '<a class="info-card__value" href="' +
            escapeHtml(d.href) +
            '"' +
            attrs +
            ">" +
            escapeHtml(d.value) +
            "</a>";
        } else {
          valueHtml =
            '<span class="info-card__value">' + escapeHtml(d.value) + "</span>";
        }
        return (
          '<li class="info-card">' +
          '<span class="info-card__icon" aria-hidden="true">' +
          icon(d.icon) +
          "</span>" +
          '<span class="info-card__body">' +
          '<span class="info-card__label">' +
          escapeHtml(d.label) +
          "</span>" +
          valueHtml +
          "</span>" +
          "</li>"
        );
      })
      .join("");

    host.innerHTML =
      '<div class="about__intro">' +
      '<p class="about__bio">' +
      escapeHtml(profile.bio) +
      "</p>" +
      keywords +
      "</div>" +
      '<ul class="about__info">' +
      cards +
      "</ul>";
  }

  /* ---------------- DOM 渲染：专业技能 ---------------- */

  function renderSkills() {
    var host = document.querySelector("[data-skills]");
    if (!host || typeof skillGroups === "undefined" || !skillGroups.length) {
      if (host) host.closest(".section").hidden = true;
      return;
    }

    host.innerHTML = skillGroups
      .map(function (group) {
        var items = group.items
          .map(function (item) {
            return (
              '<li class="skill-item">' +
              '<span class="skill-item__name">' +
              escapeHtml(item.name) +
              "</span>" +
              '<span class="skill-item__dots" role="img" aria-label="熟练度 ' +
              (Number(item.level) || 0) +
              ' / 3">' +
              skillDots(item.level) +
              "</span>" +
              "</li>"
            );
          })
          .join("");

        return (
          '<article class="skill-card">' +
          '<header class="skill-card__head">' +
          '<span class="skill-card__icon" aria-hidden="true">' +
          icon(group.icon) +
          "</span>" +
          '<h3 class="skill-card__title">' +
          escapeHtml(group.category) +
          "</h3>" +
          "</header>" +
          '<ul class="skill-card__list">' +
          items +
          "</ul>" +
          "</article>"
        );
      })
      .join("");

    // 图例：说明三档圆点含义
    var legend = document.querySelector("[data-skills-legend]");
    if (legend) {
      legend.innerHTML =
        '<span class="skill-legend__item">' +
        skillDots(3) +
        " 熟练</span>" +
        '<span class="skill-legend__item">' +
        skillDots(2) +
        " 掌握</span>" +
        '<span class="skill-legend__item">' +
        skillDots(1) +
        " 了解</span>";
    }
  }

  /* ---------------- DOM 渲染：作品集 ---------------- */

  function renderProjects() {
    renderProjectFilters();
    renderProjectCards();
  }

  function renderProjectFilters() {
    var host = document.querySelector("[data-project-filters]");
    if (
      !host ||
      typeof projectCategories === "undefined" ||
      !projectCategories.length
    ) {
      return;
    }

    host.innerHTML = projectCategories
      .map(function (cat, idx) {
        var active = idx === 0; // 默认选中「全部」
        return (
          '<button type="button" class="filter-btn' +
          (active ? " is-active" : "") +
          '" data-filter="' +
          escapeHtml(cat.value) +
          '" aria-pressed="' +
          (active ? "true" : "false") +
          '">' +
          escapeHtml(cat.label) +
          "</button>"
        );
      })
      .join("");
  }

  function renderProjectCards() {
    var host = document.querySelector("[data-projects]");
    if (!host || typeof projects === "undefined") return;

    host.innerHTML = projects
      .map(function (p) {
        // 封面：有图用 img，无图用「主色→薄荷绿」渐变 + 项目名首字兜底
        var cover;
        if (hasValue(p.cover)) {
          cover =
            '<img class="project-card__cover-img" src="' +
            escapeHtml(p.cover) +
            '" alt="' +
            escapeHtml(p.title) +
            '" loading="lazy" decoding="async" width="1600" height="900" />';
        } else {
          var initial = hasValue(p.title) ? p.title.trim().charAt(0) : "·";
          cover =
            '<span class="project-card__cover-fallback" aria-hidden="true">' +
            escapeHtml(initial) +
            "</span>";
        }

        // 量化亮点为必填项，缺失时给出控制台警告并占位
        if (!hasValue(p.highlight)) {
          if (global.console && console.warn) {
            console.warn("[projects] 项目 " + p.id + " 缺少必填的量化亮点 highlight");
          }
        }
        var highlight = hasValue(p.highlight)
          ? '<p class="project-card__highlight">' +
            escapeHtml(p.highlight) +
            "</p>"
          : "";

        // 标签：最多 5 个，超出显示 +N
        var clamped = clampTags(p.tags, 5);
        var tags =
          '<ul class="project-card__tags">' +
          clamped.shown
            .map(function (t) {
              return '<li class="project-card__tag">' + escapeHtml(t) + "</li>";
            })
            .join("") +
          (clamped.extra > 0
            ? '<li class="project-card__tag project-card__tag--more">+' +
              clamped.extra +
              "</li>"
            : "") +
          "</ul>";

        // 底部链接：为空则隐藏对应按钮，而不是渲染死链
        var links = "";
        if (hasValue(p.repo)) {
          links +=
            '<a class="project-card__link" href="' +
            escapeHtml(p.repo) +
            '" target="_blank" rel="noopener noreferrer">' +
            icon("github") +
            "<span>GitHub 仓库</span></a>";
        }
        if (hasValue(p.demo)) {
          links +=
            '<a class="project-card__link" href="' +
            escapeHtml(p.demo) +
            '" target="_blank" rel="noopener noreferrer">' +
            icon("externalLink") +
            "<span>在线 Demo</span></a>";
        }
        var linksHtml = links
          ? '<div class="project-card__links">' + links + "</div>"
          : "";

        return (
          '<article class="project-card" data-category="' +
          escapeHtml(p.category) +
          '">' +
          '<div class="project-card__cover">' +
          cover +
          "</div>" +
          '<div class="project-card__body">' +
          '<h3 class="project-card__title">' +
          escapeHtml(p.title) +
          "</h3>" +
          '<p class="project-card__summary">' +
          escapeHtml(p.summary) +
          "</p>" +
          highlight +
          tags +
          linksHtml +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------------- 导出 ---------------- */

  global.renderProfile = renderProfile;
  global.renderSkills = renderSkills;
  global.renderProjects = renderProjects;

  // 纯工具函数挂命名空间，供其它模块与测试引用
  global.RenderUtils = {
    hasValue: hasValue,
    escapeHtml: escapeHtml,
    skillDots: skillDots,
    clampTags: clampTags,
    matchesCategory: matchesCategory,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.RenderUtils;
  }
})(typeof window !== "undefined" ? window : globalThis);
