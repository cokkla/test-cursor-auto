"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  profile,
  skillGroups,
  projects,
  projectCategories,
  timeline,
} = require(path.join(__dirname, "..", "..", "assets", "js", "data.js"));

const { ICONS } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "icons.js"
));

test("profile 含全部必需字段", () => {
  const required = [
    "name",
    "age",
    "gender",
    "title",
    "tagline",
    "location",
    "education",
    "email",
    "github",
    "bio",
  ];
  for (const key of required) {
    assert.ok(key in profile, `profile 缺少字段：${key}`);
  }
  assert.equal(profile.gender, "女");
  assert.equal(profile.title, "AI 工程师");
  assert.ok(Array.isArray(profile.keywords));
});

test("skillGroups 恰好 4 组，每组结构完整", () => {
  assert.equal(skillGroups.length, 4);
  for (const group of skillGroups) {
    assert.ok(group.category, "分组缺少 category");
    assert.ok(group.icon, "分组缺少 icon");
    assert.ok(Array.isArray(group.items) && group.items.length > 0);
  }
});

test("每个技能分组的图标都存在于 ICONS 中", () => {
  for (const group of skillGroups) {
    assert.ok(group.icon in ICONS, `图标缺失：${group.icon}`);
  }
});

test("技能 level 必须是 1/2/3 之一", () => {
  for (const group of skillGroups) {
    for (const item of group.items) {
      assert.ok(item.name, "技能条目缺少 name");
      assert.ok([1, 2, 3].includes(item.level), `非法 level：${item.level}`);
    }
  }
});

test("projects：category 合法且 highlight 必填", () => {
  const validCats = ["llm", "cv", "nlp", "data"];
  assert.ok(projects.length > 0);
  const ids = new Set();
  for (const p of projects) {
    assert.ok(p.id, "项目缺少 id");
    assert.ok(!ids.has(p.id), `项目 id 重复：${p.id}`);
    ids.add(p.id);
    assert.ok(validCats.includes(p.category), `非法 category：${p.category}`);
    assert.ok(
      typeof p.highlight === "string" && p.highlight.length > 0,
      `项目 ${p.id} 的 highlight 为必填项`
    );
    assert.ok(Array.isArray(p.tags));
  }
});

test("projectCategories 以 all 开头且覆盖所有项目分类", () => {
  assert.equal(projectCategories[0].value, "all");
  const declared = new Set(projectCategories.map((c) => c.value));
  for (const p of projects) {
    assert.ok(
      declared.has(p.category),
      `项目分类 ${p.category} 未在 projectCategories 中声明`
    );
  }
});

test("timeline：type 仅允许 edu / work", () => {
  for (const item of timeline) {
    assert.ok(["edu", "work"].includes(item.type), `非法 type：${item.type}`);
    assert.ok(item.period && item.org && item.role);
  }
});
