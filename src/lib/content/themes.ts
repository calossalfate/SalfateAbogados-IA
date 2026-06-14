import type { ThemePreset } from "./types";

export type ThemeVariables = {
  accent: string;
  accentSoft: string;
  accentDark: string;
  graphite: string;
  petrol: string;
  ink: string;
  muted: string;
};

export const THEME_PRESETS: Record<ThemePreset, ThemeVariables> = {
  classic: {
    accent: "#c9a962",
    accentSoft: "#d4b87a",
    accentDark: "#9a7b3c",
    graphite: "#0d1117",
    petrol: "#0a1628",
    ink: "#e8edf4",
    muted: "#94a3b8",
  },
  "corporate-blue": {
    accent: "#5b9bd5",
    accentSoft: "#7eb3e0",
    accentDark: "#3d7ab5",
    graphite: "#0a1018",
    petrol: "#081220",
    ink: "#e8edf4",
    muted: "#8fa3bb",
  },
  conservative: {
    accent: "#b8956a",
    accentSoft: "#c9aa82",
    accentDark: "#8f7048",
    graphite: "#111111",
    petrol: "#1a1a1a",
    ink: "#f0ece4",
    muted: "#a8a096",
  },
};

export function themeToCssVars(theme: ThemePreset): Record<string, string> {
  const t = THEME_PRESETS[theme] ?? THEME_PRESETS.classic;
  return {
    "--color-accent": t.accent,
    "--color-accent-soft": t.accentSoft,
    "--color-accent-dark": t.accentDark,
    "--background": t.graphite,
    "--foreground": t.ink,
  };
}
