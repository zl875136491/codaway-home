import {
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  CornerDownLeft,
  Cpu,
  FileCode2,
  FileImage,
  FileText,
  Folder,
  FolderGit2,
  GitBranch,
  Image as ImageIcon,
  Monitor,
  Plus,
  RotateCcw,
  ScanQrCode,
  Settings,
  ShieldCheck,
  Slash,
  Sparkles,
  Square,
  Target,
  Terminal,
  X,
} from "lucide-react";
import type { DriverKey } from "../../data/codaway";
import { DRIVERS } from "../../data/codaway";
import type { PocketColorScheme, PocketThemePalette } from "../../theme/pocketTheme";
import { DriverIcon } from "../DriverIcon";

export interface PocketQuickFile {
  id: string;
  name: string;
  dir: string;
  ext: string;
  extColor: string;
}

export interface PocketSessionItem {
  id: string;
  title: string;
  workspace: string;
  driver: DriverKey;
  time: string;
  status: "completed" | "running" | "failed";
  statusText: string;
  previewTag: string;
  model: string;
  effort: "minimal" | "low" | "medium" | "high" | "xhigh";
  userPrompt: string;
  assistantSummary: string;
  terminalCmd: string;
  attachmentLabel?: string;
}

export const POCKET_QUICK_FILES: PocketQuickFile[] = [
  { id: "qf-1", name: "subagents.v1.json", dir: "apps/runtime/config", ext: "JSON", extColor: "#f59e0b" },
  { id: "qf-2", name: ".gitignore", dir: ".", ext: "FILE", extColor: "#94a3b8" },
  { id: "qf-3", name: "antigravity.go", dir: "internal/driver/antigravity", ext: "GO", extColor: "#22d3ee" },
  { id: "qf-4", name: "DriverConfig.swift", dir: "App/Pocket", ext: "SW", extColor: "#fb923c" },
  { id: "qf-5", name: "externalprocurement.js", dir: "src/modules", ext: "JS", extColor: "#eab308" },
  { id: "qf-6", name: "DESIGN.md", dir: "docs", ext: "MD", extColor: "#38bdf8" },
  { id: "qf-7", name: "PocketSimulator.tsx", dir: "src/components", ext: "TSX", extColor: "#60a5fa" },
];

export const POCKET_SESSIONS: PocketSessionItem[] = [
  {
    id: "sess-codex",
    title: "图片提问与界面重构",
    workspace: "codaway-home",
    driver: "CODEX",
    time: "15:35",
    status: "completed",
    statusText: "已完成",
    previewTag: "截图",
    model: "gpt-5.6-luna",
    effort: "medium",
    userPrompt: "这是新版截图？请按悬浮输入框、“接下来...”占位与居中回底按钮同步优化。",
    assistantSummary:
      "已完成悬浮毛玻璃输入框（“接下来...”）、居中回底箭头按钮与 @ 行内文件芯片，并验证 harness-shim 重连与构建检查全部通过。",
    terminalCmd: "codaway doctor --verify && node scripts/build.mjs",
    attachmentLabel: "pocket-ui-spec.png · R2 E2EE",
  },
  {
    id: "sess-antigravity",
    title: "Antigravity ACP 重连巡检",
    workspace: "codaway-worker",
    driver: "ANTIGRAVITY",
    time: "14:06",
    status: "running",
    statusText: "运行中",
    previewTag: "ACP",
    model: "gemini-4-argon",
    effort: "high",
    userPrompt: "检查 agy acp 断线恢复逻辑，并探测当前可用的 Gemini 4 与 Claude 5.5 模型。",
    assistantSummary:
      "已通过 agy acp 建立 JSON-RPC 2.0 stdio 会话并挂载至 harness-shim，当前支持 default / accept-edits / auto / plan 模式热切换。",
    terminalCmd: "agy models && go test ./internal/driver/antigravity",
  },
  {
    id: "sess-cursor",
    title: "Cursor 多文件上下文联动",
    workspace: "web-console",
    driver: "CURSOR",
    time: "11-12",
    status: "completed",
    statusText: "规范就绪",
    previewTag: "文件",
    model: "claude-opus-5-5",
    effort: "xhigh",
    userPrompt: "验证 Cursor 品牌徽章、工作区 @ 文件芯片嵌入与多文件 diffs 审批样式。",
    assistantSummary:
      "Cursor (CURSOR) 品牌资源与 Pocket DriverConfig 映射已全部就绪；行内 [JS] / [FILE] 引用胶囊与 Worker 驱动接入协议已对齐。",
    terminalCmd: "# Cursor Agent · @externalprocurement.js fast_mode",
  },
  {
    id: "sess-claude",
    title: "知识大赏数据准备",
    workspace: "docs-pipeline",
    driver: "CLAUDE_CODE",
    time: "11-06",
    status: "failed",
    statusText: "需审批",
    previewTag: "文档",
    model: "claude-sonnet-4-6",
    effort: "high",
    userPrompt: "整理季度索引并执行静态资源构建校验，高危命令触发 Face ID 二次确认。",
    assistantSummary: "构建前的高权限脚本已被 can_use_tool 拦截并加密投递至 Pocket 等待 Face ID 审批。",
    terminalCmd: "codaway run --driver CLAUDE_CODE --workdir ~/docs-pipeline",
  },
];

export const POCKET_WORKSTATIONS = [
  {
    name: "CodeCube",
    deviceId: "dev_beaac64d1dee",
    os: "macOS · harness-shim active",
    drivers: ["CODEX", "ANTIGRAVITY", "CURSOR", "CLAUDE_CODE", "OPENCODE"] as DriverKey[],
  },
  {
    name: "bogon",
    deviceId: "dev_77a2f562ed2b",
    os: "Ubuntu 24.04 systemd · 2 workspaces",
    drivers: ["CODEX", "CLAUDE_CODE", "DEEPSEEK_TUI", "SHELL"] as DriverKey[],
  },
];

export const GIT_INSPECTOR_FILES = [
  { name: "DriverConfig.swift", badge: "SW", added: 94, removed: 0, note: "统一 Antigravity / Cursor / Codex 品牌图标" },
  { name: "MentionComposerTextView.swift", badge: "SW", added: 312, removed: 48, note: "@ 触发全高列表与行内 [FILE] × 删除芯片" },
  { name: "internal/driver/antigravity/antigravity.go", badge: "GO", added: 680, removed: 0, note: "Antigravity agy acp 驱动与断线恢复" },
  { name: "internal/shim/shim.go", badge: "GO", added: 869, removed: 0, note: "Unix Socket 守护解耦与 4 MiB 环形回放" },
];

export function SessionListScreen({
  sessions,
  activeSessionId,
  palette,
  scheme,
  onSelectSession,
  onNewSession,
}: {
  sessions: PocketSessionItem[];
  activeSessionId: string;
  palette: PocketThemePalette;
  scheme: PocketColorScheme;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-16">
        {sessions.map((sess) => {
          const active = sess.id === activeSessionId;
          const driverSpec = DRIVERS.find((d) => d.id === sess.driver);
          const statusColor =
            sess.status === "failed"
              ? palette.red
              : sess.status === "running"
                ? palette.green
                : palette.accent;
          const statusBg =
            sess.status === "failed"
              ? palette.redBg
              : sess.status === "running"
                ? palette.greenBg
                : palette.accentBg;

          return (
            <button
              key={sess.id}
              type="button"
              onClick={() => onSelectSession(sess.id)}
              className="flex w-full items-center gap-3 rounded-[20px] p-3 text-left transition hover:brightness-110"
              style={{
                backgroundColor: palette.card,
                border: `1px solid ${active ? palette.accent : palette.line}`,
                boxShadow: active ? `0 0 0 1px ${palette.accent}33` : "none",
              }}
            >
              {/* Circular avatar + bottom-trailing brand badge matching IMG_9003 */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: palette.well }}>
                {sess.driver === "ANTIGRAVITY" ? (
                  <Sparkles size={17} style={{ color: palette.accent }} />
                ) : sess.driver === "CURSOR" ? (
                  <FileCode2 size={17} style={{ color: palette.strong }} />
                ) : (
                  <FileText size={17} style={{ color: palette.bodyMuted }} />
                )}
                <span
                  className="absolute -right-1 -bottom-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full shadow-sm"
                  style={{
                    backgroundColor: palette.tray,
                    border: `1.5px solid ${palette.line}`,
                    color: palette.strong,
                  }}
                >
                  <DriverIcon driver={sess.driver} size={10} scheme={scheme} />
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="truncate text-[13px] font-semibold" style={{ color: palette.strong }}>
                  {sess.title}
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px]" style={{ color: palette.muted }}>
                  <Folder size={10} className="shrink-0" />
                  <span className="truncate">{sess.workspace}</span>
                  <span>·</span>
                  <span className="inline-flex shrink-0 items-center gap-1" style={{ color: palette.bodyMuted }}>
                    <DriverIcon driver={sess.driver} size={10} scheme={scheme} />
                    {driverSpec?.shortTitle ?? sess.driver}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: palette.muted }}>
                    {sess.time}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold"
                    style={{ backgroundColor: statusBg, color: statusColor }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {sess.statusText}
                  </span>
                </div>
                <span
                  className="rounded-md px-1.5 py-0.5 text-[9.5px]"
                  style={{ backgroundColor: palette.well, color: palette.bodyMuted }}
                >
                  {sess.previewTag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom full-width CTA pill matching IMG_9003 */}
      <div className="pointer-events-none absolute right-0 bottom-2 left-0 flex justify-center px-5">
        <button
          type="button"
          onClick={onNewSession}
          className="pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-semibold shadow-lg transition hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.liveBlue})`,
            color: palette.sendInk,
            boxShadow: `0 8px 22px ${palette.sendShadow}`,
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>发起全新会话</span>
        </button>
      </div>
    </div>
  );
}

export function WorkstationListScreen({
  palette,
  scheme,
  onVerifyPair,
  onSelectWorkstation,
}: {
  palette: PocketThemePalette;
  scheme: PocketColorScheme;
  onVerifyPair: () => void;
  onSelectWorkstation: () => void;
}) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-16">
        {POCKET_WORKSTATIONS.map((w) => (
          <div
            key={w.name}
            onClick={onSelectWorkstation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectWorkstation();
            }}
            className="cursor-pointer space-y-2.5 rounded-[20px] p-3.5 transition hover:brightness-110"
            style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: palette.greenBg, color: palette.green }}
                >
                  <Monitor size={17} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13.5px] font-semibold" style={{ color: palette.strong }}>
                      {w.name}
                    </span>
                    <ShieldCheck size={13} style={{ color: palette.accent }} />
                  </div>
                  <div className="truncate font-mono text-[10px]" style={{ color: palette.muted }}>
                    {w.deviceId}
                  </div>
                </div>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold"
                style={{ backgroundColor: palette.greenBg, color: palette.green }}
              >
                在线
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {w.drivers.map((dk) => (
                <span
                  key={dk}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-medium"
                  style={{ backgroundColor: palette.well, color: palette.ink }}
                >
                  <DriverIcon driver={dk} size={10} scheme={scheme} />
                  {DRIVERS.find((d) => d.id === dk)?.shortTitle ?? dk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pair Workstation CTA pill matching IMG_9004 */}
      <div className="pointer-events-none absolute right-0 bottom-2 left-0 flex justify-center px-5">
        <button
          type="button"
          onClick={onVerifyPair}
          className="pointer-events-auto flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-semibold shadow-lg transition hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${palette.accent}, ${palette.liveBlue})`,
            color: palette.sendInk,
            boxShadow: `0 8px 22px ${palette.sendShadow}`,
          }}
        >
          <ScanQrCode size={15} />
          <span>配对工作站</span>
        </button>
      </div>
    </div>
  );
}

export function FloatingCommandSheet({
  driver,
  palette,
  scheme,
  onSelectCmd,
  onClose,
}: {
  driver: DriverKey;
  palette: PocketThemePalette;
  scheme: PocketColorScheme;
  onSelectCmd: (cmd: string, desc: string) => void;
  onClose: () => void;
}) {
  const driverSpec = DRIVERS.find((d) => d.id === driver);
  const commands = [
    { icon: Target, title: "会话目标", cmd: "/goal", desc: "开启 Goal Mode 持续执行目标" },
    { icon: Compass, title: "运行模式", cmd: "/mode", desc: driver === "ANTIGRAVITY" ? "切换 default / accept-edits / auto / plan" : "切换工作流协作模式" },
    { icon: Sparkles, title: "思考深度", cmd: "/thinking", desc: "热更新 reasoning effort 档位" },
    { icon: Cpu, title: "会话状态", cmd: "/status", desc: "实时检查工作区与模型配额" },
    { icon: Square, title: "中断执行", cmd: "/stop", desc: "安全停止当前运行中的任务" },
    { icon: RotateCcw, title: "新开会话", cmd: "/new", desc: "重置上下文并建立新会话" },
  ];

  return (
    <div
      className="mx-3.5 mb-2 overflow-hidden rounded-[22px] p-3 shadow-2xl backdrop-blur-2xl"
      style={{
        backgroundColor: palette.popover,
        border: `1px solid ${palette.line}`,
      }}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: palette.strong }}>
          <DriverIcon driver={driver} size={14} scheme={scheme} />
          <span>{driverSpec?.shortTitle ?? driver} · 指令</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.well, color: palette.muted }}
          >
            <Settings size={11} />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.well, color: palette.muted }}
            aria-label="关闭指令面板"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* 3-Column Grid matching IMG_9007 */}
      <div className="grid grid-cols-3 gap-1.5">
        {commands.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.cmd}
              type="button"
              onClick={() => onSelectCmd(item.cmd, item.desc)}
              className="flex flex-col items-center gap-1 rounded-[14px] px-1.5 py-2.5 text-center transition hover:brightness-110"
              style={{ backgroundColor: palette.well, border: `1px solid ${palette.line}` }}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-xl"
                style={{ backgroundColor: palette.card, color: palette.ink }}
              >
                <Icon size={13} />
              </span>
              <span className="text-[11px] font-semibold leading-tight" style={{ color: palette.strong }}>
                {item.title}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 font-mono text-[9px]"
                style={{ backgroundColor: palette.lane, color: palette.muted }}
              >
                {item.cmd}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FloatingAttachmentSheet({
  palette,
  onUploadPhoto,
  onUploadFile,
}: {
  palette: PocketThemePalette;
  onUploadPhoto: () => void;
  onUploadFile: () => void;
}) {
  return (
    <div
      className="mx-3.5 mb-2 space-y-1.5 rounded-[22px] p-2.5 shadow-2xl backdrop-blur-2xl"
      style={{
        backgroundColor: palette.popover,
        border: `1px solid ${palette.line}`,
      }}
    >
      <button
        type="button"
        onClick={onUploadPhoto}
        className="flex w-full items-center gap-2.5 rounded-[14px] p-2 text-left transition hover:brightness-110"
        style={{ backgroundColor: palette.well }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: palette.accentBg, color: palette.accent }}
        >
          <ImageIcon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold" style={{ color: palette.strong }}>
            选择照片 / 截图
          </div>
          <div className="truncate text-[9.5px]" style={{ color: palette.muted }}>
            通过 R2 端到端加密传输并在上下文显示缩略图
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px]"
          style={{ backgroundColor: palette.card, color: palette.muted }}
        >
          /photo
        </span>
      </button>

      <button
        type="button"
        onClick={onUploadFile}
        className="flex w-full items-center gap-2.5 rounded-[14px] p-2 text-left transition hover:brightness-110"
        style={{ backgroundColor: palette.well }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(99, 102, 241, 0.16)", color: "#818cf8" }}
        >
          <FileImage size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold" style={{ color: palette.strong }}>
            选择本地文件 / 文档
          </div>
          <div className="truncate text-[9.5px]" style={{ color: palette.muted }}>
            通过 R2 端到端加密传输至工作站目录
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px]"
          style={{ backgroundColor: palette.card, color: palette.muted }}
        >
          /file
        </span>
      </button>
    </div>
  );
}

export function AtFilePickerOverlay({
  files,
  tall,
  palette,
  onToggleHeight,
  onPickFile,
  onClose,
}: {
  files: PocketQuickFile[];
  tall: boolean;
  palette: PocketThemePalette;
  onToggleHeight: () => void;
  onPickFile: (file: PocketQuickFile) => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`mx-3 mb-2 flex flex-col overflow-hidden rounded-[22px] shadow-2xl backdrop-blur-2xl transition-all duration-200 ${
        tall ? "max-h-[340px]" : "max-h-[168px]"
      }`}
      style={{
        backgroundColor: palette.popover,
        border: `1px solid ${palette.line}`,
      }}
    >
      {/* Header: @ 快捷文件 60 v × matching IMG_9009 */}
      <div
        className="flex shrink-0 items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${palette.line}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold"
            style={{ backgroundColor: palette.accentBg, color: palette.accent }}
          >
            @
          </span>
          <span className="text-[12px] font-semibold" style={{ color: palette.strong }}>
            快捷文件
          </span>
          <span
            className="rounded-full px-1.5 py-0.5 font-mono text-[9.5px]"
            style={{ backgroundColor: palette.well, color: palette.muted }}
          >
            60
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleHeight}
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.well, color: palette.muted }}
            aria-label={tall ? "收缩文件列表" : "展开长列表"}
          >
            {tall ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: palette.well, color: palette.muted }}
            aria-label="关闭文件选择器"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Scrollable file items matching IMG_9009 */}
      <div className="phone-scroll flex-1 overflow-y-auto px-2 py-1.5">
        {files.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onPickFile(f)}
            className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition hover:bg-current/[0.06]"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[8px] font-bold"
              style={{ backgroundColor: `${f.extColor}22`, color: f.extColor }}
            >
              {f.ext.slice(0, 3)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11.5px] font-semibold" style={{ color: palette.strong }}>
                {f.name}
              </div>
              <div className="truncate font-mono text-[9.5px]" style={{ color: palette.muted }}>
                {f.dir}
              </div>
            </div>
            <CornerDownLeft size={11} className="shrink-0 opacity-60" style={{ color: palette.muted }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function TerminalCommandCard({
  cmd,
  palette,
  onCopy,
}: {
  cmd: string;
  palette: PocketThemePalette;
  onCopy: () => void;
}) {
  return (
    <div className="space-y-1">
      <div
        className="overflow-hidden rounded-[16px]"
        style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
      >
        <div
          className="flex items-center justify-between px-2.5 py-1.5 text-[10px]"
          style={{ borderBottom: `1px solid ${palette.line}`, color: palette.muted }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="pl-1 font-mono text-[9.5px]">/usr/local/bin/codaway</span>
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="rounded p-0.5 hover:bg-current/[0.08]"
            aria-label="复制终端命令"
          >
            <Copy size={11} />
          </button>
        </div>
        <div className="break-all px-3 py-2 font-mono text-[10.5px] leading-snug sm:break-normal" style={{ color: palette.ink }}>
          <span style={{ color: palette.accent }}>$</span> {cmd}
        </div>
      </div>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px]"
        style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}`, color: palette.muted }}
      >
        原文 (388 B) <ChevronDown size={9} />
      </span>
    </div>
  );
}

export function MentionChip({
  file,
  palette,
  onRemove,
}: {
  file: PocketQuickFile;
  palette: PocketThemePalette;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[7px] px-1.5 py-0.5 text-[10.5px] font-medium"
      style={{
        backgroundColor: "rgba(41, 181, 245, 0.16)",
        border: "1px solid rgba(41, 181, 245, 0.28)",
      }}
    >
      <span className="font-mono text-[9px] font-bold" style={{ color: file.extColor }}>
        {file.ext}
      </span>
      <span className="max-w-[115px] truncate" style={{ color: palette.liveBlue }}>
        {file.name}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-current/[0.12]"
        style={{ color: palette.bodyMuted }}
        aria-label={`移除文件引用 ${file.name}`}
      >
        <X size={9} />
      </button>
    </span>
  );
}

export function GitInspectorView({ palette }: { palette: PocketThemePalette }) {
  return (
    <div className="phone-scroll flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-6">
      <div
        className="space-y-2 rounded-2xl p-3"
        style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch size={14} style={{ color: palette.accent }} />
            <span className="text-[12.5px] font-semibold" style={{ color: palette.strong }}>
              Changes ({GIT_INSPECTOR_FILES.length})
            </span>
          </div>
          <span className="font-mono text-[11px]" style={{ color: palette.green }}>
            +1,955 <span style={{ color: palette.red }}>-48</span>
          </span>
        </div>
        <div className="space-y-1.5">
          {GIT_INSPECTOR_FILES.map((f) => (
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
                  <span className="truncate font-mono text-[11px]" style={{ color: palette.strong }}>
                    {f.name}
                  </span>
                </div>
                <div className="truncate text-[9.5px]" style={{ color: palette.muted }}>
                  {f.note}
                </div>
              </div>
              <span className="shrink-0 pl-2 font-mono text-[10px]" style={{ color: palette.green }}>
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
              /photo & /file 端侧加密 · 15m TTL 自动销毁
            </div>
          </div>
        </div>
        <Check size={15} style={{ color: palette.green }} />
      </div>

      <div
        className="flex items-center justify-between rounded-2xl p-3"
        style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
      >
        <div className="flex items-center gap-2.5">
          <Slash size={15} style={{ color: palette.accent }} />
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
  );
}
