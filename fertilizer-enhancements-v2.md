 # Enhancement Specification: Fertilizer Reporting Precision

## 1. Technical Field Upgrades (Chemical & Physical)
- **Synthetic Plans:** 
    - Add a toggle group for Phosphorus: `P` vs `P2O5`.
    - Add a toggle group for Potassium: `K` vs `K2O`.
    - *UI:* These toggles sit next to the respective rate input.
- **Organic Plans:** 
    - Add Form Toggle: `Solid (t)` vs `Liquid (m³)`.
    - *Dynamic Unit Label:* The unit suffix in the 'Application rate' input must update based on the toggle (e.g., `t/ha` for solid, `m³/ha` for liquid).

## 2. Conditional Sub-Forms
- **Inhibitors:** For both types, if 'Nitrification Inhibitor' is `Yes`, show a nested field:
    - "How much of the [Unit] had nitrification inhibitor applied?"
    - The `[Unit]` must match the parent rate (kg/ha, t/ha, or m³/ha).

## 3. Advanced Assignment & Validation UI
- **Alert Banner:** Add a `ShadCN Alert` (Warning/Destructive variant) at the top when fields are unassigned. 
    - Text: "X fields still require fertiliser plans to be assigned".
- **Unassigned Fields View:** 
    - List all fields not yet mapped.
    - Implement a 'Bulk Action Footer' that appears when checkboxes in this list are selected.
    - Footer contains: `Count`, `Deselect All`, `Select a Plan` (Dropdown), and `Apply`.

## 4. Final Submission State
- **Validation Rule:** The global "Confirm fertiliser practices" button is the "gatekeeper." 
- **State:** `disabled` if `assignedFields.length < totalFieldsCount`.
- **Styling:** Gray/Disabled when inactive; Primary/Purple when 100% of fields are accounted for.