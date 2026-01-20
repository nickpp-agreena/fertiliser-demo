# Multiple Fertilizers per Plan & Accordion Auto-Close

## Overview
Allow users to add multiple fertilizers to a single plan, and automatically close the accordion when a plan is applied to fields.

**Updated Requirements:**
- Remove Strategy Type selector - fertilizers determine the plan type
- Replace "Add Fertilizer" dialog with two direct buttons: "Add Synthetic Fertiliser" and "Add Organic Fertiliser"
- Strategy Type indicator should be nested/connected with fertilizer data (shows based on fertilizers in plan)
- Nitrification inhibitor should be per fertilizer, not per plan

## Features Required

### 1. Multiple Fertilizers per Plan
- Change data model to support array of fertilizers
- Add UI to add/remove fertilizers
- Each fertilizer has its own properties (N, P, K for synthetic; organicType, form, rate for organic)
- Inhibitor can remain at plan level (applies to all fertilizers) or per fertilizer

### 2. Auto-Close Accordion on Apply
- When "Apply to selected fields" is clicked, close that accordion item
- Use controlled accordion state in App.tsx
- Pass callback to close accordion from PlanAccordionItem

### 3. Duplicate Plan Behavior
- When a plan is duplicated:
  - Duplicate accordion should be expanded (open)
  - Original plan accordion should be collapsed (closed)
  - Scroll focus should move to the duplicate plan
  - Plan Name input in duplicate should be selected/focused for easy renaming

## Implementation Plan

### 1. Update Type Definitions
**File**: `src/lib/types.ts`

**Changes**:
- Create new `Fertilizer` type for individual fertilizers
- Update `Plan` type to use `fertilizers: Fertilizer[]` instead of individual fields
- Keep inhibitor at plan level (simpler UX)
- Maintain backward compatibility during migration

**New Types**:
```typescript
export type SyntheticFertilizer = {
  id: string
  n?: number
  p?: number
  pUnit?: "P" | "P2O5"
  k?: number
  kUnit?: "K" | "K2O"
  hasInhibitor?: boolean
  inhibitorAmount?: number
}

export type OrganicFertilizer = {
  id: string
  organicType?: string
  organicForm?: "solid" | "liquid"
  applicationRate?: number
  hasInhibitor?: boolean
  inhibitorAmount?: number
}

export type Fertilizer = SyntheticFertilizer | OrganicFertilizer

export type Plan = {
  id: string
  name: string
  type: PlanType // Derived from fertilizers or explicitly set to "none"
  fertilizers: Fertilizer[] // Array instead of single values
  // None
  noFertilizerReason?: string
}
```

### 2. Migrate Existing Plans
**File**: `src/App.tsx`

**Changes**:
- Add migration function to convert old plan format to new format
- Run migration when plans are loaded/created
- Ensure existing plans work with new structure

**Migration Logic**:
- If plan has old format (n, p, k directly on plan), convert to fertilizers array
- Create one fertilizer from existing values
- Preserve all data

### 3. Update PlanAccordionItem UI
**File**: `src/components/PlanAccordionItem.tsx`

**Changes**:
- Remove Strategy Type selector buttons
- Replace single fertilizer inputs with list of fertilizers
- Add two buttons: "Add Synthetic Fertiliser" and "Add Organic Fertiliser" (no dialog)
- Each fertilizer in a card/container with remove button and type indicator
- For synthetic: show N, P, K inputs per fertilizer + inhibitor controls
- For organic: show type, form, rate per fertilizer + inhibitor controls
- Move inhibitor to each fertilizer (not plan level)
- Show Strategy Type indicator (read-only, derived from fertilizers or "None")
- Update all fertilizer-related logic to work with array

**UI Structure**:
```
Plan Settings
├── Plan Name
└── Fertilizers Section
    ├── Fertilizer 1 [Remove] [Type: Synthetic/Organic indicator]
    │   ├── N, P, K inputs (synthetic) OR
    │   ├── Type, Form, Rate (organic)
    │   └── Inhibitor (per fertilizer)
    ├── Fertilizer 2 [Remove] [Type: Synthetic/Organic indicator]
    └── Buttons:
        ├── [+ Add Synthetic Fertiliser]
        └── [+ Add Organic Fertiliser]
└── Strategy Type indicator (derived from fertilizers or "None")
```

### 4. Add Accordion State Control
**File**: `src/App.tsx`

**Changes**:
- Change Accordion from uncontrolled to controlled
- Add state: `const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([])`
- Pass `value` and `onValueChange` to Accordion
- Add function to close specific accordion item

**File**: `src/components/PlanAccordionItem.tsx`

**Changes**:
- Add `onApply` callback prop that closes accordion
- Call this callback in `handleApply` after assigning fields
- Pass accordion close function from App.tsx

### 5. Update Plan Creation
**File**: `src/App.tsx`

**Changes**:
- When creating new plan, initialize with empty fertilizers array
- Plan type can be "none" or derived from first fertilizer added
- Default to empty fertilizers array (user adds fertilizers as needed)

### 6. Update Duplicate Logic
**File**: `src/App.tsx`

**Changes**:
- When duplicating plan, copy entire fertilizers array
- Generate new IDs for each fertilizer in the duplicated plan
- After duplication:
  - Close original plan accordion: `setOpenAccordionItems(prev => prev.filter(id => id !== originalPlanId))`
  - Open duplicate plan accordion: `setOpenAccordionItems(prev => [...prev, newPlanId])`
  - Scroll to duplicate: Use `scrollIntoView()` on the duplicate accordion item
  - Focus plan name input: Pass ref or use `useEffect` in PlanAccordionItem to focus when plan is newly duplicated

**File**: `src/components/PlanAccordionItem.tsx`

**Changes**:
- Add `isNewlyDuplicated` prop or detect via plan ID comparison
- Use `useRef` and `useEffect` to focus plan name input when component mounts and is newly duplicated
- Add `id` attribute to accordion item for scroll targeting

## Technical Details

### Fertilizer ID Generation
- Use `generateId()` for each new fertilizer
- Store in `Fertilizer.id` field

### Add/Remove Fertilizer
```typescript
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
  onUpdate({ ...plan, fertilizers: [...plan.fertilizers, newFertilizer] })
}

const addOrganicFertilizer = () => {
  const newFertilizer: OrganicFertilizer = { 
    id: generateId(), 
    organicType: '', 
    organicForm: 'solid', 
    applicationRate: 0,
    hasInhibitor: false
  }
  onUpdate({ ...plan, fertilizers: [...plan.fertilizers, newFertilizer] })
}

const removeFertilizer = (fertilizerId: string) => {
  onUpdate({ ...plan, fertilizers: plan.fertilizers.filter(f => f.id !== fertilizerId) })
}
```

### Derive Strategy Type from Fertilizers
```typescript
const getPlanType = (fertilizers: Fertilizer[]): PlanType => {
  if (fertilizers.length === 0) return 'none'
  // Check if all are synthetic or all are organic
  const hasSynthetic = fertilizers.some(f => 'n' in f || 'p' in f || 'k' in f)
  const hasOrganic = fertilizers.some(f => 'organicType' in f)
  // If mixed, could default to first type or show as "mixed"
  return hasSynthetic ? 'synthetic' : 'organic'
}
```

### Accordion Close Logic
```typescript
// In App.tsx
const handleApplyFields = (planId: string, fieldIds: string[]) => {
  assignFieldsToPlan(planId, fieldIds)
  // Close accordion for this plan
  setOpenAccordionItems(prev => prev.filter(id => id !== planId))
}

// In PlanAccordionItem
const handleApply = (e: React.MouseEvent) => {
  e.stopPropagation()
  onAssignFields(plan.id, selectedFieldIds)
  onApply?.() // Callback to close accordion
}
```

### Duplicate Plan Logic
```typescript
// In App.tsx
const duplicatePlan = (plan: Plan) => {
  const newPlan: Plan = {
    ...plan,
    id: generateId(),
    name: `Copy of ${plan.name}`,
    fertilizers: plan.fertilizers.map(f => ({
      ...f,
      id: generateId() // New ID for each fertilizer
    }))
  }
  setPlans(prev => [...prev, newPlan])
  
  // Close original, open duplicate
  setOpenAccordionItems(prev => {
    const withoutOriginal = prev.filter(id => id !== plan.id)
    return [...withoutOriginal, newPlan.id]
  })
  
  // Scroll to duplicate after state update
  setTimeout(() => {
    const duplicateElement = document.getElementById(`plan-accordion-${newPlan.id}`)
    duplicateElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 100)
}

// In PlanAccordionItem.tsx
const nameInputRef = useRef<HTMLInputElement>(null)
const [isNewlyDuplicated, setIsNewlyDuplicated] = useState(false)

useEffect(() => {
  if (isNewlyDuplicated && nameInputRef.current) {
    nameInputRef.current.focus()
    nameInputRef.current.select()
    setIsNewlyDuplicated(false)
  }
}, [isNewlyDuplicated])

// Detect if this is a newly duplicated plan (check if name starts with "Copy of")
useEffect(() => {
  if (plan.name.startsWith('Copy of ') && openAccordionItems.includes(plan.id)) {
    setIsNewlyDuplicated(true)
  }
}, [plan.id, plan.name, openAccordionItems])
```

## Files to Create/Modify

### Modified Files:
1. `src/lib/types.ts` - Add Fertilizer types, update Plan type
2. `src/App.tsx` - Add accordion state control, migration logic, update plan creation, duplicate with scroll/focus
3. `src/components/PlanAccordionItem.tsx` - Complete UI overhaul for multiple fertilizers, add accordion close callback, add focus on duplicate, add id for scrolling
4. `src/components/EnhancedFieldSelection.tsx` - No changes needed (works with plan IDs)
5. `src/components/ValidationSummary.tsx` - No changes needed (works with plan IDs)

## UI/UX Considerations

### Fertilizer List Display
- Each fertilizer in its own card/container
- Clear visual separation between fertilizers
- Remove button (trash icon) for each fertilizer
- Type indicator on each fertilizer card (Synthetic/Organic badge)
- Two buttons at bottom: "Add Synthetic Fertiliser" and "Add Organic Fertiliser"
- Minimum 0 fertilizers allowed (can have empty plan or "None" type)
- Show count: "Fertilizer 1 of 3" or similar
- Strategy Type shown as read-only indicator (derived from fertilizers)

### Accordion Behavior
- Smooth close animation
- Only closes the specific plan that was applied
- Other open accordions remain open
- User can manually reopen if needed

## Migration Strategy

1. Add migration function that checks plan structure
2. If old format detected, convert to new format
3. Run migration on app load and when creating/loading plans
4. Ensure no data loss during migration

## Testing Checklist

- [ ] Can add multiple synthetic fertilizers to a plan
- [ ] Can add multiple organic fertilizers to a plan
- [ ] Can remove fertilizers (except last one)
- [ ] Each fertilizer maintains independent values
- [ ] Inhibitor is per fertilizer (not plan level)
- [ ] Strategy Type is derived from fertilizers or shows "None"
- [ ] Can add both synthetic and organic fertilizers to same plan
- [ ] Two separate "Add" buttons work correctly
- [ ] Accordion closes when "Apply to selected fields" is clicked
- [ ] Other accordions remain open
- [ ] Existing plans migrate correctly
- [ ] Duplicate plan copies all fertilizers
- [ ] Save/Update works with multiple fertilizers
- [ ] When duplicating: original closes, duplicate opens
- [ ] When duplicating: scroll focuses on duplicate
- [ ] When duplicating: plan name input is selected/focused
