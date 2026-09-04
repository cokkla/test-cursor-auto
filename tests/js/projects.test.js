"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { clampTags, matchesCategory } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "render.js"
));

const { projects } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "data.js"
));

test("clampTags：不超过上限时全部展示，extra 为 0", () => {
  const r = clampTags(["a", "b", "c"], 5);
  assert.deepEqual(r.shown, ["a", "b", "c"]);
  assert.equal(r.extra, 0);
});

test("clampTags：超出上限时折叠为 +N", () => {
  const r = clampTags(["a", "b", "c", "d", "e", "f", "g"], 5);
  assert.equal(r.shown.length, 5);
  assert.equal(r.extra, 2);
});

test("clampTags：过滤空值后再计数", () => {
  const r = clampTags(["a", "", "  ", "b"], 5);
  assert.deepEqual(r.shown, ["a", "b"]);
  assert.equal(r.extra, 0);
});

test("clampTags：非数组输入安全返回空", () => {
  assert.deepEqual(clampTags(null), { shown: [], extra: 0 });
  assert.deepEqual(clampTags(undefined), { shown: [], extra: 0 });
});

test("matchesCategory：all 命中全部", () => {
  assert.equal(matchesCategory("llm", "all"), true);
  assert.equal(matchesCategory("cv", "all"), true);
});

test("matchesCategory：具体分类要求相等", () => {
  assert.equal(matchesCategory("llm", "llm"), true);
  assert.equal(matchesCategory("llm", "cv"), false);
});

test("按分类筛选真实数据：all 返回全部，具体分类为子集", () => {
  const all = projects.filter((p) => matchesCategory(p.category, "all"));
  assert.equal(all.length, projects.length);

  const llm = projects.filter((p) => matchesCategory(p.category, "llm"));
  assert.ok(llm.length >= 1);
  assert.ok(llm.every((p) => p.category === "llm"));
});

test("筛选出不存在的分类得到空结果（触发空状态的前提）", () => {
  const none = projects.filter((p) => matchesCategory(p.category, "__none__"));
  assert.equal(none.length, 0);
});
