import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import type { Field, Plan } from "@/lib/types"
import { PlanAccordionItem } from "@/components/PlanAccordionItem"
import { ValidationSummary } from "@/components/ValidationSummary"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const generateId = () => Math.random().toString(36).substring(2, 9)

const INITIAL_FIELDS: Field[] = Array.from({ length: 10 }, (_, i) => ({
  id: `field-${String(i + 1).padStart(3, '0')}`,
  name: `Field ${String(i + 1).padStart(3, '0')}`,
  assignedPlanId: null
}))

export default function App() {
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS)
  const [plans, setPlans] = useState<Plan[]>([])

  const addPlan = () => {
    const newPlan: Plan = {
      id: generateId(),
      name: `Plan ${plans.length + 1}`,
      type: 'synthetic',
      n: 0, p: 0, k: 0
    }
    setPlans(prev => [...prev, newPlan])
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
      <Navigation />

      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fertilizer Plans</h1>
          <p className="text-muted-foreground text-lg">Define nutrient strategies and apply them to your fields.</p>
        </div>

        {unassignedValues.length > 0 && (
          <Alert variant="destructive" className="bg-warning/10 text-warning border-warning/50">
            <AlertTriangle className="h-4 w-4 stroke-warning" />
            <AlertTitle className="text-warning">Action Required</AlertTitle>
            <AlertDescription className="text-warning-foreground">
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
            <Accordion type="multiple" className="w-full">
              {plans.map(plan => (
                <PlanAccordionItem
                  key={plan.id}
                  plan={plan}
                  fields={fields}
                  onUpdate={updatePlan}
                  onAssignFields={assignFieldsToPlan}
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
