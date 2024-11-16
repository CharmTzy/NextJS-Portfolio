import Image from "next/image";
import {useInView} from "../hooks/useInView";
export default function MapCard() {
  const {ref, isInView} = useInView(0.2);
  return (
    <div ref={ref} className={`bg-white rounded-3xl overflow-hidden shadow-sm  ${isInView ? "animate-slide-up" : "opacity-0"}`}>
      <Image src="/map.png" alt="Map of Austin" width={300} height={150} className="w-full h-48 sm:h-32 object-cover" priority />
    </div>
  );
}
