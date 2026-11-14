import type { CSSProperties } from "react";

export type PocketThemeId = "space" | "terminal" | "cyberpunk";
export type PocketColorScheme = "dark" | "light";

export interface PocketThemeSpec {
  id: PocketThemeId;
  name: string;
  shortName: string;
  tagline: string;
  isMono?: boolean;
  dark: PocketThemePalette;
  light: PocketThemePalette;
}

export interface PocketThemePalette {
  wallpaperBg: string;
  wallpaperGlowA: string;
  wallpaperGlowB: string;
  gridColor: string;
  navBg: string;
  card: string;
  popover: string;
  tray: string;
  soft: string;
  well: string;
  lane: string;
  hover: string;
  line: string;
  strong: string;
  ink: string;
  text: string;
  bodyMuted: string;
  muted: string;
  accent: string;
  secondaryAccent: string;
  liveBlue: string;
  accentBg: string;
  green: string;
  greenBg: string;
  amber: string;
  amberBg: string;
  red: string;
  redBg: string;
  userBubbleBg: string;
  userBubbleInk: string;
  assistantBubbleBg: string;
  assistantBubbleBorder: string;
  sendBg: string;
  sendInk: string;
  sendShadow: string;
  trayRadius: number;
  cardRadius: number;
  innerRadius: number;
  controlRadius: number;
}

export const POCKET_THEMES: Record<PocketThemeId, PocketThemeSpec> = {
  space: {
    id: "space",
    name: "太空 Space",
    shortName: "Space",
    tagline: "深空玻璃态与电光天青",
    dark: {
      wallpaperBg: "#060a14",
      wallpaperGlowA: "rgba(41, 181, 245, 0.16)",
      wallpaperGlowB: "rgba(115, 64, 217, 0.14)",
      gridColor: "rgba(91, 154, 255, 0.08)",
      navBg: "rgba(11, 16, 28, 0.84)",
      card: "rgba(28, 38, 61, 0.94)",
      popover: "#212e4a",
      tray: "#121a2b",
      soft: "rgba(36, 48, 77, 0.85)",
      well: "#293857",
      lane: "#242e47",
      hover: "#334266",
      line: "rgba(64, 89, 140, 0.42)",
      strong: "#ffffff",
      ink: "#f2f7ff",
      text: "#d1def2",
      bodyMuted: "#a6bad6",
      muted: "#8a9ec2",
      accent: "#29b5f5",
      secondaryAccent: "#7340d9",
      liveBlue: "#59ccff",
      accentBg: "rgba(41, 181, 245, 0.16)",
      green: "#5fc88a",
      greenBg: "rgba(95, 200, 138, 0.15)",
      amber: "#faa647",
      amberBg: "rgba(242, 140, 51, 0.16)",
      red: "#ff6b5f",
      redBg: "rgba(255, 107, 95, 0.14)",
      userBubbleBg: "#216b57",
      userBubbleInk: "#ffffff",
      assistantBubbleBg: "rgba(28, 38, 61, 0.88)",
      assistantBubbleBorder: "rgba(64, 89, 140, 0.36)",
      sendBg: "#29b5f5",
      sendInk: "#ffffff",
      sendShadow: "rgba(41, 181, 245, 0.45)",
      trayRadius: 24,
      cardRadius: 20,
      innerRadius: 13,
      controlRadius: 11,
    },
    light: {
      wallpaperBg: "#f2f6fc",
      wallpaperGlowA: "rgba(13, 133, 224, 0.12)",
      wallpaperGlowB: "rgba(115, 64, 217, 0.08)",
      gridColor: "rgba(13, 133, 224, 0.06)",
      navBg: "rgba(255, 255, 255, 0.86)",
      card: "rgba(255, 255, 255, 0.96)",
      popover: "#ffffff",
      tray: "#e8effa",
      soft: "#f5f7fc",
      well: "#edf2fc",
      lane: "#f0f5fc",
      hover: "#e3edfc",
      line: "rgba(0, 0, 0, 0.08)",
      strong: "#0b1220",
      ink: "#152238",
      text: "#3c4b66",
      bodyMuted: "#5e6f8c",
      muted: "#7284a3",
      accent: "#0d85e0",
      secondaryAccent: "#7340d9",
      liveBlue: "#29b5f5",
      accentBg: "rgba(13, 133, 224, 0.11)",
      green: "#1e8a4f",
      greenBg: "rgba(30, 138, 79, 0.11)",
      amber: "#d97314",
      amberBg: "rgba(242, 140, 51, 0.12)",
      red: "#c4320a",
      redBg: "rgba(196, 50, 10, 0.09)",
      userBubbleBg: "#d1f2d1",
      userBubbleInk: "#0d2614",
      assistantBubbleBg: "rgba(255, 255, 255, 0.94)",
      assistantBubbleBorder: "rgba(0, 0, 0, 0.07)",
      sendBg: "#0d85e0",
      sendInk: "#ffffff",
      sendShadow: "rgba(13, 133, 224, 0.35)",
      trayRadius: 24,
      cardRadius: 20,
      innerRadius: 13,
      controlRadius: 11,
    },
  },
  terminal: {
    id: "terminal",
    name: "二进制终端",
    shortName: "Terminal",
    tagline: "CRT 荧光绿与等宽几何",
    isMono: true,
    dark: {
      wallpaperBg: "#030805",
      wallpaperGlowA: "rgba(0, 242, 115, 0.14)",
      wallpaperGlowB: "rgba(0, 191, 89, 0.10)",
      gridColor: "rgba(0, 242, 115, 0.09)",
      navBg: "rgba(6, 14, 9, 0.88)",
      card: "rgba(10, 20, 15, 0.96)",
      popover: "#0d1a12",
      tray: "#050a08",
      soft: "#0f1c14",
      well: "#14261c",
      lane: "#0f1f17",
      hover: "#1a3324",
      line: "rgba(0, 217, 102, 0.38)",
      strong: "#ccffd6",
      ink: "#b8ffc2",
      text: "#9ee6ad",
      bodyMuted: "#73b885",
      muted: "#5c9e70",
      accent: "#00f273",
      secondaryAccent: "#00bf59",
      liveBlue: "#00f273",
      accentBg: "rgba(0, 242, 115, 0.14)",
      green: "#00f273",
      greenBg: "rgba(0, 242, 115, 0.15)",
      amber: "#f2c233",
      amberBg: "rgba(242, 194, 51, 0.14)",
      red: "#ff6b5f",
      redBg: "rgba(255, 107, 95, 0.14)",
      userBubbleBg: "#0f381f",
      userBubbleInk: "#b3ffbf",
      assistantBubbleBg: "rgba(10, 20, 15, 0.94)",
      assistantBubbleBorder: "rgba(0, 217, 102, 0.38)",
      sendBg: "#00f273",
      sendInk: "#051a0a",
      sendShadow: "rgba(0, 242, 115, 0.55)",
      trayRadius: 18,
      cardRadius: 15,
      innerRadius: 10,
      controlRadius: 9,
    },
    light: {
      wallpaperBg: "#eff7f1",
      wallpaperGlowA: "rgba(13, 166, 82, 0.12)",
      wallpaperGlowB: "rgba(10, 143, 66, 0.08)",
      gridColor: "rgba(13, 166, 82, 0.07)",
      navBg: "rgba(255, 255, 255, 0.88)",
      card: "rgba(255, 255, 255, 0.97)",
      popover: "#ffffff",
      tray: "#e3f2e6",
      soft: "#f0f7f2",
      well: "#e6f2e8",
      lane: "#edf5ef",
      hover: "#d9edde",
      line: "rgba(13, 166, 82, 0.28)",
      strong: "#05240d",
      ink: "#0a3314",
      text: "#225731",
      bodyMuted: "#417350",
      muted: "#598a67",
      accent: "#0da652",
      secondaryAccent: "#0a8f42",
      liveBlue: "#0da652",
      accentBg: "rgba(13, 166, 82, 0.11)",
      green: "#0a8f42",
      greenBg: "rgba(13, 166, 82, 0.12)",
      amber: "#b87a00",
      amberBg: "rgba(232, 176, 0, 0.14)",
      red: "#c4320a",
      redBg: "rgba(196, 50, 10, 0.09)",
      userBubbleBg: "#d6f0db",
      userBubbleInk: "#0a3314",
      assistantBubbleBg: "rgba(255, 255, 255, 0.95)",
      assistantBubbleBorder: "rgba(13, 166, 82, 0.25)",
      sendBg: "#0da652",
      sendInk: "#ffffff",
      sendShadow: "rgba(13, 166, 82, 0.35)",
      trayRadius: 18,
      cardRadius: 15,
      innerRadius: 10,
      controlRadius: 9,
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "赛博朋克",
    shortName: "Cyberpunk",
    tagline: "碳基曜石紫、霓虹粉与电光青",
    dark: {
      wallpaperBg: "#090417",
      wallpaperGlowA: "rgba(255, 20, 148, 0.18)",
      wallpaperGlowB: "rgba(0, 240, 255, 0.15)",
      gridColor: "rgba(0, 240, 255, 0.08)",
      navBg: "rgba(16, 8, 34, 0.86)",
      card: "rgba(20, 13, 41, 0.95)",
      popover: "#1c1238",
      tray: "#0d081c",
      soft: "rgba(33, 20, 61, 0.9)",
      well: "#2b1a4f",
      lane: "#241442",
      hover: "#381f61",
      line: "rgba(0, 240, 255, 0.42)",
      strong: "#ffffff",
      ink: "#ffe6f7",
      text: "#e3d1f5",
      bodyMuted: "#b39edb",
      muted: "#9485c7",
      accent: "#ff1494",
      secondaryAccent: "#00f0ff",
      liveBlue: "#00f0ff",
      accentBg: "rgba(255, 20, 148, 0.16)",
      green: "#00f0cc",
      greenBg: "rgba(0, 240, 204, 0.14)",
      amber: "#ffd900",
      amberBg: "rgba(255, 217, 0, 0.15)",
      red: "#ff5c8a",
      redBg: "rgba(255, 92, 138, 0.16)",
      userBubbleBg: "#331257",
      userBubbleInk: "#ffe0f5",
      assistantBubbleBg: "rgba(20, 13, 41, 0.92)",
      assistantBubbleBorder: "rgba(0, 240, 255, 0.45)",
      sendBg: "#ff1494",
      sendInk: "#ffffff",
      sendShadow: "rgba(255, 20, 148, 0.65)",
      trayRadius: 22,
      cardRadius: 18,
      innerRadius: 12,
      controlRadius: 10,
    },
    light: {
      wallpaperBg: "#faf4fc",
      wallpaperGlowA: "rgba(219, 0, 122, 0.12)",
      wallpaperGlowB: "rgba(0, 184, 224, 0.12)",
      gridColor: "rgba(219, 0, 122, 0.06)",
      navBg: "rgba(255, 255, 255, 0.88)",
      card: "rgba(255, 255, 255, 0.96)",
      popover: "#ffffff",
      tray: "#f2e6fa",
      soft: "#f7f0fc",
      well: "#f0e3fa",
      lane: "#f5ebfa",
      hover: "#e8d6f7",
      line: "rgba(255, 20, 148, 0.28)",
      strong: "#240338",
      ink: "#33054d",
      text: "#52256b",
      bodyMuted: "#6f448a",
      muted: "#8960a3",
      accent: "#db007a",
      secondaryAccent: "#00b8e0",
      liveBlue: "#00b8e0",
      accentBg: "rgba(219, 0, 122, 0.11)",
      green: "#059669",
      greenBg: "rgba(5, 150, 105, 0.11)",
      amber: "#cc8f00",
      amberBg: "rgba(255, 217, 0, 0.16)",
      red: "#c4320a",
      redBg: "rgba(196, 50, 10, 0.10)",
      userBubbleBg: "#f2dbfa",
      userBubbleInk: "#3d0559",
      assistantBubbleBg: "rgba(255, 255, 255, 0.94)",
      assistantBubbleBorder: "rgba(255, 20, 148, 0.28)",
      sendBg: "#db007a",
      sendInk: "#ffffff",
      sendShadow: "rgba(219, 0, 122, 0.4)",
      trayRadius: 22,
      cardRadius: 18,
      innerRadius: 12,
      controlRadius: 10,
    },
  },
};

/** Maps a Pocket theme & scheme to AffectUI scoped CSS custom properties for genuine component adaptation. */
export function buildAffectCssVars(themeId: PocketThemeId, scheme: PocketColorScheme): CSSProperties {
  const p = POCKET_THEMES[themeId][scheme];
  const isDark = scheme === "dark";
  const shadow = isDark
    ? `0 0 0 1px ${p.line}, 0 8px 18px -8px rgba(0, 0, 0, 0.52)`
    : `0 0 0 1px ${p.line}, 0 4px 12px -6px rgba(0, 0, 0, 0.08)`;

  return {
    // AgentMonitor (--ui-agmc-*)
    "--ui-agmc-card": p.card,
    "--ui-agmc-strong": p.strong,
    "--ui-agmc-ink": p.ink,
    "--ui-agmc-text": p.text,
    "--ui-agmc-muted": p.bodyMuted,
    "--ui-agmc-faint": p.muted,
    "--ui-agmc-line": p.line,
    "--ui-agmc-edge": p.line,
    "--ui-agmc-lane": p.lane,
    "--ui-agmc-well": p.well,
    "--ui-agmc-fill": p.hover,
    "--ui-agmc-accent": p.accent,
    "--ui-agmc-accent-bg": p.accentBg,
    "--ui-agmc-green": p.green,
    "--ui-agmc-green-bg": p.greenBg,
    "--ui-agmc-red": p.red,
    "--ui-agmc-red-bg": p.redBg,
    "--ui-agmc-amber": p.amber,
    "--ui-agmc-amber-bg": p.amberBg,
    "--ui-agmc-shine": p.strong,
    "--ui-agmc-focus": p.accent,
    "--ui-agmc-seg": p.soft,
    "--ui-agmc-lift": shadow,
    "--ui-agmc-shadow": `0 0 0 0.5px ${p.line}`,

    // ApprovalCard (--ui-apc-*)
    "--ui-apc-tray": p.tray,
    "--ui-apc-bg": p.card,
    "--ui-apc-ink": p.strong,
    "--ui-apc-text": p.text,
    "--ui-apc-muted": p.muted,
    "--ui-apc-line": p.line,
    "--ui-apc-soft": p.soft,
    "--ui-apc-tile": p.well,
    "--ui-apc-hover": p.hover,
    "--ui-apc-primary": p.accent,
    "--ui-apc-primary-hover": p.liveBlue,
    "--ui-apc-primary-ink": p.sendInk,
    "--ui-apc-focus": p.accent,
    "--ui-apc-timer-low": p.amber,
    "--ui-apc-low-bg": p.soft,
    "--ui-apc-low-ink": p.bodyMuted,
    "--ui-apc-med-bg": p.amberBg,
    "--ui-apc-med-ink": p.amber,
    "--ui-apc-high-bg": p.redBg,
    "--ui-apc-high-ink": p.red,
    "--ui-apc-ok-bg": p.greenBg,
    "--ui-apc-ok-ink": p.green,
    "--ui-apc-no-bg": p.soft,
    "--ui-apc-no-ink": p.bodyMuted,

    // DecisionCard (--ui-dcc-*)
    "--ui-dcc-card": p.card,
    "--ui-dcc-ink": p.strong,
    "--ui-dcc-text": p.text,
    "--ui-dcc-muted": p.bodyMuted,
    "--ui-dcc-faint": p.muted,
    "--ui-dcc-line": p.line,
    "--ui-dcc-fill": p.hover,
    "--ui-dcc-well": p.well,
    "--ui-dcc-wait-bg": p.accentBg,
    "--ui-dcc-wait-fg": p.accent,
    "--ui-dcc-focus": p.accent,
    "--ui-dcc-solid": p.accent,
    "--ui-dcc-on-solid": p.sendInk,
    "--ui-dcc-shadow": shadow,
    "--ui-dcc-float": shadow,

    // ModelPicker (--ui-mdpc-*)
    "--ui-mdpc-card": p.card,
    "--ui-mdpc-strong": p.strong,
    "--ui-mdpc-ink": p.ink,
    "--ui-mdpc-text": p.text,
    "--ui-mdpc-muted": p.bodyMuted,
    "--ui-mdpc-faint": p.muted,
    "--ui-mdpc-icon": p.bodyMuted,
    "--ui-mdpc-line": p.line,
    "--ui-mdpc-line-strong": p.line,
    "--ui-mdpc-fill": p.hover,
    "--ui-mdpc-wash": p.soft,
    "--ui-mdpc-accent": p.accent,
    "--ui-mdpc-focus": p.accent,
    "--ui-mdpc-shadow-tile": `0 0 0 0.5px ${p.line}`,
    "--ui-mdpc-shadow-pop": shadow,

    // ThinkingLoader (--ui-tlc-*)
    "--ui-tlc-ink": p.strong,
    "--ui-tlc-text": p.bodyMuted,
    "--ui-tlc-accent": p.accent,
    "--ui-tlc-bg": p.card,
    "--ui-tlc-shadow": `0 0 0 1px ${p.line}`,
    "--ui-tlc-shine": p.strong,

    // Toaster (--ui-tsc-*)
    "--ui-tsc-card": p.popover,
    "--ui-tsc-strong": p.strong,
    "--ui-tsc-ink": p.ink,
    "--ui-tsc-text": p.text,
    "--ui-tsc-icon": p.bodyMuted,
    "--ui-tsc-faint": p.muted,
    "--ui-tsc-hairline": p.accent,
    "--ui-tsc-success": p.green,
    "--ui-tsc-danger": p.red,
    "--ui-tsc-accent": p.accent,
    "--ui-tsc-focus": p.accent,
    "--ui-tsc-shadow": shadow,
    "--ui-tsc-shadow-hover": shadow,
    "--ui-tsc-shadow-float": shadow,
  } as CSSProperties;
}
