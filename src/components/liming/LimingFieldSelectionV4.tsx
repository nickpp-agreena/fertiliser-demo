import { useState, useMemo, useEffect } from "react"
import type { Field, LimingPlanV3 } from "@/lib/limingTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, CircleSlash, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { getMaterialTypeColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { LocationDotIcon } from "@/components/icons/LocationDotIcon"
import { RulerTriangleIcon } from "@/components/icons/RulerTriangleIcon"
import { SortIcon } from "@/components/icons/SortIcon"
import { SortUpIcon } from "@/components/icons/SortUpIcon"
import { SortDownIcon } from "@/components/icons/SortDownIcon"
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon"

interface LimingFieldSelectionV4Props {
  fields: Field[]
  selectedFieldIds: string[]
  onSelectionChange: (ids: string[]) => void
  planId: string
  planYear: string
  plans: LimingPlanV3[]
  notLimedFieldIds: Set<string>
  onMarkNotLimed: (fieldIds: string[]) => void
  onMapClick?: () => void
}

type SortColumn = "name" | "hectares"

export function LimingFieldSelectionV4({
  fields,
  selectedFieldIds,
  onSelectionChange,
  planId,
  planYear,
  plans,
  notLimedFieldIds,
  onMarkNotLimed,
  onMapClick,
}: LimingFieldSelectionV4Props) {
  // Find which plan (if any) has this field assigned for the same year
  const getFieldAssignment = (fieldId: string) => {
    if (notLimedFieldIds.has(fieldId)) return null
    return plans.find(p => 
      p.id !== planId && 
      p.year === planYear && 
      p.field_ids.includes(fieldId)
    )
  }

  // Get status for a field (Not Limed, Limestone, Dolomite, etc.)
  const getFieldStatus = (fieldId: string): string => {
    if (notLimedFieldIds.has(fieldId)) {
      return "Not Limed"
    }
    const isAssignedToThis = plans.find(p => p.id === planId)?.field_ids.includes(fieldId) || false
    const assignedPlan = isAssignedToThis 
      ? plans.find(p => p.id === planId)
      : getFieldAssignment(fieldId)
    
    if (assignedPlan?.material_type) {
      // Capitalize first letter
      return assignedPlan.material_type.charAt(0).toUpperCase() + assignedPlan.material_type.slice(1)
    }
    return "Not Limed"
  }


  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState<SortColumn>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showPlanFilter, setShowPlanFilter] = useState(false)
  const [selectedPlanFilters, setSelectedPlanFilters] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const NOT_LIMED_FILTER_ID = "__not_limed__"

  // Get all unique plans for the current year (for filtering)
  const availablePlansForYear = useMemo(() => {
    return plans.filter(p => p.year === planYear && p.material_type !== null)
  }, [plans, planYear])

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
        if (hasNotLimedFilter && notLimedFieldIds.has(field.id)) {
          return true
        }
        if (planFilters.length > 0) {
          const assignedPlan = getFieldAssignment(field.id)
          const isAssignedToThis = plans.find(p => p.id === planId)?.field_ids.includes(field.id) || false
          const planForField = isAssignedToThis ? plans.find(p => p.id === planId) : assignedPlan
          if (planForField && planFilters.includes(planForField.id)) {
            return true
          }
        }
        if (planFilters.length === 0 && hasNotLimedFilter) {
          return notLimedFieldIds.has(field.id)
        }
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
  }, [fields, searchQuery, selectedPlanFilters, planId, plans, notLimedFieldIds, planYear])

  // Sort filtered fields
  const sortedFields = useMemo(() => {
    const sorted = [...filteredFields]
    return sorted.sort((a, b) => {
      let comparison = 0
      switch (sortColumn) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "hectares":
          comparison = (a.hectares || 0) - (b.hectares || 0)
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredFields, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedFields.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFields = sortedFields.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPlanFilters, sortColumn, sortDirection])

  // Handle individual field selection
  const toggleField = (fieldId: string) => {
    onSelectionChange(
      selectedFieldIds.includes(fieldId)
        ? selectedFieldIds.filter(id => id !== fieldId)
        : [...selectedFieldIds, fieldId]
    )
  }

  // Handle select all - toggle selection for visible (paginated) fields
  const handleSelectAll = (checked: boolean) => {
    const visibleFieldIds = paginatedFields.map(field => field.id)
    if (checked) {
      // Select all visible fields
      onSelectionChange([...new Set([...selectedFieldIds, ...visibleFieldIds])])
    } else {
      // Unselect all visible fields
      onSelectionChange(selectedFieldIds.filter(id => !visibleFieldIds.includes(id)))
    }
  }

  // Handle mark as not limed
  const handleMarkNotLimed = () => {
    if (selectedFieldIds.length > 0) {
      onMarkNotLimed(selectedFieldIds)
      onSelectionChange([])
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


  // Handle sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Get sort icon for column
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <SortIcon className="w-4 h-4 text-[#333333]" />
    }
    return sortDirection === "asc" 
      ? <SortUpIcon className="w-4 h-4 text-[#333333]" />
      : <SortDownIcon className="w-4 h-4 text-[#333333]" />
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

  const allVisibleSelected = paginatedFields.length > 0 && paginatedFields.every(f => selectedFieldIds.includes(f.id))
  const someVisibleSelected = paginatedFields.some(f => selectedFieldIds.includes(f.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[24px] leading-[130%] font-medium text-[#000000]">Apply to Fields</h2>
          <p className="text-sm text-muted-foreground font-medium mt-1">Select fields to assign this plan to.</p>
        </div>
      </div>

      {/* Search, Filter, and Sort */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            {/* Filter Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlanFilter(!showPlanFilter)}
                className="w-[160px] h-[40px] bg-white border border-[#333333] rounded-[4px] flex flex-row justify-between items-center px-4 py-[10px] gap-4 hover:opacity-90"
                data-filter-button
              >
                <span className="text-[14px] leading-[150%] font-medium text-[#0D0D0D]">
                  {selectedPlanFilters.size > 0 ? (
                    <>
                      {selectedPlanFilters.size} filter{selectedPlanFilters.size !== 1 ? 's' : ''} applied
                    </>
                  ) : (
                    'Filter by'
                  )}
                </span>
                <ChevronDownIcon size={16} className="text-[#4730DB]" />
              </button>

              {/* Filter Dropdown */}
              {showPlanFilter && (
                <div className="absolute top-full left-0 mt-2 w-[300px] bg-card border-2 rounded-lg shadow-lg z-50 p-4" data-filter-dropdown>
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

            {/* Search Bar */}
            <div className="flex flex-col items-start gap-2 w-[212px] h-[40px]">
              <div className="box-border flex flex-row justify-between items-center pl-4 pr-3 py-[10px] gap-4 w-[212px] h-[40px] bg-white border border-[#333333] rounded-[4px]">
                <input
                  data-search-input
                  type="text"
                  placeholder="Search field ID or name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-[14px] leading-[150%] font-medium text-[#747474] placeholder:text-[#747474] bg-transparent border-0 outline-0 min-w-0"
                  autoFocus={false}
                />
                <div className="flex flex-col justify-center items-center flex-shrink-0">
                  <Search className="w-[14px] h-[14px] text-[#333333]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleMarkNotLimed} 
              disabled={selectedFieldIds.length === 0}
              className="h-[40px] border border-[#4730DB] rounded-[8px] text-[#4730DB] text-[14px] leading-[150%] font-medium px-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4730DB]/5 transition-colors"
            >
              Mark as Not Limed
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border bg-background p-4">
        <div className="flex flex-col overflow-y-auto">
          {/* Table Header */}
          <div className="flex flex-row border-b border-[#E5E5E5] h-[37px]">
            {/* Checkbox column */}
            <div className="flex flex-col justify-center items-center p-4 w-[48px]">
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                className={someVisibleSelected && !allVisibleSelected ? "data-[state=checked]:bg-[#6D57FF]" : ""}
              />
            </div>
            {/* Field name column */}
            <div className="flex flex-col justify-center items-start p-2 px-4 w-[231px]">
              <div className="flex flex-row items-center gap-1">
                <span className="text-[14px] leading-[150%] font-normal text-[#333333]">Field name</span>
                <button
                  onClick={() => handleSort("name")}
                  className="hover:opacity-70"
                >
                  {getSortIcon("name")}
                </button>
              </div>
            </div>
            {/* Size column */}
            <div className="flex flex-row items-center p-2 px-4 gap-1 w-[179px]">
              <div className="flex flex-row items-center gap-1">
                <span className="text-[14px] leading-[150%] font-normal text-[#333333]">Size</span>
                <button
                  onClick={() => handleSort("hectares")}
                  className="hover:opacity-70"
                >
                  {getSortIcon("hectares")}
                </button>
              </div>
            </div>
            {/* Limed? column */}
            <div className="flex flex-col justify-center items-start p-2 px-4 w-[150px]">
              <span className="text-[14px] leading-[150%] font-normal text-[#333333]">Limed?</span>
            </div>
            {/* Map column */}
            <div className="flex flex-col justify-center items-start p-4 w-[133px]">
              <span className="text-[14px] leading-[150%] font-normal text-[#333333]">Map</span>
            </div>
          </div>

          {/* Table Rows */}
          {paginatedFields.map((field) => {
            const isSelected = selectedFieldIds.includes(field.id)
            const status = getFieldStatus(field.id)

            return (
              <div
                key={field.id}
                className="flex flex-row border-b border-[#E5E5E5] h-[54px] hover:bg-[#F9F9F9] cursor-pointer"
                onClick={() => toggleField(field.id)}
              >
                {/* Checkbox */}
                <div className="flex flex-col justify-center items-center p-4 w-[48px]">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleField(field.id)}
                    className="border-[#6D57FF]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {/* Field name */}
                <div className="flex flex-col justify-center items-start p-4 w-[231px]">
                  <span className="text-[14px] leading-[150%] font-normal text-[#0D0D0D]">{field.name}</span>
                </div>
                {/* Size */}
                <div className="flex flex-row items-center p-4 pl-4 pr-1 gap-1 w-[179px]">
                  <RulerTriangleIcon size={12} className="text-[#0D0D0D]" />
                  <span className="text-[14px] leading-[150%] font-normal text-[#0D0D0D]">
                    {field.hectares ? `${Math.round(field.hectares)} ha` : "0 ha"}
                  </span>
                </div>
                {/* Status */}
                <div className="flex flex-col justify-center items-start p-4 w-[150px]">
                  <span className="text-[14px] leading-[150%] font-normal text-[#0D0D0D]">{status}</span>
                </div>
                {/* Map */}
                <div className="flex flex-col justify-center items-start p-4 w-[133px]">
                  <button 
                    className="flex flex-row items-center gap-2 text-[#4730DB] underline text-[14px] leading-[150%] font-medium hover:no-underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMapClick?.()
                    }}
                  >
                    <LocationDotIcon size={16} className="text-[#4730DB]" />
                    <span>Map</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-row justify-between items-center p-6 pt-4 bg-white rounded-[8px]">
        {/* Items per page */}
        <div className="flex flex-row items-center gap-2">
          <Select value={String(itemsPerPage)} onValueChange={(value) => {
            setItemsPerPage(Number(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-[79px] h-[40px] border border-[#333333] rounded-[4px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[14px] leading-[150%] font-normal text-[#0D0D0D]">items per page</span>
        </div>

        {/* Page range */}
        <div className="text-[14px] leading-[150%] font-bold text-[#0D0D0D]">
          {startIndex + 1} - {Math.min(endIndex, sortedFields.length)} of {sortedFields.length} items
        </div>

        {/* Page navigation */}
        <div className="flex flex-row items-center gap-4">
          {/* First/Prev buttons */}
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4 text-[#4D4D4D]" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-[#4D4D4D]" />
            </button>
          </div>
          
          {/* Page numbers */}
          <div className="flex flex-row items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-[4px] text-[14px] leading-[150%] font-bold flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-[#F2F2F2] text-[#0D0D0D]"
                      : "text-[#333333] hover:bg-[#F2F2F2]"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-[14px] text-[#333333] px-2">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded-[4px] text-[14px] leading-[150%] font-bold text-[#333333] hover:bg-[#F2F2F2] flex items-center justify-center"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next/Last buttons */}
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-[#4730DB]" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4 text-[#4730DB]" />
            </button>
          </div>
        </div>
      </div>

      {sortedFields.length === 0 && (
        <div className="text-center py-8 text-[#333333]">
          No fields found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}
