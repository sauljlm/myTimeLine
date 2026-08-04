# Prompt para Claude Code: Línea del Tiempo Interactiva de la Historia de la Humanidad

## Contexto
Estoy migrando un proyecto de Figma a una página web. Es una línea del tiempo horizontal masiva de la historia de la humanidad, organizada por civilizaciones/regiones en carriles paralelos (Mesopotamia, Egipto, Grecia, Roma, China, etc.), cada uno con sub-períodos internos. Cada evento clave tiene: título, fecha, descripción corta, imágenes y links a fuentes externas. Adjunto una captura de cómo se veía en Figma — replica esa estructura visual lo más fielmente posible, pero como página web funcional con pan y zoom.

## Análisis de la referencia visual (lo que se ve en la captura de Figma)

La captura muestra un canvas horizontal ENORME (miles de píxeles de ancho) con estos patrones repetidos:

1. **Una "columna vertebral" (spine) horizontal principal** que corre por el centro del canvas: una barra delgada con el eje de tiempo, marcada con fechas ("10 000 AC", "8 000 AC", "6 000 AC", "3 000 AC"...) y subdividida en tramos de color por era (Prehistoria, Neolítico, Mesopotamia, Egipto, etc.), cada tramo con su propio color de fondo tenue (beige, azul claro, terracota).

2. **Bloques de "civilización/región"** que cuelgan de esa columna vertebral o se ubican encima/debajo, alineados por posición horizontal (=fecha). Cada bloque tiene:
   - Un **encabezado con nombre de la civilización** (ej. "Mesopotamia", "Antigua Roma", "Antigua Grecia") en texto pequeño y bold.
   - Debajo del encabezado, una **barra de sub-período** más delgada y de otro color (ej. Roma: "Monarquía" 753 AC en tono rosado/rojo, "República" 509 AC; Grecia: "Período Arcaico" 1100 AC, "Época Clásica" 480 AC, "Período Helenístico" 323 AC), cada sub-período con su propio rango de fechas mostrado como número pequeño.
   - Debajo de esas barras, **grids de imágenes en miniatura** (fotos de artefactos, mapas, estatuas, pinturas, ruinas) organizadas en filas de 2-4 columnas, todas del mismo tamaño aproximado (~90-120px), pegadas unas a otras sin mucho espacio.
   - **Bloques de texto** (párrafos cortos, 3-5 líneas) al lado o debajo de las imágenes, en fuente pequeña, para la descripción histórica de ese período.
   - Ocasionalmente, **tablas comparativas** con columnas (ej. comparación de reinos/dinastías o de aspectos: economía, religión, sociedad, arte) con encabezados en fondo de color y celdas de texto pequeño.
   - **Diagramas especiales**: por ejemplo una pirámide social jerárquica (Egipto: Faraón arriba → Nobleza/Sacerdotes → Escribas → Comerciantes/Artesanos → Campesinos/Esclavos abajo), o tarjetas comparando órdenes de columnas griegas (Dórico, Jónico, Corintio) y escultores (Praxíteles, Mirón, Policleto) con su obra representativa en miniatura arriba del nombre.
   - **Mapas pequeños** insertados junto a las imágenes para mostrar la extensión territorial de cada civilización en ese momento.

3. El layout NO es uniforme en altura: cada bloque de civilización tiene distinta cantidad de contenido, así que unos son más "altos" (más filas de imágenes) que otros. Esto se traduce en que, en la web, cada carril debe poder crecer verticalmente en su propio contenedor sin romper la alineación horizontal (temporal) con los demás carriles.

4. Hay una fila superior aparte para las **dinastías chinas** (Xia, Shang, Zhou, Qin, Han) con sus fechas, corriendo en paralelo pero separada del resto — como un carril independiente arriba de todo.

## Objetivo
Construir un sitio estático (HTML/CSS/JS vanilla, sin frameworks pesados) que funcione como un canvas infinito navegable: se puede arrastrar (pan) horizontal y verticalmente, y hacer zoom in/out con scroll o pellizco (touch), igual que en Figma o Miro — y que visualmente reproduzca la estructura de bloques descrita arriba.

## Sistema de diseño

### Colores (usar variables CSS, ajustables después)
```css
--color-fondo-canvas: #f4f3f0;       /* fondo general tipo Figma */
--color-spine: #b8a888;               /* barra de eje de tiempo principal */
--color-prehistoria: #d9d2c3;
--color-mesopotamia: #cbb994;
--color-egipto: #e0c68a;
--color-grecia: #a9c9d9;              /* azul claro, como en la referencia */
--color-roma: #c0555a;                /* rojo/terracota, como en la referencia */
--color-china: #cfd6c8;
--color-texto-principal: #2b2b2b;
--color-texto-secundario: #6b6b6b;
--color-borde-tabla: #d8d3c9;
--color-header-tabla: #ece6d8;
```

### Tipografía
- Fuente sans-serif del sistema (`-apple-system, Segoe UI, Helvetica, Arial`), tamaños pequeños en general (esto es un canvas de datos, no un blog):
  - Título de civilización: 13-14px, bold, mayúsculas o versalitas.
  - Título de sub-período: 11px, bold.
  - Fecha: 10px, monoespaciada o levemente condensada, color secundario.
  - Descripción corta: 11-12px, altura de línea 1.4, color texto principal.
  - Texto de tabla: 10-11px.

### Espaciado y tamaños de referencia
- Miniaturas de imagen en grid: 90-130px de lado, `object-fit: cover`, sin bordes redondeados (estilo "recorte de archivo", como en la captura).
- Separación entre miniaturas: 2-4px (grid apretado, casi sin gutter).
- Cada bloque de civilización: padding interno de ~12px, ancho variable según el rango de fechas que cubre (ancho = duración en años × escala de píxeles/año).

## Stack técnico
- **Next.js (App Router) + React**, TypeScript de preferencia.
- El "canvas" NO es un elemento `<canvas>` HTML nativo — es un contenedor DOM normal (`<div>`) al que le aplicamos `transform: translate(x, y) scale(z)`. Esto es necesario porque el contenido son imágenes reales, texto seleccionable y links clicables, no dibujos rasterizados.
- Para la lógica de pan/zoom, usa un hook propio (`useCanvasPanZoom`) o una librería ligera como `react-zoom-pan-pinch` — evalúa cuál te da mejor control sobre "zoom centrado en el cursor" y mejor rendimiento con cientos de imágenes; si la librería se siente limitada, implementa el hook a mano.
- Maneja el estado de posición/zoom (`x`, `y`, `scale`) con `useState`/`useReducer` en un componente cliente (`"use client"`), actualizado vía `requestAnimationFrame` para que el arrastre y el zoom se sientan fluidos y no se disparen re-renders innecesarios de React en cada pixel (usa refs + CSS transform directo sobre el DOM en vez de re-renderizar todo el árbol en cada frame; React solo debe re-renderizar cuando cambia qué contenido está en el viewport, no en cada movimiento de mouse).

## Requisitos funcionales

### 1. Canvas con pan y zoom
- Un contenedor `#canvas` con `transform: translate(x, y) scale(z)`, actualizado directamente vía ref + `requestAnimationFrame` (no vía estado de React en cada frame, para que sea fluido).
- **Pan**: arrastrar con click sostenido + mouse (o touch de un dedo). Cursor cambia a "grab"/"grabbing". También soportar scroll normal (rueda sin modificador) como pan vertical/horizontal, similar a Figma.
- **Zoom**: rueda del mouse + `Ctrl`/`Cmd` (o pellizco en touch) hace zoom centrado en la posición del cursor/dedos, no en el centro de la pantalla — esto es clave para que se sienta como Figma.
- Límites de zoom: mínimo ~0.1x (para ver todo el canvas de golpe), máximo ~4x (para leer texto de las tarjetas más pequeñas con comodidad).
- Botones fijos en una esquina: "+", "-", "Reset vista" (centra y ajusta zoom para ver todo el contenido cargado — calcular el bounding box de todos los bloques).
- Atajo de teclado: `0` para reset, `+`/`-` para zoom.
- (Fase 2, no bloqueante): minimapa en la esquina inferior derecha mostrando un resumen de todo el canvas y un rectángulo indicando el viewport actual.

### 1.1 Regla de tiempo superior — comportamiento al hacer zoom (clave)
Esto es lo que en la referencia de Figma se ve como la fila de fechas fija en la parte de arriba. Debe comportarse así:
- Es una franja `position: fixed` (o `sticky` dentro del contenedor con `overflow` controlado) pegada arriba del viewport, SIEMPRE visible, sin importar cuánto se haga pan vertical.
- Horizontalmente SÍ se mueve junto con el pan/zoom del canvas: sus marcas de fecha están calculadas con la misma fórmula de posición (`x = (año - año_minimo_global) * PIXELES_POR_ANIO * scale + offsetX`) que el resto del contenido, así que siempre queda alineada con lo que se ve debajo.
- **Densidad adaptativa de las marcas según el nivel de zoom** (esto es lo importante): a bajo zoom (viendo miles de años) la regla debe mostrar marcas cada siglo o milenio; a medida que el usuario hace zoom in, las marcas se recalculan para mostrar años individuales o décadas, para que nunca se vea ni sobrecargada de números ni vacía. Implementa esto con una función `calcularIntervaloDeMarcas(scale)` que devuelve el intervalo de años apropiado (ej. 1000, 500, 100, 50, 10, 1) según rangos de `scale`, y regenera las marcas visibles cada vez que cambia el zoom (con un pequeño debounce para no recalcular en cada micro-frame).
- Cuando el usuario suelta el zoom, la regla debe re-acomodarse con una transición suave (~150ms) en vez de saltar bruscamente.

### 2. Estructura de datos
Todo el contenido debe vivir en archivos JSON separados por región, NO hardcodeado en el HTML:

```
/data
  regions.json       (define carriles, orden, colores, rango total de fechas)
  mesopotamia.json
  egipto.json
  grecia.json
  roma.json
  china.json
```

`regions.json`:
```json
{
  "regions": [
    {
      "id": "mesopotamia",
      "nombre": "Mesopotamia",
      "orden_vertical": 1,
      "color": "var(--color-mesopotamia)",
      "fecha_inicio": -10000,
      "fecha_fin": -539
    },
    {
      "id": "roma",
      "nombre": "Antigua Roma",
      "orden_vertical": 5,
      "color": "var(--color-roma)",
      "fecha_inicio": -753,
      "fecha_fin": 476,
      "subperiodos": [
        { "nombre": "Monarquía", "fecha_inicio": -753, "fecha_fin": -509 },
        { "nombre": "República", "fecha_inicio": -509, "fecha_fin": -27 },
        { "nombre": "Imperio", "fecha_inicio": -27, "fecha_fin": 476 }
      ]
    }
  ]
}
```

Esquema de cada evento en `roma.json`, `egipto.json`, etc.:
```json
{
  "id": "piramides-giza",
  "region": "egipto",
  "titulo": "Pirámides de Giza",
  "fecha_inicio": -2560,
  "fecha_fin": null,
  "descripcion_corta": "Complejo funerario construido durante el Imperio Antiguo...",
  "imagenes": ["piramides-giza-1.webp", "piramides-giza-2.webp"],
  "links": [
    { "titulo": "UNESCO - Giza", "url": "https://..." }
  ],
  "tipo": "evento"
}
```

Para las **tablas comparativas** y **diagramas especiales** (pirámide social, órdenes de columnas), agregar un tipo de bloque distinto:
```json
{
  "id": "piramide-social-egipto",
  "region": "egipto",
  "tipo": "diagrama_jerarquico",
  "titulo": "Estructura social",
  "niveles": [
    "Faraón",
    "Nobleza y Sacerdotes",
    "Escribas",
    "Comerciantes, artesanos y soldados",
    "Campesinos y esclavos"
  ]
}
```
```json
{
  "id": "tabla-comparacion-mesopotamia",
  "region": "mesopotamia",
  "tipo": "tabla_comparativa",
  "columnas": ["Sumeria", "Acadia", "Babilonia", "Asiria", "Persia"],
  "filas": [
    { "etiqueta": "Período", "valores": ["...", "...", "...", "...", "..."] },
    { "etiqueta": "Aporte principal", "valores": ["...", "...", "...", "...", "..."] }
  ]
}
```

### 3. Layout visual (implementación de lo descrito en el análisis)
- Eje horizontal = tiempo, escala CONSISTENTE en todo el canvas (definir una constante `PIXELES_POR_ANIO`, ej. 0.8px/año, ajustable). Todos los carriles y bloques se posicionan con `left = (fecha - fecha_minima_global) * PIXELES_POR_ANIO`.
- El **spine principal** es una franja horizontal fija cerca del centro vertical del canvas, con la regla de fechas.
- Cada **región** es un carril horizontal propio, apilado verticalmente según `orden_vertical` en `regions.json`, con separación vertical suficiente para que no se encimen (calcular dinámicamente según la altura de contenido más alta de carriles vecinos, o simplemente dar un `margin-top` generoso configurable).
- Dentro de cada carril:
  1. Barra de encabezado con nombre de la región (ancho = duración total del rango de fechas de esa región).
  2. Si tiene `subperiodos`, una fila de barras más delgadas debajo, cada una posicionada y dimensionada según su propio rango de fechas, con su color.
  3. Debajo, un contenedor `flex-wrap` o CSS grid con las miniaturas de imágenes de los eventos de ese período (grid apretado, como se describe en el sistema de diseño).
  4. Al lado o debajo del grid de imágenes, el bloque de texto con la descripción.
  5. Tablas comparativas y diagramas jerárquicos se renderizan como componentes propios (no como imágenes) usando HTML/CSS real (para que el texto sea seleccionable y nítido en cualquier nivel de zoom).
- La regla de fechas superior permanece fija verticalmente en la pantalla (`position: sticky` o recalculada en cada frame) pero se desplaza horizontalmente junto con el pan, mostrando siempre las fechas correctas para lo que se está viendo.

### 4. Tarjetas de eventos e imágenes
- Miniatura de imagen + título visible siempre (sin necesidad de hacer click), igual que en la referencia (donde todo el contenido está siempre visible en el canvas, no oculto detrás de interacciones).
- Al hacer click sobre una imagen: abrir un modal/lightbox con la imagen en tamaño completo, la descripción larga (si existe) y los links.
- Los links abren en nueva pestaña (`target="_blank" rel="noopener"`).

### 5. Imágenes — rendimiento
- Todas las imágenes deben convertirse a `.webp`, comprimidas, en dos tamaños: thumbnail (~300px de ancho, para el grid) y full (~1200px de ancho, para el lightbox).
- Lazy loading real: usar `IntersectionObserver` sobre un contenedor que tenga en cuenta el `transform` del canvas (el viewport "visual" no es el viewport del navegador cuando hay zoom/pan aplicado) — calcular qué bloques están dentro del área visible transformada y solo entonces cargar sus imágenes.
- Fallback adicional con `loading="lazy"` en las etiquetas `<img>`.
- Placeholder de color sólido (o blur-up) mientras la imagen carga, para que el grid no salte de tamaño.

### 6. Estructura de carpetas sugerida
```
/index.html
/css/styles.css
/js/canvas.js         (lógica de pan/zoom)
/js/render.js          (lee los JSON y dibuja carriles/tarjetas/tablas/diagramas)
/js/data-loader.js
/js/lightbox.js
/data/regions.json
/data/*.json
/images/thumbs/*.webp
/images/full/*.webp
```

### 7. Compatibilidad
- Debe funcionar bien en desktop (mouse) y en móvil/tablet (touch), ya que planeo revisarlo desde el celular también.
- Prioriza que cargue rápido y sea fácil de mantener con archivos JSON simples, aunque el proyecto esté en Next.js/React.
- Debe degradar bien: si hay muchísimo contenido cargado (cientos de eventos), el pan/zoom no debe sentirse trabado — usar `will-change: transform`, virtualizar/no renderizar componentes React para bloques fuera del viewport, y evitar recalcular estilos o volver a renderizar todo el árbol en cada frame de arrastre.

## Primer paso que quiero que hagas
1. Crea la estructura base del proyecto (carpetas + archivos vacíos según el esquema de arriba) y define las variables CSS del sistema de diseño.
2. Implementa el motor de pan/zoom en un `index.html` mínimo.
3. Con datos ficticios, arma 2-3 carriles de ejemplo que reproduzcan el patrón completo: encabezado de región + barras de sub-período + grid de imágenes (usa placeholders grises) + bloque de texto + al menos una tabla comparativa y un diagrama jerárquico, para validar que el sistema visual se parece a la referencia de Figma.
4. Muéstrame ese resultado antes de seguir. Una vez que confirme que el pan/zoom y el estilo visual se sienten bien, seguimos cargando el contenido real región por región (yo te iré pasando el contenido de Mesopotamia, Egipto, Grecia, Roma, China, etc. según lo tenía en Figma).

No optimices imágenes reales todavía en este primer paso — usa placeholders de color sólido. Eso lo hacemos cuando empecemos a cargar contenido real.
