import { useState } from "react";
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

const INTEGRATION_ITEMS: IntegrationItem[] = [
  {
    name: "Claude Code",
    title: "stream-json",
    icon: <DriverIcon driver="CLAUDE_CODE" size={32} />,
    mono: true,
  },
  {
    name: "Codex",
    title: "Goal Mode",
    icon: <DriverIcon driver="CODEX" size={32} />,
    mono: true,
  },
  {
    name: "OpenCode",
    title: "ACP JSON-RPC",
    icon: <DriverIcon driver="OPENCODE" size={32} />,
    mono: true,
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

export function HomePage() {
  const { navigate } = useRouter();
  const [activeDriver, setActiveDriver] = useState<DriverKey>("CODEX");
  const [activeCmdId, setActiveCmdId] = useState<string>(WORKER_COMMANDS[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedDriver = DRIVERS.find((d) => d.id === activeDriver) ?? DRIVERS[0];
  const selectedWorkerCmd = WORKER_COMMANDS.find((c) => c.id === activeCmdId) ?? WORKER_COMMANDS[0];

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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 pt-10 pb-20 sm:pt-14 sm:pb-24">
        <GridBackground size={44} speed={6} fade={72} color="rgba(56, 189, 248, 0.08)">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
            {/* Left Copy & Metrics */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-medium text-sky-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                <span>CPS-v1.2 · AffectUI Native · 支持 OpenCode ACP 与 harness-shim</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
                  <TextReveal text="把本机 AI Coding 工作站，装进你的口袋。" by="char" stagger={16} duration={540} as="span" />
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                  零公网开放端口，电脑端通过{" "}
                  <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-sm text-zinc-200">
                    codaway start
                  </code>{" "}
                  反向建链；手机端 <strong className="font-semibold text-zinc-100">Pocket</strong>{" "}
                  采用全新 AffectUI Clean 组件与三套实时主题，随时随地完成模型切换、任务进度追踪与 Face ID 危险指令审批。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline shadow-[0_0_25px_rgba(255,255,255,0.2)] transition hover:bg-zinc-200"
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-200 no-underline transition hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <span>查看能力矩阵与路线图</span>
                </a>
              </div>

              {/* Copyable Quickstart Command Pill */}
              <div className="codaway-card flex max-w-xl items-center justify-between gap-3 rounded-2xl px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="font-mono text-xs text-sky-400">$</span>
                  <code className="truncate font-mono text-xs text-zinc-200 sm:text-[13px]">{QUICKSTART_CMD}</code>
                </div>
                <button
                  type="button"
                  onClick={() => copyCommand("quickstart", QUICKSTART_CMD)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  {copiedKey === "quickstart" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedKey === "quickstart" ? "已复制" : "复制"}</span>
                </button>
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <div className="text-2xl font-bold text-white">
                    <NumberTicker value={5} />
                  </div>
                  <div className="text-xs text-zinc-400">原生 Agent 驱动</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <div className="text-2xl font-bold text-emerald-400">
                    <NumberTicker value={0} />
                  </div>
                  <div className="text-xs text-zinc-400">公网入站监听端口</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <div className="text-2xl font-bold text-sky-400">
                    <NumberTicker value={32} />
                  </div>
                  <div className="text-xs text-zinc-400">帧离线缓冲队列</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                  <div className="text-2xl font-bold text-white">
                    <NumberTicker value={15} />m
                  </div>
                  <div className="text-xs text-zinc-400">R2 零知识加密直传</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Pocket Phone Studio */}
            <PocketSimulator />
          </div>
        </GridBackground>
      </section>

      {/* SECTION: POCKET UI & THEME ARCHITECTURE */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-400">
            <Smartphone size={14} /> Pocket iOS · AffectUI Clean 重构体验
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            为拇指操作与高密度信息而重塑的移动端界面
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            右侧模拟器中的每一个交互组件——从紧凑全圆角胶囊输入框到内联双轴模型配置、圆形驱动图标任务监视器与 Face ID 审批——都来自 Pocket 真实生产代码映射。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Sparkles size={18} className="text-sky-400" />,
              title: "紧凑胶囊 → 拖拽扩展输入",
              desc: "未聚焦时高度与按钮对齐，显示简洁 '...' 全圆角胶囊；点击展开顶部拖拽 Handle 调高输入区，并将模型与推理配置收拢至左下角。",
            },
            {
              icon: <Layers size={18} className="text-emerald-400" />,
              title: "双轴独立锁定的 ModelPicker",
              desc: "点击模型或思考强度立即视觉切换并显示加载转圈锁定当前轴，选完模型无需等待即可继续切换推理强度。",
            },
            {
              icon: <Cpu size={18} className="text-violet-400" />,
              title: "精简圆形图标 AgentMonitor",
              desc: "去除冗余驱动文字占用，统一在 DriverConfig 配好圆形图标；折叠态保留 [图标 | 已完成 | 耗时 | 4/4] 并持久化进历史记录。",
            },
            {
              icon: <ShieldCheck size={18} className="text-amber-400" />,
              title: "一套配置驱动 3 套深浅皮肤",
              desc: "ThemeManager 与 PocketAffectUITheme 一站式定义 Space / Terminal / Cyberpunk 的圆角、色彩、字体与 SF Symbols。",
            },
          ].map((card) => (
            <div key={card.title} className="codaway-card rounded-2xl p-5 transition">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                {card.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: WORKER 5 DRIVERS + HARNESS SHIM + MODEL WHEEL */}
      <section id="worker-core" className="border-y border-white/10 bg-[#080a10] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                <Terminal size={14} /> Codaway Worker (Go Binary)
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                五大原生 Agent 驱动与守护级后台托管
              </h2>
              <p className="text-sm text-zinc-400 sm:text-base">
                一个轻量 Go 二进制接入您本机已有的 AI 命令行工具，兼容 Claude Code、Codex（含 Goal Mode）、OpenCode ACP、Codewhale 与原生 Shell。
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-500">macOS launchd · Linux systemd · zero runtime bloat</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            {/* Interactive Driver Inspector + CLI Runner */}
            <div className="space-y-5">
              {/* Driver Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {DRIVERS.map((drv) => {
                  const active = drv.id === activeDriver;
                  return (
                    <button
                      key={drv.id}
                      type="button"
                      onClick={() => setActiveDriver(drv.id)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                        active
                          ? "border-sky-400/50 bg-sky-500/15 text-white shadow-[0_0_20px_rgba(56,189,248,0.16)]"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-100"
                      }`}
                    >
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${drv.badgeColor}22`, color: drv.badgeColor }}
                      >
                        <DriverIcon driver={drv.id} size={12} />
                      </span>
                      <span>{drv.displayName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Driver Detail Card */}
              <div className="codaway-card rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15"
                      style={{ backgroundColor: `${selectedDriver.badgeColor}20`, color: selectedDriver.badgeColor }}
                    >
                      <DriverIcon driver={selectedDriver.id} size={20} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{selectedDriver.displayName}</h3>
                        <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                          {selectedDriver.id}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-zinc-400">{selectedDriver.protocol}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(`drv-${selectedDriver.id}`, selectedDriver.sampleCommand)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:bg-white/10"
                  >
                    {copiedKey === `drv-${selectedDriver.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{selectedDriver.sampleCommand}</span>
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-zinc-400">核心适配能力</div>
                    <ul className="space-y-1.5 text-sm text-zinc-200">
                      {selectedDriver.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-zinc-400">支持推理深度档位（SESSION_CONFIG）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDriver.thinkingLevels.map((lvl) => (
                        <span
                          key={lvl}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-200"
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
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {WORKER_COMMANDS.map((wc) => (
                      <button
                        key={wc.id}
                        type="button"
                        onClick={() => setActiveCmdId(wc.id)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-xs transition ${
                          wc.id === activeCmdId
                            ? "bg-white text-zinc-950 font-semibold"
                            : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                        }`}
                      >
                        {wc.cmd.split(" ")[0]} {wc.cmd.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(`wc-${selectedWorkerCmd.id}`, selectedWorkerCmd.cmd)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Copy size={12} /> 复制命令
                  </button>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{selectedWorkerCmd.title}</div>
                    <p className="text-xs text-zinc-400">{selectedWorkerCmd.desc}</p>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-3.5 font-mono text-xs leading-relaxed text-zinc-300">
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
            <div className="codaway-card flex flex-col justify-between rounded-2xl p-6">
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-wider text-sky-400">
                  Model Ecosystem · 滚动拖拽交互
                </div>
                <h3 className="text-lg font-bold text-white">跨厂商模型与本地驱动自由切换</h3>
                <p className="text-xs leading-relaxed text-zinc-400">
                  支持拖拽拨盘体验多模型轮转。Pocket 会根据工作站实时上报的 <code className="font-mono text-zinc-300">CAPABILITY_MANIFEST</code> 动态生成内联配置列表。
                </p>
              </div>

              <div data-theme="dark" className="dark my-4 overflow-hidden rounded-xl border border-white/10 bg-[#121318] py-2">
                <ModelWheel hold={1800} label="Supported AI coding models and providers" />
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <strong className="font-semibold">harness-shim 防断流保障：</strong>
                即使 Worker 进程升级或重启，底层 Unix Socket Proxy 仍持有活跃 CLI 与 4 MiB 环形缓冲输出。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SECURITY & CPS-v1.2 DATAFLOW WITH INTEGRATION FLOW + TILT CARDS */}
      <section id="security" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400">
            <Lock size={14} /> CPS-v1.2 Wire Protocol & Zero-Trust Pipe
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            中继只见密文数据包，私钥永不离开您的终端与手机
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            下方的实时数据流场景采用 AffectUI IntegrationFlow 组件渲染：五大本地驱动与能力经由 X25519 + ChaCha20-Poly1305 封包后，通过盲转发中继汇聚至 Pocket 安全控制面。
          </p>
        </div>

        {/* AffectUI IntegrationFlow in Dark Mode */}
        <div data-theme="dark" className="dark mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[#1f1f21] shadow-2xl">
          <IntegrationFlow
            items={INTEGRATION_ITEMS}
            label="Codaway 本地驱动、harness-shim 与 R2 加密流向盲转发中继与手机控制中心"
          />
        </div>

        {/* 4 TiltCard Pillars */}
        <div className="grid gap-5 md:grid-cols-2">
          {ARCHITECTURE_PILLARS.map((pillar) => (
            <TiltCard key={pillar.title} maxTilt={6} scale={1.01}>
              <div className="codaway-card h-full rounded-2xl p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-300">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">{pillar.detail}</p>
                <div className="inline-block rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                  {pillar.spec}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* BOTTOM GRADIENT FLOOR CTA */}
      <GradientFloor colors={["#0ea5e9", "#6366f1", "#10b981"]} speed={4}>
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            准备好随时随地掌握你的 AI 工作站了吗？
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            一分钟注册 Codaway 账号并运行 <code className="font-mono text-white">codaway doctor</code> 与{" "}
            <code className="font-mono text-white">codaway start --pair</code>，即刻在 iPhone Pocket 中体验全套端到端加密远程编程工作流。
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 py-3 text-sm font-medium text-white no-underline backdrop-blur-md transition hover:bg-black/60"
            >
              <span>浏览更新路线图</span>
            </a>
          </div>
        </section>
      </GradientFloor>
    </div>
  );
}
