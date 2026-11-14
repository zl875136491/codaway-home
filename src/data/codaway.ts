export type DriverKey = "CODEX" | "CLAUDE_CODE" | "OPENCODE" | "DEEPSEEK_TUI" | "SHELL";

export interface DriverSpec {
  id: DriverKey;
  displayName: string;
  shortTitle: string;
  protocol: string;
  badgeColor: string;
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
    thinkingLevels: ["minimal", "low", "medium", "high", "xhigh"],
    highlights: ["结构化工具审批 requestApproval", "原生 Goal Mode 跨重启目标追踪", "实时推理强度热切换"],
    sampleCommand: "codaway run --driver CODEX --workdir ~/repo",
  },
  {
    id: "CLAUDE_CODE",
    displayName: "Claude Code",
    shortTitle: "Claude",
    protocol: "stream-json 双向控制通道",
    badgeColor: "#d97757",
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
    thinkingLevels: ["default", "deep"],
    highlights: ["支持 Plan / Agent / YOLO 模式切换", "保留原汁原味的终端步骤输出与上下文", "适配 DeepSeek / Codewhale 本地工作流"],
    sampleCommand: "codaway run --driver DEEPSEEK_TUI --workdir ~/service",
  },
  {
    id: "SHELL",
    displayName: "终端 (Shell)",
    shortTitle: "Shell",
    protocol: "原生 PTY 交互终端",
    badgeColor: "#94a3b8",
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
    desc: "校验 Pipe 连通性、identity 私钥 0600 权限、5 大 AI 驱动可执行路径与工作区状态。",
    outputLines: [
      "✓ pipe   https://codaway-users.13dot8billion.site  (healthy · 18ms)",
      "✓ keys   ~/.codaway/identity.json (mode 0600 · Ed25519 + X25519)",
      "✓ driver CODEX · CLAUDE_CODE · OPENCODE · DEEPSEEK_TUI · SHELL (5/5 ready)",
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
    title: "Pocket AffectUI 重构 + Worker harness-shim + OpenCode ACP",
    subtitle: "当前生产代码库（codaway-worker · codaway-pipe · codaway-pocket）已落地核心能力",
    items: [
      {
        scope: "Pocket iOS",
        name: "AffectUI Clean 统一设计系统 & 主题引擎",
        detail: "基于 ThemeManager + PocketAffectUITheme 驱动 Space / Terminal / Cyberpunk 三套主题及深浅模式，统一收拢色彩、圆角、图标与文案。",
      },
      {
        scope: "Pocket iOS",
        name: "全新对话输入区与内联 ModelPicker",
        detail: "未聚焦为紧凑 ... 全圆角胶囊（+ 附件 / 斜杠指令菜单），聚焦上拉拓展为带顶部拖拽 Handle 的多行输入区与左下角内联模型/思考强度配置器（支持分轴独立转圈锁定）。",
      },
      {
        scope: "Pocket iOS",
        name: "AgentMonitor · ThinkingLoader · Face ID 审批卡片",
        detail: "任务执行进度卡改为驱动圆形图标并支持历史折叠胶囊保留；集成 ThinkingLoader 思考动画、ApprovalCard Face ID 校验、DecisionCard 选择卡与 Toaster 全局通知。",
      },
      {
        scope: "Pocket iOS",
        name: "时间线渲染性能优化 & Git 检查器",
        detail: "壁纸预栅格化缓存、卡片离屏阴影优化、时间戳 Formatter 缓存与按日消息分组归并；支持工作区 Git 变更统计与 Checkout 回滚。",
      },
      {
        scope: "Worker",
        name: "OpenCode ACP 驱动 & Codex Goal Mode",
        detail: "新增 OpenCode 标准 ACP JSON-RPC 驱动，支持 Codex Goal Mode 跨重启状态桥接，全覆盖 Claude Code / Codex / OpenCode / Codewhale / Shell 五大驱动。",
      },
      {
        scope: "Worker",
        name: "harness-shim 守护解耦 & launchd 服务强化",
        detail: "agent CLI 由独立 Unix Socket Proxy 托管并带 4 MiB 回放缓冲区；完善 version-managed CLI 路径探测与 codaway doctor 诊断。",
      },
      {
        scope: "Pipe Relay",
        name: "嵌入式管理后台与 R2 零知识中转",
        detail: "Pipe 进程内嵌 Admin Console 与中继遥测面板，强化设备归属校验、32 帧离线缓冲投递与 15 分钟 TTL 加密附件中转。",
      },
    ],
  },
  {
    status: "in-progress",
    badge: "推进中 In Progress",
    title: "APNs 实时推送与锁屏 Live Activity",
    subtitle: "即使 Pocket 退到后台或锁屏，高危审批与长任务完成也能秒级触达",
    items: [
      {
        scope: "Pipe + iOS",
        name: "APNs 静默唤醒与审批直达通知",
        detail: "当 Worker 发出 APPROVAL_REQUEST 或 TURN_DONE 而长连接离线时，Pipe 通过最小脱敏负载下发 APNs 高优推送。",
      },
      {
        scope: "Pocket iOS",
        name: "灵动岛 Dynamic Island Live Activity",
        detail: "将 AgentMonitor 的当前执行步骤、已耗时与状态实时映射到锁屏卡片与灵动岛。",
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
