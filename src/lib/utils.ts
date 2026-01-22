import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PlanType } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Get color classes for plan types
export function getPlanTypeColor(planType: PlanType | "unassigned"): string {
    switch (planType) {
        case "synthetic":
            return "border-l-4 border-l-[hsl(var(--plan-synthetic))]"
        case "organic":
            return "border-l-4 border-l-[hsl(var(--plan-organic))]"
        case "none":
            return "border-l-4 border-l-[hsl(var(--plan-none))]"
        case "unassigned":
            return "border-l-4 border-l-[hsl(var(--plan-unassigned))]"
        default:
            return ""
    }
}

// Get background color classes for plan types
export function getPlanTypeBgColor(planType: PlanType | "unassigned"): string {
    switch (planType) {
        case "synthetic":
            return "bg-[hsl(var(--plan-synthetic))]/10"
        case "organic":
            return "bg-[hsl(var(--plan-organic))]/10"
        case "none":
            return "bg-[hsl(var(--plan-none))]/10"
        case "unassigned":
            return "bg-[hsl(var(--plan-unassigned))]/10"
        default:
            return ""
    }
}

// Get text color classes for plan types
export function getPlanTypeTextColor(planType: PlanType | "unassigned"): string {
    switch (planType) {
        case "synthetic":
            return "text-[hsl(var(--plan-synthetic))]"
        case "organic":
            return "text-[hsl(var(--plan-organic))]"
        case "none":
            return "text-[hsl(var(--plan-none))]"
        case "unassigned":
            return "text-[hsl(var(--plan-unassigned))]"
        default:
            return ""
    }
}

// Get dot/badge color for plan type
export function getPlanTypeDotColor(planType: PlanType | "unassigned"): string {
    switch (planType) {
        case "synthetic":
            return "bg-[hsl(var(--plan-synthetic))]"
        case "organic":
            return "bg-[hsl(var(--plan-organic))]"
        case "none":
            return "bg-[hsl(var(--plan-none))]"
        case "unassigned":
            return "bg-[hsl(var(--plan-unassigned))]"
        default:
            return ""
    }
}

// Get material type color for liming plans
export function getMaterialTypeColor(material_type: "limestone" | "dolomite" | null): string {
    switch (material_type) {
        case "limestone":
            return "#6B7A6B" // Dark grey-green for limestone (active, distinct)
        case "dolomite":
            return "#8B7355" // Darker brown/tan for dolomite - improved readability
        default:
            return "hsl(var(--primary))" // Use primary color when no material type is set
    }
}
