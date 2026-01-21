import { useState, useEffect } from "react"
import type { Field, LimingPlanV2 } from "@/lib/limingTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LimingFieldSelectionV2 } from "./LimingFieldSelectionV2"
import { Badge } from "@/components/ui/badge"
import { getMaterialTypeColor } from "@/lib/utils"
import { MoreVertical, Trash2, Copy, Check, CheckCircle, Calendar, Package, MapPin, Save } from "lucide-react"

interface LimingPlanAccordionItemV2Props {
  plan: LimingPlanV2
  fields: Field[]
  plans: LimingPlanV2[]
  onUpdate: (plan: LimingPlanV2) => void
  onAssignFields: (planId: string, year: string, fieldIds: string[]) => void
  onDelete: (planId: string) => void
  onDuplicate: (plan: LimingPlanV2) => void
  isOpen?: boolean
  onClose?: () => void
  availableYears: string[]
  notLimedFieldIds: Set<string>
  onMarkNotLimed: (fieldIds: string[]) => void
  onUnmarkNotLimed?: (fieldIds: string[]) => void
}

export function LimingPlanAccordionItemV2({
  plan,
  fields,
  plans,
  onUpdate,
  onAssignFields,
  onDelete,
  onDuplicate,
  isOpen,
  onClose,
  availableYears,
  notLimedFieldIds,
  onMarkNotLimed,
  onUnmarkNotLimed,
}: LimingPlanAccordionItemV2Props) {
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(plan.field_ids)
  const [lastSavedPlan, setLastSavedPlan] = useState<LimingPlanV2 | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // Initialize selection based on current assignments - reset when plan changes
  useEffect(() => {
    setSelectedFieldIds(plan.field_ids)
  }, [plan.id, plan.field_ids])

  // Initialize last saved plan on mount
  useEffect(() => {
    if (!lastSavedPlan) {
      setLastSavedPlan(JSON.parse(JSON.stringify(plan)))
    }
  }, [plan, lastSavedPlan])

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
    // Save plan details first, then apply fields
    onUpdate(plan)
    setLastSavedPlan(JSON.parse(JSON.stringify(plan)))
    onAssignFields(plan.id, plan.year, selectedFieldIds)
    onClose?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${plan.name}"?`)) {
      onDelete(plan.id)
    }
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDuplicate(plan)
  }

  // Validation
  const hasFields = plan.field_ids.length > 0
  const hasSelectedFields = selectedFieldIds.length > 0
  const isValid = !hasSelectedFields || (plan.material_type && plan.application_rate_t_per_ha > 0)
  const totalTonnes = plan.area_ha * plan.application_rate_t_per_ha

  return (
    <AccordionItem value={plan.id} id={`liming-plan-accordion-${plan.id}`} className="relative">
      <AccordionTrigger className="hover:no-underline pr-12 py-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            <div 
              className="h-2.5 w-2.5 rounded-full ring-2" 
              style={{ 
                backgroundColor: getMaterialTypeColor(plan.material_type),
                borderColor: `${getMaterialTypeColor(plan.material_type)}40`,
                boxShadow: `0 0 0 2px ${getMaterialTypeColor(plan.material_type)}20`
              }}
            />
            <span className="font-bold text-lg tracking-tight text-foreground">{plan.name || "New Plan"}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 gap-1">
              <Calendar className="h-3 w-3" />
              {plan.year}
            </Badge>
            {plan.material_type && (
              <Badge 
                variant="secondary" 
                className="text-[10px] px-2 py-0.5 h-5 gap-1"
                style={{
                  backgroundColor: `${getMaterialTypeColor(plan.material_type)}20`,
                  borderColor: getMaterialTypeColor(plan.material_type),
                  color: getMaterialTypeColor(plan.material_type),
                }}
              >
                <Package className="h-3 w-3" />
                {plan.material_type}
              </Badge>
            )}
            {plan.application_rate_t_per_ha > 0 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5">
                {plan.application_rate_t_per_ha} t/ha
              </Badge>
            )}
            {plan.field_ids.length > 0 && (
              <Badge variant={plan.field_ids.length > 0 ? "default" : "outline"} className="text-[10px] px-2 py-0.5 h-5 gap-1">
                <MapPin className="h-3 w-3" />
                {plan.field_ids.length} field{plan.field_ids.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mr-4">
          {plan.field_ids.length === 0 ? (
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-5 text-muted-foreground">
              Unassigned
            </Badge>
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              {plan.area_ha.toFixed(1)} ha
            </span>
          )}
        </div>
      </AccordionTrigger>
      <div className="absolute right-4 top-4 z-10" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Plan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AccordionContent className="pt-6">
        <div className="space-y-8">
          {/* Plan Details Section */}
          <div className="space-y-6 p-6 rounded-lg border-2 bg-gradient-to-br from-card to-card/50 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <div 
                  className="h-2 w-2 rounded-full ring-2" 
                  style={{ 
                    backgroundColor: getMaterialTypeColor(plan.material_type),
                    borderColor: `${getMaterialTypeColor(plan.material_type)}40`,
                    boxShadow: `0 0 0 2px ${getMaterialTypeColor(plan.material_type)}30`
                  }}
                ></div>
                Plan Details
              </h3>
              {plan.field_ids.length > 0 && (
                <Badge variant="default" className="text-xs">
                  {plan.field_ids.length} field{plan.field_ids.length !== 1 ? 's' : ''} assigned
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Name */}
              <div className="space-y-2.5 md:col-span-2">
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Plan Name
                </Label>
                <Input
                  value={plan.name}
                  onChange={(e) => onUpdate({ ...plan, name: e.target.value })}
                  placeholder="e.g. Spring Liming 2024"
                  className="h-11 border-2 focus:border-primary"
                />
              </div>

              {/* Year Selection - Single dropdown for all years (2025-2005) */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Year
                  <span className="text-destructive font-normal">*</span>
                </Label>
                <Select
                  value={plan.year && availableYears.includes(plan.year) ? plan.year : availableYears[0]}
                  onValueChange={(value) => onUpdate({ ...plan, year: value })}
                >
                  <SelectTrigger className="h-11 border-2 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Material Type */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  Material Type
                  {hasFields && <span className="text-destructive font-normal">*</span>}
                </Label>
                <Select
                  value={plan.material_type || ""}
                  onValueChange={(value) => onUpdate({ ...plan, material_type: value as "limestone" | "dolomite" | null })}
                >
                  <SelectTrigger className="h-11 border-2 focus:border-primary">
                    <SelectValue placeholder="Select material..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="limestone">Limestone</SelectItem>
                    <SelectItem value="dolomite">Dolomite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Application Rate */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  Application Rate
                  {hasFields && <span className="text-destructive font-normal">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={plan.application_rate_t_per_ha || ''}
                    onChange={(e) => onUpdate({ ...plan, application_rate_t_per_ha: Number(e.target.value) })}
                    placeholder="0.0"
                    className="h-11 pr-14 border-2 focus:border-primary"
                  />
                  <Badge variant="outline" className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 h-6 pointer-events-none">
                    t/ha
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Message */}
          {hasFields && (!plan.material_type || plan.application_rate_t_per_ha <= 0) && (
            <div className="p-4 border-2 border-warning/60 bg-warning/10 rounded-lg flex items-start gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                <span className="text-warning text-lg font-bold">⚠</span>
              </div>
              <div>
                <p className="text-sm font-bold text-warning mb-1">Required Information Missing</p>
                <p className="text-xs text-warning/90 font-medium">Material type and application rate are required when fields are selected.</p>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Field Selection */}
        <LimingFieldSelectionV2
          fields={fields}
          selectedFieldIds={selectedFieldIds}
          onSelectionChange={setSelectedFieldIds}
          planId={plan.id}
          planYear={plan.year}
          plans={plans}
          notLimedFieldIds={notLimedFieldIds}
          onMarkNotLimed={onMarkNotLimed}
          onUnmarkNotLimed={onUnmarkNotLimed}
        />

        {/* Total Area and Tonnes - Less Visual Impact */}
        {hasFields && (
          <div className="flex items-center justify-center gap-6 py-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Total Area:</span>
              <span className="text-sm font-semibold text-foreground">{plan.area_ha.toFixed(1)} ha</span>
            </div>
            {plan.application_rate_t_per_ha > 0 && (
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Total Tonnes:</span>
                <span className="text-sm font-semibold text-foreground">{totalTonnes.toFixed(1)} t</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-6 border-t">
          {/* Primary Action: Apply to Fields */}
          <div className="space-y-2">
            <Button
              onClick={handleApply}
              className="w-full font-semibold shadow-md min-w-[200px] h-12 text-base"
              disabled={!hasSelectedFields || !isValid}
              size="lg"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Apply to {selectedFieldIds.length} Selected Field{selectedFieldIds.length !== 1 ? 's' : ''}
            </Button>
            {hasSelectedFields && isValid && (
              <p className="text-xs text-muted-foreground text-center">
                This will assign the selected fields to this plan and save all plan details
              </p>
            )}
            {hasSelectedFields && !isValid && (
              <p className="text-xs text-warning text-center">
                Please set material type and application rate before applying to fields
              </p>
            )}
          </div>

          {/* Secondary Action: Save Plan Details Only */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Save Plan Details</p>
              <p className="text-xs text-muted-foreground">Save plan name, material, and rate without applying to fields</p>
            </div>
            <Button
              onClick={handleSave}
              variant={hasUnsavedChanges ? "default" : "outline"}
              className="font-semibold shadow-sm min-w-[120px] h-10"
              disabled={!hasUnsavedChanges && !showSaveSuccess}
              size="sm"
            >
              {showSaveSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
