export type DriverKey =
  | "CODEX"
  | "CLAUDE_CODE"
  | "OPENCODE"
  | "DEEPSEEK_TUI"
  | "ANTIGRAVITY"
  | "CURSOR"
  | "SHELL";

export interface DriverSpec {
  id: DriverKey;
  displayName: string;
  shortTitle: string;
  protocol: string;
  badgeColor: string;
  availability: "shipped" | "preview";
  statusLabel: string;
  thinkingLevels: string[];
  highlights: string[];
  sampleCommand: string;
}

export const DRIVERS: DriverSpec[] = [
  {
    id: "CODEX",
    displayName: "Codex",
    shortTitle: "Codex",
    protocol: "app-server JSON-RPC + PTY",
    badgeColor: "#29b5f5",
    availability: "shipped",
    statusLabel: "已上线 · CLI + 额度监控",
    thinkingLevels: ["minimal", "low", "medium", "high", "xhigh"],
    highlights: [
      "结构化工具审批 requestApproval 与原生 /goal 目标追踪",
      "支持 /quota 通过 app-server JSON-RPC 实时采集 5 小时与周限额",
      "自动装配跨驱动 Shift MCP，支持会话内 /shift 无缝切换其他驱动",
    ],
    sampleCommand: "codaway run --driver CODEX --workdir ~/repo",
  },
  {
    id: "CLAUDE_CODE",
    displayName: "Claude Code",
    shortTitle: "Claude",
    protocol: "stream-json 双向控制通道",
    badgeColor: "#d97757",
    availability: "shipped",
    statusLabel: "已上线 · CLI + MCP",
    thinkingLevels: ["default", "low", "medium", "high"],
    highlights: [
      "can_use_tool 细粒度命令与文件审批 + Face ID 认证策略",
      "启用时自动配置宿主与跨驱动 Shift MCP，一键上下文接力",
      "动态切换模型、thinking.budget_tokens 与图片附件直传",
    ],
    sampleCommand: "codaway run --driver CLAUDE_CODE --model claude-sonnet-4-6",
  },
  {
    id: "OPENCODE",
    displayName: "OpenCode",
    shortTitle: "OpenCode",
    protocol: "ACP (Agent Client Protocol JSON-RPC 2.0)",
    badgeColor: "#00d48a",
    availability: "shipped",
    statusLabel: "已上线 · ACP",
    thinkingLevels: ["default", "low", "medium", "high"],
    highlights: [
      "标准 ACP stdio 会话恢复、opencode.model 与推理强度热切换",
      "全面融入 Shift 项目管家上下文，遵循项目红线规约与归因日志",
      "与 harness-shim 常驻保活及 /shift 驱动切换无缝配合",
    ],
    sampleCommand: "codaway run --driver OPENCODE --workdir ~/app",
  },
  {
    id: "DEEPSEEK_TUI",
    displayName: "Codewhale (DS-TUI)",
    shortTitle: "Codewhale",
    protocol: "PTY 交互式终端驱动",
    badgeColor: "#638cff",
    availability: "shipped",
    statusLabel: "已上线 · PTY",
    thinkingLevels: ["default", "deep"],
    highlights: [
      "支持 Plan / Agent / YOLO 模式切换与多档思考预算调节",
      "保留原汁原味的终端步骤输出与上下文，完整接入 Shift 接力",
      "适配 DeepSeek / Codewhale 本地研发工作流",
    ],
    sampleCommand: "codaway run --driver DEEPSEEK_TUI --workdir ~/service",
  },
  {
    id: "ANTIGRAVITY",
    displayName: "Antigravity",
    shortTitle: "Antigravity",
    protocol: "agy acp (ACP JSON-RPC 2.0 over stdio)",
    badgeColor: "#3186ff",
    availability: "shipped",
    statusLabel: "已上线 · ACP + 额度监控",
    thinkingLevels: ["low", "medium", "high", "xhigh"],
    highlights: [
      "基于 agy acp 与 harness-shim 托管，支持断线重连与 Gemini 4 / Claude 5.5 探测",
      "支持 /quota 自动解析 agy /usage 面板各模型池 5 小时 / 周剩余额度与倒计时",
      "原生支持 default / accept-edits / auto / plan 模式、图片输入与 /shift 切换",
    ],
    sampleCommand: "codaway run --driver ANTIGRAVITY --workdir ~/workspace",
  },
  {
    id: "CURSOR",
    displayName: "Cursor",
    shortTitle: "Cursor",
    protocol: "cursor-agent acp (ACP JSON-RPC 2.0 over stdio)",
    badgeColor: "#e2e8f0",
    availability: "shipped",
    statusLabel: "已上线 · ACP + 额度监控",
    thinkingLevels: ["default", "fast", "thinking"],
    highlights: [
      "原生接入 cursor-agent acp，支持 Agent / Plan / Ask 模式实时切换",
      "通过 macOS 钥匙串令牌对接 Dashboard RPC 实时查询月度与周度模型额度",
      "支持工作区 `@文件` 内联胶囊上下文与 /shift 跨 Agent 上下文继承",
    ],
    sampleCommand: "codaway run --driver CURSOR --workdir ~/workspace",
  },
  {
    id: "SHELL",
    displayName: "终端 (Shell)",
    shortTitle: "Shell",
    protocol: "原生 PTY 交互终端",
    badgeColor: "#94a3b8",
    availability: "shipped",
    statusLabel: "已上线 · PTY",
    thinkingLevels: ["default"],
    highlights: [
      "零 AI 包装的纯正本地 Shell 控制面，完整归属于项目仓库上下文",
      "适合紧急排查日志、重启服务、检查 Git 状态",
      "同样受按工作站隔离的 Face ID 审批策略与端到端加密保护",
    ],
    sampleCommand: "codaway run --driver SHELL --workdir ~/ops",
  },
];

export interface WorkerCommandCard {
  id: string;
  cmd: string;
  title: string;
  desc: string;
  outputLines: string[];
}

export const WORKER_COMMANDS: WorkerCommandCard[] = [
  {
    id: "doctor",
    cmd: "codaway doctor",
    title: "一键环境体检、驱动启用管理与自动 MCP 装配",
    desc: "校验 Pipe 连通性、私钥权限、`enabled_drivers` 热配置、跨驱动 Shift MCP 自动挂载以及工作区 Git 拓扑状态。",
    outputLines: [
      "✓ pipe    https://codaway-users.13dot8billion.site  (healthy · 18ms)",
      "✓ keys    ~/.codaway/identity.json (mode 0600 · Ed25519 + X25519)",
      "✓ mcp     host & cross-driver shift MCP synced automatically on enable",
      "✓ drivers CODEX · CLAUDE_CODE · ANTIGRAVITY · CURSOR · OPENCODE · SHELL ready",
    ],
  },
  {
    id: "start-pair",
    cmd: "codaway start --pair",
    title: "反向建链 · 手动扫码确认配对",
    desc: "不监听任何公网入站端口。同账号手机必须通过二维码或短码指纹确认配对，配对后独立保存各工作站安全与下载策略。",
    outputLines: [
      "● daemon connected via wss://codaway-users.13dot8billion.site/v1/ws",
      "● pair code: 749-281  [QR rendered in terminal]",
      "✓ mobile fingerprint verified: iPhone 16 Pro · ShortCode 8F3A-C21D",
      "✓ workstation-scoped policies isolated per paired device ID",
    ],
  },
  {
    id: "shift-quota",
    cmd: "codaway shift projects && codaway agent enable cursor",
    title: "Shift 项目管家调度 · 驱动开关热加载与额度探针",
    desc: "以 Shift 项目为中心管理多仓库、子项目 .git/info/exclude 防冲突、AES-GCM 加密凭据、流水线与 /quota 多引擎额度采集。",
    outputLines: [
      "✓ shift   scanned 2 sub-repos -> excluded in root .git/info/exclude",
      "✓ quota   codex (5h: 68% left) · cursor (month: 82% left) · agy (/usage ok)",
      "✓ handoff ready: /shift preserves project rules, ADR & session context",
    ],
  },
  {
    id: "service",
    cmd: "codaway service install && codaway service start",
    title: "launchd / systemd 常驻后台与版本管理器探测",
    desc: "自动识别 nvm / fnm / volta / homebrew 等路径管理下的 CLI 与钥匙串凭据，开机自启、合盖不失联。",
    outputLines: [
      "✓ installed launchd agent: ~/Library/LaunchAgents/site.13dot8billion.codaway.plist",
      "✓ PATH discovery resolved: /opt/homebrew/bin, ~/.nvm/versions/node",
      "✓ harness-shim enabled (4 MiB replay ring buffer per session)",
    ],
  },
];

export interface StewardFeatureCard {
  tag: string;
  title: string;
  desc: string;
  highlights: string[];
}

export const STEWARD_SHOWCASE_FEATURES: StewardFeatureCard[] = [
  {
    tag: "Shift Project Steward · 项目管家",
    title: "项目中心化多仓库治理，默认防嵌套 Git 冲突",
    desc: "会话统一从项目详情发起；新建项目时自动初始化缺失的本地 Git，探测独立子项目并在根仓库 .git/info/exclude 自动局部忽略，避免双层 Git 重叠污染。",
    highlights: ["单页全量项目详情（日志置底）", "Engineering Rules & ADR 技术决策", "AES-GCM 加密凭据脱敏预览 & 一键流水线"],
  },
  {
    tag: "Cross-Agent Handoff · /shift 热接力",
    title: "同会话带图标切换驱动，启用即自动配置 MCP",
    desc: "在会话内点击 /shift 即可在 Codex、Claude Code、Antigravity、Cursor 等驱动间无缝接力并继承项目上下文；Worker 启用驱动时自动写入 MCP 配置，零手动折腾。",
    highlights: ["启用驱动自动同步跨 Agent MCP", "配额触发或人工发起上下文摘要交接", "驱动开关 enabled_drivers 热重载"],
  },
  {
    tag: "Multi-Agent Quota · /quota 卡片",
    title: "AffectUI UsageMeter 原生 SwiftUI 额度监视器",
    desc: "参考 token-calendar 打通三大订阅源，在会话 `/` 菜单与设置页「模型额度」呈现标准化额度卡片；≥80% 橙色预警、100% 触顶红标，精准显示重置倒计时。",
    highlights: ["Codex: app-server JSON-RPC 5h/周", "Cursor: 钥匙串 JWT + Dashboard RPC", "Antigravity: agy /usage 伪终端面板爬取"],
  },
];

export const ARCHITECTURE_PILLARS = [
  {
    tag: "零入站端口 · Out-of-Band Reverse Relay",
    title: "Worker 主动外连，防火墙与 NAT 零改动",
    detail: "Mac Studio、WSL2、云服务器或实验室内网机器只需运行 codaway start，通过出站 WebSocket 连接盲转发中继 Pipe，外部扫描器看不到任何监听端口。",
    spec: "Ed25519 Signed WS Challenge + Outbound 443",
  },
  {
    tag: "CPS-v1.3 · Project Steward & Quota Frames",
    title: "端到端密文信封承载项目、/shift 与 /quota",
    detail: "手机与电脑本地完成 X25519 ECDH 密钥协商与 ChaCha20-Poly1305 封包，Relay 永不窥探明文；全面承载 `SHIFT_*`、`TASK_SHIFT_*` 与 `AGENT_QUOTA_REQ/RESP`。",
    spec: "[uint16be headerLen][AAD][ChaCha20-Poly1305 + zstd]",
  },
  {
    tag: "harness-shim + Work Logs Attribution",
    title: "守护进程解耦保活 + 多 Agent 协作归因",
    detail: "codaway harness-shim 独立托管底层 CLI 并保留 4 MiB 环形回放缓冲；所有代码修改、驱动切换与流水线执行均按项目沉淀为可追溯的协作归因日志。",
    spec: "Unix Socket Proxy · 4 MiB Ring · Attribution Store",
  },
  {
    tag: "Per-Workstation Policies · R2 E2EE Blobs",
    title: "按工作站隔离设置策略与 15 分钟加密附件",
    detail: "模型额度缓存、文件/图片自动下载阈值以及 Face ID 审批策略严格按已配对的工作站 ID 独立存储，不同机器互不干扰；大文件 R2 分块密传并 15 分钟自动过期。",
    spec: "Per-Worker Scope · Keychain Policy · R2 15m TTL",
  },
];

export interface RoadmapSection {
  status: "shipped" | "in-progress" | "planned";
  badge: string;
  title: string;
  subtitle: string;
  items: {
    scope: string;
    name: string;
    detail: string;
  }[];
}

export const ROADMAP_SECTIONS: RoadmapSection[] = [
  {
    status: "shipped",
    badge: "已上线 · 最新版本 Shipped",
    title: "Shift 项目管家架构 · /shift 跨驱动接力 · 多 Agent /quota 额度与 Pocket 原生控制台",
    subtitle: "codaway-worker、codaway-pipe 与 codaway-pocket 三端已全面上线并完成端到端联调与构建验证",
    items: [
      {
        scope: "Worker + Pipe + Pocket",
        name: "Shift 项目管家全链路（以项目替代松散目录）",
        detail: "建立项目中心化管理视图：支持多关联仓库、工程红线规约、ADR 决策、AES-GCM 加密凭据、受控流水线及全量 Agent 协作归因日志（详情单页一体展示，日志置底）。",
      },
      {
        scope: "Worker Shift Engine",
        name: "自动化 Git 初始化 · 子项目 .git/info/exclude 防重叠隔离",
        detail: "接入无 Git 目录时自动初始化本地仓；扫描嵌套独立 Git 子仓库并自动罗列至项目仓库面板，同时写入根仓 `.git/info/exclude` 防止版本控制重叠冲突。",
      },
      {
        scope: "Worker + MCP",
        name: "/shift 跨 Agent 热接力与驱动启用自动配置 MCP",
        detail: "支持同会话热切换不同驱动并延续上下文与规约摘要；启用或安装驱动时自动配置宿主与跨驱动 Shift MCP，并支持 `enabled_drivers` 热重载探测。",
      },
      {
        scope: "Worker + AffectUI",
        name: "多 Agent 实时模型额度采集 (/quota) & UsageMeter Swift 化",
        detail: "实现 Codex (app-server JSON-RPC)、Cursor (macOS Keychain + Connect RPC) 与 Antigravity (agy /usage PTY) 并发额度采集，并将 AffectUI `usage-meter-clean` 原生 SwiftUI 化呈现。",
      },
      {
        scope: "Pocket iOS",
        name: "原生四栏合一 TabView + 上下文蒙版搜索与输入法搜索框",
        detail: "底栏采用 iOS 原生会话 / 项目 / 设置 / 搜索四项合一架构；点击「搜索」在当前页直接弹出毛玻璃蒙版、自动唤起输入法与上方搜索条，支持一键跳转结果定位。",
      },
      {
        scope: "Pocket iOS",
        name: "原生 iOS 分格设置与严格按工作站隔离策略",
        detail: "采用无主题的原生 iOS 分格圆角卡片呈现多级设置；模型额度、自动下载策略与审批 Face ID/有效期均按具体工作站独立生效，工作站列表专注配对入口。",
      },
    ],
  },
  {
    status: "shipped",
    badge: "已上线 Shipped",
    title: "Pocket 悬浮输入重构 · 七大原生驱动 · Git 进阶工作流与 R2 加密中继",
    subtitle: "已稳定运行于生产代码库的基础控制平面与移动端交互核心",
    items: [
      {
        scope: "Pocket iOS",
        name: "悬浮半透明输入框（\"接下来...\"）、居中回底按钮与 @ 文件芯片",
        detail: "输入框以紧凑毛玻璃胶囊悬浮于对话上方，向上浏览历史时自动浮出回底按钮；输入 @ 弹出全高文件浮层并以内嵌可移除胶囊引用上下文。",
      },
      {
        scope: "Worker",
        name: "Codex / Claude Code / Antigravity / Cursor / OpenCode / Codewhale / Shell",
        detail: "全面覆盖七大原生终端与 ACP 驱动，结合 `harness-shim` 独立守护解耦（Worker 重启不断会），支持 /goal、/mode、/thinking 与 Face ID 危险指令审批。",
      },
      {
        scope: "Worker + Pocket",
        name: "Git 进阶工作流 · 分片大文件加密 · 公告通知中心",
        detail: "支持分支切换与创建、Stash 栈管理、Hunk 级暂存/还原、`chunked_v1` 分块 R2 端到端直传、下载取消与 Rich HTML 系统公告/强弹窗通知中心。",
      },
      {
        scope: "Pipe + All",
        name: "Free / Pro 配额治理 · StoreKit 2 验签 · TOTP 安全保护",
        detail: "Free（1 Worker / 1 Pocket / 2 并发会话）与 Pro（4 Workers / 不限 Pocket / 10 并发会话）实时治理，全面支持两步验证 TOTP 与 Apple 内购服务端校验。",
      },
    ],
  },
  {
    status: "in-progress",
    badge: "推进中 In Progress",
    title: "APNs 扩展与灵动岛分发上架准备",
    subtitle: "三端线协议、StoreKit 2 验签与 NSE / Widget 代码已就绪，待苹果开发者签名资质后启用扩展打包",
    items: [
      {
        scope: "Pipe + iOS",
        name: "APNs 静默唤醒、NSE 解密扩展与审批直达通知",
        detail: "Worker 与 Pipe 已对齐 key_id/push_counter 线协议、异步重试与 410 无效令牌自动清理；待付费开发者账号启用 App Group 能力后即随主应用打包签名。",
      },
      {
        scope: "Pocket iOS",
        name: "灵动岛 Dynamic Island Live Activity & App Store 内购上架",
        detail: "WidgetKit Live Activity 视图与 StoreKit 2 / ASSN V2 服务端 JWS 验签均已就绪，待苹果开发者账号资质完备后启用扩展依赖与正式内购。",
      },
    ],
  },
  {
    status: "planned",
    badge: "路线规划 Planned",
    title: "P2P 局域网直连、多工作站协同与 TestFlight 公测",
    subtitle: "进一步降低同局域网延迟并开放更广泛的团队协作与发行通道",
    items: [
      {
        scope: "CPS-v1.4",
        name: "WebRTC / mDNS 局域网直连加速",
        detail: "同 Wi-Fi 下自动建立端到端数据通道用于高频终端日志流传输，公网 Pipe 自动退居信令与离线兜底。",
      },
      {
        scope: "Portal",
        name: "TestFlight 公测与 Homebrew 一键分发",
        detail: "提供 brew install codaway-worker 与 TestFlight 公开邀请链接，完善团队多工作站权限审计。",
      },
    ],
  },
];
