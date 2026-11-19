import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Layers,
  Lock,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useRouter } from "../router";
import { ARCHITECTURE_PILLARS, DRIVERS, WORKER_COMMANDS, type DriverKey } from "../data/codaway";
import { useSiteTheme } from "../theme/siteTheme";
import { DriverIcon } from "../components/DriverIcon";
import { PocketSimulator } from "../components/PocketSimulator";
import { toast } from "../components/affectui/ui/toaster-clean";
import { GridBackground } from "../components/affectui/motion/grid-background";
import { GradientFloor } from "../components/affectui/motion/gradient-floor";
import { TextReveal } from "../components/affectui/motion/text-reveal";
import { TiltCard } from "../components/affectui/motion/tilt-card";
import { NumberTicker } from "../components/affectui/motion/number-ticker";
import { IntegrationFlow, type IntegrationItem } from "../components/affectui/illustrations/integration-flow";
import { ModelWheel } from "../components/affectui/illustrations/model-wheel";

const QUICKSTART_CMD = "codaway login && codaway workspace add . && codaway start --pair";

function buildIntegrationItems(scheme: "dark" | "light"): IntegrationItem[] {
  return [
    {
      name: "Claude Code",
      title: "stream-json",
      icon: <DriverIcon driver="CLAUDE_CODE" size={32} scheme={scheme} />,
      mono: false,
    },
    {
      name: "Codex",
      title: "Goal Mode",
      icon: <DriverIcon driver="CODEX" size={32} scheme={scheme} />,
      mono: true,
    },
    {
      name: "Antigravity",
      title: "agy acp",
      icon: <DriverIcon driver="ANTIGRAVITY" size={32} scheme={scheme} />,
      mono: false,
    },
    {
      name: "Cursor",
      title: "Agent · @文件",
      icon: <DriverIcon driver="CURSOR" size={32} scheme={scheme} />,
      mono: false,
    },
    {
      name: "OpenCode",
      title: "ACP JSON-RPC",
      icon: <DriverIcon driver="OPENCODE" size={32} scheme={scheme} />,
      mono: false,
    },
    {
      name: "harness-shim",
      title: "4 MiB Ring",
      icon: <Cpu size={32} />,
      mono: true,
    },
    {
      name: "R2 E2EE Blob",
      title: "15m TTL",
      icon: <Lock size={32} />,
      mono: true,
    },
    {
      name: "Face ID",
      title: "Pocket 审批",
      icon: <ScanFace size={32} />,
      mono: true,
    },
  ];
}

export function HomePage() {
  const { navigate } = useRouter();
  const { siteTheme } = useSiteTheme();
  const [activeDriver, setActiveDriver] = useState<DriverKey>("CODEX");
  const [activeCmdId, setActiveCmdId] = useState<string>(WORKER_COMMANDS[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedDriver = DRIVERS.find((d) => d.id === activeDriver) ?? DRIVERS[0];
  const selectedWorkerCmd = WORKER_COMMANDS.find((c) => c.id === activeCmdId) ?? WORKER_COMMANDS[0];
  const integrationItems = useMemo(() => buildIntegrationItems(siteTheme), [siteTheme]);

  const copyCommand = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("命令已复制到剪贴板", { description: text });
      window.setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800);
    } catch {
      toast.info("请手动复制命令", { description: text });
    }
  };

  return (
    <div className="relative">
      {/* HERO SECTION (Do not set data-theme here so PocketSimulator stays 100% isolated) */}
      <section className="relative overflow-hidden border-b border-[var(--border)] pt-6 pb-14 sm:pt-14 sm:pb-24">
        <GridBackground
          size={44}
          speed={6}
          fade={72}
          color={siteTheme === "dark" ? "rgba(56, 189, 248, 0.08)" : "rgba(2, 132, 199, 0.09)"}
        >
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
            {/* Left Copy & Metrics */}
            <div className="min-w-0 space-y-5 sm:space-y-7">
              <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-medium leading-snug text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700 sm:rounded-full sm:px-3.5 sm:text-xs">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-sky-400 site-light:bg-sky-600" />
                <span>CPS-v1.3 · AffectUI Native · 支持 Antigravity ACP、Cursor 生态与 harness-shim</span>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <h1 className="text-[1.85rem] font-bold leading-[1.2] tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
                  <TextReveal text="把本机 AI Coding 工作站，装进你的口袋。" by="char" stagger={16} duration={540} as="span" />
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-lg">
                  零公网开放端口，电脑端通过{" "}
                  <code className="rounded bg-[var(--surface-strong)] px-1.5 py-0.5 font-mono text-xs text-[var(--text-main)] sm:text-sm">
                    codaway start
                  </code>{" "}
                  反向建链；手机端 <strong className="font-semibold text-[var(--text-main)]">Pocket</strong>{" "}
                  采用全新 AffectUI Clean 组件与三套实时主题，随时随地完成模型切换、任务进度追踪与 Face ID 危险指令审批。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline shadow-[0_0_25px_rgba(255,255,255,0.2)] transition hover:bg-zinc-200 site-light:bg-slate-900 site-light:text-white site-light:shadow-md site-light:hover:bg-slate-800 sm:w-auto"
                >
                  <span>注册账号并开始配对</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/roadmap"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/roadmap");
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--text-main)] no-underline transition hover:bg-[var(--surface-strong)] sm:w-auto"
                >
                  <span>查看能力矩阵与路线图</span>
                </a>
              </div>

              {/* Copyable Quickstart Command Pill */}
              <div className="codaway-card flex max-w-xl items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
                <div className="no-scrollbar flex min-w-0 items-center gap-2 overflow-x-auto sm:gap-2.5">
                  <span className="shrink-0 font-mono text-xs text-sky-400 site-light:text-sky-600">$</span>
                  <code className="whitespace-nowrap font-mono text-[11.5px] text-[var(--text-main)] sm:truncate sm:text-[13px]">{QUICKSTART_CMD}</code>
                </div>
                <button
                  type="button"
                  onClick={() => copyCommand("quickstart", QUICKSTART_CMD)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-strong)]"
                >
                  {copiedKey === "quickstart" ? <Check size={13} className="text-emerald-400 site-light:text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedKey === "quickstart" ? "已复制" : "复制"}</span>
                </button>
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4 sm:gap-4 sm:pt-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 sm:px-4 sm:py-3">
                  <div className="text-xl font-bold text-[var(--text-main)] sm:text-2xl">
                    <NumberTicker value={7} />
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] sm:text-xs">Worker 原生驱动 · Cursor 适配</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 sm:px-4 sm:py-3">
                  <div className="text-xl font-bold text-emerald-400 site-light:text-emerald-600 sm:text-2xl">
                    <NumberTicker value={0} />
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] sm:text-xs">公网入站监听端口</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 sm:px-4 sm:py-3">
                  <div className="text-xl font-bold text-sky-400 site-light:text-sky-600 sm:text-2xl">
                    <NumberTicker value={32} />
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] sm:text-xs">帧离线缓冲队列</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 sm:px-4 sm:py-3">
                  <div className="text-xl font-bold text-[var(--text-main)] sm:text-2xl">
                    <NumberTicker value={100} />
                    <span className="text-sm font-semibold">MB</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] sm:text-xs">R2 分块零知识加密直传</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Pocket Phone Studio */}
            <div className="min-w-0">
              <PocketSimulator />
            </div>
          </div>
        </GridBackground>
      </section>

      {/* SECTION: POCKET UI & THEME ARCHITECTURE */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 max-w-2xl space-y-2.5 sm:mb-12 sm:space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-400 site-light:text-sky-600">
            <Smartphone size={14} /> Pocket iOS · AffectUI Clean 重构体验
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
            为拇指操作与高密度信息而重塑的移动端界面
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            上方/右侧模拟器按 Pocket iOS 最新实机界面还原：悬浮毛玻璃输入框（“接下来...”）、居中回底按钮、
            <code className="rounded bg-[var(--surface-strong)] px-1 font-mono text-[var(--text-main)]">@</code> 全高文件芯片选择器、三列指令网格，以及 Antigravity / Cursor 统一品牌徽章交互。
          </p>
        </div>

        <div className="grid gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Sparkles size={18} className="text-sky-400 site-light:text-sky-600" />,
              title: "悬浮“接下来...”胶囊 + 居中回底",
              desc: "取消底部遮罩，输入条以紧凑毛玻璃直接悬浮于消息流上方；向上翻阅历史时正上方居中浮出圆形回底按钮，一键回到最新消息。",
            },
            {
              icon: <Layers size={18} className="text-emerald-400 site-light:text-emerald-600" />,
              title: "@ 全高文件拾取与行内 × 芯片",
              desc: "输入 @ 即刻展开全高文件列表并支持下滑无条目标注缩回；选中后以内嵌着色胶囊展示，右侧附带小 × 按钮一键移除无卡顿。",
            },
            {
              icon: <Cpu size={18} className="text-violet-400 site-light:text-violet-600" />,
              title: "三列指令宫格与 /photo · /file",
              desc: "点 ≡ 展开 3 列指令矩阵（/goal、/mode、/thinking、/stop）；点 + 发起 /photo 截图或 /file 本地文件的 R2 端到端加密直传。",
            },
            {
              icon: <ShieldCheck size={18} className="text-amber-400 site-light:text-amber-600" />,
              title: "统一品牌图标与双轴 ModelPicker",
              desc: "采用统一 brand_icons 渲染会话右下角角标、折叠 AgentMonitor 与 Face ID 审批；左下角内联配置模型与多档思考程度独立锁定。",
            },
          ].map((card) => (
            <div key={card.title} className="codaway-card rounded-2xl p-4 transition sm:p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {card.icon}
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-[var(--text-main)] sm:mb-2">{card.title}</h3>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: WORKER DRIVERS + HARNESS SHIM + MODEL WHEEL */}
      <section id="worker-core" className="scroll-mt-16 border-y border-[var(--border)] bg-[#080a10] py-14 transition-colors site-light:bg-slate-100/70 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:mb-10 md:flex-row md:items-end md:gap-4">
            <div className="max-w-2xl space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 site-light:text-emerald-600">
                <Terminal size={14} /> Codaway Worker (Go Binary)
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
                多 Agent 原生驱动 · 新增 Antigravity 与 Cursor 能力生态
              </h2>
              <p className="text-sm text-[var(--text-muted)] sm:text-base">
                一个轻量 Go 二进制接入您本机 AI 工具链：已原生支持 Codex、Antigravity（
                <code className="rounded bg-[var(--surface-strong)] px-1 font-mono text-[var(--text-main)]">agy acp</code> 断线恢复）、Cursor、Claude Code、OpenCode、Codewhale 与 Shell。
              </p>
            </div>
            <div className="font-mono text-[11px] text-[var(--text-sub)] sm:text-xs">macOS launchd · Linux systemd · zero runtime bloat</div>
          </div>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            {/* Interactive Driver Inspector + CLI Runner */}
            <div className="min-w-0 space-y-4 sm:space-y-5">
              {/* Driver Selector Pills (horizontally scrollable on mobile, wrapped on sm+) */}
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {DRIVERS.map((drv) => {
                  const active = drv.id === activeDriver;
                  return (
                    <button
                      key={drv.id}
                      type="button"
                      onClick={() => setActiveDriver(drv.id)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-3.5 ${
                        active
                          ? "border-sky-400/50 bg-sky-500/15 text-white shadow-[0_0_20px_rgba(56,189,248,0.16)] site-light:border-sky-600/40 site-light:text-sky-900 site-light:shadow-sm"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${drv.badgeColor}22`, color: drv.badgeColor }}
                      >
                        <DriverIcon driver={drv.id} size={12} scheme={siteTheme} />
                      </span>
                      <span>{drv.displayName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Driver Detail Card */}
              <div className="codaway-card rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] sm:h-11 sm:w-11"
                      style={{ backgroundColor: `${selectedDriver.badgeColor}20`, color: selectedDriver.badgeColor }}
                    >
                      <DriverIcon driver={selectedDriver.id} size={20} scheme={siteTheme} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="text-base font-bold text-[var(--text-main)] sm:text-lg">{selectedDriver.displayName}</h3>
                        <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                          {selectedDriver.id}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            selectedDriver.availability === "shipped"
                              ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 site-light:border-emerald-600/25 site-light:text-emerald-700"
                              : "border-sky-400/35 bg-sky-500/10 text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700"
                          }`}
                        >
                          {selectedDriver.statusLabel}
                        </span>
                      </div>
                      <div className="truncate font-mono text-[11px] text-[var(--text-muted)] sm:text-xs">{selectedDriver.protocol}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(`drv-${selectedDriver.id}`, selectedDriver.sampleCommand)}
                    className="inline-flex w-full max-w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--text-main)] transition hover:bg-[var(--surface-strong)] sm:w-auto sm:justify-start sm:py-1.5"
                  >
                    <span className="min-w-0 truncate">{selectedDriver.sampleCommand}</span>
                    {copiedKey === `drv-${selectedDriver.id}` ? (
                      <Check size={12} className="shrink-0 text-emerald-400 site-light:text-emerald-600" />
                    ) : (
                      <Copy size={12} className="shrink-0" />
                    )}
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[var(--text-muted)]">核心适配能力</div>
                    <ul className="space-y-1.5 text-xs text-[var(--text-main)] sm:text-sm">
                      {selectedDriver.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400 site-light:text-emerald-600" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[var(--text-muted)]">支持推理深度档位（SESSION_CONFIG）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDriver.thinkingLevels.map((lvl) => (
                        <span
                          key={lvl}
                          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-main)]"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker CLI Workflows (`doctor`, `start --pair`, `service`) */}
              <div className="codaway-card overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-2 sm:px-4 sm:py-2.5">
                  <div className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto">
                    {WORKER_COMMANDS.map((wc) => (
                      <button
                        key={wc.id}
                        type="button"
                        onClick={() => setActiveCmdId(wc.id)}
                        className={`shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs transition ${
                          wc.id === activeCmdId
                            ? "bg-white font-semibold text-zinc-950 site-light:bg-slate-900 site-light:text-white"
                            : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-main)]"
                        }`}
                      >
                        {wc.cmd.split(" ")[0]} {wc.cmd.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(`wc-${selectedWorkerCmd.id}`, selectedWorkerCmd.cmd)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text-main)]"
                  >
                    <Copy size={12} /> <span className="hidden min-[380px]:inline">复制命令</span>
                  </button>
                </div>

                <div className="space-y-3 p-3.5 sm:p-4">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-main)]">{selectedWorkerCmd.title}</div>
                    <p className="text-xs text-[var(--text-muted)]">{selectedWorkerCmd.desc}</p>
                  </div>
                  <pre className="max-w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[#07090f] p-3 font-mono text-[11px] leading-relaxed text-zinc-300 site-light:bg-slate-900 site-light:text-slate-100 sm:p-3.5 sm:text-xs">
                    <code>
                      <span className="text-sky-400">$ {selectedWorkerCmd.cmd}</span>
                      {"\n"}
                      {selectedWorkerCmd.outputLines.join("\n")}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* AffectUI ModelWheel Showcase */}
            <div className="codaway-card flex min-w-0 flex-col justify-between rounded-2xl p-4 sm:p-6">
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-wider text-sky-400 site-light:text-sky-600">
                  Model Ecosystem · 滚动拖拽交互
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)] sm:text-lg">跨厂商模型与本地驱动自由切换</h3>
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                  支持拖拽拨盘体验多模型轮转。Pocket 会根据工作站实时上报的 <code className="font-mono text-[var(--text-main)]">CAPABILITY_MANIFEST</code> 动态生成内联配置列表。
                </p>
              </div>

              <div
                data-theme={siteTheme}
                className={`${siteTheme === "dark" ? "dark bg-[#121318]" : "bg-slate-50"} my-4 overflow-hidden rounded-xl border border-[var(--border)] py-2 transition-colors`}
              >
                <ModelWheel hold={1800} label="Supported AI coding models and providers" />
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-200 site-light:border-emerald-600/25 site-light:text-emerald-800">
                <strong className="font-semibold">harness-shim 防断流保障：</strong>
                即使 Worker 进程升级或重启，底层 Unix Socket Proxy 仍持有活跃 CLI 与 4 MiB 环形缓冲输出。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SECURITY & CPS-v1.3 DATAFLOW WITH INTEGRATION FLOW + TILT CARDS */}
      <section id="security" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-7 max-w-2xl space-y-2.5 sm:mb-10 sm:space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400 site-light:text-amber-600">
            <Lock size={14} /> CPS-v1.3 Wire Protocol & Zero-Trust Pipe
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
            中继只见密文数据包，私钥永不离开您的终端与手机
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            下方的实时数据流场景采用 AffectUI IntegrationFlow 组件渲染：Codex、Antigravity、Cursor、Claude Code 与本地守护能力经由 X25519 + ChaCha20-Poly1305 封包后，通过盲转发中继汇聚至 Pocket 安全控制面。
          </p>
        </div>

        {/* AffectUI IntegrationFlow tracks siteTheme independently + Mobile Readable Pipeline Companion */}
        <div
          data-theme={siteTheme}
          className={`${siteTheme === "dark" ? "dark bg-[#1f1f21] shadow-2xl" : "bg-[#fafafa] shadow-lg"} mb-7 overflow-hidden rounded-2xl border border-[var(--border)] transition-colors sm:mb-10 sm:rounded-3xl`}
        >
          <IntegrationFlow
            items={integrationItems}
            label="Codaway 本地驱动、harness-shim 与 R2 加密流向盲转发中继与手机控制中心"
          />

          {/* Mobile-only crisp readable breakdown so phone screens can read every node clearly */}
          <div className="space-y-3 border-t border-[var(--border)] bg-[var(--bg-elevated)]/90 p-3.5 sm:hidden">
            <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)]">
              <span>端到端加密汇聚节点</span>
              <span className="font-mono text-[10px] text-sky-400 site-light:text-sky-600">X25519 → ChaCha20-Poly1305</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {integrationItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-strong)] text-[var(--text-main)] [&>svg]:h-3.5 [&>svg]:w-3.5">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-[var(--text-main)]">{item.name}</div>
                    <div className="truncate font-mono text-[10px] text-[var(--text-muted)]">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 TiltCard Pillars */}
        <div
          data-theme={siteTheme}
          className={`${siteTheme === "dark" ? "dark " : ""}grid gap-3.5 sm:gap-5 md:grid-cols-2`}
        >
          {ARCHITECTURE_PILLARS.map((pillar) => (
            <TiltCard key={pillar.title} maxTilt={6} scale={1.01}>
              <div className="codaway-card h-full rounded-2xl p-4 sm:p-6">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
                  <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[var(--text-main)] sm:mb-2 sm:text-lg">{pillar.title}</h3>
                <p className="mb-3.5 text-xs leading-relaxed text-[var(--text-muted)] sm:mb-4 sm:text-sm">{pillar.detail}</p>
                <div className="inline-block max-w-full break-all rounded-lg border border-[var(--border)] bg-[var(--surface-code)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--text-main)] sm:break-normal sm:text-[11px]">
                  {pillar.spec}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* BOTTOM GRADIENT FLOOR CTA */}
      <div data-theme={siteTheme} className={siteTheme === "dark" ? "dark" : undefined}>
        <GradientFloor colors={["#0ea5e9", "#6366f1", "#10b981"]} speed={4}>
          <section className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
              准备好随时随地掌握你的 AI 工作站了吗？
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-base">
              一分钟注册 Codaway 账号并运行 <code className="font-mono font-semibold text-[var(--text-main)]">codaway doctor</code> 与{" "}
              <code className="font-mono font-semibold text-[var(--text-main)]">codaway start --pair</code>，即刻在 iPhone Pocket 中体验全套端到端加密远程编程工作流。
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 site-light:bg-slate-900 site-light:text-white site-light:hover:bg-slate-800 sm:w-auto"
              >
                <span>立即注册或重置密码</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/roadmap"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/roadmap");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-black/40 px-6 py-3 text-sm font-medium text-white no-underline backdrop-blur-md transition hover:bg-black/60 site-light:bg-white/85 site-light:text-slate-900 site-light:hover:bg-white sm:w-auto"
              >
                <span>浏览更新路线图</span>
              </a>
            </div>
          </section>
        </GradientFloor>
      </div>
    </div>
  );
}
