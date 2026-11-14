import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type AppRoute = "/" | "/register" | "/roadmap";

export interface RouteMeta {
  path: AppRoute;
  title: string;
  description: string;
}

export const ROUTES: Record<AppRoute, RouteMeta> = {
  "/": {
    path: "/",
    title: "Codaway — 把本机 AI Coding 工作站装进口袋",
    description:
      "零公网端口暴露。通过 X25519 + ChaCha20-Poly1305 端到端加密通道，用 iPhone 随时随地审批、配置并调度本机 Claude Code、Codex、OpenCode 与终端工作区。",
  },
  "/register": {
    path: "/register",
    title: "账号注册与密码重置 — Codaway",
    description: "注册 Codaway 账号或重置密码，开始安全配对您的本机 AI Coding Worker 与 Pocket 客户端。",
  },
  "/roadmap": {
    path: "/roadmap",
    title: "产品路线图与里程碑 — Codaway",
    description: "查看 Codaway Worker、Pipe 中继与 Pocket iOS 已上线能力及未来开发计划。",
  },
};

export function normalizeRoutePath(rawPathname: string): AppRoute {
  let clean = rawPathname.split("?")[0].split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  if (clean === "/index.html" || clean === "") return "/";
  if (clean === "/register" || clean === "/register.html") return "/register";
  if (clean === "/roadmap" || clean === "/roadmap.html") return "/roadmap";
  return "/";
}

type RouterContextValue = {
  route: AppRoute;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextValue>({
  route: "/",
  navigate: () => {},
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== "undefined" ? normalizeRoutePath(window.location.pathname) : "/",
  );

  useEffect(() => {
    const meta = ROUTES[route];
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", meta.description);
  }, [route]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizeRoutePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const [pathPart, hashPart] = to.split("#");
    const targetRoute = normalizeRoutePath(pathPart || "/");
    const targetUrl = hashPart ? `${targetRoute}#${hashPart}` : targetRoute;

    if (window.location.pathname + window.location.hash !== targetUrl) {
      window.history.pushState({}, "", targetUrl);
    }

    setRoute(targetRoute);

    if (hashPart) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(hashPart);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 40);
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}
