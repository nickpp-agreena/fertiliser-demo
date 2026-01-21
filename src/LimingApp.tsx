import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import type { Field, LimingPlan, LimingHistory } from "@/lib/limingTypes"
import { LimingPlanAccordionItem } from "@/components/liming/LimingPlanAccordionItem"
import { LimingHistoryGates } from "@/components/liming/LimingHistoryGates"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FIELD_DATA } from "@/lib/fieldData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const generateId = () => Math.random().toString(36).substring(2, 9)

// Create fields from FIELD_DATA
const INITIAL_FIELDS: Field[] = FIELD_DATA.map((fieldData, i) => ({
  id: `field-${String(i + 1).padStart(3, '0')}`,
  name: fieldData.name,
  hectares: fieldData.hectares,
}))

// Generate available years (2021-2025, five years)
const getAvailableYears = (): string[] => {
  return ['2021', '2022', '2023', '2024', '2025']
}

// Generate historical years (2020 back to 2001, 20 years)
const getHistoricalYears = (): string[] => {
  const years: string[] = []
  for (let i = 2020; i >= 2001; i--) {
    years.push(String(i))
  }
  return years
}

export default function LimingApp() {
  const [fieldCount, setFieldCount] = useState<number>(10)
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS.slice(0, 10))
  const [plans, setPlans] = useState<LimingPlan[]>([])
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])
  const [history, setHistory] = useState<LimingHistory>({
    appliedLast5Years: null,
    appliedBefore5Years: null,
    lastAppliedYearBand: null,
  })

  const availableYears = getAvailableYears()
  const historicalYears = getHistoricalYears()

  // Update fields when field count changes
  const handleFieldCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(50, count))
    setFieldCount(validCount)
    setFields(INITIAL_FIELDS.slice(0, validCount))
  }

  const addPlan = () => {
    const newPlanId = generateId()
    // Determine year based on history
    const year = history.appliedLast5Years === true 
      ? availableYears[availableYears.length - 1] // Default to most recent year (2025)
      : "pre-5-years"
    
    const newPlan: LimingPlan = {
      id: newPlanId,
      name: `Liming Plan ${plans.length + 1}`,
      year,
      isHistorical: year === "pre-5-years",
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

  const updatePlan = (updatedPlan: LimingPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p))
  }

  // Calculate area helper
  const calculateArea = (fieldIds: string[]): number => {
    return fieldIds.reduce((sum, id) => {
      const field = fields.find(f => f.id === id)
      return sum + (field?.hectares || 0)
    }, 0)
  }

  // Assign fields to plan with year-based exclusivity
  const assignFieldsToPlan = (planId: string, year: string | "pre-5-years", fieldIds: string[]) => {
    setPlans(prev => {
      // First, remove these field IDs from any other plan in the same year
      const plansWithRemovedFields = prev.map(plan => {
        if (plan.year === year && plan.id !== planId) {
          const remainingFieldIds = plan.field_ids.filter(id => !fieldIds.includes(id))
          return {
            ...plan,
            field_ids: remainingFieldIds,
            area_ha: calculateArea(remainingFieldIds),
          }
        }
        return plan
      })

      // Then, add field IDs to the selected plan
      return plansWithRemovedFields.map(plan => {
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
    })
    
    // Close accordion after applying
    setOpenAccordionItems(prev => prev.filter(id => id !== planId))
  }

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId))
  }

  // Check if we should show plan builder
  const shouldShowPlanBuilder = 
    history.appliedLast5Years === true ||
    (history.appliedLast5Years === false && history.appliedBefore5Years === true && history.lastAppliedYearBand !== null)

  // Check if plans are required
  const plansRequired = history.appliedLast5Years === true

  // Get unassigned fields (for current year plans only)
  const getUnassignedFields = (): Field[] => {
    if (!shouldShowPlanBuilder) return []
    
    // Get all field IDs assigned to current year plans
    const assignedFieldIds = new Set<string>()
    plans.forEach(plan => {
      if (plan.year !== "pre-5-years") {
        plan.field_ids.forEach(id => assignedFieldIds.add(id))
      }
    })
    
    return fields.filter(f => !assignedFieldIds.has(f.id))
  }

  const unassignedFields = getUnassignedFields()

  // Prepare output JSON
  const outputData = {
    history,
    plans: plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      year: plan.year,
      isHistorical: plan.isHistorical,
      material_type: plan.material_type,
      application_rate_t_per_ha: plan.application_rate_t_per_ha,
      field_ids: plan.field_ids,
      area_ha: plan.area_ha,
      total_tonnes: plan.area_ha * plan.application_rate_t_per_ha,
    })),
    fieldAssignments: fields.map(field => {
      const assignments = plans
        .filter(p => p.field_ids.includes(field.id))
        .map(p => ({ planId: p.id, planName: p.name, year: p.year }))
      return {
        fieldId: field.id,
        fieldName: field.name,
        assignments,
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
        <LimingHistoryGates history={history} onHistoryChange={setHistory} />

        {/* Plan Builder Section */}
        {shouldShowPlanBuilder && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Liming Plans</h2>
              {plans.length > 0 && (
                <Button onClick={addPlan} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Plan
                </Button>
              )}
            </div>
            {plans.length === 0 ? (
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
                  <Button onClick={addPlan} size="lg" className="w-full h-12 text-base font-semibold shadow-md">
                    <Plus className="mr-2 h-5 w-5" /> Create First Plan
                  </Button>
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
                  <LimingPlanAccordionItem
                    key={plan.id}
                    plan={plan}
                    fields={fields}
                    plans={plans}
                    onUpdate={updatePlan}
                    onAssignFields={assignFieldsToPlan}
                    onDelete={deletePlan}
                    isOpen={openAccordionItems.includes(plan.id)}
                    onClose={() => setOpenAccordionItems(prev => prev.filter(id => id !== plan.id))}
                    availableYears={availableYears}
                    historicalYears={historicalYears}
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

            {/* Unassigned Fields Info (informational only if plans required) */}
            {plansRequired && unassignedFields.length > 0 && (
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Unassigned Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {unassignedFields.length} field{unassignedFields.length !== 1 ? 's' : ''} not yet assigned to a liming plan.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* Output JSON Preview */}
        {shouldShowPlanBuilder && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Output Preview (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="">
                <AccordionItem value="json-preview">
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
