import { todosLosBloques } from "./datos";

// Escala de tiempo en TRAMOS: varios tramos lineales de distinta densidad
// para la historia registrada (cada uno cubre una franja con su propia
// cantidad de contenido real), lineal más suave para la transición (el
// final de Prehistoria, que también tiene contenido denso), logarítmica
// para la prehistoria profunda.
//
// Prehistoria abarca millones de años, mientras que toda la historia
// registrada (Mesopotamia en adelante) cabe en apenas unos miles. Una
// escala 100% logarítmica castiga fuerte a la historia reciente: eventos
// se apilaban hacia abajo en vez de extenderse horizontalmente. Pero
// tampoco toda la historia registrada tiene la MISMA densidad de
// contenido real: el Imperio Romano, la Antigua Grecia o la Edad Media
// tienen bastantes más eventos por año que, por ejemplo, la República
// romana o el Imperio persa. Por eso `TRAMOS_LINEALES` (más abajo) define
// una densidad (píxeles por año) distinta por franja de años, en vez de
// una sola densidad pareja para toda la historia registrada.
//
// Después de la historia registrada hay un tramo INTERMEDIO de transición
// (`EDAD_UMBRAL_TRANSICION_ANIOS`) con su propia densidad, más suave que
// la historia reciente pero mucho más generosa que el log profundo —
// cubre el final de Prehistoria (Mesolítico/Neolítico/Edad de los
// metales), que también tiene contenido denso y real (ej. "Neolítico"
// -6500 vs "Edad de los metales" -6000 quedaban a solo ~84px en la
// escala logarítmica pura, menos de lo que necesita una tarjeta para no
// chocar). Fuera de esa franja (prehistoria realmente profunda, millones
// de años, mucho menos denso en contenido real) se sigue comprimiendo con
// log10.
//
// Todos los tramos se anclan para dar el mismo valor exacto en cada punto
// de transición (sin salto visual de posición).

// Año que se toma como "presente" para medir la antigüedad de todo lo
// demás. No hace falta que sea el año actual real: solo es el punto fijo
// desde el que se mide "hace cuántos años". Un año negativo = AC.
const REFERENCIA_ANIO = 2000;

// Tramos lineales de historia registrada, de más reciente a más antiguo.
// Cada uno cubre desde donde termina el anterior hasta `edadHasta` (en
// años de antigüedad respecto a REFERENCIA_ANIO), con su propia densidad
// en píxeles/año. Agregar o ajustar un tramo = una fila acá, sin tocar
// el resto — los anclajes entre tramos se recalculan solos más abajo.
//
// OJO con subir mucho estos valores: el zoom mínimo del canvas está fijo
// (ver `useCanvasPanZoom.ts`) para poder ver TODO el contenido de un
// vistazo — si el ancho total resultante no entra en pantalla ni siquiera
// al zoom mínimo, el botón "Reset" deja de poder mostrar el canvas
// completo y el contenido reciente queda amontonado en una esquina (pasó
// al probar con 10 px/año parejo para TODA la historia: el total daba
// ~135 000px).
const TRAMOS_LINEALES: { edadHasta: number; pxPorAnio: number }[] = [
  // 0–1524 años de antigüedad (año 476 DC – 2000): toda la Edad Media
  // vive acá (476–1492). Subir la densidad pareja para TODA la franja
  // ampliaba de más los huecos anchos que ya cabían bien con la densidad
  // base, solo para poder separar un puñado de eventos muy cercanos en
  // el tiempo. En vez de eso, esta franja se subdividió en muchos tramos
  // angostos: casi todos a la densidad base (4px/año, igual que el resto
  // de "historia normal"), y solo los tramos que caen justo entre dos
  // eventos con pocos años de diferencia suben la densidad lo necesario
  // para que quepan en la misma fila (500px de ancho de tarjeta + 24px
  // de `GAP_HORIZONTAL_MIN` en `layout.ts` = 524px mínimos entre el
  // inicio de dos tarjetas consecutivas). Recalculado tras investigar y
  // agregar 9 eventos nuevos de guerras/revoluciones/inventos (batalla
  // de Hastings, Conflicto de las Investiduras, reloj mecánico, gafas,
  // Jacquerie, pólvora y cañones, revuelta campesina inglesa, guerras
  // husitas, Guerra de las Dos Rosas). El único par que sigue en fila
  // aparte es "Fundación de universidades" y "Perfeccionamiento de
  // castillos", que comparten el mismo año exacto (1100) — ningún valor
  // de densidad puede separar dos eventos con la misma fecha, así que no
  // se tocó (no vale la pena fudgear una fecha histórica real solo por
  // estética de layout).
  { edadHasta: 508, pxPorAnio: 4 },
  { edadHasta: 545, pxPorAnio: 8 },
  { edadHasta: 547, pxPorAnio: 135 },
  { edadHasta: 560, pxPorAnio: 21 },
  { edadHasta: 571, pxPorAnio: 25 },
  { edadHasta: 581, pxPorAnio: 27 },
  { edadHasta: 619, pxPorAnio: 8 },
  { edadHasta: 622, pxPorAnio: 90 },
  { edadHasta: 642, pxPorAnio: 14 },
  { edadHasta: 654, pxPorAnio: 23 },
  { edadHasta: 663, pxPorAnio: 30 },
  { edadHasta: 670, pxPorAnio: 39 },
  { edadHasta: 685, pxPorAnio: 18 },
  { edadHasta: 714, pxPorAnio: 10 },
  { edadHasta: 720, pxPorAnio: 45 },
  { edadHasta: 759, pxPorAnio: 7 },
  { edadHasta: 785, pxPorAnio: 11 },
  { edadHasta: 850, pxPorAnio: 5 },
  { edadHasta: 900, pxPorAnio: 6 },
  { edadHasta: 905, pxPorAnio: 54 },
  { edadHasta: 924, pxPorAnio: 15 },
  { edadHasta: 934, pxPorAnio: 27 },
  { edadHasta: 946, pxPorAnio: 23 },
  { edadHasta: 1000, pxPorAnio: 5 },
  { edadHasta: 1038, pxPorAnio: 8 },
  { edadHasta: 1140, pxPorAnio: 4 },
  { edadHasta: 1160, pxPorAnio: 14 },
  { edadHasta: 1200, pxPorAnio: 7 },
  { edadHasta: 1207, pxPorAnio: 39 },
  { edadHasta: 1268, pxPorAnio: 5 },
  { edadHasta: 1289, pxPorAnio: 13 },
  { edadHasta: 1378, pxPorAnio: 4 },
  { edadHasta: 1473, pxPorAnio: 4 },
  { edadHasta: 1519, pxPorAnio: 6 },
  { edadHasta: 1524, pxPorAnio: 54 },
  // 1524–2027 (-27 AC – 476 DC): Imperio Romano. Mismo criterio que Edad
  // Media/Grecia: tramos angostos, la mayoría a la densidad base
  // (5px/año), y solo los que caen entre eventos muy cercanos en el
  // tiempo (ej. "Ingeniería romana"/"Las legiones", separados apenas 10
  // años entre sí tras moverlos a -105/-95 para no compartir fecha
  // exacta) suben lo necesario para que quepan en la misma fila.
  { edadHasta: 1620, pxPorAnio: 5 },
  { edadHasta: 1687, pxPorAnio: 5 },
  { edadHasta: 1850, pxPorAnio: 5 },
  { edadHasta: 1900, pxPorAnio: 6 },
  { edadHasta: 1931, pxPorAnio: 9 },
  { edadHasta: 1967, pxPorAnio: 8 },
  { edadHasta: 2027, pxPorAnio: 5 },
  // 2027–3100 (-1100 AC – -27 AC): Antigua Grecia, Esparta (línea propia
  // desde que se separó de Grecia), República y Monarquía de Roma,
  // Imperio Persa, y los eventos tardíos de Egipto (dinastía kushita,
  // conquista persa) — este tramo es compartido por las 5 regiones, así
  // que los límites de abajo combinan las fechas de todas. Igual
  // criterio que arriba: la mayoría a la densidad base (3px/año), y solo
  // los tramos entre eventos muy cercanos en el tiempo suben lo
  // necesario para que quepan en la misma fila (500px de tarjeta + 24px
  // de `GAP_HORIZONTAL_MIN` = 524px mínimos).
  { edadHasta: 2031, pxPorAnio: 68 },
  { edadHasta: 2058, pxPorAnio: 10 },
  { edadHasta: 2095, pxPorAnio: 8 },
  { edadHasta: 2105, pxPorAnio: 27 },
  { edadHasta: 2196, pxPorAnio: 3 },
  { edadHasta: 2200, pxPorAnio: 68 },
  { edadHasta: 2305, pxPorAnio: 3 },
  { edadHasta: 2323, pxPorAnio: 15 },
  { edadHasta: 2336, pxPorAnio: 21 },
  { edadHasta: 2371, pxPorAnio: 8 },
  { edadHasta: 2404, pxPorAnio: 9 },
  { edadHasta: 2431, pxPorAnio: 10 },
  { edadHasta: 2450, pxPorAnio: 15 },
  { edadHasta: 2470, pxPorAnio: 14 },
  { edadHasta: 2480, pxPorAnio: 27 },
  { edadHasta: 2499, pxPorAnio: 15 },
  { edadHasta: 2500, pxPorAnio: 270 },
  { edadHasta: 2509, pxPorAnio: 30 },
  { edadHasta: 2518, pxPorAnio: 30 },
  { edadHasta: 2520, pxPorAnio: 135 },
  { edadHasta: 2525, pxPorAnio: 54 },
  { edadHasta: 2550, pxPorAnio: 11 },
  { edadHasta: 2559, pxPorAnio: 30 },
  { edadHasta: 2600, pxPorAnio: 7 },
  { edadHasta: 2630, pxPorAnio: 9 },
  { edadHasta: 2650, pxPorAnio: 14 },
  { edadHasta: 2680, pxPorAnio: 9 },
  { edadHasta: 2685, pxPorAnio: 54 },
  { edadHasta: 2690, pxPorAnio: 54 },
  { edadHasta: 2700, pxPorAnio: 27 },
  { edadHasta: 2743, pxPorAnio: 7 },
  { edadHasta: 2744, pxPorAnio: 270 },
  { edadHasta: 2750, pxPorAnio: 45 },
  { edadHasta: 2753, pxPorAnio: 90 },
  { edadHasta: 2900, pxPorAnio: 3 },
  { edadHasta: 3000, pxPorAnio: 3 },
  { edadHasta: 3060, pxPorAnio: 5 },
  { edadHasta: 3100, pxPorAnio: 7 },
  // 3100–6000 (-4000 AC – -1100 AC): resto de la historia registrada
  // "normal", compartido por Mesopotamia, Antiguo Egipto e Imperio
  // Persa. Igual criterio que en los tramos de arriba: la mayoría a la
  // densidad base (2px/año), y solo los tramos entre eventos muy
  // cercanos en el tiempo (de cualquiera de las 3 regiones) suben lo
  // necesario para que quepan en la misma fila. Se disparó sobre todo al
  // investigar y agregar contenido nuevo de Egipto (jeroglíficos,
  // calendario, pirámides de Guiza, Hatshepsut, Akenatón, Tutankamón,
  // batalla de Qadesh, Pueblos del Mar, huelga de Deir el-Medina), que
  // dejó varios eventos a pocas décadas de diferencia dentro del
  // Imperio Nuevo.
  { edadHasta: 3157, pxPorAnio: 5 },
  { edadHasta: 3177, pxPorAnio: 14 },
  { edadHasta: 3274, pxPorAnio: 3 },
  { edadHasta: 3332, pxPorAnio: 5 },
  { edadHasta: 3353, pxPorAnio: 13 },
  { edadHasta: 3479, pxPorAnio: 3 },
  { edadHasta: 3550, pxPorAnio: 4 },
  { edadHasta: 3754, pxPorAnio: 2 },
  { edadHasta: 3792, pxPorAnio: 8 },
  { edadHasta: 3800, pxPorAnio: 34 },
  { edadHasta: 4047, pxPorAnio: 2 },
  { edadHasta: 4050, pxPorAnio: 90 },
  { edadHasta: 4100, pxPorAnio: 6 },
  { edadHasta: 4218, pxPorAnio: 3 },
  { edadHasta: 4334, pxPorAnio: 3 },
  { edadHasta: 4560, pxPorAnio: 2 },
  { edadHasta: 4580, pxPorAnio: 14 },
  { edadHasta: 4600, pxPorAnio: 14 },
  { edadHasta: 4620, pxPorAnio: 14 },
  { edadHasta: 4700, pxPorAnio: 4 },
  { edadHasta: 4900, pxPorAnio: 2 },
  { edadHasta: 5100, pxPorAnio: 2 },
  { edadHasta: 5150, pxPorAnio: 6 },
  { edadHasta: 5200, pxPorAnio: 6 },
  { edadHasta: 5500, pxPorAnio: 2 },
  { edadHasta: 6000, pxPorAnio: 2 },
];

// Edad a partir de la cual se pasa de los tramos lineales de historia
// registrada a la de transición. 10 000 años cubre el resto de
// Prehistoria "tardía" con contenido denso (Edad de los metales hasta
// -6000, Neolítico -6500, Mesolítico hasta -10000). Más atrás de este
// punto (Paleolítico y más viejo) el contenido real es mucho menos denso
// por año, no necesita tanto espacio.
const EDAD_UMBRAL_TRANSICION_ANIOS = 10000;

// Píxeles por año en el tramo de transición. Con 0.6 px/año, los 500 años
// entre Neolítico y Edad de los metales ocupan ~300px (ya alcanza para no
// chocar).
const PIXELES_POR_ANIO_TRANSICION = 0.6;

// Precálculo de los tramos lineales: para cada uno, la edad límite y el
// valor (en píxeles) acumulado hasta ese límite. Se recorre una sola vez
// al cargar el módulo, no en cada llamada a `posicionLog`.
const EDADES_LIMITE_TRAMOS: number[] = [];
const VALORES_LIMITE_TRAMOS: number[] = [];
{
  let acumulado = 0;
  let edadAnterior = 0;
  for (const tramo of TRAMOS_LINEALES) {
    acumulado += (tramo.edadHasta - edadAnterior) * tramo.pxPorAnio;
    EDADES_LIMITE_TRAMOS.push(tramo.edadHasta);
    VALORES_LIMITE_TRAMOS.push(acumulado);
    edadAnterior = tramo.edadHasta;
  }
}

const EDAD_UMBRAL_HISTORIA_ANIOS =
  EDADES_LIMITE_TRAMOS[EDADES_LIMITE_TRAMOS.length - 1];
const VALOR_EN_UMBRAL_HISTORIA =
  VALORES_LIMITE_TRAMOS[VALORES_LIMITE_TRAMOS.length - 1];

// Valor donde termina el tramo de transición y empieza el logarítmico.
const VALOR_EN_UMBRAL_TRANSICION =
  VALOR_EN_UMBRAL_HISTORIA +
  (EDAD_UMBRAL_TRANSICION_ANIOS - EDAD_UMBRAL_HISTORIA_ANIOS) *
    PIXELES_POR_ANIO_TRANSICION;

// Píxeles por orden de magnitud (x10) de antigüedad en el tramo
// logarítmico (prehistoria profunda). Se calcula para que dé EXACTAMENTE
// el mismo valor que el tramo de transición en `EDAD_UMBRAL_TRANSICION_ANIOS`
// — así no hay un salto de posición al cruzar de un tramo al otro.
const PIXELES_POR_DECADA_LOG =
  VALOR_EN_UMBRAL_TRANSICION / Math.log10(EDAD_UMBRAL_TRANSICION_ANIOS + 1);

/** Posición (sin signo) dentro de los tramos lineales de historia registrada. */
function posicionEnTramosLineales(edad: number): number {
  let edadAnterior = 0;
  let valorAnterior = 0;
  for (let i = 0; i < TRAMOS_LINEALES.length; i++) {
    if (edad <= EDADES_LIMITE_TRAMOS[i]) {
      return valorAnterior + (edad - edadAnterior) * TRAMOS_LINEALES[i].pxPorAnio;
    }
    edadAnterior = EDADES_LIMITE_TRAMOS[i];
    valorAnterior = VALORES_LIMITE_TRAMOS[i];
  }
  // No debería llegar acá (el llamador ya filtra edad <= EDAD_UMBRAL_HISTORIA_ANIOS).
  return valorAnterior;
}

function posicionLog(anio: number): number {
  // Distancia con signo a REFERENCIA_ANIO: negativa en el pasado (lo normal
  // para esta línea de tiempo), positiva si algún día se agregan fechas
  // futuras/posteriores a la referencia. Importante usar el signo de la
  // distancia real (no truncar a 0 en `anio >= REFERENCIA_ANIO`): si se
  // recortara ahí, todos los años desde la referencia en adelante
  // colapsarían al mismo punto x=0 en vez de seguir separándose.
  const distancia = anio - REFERENCIA_ANIO;
  const signo = Math.sign(distancia) || 1;
  const edad = Math.abs(distancia);

  if (edad <= EDAD_UMBRAL_HISTORIA_ANIOS) {
    return signo * posicionEnTramosLineales(edad);
  }
  if (edad <= EDAD_UMBRAL_TRANSICION_ANIOS) {
    const valor =
      VALOR_EN_UMBRAL_HISTORIA +
      (edad - EDAD_UMBRAL_HISTORIA_ANIOS) * PIXELES_POR_ANIO_TRANSICION;
    return signo * valor;
  }
  // +1 dentro del log10 solo para no romper la continuidad de la fórmula
  // en el borde (log10(edad+1) en vez de log10(edad)); a esta escala de
  // edades (>10 000 años) la diferencia es visualmente imperceptible.
  return signo * Math.log10(edad + 1) * PIXELES_POR_DECADA_LOG;
}

// --- Compresión de los tramos sin contenido -------------------------------
//
// Los tramos de arriba reparten el ancho según la ANTIGÜEDAD, no según
// cuánto contenido hay. En la prehistoria eso dejaba huecos enormes: entre
// "Primer uso habitual del fuego" (800 000 AC) y "Primeras lanzas de
// madera" (400 000 AC) no hay ninguna tarjeta y sin embargo se reservaban
// más de 2500px de vacío. Sumando todos los tramos así, un 36% del ancho
// total del canvas era espacio en blanco, casi todo al principio.
//
// En vez de retocar a mano las densidades (que es lo que hacen los tramos
// de arriba, pensados para SEPARAR eventos demasiado juntos), acá se hace
// lo contrario y de forma automática: se miran las fechas reales de todos
// los bloques y se recorta el sobrante de los tramos donde no hay ninguno,
// dejando siempre un respiro de `MARGEN_TRAMO_VACIO_PX`.
//
// La transformación es monótona y continua, así que no altera el orden
// cronológico ni deja saltos: dentro de un tramo vacío las posiciones se
// reescalan proporcionalmente, y todo lo que viene después simplemente se
// corre hacia la izquierda. Como la regla de tiempo, las barras de región
// y las tarjetas pasan todas por `anioAX`, se acomodan solas.

// Respiro que se deja en un tramo sin contenido. 580px = el ancho de una
// tarjeta de evento (500px, ver `RegionLane.tsx`) más algo de aire, de
// modo que un salto largo de tiempo se siga LEYENDO como un salto largo
// sin por eso reservar miles de píxeles vacíos.
const MARGEN_TRAMO_VACIO_PX = 580;

// Posiciones (en el espacio de `posicionLog`, antes de comprimir) donde
// hay contenido real, y cuánto sobrante acumulado hay que descontar a
// partir de cada una. Se calcula una sola vez al cargar el módulo.
const ANCLAS_CONTENIDO: number[] = [];
const DESCUENTO_ACUMULADO: number[] = [];

{
  const anios = new Set<number>();
  for (const bloque of todosLosBloques) {
    // Las fechas de fin cuentan como contenido: si no, un bloque que
    // abarca miles de años (ej. "Revolución cognitiva", 70 000–30 000 AC)
    // vería su propia barra recortada al mínimo junto con el hueco que
    // viene después.
    if (bloque.tipo === "evento") {
      anios.add(bloque.fecha_inicio);
      if (bloque.fecha_fin != null) anios.add(bloque.fecha_fin);
    } else if (bloque.fecha_inicio != null) {
      anios.add(bloque.fecha_inicio);
    }
  }

  const posiciones = [...anios]
    .map((anio) => posicionLog(anio))
    .sort((a, b) => a - b);

  let descuento = 0;
  for (let i = 0; i < posiciones.length; i++) {
    ANCLAS_CONTENIDO.push(posiciones[i]);
    DESCUENTO_ACUMULADO.push(descuento);
    const siguiente = posiciones[i + 1];
    if (siguiente !== undefined) {
      descuento += Math.max(0, siguiente - posiciones[i] - MARGEN_TRAMO_VACIO_PX);
    }
  }
}

/**
 * Aplica la compresión de tramos vacíos a una posición ya calculada por
 * `posicionLog`.
 */
function comprimirVacios(x: number): number {
  if (ANCLAS_CONTENIDO.length === 0) return x;
  if (x <= ANCLAS_CONTENIDO[0]) return x;

  const ultima = ANCLAS_CONTENIDO.length - 1;
  if (x >= ANCLAS_CONTENIDO[ultima]) {
    return x - DESCUENTO_ACUMULADO[ultima];
  }

  // Búsqueda binaria del tramo [i, i+1] que contiene a x.
  let bajo = 0;
  let alto = ultima;
  while (alto - bajo > 1) {
    const medio = (bajo + alto) >> 1;
    if (ANCLAS_CONTENIDO[medio] <= x) bajo = medio;
    else alto = medio;
  }

  const inicio = ANCLAS_CONTENIDO[bajo];
  const fin = ANCLAS_CONTENIDO[bajo + 1];
  const largo = fin - inicio;
  const base = inicio - DESCUENTO_ACUMULADO[bajo];

  if (largo <= MARGEN_TRAMO_VACIO_PX) {
    // El tramo ya era corto: no se toca, solo se corre lo ya descontado.
    return base + (x - inicio);
  }
  // Tramo vacío recortado: se reparte proporcionalmente en el margen.
  return base + ((x - inicio) / largo) * MARGEN_TRAMO_VACIO_PX;
}

// --- Separación mínima entre acontecimientos ------------------------------
//
// La compresión de arriba quita el vacío, pero no garantiza que dos
// acontecimientos seguidos de una misma región quepan uno al lado del otro:
// cuando caen demasiado juntos, `empacarEnFilas` los baja a otra fila y la
// línea del carril deja de leerse como una secuencia. Esta segunda etapa
// hace lo contrario que la compresión: ensancha —solo lo justo— los tramos
// donde dos acontecimientos consecutivos de la misma región quedarían
// encimados.
//
// Solo cuentan los acontecimientos: los bloques contextuales ("Cómo vivía
// la gente", "Modelo económico"...) van por debajo y no necesitan sitio
// propio en la línea.
//
// Dos bloques con el MISMO año exacto no se pueden separar por mucho que se
// ensanche el tramo —la posición es función del año—, así que esos siguen
// apilándose; no hay forma de evitarlo sin falsear una fecha.

// Ancho de tarjeta (500px, ver `RegionLane.tsx`) más `GAP_HORIZONTAL_MIN`
// (24px, ver `layout.ts`): la distancia mínima entre el inicio de dos
// tarjetas para que no choquen.
const SEPARACION_MINIMA_PX = 524;

const ANCLAS_EXPANSION: number[] = [];
const DESPLAZAMIENTO_ACUMULADO: number[] = [];

{
  // Posiciones (ya comprimidas) de cada acontecimiento, agrupadas por
  // posición, con las regiones a las que pertenecen.
  const porPosicion = new Map<number, Set<string>>();
  for (const bloque of todosLosBloques) {
    if (bloque.tipo !== "evento" || bloque.contextual) continue;
    const x = comprimirVacios(posicionLog(bloque.fecha_inicio));
    let regiones = porPosicion.get(x);
    if (!regiones) {
      regiones = new Set();
      porPosicion.set(x, regiones);
    }
    regiones.add(bloque.region);
  }

  const posiciones = [...porPosicion.entries()].sort((a, b) => a[0] - b[0]);
  const ultimaPorRegion: Record<string, number> = {};
  let desplazamiento = 0;

  for (const [x, regiones] of posiciones) {
    let necesario = 0;
    for (const region of regiones) {
      const anterior = ultimaPorRegion[region];
      if (anterior === undefined) continue;
      necesario = Math.max(
        necesario,
        SEPARACION_MINIMA_PX - (x + desplazamiento - anterior),
      );
    }
    if (necesario > 0) desplazamiento += necesario;

    ANCLAS_EXPANSION.push(x);
    DESPLAZAMIENTO_ACUMULADO.push(desplazamiento);
    for (const region of regiones) ultimaPorRegion[region] = x + desplazamiento;
  }
}

/**
 * Aplica el desplazamiento acumulado por la separación de acontecimientos.
 * Entre dos anclas se interpola linealmente para que la transformación siga
 * siendo continua y monótona, igual que la compresión.
 */
function separarAcontecimientos(x: number): number {
  const n = ANCLAS_EXPANSION.length;
  if (n === 0) return x;
  if (x <= ANCLAS_EXPANSION[0]) return x + DESPLAZAMIENTO_ACUMULADO[0];
  if (x >= ANCLAS_EXPANSION[n - 1]) return x + DESPLAZAMIENTO_ACUMULADO[n - 1];

  let bajo = 0;
  let alto = n - 1;
  while (alto - bajo > 1) {
    const medio = (bajo + alto) >> 1;
    if (ANCLAS_EXPANSION[medio] <= x) bajo = medio;
    else alto = medio;
  }

  const inicio = ANCLAS_EXPANSION[bajo];
  const fin = ANCLAS_EXPANSION[bajo + 1];
  const largo = fin - inicio;
  const desde = DESPLAZAMIENTO_ACUMULADO[bajo];
  const hasta = DESPLAZAMIENTO_ACUMULADO[bajo + 1];
  if (largo <= 0) return x + hasta;
  return x + desde + ((x - inicio) / largo) * (hasta - desde);
}

/**
 * Convierte un año a posición X (sin aplicar aún pan/zoom), en escala
 * logarítmica de antigüedad, con los tramos sin contenido ya recortados y
 * con los acontecimientos separados lo justo para que no se encimen.
 * `anioMinimoGlobal` es solo un desplazamiento de conveniencia para que el
 * año más antiguo del set de datos quede cerca de x=0 (no afecta la
 * compresión relativa entre tramos).
 */
export function anioAX(anio: number, anioMinimoGlobal: number): number {
  // Redondeado a 1 decimal: con muchos decimales de precisión flotante, el
  // servidor y el cliente a veces serializan el número a texto CSS de
  // forma levemente distinta, y React marca un "hydration mismatch" en
  // cada posición (ruido en consola, no se corrige solo). Un decimal es
  // más que suficiente precisión visual para posicionar bloques.
  const posicion = (anio: number) =>
    separarAcontecimientos(comprimirVacios(posicionLog(anio)));
  return Math.round((posicion(anio) - posicion(anioMinimoGlobal)) * 10) / 10;
}

/** Formatea un año (positivo = DC, negativo = AC) para mostrar en la regla o en tarjetas. */
export function formatearAnio(anio: number): string {
  const abs = Math.abs(Math.round(anio));
  const texto = abs.toLocaleString("es-CR");
  return anio < 0 ? `${texto} AC` : `${texto} DC`;
}

// Edades candidatas (en años antes de REFERENCIA_ANIO) para las marcas de
// la regla, de la más antigua a la más reciente. Suficientemente amplias
// para cubrir desde milenios de historia registrada hasta millones de
// años de prehistoria profunda.
//
// La progresión "1-2-5 por década" (...,500,1000,2000,5000,10000,...) es
// suficiente en la zona logarítmica (edad > EDAD_UMBRAL_ANIOS en
// timeScale): ahí un salto multiplicativo x2 se traduce en un salto de
// PÍXELES parejo, así que no hace falta más densidad. Pero en la zona
// LINEAL (edad 0–10 000, que es toda la historia registrada que vive en el
// sitio) un salto multiplicativo de 5000 a 10 000 años es un hueco de
// 5000 años sin ninguna marca candidata en el medio — aunque sobre espacio
// en pantalla para mostrar más, el algoritmo no tiene de dónde elegir. Por
// eso acá se agregan candidatos cada 1000 años entre 2000 y 10 000 (9000,
// 8000, 7000, 6000, 4000, 3000), que es justo el rango que reportaron
// faltando marcas.
const EDADES_CANDIDATAS = [
  10000000, 5000000, 2000000, 1000000, 500000, 200000, 100000, 50000, 20000,
  10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 500, 200, 100,
  50, 20, 10, 5, 2, 1, 0,
].sort((a, b) => b - a); // de mayor a menor edad (más antiguo primero)

// Separación mínima en píxeles (a la escala actual) entre dos marcas
// consecutivas, para que la regla no se vea sobrecargada. Subido de 70 a 95
// junto con el aumento de tamaño de fuente de las marcas (10px a 12px, ver
// TimeRuler.tsx): con el texto más grande, 70px dejaba que fechas vecinas
// se superpusieran entre sí a niveles de zoom bajos.
const ESPACIO_MINIMO_ENTRE_MARCAS_PX = 95;

/**
 * Genera las marcas de la regla de tiempo visibles, adaptadas al zoom
 * actual. A diferencia de una escala lineal, el intervalo "correcto" no es
 * un solo número global: varía según qué tan comprimida esté cada zona del
 * eje. Por eso se recorren edades candidatas de más antigua a más
 * reciente y se conserva cada una que quede a una separación mínima en
 * píxeles de la anterior — esto compensa automáticamente la compresión
 * logarítmica (marcas dispersas en zonas antiguas, más densas cerca del
 * presente).
 */
export function generarMarcasLog(
  anioMinimoGlobal: number,
  scale: number,
): number[] {
  const marcas: number[] = [];
  let ultimaX = -Infinity;
  for (const edad of EDADES_CANDIDATAS) {
    const anio = REFERENCIA_ANIO - edad;
    const x = anioAX(anio, anioMinimoGlobal) * scale;
    if (x - ultimaX >= ESPACIO_MINIMO_ENTRE_MARCAS_PX) {
      marcas.push(anio);
      ultimaX = x;
    }
  }
  return marcas;
}
