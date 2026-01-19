import { useState, useEffect } from "react"
import { ORGANIC_TYPES, NO_FERT_REASONS, type Field, type Plan } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface PlanAccordionItemProps {
    plan: Plan
    fields: Field[]
    onUpdate: (plan: Plan) => void
    onAssignFields: (planId: string, fieldIds: string[]) => void
    onDelete?: (planId: string) => void
}

export function PlanAccordionItem({ plan, fields, onUpdate, onAssignFields }: PlanAccordionItemProps) {
    // Local state for field selection in this card
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([])

    // Initialize selection based on current assignments
    useEffect(() => {
        const assigned = fields.filter(f => f.assignedPlanId === plan.id).map(f => f.id)
        setSelectedFieldIds(assigned)
    }, [fields, plan.id])

    // Also update local selection if assignments change externally (e.g. wiped)
    // But care to not overwrite user attempting to change it. 
    // For simplicity, we sync on mount or specific dependency, let's trust react-hooks.

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation() // prevent accordion toggle if clicked there
        onAssignFields(plan.id, selectedFieldIds)
    }

    const assignedCount = fields.filter(f => f.assignedPlanId === plan.id).length

    return (
        <AccordionItem value={plan.id} className="border rounded-lg mb-4 bg-card px-0 overflow-hidden shadow-sm">
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-muted/20">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-lg">{plan.name || "New Plan"}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{plan.type} Strategy</span>
                    </div>

                    <div className="ml-auto mr-4 flex items-center gap-2">
                        {assignedCount > 0 ? (
                            <Badge variant="secondary" className="font-normal">
                                {assignedCount} fields assigned
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="font-normal text-muted-foreground">
                                Unassigned
                            </Badge>
                        )}
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4 bg-card">
                <div className="space-y-8">
                    {/* Plan Settings */}
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label>Plan Name</Label>
                            <Input
                                value={plan.name}
                                onChange={(e) => onUpdate({ ...plan, name: e.target.value })}
                                placeholder="e.g. Main Field Alfalfa"
                                className="max-w-md"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Strategy Type</Label>
                            <div className="flex gap-2 p-1 bg-muted/30 w-fit rounded-lg border">
                                <Button
                                    variant={plan.type === 'synthetic' ? 'secondary' : 'ghost'}
                                    onClick={() => onUpdate({ ...plan, type: 'synthetic' })}
                                    className="min-w-[120px]"
                                >
                                    Synthetic
                                </Button>
                                <Button
                                    variant={plan.type === 'organic' ? 'secondary' : 'ghost'}
                                    onClick={() => onUpdate({ ...plan, type: 'organic' })}
                                    className="min-w-[120px]"
                                >
                                    Organic
                                </Button>
                                <Button
                                    variant={plan.type === 'none' ? 'secondary' : 'ghost'}
                                    onClick={() => onUpdate({ ...plan, type: 'none' })}
                                    className="min-w-[120px]"
                                >
                                    No Fertilizer
                                </Button>
                            </div>
                        </div>

                        {plan.type === 'synthetic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid gap-2">
                                    <Label>Nitrogen (N)</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={plan.n || ''}
                                            onChange={e => onUpdate({ ...plan, n: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                    </div>
                                </div>
                                <div className="hidden md:block"></div> {/* Spacer */}

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Phosphorus</Label>
                                        <ToggleGroup type="single" value={plan.pUnit || 'P'} onValueChange={v => v && onUpdate({ ...plan, pUnit: v as any })} size="sm">
                                            <ToggleGroupItem value="P" className="h-6 px-2 text-xs">P</ToggleGroupItem>
                                            <ToggleGroupItem value="P2O5" className="h-6 px-2 text-xs">P2O5</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={plan.p || ''}
                                            onChange={e => onUpdate({ ...plan, p: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Potassium</Label>
                                        <ToggleGroup type="single" value={plan.kUnit || 'K'} onValueChange={v => v && onUpdate({ ...plan, kUnit: v as any })} size="sm">
                                            <ToggleGroupItem value="K" className="h-6 px-2 text-xs">K</ToggleGroupItem>
                                            <ToggleGroupItem value="K2O" className="h-6 px-2 text-xs">K2O</ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={plan.k || ''}
                                            onChange={e => onUpdate({ ...plan, k: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-4 pt-2 border-t mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Nitrification Inhibitor</Label>
                                            <p className="text-xs text-muted-foreground">Did you use an inhibitor for this application?</p>
                                        </div>
                                        <Switch
                                            checked={plan.hasInhibitor || false}
                                            onCheckedChange={(checked) => onUpdate({ ...plan, hasInhibitor: checked })}
                                        />
                                    </div>
                                    {plan.hasInhibitor && (
                                        <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                            <Label>Amount with inhibitor</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={plan.inhibitorAmount || ''}
                                                    onChange={e => onUpdate({ ...plan, inhibitorAmount: Number(e.target.value) })}
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {plan.type === 'organic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid gap-2">
                                    <Label>Organic Source</Label>
                                    <Select value={plan.organicType} onValueChange={(v) => onUpdate({ ...plan, organicType: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ORGANIC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Form</Label>
                                    <ToggleGroup
                                        type="single"
                                        value={plan.organicForm || 'solid'}
                                        onValueChange={(v) => v && onUpdate({ ...plan, organicForm: v as 'solid' | 'liquid' })}
                                        className="justify-start"
                                    >
                                        <ToggleGroupItem value="solid" className="px-4">Solid (t)</ToggleGroupItem>
                                        <ToggleGroupItem value="liquid" className="px-4">Liquid (m³)</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>

                                <div className="grid gap-2 col-span-1 md:col-span-2">
                                    <Label>Application Rate</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={plan.applicationRate || ''}
                                            onChange={e => onUpdate({ ...plan, applicationRate: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">
                                            {plan.organicForm === 'liquid' ? 'm³/ha' : 't/ha'}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-4 pt-2 border-t mt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Nitrification Inhibitor</Label>
                                            <p className="text-xs text-muted-foreground">Did you use an inhibitor for this application?</p>
                                        </div>
                                        <Switch
                                            checked={plan.hasInhibitor || false}
                                            onCheckedChange={(checked) => onUpdate({ ...plan, hasInhibitor: checked })}
                                        />
                                    </div>
                                    {plan.hasInhibitor && (
                                        <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                            <Label>Amount with inhibitor</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    value={plan.inhibitorAmount || ''}
                                                    onChange={e => onUpdate({ ...plan, inhibitorAmount: Number(e.target.value) })}
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">
                                                    {plan.organicForm === 'liquid' ? 'm³/ha' : 't/ha'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {plan.type === 'none' && (
                            <div className="p-4 border rounded-lg bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid gap-2 max-w-md">
                                    <Label>Reason for No Fertilizer</Label>
                                    <Select value={plan.noFertilizerReason} onValueChange={(v) => onUpdate({ ...plan, noFertilizerReason: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select reason..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {NO_FERT_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Field Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-base font-semibold">Apply to Fields</Label>
                                <p className="text-sm text-muted-foreground">Select fields to assign this plan to.</p>
                            </div>
                            <Button onClick={handleApply}>Apply to selected fields</Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {fields.map(field => {
                                const isSelected = selectedFieldIds.includes(field.id)
                                const isAssignedToThis = field.assignedPlanId === plan.id
                                const isAssignedToOther = field.assignedPlanId && field.assignedPlanId !== plan.id

                                return (
                                    <div
                                        key={field.id}
                                        onClick={() => {
                                            setSelectedFieldIds(prev =>
                                                prev.includes(field.id) ? prev.filter(id => id !== field.id) : [...prev, field.id]
                                            )
                                        }}
                                        className={`
                           relative flex flex-col justify-between p-3 rounded-lg border transition-all cursor-pointer h-24
                           ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                           ${isAssignedToOther && !isSelected ? 'opacity-75 bg-muted/20' : ''}
                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium text-sm">{field.name}</span>
                                            <Checkbox
                                                checked={isSelected}
                                                className="mt-0.5"
                                            />
                                        </div>

                                        <div className="mt-2 text-xs">
                                            {isAssignedToThis && (
                                                <span className="text-primary font-medium flex items-center gap-1">
                                                    ● Assigned
                                                </span>
                                            )}
                                            {isAssignedToOther && !isSelected && (
                                                <span className="text-muted-foreground truncate">
                                                    Other Plan
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
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}
