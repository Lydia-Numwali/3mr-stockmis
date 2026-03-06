# Design Document: Modern Light Theme UI

## Overview

The Modern Light Theme UI design establishes a cohesive, contemporary visual system for the Stock Management System. This design encompasses a carefully curated color palette, typography standards using ITC Avant Garde Gothic Std, a modular spacing system, and component-level styling guidelines. The design ensures visual consistency across all pages (Dashboard, Products, Supplier, Category, Stock, Payment, Settings, Sales, Lending, Reports) while maintaining accessibility standards and cross-browser compatibility.

The design follows modern UI principles including:
- Clean, minimalist aesthetic with strategic use of whitespace
- Clear visual hierarchy through typography and color
- Consistent spacing and alignment using a grid-based system
- Semantic color usage for status and state indication
- Accessible contrast ratios and focus states
- Responsive design that adapts to different screen sizes

## Architecture

The Modern Light Theme UI is structured as a layered design system:

1. **Foundation Layer**: Color palette, typography, and spacing tokens
2. **Component Layer**: Reusable UI components with consistent styling
3. **Pattern Layer**: Common layout patterns and compositions
4. **Page Layer**: Page-specific implementations using components and patterns

The architecture supports:
- Token-based styling for consistency and maintainability
- Component composition for reusability
- CSS-in-JS or CSS modules for scoped styling
- Responsive design through breakpoints
- Theme switching capability for future dark mode support

## Color Palette Design

### Primary Colors

The primary color palette establishes the core visual identity of the application.

**Primary Blue**: `#2563EB`
- Used for primary actions, links, and key interactive elements
- Conveys trust, professionalism, and reliability
- Meets WCAG AA contrast requirements on light backgrounds

**Primary Blue Hover**: `#1D4ED8`
- Darker shade for hover states on primary buttons and links
- Provides visual feedback for interactive elements

**Primary Blue Active**: `#1E40AF`
- Darkest shade for active/pressed states
- Ensures clear distinction between interaction states

### Secondary Colors

Secondary colors provide accent and supporting visual elements.

**Secondary Teal**: `#14B8A6`
- Used for secondary actions and accent elements
- Complements the primary blue
- Suitable for success states and positive indicators

**Secondary Teal Hover**: `#0D9488`
- Darker shade for hover states

**Secondary Amber**: `#F59E0B`
- Used for warning states and cautionary elements
- High visibility for important alerts

### Neutral Colors (Grays)

Neutral colors form the foundation for backgrounds, borders, and text.

**Gray 50**: `#F9FAFB`
- Lightest neutral, used for subtle backgrounds
- Card backgrounds and section dividers

**Gray 100**: `#F3F4F6`
- Light background for secondary sections
- Hover states for neutral elements

**Gray 200**: `#E5E7EB`
- Borders and dividers
- Disabled state backgrounds

**Gray 300**: `#D1D5DB`
- Secondary borders
- Subtle visual separation

**Gray 400**: `#9CA3AF`
- Placeholder text
- Disabled text

**Gray 500**: `#6B7280`
- Secondary text
- Labels and captions

**Gray 600**: `#4B5563`
- Primary text on light backgrounds
- Body text and descriptions

**Gray 700**: `#374151`
- Dark text for headings
- High contrast text

**Gray 900**: `#111827`
- Darkest text
- Used sparingly for maximum contrast

### Semantic Colors

Semantic colors communicate status and meaning.

**Success Green**: `#10B981`
- Indicates successful operations, completed tasks
- Used for success messages and positive indicators

**Success Green Hover**: `#059669`
- Darker shade for interactive success elements

**Error Red**: `#EF4444`
- Indicates errors, failures, and destructive actions
- Used for error messages and validation failures

**Error Red Hover**: `#DC2626`
- Darker shade for interactive error elements

**Warning Amber**: `#F59E0B`
- Indicates warnings and cautions
- Used for warning messages and alerts

**Info Blue**: `#3B82F6`
- Indicates informational messages
- Used for tips and additional information

### Color Usage Guidelines

- **Text**: Gray 700 for primary text, Gray 600 for secondary text, Gray 500 for tertiary text
- **Backgrounds**: White (#FFFFFF) for main content, Gray 50 for secondary sections
- **Borders**: Gray 200 for primary borders, Gray 300 for secondary borders
- **Interactive Elements**: Primary Blue for primary actions, Secondary Teal for secondary actions
- **Status Indicators**: Success Green for success, Error Red for errors, Warning Amber for warnings, Info Blue for information
- **Disabled States**: Gray 200 background with Gray 400 text

## Typography System

### Font Family

**Primary Font**: ITC Avant Garde Gothic Std
- Applied to all text elements across the application
- Modern, geometric sans-serif with distinctive character
- Conveys contemporary, professional aesthetic

**Fallback Fonts**: Arial, Helvetica, sans-serif
- Used when ITC Avant Garde Gothic Std is unavailable
- Ensures consistent appearance across browsers and devices

### Font Loading Strategy

- ITC Avant Garde Gothic Std should be loaded via web font service (Google Fonts, Adobe Fonts, or self-hosted)
- Font weights: Regular (400), Medium (500), Bold (700)
- Font display: `swap` to ensure text is visible during font load

### Heading Styles

**H1 - Page Title**
- Font Size: 32px
- Font Weight: 700 (Bold)
- Line Height: 1.2 (38.4px)
- Letter Spacing: -0.5px
- Color: Gray 900
- Margin Bottom: 24px
- Usage: Main page titles and primary headings

**H2 - Section Heading**
- Font Size: 24px
- Font Weight: 700 (Bold)
- Line Height: 1.3 (31.2px)
- Letter Spacing: -0.3px
- Color: Gray 900
- Margin Bottom: 16px
- Usage: Section headings and subsection titles

**H3 - Subsection Heading**
- Font Size: 20px
- Font Weight: 600 (Semi-Bold)
- Line Height: 1.4 (28px)
- Letter Spacing: -0.2px
- Color: Gray 900
- Margin Bottom: 12px
- Usage: Card titles and subsection headings

**H4 - Card Title**
- Font Size: 16px
- Font Weight: 600 (Semi-Bold)
- Line Height: 1.5 (24px)
- Color: Gray 900
- Margin Bottom: 8px
- Usage: Card titles and component headings

### Body Text Styles

**Body Large**
- Font Size: 16px
- Font Weight: 400 (Regular)
- Line Height: 1.6 (25.6px)
- Color: Gray 700
- Usage: Primary body text and descriptions

**Body Regular**
- Font Size: 14px
- Font Weight: 400 (Regular)
- Line Height: 1.6 (22.4px)
- Color: Gray 700
- Usage: Standard body text and content

**Body Small**
- Font Size: 12px
- Font Weight: 400 (Regular)
- Line Height: 1.5 (18px)
- Color: Gray 600
- Usage: Secondary text, captions, and metadata

### Label and Input Styles

**Label**
- Font Size: 14px
- Font Weight: 500 (Medium)
- Line Height: 1.5 (21px)
- Color: Gray 700
- Margin Bottom: 6px
- Usage: Form labels and field descriptions

**Input Text**
- Font Size: 14px
- Font Weight: 400 (Regular)
- Line Height: 1.5 (21px)
- Color: Gray 700
- Usage: Text input fields and form inputs

**Placeholder Text**
- Font Size: 14px
- Font Weight: 400 (Regular)
- Line Height: 1.5 (21px)
- Color: Gray 400
- Usage: Placeholder text in input fields

### Button Text Styles

**Button Large**
- Font Size: 16px
- Font Weight: 600 (Semi-Bold)
- Line Height: 1.5 (24px)
- Color: White (for primary buttons), Primary Blue (for secondary buttons)
- Usage: Primary action buttons

**Button Regular**
- Font Size: 14px
- Font Weight: 600 (Semi-Bold)
- Line Height: 1.5 (21px)
- Color: White (for primary buttons), Primary Blue (for secondary buttons)
- Usage: Standard action buttons

**Button Small**
- Font Size: 12px
- Font Weight: 600 (Semi-Bold)
- Line Height: 1.5 (18px)
- Color: White (for primary buttons), Primary Blue (for secondary buttons)
- Usage: Small action buttons and compact controls

## Spacing System

### Spacing Units

The spacing system is based on a 4px base unit, creating a consistent rhythm throughout the interface.

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px
- **4xl**: 64px

### Spacing Application Guidelines

**Padding**
- Component internal spacing: 12px to 24px
- Card padding: 16px to 24px
- Section padding: 24px to 32px
- Page padding: 24px to 32px

**Margins**
- Between sections: 24px to 32px
- Between components: 16px to 24px
- Between form fields: 12px to 16px
- Between list items: 8px to 12px

**Gaps (Flexbox/Grid)**
- Component gaps: 8px to 16px
- Grid gaps: 16px to 24px
- List gaps: 12px to 16px

### Responsive Spacing

- **Mobile (< 640px)**: Reduce spacing by 25% (e.g., lg becomes md)
- **Tablet (640px - 1024px)**: Use standard spacing
- **Desktop (> 1024px)**: Use standard spacing with increased section spacing

## Components and Interfaces

### Dashboard Metric Cards

**Card Structure**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 200
- Border Radius: 8px
- Padding: 20px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

**Card Content Layout**
- Title: H4 style, Gray 900, margin bottom 12px
- Value: 28px, Bold, Primary Blue, margin bottom 8px
- Label: Body Small, Gray 600
- Icon: 24px × 24px, Primary Blue, positioned top-right

**Metric Card Variants**
- Success: Green accent border (2px left border in Success Green)
- Warning: Amber accent border (2px left border in Warning Amber)
- Error: Red accent border (2px left border in Error Red)
- Info: Blue accent border (2px left border in Info Blue)

### Product List Cards

**Card Structure**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 200
- Border Radius: 8px
- Padding: 16px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Transition: box-shadow 0.2s ease

**Card Header**
- Product Name: H4 style, Gray 900
- Product ID: Body Small, Gray 500, margin top 4px

**Card Body**
- Description: Body Regular, Gray 700, margin top 12px
- Metadata Grid: 2 columns, gap 16px, margin top 12px
  - Category: Label style, Gray 700, with value in Body Regular
  - Price: Label style, Gray 700, with value in Body Regular, Primary Blue

**Card Footer**
- Action Buttons: Flex layout, gap 8px, margin top 16px
- Edit Button: Secondary button style
- Delete Button: Danger button style

### Product List Tables

**Table Structure**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 200
- Border Radius: 8px
- Overflow: hidden

**Table Header**
- Background: Gray 50
- Border Bottom: 1px solid Gray 200
- Padding: 12px 16px
- Font: Label style, Gray 700
- Text Align: Left

**Table Rows**
- Border Bottom: 1px solid Gray 200
- Padding: 12px 16px
- Hover Background: Gray 50
- Transition: background-color 0.2s ease

**Table Cells**
- Font: Body Regular, Gray 700
- Vertical Align: Middle
- Padding: 12px 16px

**Status Indicators in Tables**
- Success: Green background (Success Green with 10% opacity), Success Green text
- Warning: Amber background (Warning Amber with 10% opacity), Warning Amber text
- Error: Red background (Error Red with 10% opacity), Error Red text
- Pending: Gray background (Gray 200), Gray 600 text

### Form Inputs

**Input Field Structure**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 300
- Border Radius: 6px
- Padding: 10px 12px
- Font: Input Text style
- Transition: border-color 0.2s ease, box-shadow 0.2s ease

**Input States**
- Default: Gray 300 border, Gray 700 text
- Hover: Gray 400 border
- Focus: Primary Blue border (2px), box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1)
- Disabled: Gray 200 background, Gray 400 text, Gray 200 border
- Error: Error Red border (2px), Error Red text for error message

**Input Sizes**
- Large: 12px padding, 16px font size, 40px height
- Regular: 10px padding, 14px font size, 36px height
- Small: 8px padding, 12px font size, 32px height

**Placeholder Text**
- Color: Gray 400
- Font Style: Regular

### Form Buttons

**Primary Button**
- Background: Primary Blue
- Text Color: White
- Border: None
- Border Radius: 6px
- Padding: 10px 16px
- Font: Button Regular style
- Cursor: pointer
- Transition: background-color 0.2s ease, box-shadow 0.2s ease

**Primary Button States**
- Default: Primary Blue background
- Hover: Primary Blue Hover background
- Active: Primary Blue Active background
- Focus: Primary Blue border with focus ring (3px rgba(37, 99, 235, 0.1))
- Disabled: Gray 200 background, Gray 400 text, cursor not-allowed

**Secondary Button**
- Background: Gray 100
- Text Color: Primary Blue
- Border: 1px solid Gray 300
- Border Radius: 6px
- Padding: 10px 16px
- Font: Button Regular style
- Cursor: pointer
- Transition: background-color 0.2s ease, border-color 0.2s ease

**Secondary Button States**
- Default: Gray 100 background, Gray 300 border
- Hover: Gray 200 background, Gray 400 border
- Active: Gray 300 background, Gray 500 border
- Focus: Focus ring (3px rgba(37, 99, 235, 0.1))
- Disabled: Gray 100 background, Gray 300 border, Gray 400 text

**Danger Button**
- Background: Error Red
- Text Color: White
- Border: None
- Border Radius: 6px
- Padding: 10px 16px
- Font: Button Regular style
- Cursor: pointer
- Transition: background-color 0.2s ease

**Danger Button States**
- Default: Error Red background
- Hover: Error Red Hover background
- Active: Darker Error Red background
- Focus: Focus ring (3px rgba(239, 68, 68, 0.1))
- Disabled: Gray 200 background, Gray 400 text

**Button Sizes**
- Large: 12px 20px padding, 16px font size, 44px height
- Regular: 10px 16px padding, 14px font size, 36px height
- Small: 8px 12px padding, 12px font size, 32px height

### Select Dropdowns

**Select Field Structure**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 300
- Border Radius: 6px
- Padding: 10px 12px
- Font: Input Text style
- Appearance: none (custom styling)
- Cursor: pointer

**Select States**
- Default: Gray 300 border, Gray 700 text
- Hover: Gray 400 border
- Focus: Primary Blue border (2px), focus ring
- Disabled: Gray 200 background, Gray 400 text

**Dropdown Arrow**
- Color: Gray 600
- Size: 16px × 16px
- Position: Right side with 12px padding

### Navigation Menu

**Menu Container**
- Background: White (#FFFFFF)
- Border Right: 1px solid Gray 200
- Width: 240px (desktop), collapsible on mobile
- Padding: 16px 0
- Box Shadow: 1px 0 3px rgba(0, 0, 0, 0.05)

**Menu Item**
- Padding: 12px 16px
- Font: Body Regular, Gray 700
- Cursor: pointer
- Transition: background-color 0.2s ease, color 0.2s ease
- Border Left: 3px solid transparent

**Menu Item States**
- Default: Gray 700 text, transparent background
- Hover: Gray 100 background, Gray 900 text
- Active: Primary Blue left border, Primary Blue text, Gray 50 background
- Disabled: Gray 400 text, cursor not-allowed

**Menu Item Icon**
- Size: 20px × 20px
- Margin Right: 12px
- Color: Inherits from text color

**Menu Sections**
- Section Title: Label style, Gray 600, padding 12px 16px, margin top 16px
- Section Divider: 1px solid Gray 200, margin 8px 0

### Modals and Dialogs

**Modal Overlay**
- Background: rgba(0, 0, 0, 0.5)
- Position: Fixed, full screen
- Z-index: 1000
- Transition: opacity 0.2s ease

**Modal Container**
- Background: White (#FFFFFF)
- Border Radius: 12px
- Box Shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
- Max Width: 500px (regular), 800px (large)
- Padding: 24px
- Position: Centered on screen
- Z-index: 1001

**Modal Header**
- Title: H3 style, Gray 900
- Close Button: 24px × 24px, Gray 600, hover Gray 900
- Border Bottom: 1px solid Gray 200
- Padding Bottom: 16px
- Margin Bottom: 16px

**Modal Body**
- Padding: 0
- Font: Body Regular, Gray 700
- Max Height: 60vh
- Overflow Y: auto

**Modal Footer**
- Border Top: 1px solid Gray 200
- Padding Top: 16px
- Margin Top: 24px
- Display: Flex
- Gap: 12px
- Justify Content: Flex-end

**Modal Form Fields**
- Margin Bottom: 16px
- Last field: Margin Bottom: 0

### Badges and Tags

**Badge Structure**
- Display: Inline-block
- Padding: 4px 8px
- Border Radius: 4px
- Font: Body Small, Bold
- White Space: nowrap

**Badge Variants**
- Primary: Primary Blue background, White text
- Secondary: Gray 100 background, Gray 700 text
- Success: Success Green background, White text
- Warning: Warning Amber background, White text
- Error: Error Red background, White text
- Info: Info Blue background, White text

### Alerts and Notifications

**Alert Container**
- Padding: 12px 16px
- Border Radius: 6px
- Border Left: 4px solid (color varies by type)
- Display: Flex
- Gap: 12px
- Align Items: Flex-start

**Alert Variants**
- Success: Green border, Success Green background (10% opacity), Success Green text
- Warning: Amber border, Warning Amber background (10% opacity), Warning Amber text
- Error: Red border, Error Red background (10% opacity), Error Red text
- Info: Blue border, Info Blue background (10% opacity), Info Blue text

**Alert Icon**
- Size: 20px × 20px
- Color: Inherits from alert type
- Flex Shrink: 0

**Alert Content**
- Title: Label style, color inherits from alert type
- Message: Body Small, Gray 700, margin top 4px

## Layout System

### Grid-Based Layout

**Desktop Layout (> 1024px)**
- 12-column grid
- Column width: 60px
- Gutter: 24px
- Max width: 1280px
- Margin: 0 auto

**Tablet Layout (640px - 1024px)**
- 8-column grid
- Column width: 48px
- Gutter: 16px
- Max width: 100%
- Padding: 16px

**Mobile Layout (< 640px)**
- 4-column grid
- Column width: auto
- Gutter: 12px
- Max width: 100%
- Padding: 12px

### Page Layout Structure

**Header**
- Height: 64px
- Background: White (#FFFFFF)
- Border Bottom: 1px solid Gray 200
- Padding: 0 24px
- Display: Flex
- Align Items: Center
- Justify Content: Space-between
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.05)

**Sidebar Navigation**
- Width: 240px (desktop)
- Background: White (#FFFFFF)
- Border Right: 1px solid Gray 200
- Position: Fixed or sticky
- Height: calc(100vh - 64px)
- Overflow Y: auto

**Main Content Area**
- Margin Left: 240px (desktop)
- Padding: 24px
- Background: Gray 50
- Min Height: calc(100vh - 64px)

**Content Sections**
- Margin Bottom: 24px
- Padding: 24px
- Background: White (#FFFFFF)
- Border Radius: 8px
- Border: 1px solid Gray 200

### Responsive Breakpoints

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px and above

### Responsive Behavior

- **Mobile**: Single column layout, full-width components, reduced padding
- **Tablet**: 2-column layout for cards, adjusted spacing
- **Desktop**: Multi-column layout, full spacing

## Visual Hierarchy

### Hierarchy Levels

**Level 1 - Primary Focus**
- H1 headings, primary buttons, primary blue elements
- Largest font sizes, boldest weights
- Used for main page titles and primary actions

**Level 2 - Secondary Focus**
- H2 headings, secondary buttons, secondary teal elements
- Medium font sizes, semi-bold weights
- Used for section headings and secondary actions

**Level 3 - Tertiary Focus**
- H3 headings, labels, body text
- Smaller font sizes, regular weights
- Used for subsection headings and descriptions

**Level 4 - Supporting Information**
- Body Small text, captions, metadata
- Smallest font sizes, regular weights
- Used for supplementary information

### Visual Weight Indicators

**Color Hierarchy**
- Primary Blue: Highest visual weight
- Secondary Teal: High visual weight
- Gray 700: Medium visual weight
- Gray 600: Lower visual weight
- Gray 500: Lowest visual weight

**Size Hierarchy**
- 32px: Highest visual weight (H1)
- 24px: High visual weight (H2)
- 20px: Medium visual weight (H3)
- 16px: Lower visual weight (Body Large)
- 14px: Lower visual weight (Body Regular)
- 12px: Lowest visual weight (Body Small)

**Weight Hierarchy**
- Bold (700): Highest visual weight
- Semi-Bold (600): High visual weight
- Medium (500): Medium visual weight
- Regular (400): Lower visual weight

### Emphasis Techniques

- **Color**: Use Primary Blue for emphasis
- **Size**: Increase font size for emphasis
- **Weight**: Use Bold or Semi-Bold for emphasis
- **Spacing**: Increase whitespace around emphasized elements
- **Icons**: Use icons to draw attention to important elements
- **Shadows**: Use subtle shadows to create depth and emphasis

## Data Models

### Color Token Model

```
{
  primary: {
    blue: "#2563EB",
    blueHover: "#1D4ED8",
    blueActive: "#1E40AF"
  },
  secondary: {
    teal: "#14B8A6",
    tealHover: "#0D9488",
    amber: "#F59E0B"
  },
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    900: "#111827"
  },
  semantic: {
    success: "#10B981",
    successHover: "#059669",
    error: "#EF4444",
    errorHover: "#DC2626",
    warning: "#F59E0B",
    info: "#3B82F6"
  }
}
```

### Typography Token Model

```
{
  fontFamily: "ITC Avant Garde Gothic Std, Arial, Helvetica, sans-serif",
  headings: {
    h1: { size: "32px", weight: 700, lineHeight: 1.2 },
    h2: { size: "24px", weight: 700, lineHeight: 1.3 },
    h3: { size: "20px", weight: 600, lineHeight: 1.4 },
    h4: { size: "16px", weight: 600, lineHeight: 1.5 }
  },
  body: {
    large: { size: "16px", weight: 400, lineHeight: 1.6 },
    regular: { size: "14px", weight: 400, lineHeight: 1.6 },
    small: { size: "12px", weight: 400, lineHeight: 1.5 }
  }
}
```

### Spacing Token Model

```
{
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  2xl: "32px",
  3xl: "48px",
  4xl: "64px"
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Color Palette Consistency

*For any* UI component rendered on any page in the application, all colors used in the component should be from the defined color palette (primary, secondary, neutral, or semantic colors).

**Validates: Requirements 1.5, 5.5, 7.3, 8.5**

### Property 2: Font Family Application

*For any* text element in the application, the computed font-family should include ITC Avant Garde Gothic Std as the primary font, with appropriate sans-serif fallbacks (Arial, Helvetica, sans-serif).

**Validates: Requirements 2.1, 2.3, 2.4**

### Property 3: Font Loading Before Render

*For any* page load, the ITC Avant Garde Gothic Std font should be loaded and available before any text content is rendered to the DOM.

**Validates: Requirements 2.2**

### Property 4: Typography Hierarchy Consistency

*For any* heading element (H1-H4) or body text element, the computed font-size and font-weight should match the defined typography standards for that element type.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 5: Dashboard Card Styling

*For any* metric card on the Dashboard, the card should have box-shadow, border-radius of 8px, and padding of 20px applied.

**Validates: Requirements 4.1, 4.3**

### Property 6: Dashboard Grid Layout

*For any* Dashboard page render, the metric cards should be organized using a grid-based layout system with proper alignment and consistent spacing.

**Validates: Requirements 4.4**

### Property 7: Product Card Consistency

*For any* product card on the Products page, the card should have consistent spacing, typography, and use colors from the defined palette.

**Validates: Requirements 5.1, 5.2, 5.5**

### Property 8: Modal Styling

*For any* modal dialog opened in the application, the modal should have border-radius of 12px, appropriate box-shadow, and proper padding applied.

**Validates: Requirements 5.3, 5.4**

### Property 9: Cross-Page Styling Consistency

*For any* UI component type (cards, buttons, inputs, navigation) across all pages (Products, Supplier, Category, Stock, Payment, Settings, Sales, Lending, Reports), the component should have the same spacing, typography, and color styling.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 10: Form Input Styling

*For any* form input element, the input should have a border, padding of 10px 12px, border-radius of 6px, and appropriate focus state styling with Primary Blue border and focus ring.

**Validates: Requirements 9.1, 9.4, 9.5**

### Property 11: Button State Styling

*For any* button element, the button should have distinct styling for default, hover, active, focus, and disabled states.

**Validates: Requirements 9.2**

### Property 12: Select Dropdown Styling

*For any* select dropdown element, the dropdown should have modern styling with border, padding, border-radius, and appropriate focus states.

**Validates: Requirements 9.3**

### Property 13: Navigation Menu Consistency

*For any* navigation menu item, the menu item should have consistent spacing, typography, and distinct styling for active, hover, and inactive states using the defined color palette.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

### Property 14: Spacing Units Application

*For any* UI component, all padding, margin, and gap values should be from the defined spacing units (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 15: Cross-Browser Rendering Consistency

*For any* page rendered in Chrome, Firefox, Safari, and Edge browsers, the visual appearance (colors, typography, spacing, layout) should be consistent across all browsers.

**Validates: Requirements 12.1, 12.4**

### Property 16: CSS Browser Support

*For any* CSS property used in the theme, the property should be supported in Chrome, Firefox, Safari, and Edge browsers (no unsupported features).

**Validates: Requirements 12.2**

### Property 17: Font Fallback Availability

*For any* text element where ITC Avant Garde Gothic Std is unavailable, the fallback fonts (Arial, Helvetica, sans-serif) should be applied and render correctly.

**Validates: Requirements 12.3**

### Property 18: WCAG AA Contrast Compliance

*For any* text element and its background, the contrast ratio should meet or exceed WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 13.1**

### Property 19: Interactive Element Distinction

*For any* interactive element (button, link, input), the element should have distinct styling that clearly differentiates it from non-interactive elements.

**Validates: Requirements 13.2**

### Property 20: Focus Indicator Visibility

*For any* focusable element, when the element receives focus, a focus indicator should be visible with sufficient contrast (at least 3:1 ratio).

**Validates: Requirements 13.3**

### Property 21: Semantic HTML and ARIA Labels

*For any* interactive component, the component should use semantic HTML elements and have appropriate ARIA labels for screen reader accessibility.

**Validates: Requirements 13.4**

### Property 22: Semantic Color Usage for Status

*For any* status indicator (success, warning, error, pending), the indicator should use the appropriate semantic color from the defined palette.

**Validates: Requirements 7.4**

## Error Handling

### Design System Errors

**Missing Font**
- If ITC Avant Garde Gothic Std fails to load, the system should gracefully fall back to Arial, Helvetica, or sans-serif
- No visual error should be displayed to the user
- The application should remain fully functional

**Invalid Color Values**
- If a component attempts to use a color not in the defined palette, the system should log a warning in development
- The component should fall back to the nearest defined color
- In production, the fallback should be applied silently

**Unsupported CSS Features**
- If a CSS feature is not supported in the target browser, the system should provide a fallback style
- The application should remain functional, though visual appearance may be slightly different
- Progressive enhancement should be used for advanced CSS features

### Component Errors

**Modal Rendering Errors**
- If a modal fails to render, the overlay should be removed and the user should be notified
- The underlying page should remain accessible

**Layout Calculation Errors**
- If grid layout calculations fail, the system should fall back to a single-column layout
- Content should remain readable and accessible

## Testing Strategy

### Unit Testing Approach

Unit tests should verify specific examples and edge cases:

1. **Color Token Tests**
   - Verify that all color tokens are defined with valid hex values
   - Test that color tokens are accessible from the theme object
   - Verify fallback colors are defined for all semantic colors

2. **Typography Token Tests**
   - Verify that all typography tokens are defined with valid values
   - Test that font sizes follow the defined scale
   - Verify line heights are appropriate for readability

3. **Spacing Token Tests**
   - Verify that all spacing tokens are defined with valid pixel values
   - Test that spacing units follow the 4px base unit
   - Verify spacing is applied correctly to components

4. **Component Rendering Tests**
   - Test that buttons render with correct styling in all states (default, hover, active, focus, disabled)
   - Test that form inputs render with correct styling and focus states
   - Test that cards render with correct shadows, borders, and padding
   - Test that modals render with correct overlay and styling

5. **Font Loading Tests**
   - Test that ITC Avant Garde Gothic Std font is loaded before content renders
   - Test that fallback fonts are applied when primary font is unavailable
   - Test font loading on slow network conditions

6. **Accessibility Tests**
   - Test that color contrast ratios meet WCAG AA standards
   - Test that focus indicators are visible and have sufficient contrast
   - Test that interactive elements have proper ARIA labels
   - Test that semantic HTML is used correctly

7. **Responsive Design Tests**
   - Test layout at mobile (< 640px), tablet (640px - 1024px), and desktop (> 1024px) breakpoints
   - Test that spacing adjusts appropriately for mobile devices
   - Test that navigation is accessible on all screen sizes

8. **Cross-Browser Tests**
   - Test rendering in Chrome, Firefox, Safari, and Edge
   - Test that CSS features are supported in all target browsers
   - Test font rendering across browsers

### Property-Based Testing Approach

Property-based tests should verify universal properties across all inputs:

1. **Property 1: Color Palette Consistency**
   - **Test**: Generate random UI components and verify all colors are from the defined palette
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 1: Color Palette Consistency

2. **Property 2: Font Family Application**
   - **Test**: Generate random text elements and verify font-family includes ITC Avant Garde Gothic Std
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 2: Font Family Application

3. **Property 4: Typography Hierarchy Consistency**
   - **Test**: Generate random heading and body text elements and verify font-size and font-weight match standards
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 4: Typography Hierarchy Consistency

4. **Property 5: Dashboard Card Styling**
   - **Test**: Generate random metric cards and verify box-shadow, border-radius, and padding are applied
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 5: Dashboard Card Styling

5. **Property 9: Cross-Page Styling Consistency**
   - **Test**: Generate random components across all pages and verify consistent spacing, typography, and colors
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 9: Cross-Page Styling Consistency

6. **Property 10: Form Input Styling**
   - **Test**: Generate random form inputs and verify border, padding, border-radius, and focus states
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 10: Form Input Styling

7. **Property 14: Spacing Units Application**
   - **Test**: Generate random components and verify all spacing values are from defined units
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 14: Spacing Units Application

8. **Property 15: Cross-Browser Rendering Consistency**
   - **Test**: Render pages in multiple browsers and verify visual consistency
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 15: Cross-Browser Rendering Consistency

9. **Property 18: WCAG AA Contrast Compliance**
   - **Test**: Generate random text/background color combinations and verify contrast ratios meet WCAG AA
   - **Iterations**: 100+
   - **Tag**: Feature: modern-light-theme-ui, Property 18: WCAG AA Contrast Compliance

10. **Property 22: Semantic Color Usage for Status**
    - **Test**: Generate random status indicators and verify correct semantic colors are used
    - **Iterations**: 100+
    - **Tag**: Feature: modern-light-theme-ui, Property 22: Semantic Color Usage for Status

### Testing Tools and Libraries

- **Unit Testing**: Jest or Vitest for JavaScript/React testing
- **Component Testing**: React Testing Library for component-level tests
- **Visual Testing**: Percy or Chromatic for visual regression testing
- **Accessibility Testing**: axe-core or jest-axe for accessibility compliance
- **Property-Based Testing**: fast-check for JavaScript property-based testing
- **Cross-Browser Testing**: BrowserStack or Sauce Labs for cross-browser testing
- **Contrast Testing**: WebAIM Contrast Checker or programmatic contrast calculation

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage of component styling logic
- **Property Tests**: All 22 correctness properties should have corresponding property-based tests
- **Accessibility Tests**: 100% of interactive elements should have accessibility tests
- **Visual Tests**: All major components should have visual regression tests



## Implementation Approach

### CSS Architecture

The implementation uses a modular CSS architecture with the following structure:

**1. Design Tokens (CSS Variables)**
```css
:root {
  /* Colors */
  --color-primary-blue: #2563EB;
  --color-primary-blue-hover: #1D4ED8;
  --color-primary-blue-active: #1E40AF;
  
  --color-secondary-teal: #14B8A6;
  --color-secondary-teal-hover: #0D9488;
  --color-secondary-amber: #F59E0B;
  
  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-200: #E5E7EB;
  --color-neutral-300: #D1D5DB;
  --color-neutral-400: #9CA3AF;
  --color-neutral-500: #6B7280;
  --color-neutral-600: #4B5563;
  --color-neutral-700: #374151;
  --color-neutral-900: #111827;
  
  --color-semantic-success: #10B981;
  --color-semantic-success-hover: #059669;
  --color-semantic-error: #EF4444;
  --color-semantic-error-hover: #DC2626;
  --color-semantic-warning: #F59E0B;
  --color-semantic-info: #3B82F6;
  
  /* Typography */
  --font-family-primary: "ITC Avant Garde Gothic Std", Arial, Helvetica, sans-serif;
  
  --font-size-h1: 32px;
  --font-weight-h1: 700;
  --line-height-h1: 1.2;
  
  --font-size-h2: 24px;
  --font-weight-h2: 700;
  --line-height-h2: 1.3;
  
  --font-size-h3: 20px;
  --font-weight-h3: 600;
  --line-height-h3: 1.4;
  
  --font-size-h4: 16px;
  --font-weight-h4: 600;
  --line-height-h4: 1.5;
  
  --font-size-body-large: 16px;
  --font-weight-body-large: 400;
  --line-height-body-large: 1.6;
  
  --font-size-body-regular: 14px;
  --font-weight-body-regular: 400;
  --line-height-body-regular: 1.6;
  
  --font-size-body-small: 12px;
  --font-weight-body-small: 400;
  --line-height-body-small: 1.5;
  
  --font-size-label: 14px;
  --font-weight-label: 500;
  --line-height-label: 1.5;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;
  
  /* Border Radius */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

**2. Base Styles**
- Reset default browser styles
- Apply font family globally
- Set default text colors and backgrounds
- Define base line heights and letter spacing

**3. Component Styles**
- Button styles (primary, secondary, danger)
- Form input styles
- Card styles
- Modal styles
- Navigation styles
- Badge and alert styles

**4. Layout Styles**
- Grid system
- Flexbox utilities
- Responsive breakpoints
- Page layout structure

**5. Utility Classes**
- Text color utilities
- Background color utilities
- Spacing utilities
- Display utilities
- Responsive utilities

### React Component Structure

**1. Theme Provider**
```jsx
// ThemeProvider.jsx
export const ThemeProvider = ({ children }) => {
  return (
    <div className="theme-light">
      {children}
    </div>
  );
};
```

**2. Component Styling Approaches**

Option A: CSS Modules
```jsx
// Button.module.css
.button {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-regular);
  font-weight: 600;
  padding: 10px 16px;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.buttonPrimary {
  background-color: var(--color-primary-blue);
  color: white;
}

.buttonPrimary:hover {
  background-color: var(--color-primary-blue-hover);
}

// Button.jsx
import styles from './Button.module.css';

export const Button = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={`${styles.button} ${styles[`button${variant}`]}`} {...props}>
      {children}
    </button>
  );
};
```

Option B: Styled Components
```jsx
// Button.jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-regular);
  font-weight: 600;
  padding: 10px 16px;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return 'var(--color-primary-blue)';
      case 'secondary': return 'var(--color-neutral-100)';
      case 'danger': return 'var(--color-semantic-error)';
      default: return 'var(--color-primary-blue)';
    }
  }};
  
  &:hover {
    background-color: ${props => {
      switch(props.variant) {
        case 'primary': return 'var(--color-primary-blue-hover)';
        case 'secondary': return 'var(--color-neutral-200)';
        case 'danger': return 'var(--color-semantic-error-hover)';
        default: return 'var(--color-primary-blue-hover)';
      }
    }};
  }
`;

export const Button = ({ variant = 'primary', children, ...props }) => (
  <StyledButton variant={variant} {...props}>
    {children}
  </StyledButton>
);
```

Option C: Tailwind CSS with Custom Configuration
```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: {
        blue: '#2563EB',
        blueHover: '#1D4ED8',
        blueActive: '#1E40AF',
      },
      secondary: {
        teal: '#14B8A6',
        tealHover: '#0D9488',
        amber: '#F59E0B',
      },
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        900: '#111827',
      },
      semantic: {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
    fontFamily: {
      primary: ['ITC Avant Garde Gothic Std', 'Arial', 'Helvetica', 'sans-serif'],
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
      '4xl': '64px',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
  },
};
```

### Font Loading Implementation

**1. Google Fonts or Adobe Fonts**
```html
<!-- In HTML head -->
<link href="https://fonts.adobe.com/fonts/itc-avant-garde-gothic-std" rel="stylesheet">
```

**2. Self-Hosted Font**
```css
@font-face {
  font-family: 'ITC Avant Garde Gothic Std';
  src: url('/fonts/itc-avant-garde-gothic-std-regular.woff2') format('woff2'),
       url('/fonts/itc-avant-garde-gothic-std-regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'ITC Avant Garde Gothic Std';
  src: url('/fonts/itc-avant-garde-gothic-std-medium.woff2') format('woff2'),
       url('/fonts/itc-avant-garde-gothic-std-medium.woff') format('woff');
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'ITC Avant Garde Gothic Std';
  src: url('/fonts/itc-avant-garde-gothic-std-bold.woff2') format('woff2'),
       url('/fonts/itc-avant-garde-gothic-std-bold.woff') format('woff');
  font-weight: 700;
  font-display: swap;
}
```

**3. Font Loading Hook (React)**
```jsx
// useFontLoaded.js
import { useEffect, useState } from 'react';

export const useFontLoaded = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    } else {
      // Fallback for browsers without Font Loading API
      setFontLoaded(true);
    }
  }, []);

  return fontLoaded;
};

// App.jsx
export const App = () => {
  const fontLoaded = useFontLoaded();

  if (!fontLoaded) {
    return <div>Loading...</div>;
  }

  return <MainApp />;
};
```

### Responsive Design Implementation

**1. CSS Media Queries**
```css
/* Mobile First Approach */
.container {
  padding: var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

/* Tablet */
@media (min-width: 640px) {
  .container {
    padding: var(--spacing-lg);
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }
}
```

**2. React Responsive Hook**
```jsx
// useResponsive.js
import { useEffect, useState } from 'react';

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBreakpoint('mobile');
      } else if (window.innerWidth < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};
```

### Accessibility Implementation

**1. Focus Styles**
```css
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  border-color: var(--color-primary-blue);
}
```

**2. ARIA Labels**
```jsx
<button aria-label="Close modal" onClick={onClose}>
  ×
</button>

<input
  type="text"
  aria-label="Search products"
  placeholder="Search..."
/>
```

**3. Semantic HTML**
```jsx
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

<main>
  <section>
    <h1>Page Title</h1>
    <p>Content here</p>
  </section>
</main>
```

### File Structure

```
src/
├── styles/
│   ├── tokens/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   └── shadows.css
│   ├── base/
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── layout.css
│   ├── components/
│   │   ├── button.css
│   │   ├── input.css
│   │   ├── card.css
│   │   ├── modal.css
│   │   ├── navigation.css
│   │   └── badge.css
│   ├── utilities/
│   │   ├── colors.css
│   │   ├── spacing.css
│   │   ├── display.css
│   │   └── responsive.css
│   └── main.css
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── Button.test.jsx
│   ├── Input/
│   │   ├── Input.jsx
│   │   ├── Input.module.css
│   │   └── Input.test.jsx
│   ├── Card/
│   │   ├── Card.jsx
│   │   ├── Card.module.css
│   │   └── Card.test.jsx
│   ├── Modal/
│   │   ├── Modal.jsx
│   │   ├── Modal.module.css
│   │   └── Modal.test.jsx
│   └── Navigation/
│       ├── Navigation.jsx
│       ├── Navigation.module.css
│       └── Navigation.test.jsx
├── pages/
│   ├── Dashboard/
│   ├── Products/
│   ├── Supplier/
│   ├── Category/
│   ├── Stock/
│   ├── Payment/
│   ├── Settings/
│   ├── Sales/
│   ├── Lending/
│   └── Reports/
└── hooks/
    ├── useFontLoaded.js
    ├── useResponsive.js
    └── useTheme.js
```

### Build and Deployment

**1. CSS Optimization**
- Minify CSS in production
- Remove unused CSS with PurgeCSS or similar tools
- Use CSS-in-JS for dynamic styling to reduce bundle size

**2. Font Optimization**
- Use WOFF2 format for modern browsers
- Provide WOFF fallback for older browsers
- Use font-display: swap for better performance
- Consider subsetting fonts to reduce file size

**3. Performance Considerations**
- Load critical CSS inline
- Defer non-critical CSS
- Use CSS variables for theme switching
- Implement lazy loading for components

