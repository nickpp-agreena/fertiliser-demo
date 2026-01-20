# Fertiliser Demo Architecture - Answers for Liming Demo

## A) Current Demo Architecture

### How is a "Plan" represented in the fertiliser demo?

**Data Model Shape (JSON):**
```typescript
type Plan = {
  id: string                    // Generated: random string (e.g., "abc123")
  name: string                  // User-entered (e.g., "Plan 1")
  type: "synthetic" | "organic" | "none"  // Derived from fertilizers or explicitly set
  fertilizers: Fertilizer[]     // Array of fertilizer objects
  noFertilizerReason?: string   // Only used when type === "none"
}

type Fertilizer = SyntheticFertilizer | OrganicFertilizer

type SyntheticFertilizer = {
  id: string
  n?: number
  p?: number
  pUnit?: "P" | "P2O5"
  k?: number
  kUnit?: "K" | "K2O"
  hasInhibitor?: boolean
  inhibitorAmount?: number
}

type OrganicFertilizer = {
  id: string
  organicType?: string
  organicForm?: "solid" | "liquid"
  applicationRate?: number
  hasInhibitor?: boolean
  inhibitorAmount?: number
}
```

**Key Points:**
- Plans are stored in a flat array (`plans: Plan[]`) in React state
- Each plan has a unique `id` (generated via `Math.random().toString(36).substring(2, 9)`)
- Plans can contain multiple fertilizers (array)
- No year field exists - plans are not year-specific in the current implementation
- Plans are stored in-memory only (no persistence layer visible)

### Does the demo support multiple plans per year?

**No.** The current demo does not have year support. Plans are stored as a simple array with no temporal dimension. To add year support for liming, you would need to:

1. Add a `year` field to the `Plan` type
2. Filter/group plans by year in the UI
3. Consider whether to allow multiple plans per year per field (currently one plan per field)

### Does a plan support assigning to multiple fields?

**Yes.** A plan can be assigned to multiple fields.

**How it works:**
- Fields have an `assignedPlanId: string | null` property
- The assignment is stored on the Field object, not the Plan
- When assigning: `assignFieldsToPlan(planId: string, fieldIds: string[])` updates all selected fields to point to that plan
- Field selection returns an array of field IDs: `string[]`

**Data Model:**
```typescript
type Field = {
  id: string
  name: string
  assignedPlanId: string | null  // Points to plan.id
  hectares?: number
}
```

### Can multiple plans overlap on the same field?

**No, not in the current implementation.** 

- Each field can only have one `assignedPlanId`
- When you assign a new plan to a field, it replaces the previous assignment
- The UI shows visual indicators:
  - Fields assigned to the current plan being edited show with primary color
  - Fields assigned to other plans show with muted styling and the other plan's name
  - Unassigned fields show with "Unassigned" label

**If you need overlapping assignments for liming:**
You would need to change the data model to:
- `assignedPlanIds: string[]` (array instead of single ID)
- Or create a junction table: `FieldPlanAssignment[]` with `fieldId`, `planId`, `year`, etc.

### What components are reusable for a liming "event"?

**Highly Reusable Components:**

1. **`PlanAccordionItem`** (`src/components/PlanAccordionItem.tsx`)
   - Accordion-based plan builder card
   - Handles plan name input, plan configuration, field assignment
   - Includes save/update button with visual feedback
   - Has delete and duplicate actions
   - Auto-collapses after save
   - **Adaptation needed:** Replace fertilizer inputs with liming inputs (material_type, rate, etc.)

2. **`EnhancedFieldSelection`** (`src/components/EnhancedFieldSelection.tsx`)
   - Searchable, sortable field picker
   - Shows hectares automatically
   - Multi-select with checkboxes
   - Visual indicators for assigned/unassigned status
   - **Ready to use:** Just pass different props if needed

3. **`ValidationSummary`** (`src/components/ValidationSummary.tsx`)
   - Shows unassigned fields
   - Bulk assignment UI
   - "Select All" functionality
   - Completion status indicator
   - **Ready to use:** Works with any plan/field structure

4. **`DeletePlanModal`** (`src/components/DeletePlanModal.tsx`)
   - Confirmation modal with reassignment option
   - **Ready to use:** Generic enough for any plan type

5. **UI Components** (from `src/components/ui/`)
   - All ShadCN UI components are reusable: `Button`, `Input`, `Select`, `Checkbox`, `Card`, `Accordion`, etc.

**Reusable Patterns:**
- Accordion-based plan list (from `App.tsx`)
- "Add Another Plan" button pattern
- Field assignment state management
- Plan duplication logic
- Auto-collapse on save

---

## B) Field Selection Mechanics

### What is the field selector input and output?

**Input:**
- `fields: Field[]` - Array of all available fields
- `selectedFieldIds: string[]` - Currently selected field IDs (controlled state)
- `planId: string` - ID of the plan being edited (for visual indicators)
- `plans: Plan[]` - All plans (to show assignment status)

**Output:**
- `onSelectionChange: (ids: string[]) => void` - Callback with array of selected field IDs
- Returns: `string[]` - Array of field IDs

**Component:** `EnhancedFieldSelection` handles the UI, but the actual assignment happens in `App.tsx` via `assignFieldsToPlan(planId, fieldIds)`.

### Does it return hectares automatically?

**Yes, hectares are automatically available** but not returned by the selector.

**How it works:**
- Fields have `hectares?: number` as a property (stored in field data)
- Hectares are displayed in the UI automatically (`{field.hectares.toFixed(1)} ha`)
- Hectares come from `FIELD_DATA` (pre-populated) or could be user-entered
- The selector returns only field IDs, not hectares
- To get hectares: `fields.find(f => f.id === fieldId)?.hectares`

**For liming, you can:**
- Calculate total hectares: `selectedFieldIds.reduce((sum, id) => sum + (fields.find(f => f.id === id)?.hectares || 0), 0)`
- Or store hectares on the plan when fields are assigned

### Is there an existing "select all" or "remaining fields" concept?

**Yes, both exist:**

1. **"Select All" in ValidationSummary:**
   ```typescript
   <Button onClick={() => setSelectedFieldIds(unassignedFields.map(f => f.id))}>
     Select All
   </Button>
   ```
   - Only selects unassigned fields
   - Located in the validation summary component

2. **"Select All Remaining" could be added:**
   - Currently no "select all unassigned" in the field picker itself
   - Easy to add: filter fields where `assignedPlanId === null` and select them

3. **"Clear" button exists:**
   - Clears all selections: `onSelectionChange([])`

### Can we show "unassigned fields remaining" in the UI?

**Yes, this already exists in `ValidationSummary`:**

- Shows count: `{unassignedFields.length} fields still require fertiliser plans to be assigned`
- Displays unassigned fields in a grid
- Allows bulk assignment from the summary view
- Updates in real-time as assignments change

**The pattern:**
```typescript
const unassignedFields = fields.filter(f => !f.assignedPlanId)
```

---

## C) Liming Flow Requirements

### Can the demo support a branch before building plans?

**Yes, but requires implementation.** The current demo goes straight to plan creation. For liming gates, you could:

**Option 1: Conditional rendering in App.tsx**
```typescript
const [limingHistory, setLimingHistory] = useState<{
  appliedLast5Years: boolean | null
  appliedBefore5Years: boolean | null
  lastAppliedYear: string | null
}>({ appliedLast5Years: null, ... })

// Render gates first, then plans
{limingHistory.appliedLast5Years === null && <LimingHistoryGates />}
{limingHistory.appliedLast5Years !== null && <PlanBuilder />}
```

**Option 2: Stepper component**
- Use a multi-step form pattern
- Step 1: History gates
- Step 2: Plan builder (if needed)

**Option 3: Progressive disclosure**
- Show gates at top
- Plans section appears after gates are answered
- All on one screen

### How should we represent 'historical context' entries?

**Recommendation: Use the same Plan object with a flag**

```typescript
type LimingPlan = {
  id: string
  name: string
  year: string | "unknown" | "pre-5-years"  // Banded for historical
  material_type: "limestone" | "dolomite"
  application_rate_t_per_ha: number
  area_ha: number
  field_ids: string[]
  isHistorical?: boolean  // or context_only: true
  historicalBand?: "pre-5-years" | "5-10-years" | etc.
}
```

**Why this approach:**
- Reuses existing plan components
- Same assignment logic works
- Can filter/hide historical plans in UI if needed
- Easier to migrate data later if needed

**Alternative: Separate type**
```typescript
type HistoricalLimingEntry = {
  id: string
  yearBand: string
  material_type: "limestone" | "dolomite"
  // No field_ids needed if it's just "was liming done"
}
```

**Recommendation:** Use the same Plan type with `isHistorical: true` flag. Simpler, more consistent.

### Do we want to store liming plans as year-specific objects?

**Yes, but with flexibility for historical bands:**

```typescript
year: string | "unknown" | "pre-5-years" | "5-10-years-ago"
```

**Recommendation:**
- Current year plans: `year: "2024"` (harvest year)
- Historical (pre-5-years): `year: "pre-5-years"` or `year: "unknown"`
- Store as string to allow both specific years and bands
- UI can group/filter by year type

---

## D) Liming Plan Schema Confirmation

### Proposed liming plan fields

**Confirmed with adjustments:**

```typescript
type LimingPlan = {
  id: string
  name: string
  year: string | "unknown" | "pre-5-years"  // Harvest year or band label
  material_type: "limestone" | "dolomite"
  application_rate_t_per_ha: number
  area_ha: number              // Derived from selected fields (sum of hectares)
  field_ids: string[]          // Array of field IDs
  isHistorical?: boolean       // Flag for historical entries
}
```

**Adjustments:**
- ✅ `year` - confirmed, with band support
- ✅ `material_type` - confirmed
- ✅ `application_rate_t_per_ha` - confirmed
- ✅ `area_ha` - confirmed (derived)
- ✅ `field_ids` - confirmed (array)

### Do we need to capture both area and rate, or can total tonnes be derived?

**Recommendation: Store both area and rate, derive total tonnes when needed**

**Why:**
- Rate is the input (what farmer applies)
- Area is derived from field selection (sum of hectares)
- Total tonnes = `rate * area` (can be calculated, no need to store)

**Storage:**
```typescript
{
  application_rate_t_per_ha: 2.5,  // Input
  area_ha: 45.2,                   // Derived: sum of selected field hectares
  // total_tonnes: 113 (calculated: 2.5 * 45.2)
}
```

**Display:** Show both rate and total in UI:
- "2.5 t/ha across 45.2 ha = 113 tonnes total"

### Any validations we should enforce?

**Recommended validations:**

1. **Rate > 0 if plan has fields assigned:**
   ```typescript
   if (plan.field_ids.length > 0 && plan.application_rate_t_per_ha <= 0) {
     // Show error, disable save
   }
   ```

2. **Cannot continue until at least one plan exists when "Yes":**
   - If `appliedLast5Years === true`, require `plans.length > 0`
   - Show validation message in summary component

3. **Show warning if not all fields are covered (optional):**
   - Already exists in `ValidationSummary` component
   - Shows: "X fields still require liming plans"
   - Can be made optional with a dismiss/acknowledge button

4. **Material type required:**
   - Must select limestone or dolomite before saving

5. **Year validation:**
   - If not historical, year should be a valid year string
   - If historical, year should be a valid band

---

## E) Output and Implementation Constraints

### What is the quickest way to implement this as a single-page prototype?

**Recommendation: Single-page with progressive disclosure**

**Structure:**
```
┌─────────────────────────────────────┐
│  Liming History Gates (if not set) │
│  - Applied last 5 years? Yes/No    │
│  - [Conditional questions]          │
└─────────────────────────────────────┘
           ↓ (after gates answered)
┌─────────────────────────────────────┐
│  Liming Plans Section               │
│  ┌───────────────────────────────┐ │
│  │ Plan 1 [Accordion]            │ │
│  │ - Name, Material, Rate, Fields│ │
│  └───────────────────────────────┘ │
│  [+ Add Another Plan]              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Validation Summary                 │
│  - Unassigned fields                │
│  - Bulk assignment                  │
│  - [Confirm & Save]                │
└─────────────────────────────────────┘
```

**Why single-page:**
- Faster to build (no routing)
- Better UX (see everything, no navigation)
- Reuses existing patterns from fertiliser demo
- Progressive disclosure keeps it clean

**Alternative: Stepper** (if you want more structure)
- Step 1: History gates
- Step 2: Plan builder
- Step 3: Review & confirm
- More code, but clearer flow

### What does the coding AI need to map Mermaid steps to UI states?

**Required information:**

1. **State definitions:**
   ```typescript
   type LimingState = 
     | { step: "history-gates"; data: { appliedLast5Years: null } }
     | { step: "history-gates"; data: { appliedLast5Years: false; appliedBefore5Years: null } }
     | { step: "history-gates"; data: { appliedLast5Years: false; appliedBefore5Years: true; lastAppliedYear: null } }
     | { step: "plan-builder"; data: { history: LimingHistory; plans: LimingPlan[] } }
     | { step: "review"; data: { history: LimingHistory; plans: LimingPlan[] } }
   ```

2. **Transitions:**
   ```typescript
   // Gate transitions
   "history-gates" → "plan-builder" (when gates complete)
   "plan-builder" → "review" (when all fields assigned, optional)
   ```

3. **Data persistence:**
   - Which data persists between steps?
   - History answers: persist to final output
   - Plans: persist and editable
   - Field assignments: persist

4. **Validation rules:**
   - When can user proceed to next step?
   - What blocks progression?
   - What shows warnings vs errors?

5. **UI component mapping:**
   - Which components render in each state?
   - What props do they need?
   - What callbacks handle state transitions?

**Example state machine:**
```typescript
const [state, setState] = useState<LimingState>({
  step: "history-gates",
  data: { appliedLast5Years: null }
})

// Transition function
const handleGateAnswer = (answer: boolean) => {
  if (answer === true) {
    setState({ step: "plan-builder", data: { ...state.data, appliedLast5Years: true, plans: [] } })
  } else {
    // Continue with more gates
  }
}
```

**Mermaid to Code mapping:**
- Mermaid decision nodes → Conditional rendering (`{condition && <Component />}`)
- Mermaid process nodes → UI sections/components
- Mermaid data stores → React state
- Mermaid flows → State transitions via `setState`

---

## Summary & Recommendations

### Architecture Patterns to Reuse:
1. ✅ Accordion-based plan list
2. ✅ Field selection with search/sort
3. ✅ Validation summary with bulk assignment
4. ✅ Plan duplication and deletion
5. ✅ Auto-collapse on save
6. ✅ Hectares automatically displayed (from field data)

### Key Adaptations Needed:
1. Add `year` field to Plan type
2. Replace fertilizer inputs with liming inputs (material_type, rate)
3. Add history gates before plan builder
4. Support historical entries (with `isHistorical` flag or year bands)
5. Calculate `area_ha` from selected field hectares

### Quick Start Approach:
1. Copy fertiliser demo structure
2. Modify `Plan` type for liming schema
3. Add history gates component at top of App
4. Replace `PlanAccordionItem` fertilizer inputs with liming inputs
5. Add year selector/input to each plan
6. Reuse all field selection and validation components as-is

### Estimated Complexity:
- **Low:** Field selection, validation summary, UI components
- **Medium:** History gates, year handling, area calculation
- **High:** Historical entry handling, year-based filtering (if needed)

The fertiliser demo provides an excellent foundation - most components can be reused with minimal changes.
