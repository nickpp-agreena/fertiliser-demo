import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedControlOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  disabled = false,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn("flex flex-row items-center", className)}>
      {options.map((option, index) => {
        const isFirst = index === 0
        const isLast = index === options.length - 1
        const isActive = value === option.value
        const isOptionDisabled = disabled || option.disabled

        // Determine background and text colors based on state
        let bgColor: string
        let textColor: string

        if (isOptionDisabled) {
          // Disabled state
          bgColor = isFirst ? "#CCCCCC" : "#E5E5E5"
          textColor = "#4D4D4D"
        } else if (isActive) {
          // Active state
          bgColor = "#6D57FF"
          textColor = "#FFFFFF"
        } else {
          // Inactive state
          bgColor = "#FFFFFF"
          textColor = "#0D0D0D"
        }

        // Border radius classes
        const radiusClass = isFirst
          ? "rounded-l"
          : isLast
            ? "rounded-r"
            : "rounded-none"

        // Border classes
        const borderClass = isFirst
          ? "border border-[#333333]"
          : "border border-[#333333] border-l-0"

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !isOptionDisabled && onValueChange(option.value)}
            disabled={isOptionDisabled}
            className={cn(
              "flex flex-row items-center gap-2 h-10 px-4 py-2 font-medium text-base leading-[150%]",
              radiusClass,
              borderClass,
              isOptionDisabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
          >
            {option.icon && (
              <div className="flex items-center justify-center w-4 h-4">
                {option.icon}
              </div>
            )}
            {option.label && <span>{option.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
