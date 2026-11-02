# 贡献指南 / Contributing Guide

感谢你愿意为 RetroArcade 贡献力量！🎉

## 提交规范 / Commit Convention

请遵循 Angular 提交规范：

- `feat:` 新增功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `style:` 样式调整
- `test:` 测试相关

示例：`feat: add whack-a-mole game`

## 新增游戏 / Adding a Game

1. 在 `js/games/` 下创建模块，例如 `whackamole.js`
2. 实现 `setup({ mount, hud, sfx, engine })` 接口，返回 `{ destroy() }`
3. 通过 `window.RetroArcade.register({...})` 注册游戏
4. 在 `index.html` 中引入脚本
5. 在 `scripts/build.mjs` 的 `jsFiles` 列表中加入新文件

## 开发流程 / Development Flow

```bash
npm start          # 启动本地服务器
npm test           # 运行单元测试
npm run build      # 构建单文件版本
```

## Pull Request 流程 / PR Process

1. Fork 本仓库并创建特性分支
2. 提交前运行 `npm test` 确保测试通过
3. 发起 PR 并清晰描述改动内容
4. 等待维护者 review 与合并

## 反馈 Bug / Reporting Bugs

请通过 [Issue](https://github.com/gitstq/retroarcade/issues) 提交，包含：

- 浏览器与系统版本
- 复现步骤
- 期望行为与实际行为
