"use client";

import { useSiteContent } from "@/context/SiteContentContext";
import { themeToCssVars } from "@/lib/content/themes";
import { useEffect } from "react";

export function ThemeInjector() {
  const { theme } = useSiteContent();

  useEffect(() => {
    const vars = themeToCssVars(theme);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return null;
}
