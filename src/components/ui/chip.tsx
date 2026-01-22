import * as React from "react"
import { cn } from "@/lib/utils"

export type ChipType = "success" | "neutral" | "info" | "warning" | "danger"
export type ChipSize = "small" | "big"

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  type: ChipType
  size?: ChipSize
  label?: string
  iconOnly?: boolean
  icon?: React.ReactNode
}

const chipStyles: Record<ChipType, { bg: string; text: string }> = {
  success: {
    bg: "#E1F1E2",
    text: "#15863D",
  },
  neutral: {
    bg: "#F2F2F2",
    text: "#0D0D0D",
  },
  info: {
    bg: "#D2D9F9",
    text: "#0A32D6",
  },
  warning: {
    bg: "#FFED9D",
    text: "#662C09",
  },
  danger: {
    bg: "#FEE2E2",
    text: "#B91C1C",
  },
}

export function Chip({
  type,
  size = "small",
  label,
  iconOnly = false,
  icon,
  className,
  ...props
}: ChipProps) {
  const styles = chipStyles[type]

  if (iconOnly) {
    // Icon-only chips are circular
    const dimension = size === "small" ? "w-4 h-4" : "w-6 h-6"
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          dimension,
          className
        )}
        style={{
          backgroundColor: styles.bg,
          color: styles.text,
        }}
        {...props}
      >
        {icon && <div className="flex items-center justify-center">{icon}</div>}
      </div>
    )
  }

  // Chips with labels
  const heightClass = size === "small" ? "h-4" : "h-6"
  const paddingClass = size === "small" ? "px-2" : "px-2 py-0.5"
  const textSizeClass = size === "small" ? "text-xs" : "text-sm"

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center gap-1 rounded-[8px] font-bold leading-[150%]",
        heightClass,
        paddingClass,
        textSizeClass,
        className
      )}
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
      }}
      {...props}
    >
      {icon && <div className="flex items-center justify-center">{icon}</div>}
      {label && <span>{label}</span>}
    </div>
  )
}
