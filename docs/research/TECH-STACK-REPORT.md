# ðŸ“‹ REPORTE TÃ‰CNICO COMPLETO â€” Stack Proyecto DOMENICA

## 1. Stack Principal

### Next.js 15 (App Router)
- **VersiÃ³n:** 15.x (Ãºltima estable)
- **Motor:** Turbopack estable para `next dev` (Rust-based, significativamente mÃ¡s rÃ¡pido)
- **React 19:** Soporte nativo, incluyendo React Compiler (experimental) para auto-memoizaciÃ³n
- **Caching redefinido:** Ya NO cachea por defecto (breaking change vs v14). Los `fetch`, Route Handlers GET y navegaciones del cliente requieren opt-in explÃ­cito (`cache: 'force-cache'`)
- **APIs asÃ­ncronas:** `cookies()`, `headers()`, `params`, `searchParams` ahora retornan Promises â€” `await params` obligatorio
- **Partial Prerendering (PPR):** Combina rendering estÃ¡tico + dinÃ¡mico en una sola ruta usando `Suspense`
- **`next/form`:** Componente `<Form>` mejorado con navegaciÃ³n client-side en submit
- **`next.config.ts`:** Soporte nativo de TypeScript en la configuraciÃ³n

### TypeScript (Strict Mode)
- `"strict": true` en `tsconfig.json`
- Tipos estrictos en `params` y `searchParams` (ahora `Promise<{ id: string }>`)
- ValidaciÃ³n con Zod para Server Actions y formularios

### Tailwind CSS v4
- **Motor Oxide (Rust):** Builds hasta 3.5Ã— mÃ¡s rÃ¡pidos, incrementales 8Ã— mÃ¡s rÃ¡pidos
- **CSS-first:** Se elimina `tailwind.config.js`. ConfiguraciÃ³n directa en CSS con `@theme`
- **Import simplificado:** Un solo `@import "tailwindcss";` reemplaza las 3 directivas `@tailwind`
- **DetecciÃ³n automÃ¡tica de sources:** Ya no necesitas `content: [...]`
- **CSS moderno nativo:** Cascade Layers, `@property`, `color-mix()`
- **Nuevas directivas:** `@utility` (utilidades custom), `@custom-variant` (variantes custom)
- **Paquetes separados:** `@tailwindcss/postcss`, `@tailwindcss/vite`, `@tailwindcss/cli`
- **Breaking changes notables:** `shadow` â†’ `shadow-sm`, `rounded` â†’ `rounded-sm`, `outline-none` â†’ `outline-hidden`, ring default cambiÃ³ de 3px a 1px

### Supabase (BaaS completo)
- **Auth:** Email/password, OAuth (Google, GitHub, etc.), Magic Links, MFA
- **Database:** PostgreSQL gestionado con Row Level Security
- **Storage:** Almacenamiento de archivos (imÃ¡genes, documentos, media)
- **Realtime:** 3 pilares â€” Postgres Changes, Broadcast (pub/sub), Presence (usuarios online via CRDTs)
- **Edge Functions:** Funciones serverless en Deno

### Vercel (Deployment)
- Hosting optimizado para Next.js
- Edge Network global
- Preview Deployments automÃ¡ticos por PR

### GitHub (Control de versiÃ³n)
- Repositorio principal
- GitHub Actions para CI/CD (lint, tests, type-check)

---

## 2. LibrerÃ­as de Componentes UI

### shadcn/ui â­ (RECOMENDADO como base)
- **QuÃ© es:** ColecciÃ³n de componentes copy-paste construidos sobre Radix UI + Tailwind CSS
- **Compatibilidad Tailwind v4:** âœ… Soporte nativo completo desde 2025
- **React 19:** âœ… EliminÃ³ `forwardRef`, usa `ref` como prop estÃ¡ndar
- **Nuevas features:** Atributos `data-slot` en cada componente, colores en OKLCH
- **InstalaciÃ³n:**
  ```bash
  npx shadcn@latest init  # Auto-configura para Tailwind v4
  npx shadcn@latest add button dialog dropdown-menu  # Agregar componentes
  ```
- **Pros:** Control total del cÃ³digo, tipado excelente, accesible (Radix), ecosistema enorme, integraciÃ³n perfecta con Tailwind v4
- **Contras:** Requiere mÃ¡s setup inicial que librerÃ­as "baterÃ­as incluidas"

### Magic UI â­ (RECOMENDADO como complemento)
- **QuÃ© es:** 150+ componentes animados y efectos para interfaces premium (landing pages, SaaS)
- **Basado en:** React + TypeScript + Tailwind CSS + Framer Motion
- **Arquitectura:** Copy-paste (igual que shadcn/ui â€” no es un npm package pesado)
- **Lo que aporta:** Tarjetas 3D interactivas, bordes luminosos, animaciones de texto, fondos de partÃ­culas, bento grids, marquees, efectos de scroll
- **InstalaciÃ³n:** CLI oficial + MCP server para AI editors
- **Pro:** Complemento perfecto para shadcn/ui â€” aÃ±ade el "wow factor" visual
- **Contras:** Dependencia de Framer Motion (bundle size), algunos efectos pueden ser excesivos

### HeroUI (antes NextUI)
- **QuÃ© es:** LibrerÃ­a de componentes React universal (rebrandeada de NextUI)
- **Basado en:** Tailwind CSS + React Aria (Adobe) para accesibilidad enterprise
- **Compatibilidad Tailwind v4:** âœ… Soportado
- **Incluye:** React Native (HeroUI Native), soporte RSC, MCP servers
- **InstalaciÃ³n:**
  ```bash
  npm install @heroui/react
  ```
- **Pros:** Componentes pre-estilizados listos para usar, excelente accesibilidad, design system coherente
- **Contras:** Menos control granular que shadcn/ui, mÃ¡s opinionada, menor ecosistema de terceros

### ðŸ† RecomendaciÃ³n: **shadcn/ui** (base) + **Magic UI** (animaciones/efectos)
HeroUI es viable si se prefiere un design system "baterÃ­as incluidas", pero la combinaciÃ³n shadcn + Magic UI ofrece mÃ¡xima flexibilidad y el mejor look moderno.

---

## 3. Componentes EspecÃ­ficos Necesarios

### ðŸ“… Calendario
| LibrerÃ­a | Uso | RecomendaciÃ³n |
|----------|-----|---------------|
| **react-day-picker** | Date picker, selecciÃ³n de fechas, rangos | âœ… USAR â€” Es la base del componente Calendar de shadcn/ui |
| **@schedule-x/react** | Calendario de eventos tipo Google Calendar (dÃ­a/semana/mes) | âœ… USAR â€” Para vista de eventos, drag-and-drop |
| **FullCalendar** | Alternativa mÃ¡s pesada con mÃ¡s features | âš ï¸ Evaluar si Schedule-X no cubre |

```bash
# Date picker (integrado en shadcn)
npx shadcn@latest add calendar

# Calendario de eventos
npm install @schedule-x/react @schedule-x/calendar @schedule-x/theme-default @schedule-x/events-service
```

### â° Time Picker
- Usar **shadcn/ui** combinado con input de tiempo custom o `react-day-picker` en modo datetime
- Alternativa: Construir con Radix UI `Popover` + inputs numÃ©ricos

### ðŸ–±ï¸ Context Menu
- **Radix UI `@radix-ui/react-context-menu`** â€” Ya integrado en shadcn/ui
```bash
npx shadcn@latest add context-menu
```

### âœï¸ Editor de Texto Rico / Block Editor

| Editor | Tipo | AI | RecomendaciÃ³n |
|--------|------|----|---------------|
| **Tiptap** | Headless framework (ProseMirror) | Manual/Extension | Para control total y UI custom |
| **BlockNote** | Block editor tipo Notion (sobre Tiptap) | VÃ­a paquetes | âœ… RECOMENDADO â€” RÃ¡pido de integrar, drag-and-drop, slash commands, colaboraciÃ³n |
| **Novel** | AI-first editor (sobre Tiptap) | âœ… Built-in | Para blog/CMS con generaciÃ³n AI |

**RecomendaciÃ³n:** **BlockNote** para el editor principal del blog/contenido (veloz, Notion-style, colaboraciÃ³n). **Novel** si se quiere AI integrada. Para formularios simples, Tiptap headless.

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
# O para Novel:
npm install novel
```

### ðŸ–¼ï¸ Editor de Imagen

| LibrerÃ­a | Features | Licencia |
|----------|----------|----------|
| **@ascentspark/react-image-editor** | Crop, filtros, dibujo, texto, stickers, formas, AI bg removal | MIT, Fabric.js v7, React 19 âœ… |
| **react-photo-editor** | Brillo, contraste, rotaciÃ³n, dibujo bÃ¡sico | MIT |
| **react-easy-crop** | Solo crop + zoom (perfil de usuario) | MIT |

**RecomendaciÃ³n:** **@ascentspark/react-image-editor** como editor completo + **react-easy-crop** para avatares/perfil.

### ðŸ—ºï¸ MapLibre GL JS
- **LibrerÃ­a:** `maplibre-gl` + opcionalmente `react-map-gl/maplibre`
- **Requisito:** `"use client"` obligatorio + `dynamic import` con `ssr: false`
- **CSS obligatorio:** `import 'maplibre-gl/dist/maplibre-gl.css'`
- **Container:** Debe tener width/height explÃ­citos (si no, renderiza gris)
```bash
npm install maplibre-gl react-map-gl
```

### ðŸŽµ Media Player (Sermones)
- **RecomendaciÃ³n:** **react-player** (soporta video/audio, YouTube, Vimeo, archivos directos)
- **Alternativa custom:** HTML5 `<audio>` / `<video>` con controles Tailwind custom
- **Para streaming:** Supabase Storage + URLs firmadas para archivos privados
```bash
npm install react-player
```

---

## 4. AutenticaciÃ³n y AutorizaciÃ³n

### Supabase Auth
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### MÃ©todos de autenticaciÃ³n:
- Email/Password
- OAuth: Google, GitHub, Facebook
- Magic Link (email)
- MFA/2FA (TOTP)

### RBAC (Role-Based Access Control)
**Enfoque recomendado: Tabla `profiles` + funciÃ³n `security definer`**

```sql
-- Tabla de perfiles vinculada a auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',  -- 'admin', 'pastor', 'leader', 'member', 'visitor'
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- FunciÃ³n helper para verificar roles (evita recursiÃ³n en RLS)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

-- FunciÃ³n helper para admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;
```

### Roles del sistema:
| Rol | Permisos |
|-----|----------|
| `admin` | Todo â€” CRUD total, gestiÃ³n de usuarios, configuraciÃ³n |
| `pastor` | GestiÃ³n de sermones, eventos, blog, miembros |
| `leader` | GestiÃ³n de grupos, eventos limitados |
| `member` | Ver contenido, donaciones, perfil propio |
| `visitor` | Solo lectura pÃºblica |

### Row Level Security (RLS) â€” Ejemplo:
```sql
-- Grants restrictivos
REVOKE ALL ON TABLE public.posts FROM anon, authenticated;
GRANT SELECT ON TABLE public.posts TO anon;  -- Posts pÃºblicos
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.posts TO authenticated;

-- Policies
CREATE POLICY "Public read" ON public.posts
  FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Authors manage own posts" ON public.posts
  FOR ALL TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins manage all posts" ON public.posts
  FOR ALL TO authenticated
  USING (public.is_admin());
```

### Seguridad crÃ­tica:
- âš ï¸ **Nunca exponer `service_role` key en el cliente**
- âš ï¸ **RLS controla filas, NO columnas** â€” No permitir que usuarios modifiquen su propio campo `role`
- âš ï¸ **Testar RLS con tokens reales**, no desde el SQL Editor (que usa superuser)
- âœ… Usar `app_metadata` (no `user_metadata`) para claims custom en JWT

---

## 5. Sistema de Temas (Dark/Light Mode)

### Setup: `next-themes` + Tailwind CSS v4

**1. Instalar:**
```bash
npm install next-themes
```

**2. CSS (`app/globals.css`):**
```css
@import "tailwindcss";

/* Variante dark class-based */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  /* Colores semÃ¡nticos con CSS variables */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-popover: var(--popover);
}

/* Tema Light */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.55 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.96 0.01 260);
  --muted: oklch(0.96 0 0);
  --accent: oklch(0.93 0.02 260);
  --destructive: oklch(0.55 0.2 27);
  --border: oklch(0.9 0 0);
  --ring: oklch(0.55 0.2 260);
  --card: oklch(1 0 0);
  --popover: oklch(1 0 0);
}

/* Tema Dark */
.dark {
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.2 260);
  --primary-foreground: oklch(0.12 0 0);
  --secondary: oklch(0.2 0.01 260);
  --muted: oklch(0.2 0 0);
  --accent: oklch(0.25 0.02 260);
  --destructive: oklch(0.6 0.2 27);
  --border: oklch(0.25 0 0);
  --ring: oklch(0.65 0.2 260);
  --card: oklch(0.15 0 0);
  --popover: oklch(0.15 0 0);
}
```

**3. Layout (`app/layout.tsx`):**
```tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**4. Toggle Component (con protecciÃ³n de hidrataciÃ³n):**
```tsx
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "ðŸŒž" : "ðŸŒ™"}
    </button>
  );
}
```

---

## 6. Estructura de Carpetas Recomendada

```
domenica/
â”œâ”€â”€ public/                          # Assets estÃ¡ticos
â”‚   â”œâ”€â”€ images/
â”‚   â”œâ”€â”€ fonts/
â”‚   â””â”€â”€ favicon.ico
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/                         # Next.js App Router
â”‚   â”‚   â”œâ”€â”€ (public)/                # Route Group: pÃ¡ginas pÃºblicas
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx             # Landing / Home
â”‚   â”‚   â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx         # Lista de posts
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [slug]/
â”‚   â”‚   â”‚   â”‚       â””â”€â”€ page.tsx     # Post individual
â”‚   â”‚   â”‚   â”œâ”€â”€ sermones/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [id]/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ eventos/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [id]/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ tienda/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [id]/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ donar/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ mapa/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ layout.tsx           # Layout pÃºblico (navbar, footer)
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ (auth)/                  # Route Group: autenticaciÃ³n
â”‚   â”‚   â”‚   â”œâ”€â”€ login/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ registro/page.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ verificar/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ layout.tsx
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ (dashboard)/             # Route Group: panel admin
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx         # Overview
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ miembros/page.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx     # Lista
â”‚   â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ nuevo/page.tsx
â”‚   â”‚   â”‚   â”‚   â”‚   â””â”€â”€ [id]/editar/page.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ sermones/page.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ eventos/page.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ productos/page.tsx
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ donaciones/page.tsx
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ configuracion/page.tsx
â”‚   â”‚   â”‚   â””â”€â”€ layout.tsx           # Layout dashboard (sidebar, auth guard)
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ api/                     # Route Handlers
â”‚   â”‚   â”‚   â”œâ”€â”€ webhooks/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ stripe/route.ts
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ supabase/route.ts
â”‚   â”‚   â”‚   â””â”€â”€ upload/route.ts
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ layout.tsx               # Root Layout (providers, fonts)
â”‚   â”‚   â”œâ”€â”€ not-found.tsx
â”‚   â”‚   â””â”€â”€ error.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ components/                  # Componentes globales reutilizables
â”‚   â”‚   â”œâ”€â”€ ui/                      # shadcn/ui primitives
â”‚   â”‚   â”‚   â”œâ”€â”€ button.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ dialog.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ dropdown-menu.tsx
â”‚   â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚   â”œâ”€â”€ layout/                  # Estructura app-wide
â”‚   â”‚   â”‚   â”œâ”€â”€ header.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ footer.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ sidebar.tsx
â”‚   â”‚   â”‚   â””â”€â”€ mobile-nav.tsx
â”‚   â”‚   â””â”€â”€ shared/                  # Componentes compartidos con lÃ³gica
â”‚   â”‚       â”œâ”€â”€ theme-toggle.tsx
â”‚   â”‚       â”œâ”€â”€ user-avatar.tsx
â”‚   â”‚       â””â”€â”€ search-bar.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ features/                    # MÃ³dulos por dominio
â”‚   â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ actions.ts           # Server Actions
â”‚   â”‚   â”‚   â””â”€â”€ hooks.ts
â”‚   â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ actions.ts
â”‚   â”‚   â”‚   â””â”€â”€ types.ts
â”‚   â”‚   â”œâ”€â”€ sermones/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ media-player.tsx
â”‚   â”‚   â”‚   â””â”€â”€ actions.ts
â”‚   â”‚   â”œâ”€â”€ eventos/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ event-calendar.tsx
â”‚   â”‚   â”‚   â””â”€â”€ actions.ts
â”‚   â”‚   â”œâ”€â”€ tienda/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â””â”€â”€ actions.ts
â”‚   â”‚   â”œâ”€â”€ donaciones/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â””â”€â”€ actions.ts
â”‚   â”‚   â”œâ”€â”€ miembros/
â”‚   â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â””â”€â”€ actions.ts
â”‚   â”‚   â””â”€â”€ mapa/
â”‚   â”‚       â””â”€â”€ components/
â”‚   â”‚           â””â”€â”€ map-view.tsx
â”‚   â”‚
â”‚   â”œâ”€â”€ hooks/                       # Hooks globales
â”‚   â”‚   â”œâ”€â”€ use-debounce.ts
â”‚   â”‚   â”œâ”€â”€ use-media-query.ts
â”‚   â”‚   â””â”€â”€ use-auth.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ lib/                         # Utilidades y clientes
â”‚   â”‚   â”œâ”€â”€ supabase/
â”‚   â”‚   â”‚   â”œâ”€â”€ client.ts            # Browser client
â”‚   â”‚   â”‚   â”œâ”€â”€ server.ts            # Server client
â”‚   â”‚   â”‚   â””â”€â”€ middleware.ts        # Auth middleware
â”‚   â”‚   â”œâ”€â”€ utils.ts                 # cn(), formatDate(), etc.
â”‚   â”‚   â””â”€â”€ constants.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ types/                       # Tipos globales
â”‚   â”‚   â”œâ”€â”€ database.types.ts        # Auto-generado por Supabase CLI
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â”‚
â”‚   â””â”€â”€ styles/
â”‚       â””â”€â”€ globals.css
â”‚
â”œâ”€â”€ supabase/                        # Supabase local config
â”‚   â”œâ”€â”€ migrations/                  # SQL migrations
â”‚   â”œâ”€â”€ seed.sql
â”‚   â””â”€â”€ config.toml
â”‚
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â”œâ”€â”€ ci.yml                   # Lint + Tests + Type-check
â”‚       â””â”€â”€ deploy.yml               # (opcional si usas Vercel Git integration)
â”‚
â”œâ”€â”€ .env.local
â”œâ”€â”€ .env.example
â”œâ”€â”€ next.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

---

## 7. Base de Datos â€” Esquema Preliminar (Supabase/PostgreSQL)

```sql
-- ============================================
-- EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: profiles (vinculada a auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','pastor','leader','member','visitor')),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  birth_date DATE,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: blog_posts
-- ============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB,                    -- BlockNote/Tiptap JSON
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: sermones
-- ============================================
CREATE TABLE public.sermones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  speaker_id UUID REFERENCES public.profiles(id),
  speaker_name TEXT,                -- Para speakers externos
  series_name TEXT,
  audio_url TEXT,                   -- Supabase Storage
  video_url TEXT,                   -- YouTube/Vimeo o Storage
  thumbnail_url TEXT,
  scripture_reference TEXT,         -- "Juan 3:16"
  duration_seconds INTEGER,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: eventos
-- ============================================
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,
  recurrence_rule TEXT,             -- iCal RRULE
  cover_image_url TEXT,
  max_attendees INTEGER,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: event_registrations
-- ============================================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered','cancelled','attended')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABLA: productos (tienda)
-- ============================================
CREATE TABLE public.productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  images TEXT[],                    -- Array de URLs
  category TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_digital BOOLEAN DEFAULT false,
  digital_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: orders
-- ============================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: order_items
-- ============================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.productos(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL
);

-- ============================================
-- TABLA: donaciones
-- ============================================
CREATE TABLE public.donaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES public.profiles(id),  -- NULL para donaciones anÃ³nimas
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  type TEXT DEFAULT 'one_time' CHECK (type IN ('one_time','recurring')),
  designation TEXT,                  -- "Diezmo", "Ofrenda", "Misiones", etc.
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,       -- Para donaciones recurrentes
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','refunded')),
  notes TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  donated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: miembros_grupos (grupos/ministerios)
-- ============================================
CREATE TABLE public.grupos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES public.profiles(id),
  meeting_day TEXT,
  meeting_time TIME,
  meeting_location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.grupo_miembros (
  grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader','co-leader','member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (grupo_id, user_id)
);

-- ============================================
-- ÃNDICES
-- ============================================
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_sermones_published ON public.sermones(published, published_at DESC);
CREATE INDEX idx_eventos_dates ON public.eventos(start_date, end_date);
CREATE INDEX idx_productos_slug ON public.productos(slug);
CREATE INDEX idx_productos_active ON public.productos(is_active);
CREATE INDEX idx_donaciones_donor ON public.donaciones(donor_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- RLS: Habilitar en todas las tablas
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_miembros ENABLE ROW LEVEL SECURITY;
```

---

## 8. Deployment â€” Vercel + GitHub Actions

### OpciÃ³n Recomendada: Vercel Git Integration (zero-config) + GitHub Actions (CI)

**Vercel maneja automÃ¡ticamente:**
- Preview Deployment por cada PR â†’ URL Ãºnica + comentario en PR
- Production Deployment al merge a `main`
- Edge Network global, ISR, funciones serverless

**GitHub Actions maneja CI (lint, tests, type-check):**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Run Tests
        run: npm run test

      - name: Build Check
        run: npm run build
```

### Variables de entorno en Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # Solo server-side
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://domenica.vercel.app
```

### Flujo de trabajo Git:
```
main (producciÃ³n) â† PR â† develop â† feature/xxx
                                   â† fix/xxx
```

### ConfiguraciÃ³n Vercel:
1. Conectar repo GitHub en vercel.com
2. Framework Preset: Next.js (auto-detectado)
3. Build Command: `npm run build` (default)
4. Output Directory: `.next` (default)
5. Configurar variables de entorno por environment (Production, Preview, Development)
6. Branch Protection: Require PR reviews + CI passing antes de merge

---

## Resumen de Dependencias Principales

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "next-themes": "^0.4",
    "@radix-ui/react-context-menu": "^2",
    "@blocknote/core": "latest",
    "@blocknote/react": "latest",
    "@schedule-x/react": "latest",
    "@schedule-x/calendar": "latest",
    "react-day-picker": "^9",
    "date-fns": "^4",
    "maplibre-gl": "^4",
    "react-map-gl": "^7",
    "react-player": "^2",
    "@ascentspark/react-image-editor": "latest",
    "react-easy-crop": "^5",
    "framer-motion": "^11",
    "zod": "^3",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "@tailwindcss/postcss": "^4",
    "@types/react": "^19",
    "@types/node": "^22",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

---

Fin del reporte tÃ©cnico. Todas las tecnologÃ­as investigadas son compatibles entre sÃ­ y representan el estado del arte para 2025.
