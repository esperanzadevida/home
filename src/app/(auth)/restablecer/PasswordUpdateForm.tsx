"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser-client";

export function PasswordUpdateForm() {
  const router = useRouter();
  const configured = isSupabaseBrowserConfigured();
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const client = getSupabaseBrowserClient();

    if (!client) return;

    void client.auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (!cancelled) setReady(Boolean(data.session) && !sessionError);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("La autenticación todavía no está configurada.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const { error: updateError } = await client.auth.updateUser({ password });
      if (updateError) throw updateError;
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("No pudimos actualizar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.");
    } finally {
      setPending(false);
    }
  }

  if (!configured || !ready) {
    return (
      <div className="mt-6 space-y-4">
        <p role="status" className="rounded-xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
          {!configured ? "La autenticación todavía no está configurada." : "Este enlace no es válido o ya venció. Solicita otro desde recuperación de acceso."}
        </p>
        <Link href="/recuperar" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Solicitar otro enlace</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-busy={pending}>
      <label htmlFor="new-password" className="block space-y-1.5 text-sm font-medium">
        <span>Nueva contraseña</span>
        <input id="new-password" name="new-password" type="password" autoComplete="new-password" required minLength={12} maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <span className="block text-xs font-normal text-muted-foreground">Usa al menos 12 caracteres.</span>
      </label>
      <label htmlFor="confirm-password" className="block space-y-1.5 text-sm font-medium">
        <span>Repetir contraseña</span>
        <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required minLength={12} maxLength={256} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label>
      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm">{error}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {pending ? "Actualizando…" : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}
