"use client";

import { useState } from "react";
import { BloqueEvento } from "@/types/timeline";
import { formatearAnio } from "@/lib/timeScale";

interface EventCardProps {
  evento: BloqueEvento;
  onOpenLightbox: (evento: BloqueEvento, imagenIndex: number) => void;
}

// Subido dos veces un 50% a petición (110 → 165 → 248): las miniaturas se
// leían muy pequeñas. El ancho de la tarjeta acompaña el cambio para que
// sigan entrando dos por fila (248*2 + 2 de gap = 498 < 500).
const TAMANO_MINIATURA_PX = 248;

export function EventCard({ evento, onOpenLightbox }: EventCardProps) {
  // Antes el texto se recortaba a 4 líneas con "..." sin forma de leer el
  // resto salvo abriendo el lightbox. Ahora hay un botón "Ver más" que
  // expande la descripción completa en la propia tarjeta — el
  // ResizeObserver de RegionLane ya mide la altura real de cada tarjeta,
  // así que el resto del carril se reacomoda solo cuando esto crece.
  const [expandido, setExpandido] = useState(false);
  return (
    <div
      style={{
        width: 500,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {evento.imagenes.map((img, i) => (
          <button
            key={i}
            onClick={() => onOpenLightbox(evento, i)}
            aria-label={`Ver imagen ${i + 1} de ${evento.titulo}`}
            style={{
              width: TAMANO_MINIATURA_PX,
              height: TAMANO_MINIATURA_PX,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: img.startsWith("placeholder")
                ? "#c9c4ba"
                : `url(${img}) center/cover`,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        {evento.titulo}
      </p>
      <p
        style={{
          fontSize: 10,
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
          color: "var(--color-texto-secundario)",
        }}
      >
        {formatearAnio(evento.fecha_inicio)}
        {evento.fecha_fin !== null ? ` – ${formatearAnio(evento.fecha_fin)}` : ""}
      </p>
      <p
        style={{
          fontSize: 11.5,
          lineHeight: 1.4,
          color: "var(--color-texto-principal)",
          whiteSpace: "pre-line",
          // Colapsada, se recorta a 4 líneas; "Ver más" (abajo) la expande
          // del todo en la misma tarjeta, sin depender del lightbox.
          ...(expandido
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }),
        }}
      >
        {evento.descripcion_corta}
      </p>
      {/* ~180 caracteres es una estimación de cuánto entra en 4 líneas a
          este ancho/tamaño de fuente — no hace falta medir el DOM para
          decidir si hace falta el botón, con texto corto no pasa nada
          visible al expandir. */}
      {evento.descripcion_corta.length > 180 && (
        <button
          onClick={() => setExpandido((v) => !v)}
          style={{
            alignSelf: "flex-start",
            fontSize: 10.5,
            fontWeight: 700,
            color: "#3b5b6b",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {expandido ? "Ver menos" : "Ver más"}
        </button>
      )}
      {evento.links && evento.links.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {evento.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 10.5,
                color: "#3b5b6b",
                textDecoration: "underline",
              }}
            >
              {link.titulo}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
