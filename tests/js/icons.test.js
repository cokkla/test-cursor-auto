"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { ICONS } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "icons.js"
));

// 站点各处实际用到的图标键，缺任意一个都会导致渲染出空图标
const REQUIRED_KEYS = [
  "sun",
  "moon",
  "brain",
  "sparkles",
  "code",
  "server",
  "user",
  "calendar",
  "gender",
  "location",
  "education",
  "mail",
  "github",
  "briefcase",
  "book",
  "wechat",
  "download",
  "externalLink",
  "arrowDown",
  "menu",
  "close",
  "inbox",
];

test("ICONS 包含全部必需的图标键", () => {
  for (const key of REQUIRED_KEYS) {
    assert.ok(key in ICONS, `缺少图标：${key}`);
  }
});

test("每个图标都是合法的非空 SVG 字符串", () => {
  for (const [key, value] of Object.entries(ICONS)) {
    assert.equal(typeof value, "string", `${key} 应为字符串`);
    assert.ok(value.includes("<svg"), `${key} 缺少 <svg 起始标签`);
    assert.ok(value.trim().endsWith("</svg>"), `${key} 缺少 </svg> 结束标签`);
  }
});

test("图标使用 currentColor，以便继承文字颜色响应主题", () => {
  for (const [key, value] of Object.entries(ICONS)) {
    assert.ok(
      value.includes("currentColor"),
      `${key} 未使用 currentColor`
    );
  }
});

test("图标不写死 fill 颜色（除 none 外）", () => {
  for (const [key, value] of Object.entries(ICONS)) {
    assert.ok(
      !/fill="#/.test(value),
      `${key} 出现了硬编码的 fill 颜色`
    );
  }
});
