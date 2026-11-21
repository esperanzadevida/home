# Prompt para Continuar el Hero con Video en Scroll en ChatGPT

Estoy construyendo la página de inicio de una iglesia cristiana (Next.js 15 App Router, TypeScript y Tailwind CSS v4).

Ya tengo implementado en la parte superior de Inicio el motor de **video controlado por scroll** siguiendo el patrón de `10k-websites`:
- Componente del video en scroll: `src/components/shared/ScrollScrubHero.tsx`
- Estilos del escenario en scroll: `src/styles/scroll-scrub-hero.css`
- Página de inicio: `src/app/(public)/page.tsx`
- Video de fondo: `public/videos/hero-scrub.mp4` (cintas verdes abstractas cruzándose hacia adentro con destello luminoso arriba a la izquierda sobre fondo verde oscuro `#07120c`).

## Cómo funciona la base actual (NO romper el motor del video)
1. `.scrub-hero` tiene altura de scroll `400vh` en escritorio y actualiza la variable CSS `--scrub-progress` de `0` a `1` suavizada con lerp.
2. `.scrub-stage` es `position: sticky; top: 0; height: 100svh`.
3. Ya existe el cargador en Blob, el gating de seeks, la pausa fuera de pantalla, el scrim radial base (`.scrub-scrim`) y los 5 gates de hero estático para móviles y `prefers-reduced-motion: reduce`.
4. Dentro de `.scrub-stage` existe un contenedor reservado con `z-index: 4`: `.scrub-overlay-slot` (`children` de `<ScrollScrubHero>`).

## Lo que necesito que diseñes y construyas ahora
Sin alterar la lógica de carga ni de scrubbing del video, añade la capa visual y narrativa encima del video dentro de `<ScrollScrubHero>`:

1. **Bandas de contenido sincronizadas con el scroll (3 tiempos)**:
   - **Banda 1 (`0.00` a `0.28`)**: Aparece ya visible y asentada al cargar la página (no esperar al scroll para mostrarse). Incluye un eyebrow sutil, título principal editorial de alto impacto, subtítulo corto y 2 botones (CTA principal + enlace secundario).
   - **Banda 2 (`0.32` a `0.64`)**: 2 o 3 cuadros estilo **glassmorphism** (borde sutil translúcido, `backdrop-filter: blur(14px)`, fondo verde muy oscuro semitransparente) colocados en el espacio negativo sin tapar el centro donde se cruzan las cintas verdes. Pueden mostrar horarios de reunión, ubicación y bienvenida.
   - **Banda 3 (`0.68` a `1.00`)**: Cierre del recorrido que queda asentado al final del scroll (sin desaparecer al llegar a `1.0`) con una frase breve y botón hacia la primera visita o la comunidad.

2. **Reglas visuales y técnicas obligatorias**:
   - **Legibilidad garantizada**: Cada banda debe llevar un scrim radial sutil detrás del texto y `text-shadow` en 3 capas para textos sobre video (sin sombra en los textos de botones). Contraste mínimo 4.5:1 en textos y 3.5:1 sobre el fotograma más brillante.
   - **Animaciones fluidas y reversibles**: Usa solo `transform` y `opacity` controlados por el progreso del scroll (o un callback/hook ligero conectado a `--scrub-progress`), con `smoothstep` en entradas y salidas para que nada salte de golpe.
   - **Coherencia con el navbar y paleta**: Mantén armonía con la barra superior `GlassNavbar` (sticky de `64px` de alto) y la paleta verde esmeralda/lima (`#07120c`, `#4ade80`, `#a3e635`, `#f3f7f4`).
   - **Responsive y accesibilidad**: En móvil (cuando se activan los gates estáticos de `scroll-scrub-hero.css`) o con `prefers-reduced-motion: reduce`, muestra una composición estática limpia con el título principal, los botones y las tarjetas esenciales bien ordenadas, sin superposiciones ni texto cortado.

Entrégame el código completo y listo para pegar de los nuevos componentes de overlay, las clases CSS adicionales en `scroll-scrub-hero.css` y la integración exacta en `src/app/(public)/page.tsx`.
