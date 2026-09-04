# AI 工程师 · 个人主页

一个面向求职展示的单页个人网站：纯静态 `HTML + CSS + 原生 JavaScript`，**零依赖、零构建**，含一个手绘风格、可交互的 SVG 漫画形象与亮 / 暗双主题。

![技术栈](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20Vanilla%20JS-F2A099)
![依赖](https://img.shields.io/badge/dependencies-0-A8D5BA)
![构建](https://img.shields.io/badge/build-none-F7E1A0)

## 特性

- 温馨小清新风格，亮 / 暗双主题（首次访问跟随系统偏好，切换后记忆到 `localStorage`）
- 手写内联 SVG 漫画形象：瞳孔跟随鼠标、挥手、眨眼、呼吸浮动、随主题切换的装饰
- 七个章节：首屏 Hero、关于我、专业技能、作品集（带分类筛选）、经历时间线、联系我、页脚
- 全部个人内容集中在 `assets/js/data.js` 一个文件，改内容无需碰 HTML / CSS
- 响应式（375 / 768 / 1024 / 1440）、无障碍（语义标签、键盘可达、`prefers-reduced-motion` 降级）

---

## 快速开始

三步即可拥有自己的主页：

1. **预览**：双击 `index.html`，或运行 `python -m http.server 8000` 后访问 <http://localhost:8000>。
2. **改内容**：打开 `assets/js/data.js`，把所有 `{{...}}` 占位符替换成你自己的信息（详见下文）。
3. **上线**：推送到 GitHub，在仓库 `Settings → Pages` 开启 GitHub Pages（详见「部署」）。

> 无需 `npm install`、无需任何构建工具。改一行 `data.js`，刷新浏览器立刻生效。

---

## 本地预览

无需安装任何依赖，二选一：

- 直接**双击 `index.html`** 用浏览器打开（脚本采用传统 `<script>` 顺序引入，支持 `file://` 协议）。
- 或起一个本地静态服务器（**推荐**，二维码 / 简历等相对资源更稳定）：

```bash
# Python 3（Windows / macOS / Linux 通用）
python -m http.server 8000
# 然后浏览器访问 http://localhost:8000
```

> Windows 上若 `python` 命令不可用，可改用 `py -m http.server 8000`。

---

## 如何使用：修改成你自己的主页

所有可编辑内容都在 **`assets/js/data.js`** 一个文件里。用编辑器打开它，**搜索 `{{`** 就能逐个定位待填项。规则很简单：

- 占位符形如 `"{{姓名}}"`，把双引号里的内容换成你的真实信息即可。
- **可选字段留空字符串 `""`**，页面会自动隐藏对应元素（不会出现空白或 `undefined`）。
- 数组（技能 / 项目 / 经历）照已有示例的格式**复制一段、改内容**即可增删。

### 1）基本信息 `profile`

渲染到首屏 Hero 与「关于我」。字段说明：

| 字段 | 含义 | 留空时 |
| --- | --- | --- |
| `name` | 中文姓名（必填） | — |
| `englishName` | 英文名 | Hero 不显示英文名 |
| `age` | 年龄（纯数字，页面自动加「岁」） | 隐藏该卡片 |
| `gender` | 性别（已预填「女」） | 隐藏该卡片 |
| `title` | 职位（已预填「AI 工程师」） | — |
| `tagline` | 一句话个人定位 | 隐藏 |
| `location` | 所在城市 | 隐藏该卡片 |
| `education` | 学校 / 专业 / 学历 | 隐藏该卡片 |
| `email` | 邮箱（自动生成 `mailto:` 链接） | 隐藏邮箱入口 |
| `github` | GitHub 主页链接 | 隐藏 GitHub 入口 |
| `wechatQr` | 微信二维码图片路径 | 隐藏微信卡片 |
| `resume` | 简历 PDF 路径 | 隐藏「下载简历」按钮 |
| `jobStatus` | 求职状态，如「考虑新机会」 | 隐藏该卡片 |
| `bio` | 2–3 句自我介绍 | 隐藏 |
| `keywords` | 关键词标签数组 | 不显示标签 |

示例：

```js
const profile = {
  name:      "张三",
  age:       "26",
  title:     "AI 工程师",
  tagline:   "让大模型真正落地到业务里",
  location:  "杭州",
  education: "浙江大学 / 计算机科学与技术 / 硕士",
  email:     "zhangsan@example.com",
  github:    "https://github.com/zhangsan",
  bio:       "三年大模型应用经验，做过 RAG 与 Agent 系统……",
  keywords:  ["大模型应用", "RAG", "持续学习"],
  // 其余字段按需填写或留空 ""
};
```

### 2）专业技能 `skillGroups`

四个分组，每个技能的 `level` 取 `1/2/3`（对应「了解 / 掌握 / 熟练」，页面用三档圆点展示）。新增一条技能：

```js
{ name: "vLLM", level: 2 }
```

分组的 `icon` 需为 `assets/js/icons.js` 中已有的键（如 `brain` / `sparkles` / `code` / `server`）。

### 3）作品集 `projects`

复制一段改成你的项目。`category` 必须是 `llm / cv / nlp / data` 之一（决定筛选归类），`highlight`（量化亮点）**必填**：

```js
{
  id:        "proj-5",
  title:     "企业知识库问答系统",
  category:  "llm",
  summary:   "基于 RAG 的内部文档问答，支持多轮对话",
  cover:     "assets/img/proj-5.png", // 留空则用渐变+首字兜底封面
  tags:      ["LangChain", "向量数据库", "FastAPI"],
  highlight: "回答准确率 92%",         // 必填
  repo:      "https://github.com/you/kb-qa", // 留空则隐藏按钮
  demo:      ""                        // 留空则隐藏按钮
}
```

### 4）经历时间线 `timeline`

按时间**倒序**（最新在最上）。`type` 取 `edu`（教育）或 `work`（工作）：

```js
{
  type:   "work",
  period: "2023.07 — 至今",
  org:    "某某科技",
  role:   "AI 工程师",
  desc:   "负责大模型应用平台的研发与落地"
}
```

> 若把 `timeline` 整个数组清空，「经历」章节会连标题一起隐藏。

### 5）替换图片与简历

把文件放到对应路径即可（`data.js` 中已指向这些默认路径）：

- `assets/img/wechat-qr.png` — 微信二维码（联系我处点击展开；文件缺失会自动移除微信卡片）
- `assets/resume.pdf` — 简历（Hero 的「下载简历」按钮）
- `assets/img/proj-*.png` — 作品集封面，推荐 1600×900、压缩后 < 200KB；不放则用渐变兜底

---

## 主题与交互

- 右上角**太阳 / 月亮按钮**切换亮 / 暗主题，选择会被记住。
- 桌面端鼠标在漫画形象上移动可看到**瞳孔跟随**；移入 / 点击形象会**挥手**；她还会不定时**眨眼**。
- 移动端（≤768px）导航收进**汉堡菜单**。
- 开启系统「减少动态效果」偏好时，所有动画自动关闭，形象保持静态插画。

---

## 项目结构

```
├── index.html              单页入口，含内联 SVG 漫画形象
├── docs/DESIGN.md          设计大纲（规格说明书）
└── assets/
    ├── css/
    │   ├── variables.css   主题变量：亮暗配色、字体、间距、圆角、动效
    │   ├── main.css        基础重置、布局、各章节组件样式、响应式
    │   └── animations.css  关键帧动画与滚动进场
    ├── js/
    │   ├── data.js         ← 只需要改这个文件
    │   ├── icons.js        内联 SVG 图标集
    │   ├── theme.js        亮暗主题切换与记忆
    │   ├── render.js       依据 data.js 渲染各章节
    │   ├── character.js    漫画形象交互
    │   └── main.js         启动入口与页面级交互编排
    └── img/                封面、二维码、favicon
```

---

## 单元测试

纯逻辑函数（主题、渲染工具、筛选、瞳孔算法、数据结构校验、HTML 结构校验等）用 Node 内置测试运行器覆盖，**无需安装任何依赖**：

```bash
node --test
```

---

## 部署到 GitHub Pages

仓库根目录即站点根目录，可直接托管：

1. 把代码推送到 GitHub 仓库。
2. 打开仓库 `Settings → Pages`。
3. `Source` 选择 `Deploy from a branch`，分支选你的主分支、目录选 `/ (root)`，保存。
4. 稍等片刻，即可通过 `https://<用户名>.github.io/<仓库名>/` 访问。

> 也可托管到任意静态空间（Vercel / Netlify / 对象存储等），无需任何构建命令，上传整个目录即可。

---

## 常见问题

- **双击打开后二维码 / 简历点不开？** 用 `python -m http.server` 起本地服务访问，`file://` 下部分相对资源可能受限。
- **页面出现 `{{...}}`？** 这是还没填写的占位符，属预期提醒，填好 `data.js` 即可。
- **想改配色 / 字体 / 间距？** 统一在 `assets/css/variables.css` 改变量，业务样式不写死具体数值。

---

## 设计大纲

完整的配色、字体、间距、章节结构、SVG 部件命名与数据字段定义见 [`docs/DESIGN.md`](docs/DESIGN.md)。
