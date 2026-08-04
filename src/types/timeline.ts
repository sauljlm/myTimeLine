export interface Subperiodo {
  nombre: string;
  fecha_inicio: number;
  fecha_fin: number;
}

export interface Region {
  id: string;
  nombre: string;
  orden_vertical: number;
  color: string;
  fecha_inicio: number;
  fecha_fin: number;
  subperiodos?: Subperiodo[];
}

export interface RegionsFile {
  regions: Region[];
}

export interface EnlaceExterno {
  titulo: string;
  url: string;
}

export interface BloqueEvento {
  id: string;
  region: string;
  tipo: "evento";
  titulo: string;
  fecha_inicio: number;
  fecha_fin: number | null;
  descripcion_corta: string;
  imagenes: string[];
  links?: EnlaceExterno[];
}

export interface BloqueDiagramaJerarquico {
  id: string;
  region: string;
  tipo: "diagrama_jerarquico";
  titulo: string;
  // Año de referencia para ubicarlo horizontalmente en la línea de tiempo
  // (no siempre representa una fecha exacta, sino el período que resume).
  fecha_inicio?: number;
  niveles: string[];
}

export interface BloqueTablaComparativa {
  id: string;
  region: string;
  tipo: "tabla_comparativa";
  titulo?: string;
  fecha_inicio?: number;
  columnas: string[];
  filas: { etiqueta: string; valores: string[] }[];
}

export type Bloque =
  | BloqueEvento
  | BloqueDiagramaJerarquico
  | BloqueTablaComparativa;
