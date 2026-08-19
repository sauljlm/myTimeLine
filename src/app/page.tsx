import { TimelineCanvas } from "@/components/TimelineCanvas";
import { bloquesPorRegion, regionsFile } from "@/lib/datos";

export default function Home() {
  return (
    <TimelineCanvas
      regionsFile={regionsFile}
      bloquesPorRegion={bloquesPorRegion}
    />
  );
}
