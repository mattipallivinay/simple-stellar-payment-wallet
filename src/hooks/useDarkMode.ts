import { useEffect, useState } from "react";

const STORAGE_KEY = "stellar-wallet-theme";

function getInitialTheme(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored === "dark";
  // Fall back to the user's OS-level preference if they've never toggled it.
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  // Tailwind's `darkMode: "class"` (set in tailwind.config.js) means every
  // dark: utility only activates when the <html> element has class="dark".
  // Toggling that class is the entire mechanism — no extra CSS needed.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((prev) => !prev) };
}
