# Liming Demo

A separate demo application for collecting liming data, built using the same patterns and components as the fertiliser demo.

## Accessing the Demo

The liming demo can be accessed by adding `?demo=liming` to the URL:

- **Fertiliser Demo (default):** `http://localhost:5173/`
- **Liming Demo:** `http://localhost:5173/?demo=liming`

## Features

### History Gates
Before building plans, users answer questions about liming history:
1. Applied liming in the last 5 years? (Yes/No)
2. If No: Was liming applied before the last 5 years? (Yes/No)
3. If Yes: When was it last applied? (5-7 years ago, 8-10 years ago, More than 10 years ago)

### Plan Builder
- Create multiple liming plans
- Each plan can be assigned to multiple fields
- Year-aware: Plans are specific to a harvest year (or "pre-5-years" for historical)
- Material type: Limestone or Dolomite
- Application rate: t/ha
- Automatic area calculation from selected fields
- Total tonnes calculation (rate × area)

### Field Assignment Rules
- **One liming event per field per year** (enforced)
- When assigning fields to a plan, those fields are automatically removed from any other plan in the same year
- Visual indicators show when fields are assigned to other plans
- Historical plans ("pre-5-years") can also assign fields

### Validation
- Material type required when fields are selected
- Application rate > 0 required when fields are selected
- If "applied in last 5 years" = Yes, at least one plan must exist
- Unassigned fields shown as informational (not blocking)

### Output Preview
JSON preview at the bottom shows:
- History answers
- All liming plans with details
- Field assignments (showing which plans each field is assigned to)

## Architecture

### New Files Created
- `src/LimingApp.tsx` - Main liming application
- `src/lib/limingTypes.ts` - TypeScript types for liming
- `src/components/liming/LimingHistoryGates.tsx` - History gate questions
- `src/components/liming/LimingPlanAccordionItem.tsx` - Plan builder card
- `src/components/liming/LimingFieldSelection.tsx` - Field picker (adapted from EnhancedFieldSelection)

### Reused Components
- `Navigation` - Top navigation bar
- All UI components from `src/components/ui/`
- `Accordion` - For plan list
- Field data from `src/lib/fieldData.ts`

### Key Differences from Fertiliser Demo
1. **Year-aware plans** - Plans have a `year` field
2. **Year-based exclusivity** - Fields can only be in one plan per year
3. **History gates** - Questions before plan builder
4. **Simpler plan structure** - Material type and rate only (no multiple fertilizers)
5. **Historical plans** - Support for "pre-5-years" year value

## Data Model

```typescript
type LimingPlan = {
  id: string
  name: string
  year: string | "pre-5-years"
  isHistorical?: boolean
  material_type: "limestone" | "dolomite"
  application_rate_t_per_ha: number
  field_ids: string[]  // Plan owns field IDs (not stored on fields)
  area_ha: number      // Derived from selected fields
}
```

## Testing the Demo

1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:5173/?demo=liming`
3. Answer the history gate questions
4. Create liming plans
5. Assign fields to plans
6. Verify that assigning a field to one plan removes it from another plan in the same year
7. Check the JSON output at the bottom to verify data structure
