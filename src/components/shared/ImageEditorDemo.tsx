"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCw, ZoomIn, Check, Crop, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageEditorDemo() {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saved, setSaved] = useState(false);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Editor de Imágenes y Banners</h3>
          <p className="text-xs text-muted-foreground">
            Ajusta recortes, rotación y parámetros de color para sermones y productos.
          </p>
        </div>
        <Button
          variant={saved ? "accent" : "default"}
          size="sm"
          className="font-semibold gap-1.5"
          onClick={handleSave}
        >
          {saved ? <Check className="w-4 h-4" /> : <Crop className="w-4 h-4" />}
          {saved ? "Aplicado con éxito" : "Aplicar Recorte"}
        </Button>
      </div>

      {/* Canvas / Preview con Transformaciones */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-border/60">
        <Image
          src="/images/hero/hero-cinematic-main.jpg"
          alt="Preview de Edición"
          width={1600}
          height={900}
          className="max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          }}
        />

        {/* Guías de regla de tercios (Crop Grid) */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-white/20" />
          <div className="border-r border-white/20" />
          <div />
        </div>
      </div>

      {/* Controles de Edición */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
        {/* Zoom */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-primary" /> Zoom
            </span>
            <span>{zoom}%</span>
          </div>
          <input
            type="range"
            min="80"
            max="180"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Rotación */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-secondary" /> Rotación
            </span>
            <span>{rotation}°</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRotate} className="w-full text-xs h-8">
            Girar +90°
          </Button>
        </div>

        {/* Brillo */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-accent" /> Brillo
            </span>
            <span>{brightness}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="140"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Contraste */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Contraste
            </span>
            <span>{contrast}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="140"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
