# Video de portada

- hero-scrub.mp4 es el clip de cintas verdes descargado desde la cuenta de Magnific. Conserva H.264, 1920 × 1080, 24 fps y 5,04 s. La versión servida pesa 4.290.098 bytes (4,29 MB), codificada con libx264 CRF 18, preset slow, GOP 8, sin audio y con faststart.
- El original de 13.640.472 bytes se conserva en docs/assets/hero-scrub-original.mp4. Su hash SHA-256 se verificó al moverlo.
- hero-poster.webp es el primer fotograma del MP4 actual, escalado a 1280 × 720 y exportado como WebP calidad 86. Los originales previos se conservan en docs/assets/hero-poster-original.webp.
- Los heroes pintan el poster primero. Con movimiento normal permiten scrubbing en escritorio y móvil. El video usa carga nativa progresiva y solicitudes por rangos para empezar antes de descargar el archivo completo; con `prefers-reduced-motion`, `saveData`, `slow-2g`/`2g` o `downlink` <= 0,5 Mb/s conserva el poster sin solicitar el MP4.
- `ScrollScrubHero` aplica `NEXT_PUBLIC_BASE_PATH` a las rutas locales del video y poster; la exportación de GitHub Pages sirve los recursos bajo `/home/videos/`.
- Comparación local de calidad con FFmpeg libvmaf: 92,854 VMAF para CRF 18 contra el original; el archivo reduce el peso en 68,6 %. VMAF es una métrica comparativa, no una garantía de percepción idéntica en todos los tamaños de pantalla.

Comandos reproducibles desde la raíz del proyecto si ffmpeg está disponible:

    ffmpeg -i docs/assets/hero-scrub-original.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an public/videos/hero-scrub.mp4
    ffmpeg -i public/videos/hero-scrub.mp4 -frames:v 1 -vf scale=1280:720:flags=lanczos -c:v libwebp -quality 86 public/videos/hero-poster.webp

La pieza está incluida en el sitio estático de GitHub Pages. Confirmación directa del usuario, 2026-11-21: el MP4 del hero se generó con una suscripción paga activa de Magnific y usando una imagen propia o licenciada. El repositorio no conserva el identificador de generación.
