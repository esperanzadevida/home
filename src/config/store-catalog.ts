export type StoreCategory =
  | "Ropa"
  | "Biblias y Libros"
  | "Papelería"
  | "Accesorios";

export interface StoreColorOption {
  id: string;
  name: string;
  hex: string;
  /** Optional subtle visual filter so switching swatch visibly updates the studio preview */
  imageFilter?: string;
}

export interface StoreModelOption {
  id: string;
  name: string;
  note: string;
  priceDelta?: number;
}

export interface StoreSizeOption {
  label: string;
  stock: number;
}

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: StoreCategory;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  image: string;
  imageAlt: string;
  skuPrefix: string;
  materials: string;
  colors: StoreColorOption[];
  models: StoreModelOption[];
  sizes: StoreSizeOption[];
  hasApparelSizeGuide?: boolean;
  featured?: boolean;
}

export const APPAREL_SIZE_GUIDE = [
  { size: "XS", chest: "98 cm", length: "66 cm", shoulder: "46 cm" },
  { size: "S", chest: "106 cm", length: "69 cm", shoulder: "49 cm" },
  { size: "M", chest: "114 cm", length: "72 cm", shoulder: "52 cm" },
  { size: "L", chest: "122 cm", length: "75 cm", shoulder: "55 cm" },
  { size: "XL", chest: "130 cm", length: "78 cm", shoulder: "58 cm" },
  { size: "XXL", chest: "138 cm", length: "80 cm", shoulder: "61 cm" },
] as const;

export const STORE_CATEGORIES: readonly ("Todos" | StoreCategory)[] = [
  "Todos",
  "Ropa",
  "Biblias y Libros",
  "Papelería",
  "Accesorios",
] as const;

export const STORE_CATALOG: StoreProduct[] = [
  {
    id: "hoodie-esperanza-viva",
    slug: "camiseta-esperanza-de-vida",
    name: "Hoodie Heavyweight «Esperanza Viva»",
    tagline: "Algodón peinado 380 GSM · Edición comunidad",
    description:
      "Buzo con capucha estructurada de caída moderna, confeccionado en felpa gruesa de algodón peinado. Pensado para el frío de Ambato con acabados limpios y costuras reforzadas.",
    category: "Ropa",
    price: 42.0,
    compareAtPrice: 52.0,
    badge: "Más vendido",
    image: "/images/store/hoodie-esperanza.jpg",
    imageAlt: "Hoodie minimalista verde bosque sobre pedestal de piedra oscura.",
    skuPrefix: "EV-HD",
    materials: "100% algodón peinado 380 GSM · Pre-encogido · Costura doble.",
    featured: true,
    hasApparelSizeGuide: true,
    colors: [
      { id: "bosque", name: "Bosque Esmeralda", hex: "#1b4332", imageFilter: "none" },
      { id: "obsidiana", name: "Negro Obsidiana", hex: "#181a1f", imageFilter: "saturate(0.12) brightness(0.84) contrast(1.1)" },
      { id: "salvia", name: "Salvia Clara", hex: "#52796f", imageFilter: "brightness(1.14) saturate(0.75)" },
    ],
    models: [
      { id: "oversize", name: "Oversize 380 GSM", note: "Hombro caído y silueta relajada" },
      { id: "regular", name: "Corte Regular", note: "Calce clásico diario", priceDelta: -4 },
    ],
    sizes: [
      { label: "S", stock: 9 },
      { label: "M", stock: 14 },
      { label: "L", stock: 11 },
      { label: "XL", stock: 6 },
      { label: "XXL", stock: 0 },
    ],
  },
  {
    id: "camiseta-luz-ambato",
    slug: "camiseta-esperanza-de-vida",
    name: "Camiseta Esencial «Luz en Ambato»",
    tagline: "Algodón pesado 260 GSM · Cuello acanalado grueso",
    description:
      "Camiseta minimalista de tejido denso que conserva su estructura lavado tras lavado. Tono crema cálido fácil de combinar en cualquier estación.",
    category: "Ropa",
    price: 22.0,
    compareAtPrice: 28.0,
    badge: "Nuevo",
    image: "/images/store/camiseta-luz.jpg",
    imageAlt: "Camiseta minimalista color crema doblada sobre pedestal de basalto.",
    skuPrefix: "EV-TS",
    materials: "100% algodón orgánico 260 GSM · Cuello rib de 2.8 cm.",
    featured: true,
    hasApparelSizeGuide: true,
    colors: [
      { id: "crema", name: "Crema Marfil", hex: "#efe9dc", imageFilter: "none" },
      { id: "arena", name: "Arena Cálida", hex: "#d6cab8", imageFilter: "sepia(0.18) brightness(0.95)" },
      { id: "piedra", name: "Gris Piedra", hex: "#9ca3af", imageFilter: "saturate(0.15) brightness(0.88)" },
    ],
    models: [
      { id: "boxy", name: "Oversize Boxy", note: "Manga amplia y caída moderna" },
      { id: "clasica", name: "Clásica Unisex", note: "Corte recto tradicional" },
    ],
    sizes: [
      { label: "XS", stock: 5 },
      { label: "S", stock: 12 },
      { label: "M", stock: 18 },
      { label: "L", stock: 10 },
      { label: "XL", stock: 4 },
    ],
  },
  {
    id: "biblia-estudio-rvr1960",
    slug: "biblia-de-estudio",
    name: "Biblia de Estudio RVR 1960 · Edición Lujo",
    tagline: "Piel vegana flexible · Cantos dorados · Doble cinta",
    description:
      "Edición de estudio pensada para lectura profunda y grupos pequeños: notas explicativas, concordancia amplia, introducciones por libro y papel crema de alta opacidad.",
    category: "Biblias y Libros",
    price: 34.0,
    compareAtPrice: 42.0,
    badge: "Edición especial",
    image: "/images/store/biblia-estudio.jpg",
    imageAlt: "Biblia de estudio encuadernada en piel vegana espresso con cantos dorados.",
    skuPrefix: "EV-BB",
    materials: "Cubierta símil piel granulada · Papel bíblico 36 g · 2 cintas satén.",
    featured: true,
    colors: [
      { id: "espresso", name: "Espresso Oscuro", hex: "#3f2318", imageFilter: "none" },
      { id: "bosque", name: "Bosque Profundo", hex: "#143d2c", imageFilter: "hue-rotate(108deg) saturate(0.85)" },
      { id: "grafito", name: "Grafito Mate", hex: "#27272a", imageFilter: "saturate(0.1) contrast(1.06)" },
    ],
    models: [
      { id: "flex", name: "Piel Vegana Flex", note: "Apertura plana de 180°" },
      { id: "tapa-dura", name: "Tapa Dura Lino", note: "Encuadernación rígida de escritorio", priceDelta: 4 },
    ],
    sizes: [
      { label: "Estándar", stock: 15 },
      { label: "Letra Grande", stock: 8 },
    ],
  },
  {
    id: "cuaderno-sermon-a5",
    slug: "cuaderno-de-reflexion",
    name: "Cuaderno de Sermón y Reflexión A5",
    tagline: "200 páginas marfil 100 g · Incluye bolígrafo metálico",
    description:
      "Diseñado para tomar notas dominicales, registrar promesas bíblicas y guardar respuestas de oración. Cubierta táctil en lino y piel vegana con cinta separadora.",
    category: "Papelería",
    price: 16.5,
    compareAtPrice: 21.0,
    badge: "Favorito",
    image: "/images/store/cuaderno-reflexion.jpg",
    imageAlt: "Cuaderno verde salvia de lino con bolígrafo negro mate sobre piedra travertino.",
    skuPrefix: "EV-JR",
    materials: "Lino encuadernado · Papel marfil 100 g sin traspaso de tinta.",
    featured: true,
    colors: [
      { id: "salvia", name: "Verde Salvia", hex: "#3d6352", imageFilter: "none" },
      { id: "obsidiana", name: "Obsidiana Mate", hex: "#1f2328", imageFilter: "saturate(0.1) brightness(0.85)" },
      { id: "oliva", name: "Oliva Cálido", hex: "#5f6f52", imageFilter: "hue-rotate(-40deg) saturate(0.95)" },
    ],
    models: [
      { id: "punteado", name: "Hojas Punteadas", note: "Ideal para mapas y apuntes creativos" },
      { id: "rayado", name: "Hojas Rayadas", note: "Formato clásico con encabezado de fecha" },
    ],
    sizes: [
      { label: "A5 · 200 pág.", stock: 24 },
      { label: "B5 · 240 pág.", stock: 11 },
    ],
  },
  {
    id: "termo-gracia-diaria",
    slug: "cuaderno-de-reflexion",
    name: "Termo Térmico Mate «Gracia Diaria»",
    tagline: "Acero inoxidable doble pared · Base de corcho natural",
    description:
      "Mantiene tu café caliente hasta 8 horas o tus bebidas frías por 16 horas. Acabado mate antideslizante y base de corcho que protege cualquier superficie.",
    category: "Accesorios",
    price: 24.0,
    compareAtPrice: 29.0,
    badge: "Edición limitada",
    image: "/images/store/termo-gracia.jpg",
    imageAlt: "Termo térmico negro mate con base de corcho natural sobre basalto.",
    skuPrefix: "EV-TM",
    materials: "Acero inoxidable 304 libre de BPA · Base de corcho natural.",
    featured: false,
    colors: [
      { id: "obsidiana", name: "Negro Obsidiana", hex: "#14161a", imageFilter: "none" },
      { id: "pino", name: "Verde Pino", hex: "#143d2c", imageFilter: "sepia(0.3) hue-rotate(95deg) saturate(1.2)" },
      { id: "grafito", name: "Titanio Mate", hex: "#4b5563", imageFilter: "brightness(1.25) contrast(0.95)" },
    ],
    models: [
      { id: "500ml", name: "500 ml Termo Viaje", note: "Tapa hermética antiderrame" },
      { id: "380ml", name: "380 ml Taza Café", note: "Compacto para escritorio", priceDelta: -3 },
    ],
    sizes: [{ label: "Única", stock: 19 }],
  },
  {
    id: "gorra-ficoa-2014",
    slug: "camiseta-esperanza-de-vida",
    name: "Gorra Estructurada «Ficoa 2014»",
    tagline: "Twill de algodón lavado · Hebilla metálica discreta",
    description:
      "Gorra minimalista de 6 paneles en sarga de algodón lavado con costuras tonales y perfil limpio. Cómoda para actividades al aire libre y jornadas de servicio.",
    category: "Accesorios",
    price: 19.0,
    compareAtPrice: 24.0,
    image: "/images/store/gorra-ficoa.jpg",
    imageAlt: "Gorra minimalista color carbón esmeralda sobre bloque de piedra mate.",
    skuPrefix: "EV-CP",
    materials: "100% algodón twill lavado · Banda interna transpirable.",
    featured: false,
    colors: [
      { id: "carbon-esmeralda", name: "Carbón Esmeralda", hex: "#284038", imageFilter: "none" },
      { id: "negro-lavado", name: "Negro Lavado", hex: "#1e2024", imageFilter: "saturate(0.08) brightness(0.86)" },
      { id: "musgo", name: "Verde Musgo", hex: "#3b5249", imageFilter: "hue-rotate(-25deg) brightness(1.06)" },
    ],
    models: [
      { id: "curva", name: "Visera Curva Clásica", note: "Ajuste natural de 6 paneles" },
      { id: "perfil-bajo", name: "Perfil Bajo Suave", note: "Corona relajada sin rigidez" },
    ],
    sizes: [{ label: "Ajustable", stock: 16 }],
  },
];
