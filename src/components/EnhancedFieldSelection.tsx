import { useState, useMemo, useEffect } from "react"
import type { Field, Plan } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { getPlanTypeColor } from "@/lib/utils"

interface EnhancedFieldSelectionProps {
    fields: Field[]
    selectedFieldIds: string[]
    onSelectionChange: (ids: string[]) => void
    planId: string
    plans: Plan[]
}

type SortOption = "name-asc" | "name-desc" | "hectares-desc" | "hectares-asc"

export function EnhancedFieldSelection({
    fields,
    selectedFieldIds,
    onSelectionChange,
    planId,
    plans,
}: EnhancedFieldSelectionProps) {
    // Helper to get plan name by ID
    const getPlanName = (planId: string | null): string => {
        if (!planId) return ""
        const foundPlan = plans.find(p => p.id === planId)
        return foundPlan?.name || ""
    }

    // Helper to truncate plan name
    const truncatePlanName = (name: string, maxLength: number = 20): string => {
        if (name.length <= maxLength) return name
        return name.substring(0, maxLength - 3) + "..."
    }
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOption, setSortOption] = useState<SortOption>("name-asc")

    // Filter fields based on search query
    const filteredFields = useMemo(() => {
        let result = fields
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = fields.filter(field =>
                field.name.toLowerCase().includes(query) ||
                field.id.toLowerCase().includes(query)
            )
        }
        return result
    }, [fields, searchQuery])

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
    const toggleField = (fieldId: string) => {
        onSelectionChange(
            selectedFieldIds.includes(fieldId)
                ? selectedFieldIds.filter(id => id !== fieldId)
                : [...selectedFieldIds, fieldId]
        )
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-xl font-extrabold tracking-tight">Apply to Fields</Label>
                    <p className="text-sm text-muted-foreground font-medium">Select fields to assign this plan to.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {selectedFieldIds.length} of {fields.length} selected
                    </span>
                    <Button onClick={() => onSelectionChange([])} variant="ghost" size="sm">
                        Clear
                    </Button>
                </div>
            </div>

            {/* Search and Sort */}
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
                    />
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

            {/* Scrollable Grid */}
            <div className="rounded-lg border bg-background p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {sortedFields.map((field) => {
                        const isSelected = selectedFieldIds.includes(field.id)
                        const isAssignedToThis = field.assignedPlanId === planId
                        const isAssignedToOther = field.assignedPlanId && field.assignedPlanId !== planId

                        return (
                            <div
                                key={field.id}
                                onClick={() => toggleField(field.id)}
                                className={`
                                    relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer h-28
                                    hover:scale-[1.03] hover:shadow-md
                                    ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5 scale-[1.03] shadow-sm' : 'border-border hover:border-primary/50'}
                                    ${isAssignedToOther && !isSelected ? 'opacity-75 bg-muted/20' : ''}
                                    ${isAssignedToThis ? getPlanTypeColor(plans.find(p => p.id === planId)?.type || 'none') : ''}
                                    ${isAssignedToOther ? getPlanTypeColor(plans.find(p => p.id === field.assignedPlanId)?.type || 'none') : ''}
                                    ${!field.assignedPlanId ? getPlanTypeColor('unassigned') : ''}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-sm block truncate">{field.name}</span>
                                        {field.hectares && (
                                            <span className="text-xs text-muted-foreground">{field.hectares.toFixed(1)} ha</span>
                                        )}
                                    </div>
                                    <Checkbox
                                        checked={isSelected}
                                        className="mt-0.5 flex-shrink-0"
                                    />
                                </div>

                                <div className="mt-2 text-xs">
                                    {isAssignedToThis && (
                                        <span className="text-primary font-medium flex items-center gap-1 truncate">
                                            ● {truncatePlanName(getPlanName(planId))}
                                        </span>
                                    )}
                                    {isAssignedToOther && !isSelected && (
                                        <span className="text-muted-foreground truncate">
                                            {truncatePlanName(getPlanName(field.assignedPlanId))}
                                        </span>
                                    )}
                                    {!field.assignedPlanId && !isSelected && (
                                        <span className="text-muted-foreground italic">
                                            Unassigned
                                        </span>
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
