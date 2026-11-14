import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { ROADMAP_SECTIONS } from "../data/codaway";
import { useRouter } from "../router";
import { useSiteTheme } from "../theme/siteTheme";
import { GridBackground } from "../components/affectui/motion/grid-background";

export function RoadmapPage() {
  const { navigate } = useRouter();
  const { siteTheme } = useSiteTheme();

  return (
    <section className="relative flex-1 py-12 sm:py-16">
      <GridBackground
        size={44}
        speed={0}
        fade={78}
        color={siteTheme === "dark" ? "rgba(56, 189, 248, 0.06)" : "rgba(2, 132, 199, 0.08)"}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700">
              <Sparkles size={13} /> Engineering Roadmap
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)] sm:text-4xl">
              产品能力矩阵与演进路线图
            </h1>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
              严格对齐 <code className="font-mono text-[var(--text-main)]">codaway-worker</code>、{" "}
              <code className="font-mono text-[var(--text-main)]">codaway-pipe</code> 与{" "}
              <code className="font-mono text-[var(--text-main)]">codaway-pocket</code> 当前真实开发进度。
            </p>
          </div>

          <div className="space-y-8">
            {ROADMAP_SECTIONS.map((sec) => {
              const badgeStyle =
                sec.status === "shipped"
                  ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300 site-light:border-emerald-600/25 site-light:text-emerald-700"
                  : sec.status === "in-progress"
                    ? "border-sky-500/35 bg-sky-500/10 text-sky-300 site-light:border-sky-600/25 site-light:text-sky-700"
                    : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]";

              const Icon = sec.status === "shipped" ? CheckCircle2 : Clock;

              return (
                <div key={sec.title} className="codaway-card rounded-3xl p-6 sm:p-8">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
                    <div className="space-y-1.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${badgeStyle}`}>
                        <Icon size={12} /> {sec.badge}
                      </span>
                      <h2 className="text-xl font-bold text-[var(--text-main)] sm:text-2xl">{sec.title}</h2>
                      <p className="text-xs text-[var(--text-muted)] sm:text-sm">{sec.subtitle}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {sec.items.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--border-strong)]"
                      >
                        <span className="mb-1.5 inline-block rounded bg-[var(--surface-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-300 site-light:text-sky-700">
                          {item.scope}
                        </span>
                        <h3 className="mb-1 text-sm font-semibold text-[var(--text-main)]">{item.name}</h3>
                        <p className="text-xs leading-relaxed text-[var(--text-muted)]">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 site-light:bg-slate-900 site-light:text-white site-light:hover:bg-slate-800"
            >
              <span>注册账号并体验最新特性</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </GridBackground>
    </section>
  );
}
