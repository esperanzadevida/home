import Link from "next/link";
import { Play, Clock, BookOpen } from "lucide-react";
import { Sermon } from "@/types";

interface SermonCardProps {
  sermon: Sermon;
}

export function SermonCard({ sermon }: SermonCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm flex flex-col">
      {/* Cover con Botón de Play Flotante */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={sermon.coverImage}
          alt={sermon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badge de Serie */}
        {sermon.series && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-primary/90 text-white text-[11px] font-bold backdrop-blur-sm">
            {sermon.series}
          </span>
        )}

        {/* Duración */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" /> {sermon.duration}
        </span>

        {/* Botón Central Play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span>{sermon.scripture}</span>
          </div>
          <Link href={`/sermones/${sermon.slug}`}>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {sermon.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {sermon.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{sermon.pastor}</span>
          <span>{sermon.date}</span>
        </div>
      </div>
    </div>
  );
}
