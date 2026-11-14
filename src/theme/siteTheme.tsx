import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SiteTheme = "dark" | "light";

export const SITE_THEME_STORAGE_KEY = "codaway-site-theme";

interface SiteThemeContextValue {
  siteTheme: SiteTheme;
  setSiteTheme: (next: SiteTheme) => void;
  toggleSiteTheme: () => void;
}

const SiteThemeContext = createContext<SiteThemeContextValue>({
  siteTheme: "dark",
  setSiteTheme: () => {},
  toggleSiteTheme: () => {},
});

function syncDocumentSiteTheme(theme: SiteTheme) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.dataset.siteTheme = theme;
  root.classList.toggle("site-dark", theme === "dark");
  root.classList.toggle("site-light", theme === "light");
  root.style.colorScheme = theme;
}

export function SiteThemeProvider({
  children,
  initialTheme = "dark",
}: {
  children: React.ReactNode;
  initialTheme?: SiteTheme;
}) {
  const [siteTheme, setSiteThemeState] = useState<SiteTheme>(initialTheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const saved = window.localStorage.getItem(SITE_THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setSiteThemeState(saved);
        syncDocumentSiteTheme(saved);
        return;
      }
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
    syncDocumentSiteTheme(initialTheme);
  }, [initialTheme]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    syncDocumentSiteTheme(siteTheme);
    try {
      window.localStorage.setItem(SITE_THEME_STORAGE_KEY, siteTheme);
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
  }, [hydrated, siteTheme]);

  const setSiteTheme = useCallback((next: SiteTheme) => {
    setSiteThemeState(next);
  }, []);

  const toggleSiteTheme = useCallback(() => {
    setSiteThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<SiteThemeContextValue>(
    () => ({
      siteTheme,
      setSiteTheme,
      toggleSiteTheme,
    }),
    [siteTheme, setSiteTheme, toggleSiteTheme],
  );

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme(): SiteThemeContextValue {
  return useContext(SiteThemeContext);
}
