"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { anioAX } from "@/lib/timeScale";
import { empacarEnFilas } from "@/lib/layout";
import { Bloque, BloqueEvento, Region } from "@/types/timeline";
import { EventCard } from "./EventCard";
import { TablaComparativa } from "./TablaComparativa";
import { DiagramaJerarquico } from "./DiagramaJerarquico";

interface RegionLaneProps {
  region: Region;
  bloques: Bloque[];
  anioMinimoGlobal: number;
  onOpenLightbox: (evento: BloqueEvento, imagenIndex: number) => void;
}


const ALTURA_BARRA_ENCABEZADO = 28;
const ALTURA_BARRA_SUBPERIODO = 22;
const ANCHO_TARJETA_EVENTO = 500;
const ANCHO_TABLA_DIAGRAMA = 260;
const ALTO_TABLA_DIAGRAMA_ESTIMADO = 220;
const ESPACIO_ANTES_DE_BLOQUES = 16;

// Estimación SOLO para el primer render, antes de que el ResizeObserver
// mida la altura real de cada tarjeta (ver más abajo). Usar una altura fija
// aquí sin corregirla después fue justo el bug que causaba las
// superposiciones: una tarjeta con descripción larga o muchas imágenes
// mide más que esto, y como los bloques son `position: absolute`, el
// contenedor nunca se enteraba de que su contenido real era más alto.
const MINIATURAS_POR_FILA = 2;
const ALTO_MINIATURA = 250;
const ALTO_TEXTO_TARJETA = 130;

function fechaDeBloque(bloque: Bloque, fechaFallback: number): number {
  if (bloque.tipo === "evento") return bloque.fecha_inicio;
  return bloque.fecha_inicio ?? fechaFallback;
}

function altoEstimadoDeBloque(bloque: Bloque): number {
  if (bloque.tipo !== "evento") return ALTO_TABLA_DIAGRAMA_ESTIMADO;
  const filasImagenes = Math.ceil(
    bloque.imagenes.length / MINIATURAS_POR_FILA,
  );
  return filasImagenes * ALTO_MINIATURA + ALTO_TEXTO_TARJETA;
}

export function RegionLane({
  region,
  bloques,
  anioMinimoGlobal,
  onOpenLightbox,
}: RegionLaneProps) {
  const left = anioAX(region.fecha_inicio, anioMinimoGlobal);
  const width = anioAX(region.fecha_fin, anioMinimoGlobal) - left;

  // Altura Y ancho REALES medidos de cada tarjeta (por id de bloque),
  // rellenados por el ResizeObserver de abajo. Hasta que se midan, se usa
  // la estimación. El ancho real importa sobre todo para
  // `TablaComparativa`, que se renderiza con `width: fit-content` — una
  // tabla de varias columnas puede ser bastante más ancha que el slot fijo
  // (`ANCHO_TABLA_DIAGRAMA`) que el algoritmo de empaquetado reservaba para
  // ella, invadiendo el bloque vecino en la misma fila.
  const [alturasReales, setAlturasReales] = useState<Record<string, number>>(
    {},
  );
  const [anchosReales, setAnchosReales] = useState<Record<string, number>>(
    {},
  );
  const bloqueRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { ubicados, alturaTotal } = useMemo(() => {
    const items = bloques.map((bloque) => {
      const fecha = fechaDeBloque(bloque, region.fecha_fin);
      const x = anioAX(fecha, anioMinimoGlobal) - left;
      const esEvento = bloque.tipo === "evento";
      const anchoEstimado = esEvento ? ANCHO_TARJETA_EVENTO : ANCHO_TABLA_DIAGRAMA;
      return {
        id: bloque.id,
        x,
        ancho: anchosReales[bloque.id] ?? anchoEstimado,
        alto: alturasReales[bloque.id] ?? altoEstimadoDeBloque(bloque),
        // Las tablas y los diagramas son material de apoyo, igual que los
        // bloques marcados como contextuales: tampoco ocupan la línea.
        contextual: bloque.tipo !== "evento" || bloque.contextual === true,
        original: bloque,
      };
    });
    return empacarEnFilas(items);
  }, [bloques, region.fecha_fin, anioMinimoGlobal, left, alturasReales, anchosReales]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setAlturasReales((prev) => {
        let cambio = false;
        const next = { ...prev };
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.bloqueId;
          if (!id) continue;
          // +1px de margen: algunos navegadores redondean contentRect y
          // terminan reportando 1px menos de lo que realmente ocupa.
          const altura = Math.ceil(entry.contentRect.height) + 1;
          if (next[id] !== altura) {
            next[id] = altura;
            cambio = true;
          }
        }
        return cambio ? next : prev;
      });
      setAnchosReales((prev) => {
        let cambio = false;
        const next = { ...prev };
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.bloqueId;
          if (!id) continue;
          const ancho = Math.ceil(entry.contentRect.width) + 1;
          if (next[id] !== ancho) {
            next[id] = ancho;
            cambio = true;
          }
        }
        return cambio ? next : prev;
      });
    });
    for (const id of Object.keys(bloqueRefs.current)) {
      const el = bloqueRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [bloques]);

  return (
    // No usar `position: absolute` aquí: el wrapper en TimelineCanvas mide
    // este carril con ResizeObserver para apilar verticalmente los demás
    // carriles según su altura REAL. Un hijo `position:absolute` queda
    // fuera del flujo normal y no cuenta para el tamaño intrínseco de su
    // contenedor, así que ese wrapper siempre medía 0px de alto y todos
    // los carriles terminaban apilados casi encima unos de otros. Con
    // `marginLeft` en vez de `left` seguimos desplazando horizontalmente
    // sin sacar el nodo del flujo.
    <div style={{ position: "relative", marginLeft: left }}>
      <div
        style={{
          width: Math.max(width, 60),
          height: ALTURA_BARRA_ENCABEZADO,
          background: region.color,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {region.nombre}
        </span>
      </div>

      {region.subperiodos && region.subperiodos.length > 0 && (
        <div style={{ position: "relative", height: ALTURA_BARRA_SUBPERIODO }}>
          {region.subperiodos.map((sp) => {
            const spLeft = anioAX(sp.fecha_inicio, anioMinimoGlobal) - left;
            const spWidth =
              anioAX(sp.fecha_fin, anioMinimoGlobal) -
              anioAX(sp.fecha_inicio, anioMinimoGlobal);
            return (
              <div
                key={sp.nombre}
                style={{
                  position: "absolute",
                  left: spLeft,
                  width: Math.max(spWidth, 30),
                  height: ALTURA_BARRA_SUBPERIODO,
                  background: "var(--color-header-tabla)",
                  border: "1px solid var(--color-borde-tabla)",
                  fontSize: 11,
                  fontWeight: 700,
                  paddingLeft: 6,
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                title={sp.nombre}
              >
                {sp.nombre}
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          position: "relative",
          marginTop: ESPACIO_ANTES_DE_BLOQUES,
          height: alturaTotal,
        }}
      >
        {ubicados.map(({ bloque, left: bloqueLeft, top }) => (
          <div
            key={bloque.id}
            ref={(el) => {
              bloqueRefs.current[bloque.id] = el;
              if (el) el.dataset.bloqueId = bloque.id;
            }}
            data-bloque-id={bloque.id}
            style={{ position: "absolute", left: bloqueLeft, top }}
          >
            {bloque.tipo === "evento" ? (
              <EventCard evento={bloque} onOpenLightbox={onOpenLightbox} />
            ) : bloque.tipo === "tabla_comparativa" ? (
              <TablaComparativa bloque={bloque} />
            ) : (
              <DiagramaJerarquico bloque={bloque} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
