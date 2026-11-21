# Video local de portada

- hero-scrub.mp4 es el clip de cintas verdes descargado desde la cuenta de Magnific. Conserva H.264, 1920 × 1080, 24 fps y 5,04 s. La versión servida pesa 4.290.098 bytes (4,29 MB), codificada con libx264 CRF 18, preset slow, GOP 8, sin audio y con faststart.
- El original de 13.640.472 bytes se conserva en docs/assets/hero-scrub-original.mp4. Su hash SHA-256 se verificó al moverlo.
- hero-poster.webp es el primer fotograma del MP4 actual, escalado a 1280 × 720 y exportado como WebP calidad 86. Los originales previos se conservan en docs/assets/hero-poster-original.webp.
- La Home pinta el poster primero y solicita el video solo en escritorio con movimiento normal. En los gates móviles y prefers-reduced-motion mantiene la composición estática y no solicita el MP4.
- Comparación local de calidad con FFmpeg libvmaf: 92,854 VMAF para CRF 18 contra el original; el archivo reduce el peso en 68,6 %. VMAF es una métrica comparativa, no una garantía de percepción idéntica en todos los tamaños de pantalla.

Comandos reproducibles desde la raíz del proyecto si ffmpeg está disponible:

    ffmpeg -i docs/assets/hero-scrub-original.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an public/videos/hero-scrub.mp4
    ffmpeg -i public/videos/hero-scrub.mp4 -frames:v 1 -vf scale=1280:720:flags=lanczos -c:v libwebp -quality 86 public/videos/hero-poster.webp

La pieza está integrada localmente; no se ha desplegado ni se verificó su permiso de publicación.
