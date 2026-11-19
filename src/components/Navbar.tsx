import { useState } from "react";
import { Menu, Moon, Sun, Terminal, X } from "lucide-react";
import { useRouter } from "../router";
import { useSiteTheme } from "../theme/siteTheme";

export function Navbar() {
  const { route, navigate } = useRouter();
  const { siteTheme, toggleSiteTheme } = useSiteTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(to);
  };

  const navClass = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm transition-colors ${
      active
        ? "bg-[var(--surface-strong)] font-medium text-[var(--text-main)]"
        : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-2 px-3.5 sm:h-16 sm:px-6">
        <a
          href="/"
          onClick={(e) => handleLink(e, "/")}
          className="flex min-w-0 shrink-0 items-center gap-2 text-[var(--text-main)] no-underline transition-opacity hover:opacity-90 sm:gap-2.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/15 text-sky-400 site-light:border-sky-600/25 site-light:text-sky-600">
            <Terminal size={16} strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Codaway</span>
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)] sm:inline-block">
            CPS-v1.3
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          <a href="/" onClick={(e) => handleLink(e, "/")} aria-current={route === "/" ? "page" : undefined} className={navClass(route === "/")}>
            首页
          </a>
          <a href="/#pocket-studio" onClick={(e) => handleLink(e, "/#pocket-studio")} className={navClass(false)}>
            Pocket 设计
          </a>
          <a href="/#worker-core" onClick={(e) => handleLink(e, "/#worker-core")} className={navClass(false)}>
            Worker 驱动
          </a>
          <a href="/#security" onClick={(e) => handleLink(e, "/#security")} className={navClass(false)}>
            零信任安全
          </a>
          <a
            href="/roadmap"
            onClick={(e) => handleLink(e, "/roadmap")}
            aria-current={route === "/roadmap" ? "page" : undefined}
            className={navClass(route === "/roadmap")}
          >
            路线图
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            data-testid="site-theme-toggle"
            onClick={toggleSiteTheme}
            className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)] sm:h-8.5 sm:w-auto sm:px-3"
            aria-label={siteTheme === "dark" ? "切换全站为浅色模式" : "切换全站为深色模式"}
            title="切换全站浅色 / 深色模式（与手机模拟器外观独立）"
          >
            {siteTheme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
            <span className="hidden sm:inline">{siteTheme === "dark" ? "浅色" : "深色"}</span>
          </button>

          <a
            href="/register"
            onClick={(e) => handleLink(e, "/register")}
            aria-current={route === "/register" ? "page" : undefined}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200 site-light:bg-slate-900 site-light:text-white site-light:hover:bg-slate-800 sm:h-auto sm:px-4 sm:py-1.5 sm:text-sm"
          >
            <span className="sm:hidden">{route === "/register" ? "账号服务" : "注册 / 登录"}</span>
            <span className="hidden sm:inline">{route === "/register" ? "账号服务" : "注册 / 登录管理"}</span>
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] md:hidden"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-x-0 top-15 bottom-0 z-30 bg-black/45 backdrop-blur-xs md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="移动端导航菜单"
            className="relative z-40 border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 pt-3 pb-5 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              <a
                href="/"
                onClick={(e) => handleLink(e, "/")}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                  route === "/" ? "bg-[var(--surface-strong)] text-[var(--text-main)]" : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
                }`}
              >
                <span>首页</span>
                <span className="font-mono text-[10px] text-[var(--text-sub)]">CPS-v1.3</span>
              </a>
              <a
                href="/#pocket-studio"
                onClick={(e) => handleLink(e, "/#pocket-studio")}
                className="rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
              >
                Pocket 交互模拟器
              </a>
              <a
                href="/#worker-core"
                onClick={(e) => handleLink(e, "/#worker-core")}
                className="rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
              >
                Worker 多引擎驱动
              </a>
              <a
                href="/#security"
                onClick={(e) => handleLink(e, "/#security")}
                className="rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
              >
                零信任端到端安全
              </a>
              <a
                href="/roadmap"
                onClick={(e) => handleLink(e, "/roadmap")}
                className={`rounded-xl px-3.5 py-2.5 text-sm ${
                  route === "/roadmap" ? "bg-[var(--surface-strong)] font-medium text-[var(--text-main)]" : "text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]"
                }`}
              >
                更新路线图
              </a>
              <div className="my-1.5 border-t border-[var(--border)]" />
              <div className="grid grid-cols-2 gap-2 px-1 py-1 text-xs">
                <a
                  href="/terms"
                  onClick={(e) => handleLink(e, "/terms")}
                  className="rounded-lg bg-[var(--surface)] px-3 py-2 text-center text-[var(--text-muted)] no-underline hover:text-[var(--text-main)]"
                >
                  服务协议
                </a>
                <a
                  href="/privacy"
                  onClick={(e) => handleLink(e, "/privacy")}
                  className="rounded-lg bg-[var(--surface)] px-3 py-2 text-center text-[var(--text-muted)] no-underline hover:text-[var(--text-main)]"
                >
                  隐私政策
                </a>
              </div>
              <a
                href="/register"
                onClick={(e) => handleLink(e, "/register")}
                className="mt-1.5 flex items-center justify-center rounded-xl bg-sky-500/15 px-3.5 py-2.5 text-sm font-semibold text-sky-300 no-underline site-light:bg-sky-500/12 site-light:text-sky-700"
              >
                账号注册与密码重置
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
