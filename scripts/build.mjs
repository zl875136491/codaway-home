#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const ROUTE_PAGES = [
  {
    file: "index.html",
    title: "Codaway — 把本机 AI Coding 工作站装进口袋",
    description:
      "零公网端口暴露。通过 X25519 + ChaCha20-Poly1305 端到端加密通道，用 iPhone 随时随地审批、配置并调度本机 Claude Code、Codex、OpenCode 与终端工作区。",
  },
  {
    file: "register.html",
    title: "账号注册与密码重置 — Codaway",
    description: "注册 Codaway 账号或重置密码，开始安全配对您的本机 AI Coding Worker 与 Pocket 客户端。",
  },
  {
    file: "roadmap.html",
    title: "产品路线图与里程碑 — Codaway",
    description: "查看 Codaway Worker、Pipe 中继与 Pocket iOS 已上线能力及未来开发计划。",
  },
];

function ensureDependencies() {
  const requiredPackages = [
    path.join(rootDir, "node_modules", "vite", "package.json"),
    path.join(rootDir, "node_modules", "@vitejs/plugin-react", "package.json"),
    path.join(rootDir, "node_modules", "@tailwindcss/vite", "package.json"),
  ];
  if (requiredPackages.every((pkg) => fs.existsSync(pkg))) {
    return;
  }
  console.log("Installing codaway-home dependencies via npm ci...");
  execFileSync("npm", ["ci", "--no-audit", "--no-fund"], {
    cwd: rootDir,
    stdio: "inherit",
  });
}

function escapeHtmlAttr(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtmlText(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function applyRouteMetadata(html, { title, description }) {
  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlText(title)}</title>`);
  const escapedDesc = escapeHtmlAttr(description);
  if (/<meta\b[^>]*name=["']description["'][^>]*>/i.test(out)) {
    out = out.replace(
      /<meta\b[^>]*name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapedDesc}" />`,
    );
  } else {
    out = out.replace("</head>", `  <meta name="description" content="${escapedDesc}" />\n  </head>`);
  }
  return out;
}

ensureDependencies();

const { build } = await import("vite");
await build({ root: rootDir, logLevel: "info" });

const baseHtmlPath = path.join(distDir, "index.html");
if (!fs.existsSync(baseHtmlPath)) {
  throw new Error("Vite build did not emit dist/index.html");
}
const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");

const assetRefs = [
  ...baseHtml.matchAll(/(?:href|src)="(\/assets\/[^"]+\.(?:css|js))"/g),
].map((m) => m[1]);

if (assetRefs.length === 0) {
  throw new Error("Expected hashed /assets/* references in dist/index.html");
}
for (const ref of assetRefs) {
  const fullPath = path.join(distDir, ref.slice(1));
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Referenced asset missing on disk: ${ref}`);
  }
}

for (const page of ROUTE_PAGES) {
  const html = applyRouteMetadata(baseHtml, page);
  fs.writeFileSync(path.join(distDir, page.file), html, "utf8");
}

console.log(
  `Built codaway-home dist/ pages (${ROUTE_PAGES.map((p) => p.file).join(", ")}) with assets: ${assetRefs.join(", ")}`,
);
