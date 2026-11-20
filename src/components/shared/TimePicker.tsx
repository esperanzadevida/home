"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  label?: string;
}

export function TimePicker({ value = "19:30", onChange, label = "Seleccionar Horario" }: TimePickerProps) {
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState<"AM" | "PM">("PM");

  const handlePeriodChange = (p: "AM" | "PM") => {
    setPeriod(p);
    onChange?.(`${hour}:${minute} ${p}`);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-foreground">{label}</label>}
      <div className="flex items-center gap-2 p-2 rounded-xl border border-input bg-background w-fit">
        <Clock className="w-4 h-4 text-muted-foreground ml-1" />

        {/* Horas */}
        <select
          value={hour}
          onChange={(e) => {
            setHour(e.target.value);
            onChange?.(`${e.target.value}:${minute} ${period}`);
          }}
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
          value={minute}
          onChange={(e) => {
            setMinute(e.target.value);
            onChange?.(`${hour}:${e.target.value} ${period}`);
          }}
          className="bg-transparent text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
        >
          {["00", "15", "30", "45"].map((m) => (
            <option key={m} value={m} className="bg-card text-foreground">{m}</option>
          ))}
        </select>

        {/* AM / PM Toggle */}
        <div className="flex rounded-lg bg-muted p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => handlePeriodChange("AM")}
            className={`px-2 py-1 rounded-md transition-all ${
              period === "AM" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange("PM")}
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
