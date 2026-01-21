export type LimingPlan = {
  id: string
  name: string
  year: string | "pre-5-years"
  isHistorical?: boolean
  historicalYear?: string // Optional specific year for historical plans (2020 or earlier)
  material_type: "limestone" | "dolomite" | null
  application_rate_t_per_ha: number
  field_ids: string[]
  area_ha: number // Derived from selected fields
}

export type LimingHistory = {
  appliedLast5Years: boolean | null
  appliedBefore5Years: boolean | null
  lastAppliedYearBand: "5-7-years-ago" | "8-10-years-ago" | "more-than-10-years-ago" | null
}

export type Field = {
  id: string
  name: string
  hectares?: number
}

// V2 Types - Simplified liming history and plans
export type LimingHistoryV2 = {
  appliedLast20Years: boolean | null
  lastAppliedYear: string | null // Year from 2025-2005, or null if not applied
}

export type LimingPlanV2 = {
  id: string
  name: string
  year: string // Actual year (2025-2005), no "pre-5-years" special case
  material_type: "limestone" | "dolomite" | null
  application_rate_t_per_ha: number
  field_ids: string[]
  area_ha: number // Derived from selected fields
}
