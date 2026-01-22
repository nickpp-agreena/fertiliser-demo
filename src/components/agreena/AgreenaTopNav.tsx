import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon"
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgreenaTopNavProps {
  title?: string
  titleClickable?: boolean
  titleOptions?: { value: string; label: string }[]
  titleValue?: string
  onTitleChange?: (value: string) => void
  onBack?: () => void
  rightAction?: string
  onRightAction?: () => void
}

export function AgreenaTopNav({
  title,
  titleClickable = false,
  titleOptions,
  titleValue,
  onTitleChange,
  onBack,
  rightAction = "Right Action",
  onRightAction,
}: AgreenaTopNavProps) {
  return (
    <div className="w-[672px] h-[56px] bg-white border-b border-[#F2F2F2] flex items-center justify-between px-6 py-2 flex-shrink-0">
      {/* Left section - Back button */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#4730DB] underline text-[16px] leading-[150%] font-medium hover:no-underline"
          >
            <ChevronLeftIcon size={16} />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Center section - Title */}
      <div className="flex-1 flex justify-center">
        {titleClickable && titleOptions ? (
          <Select value={titleValue} onValueChange={onTitleChange}>
            <SelectTrigger className="w-auto border-none shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 data-[placeholder]:text-[#0D0D0D]">
              <SelectValue className="text-[16px] leading-[150%] font-medium text-[#0D0D0D]" />
            </SelectTrigger>
            <SelectContent>
              {titleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : title ? (
          <h2 className="text-[16px] leading-[150%] font-medium text-[#0D0D0D]">
            {title}
          </h2>
        ) : null}
      </div>

      {/* Right section - Action button */}
      <div className="flex items-center">
        {onRightAction && (
          <button
            onClick={onRightAction}
            className="text-[#4730DB] underline text-[16px] leading-[150%] font-medium hover:no-underline"
          >
            {rightAction}
          </button>
        )}
      </div>
    </div>
  )
}
