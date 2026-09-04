"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { timelineIcon } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "render.js"
));

const { timeline } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "data.js"
));

const { ICONS } = require(path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "js",
  "icons.js"
));

test("timelineIcon：教育用 book，工作用 briefcase", () => {
  assert.equal(timelineIcon("edu"), "book");
  assert.equal(timelineIcon("work"), "briefcase");
});

test("timelineIcon：未知类型回退为 briefcase", () => {
  assert.equal(timelineIcon("other"), "briefcase");
});

test("时间线每个条目的图标都存在于 ICONS 中", () => {
  for (const item of timeline) {
    assert.ok(timelineIcon(item.type) in ICONS);
  }
});
