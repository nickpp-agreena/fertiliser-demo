import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import type { Field, Plan, Fertilizer } from "@/lib/types"
import { PlanAccordionItem } from "@/components/PlanAccordionItem"
import { ValidationSummary } from "@/components/ValidationSummary"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FIELD_DATA } from "@/lib/fieldData"

const generateId = () => Math.random().toString(36).substring(2, 9)

// Migration function to convert old plan format to new format
const migratePlan = (plan: Plan): Plan => {
  // If plan already has fertilizers array, check if inhibitor needs to be moved
  if (plan.fertilizers && Array.isArray(plan.fertilizers)) {
    // If plan has inhibitor at plan level but fertilizers don't, move it to first fertilizer
    if ((plan.hasInhibitor || plan.inhibitorAmount) && plan.fertilizers.length > 0) {
      const firstFertilizer = plan.fertilizers[0]
      if (!firstFertilizer.hasInhibitor && !firstFertilizer.inhibitorAmount) {
        const updatedFertilizers = plan.fertilizers.map((f, idx) => 
          idx === 0 ? { ...f, hasInhibitor: plan.hasInhibitor, inhibitorAmount: plan.inhibitorAmount } : f
        )
        const { hasInhibitor, inhibitorAmount, ...planWithoutInhibitor } = plan
        return {
          ...planWithoutInhibitor,
          fertilizers: updatedFertilizers
        }
      }
    }
    // Remove inhibitor from plan if it exists
    if (plan.hasInhibitor !== undefined || plan.inhibitorAmount !== undefined) {
      const { hasInhibitor, inhibitorAmount, ...planWithoutInhibitor } = plan
      return planWithoutInhibitor
    }
    return plan
  }

  // Migrate from old format
  const fertilizers: Fertilizer[] = []
  
  if (plan.type === 'synthetic' && (plan.n !== undefined || plan.p !== undefined || plan.k !== undefined)) {
    fertilizers.push({
      id: generateId(),
      n: plan.n,
      p: plan.p,
      pUnit: plan.pUnit || 'P',
      k: plan.k,
      kUnit: plan.kUnit || 'K',
      // Move inhibitor from plan to first fertilizer
      hasInhibitor: plan.hasInhibitor,
      inhibitorAmount: plan.inhibitorAmount
    })
  } else if (plan.type === 'organic' && plan.organicType) {
    fertilizers.push({
      id: generateId(),
      organicType: plan.organicType,
      organicForm: plan.organicForm || 'solid',
      applicationRate: plan.applicationRate,
      // Move inhibitor from plan to first fertilizer
      hasInhibitor: plan.hasInhibitor,
      inhibitorAmount: plan.inhibitorAmount
    })
  } else if (plan.type === 'synthetic') {
    // Empty synthetic plan - add one empty fertilizer
    fertilizers.push({
      id: generateId(),
      n: 0,
      p: 0,
      pUnit: 'P',
      k: 0,
      kUnit: 'K',
      // Move inhibitor from plan to first fertilizer
      hasInhibitor: plan.hasInhibitor,
      inhibitorAmount: plan.inhibitorAmount
    })
  } else if (plan.type === 'organic') {
    // Empty organic plan - add one empty fertilizer
    fertilizers.push({
      id: generateId(),
      organicType: '',
      organicForm: 'solid',
      applicationRate: 0,
      // Move inhibitor from plan to first fertilizer
      hasInhibitor: plan.hasInhibitor,
      inhibitorAmount: plan.inhibitorAmount
    })
  } else if (plan.hasInhibitor || plan.inhibitorAmount) {
    // Plan has inhibitor but no fertilizers - create a synthetic fertilizer with inhibitor
    fertilizers.push({
      id: generateId(),
      n: 0,
      p: 0,
      pUnit: 'P',
      k: 0,
      kUnit: 'K',
      hasInhibitor: plan.hasInhibitor,
      inhibitorAmount: plan.inhibitorAmount
    })
  }

  // Remove inhibitor fields from plan
  const { hasInhibitor, inhibitorAmount, ...planWithoutInhibitor } = plan

  return {
    ...planWithoutInhibitor,
    fertilizers
  }
}

// Shuffle array function for random assignment
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Create 50 fields by randomly assigning from FIELD_DATA
const shuffledFields = shuffleArray(FIELD_DATA)
const INITIAL_FIELDS: Field[] = Array.from({ length: 50 }, (_, i) => ({
  id: `field-${String(i + 1).padStart(3, '0')}`,
  name: shuffledFields[i].name,
  hectares: shuffledFields[i].hectares,
  assignedPlanId: null
}))

export default function App() {
  const [fieldCount, setFieldCount] = useState<number>(50)
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS.slice(0, 50))
  const [plans, setPlans] = useState<Plan[]>([])
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])

  // Migrate plans on mount
  useEffect(() => {
    setPlans(prev => prev.map(migratePlan))
  }, [])

  // Update fields when field count changes
  const handleFieldCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(50, count))
    setFieldCount(validCount)
    
    // Preserve existing field assignments when changing count
    setFields(prev => {
      const newFields = INITIAL_FIELDS.slice(0, validCount)
      
      // Map existing assignments to new fields by ID
      return newFields.map(newField => {
        const existingField = prev.find(f => f.id === newField.id)
        if (existingField) {
          // Preserve the assignment from existing field
          return { ...newField, assignedPlanId: existingField.assignedPlanId }
        }
        // New field (if count increased), keep null assignment
        return newField
      })
    })
  }

  const addPlan = () => {
    const newPlanId = generateId()
    const newPlan: Plan = {
      id: newPlanId,
      name: `Plan ${plans.length + 1}`,
      type: 'none',
      fertilizers: []
    }
    setPlans(prev => [...prev, newPlan])
    // Close all previous plans and open the new plan accordion
    setOpenAccordionItems([newPlanId])
  }

  const updatePlan = (updatedPlan: Plan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p))
  }

  const assignFieldsToPlan = (planId: string, fieldIds: string[]) => {
    setFields(prev => prev.map(f => {
      if (fieldIds.includes(f.id)) {
        return { ...f, assignedPlanId: planId }
      }
      if (f.assignedPlanId === planId && !fieldIds.includes(f.id)) {
        return { ...f, assignedPlanId: null }
      }
      return f
    }))
    // Close accordion after applying
    setOpenAccordionItems(prev => prev.filter(id => id !== planId))
  }

  const deletePlan = (planId: string, reassignToPlanId?: string) => {
    // If reassigning, update fields first
    if (reassignToPlanId) {
      setFields(prev => prev.map(f => 
        f.assignedPlanId === planId 
          ? { ...f, assignedPlanId: reassignToPlanId }
          : f
      ))
    } else {
      // Unassign all fields
      setFields(prev => prev.map(f => 
        f.assignedPlanId === planId 
          ? { ...f, assignedPlanId: null }
          : f
      ))
    }
    // Remove plan
    setPlans(prev => prev.filter(p => p.id !== planId))
  }

  const duplicatePlan = (plan: Plan) => {
    const newPlanId = generateId()
    const migratedPlan = migratePlan(plan)
    const newPlan: Plan = {
      ...migratedPlan,
      id: newPlanId,
      name: `Copy of ${plan.name}`,
      fertilizers: migratedPlan.fertilizers.map(f => ({
        ...f,
        id: generateId() // New ID for each fertilizer
      }))
    }
    setPlans(prev => [...prev, newPlan])
    
    // Close original, open duplicate
    setOpenAccordionItems(prev => {
      const withoutOriginal = prev.filter(id => id !== plan.id)
      return [...withoutOriginal, newPlanId]
    })
    
    // Scroll to duplicate after state update
    setTimeout(() => {
      const duplicateElement = document.getElementById(`plan-accordion-${newPlanId}`)
      duplicateElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }



  const handleConfirm = () => {
    // Check if actually valid
    const unassigned = fields.filter(f => !f.assignedPlanId)
    if (unassigned.length > 0) return

    alert(`Successfully saved ${plans.length} plans for ${fields.length} fields!`)
  }

  const unassignedValues = fields.filter(f => !f.assignedPlanId)

  return (
    <div className="min-h-screen bg-muted/10 font-sans">
      <Navigation fieldCount={fieldCount} onFieldCountChange={handleFieldCountChange} />

      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fertiliser Plans</h1>
          <p className="text-muted-foreground text-lg">Define nutrient strategies and apply them to your fields.</p>
        </div>

        {unassignedValues.length > 0 && (
          <Alert variant="destructive" className="bg-warning/10 text-warning border-warning/50">
            <AlertTriangle className="h-4 w-4 stroke-warning" />
            <AlertTitle className="text-warning">Action Required</AlertTitle>
            <AlertDescription className="text-warning">
              {unassignedValues.length} fields still require fertiliser plans to be assigned.
            </AlertDescription>
          </Alert>
        )}

        <section className="space-y-4">
          {plans.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-card/50 hover:bg-card/80 transition-colors">
              <div className="max-w-sm mx-auto space-y-4">
                <p className="text-muted-foreground text-lg">No plans defined yet.</p>
                <Button onClick={addPlan} size="lg" className="w-full">
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
                <PlanAccordionItem
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
                />
              ))}
            </Accordion>
          )}

          {plans.length > 0 && (
            <Button
              onClick={addPlan}
              variant="outline"
              className="w-full border-dashed border-2 h-14 text-base font-medium hover:border-primary/50 hover:bg-muted/50"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Another Plan
            </Button>
          )}
        </section>

        <ValidationSummary
          fields={fields}
          plans={plans}
          onAssignFields={assignFieldsToPlan}
          onConfirm={handleConfirm}
        />
      </main>
    </div>
  )
}
