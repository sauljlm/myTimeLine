"use client";

import { RefObject, useMemo } from "react";
import { anioAX, formatearAnio, generarMarcasLog } from "@/lib/timeScale";

interface TimeRulerProps {
  scale: number;
  anioMinimoGlobal: number;
  rulerTrackRef: RefObject<HTMLDivElement | null>;
}

const ALTURA_REGLA_PX = 40;

export function TimeRuler({
  scale,
  anioMinimoGlobal,
  rulerTrackRef,
}: TimeRulerProps) {
  // La lista de edades candidatas es chica (~20) y ya viene filtrada por
  // separación mínima en píxeles, así que no hace falta acotarla al rango
  // visible: las que caen fuera del viewport actual simplemente no se ven
  // (son `position: absolute`, sin costo real).
  const marcas = useMemo(
    () => generarMarcasLog(anioMinimoGlobal, scale),
    [anioMinimoGlobal, scale],
  );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: ALTURA_REGLA_PX,
        background: "var(--color-fondo-canvas)",
        borderBottom: "1px solid var(--color-borde-tabla)",
        zIndex: 10,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        ref={rulerTrackRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          // Sin `transition` acá: el contra-escalado del texto de cada
          // marca (`--inverse-scale`, ver useCanvasPanZoom.ts) se actualiza
          // instantáneo, cuadro a cuadro. Si este contenedor animara su
          // propio `transform` de forma suave (150ms) mientras el texto
          // hijo saltaba al valor final al instante, quedaban desincronizados
          // durante esos 150ms — el tamaño del padre iba interpolando pero
          // la contra-escala del hijo ya estaba en el valor de destino, y el
          // texto se veía "respirar" en cada zoom. Ambos deben moverse en el
          // mismo frame exacto, igual que el canvas principal (que tampoco
          // tiene transition).
          willChange: "transform",
        }}
      >
        {marcas.map((anio) => (
          <RulerMark key={anio} anio={anio} anioMinimoGlobal={anioMinimoGlobal} />
        ))}
      </div>
    </div>
  );
}

function RulerMark({
  anio,
  anioMinimoGlobal,
}: {
  anio: number;
  anioMinimoGlobal: number;
}) {
  // Esta X ya está en coordenadas del "mundo" (sin transformar); el
  // translate+scale del contenedor `rulerTrackRef` la lleva a pantalla,
  // exactamente igual que al resto del canvas.
  const x = anioAX(anio, anioMinimoGlobal);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        bottom: 0,
        borderLeft: "1px solid var(--color-borde-tabla)",
        // Flex para centrar verticalmente: el centrado lo resuelve el
        // layout (independiente del zoom), no el `transform` de abajo —
        // así el `scale()` de contra-escalado no tiene que además cargar
        // con la tarea de centrar, evitando cuentas de translate% frágiles.
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Contra-escalado vía variable CSS (`--inverse-scale`, actualizada
          imperativamente en cada frame por `useCanvasPanZoom`, no por el
          prop `scale` de React que llega con debounce) — así el texto se ve
          siempre del mismo tamaño legible, incluso DURANTE el gesto de
          zoom, no solo después de que se asiente. Solo `scaleX` (no
          `scale` parejo): el contenedor padre ahora solo escala en X (ver
          useCanvasPanZoom.ts), así que el eje Y del texto nunca se toca —
          el centrado vertical lo resuelve el flex del contenedor de arriba,
          de forma estable sin importar el zoom. */}
      <span
        style={{
          marginLeft: 4,
          transform: "scaleX(var(--inverse-scale, 1))",
          transformOrigin: "0 0",
          fontSize: 12,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          color: "var(--color-texto-secundario)",
          whiteSpace: "nowrap",
          display: "inline-block",
        }}
      >
        {formatearAnio(anio)}
      </span>
    </div>
  );
}
