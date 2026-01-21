import type { Field, Plan } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { getPlanTypeColor, getPlanTypeDotColor } from "@/lib/utils"

interface ValidationSummaryProps {
    fields: Field[]
    plans: Plan[]
    onAssignToUnassigned?: (planId: string) => void // Deprecated/Optional
    onAssignFields: (planId: string, fieldIds: string[]) => void // New specific handler
    onConfirm: () => void
}

export function ValidationSummary({ fields, plans, onAssignFields, onConfirm }: ValidationSummaryProps) {
    const unassignedFields = fields.filter(f => !f.assignedPlanId)
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([])
    const [selectedPlanId, setSelectedPlanId] = useState<string>("")

    const handleBulkApply = () => {
        if (selectedPlanId && selectedFieldIds.length > 0) {
            onAssignFields(selectedPlanId, selectedFieldIds)
            setSelectedFieldIds([])
            setSelectedPlanId("")
        }
    }

    const toggleField = (id: string) => {
        setSelectedFieldIds(prev =>
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        )
    }

    const isComplete = unassignedFields.length === 0

    return (
        <div className="space-y-6">
            <Card className={`transition-colors duration-300 ${isComplete ? "border-success/50 bg-success/10" : "border-warning/50 bg-warning/10"}`}>
                <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-xl ${isComplete ? "text-success" : "text-warning"}`}>
                        {isComplete ? (
                            <><CheckCircle className="h-6 w-6" /> Validation Complete</>
                        ) : (
                            <><AlertTriangle className="h-6 w-6" /> Missing Assignments</>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isComplete ? (
                        <p className="text-muted-foreground">All fields have been assigned a fertiliser plan. You are ready to proceed.</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">
                                    Select fields to assign a plan:
                                </p>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedFieldIds(unassignedFields.map(f => f.id))}>
                                    Select All
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                                {unassignedFields.map(field => {
                                    const isSelected = selectedFieldIds.includes(field.id)
                                    return (
                                        <div
                                            key={field.id}
                                            onClick={() => toggleField(field.id)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all
                                                ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-background hover:bg-muted/50'}
                                                ${getPlanTypeColor('unassigned')}
                                            `}
                                        >
                                            <Checkbox checked={isSelected} className="pointer-events-none" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium block">{field.name}</span>
                                                {field.hectares && (
                                                    <span className="text-xs text-muted-foreground">{field.hectares.toFixed(1)} ha</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {selectedFieldIds.length > 0 && (
                                <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-2 md:sticky md:bottom-auto md:shadow-none md:border md:rounded-lg md:z-0">
                                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <span className="font-semibold">{selectedFieldIds.length} Selected</span>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedFieldIds([])} className="text-muted-foreground h-auto p-0 hover:text-foreground">
                                                Deselect All
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:flex-none justify-end">
                                            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                                                <SelectTrigger className="w-full md:w-[250px] bg-background">
                                                    <SelectValue placeholder="Select a plan..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {plans.map(p => (
                                                        <SelectItem key={p.id} value={p.id} className="flex items-center gap-2">
                                                            <span className={`h-2 w-2 rounded-full ${getPlanTypeDotColor(p.type)}`} />
                                                            {p.name || "Untitled Plan"}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={handleBulkApply} disabled={!selectedPlanId}>
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4 pb-12">
                <Button
                    size="lg"
                    onClick={onConfirm}
                    disabled={!isComplete}
                    className={`w-full md:w-auto min-w-[240px] text-lg h-12 ${isComplete ? 'shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed'}`}
                >
                    Confirm & Save
                </Button>
            </div>
        </div>
    )
}
