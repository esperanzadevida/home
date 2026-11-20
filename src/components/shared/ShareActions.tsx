"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export function ShareActions({ title }: { title: string }) {
  const [status, setStatus] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  async function handleShare() {
    if (!navigator.share) {
      setStatus("Compartir no está disponible en este navegador. Puedes copiar el enlace.");
      return;
    }

    setStatus("Abriendo las opciones para compartir…");
    setIsSharing(true);

    try {
      await navigator.share({ title, url: window.location.href });
      setStatus("");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setStatus("");
      } else {
        setStatus("No se pudieron abrir las opciones para compartir. Puedes copiar el enlace.");
      }
    } finally {
      setIsSharing(false);
    }
  }

  async function handleCopy() {
    setIsCopying(true);

    try {
      const currentUrl = window.location.href;

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(currentUrl);
        } catch {
          copyWithLegacyClipboard(currentUrl);
        }
      } else {
        copyWithLegacyClipboard(currentUrl);
      }

      setStatus("Enlace copiado.");
    } catch {
      setStatus("No se pudo copiar el enlace. Selecciona y copia la dirección del navegador.");
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing || isCopying}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        <Share2 aria-hidden="true" className="h-4 w-4" />
        {isSharing ? "Abriendo…" : "Compartir"}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={isSharing || isCopying}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "Enlace copiado." ? (
          <Check aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Copy aria-hidden="true" className="h-4 w-4" />
        )}
        {isCopying ? "Copiando…" : status === "Enlace copiado." ? "Copiado" : "Copiar enlace"}
      </button>
      {status && (
        <span role="status" aria-live="polite" className="basis-full text-xs text-muted-foreground">
          {status}
        </span>
      )}
    </div>
  );
}

function copyWithLegacyClipboard(value: string) {
  const activeElement = document.activeElement;
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();

  const copied = document.execCommand("copy");
  input.remove();

  if (activeElement instanceof HTMLElement) {
    activeElement.focus();
  }

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}
