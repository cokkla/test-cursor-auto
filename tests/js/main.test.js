"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { isScrolled, navToggleLabel, countVisible, SCROLL_THRESHOLD } = require(
  path.join(__dirname, "..", "..", "assets", "js", "main.js")
);

test("isScrolled：超过阈值为真", () => {
  assert.equal(isScrolled(0, 80), false);
  assert.equal(isScrolled(80, 80), false);
  assert.equal(isScrolled(81, 80), true);
  assert.equal(isScrolled(500, 80), true);
});

test("SCROLL_THRESHOLD 默认 80", () => {
  assert.equal(SCROLL_THRESHOLD, 80);
});

test("navToggleLabel：随开合状态给出文案", () => {
  assert.equal(navToggleLabel(true), "关闭导航菜单");
  assert.equal(navToggleLabel(false), "打开导航菜单");
});

test("countVisible：all 计入全部", () => {
  assert.equal(countVisible(["llm", "cv", "nlp"], "all"), 3);
});

test("countVisible：具体分类只计匹配项", () => {
  assert.equal(countVisible(["llm", "cv", "llm"], "llm"), 2);
  assert.equal(countVisible(["llm", "cv"], "data"), 0);
});

test("countVisible：非数组安全返回 0", () => {
  assert.equal(countVisible(null, "all"), 0);
  assert.equal(countVisible(undefined, "llm"), 0);
});
