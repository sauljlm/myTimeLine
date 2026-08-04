export interface BloquePosicionable {
  id: string;
  x: number;
  ancho: number;
  alto: number;
}

export interface BloqueUbicado<T> {
  bloque: T;
  left: number;
  top: number;
}

const GAP_HORIZONTAL_MIN = 24;
const GAP_VERTICAL = 28;

/**
 * Ubica bloques en el eje X según su posición real (ya calculada por
 * fecha), y solo los apila verticalmente (fila nueva) cuando dos bloques
 * se solaparían horizontalmente a esa posición — es decir, únicamente
 * cuando de verdad son "del mismo período" (lo bastante cerca en el
 * tiempo como para chocar en pantalla). Bloques de períodos distintos
 * nunca comparten fila solo porque sí.
 *
 * Es el clásico algoritmo greedy de "mínima cantidad de filas para
 * intervalos que no se solapen": se recorren los bloques ordenados por X,
 * y cada uno se coloca en la primera fila cuyo último bloque ya no lo
 * toque; si ninguna fila sirve, se abre una fila nueva.
 */
export function empacarEnFilas<T>(
  items: (BloquePosicionable & { original: T })[],
): { ubicados: BloqueUbicado<T>[]; alturaTotal: number } {
  const ordenados = [...items].sort((a, b) => a.x - b.x);

  // PASO 1: asignar cada bloque a una fila (greedy first-fit, igual que
  // antes), pero sin fijar todavía ningún `top`. Una fila ya creada puede
  // seguir recibiendo bloques más a la derecha en pasadas posteriores del
  // for, así que su altura final (`alto`) no se conoce hasta terminar de
  // recorrer TODOS los bloques.
  const finXPorFila: number[] = [];
  const altoPorFila: number[] = [];
  const filaDeItem: number[] = [];

  ordenados.forEach((item, idx) => {
    let filaElegida = -1;
    for (let i = 0; i < finXPorFila.length; i++) {
      if (item.x >= finXPorFila[i] + GAP_HORIZONTAL_MIN) {
        filaElegida = i;
        break;
      }
    }

    if (filaElegida === -1) {
      filaElegida = finXPorFila.length;
      finXPorFila.push(-Infinity);
      altoPorFila.push(0);
    }

    finXPorFila[filaElegida] = item.x + item.ancho;
    altoPorFila[filaElegida] = Math.max(altoPorFila[filaElegida], item.alto);
    filaDeItem[idx] = filaElegida;
  });

  // PASO 2: ahora que se conoce la altura FINAL de cada fila (después de
  // que todas recibieron todos sus bloques), recién ahí se puede calcular
  // el `top` acumulado de cada una sin riesgo de que una fila anterior
  // "crezca" después de haber fijado el top de la siguiente.
  const topPorFila: number[] = [];
  let acumulado = 0;
  for (let i = 0; i < altoPorFila.length; i++) {
    topPorFila.push(acumulado);
    acumulado += altoPorFila[i] + GAP_VERTICAL;
  }

  const ubicados: BloqueUbicado<T>[] = ordenados.map((item, idx) => ({
    bloque: item.original,
    left: item.x,
    top: topPorFila[filaDeItem[idx]],
  }));

  const alturaTotal =
    altoPorFila.length > 0 ? acumulado - GAP_VERTICAL : 0;

  return { ubicados, alturaTotal };
}
