# Prompt para Claude Code: Extraer y recuperar TODO el contenido del archivo de Figma

## Contexto
Perdí el proyecto de código que estábamos construyendo. El diseño original SIGUE existiendo en Figma (lo tengo abierto en el navegador) y no quiero perder nada de lo que ya armé ahí: textos, fechas, descripciones, imágenes, tablas, diagramas, posiciones. Antes de reconstruir el sitio web, necesito que copies TODO el contenido del archivo de Figma tal cual está, sin reinterpretar, resumir, corregir ni reordenar nada.

Archivo de Figma: https://www.figma.com/design/FRjJVn7qbxAXt8Ke2naGU6/linea-de-tiempo?node-id=0-1&p=f&t=bCAnAKP7WyFzdFPW-0
File key: `FRjJVn7qbxAXt8Ke2naGU6`

## Regla más importante de esta tarea
**NO cambies nada del contenido original.** Este es un paso de extracción/respaldo, no de diseño ni de edición. Si un texto tiene una errata o una fecha parece rara, cópiala igual tal cual aparece — no la "arregles". Si algo no se entiende o un nodo está vacío, anótalo en un log en vez de inventar contenido.

## Cómo conectarte a Figma
Tienes dos formas de acceder al archivo — usa la que esté disponible en mi máquina, revisa cuál funciona primero:

**Opción A — Figma MCP (Dev Mode)**
Requiere que yo tenga la app de escritorio de Figma abierta (no solo el navegador) con "Dev Mode MCP Server" activado en Preferencias, y un seat Dev o Full. Si detectas que el servidor MCP de Figma está disponible, úsalo para leer nodos, capas y exportar imágenes directamente.

**Opción B — Figma REST API (si no tengo la app de escritorio abierta)**
Usa la API pública de Figma con un token de acceso personal:
1. Pídeme que genere un "Personal access token" en Figma (Configuración de cuenta → Security → Personal access tokens) y que te lo pase como variable de entorno `FIGMA_TOKEN`.
2. Con eso puedes hacer llamadas tipo:
   `GET https://api.figma.com/v1/files/FRjJVn7qbxAXt8Ke2naGU6` (header `X-Figma-Token: figd_TU_TOKEN_AQUI`) para obtener el árbol completo de nodos, texto, posiciones, colores y tamaños.
   `GET https://api.figma.com/v1/images/FRjJVn7qbxAXt8Ke2naGU6?ids=<node-ids>&format=png` para obtener URLs de exportación de las imágenes/frames que necesites descargar.
3. Descarga las imágenes exportadas a una carpeta local antes de tocar nada más.

Si ninguna de las dos opciones funciona, dime exactamente qué falta (token, MCP no conectado, permisos) para que lo resuelva antes de seguir.

## Qué extraer y cómo organizarlo

### 1. Recorre el archivo de forma sistemática
No saltes de un lado a otro. Recorre el canvas región por región, de izquierda a derecha (que es como está ordenado cronológicamente), y dentro de cada región de arriba hacia abajo. Antes de extraer nada, dame un primer inventario: lista de todos los frames/secciones de primer nivel que detectas (ej. "China - Dinastías", "Prehistoria", "Mesopotamia", "Egipto", "Antigua Grecia", "Antigua Roma", etc.) con su node-id, para que yo confirme que no falta ninguna sección antes de que empieces a copiar el contenido completo.

### 2. Por cada región/sección, extrae:
- **Nombre de la región** y su rango de fechas general (tal como está escrito en el frame, con el mismo formato: "AC", "753 AC", etc. — no conviertas a negativos ni reinterpretes el formato en esta fase).
- **Sub-períodos** si existen (ej. Monarquía/República/Imperio en Roma), con su nombre y fechas exactas como aparecen.
- **Cada bloque de texto**: cópialo palabra por palabra, no lo resumas ni lo parafrasees.
- **Cada imagen**: expórtala en su resolución original (sin comprimir todavía — eso es una fase aparte) y guárdala con un nombre de archivo que referencie la región y el nodo de origen (ej. `egipto_piramides-giza_node-1234.png`).
- **Tablas**: copia cada celda exactamente como está, respetando el orden de columnas y filas.
- **Diagramas** (como la pirámide social o los órdenes de columnas griegas): copia cada nivel/etiqueta en el mismo orden y jerarquía visual que tienen en Figma.
- **Links**: si hay textos con hipervínculos o notas con URLs, cópialos tal cual, no los "arregles" ni cambies el destino.
- **Posición aproximada** (coordenadas x/y del nodo en el canvas de Figma) — esto lo vamos a necesitar después para reconstruir el layout, así que guárdalo aunque no lo usemos todavía.

### 3. Formato de salida (fase de respaldo, no de sitio web todavía)
Guarda todo en JSON, un archivo por región, dentro de una carpeta `/recuperado/data/`:
```json
{
  "region": "egipto",
  "nombre_original": "Egipto",
  "fecha_texto_original": "3100 AC - 30 AC",
  "node_id_figma": "1234:5678",
  "subperiodos": [
    { "nombre": "Imperio Antiguo", "fecha_texto_original": "2686 AC", "node_id_figma": "..." }
  ],
  "bloques": [
    {
      "tipo": "texto",
      "contenido": "...(texto exacto copiado)...",
      "node_id_figma": "...",
      "posicion": { "x": 0, "y": 0 }
    },
    {
      "tipo": "imagen",
      "archivo": "egipto_piramides-giza_node-1234.png",
      "node_id_figma": "...",
      "posicion": { "x": 0, "y": 0 }
    },
    {
      "tipo": "tabla",
      "columnas": ["..."],
      "filas": [ { "etiqueta": "...", "valores": ["...", "..."] } ],
      "node_id_figma": "..."
    },
    {
      "tipo": "diagrama_jerarquico",
      "niveles": ["...", "...", "..."],
      "node_id_figma": "..."
    }
  ]
}
```
Todas las imágenes exportadas van a `/recuperado/images/original/`.

### 4. Lleva un log de la extracción
Crea `/recuperado/log-extraccion.md` donde vayas anotando, región por región: cuántos bloques de texto, imágenes, tablas y diagramas extrajiste, y cualquier cosa ambigua, rota o que no pudiste leer (por ejemplo texto oculto detrás de otro elemento, capas sin nombre, imágenes que no se pudieron exportar). Así reviso qué faltó sin tener que comparar todo a mano contra Figma.

## Orden de trabajo
1. Confírmame primero si tienes acceso al archivo (Opción A o B) antes de hacer nada más.
2. Dame el inventario de secciones de primer nivel para que yo lo confirme.
3. Extrae UNA región a la vez (empezando por la más antigua cronológicamente) y avísame cuando termines cada una, para que yo revise el JSON y las imágenes antes de que sigas con la siguiente. No proceses todo el archivo de un jalón sin pausas — es un archivo grande y prefiero revisar en partes.
4. No conviertas, optimices ni redisegnes nada todavía. Esta tarea es 100% de respaldo/extracción fiel del contenido existente. La reconstrucción del sitio web (con el pan/zoom y el sistema de diseño) la retomamos después, una vez que confirmemos que no se perdió nada del contenido original.
