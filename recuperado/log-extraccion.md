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

## Ajuste de densidad de Edad Media + imágenes nuevas

El usuario pidió que la sección de Edad Media quedara "justo en la
línea" (la mayoría de los eventos en la fila principal, no apiladas en
filas extra) y que se agregaran imágenes donde no había ninguna.

**Densidad — primer intento (descartado)**: se subió `pxPorAnio` del
tramo 0–1524 años de antigüedad completo (el que cubre 476–2000 DC,
donde vive toda la Edad Media) en `src/lib/timeScale.ts`, probando
incrementalmente 9 → 18 → 30 → 45 px/año parejo para toda la franja. En
45 quedaron 23 de los 27 eventos en la fila principal, pero el usuario
pidió revertirlo: subir la densidad pareja para TODA la franja también
ensanchaba de más los huecos que ya cabían bien con la densidad base
(4px/año), solo para poder separar los pares de eventos realmente
cercanos en el tiempo — igual que ya había pasado antes con el intento
fallido de subir la densidad pareja para todo el Imperio Romano.

**Densidad — enfoque final**: se revirtió `pxPorAnio` a 4 (el valor
original, ya commiteado) y en su lugar se subdividió ese único tramo en
26 tramos angostos, uno entre cada par de eventos consecutivos. La
mayoría queda en 4px/año (densidad base, igual que "antes"); solo los
tramos que caen justo entre dos eventos con pocos años de diferencia
suben la densidad lo necesario para que ambos quepan en la misma fila
(240px de ancho de tarjeta + 24px de `GAP_HORIZONTAL_MIN` en
`layout.ts` = 264px mínimos entre el inicio de dos tarjetas
consecutivas). Además, dos eventos sin fecha histórica real
("Cómo vivía la gente" y "Modelo económico", ambos redactados por mí
como contenido nuevo con fecha arbitraria 850) se separaron a 840 y 860
— al no representar un evento puntual real no hay problema en mover la
fecha unos años, a diferencia de fechas históricas documentadas.

Resultado: **26 de los 27 eventos caben en la fila principal** (antes
solo 23), con un ancho total del tramo de ~9400px en vez de los ~68 500
que hubiera dado subir parejo a 45px/año. El único par que sigue en una
fila aparte es "Fundación de universidades" y "Perfeccionamiento de
castillos", que comparten el mismo año exacto (1100) — ningún valor de
densidad puede separar dos eventos con la misma fecha, y al ser ambos
hechos históricos reales no se les movió la fecha solo por estética de
layout. 0 solapamientos verificado en las 9 regiones tras el cambio;
vista "Reset" sigue ajustando todo el timeline (5%, sin tocar el zoom
mínimo).

**Imágenes nuevas**: se identificaron 21 eventos de Edad Media con
`"imagenes": []` (11 de la investigación agregada en la sección
anterior, más 10 que venían de Figma pero nunca tuvieron imagen
asignada: inicios, reino de los francos, invasiones vikingas, guerra de
los cien años, peste negra, caída de Constantinopla, colón descubre
américa, y los 3 eventos "vida cotidiana"/"modelo económico" agregados
antes). Para cada uno se buscó una imagen apropiada en Wikimedia
Commons (usando la imagen principal del artículo correspondiente de
Wikipedia en inglés cuando existía, o búsqueda directa en Commons),
priorizando dominio público o CC BY-SA, descargada, redimensionada a un
máximo de 1600px de ancho y recomprimida (algunas fuentes originales
pesaban hasta 77MB). Las 21 imágenes están en
`public/images/edad-media/` y `recuperado/images/original/` con el
sufijo `_wikimedia` en el nombre (en vez de `_node-XX-YY`, para dejar
claro que no vienen de Figma). Fuente y licencia de cada una:

- `edadmedia-inicios`: "Europe at the fall of the Western Roman Empire
  in 476" — CC BY-SA 3.0.
- `edadmedia-reino-de-los-francos`: "The Baptism of Clovis" (Alaux) —
  dominio público.
- `edadmedia-imperio-bizantino`: "Hagia Sophia Interior Panorama" — CC
  BY-SA 3.0.
- `edadmedia-reconquista-espanola`: "Cantigas battle" — dominio
  público.
- `edadmedia-invasiones-vikingas`: "Osebergskipet 2016" (barco vikingo
  de Oseberg) — CC BY-SA 4.0.
- `edadmedia-vida-cotidiana`: "Reeve and Serfs" (Luttrell Psalter) —
  dominio público.
- `edadmedia-modelo-economico`: "Les Très Riches Heures du duc de Berry
  — mars" — dominio público.
- `edadmedia-innovaciones-agricolas`: "Three Field System" (diagrama
  SVG) — CC BY-SA 4.0.
- `edadmedia-gran-cisma-de-oriente`: "Great Schism with former borders
  (1054)" — CC BY-SA 3.0.
- `edadmedia-cruzadas`: "The Siege of Jerusalem (1099), Part of the
  First Crusade" — dominio público.
- `edadmedia-fundacion-universidades`: "Laurentius de Voltolina 001"
  (clase medieval en Bolonia) — dominio público.
- `edadmedia-liga-hanseatica`: "Ausbreitung der Hanse um das Jahr 1400"
  (mapa) — CC BY-SA 3.0.
- `edadmedia-magna-carta`: "Magna Carta (British Library Cotton MS
  Augustus II.106)" — dominio público.
- `edadmedia-invasion-mongola`: "1236-1242 Mongol invasions of Europe"
  (mapa) — CC BY-SA 4.0.
- `edadmedia-gran-hambruna`: "Great famine" — dominio público.
- `edadmedia-guerra-de-los-cien-anios`: "Schlacht von Azincourt" —
  dominio público.
- `edadmedia-peste-negra`: "Burying Plague Victims of Tournai" (crónica
  de Gilles Li Muisis, 1353) — dominio público.
- `edadmedia-cisma-de-occidente`: "Grandes Chroniques de Frances de
  Charles V" (clérigos disputando) — dominio público.
- `edadmedia-juana-de-arco`: "Joan of Arc miniature graded" (dibujo de
  Clément de Fauquembergue, 1429 — única imagen conocida hecha en vida
  de Juana de Arco) — dominio público.
- `edadmedia-caida-de-constantinopla`: "The Entry of Mahomet II into
  Constantinople" (Benjamin-Constant, 1876) — dominio público.
- `edadmedia-colon-descubre-america`: "Columbus Landing at Guanahani,
  1492" (Vanderlyn) — dominio público.

Al igual que el resto del contenido nuevo, estos eventos y sus imágenes
no tienen `node_id_figma` — no son extracción de Figma.

## Nueva región: Última Era de Hielo (contenido nuevo, investigado)

El usuario notó que ya existía un único bloque sobre la glaciación
(`prehistoria-edad-de-hielo-10`, extraído de Figma, fecha -127000)
mezclado dentro de la fila de Prehistoria, y pidió que la Era de Hielo
tuviera su propia línea/carril, ya que como evento cubre unos 100 000
años por sí sola.

**Reubicación**: se sacó `prehistoria-edad-de-hielo-10` de
`data/prehistoria.json` (quedó en 22 eventos) y se movió, sin tocar su
texto ni sus imágenes originales de Figma, a un archivo nuevo
`data/era-de-hielo.json` (campo `region` actualizado de `prehistoria` a
`era-de-hielo`). Ese texto ya traído de Figma es algo ambiguo — dice
explícitamente que "no fue una edad de hielo... sino un período de
enfriamiento climático", lo cual no encaja del todo con sus propias
imágenes (mamut lanudo, perezoso gigante) ni con la fecha -127000 (que
sí cae dentro del último período glacial real). Se dejó tal cual porque
es contenido genuino de Figma, no se reescribió.

**Nueva región**: se dio de alta `era-de-hielo` en `regions.json`
(`orden_vertical: 0.5`, entre Prehistoria y Mesopotamia), con color
nuevo `--color-era-de-hielo` en `globals.css`, y se importó en
`page.tsx`. Se investigaron (vía búsqueda web, con fuentes verificables)
y se agregaron 9 eventos nuevos que cubren el último período glacial
completo (-115 000 a -11 600):

- Inicio del último período glacial (Würm/Weichseliano, -115 000)
- Megafauna del Pleistoceno (mamuts, tigres dientes de sable,
  perezosos gigantes)
- Cómo vivía la gente (adaptación al frío, refugios de huesos de
  mamut de Mezhirich)
- Arte rupestre: cueva Chauvet (-36 000)
- Formación del puente de Beringia (-35 700, según estudio reciente
  que revisó la fecha tradicional)
- Último Máximo Glacial (-24 000, pico de -26 500 a -19 000)
- Migración humana hacia América vía Beringia (-18 000)
- Arte rupestre: cueva de Lascaux (-15 000)
- Younger Dryas y fin del período glacial (-11 600, inicio del
  Holoceno)

**Imágenes**: los 9 eventos nuevos se ilustraron con imágenes de
Wikimedia Commons (mismo criterio que en la expansión de Edad Media:
dominio público o CC BY-SA/CC BY, imagen principal del artículo de
Wikipedia en inglés cuando existía), descargadas a
`public/images/era-de-hielo/` y `recuperado/images/original/` con el
sufijo `_wikimedia`. El evento heredado de Figma conservó sus 6
imágenes originales.

Total del sitio: 10 regiones, 134 eventos. Verificado en el navegador:
0 solapamientos en las 10 regiones, la nueva línea de Era de Hielo
aparece correctamente entre Prehistoria y Mesopotamia, y la vista
"Reset" sigue ajustando todo el timeline sin tocar el zoom mínimo (las
fechas de esta región caen en la zona logarítmica profunda de
`timeScale.ts`, la misma que ya usa el resto de Prehistoria antigua, así
que no hizo falta ningún tramo lineal nuevo).

## Corrección: bloques de Antigua Grecia que se habían fusionado

El usuario revisó el sitio contra el Figma y notó que la región de
Grecia se veía muy distinta al diseño original — varios bloques de
texto independientes habían quedado fusionados en un solo párrafo
gigante dentro de las 4 tarjetas de subperíodo, en vez de ser tarjetas
propias. Al revisar `recuperado/data/grecia.json` (el respaldo fiel de
la extracción original) contra `data/grecia.json`, se confirmó: de 62
bloques originales de Figma, solo 4 tarjetas de evento habían quedado
en el sitio — perdiendo la separación real entre "Esparta", "Atenas",
"Tierra esférica" (Tales de Mileto y la forma de la Tierra), el
"Legado cultural griego" y la "Conquista romana de Grecia", que en
Figma eran bloques de texto propios (con su propio `node_id_figma`,
en algunos casos con título explícito como "Esparta" o "Atenas") y no
parte del párrafo de su subperíodo.

**Corrección aplicada**: se reconstruyó `data/grecia.json` separando
cada bloque de texto de Figma en su propia tarjeta, usando la posición
X/Y real de cada bloque (columna = subperíodo, fila = orden dentro de
esa columna) para decidir a qué tarjeta pertenece cada uno de los 30
bloques de imagen — igual criterio que ya se documentó como ambiguo en
la sección original de Mesopotamia (posición sola no siempre basta,
así que se usó también el contenido de la imagen cuando el nombre de
archivo lo dejaba claro, ej. la imagen "redondez-1" se asignó a "Tierra
esférica" aunque su columna X cayera técnicamente del lado de "Periodo
Clásico"). El texto de cada bloque se preservó tal cual estaba en
Figma (typos incluidos, como en el resto del proyecto), salvo un caso:
el nodo `91:166` (Conquista romana) contenía un fragmento duplicado
pegado al inicio ("Este es el último periodo, Alejandro Magno eredó de
su padre una grecia derrotada pero acabó sometiendo al..." repetido
antes del texto real sobre los romanos) — un artefacto de copiado
dentro del propio Figma, no un error de la extracción; se eliminó solo
esa repetición literal.

Tarjetas nuevas creadas (antes mezcladas dentro de las 4 originales):
`grecia-legado-cultural`, `grecia-esparta`, `grecia-atenas`,
`grecia-tierra-esferica`, `grecia-conquista-romana`. Los 30 bloques de
imagen se redistribuyeron entre las 9 tarjetas de Figma (0 duplicados,
0 perdidos, verificado programáticamente). La región pasó de 9 a 14
eventos (5 nuevos, más los 5 ya agregados antes por investigación:
Guerra del Peloponeso, Teatro griego, Alejandro Magno, Cómo vivía la
gente, Modelo económico). 0 solapamientos verificado en el navegador
tras el cambio.

## Ampliación de espacio de Grecia (mismo criterio que Edad Media)

Tras separar los bloques fusionados (ver sección anterior), Grecia pasó
a tener 6 filas en vez de 1: con solo 3px/año (la densidad pareja de la
franja -1100/-27 AC compartida con la República romana) las 14 tarjetas
nuevas no cabían todas en la línea principal. El usuario pidió ampliar
"lo necesario pero no de más", mismo criterio ya usado con Edad Media:
nada de subir la densidad pareja para toda la franja (eso ensancharía
también los huecos que ya cabían bien).

Se subdividió el tramo 2027–3100 años de antigüedad (-27 AC a -1100 AC)
de `timeScale.ts` en 14 tramos angostos: la mayoría se quedó en 3px/año
(igual que antes), y solo los que caen entre dos eventos de Grecia muy
cercanos en el tiempo subieron lo necesario para que quepan en la misma
fila (240px de tarjeta + 24px de `GAP_HORIZONTAL_MIN` = 264px mínimos).
El caso más extremo es "Teatro griego" (-500) y "Periodo Clásico"
(-499), a solo 1 año de diferencia — ahí el tramo sube a 270px/año, pero
como el tramo dura un solo año el costo real es de apenas 270px extra
de ancho total, no una franja ancha cara. También se separaron por 8
años las fechas de "Cómo vivía la gente" y "Modelo económico" (ambas
estaban en -450, sin fecha histórica real, redactadas por mí — mismo
caso ya resuelto en Edad Media).

Resultado: **14 de 14 eventos caben en la fila principal** (antes
ninguna fila tenía las 14). Ancho añadido a esa franja: ~1700px (de
3219px a 4920px), nada comparado con lo que costaría subir parejo a
270px/año en los 1073 años de la franja. 0 solapamientos verificado en
las 10 regiones tras el cambio; vista "Reset" sigue ajustando todo el
timeline sin tocar el zoom mínimo.

## "Cómo vivía la gente" / "Modelo económico" por subperíodo + imágenes

El usuario señaló que "Cómo vivía la gente" y "Modelo económico" no
deberían ser una sola tarjeta genérica flotando en una fecha
arbitraria, tratada como si fuera un acontecimiento puntual — deberían
ir dentro de cada subperíodo, agregándose de nuevo solo si el
contenido realmente cambia de un subperíodo al siguiente. También pidió
agregar imágenes a los bloques que seguían sin ninguna.

**Restructuración**: las 2 tarjetas genéricas de Grecia (dedicadas a
todo el rango -1100/-30 de una vez) se reemplazaron por una pareja
"Cómo vivía la gente" + "Modelo económico" en cada uno de los 4
subperíodos (Edad Oscura, Época Arcaica, Periodo Clásico, Periodo
Helenístico), con contenido investigado y realmente distinto en cada
caso — no una copia con el título cambiado:
- **Edad Oscura**: sociedad dispersa post-colapso micénico, sin
  escritura, economía de subsistencia sin moneda.
- **Época Arcaica**: nace la polis y la identidad cívica, se
  reintroduce la escritura, primeras monedas (adoptadas de Lidia),
  colonización con fines económicos, reformas de Solón.
- **Periodo Clásico**: contenido que ya existía (paideia/agogé,
  symposio, comercio marítimo, minas de Laurión, esclavitud) — se
  mantuvo tal cual, solo se le agregó "(Periodo Clásico)" al título y
  se renombró el id para que quede claro a qué subperíodo pertenece.
- **Periodo Helenístico**: mundo cosmopolita tras Alejandro, koiné
  como lengua franca, declive de la polis frente a las monarquías,
  nuevas redes comerciales y ciudades como Alejandría.

Título de cada tarjeta incluye el subperíodo entre paréntesis (ej.
"Cómo vivía la gente (Época Arcaica)") para que quede claro en el
sitio a qué momento corresponde, ya que ahora hay 4 versions de cada
tema en la misma región.

**Imágenes**: se identificaron 14 bloques de Grecia sin ninguna imagen
(las 6 tarjetas nuevas de vida cotidiana/modelo económico, más 8 que ya
existían sin imagen: Edad Oscura, Teatro griego, Guerra del
Peloponeso, Alejandro Magno, Periodo Helenístico, Conquista romana, y
las 2 tarjetas de Periodo Clásico ya existentes). Se buscó una imagen
apropiada en Wikimedia Commons para cada una (mismo criterio que en
Edad Media y Era de Hielo: dominio público o CC BY-SA/CC BY,
descargadas a `public/images/grecia/` y `recuperado/images/original/`
con sufijo `_wikimedia`, redimensionadas a máx. 1600px).

**Reajuste de densidad**: al pasar de 14 a 20 eventos, la región volvió
a tener varias filas (15/20 en la principal). Se recalculó el mismo
esquema de tramos angostos de `timeScale.ts` para las nuevas fechas —
mismo criterio de siempre, solo ampliar donde los nuevos eventos caen
cerca de uno ya existente. Resultado: **20 de 20 eventos en la fila
principal**, ancho de la franja 2027–3100 de 4920px a 6182px (+1262px).
0 solapamientos verificado en las 10 regiones (138 eventos en total);
"Reset" sigue ajustando todo el timeline al 5%.

## Corrección: "vida cotidiana"/"modelo económico" no son eventos propios

El usuario aclaró que el enfoque anterior seguía sin ser correcto:
"Cómo vivía la gente" y "Modelo económico" no deberían ser tarjetas
independientes con su propia fecha en la línea de tiempo (ni siquiera
una por subperíodo) — son contenido descriptivo DEL período, así que
deben vivir dentro de la tarjeta del período mismo, no al lado de ella
como si fueran un acontecimiento puntual.

**Fusión aplicada**: se tomó el texto de cada una de las 8 tarjetas
"Cómo vivía la gente (X)" / "Modelo económico (X)" (con su propio
título como encabezado, ej. "Cómo vivía la gente\n\n[texto]") y se
concatenó al final de la `descripcion_corta` de la tarjeta del
subperíodo correspondiente (`grecia-edad-oscura`, `grecia-epoca-
arcaica`, `grecia-periodo-clasico`, `grecia-periodo-helenistico`). Las
imágenes de cada una de las 8 tarjetas se movieron al arreglo
`imagenes` de la tarjeta del período (mismo orden: imágenes propias del
período primero, luego vida cotidiana, luego modelo económico). Las 8
tarjetas standalone se eliminaron del archivo.

Grecia pasó de 20 a 12 eventos (0 imágenes ni texto perdidos —
verificado programáticamente, solo reubicados). Con menos eventos, se
recalculó otra vez el esquema de tramos angostos de `timeScale.ts`: el
ancho de la franja 2027–3100 bajó de 6182px a 4379px (los tramos que
existían solo para separar las tarjetas ahora eliminadas ya no hacían
falta). 0 solapamientos verificado en las 10 regiones (130 eventos en
total); "Reset" sigue ajustando todo el timeline al 5%.

## Mismo criterio aplicado a Antigua Roma

El usuario pidió aplicar las mismas dos correcciones a Roma: (1) que
"cómo vivía la gente"/"modelo económico" sean parte del período en vez
de un hecho histórico aparte, y (2) agregar imágenes donde faltaban.

Roma tiene 3 subperíodos (`regions.json`): Monarquía (-753/-509),
República (-509/-27) e Imperio (-27/476). A diferencia de Grecia,
Monarquía y República ya tenían su propia tarjeta-resumen del período
(`roma-monarquia`, `roma-republica`, ambas de Figma) — Imperio no tenía
una tarjeta equivalente, así que se usó `roma-imperio-galeria`
("Imperio Romano — más imágenes"), que ya existía con `descripcion_corta`
vacía y solo servía de repositorio de imágenes sueltas de Figma sin
texto propio, el lugar más natural para representar el período.

**Fusión**: el texto de las 2 tarjetas genéricas existentes
(`roma-vida-cotidiana`, `roma-modelo-economico`, ambas fechadas en 100,
con contenido ya específico del Imperio: insulae, pan y circo,
latifundios, denario) se movió tal cual, con sus títulos como
encabezado, a la `descripcion_corta` de `roma-imperio-galeria` — le dio
a esa tarjeta un texto real por primera vez. Para Monarquía y República
se redactó contenido nuevo y genuinamente distinto (no una copia con
otro título): sociedad de clanes y ausencia de moneda en la Monarquía
vs. Conflicto de los Órdenes y expansión territorial con esclavitud en
la República. Las 2 tarjetas genéricas originales se eliminaron.

**Imágenes**: se identificaron 11 bloques de Roma sin imagen: 5 tarjetas
que ya existían sin ninguna (Ley de las Doce Tablas, Ingeniería romana,
Las legiones, Julio César y las Galias, Crisis del siglo 3) más 6 para
el contenido de vida cotidiana/modelo económico recién fusionado (2 por
período). Se buscaron en Wikimedia Commons con el mismo criterio de
siempre y se agregaron a `public/images/roma/` y
`recuperado/images/original/` con sufijo `_wikimedia`. La imagen de la
Ley de las Doce Tablas vino originalmente como SVG de 5.1MB (un grabado
escaneado vectorizado con miles de paths, no un diagrama simple) — se
rasterizó a JPEG (670KB) por consistencia y peso con el resto del sitio.

Roma pasó de 17 a 15 eventos (17 − 2 genéricas eliminadas = 15; ningún
texto ni imagen se perdió, solo se reubicaron). 0 solapamientos
verificado en las 10 regiones (135 eventos en total). Roma quedó con 4
filas en su carril, resultado de fechas aproximadas ya existentes como
"Ingeniería romana" y "Las legiones" (ambas en -100, sin fecha puntual
real).

## Ampliación de espacio de Roma (mismo criterio, con una particularidad)

El usuario pidió ampliar el espacio de Roma para que todo quepa en la
fila principal, mismo criterio de siempre (solo ampliar donde haga
falta). Primero se separaron "Ingeniería romana" y "Las legiones" a
-105/-95 (ambas sin fecha histórica real, igual que los casos ya
resueltos en Edad Media y Grecia) — el otro par que comparte fecha
exacta, "Caída del imperio Romano" y "Bárbaros" (ambas en 476, la fecha
tradicional de la caída de Roma), sí son hechos históricos reales y no
se tocaron.

**Particularidad**: el rango de fechas de Roma cruza DOS tramos de
`timeScale.ts`, y uno de ellos (2027–3100 años de antigüedad, -1100 AC
a -27 AC) ya estaba subdividido en tramos angostos hechos a medida para
Antigua Grecia, porque la Monarquía y República de Roma caen en el
mismo rango de años que toda Grecia. En vez de tratar ambas regiones
por separado (lo que podría pisar los límites ya afinados de Grecia),
se recalcularon los límites de ESE tramo combinando las fechas de las
dos regiones a la vez, y también se subdividió el otro tramo (1524–2027,
-27 AC a 476 DC, todo el Imperio) de la misma manera.

Resultado: **14 de los 15 eventos de Roma caben en la fila principal**
(antes ninguna fila tenía más de la mitad). El único que sigue aparte
es "Bárbaros. Invasiones bárbaras", que comparte el año exacto 476 con
"Caída del imperio Romano" — no se le movió la fecha por la misma razón
de siempre. Ancho añadido: +282px en el tramo del Imperio (2515→2797px)
y +1407px en el tramo compartido con Grecia (4379→5786px). 0
solapamientos verificado en las 10 regiones tras el cambio; "Reset"
sigue ajustando todo el timeline al 5%, sin tocar el zoom mínimo.

## Investigación y expansión de Antiguo Egipto (contenido nuevo)

El usuario notó que la línea de Egipto se veía muy vacía y pidió una
investigación a fondo con imágenes, igual que se hizo antes con Edad
Media y Era de Hielo.

**Restructuración previa**: siguiendo el mismo criterio ya aplicado a
Grecia y Roma, "Cómo vivía la gente" y "Modelo económico" (antes
tarjetas genéricas sueltas fechadas en -2600) se fusionaron dentro de
la tarjeta del primer período (`egipto-arcaico`), ya que a diferencia
de Grecia la vida cotidiana egipcia se mantuvo notablemente estable a
lo largo de los ~3000 años de la civilización faraónica (el propio
criterio del usuario: "si en el segundo periodo no cambia no se agrega
de nuevo") — no había justificación para crear una versión por
período como en Grecia.

**Contenido nuevo investigado** (vía búsqueda web, con fuentes
verificables): se agregaron 7 eventos que no existían ni en Figma ni en
la síntesis anterior, cubriendo temas mencionados solo de pasada o
ausentes del todo:

- La escritura jeroglífica (-3200): sistema de escritura, escribas,
  formas cursivas hierática y demótica.
- Las grandes pirámides de Guiza (-2560): Keops/Kefrén/Micerino, la
  Gran Esfinge, desmentido del mito de los esclavos constructores.
- Hatshepsut, la mujer faraón (-1479/-1458): una de las pocas mujeres
  en gobernar Egipto con pleno poder, la expedición a Punt.
- Akenatón y la revolución de Amarna (-1353/-1336): el monoteísmo del
  culto a Atón, la nueva capital Ajetatón, el arte de Amarna.
- Tutankamón y el hallazgo de 1922 (-1332/-1323): el ADN que reveló su
  parentesco, el descubrimiento de Howard Carter, la "maldición".
- Ramsés II y la batalla de Qadesh (-1274): la mayor batalla de carros
  de la Antigüedad y el tratado de paz más antiguo conservado (-1258).
- La invasión de los Pueblos del Mar (-1177): el colapso de la Edad
  del Bronce y el principio del fin del Imperio Nuevo.

Egipto pasó de 14 a 19 eventos.

**Imágenes**: se identificaron 13 bloques sin imagen (11 que ya
existían: mitología, momificación, piedra de Rosetta, Cleopatra, más
los 7 eventos nuevos y las 2 imágenes para el contenido fusionado de
Arcaico). Se buscaron en Wikimedia Commons con el mismo criterio de
siempre (dominio público o CC, imagen principal del artículo de
Wikipedia en inglés cuando existía) y se agregaron a
`public/images/egipto/` y `recuperado/images/original/` con sufijo
`_wikimedia`. Quedaron 0 bloques de tipo evento sin imagen en toda la
región.

**Ampliación de espacio**: al agregar contenido nuevo, Egipto pasó a
tener varias filas. El tramo 3100–6000 años de antigüedad de
`timeScale.ts` (-4000 AC a -1100 AC) es compartido por Mesopotamia,
Egipto y Persia, así que se recalcularon sus límites combinando las
fechas de las 3 regiones (mismo criterio que con el tramo compartido
de Grecia/Roma). También se separaron por 20 años "Mitología egipcia" y
"Momificación" (ambas en -2600 sin fecha histórica real, coincidiendo
además con el diagrama de estructura social) — mismo caso ya resuelto
varias veces antes.

Resultado: **19 de los 19 eventos de Egipto caben en la fila
principal**. Ancho añadido al tramo compartido: +3386px (5800px→9186px)
sobre una franja de 2900 años, nada comparado con lo que costaría subir
la densidad pareja para todo el tramo. Mesopotamia y Persia mantuvieron
sus filas extra tal como estaban (no se tocaron sus fechas ni se les
pidió arreglarlas esta vez). 0 solapamientos verificado en las 10
regiones (141 eventos en total); "Reset" sigue ajustando todo el
timeline al 5%.

## Segunda pasada de investigación: 4 descubrimientos/eventos más de Egipto

El usuario preguntó directamente si no faltaban más acontecimientos o
descubrimientos de Egipto. Tras revisar (vía búsqueda web, con fuentes
verificables) qué temas importantes seguían sin cobertura, se
identificaron y agregaron 4 eventos más, genuinamente ausentes hasta
ahora:

- La dinastía kushita, los "faraones negros" (-744/-656): la dinastía
  XXV, reyes nubios de Kush que conquistaron y gobernaron Egipto,
  presentándose como restauradores de la tradición egipcia más antigua
  y construyendo sus propias pirámides en Nubia.
- La conquista persa de Egipto (-525): Cambises II derrota a Psamético
  III en Pelusio, Egipto se convierte en satrapía persa.
- El calendario egipcio (-2900): uno de los primeros calendarios
  solares de la historia (365 días, 12 meses + 5 días adicionales),
  antecesor lejano del calendario juliano y, por extensión, del
  gregoriano.
- La huelga de Deir el-Medina (-1157): el primer paro laboral
  documentado de la historia, protagonizado por los artesanos que
  excavaban las tumbas del Valle de los Reyes.

Egipto pasó de 19 a 23 eventos. Se buscaron imágenes en Wikimedia
Commons para los 4 (mismo criterio de siempre) — 0 bloques sin imagen
en toda la región.

**Ampliación de espacio (segunda ronda)**: las nuevas fechas de Egipto
(-744 y -525) cayeron en el tramo 2027–3100 de `timeScale.ts`,
compartido con Grecia, Roma **y Persia** (las fechas de Persia no se
habían incluido en el cálculo anterior de ese tramo). Se recalculó ese
tramo combinando las fechas de las 4 regiones a la vez, y también se
recalculó el tramo 3100–6000 (Mesopotamia/Egipto/Persia) con las 2
fechas de Egipto restantes (-2900 y -1157). Efecto secundario
inesperado y positivo: al recalcular el tramo 2027–3100 incluyendo por
primera vez las fechas de Persia, **Persia bajó de 6 filas a 2** sin
que se le pidiera arreglar nada — simplemente se benefició de compartir
el mismo tramo ya bien afinado.

Resultado: **23 de los 23 eventos de Egipto en la fila principal**. 0
solapamientos verificado en las 10 regiones (145 eventos en total);
"Reset" sigue ajustando todo el timeline al 5%.

## Nueva región: Esparta (separada de Antigua Grecia)

El usuario pidió una línea temporal adicional dedicada a Esparta dentro
de Grecia, cubriendo cómo vivían, sus costumbres, su ubicación y sus
guerras — mismo patrón que la separación de Era de Hielo: promover un
tema con suficiente profundidad propia a su propia región/carril en vez
de una sola tarjeta dentro de otra región.

**Reubicación**: se sacó la tarjeta `grecia-esparta` (extraída de
Figma, con sus 5 imágenes originales) de `data/grecia.json` (quedó en
11 eventos) y se movió, sin tocar su texto ni imágenes, a un archivo
nuevo `data/esparta.json` (campo `region` actualizado). Región nueva
dada de alta en `regions.json` (`orden_vertical: 5.5`, entre Antigua
Grecia y Edad Media), con color propio `--color-esparta` en
`globals.css`, y 3 subperíodos (Formación y Guerras Mesenias, Apogeo
militar, Hegemonía y declive).

**Contenido nuevo investigado** (vía búsqueda web, con fuentes
verificables): se agregaron 12 eventos cubriendo los 4 temas pedidos:

- *Ubicación*: Ubicación y fundación de Esparta (-900) — Laconia, valle
  del Eurotas, sinecismo de aldeas dorias, la única polis griega sin
  murallas.
- *Guerras*: Primera Guerra Mesenia (-743/-724), Segunda Guerra Mesenia
  (-685/-668), Termópilas y los 300 de Leónidas (-480), la hegemonía
  espartana tras la Guerra del Peloponeso (-404/-371), Batalla de
  Leuctra y fin del poderío espartano (-371/-369).
- *Costumbres/cómo vivían*: Las reformas de Licurgo (-690), El sistema
  político espartano (diarquía, gerousia, éforos) (-680), Espartiatas,
  periecos e hilotas (-650), La agogé — la educación espartana (-630),
  Las mujeres espartanas (-600).
- *Contexto adicional*: La Liga del Peloponeso (-550).

Esparta pasó de 1 tarjeta (dentro de Grecia) a 13 eventos en su propia
región. Se buscaron imágenes en Wikimedia Commons para las 12 nuevas
(mismo criterio de siempre) — 0 bloques sin imagen en toda la región.

**Ampliación de espacio**: las fechas de Esparta (-900 a -369) caen en
el mismo tramo 2027–3100 de `timeScale.ts` ya compartido por Grecia,
Roma, Persia y los eventos tardíos de Egipto. Se recalculó ese tramo
una vez más combinando las fechas de las 5 regiones a la vez. Resultado:
**13 de los 13 eventos de Esparta en la fila principal**. 0
solapamientos verificado en las 10 regiones (156 eventos en total);
"Reset" sigue ajustando todo el timeline al 5%.

## Tercera expansión de Edad Media: guerras, revoluciones e inventos

El usuario pidió una investigación específica de guerras, revoluciones
e inventos de la Edad Media, cada uno como una tarjeta nueva.

**Hallazgo previo al agregar contenido**: al revisar el archivo se
encontraron 4 tarjetas ya existentes con `descripcion_corta` vacía
(solo tenían título e imagen, sin texto): "Fundación de las primeras
universidades", "La Guerra de los Cien Años" (justo un tema de
"guerras", relevante para este pedido), "Caída de Constantinopla" y
"Cristobal Colón descubre America". Se redactó el texto faltante de
las 4 antes de seguir, ya que dejarlas vacías mientras se investigaba
más contenido de guerras hubiera sido una inconsistencia notoria.

**Contenido nuevo investigado** (vía búsqueda web, con fuentes
verificables): se agregaron 9 eventos nuevos, organizados en los 3
temas pedidos:

- *Guerras*: Batalla de Hastings y la conquista normanda (1066), la
  Guerra de las Dos Rosas (1455-1487), las Guerras Husitas
  (1419-1434).
- *Revoluciones*: el Conflicto de las Investiduras entre el papado y
  el Sacro Imperio (1076-1122), la Jacquerie francesa de 1358, la
  Revuelta de los Campesinos ingleses de 1381 (Wat Tyler).
- *Inventos*: el reloj mecánico (~1280), la invención de las gafas
  (1286), la pólvora y los primeros cañones en Europa (~1330).

Edad Media pasó de 27 a 36 eventos. Se buscaron imágenes en Wikimedia
Commons para las 9 tarjetas nuevas (mismo criterio de siempre;
`edadmedia-guerras-husitas` llegó como archivo `.tif` de ~90MB en
origen, se rasterizó a JPEG igual que otros archivos pesados
anteriores) — 0 bloques sin imagen en toda la región.

**Ampliación de espacio**: al pasar de 27 a 36 eventos, Edad Media
volvió a tener varias filas. Se recalculó el mismo esquema de tramos
angostos de `timeScale.ts` usado en las rondas anteriores para esta
región (ya no compartido con ninguna otra, es la única franja propia de
0 a 1524 años de antigüedad). Resultado: **35 de los 36 eventos en la
fila principal**. El único par que sigue en fila aparte sigue siendo
"Fundación de universidades" y "Perfeccionamiento de castillos" (año
1100 exacto) — mismo caso de siempre, no se le movió la fecha. 0
solapamientos verificado en las 10 regiones (165 eventos en total);
"Reset" sigue ajustando todo el timeline al 5%.

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
