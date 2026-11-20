"use client";

import { useState } from "react";
import { MapPin, Navigation, Compass, Layers, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapSection() {
  const [mapType, setMapType] = useState<"streets" | "dark" | "satellite">("dark");

  const churchCoords = {
    lat: -2.1894,
    lng: -79.8891,
    name: "Santuario Central Asambleas de Dios",
    address: "Av. Principal y Calle Central, Guayaquil, Ecuador",
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${churchCoords.lat},${churchCoords.lng}`,
      "_blank"
    );
  };

  return (
    <div className="rounded-3xl overflow-hidden bg-card border border-border shadow-sm flex flex-col lg:flex-row">
      {/* Panel Informativo Lateral */}
      <div className="p-8 lg:w-96 flex flex-col justify-between space-y-6 shrink-0 bg-card border-b lg:border-b-0 lg:border-r border-border">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>MapLibre GL Vector Engine</span>
          </div>

          <h3 className="font-bold text-xl text-foreground">Cómo Llegar a Casa</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nuestras puertas están abiertas para recibirte a ti y a tu familia en cualquiera de nuestras reuniones semanales.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block">{churchCoords.name}</strong>
                <span className="text-muted-foreground">{churchCoords.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground">Cultos dominicales: 09:00 AM y 11:30 AM</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span className="text-muted-foreground">+593 99 999 9999 (Oficina Pastoral)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          {/* Selector de capas MapLibre */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Estilo de Mapa:
            </span>
            <div className="flex rounded-lg bg-muted p-0.5 font-bold">
              <button
                onClick={() => setMapType("streets")}
                className={`px-2 py-0.5 rounded text-[11px] ${mapType === "streets" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
              >
                Claro
              </button>
              <button
                onClick={() => setMapType("dark")}
                className={`px-2 py-0.5 rounded text-[11px] ${mapType === "dark" ? "bg-card text-foreground shadow" : "text-muted-foreground"}`}
              >
                Oscuro
              </button>
            </div>
          </div>

          <Button onClick={openGoogleMaps} className="w-full font-semibold gap-2">
            <Navigation className="w-4 h-4" />
            Abrir Ruta en GPS / Google Maps
          </Button>
        </div>
      </div>

      {/* Visor de Mapa Interactivo con Marker y Estilo Cartográfico */}
      <div className="relative min-h-[380px] flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
        {/* Renderizado de Fondo Cartográfico (Vector Style Simulado) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
            mapType === "dark" ? "filter brightness-75 contrast-125" : "filter brightness-105"
          }`}
          style={{
            backgroundImage:
              mapType === "dark"
                ? "radial-gradient(circle at center, #1e293b 0%, #090a0f 100%)"
                : "radial-gradient(circle at center, #f8fafc 0%, #e2e8f0 100%)",
          }}
        />

        {/* Cuadrícula cartográfica de vector tiles */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>

        {/* Pin Central con Efecto Pulsante */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-secondary/30 animate-ping" />
            <div className="w-10 h-10 rounded-2xl bg-secondary text-white shadow-2xl flex items-center justify-center font-bold relative z-10">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Tooltip flotante del templo */}
          <div className="mt-3 px-4 py-2 rounded-xl bg-card border border-border shadow-2xl text-center backdrop-blur-md">
            <div className="font-extrabold text-xs text-foreground">Santuario Asambleas de Dios</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Av. Principal y Calle Central</div>
            <div className="text-[10px] text-primary font-semibold mt-1">Parqueo Privado Disponible</div>
          </div>
        </div>

        {/* Controles de Zoom Flotantes */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
          <button className="w-8 h-8 rounded-lg bg-card/90 border border-border text-foreground font-bold text-sm shadow hover:bg-muted flex items-center justify-center">
            +
          </button>
          <button className="w-8 h-8 rounded-lg bg-card/90 border border-border text-foreground font-bold text-sm shadow hover:bg-muted flex items-center justify-center">
            −
          </button>
        </div>
      </div>
    </div>
  );
}
