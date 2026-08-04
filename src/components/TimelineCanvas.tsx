"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCanvasPanZoom } from "@/hooks/useCanvasPanZoom";
import { TimeRuler } from "./TimeRuler";
import { RegionLane } from "./RegionLane";
import { Lightbox } from "./Lightbox";
import { anioAX } from "@/lib/timeScale";
import { Bloque, BloqueEvento, RegionsFile } from "@/types/timeline";

// Alto de carril usado ANTES de tener una medición real (primer render).
// Una vez que ResizeObserver mide el contenido real de cada carril, este
// valor deja de usarse para ese carril — evita que carriles con mucho
// contenido (imágenes, texto) se encimen con el siguiente.
const ALTURA_SLOT_INICIAL = 620;
const ESPACIO_ENTRE_CARRILES = 40;

interface TimelineCanvasProps {
  regionsFile: RegionsFile;
  bloquesPorRegion: Record<string, Bloque[]>;
}

export function TimelineCanvas({
  regionsFile,
  bloquesPorRegion,
}: TimelineCanvasProps) {
  const { viewportRef, canvasRef, rulerTrackRef, scale, zoomIn, zoomOut, resetView, minScale, maxScale } =
    useCanvasPanZoom();

  const [lightbox, setLightbox] = useState<{
    evento: BloqueEvento;
    imagenIndex: number;
  } | null>(null);

  const regionesOrdenadas = useMemo(
    () =>
      [...regionsFile.regions].sort(
        (a, b) => a.orden_vertical - b.orden_vertical,
      ),
    [regionsFile],
  );

  // Alto real medido de cada carril (por id de región). Empieza vacío;
  // se llena a medida que ResizeObserver reporta el tamaño real del DOM.
  const [alturasCarriles, setAlturasCarriles] = useState<Record<string, number>>(
    {},
  );
  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setAlturasCarriles((prev) => {
        let cambio = false;
        const next = { ...prev };
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.regionId;
          if (!id) continue;
          const altura = entry.contentRect.height;
          if (next[id] !== altura) {
            next[id] = altura;
            cambio = true;
          }
        }
        return cambio ? next : prev;
      });
    });

    for (const id of Object.keys(laneRefs.current)) {
      const el = laneRefs.current[id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [regionesOrdenadas]);

  // Offset vertical acumulado de cada región, según la altura REAL medida
  // de las regiones anteriores (o la altura inicial de reserva, mientras
  // no se haya medido todavía).
  const topsPorRegion = useMemo(() => {
    const tops: Record<string, number> = {};
    let acumulado = 0;
    for (const region of regionesOrdenadas) {
      tops[region.id] = acumulado;
      const altura = alturasCarriles[region.id] ?? ALTURA_SLOT_INICIAL;
      acumulado += altura + ESPACIO_ENTRE_CARRILES;
    }
    return tops;
  }, [regionesOrdenadas, alturasCarriles]);

  const { anioMinimoGlobal, boundingBox } = useMemo(() => {
    const inicios = regionsFile.regions.map((r) => r.fecha_inicio);
    const fines = regionsFile.regions.map((r) => r.fecha_fin);
    const min = Math.min(...inicios);
    const max = Math.max(...fines);
    const ultimaRegion = regionesOrdenadas[regionesOrdenadas.length - 1];
    const alturaTotal = ultimaRegion
      ? (topsPorRegion[ultimaRegion.id] ?? 0) +
        (alturasCarriles[ultimaRegion.id] ?? ALTURA_SLOT_INICIAL)
      : ALTURA_SLOT_INICIAL;
    return {
      anioMinimoGlobal: min,
      boundingBox: {
        minX: 0,
        minY: 0,
        maxX: anioAX(max, min),
        maxY: alturaTotal,
      },
    };
  }, [regionsFile, regionesOrdenadas, topsPorRegion, alturasCarriles]);

  // Ajusta la vista para mostrar todo el contenido cargado apenas se monta
  // el canvas (en vez de arrancar en x=0,y=0,scale=1, donde no se vería
  // nada útil centrado en pantalla).
  const vistaInicialAplicada = useRef(false);
  useEffect(() => {
    if (vistaInicialAplicada.current) return;
    vistaInicialAplicada.current = true;
    resetView(boundingBox);
    // Solo al montar: boundingBox cambia levemente después conforme se
    // miden los carriles reales, pero no queremos re-centrar la vista cada
    // vez que el usuario ya está navegando.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--color-fondo-canvas)",
      }}
    >
      <TimeRuler
        scale={scale}
        anioMinimoGlobal={anioMinimoGlobal}
        rulerTrackRef={rulerTrackRef}
      />

      <div
        ref={viewportRef}
        style={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
          }}
        >
          {regionesOrdenadas.map((region) => (
            <div
              key={region.id}
              ref={(el) => {
                laneRefs.current[region.id] = el;
                if (el) el.dataset.regionId = region.id;
              }}
              data-region-id={region.id}
              style={{
                position: "absolute",
                top: topsPorRegion[region.id] ?? 0,
                left: 0,
              }}
            >
              <RegionLane
                region={region}
                bloques={bloquesPorRegion[region.id] ?? []}
                anioMinimoGlobal={anioMinimoGlobal}
                onOpenLightbox={(evento, imagenIndex) =>
                  setLightbox({ evento, imagenIndex })
                }
              />
            </div>
          ))}
        </div>

        <ZoomControls
          scale={scale}
          minScale={minScale}
          maxScale={maxScale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={() => resetView(boundingBox)}
        />
      </div>

      {lightbox && (
        <Lightbox
          evento={lightbox.evento}
          imagenIndex={lightbox.imagenIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

function ZoomControls({
  scale,
  minScale,
  maxScale,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  scale: number;
  minScale: number;
  maxScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const boton: React.CSSProperties = {
    width: 32,
    height: 32,
    border: "1px solid var(--color-borde-tabla)",
    background: "#fff",
    fontSize: 16,
    cursor: "pointer",
  };
  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        background: "rgba(255,255,255,0.9)",
        padding: 6,
        border: "1px solid var(--color-borde-tabla)",
      }}
    >
      <button style={boton} onClick={onZoomIn} disabled={scale >= maxScale} aria-label="Acercar">
        +
      </button>
      <span style={{ fontSize: 10, color: "var(--color-texto-secundario)" }}>
        {Math.round(scale * 100)}%
      </span>
      <button style={boton} onClick={onZoomOut} disabled={scale <= minScale} aria-label="Alejar">
        −
      </button>
      <button
        style={{ ...boton, width: "auto", fontSize: 10, padding: "0 6px" }}
        onClick={onReset}
        aria-label="Reiniciar vista"
      >
        Reset
      </button>
    </div>
  );
}
