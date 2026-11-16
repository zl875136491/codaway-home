import { ShieldCheck, Terminal } from "lucide-react";
import { useRouter } from "../router";

export function Footer() {
  const { navigate } = useRouter();

  const go = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-elevated)]/90 py-10 text-sm text-[var(--text-muted)] transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[var(--text-main)]">
            <Terminal size={15} className="text-sky-400 site-light:text-sky-600" />
            <span className="font-semibold">Codaway</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 site-light:border-emerald-600/25 site-light:text-emerald-700">
              <ShieldCheck size={12} /> X25519 + ChaCha20-Poly1305 E2EE
            </span>
          </div>
          <p className="text-xs text-[var(--text-sub)]">
            Worker · Pipe Blind Relay · Pocket iOS (AffectUI Native)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm">
          <a href="/" onClick={(e) => go(e, "/")} className="transition hover:text-[var(--text-main)]">
            产品首页
          </a>
          <a href="/register" onClick={(e) => go(e, "/register")} className="transition hover:text-[var(--text-main)]">
            注册 / 重置密码
          </a>
          <a href="/roadmap" onClick={(e) => go(e, "/roadmap")} className="transition hover:text-[var(--text-main)]">
            更新路线图
          </a>
          <a href="/#security" onClick={(e) => go(e, "/#security")} className="transition hover:text-[var(--text-main)]">
            安全架构
          </a>
          <a href="/terms" onClick={(e) => go(e, "/terms")} className="transition hover:text-[var(--text-main)]">
            服务协议
          </a>
          <a href="/privacy" onClick={(e) => go(e, "/privacy")} className="transition hover:text-[var(--text-main)]">
            隐私政策
          </a>
        </div>
      </div>
    </footer>
  );
}
