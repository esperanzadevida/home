# Proyecto Doménica — Asambleas de Dios

Sitio web en preparación para una congregación de las Asambleas de Dios.

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 15 | Framework (App Router) |
| TypeScript | Tipado estricto |
| Tailwind CSS v4 | Estilos |
| UI | Componentes propios, Tailwind CSS 4 y primitivas Radix ya instaladas |
| shadcn/ui / Magic UI | Catálogos de referencia; no se inicializó registry ni se añadieron componentes de esos catálogos |
| Supabase | Previsto, aún sin conectar |
| Vercel / GitHub | Previsto, aún sin conectar |
| MapLibre GL JS | Previsto para mapas, aún sin configurar |
| Schedule-X / BlockNote | Previsto para agenda y edición, aún sin flujos implementados |

## Estructura

```
├── docs/            # Documentación, investigación, prompts
├── src/
│   ├── app/         # Next.js App Router
│   │   ├── (public)/    # Rutas públicas
│   │   ├── (auth)/      # Autenticación
│   │   ├── (admin)/     # Panel administrativo
│   │   └── api/         # API Routes
│   ├── components/  # Componentes reutilizables
│   ├── lib/         # Utilidades y Supabase
│   ├── hooks/       # Custom hooks
│   ├── types/       # TypeScript types
│   ├── constants/   # Constantes
│   ├── providers/   # Context providers
│   ├── config/      # Configuración
│   └── styles/      # Estilos globales
├── public/          # Assets estáticos
├── supabase/        # Migraciones y funciones
└── docs/            # Documentación
```

## Estado actual

- El plan de trabajo vigente está en [`docs/PLAN-MAESTRO.md`](docs/PLAN-MAESTRO.md).
- Las doce rutas públicas interiores cuentan con copy editorial, metadatos, navegación responsive y una plantilla visual compartida. Sermones, eventos, blog y recursos incluyen fichas de detalle estáticas. El perfil está en `src/config/church-profile.ts` y el contenido en `src/config/public-pages.ts` y `src/config/content-details.ts`.
- La identidad y el contenido local son una ambientación creativa autorizada por Nicola; no representan datos verificados de una congregación real. El sitio no muestra una etiqueta pública al respecto.
- La Home ya presenta la identidad editorial central, horarios, mensaje reciente, agenda, ministerios y visita; reutiliza `churchProfile`, `content-details` y `publicPageBlueprints`. El fondo es una imagen local conceptual. La producción del video sigue aplazada.
- Login y administración todavía no tienen autenticación ni datos de backend. Los formularios, compras, aportes, reproductores, mapas y transmisiones no envían ni procesan información.
- Las imágenes y marcas locales permanecen como referencias hasta documentar su origen y permiso de uso.
- El SEO usa `NEXT_PUBLIC_SITE_URL` o el dominio de producción de Vercel. El build local/preview queda sin indexación y no publica un sitemap de prueba; `/` ya está incluido en el sitemap de producción.
- Hay estados compartidos de 404, error y carga; las tarjetas públicas usan `next/image`. Esto no sustituye una revisión completa de teclado, lector de pantalla, contraste o licencias de imágenes.
- `supabase/migrations` y `supabase/seed` son borradores locales aún no aplicados. Se corrigió el perfil seed y se quitaron cuentas financieras y peticiones personales inventadas; no conectar hasta completar la auditoría y corregir permisos.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build
npm run build
```
