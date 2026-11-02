/**
 * RetroArcade 引擎单元测试
 * 运行: node --test tests/
 */
import { test } from "node:test";
import assert from "node:assert/strict";

// 加载引擎（Node 环境）
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const engine = require("../js/engine.js");

test("引擎已导出核心 API", () => {
  assert.ok(engine.register);
  assert.ok(engine.list);
  assert.ok(engine.get);
  assert.ok(engine.bestScore);
  assert.ok(engine.saveScore);
  assert.ok(engine.randInt);
});

test("register 会拒绝无效游戏定义", () => {
  assert.throws(() => engine.register({}));
  assert.throws(() => engine.register({ id: "x" }));
});

test("randInt 在闭区间内生成随机数", () => {
  for (let i = 0; i < 200; i++) {
    const v = engine.randInt(1, 6);
    assert.ok(v >= 1 && v <= 6);
  }
});

test("saveScore 仅保留最高分", () => {
  const id = "test-save-" + Date.now();
  assert.equal(engine.bestScore(id), 0);
  assert.equal(engine.saveScore(id, 100), true);
  assert.equal(engine.saveScore(id, 50), false);
  assert.equal(engine.bestScore(id), 100);
  assert.equal(engine.saveScore(id, 200), true);
  assert.equal(engine.bestScore(id), 200);
});
