"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..", "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

test("SEO：html lang 为 zh-CN", () => {
  assert.match(html, /<html[^>]*lang="zh-CN"/);
});

test("SEO：包含 viewport / description / theme-color / OG 元信息", () => {
  assert.match(html, /name="viewport"[^>]*width=device-width/);
  assert.match(html, /name="description"/);
  assert.match(html, /name="theme-color"[^>]*prefers-color-scheme: light/);
  assert.match(html, /name="theme-color"[^>]*prefers-color-scheme: dark/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:image"/);
});

test("SEO：提供 SVG favicon", () => {
  assert.match(html, /rel="icon"[^>]*image\/svg\+xml/);
  assert.ok(
    fs.existsSync(path.join(ROOT, "assets", "img", "favicon.svg")),
    "favicon.svg 应存在"
  );
});

test("防 FOUC 内联脚本先于渲染设置 data-theme", () => {
  assert.match(html, /setAttribute\("data-theme"/);
  const headScriptIdx = html.indexOf('setAttribute("data-theme"');
  const bodyIdx = html.indexOf("<body");
  assert.ok(headScriptIdx !== -1 && headScriptIdx < bodyIdx, "内联主题脚本须在 <body> 之前");
});

test("语义化骨架：header / main / footer + 七个锚点章节", () => {
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main[\s>]/);
  assert.match(html, /<footer[\s>]/);
  for (const id of ["hero", "about", "skills", "projects", "timeline", "contact"]) {
    assert.ok(html.includes('id="' + id + '"'), "缺少章节 #" + id);
  }
});

test("静态骨架中的章节标题使用 h2（唯一 h1 由 JS 注入 Hero 姓名）", () => {
  // 关于/技能/作品集/时间线/联系 共 5 个章节标题用 h2；Hero 用 h1
  const h2Count = (html.match(/<h2/g) || []).length;
  assert.ok(h2Count >= 5, "章节标题应为 h2");
  assert.equal((html.match(/<h1/g) || []).length, 0, "静态骨架不应硬编码 h1");
});

test("脚本按依赖顺序引入", () => {
  const order = [
    "data.js",
    "icons.js",
    "theme.js",
    "render.js",
    "character.js",
    "main.js",
  ];
  let last = -1;
  for (const f of order) {
    const idx = html.indexOf("assets/js/" + f);
    assert.ok(idx !== -1, "缺少脚本 " + f);
    assert.ok(idx > last, "脚本顺序错误：" + f);
    last = idx;
  }
});

test("index.html 引用的本地资源均存在", () => {
  const refs = [
    "assets/css/variables.css",
    "assets/css/main.css",
    "assets/css/animations.css",
    "assets/js/data.js",
    "assets/js/icons.js",
    "assets/js/theme.js",
    "assets/js/render.js",
    "assets/js/character.js",
    "assets/js/main.js",
    "assets/img/favicon.svg",
  ];
  for (const r of refs) {
    assert.ok(fs.existsSync(path.join(ROOT, r)), "缺少文件 " + r);
  }
});

test("渲染层：Hero 姓名用 h1，外链带 rel=noopener noreferrer", () => {
  const render = fs.readFileSync(
    path.join(ROOT, "assets", "js", "render.js"),
    "utf8"
  );
  assert.match(render, /<h1 class="hero__name"/);
  // 所有 target=_blank 必须配 rel=noopener noreferrer
  const blanks = render.match(/target="_blank"/g) || [];
  const rels = render.match(/rel="noopener noreferrer"/g) || [];
  assert.ok(blanks.length > 0);
  assert.ok(rels.length >= blanks.length, "存在未配 rel 的 _blank 外链");
});

test("业务样式（main.css）不出现硬编码十六进制颜色", () => {
  const css = fs.readFileSync(
    path.join(ROOT, "assets", "css", "main.css"),
    "utf8"
  );
  const hex = css.match(/#[0-9a-fA-F]{3,6}\b/g) || [];
  assert.equal(hex.length, 0, "main.css 出现硬编码颜色：" + hex.join(", "));
});
