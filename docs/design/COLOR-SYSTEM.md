# Guía de Colores — Sistema de Diseño

## Filosofía
Los colores están definidos como CSS variables en el root, organizados para que el cambio
entre modo claro y modo oscuro sea automático y consistente. Cada color tiene un propósito
claro y no se repiten significados.

## Paleta Base (Asambleas de Dios adaptada)

### Colores primarios
Los colores institucionales de Asambleas de Dios son azul y rojo. Los adaptamos para
un look moderno manteniendo la identidad.

| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `--primary` | `#1e40af` (Azul real) | `#3b82f6` (Azul brillante) | Acciones principales, CTAs |
| `--primary-foreground` | `#ffffff` | `#ffffff` | Texto sobre primary |
| `--secondary` | `#b91c1c` (Rojo profundo) | `#ef4444` (Rojo vivo) | Acentos, alertas, urgencia |
| `--secondary-foreground` | `#ffffff` | `#ffffff` | Texto sobre secondary |

### Colores de superficie
| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `--background` | `#ffffff` | `#0a0a0f` | Fondo principal |
| `--foreground` | `#0f172a` | `#f8fafc` | Texto principal |
| `--card` | `#f8fafc` | `#111827` | Cards y contenedores |
| `--card-foreground` | `#0f172a` | `#f1f5f9` | Texto en cards |
| `--muted` | `#f1f5f9` | `#1e293b` | Fondos sutiles |
| `--muted-foreground` | `#64748b` | `#94a3b8` | Texto secundario |

### Colores de estado
| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `--success` | `#16a34a` | `#22c55e` | Éxito, confirmaciones |
| `--warning` | `#d97706` | `#f59e0b` | Advertencias |
| `--destructive` | `#dc2626` | `#f87171` | Errores, eliminaciones |
| `--info` | `#2563eb` | `#60a5fa` | Información |

### Colores de borde y separadores
| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `--border` | `#e2e8f0` | `#1e293b` | Bordes generales |
| `--input` | `#e2e8f0` | `#374151` | Bordes de inputs |
| `--ring` | `#1e40af` | `#3b82f6` | Focus rings |

### Colores del accent (dorado espiritual)
| Token | Light Mode | Dark Mode | Uso |
|---|---|---|---|
| `--accent` | `#d4a017` (Dorado) | `#fbbf24` (Ámbar) | Detalles premium, decorativos |
| `--accent-foreground` | `#1a1a2e` | `#1a1a2e` | Texto sobre accent |

## Reglas de uso

1. **Máximo 3 colores principales** en cualquier sección: primary, background, y un acento
2. **Contraste mínimo WCAG AA**: 4.5:1 para texto normal, 3:1 para texto grande
3. **No usar colores hex directos** en componentes — siempre usar tokens CSS
4. **El accent (dorado)** se usa con moderación: iconos decorativos, bordes de cards destacadas, badges
5. **En dark mode**, los colores primarios son más luminosos para mantener legibilidad
6. **Los gradientes** se hacen entre variantes del mismo tono (primary-500 → primary-700)
