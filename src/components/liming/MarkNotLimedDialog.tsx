import { useState, useMemo } from "react"
import type { Field } from "@/lib/limingTypes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, XCircle } from "lucide-react"

interface MarkNotLimedDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fieldIds: string[]) => void
  onUnmark?: (fieldIds: string[]) => void // Optional unmark handler
  fields: Field[]
  notLimedFieldIds: Set<string>
  assignedFieldIds: Set<string> // Fields already assigned to plans
}

type SortOption = "name-asc" | "name-desc" | "hectares-desc" | "hectares-asc"

export function MarkNotLimedDialog({
  isOpen,
  onClose,
  onConfirm,
  onUnmark,
  fields,
  notLimedFieldIds,
  assignedFieldIds,
}: MarkNotLimedDialogProps) {
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")

  // Filter fields - show all unassigned fields (including those marked as not limed)
  const availableFields = useMemo(() => {
    return fields.filter(field => !assignedFieldIds.has(field.id))
  }, [fields, assignedFieldIds])

  // Analyze selected fields to determine which actions are available
  const selectedCount = selectedFieldIds.length
  const selectedNotLimed = selectedFieldIds.filter(id => notLimedFieldIds.has(id))
  const selectedUnassigned = selectedFieldIds.filter(id => !notLimedFieldIds.has(id))
  const canMark = selectedUnassigned.length > 0 // Can mark if any selected are unassigned
  const canUnmark = selectedNotLimed.length > 0 && onUnmark // Can unmark if any selected are already not limed

  // Filter based on search
  const filteredFields = useMemo(() => {
    let result = availableFields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(field =>
        field.name.toLowerCase().includes(query) ||
        field.id.toLowerCase().includes(query)
      )
    }
    return result
  }, [availableFields, searchQuery])

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

  const toggleField = (fieldId: string) => {
    setSelectedFieldIds(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  // Select all visible (filtered/sorted) fields
  const handleSelectAll = () => {
    setSelectedFieldIds(sortedFields.map(f => f.id))
  }


  const handleClear = () => {
    setSelectedFieldIds([])
  }

  const handleMarkAsNotLimed = () => {
    if (selectedUnassigned.length === 0) return
    // Only mark the unassigned fields
    onConfirm(selectedUnassigned)
    setSelectedFieldIds([])
    setSearchQuery("")
    onClose()
  }

  const handleUnmarkAsNotLimed = () => {
    if (selectedNotLimed.length === 0 || !onUnmark) return
    // Only unmark the fields that are already not limed
    onUnmark(selectedNotLimed)
    setSelectedFieldIds([])
    setSearchQuery("")
    onClose()
  }

  const handleClose = () => {
    setSelectedFieldIds([])
    setSearchQuery("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            Mark Fields as Not Limed
          </DialogTitle>
          <DialogDescription>
            Select fields that will not receive liming treatment. These fields can be reassigned to plans later if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search fields by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus={false}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
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

          {/* Selection Summary and Quick Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs px-2.5 py-1">
                {selectedFieldIds.length} of {availableFields.length} selected
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={handleSelectAll} variant="outline" size="sm">
                Select All
              </Button>
              <Button onClick={handleClear} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
          </div>

          {/* Fields Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto rounded-lg border bg-background p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedFields.map((field) => {
                const isSelected = selectedFieldIds.includes(field.id)
                const isNotLimed = notLimedFieldIds.has(field.id)

                return (
                  <div
                    key={field.id}
                    onClick={() => toggleField(field.id)}
                    className={`
                      relative flex flex-col justify-between p-4 rounded-lg border-2 transition-all duration-200 h-32 cursor-pointer
                      hover:scale-[1.02] hover:shadow-lg hover:border-primary/40
                      ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md' : 'border-border/60 hover:border-primary/30 bg-card'}
                      ${isNotLimed && !isSelected ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/40 dark:border-amber-800/30' : ''}
                    `}
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

                    <div className="mt-2">
                      {isNotLimed ? (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                          <XCircle className="h-2.5 w-2.5 mr-1" />
                          Not Limed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-5 text-muted-foreground/70 border-muted-foreground/30 bg-muted/10">
                          Unassigned
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {sortedFields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? `No fields found matching "${searchQuery}"` : "No unassigned fields available"}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {canUnmark && (
            <Button
              onClick={handleUnmarkAsNotLimed}
              disabled={!canUnmark}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Mark {selectedNotLimed.length} as Unassigned
            </Button>
          )}
          {canMark && (
            <Button
              onClick={handleMarkAsNotLimed}
              disabled={!canMark}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Mark {selectedUnassigned.length} as Not Limed
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
