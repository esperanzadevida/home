"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  /** Selected time in 24-hour HH:mm format. */
  value?: string;
  /** Called with the selected time in 24-hour HH:mm format. */
  onChange?: (time: string) => void;
  label?: string;
}

type Period = "AM" | "PM";

function parseTime(value: string) {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  const hours24 = Number(match?.[1]);
  const minute = match?.[2] ?? "30";
  const valid = match !== null && hours24 >= 0 && hours24 <= 23;
  const safeHours24 = valid ? hours24 : 19;
  const hour = String(safeHours24 % 12 || 12).padStart(2, "0");

  return {
    hour,
    minute: valid ? minute : "30",
    period: (safeHours24 >= 12 ? "PM" : "AM") as Period,
  };
}

function formatTime(hour: string, minute: string, period: Period) {
  const hour12 = Number(hour) % 12;
  const hour24 = hour12 + (period === "PM" ? 12 : 0);
  return `${String(hour24).padStart(2, "0")}:${minute}`;
}

export function TimePicker({ value, onChange, label = "Seleccionar Horario" }: TimePickerProps) {
  const [internalValue, setInternalValue] = useState(() => value ?? "19:30");
  const { hour, minute, period } = parseTime(value ?? internalValue);

  const updateTime = (nextHour: string, nextMinute: string, nextPeriod: Period) => {
    const nextValue = formatTime(nextHour, nextMinute, nextPeriod);
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div role="group" aria-label={label} className="space-y-1.5">
      {label && <p className="text-xs font-semibold text-foreground">{label}</p>}
      <div className="flex items-center gap-2 p-2 rounded-xl border border-input bg-background w-fit">
        <Clock aria-hidden="true" className="w-4 h-4 text-muted-foreground ml-1" />

        {/* Horas */}
        <select
          aria-label="Hora"
          value={hour}
          onChange={(event) => updateTime(event.target.value, minute, period)}
          className="bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const h = (i + 1).toString().padStart(2, "0");
            return <option key={h} value={h} className="bg-card text-foreground">{h}</option>;
          })}
        </select>

        <span className="text-muted-foreground font-bold">:</span>

        {/* Minutos */}
        <select
          aria-label="Minuto"
          value={minute}
          onChange={(event) => updateTime(hour, event.target.value, period)}
          className="bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
        >
          {["00", "15", "30", "45"].map((m) => (
            <option key={m} value={m} className="bg-card text-foreground">{m}</option>
          ))}
        </select>

        {/* AM / PM Toggle */}
        <div role="group" aria-label="Periodo del día" className="flex rounded-lg bg-muted p-0.5 text-xs font-bold">
          <button
            type="button"
            aria-pressed={period === "AM"}
            onClick={() => updateTime(hour, minute, "AM")}
            className={`px-2 py-1 rounded-md transition-all ${
              period === "AM" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AM
          </button>
          <button
            type="button"
            aria-pressed={period === "PM"}
            onClick={() => updateTime(hour, minute, "PM")}
            className={`px-2 py-1 rounded-md transition-all ${
              period === "PM" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
