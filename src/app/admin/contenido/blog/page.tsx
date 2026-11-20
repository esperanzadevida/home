"use client";

import { BlockEditorDemo } from "@/components/shared/BlockEditorDemo";
import { ImageEditorDemo } from "@/components/shared/ImageEditorDemo";
import { FileText, Sparkles } from "lucide-react";

export default function AdminBlogEditorPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Editor de Contenido Rico & Bloques
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Redactor de Publicaciones y Notas de Sermón
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Escribe devocionales, artículos doctrinales o notas pastorales con soporte de bloques y citas bíblicas.
        </p>
      </div>

      {/* Editor de Bloques */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          1. Redacción de Bloques (Tiptap / BlockNote)
        </h2>
        <BlockEditorDemo />
      </div>

      {/* Editor de Imagen / Banner */}
      <div className="space-y-3 pt-6 border-t border-border">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          2. Portada y Banner Multimedia
        </h2>
        <ImageEditorDemo />
      </div>
    </div>
  );
}
