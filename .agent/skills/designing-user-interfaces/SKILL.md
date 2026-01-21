---
name: designing-user-interfaces
description: Provides UI/UX design expertise and frontend development tools for creating modern, professional user interfaces. Use when the user requests UI/UX analysis, design tokens, or component improvements.
---

# Designing User Interfaces

Create premium, high-impact user interfaces that follow modern design principles and accessibility standards.

## When to use this skill
- When starting a new UI feature or application.
- When existing UI feels "basic" or "dated" and needs a premium refresh.
- When you need to generate a design system or set of design tokens.
- When performing a UI/UX audit of current code.
- When implementing complex interactive components that require smooth transitions and micro-interactions.

## Workflow
1.  **Analyze & Audit**: Identify current UI/UX gaps. Look for consistency issues, accessibility violations, and lack of visual polish.
2.  **Define Design Language**: Choose a style (Modern, Minimal, corporate, etc.) and generate corresponding design tokens (colors, typography, spacing).
3.  **Foundation First**: Implement the spacing system and typography scale before building components.
4.  **Component Implementation**: Build/refactor components using the design tokens. Focus on accessibility (aria-labels, keyboard navigation) and responsiveness.
5.  **Visual Polish**: Add micro-interactions, smooth transitions, and refined shadows/borders.
6.  **Verify**: Run through an accessibility checklist and responsive design audit.

## Instructions

### 1. Modern Design Principles
*   **Vibrant Aesthetics**: Use curated HSL palettes. Avoid default system colors.
*   **Typography**: Use high-quality Google Fonts (Inter, Outfit, Roboto). Establish a clear hierarchy with distinct weights and sizes.
*   **Depth & Elevation**: Use subtle multi-layered shadows (glassmorphism) and smooth gradients to create depth without clutter.
*   **Negative Space**: Use generous padding and margins to let the content breathe. "White space is a design element."

### 2. Design Token Systems

#### "Modern" Style Tokens
- **Primary**: `hsl(217, 91%, 60%)` (Action Blue)
- **Secondary**: `hsl(245, 58%, 51%)` (Indigo)
- **Neutral**: `hsl(215, 25%, 27%)` (Slate)
- **Border Radius**: `0.75rem` (12px)
- **Shadow**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

#### "Minimal" Style Tokens
- **Primary**: `hsl(0, 0%, 9%)` (Pure black)
- **Secondary**: `hsl(0, 0%, 45%)` (Grey)
- **Neutral**: `hsl(0, 0%, 98%)` (Almost white)
- **Border Radius**: `0` or `0.25rem`
- **Shadow**: None or ultra-subtle `0 1px 2px rgba(0,0,0,0.05)`

### 3. Component Improvement Patterns

#### Buttons
- High contrast for primary actions.
- Smooth hover/active transitions (`transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).
- Clear focus states for accessibility.

#### Cards
- Subtle borders or soft shadows (never both simultaneously if possible).
- Proportional padding (at least `padding: 1.5rem`).
- Rounded corners that match the overall design system.

#### Form Inputs
- Clear labels and error states.
- Consistent border styles.
- High accessibility with proper `aria-describe-by` links.

### 4. Accessibility (a11y) Checklist
- [ ] **Contrast**: Check color contrast for WCAG AA compliance (4.5:1 for normal text).
- [ ] **Labels**: Ensure all form inputs have associated labels.
- [ ] **Keyboard**: All interactive elements must be reachable via `Tab` and triggers via `Enter`/`Space`.
- [ ] **Focus Visible**: Never remove the focus ring without providing a custom visual alternative.
- [ ] **Semantic HTML**: Use `<main>`, `<header>`, `<footer>`, `<nav>`, and proper heading levels (H1-H6).

## Resources
- [Tailwind CSS Design System](https://tailwindcss.com/docs/design-details)
- [Refactoring UI by Steve Schoger](https://www.refactoringui.com/)
- [Material Design Guidelines](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
