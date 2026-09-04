"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  THEME_STORAGE_KEY,
  THEMES,
  resolveInitialTheme,
  nextTheme,
  themeToggleLabel,
} = require(path.join(__dirname, "..", "..", "assets", "js", "theme.js"));

test("resolveInitialTheme：已存储的值优先", () => {
  assert.equal(resolveInitialTheme("dark", false), "dark");
  assert.equal(resolveInitialTheme("light", true), "light");
});

test("resolveInitialTheme：无存储时跟随系统偏好", () => {
  assert.equal(resolveInitialTheme(null, true), "dark");
  assert.equal(resolveInitialTheme(null, false), "light");
  assert.equal(resolveInitialTheme(undefined, true), "dark");
});

test("resolveInitialTheme：非法存储值按系统偏好回退", () => {
  assert.equal(resolveInitialTheme("purple", true), "dark");
  assert.equal(resolveInitialTheme("", false), "light");
});

test("nextTheme：在亮暗之间切换", () => {
  assert.equal(nextTheme("dark"), "light");
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("anything-else"), "dark");
});

test("themeToggleLabel：描述点击后要切到的主题", () => {
  assert.equal(themeToggleLabel("dark"), "切换到亮色主题");
  assert.equal(themeToggleLabel("light"), "切换到暗色主题");
});

test("常量定义正确", () => {
  assert.equal(THEME_STORAGE_KEY, "site-theme");
  assert.deepEqual(THEMES, { LIGHT: "light", DARK: "dark" });
});
