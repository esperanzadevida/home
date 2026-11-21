"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "@/components/shared/SiteImage";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";

export type GalleryExplorerItem = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  imageSrc: string;
  imageAlt: string;
};

function getPlacementClass(index: number) {
  if (index === 0) return "sm:col-span-2 lg:col-span-7 lg:row-span-2";
  if (index === 1 || index === 2) return "lg:col-span-5";
  return "lg:col-span-6";
}

export function GalleryExplorer({ items }: { items: GalleryExplorerItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const originTriggerIndex = useRef<number | null>(null);
  const activeItem = activeIndex === null ? undefined : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null || items.length < 2) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + items.length) % items.length,
        );
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % items.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return (
      <p className="border-t border-border py-8 text-sm text-muted-foreground">
        Pronto compartiremos imágenes de nuestra comunidad.
      </p>
    );
  }

  return (
    <Dialog.Root
      open={activeIndex !== null}
      onOpenChange={(open) => {
        if (!open) setActiveIndex(null);
      }}
    >
      <ul aria-label="Momentos de la comunidad" className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[13rem]">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className={`min-w-0 ${getPlacementClass(index)}`}>
            <button
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                originTriggerIndex.current = index;
                setActiveIndex(index);
              }}
              className={`group relative block aspect-[4/3] w-full overflow-hidden bg-slate-950 text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring sm:aspect-[4/3] ${
                index === 0
                  ? "sm:aspect-[16/9] lg:h-full lg:aspect-auto"
                  : "lg:h-full lg:aspect-auto"
              }`}
            >
              <Image
                src={item.imageSrc}
                alt=""
                fill
                sizes={
                  index === 0
                    ? "(min-width: 64rem) 58vw, (min-width: 40rem) 92vw, 100vw"
                    : "(min-width: 64rem) 40vw, (min-width: 40rem) 46vw, 100vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                <span className="min-w-0">
                  {item.eyebrow ? (
                    <span className="mb-2 block text-xs font-medium text-white/75">
                      {item.eyebrow}
                    </span>
                  ) : null}
                  <span className="block max-w-2xl text-balance font-serif text-xl font-medium leading-tight sm:text-2xl lg:text-3xl">
                    {item.title}
                  </span>
                  {item.meta ? (
                    <span className="mt-2 block text-xs text-white/75">{item.meta}</span>
                  ) : null}
                </span>
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/55 bg-slate-950/30 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-slate-950 motion-reduce:transition-none">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-slate-950/85 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby="public-gallery-description"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeButtonRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const index = originTriggerIndex.current;
            originTriggerIndex.current = null;
            if (index !== null) triggerRefs.current[index]?.focus();
          }}
          className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] flex max-h-[94dvh] w-[min(96vw,1200px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-white/15 bg-card text-card-foreground shadow-2xl focus:outline-none"
        >
          {activeItem ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <Dialog.Title className="font-serif text-lg font-medium leading-tight sm:text-2xl">
                    {activeItem.title}
                  </Dialog.Title>
                  <Dialog.Description id="public-gallery-description" className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {activeItem.description}
                  </Dialog.Description>
                  <p role="status" aria-live="polite" className="sr-only">
                    Imagen {activeIndex! + 1} de {items.length}: {activeItem.title}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Cerrar galería"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="relative h-[62dvh] max-h-[42rem] min-h-64 bg-slate-950 sm:h-[68dvh]">
                <Image
                  src={activeItem.imageSrc}
                  alt={activeItem.imageAlt}
                  fill
                  sizes="(min-width: 64rem) 88vw, 96vw"
                  priority
                  className="object-contain"
                />
                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Imagen anterior"
                      onClick={() => setActiveIndex((activeIndex! - 1 + items.length) % items.length)}
                      className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-slate-950/55 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none sm:left-5"
                    >
                      <ArrowLeft aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Imagen siguiente"
                      onClick={() => setActiveIndex((activeIndex! + 1) % items.length)}
                      className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-slate-950/55 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none sm:right-5"
                    >
                      <ArrowRight aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
                <span>{activeItem.meta ?? activeItem.eyebrow}</span>
                <span className="tabular-nums">{activeIndex! + 1} / {items.length}</span>
                <span className="sr-only">Usa las flechas izquierda y derecha para recorrer las imágenes.</span>
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
