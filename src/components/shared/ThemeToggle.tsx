"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9" aria-label="Cambiar tema" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 rounded-full transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Cambiar modo claro / oscuro"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="h-5 w-5 text-amber-400 transition-[color,transform] rotate-0 scale-100" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5 text-slate-700 transition-[color,transform] rotate-0 scale-100" />
      )}
    </Button>
  );
}
