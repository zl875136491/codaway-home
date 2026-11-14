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
    statusLabel: "已上线 · CLI/ACP",
    thinkingLevels: ["minimal", "low", "medium", "high", "xhigh"],
    highlights: ["结构化工具审批 requestApproval", "原生 Goal Mode (/goal) 跨重启目标追踪", "多档推理强度与模型热切换"],
    sampleCommand: "codaway run --driver CODEX --workdir ~/repo",
  },
  {
    id: "CLAUDE_CODE",
    displayName: "Claude Code",
    shortTitle: "Claude",
    protocol: "stream-json 双向控制通道",
    badgeColor: "#d97757",
    availability: "shipped",
    statusLabel: "已上线 · CLI",
    thinkingLevels: ["default", "low", "medium", "high"],
    highlights: ["can_use_tool 细粒度命令与文件审批", "动态切换模型与 thinking.budget_tokens", "支持图片与上下文附件直传"],
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
    highlights: ["标准 ACP stdio 会话恢复与事件流", "opencode.model / mode / reasoning_effort 配置", "与 harness-shim 常驻保活无缝配合"],
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
    highlights: ["支持 Plan / Agent / YOLO 模式切换", "保留原汁原味的终端步骤输出与上下文", "适配 DeepSeek / Codewhale 本地工作流"],
    sampleCommand: "codaway run --driver DEEPSEEK_TUI --workdir ~/service",
  },
  {
    id: "ANTIGRAVITY",
    displayName: "Antigravity",
    shortTitle: "Antigravity",
    protocol: "agy acp (ACP JSON-RPC 2.0 over stdio)",
    badgeColor: "#3186ff",
    availability: "shipped",
    statusLabel: "新上线 · ACP + Reconnect",
    thinkingLevels: ["low", "medium", "high", "xhigh"],
    highlights: [
      "基于 agy acp 与 harness-shim 托管，支持断线重连恢复会话",
      "动态探测 Gemini 4 / Claude 5.5 / GPT-OSS 模型与 4 档思考深度",
      "原生支持 default / accept-edits / auto / plan 运行模式与图片输入",
    ],
    sampleCommand: "codaway run --driver ANTIGRAVITY --workdir ~/workspace",
  },
  {
    id: "CURSOR",
    displayName: "Cursor",
    shortTitle: "Cursor",
    protocol: "Cursor Agent / 云端工作流协议规范",
    badgeColor: "#e2e8f0",
    availability: "preview",
    statusLabel: "界面就绪 · 驱动接入中",
    thinkingLevels: ["default", "fast", "thinking"],
    highlights: [
      "Pocket 端已内置 Cursor 品牌标识、会话徽章与文件引用芯片视觉规范",
      "支持工作区 `@文件` 内联胶囊上下文与 /mode、fast_mode 指令面板语义",
      "Worker 侧 Cursor Agent CLI / 无头通道适配正推进接入",
    ],
    sampleCommand: "# Pocket DriverConfig · CURSOR 视觉与命令协议已就绪",
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
    highlights: ["零 AI 包装的纯正本地 Shell 控制面", "适合紧急排查日志、重启服务、检查 Git 状态", "同样受 Face ID 审批与端到端加密保护"],
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
    title: "一键环境体检与驱动探测",
    desc: "校验 Pipe 连通性、identity 私钥 0600 权限、6 大原生 Worker 驱动（含 Antigravity `agy`）与工作区状态。",
    outputLines: [
      "✓ pipe   https://codaway-users.13dot8billion.site  (healthy · 18ms)",
      "✓ keys   ~/.codaway/identity.json (mode 0600 · Ed25519 + X25519)",
      "✓ driver CODEX · CLAUDE_CODE · OPENCODE · DEEPSEEK_TUI · ANTIGRAVITY · SHELL (6/6 ready)",
      "✓ shim   ~/.codaway/shims/ (2 detached daemons reattachable)",
    ],
  },
  {
    id: "start-pair",
    cmd: "codaway start --pair",
    title: "反向建链 · 手动扫码确认配对",
    desc: "不监听任何公网入站端口。同账号手机不会静默自动信任，必须扫码或核对短码指纹二次确认。",
    outputLines: [
      "● daemon connected via wss://codaway-users.13dot8billion.site/v1/ws",
      "● pair code: 749-281  [QR rendered in terminal]",
      "✓ mobile fingerprint verified: iPhone 16 Pro · ShortCode 8F3A-C21D",
      "✓ trusted peer saved to local sqlite store",
    ],
  },
  {
    id: "service",
    cmd: "codaway service install && codaway service start",
    title: "launchd / systemd 常驻后台与版本管理器探测",
    desc: "自动识别 nvm / fnm / volta / homebrew 等路径管理下的 CLI，开机自启、合盖不失联。",
    outputLines: [
      "✓ installed launchd agent: ~/Library/LaunchAgents/site.13dot8billion.codaway.plist",
      "✓ PATH discovery resolved: /opt/homebrew/bin, ~/.nvm/versions/node",
      "✓ harness-shim enabled (4 MiB replay ring buffer per session)",
    ],
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
    tag: "CPS-v1.2 · End-to-End Encrypted Frames",
    title: "X25519 + ChaCha20-Poly1305 盲中继封包",
    detail: "手机与电脑本地完成 X25519 ECDH 密钥协商与 HKDF-SHA256 双向密钥派生（w2p / p2w），帧头作为 AAD 参与认证，严格递增 64-bit counter 防重放。",
    spec: "[uint16be headerLen][AAD][ChaCha20-Poly1305 + zstd]",
  },
  {
    tag: "harness-shim · 守护进程生命周期解耦",
    title: "Worker 升级或重启，AI 任务照常运行",
    detail: "通过隐藏子命令 codaway harness-shim 以独立 Unix Domain Socket 守护进程托管底层 CLI，并内置 4 MiB 环形回放缓冲区，重连即续接输出流。",
    spec: "Unix Socket Proxy · 4 MiB Replay Ring Buffer",
  },
  {
    tag: "Zero-Knowledge R2 + MCP Compressed Cards",
    title: "15 分钟临时加密附件与移动端原生压缩卡片",
    detail: "代码diff、图片与大文件在端侧随机对称加密后直传 R2 并 15 分钟自动过期；内置 codaway mcp-serve 让 Claude/Codex 直接产出结构化轻量卡片。",
    spec: "R2 15-min TTL Presigned Blobs · mcp-serve",
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
    badge: "已上线 Shipped",
    title: "Pocket 悬浮输入重构 + Antigravity ACP 驱动 + @文件芯片",
    subtitle: "当前生产代码库（codaway-worker · codaway-pipe · codaway-pocket）已落地核心能力",
    items: [
      {
        scope: "Pocket iOS",
        name: "悬浮半透明输入框（\"接下来...\"）与居中回底按钮",
        detail: "移除底部遮罩，输入框以紧凑毛玻璃胶囊悬浮于对话上下文之上；向上浏览历史消息时在输入框正上方居中浮现回到底部按钮。",
      },
      {
        scope: "Pocket iOS",
        name: "@ 快捷文件全高浮层与行内引用芯片（带 × 删除）",
        detail: "输入 @ 弹出高密度文件选择浮层，支持一键收缩与选定文件嵌入为独立着色胶囊（含一键 × 移除）；兼容图片 /photo 与本地文件 /file 加密直传。",
      },
      {
        scope: "Pocket iOS",
        name: "统一品牌驱动图标 · 三列指令面板 · AffectUI Clean",
        detail: "全端切换为统一 brand_icons 资产（含 Codex / Claude / OpenCode / Codewhale / Antigravity / Cursor），配合 ≡ 快捷指令宫格与会话列表右下角驱动徽章。",
      },
      {
        scope: "Worker",
        name: "Antigravity (agy acp) 原生驱动与重连支持",
        detail: "新增 Antigravity ACP JSON-RPC 驱动，支持 agy models 动态探测、4 档思考深度、default/accept-edits/auto/plan 模式及本地图片上下文。",
      },
      {
        scope: "Worker",
        name: "OpenCode ACP 驱动 & Codex Goal Mode",
        detail: "支持 Codex Goal Mode (/goal) 与 OpenCode ACP JSON-RPC 跨重启恢复，已全面上线 Codex / Claude Code / OpenCode / Codewhale / Antigravity / Shell 六大驱动。",
      },
      {
        scope: "Worker + Pipe",
        name: "harness-shim 守护解耦 & 零知识 R2 中转",
        detail: "agent CLI 由独立 Unix Socket Proxy 托管并带 4 MiB 环形回放缓冲；Pipe 内嵌管理后台，支持 32 帧离线缓冲与 15 分钟 TTL R2 加密附件。",
      },
    ],
  },
  {
    status: "in-progress",
    badge: "推进中 In Progress",
    title: "Cursor Agent 驱动接入 · APNs 推送与灵动岛",
    subtitle: "打通 Cursor 工作流驱动实现，同时实现后台离线审批与长任务实时状态触达",
    items: [
      {
        scope: "Worker + Pocket",
        name: "Cursor (`CURSOR`) 驱动后端协议适配",
        detail: "在已完成 Pocket 端品牌资源与 DriverConfig 映射的基础上，推进 Worker 侧 Cursor Agent CLI / 无头模式驱动接入及工作区 @ 引用对齐。",
      },
      {
        scope: "Pipe + iOS",
        name: "APNs 静默唤醒与审批直达通知",
        detail: "待苹果开发者账号资质就绪后启用 APNs 能力，在 Pocket 退后台或锁屏时对 APPROVAL_REQUEST 与 TURN_DONE 下发加密推送。",
      },
      {
        scope: "Pocket iOS",
        name: "灵动岛 Dynamic Island Live Activity",
        detail: "将 AgentMonitor 的当前执行步骤、已耗时与状态实时映射到锁屏卡片与灵动岛（待签名资质完备后启用）。",
      },
    ],
  },
  {
    status: "planned",
    badge: "路线规划 Planned",
    title: "P2P 局域网直连、多工作站协同与TestFlight 公测",
    subtitle: "进一步降低同局域网延迟并开放更广泛的团队协作与发行通道",
    items: [
      {
        scope: "CPS-v1.3",
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
