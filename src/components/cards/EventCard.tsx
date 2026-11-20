import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { ChurchEvent } from "@/types";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: ChurchEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm flex flex-col">
      {/* Cover Image con Badge */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), (max-width: 1279px) calc((100vw - 6rem) * 7 / 24), 22rem"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-[11px] font-bold shadow">
          {event.category}
        </span>

        {event.registeredCount > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 text-white text-[11px] font-medium flex items-center gap-1.5 backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-accent" />
            {event.registeredCount} registrados
          </span>
        )}
      </div>

      {/* Info del Evento */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/eventos/${event.slug}`}>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-1.5 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-medium text-foreground">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center gap-2">
          <Link href={`/eventos/${event.slug}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full font-semibold">
              Inscribirme / Más Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
