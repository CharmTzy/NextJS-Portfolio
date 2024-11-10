import Image from "next/image";

export default function MapCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <Image src="/map.png" alt="Map of Austin" width={300} height={150} className="w-full h-48 sm:h-32 object-cover" priority/>
    </div>
  );
}
