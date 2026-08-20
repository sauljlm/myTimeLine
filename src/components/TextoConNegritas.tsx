"use client";

import { Fragment } from "react";

/**
 * Las descripciones de los bloques marcan sus puntos importantes con
 * `**negrita**`, la convención de Markdown. No se usa una librería entera de
 * Markdown para esto: el texto no admite ninguna otra marca, y un parser de
 * una sola regla se lee mejor que la dependencia.
 *
 * `whiteSpace: "pre-line"` en el contenedor sigue encargándose de los saltos
 * de línea, así que aquí solo hay que partir por los pares de asteriscos.
 *
 * Se usa [\s\S] en vez del flag /s porque el tsconfig del proyecto apunta a
 * un target anterior a es2018, donde ese flag no existe.
 */
export function TextoConNegritas({ texto }: { texto: string }) {
  const partes = texto.split(/\*\*([\s\S]+?)\*\*/g);
  return (
    <>
      {partes.map((parte, i) =>
        // Los índices impares son lo que iba entre asteriscos.
        i % 2 === 1 ? (
          <strong key={i} style={{ fontWeight: 700 }}>
            {parte}
          </strong>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
