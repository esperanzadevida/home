# Guía visual y recursos — Iglesia Esperanza de Vida

Actualizada el 2026-11-21. La dirección visual conserva el tono cálido y editorial: verde bosque, fotografía de luz natural y tipografía de lectura clara. La identidad, nombres, horarios y datos de perfil son contenido creativo autorizado para esta ambientación.

## Identidad activa

- **Nombre:** Iglesia Esperanza de Vida, Asambleas de Dios, Ambato.
- **Símbolo visual:** `public/images/brand/esperanza-de-vida-flame.png`.
- **Colores:** tokens en `src/styles/globals.css` y `src/styles/tokens.css`; conservar la paleta existente mientras se revisa el sistema de color.
- **Perfil y horarios:** `src/config/church-profile.ts`.

El símbolo es una propuesta gráfica para el proyecto, no un emblema oficial de la denominación. Sendero de la Aurora y sus recursos quedan archivados como variante anterior.

## Imágenes generadas existentes

Las nueve imágenes WebP de `public/images/esperanza-de-vida/` ya cubren retratos pastorales, culto, ministerios, servicio comunitario y galería. Reutilizarlas; no generar duplicados para las secciones actuales. El inventario canónico, sus usos y textos alternativos está en [`docs/ASSETS-ESPERANZA-DE-VIDA.md`](../ASSETS-ESPERANZA-DE-VIDA.md). Horarios, nombres y descripciones se mantienen como texto HTML accesible, nunca rasterizados dentro de las imágenes.

Los retratos y escenas generados ambientan el producto y no constituyen documentación de personas o servicios reales. El sitio público mantiene la presentación editorial normal solicitada por Nicola.

## Material de referencia heredado

`docs/assets/` y algunos archivos de `public/images/hero/` pertenecen a exploraciones anteriores. Sus autores y licencias no están documentados de forma suficiente; no describirlos como fotos de esta congregación ni sustituir las imágenes actuales sin revisar procedencia y permiso.

## Home y video

La Home publicada integra un MP4 sincronizado al scroll, un poster WebP y narrativa HTML. El movimiento reducido conserva el poster; con Network Information API, `saveData`, `slow-2g`/`2g` o `downlink` <= 2 Mb/s también evita descargar el video. En móvil con conexión suficiente y movimiento normal el scrubbing se mantiene. El rendimiento medido, la procedencia y el permiso del clip están documentados en `docs/PLAN-MAESTRO.md`; falta confirmar la licencia de esta pieza específica y validar redes reales.
