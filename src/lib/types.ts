export type Field = {
    id: string
    name: string
    assignedPlanId: string | null
}

export type PlanType = "synthetic" | "organic" | "none"

export type Plan = {
    id: string
    name: string
    type: PlanType
    // Synthetic
    n?: number
    p?: number
    pUnit?: "P" | "P2O5"
    k?: number
    kUnit?: "K" | "K2O"
    // Organic
    organicType?: string
    organicForm?: "solid" | "liquid"
    applicationRate?: number // Common field for organic rate
    // Common for Synthetic & Organic
    hasInhibitor?: boolean
    inhibitorAmount?: number
    // None
    noFertilizerReason?: string
}

export const ORGANIC_TYPES = [
    "Chicken Manure",
    "Cow Manure",
    "Compost",
    "Slurry",
    "Other"
]

export const NO_FERT_REASONS = [
    "Soil rich in nutrients",
    "Crop rotation",
    "Fallow year",
    "Cost saving",
    "Other"
]
