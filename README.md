# Iglesia Esperanza de Vida — Asambleas de Dios

Sitio web local en desarrollo para una congregación ambientada editorialmente en Ambato. No hay conexión a servicios externos ni publicación configurada.

## Stack

| Tecnología | Uso / estado |
|---|---|
| Next.js 15, React 19, TypeScript | Aplicación App Router local |
| Tailwind CSS v4 | Estilos y tokens del sistema visual |
| Componentes propios, Radix | UI; conservar la base existente |
| Supabase | Planeado; sin conexión activa |
| GitHub y Vercel | Pendientes de credenciales y configuración |
| MapLibre, Schedule-X, BlockNote | Ideas sujetas a necesidad; no asumir que están configuradas |

## Estructura del repositorio

```text
docs/             Investigación, plan, prompts y guías
src/app/          Rutas públicas, autenticación y panel local
src/components/   Componentes compartidos
src/config/       Perfil editorial y contenido por ruta
src/lib/          Utilidades y datos de muestra locales
src/providers/    Estado compartido de la interfaz
src/styles/       Tokens y estilos globales
src/types/        Tipos de TypeScript
public/           Imágenes y recursos estáticos
supabase/         Borradores locales de migración y seed
```

## Estado y límites actuales

- La identidad activa de trabajo es **Iglesia Esperanza de Vida**, con emblema gráfico de llama verde. La ambientación editorial, horarios, líderes, ministerios y contactos fueron autorizados como contenido creativo; estos datos no se deben presentar como información verificada de una congregación real fuera del contexto del producto.
- Las rutas públicas y varias vistas del panel están implementadas localmente. El panel y ciertos formularios usan datos de muestra/mockups: no implican autenticación, almacenamiento durable ni operaciones reales.
- Las nueve imágenes WebP activas para liderazgo, culto, ministerios y galería se documentan en [`docs/ASSETS-ESPERANZA-DE-VIDA.md`](docs/ASSETS-ESPERANZA-DE-VIDA.md). Sendero de la Aurora y su carpeta de imágenes quedan archivados. Horarios y perfiles son texto editable centralizado, no texto incrustado en las imágenes.
- La Home integra localmente un video corto con poster y tres escenas narrativas sincronizadas. En móvil, orientación vertical y movimiento reducido usa una composición estática. La estructura, QA y pendientes están en [`docs/ESTRUCTURA-HOME-Y-VIDEO.md`](docs/ESTRUCTURA-HOME-Y-VIDEO.md).
- Persistencia, login real, permisos/RLS, formularios conectados, tienda/pagos, mapa y transmisión siguen pendientes de diseño e integración.
- Las migraciones y el seed son borradores locales aún no aplicados ni validados con una base real.

## Orden acordado

1. Completar las páginas públicas y su contenido local.
2. Terminar las vistas y flujos del panel Admin local.
3. Hacer QA responsive y de accesibilidad en páginas públicas y Admin; registrar lo probado y resolver hallazgos.
4. Cuando Nicola proporcione credenciales, cerrar el diseño de datos/permisos e integrar GitHub, Vercel y Supabase en el orden que corresponda.
5. Revisar rendimiento y procedencia del video antes de cualquier publicación; no hay despliegue configurado.

El plan detallado está en [`docs/PLAN-MAESTRO.md`](docs/PLAN-MAESTRO.md); los prompts de referencia con el orden operativo actualizado están en [`docs/prompts/PROMPTS-POR-FASES.md`](docs/prompts/PROMPTS-POR-FASES.md).

## Desarrollo local

```bash
npm install
npm run dev
```
