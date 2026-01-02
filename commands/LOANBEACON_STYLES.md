# LoanBeacon Styling & Animations

## Instructions
Copy and paste this into your Claude chat (after the MVP is built) to add professional styling and animations.

---

Claude, please update the LoanBeacon application with professional styling and smooth animations:

## Color Scheme
Use a red and gray professional theme:
- **Primary Red**: `#DC2626` (red-600) for CTAs, active states, urgent alerts
- **Dark Red**: `#991B1B` (red-800) for hovers
- **Light Red**: `#FEE2E2` (red-50) for backgrounds
- **Gray Scale**: Use Tailwind's gray palette (50, 100, 200, 300, 600, 700, 900)
- **Accent**: `#DC2626` for highlights and important info
- **Backgrounds**: White cards on `#F9FAFB` (gray-50) base
- **Text**: `#111827` (gray-900) for headings, `#6B7280` (gray-600) for body

## Install Framer Motion
First, install framer-motion:
```bash
npm install framer-motion
```

## Styling Updates

### 1. Landing Page (`app/page.tsx`)
- Hero section with gradient background (gray-50 to gray-100)
- Red CTA buttons with hover effects
- Feature cards with subtle shadows and hover lift
- Smooth fade-in animations on load

### 2. Auth Pages (Login/Register)
- Centered card with shadow
- Red accent on inputs when focused
- Red buttons with hover states
- Smooth transitions on form interactions

### 3. Dashboard Layout
- **Sidebar**: Dark gray background (#1F2937 - gray-800) with white text
- Active nav item: Red accent border or background
- Hover states on nav items
- **Header**: White with subtle shadow
- Search bar with red focus ring

### 4. Dashboard Pages
- **Stat Cards**: White cards with red accent for urgent metrics
- Smooth counter animations for numbers
- Hover effects (slight scale up)
- Gradient backgrounds on important cards

### 5. Tables
- Striped rows (alternating gray-50)
- Hover effect (gray-100 background)
- Red badges for urgent status
- Gray badges for normal status
- Smooth row hover transitions

### 6. Forms
- Clean white backgrounds
- Red focus rings on inputs
- Gray borders (gray-300)
- Smooth validation states
- Button hover animations

### 7. Alerts Section
- Red border-left for high priority
- Orange border-left for medium priority
- Gray border-left for low priority
- Smooth dismiss animation (fade out + slide)
- Priority badges with appropriate colors

### 8. Timeline
- Red vertical line for timeline
- Red dots for loan markers
- Gray cards for loan details
- Smooth scroll animations as you scroll down

## Framer Motion Animations to Add

### Page Transitions
- Fade in on page load
- Stagger children animations for lists

### Card Animations
- Hover: Scale up slightly (scale: 1.02)
- Hover: Add shadow
- Initial: Fade in from bottom

### List Animations
- Stagger children by 0.1s
- Fade in + slide up

### Button Animations
- Hover: Scale 1.05
- Tap: Scale 0.95
- Smooth color transitions

### Alert Dismiss
- Exit: Fade out + slide right
- Layout animation for remaining items

### Number Counters
- Animate numbers counting up on dashboard stats

## Animation Examples

Use these Framer Motion patterns:

### Container with Stagger
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
```

### Card Hover
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ duration: 0.2 }}
>
```

### Fade In Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

### Button
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

## Specific Component Updates

### Stat Cards on Dashboard
- Add number counting animation
- Hover: Lift effect with shadow
- Red accent on urgent metrics

### Company/Loan Tables
- Row hover animation
- Status badges with proper colors
- Smooth sort/filter transitions

### Timeline View
- Vertical red line down the center
- Stagger animation for loan items
- Scroll-triggered animations

### Alert Cards
- Dismiss with exit animation
- Priority color system (red/orange/gray)
- Hover: Slight scale

### Forms
- Input focus animations
- Button loading states
- Success/error message animations

## Additional Polish

### Shadows
- Use Tailwind shadow utilities: `shadow-sm`, `shadow`, `shadow-lg`
- Hover shadows: `hover:shadow-xl`

### Transitions
- Add `transition-all duration-200` to interactive elements
- Use `ease-in-out` for smooth transitions

### Loading States
- Add skeleton loaders (gray-200 animated)
- Spinner for buttons (red)

### Responsive
- Ensure all animations work on mobile
- Reduce motion for users who prefer it

## Design Principles
1. **Subtle but noticeable** - Animations should feel smooth, not jarring
2. **Performance** - Keep animations under 300ms
3. **Consistency** - Use the same animation patterns throughout
4. **Purpose** - Every animation should guide user attention or provide feedback
5. **Professional** - Red/gray theme should feel corporate and trustworthy

Please update all components with these styling guidelines and add Framer Motion animations where specified. Keep the code clean and maintainable.
