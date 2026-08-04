import { BloqueTablaComparativa } from "@/types/timeline";

export function TablaComparativa({ bloque }: { bloque: BloqueTablaComparativa }) {
  return (
    <div style={{ width: "fit-content" }}>
      {bloque.titulo && (
        <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
          {bloque.titulo}
        </p>
      )}
      <table
        style={{
          borderCollapse: "collapse",
          fontSize: 10.5,
          border: "1px solid var(--color-borde-tabla)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                background: "var(--color-header-tabla)",
                border: "1px solid var(--color-borde-tabla)",
                padding: "4px 8px",
              }}
            />
            {bloque.columnas.map((col) => (
              <th
                key={col}
                style={{
                  background: "var(--color-header-tabla)",
                  border: "1px solid var(--color-borde-tabla)",
                  padding: "4px 8px",
                  textAlign: "left",
                  fontWeight: 700,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bloque.filas.map((fila) => (
            <tr key={fila.etiqueta}>
              <td
                style={{
                  border: "1px solid var(--color-borde-tabla)",
                  padding: "4px 8px",
                  fontWeight: 700,
                  background: "var(--color-header-tabla)",
                }}
              >
                {fila.etiqueta}
              </td>
              {fila.valores.map((valor, i) => (
                <td
                  key={i}
                  style={{
                    border: "1px solid var(--color-borde-tabla)",
                    padding: "4px 8px",
                  }}
                >
                  {valor}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
