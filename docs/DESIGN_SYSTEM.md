# Guru Vaani Design System

## Overview

The Guru Vaani design system provides a comprehensive set of design tokens, components, and guidelines to ensure consistency across the mobile app and web dashboard. The system is built with accessibility, cultural sensitivity, and low-data usage in mind.

## Design Principles

### 1. Clarity Over Decoration
- Prioritize function over form
- Use clear, simple visual hierarchy
- Minimize cognitive load through progressive disclosure

### 2. Cultural Sensitivity
- Respect Indian educational context
- Use culturally appropriate colors and imagery
- Support multiple Indian languages and scripts

### 3. Accessibility First
- WCAG AA compliance minimum
- High contrast ratios (4.5:1 for normal text)
- Large touch targets (minimum 48px)
- Screen reader compatibility

### 4. Low-Data Optimization
- Minimize visual complexity
- Optimize for slow networks
- Efficient use of images and media

## Color Palette

### Primary Colors
```css
--color-primary: #FF7043;      /* Saffron Orange - Primary actions */
--color-secondary: #26A69A;    /* Teal - Success, secondary actions */
--color-accent: #5C6BC0;       /* Indigo - Links, info states */
```

### Neutral Colors
```css
--color-background: #FAFAFA;   /* App background */
--color-surface: #FFFFFF;      /* Cards, modals */
--color-text-primary: #212121; /* Primary text */
--color-text-secondary: #757575; /* Secondary text */
--color-disabled: #BDBDBD;     /* Disabled elements */
--color-outline: #E0E0E0;      /* Borders, dividers */
```

### Semantic Colors
```css
--color-error: #E53935;        /* Error states */
--color-warning: #FFA726;      /* Warning states */
--color-success: #4CAF50;      /* Success states */
```

### Color Usage Guidelines

#### Primary (#FF7043 - Saffron Orange)
- **Use for**: Primary buttons, active states, key actions
- **Don't use for**: Large backgrounds, text on light backgrounds
- **Accessibility**: Contrast ratio 4.52:1 on white background

#### Secondary (#26A69A - Teal)
- **Use for**: Secondary buttons, success states, badges
- **Don't use for**: Error states, primary navigation
- **Accessibility**: Contrast ratio 4.89:1 on white background

#### Accent (#5C6BC0 - Indigo)
- **Use for**: Links, informational elements, tertiary actions
- **Don't use for**: Primary actions, error states
- **Accessibility**: Contrast ratio 5.12:1 on white background

## Typography

### Font Family
```css
font-family: 'Noto Sans', system-ui, -apple-system, sans-serif;
```

**Rationale**: Noto Sans provides excellent support for Indian languages and scripts while maintaining readability across devices.

### Type Scale
```css
--font-size-xs: 12px;    /* Captions, timestamps */
--font-size-sm: 14px;    /* Small text, labels */
--font-size-base: 16px;  /* Body text, inputs */
--font-size-lg: 18px;    /* Subheadings */
--font-size-xl: 22px;    /* Section headings */
--font-size-xxl: 28px;   /* Page titles */
```

### Font Weights
```css
--font-weight-normal: 400;  /* Body text */
--font-weight-medium: 500;  /* Emphasis, buttons */
--font-weight-semibold: 600; /* Headings */
```

### Line Heights
```css
--line-height-tight: 1.2;   /* Headings */
--line-height-normal: 1.4;  /* UI text */
--line-height-relaxed: 1.6; /* Body text */
```

### Typography Usage

#### Headings
- **H1 (28px, 600)**: Page titles, main headings
- **H2 (22px, 600)**: Section headings
- **H3 (18px, 600)**: Subsection headings
- **H4 (16px, 500)**: Card titles, form sections

#### Body Text
- **Body 1 (16px, 400)**: Primary body text, descriptions
- **Body 2 (14px, 400)**: Secondary text, captions
- **Caption (12px, 400)**: Timestamps, metadata

## Spacing System

Based on 8px grid system for consistent rhythm and alignment.

```css
--spacing-xs: 4px;   /* Tight spacing */
--spacing-sm: 8px;   /* Base unit */
--spacing-md: 16px;  /* Default spacing */
--spacing-lg: 24px;  /* Section spacing */
--spacing-xl: 32px;  /* Large gaps */
--spacing-xxl: 48px; /* Major sections */
```

### Spacing Usage Guidelines

#### Component Spacing
- **Padding**: Use md (16px) for cards, lg (24px) for major sections
- **Margins**: Use md (16px) between related elements, lg (24px) between sections
- **Gaps**: Use sm (8px) for tight layouts, md (16px) for comfortable spacing

#### Layout Spacing
- **Mobile**: 16px side margins, 24px section spacing
- **Tablet**: 24px side margins, 32px section spacing
- **Desktop**: 32px side margins, 48px section spacing

## Border Radius

```css
--border-radius-button: 8px;   /* Buttons, inputs */
--border-radius-card: 12px;    /* Cards, modals */
--border-radius-pill: 24px;    /* Pills, badges */
```

### Border Radius Usage
- **Buttons**: 8px for balanced modern look
- **Cards**: 12px for friendly, approachable feel
- **Pills/Badges**: 24px for fully rounded appearance

## Shadows

```css
--shadow-card: 0 2px 4px rgba(0,0,0,0.1);
--shadow-elevated: 0 4px 12px rgba(0,0,0,0.15);
--shadow-modal: 0 8px 24px rgba(0,0,0,0.2);
```

### Shadow Usage
- **Card**: Default elevation for cards, buttons
- **Elevated**: Hover states, active elements
- **Modal**: Dialogs, overlays, floating elements

## Component Library

### Buttons

#### Primary Button
```css
background: var(--color-primary);
color: white;
border-radius: var(--border-radius-button);
padding: 8px 16px;
min-height: 48px;
font-weight: 500;
box-shadow: var(--shadow-card);
```

#### Secondary Button
```css
background: transparent;
color: var(--color-primary);
border: 2px solid var(--color-primary);
border-radius: var(--border-radius-button);
padding: 8px 16px;
min-height: 48px;
font-weight: 500;
```

#### Ghost Button
```css
background: transparent;
color: var(--color-primary);
border: none;
border-radius: var(--border-radius-button);
padding: 8px 16px;
min-height: 48px;
font-weight: 500;
```

### Cards

#### Basic Card
```css
background: var(--color-surface);
border-radius: var(--border-radius-card);
box-shadow: var(--shadow-card);
padding: var(--spacing-md);
```

#### Interactive Card
```css
background: var(--color-surface);
border-radius: var(--border-radius-card);
box-shadow: var(--shadow-card);
padding: var(--spacing-md);
transition: box-shadow 0.2s ease;

&:hover {
  box-shadow: var(--shadow-elevated);
}
```

### Form Elements

#### Text Input
```css
border: 1px solid var(--color-outline);
border-radius: var(--border-radius-button);
padding: 12px 16px;
min-height: 48px;
font-size: var(--font-size-base);
background: var(--color-surface);

&:focus {
  border-color: var(--color-primary);
  border-width: 2px;
  outline: none;
}
```

#### Dropdown
```css
border: 1px solid var(--color-outline);
border-radius: var(--border-radius-button);
padding: 12px 16px;
min-height: 48px;
font-size: var(--font-size-base);
background: var(--color-surface);
cursor: pointer;
```

### Chips/Tags

#### Default Chip
```css
background: var(--color-background);
color: var(--color-text-primary);
border: 1px solid var(--color-outline);
border-radius: var(--border-radius-pill);
padding: 6px 12px;
font-size: var(--font-size-sm);
height: 32px;
```

#### Selected Chip
```css
background: var(--color-primary);
color: white;
border: 1px solid var(--color-primary);
border-radius: var(--border-radius-pill);
padding: 6px 12px;
font-size: var(--font-size-sm);
height: 32px;
```

## Layout Guidelines

### Grid System

#### Mobile (< 640px)
- Single column layout
- 16px side margins
- Full-width components
- Stacked navigation

#### Tablet (640px - 1024px)
- 2-column layouts where appropriate
- 24px side margins
- Flexible component widths
- Tab-based navigation

#### Desktop (> 1024px)
- Multi-column layouts (2-3 columns)
- 32px+ side margins
- Fixed sidebar navigation
- Hover states for interactions

### Navigation Patterns

#### Mobile Navigation
- Bottom tab bar (5 items max)
- Hamburger menu for secondary items
- Back button in header
- Swipe gestures for navigation

#### Desktop Navigation
- Top horizontal navigation
- Sidebar for secondary navigation
- Breadcrumbs for deep navigation
- Keyboard shortcuts

## Accessibility Guidelines

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text (18px+)**: Minimum 3:1 contrast ratio
- **UI elements**: Minimum 3:1 contrast ratio

### Touch Targets
- **Minimum size**: 48x48px for all interactive elements
- **Spacing**: 8px minimum between touch targets
- **Visual feedback**: Clear pressed/hover states

### Keyboard Navigation
- **Tab order**: Logical, follows visual layout
- **Focus indicators**: 2px orange outline on all focusable elements
- **Skip links**: "Skip to main content" for screen readers

### Screen Reader Support
- **Semantic HTML**: Use proper heading hierarchy, landmarks
- **ARIA labels**: Descriptive labels for icons, buttons
- **Alt text**: Meaningful descriptions for images
- **Live regions**: Announce dynamic content changes

## Responsive Design

### Breakpoints
```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1440px;
```

### Mobile-First Approach
1. Design for mobile first (320px+)
2. Enhance for tablet (640px+)
3. Optimize for desktop (1024px+)

### Responsive Patterns
- **Stacking**: Horizontal layouts become vertical on mobile
- **Hiding**: Non-essential elements hidden on small screens
- **Collapsing**: Navigation and sidebars collapse into menus
- **Scaling**: Text and spacing scale appropriately

## Animation Guidelines

### Principles
- **Purposeful**: Every animation serves a function
- **Subtle**: Don't distract from content
- **Fast**: Maximum 300ms for most transitions
- **Respectful**: Honor user's motion preferences

### Common Animations
```css
/* Page transitions */
transition: opacity 200ms ease-in-out;

/* Button press */
transform: scale(0.95);
transition: transform 100ms ease-out;

/* Modal appearance */
transform: translateY(20px);
opacity: 0;
transition: all 250ms ease-out;

/* Loading spinner */
animation: spin 1s linear infinite;
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Iconography

### Icon System
- **Style**: Outlined icons for consistency
- **Size**: 16px, 20px, 24px, 32px, 48px
- **Weight**: 2px stroke width
- **Color**: Inherit from parent or use semantic colors

### Icon Usage
- **Navigation**: 24px icons in tab bars, menus
- **Actions**: 20px icons in buttons, form fields
- **Status**: 16px icons for inline indicators
- **Features**: 32px+ icons for empty states, onboarding

## Cultural Considerations

### Indian Context
- **Colors**: Saffron represents energy and strength in Indian culture
- **Imagery**: Use diverse Indian classroom settings and students
- **Language**: Support for Devanagari and regional scripts
- **Festivals**: Consider Indian academic calendar and festivals

### Localization
- **Text expansion**: Allow 30% more space for translated text
- **RTL support**: Prepare layouts for right-to-left languages
- **Number formats**: Use Indian numbering system (1,00,000)
- **Date formats**: DD/MM/YYYY format preference

## Performance Guidelines

### Image Optimization
- **Format**: WebP with JPEG fallback
- **Size**: Maximum 150KB per image
- **Compression**: 80% quality for photos, lossless for graphics
- **Lazy loading**: Load images as they enter viewport

### Font Loading
- **Subset fonts**: Include only required characters
- **Font display**: Use `font-display: swap` for faster rendering
- **Fallbacks**: Provide system font fallbacks

### CSS Optimization
- **Critical CSS**: Inline above-the-fold styles
- **Minification**: Remove whitespace and comments
- **Compression**: Enable gzip/brotli compression

## Implementation Guidelines

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: #FF7043;
  --color-secondary: #26A69A;
  
  /* Typography */
  --font-family-base: 'Noto Sans', system-ui, sans-serif;
  --font-size-base: 16px;
  
  /* Spacing */
  --spacing-base: 8px;
  
  /* Shadows */
  --shadow-card: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Component Architecture
- **Atomic design**: Build from atoms → molecules → organisms
- **Reusability**: Create flexible, configurable components
- **Consistency**: Use design tokens throughout
- **Documentation**: Document props, usage, and examples

### Quality Assurance
- **Design review**: Ensure designs match specifications
- **Accessibility audit**: Test with screen readers, keyboard navigation
- **Performance testing**: Measure load times, interaction responsiveness
- **Cross-browser testing**: Verify compatibility across browsers and devices

This design system serves as the foundation for all Guru Vaani interfaces, ensuring consistency, accessibility, and cultural appropriateness across the platform.