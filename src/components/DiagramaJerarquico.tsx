import { BloqueDiagramaJerarquico } from "@/types/timeline";

export function DiagramaJerarquico({
  bloque,
}: {
  bloque: BloqueDiagramaJerarquico;
}) {
  return (
    <div style={{ width: 220 }}>
      <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
        {bloque.titulo}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {bloque.niveles.map((nivel, i) => {
          const anchoPct = 100 - i * (60 / Math.max(1, bloque.niveles.length - 1));
          return (
            <div
              key={i}
              style={{
                width: `${anchoPct}%`,
                margin: "0 auto",
                background: "var(--color-header-tabla)",
                border: "1px solid var(--color-borde-tabla)",
                padding: "5px 8px",
                fontSize: 10.5,
                textAlign: "center",
              }}
            >
              {nivel}
            </div>
          );
        })}
      </div>
    </div>
  );
}
