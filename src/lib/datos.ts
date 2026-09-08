// Carga única de todos los datos de la línea de tiempo. Vive acá (y no en
// `app/page.tsx`) porque `timeScale.ts` también necesita recorrer todos los
// bloques para saber en qué franjas de tiempo hay contenido real y en
// cuáles no (ver la compresión de huecos vacíos en ese archivo). Tener una
// sola lista evita que las dos copias se desincronicen al agregar una
// región nueva.
import { Bloque, RegionsFile } from "@/types/timeline";
import regions from "@data/regions.json";
import prehistoria from "@data/prehistoria.json";
import eraDeHielo from "@data/era-de-hielo.json";
import mesopotamia from "@data/mesopotamia.json";
import egipto from "@data/egipto.json";
import roma from "@data/roma.json";
import persia from "@data/persia.json";
import grecia from "@data/grecia.json";
import esparta from "@data/esparta.json";
import edadMedia from "@data/edad-media.json";
import edadModerna from "@data/edad-moderna.json";
import china from "@data/china.json";
import japon from "@data/japon.json";
import india from "@data/india.json";
import islam from "@data/islam.json";
import costaRica from "@data/costa-rica.json";
import norteamerica from "@data/norteamerica.json";
import mexico from "@data/mexico.json";
import centroamerica from "@data/centroamerica.json";
import suramerica from "@data/suramerica.json";
import nicaragua from "@data/nicaragua.json";
import panama from "@data/panama.json";
import cuba from "@data/cuba.json";
import colombia from "@data/colombia.json";
import argentina from "@data/argentina.json";
import brasil from "@data/brasil.json";

export const regionsFile = regions as RegionsFile;

export const bloquesPorRegion: Record<string, Bloque[]> = {
  prehistoria: prehistoria as Bloque[],
  "era-de-hielo": eraDeHielo as Bloque[],
  mesopotamia: mesopotamia as Bloque[],
  egipto: egipto as Bloque[],
  roma: roma as Bloque[],
  persia: persia as Bloque[],
  grecia: grecia as Bloque[],
  esparta: esparta as Bloque[],
  "edad-media": edadMedia as Bloque[],
  "edad-moderna": edadModerna as Bloque[],
  china: china as Bloque[],
  japon: japon as Bloque[],
  india: india as Bloque[],
  islam: islam as Bloque[],
  "costa-rica": costaRica as Bloque[],
  norteamerica: norteamerica as Bloque[],
  mexico: mexico as Bloque[],
  centroamerica: centroamerica as Bloque[],
  suramerica: suramerica as Bloque[],
  nicaragua: nicaragua as Bloque[],
  panama: panama as Bloque[],
  cuba: cuba as Bloque[],
  colombia: colombia as Bloque[],
  argentina: argentina as Bloque[],
  brasil: brasil as Bloque[],
};

/** Todos los bloques de todas las regiones, sin agrupar. */
export const todosLosBloques: Bloque[] = Object.values(bloquesPorRegion).flat();
