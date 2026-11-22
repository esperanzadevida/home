"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser-client";
import { getAuthRedirectUrl } from "@/lib/auth-redirect-url";

export function PasswordRecoveryForm() {
  const configured = isSupabaseBrowserConfigured();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("La autenticación todavía no está configurada.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const { error: requestError } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getAuthRedirectUrl("/restablecer", window.location.origin),
      });
      if (requestError) throw requestError;
      setSent(true);
    } catch {
      setError("No se pudo enviar el enlace. Inténtalo más tarde o contacta a la persona administradora.");
    } finally {
      setPending(false);
    }
  }

  if (!configured) {
    return <p role="status" className="mt-6 rounded-xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">La recuperación estará disponible cuando se configure Supabase.</p>;
  }

  if (sent) {
    return <p role="status" className="mt-6 rounded-xl border border-success/30 bg-success/5 p-4 text-sm leading-6 text-foreground">Si el correo corresponde a una cuenta activa, recibirás un enlace para recuperar el acceso.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-busy={pending}>
      <label htmlFor="recovery-email" className="block space-y-1.5 text-sm font-medium">
        <span>Correo de la cuenta</span>
        <input id="recovery-email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label>
      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm">{error}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {pending ? "Enviando…" : "Enviar enlace de recuperación"}
      </button>
    </form>
  );
}
