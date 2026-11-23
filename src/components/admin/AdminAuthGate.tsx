"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE_ROLES, type ProfileRoleId } from "@/config/admin-roles";
import { canAccessAdminPath, getAdminLandingPath } from "@/lib/admin-access";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/browser-client";

type AccessStatus = "checking" | "authorized" | "signed-out" | "forbidden" | "unconfigured" | "error";

type AdminAccessContextValue = {
  role: ProfileRoleId;
  demoMode: boolean;
};

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

export function useAdminAccess() {
  const value = useContext(AdminAccessContext);
  if (!value) throw new Error("useAdminAccess debe usarse dentro de AdminAuthGate.");
  return value;
}

function isProfileRole(value: unknown): value is ProfileRoleId {
  return PROFILE_ROLES.some((role) => role.id === value);
}

function GateFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8" aria-live="polite">
        {children}
      </section>
    </main>
  );
}

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const demoMode = process.env.NEXT_PUBLIC_ADMIN_DEMO_MODE === "true";
  const configured = isSupabaseBrowserConfigured();
  const [status, setStatus] = useState<AccessStatus>("checking");
  const [role, setRole] = useState<ProfileRoleId | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestId = useRef(0);
  const lastCheckedPath = useRef(pathname);

  const checkAccess = useCallback(async () => {
    const currentRequest = ++requestId.current;
    const client = getSupabaseBrowserClient();
    if (!client) {
      setRole(null);
      setStatus("unconfigured");
      return;
    }

    // Keep the current admin shell visible while session/profile checks run in
    // the background, including when a hidden tab resumes and refreshes a token.
    setStatus((currentStatus) => currentStatus === "authorized" ? currentStatus : "checking");

    try {
      const { data: authData, error: authError } = await client.auth.getUser();
      if (requestId.current !== currentRequest) return;
      if (authError) {
        const { data: sessionData } = await client.auth.getSession();
        if (requestId.current !== currentRequest) return;
        if (!sessionData.session) {
          setRole(null);
          setStatus("signed-out");
          return;
        }

        setStatus((currentStatus) => currentStatus === "authorized" ? currentStatus : "error");
        return;
      }

      if (!authData.user) {
        setRole(null);
        setStatus("signed-out");
        return;
      }

      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role, is_active")
        .eq("id", authData.user.id)
        .maybeSingle();
      if (requestId.current !== currentRequest) return;

      if (profileError) {
        setStatus((currentStatus) => currentStatus === "authorized" ? currentStatus : "error");
        return;
      }

      if (!profile || profile.is_active !== true || !isProfileRole(profile.role)) {
        setRole(null);
        setStatus("forbidden");
        return;
      }

      setRole(profile.role);
      setStatus("authorized");
    } catch {
      if (requestId.current !== currentRequest) return;
      setStatus((currentStatus) => currentStatus === "authorized" ? currentStatus : "error");
    }
  }, []);

  useEffect(() => {
    if (demoMode) {
      setRole("super_admin");
      setStatus("authorized");
      return;
    }

    if (!configured) {
      setRole(null);
      setStatus("unconfigured");
      return;
    }

    let disposed = false;
    const client = getSupabaseBrowserClient();
    const runCheck = async () => {
      if (!disposed) await checkAccess();
    };

    void runCheck();
    const subscription = client?.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        requestId.current += 1;
        setRole(null);
        setStatus("signed-out");
        router.replace("/login");
      } else if (event === "SIGNED_IN") {
        requestId.current += 1;
        setRole(null);
        setStatus("checking");
        window.setTimeout(() => void runCheck(), 0);
      } else if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        window.setTimeout(() => void runCheck(), 0);
      }
    }).data.subscription;

    return () => {
      disposed = true;
      requestId.current += 1;
      subscription?.unsubscribe();
    };
  }, [attempt, checkAccess, configured, demoMode, router]);

  useEffect(() => {
    if (lastCheckedPath.current === pathname) return;
    lastCheckedPath.current = pathname;

    if (!demoMode && configured) {
      // Revalidate permissions on module changes without replacing the current
      // admin shell with a blocking loader.
      void checkAccess();
    }
  }, [checkAccess, configured, demoMode, pathname]);

  const contextValue = useMemo<AdminAccessContextValue | null>(() => {
    if (!role || status !== "authorized" || (!demoMode && !canAccessAdminPath(role, pathname))) return null;
    return { role, demoMode };
  }, [demoMode, pathname, role, status]);

  const pathIsForbidden = Boolean(role && !demoMode && !canAccessAdminPath(role, pathname));
  const visibleStatus = status === "authorized" && pathIsForbidden ? "forbidden" : status;

  if (contextValue) {
    return <AdminAccessContext.Provider value={contextValue}>{children}</AdminAccessContext.Provider>;
  }

  if (visibleStatus === "checking") {
    return (
      <GateFrame>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary motion-reduce:animate-none" />
          <p className="text-sm text-muted-foreground">Verificando tu acceso administrativo…</p>
        </div>
      </GateFrame>
    );
  }

  if (visibleStatus === "signed-out") {
    return (
      <GateFrame>
        <h1 className="text-xl font-bold">Inicia sesión para continuar</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Esta sección requiere una cuenta autorizada.</p>
        <Link href="/login" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Ir al acceso administrativo
        </Link>
      </GateFrame>
    );
  }

  if (visibleStatus === "forbidden") {
    const landingPath = role ? getAdminLandingPath(role) : "/login";
    return (
      <GateFrame>
        <h1 className="text-xl font-bold">No tienes acceso a esta sección</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Tu cuenta no tiene los permisos necesarios para esta ruta.</p>
        <Link href={landingPath} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Volver a una sección permitida
        </Link>
      </GateFrame>
    );
  }

  if (visibleStatus === "error") {
    return (
      <GateFrame>
        <h1 className="text-xl font-bold">No pudimos verificar tu acceso</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Revisa tu conexión e inténtalo otra vez. No se cargaron datos administrativos.</p>
        <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Reintentar
        </button>
      </GateFrame>
    );
  }

  return (
    <GateFrame>
      <h1 className="text-xl font-bold">Panel administrativo aún no configurado</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">El acceso se habilitará cuando Supabase, la autenticación y las políticas de datos estén conectadas y verificadas.</p>
      <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        Volver al sitio público
      </Link>
    </GateFrame>
  );
}

export function AdminAccessNotice() {
  const { demoMode, role } = useAdminAccess();

  return (
    <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-xs leading-relaxed text-foreground sm:text-sm" aria-label="Estado de datos del panel">
      <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-warning text-[10px] font-bold text-warning">i</span>
      {demoMode ? (
        <p><strong>Vista de demostración.</strong> Usa datos sintéticos y cambios temporales. No crea cuentas, no guarda información en servidor ni modifica el sitio público.</p>
      ) : role === "visitor" || role === "member" ? (
        <p><strong>Tu cuenta está activa.</strong> Desde Mi perfil puedes actualizar tus datos de contacto y consultar las asignaciones ministeriales habilitadas para tu cuenta.</p>
      ) : (
        <p><strong>Acceso verificado.</strong> Usuarios y Mi perfil usan datos protegidos en Supabase. Los demás módulos siguen en integración; revisa cada pantalla antes de guardar cambios.</p>
      )}
    </aside>
  );
}
