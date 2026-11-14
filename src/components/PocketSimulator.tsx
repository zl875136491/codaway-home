import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Cpu,
  FolderGit2,
  GitBranch,
  Lock,
  Moon,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  Slash,
  Sparkles,
  Sun,
  Terminal,
  Wifi,
  X,
} from "lucide-react";
import {
  buildAffectCssVars,
  POCKET_THEMES,
  type PocketColorScheme,
  type PocketThemeId,
} from "../theme/pocketTheme";
import { DRIVERS } from "../data/codaway";
import { DriverIcon } from "./DriverIcon";
import { AgentMonitor, type AgentRunStep } from "./affectui/ui/agent-monitor-clean";
import { ApprovalCard, type ApprovalStatus } from "./affectui/ui/approval-card-clean";
import { DecisionCard, type Decision } from "./affectui/ui/decision-card-clean";
import { ModelPicker, type ModelEffort, type PickerModel } from "./affectui/ui/model-picker-clean";
import { ThinkingLoader } from "./affectui/ui/thinking-loader-clean";
import { Toaster, toast } from "./affectui/ui/toaster-clean";

type PhoneScreenTab = "chat" | "workstations" | "git";

const POCKET_TOASTER_ID = "pocket-sim-phone";

const PICKER_MODELS: PickerModel[] = [
  { id: "gpt-5.4", name: "GPT-5.4", description: "默认主力推理与代码重构", speed: 4, quality: 5, cost: 3 },
  { id: "gpt-5.4-mini", name: "GPT-5.4 Mini", description: "超低延迟日常检索与小改动", speed: 5, quality: 4, cost: 1 },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", description: "长上下文代码审查与测试生成", speed: 4, quality: 5, cost: 3 },
  { id: "opencode-acp", name: "OpenCode ACP", description: "标准 ACP 会话托管与多工具调用", speed: 4, quality: 4, cost: 2 },
];

const EFFORT_OPTIONS: { id: ModelEffort; label: string }[] = [
  { id: "low", label: "低" },
  { id: "medium", label: "中" },
  { id: "high", label: "高" },
  { id: "xhigh", label: "极高" },
];

const INITIAL_STEPS: AgentRunStep[] = [
  {
    id: "step-1",
    label: `zsh -lc "sed -n '1,60p' deploy/nginx/codaway-users.conf"`,
    kind: "read",
    state: "done",
    took: 11200,
    tool: "Shell",
    detail: "核对静态资源缓存策略与 /v1 反向代理规则",
    output: "location /assets/ { expires 1y; add_header Cache-Control \"public, max-age=31536000, immutable\"; }",
  },
  {
    id: "step-2",
    label: `zsh -lc "go test ./internal/shim ./internal/driver/opencode"`,
    kind: "run",
    state: "done",
    took: 28400,
    tool: "Go Test",
    detail: "验证 harness-shim 环形回放缓冲与 OpenCode ACP 会话恢复",
    output: "ok github.com/zl875136491/codaway-worker/internal/shim 0.412s",
  },
  {
    id: "step-3",
    label: `编辑内部状态：SessionStore.swift & DriverConfig.swift`,
    kind: "edit",
    state: "done",
    took: 14100,
    tool: "Workspace Edit",
    detail: "同步各驱动圆形图标配置与对话历史持久化",
    output: "3 files changed, +184 -42",
  },
  {
    id: "step-4",
    label: `生成精简汇报卡片并返回端到端测试摘要`,
    kind: "think",
    state: "done",
    took: 4300,
    tool: "MCP Card",
    detail: "通过 codaway mcp-serve 输出紧凑状态摘要",
    output: "4/4 checks passed",
  },
];

const INITIAL_DECISIONS: Decision[] = [
  {
    id: "dec-shim",
    task: "CODEX · codaway-worker",
    question: "检测到后台运行中的构建进程，下一步采用哪种托管策略？",
    options: [
      { id: "shim", title: "使用 harness-shim 常驻守护解耦", summary: "Worker 重启或升级期间 CLI 不中断，断线保留 4 MiB 输出缓冲", recommended: true },
      { id: "direct", title: "仅当前会话托管（随 Worker 退出）", summary: "适合临时一次性排错任务" },
      { id: "doctor", title: "先执行 codaway doctor 全量巡检", summary: "检测 5 个驱动可执行路径及身份私钥权限" },
    ],
  },
];

const GIT_FILES = [
  { name: "DriverConfig.swift", badge: "SW", added: 87, removed: 0, note: "圆形驱动图标与描述元数据" },
  { name: "TelegramChatView.swift", badge: "SW", added: 214, removed: 68, note: "紧凑胶囊输入框 + 拖拽 Handle + 内联模型配置" },
  { name: "internal/shim/shim.go", badge: "GO", added: 869, removed: 0, note: "Unix Socket 守护解耦与环形回放" },
  { name: "opencode/opencode.go", badge: "GO", added: 412, removed: 35, note: "OpenCode ACP stdio 驱动实现" },
];

export function PocketSimulator() {
  const [themeId, setThemeId] = useState<PocketThemeId>("space");
  const [scheme, setScheme] = useState<PocketColorScheme>("dark");
  const [screenTab, setScreenTab] = useState<PhoneScreenTab>("chat");

  // Live Pocket interaction state
  const [thinkingDone, setThinkingDone] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("pending");
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [userMessages, setUserMessages] = useState<string[]>([]);

  // Pocket dual-state composer (unfocused compact capsule -> focused expandable drag-handle composer)
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerBodyHeight, setComposerBodyHeight] = useState(96);
  const [promptText, setPromptText] = useState("");
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [slashDrawerOpen, setSlashDrawerOpen] = useState(false);
  const [attachDrawerOpen, setAttachDrawerOpen] = useState(false);

  // Dual-axis model & thinking state with independent spinner lock
  const [selectedModel, setSelectedModel] = useState("gpt-5.4");
  const [pendingModelId, setPendingModelId] = useState<string | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<ModelEffort>("high");
  const [pendingEffortId, setPendingEffortId] = useState<string | null>(null);

  const modelTimerRef = useRef<number | null>(null);
  const effortTimerRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ y: number; height: number } | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
      if (effortTimerRef.current) window.clearTimeout(effortTimerRef.current);
    };
  }, []);

  const spec = POCKET_THEMES[themeId];
  const palette = spec[scheme];
  const affectCssVars = useMemo(() => buildAffectCssVars(themeId, scheme), [themeId, scheme]);
  const fontFamily = spec.isMono
    ? '"JetBrains Mono", "SF Mono", ui-monospace, monospace'
    : 'inherit';

  const currentModelName = PICKER_MODELS.find((m) => m.id === selectedModel)?.name ?? selectedModel;
  const effortLabel = EFFORT_OPTIONS.find((e) => e.id === selectedEffort)?.label ?? selectedEffort;

  const firePocketToast = (type: "success" | "info", msg: string, desc?: string) => {
    const fn = type === "success" ? toast.success : toast.info;
    fn(msg, { description: desc, toaster: POCKET_TOASTER_ID, duration: 2600 });
  };

  const handleSelectModel = (nextId: string) => {
    if (pendingModelId != null || nextId === selectedModel) return;
    setSelectedModel(nextId);
    setPendingModelId(nextId);
    if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
    modelTimerRef.current = window.setTimeout(() => {
      setPendingModelId(null);
      const name = PICKER_MODELS.find((m) => m.id === nextId)?.name ?? nextId;
      firePocketToast("success", `模型已切换为 ${name}`, "通过 SESSION_CONFIG 帧热更新至 Worker");
    }, 680);
  };

  const handleSelectEffort = (nextEffort: ModelEffort) => {
    if (pendingEffortId != null || nextEffort === selectedEffort) return;
    setSelectedEffort(nextEffort);
    setPendingEffortId(nextEffort);
    if (effortTimerRef.current) window.clearTimeout(effortTimerRef.current);
    effortTimerRef.current = window.setTimeout(() => {
      setPendingEffortId(null);
      const label = EFFORT_OPTIONS.find((e) => e.id === nextEffort)?.label ?? nextEffort;
      firePocketToast("info", `推理强度已更新：${label}`, "切换互不阻塞，立即作用于下一轮推理");
    }, 620);
  };

  const handleSendMessage = () => {
    const text = promptText.trim();
    if (!text) return;
    setUserMessages((prev) => [...prev, text]);
    setPromptText("");
    setModelPickerOpen(false);
    setSlashDrawerOpen(false);
    setAttachDrawerOpen(false);
    firePocketToast("success", "指令已加密发出", `经 X25519 + ChaCha20 加密投递至工作站`);
    requestAnimationFrame(() => {
      chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  // Drag handle on expanded composer
  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { y: e.clientY, height: composerBodyHeight };
  };
  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dy = dragStartRef.current.y - e.clientY;
    const next = Math.min(184, Math.max(64, dragStartRef.current.height + dy));
    setComposerBodyHeight(next);
  };
  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dy = dragStartRef.current.y - e.clientY;
    if (dragStartRef.current.height + dy < 54 && !modelPickerOpen) {
      setComposerExpanded(false);
      setComposerBodyHeight(96);
    }
    dragStartRef.current = null;
  };

  const collapseComposer = () => {
    setComposerExpanded(false);
    setModelPickerOpen(false);
    setSlashDrawerOpen(false);
    setAttachDrawerOpen(false);
  };

  return (
    <div id="pocket-studio" className="flex flex-col items-center">
      {/* Theme Controls matching Pocket ThemeManager */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
        {(Object.keys(POCKET_THEMES) as PocketThemeId[]).map((id) => {
          const active = themeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setThemeId(id);
                firePocketToast("info", `切换主题：${POCKET_THEMES[id].name}`, "ThemeManager 实时驱动全部 AffectUI 组件");
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
              }`}
            >
              {POCKET_THEMES[id].name}
            </button>
          );
        })}

        <span className="mx-0.5 h-4 w-px bg-white/10" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setScheme((s) => (s === "dark" ? "light" : "dark"))}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
          title="切换 Pocket 深色 / 浅色外观"
        >
          {scheme === "dark" ? <Moon size={13} /> : <Sun size={13} />}
          <span>{scheme === "dark" ? "深色" : "浅色"}</span>
        </button>
      </div>

      {/* Interactive iPhone 16 Pro Shell */}
      <div
        className="relative w-full max-w-[392px] rounded-[46px] border-[3px] border-zinc-700/70 bg-[#0d0f14] p-2.5 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]"
      >
        {/* Screen Viewport with active Pocket Theme CSS vars */}
        <div
          data-theme={scheme}
          className={scheme === "dark" ? "dark relative flex h-[710px] flex-col overflow-hidden rounded-[36px]" : "relative flex h-[710px] flex-col overflow-hidden rounded-[36px]"}
          style={{
            ...affectCssVars,
            backgroundColor: palette.wallpaperBg,
            backgroundImage: `radial-gradient(circle at 20% 18%, ${palette.wallpaperGlowA} 0%, transparent 52%), radial-gradient(circle at 82% 76%, ${palette.wallpaperGlowB} 0%, transparent 56%)`,
            color: palette.strong,
            fontFamily,
          }}
        >
          {/* Scoped inline Toaster inside Pocket Phone */}
          <Toaster id={POCKET_TOASTER_ID} inline position="top-center" visibleToasts={2} />

          {/* Status Bar + Dynamic Island */}
          <div className="flex shrink-0 items-center justify-between px-6 pt-3 pb-1.5 text-[11px] font-semibold">
            <span>19:26</span>
            <div className="flex h-[24px] w-[108px] items-center justify-between rounded-full bg-black px-2.5 shadow-inner ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-[9px] text-zinc-400">E2EE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} />
              <span className="rounded bg-current/15 px-1 text-[10px]">84</span>
            </div>
          </div>

          {/* Pocket Navigation Header */}
          <div
            className="mx-3 mb-2 flex shrink-0 items-center justify-between rounded-2xl px-2.5 py-2 backdrop-blur-md"
            style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}` }}
          >
            <button
              type="button"
              onClick={() => setScreenTab("workstations")}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:opacity-80"
              style={{ backgroundColor: palette.well, color: palette.ink }}
              aria-label="返回工作站列表"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="min-w-0 text-center">
              <div className="truncate text-[13px] font-semibold" style={{ color: palette.strong }}>
                功能与安全优化
              </div>
              <div className="truncate text-[10px]" style={{ color: palette.muted }}>
                Mac Studio · {DRIVERS[0].shortTitle} · harness-shim
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScreenTab((prev) => (prev === "git" ? "chat" : "git"))}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:opacity-80"
              style={{ backgroundColor: palette.well, color: palette.ink }}
              aria-label="检查工作区 Git 变更"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>

          {/* Pocket In-App Scene Switcher */}
          <div className="mx-3 mb-2 grid shrink-0 grid-cols-3 gap-1 rounded-xl p-1" style={{ backgroundColor: palette.well }}>
            {(
              [
                { id: "chat", label: "会话 & AffectUI" },
                { id: "workstations", label: "工作站配对" },
                { id: "git", label: "Git & R2 变更" },
              ] as const
            ).map((t) => {
              const active = screenTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setScreenTab(t.id)}
                  className="rounded-lg py-1 text-[11px] font-medium transition"
                  style={{
                    backgroundColor: active ? palette.card : "transparent",
                    color: active ? palette.accent : palette.bodyMuted,
                    boxShadow: active ? `0 0 0 1px ${palette.line}` : "none",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* MAIN SCREEN CONTENT */}
          {screenTab === "chat" && (
            <>
              <div
                ref={chatScrollRef}
                className="phone-scroll flex-1 space-y-3 overflow-y-auto px-3 pb-3"
                onClick={() => {
                  if (composerExpanded && !modelPickerOpen) collapseComposer();
                }}
              >
                <div className="text-center text-[10px]" style={{ color: palette.muted }}>
                  今天 · 19:26 · 端到端加密通道已连接
                </div>

                {/* User Bubble */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[82%] rounded-[18px] rounded-br-[6px] px-3.5 py-2 text-[12.5px] leading-relaxed shadow-sm"
                    style={{ backgroundColor: palette.userBubbleBg, color: palette.userBubbleInk }}
                  >
                    请检查 Worker 的 harness-shim 保活与 OpenCode ACP 驱动，运行单测并生成改动摘要。
                  </div>
                </div>

                {/* Live ThinkingLoader (AffectUI React) */}
                <div className="flex items-center gap-2">
                  <ThinkingLoader
                    phases={["正在深度思考", "梳理上下文", "规划执行路径"]}
                    interval={2100}
                    loop
                    done={thinkingDone}
                    doneLabel="思考已完成 · 共 18 秒"
                    size="sm"
                    variant="pill"
                  />
                  <button
                    type="button"
                    onClick={() => setThinkingDone((v) => !v)}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium transition"
                    style={{
                      backgroundColor: palette.well,
                      color: palette.bodyMuted,
                      border: `1px solid ${palette.line}`,
                    }}
                  >
                    {thinkingDone ? "模拟思考中" : "完成思考"}
                  </button>
                </div>

                {/* AgentMonitor (AffectUI React) with Circular Driver Icon & No redundant driver text */}
                <div className="space-y-1.5">
                  <AgentMonitor
                    state="finished"
                    circularFace
                    hideName
                    timestampText="19:26"
                    agent={{
                      name: "Codex",
                      mark: <DriverIcon driver="CODEX" size={14} />,
                    }}
                    steps={INITIAL_STEPS}
                    since={1000}
                    until={59000}
                    outcome={{ added: 184, removed: 42, files: 3 }}
                    defaultFolded
                    labels={{
                      states: {
                        idle: "空闲",
                        running: "执行中",
                        waiting: "需确认",
                        paused: "已暂停",
                        finished: "已完成",
                        failed: "失败",
                        cancelled: "已取消",
                      },
                      finishedIn: "已完成 · 用时",
                      openLog: "终端",
                      foldAway: "收起任务详情",
                      openCard: "展开任务步骤",
                    }}
                    onOpenLog={() =>
                      firePocketToast("info", "打开终端日志抽屉", "已加载最近 4 MiB harness-shim 缓冲")
                    }
                  />
                  <p className="px-1 text-[10px]" style={{ color: palette.muted }}>
                    ↑ 点击胶囊可展开 / 收起（圆形驱动图标 + 已完成 · 用时 · 4/4，历史记录持久保留）
                  </p>
                </div>

                {/* Assistant Bubble */}
                <div
                  className="rounded-[18px] rounded-bl-[6px] p-3 text-[12px] leading-relaxed"
                  style={{
                    backgroundColor: palette.assistantBubbleBg,
                    border: `1px solid ${palette.assistantBubbleBorder}`,
                    color: palette.ink,
                  }}
                >
                  已通过 <code className="font-mono text-[11px]">harness-shim</code> 验证后台保活与{" "}
                  <code className="font-mono text-[11px]">opencode</code> ACP 会话恢复，所有单测通过。部署脚本需执行以下高权限指令，请确认：
                </div>

                {/* Interactive ApprovalCard with Face ID badge */}
                <div className="space-y-1.5">
                  <ApprovalCard
                    title="执行生产构建与 nginx 配置校验"
                    description="Worker 请求在工作区运行构建脚本并重载静态资源索引"
                    risk="medium"
                    icon={<ScanFace size={15} />}
                    label="CODEX · 安全审批 · Face ID"
                    details={[
                      { label: "命令", value: "node scripts/build.mjs && nginx -t" },
                      { label: "工作区", value: "~/codecho/source_code/codaway-home" },
                    ]}
                    status={approvalStatus}
                    approveLabel="面容 ID 批准"
                    denyLabel="拒绝"
                    alwaysLabel="本工作区此类命令自动信任"
                    shortcuts={false}
                    onApprove={() => {
                      setApprovalStatus("approved");
                      firePocketToast("success", "Face ID 验证通过 · 已批准执行", "Worker 已继续执行构建任务");
                    }}
                    onDeny={() => {
                      setApprovalStatus("denied");
                      firePocketToast("info", "已拒绝该命令执行", "Worker 已中止高危操作");
                    }}
                  />
                  {approvalStatus !== "pending" && (
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium"
                      style={{ backgroundColor: palette.well, color: palette.accent }}
                    >
                      <RotateCcw size={11} /> 重置审批卡片演示
                    </button>
                  )}
                </div>

                {/* Interactive DecisionCard */}
                {decisions.length > 0 ? (
                  <DecisionCard
                    decisions={decisions}
                    labels={{
                      needsYou: "需要选择",
                      later: "稍后处理",
                      show: "展开选择",
                      recommended: "推荐",
                      own: "输入自定义指令…",
                      send: "发送",
                      answered: "已响应",
                      allDone: "暂无待决策项",
                      waiting: (n) => `${n} 项选择等待处理`,
                      of: (i, n) => `${i} / ${n}`,
                    }}
                    onDecide={(id, answer) => {
                      setDecisions((prev) => prev.filter((d) => d.id !== id));
                      const label =
                        typeof answer === "object" && answer.text
                          ? answer.text
                          : typeof answer === "object"
                            ? answer.option
                            : answer;
                      setUserMessages((prev) => [...prev, `已确认策略：${label}`]);
                      firePocketToast("success", "选择已发送至 Worker", `策略 ${label} 已下发`);
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-[11px]"
                    style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}`, color: palette.bodyMuted }}
                  >
                    <span>决策卡片已完成响应</span>
                    <button
                      type="button"
                      onClick={() => setDecisions(INITIAL_DECISIONS)}
                      className="inline-flex items-center gap-1 font-medium"
                      style={{ color: palette.accent }}
                    >
                      <RotateCcw size={11} /> 重新演示
                    </button>
                  </div>
                )}

                {userMessages.map((msg, idx) => (
                  <div key={`${msg}-${idx}`} className="flex justify-end">
                    <div
                      className="max-w-[82%] rounded-[18px] rounded-br-[6px] px-3.5 py-2 text-[12px]"
                      style={{ backgroundColor: palette.userBubbleBg, color: palette.userBubbleInk }}
                    >
                      {msg}
                    </div>
                  </div>
                ))}
              </div>

              {/* Inline drawers above composer (ModelPicker / Slash / Attachment) */}
              {modelPickerOpen && (
                <div
                  className="mx-3 mb-2 overflow-hidden shadow-lg backdrop-blur-xl"
                  style={{
                    backgroundColor: palette.popover,
                    border: `1px solid ${palette.line}`,
                    borderRadius: palette.cardRadius,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 text-[11px] font-medium"
                    style={{ borderBottom: `1px solid ${palette.line}`, color: palette.strong }}
                  >
                    <span>模型与推理强度配置</span>
                    <button
                      type="button"
                      onClick={() => setModelPickerOpen(false)}
                      style={{ color: palette.muted }}
                      aria-label="收起模型配置器"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-1.5">
                    <ModelPicker
                      inline
                      showTrigger={false}
                      showRatings={false}
                      showWebSearch={false}
                      showKeycaps={false}
                      models={PICKER_MODELS}
                      value={selectedModel}
                      onChange={handleSelectModel}
                      thinking
                      effort={selectedEffort}
                      effortOptions={EFFORT_OPTIONS}
                      onEffortChange={handleSelectEffort}
                      pendingModelId={pendingModelId}
                      pendingEffortId={pendingEffortId}
                      labels={{
                        modelHeader: "可用模型",
                        effortLabel: "推理强度",
                      }}
                    />
                  </div>
                </div>
              )}

              {slashDrawerOpen && (
                <div
                  className="mx-3 mb-2 space-y-1 p-2.5 text-[11.5px]"
                  style={{
                    backgroundColor: palette.popover,
                    border: `1px solid ${palette.line}`,
                    borderRadius: palette.innerRadius,
                  }}
                >
                  <div className="flex items-center justify-between pb-1" style={{ color: palette.muted }}>
                    <span>快捷指令菜单（模型与思考已独立至左下角）</span>
                    <button type="button" onClick={() => setSlashDrawerOpen(false)} aria-label="关闭指令菜单">
                      <X size={13} />
                    </button>
                  </div>
                  {[
                    { cmd: "/goal", desc: "开启 Codex Goal Mode 持续执行目标" },
                    { cmd: "/doctor", desc: "探测工作站环境、私钥与驱动状态" },
                    { cmd: "/stop", desc: "中断当前正在执行的 Agent 回合" },
                  ].map((item) => (
                    <button
                      key={item.cmd}
                      type="button"
                      onClick={() => {
                        setSlashDrawerOpen(false);
                        setPromptText(`${item.cmd} `);
                        setComposerExpanded(true);
                        firePocketToast("info", `已载入指令 ${item.cmd}`, item.desc);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left transition"
                      style={{ backgroundColor: palette.well, color: palette.ink }}
                    >
                      <span className="font-mono font-semibold" style={{ color: palette.accent }}>
                        {item.cmd}
                      </span>
                      <span className="truncate pl-2 text-[10.5px]" style={{ color: palette.bodyMuted }}>
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {attachDrawerOpen && (
                <div
                  className="mx-3 mb-2 flex items-center justify-between gap-2 p-2.5 text-[11.5px]"
                  style={{
                    backgroundColor: palette.popover,
                    border: `1px solid ${palette.line}`,
                    borderRadius: palette.innerRadius,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Lock size={14} style={{ color: palette.green }} />
                    <div>
                      <div className="font-medium" style={{ color: palette.strong }}>
                        R2 端到端加密附件直传
                      </div>
                      <div className="text-[10px]" style={{ color: palette.muted }}>
                        前端加密上传后 15 分钟自动焚毁，中继服务器不可见明文
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachDrawerOpen(false);
                      firePocketToast("success", "已附加 auth-audit.diff (14 KB)", "已通过端侧密钥加密上传至 R2");
                    }}
                    className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
                    style={{ backgroundColor: palette.accentBg, color: palette.accent }}
                  >
                    模拟上传
                  </button>
                </div>
              )}

              {/* Bottom Pocket Dual-State Composer matching Screenshots 1/2/3 & compact pill */}
              <div className="px-3 pb-3 pt-1">
                {!composerExpanded ? (
                  /* Unfocused compact pill: 46px full-rounded capsule matching internal buttons */
                  <div
                    className="flex h-[46px] items-center gap-2 rounded-full p-[6px] shadow-md transition-all"
                    style={{
                      backgroundColor: palette.card,
                      border: `1px solid ${palette.line}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlashDrawerOpen(false);
                        setModelPickerOpen(false);
                        setAttachDrawerOpen((v) => !v);
                      }}
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition"
                      style={{
                        backgroundColor: attachDrawerOpen ? palette.accentBg : palette.well,
                        color: attachDrawerOpen ? palette.accent : palette.bodyMuted,
                      }}
                      aria-label="添加附件"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setComposerExpanded(true);
                      }}
                      className="flex-1 cursor-text text-left text-[13px]"
                      style={{ color: palette.muted }}
                      aria-label="点击展开输入框"
                    >
                      ...
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachDrawerOpen(false);
                        setModelPickerOpen(false);
                        setSlashDrawerOpen((v) => !v);
                      }}
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition"
                      style={{ backgroundColor: palette.well, color: palette.bodyMuted }}
                      aria-label="打开指令菜单"
                    >
                      <Slash size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setComposerExpanded(true);
                      }}
                      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition"
                      style={{
                        backgroundColor: palette.well,
                        color: palette.muted,
                      }}
                      aria-label="展开并发送消息"
                    >
                      <ArrowUp size={15} />
                    </button>
                  </div>
                ) : (
                  /* Expanded composer with top drag handle + bottom-left inline Model & Thinking button */
                  <div
                    className="flex flex-col shadow-lg transition-all"
                    style={{
                      backgroundColor: palette.card,
                      border: `1px solid ${palette.accent}`,
                      borderRadius: palette.trayRadius,
                    }}
                  >
                    {/* Top drag grab handle */}
                    <div
                      onPointerDown={onHandlePointerDown}
                      onPointerMove={onHandlePointerMove}
                      onPointerUp={onHandlePointerUp}
                      title="上下拖拽调整输入框高度，下拖可收起"
                      className="flex h-5 cursor-ns-resize touch-none items-center justify-center"
                    >
                      <span className="h-1 w-9 rounded-full" style={{ backgroundColor: palette.muted, opacity: 0.45 }} />
                    </div>

                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="..."
                      style={{
                        height: composerBodyHeight - 40,
                        color: palette.strong,
                      }}
                      className="w-full resize-none bg-transparent px-4 pt-1 text-[13px] leading-relaxed outline-none placeholder:opacity-50"
                      autoFocus
                    />

                    <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setModelPickerOpen(false);
                          setSlashDrawerOpen(false);
                          setAttachDrawerOpen((v) => !v);
                        }}
                        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full transition"
                        style={{
                          backgroundColor: attachDrawerOpen ? palette.accentBg : palette.well,
                          color: attachDrawerOpen ? palette.accent : palette.bodyMuted,
                        }}
                        aria-label="添加附件"
                      >
                        <Plus size={15} />
                      </button>

                      {/* Inline Model & Thinking Trigger next to '+' */}
                      <button
                        type="button"
                        onClick={() => {
                          setSlashDrawerOpen(false);
                          setAttachDrawerOpen(false);
                          setModelPickerOpen((v) => !v);
                        }}
                        className="inline-flex max-w-[175px] items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11.5px] font-medium transition"
                        style={{
                          backgroundColor: modelPickerOpen ? palette.accentBg : palette.well,
                          color: modelPickerOpen ? palette.accent : palette.bodyMuted,
                          border: `1px solid ${modelPickerOpen ? palette.accent : "transparent"}`,
                        }}
                      >
                        <Sparkles size={11} style={{ color: palette.accent }} />
                        <span className="truncate">
                          {currentModelName} · {effortLabel}
                        </span>
                        {(pendingModelId || pendingEffortId) && (
                          <span className="h-2.5 w-2.5 animate-spin rounded-full border border-current border-t-transparent" />
                        )}
                        {modelPickerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      <div className="flex-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setModelPickerOpen(false);
                          setAttachDrawerOpen(false);
                          setSlashDrawerOpen((v) => !v);
                        }}
                        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full transition"
                        style={{ backgroundColor: palette.well, color: palette.bodyMuted }}
                        aria-label="指令菜单"
                      >
                        <Slash size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={promptText.trim() ? handleSendMessage : collapseComposer}
                        className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full transition"
                        style={{
                          backgroundColor: promptText.trim() ? palette.sendBg : palette.well,
                          color: promptText.trim() ? palette.sendInk : palette.bodyMuted,
                          boxShadow: promptText.trim() ? `0 4px 12px ${palette.sendShadow}` : "none",
                        }}
                        aria-label={promptText.trim() ? "发送消息" : "收起输入框"}
                      >
                        {promptText.trim() ? <ArrowUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {screenTab === "workstations" && (
            <div className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3 pb-4">
              <div
                className="flex items-center justify-between rounded-2xl p-3"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
              >
                <div>
                  <div className="text-[12.5px] font-semibold" style={{ color: palette.strong }}>
                    扫码配对新工作站
                  </div>
                  <div className="text-[10.5px]" style={{ color: palette.muted }}>
                    终端执行 <code className="font-mono">codaway start --pair</code> 生成一次性短码
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    firePocketToast("success", "短码指纹核验一致 · 8F3A-C21D", "禁止同账号静默自动信任，安全性优先")
                  }
                  className="shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold"
                  style={{ backgroundColor: palette.accent, color: palette.sendInk }}
                >
                  模拟核对
                </button>
              </div>

              {[
                {
                  name: "Mac Studio · M3 Ultra",
                  os: "macOS launchd · shim active",
                  code: "8F3A-C21D",
                  drivers: ["CODEX", "CLAUDE_CODE", "OPENCODE", "SHELL"] as const,
                },
                {
                  name: "hk-prod-worker-02",
                  os: "Ubuntu 24.04 systemd · 2 workspaces",
                  code: "4E19-9A0B",
                  drivers: ["CLAUDE_CODE", "DEEPSEEK_TUI", "SHELL"] as const,
                },
              ].map((w) => (
                <div
                  key={w.name}
                  className="space-y-2 rounded-2xl p-3"
                  style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.green }} />
                      <span className="text-[13px] font-semibold" style={{ color: palette.strong }}>
                        {w.name}
                      </span>
                    </div>
                    <span
                      className="rounded-md px-1.5 py-0.5 font-mono text-[10px]"
                      style={{ backgroundColor: palette.well, color: palette.bodyMuted }}
                    >
                      {w.code}
                    </span>
                  </div>
                  <div className="text-[11px]" style={{ color: palette.muted }}>
                    {w.os}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {w.drivers.map((dk) => (
                      <span
                        key={dk}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: palette.accentBg, color: palette.accent }}
                      >
                        <DriverIcon driver={dk} size={10} />
                        {DRIVERS.find((d) => d.id === dk)?.shortTitle ?? dk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {screenTab === "git" && (
            <div className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3 pb-4">
              <div
                className="space-y-2 rounded-2xl p-3"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} style={{ color: palette.accent }} />
                    <span className="text-[12.5px] font-semibold" style={{ color: palette.strong }}>
                      Changes ({GIT_FILES.length})
                    </span>
                  </div>
                  <span className="font-mono text-[11px]" style={{ color: palette.green }}>
                    +1,582 <span style={{ color: palette.red }}>-103</span>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {GIT_FILES.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between rounded-xl px-2.5 py-2"
                      style={{ backgroundColor: palette.lane }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="rounded px-1 font-mono text-[9px] font-bold"
                            style={{ backgroundColor: palette.well, color: palette.accent }}
                          >
                            {f.badge}
                          </span>
                          <span className="truncate font-mono text-[11.5px]" style={{ color: palette.strong }}>
                            {f.name}
                          </span>
                        </div>
                        <div className="truncate text-[10px]" style={{ color: palette.muted }}>
                          {f.note}
                        </div>
                      </div>
                      <span className="shrink-0 pl-2 font-mono text-[10.5px]" style={{ color: palette.green }}>
                        +{f.added} <span style={{ color: palette.red }}>-{f.removed}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-between rounded-2xl p-3"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 size={16} style={{ color: palette.accent }} />
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: palette.strong }}>
                      R2 端到端加密附件策略
                    </div>
                    <div className="text-[10px]" style={{ color: palette.muted }}>
                      Wi-Fi 自动下载 · 阈值 5 MB · 15m TTL 自动过期
                    </div>
                  </div>
                </div>
                <ShieldCheck size={16} style={{ color: palette.green }} />
              </div>

              <div
                className="flex items-center justify-between rounded-2xl p-3"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu size={16} style={{ color: palette.accent }} />
                  <div>
                    <div className="text-[12px] font-medium" style={{ color: palette.strong }}>
                      工作站直连终端抽屉
                    </div>
                    <div className="text-[10px]" style={{ color: palette.muted }}>
                      harness-shim 4 MiB 环形日志回放就绪
                    </div>
                  </div>
                </div>
                <Terminal size={15} style={{ color: palette.bodyMuted }} />
              </div>
            </div>
          )}

          {/* Home Indicator */}
          <div className="flex shrink-0 justify-center pb-2 pt-1">
            <span className="h-1 w-28 rounded-full bg-current opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
