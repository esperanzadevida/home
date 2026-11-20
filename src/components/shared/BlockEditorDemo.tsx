"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  Quote,
  BookOpen,
  Image as ImageIcon,
  Save,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlockEditorDemo() {
  const [content, setContent] = useState<string>(
    "## Serie: Fuego en el Altar\n\nEl Espíritu Santo descendió con poder en el día de Pentecostés transformando a creyentes temerosos en testigos valientes y apasionados.\n\n> «Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo...» — Hechos 1:8\n\n### Puntos Principales del Sermón:\n1. La promesa del Padre es para todas las generaciones.\n2. La oración de clamor prepara la atmósfera de avivamiento.\n3. El fuego purifica el corazón y enciende el fervor misionero."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Barra de Herramientas del Editor */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-border bg-muted/40">
        <div className="flex flex-wrap items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Negrita">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Cursiva">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Subrayado">
            <Underline className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Título H1">
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Título H2">
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Lista con viñetas">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Cita bíblica">
            <Quote className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 text-accent">
            <BookOpen className="w-3.5 h-3.5" />
            Insertar Versículo
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Subir Imagen
          </Button>
        </div>

        <Button
          variant={saved ? "accent" : "default"}
          size="sm"
          className="h-8 font-semibold gap-1.5"
          onClick={handleSave}
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? "Guardado" : "Guardar Borrador"}
        </Button>
      </div>

      {/* Área de Escritura tipo Block Note */}
      <div className="p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full bg-transparent text-sm sm:text-base leading-relaxed text-foreground focus:outline-none resize-none font-mono placeholder:text-muted-foreground"
          placeholder="Escribe notas del sermón o presiona '/' para comandos de bloque..."
        />
      </div>

      {/* Footer del Editor con Contador de Palabras */}
      <div className="px-6 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
        <span>Formato: Markdown / BlockNote JSON</span>
        <span>{content.split(/\s+/).filter(Boolean).length} palabras • ~2 min de lectura</span>
      </div>
    </div>
  );
}
