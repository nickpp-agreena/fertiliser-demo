import { useState, useEffect, useRef } from "react"
import { ORGANIC_TYPES, NO_FERT_REASONS, type Field, type Plan, type Fertilizer } from "@/lib/types"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EnhancedFieldSelection } from "@/components/EnhancedFieldSelection"
import { DeletePlanModal } from "@/components/DeletePlanModal"
import { MoreVertical, Copy, Trash2, Check, CheckCircle, Plus, X } from "lucide-react"
import { getPlanTypeDotColor, getPlanTypeColor, getPlanTypeTextColor, getPlanTypeBgColor } from "@/lib/utils"

const generateId = () => Math.random().toString(36).substring(2, 9)

interface PlanAccordionItemProps {
    plan: Plan
    fields: Field[]
    plans: Plan[]
    onUpdate: (plan: Plan) => void
    onAssignFields: (planId: string, fieldIds: string[]) => void
    onDelete: (planId: string, reassignToPlanId?: string) => void
    onDuplicate: (plan: Plan) => void
    isOpen?: boolean
    onClose?: () => void
}

export function PlanAccordionItem({ plan, fields, plans, onUpdate, onAssignFields, onDelete, onDuplicate, isOpen, onClose }: PlanAccordionItemProps) {
    // Local state for field selection in this card
    const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [lastSavedPlan, setLastSavedPlan] = useState<Plan | null>(null)
    const [showSaveSuccess, setShowSaveSuccess] = useState(false)
    const planRef = useRef<Plan>(plan)
    const nameInputRef = useRef<HTMLInputElement>(null)
    
    // Ensure plan has fertilizers array (migration safety)
    const migratedPlan = plan.fertilizers && Array.isArray(plan.fertilizers) 
        ? plan 
        : { ...plan, fertilizers: plan.type === 'synthetic' 
            ? [{ id: generateId(), n: 0, p: 0, pUnit: 'P' as const, k: 0, kUnit: 'K' as const }]
            : plan.type === 'organic'
            ? [{ id: generateId(), organicType: '', organicForm: 'solid' as const, applicationRate: 0 }]
            : []
        }

    // Initialize selection based on current assignments
    useEffect(() => {
        const assigned = fields.filter(f => f.assignedPlanId === migratedPlan.id).map(f => f.id)
        setSelectedFieldIds(assigned)
    }, [fields, migratedPlan.id])

    // Track plan changes for save button
    useEffect(() => {
        planRef.current = migratedPlan
    }, [migratedPlan])

    // Initialize last saved plan on mount
    useEffect(() => {
        if (!lastSavedPlan) {
            setLastSavedPlan(JSON.parse(JSON.stringify(migratedPlan)))
        }
    }, [])

    // Focus plan name input when duplicate is opened
    useEffect(() => {
        if (isOpen && migratedPlan.name.startsWith('Copy of ') && nameInputRef.current) {
            setTimeout(() => {
                nameInputRef.current?.focus()
                nameInputRef.current?.select()
            }, 150)
        }
    }, [isOpen, migratedPlan.name])

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation() // prevent accordion toggle if clicked there
        onAssignFields(migratedPlan.id, selectedFieldIds)
    }

    // Generate fertilizer summary text for display
    const getFertilizerSummary = (fertilizers: Fertilizer[]): string => {
        if (fertilizers.length === 0) return ''
        
        const summaries = fertilizers.map(fertilizer => {
            if ('n' in fertilizer || 'p' in fertilizer || 'k' in fertilizer) {
                // Synthetic fertilizer - show the main nutrient (N, P, or K) with highest value
                const n = fertilizer.n || 0
                const p = fertilizer.p || 0
                const k = fertilizer.k || 0
                const maxValue = Math.max(n, p, k)
                let nutrient = ''
                if (maxValue === n && n > 0) nutrient = 'N'
                else if (maxValue === p && p > 0) nutrient = fertilizer.pUnit === 'P2O5' ? 'P₂O₅' : 'P'
                else if (maxValue === k && k > 0) nutrient = fertilizer.kUnit === 'K2O' ? 'K₂O' : 'K'
                else nutrient = 'N' // Default to N if all are 0
                
                return `Synthetic (${nutrient}) ${maxValue > 0 ? maxValue : 0}kg/ha`
            } else if ('organicType' in fertilizer) {
                // Organic fertilizer
                const type = fertilizer.organicType || 'Organic'
                const rate = fertilizer.applicationRate || 0
                const unit = fertilizer.organicForm === 'liquid' ? 'm³/ha' : 't/ha'
                return `Organic (${type}) ${rate}${unit}`
            }
            return ''
        }).filter(s => s !== '')
        
        return summaries.join(' • ')
    }

    const fertilizerSummary = getFertilizerSummary(migratedPlan.fertilizers)

    // Helper to update plan type based on fertilizers
    const updatePlanTypeFromFertilizers = (fertilizers: Fertilizer[]): PlanType => {
        const hasSynthetic = fertilizers.some(f => 'n' in f || 'p' in f || 'k' in f)
        const hasOrganic = fertilizers.some(f => 'organicType' in f)
        return hasSynthetic ? 'synthetic' : hasOrganic ? 'organic' : 'none'
    }

    const addSyntheticFertilizer = () => {
        const newFertilizer: SyntheticFertilizer = { 
            id: generateId(), 
            n: 0, 
            p: 0, 
            k: 0, 
            pUnit: 'P', 
            kUnit: 'K',
            hasInhibitor: false
        }
        const updatedFertilizers = [...migratedPlan.fertilizers, newFertilizer]
        const updatedPlan = { 
            ...migratedPlan, 
            fertilizers: updatedFertilizers,
            type: updatePlanTypeFromFertilizers(updatedFertilizers)
        }
        onUpdate(updatedPlan)
    }

    const addOrganicFertilizer = () => {
        const newFertilizer: OrganicFertilizer = { 
            id: generateId(), 
            organicType: '', 
            organicForm: 'solid', 
            applicationRate: 0,
            hasInhibitor: false
        }
        const updatedFertilizers = [...migratedPlan.fertilizers, newFertilizer]
        const updatedPlan = { 
            ...migratedPlan, 
            fertilizers: updatedFertilizers,
            type: updatePlanTypeFromFertilizers(updatedFertilizers)
        }
        onUpdate(updatedPlan)
    }

    const removeFertilizer = (fertilizerId: string) => {
        const updatedFertilizers = migratedPlan.fertilizers.filter(f => f.id !== fertilizerId)
        const updatedPlan = { 
            ...migratedPlan, 
            fertilizers: updatedFertilizers,
            type: updatePlanTypeFromFertilizers(updatedFertilizers)
        }
        onUpdate(updatedPlan)
    }

    const updateFertilizer = (fertilizerId: string, updates: Partial<Fertilizer>) => {
        onUpdate({
            ...migratedPlan,
            fertilizers: migratedPlan.fertilizers.map(f => 
                f.id === fertilizerId ? { ...f, ...updates } : f
            )
        })
    }

    const assignedCount = fields.filter(f => f.assignedPlanId === migratedPlan.id).length
    const otherPlans = plans.filter(p => p.id !== migratedPlan.id)
    
    // Check if plan has unsaved changes
    const hasUnsavedChanges = lastSavedPlan ? JSON.stringify(migratedPlan) !== JSON.stringify(lastSavedPlan) : false

    const handleSave = () => {
        onUpdate(migratedPlan)
        setLastSavedPlan(JSON.parse(JSON.stringify(migratedPlan)))
        setShowSaveSuccess(true)
        setTimeout(() => {
            setShowSaveSuccess(false)
            onClose?.() // Collapse accordion after save
        }, 2000)
    }

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDuplicate(migratedPlan)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (assignedCount > 0) {
            setIsDeleteModalOpen(true)
        } else {
            onDelete(migratedPlan.id)
        }
    }

    const handleDeleteConfirm = () => {
        onDelete(migratedPlan.id)
        setIsDeleteModalOpen(false)
    }

    const handleReassignAndDelete = (targetPlanId: string) => {
        onDelete(migratedPlan.id, targetPlanId)
        setIsDeleteModalOpen(false)
    }

    // Helper to get plan name by ID
    const getPlanName = (planId: string | null): string => {
        if (!planId) return ""
        const foundPlan = plans.find(p => p.id === planId)
        return foundPlan?.name || ""
    }

    // Helper to truncate plan name
    const truncatePlanName = (name: string, maxLength: number = 20): string => {
        if (name.length <= maxLength) return name
        return name.substring(0, maxLength - 3) + "..."
    }

    return (
        <AccordionItem 
            id={`plan-accordion-${migratedPlan.id}`}
            value={migratedPlan.id} 
            className="border rounded-lg mb-4 bg-card px-0 overflow-hidden shadow-sm"
        >
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-muted/20">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${getPlanTypeDotColor(migratedPlan.type)}`} />
                            <span className="font-extrabold text-xl tracking-tight">{migratedPlan.name || "New Plan"}</span>
                        </div>
                        {fertilizerSummary ? (
                            <span className="text-xs font-medium text-muted-foreground">{fertilizerSummary}</span>
                        ) : migratedPlan.type === 'none' ? (
                            <span className="text-xs font-medium text-muted-foreground">No Fertiliser</span>
                        ) : null}
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Plan actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleDuplicate}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-10 px-6 py-6">
                {/* Plan Settings */}
                <div className="grid gap-8">
                    <div className="grid gap-3">
                        <Label className="font-bold text-sm">Plan Name</Label>
                        <Input
                            ref={nameInputRef}
                            value={migratedPlan.name}
                            onChange={(e) => onUpdate({ ...migratedPlan, name: e.target.value })}
                            placeholder="e.g. Main Field Alfalfa"
                            className="max-w-md"
                        />
                    </div>

                    {/* Show initial action buttons when plan has no fertilizers */}
                    {migratedPlan.fertilizers.length === 0 && (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <Button 
                                    onClick={addSyntheticFertilizer}
                                    variant="outline"
                                    size="lg"
                                    className="w-full justify-start"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Synthetic
                                </Button>
                                <Button 
                                    onClick={addOrganicFertilizer}
                                    variant="outline"
                                    size="lg"
                                    className="w-full justify-start"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Organic
                                </Button>
                                <Button 
                                    onClick={() => {
                                        const updatedPlan = { ...migratedPlan, type: 'none' as const }
                                        onUpdate(updatedPlan)
                                    }}
                                    variant="outline"
                                    size="lg"
                                    className={`w-full justify-start ${migratedPlan.type === 'none' ? getPlanTypeBgColor('none') + ' ' + getPlanTypeTextColor('none') : ''}`}
                                >
                                    No Fertiliser Applied
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Show fertilizers section only if fertilizers exist (not in initial state) */}
                    {migratedPlan.fertilizers.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold text-sm">Fertilizers</Label>
                            </div>
                            
                            {migratedPlan.fertilizers.map((fertilizer, index) => {
                                // Determine if this fertilizer is synthetic or organic
                                const isSynthetic = 'n' in fertilizer || 'p' in fertilizer || 'k' in fertilizer || 'pUnit' in fertilizer || 'kUnit' in fertilizer
                                
                                return (
                                <div key={fertilizer.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-xl bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-300 relative">
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <Badge 
                                            variant="outline" 
                                            className={`text-xs ${isSynthetic ? getPlanTypeBgColor('synthetic') + ' ' + getPlanTypeTextColor('synthetic') : getPlanTypeBgColor('organic') + ' ' + getPlanTypeTextColor('organic')}`}
                                        >
                                            {isSynthetic ? 'Synthetic' : 'Organic'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {index + 1} of {migratedPlan.fertilizers.length}
                                        </span>
                                        <Button
                                            onClick={() => removeFertilizer(fertilizer.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {isSynthetic ? (
                                        <>
                                            <div className="grid gap-3">
                                                <Label className="font-bold text-sm">Nitrogen (N)</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={fertilizer.n || ''}
                                                        onChange={e => updateFertilizer(fertilizer.id, { n: Number(e.target.value) })}
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                                </div>
                                            </div>
                                            <div className="hidden md:block"></div>

                                            <div className="grid gap-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-bold text-sm">Phosphorus</Label>
                                                    <ToggleGroup type="single" value={fertilizer.pUnit || 'P'} onValueChange={v => v && updateFertilizer(fertilizer.id, { pUnit: v as any })} size="sm">
                                                        <ToggleGroupItem value="P" className="h-6 px-2 text-xs">P</ToggleGroupItem>
                                                        <ToggleGroupItem value="P2O5" className="h-6 px-2 text-xs"><span className="[&_sub]:text-[0.7em] [&_sub]:leading-none">P<sub>2</sub>O<sub>5</sub></span></ToggleGroupItem>
                                                    </ToggleGroup>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={fertilizer.p || ''}
                                                        onChange={e => updateFertilizer(fertilizer.id, { p: Number(e.target.value) })}
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-bold text-sm">Potassium</Label>
                                                    <ToggleGroup type="single" value={fertilizer.kUnit || 'K'} onValueChange={v => v && updateFertilizer(fertilizer.id, { kUnit: v as any })} size="sm">
                                                        <ToggleGroupItem value="K" className="h-6 px-2 text-xs">K</ToggleGroupItem>
                                                        <ToggleGroupItem value="K2O" className="h-6 px-2 text-xs"><span className="[&_sub]:text-[0.7em] [&_sub]:leading-none">K<sub>2</sub>O</span></ToggleGroupItem>
                                                    </ToggleGroup>
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={fertilizer.k || ''}
                                                        onChange={e => updateFertilizer(fertilizer.id, { k: Number(e.target.value) })}
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                                </div>
                                            </div>

                                            {/* Inhibitor for Synthetic Fertilizer */}
                                            <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <Label className="font-bold text-sm">Nitrification Inhibitor</Label>
                                                        <p className="text-xs text-muted-foreground">Did you use an inhibitor for this fertilizer?</p>
                                                    </div>
                                                    <Switch
                                                        checked={fertilizer.hasInhibitor || false}
                                                        onCheckedChange={(checked) => updateFertilizer(fertilizer.id, { hasInhibitor: checked })}
                                                    />
                                                </div>
                                                {fertilizer.hasInhibitor && (
                                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                                        <Label className="text-sm">Amount with inhibitor</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                value={fertilizer.inhibitorAmount || ''}
                                                                onChange={e => updateFertilizer(fertilizer.id, { inhibitorAmount: Number(e.target.value) })}
                                                                placeholder="0"
                                                            />
                                                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-3">
                                                <Label className="font-bold text-sm">Organic Source</Label>
                                                <Select 
                                                    value={fertilizer.organicType || ''} 
                                                    onValueChange={(v) => updateFertilizer(fertilizer.id, { organicType: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ORGANIC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label className="font-bold text-sm">Form</Label>
                                                <ToggleGroup
                                                    type="single"
                                                    value={fertilizer.organicForm || 'solid'}
                                                    onValueChange={(v) => v && updateFertilizer(fertilizer.id, { organicForm: v as 'solid' | 'liquid' })}
                                                    className="justify-start"
                                                >
                                                    <ToggleGroupItem value="solid" className="px-4">Solid (t)</ToggleGroupItem>
                                                    <ToggleGroupItem value="liquid" className="px-4">Liquid (m³)</ToggleGroupItem>
                                                </ToggleGroup>
                                            </div>

                                            <div className="grid gap-3 col-span-1 md:col-span-2">
                                                <Label className="font-bold text-sm">Application Rate</Label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={fertilizer.applicationRate || ''}
                                                        onChange={e => updateFertilizer(fertilizer.id, { applicationRate: Number(e.target.value) })}
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">
                                                        {fertilizer.organicForm === 'liquid' ? 'm³/ha' : 't/ha'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Inhibitor for Organic Fertilizer */}
                                            <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <Label className="font-bold text-sm">Nitrification Inhibitor</Label>
                                                        <p className="text-xs text-muted-foreground">Did you use an inhibitor for this fertilizer?</p>
                                                    </div>
                                                    <Switch
                                                        checked={fertilizer.hasInhibitor || false}
                                                        onCheckedChange={(checked) => updateFertilizer(fertilizer.id, { hasInhibitor: checked })}
                                                    />
                                                </div>
                                                {fertilizer.hasInhibitor && (
                                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                                        <Label className="text-sm">Amount with inhibitor</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                value={fertilizer.inhibitorAmount || ''}
                                                                onChange={e => updateFertilizer(fertilizer.id, { inhibitorAmount: Number(e.target.value) })}
                                                                placeholder="0"
                                                            />
                                                            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">kg/ha</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                            })}
                            
                            {/* Add Fertilizer Buttons - Below all fertilizers */}
                            <div className="flex gap-3">
                                <Button 
                                    onClick={addSyntheticFertilizer} 
                                    variant="outline" 
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Synthetic Fertiliser
                                </Button>
                                <Button 
                                    onClick={addOrganicFertilizer} 
                                    variant="outline" 
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Organic Fertiliser
                                </Button>
                            </div>
                        </div>
                    )}



                    {migratedPlan.type === 'none' && migratedPlan.fertilizers.length === 0 && (
                        <div className="p-4 border rounded-lg bg-muted/10 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid gap-2 max-w-md">
                                <Label>Reason for No Fertilizer</Label>
                                <Select value={migratedPlan.noFertilizerReason} onValueChange={(v) => onUpdate({ ...migratedPlan, noFertilizerReason: v })}>
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

                {/* Field Selection - Only show if plan has fertilizers (not in initial state) */}
                {migratedPlan.fertilizers.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-6">
                            <div className="flex items-center justify-end">
                                <Button onClick={handleApply} className="font-bold shadow-sm">Apply to selected fields</Button>
                            </div>
                            <EnhancedFieldSelection
                                fields={fields}
                                selectedFieldIds={selectedFieldIds}
                                onSelectionChange={setSelectedFieldIds}
                                planId={migratedPlan.id}
                                plans={plans}
                            />
                            <div className="flex items-center justify-end">
                                <Button onClick={handleApply} className="font-bold shadow-sm">Apply to selected fields</Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
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
            
            {/* Delete Modal */}
            <DeletePlanModal
                plan={migratedPlan}
                assignedFieldCount={assignedCount}
                otherPlans={otherPlans}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDeleteConfirm}
                onReassignAndDelete={handleReassignAndDelete}
            />
            
        </AccordionItem >
    )
}
