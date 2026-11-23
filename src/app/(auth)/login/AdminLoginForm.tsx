"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROFILE_ROLES, type ProfileRoleId } from "@/config/admin-roles";
import { getAdminLandingPath } from "@/lib/admin-access";
import { getAuthRedirectUrl } from "@/lib/auth-redirect-url";
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
  const [bootstrapFlow, setBootstrapFlow] = useState(false);
  const bootstrapAttempted = useRef(false);
  const oauthAttempted = useRef(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const requested = search.get("setup") === "owner";
    const oauthReturn = search.get("flow") === "oauth";
    setBootstrapFlow(requested);
    if (!requested && !oauthReturn) return;

    const client = getSupabaseBrowserClient();
    if (!client) return;

    void (async () => {
      try {
        const { data, error } = await client.auth.getUser();
        if (error || !data.user) {
          setStatus("error");
          setMessage("No se pudo confirmar tu sesión de Google. Intenta iniciar sesión otra vez.");
          return;
        }

        if (requested) {
          if (bootstrapAttempted.current) return;
          bootstrapAttempted.current = true;
          setStatus("submitting");
          setMessage("");
          const { data: result, error: bootstrapError } = await client.functions.invoke<{ role: string }>(
            "admin-users",
            { body: { action: "bootstrap_owner" } },
          );

          if (bootstrapError || result?.role !== "owner") {
            setStatus("error");
            setMessage("No se pudo activar el propietario inicial. Confirma la cuenta autorizada y la configuración del servicio.");
            return;
          }

          router.replace(getAdminLandingPath("owner"));
          router.refresh();
          return;
        }

        if (oauthAttempted.current) return;
        oauthAttempted.current = true;
        setStatus("submitting");
        setMessage("");
        const { data: profile, error: profileError } = await client
          .from("profiles")
          .select("role, is_active")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError || !profile || profile.is_active !== true || !isProfileRole(profile.role)) {
          await client.auth.signOut();
          setStatus("error");
          setMessage("Esta cuenta no tiene acceso activo. Pide a un administrador que habilite tu perfil.");
          return;
        }

        setStatus("idle");
        router.replace(getAdminLandingPath(profile.role));
        router.refresh();
      } catch {
        setStatus("error");
        setMessage("No pudimos verificar tu cuenta. Revisa tu conexión e inténtalo otra vez.");
      }
    })();
  }, [router]);

  async function handleGoogleSignIn() {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setStatus("error");
      setMessage("La autenticación no está configurada.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    const redirectPath = bootstrapFlow ? "/login?setup=owner" : "/login?flow=oauth";
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthRedirectUrl(redirectPath, window.location.origin),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setStatus("error");
      setMessage("No se pudo iniciar con Google. Revisa la configuración del proveedor e inténtalo otra vez.");
    }
  }

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
      <button
        type="button"
        onClick={() => void handleGoogleSignIn()}
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <GoogleMark />
        {status === "submitting" ? "Conectando…" : "Continuar con Google"}
      </button>
      {bootstrapFlow && (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
          Configuración inicial: solo una cuenta autorizada puede convertirse en el primer propietario. Las demás cuentas conservan el rol de visitante.
        </p>
      )}
      <div className="flex items-center gap-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span>o usa tu contraseña</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
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

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(2 2)" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.71 7.18l7.57 5.88c4.42-4.08 7.18-10.08 7.18-17.53Z" transform="translate(-1 -2)" />
      <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.94 23.94 0 0 0 0 21.56l7.98-6.19Z" transform="translate(2 2)" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.57-5.88c-2.1 1.4-4.78 2.23-8.33 2.23-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" transform="translate(2 -2)" />
    </svg>
  );
}
