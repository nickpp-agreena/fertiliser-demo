import { useState, useMemo, useEffect } from "react"
import type { Field, LimingPlanV3 } from "@/lib/limingTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle2, MapPin, Filter, X, CircleSlash } from "lucide-react"
import { getMaterialTypeColor } from "@/lib/utils"

interface LimingFieldSelectionV3Props {
  fields: Field[]
  selectedFieldIds: string[]
  onSelectionChange: (ids: string[]) => void
  planId: string
  planYear: string
  plans: LimingPlanV3[]
  notLimedFieldIds: Set<string>
  onMarkNotLimed: (fieldIds: string[]) => void
}

type SortOption = "name-asc" | "name-desc" | "hectares-desc" | "hectares-asc"

export function LimingFieldSelectionV3({
  fields,
  selectedFieldIds,
  onSelectionChange,
  planId,
  planYear,
  plans,
  notLimedFieldIds,
  onMarkNotLimed,
}: LimingFieldSelectionV3Props) {
  // Helper to get plan by ID
  const getPlan = (planId: string | null) => {
    if (!planId) return null
    return plans.find(p => p.id === planId) || null
  }

  // Helper to format plan summary (name, material, rate)
  const formatPlanSummary = (plan: { name: string; material_type: string | null; application_rate_t_per_ha: number } | null): string => {
    if (!plan) return ""
    const parts = [plan.name]
    if (plan.material_type) {
      parts.push(plan.material_type)
    }
    if (plan.application_rate_t_per_ha > 0) {
      parts.push(`${plan.application_rate_t_per_ha} t/ha`)
    }
    return parts.join(" • ")
  }

  // Find which plan (if any) has this field assigned for the same year
  // Exclude fields marked as "not limed"
  const getFieldAssignment = (fieldId: string) => {
    if (notLimedFieldIds.has(fieldId)) return null
    return plans.find(p => 
      p.id !== planId && 
      p.year === planYear && 
      p.field_ids.includes(fieldId)
    )
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [showPlanFilter, setShowPlanFilter] = useState(false)
  const [selectedPlanFilters, setSelectedPlanFilters] = useState<Set<string>>(new Set())
  const NOT_LIMED_FILTER_ID = "__not_limed__"

  // Get all unique plans for the current year (for filtering)
  const availablePlansForYear = useMemo(() => {
    return plans.filter(p => p.year === planYear && p.material_type !== null)
  }, [plans, planYear])

  // Filter fields based on search query and plan filter
  // Exclude "not limed" fields from assignment checks
  const filteredFields = useMemo(() => {
    let result = fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(field =>
        field.name.toLowerCase().includes(query) ||
        field.id.toLowerCase().includes(query)
      )
    }
    // Apply plan filter (including "not limed" option)
    if (selectedPlanFilters.size > 0) {
      const hasNotLimedFilter = selectedPlanFilters.has(NOT_LIMED_FILTER_ID)
      const planFilters = Array.from(selectedPlanFilters).filter(id => id !== NOT_LIMED_FILTER_ID)
      
      result = result.filter(field => {
        // Check if field matches "not limed" filter
        if (hasNotLimedFilter && notLimedFieldIds.has(field.id)) {
          return true
        }
        // Check if field matches plan filters
        if (planFilters.length > 0) {
          const assignedPlan = getFieldAssignment(field.id)
          const isAssignedToThis = plans.find(p => p.id === planId)?.field_ids.includes(field.id) || false
          const planForField = isAssignedToThis ? plans.find(p => p.id === planId) : assignedPlan
          if (planForField && planFilters.includes(planForField.id)) {
            return true
          }
        }
        // If only "not limed" filter is selected, show matching fields
        if (planFilters.length === 0 && hasNotLimedFilter) {
          return notLimedFieldIds.has(field.id)
        }
        // If only plan filters are selected, only show fields matching those plans
        if (!hasNotLimedFilter && planFilters.length > 0) {
          const assignedPlan = getFieldAssignment(field.id)
          const isAssignedToThis = plans.find(p => p.id === planId)?.field_ids.includes(field.id) || false
          const planForField = isAssignedToThis ? plans.find(p => p.id === planId) : assignedPlan
          return planForField && planFilters.includes(planForField.id)
        }
        return false
      })
    }
    return result
  }, [fields, searchQuery, selectedPlanFilters, planId, plans, notLimedFieldIds])

  // Sort filtered fields
  const sortedFields = useMemo(() => {
    const sorted = [...filteredFields]
    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case "hectares-desc":
        return sorted.sort((a, b) => (b.hectares || 0) - (a.hectares || 0))
      case "hectares-asc":
        return sorted.sort((a, b) => (a.hectares || 0) - (b.hectares || 0))
      default:
        return sorted
    }
  }, [filteredFields, sortOption])

  // Handle individual field selection
  // Allow selecting "not limed" fields so they can be reassigned
  const toggleField = (fieldId: string) => {
    onSelectionChange(
      selectedFieldIds.includes(fieldId)
        ? selectedFieldIds.filter(id => id !== fieldId)
        : [...selectedFieldIds, fieldId]
    )
  }

  // Handle select all - only select visible (filtered/sorted) fields
  const handleSelectAll = () => {
    const visibleFieldIds = sortedFields.map(field => field.id)
    onSelectionChange(visibleFieldIds)
  }


  // Handle mark as not limed
  const handleMarkNotLimed = () => {
    if (selectedFieldIds.length > 0) {
      onMarkNotLimed(selectedFieldIds)
      onSelectionChange([]) // Clear selection after marking
    }
  }

  // Handle plan filter toggle
  const handlePlanFilterToggle = (planId: string) => {
    setSelectedPlanFilters(prev => {
      const next = new Set(prev)
      if (next.has(planId)) {
        next.delete(planId)
      } else {
        next.add(planId)
      }
      return next
    })
  }

  // Handle apply filter
  const handleApplyFilter = () => {
    setShowPlanFilter(false)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedPlanFilters(new Set())
    setShowPlanFilter(false)
  }

  // Focus search on Cmd/Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
        searchInput?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    if (!showPlanFilter) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-filter-dropdown]') && !target.closest('[data-filter-button]')) {
        setShowPlanFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPlanFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Label className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Apply to Fields
          </Label>
          <p className="text-sm text-muted-foreground font-medium mt-1">Select fields to assign this plan to.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs px-2.5 py-1">
            {selectedFieldIds.length} of {fields.length} selected
          </Badge>
          <Button onClick={handleSelectAll} variant="outline" size="sm">
            Select All
          </Button>
          <Button 
            onClick={handleMarkNotLimed} 
            variant="outline" 
            size="sm"
            disabled={selectedFieldIds.length === 0}
            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-muted-foreground"
          >
            Mark as Not Limed
          </Button>
          <Button onClick={() => onSelectionChange([])} variant="ghost" size="sm">
            Clear
          </Button>
        </div>
      </div>

      {/* Search, Filter, and Sort */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-search-input
                type="text"
                placeholder="Search fields by name... (Cmd/Ctrl+F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus={false}
              />
            </div>

          {/* Filter Button */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPlanFilter(!showPlanFilter)}
              className="w-full sm:w-auto"
              data-filter-button
            >
              <Filter className="h-4 w-4 mr-2" />
              {selectedPlanFilters.size > 0 ? (
                <>
                  {selectedPlanFilters.size} filter{selectedPlanFilters.size !== 1 ? 's' : ''} applied
                </>
              ) : (
                'Filter by'
              )}
            </Button>

            {/* Filter Dropdown */}
            {showPlanFilter && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-[300px] bg-card border-2 rounded-lg shadow-lg z-50 p-4" data-filter-dropdown>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Filter by</Label>
                    {selectedPlanFilters.size > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {/* Not Limed Filter Option */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-not-limed"
                        checked={selectedPlanFilters.has(NOT_LIMED_FILTER_ID)}
                        onCheckedChange={() => handlePlanFilterToggle(NOT_LIMED_FILTER_ID)}
                      />
                      <Label
                        htmlFor="filter-not-limed"
                        className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                      >
                        <CircleSlash className="h-3 w-3 text-muted-foreground" />
                        Not Limed
                      </Label>
                    </div>
                    {availablePlansForYear.length > 0 ? (
                      availablePlansForYear.map(plan => (
                        <div key={plan.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-plan-${plan.id}`}
                            checked={selectedPlanFilters.has(plan.id)}
                            onCheckedChange={() => handlePlanFilterToggle(plan.id)}
                          />
                          <Label
                            htmlFor={`filter-plan-${plan.id}`}
                            className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                          >
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: getMaterialTypeColor(plan.material_type) }}
                            />
                            {plan.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No plans available for filtering</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      type="button"
                      onClick={handleApplyFilter}
                      className="flex-1"
                      size="sm"
                    >
                      Apply Filter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPlanFilter(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium whitespace-nowrap">Sort by:</Label>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="hectares-desc">Size (Largest First)</SelectItem>
                <SelectItem value="hectares-asc">Size (Smallest First)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="rounded-lg border bg-background p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {sortedFields.map((field) => {
            const isSelected = selectedFieldIds.includes(field.id)
            const isAssignedToThis = plans.find(p => p.id === planId)?.field_ids.includes(field.id) || false
            const assignedPlan = getFieldAssignment(field.id)
            const isNotLimed = notLimedFieldIds.has(field.id)

            // Get material type color for assigned fields
            const assignedPlanForColor = isAssignedToThis 
              ? plans.find(p => p.id === planId)
              : assignedPlan
            const materialColor = assignedPlanForColor?.material_type 
              ? getMaterialTypeColor(assignedPlanForColor.material_type)
              : null

            return (
              <div
                key={field.id}
                onClick={() => toggleField(field.id)}
                className={`
                  relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-200 h-32 cursor-pointer
                  hover:scale-[1.02] hover:shadow-lg hover:border-primary/40
                  ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md' : 'border-border/60 hover:border-primary/30 bg-card'}
                  ${assignedPlan && !isSelected ? 'bg-muted/40 border-muted-foreground/20' : ''}
                  ${isAssignedToThis && materialColor ? 'shadow-sm' : isAssignedToThis ? 'bg-primary/8 border-primary/60 shadow-sm' : ''}
                  ${isNotLimed ? 'opacity-75 bg-muted/20 border-muted-foreground/30' : ''}
                `}
                style={isAssignedToThis && materialColor ? {
                  backgroundColor: `${materialColor}15`,
                  borderColor: `${materialColor}60`,
                } : assignedPlan && materialColor ? {
                  backgroundColor: `${materialColor}10`,
                  borderColor: `${materialColor}40`,
                } : {}}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm block truncate text-foreground">{field.name}</span>
                    {field.hectares && (
                      <span className="text-xs text-muted-foreground font-medium mt-0.5 inline-block">{field.hectares.toFixed(1)} ha</span>
                    )}
                  </div>
                  <Checkbox
                    checked={isSelected}
                    className="mt-0.5 flex-shrink-0"
                  />
                </div>

                <div className="mt-2 space-y-1.5">
                  {isNotLimed && !isAssignedToThis ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                      <CircleSlash className="h-2.5 w-2.5 mr-1" />
                      Not Limed
                    </Badge>
                  ) : isAssignedToThis ? (
                    <>
                      <Badge 
                        variant="default" 
                        className="text-[10px] px-1.5 py-0.5 h-5"
                        style={materialColor ? {
                          backgroundColor: `${materialColor}30`,
                          borderColor: materialColor,
                          color: materialColor,
                        } : {}}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                        Assigned
                      </Badge>
                      <p className="text-xs text-muted-foreground truncate leading-tight">
                        {formatPlanSummary(getPlan(planId))}
                      </p>
                    </>
                  ) : assignedPlan ? (
                    <>
                      <Badge 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0.5 h-5"
                        style={materialColor ? {
                          backgroundColor: `${materialColor}25`,
                          borderColor: `${materialColor}60`,
                          color: materialColor,
                        } : {}}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                        Assigned
                      </Badge>
                      <p className="text-xs text-muted-foreground truncate leading-tight">
                        {formatPlanSummary(assignedPlan)}
                      </p>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                      <CircleSlash className="h-2.5 w-2.5 mr-1" />
                      Not Limed
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {sortedFields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No fields found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
