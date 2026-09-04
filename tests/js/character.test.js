"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  pupilOffset,
  randomBlinkInterval,
  MAX_OFFSET,
  BLINK_MIN,
  BLINK_MAX,
} = require(path.join(__dirname, "..", "..", "assets", "js", "character.js"));

test("pupilOffset：鼠标在眼心时无位移", () => {
  const o = pupilOffset(100, 100, 100, 100);
  assert.equal(o.ox, 0);
  assert.equal(o.oy, 0);
});

test("pupilOffset：位移大小恒不超过 MAX_OFFSET", () => {
  const samples = [
    [1000, 1000],
    [-1000, 500],
    [0, -800],
    [50, 50],
    [300, -20],
  ];
  for (const [mx, my] of samples) {
    const o = pupilOffset(mx, my, 100, 100, MAX_OFFSET, 160);
    const mag = Math.hypot(o.ox, o.oy);
    assert.ok(mag <= MAX_OFFSET + 1e-9, `位移 ${mag} 超过上限 ${MAX_OFFSET}`);
  }
});

test("pupilOffset：远距离时达到（接近）上限", () => {
  const o = pupilOffset(1000, 100, 100, 100, MAX_OFFSET, 160);
  const mag = Math.hypot(o.ox, o.oy);
  assert.ok(mag > MAX_OFFSET - 1e-9);
});

test("pupilOffset：方向正确（鼠标在右→向右，在下→向下）", () => {
  const right = pupilOffset(200, 100, 100, 100, MAX_OFFSET, 160);
  assert.ok(right.ox > 0);
  assert.ok(Math.abs(right.oy) < 1e-9);

  const down = pupilOffset(100, 200, 100, 100, MAX_OFFSET, 160);
  assert.ok(down.oy > 0);
  assert.ok(Math.abs(down.ox) < 1e-9);
});

test("randomBlinkInterval：落在 [BLINK_MIN, BLINK_MAX] 区间", () => {
  assert.equal(randomBlinkInterval(0), BLINK_MIN);
  assert.equal(randomBlinkInterval(1), BLINK_MAX);
  const mid = randomBlinkInterval(0.5);
  assert.ok(mid >= BLINK_MIN && mid <= BLINK_MAX);
});

test("randomBlinkInterval：越界输入被夹紧", () => {
  assert.equal(randomBlinkInterval(-5), BLINK_MIN);
  assert.equal(randomBlinkInterval(9), BLINK_MAX);
});
