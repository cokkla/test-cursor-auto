"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { hasValue, escapeHtml, skillDots } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "render.js"
));

test("hasValue：仅非空字符串为真", () => {
  assert.equal(hasValue("hi"), true);
  assert.equal(hasValue("  x  "), true);
  assert.equal(hasValue(""), false);
  assert.equal(hasValue("   "), false);
  assert.equal(hasValue(null), false);
  assert.equal(hasValue(undefined), false);
  assert.equal(hasValue(123), false);
});

test("escapeHtml：转义全部危险字符", () => {
  assert.equal(
    escapeHtml('<script>alert("x&y")</script>'),
    "&lt;script&gt;alert(&quot;x&amp;y&quot;)&lt;/script&gt;"
  );
  assert.equal(escapeHtml("it's"), "it&#39;s");
});

test("escapeHtml：null/undefined 返回空串，不出现 undefined", () => {
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
});

test("skillDots：实心圆点数量等于 level", () => {
  const count = (html) => (html.match(/skill-dot--on/g) || []).length;
  assert.equal(count(skillDots(1)), 1);
  assert.equal(count(skillDots(2)), 2);
  assert.equal(count(skillDots(3)), 3);
});

test("skillDots：始终渲染 3 个圆点", () => {
  const total = (html) => (html.match(/skill-dot/g) || []).length;
  // 每个圆点 class 至少含一次 "skill-dot"，实心的含两次（skill-dot 与 skill-dot--on 中的子串）
  // 因此用更精确的方式：统计 <span 数量
  const spans = (html) => (html.match(/<span/g) || []).length;
  assert.equal(spans(skillDots(0)), 3);
  assert.equal(spans(skillDots(3)), 3);
});

test("skillDots：越界 level 被夹紧到 0~3", () => {
  const count = (html) => (html.match(/skill-dot--on/g) || []).length;
  assert.equal(count(skillDots(5)), 3);
  assert.equal(count(skillDots(-2)), 0);
  assert.equal(count(skillDots(NaN)), 0);
});
