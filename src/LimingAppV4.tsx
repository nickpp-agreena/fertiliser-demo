import { useState, useEffect } from "react"
import { AgreenaLayout } from "@/components/agreena/AgreenaLayout"
import { AgreenaMapPanel } from "@/components/agreena/AgreenaMapPanel"
import type { Field, LimingPlanV3, LimingHistoryV3 } from "@/lib/limingTypes"
import { LimingPlanAccordionItemV3 } from "@/components/liming/LimingPlanAccordionItemV3"
import { LimingHistoryGatesV3 } from "@/components/liming/LimingHistoryGatesV3"
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

export default function LimingAppV4() {
  const [fields] = useState<Field[]>(INITIAL_FIELDS.slice(0, 10))
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

  // Handle back navigation
  const handleBack = () => {
    window.location.href = "/"
  }

  // Handle save and exit
  const handleSave = () => {
    console.log("Save and exit clicked", outputData)
    // In a real app, this would save the data and navigate away
    // For now, just log the output
  }

  // Determine title based on state
  const getTitle = () => {
    if (history.appliedLast20Years === false) {
      return "Liming Plans"
    }
    if (history.appliedLast20Years === true && history.lastAppliedYear) {
      return `Liming Plans - ${history.lastAppliedYear}`
    }
    return "Liming Plans"
  }

  return (
    <>
    <AgreenaLayout
      title={getTitle()}
      onBack={handleBack}
      rightAction="Save and exit"
      onRightAction={handleSave}
    >
      {/* Left Panel - 672px wide */}
      <div className="w-[672px] min-h-screen overflow-y-auto bg-[#FAFAFA]">
        <div className="px-6 py-6 space-y-6">
          {/* History Gates */}
          <LimingHistoryGatesV3 history={history} onHistoryChange={setHistory} hideDot={true} />

          {/* Plan Builder Section */}
          {shouldShowPlanBuilder && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] leading-[130%] font-medium text-[#0D0D0D]">
                  Liming Plans
                </h2>
                {(plans.length > 0 || notLimedFieldIds.size > 0) && (
                  <button
                    onClick={addPlan}
                    className="h-[40px] border border-[#4730DB] rounded-[8px] text-[#4730DB] text-[14px] leading-[150%] font-medium px-6 hover:bg-[#4730DB]/5 transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Plan
                  </button>
                )}
              </div>
              {plans.length === 0 && notLimedFieldIds.size === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-[#CCCCCC] rounded-[8px] bg-white">
                  <div className="max-w-sm mx-auto space-y-6">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-[#4730DB]/10 flex items-center justify-center">
                        <Plus className="h-8 w-8 text-[#4730DB]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[#0D0D0D] text-[16px] leading-[150%] font-medium">No liming plans defined yet</p>
                      <p className="text-[#666666] text-[14px] leading-[150%]">Create your first plan to get started</p>
                    </div>
                    <div className="w-full">
                      <Button 
                        onClick={addPlan} 
                        size="lg" 
                        className="w-full h-[48px] bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium rounded-[8px]"
                      >
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
                      hideDots={true}
                    />
                  ))}
                </Accordion>
              )}


              {/* Success Message - At least one valid plan exists */}
              {hasValidPlan && (
                <Card className="border-2 border-[#4730DB]/60 shadow-lg bg-white rounded-[8px]" style={{ backgroundColor: 'rgba(109, 87, 255, 0.1)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#4730DB]/20 flex items-center justify-center flex-shrink-0 ring-2 ring-[#4730DB]/30">
                        <CheckCircle2 className="h-6 w-6 text-[#4730DB]" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-[16px] leading-[150%] font-medium text-[#0D0D0D] mb-2 flex items-center gap-2">
                            <span>You're good to continue</span>
                          </h3>
                          <p className="text-[14px] leading-[150%] text-[#333333] font-normal mb-2">
                            You've added at least one liming plan and assigned fields, so you can save and move on at any time.
                          </p>
                          <p className="text-[14px] leading-[150%] text-[#333333] font-normal mb-2">
                            If you have more liming records, adding them now will improve the accuracy of your results and may increase your calculated earnings.
                          </p>
                          <p className="text-[12px] leading-[150%] text-[#747474] font-normal">
                            You can come back and update this later if needed.
                          </p>
                        </div>
                        <div className="flex flex-row items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => {
                              // Scroll to top to show the Save and exit button in navigation
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="h-[40px] border border-[#4730DB] rounded-[8px] text-[#4730DB] text-[16px] leading-[150%] font-medium px-6 hover:bg-[#4730DB]/5 transition-colors flex items-center justify-center"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save and Exit
                          </button>
                          <button
                            onClick={addPlan}
                            className="h-[40px] bg-[#4730DB] hover:bg-[#6D57FF] active:bg-[#849FE5] text-white text-[16px] leading-[150%] font-medium rounded-[8px] px-6 shadow-md transition-all hover:shadow-lg flex items-center justify-center"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add another plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

        </div>
      </div>
    </AgreenaLayout>
    
    {/* Right Panel - Map - Fixed to viewport, positioned at right edge of 1440px container */}
    <div 
      className="fixed top-0 h-screen w-[720px] z-10" 
      style={{ 
        left: 'max(calc((100vw - 1440px) / 2 + 720px), 720px)'
      }}
    >
      <AgreenaMapPanel />
    </div>
    </>
  )
}
