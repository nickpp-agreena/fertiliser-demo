# Project: Agricultural Fertilizer Reporting Flow

## Overview
A multi-step form process for farmers to account for 100% of their crop acreage regarding fertilizer application. The UI must be clean, "vanilla," and responsive.

## Core UI Components (ShadCN/UI)
- **Navigation:** Breadcrumbs, Buttons (Back/Save and exit).
- **Layout:** Cards for grouping, Separators for sections.
- **Form Inputs:** Input (Number), Select (Dropdowns), ToggleGroup/RadioGroup (Yes/No, Solid/Liquid), Checkbox (Field selection).
- **Status:** Badges (Complete, In progress, Not started), Alert (for unassigned fields).
- **Data Display:** Accordions (to manage multiple plans), ScrollArea (for long field lists).

## User Flow Steps

### Step 1: Yearly Selection
- **View:** A list of years (2021-2025).
- **Logic:** Display status badges (Complete, In Progress, Not Started).
- **Navigation:** Clicking a year (e.g., 2025) advances to the Plan Builder.

### Step 2: Plan Builder (The Core Form)
- **Top Section:** "No fertiliser" option. Users select a reason (e.g., "Sufficient soil nutrients") and click 'Add'.
- **Main Section:** "Add Fertiliser Plan" button.
- **Dynamic Plan Card:**
    - **Type Selection:** Dropdown for 'Synthetic' or 'Organic'.
    - **Synthetic Sub-form:**
        - Nitrogen rate (kg/ha).
        - Nitrification inhibitor toggle (Yes/No) + Conditional input for amount.
        - Phosphorus toggle + Type (P or P2O5) + Rate.
        - Potassium toggle + Type (K or K2O) + Rate.
    - **Organic Sub-form:**
        - Type dropdown (Chicken manure, Cattle slurry, Digestate, etc.).
        - Form toggle (Solid t/ha vs Liquid m3/ha).
        - Application rate.
        - Nitrification inhibitor toggle + amount.

### Step 3: Field Assignment
- Once a plan is saved, the user must assign it to specific fields.
- **View:** A searchable list of fields with checkboxes.
- **Counter:** Show "X fields selected" in the footer.
- **Logic:** A field cannot be assigned to two conflicting plans.

### Step 4: Validation & Review
- **Unassigned Fields View:** If any fields remain without a plan, show a dedicated screen titled "You have X fields without a fertiliser plan."
- **Bulk Action:** Allow users to select multiple unassigned fields and apply an existing plan or "No fertiliser" in one click.
- **Final Confirmation:** The "Confirm fertiliser practices" button at the bottom remains disabled (grayed out) until 100% of fields have a plan assigned.

## Color Palette & Styling
- **Primary:** Purple/Indigo (#5D5FEF) for active buttons and toggles.
- **Backgrounds:** Light grey for cards, white for the main canvas.
- **Borders:** Subtle grey strokes.
- **Icons:** Lucide-react (Leaf, Trash, Chevron, Info).