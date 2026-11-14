import { RouterProvider, useRouter } from "./router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { Toaster } from "./components/affectui/ui/toaster-clean";

function AppShell() {
  const { route } = useRouter();

  return (
    <div data-theme="dark" className="dark flex min-h-screen flex-col bg-[#05060a] text-zinc-100">
      <Toaster position="bottom-right" />
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        {route === "/register" ? (
          <RegisterPage />
        ) : route === "/roadmap" ? (
          <RoadmapPage />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}
