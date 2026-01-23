# Liming Demo V4 - UX Notes

**Version:** V4  
**Date:** January 22, 2025  
**Design System:** Agreena

## Overview

The Liming Demo V4 is a comprehensive interface for farmers to document their liming history and create liming plans for their fields. Built using the Agreena design system, it features a three-panel layout with a left navigation sidebar, central content panel, and a full-height map element on the right.

## Table of Contents

1. [Layout Overview](#layout-overview)
2. [User Flow Stages](#user-flow-stages)
   - [Stage 1: Initial History Gates](#stage-1-initial-history-gates)
   - [Stage 2: Year Selection](#stage-2-year-selection)
   - [Stage 3: No Liming Confirmation](#stage-3-no-liming-confirmation)
   - [Stage 4: Empty Plan Builder State](#stage-4-empty-plan-builder-state)
   - [Stage 5: Plan Details Form](#stage-5-plan-details-form)
   - [Stage 6: Field Selection Table](#stage-6-field-selection-table)
   - [Stage 7: Action Buttons](#stage-7-action-buttons)
   - [Stage 8: Success State](#stage-8-success-state)
3. [Design System Elements](#design-system-elements)
4. [Key Interactions](#key-interactions)
5. [Validation & Error States](#validation--error-states)

---

## Layout Overview

The Liming Demo V4 uses the **Agreena Layout** structure, which consists of three main sections:

### Left Navigation Sidebar
- Narrow, dark purple/blue vertical strip
- Provides persistent navigation context
- Part of the `AgreenaSidebar` component

### Central Content Panel
- **Width:** 672px
- **Background:** `#FAFAFA` (light gray)
- Scrollable content area
- Contains all interactive forms and data

### Right Map Panel
- **Width:** 720px
- **Height:** Full viewport height (fixed)
- Light green placeholder background
- Displays map with interactive pin drops
- Part of the `AgreenaMapPanel` component

### Top Navigation Bar
The navigation bar spans the full width and includes:
- **Left:** "Back" link with chevron icon (purple `#4730DB`)
- **Center:** Page title "Liming Plans" (truly centered within the bar)
- **Right:** "Save and exit" link (purple `#4730DB`)

The title is centered using absolute positioning (`left-1/2 -translate-x-1/2`) to ensure true centering regardless of other elements.

---

## User Flow Stages

### Stage 1: Initial History Gates

![Initial History Gates](./screenshots/liming-v4-stage-1-initial-history-gates.png)

**Description:**  
The first step in the liming history flow. Users are presented with a clear binary choice about their liming history.

**UX Notes:**
- **Question:** "Applied liming in the last 20 years?"
- **Options:** Two large, equally-sized buttons: "Yes" and "No"
- **Card Design:** Prominent white card with rounded corners focuses user attention
- **Helper Text:** "Add the liming applications you've made over time." provides context
- **Header:** "Build your liming history" - no circular dot icon (per design requirements)
- **Visual Hierarchy:** Clear separation between question and action buttons
- **Accessibility:** Large click targets, clear labels

**Design Elements:**
- Card background: White with subtle shadow
- Button styling: 8px border radius, 2px borders
- Button height: 48px (h-12)
- Typography: Bold labels, medium-weight helper text

---

### Stage 2: Year Selection

![Year Selection](./screenshots/liming-v4-stage-2-year-selection.png)

**Description:**  
After selecting "Yes" to the initial question, users are prompted to select the year of their last liming application.

**UX Notes:**
- **Progressive Disclosure:** Year selection appears only after "Yes" is selected
- **Question:** "In which year did you last apply liming to your fields?"
- **Input Type:** Dropdown/combobox
- **Year Range:** 2025 down to 2005 (20 years of history)
- **Placeholder:** "Select year..."
- **Default Behavior:** No pre-selection, user must actively choose
- **Visual Feedback:** Dropdown arrow indicates interactivity

**Design Elements:**
- Input height: 48px (h-12)
- Border: 2px, rounded corners
- Focus state: Border color changes to primary purple

**User Journey:**
- Selecting a year triggers the plan builder to appear
- The selected year becomes the default year for new plans

---

### Stage 3: No Liming Confirmation

![No Liming Confirmation](./screenshots/liming-v4-stage-no-confirmation-dialog.png)

**Description:**  
When users select "No" to the initial question, a confirmation dialog appears to prevent accidental selections.

**UX Notes:**
- **Confirmation Pattern:** Prevents users from accidentally marking "no liming"
- **Dialog Title:** "Confirm No Liming Applied"
- **Question:** "You have confirmed that no liming has been applied in the last 20 years. Is this correct?"
- **Actions:** 
  - "Go Back" (outline button) - allows correction
  - "Yes, Confirm" (primary button) - confirms selection
- **After Confirmation:** Shows yellow messaging box with text "No liming plans required for your farm"

**Design Elements:**
- Modal overlay with blurred background
- Centered dialog box
- Warning icon in dialog header
- Yellow messaging box styling:
  - Background: `#FFF9E0`
  - Text/Icon color: `#662C09`
  - Icon: `CircleExclamationIcon`
  - Border radius: 4px
  - Padding: 8px 16px

**User Journey:**
- Confirmation prevents accidental "No" selections
- After confirmation, users see a clear message that no action is needed
- Users can still navigate away using "Save and exit"

---

### Stage 4: Empty Plan Builder State

![Empty Plan Builder](./screenshots/liming-v4-stage-3-empty-plan-builder.png)

**Description:**  
The initial state of the plan builder section when no plans have been created yet.

**UX Notes:**
- **Empty State Design:** Clear visual hierarchy with icon, heading, and CTA
- **Icon:** Large plus icon in a circular purple-tinted background
- **Heading:** "No liming plans defined yet"
- **Subheading:** "Create your first plan to get started"
- **Primary CTA:** "Create First Plan" button (full width, primary style)
- **Visual Treatment:** Dashed border container (`border-dashed border-[#CCCCCC]`)
- **Spacing:** Generous padding (py-20) for visual breathing room

**Design Elements:**
- Icon container: 64px × 64px circle, `bg-[#4730DB]/10`
- Button: Full width, 48px height, primary purple
- Typography: 16px heading, 14px subheading
- Border: 2px dashed, light gray

**User Journey:**
- Appears immediately after year selection
- Single, clear call-to-action
- Once first plan is created, this state disappears

---

### Stage 5: Plan Details Form

![Plan Details Form](./screenshots/liming-v4-stage-4-plan-details-open.png)

**Description:**  
The accordion item containing the plan details form, shown when a plan is created or expanded.

**UX Notes:**
- **Accordion Pattern:** Plans are collapsible/expandable
- **Plan Header:** Shows plan name, year badge, material type badge (if set), rate badge, and field count
- **Status Badge:** "Unassigned" shown when no fields are selected
- **Plan Details Section:** Purple-tinted background (`rgba(109, 87, 255, 0.1)`)
- **Form Fields:**
  1. **Plan Name** (text input, full width)
     - Placeholder: "e.g. Spring Liming 2024"
     - Required for identification
  2. **Year** (dropdown, required *)
     - Pre-filled from history selection
     - Can be changed
     - Shows calendar icon
  3. **Material Type** (dropdown, required when fields selected)
     - Options: Limestone, Dolomite
     - Shows package icon
     - Required indicator appears when fields are assigned
  4. **Application Rate** (number input, required when fields selected)
     - Unit: t/ha (shown as badge on right side of input)
     - Step: 0.1
     - Min: 0
     - Required indicator appears when fields are assigned

**Design Elements:**
- Section background: Light purple tint for visual grouping
- Input height: 44px (h-11)
- Border: 2px, rounded corners
- Badges: Small (10px text, 5px height), colored by material type
- Icons: Calendar, Package icons for visual context

**Validation:**
- Material type and rate become required when fields are selected
- Warning message appears below form if validation fails
- Warning styling: Yellow background, warning icon, clear messaging

**User Journey:**
- Plan name can be edited at any time
- Year can be changed (affects field assignment exclusivity)
- Material type and rate can be set before or after field selection
- Form auto-saves as user types (updates plan state)

---

### Stage 6: Field Selection Table

![Field Selection Table](./screenshots/liming-v4-stage-5-field-selection-table.png)

**Description:**  
A comprehensive table interface for selecting fields to assign to a liming plan.

**UX Notes:**
- **Table Structure:**
  - **Checkbox Column:** Select all checkbox in header, individual checkboxes per row
  - **Field Name:** Primary identifier, sortable
  - **Size:** Hectares, sortable
  - **Map:** Link to view field on map (triggers pin drop animation)
  - **Limed?:** Status badge showing current liming status (Not Limed, Limestone, Dolomite)

- **Filtering & Search:**
  - **Filter Dropdown:** Filter by plan/material type
    - Options include all plans for the current year
    - "Not Limed" filter option available
    - Multi-select capability
  - **Search Bar:** Search by field ID or name
    - Real-time filtering
    - Search icon on right side
    - Placeholder: "Search field ID or name"

- **Actions:**
  - **Mark as Not Limed:** Button to mark selected fields as not requiring liming
    - Secondary button style
    - Appears inline with filter/search controls

- **Interactions:**
  - **Row Clickability:** Entire row is clickable to toggle selection
  - **Map Link:** Stops event propagation (doesn't toggle selection)
  - **Checkbox:** Individual selection control
  - **Select All:** Header checkbox toggles all visible rows

- **Pagination:**
  - Shows current page and total pages
  - Navigation: First, Previous, Next, Last
  - Items per page: 10 (default)
  - Displays "Showing X-Y of Z fields"

**Design Elements:**
- Table styling follows Agreena design system
- Header row: Bold text, clear column separators
- Row hover state: Subtle background change
- Status badges: Colored by material type (limestone: blue, dolomite: darker blue)
- Map link: Purple underline, hover removes underline
- Filter button: Matches search bar height
- Search bar: Rounded corners, icon positioned on right

**User Journey:**
- Users can filter to see specific subsets of fields
- Search helps find fields quickly
- Bulk selection via "Select All" or individual selection
- Map link provides visual context (easter egg: animated pin drop)
- Status column shows current assignment state

**Easter Egg - Map Pin Animation:**
- Clicking "Map" link drops an animated pin on the map
- Pin drops from above, scales down (1.8x → 1x), bounces on landing
- Only one pin visible at a time (new pin replaces old)
- Animation: 0.6s with cubic-bezier easing for realistic motion

---

### Stage 7: Action Buttons

**Description:**  
Two-path choice pattern at the bottom of each plan accordion item.

**UX Notes:**
- **Layout:** Side-by-side with vertical divider
- **Left Path:** "Save without assigning fields"
  - **Heading:** "Save without assigning fields"
  - **Button:** Secondary style, "Save details"
  - **Purpose:** Save plan configuration without field assignment
  - **State:** Shows "Saved" with checkmark when successful
  - **Disabled:** When no unsaved changes

- **Right Path:** "Apply plan now"
  - **Heading:** "Apply plan now"
  - **Button:** Primary style, "Apply to X field(s)"
  - **Purpose:** Assign selected fields to plan and close accordion
  - **Disabled:** When no fields selected or validation fails

- **Divider:** Vertical line (`w-px h-full bg-[#E3E3E3]`) centered between sections

- **Warning Messages:** Appear below buttons if validation fails
  - Text: "Set material type and rate first"
  - Color: `#8E0000` (red)
  - Small text (11px)

**Design Elements:**
- Container: Light gray background (`#FAFAFA`), border (`#E3E3E3`)
- Button height: 36px
- Border radius: 8px (consistent throughout)
- Button spacing: Equal flex distribution
- Divider: Light gray, full height of button container

**User Journey:**
- Users can save plan details to work on later
- Users can immediately apply plan to selected fields
- Clear visual separation of the two paths
- Validation prevents applying incomplete plans

---

### Stage 8: Success State

**Description:**  
Success message card that appears when at least one valid plan exists with assigned fields.

**UX Notes:**
- **Trigger:** At least one plan with material type, rate > 0, and fields assigned
- **Card Design:** 
  - Border: 2px, purple (`border-[#4730DB]/60`)
  - Background: Light purple tint (`rgba(109, 87, 255, 0.1)`)
  - Shadow: Large shadow for prominence

- **Content:**
  - **Icon:** Checkmark in circular purple-tinted background with ring
  - **Title:** "You're good to continue"
  - **Body Text:** 
    - "You've added at least one liming plan and assigned fields, so you can save and move on at any time."
    - "If you have more liming records, adding them now will improve the accuracy of your results and may increase your calculated earnings."
  - **Helper Text:** "You can come back and update this later if needed." (smaller, gray)

- **Actions:**
  - **Left:** "Save and Exit" (secondary button)
    - Scrolls to top to show navigation "Save and exit" link
  - **Right:** "Add another plan" (primary button)
    - Creates a new plan accordion item

**Design Elements:**
- Icon: 48px × 48px circle, purple background with ring
- Typography: 16px title, 14px body, 12px helper
- Button alignment: Right-aligned (flex-row justify-end)
- Button gap: 12px
- No underline/border above buttons (removed per design)

**User Journey:**
- Provides positive reinforcement
- Encourages adding more plans (optional)
- Clear path to save and exit
- Reassures users they can return later

---

## Design System Elements

### Colors

**Primary Colors:**
- Primary Purple: `#4730DB`
- Primary Hover: `#6D57FF`
- Primary Active: `#849FE5`

**Background Colors:**
- Main Background: `#FAFAFA`
- Card Background: `#FFFFFF`
- Plan Details Background: `rgba(109, 87, 255, 0.1)`

**Text Colors:**
- Primary Text: `#0D0D0D`
- Secondary Text: `#333333`
- Muted Text: `#666666`, `#747474`
- Warning Text: `#8E0000`

**Messaging Colors:**
- Yellow Background: `#FFF9E0`
- Yellow Text/Icon: `#662C09`

**Borders:**
- Light Gray: `#E3E3E3`, `#CCCCCC`
- Border Radius: 8px (buttons, cards), 4px (messaging boxes)

### Typography

**Font Family:**
- Primary: System font stack
- Messaging: Overpass (for yellow messaging boxes)

**Font Sizes:**
- Heading (Large): 20px (`text-xl`)
- Heading (Medium): 16px (`text-base`)
- Heading (Small): 14px (`text-sm`)
- Body: 14px (`text-sm`)
- Small Text: 12px (`text-xs`), 11px
- Badge Text: 10px

**Font Weights:**
- Bold: `font-bold` (headings)
- Medium: `font-medium` (labels, emphasis)
- Normal: `font-normal` (body text)

**Line Heights:**
- 130%: Large headings
- 150%: Body text, buttons

### Components

**Buttons:**
- **Primary:** 
  - Background: `#4730DB`
  - Hover: `#6D57FF`
  - Active: `#849FE5`
  - Text: White
  - Height: 36px, 40px, or 48px
  - Border Radius: 8px
  - Shadow: Medium on hover

- **Secondary:**
  - Border: `#4730DB`
  - Text: `#4730DB`
  - Background: Transparent
  - Hover: `bg-[#4730DB]/5`
  - Height: 36px, 40px
  - Border Radius: 8px

**Inputs:**
- Height: 44px (h-11) or 48px (h-12)
- Border: 2px
- Border Radius: Rounded corners
- Focus: Border color changes to primary
- Background: White

**Cards:**
- Background: White
- Border: 2px (various colors)
- Border Radius: 8px
- Shadow: Subtle to prominent (depending on importance)

**Badges:**
- Small size: 10px text, 5px height
- Colored by material type:
  - Limestone: Blue tones
  - Dolomite: Darker blue tones
- Outline and filled variants

**Icons:**
- Standard sizes: 12px, 16px, 32px (for map pins)
- Color: Inherits from parent or specific color
- Custom SVG components for Agreena icons

---

## Key Interactions

### Map Pin Easter Egg

**Trigger:** Clicking "Map" link in field selection table

**Animation:**
- Pin drops from above (translateY -30%)
- Starts larger (scale 1.8)
- Scales down to normal size (scale 1)
- Bounces on landing (multiple keyframe steps)
- Opacity: 0.8 → 1.0
- Duration: 0.6s
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce effect)

**Behavior:**
- Only one pin visible at a time
- New pin replaces previous pin
- Pin positioned randomly (10-90% of map width/height)
- Unique ID generated for each pin

**Implementation:**
- State managed in `LimingAppV4.tsx`
- `handleAddMapPin` function generates random coordinates
- `AgreenaMapPanel` receives pin prop and renders with animation
- CSS `@keyframes pinDrop` defined in `index.css`

### Field Selection

**Row Click:**
- Entire table row is clickable
- Toggles field selection
- Cursor changes to pointer on hover
- Visual feedback on selection

**Map Link:**
- Stops event propagation (`e.stopPropagation()`)
- Doesn't toggle row selection
- Triggers map pin drop
- Underlined link style

**Checkbox:**
- Individual selection control
- Stops event propagation
- Visual state matches selection

**Select All:**
- Header checkbox toggles all visible rows
- Respects current filters/search
- Updates based on checkbox checked state

### Plan Management

**Accordion Expand/Collapse:**
- Click header to toggle
- Smooth animation
- Multiple plans can be open simultaneously
- Auto-closes after applying fields

**Duplicate Plan:**
- Creates copy in different year (to avoid conflicts)
- Opens duplicate accordion
- Scrolls to duplicate
- Clears field assignments

**Delete Plan:**
- Confirmation dialog
- Removes plan and unassigns fields
- Fields marked as "not limed" when plan deleted

**Plan Updates:**
- Auto-saves as user types
- Tracks unsaved changes
- Shows "Saved" state after manual save

### Filtering & Search

**Filter Dropdown:**
- Multi-select capability
- Options include all plans for current year
- "Not Limed" option available
- Real-time filtering

**Search:**
- Real-time filtering as user types
- Searches field ID and name
- Case-insensitive
- Cleared when filter changes

**Combined Filtering:**
- Search and filter work together
- Pagination updates based on filtered results
- Select all respects current filters

---

## Validation & Error States

### Plan Validation

**Required Fields (when fields are selected):**
- Material Type: Must be selected
- Application Rate: Must be greater than 0

**Warning Message:**
- Appears below action buttons
- Styling: Yellow background, warning icon
- Text: "Set material type and rate first"
- Color: `#8E0000` (red text)

**Button States:**
- "Apply plan now" disabled when:
  - No fields selected, OR
  - Material type missing, OR
  - Application rate ≤ 0

### Field Assignment Rules

**Year-Based Exclusivity:**
- One liming event per field per year
- Assigning field to plan removes it from other plans in same year
- Visual indicators show when field is assigned elsewhere

**Status Management:**
- Fields can be marked as "Not Limed"
- Marking removes fields from plans
- Unmarking allows reassignment

### Messaging States

**Yellow Messaging Box:**
- Used for important information
- Background: `#FFF9E0`
- Text/Icon: `#662C09`
- Icon: `CircleExclamationIcon`
- Border radius: 4px
- Padding: 8px 16px

**Success Messaging:**
- Appears when valid plan exists
- Purple-tinted card with checkmark
- Encouraging copy
- Action buttons for next steps

**Empty States:**
- Clear messaging about what to do next
- Visual icons for guidance
- Single, clear call-to-action

---

## Responsive Considerations

### Container Width
- Fixed 1440px container width
- Centered on larger screens
- Map panel positioned relative to container

### Map Panel Positioning
- Fixed positioning
- Calculated left offset: `max(calc((100vw - 1440px) / 2 + 720px), 720px)`
- Ensures alignment with centered container
- Full viewport height

### Scrollable Content
- Left panel content is scrollable
- Map panel remains fixed
- Navigation bar remains fixed at top

---

## Accessibility Notes

- Large click targets (minimum 36px height)
- Clear labels and headings
- Keyboard navigation support
- Screen reader friendly structure
- Color contrast meets WCAG standards
- Focus states clearly visible
- Error messages clearly communicated

---

## Future Considerations

- Additional screenshots could capture:
  - Success message state with valid plan
  - Plan with fields assigned
  - Filter dropdown open state
  - Map with pin dropped
  - Validation error states
  - Pagination in action

---

**Document Version:** 1.0  
**Last Updated:** January 22, 2025
