# AI 工程师个人网站 · 设计大纲

> 本文档是网站的规格说明书，供后续 AI 开发直接依据实施。
> 文档内已给出全部配色数值、章节顺序、SVG 部件命名、数据字段定义和文件路径，
> **开发阶段不需要再做任何设计决策**，遇到未覆盖的细节时以「设计原则」章节的倾向为准。

---

## 1. 项目概述

### 1.1 目标

为一位 **AI 工程师（女性）** 制作一个个人主页，用于求职展示与对外介绍。网站需要同时满足两件事：

1. **专业可信**：清楚呈现基本信息、技术栈深度和可验证的项目成果，让 HR 与技术面试官在 30 秒内判断出「这是一位做大模型/机器学习的工程师」。
2. **有个人温度**：通过一个手绘风格的交互式漫画形象和柔和的配色，区别于千篇一律的深色科技风模板，让访客留下印象。

### 1.2 网站定位与受众

| 受众 | 关注点 | 对应设计应对 |
| --- | --- | --- |
| HR / 招聘者 | 姓名、年龄、学历、联系方式是否齐全 | 「关于我」章节用信息卡片网格平铺，不需要滚动查找 |
| 技术面试官 | 技术栈真实深度、项目难度与量化成果 | 技能分四组呈现，作品集每张卡强制带一条量化亮点 |
| 同行 / 朋友 | 个人风格、是否有趣 | 交互式漫画形象、亮暗主题切换、滚动进场动效 |

### 1.3 交付形态

单页（One Page）滚动式网站，所有内容在 `index.html` 一个页面内通过锚点导航切换，无二级页面。

---

## 2. 技术决策（已确认，不再更改）

| 项目 | 决策 | 理由 |
| --- | --- | --- |
| 技术栈 | 纯静态 `HTML` + `CSS` + 原生 `JavaScript` | 零依赖、零构建，双击 `index.html` 即可预览 |
| 构建步骤 | **无**。不使用 npm / Vite / Webpack / tsc | 改一行代码立刻能看到效果，长期维护成本最低 |
| 类型系统 | **不使用** TypeScript，也不加 JSDoc 类型注释 | 站点脚本总量约 300 行且数据流简单，收益不足以换取构建步骤 |
| JS 模块方式 | 传统 `<script>` 标签按序引入，全局变量共享 | 避免 `type="module"` 在 `file://` 协议下的 CORS 限制，保证本地双击可运行 |
| CSS 组织 | 拆成 3 个文件，用 CSS 自定义属性做主题 | 无预处理器，浏览器原生支持 |
| 主题 | 亮 / 暗双主题，切换按钮 + `localStorage` 记忆 | 首次访问跟随系统 `prefers-color-scheme` |
| 视觉风格 | 温馨小清新简洁风 | 见第 4 章视觉规范 |
| 漫画形象 | 手写内联 SVG + JS 驱动动效 | 矢量不失真、部件可被脚本单独操作，无需外部图片 |
| 部署 | GitHub Pages（仓库根目录直接托管） | 静态站点零成本上线 |
| 浏览器支持 | 现代浏览器最新两个版本（Chrome / Edge / Firefox / Safari） | 可放心使用 CSS 变量、Grid、`IntersectionObserver` |

### 2.1 明确不做的事

为控制复杂度，以下内容**不在本站范围内**：

- 不做后端、数据库、表单提交（联系方式用 `mailto:` 链接与二维码图片代替）
- 不做博客文章系统（如后续需要，另起项目）
- 不做多语言切换（中文单语，技术名词保留英文原文）
- 不引入任何 JS 框架、UI 库、动画库（含 jQuery / GSAP / AOS）
- 不使用 CDN 引入的外部脚本，字体走「本地优先 + 系统兜底」策略

---

## 3. 设计原则

开发中遇到本文档未明确规定的细节时，按以下倾向决策：

1. **柔和优先**：拒绝纯黑 `#000` 和纯饱和色。所有中性色带一点暖调，阴影用暖棕色的低透明度版本而非黑色。
2. **圆角优先**：任何容器都不用直角。卡片大圆角，按钮做成胶囊形。
3. **留白优先**：宁可少放内容，也要保证章节之间有充足呼吸感（章节垂直间距不小于 96px）。
4. **动效克制**：动效用于引导注意力，不用于炫技。单次动画时长控制在 200–600ms，缓动统一用 `cubic-bezier(0.4, 0, 0.2, 1)`。
5. **内容可替换**：所有个人文案、技能、项目数据一律不写死在 HTML 里，全部集中在 `assets/js/data.js`（见第 7 章）。

---

## 4. 视觉规范

全部设计变量定义为 CSS 自定义属性，写在 `assets/css/variables.css`。亮色为默认值（挂在 `:root`），暗色通过 `html[data-theme="dark"]` 覆盖同名变量，业务样式只引用变量、**不允许出现硬编码颜色值**。

### 4.1 亮色主题配色

```css
:root {
  /* 背景层次 */
  --color-bg:            #FDFBF8; /* 页面底色，暖米白 */
  --color-bg-alt:        #F7F2EC; /* 交替章节背景，比底色略深 */
  --color-surface:       #FFFFFF; /* 卡片 */
  --color-surface-hover: #FFF8F5; /* 卡片悬停 */
  --color-border:        #EFE6DD; /* 描边、分割线 */

  /* 文字 */
  --color-text:          #4A4441; /* 正文，暖灰棕 */
  --color-text-muted:    #7D746F; /* 次要说明文字 */
  --color-text-inverse:  #FFFFFF; /* 主色按钮上的文字 */

  /* 主色：蜜桃粉 */
  --color-primary:       #F2A099; /* 装饰、图形、大色块 */
  --color-primary-hover: #E5837B; /* 按钮悬停 */
  --color-primary-ink:   #B04E47; /* 主色系文字与链接（唯一可用于小字号的主色） */
  --color-primary-soft:  #FDEDEB; /* 主色浅底，用于标签底色 */

  /* 辅色：薄荷绿 */
  --color-accent:        #A8D5BA;
  --color-accent-ink:    #3F7A5C; /* 辅色系文字 */
  --color-accent-soft:   #E8F4EE;

  /* 点缀色：奶油黄 */
  --color-highlight:     #F7E1A0;
  --color-highlight-ink: #8A6A16;
  --color-highlight-soft:#FDF6E3;
}
```

**重要约束**：`--color-primary` / `--color-accent` / `--color-highlight` 这三个原色饱和度低、明度高，在白底上对比度不足 3:1，**只能作为图形、边框、色块使用，禁止用于文字**。任何文字着色必须使用对应的 `-ink` 变量。

### 4.2 暗色主题配色

暗色不使用纯黑，底色带紫红暖调，以延续「温馨」而非「冷酷科技」的观感。

```css
html[data-theme="dark"] {
  --color-bg:            #211D22;
  --color-bg-alt:        #262127;
  --color-surface:       #2A2529;
  --color-surface-hover: #332C32;
  --color-border:        #3B343A;

  --color-text:          #EFE8E4;
  --color-text-muted:    #ADA29E;
  --color-text-inverse:  #2A2529; /* 暗色下主色变亮，按钮文字需反转为深色 */

  --color-primary:       #F5BAB3;
  --color-primary-hover: #FAD0CB;
  --color-primary-ink:   #F5BAB3; /* 暗底上亮粉本身对比度足够，可直接用于文字 */
  --color-primary-soft:  rgba(245, 186, 179, 0.14);

  --color-accent:        #8FCBAE;
  --color-accent-ink:    #9FD9BD;
  --color-accent-soft:   rgba(143, 203, 174, 0.14);

  --color-highlight:     #EBD79B;
  --color-highlight-ink: #EBD79B;
  --color-highlight-soft:rgba(235, 215, 155, 0.14);
}
```

### 4.3 阴影

阴影颜色取暖棕色的低透明度版本（`rgba(122, 96, 88, x)`），而非黑色，避免出现「脏灰」边缘。暗色主题下改用黑色阴影并加大透明度，同时给卡片补一道内描边提升层次。

```css
:root {
  --shadow-sm: 0 2px 8px  rgba(122, 96, 88, 0.06);
  --shadow-md: 0 6px 20px rgba(122, 96, 88, 0.10);
  --shadow-lg: 0 14px 40px rgba(122, 96, 88, 0.14);
}

html[data-theme="dark"] {
  --shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.30);
  --shadow-md: 0 6px 20px rgba(0, 0, 0, 0.38);
  --shadow-lg: 0 14px 40px rgba(0, 0, 0, 0.46);
}
```

### 4.4 字体

**字体策略**：不引入任何外部 CDN 字体。标题字体走「本地优先 + 系统兜底」——若 `assets/fonts/` 下放入了 Quicksand 字体文件则通过 `@font-face` 声明使用，否则自动落到系统字体栈，此时仅靠字重与字间距区分标题层级，视觉上依然成立。

```css
:root {
  --font-heading: "Quicksand", "Nunito", -apple-system, "PingFang SC",
                  "Microsoft YaHei", sans-serif;
  --font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
                  "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono:    "JetBrains Mono", Consolas, Monaco, monospace;
}
```

字号使用 `clamp()` 实现流式缩放，无需在断点里重复定义标题字号：

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--fs-hero` | `clamp(2.25rem, 5vw, 3.5rem)` | 首屏姓名 |
| `--fs-h2` | `clamp(1.5rem, 3vw, 2rem)` | 章节标题 |
| `--fs-h3` | `1.125rem` | 卡片标题 |
| `--fs-body` | `1rem` | 正文（基准 16px，不得更小） |
| `--fs-sm` | `0.875rem` | 辅助说明、标签 |
| `--fs-xs` | `0.75rem` | 页脚版权、时间戳 |

行高与字间距（中文需要比英文更松的行高）：

```css
:root {
  --lh-heading: 1.3;
  --lh-body:    1.75;   /* 中文段落必须 ≥1.7，否则显得拥挤 */
  --ls-body:    0.02em; /* 中文正文轻微字间距 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold:   700;
}
```

`--font-mono` 仅用于技能标签、代码片段和项目量化指标数字，用以强化工程师身份。

### 4.5 圆角

任何容器都不使用直角，这是本站风格的核心识别点。

```css
:root {
  --radius-sm:   8px;   /* 技能标签 */
  --radius-md:   12px;  /* 输入框、小控件 */
  --radius-lg:   16px;  /* 卡片（主要） */
  --radius-xl:   24px;  /* 大区块、作品集封面 */
  --radius-full: 999px; /* 胶囊按钮、头像、筛选器 */
}
```

### 4.6 间距刻度

以 4px 为基准的 8 级刻度，另外单列一个章节级间距。**布局中的所有间距必须取自该刻度，不允许出现刻度外的数值**（如 15px、30px）。

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --space-section: 96px; /* 章节上下留白，移动端降为 64px */
}
```

### 4.7 动效与层级

```css
:root {
  --ease:            cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast:   200ms; /* 悬停、颜色变化 */
  --duration-normal: 400ms; /* 滚动进场、主题切换 */
  --duration-slow:   600ms; /* 漫画形象挥手 */

  --z-base:    1;
  --z-sticky:  100; /* 吸顶导航 */
  --z-overlay: 200; /* 移动端展开的菜单 */
  --z-toast:   300; /* 预留 */
}
```

### 4.8 布局容器与响应式断点

内容容器统一 `max-width: 1120px`，水平居中，左右内边距桌面 `--space-5`（24px）、移动端 `--space-4`（16px）。

采用移动端优先之外的**桌面优先 + `max-width` 媒体查询**写法（因为主要访问场景是桌面投递简历），三个断点如下：

| 断点 | 媒体查询 | 主要变化 |
| --- | --- | --- |
| 桌面 | 默认（> 1024px） | Hero 左右分栏；作品集 3 列；技能 2 列 |
| 平板 | `@media (max-width: 1024px)` | 作品集降为 2 列；漫画形象缩小至 80%；章节间距降为 64px |
| 手机 | `@media (max-width: 768px)` | Hero 改为上下堆叠（文字在上、形象在下）；导航锚点收进汉堡菜单；所有网格降为 1 列 |
| 小屏手机 | `@media (max-width: 480px)` | 信息卡片网格由 2 列变 1 列；隐藏纯装饰性图形；按钮改为全宽 |

设计基准宽度为 1440px，最小适配宽度为 **375px**（iPhone SE），在该宽度下不得出现横向滚动条。

---

## 5. 页面章节结构

### 5.0 整体骨架

单页从上到下共 7 个区块，锚点 `id` 与导航链接一一对应：

```html
<body>
  <header class="site-nav" id="nav">...</header>

  <main>
    <section id="hero"     class="section section--hero">...</section>
    <section id="about"    class="section">...</section>
    <section id="skills"   class="section section--alt">...</section>
    <section id="projects" class="section">...</section>
    <section id="timeline" class="section section--alt">...</section>
    <section id="contact"  class="section">...</section>
  </main>

  <footer class="site-footer">...</footer>
</body>
```

约定：

- `.section` 提供统一的上下 `--space-section` 留白与内容容器居中
- `.section--alt` 使用 `--color-bg-alt` 背景，与普通章节交替，形成视觉节奏
- 每个章节（除 Hero）都有统一的标题结构：一个小号英文副标题 + 一个中文主标题 + 一条短装饰横线

```html
<div class="section__head">
  <p class="section__eyebrow">ABOUT ME</p>
  <h2 class="section__title">关于我</h2>
  <span class="section__rule" aria-hidden="true"></span>
</div>
```

- 除 Hero 外，所有章节使用 `IntersectionObserver` 实现「进入视口时淡入上移」，初始状态 `opacity: 0; transform: translateY(24px)`，命中后加 `.is-visible` 类

### 5.1 吸顶导航 `#nav`

| 项 | 规格 |
| --- | --- |
| 定位 | `position: sticky; top: 0;`，`z-index: var(--z-sticky)` |
| 背景 | 半透明底色 + `backdrop-filter: blur(12px)` 毛玻璃；页面滚动超过 80px 后追加 `.is-scrolled` 类，补一条底部描边和 `--shadow-sm` |
| 左侧 | 姓名首字母缩写做 Logo，圆形 `--radius-full` 主色浅底 + `--color-primary-ink` 文字 |
| 中间 | 锚点链接：关于我 / 专业技能 / 作品集 / 经历 / 联系我 |
| 右侧 | 主题切换按钮（太阳 / 月亮图标，内联 SVG） |
| 高亮 | 用 `IntersectionObserver` 监听各章节，当前章节对应链接加 `.is-active`，表现为文字变 `--color-primary-ink` 且下方出现小圆点 |
| 平滑滚动 | CSS `html { scroll-behavior: smooth; }`，并给各 `section` 设置 `scroll-margin-top: 80px` 以避免被导航遮挡 |
| 移动端 | ≤768px 时锚点收进汉堡菜单，展开为全屏覆盖层（`--z-overlay`），点击链接后自动收起；主题切换按钮始终常驻可见 |

### 5.2 首屏 Hero `#hero`

左右两栏布局，左栏文字占 55%，右栏漫画形象占 45%，垂直居中，最小高度 `min-height: calc(100vh - 72px)`。

左栏内容自上而下：

1. 一行问候小标签：`👋 你好，我是` 形式的胶囊标签（主色浅底）
2. 姓名，`--fs-hero` + `--font-weight-bold`
3. 职位定位「AI 工程师」，其中关键词用主色下划线装饰（用伪元素画一条粗圆角底纹，而非 `text-decoration`）
4. 一句话个人定位（`tagline`），`--color-text-muted`
5. 两个 CTA 按钮：主按钮「查看作品集」（实心主色，锚点跳 `#projects`）、次按钮「下载简历」（描边样式，链接到 `assets/resume.pdf`，带 `download` 属性）
6. 一行社交图标链接：GitHub、邮箱

右栏为交互式漫画形象（详见第 6 章），形象下方悬浮一个装饰性的「代码气泡」，内容为等宽字体的一行伪代码，例如 `while True: learn()`。

背景装饰：左上与右下各一个大尺寸模糊色斑（主色与薄荷绿，`filter: blur(80px)`，透明度 0.25），做出柔和氛围。这些装饰元素必须带 `aria-hidden="true"`，且在 ≤480px 时隐藏。

底部居中放一个「向下滚动」提示箭头，做 2px 幅度的上下缓动循环。

### 5.3 关于我 `#about`

两栏布局：左栏是自我介绍文字，右栏是基本信息卡片网格。

左栏：`bio` 字段渲染的 2–3 句自我介绍段落，行高 `--lh-body`。段落下方可选放 2–3 个「关键词标签」（例如 `大模型应用`、`RAG`、`持续学习`）。

右栏：基本信息网格，桌面 2 列，≤480px 变 1 列。每个信息项是一张小卡片，包含一个内联 SVG 图标 + 字段名 + 字段值：

| 字段 | 说明 |
| --- | --- |
| 姓名 | 中文姓名，可附英文名 |
| 年龄 | 纯数字 + 「岁」 |
| 性别 | 女 |
| 所在城市 | 用于表明求职地点 |
| 学历专业 | 学校 / 专业 / 学位三段合并展示 |
| 邮箱 | `mailto:` 可点击链接 |
| GitHub | 外链，`target="_blank"` 必须配 `rel="noopener noreferrer"` |
| 求职状态 | 例如「在职 / 考虑机会」，可选字段，为空时不渲染该卡片 |

信息卡片交互：悬停时背景变 `--color-surface-hover`，图标轻微放大（`scale(1.1)`），整卡上移 2px。

### 5.4 专业技能 `#skills`

按四个分组呈现，桌面 2×2 网格，平板及以下单列。每组是一张卡片，卡片头部为分组图标 + 分组名，下方是技能条目列表。

四个分组及其条目（作为默认内容，实际值取自 `data.js`）：

| 分组 | 条目 |
| --- | --- |
| 机器学习与深度学习 | PyTorch、Transformers、scikit-learn、CNN / RNN、模型评估与调优 |
| 大模型应用 | LoRA / QLoRA 微调、RAG 检索增强、LangChain、Agent 编排、Prompt 工程、向量数据库 |
| 编程与工程 | Python、SQL、FastAPI、Docker、Git、Linux |
| 数据与部署 | Pandas / NumPy、数据清洗与标注、MLflow、ONNX / 模型量化、云平台部署 |

**熟练度表示**：使用三档小圆点，**不使用百分比进度条**（自评百分比缺乏说服力，且容易在面试中被追问）。每个条目右侧渲染 3 个圆点，实心数量代表档位：

| `level` | 圆点 | 含义 |
| --- | --- | --- |
| 3 | 三实心 | 熟练，可独立主导相关模块的设计与落地 |
| 2 | 两实心 | 掌握，能独立完成常规任务 |
| 1 | 一实心 | 了解，有实际项目实践经验 |

圆点实心用 `--color-primary`，空心用 `--color-border`。章节标题右侧必须放一个图例（Legend），用一行小字说明三档含义，否则访客无法解读圆点。

技能条目名称使用 `--font-mono`，强化技术属性。

### 5.5 作品集 `#projects`

本章节是全站权重最高的部分，也是唯一带交互筛选的模块。

**筛选器**：位于章节标题下方，一行胶囊按钮，居中排列。当前选中项为实心主色，未选中为描边样式。

| 按钮文案 | `category` 值 |
| --- | --- |
| 全部 | `all` |
| 大模型 | `llm` |
| 计算机视觉 | `cv` |
| 自然语言处理 | `nlp` |
| 数据分析 | `data` |

筛选实现方式：卡片渲染时写入 `data-category` 属性，点击按钮后遍历卡片，不匹配的加 `.is-hidden`（`display: none`）。**筛选后若结果为空，必须显示一个空状态提示**（一行文字 + 一个简笔图标），不允许出现空白区域。筛选按钮需要 `aria-pressed` 状态标记。

**卡片网格**：`grid-template-columns` 桌面 3 列、平板 2 列、手机 1 列，间距 `--space-5`。

**单张卡片结构**（自上而下）：

1. 封面区，固定 16:9 比例。有封面图时渲染 `<img loading="lazy">`；无封面图时用「主色 → 薄荷绿」的柔和渐变兜底，并在渐变上居中显示项目名首字。
2. 项目名，`--fs-h3`
3. 一句话简介，`--color-text-muted`，限制 2 行并溢出省略（`-webkit-line-clamp: 2`）
4. 量化亮点，**每张卡强制必填**，用 `--color-highlight-soft` 背景的小条幅呈现，数字部分用 `--font-mono` 加粗。示例：`推理延迟 ↓ 40%`、`召回率 92%`
5. 技术标签，小圆角胶囊，`--color-primary-soft` 底 + `--color-primary-ink` 文字，最多展示 5 个，超出显示 `+N`
6. 底部链接行：`GitHub 仓库` 与 `在线 Demo`。链接为空字符串时**隐藏对应按钮**而不是渲染成死链

**卡片交互**：悬停时上移 4px、阴影由 `--shadow-sm` 升为 `--shadow-lg`、封面图轻微放大（`scale(1.04)`，父级 `overflow: hidden`）。整卡不做成一个大链接，避免与内部两个按钮产生嵌套链接的可访问性问题。

### 5.6 经历时间线 `#timeline`

竖向单列时间轴，用于展示教育与工作经历，按时间倒序（最新在最上）。

结构：左侧一条 2px 竖线（`--color-border`），每个条目在竖线上有一个圆点标记（实心 `--color-primary`，外围一圈同色低透明度光晕），条目内容统一在竖线右侧，桌面与移动端布局一致（**不做左右交错**，交错布局在窄屏下会退化且实现成本高）。

单个条目字段：时间范围、机构名称（学校或公司）、角色（专业或职位）、1–2 句描述、类型标记（`edu` / `work`）。类型标记用不同图标区分：教育用书本图标，工作用公文包图标。

若 `data.js` 中 `timeline` 数组为空，整个章节不渲染（连标题一起隐藏），避免出现空章节。

### 5.7 联系我 `#contact` 与页脚

**联系我**：居中布局，一句引导文案（例如「欢迎聊聊 AI、项目或工作机会」），下方三个联系方式卡片横向排列（≤768px 变纵向）：

1. 邮箱 — `mailto:` 链接，卡片内显示完整邮箱地址
2. GitHub — 外链
3. 微信 — 点击后在卡片内展开二维码图片（`assets/img/wechat-qr.png`），使用 `<details>` 或 JS 切换类实现；若图片文件缺失则不渲染该卡片

**页脚**：单行居中，包含版权年份（用 JS 写入当前年份，避免每年手改）、姓名，以及一行小字标注「本站为纯手写 HTML / CSS / JavaScript，无框架依赖」——这行字对工程师身份是有效加分项。

---

## 6. 漫画形象规格

### 6.1 形象设定

一位短发女生，坐在打开的笔记本电脑前，面带微笑并抬起右手打招呼。整体为 **扁平插画风格：纯色块填充、无描边、形状圆润**，不使用渐变和阴影（唯一例外是腮红用低透明度实心椭圆），以匹配小清新定位。

绘制时优先使用 `<ellipse>` / `<circle>` / 少控制点的 `<path>`，避免出现几十个节点的复杂路径——形象要「简笔可爱」而非「写实精细」。

### 6.2 SVG 放置方式与画布

SVG **内联写在 `index.html` 中**（不使用 `<img>` 或 `<object>` 引入），原因有两个：JS 需要直接操作瞳孔、手臂等子节点；填充色需要继承 CSS 自定义属性以响应主题切换。

```html
<div class="avatar" id="avatarWrap">
  <svg id="avatar" class="avatar__svg" viewBox="0 0 320 400"
       role="img"
       aria-label="站长的卡通形象：一位短发女生坐在笔记本电脑前微笑挥手">
    ...
  </svg>
</div>
```

画布 `viewBox="0 0 320 400"`，宽高比 4:5。容器尺寸：桌面 `max-width: 360px`，≤1024px 缩至 80%，≤768px 缩至 260px 并水平居中。

### 6.3 部件分层与 id 命名

**从后到前**的绘制顺序（SVG 中后写的元素覆盖先写的），所有需要被脚本或 CSS 单独控制的部件必须带 `id`，纯装饰部件只给 `class`：

```
#avatar
├── #avatarDecor          主题联动装饰（最底层）
│   ├── #decorSun         太阳，亮色主题可见
│   ├── #decorMoon        月亮，暗色主题可见
│   └── #decorStars       三颗小星星，暗色主题可见
├── #avatarFloat          呼吸浮动动画的包裹组（整体上下微浮）
│   ├── #hairBack         后层头发
│   ├── #body             上身卫衣
│   ├── #armStatic        左臂（静止，放在键盘上）
│   ├── #armWave          右臂（挥手动画目标）
│   │   └── .avatar__hand 手掌
│   ├── #head             头部组
│   │   ├── #face         脸（椭圆）
│   │   ├── #earLeft / #earRight
│   │   ├── #eyeLeft      左眼组
│   │   │   ├── .avatar__eye-white
│   │   │   └── #pupilLeft    左瞳孔（脚本位移目标）
│   │   ├── #eyeRight     右眼组
│   │   │   └── #pupilRight
│   │   ├── #browLeft / #browRight   眉毛
│   │   ├── #blushLeft / #blushRight 腮红
│   │   ├── #mouth        微笑嘴（一段圆角弧线 path）
│   │   ├── #hairFront    刘海（覆盖在脸之上）
│   │   └── #hairClip     发夹点缀，奶油黄
│   └── #laptop           笔记本电脑
│       ├── .avatar__laptop-base
│       └── #laptopScreen 屏幕（可加轻微高光闪动）
```

**关键结构要求**：

- 眼睛必须做成 `<g>` 组，内部「眼白」与「瞳孔」是两个独立元素。瞳孔单独位移（鼠标跟随），眼睛整组做 `scaleY` 压缩（眨眼）。
- `#armWave` 必须是独立的 `<g>`，且其 CSS 需设置 `transform-box: fill-box; transform-origin: <肩关节位置>`（建议 `transform-origin: 20% 10%`，具体值按实际绘制的肩部坐标微调），否则旋转会以画布原点为中心导致手臂飞出画面。
- `#hairFront` 必须绘制在眼睛与脸之后，保证刘海正确遮挡额头。

### 6.4 配色（响应主题切换）

SVG 元素**不允许写死 `fill` 属性**，一律通过 CSS 类引用变量。形象专属变量追加在 `variables.css` 中：

```css
:root {
  --avatar-skin:     #FBE3D6; /* 肤色 */
  --avatar-hair:     #4A3B36; /* 深棕短发 */
  --avatar-hoodie:   #F2A099; /* 卫衣，同主色 */
  --avatar-hoodie-2: #A8D5BA; /* 卫衣袖口/口袋，同辅色 */
  --avatar-laptop:   #C9D6E3; /* 笔记本外壳 */
  --avatar-screen:   #F7F2EC; /* 屏幕 */
  --avatar-blush:    rgba(240, 138, 130, 0.35);
  --avatar-line:     #4A3B36; /* 眉毛、嘴、瞳孔 */
}

html[data-theme="dark"] {
  --avatar-skin:     #F0D2C4;
  --avatar-hair:     #5C4A43; /* 暗底下头发提亮，避免糊成一团 */
  --avatar-hoodie:   #F5BAB3;
  --avatar-hoodie-2: #8FCBAE;
  --avatar-laptop:   #8A97A6;
  --avatar-screen:   #3B343A;
  --avatar-blush:    rgba(245, 160, 152, 0.30);
  --avatar-line:     #3A2E2A;
}
```

所有 `fill` 变化统一加 `transition: fill var(--duration-normal) var(--ease)`，使主题切换时形象颜色平滑过渡。

### 6.5 交互一：瞳孔跟随鼠标

实现在 `assets/js/character.js`。

**算法**：

1. 初始化时用 `getBoundingClientRect()` 取两只眼睛组的屏幕中心坐标，缓存为 `eyeCenters`。在 `resize` 与 `scroll` 时重新计算（`scroll` 必须重算，否则页面滚动后视线会偏）。
2. 监听 `mousemove`，只记录最新坐标，**实际计算放在 `requestAnimationFrame` 回调中**，避免高频事件造成掉帧。
3. 对每只眼睛分别计算位移：

```js
const MAX_OFFSET = 3;   // SVG 用户单位，位移上限
const FALLOFF   = 160;  // 距离衰减基准（px），越小越灵敏

const dx = mouseX - eye.cx;
const dy = mouseY - eye.cy;
const dist  = Math.hypot(dx, dy);
const ratio = Math.min(dist / FALLOFF, 1);      // 归一化到 0~1
const angle = Math.atan2(dy, dx);

const ox = Math.cos(angle) * MAX_OFFSET * ratio;
const oy = Math.sin(angle) * MAX_OFFSET * ratio;

pupil.setAttribute('transform', `translate(${ox.toFixed(2)}, ${oy.toFixed(2)})`);
```

**注意**：位移用 `setAttribute('transform', ...)` 而不是 CSS `transform`，以规避 `transform-box` 在不同浏览器下的坐标系差异。位移量必须限制在 3 个用户单位内，超过后瞳孔会脱离眼白显得诡异。

**降级**：通过 `matchMedia('(hover: hover) and (pointer: fine)')` 判断是否为鼠标设备。触屏设备不绑定 `mousemove`，瞳孔保持居中。

### 6.6 交互二：挥手

CSS 动画，JS 负责加类。

```css
@keyframes avatar-wave {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(-18deg); }
  50%      { transform: rotate(-4deg); }
  75%      { transform: rotate(-18deg); }
}

#armWave {
  transform-box: fill-box;
  transform-origin: 20% 10%; /* 肩关节 */
}

#armWave.is-waving {
  animation: avatar-wave var(--duration-slow) var(--ease) 2;
}
```

触发时机：

1. 页面加载后延迟 800ms 自动挥手一次（等 Hero 进场动画结束）
2. 鼠标移入 `#avatarWrap` 时触发
3. 点击 / 触摸形象时触发（让触屏用户也能玩到）

**防抖**：动画进行中忽略新的触发。用 `animationend` 事件移除 `.is-waving` 类，而不是用 `setTimeout` 计时，避免类残留导致下次无法重新触发。

### 6.7 交互三：眨眼

```css
#eyeLeft, #eyeRight { transform-box: fill-box; transform-origin: center; }
#eyeLeft.is-blinking, #eyeRight.is-blinking {
  animation: avatar-blink 160ms var(--ease);
}
@keyframes avatar-blink {
  0%, 100% { transform: scaleY(1); }
  50%      { transform: scaleY(0.08); }
}
```

JS 用**递归 `setTimeout` 而非 `setInterval`** 实现随机间隔：每次眨眼后随机取 4000–6500ms 作为下次间隔，两只眼睛同时触发。页面在后台时（`document.hidden`）暂停定时器，避免无意义的计时堆积。

### 6.8 交互四：呼吸浮动与主题联动装饰

**呼吸浮动**：`#avatarFloat` 持续做 `translateY(0 → -5px → 0)` 的 4s `ease-in-out` 无限循环，幅度必须小，只求「活着」的感觉。

**主题联动**：装饰随主题淡入淡出，并带轻微旋转与位移，让切换过程有惊喜感。

```css
#decorSun  { opacity: 1; transition: opacity var(--duration-normal) var(--ease),
                                     transform var(--duration-normal) var(--ease); }
#decorMoon, #decorStars { opacity: 0; }

html[data-theme="dark"] #decorSun  { opacity: 0; transform: translateY(-12px) rotate(45deg); }
html[data-theme="dark"] #decorMoon { opacity: 1; }
html[data-theme="dark"] #decorStars{ opacity: 1; }
```

星星另外做一个极缓慢的 `opacity` 闪烁循环（3s，三颗星用不同 `animation-delay` 错开）。

### 6.9 无障碍与动效降级

- SVG 根节点带 `role="img"` 和描述性 `aria-label`；内部所有部件加 `aria-hidden="true"`，避免屏幕阅读器逐个朗读图形节点
- `#avatarWrap` 若绑定了点击触发挥手，需加 `tabindex="0"` 与 `aria-label`，并支持回车键触发，否则是鼠标专属功能
- **`prefers-reduced-motion: reduce` 时的降级要求**：
  - JS 侧：在 `character.js` 顶部读取 `matchMedia('(prefers-reduced-motion: reduce)').matches`，为真时**不绑定 `mousemove`、不启动眨眼定时器、不自动挥手**，形象保持静态
  - CSS 侧：全局兜底规则，同时关闭呼吸浮动与所有章节进场动画

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

降级后形象仍必须是一张完整好看的静态插画——所有动效都只是增强，不承载任何信息。

---

## 7. 数据结构与文件组织

### 7.1 占位符约定

所有个人信息使用 `{{字段名}}` 形式的中文占位符，集中在 `assets/js/data.js` 顶部。这样站长只需打开一个文件、搜索 `{{` 就能定位全部待填内容，无需理解任何 HTML 结构。

规则：

- 占位符统一格式 `"{{姓名}}"`，双大括号包裹中文字段名
- 已经确定的值直接写死（如 `gender: "女"`、`title: "AI 工程师"`）
- 可选字段留空字符串 `""`，渲染层遇到空值时**隐藏对应元素**而不是渲染出空白或 `undefined`
- 数组类数据（技能、项目、经历）预填 2–3 条结构完整的示例条目，站长照格式增删即可

### 7.2 `data.js` 完整结构

```js
/* ==========================================================
 * 个人信息与内容数据 —— 修改本文件即可更新整站内容
 * 带 {{}} 的是待填占位符，可选字段留空字符串则该项不显示
 * ========================================================== */

/** 基本信息，渲染到 Hero 与「关于我」章节 */
const profile = {
  name:       "{{姓名}}",
  englishName:"{{英文名}}",      // 可选，为空则 Hero 不显示英文名
  age:        "{{年龄}}",
  gender:     "女",
  title:      "AI 工程师",
  tagline:    "{{一句话个人定位}}", // 例：让大模型真正落地到业务里
  location:   "{{所在城市}}",
  education:  "{{学校 / 专业 / 学历}}",
  email:      "{{邮箱}}",
  github:     "{{GitHub 主页链接}}",
  wechatQr:   "assets/img/wechat-qr.png", // 为空则不显示微信卡片
  resume:     "assets/resume.pdf",        // 为空则隐藏「下载简历」按钮
  jobStatus:  "{{求职状态}}",             // 可选，例：在职 / 考虑新机会
  bio:        "{{2-3 句自我介绍}}",
  keywords:   ["大模型应用", "RAG", "持续学习"] // 「关于我」下方的关键词标签
};

/** 专业技能，四个分组。level 取值 1/2/3，含义见设计大纲 5.4 */
const skillGroups = [
  {
    category: "机器学习与深度学习",
    icon: "brain",                    // 对应 icons.js 中的图标键名
    items: [
      { name: "PyTorch",        level: 3 },
      { name: "Transformers",   level: 3 },
      { name: "scikit-learn",   level: 2 },
      { name: "CNN / RNN",      level: 2 },
      { name: "模型评估与调优",  level: 2 }
    ]
  },
  {
    category: "大模型应用",
    icon: "sparkles",
    items: [
      { name: "LoRA / QLoRA 微调", level: 3 },
      { name: "RAG 检索增强",      level: 3 },
      { name: "LangChain",         level: 2 },
      { name: "Agent 编排",        level: 2 },
      { name: "Prompt 工程",       level: 3 },
      { name: "向量数据库",        level: 2 }
    ]
  },
  {
    category: "编程与工程",
    icon: "code",
    items: [
      { name: "Python",   level: 3 },
      { name: "SQL",      level: 2 },
      { name: "FastAPI",  level: 2 },
      { name: "Docker",   level: 2 },
      { name: "Git",      level: 3 },
      { name: "Linux",    level: 2 }
    ]
  },
  {
    category: "数据与部署",
    icon: "server",
    items: [
      { name: "Pandas / NumPy",    level: 3 },
      { name: "数据清洗与标注",     level: 3 },
      { name: "MLflow",            level: 2 },
      { name: "ONNX / 模型量化",    level: 1 },
      { name: "云平台部署",         level: 2 }
    ]
  }
];

/** 作品集。category 必须是 llm / cv / nlp / data 之一 */
const projects = [
  {
    id:        "proj-1",
    title:     "{{项目名称}}",
    category:  "llm",
    summary:   "{{一句话项目简介，控制在 40 字内}}",
    cover:     "assets/img/proj-1.png", // 为空则用渐变兜底封面
    tags:      ["PyTorch", "LoRA", "FastAPI"],
    highlight: "{{量化成果}}",          // 必填，例：推理延迟 ↓ 40%
    repo:      "{{仓库链接}}",          // 为空则隐藏该按钮
    demo:      "{{在线演示链接}}"       // 为空则隐藏该按钮
  }
  // 照此格式继续添加，建议 4–6 个项目
];

/** 作品集筛选分类，value 需与 projects[].category 对应 */
const projectCategories = [
  { value: "all",  label: "全部" },
  { value: "llm",  label: "大模型" },
  { value: "cv",   label: "计算机视觉" },
  { value: "nlp",  label: "自然语言处理" },
  { value: "data", label: "数据分析" }
];

/** 经历时间线，按时间倒序排列。type 取 edu / work。数组为空则整个章节不渲染 */
const timeline = [
  {
    type:   "work",
    period: "{{起止时间}}",       // 例：2023.07 — 至今
    org:    "{{公司名称}}",
    role:   "{{职位}}",
    desc:   "{{1-2 句职责与成果描述}}"
  },
  {
    type:   "edu",
    period: "{{起止时间}}",
    org:    "{{学校名称}}",
    role:   "{{专业 / 学位}}",
    desc:   "{{可选，主修方向或荣誉}}"
  }
];
```

### 7.3 文件目录结构

```
test-cursor-auto/
├── index.html                 单页入口，含内联 SVG 漫画形象
├── README.md                  项目说明与本地预览方式
├── docs/
│   └── DESIGN.md              本设计大纲
└── assets/
    ├── css/
    │   ├── variables.css      主题变量：亮暗配色、字体、间距、圆角、动效
    │   ├── main.css           基础重置、布局、各章节组件样式、响应式
    │   └── animations.css     关键帧动画与滚动进场
    ├── js/
    │   ├── data.js            全部个人信息与内容数据（唯一需要站长编辑的文件）
    │   ├── icons.js           内联 SVG 图标字符串集合
    │   ├── theme.js           亮暗主题切换与 localStorage 记忆
    │   ├── render.js          依据 data.js 渲染各章节 DOM
    │   ├── character.js       漫画形象交互：瞳孔跟随、挥手、眨眼
    │   └── main.js            入口：导航、滚动进场、作品集筛选、页脚年份
    ├── img/
    │   ├── proj-1.png         作品集封面（建议 1600×900，压缩后 < 200KB）
    │   └── wechat-qr.png      微信二维码
    ├── fonts/                 可选。放入 Quicksand 字体文件后启用 @font-face
    └── resume.pdf             简历文件，供「下载简历」按钮使用
```

### 7.4 脚本职责与引入顺序

不使用 ES Module（`type="module"` 在 `file://` 协议下会被 CORS 拦截，导致无法双击预览）。改为传统 `<script>` 按依赖顺序引入，置于 `</body>` 前：

```html
<script src="assets/js/data.js"></script>
<script src="assets/js/icons.js"></script>
<script src="assets/js/theme.js"></script>
<script src="assets/js/render.js"></script>
<script src="assets/js/character.js"></script>
<script src="assets/js/main.js"></script>
```

各文件职责边界：

| 文件 | 职责 | 对外暴露 |
| --- | --- | --- |
| `data.js` | 纯数据声明，**不含任何逻辑** | `profile` / `skillGroups` / `projects` / `projectCategories` / `timeline` |
| `icons.js` | 图标 SVG 字符串字典，供渲染时插入 | `ICONS`（键名如 `brain`、`code`、`mail`、`github`、`sun`、`moon`） |
| `theme.js` | 读取 `localStorage` 与系统偏好、设置 `html[data-theme]`、绑定切换按钮 | `initTheme()` |
| `render.js` | 把数据渲染成 DOM，每个章节一个独立函数 | `renderProfile()` / `renderSkills()` / `renderProjects()` / `renderTimeline()` / `renderContact()` |
| `character.js` | 漫画形象的全部交互逻辑 | `initCharacter()` |
| `main.js` | 唯一的启动入口，在 `DOMContentLoaded` 中按序调用上述初始化函数，并负责导航高亮、汉堡菜单、滚动进场、作品集筛选、页脚年份 | 无 |

**主题初始化的特殊处理**：为避免刷新时先闪一下亮色再切到暗色（FOUC），主题读取与 `data-theme` 写入必须放在 `<head>` 内的一小段内联脚本中提前执行，`theme.js` 只负责后续的按钮绑定与切换。

### 7.5 渲染层实现约定

- 优先使用模板字符串拼接 HTML 后一次性 `innerHTML` 赋值，减少重排；**但凡插入来自数据的文本，必须使用 `textContent` 或先做 HTML 转义**，防止内容里的尖括号破坏结构
- 每个渲染函数都要先判断目标容器是否存在、数据是否为空，为空时直接 `return` 并隐藏所属章节
- 空值处理统一封装一个小工具函数，例如 `hasValue(v)` 判断非空字符串，渲染前统一过滤
- 渲染函数之间不互相调用，一律由 `main.js` 统一编排

### 7.6 README 需要补充的内容

`README.md` 目前只有一行标题，实施时需补充：项目简介、在线地址、本地预览方式（直接双击 `index.html`，或用 `python -m http.server` 起本地服务）、如何修改内容（指向 `assets/js/data.js`）、如何部署到 GitHub Pages、以及本设计大纲的链接。

---

## 8. 质量约束与验收标准

本章是硬性要求，开发完成后需逐条核对。

### 8.1 无障碍（Accessibility）

- **语义化标签**：使用 `header` / `nav` / `main` / `section` / `article` / `footer`，不允许整站由 `div` 堆叠而成
- **标题层级连续**：全页只有一个 `h1`（Hero 中的姓名），章节标题用 `h2`，卡片标题用 `h3`，不得跳级
- **文字对比度**：正文与背景对比度不低于 **4.5:1**，大号标题（≥24px）不低于 3:1。亮暗两套主题都要满足。文字着色只能用 `-ink` 系列变量（见 4.1 节约束）
- **键盘可达**：所有链接、按钮、筛选器、汉堡菜单、主题切换、二维码展开都能用 Tab 聚焦并用回车触发；焦点样式使用 `:focus-visible` 绘制 2px 主色描边加 2px 偏移，**禁止使用 `outline: none` 且不给替代样式**
- **图片替代文本**：作品集封面 `alt` 写项目名；纯装饰图形一律 `aria-hidden="true"` 且不设 `alt` 文本
- **交互状态可播报**：主题切换按钮用 `aria-label` 描述当前动作，作品集筛选按钮用 `aria-pressed` 标记选中态，汉堡菜单用 `aria-expanded`
- **外链安全**：所有 `target="_blank"` 必须配 `rel="noopener noreferrer"`
- **动效可关闭**：完整实现 6.9 节的 `prefers-reduced-motion` 降级

### 8.2 响应式

- 最小适配宽度 **375px**，在该宽度下**不得出现横向滚动条**
- 需实测的四个宽度：375px、768px、1024px、1440px
- 触摸目标（按钮、链接、图标）在移动端的可点击区域不小于 44×44px
- 长文本（邮箱、项目名、机构名）需处理溢出，使用换行或省略，不允许撑破卡片
- 移动端隐藏纯装饰性元素（Hero 背景色斑、滚动提示箭头），减少视觉噪音

### 8.3 性能

- **零第三方依赖**：不引入任何框架、UI 库、动画库或 CDN 脚本
- 所有 `img` 加 `loading="lazy"` 与 `decoding="async"`，并显式声明 `width` / `height` 属性以预留空间，避免布局抖动（CLS）
- 作品集封面图单张压缩后不超过 **200KB**，推荐尺寸 1600×900
- 高频事件（`mousemove`、`scroll`、`resize`）必须节流：`mousemove` 走 `requestAnimationFrame`，`scroll` 与 `resize` 用 `requestAnimationFrame` 或时间戳节流
- 动画只使用 `transform` 与 `opacity`，**禁止对 `width` / `height` / `top` / `left` / `margin` 做动画**
- 页面在后台（`document.hidden`）时暂停眨眼定时器

### 8.4 Lighthouse 目标分数

在 Chrome 隐身窗口下对部署后的线上地址跑桌面版审计，四项均需 **≥ 90 分**：

| 项目 | 目标 |
| --- | --- |
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

### 8.5 SEO 与元信息

- `<html lang="zh-CN">`
- `<title>` 格式：`姓名 - AI 工程师`
- `meta name="description"`：一句话个人定位，控制在 80 字内
- `meta name="viewport"`：`width=device-width, initial-scale=1`
- `meta name="theme-color"`：亮暗两套分别用 `media="(prefers-color-scheme: light|dark)"` 声明
- 补充 Open Graph 标签（`og:title` / `og:description` / `og:image`），使链接分享到微信、飞书时有预览卡片
- 提供 `favicon`，可直接用漫画形象的头部裁切出的 SVG

### 8.6 代码规范

- HTML / CSS / JS 缩进统一 2 空格，文件末尾留一个空行，统一 UTF-8 编码与 LF 换行
- CSS 类名采用 BEM 风格：`.block__element--modifier`，例如 `.project-card__tag`
- CSS 属性声明顺序：定位 → 盒模型 → 排版 → 视觉表现 → 动效
- **业务样式中禁止硬编码颜色、间距、圆角、时长数值**，一律引用 `variables.css` 中的变量
- JS 统一 `const` / `let`，禁用 `var`；函数与变量用驼峰命名；常量（如 `MAX_OFFSET`）用全大写下划线
- 注释只解释「为什么这样做」和非直观的约束（例如为何用 `setAttribute` 而非 CSS `transform`），不写「// 定义变量」这类复述代码的注释
- 控制台在正常访问路径下不允许有任何报错或警告输出

### 8.7 内容完整性

- 全站不允许出现 `undefined`、`null`、`NaN` 或空白卡片
- `data.js` 中未填写的占位符 `{{...}}` 会原样显示，这是**预期行为**，用于提醒站长补全；但渲染层必须保证结构不塌陷
- 作品集每张卡的 `highlight`（量化亮点）为必填项，缺失时在控制台给出一条 `console.warn` 提示

### 8.8 开发实施顺序建议

后续开发按此顺序推进，每步完成后都应是一个可在浏览器中查看的可运行状态：

1. `index.html` 骨架 + `variables.css`（先把亮暗两套变量和一个可用的主题切换跑通，这是所有样式的基础）
2. `main.css` 基础重置、容器布局、章节标题组件
3. 吸顶导航（含滚动态、锚点高亮、移动端汉堡菜单）
4. `data.js` 填入完整占位符数据 + `icons.js` 图标集
5. Hero 文字部分与 CTA 按钮
6. 漫画形象 SVG 静态绘制（先画好静态图，确认造型满意后再加动效）
7. `character.js` 三项交互 + `animations.css` 关键帧
8. `render.js` 渲染「关于我」与「专业技能」
9. 作品集渲染 + 分类筛选 + 空状态
10. 时间线、联系我、页脚
11. 响应式逐断点调整（375 / 768 / 1024 / 1440）
12. 无障碍与 Lighthouse 自查，补充 SEO 元信息，完善 `README.md`

---

## 附录：术语与决策速查

| 问题 | 结论 |
| --- | --- |
| 用什么框架？ | 不用。纯静态 HTML + CSS + 原生 JS |
| 需要 npm install 吗？ | 不需要，本项目无构建步骤 |
| 用 TypeScript 吗？ | 不用，也不加 JSDoc 类型注释 |
| 颜色能直接写十六进制吗？ | 不能，必须引用 `variables.css` 中的变量 |
| 主色能用于正文文字吗？ | 不能，文字必须用 `--color-primary-ink` 等 `-ink` 变量 |
| 技能熟练度用进度条吗？ | 不用，用三档小圆点 |
| 漫画形象用图片吗？ | 不用，内联手写 SVG |
| 个人信息写在 HTML 里吗？ | 不写，全部集中在 `assets/js/data.js` |
| 脚本用 ES Module 吗？ | 不用，传统 `<script>` 顺序引入以支持双击预览 |
| 部署到哪？ | GitHub Pages，仓库根目录直接托管 |
