"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, CircleUserRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLE_LABELS } from "@/config/admin-roles";
import { useAdminAccess } from "@/components/admin/AdminAuthGate";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

interface ProfileRecord {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
}

interface MinistryAssignment {
  id: string;
  role: "leader" | "coordinator" | "musician" | "volunteer" | "member";
  ministry: { name: string } | null;
}

const ministryRoleLabels: Record<MinistryAssignment["role"], string> = {
  leader: ADMIN_ROLE_LABELS.ministry_leader,
  coordinator: ADMIN_ROLE_LABELS.ministry_coordinator,
  musician: ADMIN_ROLE_LABELS.musician,
  volunteer: ADMIN_ROLE_LABELS.ministry_volunteer,
  member: ADMIN_ROLE_LABELS.ministry_member,
};

export default function AdminProfilePage() {
  const { role } = useAdminAccess();
  const [profileId, setProfileId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [assignments, setAssignments] = useState<MinistryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("La conexión con Supabase no está configurada.");
      setLoading(false);
      return;
    }

    void (async () => {
      const { data: authData, error: authError } = await client.auth.getUser();
      if (!active) return;
      if (authError || !authData.user) {
        setError("No se pudo verificar tu sesión. Inicia sesión otra vez.");
        setLoading(false);
        return;
      }

      const [profileResult, assignmentResult] = await Promise.all([
        client.from("profiles").select("id, full_name, avatar_url, phone").eq("id", authData.user.id).maybeSingle(),
        client
          .from("ministry_role_assignments")
          .select("id, role, ministry:ministries(name)")
          .eq("profile_id", authData.user.id)
          .eq("is_active", true),
      ]);
      if (!active) return;

      if (profileResult.error || !profileResult.data) {
        setError("No se encontró un perfil activo para esta cuenta.");
        setLoading(false);
        return;
      }

      const profile = profileResult.data as ProfileRecord;
      setProfileId(profile.id);
      setEmail(authData.user.email ?? "");
      setFullName(profile.full_name);
      setPhone(profile.phone ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
      setAssignments(assignmentResult.error ? [] : assignmentResult.data as MinistryAssignment[]);
      if (assignmentResult.error) {
        setNotice("El perfil se cargó. No fue posible mostrar las asignaciones ministeriales.");
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client || !profileId) {
      setError("No se encontró una sesión activa para guardar el perfil.");
      return;
    }

    const normalizedName = fullName.trim();
    const normalizedAvatar = avatarUrl.trim();
    if (!normalizedName) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (normalizedAvatar) {
      try {
        const url = new URL(normalizedAvatar);
        if (url.protocol !== "https:") throw new Error("HTTPS requerido");
      } catch {
        setError("La foto debe usar una URL segura HTTPS.");
        return;
      }
    }

    setSaving(true);
    setError("");
    setNotice("");
    const { data, error: saveError } = await client
      .from("profiles")
      .update({
        full_name: normalizedName,
        phone: phone.trim() || null,
        avatar_url: normalizedAvatar || null,
      })
      .eq("id", profileId)
      .select("id")
      .maybeSingle();
    setSaving(false);

    if (saveError || !data) {
      setError("No se pudo guardar el perfil. Revisa tu conexión e inténtalo otra vez.");
      return;
    }
    setNotice("Perfil actualizado.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          <CircleUserRound aria-hidden="true" className="h-4 w-4" /> Cuenta personal
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mi perfil</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Administra tus datos de contacto. El correo y el rol los gestiona el servicio de identidad.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">{notice}</p>}

      {loading ? (
        <div role="status" className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground">Cargando perfil…</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
          <form onSubmit={saveProfile} className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CircleUserRound className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-bold">Información de la cuenta</h2>
                <p className="text-xs text-muted-foreground">Los cambios se guardan en tu perfil.</p>
              </div>
            </div>
            <label htmlFor="profile-name" className="block space-y-1.5 text-sm font-medium">
              <span>Nombre completo</span>
              <input id="profile-name" name="fullName" autoComplete="name" required maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label htmlFor="profile-email" className="block space-y-1.5 text-sm font-medium">
              <span>Correo electrónico</span>
              <input id="profile-email" name="email" type="email" value={email} readOnly aria-readonly="true" className="h-12 w-full rounded-xl border border-input bg-muted/50 px-3 text-muted-foreground" />
              <span className="block text-xs font-normal text-muted-foreground">Para cambiarlo se requiere una verificación del proveedor de acceso.</span>
            </label>
            <label htmlFor="profile-phone" className="block space-y-1.5 text-sm font-medium">
              <span>Teléfono</span>
              <input id="profile-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </label>
            <label htmlFor="profile-avatar" className="block space-y-1.5 text-sm font-medium">
              <span>Foto de perfil · enlace HTTPS</span>
              <input id="profile-avatar" name="avatarUrl" type="url" inputMode="url" maxLength={2048} value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://…" className="h-12 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <span className="block text-xs font-normal text-muted-foreground">Puedes dejarlo vacío para quitar la foto.</span>
            </label>
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-between sm:items-center">
              <span className="text-xs text-muted-foreground">Rol actual: <strong className="text-foreground">{ADMIN_ROLE_LABELS[role]}</strong></span>
              <Button type="submit" disabled={saving || !profileId} className="min-h-11">
                {saving ? <><Save aria-hidden="true" className="h-4 w-4" /> Guardando…</> : <><Check aria-hidden="true" className="h-4 w-4" /> Guardar perfil</>}
              </Button>
            </div>
          </form>

          <section aria-labelledby="profile-ministries-heading" className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <h2 id="profile-ministries-heading" className="font-bold">Mis ministerios</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Las funciones de servicio se asignan aparte del rol general de la cuenta.
            </p>
            {assignments.length === 0 ? (
              <p className="mt-5 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">No tienes asignaciones ministeriales activas.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="rounded-xl border border-border bg-muted/30 p-4">
                    <p className="font-semibold">{assignment.ministry?.name ?? "Ministerio"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ministryRoleLabels[assignment.role]}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
