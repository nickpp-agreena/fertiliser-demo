import { useState, useEffect, useRef } from "react"
import type { Field, LimingPlan } from "@/lib/limingTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LimingFieldSelection } from "./LimingFieldSelection"
import { MoreVertical, Trash2, Check, CheckCircle } from "lucide-react"

const generateId = () => Math.random().toString(36).substring(2, 9)

interface LimingPlanAccordionItemProps {
  plan: LimingPlan
  fields: Field[]
  plans: LimingPlan[]
  onUpdate: (plan: LimingPlan) => void
  onAssignFields: (planId: string, year: string | "pre-5-years", fieldIds: string[]) => void
  onDelete: (planId: string) => void
  isOpen?: boolean
  onClose?: () => void
  availableYears: string[]
  historicalYears: string[] // Years for historical plans (2020 and earlier)
}

export function LimingPlanAccordionItem({
  plan,
  fields,
  plans,
  onUpdate,
  onAssignFields,
  onDelete,
  isOpen,
  onClose,
  availableYears,
  historicalYears,
}: LimingPlanAccordionItemProps) {
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([])
  const [lastSavedPlan, setLastSavedPlan] = useState<LimingPlan | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // Initialize selection based on current assignments
  useEffect(() => {
    setSelectedFieldIds(plan.field_ids)
  }, [plan.field_ids])

  // Initialize last saved plan on mount
  useEffect(() => {
    if (!lastSavedPlan) {
      setLastSavedPlan(JSON.parse(JSON.stringify(plan)))
    }
  }, [])

  // Calculate area from selected fields
  const calculateArea = (fieldIds: string[]): number => {
    return fieldIds.reduce((sum, id) => {
      const field = fields.find(f => f.id === id)
      return sum + (field?.hectares || 0)
    }, 0)
  }

  // Update area when field_ids change
  useEffect(() => {
    const newArea = calculateArea(plan.field_ids)
    if (Math.abs(newArea - plan.area_ha) > 0.01) {
      onUpdate({ ...plan, area_ha: newArea })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan.field_ids])

  // Check if plan has unsaved changes
  const hasUnsavedChanges = lastSavedPlan ? JSON.stringify(plan) !== JSON.stringify(lastSavedPlan) : false

  const handleSave = () => {
    onUpdate(plan)
    setLastSavedPlan(JSON.parse(JSON.stringify(plan)))
    setShowSaveSuccess(true)
    setTimeout(() => {
      setShowSaveSuccess(false)
      onClose?.()
    }, 2000)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAssignFields(plan.id, plan.year, selectedFieldIds)
    onClose?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      onDelete(plan.id)
    }
  }

  // Validation
  const hasFields = plan.field_ids.length > 0
  const isValid = !hasFields || (plan.material_type && plan.application_rate_t_per_ha > 0)
  const totalTonnes = plan.area_ha * plan.application_rate_t_per_ha

  return (
    <AccordionItem value={plan.id} id={`liming-plan-accordion-${plan.id}`}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-extrabold text-xl tracking-tight">{plan.name || "New Plan"}</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {plan.year === "pre-5-years" 
              ? `Historical${plan.historicalYear ? ` (${plan.historicalYear})` : ''}` 
              : `Year: ${plan.year}`} • {plan.material_type || "No material"} • {plan.application_rate_t_per_ha > 0 ? `${plan.application_rate_t_per_ha} t/ha` : "No rate"} • {plan.field_ids.length} field{plan.field_ids.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 mr-4">
          <span className="text-xs text-muted-foreground">
            {plan.field_ids.length === 0 ? "Unassigned" : `${plan.area_ha.toFixed(1)} ha`}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-6">
        <div className="space-y-6">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label className="font-bold text-sm">Plan Name</Label>
            <Input
              value={plan.name}
              onChange={(e) => onUpdate({ ...plan, name: e.target.value })}
              placeholder="e.g. Spring Liming 2024"
              className="max-w-md"
            />
          </div>

          {/* Year Selection */}
          {plan.year !== "pre-5-years" ? (
            <div className="space-y-2">
              <Label className="font-bold text-sm">Year</Label>
              <Select
                value={plan.year}
                onValueChange={(value) => onUpdate({ ...plan, year: value })}
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="font-bold text-sm">Year (Optional)</Label>
              <Select
                value={plan.historicalYear || ""}
                onValueChange={(value) => onUpdate({ ...plan, historicalYear: value || undefined })}
              >
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select year (optional)..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {historicalYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Optional: Specify the year if known</p>
            </div>
          )}

          {/* Material Type */}
          <div className="space-y-2">
            <Label className="font-bold text-sm">Material Type</Label>
            <Select
              value={plan.material_type}
              onValueChange={(value) => onUpdate({ ...plan, material_type: value as "limestone" | "dolomite" })}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select material..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limestone">Limestone</SelectItem>
                <SelectItem value="dolomite">Dolomite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Application Rate */}
          <div className="space-y-2">
            <Label className="font-bold text-sm">Application Rate (t/ha)</Label>
            <div className="relative max-w-md">
              <Input
                type="number"
                step="0.1"
                min="0"
                value={plan.application_rate_t_per_ha || ''}
                onChange={(e) => onUpdate({ ...plan, application_rate_t_per_ha: Number(e.target.value) })}
                placeholder="0"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">t/ha</span>
            </div>
          </div>

          {/* Derived Area Display */}
          {plan.field_ids.length > 0 && (
            <div className="p-4 border rounded-lg bg-muted/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Area:</span>
                  <span className="ml-2 font-semibold">{plan.area_ha.toFixed(1)} ha</span>
                </div>
                {plan.application_rate_t_per_ha > 0 && (
                  <div>
                    <span className="text-muted-foreground">Total Tonnes:</span>
                    <span className="ml-2 font-semibold">{totalTonnes.toFixed(1)} t</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Validation Message */}
          {hasFields && (!plan.material_type || plan.application_rate_t_per_ha <= 0) && (
            <div className="p-3 border border-warning/50 bg-warning/10 rounded-lg text-sm text-warning">
              Material type and application rate are required when fields are selected.
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Field Selection */}
        <LimingFieldSelection
          fields={fields}
          selectedFieldIds={selectedFieldIds}
          onSelectionChange={setSelectedFieldIds}
          planId={plan.id}
          planYear={plan.year}
          plans={plans}
        />

        {/* Apply Button */}
        {selectedFieldIds.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleApply} className="font-bold shadow-sm">
              Apply to selected fields
            </Button>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t mt-6">
          <Button
            onClick={handleSave}
            className="font-bold shadow-sm min-w-[140px]"
            disabled={!hasUnsavedChanges && !showSaveSuccess}
          >
            {showSaveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update Plan
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Plan
              </>
            )}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
