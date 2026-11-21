# Prompt para Desarrollar una Tienda Online Completa (Imágenes, Tallas, Modelos, Colores y Variantes)

Actúa como un arquitecto frontend y full-stack senior especializado en e-commerce moderno con **Next.js 15 (App Router), TypeScript estricto, Tailwind CSS v4 y Supabase**.

Vas a construir una **tienda online completa, moderna y totalmente funcional** integrada en este proyecto (`src/app/(public)/tienda`, `src/app/admin/tienda`, `src/providers/CartProvider.tsx` y `src/components/shared/CartDrawer.tsx`), respetando el sistema de diseño existente en modo claro y modo oscuro.

## 1. Modelo de Datos y Variantes (TypeScript + Supabase)
Diseña los tipos en `src/types/store.ts` y la migración SQL complementaria en `supabase/migrations/` para soportar productos con variantes reales:
- **Producto (`Product`)**: `id`, `slug`, `name`, `shortDescription`, `description`, `category`, `basePrice`, `compareAtPrice`, `featured`, `badge` ("Nuevo", "Edición limitada", "Más vendido"), `tags`, `sizeGuide`, `careInstructions`, `status`.
- **Modelos / Estilos (`ProductModel`)**: por ejemplo "Corte Regular", "Oversize", "Edición Especial", "Tapa Dura", "Cuero Vegano".
- **Colores (`ProductColor`)**: `name`, `slug`, `hex` (para swatches visuales), `hexSecondary` (opcional para bicolores) e **imágenes asociadas a ese color** (`images: { url, alt, isPrimary }[]`).
- **Tallas (`ProductSize`)**: `XS`, `S`, `M`, `L`, `XL`, `XXL` o `Única` (según categoría), con tabla de medidas en cm (pecho, largo, hombro).
- **Matriz de Variantes (`ProductVariant`)**: combinación única de `productId + modelId + colorId + size`, con su propio `sku`, `priceOverride` (opcional), `stock` numérico exacto e indicador `isAvailable`.
- Incluye un catálogo inicial realista de al menos **8 productos variados** (camisetas, hoodies, biblias, cuadernos, gorras, termos/tazas) con múltiples colores, tallas, modelos y varias fotos por producto.

## 2. Página Principal de Tienda (`/tienda`)
- **Buscador inteligente** con debounce de 300 ms por nombre, descripción, modelo o etiqueta.
- **Filtros combinables** (sidebar en escritorio y drawer deslizable en móvil):
  - Categoría.
  - Rango de precio mínimo y máximo.
  - Selector visual de colores (círculos con el tono real).
  - Selector de tallas (chips seleccionables).
  - Selector de modelo/estilo.
  - Switch "Solo productos con stock".
  - Botón para limpiar filtros activos con chips removibles arriba del grid.
- **Ordenamiento**: Destacados, Más nuevos, Precio menor a mayor, Precio mayor a menor.
- **Tarjetas de producto (`ProductCard`)**:
  - Imagen principal 4:5 o 1:1 con cambio suave a una segunda foto al pasar el cursor.
  - Swatches de colores interactivos directamente en la tarjeta: al hacer clic o hover en un color, cambia la foto de la tarjeta sin salir del listado.
  - Indicador de tallas disponibles y badge de descuento (%) si tiene `compareAtPrice`.
  - Botón de "Vista rápida" (modal rápido para elegir talla/color/modelo y agregar al carrito en 2 clics).

## 3. Ficha Detallada del Producto (`/tienda/[slug]`)
- **Galería de imágenes interactiva**:
  - Imagen principal de alta resolución con zoom suave al pasar el cursor y lightbox en pantalla completa al hacer clic.
  - Miniaturas clicables y soporte de navegación con teclado y swipe táctil.
  - **Sincronización automática**: al cambiar de color o de modelo, la galería cambia automáticamente a las fotos correspondientes a esa variante.
- **Selectores de variante claros y accesibles**:
  - **Modelo**: tarjetas o botones segmentados con breve descripción.
  - **Color**: swatches circulares con anillo de selección y nombre del color visible.
  - **Talla**: botones con estado activo, agotado (tachado y deshabilitado) y enlace a un **modal de Guía de Tallas** con tabla de medidas.
- **Stock y precio dinámicos**: actualiza el precio, el SKU y el estado de inventario ("En stock", "Últimas 3 unidades", "Agotado") en tiempo real según la combinación elegida.
- **Cantidad y compra**:
  - Selector `- / +` limitado al stock real de la variante elegida.
  - Botón principal "Agregar al carrito" con feedback visual inmediato y apertura opcional del `CartDrawer`.
  - Botón de compartir enlace directo con la variante preseleccionada vía query params (`?color=negro&talla=M&modelo=oversize`).
- **Acordeones informativos**: Detalles y materiales, Guía de cuidado, Envíos y retiros en la iglesia.
- **Sección de productos relacionados** al final de la página.

## 4. Carrito (`CartProvider` + `CartDrawer`) y Checkout (`/tienda/checkout`)
- Actualiza `CartProvider` para identificar cada ítem por `variantId` (de modo que la misma camiseta en talla M negra y talla L blanca aparezcan como líneas separadas).
- En `CartDrawer`: muestra miniatura de la foto del color seleccionado, nombre, chips de `Modelo · Color · Talla`, control de cantidad respetando stock máximo, subtotal, envío estimado y botón "Ir a finalizar pedido".
- Crea `/tienda/checkout` con formulario validado (Zod + React Hook Form): datos del comprador, elección entre **Retiro en la iglesia (gratis)** o **Envío a domicilio**, resumen detallado del pedido y métodos de pago (Transferencia bancaria con comprobante o pasarela configurable), dejando el guardado preparado para insertar en `orders` y `order_items` de Supabase.

## 5. Gestión de Variantes en el Panel Admin (`/admin/tienda/productos`)
- Crea una vista/formulario para crear y editar productos con:
  - Carga y reordenamiento de múltiples imágenes (asignables a un color específico).
  - Generador automático de matriz de variantes (seleccionar modelos × colores × tallas) para editar stock, SKU y precio de cada combinación en una tabla rápida.
  - Alertas visuales de bajo stock.

## 6. Requisitos de Calidad
- Funciona impecable en **modo claro y modo oscuro** con contraste WCAG AA.
- Diseño 100% responsive (móvil desde 360px, tablet y escritorio) sin desbordamiento horizontal.
- Cero errores de TypeScript (`npx tsc --noEmit`) y build de producción limpio (`npm run build`).
- Entrega los archivos completos, organizados en componentes reutilizables, y explica al final cómo conectar la pasarela de pagos y el bucket de imágenes de Supabase Storage.
