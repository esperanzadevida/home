"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROFILE_ROLES, type ProfileRoleId } from "@/config/admin-roles";
import { getAdminLandingPath } from "@/lib/admin-access";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser-client";

function isProfileRole(value: unknown): value is ProfileRoleId {
  return PROFILE_ROLES.some((role) => role.id === value);
}

export function AdminLoginForm() {
  const router = useRouter();
  const configured = isSupabaseBrowserConfigured();
  const demoMode = process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus("error");
      setMessage("La autenticación no está configurada.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });

      if (error || !data.user) {
        setPassword("");
        setStatus("error");
        setMessage("No pudimos iniciar sesión. Revisa tus datos o solicita ayuda al administrador.");
        return;
      }

      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role, is_active")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.is_active !== true || !isProfileRole(profile.role)) {
        await client.auth.signOut().catch(() => undefined);
        setPassword("");
        setStatus("error");
        setMessage("Esta cuenta no tiene acceso activo al panel administrativo.");
        return;
      }

      setStatus("idle");
      router.replace(getAdminLandingPath(profile.role));
      router.refresh();
    } catch {
      await client.auth.signOut().catch(() => undefined);
      setPassword("");
      setStatus("error");
      setMessage("No pudimos verificar la cuenta. Revisa tu conexión e inténtalo de nuevo.");
    }
  }

  if (demoMode) {
    return (
      <div className="mt-7 space-y-4">
        <p role="status" className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm leading-6 text-foreground">La vista de demostración está activa. No se autentican cuentas ni se guardan datos de servidor.</p>
        <Link href="/admin/dashboard" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Abrir demostración</Link>
      </div>
    );
  }

  if (!configured) {
    return (
      <div role="status" className="mt-7 rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground sm:p-5">
        El ingreso estará disponible cuando se configure Supabase y se verifiquen las políticas de acceso. No ingreses credenciales hasta entonces.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4" aria-busy={status === "submitting"}>
      <label htmlFor="admin-email" className="block space-y-1.5 text-sm font-medium">
        <span>Correo electrónico</span>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label>
      <label htmlFor="admin-password" className="block space-y-1.5 text-sm font-medium">
        <span>Contraseña</span>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </label>
      {message && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-foreground">{message}</p>}
      <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {status === "submitting" ? "Verificando…" : "Iniciar sesión"}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/recuperar" className="min-h-11 py-3 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">¿Olvidaste tu contraseña?</Link>
        <span className="text-xs text-muted-foreground">Las cuentas las habilita una persona administradora.</span>
      </div>
    </form>
  );
}
