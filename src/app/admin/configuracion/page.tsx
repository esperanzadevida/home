"use client";

import { useState } from "react";
import { Settings, Save, Check, Church, Globe, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminConfiguracionPage() {
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "Iglesia Doménica",
    denomination: "Asambleas de Dios",
    leadPastor: "Pr. Samuel Andrade",
    signature: "Una fe que se vive en comunidad.",
    address: "Calle Los Arrayanes y av. de los Guaytambos, Ficoa, Ambato",
    phone: "+593 99 246 3817",
    email: "hola@domenicaiglesia.ec",
    instagram: "@domenica.ambato",
    facebook: "Iglesia Doménica Ambato",
    youtube: "@iglesiadomenica",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Configuración General del Sitio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Actualiza datos institucionales, información de contacto, horarios y redes sociales.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          variant={saved ? "accent" : "default"}
          className="font-semibold gap-1.5 self-start"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Cambios Guardados" : "Guardar Configuración"}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Datos Principales de la Iglesia */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-sm font-bold text-foreground">
            <Church className="w-4 h-4 text-primary" /> Identidad de la Congregación
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nombre de la Iglesia</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Denominación</label>
              <input
                type="text"
                value={form.denomination}
                onChange={(e) => setForm({ ...form, denomination: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pastor Principal</label>
              <input
                type="text"
                value={form.leadPastor}
                onChange={(e) => setForm({ ...form, leadPastor: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Lema / Slogan</label>
              <input
                type="text"
                value={form.signature}
                onChange={(e) => setForm({ ...form, signature: e.target.value })}
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
            <label className="text-xs font-semibold text-foreground">Dirección Física de la Sede</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Correo Electrónico Oficial</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              <label className="text-xs font-semibold text-foreground">Instagram</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Facebook</label>
              <input
                type="text"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">YouTube</label>
              <input
                type="text"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
