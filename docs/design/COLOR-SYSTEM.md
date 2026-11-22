# Sistema de color actual — Iglesia Esperanza de Vida

## Fuente de verdad

Los tokens que renderiza la interfaz están en `src/styles/globals.css`; los colores de apoyo para la portada editorial están en `src/styles/tokens.css`. Esta guía refleja los valores activos y los cambios de la clase `.dark`. No describe una paleta oficial de Asambleas de Dios: la marca verde es la identidad creativa aprobada para esta ambientación del proyecto.

## Tokens de interfaz

| Token | Tema claro | Tema oscuro | Uso |
|---|---|---|---|
| `background` / `foreground` | `#fbfaf6` / `#0f172a` | `#090a0f` / `#f8fafc` | Superficie y texto principal |
| `card` / `card-foreground` | `#f8fafc` / `#0f172a` | `#111420` / `#f8fafc` | Tarjetas y paneles |
| `popover` / `popover-foreground` | `#fbfaf6` / `#0f172a` | `#111420` / `#f8fafc` | Paneles flotantes |
| `primary` / `primary-foreground` | `#166534` / `#f8fafc` | `#4ade80` / `#052e16` | Acción principal y foco |
| `secondary` / `secondary-foreground` | `#dcfce7` / `#14532d` | `#14532d` / `#dcfce7` | Acciones y superficies secundarias |
| `muted` / `muted-foreground` | `#f1f5f9` / `#565f6c` | `#1a2030` / `#94a3b8` | Información secundaria |
| `accent` / `accent-foreground` | `#a3e635` / `#14261b` | `#a3e635` / `#14261b` | Acento lima y texto sobre él |
| `destructive` / `destructive-foreground` | `#dc2626` / `#f8fafc` | `#f87171` / `#052e16` | Acciones y estados destructivos |
| `success` / `success-foreground` | `#166534` / `#f8fafc` | `#22c55e` / `#052e16` | Estados positivos e inventario disponible |
| `warning` / `warning-foreground` | `#9a4a00` / `#f8fafc` | `#f59e0b` / `#052e16` | Advertencias y existencias bajas |
| `border` / `input` | `#e2e8f0` / `#e2e8f0` | `#1e293b` / `#1e293b` | Separadores y campos |
| `ring` | `#15803d` | `#4ade80` | Indicador visible de foco |

## Uso

- Prioriza los tokens semánticos (`bg-background`, `text-foreground`, `text-success`, etc.) en vez de repetir valores hexadecimales en componentes.
- Usa `*-foreground` cuando un token de estado se aplica como fondo sólido. Para estados tenues, conserva texto oscuro en tema claro y texto claro en tema oscuro sobre `bg-*/10`.
- El verde bosque, la lima y el papel cálido mantienen la dirección editorial del sitio. El tema oscuro conserva superficies azul-negras y verdes más luminosos.
- En fotografías, gradientes y superficies translúcidas revisa el color realmente compuesto detrás del texto; el valor aislado del token no prueba por sí solo el contraste final.

## Contraste comprobado

WCAG 2.2 AA pide 4,5:1 para texto normal y 3:1 para texto grande ([W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Con los valores sólidos de los tokens, el texto principal supera 17:1; primario 6,81:1 en claro y 8,55:1 en oscuro; y el nuevo par de éxito claro `#166534` sobre `#f8fafc` da 6,81:1. El par de advertencia claro `#f8fafc` sobre `#9a4a00` da 5,99:1.

En la revisión de estados positivos de Admin se midieron los colores compuestos de las etiquetas verdes en las rutas de Miembros, Usuarios, Inventario, Pedidos y Productos. El valor anterior `#16a34a` quedó en 2,83:1 sobre `bg-success/10` y 3,15:1 sobre una tarjeta clara; se reemplazó por `#166534`. Estos valores describen los componentes y temas comprobados; no constituyen una declaración de conformidad WCAG de todo el sitio.
