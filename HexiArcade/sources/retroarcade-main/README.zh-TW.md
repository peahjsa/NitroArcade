<div align="center">

# 🕹️ RetroArcade · 復古街機遊戲合集

**零依賴 · 離線可用 · 純前端經典遊戲合集**

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Zero Dependency](https://img.shields.io/badge/dependencies-0-brightgreen.svg)
![Offline](https://img.shields.io/badge/offline-ready-yes-orange.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Desktop%20%7C%20Mobile-lightgrey.svg)

</div>

---

## 🎉 專案介紹

RetroArcade 是一款**零依賴、可離線執行**的復古街機遊戲合集，內建 6 款經典遊戲：貪吃蛇、俄羅斯方塊、打磚塊、乒乓對戰、踩地雷與 2048。所有遊戲皆以原生 HTML5 Canvas 與 JavaScript 撰寫，**無需安裝任何依賴、無需連網、無需後端服務**，開啟瀏覽器即可暢玩。

**解決的使用者痛點：**
- 😫 想玩經典小遊戲卻要下載 App、註冊帳號、忍受廣告
- 😫 線上小遊戲網站依賴網路、載入緩慢、隱私難保障
- 😫 開發者想找零依賴、可二次開發的遊戲原始碼作為學習參考

**自研差異化亮點：**
- ✨ **100% 原生實作**：無框架、無建置依賴、無 CDN，單檔建置僅約 65KB
- ✨ **復古 CRT 美學**：掃描線、霓虹光效、像素風渲染，還原街機廳氛圍
- ✨ **本地最高分**：成績透過 localStorage 儲存，隱私安全、離線可用
- ✨ **鍵盤 + 觸控雙支援**：桌面鍵盤操作，行動端滑動/按鈕皆可
- ✨ **WebAudio 合成音效**：零音訊資源，全部音效即時合成

---

## ✨ 核心特性

| 特性 | 說明 |
| --- | --- |
| 🐍 **貪吃蛇** | 經典玩法，吃光點變長，速度隨得分提升 |
| 🧱 **俄羅斯方塊** | 七種方塊旋轉堆疊，消除行數越多得分越高 |
| 🏓 **乒乓對戰** | 人機對戰，AI 反應靈敏，先得 7 分獲勝 |
| 💣 **踩地雷** | 12×12 網格 18 顆地雷，左鍵翻開右鍵插旗 |
| 🔢 **2048** | 合併相同數字，衝擊 2048 與更高紀錄 |
| 🎮 **統一引擎** | 共享遊戲迴圈、輸入、音效與存檔模組 |
| 📱 **響應式版面** | 桌面與行動端自適應，觸控滑動操作 |
| 🔊 **合成音效** | WebAudio 即時合成，可一鍵靜音 |

---

## 🚀 快速開始

### 環境需求

- 現代瀏覽器（Chrome / Edge / Firefox / Safari 任一即可）
- 選用：Node.js ≥ 18（用於本地伺服器與建置）

### 方式一：直接開啟（零安裝）

複製或下載本專案後，直接用瀏覽器開啟 `index.html` 即可遊玩。

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
# 雙擊 index.html 或拖入瀏覽器即可
```

### 方式二：本地伺服器（推薦）

```bash
git clone https://github.com/gitstq/retroarcade.git
cd retroarcade
npm start          # 啟動本地伺服器，預設 http://localhost:8080
```

### 方式三：線上體驗

直接存取 GitHub Pages 或任意靜態託管即可，無需任何設定。

---

## 📖 詳細使用指南

### 遊戲操作一覽

| 遊戲 | 鍵盤操作 | 觸控操作 |
| --- | --- | --- |
| 貪吃蛇 | 方向鍵移動 · 空白鍵暫停 | 滑動方向 · 按鈕控制 |
| 俄羅斯方塊 | ←→ 移動 · ↑ 旋轉 · ↓ 加速 · 空白鍵硬降 | 按鈕控制 |
| 打磚塊 | ←→ 移動擋板 · 空白鍵暫停 | 按鈕控制 |
| 乒乓對戰 | ↑↓ 移動球拍 · 空白鍵暫停 | 按鈕控制 |
| 踩地雷 | 滑鼠左鍵翻開 · 右鍵插旗 | 點擊翻開 · 長按插旗 |
| 2048 | 方向鍵合併 · 空白鍵暫停 | 滑動合併 |

### 最高分與音效

- 每款遊戲的最高分自動儲存在瀏覽器 `localStorage` 中，重新整理頁面不遺失
- 右上角 🔊 按鈕可隨時切換音效
- 選單頁展示全部遊戲累計最高分

### 建置單檔版本

```bash
npm run build     # 產生 dist/index.html 單檔版本（約 65KB）
npm run preview   # 建置並預覽單檔版本
```

單檔版本適合離線分發、隨身碟攜帶或嵌入其他頁面。

### 執行測試

```bash
npm test          # 執行引擎單元測試
```

---

## 💡 設計思路與迭代規劃

### 設計理念

- **極簡主義**：堅持零依賴原則，所有功能以原生 Web API 實作，保證可攜性與可維護性
- **模組化架構**：共享引擎（`engine.js`）負責遊戲註冊、迴圈、輸入、音效與存檔，各遊戲獨立成模組，新增遊戲只需實作 `setup` 介面
- **復古美學**：CRT 掃描線、霓虹光暈、像素渲染，在視覺上還原街機廳的沉浸感

### 迭代規劃

- [ ] 新增更多經典遊戲（打地鼠、記憶翻牌、賽車等）
- [ ] 支援遊戲手把（Gamepad API）
- [ ] 雙人對戰模式（本地熱座）
- [ ] 成就系統與徽章
- [ ] PWA 支援，可安裝到桌面

### 社群貢獻方向

歡迎提交新遊戲、最佳化 AI 難度、改進視覺特效或修復 Bug，詳見 [貢獻指南](CONTRIBUTING.md)。

---

## 📦 打包與部署指南

本專案為**純前端網頁應用**，部署方式極具彈性：

| 方式 | 步驟 |
| --- | --- |
| GitHub Pages | 倉庫 Settings → Pages → 選擇 main 分支即可 |
| 任意靜態託管 | 上傳全部檔案到 Nginx / Vercel / Netlify 等 |
| 單檔分發 | `npm run build` 後分發 `dist/index.html` |
| 本地離線 | 直接雙擊 `index.html` 開啟 |

**相容環境：** 所有支援 HTML5 Canvas 與 WebAudio 的現代瀏覽器，Windows / macOS / Linux / Android / iOS 皆可。

---

## 🤝 貢獻指南

1. Fork 本倉庫並建立特性分支
2. 提交訊息遵循 Angular 規範：`feat:` / `fix:` / `docs:` / `refactor:`
3. 新增遊戲請在 `js/games/` 下建立模組並在 `index.html` 中引入
4. 提交前執行 `npm test` 確保測試通過
5. 發起 Pull Request 並描述改動內容

發現 Bug 或有建議？歡迎提交 [Issue](https://github.com/gitstq/retroarcade/issues)。

---

## 📄 開源協議

本專案基於 [MIT License](LICENSE) 開源，可自由使用、修改與商用，保留版權聲明即可。

<div align="center">

**⭐ 如果這個專案對你有幫助，歡迎 Star 支持！**

</div>
