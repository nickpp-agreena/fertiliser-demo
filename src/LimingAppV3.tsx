import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import type { Field, LimingPlanV3, LimingHistoryV3 } from "@/lib/limingTypes"
import { LimingPlanAccordionItemV3 } from "@/components/liming/LimingPlanAccordionItemV3"
import { LimingHistoryGatesV3 } from "@/components/liming/LimingHistoryGatesV3"
import { LimingFieldsViewV3 } from "@/components/liming/LimingFieldsViewV3"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, Save } from "lucide-react"
import { FIELD_DATA } from "@/lib/fieldData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const generateId = () => Math.random().toString(36).substring(2, 9)

// Create fields from FIELD_DATA
const INITIAL_FIELDS: Field[] = FIELD_DATA.map((fieldData, i) => ({
  id: `field-${String(i + 1).padStart(3, '0')}`,
  name: fieldData.name,
  hectares: fieldData.hectares,
}))

// Generate available years (2025 down to 2005, 20 years)
const getAvailableYears = (): string[] => {
  const years: string[] = []
  for (let i = 2025; i >= 2005; i--) {
    years.push(String(i))
  }
  return years
}

export default function LimingAppV3() {
  const [fieldCount, setFieldCount] = useState<number>(10)
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS.slice(0, 10))
  const [plans, setPlans] = useState<LimingPlanV3[]>([])
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])
  const [history, setHistory] = useState<LimingHistoryV3>({
    appliedLast20Years: null,
    lastAppliedYear: null,
  })
  const [notLimedFieldIds, setNotLimedFieldIds] = useState<Set<string>>(new Set())

  const availableYears = getAvailableYears()

  // Check if we should show plan builder
  const shouldShowPlanBuilder = 
    history.appliedLast20Years === true && history.lastAppliedYear !== null

  // Initialize all fields as "not limed" when plan builder becomes visible
  useEffect(() => {
    if (shouldShowPlanBuilder) {
      // Mark all fields as "not limed" when plan builder is shown
      setNotLimedFieldIds(new Set(fields.map(f => f.id)))
    }
  }, [shouldShowPlanBuilder, fields])

  // Auto-mark all fields as "not limed" when user says "No"
  useEffect(() => {
    if (history.appliedLast20Years === false) {
      // Mark all fields as "not limed" when user confirms no liming
      setNotLimedFieldIds(new Set(fields.map(f => f.id)))
    }
  }, [history.appliedLast20Years, fields])

  // Update fields when field count changes
  const handleFieldCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(50, count))
    setFieldCount(validCount)
    const newFields = INITIAL_FIELDS.slice(0, validCount)
    setFields(newFields)
    // If plan builder is visible, mark new fields as "not limed"
    if (shouldShowPlanBuilder) {
      setNotLimedFieldIds(new Set(newFields.map(f => f.id)))
    }
  }

  // Mark fields as not limed
  const markFieldsAsNotLimed = (fieldIds: string[]) => {
    setNotLimedFieldIds(prev => {
      const next = new Set(prev)
      fieldIds.forEach(id => next.add(id))
      return next
    })
    // Remove these fields from any plans
    setPlans(prev => prev.map(plan => ({
      ...plan,
      field_ids: plan.field_ids.filter(id => !fieldIds.includes(id)),
      area_ha: calculateArea(plan.field_ids.filter(id => !fieldIds.includes(id))),
    })))
  }

  // Unmark fields as not limed (allow reassignment)
  const unmarkFieldsAsNotLimed = (fieldIds: string[]) => {
    setNotLimedFieldIds(prev => {
      const next = new Set(prev)
      fieldIds.forEach(id => next.delete(id))
      return next
    })
  }


  // Calculate area helper
  const calculateArea = (fieldIds: string[]): number => {
    return fieldIds.reduce((sum, id) => {
      const field = fields.find(f => f.id === id)
      return sum + (field?.hectares || 0)
    }, 0)
  }

  const addPlan = () => {
    const newPlanId = generateId()
    // Use lastAppliedYear from history as default, or first available year
    const year = history.lastAppliedYear || availableYears[0]
    
    const newPlan: LimingPlanV3 = {
      id: newPlanId,
      name: `Liming Plan ${plans.length + 1}`,
      year,
      material_type: null,
      application_rate_t_per_ha: 0,
      field_ids: [],
      area_ha: 0,
    }
    
    setPlans(prev => [...prev, newPlan])
    
    // Close all previous plans and open the new plan accordion
    setOpenAccordionItems([newPlanId])
    
    // Scroll to the new plan after a brief delay to ensure it's rendered
    setTimeout(() => {
      const element = document.getElementById(`liming-plan-accordion-${newPlanId}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  const updatePlan = (updatedPlan: LimingPlanV3) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p))
  }

  // Assign fields to plan with year-based exclusivity
  // Automatically unmark fields as "not limed" when assigned to a plan
  // Automatically mark fields as "not limed" when removed from plans
  const assignFieldsToPlan = (planId: string, year: string, fieldIds: string[]) => {
    setPlans(prev => {
      // Get the current plan's field IDs before update
      const currentPlan = prev.find(p => p.id === planId)
      const previousFieldIdsForThisPlan = currentPlan?.field_ids || []
      
      // Track fields that are being removed from OTHER plans (same year, different plan)
      const fieldsBeingRemovedFromOtherPlans: string[] = []
      
      // First, remove field IDs that are being assigned to this plan from any other plan in the same year
      const plansWithRemovedFields = prev.map(plan => {
        if (plan.year === year && plan.id !== planId) {
          const previousFieldIds = plan.field_ids
          const remainingFieldIds = previousFieldIds.filter(id => !fieldIds.includes(id))
          // Track fields that were removed from this other plan
          previousFieldIds.forEach(id => {
            if (fieldIds.includes(id) && !fieldsBeingRemovedFromOtherPlans.includes(id)) {
              fieldsBeingRemovedFromOtherPlans.push(id)
            }
          })
          return {
            ...plan,
            field_ids: remainingFieldIds,
            area_ha: calculateArea(remainingFieldIds),
          }
        }
        return plan
      })

      // Then, update the selected plan with new field IDs
      const updatedPlans = plansWithRemovedFields.map(plan => {
        if (plan.id === planId) {
          const newArea = calculateArea(fieldIds)
          return {
            ...plan,
            field_ids: fieldIds,
            area_ha: newArea,
          }
        }
        return plan
      })
      
      // Track fields that were removed from the current plan (were assigned but not in new list)
      const fieldsRemovedFromThisPlan = previousFieldIdsForThisPlan.filter(
        id => !fieldIds.includes(id)
      )
      
      // Mark fields as "not limed" if they were removed from this plan or other plans
      const allFieldsBeingRemoved = [...fieldsRemovedFromThisPlan, ...fieldsBeingRemovedFromOtherPlans]
      if (allFieldsBeingRemoved.length > 0) {
        markFieldsAsNotLimed(allFieldsBeingRemoved)
      }
      
      // Unmark fields as "not limed" when they're assigned to a plan
      unmarkFieldsAsNotLimed(fieldIds)
      
      return updatedPlans
    })
    
    // Close accordion after applying
    setOpenAccordionItems(prev => prev.filter(id => id !== planId))
  }

  const deletePlan = (planId: string) => {
    setPlans(prev => {
      const planToDelete = prev.find(p => p.id === planId)
      if (planToDelete && planToDelete.field_ids.length > 0) {
        // Mark fields as "not limed" when plan is deleted
        markFieldsAsNotLimed(planToDelete.field_ids)
      }
      return prev.filter(p => p.id !== planId)
    })
  }

  const duplicatePlan = (plan: LimingPlanV3) => {
    const newPlanId = generateId()
    
    // Find a different year for the duplicate to avoid conflicts
    // Try to use the next available year, or fall back to the same year if all are taken
    const currentYearIndex = availableYears.indexOf(plan.year)
    const nextYearIndex = currentYearIndex > 0 ? currentYearIndex - 1 : currentYearIndex
    const duplicateYear = availableYears[nextYearIndex] || plan.year
    
    const newPlan: LimingPlanV3 = {
      ...plan,
      id: newPlanId,
      name: `Copy of ${plan.name}`,
      year: duplicateYear, // Use a different year to avoid field conflicts
      field_ids: [], // Clear field assignments for duplicate
      area_ha: 0,
    }
    setPlans(prev => [...prev, newPlan])
    
    // Close original, open duplicate
    setOpenAccordionItems(prev => {
      const withoutOriginal = prev.filter(id => id !== plan.id)
      return [...withoutOriginal, newPlanId]
    })
    
    // Scroll to duplicate after state update
    setTimeout(() => {
      const duplicateElement = document.getElementById(`liming-plan-accordion-${newPlanId}`)
      duplicateElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  // Helper to check if a plan is valid (has material_type, rate > 0, and at least 1 field)
  const isValidPlan = (plan: LimingPlanV3): boolean => {
    return plan.material_type !== null && 
           plan.application_rate_t_per_ha > 0 && 
           plan.field_ids.length > 0
  }

  // Check if at least one valid plan exists
  const hasValidPlan = plans.some(isValidPlan)


  // Prepare output JSON
  const outputData = {
    history,
    plans: plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      year: plan.year,
      material_type: plan.material_type,
      application_rate_t_per_ha: plan.application_rate_t_per_ha,
      field_ids: plan.field_ids,
      area_ha: plan.area_ha,
      total_tonnes: plan.area_ha * plan.application_rate_t_per_ha,
    })),
    notLimedFieldIds: Array.from(notLimedFieldIds),
    fieldAssignments: fields.map(field => {
      const assignments = plans
        .filter(p => p.field_ids.includes(field.id))
        .map(p => ({ planId: p.id, planName: p.name, year: p.year }))
      return {
        fieldId: field.id,
        fieldName: field.name,
        assignments,
        notLimed: notLimedFieldIds.has(field.id),
      }
    }),
  }

  return (
    <div className="min-h-screen bg-muted/10 font-sans">
      <Navigation fieldCount={fieldCount} onFieldCountChange={handleFieldCountChange} />

      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Liming Plans</h1>
          <p className="text-muted-foreground text-lg">Define liming strategies and apply them to your fields.</p>
        </div>

        {/* History Gates */}
        <LimingHistoryGatesV3 history={history} onHistoryChange={setHistory} />

        {/* Plan Builder Section */}
        {shouldShowPlanBuilder && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary ring-2 ring-primary/30"></div>
                Liming Plans
              </h2>
              {(plans.length > 0 || notLimedFieldIds.size > 0) && (
                <Button onClick={addPlan} size="sm" variant="outline" className="border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Add Plan
                </Button>
              )}
            </div>
            {plans.length === 0 && notLimedFieldIds.size === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-gradient-to-br from-card/50 to-card/30 hover:from-card/70 hover:to-card/50 transition-all duration-300">
                <div className="max-w-sm mx-auto space-y-6">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground text-lg font-semibold">No liming plans defined yet</p>
                    <p className="text-muted-foreground text-sm">Create your first plan to get started</p>
                  </div>
                  <div className="w-full">
                    <Button onClick={addPlan} size="lg" className="w-full h-12 text-base font-semibold shadow-md">
                      <Plus className="mr-2 h-5 w-5" /> Create First Plan
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Accordion 
                type="multiple" 
                className="w-full"
                value={openAccordionItems}
                onValueChange={setOpenAccordionItems}
              >
                {plans.map(plan => (
                  <LimingPlanAccordionItemV3
                    key={plan.id}
                    plan={plan}
                    fields={fields}
                    plans={plans}
                    onUpdate={updatePlan}
                    onAssignFields={assignFieldsToPlan}
                    onDelete={deletePlan}
                    onDuplicate={duplicatePlan}
                    isOpen={openAccordionItems.includes(plan.id)}
                    onClose={() => setOpenAccordionItems(prev => prev.filter(id => id !== plan.id))}
                    availableYears={availableYears}
                    notLimedFieldIds={notLimedFieldIds}
                    onMarkNotLimed={markFieldsAsNotLimed}
                    onUnmarkNotLimed={unmarkFieldsAsNotLimed}
                  />
                ))}
              </Accordion>
            )}

            {plans.length > 0 && (
              <Button
                onClick={addPlan}
                variant="outline"
                className="w-full border-dashed border-2 h-14 text-base font-semibold hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Another Plan
              </Button>
            )}

            {/* Success Message - At least one valid plan exists */}
            {hasValidPlan && (
              <Card className="border-2 border-primary/60 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ backgroundColor: 'rgba(109, 87, 255, 0.1)' }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/30 animate-in zoom-in duration-300">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                          <span>Great, you've added a plan and assigned some fields!</span>
                        </h3>
                        <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                          You can submit it now, but the more liming data you give us, the more accurate your calculation will be. You need to give us as much liming data as possible, as this significantly affects your earnings.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-primary/20">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-semibold transition-all hover:shadow-lg"
                          onClick={() => {
                            // Scroll to top to show the Save and exit button in navigation
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                            // Optional: Could trigger save action here
                          }}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save and Exit
                        </Button>
                        <p className="text-xs text-muted-foreground font-medium sm:ml-2">
                          Save your liming plans and return to the previous screen.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Fields View - Read Only */}
        {shouldShowPlanBuilder && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Fields View</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="">
                <AccordionItem value="fields-view" className="border-b-0">
                  <AccordionTrigger>Show Fields View</AccordionTrigger>
                  <AccordionContent>
                    <LimingFieldsViewV3 fields={fields} plans={plans} notLimedFieldIds={notLimedFieldIds} availableYears={availableYears} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Output JSON Preview */}
        {shouldShowPlanBuilder && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Output Preview (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="">
                <AccordionItem value="json-preview" className="border-b-0">
                  <AccordionTrigger>Show JSON Output</AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[400px]">
                      {JSON.stringify(outputData, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  )
}
