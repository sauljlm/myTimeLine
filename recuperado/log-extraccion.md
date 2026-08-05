# Log de extracción — Recuperación de contenido Figma

Archivo: `linea-de-tiempo` (file key `FRjJVn7qbxAXt8Ke2naGU6`)
Método de acceso: Figma REST API (Personal Access Token)

## Auditoría de completitud (posterior a las 9 regiones)

Antes de agregar contenido nuevo, se verificó programáticamente que no
faltara nada del archivo de Figma original:
- Los 95 nodos sueltos de nivel superior (Edad Media, China, Costa Rica)
  están cubiertos 1:1 contra el respaldo — 0 faltantes.
- Los 118 nodos descendientes de Prehistoria y los 224 de "Edad antigua"
  (excluyendo los 5 sub-grupos de civilización) están cubiertos — 0
  faltantes, salvo 4 nodos (`45:114`, `45:115`, `52:4`, `52:5`) que eran
  el encabezado GENERAL del grupo "Edad antigua" (barra + título + imagen
  + párrafo introductorio que engloba a las 5 civilizaciones, no propio de
  ninguna). Se agregaron como evento `edad-antigua-intro` dentro de
  `data/mesopotamia.json` (la región cronológicamente más temprana de las
  5), ya que el texto empieza justo en esa columna de fecha. La imagen
  (`52:4`) quedó pendiente de descargar — el endpoint de exportación de
  Figma volvió a quedar con rate-limit justo al intentarlo; el node id y
  la posición ya están anotados en `recuperado/data/mesopotamia.json`
  para bajarla después.
- Cada imagen y cada texto largo (>40 caracteres) de cada respaldo se
  verificó contra el JSON del sitio correspondiente — 0 imágenes y 0
  textos perdidos en la síntesis, en las 9 regiones.

## Contenido NUEVO agregado (no es extracción de Figma)

A partir de acá se agregaron ~18 eventos que **no vienen de Figma** —
son contenido histórico redactado directamente para completar temas que
el archivo original no cubría: cómo vivía la gente (vida cotidiana) y
modelo económico de cada civilización, más dos diagramas jerárquicos de
estructura social (Egipto y Roma) usando el componente que ya existía en
el sitio para ese propósito. Se agregaron a las 9 regiones:
Prehistoria, Mesopotamia, Antiguo Egipto, Antigua Roma, Imperio Persa,
Antigua Grecia, Edad Media, Dinastías chinas y Costa Rica.

Estos eventos NO tienen `node_id_figma` ni aparecen en los respaldos de
`recuperado/data/` — viven únicamente en `data/*.json`, para que quede
claro que son contenido añadido, no una extracción fiel del diseño
original.

## Expansión de Edad Media (contenido nuevo, investigado)

El usuario indicó que en Figma apenas había empezado esta sección, y
pidió una investigación a fondo para completarla. Se investigaron (vía
búsqueda web, con fuentes verificables) y se agregaron 11 eventos
nuevos que no existían ni en Figma ni en la síntesis anterior:

- Imperio Bizantino y Justiniano (527-565)
- Reconquista española (711-1492)
- Innovaciones agrícolas medievales (arado pesado, collera rígida,
  rotación de tres campos — siglo XI)
- Gran Cisma de Oriente (1054)
- Las Cruzadas (1095-1291)
- Liga Hanseática y repúblicas marítimas italianas
- Magna Carta (1215)
- Invasión mongola de Europa — batallas de Legnica y Mohi (1241)
- Gran Hambruna (1315-1317)
- Cisma de Occidente (1378-1417)
- Juana de Arco (1429-1431)

La región pasó de 16 a 27 eventos, y se mantuvo en solo 4 filas (sin
necesidad de ampliar más la escala) gracias al tramo de densidad ya
agregado antes para esta región.

## Expansión de las 8 regiones restantes (contenido nuevo, investigado)

Se repitió el mismo proceso (investigación vía búsqueda web + redacción)
para el resto del sitio:

- **Persia** (3→6 eventos): Ciro el Grande y el Cilindro de Ciro,
  Persépolis, Zoroastrismo.
- **Costa Rica** (4→6 eventos): Regiones culturales precolombinas
  (Gran Nicoya/Chorotega, Central-Caribe, Diquís), Esferas de piedra
  del Diquís (Patrimonio UNESCO).
- **Antigua Grecia** (6→9 eventos): Guerra del Peloponeso, Teatro
  griego, Alejandro Magno.
- **China** (7→8 eventos): Las Cuatro Grandes Invenciones (brújula,
  papel, imprenta, pólvora).
- **Mesopotamia** (11→15 eventos): Epopeya de Gilgamesh, Matemáticas y
  astronomía babilónicas (sistema sexagesimal), Código de Hammurabi
  (evento dedicado), Imperio Asirio (biblioteca de Asurbanipal).
- **Antiguo Egipto** (10→14 eventos): Mitología egipcia, Momificación y
  creencias sobre el más allá, Piedra de Rosetta y desciframiento de
  jeroglíficos, Cleopatra y la dinastía ptolemaica.
- **Antigua Roma** (13→17 eventos): Ley de las Doce Tablas y derecho
  romano, Julio César y las Guerras de las Galias, Ingeniería romana,
  Las legiones romanas.
- **Prehistoria** (22→23 eventos): Revolución cognitiva (ya tenía
  cobertura muy extensa, se agregó solo lo que faltaba).

**Total del sitio: de 92 a 125 eventos** (+33). Verificado: 0
solapamientos en las 9 regiones tras la expansión.

## Región: Prehistoria (node `45:113`)

**Estado: Completa.**

### Conteo de bloques extraídos
- Bloques de texto: **59**
- Imágenes: **45** (45 descargadas, 0 errores) — resolución original (URLs firmadas de S3 de Figma, sin re-render/recompresión), guardadas en `/recuperado/images/original/`
- Tablas comparativas: **0** (esta región no tiene ninguna)
- Diagramas jerárquicos: **0** (esta región no tiene ninguno)
- Barras decorativas de layout (fondo de sub-período, sin contenido): **8**

### Estructura real detectada (jerarquía de grupos en Figma)
```
Prehistoria (45:113)
├── Edad de priedra (3:13)              [sic — así está escrito en Figma, con errata; no se corrigió]
│   ├── Paleolitico (3:14) — 46 bloques directos
│   │   └── Edad de Hielo (14:66) — 9 bloques  [sub-grupo ANIDADO dentro de Paleolítico, no hermano de "Edad de piedra"]
│   ├── Mesolitico (3:15) — 9 bloques
│   └── Neolitico (3:16) — 18 bloques
├── Edad de los metales (3:17) — 24 bloques directos (incluye marcadores de Edad de cobre/bronce/hierro como barras+texto, no como grupos separados)
└── 6 bloques sueltos directamente bajo "Prehistoria" (sin sub-grupo): imágenes y textos sobre Australopithecus/Ardipithecus
```

### Observaciones / ambigüedades
1. **Errata de nombre preservada intencionalmente**: la capa se llama "Edad de **priedra**" en Figma (falta la 'e'). Se copió tal cual, sin corregir, según regla del prompt.
2. **"Edad de Hielo" está anidada dentro de "Paleolítico"**, no es un sub-período hermano de Paleolítico/Mesolítico/Neolítico. Esto es así en el archivo original de Figma, se preservó la jerarquía real.
3. **Caracteres especiales preservados tal cual** en varios textos: separadores de línea Unicode (` `) y espacios de no separación (`\xa0`) dentro de párrafos largos (ej. en los bloques de "Edad de los metales" y "Neolítico"). No se limpiaron ni normalizaron.
4. **"Edad de los metales" no tiene sub-grupos formales** en Figma para Edad de cobre/bronce/hierro — son solo pares de barra+texto sueltos (`29:91`/`29:92`, `29:95`/`29:96`, `29:98`/`29:99`) al mismo nivel que el resto de bloques de esa sección, no agrupados. Se guardaron como bloques `barra_layout` + `texto` en el orden que aparecen.
5. Ninguna capa vacía, oculta ni imagen rota detectada en esta región — las 45 imágenes exportaron correctamente.
6. No se detectaron links/hipervínculos en ningún bloque de texto de esta región.

### Archivo generado
`/recuperado/data/prehistoria.json`

## Región: Mesopotamia / "Civilización sumeria" (node `66:67`)

**Estado: Completa.**

Este grupo vive DENTRO de un grupo padre más grande "Edad antigua" (`51:2`) que
contiene, como hermanos al mismo nivel, cinco civilizaciones: `AntiguoEgipto`
(`57:30`), `Sumeria` (`66:67`, esta región), `ImperioRomano` (`53:16`),
`ImperioPersa` (`77:114`) e `Antigua Grecia` (`91:193`). Antiguo Egipto,
Imperio Romano, Imperio Persa y Antigua Grecia se recuperan como regiones
separadas en pasadas siguientes — no están en este archivo.

### Conteo de bloques extraídos
- Bloques de texto: **22** (título, 2 fechas del rango principal, 6
  nombres de subperíodo, 6 fechas de subperíodo, 1 fecha inicial de
  subperíodo duplicada en la fila inferior, 1 párrafo introductorio general,
  6 párrafos de detalle por subperíodo, 1 título "Mesopotamia" + 1 párrafo
  resumen añadidos aparte)
- Imágenes: **6** (6 descargadas, 0 errores), guardadas en
  `/recuperado/images/original/` con prefijo `mesopotamia_`
- Tablas comparativas: **0**
- Diagramas jerárquicos: **0**
- Barras decorativas de layout (fondo de fecha principal + fondo de cada
  subperíodo): **7**

### Estructura real detectada
```
Sumeria (66:67) — dentro de Edad antigua (51:2)
├── Barra principal 3500 AC – 1750 AC
├── 6 subperíodos en fila (cada uno con su propia barra + nombre + fecha):
│   Período de Uruk (3500–2900) · Período dinástico arcaico (2900–2334) ·
│   Reino de Akkad (2334–2218) · Periodo Guti (2218–2047) ·
│   Renacimiento sumerio (2047–1792) · Imperio babilónico (1792–1750)
├── 2 imágenes "hero" arriba del todo (sin subperíodo asociado por posición)
├── 1 párrafo introductorio general (sobre la civilización sumeria)
├── 6 párrafos de detalle, uno por cada subperíodo (misma columna X que su barra)
├── 4 imágenes más abajo, repartidas por posición X entre los subperíodos
│   centrales (Akkad/Guti/Renacimiento/Imperio babilónico) — la asignación
│   exacta a un subperíodo específico es ambigua por posición sola, ver
│   observación 2
└── Bloque "Mesopotamia" (título + párrafo resumen) — capa separada, IDs de
    nodo mucho más altos (141:18/141:19) que el resto (66-92), sugiere que
    se agregó después como resumen general de toda la sección
```

### Observaciones / ambigüedades
1. El nombre de capa del grupo es "Sumeria", pero el propio contenido (bloque
   141:18/141:19) lo titula "Mesopotamia" — se preservan AMBOS nombres tal
   cual aparecen, sin decidir cuál es el "correcto" (ver `nombre_original`
   con ambos).
2. Las 4 imágenes del tramo inferior (69:97, 69:98, 69:99, 69:100) están
   posicionadas entre columnas de subperíodo sin alinearse exactamente con
   ninguna — se registran con su posición X/Y real tal cual, sin forzar una
   asignación a un subperíodo específico that Figma no hace explícita.
3. No se detectaron links/hipervínculos en ningún bloque de texto de esta
   región.
4. Ninguna capa vacía, oculta ni imagen rota — las 6 imágenes exportaron
   correctamente en resolución original.

### Archivo generado
`/recuperado/data/mesopotamia.json`

## Región: Antiguo Egipto (node `57:30`)

**Estado: Completa.**

Hermano de Mesopotamia dentro de "Edad antigua" (`51:2`).

### Conteo de bloques extraídos
- Bloques de texto: **22**
- Imágenes: **25** (25 descargadas, 0 errores), guardadas en
  `/recuperado/images/original/` con prefijo `egipto_`
- Tablas comparativas: **0**
- Diagramas jerárquicos: **0**
- Barras decorativas de layout: **2** (una para "Arcaico" y una sola barra
  continua larga que cubre Antiguo+Medio+Nuevo Reino juntos — ver
  observación 1)

### Estructura real detectada
```
Antiguo Egipto (57:30) — dentro de Edad antigua (51:2)
├── Barra "Arcaico" (3150–2700 AC) — barra propia, corta
├── Barra continua única (2700 AC en adelante) con 3 etiquetas de época
│   superpuestas en su interior: Antiguo (2700–2050) · Medio (2050–1550) ·
│   Nuevo (1550–1060) — NO son 3 barras separadas, es 1 sola barra con 3
│   nombres/fechas marcados adentro
├── Por cada época (Arcaico/Antiguo/Medio/Nuevo), 1+ párrafos de texto e
│   imágenes alineadas por columna X debajo de su fecha
├── Después de "Nuevo" (1060 AC), un texto de "período de decadencia"
│   (77:115) sin nombre de sub-período propio, más 1 imagen — llega hasta
│   "31 AC" (fin de la civilización, muerte de Cleopatra)
└── Bloque final separado: texto (57:28) + imagen (57:29) sobre el fin de
    Egipto (batalla de Actium), ubicado muy a la derecha (x≈12610, lejos
    del resto) — posiblemente pensado como cierre/nota aparte
└── Además, un grupo grande de 11 imágenes sueltas (55:17 a 56:27) ubicado
    MUY por debajo del resto (y positivo, 497 a 2247, mientras el resto de
    la región vive en y negativo/cercano a 0) — una especie de galería
    general de Egipto sin columna de fecha ni texto asociado directamente
```

### Observaciones / ambigüedades
1. **La barra de fechas NO está dividida en 3 rectángulos** para
   Antiguo/Medio/Nuevo Reino como se podría esperar — es un solo rectángulo
   largo (`64:32`, node "Rectangle 10") con las 3 etiquetas de texto
   superpuestas encima. Se preservó tal cual (1 sola `barra_layout` para
   los 3), no se inventaron 3 barras separadas.
2. El bloque final (57:28 + 57:29, "batalla de Actium") está geométricamente
   muy alejado (x≈12610 vs el resto en x 2600-7400) — se preserva su
   posición real tal cual, sin moverlo, aunque temáticamente cierra la
   región.
3. Las 11 imágenes del "grupo galería" de abajo no tienen texto ni fecha
   asociada por posición — se registran con su posición real, sin forzar
   una relación con ningún sub-período.
4. No se detectaron links/hipervínculos en ningún bloque de texto de esta
   región.
5. Ninguna capa vacía, oculta ni imagen rota — las 25 imágenes exportaron
   correctamente en resolución original.

### Archivo generado
`/recuperado/data/egipto.json`

## Región: Antigua Roma / "ImperioRomano" (node `53:16`)

**Estado: Completa.** La región más grande recuperada hasta ahora.

Hermano de Egipto/Mesopotamia dentro de "Edad antigua" (`51:2`).

### Conteo de bloques extraídos
- Bloques de texto: **11** (incluye el título "Caída del imperio Romano"
  como capa de texto separada de su párrafo)
- Imágenes: **34** (34 descargadas, 0 errores), guardadas en
  `/recuperado/images/original/` con prefijo `roma_`
- Tablas comparativas: **0**
- Diagramas jerárquicos: **0**
- Barras decorativas de layout: **3** (Monarquía, República, Imperio)
- Línea decorativa (`LINE`, sin contenido): **1** (`77:119`, separador
  visual entre República e Imperio)

### Estructura real detectada
```
ImperioRomano (53:16) — dentro de Edad antigua (51:2)
├── Monarquía (753–509 AC): 1 párrafo + 4 imágenes
├── República (509–27 AC): 2 párrafos (guerras púnicas/César + ascenso de
│   Augusto — el segundo, aunque temáticamente ya habla del Imperio, está
│   posicionado por Figma DENTRO de la columna de República) + 8 imágenes
└── Imperio Romano (27 AC en adelante, con marcas de fecha internas
    27AC/33DC/69/380/476DC, SIN barras separadas para cada sub-etapa):
    ├── Dinastía Julio-Claudia (27AC–68DC): 1 párrafo + 1 imagen
    ├── Crucifixión de Cristo (33DC): 1 párrafo + 4 imágenes
    ├── Dinastía Flavia (69DC): 1 párrafo + 2 imágenes
    ├── Crisis del siglo 3 (menciona 313/325DC dentro del propio texto):
    │   1 párrafo, sin imágenes propias identificadas por columna
    ├── Cristianización (380DC): 1 párrafo + 5 imágenes
    ├── Caída del Imperio Romano (476DC): título + párrafo + 2 imágenes
    ├── Bárbaros / invasiones bárbaras: 1 párrafo + 1 imagen — UBICADO MUY
    │   LEJOS de todo lo demás (y=-1387, muy por encima del resto que vive
    │   en y entre -718 y 2021) — bloque temático aparte sobre la caída
    └── Galería general "Imperio Romano" suelta (7 imágenes, sin texto
        propio, y positivo/abajo del resto): mismo patrón que la galería
        de Egipto
```

### Observaciones / ambigüedades
1. **El bloque 119:2** ("La muerte de Julio Cesar... Augusto...") está
   posicionado por Figma dentro del rango X de la barra de "República"
   (9454–12942), aunque narrativamente ya describe el comienzo del Imperio.
   Se preservó su posición real tal cual — no se movió a la sección de
   Imperio.
2. **La barra de "Imperio Romano" es una sola barra continua** (como pasó
   con Antiguo/Medio/Nuevo en Egipto) que cubre las 6 sub-etapas
   (Julio-Claudia, Crucifixión, Flavia, Crisis del s.III, Cristianización,
   Caída) — no hay 6 barras separadas, solo marcas de fecha sueltas.
3. La fecha exacta de inicio de "Crisis del siglo 3" no está indicada por
   una marca de fecha propia en Figma — se usó el año 313 (Constantino)
   porque es el único año explícito que aparece DENTRO del propio párrafo
   copiado, sin inventar ninguna fecha nueva.
4. El bloque de "Bárbaros" (`141:22`/`141:23`) está geométricamente muy
   alejado (y=-1387) del resto de la región — se registra con su posición
   real, sin moverlo, aunque temáticamente pertenece a la caída del
   Imperio.
5. La galería general de 7 imágenes (52:8, 53:10 a 53:15) no tiene texto
   propio asociado por posición — se registra tal cual, sin forzar una
   relación con ninguna sub-etapa.
6. No se detectaron links/hipervínculos en ningún bloque de texto de esta
   región.
7. Ninguna capa vacía, oculta ni imagen rota — las 34 imágenes exportaron
   correctamente en resolución original.

### Archivo generado
`/recuperado/data/roma.json`

## Región: Imperio Persa (node `77:114`)

**Estado: Completa.** La región más chica hasta ahora.

### Conteo de bloques extraídos
- Bloques de texto: **2** (título "Imperio persa" + 1 párrafo largo)
- Imágenes: **6** (6 descargadas, 0 errores), prefijo `persia_`
- Barras decorativas: **1**
- Sin subperíodos (Figma no los marca para esta región)

### Observaciones
- **Se encontró 1 link real**: el texto "Video de los persas" (`72:113`)
  tiene un hyperlink adjunto en Figma hacia
  `https://www.youtube.com/watch?v=9B8ryYMKj9k` — primer link real
  encontrado en toda la extracción hasta ahora. Se preservó en
  `links` del evento del sitio.
- No existía como región en el sitio: se dio de alta en `regions.json`,
  `globals.css` (`--color-persia`) y `page.tsx`.

### Archivo generado
`/recuperado/data/persia.json`

## Región: Antigua Grecia (node `91:193`)

**Estado: Completa.**

### Conteo de bloques extraídos
- Bloques de texto: **27**
- Imágenes: **30** (30 descargadas, 0 errores), prefijo `grecia_`
- Barras decorativas: **5** (barra principal + 4 sub-períodos)
- Sub-períodos: **4** (Edad Oscura, Epoca Arcaica, Periodo Clasico,
  Periodo Helenistico)

### Estructura real detectada
```
Antigua Grecia (91:193) — hermana de Egipto/Mesopotamia/Roma/Persia
dentro de Edad antigua (51:2). Estructura FLAT (sin subgrupos anidados).
├── Edad Oscura (1100–776 AC): texto general + intro civilización + 2 imgs
├── Epoca Arcaica (750–499 AC): expansión + Esparta + Atenas — 18 imágenes,
│   la sección más densa de la región
├── Periodo Clasico (499–323 AC): guerras médicas + "Tierra esférica"
│   (Tales de Mileto, Eratóstenes...) — 10 imágenes
└── Periodo Helenistico (323–30 AC): Alejandro Magno + conquista romana
    — SIN imágenes asociadas por posición (no es un error de extracción,
    simplemente no hay ninguna en ese rango de X en el archivo original)
```

### Observaciones / ambigüedades
1. **Fechas de Edad Oscura y Epoca Arcaica no empalman exactamente**: la
   barra de Edad Oscura termina en "776 AC" pero la barra de Epoca Arcaica
   empieza en "750 AC" — un hueco de 26 años en los datos originales de
   Figma, no corregido (regla: no arreglar erratas/inconsistencias del
   original).
2. Dentro de Periodo Helenistico hay una marca de fecha interna "200 AC"
   (`91:165`) que NO es un sub-período con nombre propio — marca cuándo
   Roma empieza a conquistar territorio griego, mencionado también en el
   texto. Se preservó como bloque de fecha suelto, no se inventó un
   5to sub-período.
3. No existía como región en el sitio: se dio de alta en `regions.json`
   (usa el color `--color-grecia` que ya estaba reservado en
   `globals.css` desde el diseño original) y `page.tsx`.
4. No se detectaron links/hipervínculos en ningún bloque de texto de esta
   región.
5. Ninguna capa vacía, oculta ni imagen rota — las 30 imágenes exportaron
   correctamente en resolución original.

### Archivo generado
`/recuperado/data/grecia.json`

## Región: Edad Media (sin node_id de grupo — bloques sueltos)

**Estado: Completa, con una excepción anotada.**

A diferencia de todas las regiones anteriores, este contenido **no está
agrupado en un GROUP de Figma** — son ~63 bloques sueltos directamente
sobre el canvas (Page 1), identificados por estar geométricamente cerca
entre sí (x aprox. 16600–25500) y separados del resto de regiones
conocidas.

### Conteo de bloques extraídos
- Bloques de texto: **~33**
- Imágenes: **9** (9 descargadas, 0 errores), prefijo `edadmedia_`
- Barras decorativas: **6** (2 principales de sub-período + 4 barras grises
  secundarias marcando sub-eventos: Invasiones Vikingas, Reino de los
  Francos, Peste Negra/Guerra de los Cien Años, Renacimiento)
- Sub-períodos: **2** (Temprana Edad Media 476–1000, Alta Edad Media
  1000–1453)

### Observaciones / ambigüedades
1. **Un bloque no se pudo ubicar**: imagen `151:87` ("Screen Shot
   2024-09-29 at 20.59.23") está en x=-2166, muy lejos de todo el resto del
   contenido de Edad Media y de cualquier otra región. Se registró en
   `bloques_no_ubicados` del respaldo, **no se descargó ni se incluyó en
   el sitio** — no hay forma de saber a qué tema pertenece sin abrir Figma
   directamente y mirarlo.
2. Varios bloques son solo **etiquetas de fecha/título sin párrafo
   descriptivo** (Invasiones Vikingas, Fundación de universidades, Peste
   negra, Guerra de los Cien Años, Caída de Constantinopla) — a diferencia
   de otras regiones, Figma no llegó a desarrollarlos con texto largo. Se
   preservó tal cual, sin inventar contenido.
3. El texto `218:2` ("el dia que, la peste negra") está gramaticalmente
   incompleto en el propio Figma — se copió tal cual, sin corregir.
4. Un bloque suelto — "Inca, Imperio Azteca, Mayas" (`163:88`) — está muy
   por debajo del resto (y=4171 vs el resto entre y=-1604 y 1478) y sin
   fecha ni texto asociado cercano. Se preservó en el respaldo pero **no
   se incluyó como evento en el sitio** (no hay fecha con la que ubicarlo
   sin inventar una).
5. Región nueva, no existía en el sitio: se dio de alta en `regions.json`,
   `globals.css` (`--color-edad-media`, usando el mismo color naranja
   `#ce9642` que las barras originales en Figma) y `page.tsx`.
6. No se detectaron links/hipervínculos en ningún bloque de texto de esta
   región.

### Archivo generado
`/recuperado/data/edad-media.json`

## Región: Dinastías chinas / Asia Oriental (sin node_id de grupo)

**Estado: Completa.** La región más simple de todas.

Igual que Edad Media, son bloques sueltos sin GROUP contenedor. A
diferencia de todo lo demás, geométricamente está muy por encima
(y=-5429) de cualquier otro contenido — coincide exactamente con lo que
describía el prompt de diseño original: "una fila superior aparte para
las dinastías chinas... como un carril independiente arriba de todo". Por
eso se le dio `orden_vertical: -1` (arriba de Prehistoria).

### Conteo de bloques extraídos
- Bloques de texto: **14** (2 etiquetas de categoría "Asia Oriental"/"Era
  Imperial" + 5 nombres de dinastía + 7 fechas)
- Imágenes: **0** — Figma no tiene ninguna para esta sección
- Barras decorativas: **5** (una por dinastía)
- Sub-períodos/dinastías: **5** (Xia, Shang, Zhou, Qin, Han)

### Observaciones
1. Sin párrafos de texto ni imágenes en absoluto — solo nombres y fechas.
   Se preservó tal cual, sin inventar descripciones.
2. Hay un hueco real de 35 años entre el fin de la Dinastía Zhou (256 AC)
   y el inicio de la Dinastía Qin (221 AC) en los propios datos de Figma
   — coincide con la historia real (fin nominal de Zhou vs. unificación
   de China por Qin Shi Huang), no se corrigió.
3. Región nueva: se dio de alta en `regions.json` (usa
   `--color-china`, que ya estaba reservado en `globals.css` desde el
   diseño original) y `page.tsx`.

### Archivo generado
`/recuperado/data/china.json`

## Región: Costa Rica (sin node_id de grupo)

**Estado: Completa.** Última sección del archivo — la más chica de toda la
extracción.

### Conteo de bloques extraídos
- Bloques de texto: **9**
- Imágenes: **0** — no hay ninguna en esta sección
- Barras decorativas: **2**
- Sub-períodos: **2** (Primeros humanos en CR, Primeras sociedades
  casicales)

### Observaciones / ambigüedades
1. El texto `278:12` ("Primeros humanos en CR entre el 10 000 y 7000 AC.
   Eran Nomadas, recolectores...") termina literalmente en "..." en el
   propio Figma — no es un truncamiento de la extracción, se copió tal
   cual.
2. **La barra decorativa de "Primeros humanos en CR" (`278:2`) es mucho
   más ancha que el rango de fechas que el propio texto describe**: la
   barra se extiende visualmente hasta x=10394 (chocando con el inicio de
   la siguiente barra), pero el texto explícitamente dice "entre el 10 000
   y 7000 AC" y la etiqueta de fecha "7000 AC" está mucho antes en esa
   barra (x=1229). Para el sitio se usó el rango de fechas indicado en el
   texto (10 000–7000 AC), no el ancho visual de la barra, ya que el
   propio texto es más específico/autoritativo que una barra decorativa.
3. No se detectaron links/hipervínculos en ningún bloque de texto.
4. Región nueva: se dio de alta en `regions.json`, `globals.css`
   (`--color-costa-rica`, color nuevo ya que no estaba reservado en el
   diseño original) y `page.tsx`.

### Archivo generado
`/recuperado/data/costa-rica.json`

---

## Extracción completa

Con esta región termina la recuperación fiel de **todo** el contenido
detectado en el archivo de Figma `linea-de-tiempo` (9 secciones en
total): Prehistoria, Mesopotamia, Antiguo Egipto, Antigua Roma, Imperio
Persa, Antigua Grecia, Edad Media, Dinastías chinas, y Costa Rica. Los
únicos dos bloques que quedaron sin ubicar en el sitio (documentados, no
inventados) son la imagen suelta `151:87` y el texto "Inca, Imperio
Azteca, Mayas" (`163:88`), ambos en la sección de Edad Media — ver esa
sección más arriba para el detalle.
