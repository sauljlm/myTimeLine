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
  // vive acá (476–1492), con 14 eventos reales en apenas 1016 años —
  // necesitaba más que los 2px/año "normales" (eran 4 filas de tarjetas
  // apiladas en vez de quedar cerca de su línea de tiempo).
  { edadHasta: 1524, pxPorAnio: 4 },
  // 1524–2027 (-27 AC – 476 DC): Imperio Romano. 8 eventos reales
  // (Julio-Claudia, Crucifixión, Flavia, Crisis del s. III,
  // Cristianización, Caída, Bárbaros + galería) en 503 años — la franja
  // más densa de todas, con la densidad más alta.
  { edadHasta: 2027, pxPorAnio: 5 },
  // 2027–3100 (-1100 AC – -27 AC): Antigua Grecia (4 eventos, uno de
  // ellos con 18 imágenes) más República y Monarquía de Roma, que caen
  // en el mismo rango de años — más densidad que el resto de historia
  // "normal", aunque menos que Roma Imperial o Edad Media.
  { edadHasta: 3100, pxPorAnio: 3 },
  // 3100–6000 (-4000 AC – -1100 AC): resto de la historia registrada
  // "normal" (Mesopotamia, Antiguo Egipto, Imperio Persa) — densidad base,
  // sin cambios respecto a como estaba antes de agregar los tramos de
  // arriba.
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
