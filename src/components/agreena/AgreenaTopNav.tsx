import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgreenaTopNavProps {
  title: string
  onBack?: () => void
  onSave?: () => void
}

export function AgreenaTopNav({ title, onBack, onSave }: AgreenaTopNavProps) {
  return (
    <div className="w-[672px] h-[60px] bg-white border-b border-[#E3E3E3] flex items-center px-6 flex-shrink-0 relative">
      {/* Left section - Back button */}
      <div className="flex items-center gap-4 flex-1">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 h-auto text-[#0D0D0D] hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1 text-[14px] leading-[150%]">Back</span>
          </Button>
        )}
      </div>
      {/* Center section - Title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <h2 className="text-[16px] leading-[150%] font-medium text-[#0D0D0D]">
          {title}
        </h2>
      </div>
      {/* Right section - Save button */}
      <div className="flex items-center justify-end flex-1">
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="text-[14px] leading-[150%] text-[#0D0D0D] hover:bg-transparent"
          >
            Save and exit
          </Button>
        )}
      </div>
    </div>
  )
}
