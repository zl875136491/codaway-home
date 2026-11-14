import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

let viteServer;

before(async () => {
  viteServer = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });
});

after(async () => {
  if (viteServer) {
    await viteServer.close();
  }
});

describe("codaway-home routing and metadata", () => {
  test("normalizes known and fallback routes", async () => {
    const { normalizeRoutePath, ROUTES } = await viteServer.ssrLoadModule("/src/router.tsx");

    assert.equal(normalizeRoutePath("/"), "/");
    assert.equal(normalizeRoutePath(""), "/");
    assert.equal(normalizeRoutePath("/index.html"), "/");
    assert.equal(normalizeRoutePath("/register"), "/register");
    assert.equal(normalizeRoutePath("/register/"), "/register");
    assert.equal(normalizeRoutePath("/register.html"), "/register");
    assert.equal(normalizeRoutePath("/register?from=home#reset"), "/register");
    assert.equal(normalizeRoutePath("/roadmap"), "/roadmap");
    assert.equal(normalizeRoutePath("/roadmap.html"), "/roadmap");
    assert.equal(normalizeRoutePath("/non-existent"), "/");

    for (const key of ["/", "/register", "/roadmap"]) {
      assert.ok(ROUTES[key]?.title.length > 0, `Missing title for ${key}`);
      assert.ok(ROUTES[key]?.description.length > 10, `Missing description for ${key}`);
    }
  });
});

describe("codaway-home Pocket theme & AffectUI CSS variables", () => {
  test("provides dark & light palettes and full AffectUI Clean variable maps", async () => {
    const { POCKET_THEMES, buildAffectCssVars } = await viteServer.ssrLoadModule("/src/theme/pocketTheme.ts");

    for (const themeId of ["space", "terminal", "cyberpunk"]) {
      const spec = POCKET_THEMES[themeId];
      assert.ok(spec, `Missing theme ${themeId}`);
      for (const scheme of ["dark", "light"]) {
        const palette = spec[scheme];
        assert.ok(palette.accent, `Missing accent in ${themeId}.${scheme}`);
        const vars = buildAffectCssVars(themeId, scheme);
        for (const prefix of ["--ui-agmc-", "--ui-apc-", "--ui-dcc-", "--ui-mdpc-", "--ui-tlc-", "--ui-tsc-"]) {
          assert.ok(
            Object.keys(vars).some((k) => k.startsWith(prefix)),
            `Expected CSS vars with prefix ${prefix} for ${themeId}.${scheme}`,
          );
        }
      }
    }
  });
});

describe("codaway-home product data completeness", () => {
  test("includes all 5 Codaway Worker drivers and core command/architecture/roadmap specs", async () => {
    const { DRIVERS, WORKER_COMMANDS, ARCHITECTURE_PILLARS, ROADMAP_SECTIONS } =
      await viteServer.ssrLoadModule("/src/data/codaway.ts");

    assert.deepEqual(
      DRIVERS.map((d) => d.id),
      ["CODEX", "CLAUDE_CODE", "OPENCODE", "DEEPSEEK_TUI", "SHELL"],
    );
    for (const driver of DRIVERS) {
      assert.ok(driver.displayName.length > 0);
      assert.ok(driver.protocol.length > 0);
      assert.ok(driver.highlights.length >= 3);
    }

    assert.ok(WORKER_COMMANDS.some((c) => c.id === "doctor"));
    assert.ok(WORKER_COMMANDS.some((c) => c.id === "start-pair"));
    assert.ok(WORKER_COMMANDS.some((c) => c.id === "service"));
    assert.ok(ARCHITECTURE_PILLARS.length >= 4);
    assert.ok(ROADMAP_SECTIONS.some((s) => s.status === "shipped"));
    assert.ok(ROADMAP_SECTIONS.some((s) => s.status === "in-progress"));
    assert.ok(ROADMAP_SECTIONS.some((s) => s.status === "planned"));
  });
});

describe("codaway-home Auth Portal backend contract", () => {
  test("preserves Pipe auth endpoints and rate-limit handling", () => {
    const registerSrc = fs.readFileSync(path.join(rootDir, "src/pages/RegisterPage.tsx"), "utf8");
    assert.match(registerSrc, /["']\/v1\/auth\/send-code["']/);
    assert.match(registerSrc, /["']\/v1\/auth\/verify["']/);
    assert.match(registerSrc, /["']\/v1\/auth\/reset-password["']/);
    assert.match(registerSrc, /retry_after/);
    assert.match(registerSrc, /OtpInput/);
  });
});

describe("codaway-home SSR render smoke tests", () => {
  test("renders HomePage, RegisterPage, and RoadmapPage cleanly", async () => {
    const { RouterProvider } = await viteServer.ssrLoadModule("/src/router.tsx");
    const { HomePage } = await viteServer.ssrLoadModule("/src/pages/HomePage.tsx");
    const { RegisterPage } = await viteServer.ssrLoadModule("/src/pages/RegisterPage.tsx");
    const { RoadmapPage } = await viteServer.ssrLoadModule("/src/pages/RoadmapPage.tsx");

    const homeHtml = renderToString(
      React.createElement(RouterProvider, null, React.createElement(HomePage)),
    );
    assert.match(homeHtml, /Pocket/);
    assert.match(homeHtml, /Worker/);
    assert.match(homeHtml, /ChaCha20-Poly1305/);

    const registerHtml = renderToString(
      React.createElement(RouterProvider, null, React.createElement(RegisterPage)),
    );
    assert.match(registerHtml, /发送验证码/);
    assert.match(registerHtml, /开通您的 Codaway 账号/);
    assert.match(registerHtml, /创建新账号/);

    const roadmapHtml = renderToString(
      React.createElement(RouterProvider, null, React.createElement(RoadmapPage)),
    );
    assert.match(roadmapHtml, /演进路线图/);
    assert.match(roadmapHtml, /harness-shim/);
  });
});
