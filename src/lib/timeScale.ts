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
  // para que quepan en la misma fila (240px de ancho de tarjeta + 24px
  // de `GAP_HORIZONTAL_MIN` en `layout.ts` = 264px mínimos entre el
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
  // necesario para que quepan en la misma fila (240px de tarjeta + 24px
  // de `GAP_HORIZONTAL_MIN` = 264px mínimos).
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

/**
 * Convierte un año a posición X (sin aplicar aún pan/zoom), en escala
 * logarítmica de antigüedad. `anioMinimoGlobal` es solo un desplazamiento
 * de conveniencia para que el año más antiguo del set de datos quede
 * cerca de x=0 (no afecta la compresión relativa entre tramos).
 */
export function anioAX(anio: number, anioMinimoGlobal: number): number {
  // Redondeado a 1 decimal: con muchos decimales de precisión flotante, el
  // servidor y el cliente a veces serializan el número a texto CSS de
  // forma levemente distinta, y React marca un "hydration mismatch" en
  // cada posición (ruido en consola, no se corrige solo). Un decimal es
  // más que suficiente precisión visual para posicionar bloques.
  return (
    Math.round((posicionLog(anio) - posicionLog(anioMinimoGlobal)) * 10) / 10
  );
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
