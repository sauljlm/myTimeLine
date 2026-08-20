"use client";

import { BloqueEvento } from "@/types/timeline";
import { TextoConNegritas } from "./TextoConNegritas";

interface LightboxProps {
  evento: BloqueEvento;
  imagenIndex: number;
  onClose: () => void;
}

export function Lightbox({ evento, imagenIndex, onClose }: LightboxProps) {
  const img = evento.imagenes[imagenIndex];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          maxWidth: 720,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          padding: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 360,
            background: img?.startsWith("placeholder")
              ? "#c9c4ba"
              : `#ddd url(${img}) center/contain no-repeat`,
          }}
        />
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>
          {evento.titulo}
        </h2>
        <p style={{ fontSize: 12, color: "var(--color-texto-secundario)" }}>
          <TextoConNegritas texto={evento.descripcion_corta} />
        </p>
        {evento.links && evento.links.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            {evento.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#3b5b6b", textDecoration: "underline" }}
              >
                {link.titulo}
              </a>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: "6px 14px",
            fontSize: 12,
            border: "1px solid var(--color-borde-tabla)",
            background: "var(--color-header-tabla)",
            cursor: "pointer",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
