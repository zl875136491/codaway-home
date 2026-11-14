import { useState } from "react";
import { Menu, Terminal, X } from "lucide-react";
import { useRouter } from "../router";

export function Navbar() {
  const { route, navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(to);
  };

  const navClass = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm transition-colors ${
      active
        ? "bg-white/10 font-medium text-white"
        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05060a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => handleLink(e, "/")}
          className="flex items-center gap-2.5 text-white no-underline transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/15 text-sky-400">
            <Terminal size={16} strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Codaway</span>
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline-block">
            CPS-v1.2
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

        <div className="flex items-center gap-2.5">
          <a
            href="/register"
            onClick={(e) => handleLink(e, "/register")}
            aria-current={route === "/register" ? "page" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-zinc-950 no-underline transition hover:bg-zinc-200"
          >
            <span>{route === "/register" ? "账号服务" : "注册 / 登录管理"}</span>
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 md:hidden"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#08090f] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <a href="/" onClick={(e) => handleLink(e, "/")} className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
              首页
            </a>
            <a href="/#pocket-studio" onClick={(e) => handleLink(e, "/#pocket-studio")} className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
              Pocket 界面体验
            </a>
            <a href="/#worker-core" onClick={(e) => handleLink(e, "/#worker-core")} className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
              Worker 五大驱动
            </a>
            <a href="/#security" onClick={(e) => handleLink(e, "/#security")} className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
              CPS-v1.2 端到端安全
            </a>
            <a href="/roadmap" onClick={(e) => handleLink(e, "/roadmap")} className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
              更新路线图
            </a>
            <a href="/register" onClick={(e) => handleLink(e, "/register")} className="mt-1 rounded-lg bg-sky-500/15 px-3 py-2 text-sm font-medium text-sky-300">
              账号注册与密码重置
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
