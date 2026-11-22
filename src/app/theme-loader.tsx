"use client";

import { useEffect } from "react";

export function ThemeLoader() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "dark" || (!theme && prefersDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return null;
}
