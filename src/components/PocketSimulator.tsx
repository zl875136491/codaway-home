import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlignJustify,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Image as ImageIcon,
  Moon,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ScanFace,
  Settings,
  Sparkles,
  Sun,
  Wifi,
  X,
} from "lucide-react";
import {
  buildAffectCssVars,
  POCKET_THEMES,
  type PocketColorScheme,
  type PocketThemeId,
} from "../theme/pocketTheme";
import { useSiteTheme } from "../theme/siteTheme";
import { DRIVERS, type DriverKey } from "../data/codaway";
import { DriverIcon } from "./DriverIcon";
import { AgentMonitor, type AgentRunStep } from "./affectui/ui/agent-monitor-clean";
import { ApprovalCard, type ApprovalStatus } from "./affectui/ui/approval-card-clean";
import { DecisionCard, type Decision } from "./affectui/ui/decision-card-clean";
import { ModelPicker, type ModelEffort, type PickerModel } from "./affectui/ui/model-picker-clean";
import { ThinkingLoader } from "./affectui/ui/thinking-loader-clean";
import { Toaster, toast } from "./affectui/ui/toaster-clean";
import {
  AtFilePickerOverlay,
  FloatingAttachmentSheet,
  FloatingCommandSheet,
  GitInspectorView,
  MentionChip,
  POCKET_QUICK_FILES,
  POCKET_SESSIONS,
  SessionListScreen,
  SimulatorQuotaCard,
  TerminalCommandCard,
  WorkstationListScreen,
  type PocketQuickFile,
} from "./pocket/PocketSimulatorParts";

type PhoneScreenTab = "chat" | "sessions" | "workstations" | "git";

interface ChatSentMessage {
  text: string;
  mentions: PocketQuickFile[];
  attachment?: string;
}

const POCKET_TOASTER_ID = "pocket-sim-phone";

const DRIVER_PICKER_MODELS: Record<DriverKey, PickerModel[]> = {
  CODEX: [
    { id: "gpt-5.6-luna", name: "gpt-5.6-luna", description: "主力旗舰推理与复杂代码重构", speed: 4, quality: 5, cost: 3 },
    { id: "gpt-5.6-terra", name: "gpt-5.6-terra", description: "长上下文代码审计与多文件编辑", speed: 4, quality: 5, cost: 3 },
    { id: "gpt-5.6-sol", name: "gpt-5.6-sol", description: "极速日常检索与轻量修补", speed: 5, quality: 4, cost: 1 },
  ],
  ANTIGRAVITY: [
    { id: "gemini-4-argon", name: "gemini-4-argon", description: "Antigravity 默认旗舰 ACP 模型", speed: 4, quality: 5, cost: 3 },
    { id: "gemini-4-hydrogen", name: "gemini-4-hydrogen", description: "多模态视觉与大型仓库理解", speed: 4, quality: 5, cost: 3 },
    { id: "claude-opus-5-5", name: "claude-opus-5-5", description: "深度规划与精细代码重构", speed: 3, quality: 5, cost: 4 },
  ],
  CURSOR: [
    { id: "claude-opus-5-5", name: "claude-opus-5-5", description: "Cursor Agent 规范推荐主力", speed: 4, quality: 5, cost: 3 },
    { id: "composer-fast", name: "composer-fast", description: "低延迟跨文件 @ 引用修改", speed: 5, quality: 4, cost: 2 },
    { id: "gpt-5.6-luna", name: "gpt-5.6-luna", description: "深度测试生成与架构审查", speed: 4, quality: 5, cost: 3 },
  ],
  CLAUDE_CODE: [
    { id: "claude-sonnet-4-6", name: "claude-sonnet-4-6", description: "stream-json 双向授权主力模型", speed: 4, quality: 5, cost: 3 },
    { id: "claude-opus-4-6", name: "claude-opus-4-6", description: "复杂跨模块设计与安全审计", speed: 3, quality: 5, cost: 4 },
  ],
  OPENCODE: [
    { id: "opencode-acp", name: "opencode-acp", description: "标准 ACP JSON-RPC 多厂商托管", speed: 4, quality: 4, cost: 2 },
  ],
  DEEPSEEK_TUI: [
    { id: "deepseek-reasoner", name: "deepseek-reasoner", description: "Codewhale Plan / Agent / YOLO", speed: 4, quality: 5, cost: 1 },
  ],
  SHELL: [{ id: "zsh", name: "zsh", description: "原生交互 PTY Shell", speed: 5, quality: 5, cost: 1 }],
};

const EFFORT_OPTIONS: { id: ModelEffort; label: string }[] = [
  { id: "minimal", label: "minimal" },
  { id: "low", label: "low" },
  { id: "medium", label: "medium" },
  { id: "high", label: "high" },
  { id: "xhigh", label: "xhigh" },
];

const INITIAL_STEPS: AgentRunStep[] = [
  {
    id: "step-1",
    label: `mcpToolCall · inspect MentionComposerTextView.swift`,
    kind: "read",
    state: "done",
    took: 11200,
    tool: "MCP FileRead",
    detail: "验证 @ 快捷文件高度收缩与行内芯片 × 删除回调",
    output: "No deadlock on @ removal · UI layout verified",
  },
  {
    id: "step-2",
    label: `/bin/zsh -lc "go test ./internal/shim ./internal/driver/antigravity"`,
    kind: "run",
    state: "done",
    took: 28400,
    tool: "Go Test",
    detail: "验证 harness-shim 环形回放缓冲与 Antigravity agy acp 重连",
    output: "ok internal/shim (0.41s) · ok internal/driver/antigravity (0.63s)",
  },
  {
    id: "step-3",
    label: `同步 unified brand_icons 至 Pocket 与 Web 首页`,
    kind: "edit",
    state: "done",
    took: 14100,
    tool: "Workspace Edit",
    detail: "补齐 Antigravity 与 Cursor 品牌识别图标",
    output: "17 / 17 checks passed",
  },
];

const INITIAL_DECISIONS: Decision[] = [
  {
    id: "dec-shim",
    task: "CODEX · codaway-worker",
    question: "检测到后台运行中的构建进程，下一步采用哪种托管策略？",
    options: [
      { id: "shim", title: "使用 harness-shim 常驻守护解耦", summary: "Worker 重启或升级期间 CLI 不中断，断线保留 4 MiB 输出缓冲", recommended: true },
      { id: "doctor", title: "先执行 codaway doctor 全量巡检", summary: "检测 6 个 Worker 原生驱动可执行路径与私钥权限" },
    ],
  },
];

export function PocketSimulator() {
  const [themeId, setThemeId] = useState<PocketThemeId>("space");
  const [scheme, setScheme] = useState<PocketColorScheme>("dark");
  const [screenTab, setScreenTab] = useState<PhoneScreenTab>("chat");
  const [activeSessionId, setActiveSessionId] = useState<string>(POCKET_SESSIONS[0].id);

  const activeSession = useMemo(
    () => POCKET_SESSIONS.find((s) => s.id === activeSessionId) ?? POCKET_SESSIONS[0],
    [activeSessionId],
  );

  // Live Pocket interaction state
  const [thinkingDone, setThinkingDone] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("pending");
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [userMessages, setUserMessages] = useState<ChatSentMessage[]>([]);

  // Floating frosted composer state
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerBodyHeight, setComposerBodyHeight] = useState(82);
  const [promptText, setPromptText] = useState("");
  const [mentionFiles, setMentionFiles] = useState<PocketQuickFile[]>([POCKET_QUICK_FILES[1]]);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [slashDrawerOpen, setSlashDrawerOpen] = useState(false);
  const [attachDrawerOpen, setAttachDrawerOpen] = useState(false);
  const [atPickerOpen, setAtPickerOpen] = useState(false);
  const [atPickerTall, setAtPickerTall] = useState(true);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // Dual-axis model & thinking state
  const [selectedModel, setSelectedModel] = useState<string>(activeSession.model);
  const [pendingModelId, setPendingModelId] = useState<string | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<ModelEffort>(activeSession.effort);
  const [pendingEffortId, setPendingEffortId] = useState<string | null>(null);
  const [showQuotaCard, setShowQuotaCard] = useState(false);

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

  const { siteTheme } = useSiteTheme();
  const spec = POCKET_THEMES[themeId];
  const palette = spec[scheme];
  const affectCssVars = useMemo(() => buildAffectCssVars(themeId, scheme), [themeId, scheme]);
  const fontFamily = spec.isMono ? '"JetBrains Mono", "SF Mono", ui-monospace, monospace' : "inherit";

  const pickerModels = DRIVER_PICKER_MODELS[activeSession.driver] ?? DRIVER_PICKER_MODELS.CODEX;
  const currentModelName = pickerModels.find((m) => m.id === selectedModel)?.name ?? selectedModel;

  const firePocketToast = (type: "success" | "info", msg: string, desc?: string) => {
    const fn = type === "success" ? toast.success : toast.info;
    fn(msg, { description: desc, toaster: POCKET_TOASTER_ID, duration: 2400 });
  };

  const scrollToChatBottom = (smooth = true) => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    setShowScrollBottomBtn(false);
  };

  const handleChatScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottomBtn(distanceFromBottom > 24);
  };

  useEffect(() => {
    if (screenTab === "chat") {
      requestAnimationFrame(() => scrollToChatBottom(false));
    }
  }, [screenTab, activeSessionId]);

  const closeAllTrays = () => {
    setModelPickerOpen(false);
    setSlashDrawerOpen(false);
    setAttachDrawerOpen(false);
    setAtPickerOpen(false);
  };

  const handleSwitchSession = (id: string) => {
    const next = POCKET_SESSIONS.find((s) => s.id === id) ?? POCKET_SESSIONS[0];
    setActiveSessionId(id);
    setSelectedModel(next.model);
    setSelectedEffort(next.effort);
    setUserMessages([]);
    setShowQuotaCard(false);
    closeAllTrays();
    setComposerExpanded(false);
    setScreenTab("chat");
    const driverName = DRIVERS.find((d) => d.id === next.driver)?.shortTitle ?? next.driver;
    firePocketToast("info", `已进入 ${next.title}`, `${driverName} · 直接定位至最新会话底部`);
  };

  const handleSelectModel = (nextId: string) => {
    if (pendingModelId != null || nextId === selectedModel) return;
    setSelectedModel(nextId);
    setPendingModelId(nextId);
    if (modelTimerRef.current) window.clearTimeout(modelTimerRef.current);
    modelTimerRef.current = window.setTimeout(() => {
      setPendingModelId(null);
      firePocketToast("success", `已切换至 ${nextId}`, "通过 SESSION_CONFIG 热更新至 Worker");
    }, 620);
  };

  const handleSelectEffort = (nextEffort: ModelEffort) => {
    if (pendingEffortId != null || nextEffort === selectedEffort) return;
    setSelectedEffort(nextEffort);
    setPendingEffortId(nextEffort);
    if (effortTimerRef.current) window.clearTimeout(effortTimerRef.current);
    effortTimerRef.current = window.setTimeout(() => {
      setPendingEffortId(null);
      firePocketToast("info", `思考程度已更新：${nextEffort}`, "双轴独立锁定，即刻生效");
    }, 580);
  };

  const openAtPicker = () => {
    setModelPickerOpen(false);
    setSlashDrawerOpen(false);
    setAttachDrawerOpen(false);
    setComposerExpanded(true);
    setAtPickerTall(true);
    setAtPickerOpen(true);
  };

  const handlePromptChange = (val: string) => {
    setPromptText(val);
    if (val.endsWith("@")) {
      setModelPickerOpen(false);
      setSlashDrawerOpen(false);
      setAttachDrawerOpen(false);
      setAtPickerTall(true);
      setAtPickerOpen(true);
    } else if (atPickerOpen && !val.includes("@")) {
      setAtPickerOpen(false);
    }
  };

  const handlePickFile = (file: PocketQuickFile) => {
    setMentionFiles((prev) => (prev.some((f) => f.id === file.id) ? prev : [...prev, file]));
    setPromptText((prev) => (prev.endsWith("@") ? prev.slice(0, -1) : prev));
    setAtPickerOpen(false);
    firePocketToast("info", `已内嵌文件引用 ${file.name}`, "点击胶囊右侧 × 可随时移除");
  };

  const handleSendMessage = () => {
    const cleanText = promptText.replace(/@$/, "").trim();
    if (!cleanText && mentionFiles.length === 0) return;
    setUserMessages((prev) => [...prev, { text: cleanText, mentions: mentionFiles }]);
    setPromptText("");
    setMentionFiles([]);
    closeAllTrays();
    setComposerExpanded(false);
    firePocketToast("success", "指令已端到端加密送达", "X25519 + ChaCha20 · 实时推入工作站会话");
    requestAnimationFrame(() => scrollToChatBottom(true));
  };

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { y: e.clientY, height: composerBodyHeight };
  };
  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dy = dragStartRef.current.y - e.clientY;
    setComposerBodyHeight(Math.min(168, Math.max(58, dragStartRef.current.height + dy)));
  };
  const onHandlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dy = dragStartRef.current.y - e.clientY;
    if (dragStartRef.current.height + dy < 48 && !modelPickerOpen && !atPickerOpen) {
      setComposerExpanded(false);
      setComposerBodyHeight(82);
    }
    dragStartRef.current = null;
  };

  const collapseComposer = () => {
    setComposerExpanded(false);
    closeAllTrays();
  };

  const anyOverlayOpen = modelPickerOpen || slashDrawerOpen || attachDrawerOpen || atPickerOpen;
  const canSend = promptText.trim().length > 0 || mentionFiles.length > 0;
  const activeDriverSpec = DRIVERS.find((d) => d.id === activeSession.driver);

  const wallpaperBackground =
    themeId === "space" && scheme === "dark"
      ? [
          "radial-gradient(1.2px 1.2px at 14% 22%, rgba(255,255,255,0.42), transparent)",
          "radial-gradient(1px 1px at 78% 15%, rgba(147,197,253,0.45), transparent)",
          "radial-gradient(1.2px 1.2px at 42% 48%, rgba(255,255,255,0.28), transparent)",
          "radial-gradient(1px 1px at 88% 64%, rgba(255,255,255,0.34), transparent)",
          "radial-gradient(1.3px 1.3px at 24% 82%, rgba(56,189,248,0.38), transparent)",
          `radial-gradient(circle at 22% 16%, ${palette.wallpaperGlowA} 0%, transparent 52%)`,
          `radial-gradient(circle at 82% 76%, ${palette.wallpaperGlowB} 0%, transparent 56%)`,
        ].join(", ")
      : `radial-gradient(circle at 20% 18%, ${palette.wallpaperGlowA} 0%, transparent 52%), radial-gradient(circle at 82% 76%, ${palette.wallpaperGlowB} 0%, transparent 56%)`;

  return (
    <div id="pocket-studio" className="flex w-full min-w-0 scroll-mt-20 flex-col items-center">
      {/* Theme & Scene Quick Controls above phone bezel (styled by siteTheme, completely independent of phone internals) */}
      <div className="no-scrollbar mb-2.5 flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 backdrop-blur-md sm:mb-3 sm:flex-wrap sm:justify-center sm:gap-1.5">
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
              className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                active
                  ? "bg-white text-zinc-950 shadow-sm site-light:bg-slate-900 site-light:text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-main)]"
              }`}
            >
              {POCKET_THEMES[id].name}
            </button>
          );
        })}

        <span className="mx-0.5 h-4 w-px shrink-0 bg-[var(--border)]" aria-hidden="true" />

        <button
          type="button"
          data-testid="pocket-scheme-toggle"
          onClick={() => setScheme((s) => (s === "dark" ? "light" : "dark"))}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-strong)]"
          title="切换 Pocket 模拟器深色 / 浅色外观（仅影响手机画面）"
        >
          {scheme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
          <span>{scheme === "dark" ? "深色" : "浅色"}</span>
        </button>
      </div>

      {/* Quick Scene & Driver Switcher Pills (external to screen so phone stays 100% authentic iOS) */}
      <div className="no-scrollbar mb-3 flex max-w-full items-center gap-1.5 overflow-x-auto px-1 pb-0.5 text-[11px] sm:mb-3.5 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0">
        {(
          [
            { id: "chat", label: "会话浮层" },
            { id: "sessions", label: "会话列表" },
            { id: "workstations", label: "我的工作站" },
            { id: "git", label: "Git 变更" },
          ] as const
        ).map((scene) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => setScreenTab(scene.id)}
            className={`shrink-0 rounded-full border px-2.5 py-0.5 transition ${
              screenTab === scene.id
                ? "border-sky-400/50 bg-sky-500/15 font-medium text-sky-300 site-light:border-sky-600/35 site-light:text-sky-700"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            {scene.label}
          </button>
        ))}

        <span className="mx-0.5 shrink-0 text-[var(--text-sub)]">|</span>

        {POCKET_SESSIONS.slice(0, 3).map((sess) => {
          const active = activeSessionId === sess.id && screenTab === "chat";
          const drv = DRIVERS.find((d) => d.id === sess.driver);
          return (
            <button
              key={sess.id}
              type="button"
              onClick={() => handleSwitchSession(sess.id)}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 transition ${
                active
                  ? "border-emerald-400/50 bg-emerald-500/15 font-medium text-emerald-200 site-light:border-emerald-600/35 site-light:text-emerald-700"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              title={`切换至 ${drv?.displayName} 示例会话`}
            >
              <DriverIcon driver={sess.driver} size={11} scheme={siteTheme} />
              <span>{drv?.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive iPhone 16 Pro Shell */}
      <div className="relative w-full max-w-[390px] rounded-[38px] border-[2.5px] border-[var(--phone-shell-border,rgba(82,82,91,0.75))] bg-[var(--phone-shell-bg,#0d0f14)] p-2 shadow-[var(--phone-shell-shadow,0_32px_90px_-20px_rgba(0,0,0,0.85))] sm:rounded-[48px] sm:border-[3px] sm:p-2.5">
        <div
          data-pocket-root=""
          data-pocket-scheme={scheme}
          data-theme={scheme}
          className={
            scheme === "dark"
              ? "dark relative flex h-[590px] flex-col overflow-hidden rounded-[31px] sm:h-[680px] sm:rounded-[38px] md:h-[716px]"
              : "relative flex h-[590px] flex-col overflow-hidden rounded-[31px] sm:h-[680px] sm:rounded-[38px] md:h-[716px]"
          }
          style={{
            ...affectCssVars,
            colorScheme: scheme,
            backgroundColor: palette.wallpaperBg,
            backgroundImage: wallpaperBackground,
            color: palette.strong,
            fontFamily,
          }}
        >
          {/* Status Bar + Dynamic Island matching IMG_9005 */}
          <div className="relative z-20 flex shrink-0 items-center justify-between px-6 pt-3 pb-1.5 text-[11px] font-semibold">
            <span>14:22</span>
            <div className="flex h-[24px] w-[108px] items-center justify-between rounded-full bg-black px-2.5 shadow-inner ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-[9px] text-zinc-400">E2EE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} />
              <span
                className="rounded px-1 text-[9.5px] font-bold"
                style={{ backgroundColor: palette.greenBg, color: palette.green }}
              >
                94
              </span>
            </div>
          </div>

          {/* Authentic Floating Top Chrome matching IMG_9003..9006 */}
          <div className="relative z-20 flex shrink-0 items-center justify-between px-3.5 pb-2 pt-0.5">
            {screenTab === "workstations" ? (
              <button
                type="button"
                onClick={() => setScreenTab("sessions")}
                className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl transition hover:brightness-110"
                style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}`, color: palette.ink }}
                aria-label="查看会话列表"
              >
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeAllTrays();
                  if (screenTab === "chat") setScreenTab("sessions");
                  else if (screenTab === "sessions") setScreenTab("workstations");
                  else setScreenTab("chat");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl transition hover:brightness-110"
                style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}`, color: palette.ink }}
                aria-label={screenTab === "sessions" ? "返回我的工作站" : "返回"}
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Center floating capsule in chat, clean title in lists */}
            {screenTab === "chat" ? (
              <button
                type="button"
                onClick={() => setScreenTab("sessions")}
                className="mx-1.5 flex min-w-0 max-w-[195px] flex-col items-center rounded-full px-3 py-1 shadow-sm backdrop-blur-xl transition hover:brightness-110 sm:max-w-[235px] sm:px-3.5"
                style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}` }}
                title="点击查看 CodeCube 会话列表"
              >
                <div className="flex max-w-full items-center gap-1.5 text-[12px] font-semibold sm:text-[12.5px]" style={{ color: palette.strong }}>
                  <DriverIcon driver={activeSession.driver} size={13} scheme={scheme} />
                  <span className="truncate">{activeSession.title}</span>
                </div>
                <div className="flex max-w-full items-center gap-1 text-[9.5px]" style={{ color: palette.muted }}>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        activeSession.status === "failed"
                          ? palette.red
                          : activeSession.status === "running"
                            ? palette.green
                            : palette.accent,
                    }}
                  />
                  <span className="truncate">
                    {activeSession.statusText} · {activeDriverSpec?.shortTitle}
                  </span>
                </div>
              </button>
            ) : (
              <div className="text-[14px] font-semibold" style={{ color: palette.strong }}>
                {screenTab === "sessions"
                  ? "CodeCube 的会话"
                  : screenTab === "workstations"
                    ? "我的工作站"
                    : "工作区 Git & R2"}
              </div>
            )}

            {/* Top-right circular button */}
            {screenTab === "workstations" ? (
              <button
                type="button"
                onClick={() =>
                  firePocketToast("info", "主题与零信任安全设置", "私钥 Ed25519 + X25519 仅存本地 Keychain")
                }
                className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl transition hover:brightness-110"
                style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}`, color: palette.ink }}
                aria-label="打开设置"
              >
                <Settings size={15} />
              </button>
            ) : screenTab === "chat" ? (
              <button
                type="button"
                onClick={() => setScreenTab("git")}
                className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xl transition hover:brightness-110"
                style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}`, color: palette.ink }}
                aria-label="检查工作区 Git 变更"
              >
                <MoreHorizontal size={15} />
              </button>
            ) : (
              <span className="w-8" aria-hidden="true" />
            )}
          </div>

          {/* MAIN SCREEN CONTENT */}
          {screenTab === "sessions" && (
            <SessionListScreen
              sessions={POCKET_SESSIONS}
              activeSessionId={activeSessionId}
              palette={palette}
              scheme={scheme}
              onSelectSession={handleSwitchSession}
              onNewSession={() => {
                const idx = POCKET_SESSIONS.findIndex((s) => s.id === activeSessionId);
                const next = POCKET_SESSIONS[(idx + 1) % POCKET_SESSIONS.length];
                handleSwitchSession(next.id);
              }}
            />
          )}

          {screenTab === "workstations" && (
            <WorkstationListScreen
              palette={palette}
              scheme={scheme}
              onVerifyPair={() =>
                firePocketToast("success", "短码指纹核验一致 · 8F3A-C21D", "拒绝同账号静默自动信任，安全性优先")
              }
              onSelectWorkstation={() => setScreenTab("sessions")}
            />
          )}

          {screenTab === "git" && <GitInspectorView palette={palette} />}

          {screenTab === "chat" && (
            <div className="relative flex min-h-0 flex-1 flex-col">
              {/* Scrollable Chat Context passing directly beneath floating composer (NO bottom opaque mask!) */}
              <div
                ref={chatScrollRef}
                onScroll={handleChatScroll}
                onClick={() => {
                  if (composerExpanded && !anyOverlayOpen) collapseComposer();
                }}
                className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3.5 pt-1 pb-24"
              >
                {/* Centered Date Pill — clickable to preview centered return-to-bottom button from IMG_9006 */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      chatScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-full px-2.5 py-0.5 text-[10px] transition hover:brightness-110"
                    style={{ backgroundColor: palette.navBg, border: `1px solid ${palette.line}`, color: palette.muted }}
                    title="点击回溯顶部历史，观察居中回到底部按钮浮出"
                  >
                    今天 · 点击回溯顶部预览回底按钮
                  </button>
                </div>

                {/* System / Slash Receipt Card matching IMG_9005 */}
                <div
                  className="max-w-[78%] rounded-[14px] px-2.5 py-1.5 text-[10.5px]"
                  style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
                >
                  <div className="flex items-center gap-1.5 font-medium" style={{ color: palette.strong }}>
                    <span className="text-[11px]" style={{ color: palette.green }}>
                      ✓
                    </span>
                    <span>调整模型 · {activeDriverSpec?.shortTitle}</span>
                    <span style={{ color: palette.accent }}>已完成</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[9.5px]" style={{ color: palette.muted }}>
                    /model {selectedModel} · {selectedEffort}
                  </div>
                </div>

                {/* Terminal Command Card matching IMG_9006 */}
                <TerminalCommandCard
                  cmd={activeSession.terminalCmd}
                  palette={palette}
                  onCopy={() => firePocketToast("info", "已复制终端命令", activeSession.terminalCmd)}
                />

                {/* User Bubble with Image Attachment Preview matching IMG_9005 */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[82%] space-y-1.5 rounded-[18px] rounded-br-[6px] p-2.5 text-[11.5px] leading-relaxed shadow-sm"
                    style={{ backgroundColor: palette.userBubbleBg, color: palette.userBubbleInk }}
                  >
                    {activeSession.attachmentLabel && (
                      <div
                        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[10px]"
                        style={{ backgroundColor: scheme === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.08)" }}
                      >
                        <ImageIcon size={13} className="shrink-0 opacity-85" />
                        <span className="truncate font-mono">{activeSession.attachmentLabel}</span>
                      </div>
                    )}
                    <div>{activeSession.userPrompt}</div>
                    <div className="text-right text-[9.5px] opacity-75">✓ 已送达工作站 {activeSession.time}</div>
                  </div>
                </div>

                {/* ThinkingLoader + Toggle */}
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
                    className="rounded-full px-2 py-0.5 text-[9.5px] font-medium transition"
                    style={{
                      backgroundColor: palette.well,
                      color: palette.bodyMuted,
                      border: `1px solid ${palette.line}`,
                    }}
                  >
                    {thinkingDone ? "模拟思考中" : "完成思考"}
                  </button>
                </div>

                {/* AgentMonitor with Real Circular Brand Icon */}
                <AgentMonitor
                  state="finished"
                  circularFace
                  hideName
                  timestampText={activeSession.time}
                  agent={{
                    name: activeDriverSpec?.shortTitle ?? "Codex",
                    mark: <DriverIcon driver={activeSession.driver} size={14} scheme={scheme} />,
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
                    foldAway: "收起详情",
                    openCard: "展开步骤",
                  }}
                  onOpenLog={() => firePocketToast("info", "打开终端日志抽屉", "已加载 4 MiB harness-shim 环形缓冲")}
                />

                {/* Assistant Bubble */}
                <div
                  className="rounded-[18px] rounded-bl-[6px] p-2.5 text-[11.5px] leading-relaxed"
                  style={{
                    backgroundColor: palette.assistantBubbleBg,
                    border: `1px solid ${palette.assistantBubbleBorder}`,
                    color: palette.ink,
                  }}
                >
                  {activeSession.assistantSummary}
                </div>

                {/* Interactive Face ID ApprovalCard */}
                <div className="space-y-1">
                  <ApprovalCard
                    title="执行构建校验并同步工作区"
                    description="Worker 请求在工作区运行构建与测试脚本"
                    risk="medium"
                    icon={<ScanFace size={14} />}
                    label={`${activeDriverSpec?.shortTitle ?? "CODEX"} · Face ID 安全审批`}
                    details={[
                      { label: "命令", value: activeSession.terminalCmd },
                      { label: "工作区", value: `~/${activeSession.workspace}` },
                    ]}
                    status={approvalStatus}
                    approveLabel="面容 ID 批准"
                    denyLabel="拒绝"
                    alwaysLabel="本工作区自动信任"
                    shortcuts={false}
                    onApprove={() => {
                      setApprovalStatus("approved");
                      firePocketToast("success", "Face ID 验证通过 · 已批准", "Worker 已继续执行");
                    }}
                    onDeny={() => {
                      setApprovalStatus("denied");
                      firePocketToast("info", "已拒绝该高危命令", "Worker 已中止执行");
                    }}
                  />
                  {approvalStatus !== "pending" && (
                    <button
                      type="button"
                      onClick={() => setApprovalStatus("pending")}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[9.5px] font-medium"
                      style={{ backgroundColor: palette.well, color: palette.accent }}
                    >
                      <RotateCcw size={10} /> 重置审批演示
                    </button>
                  )}
                </div>

                {/* Interactive DecisionCard */}
                {decisions.length > 0 && (
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
                      setUserMessages((prev) => [...prev, { text: `已确认策略：${label}`, mentions: [] }]);
                      firePocketToast("success", "选择已发送至 Worker", `策略 ${label} 已下发`);
                    }}
                  />
                )}

                {/* User live sent messages with inline MentionChips */}
                {showQuotaCard && (
                  <SimulatorQuotaCard palette={palette} onDismiss={() => setShowQuotaCard(false)} />
                )}

                {userMessages.map((msg, idx) => (
                  <div key={`${msg.text}-${idx}`} className="flex justify-end">
                    <div
                      className="max-w-[84%] space-y-1.5 rounded-[18px] rounded-br-[6px] px-3 py-2 text-[11.5px]"
                      style={{ backgroundColor: palette.userBubbleBg, color: palette.userBubbleInk }}
                    >
                      {msg.attachment && (
                        <div
                          className="rounded-lg px-2 py-1 font-mono text-[10px]"
                          style={{ backgroundColor: scheme === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.08)" }}
                        >
                          🔒 {msg.attachment}
                        </div>
                      )}
                      {msg.mentions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {msg.mentions.map((f) => (
                            <span
                              key={f.id}
                              className="rounded px-1.5 py-0.5 font-mono text-[10px]"
                              style={{ backgroundColor: scheme === "dark" ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.08)" }}
                            >
                              @{f.name}
                            </span>
                          ))}
                        </div>
                      )}
                      {msg.text && <div>{msg.text}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* FLOATING COMPOSER & OVERLAYS (Zero bottom opaque mask, matching IMG_9005..9010) */}
              <div className="pointer-events-none absolute right-0 bottom-2.5 left-0 z-30 flex flex-col">
                {/* Centered Scroll-to-Latest Button matching IMG_9006 */}
                {showScrollBottomBtn && !anyOverlayOpen && !composerExpanded && (
                  <div className="mb-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => scrollToChatBottom(true)}
                      className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full shadow-lg backdrop-blur-xl transition hover:scale-105"
                      style={{
                        backgroundColor: palette.navBg,
                        border: `1px solid ${palette.line}`,
                        color: palette.strong,
                      }}
                      aria-label="回到底部最新消息"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>
                )}

                {/* Overlay Popovers above composer */}
                <div className="pointer-events-auto">
                  {atPickerOpen && (
                    <AtFilePickerOverlay
                      files={POCKET_QUICK_FILES}
                      tall={atPickerTall}
                      palette={palette}
                      onToggleHeight={() => setAtPickerTall((v) => !v)}
                      onPickFile={handlePickFile}
                      onClose={() => setAtPickerOpen(false)}
                    />
                  )}

                  {slashDrawerOpen && (
                    <FloatingCommandSheet
                      driver={activeSession.driver}
                      palette={palette}
                      scheme={scheme}
                      onSelectCmd={(cmd, desc) => {
                        setSlashDrawerOpen(false);
                        if (cmd === "/quota") {
                          setShowQuotaCard(true);
                          firePocketToast("success", "已返回工作站模型额度卡片", "Codex 68% · Cursor 82% · Antigravity 100%");
                          requestAnimationFrame(() => scrollToChatBottom(true));
                        } else if (cmd === "/shift") {
                          const nextOrder: Record<DriverKey, DriverKey> = {
                            CODEX: "ANTIGRAVITY",
                            ANTIGRAVITY: "CURSOR",
                            CURSOR: "CLAUDE_CODE",
                            CLAUDE_CODE: "CODEX",
                            OPENCODE: "CODEX",
                            DEEPSEEK_TUI: "CODEX",
                            SHELL: "CODEX",
                          };
                          const nextDrv = nextOrder[activeSession.driver];
                          const targetSession = POCKET_SESSIONS.find((s) => s.driver === nextDrv) ?? POCKET_SESSIONS[0];
                          firePocketToast("info", `已触发 /shift 上下文接力`, `无缝切换至 ${targetSession.driver} 并继承项目规约`);
                        } else {
                          setPromptText(`${cmd} `);
                          setComposerExpanded(true);
                          firePocketToast("info", `已载入指令 ${cmd}`, desc);
                        }
                      }}
                      onClose={() => setSlashDrawerOpen(false)}
                    />
                  )}

                  {attachDrawerOpen && (
                    <FloatingAttachmentSheet
                      palette={palette}
                      onUploadPhoto={() => {
                        setAttachDrawerOpen(false);
                        setUserMessages((prev) => [
                          ...prev,
                          { text: "请分析这张界面截图的实现细节", mentions: [], attachment: "/photo · ui-preview.png (E2EE)" },
                        ]);
                        firePocketToast("success", "照片已端到端加密传输", "经 R2 零知识桶送达工作站并保留缩略图");
                      }}
                      onUploadFile={() => {
                        setAttachDrawerOpen(false);
                        setUserMessages((prev) => [
                          ...prev,
                          { text: "已上传补丁至工作区目录", mentions: [], attachment: "/file · auth-audit.diff (14 KB)" },
                        ]);
                        firePocketToast("success", "文件已加密传输至工作区", "R2 临时签名 15 分钟自动焚毁");
                      }}
                    />
                  )}

                  {modelPickerOpen && (
                    <div
                      className="mx-3.5 mb-2 overflow-hidden rounded-[22px] shadow-2xl backdrop-blur-2xl"
                      style={{
                        backgroundColor: palette.popover,
                        border: `1px solid ${palette.line}`,
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-3.5 py-2 text-[12px] font-semibold"
                        style={{ borderBottom: `1px solid ${palette.line}`, color: palette.strong }}
                      >
                        <span>模型</span>
                        <button
                          type="button"
                          onClick={() => setModelPickerOpen(false)}
                          className="flex h-6 w-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: palette.well, color: palette.muted }}
                          aria-label="收起模型选择面板"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <div className="p-1.5">
                        <ModelPicker
                          inline
                          showTrigger={false}
                          showRatings={false}
                          showWebSearch={false}
                          showKeycaps={false}
                          models={pickerModels}
                          value={selectedModel}
                          onChange={handleSelectModel}
                          thinking
                          effort={selectedEffort}
                          effortOptions={EFFORT_OPTIONS}
                          onEffortChange={handleSelectEffort}
                          pendingModelId={pendingModelId}
                          pendingEffortId={pendingEffortId}
                          labels={{
                            modelHeader: `${activeDriverSpec?.shortTitle ?? ""} 可用模型`,
                            effortLabel: "思考程度",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Frosted Composer Bar (unfocused compact pill vs focused expanded card) */}
                <div className="pointer-events-auto px-4">
                  {!composerExpanded ? (
                    <div
                      className="flex h-[42px] items-center gap-1.5 rounded-full px-1.5 shadow-xl backdrop-blur-2xl transition-all"
                      style={{
                        backgroundColor: palette.navBg,
                        border: `1px solid ${palette.line}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSlashDrawerOpen(false);
                          setModelPickerOpen(false);
                          setAtPickerOpen(false);
                          setAttachDrawerOpen((v) => !v);
                        }}
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                        style={{
                          backgroundColor: attachDrawerOpen ? palette.accent : palette.well,
                          color: attachDrawerOpen ? palette.sendInk : palette.bodyMuted,
                        }}
                        aria-label={attachDrawerOpen ? "关闭附件面板" : "添加图片或文件"}
                      >
                        {attachDrawerOpen ? <X size={14} /> : <Plus size={15} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setComposerExpanded(true)}
                        className="flex-1 cursor-text px-1.5 text-left text-[12.5px]"
                        style={{ color: palette.muted }}
                        aria-label="展开输入框"
                      >
                        接下来...
                      </button>

                      <button
                        type="button"
                        onClick={openAtPicker}
                        className="flex h-[26px] items-center justify-center rounded-full px-2 text-[11px] font-semibold transition hover:brightness-110"
                        style={{ backgroundColor: palette.well, color: palette.accent }}
                        title="演示 @ 快捷文件引用"
                      >
                        @
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAttachDrawerOpen(false);
                          setModelPickerOpen(false);
                          setAtPickerOpen(false);
                          setSlashDrawerOpen((v) => !v);
                        }}
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                        style={{
                          backgroundColor: slashDrawerOpen ? palette.accent : palette.well,
                          color: slashDrawerOpen ? palette.sendInk : palette.bodyMuted,
                        }}
                        aria-label={slashDrawerOpen ? "关闭指令菜单" : "打开三列指令菜单"}
                      >
                        {slashDrawerOpen ? <X size={14} /> : <AlignJustify size={13} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setComposerExpanded(true)}
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                        style={{ backgroundColor: palette.well, color: palette.muted }}
                        aria-label="展开输入"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col rounded-[22px] shadow-2xl backdrop-blur-2xl transition-all"
                      style={{
                        backgroundColor: palette.navBg,
                        border: `1px solid ${palette.accent}`,
                      }}
                    >
                      {/* Top drag grab handle matching IMG_9010 */}
                      <div
                        onPointerDown={onHandlePointerDown}
                        onPointerMove={onHandlePointerMove}
                        onPointerUp={onHandlePointerUp}
                        title="上下拖拽调整输入框高度，下滑收起"
                        className="flex h-4 cursor-ns-resize touch-none items-center justify-center"
                      >
                        <span className="h-1 w-8 rounded-full" style={{ backgroundColor: palette.muted, opacity: 0.45 }} />
                      </div>

                      {/* Inline @ mention pills + active @ block matching IMG_9009 */}
                      {(mentionFiles.length > 0 || atPickerOpen) && (
                        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-1">
                          {mentionFiles.map((file) => (
                            <MentionChip
                              key={file.id}
                              file={file}
                              palette={palette}
                              onRemove={() => setMentionFiles((prev) => prev.filter((item) => item.id !== file.id))}
                            />
                          ))}
                          {atPickerOpen && (
                            <span
                              className="inline-flex items-center gap-1 rounded-[7px] px-1.5 py-0.5 text-[10.5px] font-semibold"
                              style={{
                                backgroundColor: "rgba(41, 181, 245, 0.22)",
                                border: `1px solid ${palette.accent}`,
                                color: palette.liveBlue,
                              }}
                            >
                              @
                              <button
                                type="button"
                                onClick={() => setAtPickerOpen(false)}
                                className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-current/[0.15]"
                                aria-label="关闭当前 @ 触发块"
                              >
                                <X size={9} />
                              </button>
                            </span>
                          )}
                        </div>
                      )}

                      <textarea
                        value={promptText}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="接下来...（输入 @ 选择工作区文件）"
                        style={{ height: Math.max(40, composerBodyHeight - 36), color: palette.strong }}
                        className="w-full resize-none bg-transparent px-3.5 text-[16px] leading-relaxed outline-none placeholder:opacity-55 sm:text-[12px]"
                        autoFocus
                      />

                      <div className="flex items-center gap-1.5 px-2 pb-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setModelPickerOpen(false);
                            setSlashDrawerOpen(false);
                            setAtPickerOpen(false);
                            setAttachDrawerOpen((v) => !v);
                          }}
                          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                          style={{
                            backgroundColor: attachDrawerOpen ? palette.accent : palette.well,
                            color: attachDrawerOpen ? palette.sendInk : palette.bodyMuted,
                          }}
                          aria-label="添加附件"
                        >
                          {attachDrawerOpen ? <X size={14} /> : <Plus size={14} />}
                        </button>

                        {/* Inline Model & Thinking pill matching IMG_9009 / IMG_9010 */}
                        <button
                          type="button"
                          onClick={() => {
                            setSlashDrawerOpen(false);
                            setAttachDrawerOpen(false);
                            setAtPickerOpen(false);
                            setModelPickerOpen((v) => !v);
                          }}
                          className="inline-flex max-w-[146px] items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium transition"
                          style={{
                            backgroundColor: modelPickerOpen ? palette.accentBg : palette.well,
                            color: modelPickerOpen ? palette.accent : palette.bodyMuted,
                            border: `1px solid ${modelPickerOpen ? palette.accent : "transparent"}`,
                          }}
                        >
                          <Sparkles size={10} style={{ color: palette.accent }} />
                          <span className="truncate">
                            {currentModelName} · {selectedEffort}
                          </span>
                          {(pendingModelId || pendingEffortId) && (
                            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-current border-t-transparent" />
                          )}
                          {modelPickerOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setAtPickerOpen((v) => !v)}
                          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition"
                          style={{
                            backgroundColor: atPickerOpen ? palette.accentBg : palette.well,
                            color: atPickerOpen ? palette.accent : palette.bodyMuted,
                          }}
                          aria-label="打开 @ 快捷文件列表"
                        >
                          @
                        </button>

                        <div className="flex-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setModelPickerOpen(false);
                            setAttachDrawerOpen(false);
                            setAtPickerOpen(false);
                            setSlashDrawerOpen((v) => !v);
                          }}
                          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                          style={{
                            backgroundColor: slashDrawerOpen ? palette.accent : palette.well,
                            color: slashDrawerOpen ? palette.sendInk : palette.bodyMuted,
                          }}
                          aria-label="指令菜单"
                        >
                          {slashDrawerOpen ? <X size={13} /> : <AlignJustify size={13} />}
                        </button>

                        <button
                          type="button"
                          onClick={canSend ? handleSendMessage : collapseComposer}
                          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition"
                          style={{
                            backgroundColor: canSend ? palette.sendBg : palette.well,
                            color: canSend ? palette.sendInk : palette.bodyMuted,
                            boxShadow: canSend ? `0 4px 12px ${palette.sendShadow}` : "none",
                          }}
                          aria-label={canSend ? "发送消息" : "收起输入框"}
                        >
                          {canSend ? <ArrowUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Home Indicator */}
          <div className="relative z-20 flex shrink-0 justify-center pb-1.5 pt-1">
            <span className="h-1 w-28 rounded-full bg-current opacity-20" />
          </div>

          {/* Scoped Toaster mounted last inside [data-pocket-root] so notifications sit below Dynamic Island & above all app chrome */}
          <Toaster id={POCKET_TOASTER_ID} inline position="top-center" visibleToasts={2} />
        </div>
      </div>
    </div>
  );
}
