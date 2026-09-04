/* ==========================================================
 * 个人信息与内容数据 —— 修改本文件即可更新整站内容
 * 带 {{}} 的是待填占位符，可选字段留空字符串则该项不显示
 * 本文件为纯数据声明，不含任何渲染逻辑
 * ========================================================== */

/** 基本信息，渲染到 Hero 与「关于我」章节 */
const profile = {
  name:        "{{姓名}}",
  englishName: "{{英文名}}",       // 可选，为空则 Hero 不显示英文名
  age:         "{{年龄}}",
  gender:      "女",
  title:       "AI 工程师",
  tagline:     "{{一句话个人定位}}", // 例：让大模型真正落地到业务里
  location:    "{{所在城市}}",
  education:   "{{学校 / 专业 / 学历}}",
  email:       "{{邮箱}}",
  github:      "{{GitHub 主页链接}}",
  wechatQr:    "assets/img/wechat-qr.png", // 为空则不显示微信卡片
  resume:      "assets/resume.pdf",        // 为空则隐藏「下载简历」按钮
  jobStatus:   "{{求职状态}}",             // 可选，例：在职 / 考虑新机会
  bio:         "{{2-3 句自我介绍}}",
  keywords:    ["大模型应用", "RAG", "持续学习"], // 「关于我」下方的关键词标签
};

/** 专业技能，四个分组。level 取值 1/2/3，含义见设计大纲 5.4 */
const skillGroups = [
  {
    category: "机器学习与深度学习",
    icon: "brain",
    items: [
      { name: "PyTorch",       level: 3 },
      { name: "Transformers",  level: 3 },
      { name: "scikit-learn",  level: 2 },
      { name: "CNN / RNN",     level: 2 },
      { name: "模型评估与调优", level: 2 },
    ],
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
      { name: "向量数据库",        level: 2 },
    ],
  },
  {
    category: "编程与工程",
    icon: "code",
    items: [
      { name: "Python",  level: 3 },
      { name: "SQL",     level: 2 },
      { name: "FastAPI", level: 2 },
      { name: "Docker",  level: 2 },
      { name: "Git",     level: 3 },
      { name: "Linux",   level: 2 },
    ],
  },
  {
    category: "数据与部署",
    icon: "server",
    items: [
      { name: "Pandas / NumPy",   level: 3 },
      { name: "数据清洗与标注",    level: 3 },
      { name: "MLflow",           level: 2 },
      { name: "ONNX / 模型量化",   level: 1 },
      { name: "云平台部署",        level: 2 },
    ],
  },
];

/** 作品集。category 必须是 llm / cv / nlp / data 之一 */
const projects = [
  {
    id:        "proj-1",
    title:     "{{项目名称：大模型方向}}",
    category:  "llm",
    summary:   "{{一句话项目简介，控制在 40 字内}}",
    cover:     "", // 为空则用「主色→薄荷绿」渐变兜底封面
    tags:      ["PyTorch", "LoRA", "FastAPI", "RAG"],
    highlight: "{{量化成果，如：推理延迟 ↓ 40%}}", // 必填
    repo:      "{{仓库链接}}", // 为空则隐藏该按钮
    demo:      "{{在线演示链接}}", // 为空则隐藏该按钮
  },
  {
    id:        "proj-2",
    title:     "{{项目名称：CV 方向}}",
    category:  "cv",
    summary:   "{{一句话项目简介，控制在 40 字内}}",
    cover:     "",
    tags:      ["PyTorch", "OpenCV", "ONNX"],
    highlight: "{{量化成果，如：mAP 提升 8 个点}}",
    repo:      "",
    demo:      "",
  },
  {
    id:        "proj-3",
    title:     "{{项目名称：NLP 方向}}",
    category:  "nlp",
    summary:   "{{一句话项目简介，控制在 40 字内}}",
    cover:     "",
    tags:      ["Transformers", "LangChain", "向量数据库"],
    highlight: "{{量化成果，如：召回率 92%}}",
    repo:      "",
    demo:      "",
  },
  {
    id:        "proj-4",
    title:     "{{项目名称：数据分析方向}}",
    category:  "data",
    summary:   "{{一句话项目简介，控制在 40 字内}}",
    cover:     "",
    tags:      ["Pandas", "NumPy", "MLflow"],
    highlight: "{{量化成果，如：分析效率 ↑ 3 倍}}",
    repo:      "",
    demo:      "",
  },
];

/** 作品集筛选分类，value 需与 projects[].category 对应 */
const projectCategories = [
  { value: "all",  label: "全部" },
  { value: "llm",  label: "大模型" },
  { value: "cv",   label: "计算机视觉" },
  { value: "nlp",  label: "自然语言处理" },
  { value: "data", label: "数据分析" },
];

/** 经历时间线，按时间倒序排列。type 取 edu / work。数组为空则整个章节不渲染 */
const timeline = [
  {
    type:   "work",
    period: "{{起止时间，如：2023.07 — 至今}}",
    org:    "{{公司名称}}",
    role:   "{{职位}}",
    desc:   "{{1-2 句职责与成果描述}}",
  },
  {
    type:   "edu",
    period: "{{起止时间}}",
    org:    "{{学校名称}}",
    role:   "{{专业 / 学位}}",
    desc:   "{{可选，主修方向或荣誉}}",
  },
];

/* Node 环境下导出供单元测试；浏览器中 module 未定义，const 变量按
 * 经典脚本的脚本级词法作用域被其它 <script> 共享，不受影响。 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    profile: profile,
    skillGroups: skillGroups,
    projects: projects,
    projectCategories: projectCategories,
    timeline: timeline,
  };
}
