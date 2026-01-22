import { useState, useMemo, useEffect } from "react"
import type { Field, LimingPlanV3 } from "@/lib/limingTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, CheckCircle2, Filter, X, CircleSlash, Calendar, Grid3x3, List } from "lucide-react"
import { getMaterialTypeColor } from "@/lib/utils"

interface LimingFieldsViewV3Props {
  fields: Field[]
  plans: LimingPlanV3[]
  notLimedFieldIds: Set<string>
  availableYears: string[]
}

type SortOption = "name-asc" | "name-desc" | "hectares-desc" | "hectares-asc"

export function LimingFieldsViewV3({
  fields,
  plans,
  notLimedFieldIds,
  availableYears,
}: LimingFieldsViewV3Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [showPlanFilter, setShowPlanFilter] = useState(false)
  const [selectedPlanFilters, setSelectedPlanFilters] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "accordion">("grid")
  const NOT_LIMED_FILTER_ID = "__not_limed__"

  // Calculate the most recent year that has a liming plan
  const mostRecentYearWithPlan = useMemo(() => {
    if (plans.length === 0) {
      // If no plans exist, default to the first available year
      return availableYears[0] || "2025"
    }
    // Get all years from plans, filter out "pre-5-years" and convert to numbers
    const planYears = plans
      .map(p => p.year)
      .filter(year => year !== "pre-5-years")
      .map(year => parseInt(year, 10))
      .filter(year => !isNaN(year))
    
    if (planYears.length === 0) {
      // If all plans are "pre-5-years", default to first available year
      return availableYears[0] || "2025"
    }
    
    // Return the most recent year as a string
    return String(Math.max(...planYears))
  }, [plans, availableYears])

  const [selectedYear, setSelectedYear] = useState<string>(mostRecentYearWithPlan)

  // Helper to get plan by ID
  const getPlan = (planId: string | null): LimingPlanV3 | undefined => {
    if (!planId) return undefined
    return plans.find(p => p.id === planId)
  }

  // Helper to format plan summary for display
  const formatPlanSummary = (plan: LimingPlanV3 | undefined): string => {
    if (!plan) return "No Plan"
    const material = plan.material_type ? plan.material_type.charAt(0).toUpperCase() + plan.material_type.slice(1) : "No Material"
    const rate = plan.application_rate_t_per_ha > 0 ? `${plan.application_rate_t_per_ha} t/ha` : "No Rate"
    return `${plan.name} • ${material} • ${rate}`
  }

  // Update selectedYear when mostRecentYearWithPlan changes (e.g., when first plan is added)
  // Only update if the current selected year has no plans
  useEffect(() => {
    const hasPlansForSelectedYear = plans.some(p => p.year === selectedYear)
    if (!hasPlansForSelectedYear && mostRecentYearWithPlan !== selectedYear) {
      setSelectedYear(mostRecentYearWithPlan)
    }
  }, [mostRecentYearWithPlan, plans, selectedYear])

  // Get plans filtered by selected year
  const plansForSelectedYear = useMemo(() => {
    return plans.filter(p => p.year === selectedYear)
  }, [plans, selectedYear])

  // Find which plan (if any) has this field assigned for the selected year
  const getFieldAssignment = (fieldId: string): LimingPlanV3 | undefined => {
    return plansForSelectedYear.find(p => p.field_ids.includes(fieldId))
  }

  // Check if a field is "not limed" for the selected year
  // A field is "not limed" if it has no plan assignment for that year
  const isFieldNotLimedForYear = (fieldId: string): boolean => {
    return !getFieldAssignment(fieldId)
  }

  // Get all unique plans for filtering (filtered by year)
  const availablePlans = useMemo(() => {
    return plansForSelectedYear.filter(p => p.material_type !== null)
  }, [plansForSelectedYear])

  // Filter fields based on search query and plan filter
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
        // Check if field matches "not limed" filter (year-specific)
        if (hasNotLimedFilter && isFieldNotLimedForYear(field.id)) {
          return true
        }
        // Check if field matches plan filters
        if (planFilters.length > 0) {
          const assignedPlan = getFieldAssignment(field.id)
          if (assignedPlan && planFilters.includes(assignedPlan.id)) {
            return true
          }
        }
        // If only "not limed" filter is selected, show matching fields
        if (planFilters.length === 0 && hasNotLimedFilter) {
          return isFieldNotLimedForYear(field.id)
        }
        // If only plan filters are selected, only show fields matching those plans
        if (!hasNotLimedFilter && planFilters.length > 0) {
          const assignedPlan = getFieldAssignment(field.id)
          return assignedPlan && planFilters.includes(assignedPlan.id)
        }
        return false
      })
    }
    return result
  }, [fields, searchQuery, selectedPlanFilters, plansForSelectedYear, selectedYear])

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

  // Group fields by plan for accordion view
  const fieldsByPlan = useMemo(() => {
    const grouped: {
      plans: Array<{ plan: LimingPlanV3; fields: Field[] }>
      notLimed: Field[]
    } = {
      plans: [],
      notLimed: [],
    }

    // Group fields by their assigned plan (year-specific)
    sortedFields.forEach(field => {
      const assignedPlan = getFieldAssignment(field.id)
      if (assignedPlan) {
        const existingGroup = grouped.plans.find(g => g.plan.id === assignedPlan.id)
        if (existingGroup) {
          existingGroup.fields.push(field)
        } else {
          grouped.plans.push({ plan: assignedPlan, fields: [field] })
        }
      } else {
        // Fields without assignment for this year go to not limed
        grouped.notLimed.push(field)
      }
    })

    return grouped
  }, [sortedFields, plansForSelectedYear, selectedYear])

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
        const searchInput = document.querySelector('[data-fields-view-search]') as HTMLInputElement
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
      if (!target.closest('[data-fields-view-filter-dropdown]') && !target.closest('[data-fields-view-filter-button]')) {
        setShowPlanFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPlanFilter])

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium whitespace-nowrap flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Year:
        </Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search, Filter, and Sort */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-fields-view-search
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
              data-fields-view-filter-button
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
              <div className="absolute top-full left-0 mt-2 w-full sm:w-[300px] bg-card border-2 rounded-lg shadow-lg z-50 p-4" data-fields-view-filter-dropdown>
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
                        id="fields-view-filter-not-limed"
                        checked={selectedPlanFilters.has(NOT_LIMED_FILTER_ID)}
                        onCheckedChange={() => handlePlanFilterToggle(NOT_LIMED_FILTER_ID)}
                      />
                      <Label
                        htmlFor="fields-view-filter-not-limed"
                        className="text-sm cursor-pointer flex items-center gap-2 flex-1"
                      >
                        <CircleSlash className="h-3 w-3 text-muted-foreground" />
                        Not Limed
                      </Label>
                    </div>
                    {availablePlans.length > 0 ? (
                      availablePlans.map(plan => (
                        <div key={plan.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fields-view-filter-plan-${plan.id}`}
                            checked={selectedPlanFilters.has(plan.id)}
                            onCheckedChange={() => handlePlanFilterToggle(plan.id)}
                          />
                          <Label
                            htmlFor={`fields-view-filter-plan-${plan.id}`}
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

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium whitespace-nowrap">View:</Label>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "accordion")}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3x3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="accordion" aria-label="Accordion view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === "grid" ? (
        <>
          {/* Scrollable Grid - Read Only */}
          <div className="rounded-lg border bg-background p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedFields.map((field) => {
                const assignedPlan = getFieldAssignment(field.id)
                const materialColor = assignedPlan?.material_type 
                  ? getMaterialTypeColor(assignedPlan.material_type)
                  : null
                const isNotLimed = isFieldNotLimedForYear(field.id)

                return (
                  <div
                    key={field.id}
                    className={`
                      relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-200 h-32
                      ${isNotLimed ? 'opacity-60 bg-muted/30 border-muted-foreground/20' : ''}
                      ${assignedPlan && materialColor && !isNotLimed ? 'shadow-sm' : !isNotLimed ? 'border-border/60 bg-card' : ''}
                    `}
                    style={assignedPlan && materialColor && !isNotLimed ? {
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
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {isNotLimed ? (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                          <CircleSlash className="h-2.5 w-2.5 mr-1" />
                          Not Limed
                        </Badge>
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
              No fields found matching your search and filter criteria.
            </div>
          )}
        </>
      ) : (
        <>
          {/* Accordion View - Organized by Plan */}
          <div className="rounded-lg border bg-background">
            <Accordion type="multiple" className="w-full">
              {/* Plans */}
              {fieldsByPlan.plans.map(({ plan, fields: planFields }) => {
                const materialColor = plan.material_type 
                  ? getMaterialTypeColor(plan.material_type)
                  : null

                return (
                  <AccordionItem key={plan.id} value={plan.id} className="border-b">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="h-2.5 w-2.5 rounded-full ring-2" 
                          style={{ 
                            backgroundColor: materialColor || "transparent",
                            borderColor: materialColor ? `${materialColor}40` : "transparent",
                            boxShadow: materialColor ? `0 0 0 2px ${materialColor}20` : "none"
                          }}
                        />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-sm">{plan.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {plan.material_type && `${plan.material_type.charAt(0).toUpperCase() + plan.material_type.slice(1)} • `}
                            {plan.application_rate_t_per_ha > 0 && `${plan.application_rate_t_per_ha} t/ha • `}
                            Year {plan.year}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {planFields.length} field{planFields.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                        {planFields.map((field) => {
                          const materialColor = plan.material_type 
                            ? getMaterialTypeColor(plan.material_type)
                            : null

                          return (
                            <div
                              key={field.id}
                              className="relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-200 h-32 bg-card"
                              style={materialColor ? {
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
                              </div>
                              <div className="mt-2">
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
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}

              {/* Not Limed Fields */}
              {fieldsByPlan.notLimed.length > 0 && (
                <AccordionItem value="not-limed" className="border-b">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-3 flex-1">
                      <CircleSlash className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm">Not Limed</div>
                        <div className="text-xs text-muted-foreground">
                          Fields without liming application
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                        {fieldsByPlan.notLimed.length} field{fieldsByPlan.notLimed.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                      {fieldsByPlan.notLimed.map((field) => (
                        <div
                          key={field.id}
                          className="relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-200 h-32 opacity-60 bg-muted/30 border-muted-foreground/20"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm block truncate text-foreground">{field.name}</span>
                              {field.hectares && (
                                <span className="text-xs text-muted-foreground font-medium mt-0.5 inline-block">{field.hectares.toFixed(1)} ha</span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                              <CircleSlash className="h-2.5 w-2.5 mr-1" />
                              Not Limed
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {fieldsByPlan.plans.length === 0 && fieldsByPlan.notLimed.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No fields found matching your search and filter criteria.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
