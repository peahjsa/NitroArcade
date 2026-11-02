<div align="center">

# 🕹️ RetroArcade · 复古街机游戏合集

**零依赖 · 离线可用 · 纯前端经典游戏合集**

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Zero Dependency](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![Offline](https://img.shields.io/badge/offline-ready-yes-orange.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop%20%7C%20Mobile-lightgrey.svg)

</div>

---

## 🎉 项目介绍

RetroArcade 是一款**零依赖、可离线运行**的复古街机游戏合集，内置 6 款经典游戏：贪吃蛇、俄罗斯方块、打砖块、乒乓对战、扫雷与 2048。所有游戏均使用原生 HTML5 Canvas 与 JavaScript 编写，**无需安装任何依赖、无需联网、无需后端服务**，打开浏览器即可畅玩。

**解决的用户痛点：**
- 😫 想玩经典小游戏却要下载 App、注册账号、忍受广告
- 😫 在线小游戏网站依赖网络、加载缓慢、隐私难保障
- 😫 开发者想找零依赖、可二次开发的游戏源码作为学习参考

**自研差异化亮点：**
- ✨ **100% 原生实现**：无框架、无构建依赖、无 CDN，单文件构建仅约 65KB
- ✨ **复古 CRT 美学**：扫描线、霓虹光效、像素风渲染，还原街机厅氛围
- ✨ **本地最高分**：成绩通过 localStorage 保存，隐私安全、离线可用
- ✨ **键盘 + 触屏双支持**：桌面键盘操作，移动端滑动/按钮均可
- ✨ **WebAudio 合成音效**：零音频资源，全部音效实时合成

---

## ✨ 核心特性

| 特性 | 说明 |
| --- | --- |
| 🐍 **贪吃蛇** | 经典玩法，吃光点变长，速度随得分提升 |
| 🧱 **俄罗斯方块** | 七种方块旋转堆叠，消除行数越多得分越高 |
| 🏓 **乒乓对战** | 人机对战，AI 反应灵敏，先得 7 分获胜 |
| 💣 **扫雷** | 12×12 网格 18 颗雷，左键翻开右键插旗 |
| 🔢 **2048** | 合并相同数字，冲击 2048 与更高纪录 |
| 🎮 **统一引擎** | 共享游戏循环、输入、音效与存档模块 |
| 📱 **响应式布局** | 桌面与移动端自适应，触屏滑动操作 |
| 🔊 **合成音效** | WebAudio 实时合成，可一键静音 |

---

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome / Edge / Firefox / Safari 任一即可）
- 可选：Node.js ≥ 18（用于本地服务器与构建）

### 方式一：直接打开（零安装）

克隆或下载本项目后，直接用浏览器打开 `index.html` 即可游玩。

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
# 双击 index.html 或拖入浏览器即可
```

### 方式二：本地服务器（推荐）

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
npm start          # 启动本地服务器，默认 http://localhost:8080
```

### 方式三：在线体验

直接访问 GitHub Pages 或任意静态托管即可，无需任何配置。

---

## 📖 详细使用指南

### 游戏操作一览

| 游戏 | 键盘操作 | 触屏操作 |
| --- | --- | --- |
| 贪吃蛇 | 方向键移动 · 空格暂停 | 滑动方向 · 按钮控制 |
| 俄罗斯方块 | ←→ 移动 · ↑ 旋转 · ↓ 加速 · 空格硬降 | 按钮控制 |
| 打砖块 | ←→ 移动挡板 · 空格暂停 | 按钮控制 |
| 乒乓对战 | ↑↓ 移动球拍 · 空格暂停 | 按钮控制 |
| 扫雷 | 鼠标左键翻开 · 右键插旗 | 点击翻开 · 长按插旗 |
| 2048 | 方向键合并 · 空格暂停 | 滑动合并 |

### 最高分与音效

- 每款游戏的最高分自动保存在浏览器 `localStorage` 中，刷新页面不丢失
- 右上角 🔊 按钮可随时开关音效
- 菜单页展示全部游戏累计最高分

### 构建单文件版本

```bash
npm run build     # 生成 dist/index.html 单文件版本（约 65KB）
npm run preview   # 构建并预览单文件版本
```

单文件版本适合离线分发、U 盘携带或嵌入其他页面。

### 运行测试

```bash
npm test          # 运行引擎单元测试
```

---

## 💡 设计思路与迭代规划

### 设计理念

- **极简主义**：坚持零依赖原则，所有功能用原生 Web API 实现，保证可移植性与可维护性
- **模块化架构**：共享引擎（`engine.js`）负责游戏注册、循环、输入、音效与存档，各游戏独立成模块，新增游戏只需实现 `setup` 接口
- **复古美学**：CRT 扫描线、霓虹光晕、像素渲染，在视觉上还原街机厅的沉浸感

### 迭代规划

- [ ] 新增更多经典游戏（打地鼠、记忆翻牌、赛车等）
- [ ] 支持游戏手柄（Gamepad API）
- [ ] 双人对战模式（本地热座）
- [ ] 成就系统与徽章
- [ ] PWA 支持，可安装到桌面

### 社区贡献方向

欢迎提交新游戏、优化 AI 难度、改进视觉特效或修复 Bug，详见 [贡献指南](CONTRIBUTING.md)。

---

## 📦 打包与部署指南

本项目为**纯前端网页应用**，部署方式极其灵活：

| 方式 | 步骤 |
| --- | --- |
| GitHub Pages | 仓库 Settings → Pages → 选择 main 分支即可 |
| 任意静态托管 | 上传全部文件到 Nginx / Vercel / Netlify 等 |
| 单文件分发 | `npm run build` 后分发 `dist/index.html` |
| 本地离线 | 直接双击 `index.html` 打开 |

**兼容环境：** 所有支持 HTML5 Canvas 与 WebAudio 的现代浏览器，Windows / macOS / Linux / Android / iOS 均可。

---

## 🤝 贡献指南

1. Fork 本仓库并创建特性分支
2. 提交信息遵循 Angular 规范：`feat:` / `fix:` / `docs:` / `refactor:`
3. 新增游戏请在 `js/games/` 下创建模块并在 `index.html` 中引入
4. 提交前运行 `npm test` 确保测试通过
5. 发起 Pull Request 并描述改动内容

发现 Bug 或有建议？欢迎提交 [Issue](https://github.com/gitstq/retroarcade/issues)。

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源，可自由使用、修改与商用，保留版权声明即可。

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎 Star 支持！**

</div>
