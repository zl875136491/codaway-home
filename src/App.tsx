import { RouterProvider, useRouter } from "./router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { Toaster } from "./components/affectui/ui/toaster-clean";
import { SiteThemeProvider, useSiteTheme, type SiteTheme } from "./theme/siteTheme";

function AppShell() {
  const { route } = useRouter();
  const { siteTheme } = useSiteTheme();

  return (
    <div
      data-site-theme={siteTheme}
      className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-200"
    >
      {/* Keep site-level Toaster in its own theme scope so data-theme never bleeds into PocketSimulator */}
      <div data-theme={siteTheme} className={siteTheme === "dark" ? "dark" : undefined}>
        <Toaster position="bottom-right" />
      </div>
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        {route === "/register" ? (
          <RegisterPage />
        ) : route === "/roadmap" ? (
          <RoadmapPage />
        ) : route === "/terms" ? (
          <TermsPage />
        ) : route === "/privacy" ? (
          <PrivacyPage />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  );
}

export function App({ initialSiteTheme = "dark" }: { initialSiteTheme?: SiteTheme } = {}) {
  return (
    <SiteThemeProvider initialTheme={initialSiteTheme}>
      <RouterProvider>
        <AppShell />
      </RouterProvider>
    </SiteThemeProvider>
  );
}
