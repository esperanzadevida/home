"use client";

import { useState } from "react";
import { Heart, Sparkles, User } from "lucide-react";
import { PrayerRequest } from "@/types";
import { Button } from "@/components/ui/button";

interface PrayerCardProps {
  prayer: PrayerRequest;
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  const [prayed, setPrayed] = useState(false);
  const [count, setCount] = useState(prayer.prayersCount);

  const handlePray = () => {
    if (!prayed) {
      setCount((prev) => prev + 1);
      setPrayed(true);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/40 transition-all flex flex-col justify-between gap-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground">
                {prayer.isAnonymous ? "Petición Confidencial" : prayer.requesterName}
              </span>
              <div className="text-[10px] text-muted-foreground">{prayer.createdAt}</div>
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            En Oración
          </span>
        </div>

        <p className="text-sm text-foreground/90 italic leading-relaxed">
          "{prayer.request}"
        </p>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <strong className="text-foreground">{count}</strong> personas han orado
        </span>

        <Button
          variant={prayed ? "accent" : "outline"}
          size="sm"
          className="text-xs font-semibold gap-1.5 rounded-full transition-all"
          onClick={handlePray}
        >
          <Heart className={`w-3.5 h-3.5 ${prayed ? "fill-current" : ""}`} />
          {prayed ? "Oraste por esto" : "He orado por ti"}
        </Button>
      </div>
    </div>
  );
}
