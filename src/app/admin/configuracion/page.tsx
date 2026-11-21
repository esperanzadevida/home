"use client";

import { useEffect, useState } from "react";
import { Save, Check, Church, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchProfile } from "@/config/church-profile";

const SETTINGS_DRAFT_KEY = "admin-site-settings-draft:v1";

const initialForm: Record<string, string> = {
  name: churchProfile.name,
  denomination: churchProfile.denomination,
  leadPastor: `Pr. ${churchProfile.leadPastor}`,
  signature: churchProfile.signature,
  address: churchProfile.address,
  phone: churchProfile.phone,
  email: churchProfile.email,
  instagram: churchProfile.socialHandles[0].handle,
  facebook: churchProfile.socialHandles[1].handle,
  youtube: churchProfile.socialHandles[2].handle,
};

function normalizeDraft(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const parsed = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(initialForm).map(([key, fallback]) => [
      key,
      typeof parsed[key] === "string" ? parsed[key] : fallback,
    ]),
  );
}

export default function AdminConfiguracionPage() {
  const [form, setForm] = useState(initialForm);
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"ready" | "saved" | "error">("ready");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SETTINGS_DRAFT_KEY);
      if (stored) {
        const draft = normalizeDraft(JSON.parse(stored));
        if (!draft) throw new Error("Formato de borrador no válido");
        setForm(draft);
        setDraftStatus("saved");
      }
    } catch {
      setDraftStatus("error");
    } finally {
      setDraftReady(true);
    }
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setDraftStatus("ready");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      window.localStorage.setItem(SETTINGS_DRAFT_KEY, JSON.stringify(form));
      setDraftStatus("saved");
    } catch {
      setDraftStatus("error");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Configuración General del Sitio
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Actualiza datos institucionales, información de contacto, horarios y redes sociales.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Button
              type="submit"
              variant={draftStatus === "saved" ? "accent" : "default"}
              disabled={!draftReady}
              className="gap-1.5 font-semibold"
            >
              {draftStatus === "saved" ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {draftReady && draftStatus === "saved" ? "Borrador guardado" : "Guardar borrador local"}
            </Button>
            <span className="sr-only" role="status" aria-live="polite">
              {draftStatus === "saved"
                ? "Borrador guardado en este navegador. No se modificó el sitio público."
                : ""}
            </span>
          </div>
        </div>

        <p className="-mt-5 text-xs leading-5 text-muted-foreground">
          Los cambios guardados se conservan en este navegador. No modifican el sitio público ni el SEO publicado.
        </p>

        {draftStatus === "error" && (
          <p role="alert" className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground">
            No se pudo leer o guardar el borrador local. Tus cambios no se guardaron.
          </p>
        )}

        {/* Datos Principales de la Iglesia */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
            <Church className="w-4 h-4 text-primary" /> Identidad de la Congregación
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="church-name" className="text-xs font-semibold text-foreground">Nombre de la Iglesia</label>
              <input
                id="church-name"
                name="name"
                type="text"
                autoComplete="organization"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="church-denomination" className="text-xs font-semibold text-foreground">Denominación</label>
              <input
                id="church-denomination"
                name="denomination"
                type="text"
                value={form.denomination}
                onChange={(e) => updateField("denomination", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="church-lead-pastor" className="text-xs font-semibold text-foreground">Pastor Principal</label>
              <input
                id="church-lead-pastor"
                name="leadPastor"
                type="text"
                autoComplete="name"
                value={form.leadPastor}
                onChange={(e) => updateField("leadPastor", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="church-signature" className="text-xs font-semibold text-foreground">Lema / Slogan</label>
              <input
                id="church-signature"
                name="signature"
                type="text"
                value={form.signature}
                onChange={(e) => updateField("signature", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Canales de Contacto */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
            <Phone className="w-4 h-4 text-secondary" /> Contacto y Dirección
          </div>

          <div className="space-y-1.5">
            <label htmlFor="church-address" className="text-xs font-semibold text-foreground">Dirección Física de la Sede</label>
            <input
              id="church-address"
              name="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="church-phone" className="text-xs font-semibold text-foreground">Teléfono / WhatsApp</label>
              <input
                id="church-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="church-email" className="text-xs font-semibold text-foreground">Correo Electrónico Oficial</label>
              <input
                id="church-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
            <Globe className="w-4 h-4 text-accent" /> Presencia Digital y Redes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="church-instagram" className="text-xs font-semibold text-foreground">Instagram</label>
              <input
                id="church-instagram"
                name="instagram"
                type="text"
                value={form.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="church-facebook" className="text-xs font-semibold text-foreground">Facebook</label>
              <input
                id="church-facebook"
                name="facebook"
                type="text"
                value={form.facebook}
                onChange={(e) => updateField("facebook", e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="church-youtube" className="text-xs font-semibold text-foreground">YouTube</label>
              <input
                id="church-youtube"
                name="youtube"
                type="text"
                value={form.youtube}
                onChange={(e) => updateField("youtube", e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
