import { LocationDotIcon } from "@/components/icons/LocationDotIcon"

interface AgreenaMapPanelProps {
  pin?: {id: string, x: number, y: number} | null
}

export function AgreenaMapPanel({ pin }: AgreenaMapPanelProps) {
  return (
    <div className="w-full h-full bg-green-100 flex items-center justify-center text-green-700 text-2xl relative overflow-hidden">
      <span className="z-0">Map</span>
      {pin && (
        <div
          key={pin.id}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'pinDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <LocationDotIcon size={32} className="text-[#4730DB]" />
        </div>
      )}
    </div>
  )
}
