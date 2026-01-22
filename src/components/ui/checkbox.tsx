"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { CheckCircleIcon } from "@/components/icons/CheckCircleIcon"
import { DashIcon } from "@/components/icons/DashIcon"

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "danger"
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant = "default", checked, ...props }, ref) => {
  const isDanger = variant === "danger"
  const borderColor = isDanger ? "#B91C1C" : "#6D57FF"
  const isIndeterminate = checked === "indeterminate"

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      className={cn(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-[4px] border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
        // Unchecked state
        "bg-white border-[#6D57FF]",
        // Checked/Indeterminate state
        "data-[state=checked]:bg-[#6D57FF] data-[state=indeterminate]:bg-[#6D57FF]",
        // Danger variant
        isDanger && "border-[#B91C1C] data-[state=checked]:bg-[#B91C1C] data-[state=indeterminate]:bg-[#B91C1C]",
        // Disabled state
        "disabled:bg-[#CCCCCC] disabled:border-[#CCCCCC]",
        className
      )}
      style={{
        borderColor: props.disabled ? "#CCCCCC" : borderColor,
        backgroundColor: props.disabled
          ? "#CCCCCC"
          : undefined,
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "grid place-content-center text-current",
          props.disabled ? "text-[#4D4D4D]" : "text-white"
        )}
      >
        {isIndeterminate ? (
          <DashIcon size={12} />
        ) : (
          <CheckCircleIcon size={12} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
