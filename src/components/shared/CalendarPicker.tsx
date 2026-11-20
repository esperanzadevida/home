"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  day: number;
  title: string;
  time: string;
  location: string;
  type: string;
}

const SAMPLE_EVENTS: Record<number, CalendarEvent[]> = {
  5: [
    { day: 5, title: "Campamento Anual Exploradores del Rey", time: "08:00 AM", location: "Bucay", type: "Niños" },
  ],
  12: [
    { day: 12, title: "Vigilia Unida de Intercesión y Clamor", time: "22:00 PM", location: "Santuario Principal", type: "Especial" },
  ],
  20: [
    { day: 20, title: "Cena Navideña de Damas y Familias", time: "19:00 PM", location: "Salón de Eventos", type: "Damas" },
  ],
  28: [
    { day: 28, title: "Congreso Juvenil 'Fuego Pentecostal'", time: "18:00 PM", location: "Auditorio Central", type: "Jóvenes" },
  ],
};

export function CalendarPicker() {
  const [selectedDay, setSelectedDay] = useState<number>(28);
  const daysInMonth = 30; // Noviembre
  const startDayOffset = 6; // Empieza en Domingo

  const activeEvents = SAMPLE_EVENTS[selectedDay] || [
    { day: selectedDay, title: "Culto de Celebración y Alabanza", time: "09:00 AM y 11:30 AM", location: "Santuario Principal", type: "Culto" },
  ];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-sm space-y-6">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">Noviembre 2026</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid de Días de la Semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
        <span>Dom</span>
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
      </div>

      {/* Grid de Días del Mes */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-sm font-medium">
        {/* Espacios vacíos antes del inicio del mes */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = selectedDay === day;
          const hasEvent = !!SAMPLE_EVENTS[day];

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`h-10 rounded-xl relative flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground font-bold shadow-md scale-105"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <span>{day}</span>
              {hasEvent && (
                <span
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isSelected ? "bg-accent" : "bg-secondary"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Eventos del Día Seleccionado */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Actividades del {selectedDay} de Noviembre
        </div>

        <div className="space-y-2">
          {activeEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-background border border-border flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-semibold">
                  {evt.type}
                </span>
                <h4 className="font-bold text-sm text-foreground">{evt.title}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-secondary" /> {evt.location}
                  </span>
                </div>
              </div>

              <Button size="sm" variant="outline" className="text-xs shrink-0 font-semibold">
                Ver Detalles
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
