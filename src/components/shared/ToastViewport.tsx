"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToastViewport() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      closeButton
      duration={4000}
      mobileOffset={{ top: 76, bottom: 96 }}
      offset={{ top: 76, right: 24, bottom: 24, left: 24 }}
      position="top-center"
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
