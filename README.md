# AI 工程师 · 个人主页

一个面向求职展示的单页个人网站：纯静态 `HTML + CSS + 原生 JavaScript`，**零依赖、零构建**，含一个手绘风格、可交互的 SVG 漫画形象与亮 / 暗双主题。

## 特性

- 温馨小清新风格，亮 / 暗双主题（跟随系统偏好，切换记忆到 `localStorage`）
- 手写内联 SVG 漫画形象：瞳孔跟随鼠标、挥手、眨眼、呼吸浮动、随主题切换的装饰
- 七个章节：首屏 Hero、关于我、专业技能、作品集（带分类筛选）、经历时间线、联系我、页脚
- 全部个人内容集中在 `assets/js/data.js` 一个文件，修改内容无需改动 HTML / CSS
- 响应式（375 / 768 / 1024 / 1440）、无障碍（语义标签、键盘可达、`prefers-reduced-motion` 降级）

## 本地预览

无需安装任何依赖，二选一：

- 直接**双击 `index.html`** 用浏览器打开（脚本采用传统 `<script>` 顺序引入，支持 `file://` 协议）
- 或起一个本地静态服务器（推荐，二维码 / 简历等相对资源更稳定）：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 修改内容

打开 `assets/js/data.js`，搜索 `{{` 即可定位全部待填占位符（姓名、年龄、标语、技能、项目、经历等），照示例格式增删即可，无需理解任何 HTML 结构。

- 可选字段留空字符串 `""`，渲染层会自动隐藏对应元素
- 作品集每张卡的 `highlight`（量化亮点）为必填项
- 替换 `assets/img/wechat-qr.png`（微信二维码）与 `assets/resume.pdf`（简历），或将对应字段留空以隐藏

## 项目结构

```
├── index.html              单页入口，含内联 SVG 漫画形象
├── docs/DESIGN.md          设计大纲（规格说明书）
└── assets/
    ├── css/                variables / main / animations
    ├── js/                 data / icons / theme / render / character / main
    └── img/                封面、二维码、favicon
```

## 单元测试

纯逻辑函数（主题、渲染工具、筛选、瞳孔算法、数据结构校验等）用 Node 内置测试运行器覆盖，**无需安装任何依赖**：

```bash
node --test
```

## 部署到 GitHub Pages

仓库根目录即站点根目录，直接托管：在仓库 `Settings → Pages` 中选择分支与 `/ (root)` 目录保存，稍后即可通过 `https://<用户名>.github.io/<仓库名>/` 访问。

## 设计大纲

完整的配色、字体、间距、章节结构、SVG 部件命名与数据字段定义见 [`docs/DESIGN.md`](docs/DESIGN.md)。
