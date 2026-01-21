export type Field = {
    id: string
    name: string
    assignedPlanId: string | null
    hectares?: number
}

export type PlanType = "synthetic" | "organic" | "none"

export type SyntheticFertilizer = {
    id: string
    n?: number
    p?: number
    pUnit?: "P" | "P2O5"
    k?: number
    kUnit?: "K" | "K2O"
    hasInhibitor?: boolean
    inhibitorAmount?: number
}

export type OrganicFertilizer = {
    id: string
    organicType?: string
    organicForm?: "solid" | "liquid"
    applicationRate?: number
    hasInhibitor?: boolean
    inhibitorAmount?: number
}

export type Fertilizer = SyntheticFertilizer | OrganicFertilizer

export type Plan = {
    id: string
    name: string
    type: PlanType // Can be "none" or derived from fertilizers
    fertilizers: Fertilizer[] // Array of fertilizers
    // None
    noFertilizerReason?: string
    // Legacy fields for migration (will be removed after migration)
    n?: number
    p?: number
    pUnit?: "P" | "P2O5"
    k?: number
    kUnit?: "K" | "K2O"
    organicType?: string
    organicForm?: "solid" | "liquid"
    applicationRate?: number
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
