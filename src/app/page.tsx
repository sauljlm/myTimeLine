import { TimelineCanvas } from "@/components/TimelineCanvas";
import { Bloque, RegionsFile } from "@/types/timeline";
import regionsFile from "@data/regions.json";
import prehistoria from "@data/prehistoria.json";
import mesopotamia from "@data/mesopotamia.json";
import egipto from "@data/egipto.json";
import roma from "@data/roma.json";
import persia from "@data/persia.json";
import grecia from "@data/grecia.json";
import edadMedia from "@data/edad-media.json";
import china from "@data/china.json";
import costaRica from "@data/costa-rica.json";

export default function Home() {
  const bloquesPorRegion: Record<string, Bloque[]> = {
    prehistoria: prehistoria as Bloque[],
    mesopotamia: mesopotamia as Bloque[],
    egipto: egipto as Bloque[],
    roma: roma as Bloque[],
    persia: persia as Bloque[],
    grecia: grecia as Bloque[],
    "edad-media": edadMedia as Bloque[],
    china: china as Bloque[],
    "costa-rica": costaRica as Bloque[],
  };

  return (
    <TimelineCanvas
      regionsFile={regionsFile as RegionsFile}
      bloquesPorRegion={bloquesPorRegion}
    />
  );
}
