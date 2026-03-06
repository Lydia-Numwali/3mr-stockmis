# Implementation Plan: Modern Light Theme UI

## Overview

This implementation plan breaks down the Modern Light Theme UI feature into discrete, manageable coding tasks. The approach follows a layered architecture: foundation setup (design tokens and base styles), component implementation, page updates, responsive design, accessibility, and testing. Each task builds incrementally on previous work, ensuring early validation through automated tests.

## Tasks

- [x] 1. Set up design token files and CSS architecture
  - Create `src/styles/tokens/colors.css` with all color palette definitions (primary, secondary, neutral, semantic)
  - Create `src/styles/tokens/typography.css` with font family and typography scales (H1-H4, body, labels, buttons)
  - Create `src/styles/tokens/spacing.css` with spacing unit definitions (xs through 4xl)
  - Create `src/styles/tokens/shadows.css` with shadow definitions (sm, md, lg)
  - Create `src/styles/base/reset.css` for browser reset styles
  - Create `src/styles/base/typography.css` for global typography rules and font family application
  - Create `src/styles/main.css` to import all token and base styles in correct order
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2, 11.3, 11.4_

- [x] 2. Configure font loading for ITC Avant Garde Gothic Std
  - Set up font loading via Google Fonts, Adobe Fonts, or self-hosted alternative with WOFF2 format
  - Create `src/styles/fonts.css` with @font-face declarations for all font weights (400, 500, 700) with font-display: swap
  - Create `src/hooks/useFontLoaded.js` hook to ensure font is loaded before rendering using Font Loading API
  - Update `src/App.jsx` to use useFontLoaded hook and show loading state while fonts load
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 12.3_

  - [-]* 2.1 Write property test for font family application
    - **Property 2: Font Family Application**
    - **Validates: Requirements 2.1, 2.3, 2.4**

  - [-]* 2.2 Write property test for font fallback availability
    - **Property 17: Font Fallback Availability**
    - **Validates: Requirements 2.4, 12.3**

- [x] 3. Implement Button component with all variants and states
  - Create `src/components/Button/Button.jsx` with primary, secondary, and danger variants
  - Create `src/components/Button/Button.module.css` with styling for all button states (default, hover, active, focus, disabled)
  - Implement button sizes (large, regular, small)
  - Add proper focus indicators and ARIA labels
  - _Requirements: 9.2, 13.2, 13.3, 13.4_

  - [x]* 3.1 Write unit tests for Button component
    - Test all button variants render correctly
    - Test all button states (hover, active, focus, disabled)
    - Test button sizes
    - _Requirements: 9.2_

  - [ ]* 3.2 Write property test for button styling
    - **Property 11: Button State Styling**
    - **Validates: Requirements 9.2_

- [x] 4. Implement Form Input component with focus states
  - Create `src/components/Input/Input.jsx` with support for text, email, password, number inputs
  - Create `src/components/Input/Input.module.css` with styling for all input states
  - Implement input sizes (large, regular, small)
  - Add focus ring styling with Primary Blue border
  - Add error state styling with Error Red border
  - _Requirements: 9.1, 9.4, 9.5, 13.2, 13.3_

  - [ ]* 4.1 Write unit tests for Input component
    - Test input renders with correct styling
    - Test focus state displays focus ring
    - Test error state displays error styling
    - Test placeholder text styling
    - _Requirements: 9.1, 9.4, 9.5_

  - [ ]* 4.2 Write property test for input styling
    - **Property 10: Form Input Styling**
    - **Validates: Requirements 9.1, 9.4, 9.5**

- [x] 5. Implement Card component for dashboard and product pages
  - Create `src/components/Card/Card.jsx` with support for metric cards and product cards
  - Create `src/components/Card/Card.module.css` with card styling (border, shadow, padding, border-radius)
  - Implement card variants (default, success, warning, error, info)
  - Add hover shadow effect
  - _Requirements: 4.1, 4.3, 5.1, 5.2, 5.5_

  - [ ]* 5.1 Write unit tests for Card component
    - Test card renders with correct styling
    - Test card variants display correct accent colors
    - Test hover shadow effect
    - _Requirements: 4.1, 4.3, 5.1, 5.2_

  - [ ]* 5.2 Write property test for card styling
    - **Property 5: Dashboard Card Styling**
    - **Validates: Requirements 4.1, 4.3**

- [x] 6. Implement Modal component with proper styling
  - Create `src/components/Modal/Modal.jsx` with overlay and modal container
  - Create `src/components/Modal/Modal.module.css` with modal styling (border-radius, shadow, padding)
  - Implement modal header with close button
  - Implement modal body and footer sections
  - Add focus trap and keyboard handling (ESC to close)
  - _Requirements: 5.3, 5.4, 13.2, 13.3, 13.4_

  - [ ]* 6.1 Write unit tests for Modal component
    - Test modal renders with overlay
    - Test modal styling (border-radius, shadow, padding)
    - Test close button functionality
    - Test ESC key closes modal
    - _Requirements: 5.3, 5.4_

  - [ ]* 6.2 Write property test for modal styling
    - **Property 8: Modal Styling**
    - **Validates: Requirements 5.3, 5.4**

- [x] 7. Implement Navigation menu component
  - Create `src/components/Navigation/Navigation.jsx` with menu items and sections
  - Create `src/components/Navigation/Navigation.module.css` with menu styling
  - Implement active, hover, and disabled states
  - Add menu icons support
  - Add responsive behavior (collapsible on mobile)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 13.2, 13.3, 13.4_

  - [ ]* 7.1 Write unit tests for Navigation component
    - Test menu items render with correct styling
    - Test active state displays correct styling
    - Test hover state displays correct styling
    - Test menu sections display correctly
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.2 Write property test for navigation styling
    - **Property 13: Navigation Menu Consistency**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [x] 8. Implement Badge and Alert components
  - Create `src/components/Badge/Badge.jsx` with all badge variants (primary, secondary, success, warning, error, info)
  - Create `src/components/Badge/Badge.module.css` with badge styling
  - Create `src/components/Alert/Alert.jsx` with all alert variants
  - Create `src/components/Alert/Alert.module.css` with alert styling
  - Add icon support for alerts
  - _Requirements: 7.4, 13.2_

  - [ ]* 8.1 Write unit tests for Badge and Alert components
    - Test all badge variants render with correct colors
    - Test all alert variants render with correct styling
    - Test alert icons display correctly
    - _Requirements: 7.4_

- [x] 9. Implement Select dropdown component
  - Create `src/components/Select/Select.jsx` with custom dropdown styling
  - Create `src/components/Select/Select.module.css` with select styling
  - Implement focus states with Primary Blue border
  - Add dropdown arrow styling
  - _Requirements: 9.3, 13.2, 13.3_

  - [ ]* 9.1 Write unit tests for Select component
    - Test select renders with correct styling
    - Test focus state displays focus ring
    - Test dropdown arrow displays correctly
    - _Requirements: 9.3_

  - [ ]* 9.2 Write property test for select styling
    - **Property 12: Select Dropdown Styling**
    - **Validates: Requirements 9.3**

- [x] 10. Create utility CSS classes for spacing, colors, and display
  - Create `src/styles/utilities/colors.css` with text and background color utilities
  - Create `src/styles/utilities/spacing.css` with padding and margin utilities
  - Create `src/styles/utilities/display.css` with display and flex utilities
  - Create `src/styles/utilities/responsive.css` with responsive utilities
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 11. Checkpoint - Verify all component styles are correct
  - Ensure all component CSS files are created and properly imported
  - Verify all design tokens are accessible via CSS variables
  - Verify all components render with correct styling
  - Ask the user if questions arise.

- [x] 12. Update Dashboard/Overview page with modern styling
  - Update `src/pages/Dashboard/Dashboard.jsx` to use new Card component for metric cards
  - Apply modern spacing and typography using design tokens
  - Implement grid-based layout for metric cards
  - Update page title and section headings to use H1 and H2 styles
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1_

  - [ ]* 12.1 Write unit tests for Dashboard page
    - Test metric cards render with correct styling
    - Test grid layout displays correctly
    - Test typography hierarchy is correct
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 12.2 Write property test for dashboard styling
    - **Property 6: Dashboard Grid Layout**
    - **Validates: Requirements 4.4**

- [x] 13. Update Products page with modern card layout
  - Update `src/pages/Products/Products.jsx` to use new Card component
  - Update product list to display as cards with modern styling
  - Update "Add new product" modal to use new Modal component
  - Apply modern spacing and typography
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1_

  - [ ]* 13.1 Write unit tests for Products page
    - Test product cards render with correct styling
    - Test modal displays with correct styling
    - Test form elements use new Input and Button components
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 13.2 Write property test for product page styling
    - **Property 7: Product Card Consistency**
    - **Validates: Requirements 5.1, 5.2, 5.5**

- [x] 14. Update Supplier page with modern styling
  - Update `src/pages/Supplier/Supplier.jsx` to use new components
  - Apply same modern styling patterns as Products page
  - Update supplier list layout and styling
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 15. Update Category page with modern styling
  - Update `src/pages/Category/Category.jsx` to use new components
  - Apply same modern styling patterns as Products page
  - Update category list layout and styling
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 16. Update Stock page with modern styling
  - Update `src/pages/Stock/Stock.jsx` to use new components
  - Apply modern card-based layouts and spacing
  - Use semantic colors for status indicators
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 17. Update Payment page with modern styling
  - Update `src/pages/Payment/Payment.jsx` to use new components
  - Apply modern styling and visual hierarchy
  - Use semantic colors for payment status indicators
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 18. Update Settings page with modern form styling
  - Update `src/pages/Settings/Settings.jsx` to use new form components
  - Apply modern form styling with Input and Button components
  - Update form field spacing and typography
  - _Requirements: 8.1, 6.1_

- [x] 19. Update Sales page with modern styling
  - Update `src/pages/Sales/Sales.jsx` to use new components
  - Apply modern card-based layouts
  - Update sales data display with modern typography and spacing
  - _Requirements: 8.2, 6.1_

- [x] 20. Update Lending page with modern styling
  - Update `src/pages/Lending/Lending.jsx` to use new components
  - Apply modern styling patterns
  - Update lending data display with modern typography and spacing
  - _Requirements: 8.3, 6.1_

- [x] 21. Update Reports page with modern styling
  - Update `src/pages/Reports/Reports.jsx` to use new components
  - Apply modern table and chart styling
  - Update report display with modern typography and spacing
  - _Requirements: 8.4, 8.5, 6.1_

- [x] 22. Checkpoint - Verify all pages are updated
  - Ensure all pages use new components and styling
  - Verify consistent spacing, typography, and colors across all pages
  - Ask the user if questions arise.

- [x] 23. Implement responsive breakpoints and mobile styling
  - Create `src/styles/responsive.css` with media queries for mobile, tablet, and desktop
  - Update all component styles to be responsive
  - Reduce spacing by 25% on mobile devices
  - Implement collapsible navigation on mobile
  - _Requirements: 12.1, 12.4_

  - [ ]* 23.1 Write unit tests for responsive design
    - Test components render correctly at mobile breakpoint
    - Test components render correctly at tablet breakpoint
    - Test components render correctly at desktop breakpoint
    - _Requirements: 12.1, 12.4_

  - [ ]* 23.2 Write property test for responsive consistency
    - **Property 15: Cross-Browser Rendering Consistency**
    - **Validates: Requirements 12.1, 12.4**

- [x] 24. Create responsive hook and utilities
  - Create `src/hooks/useResponsive.js` hook to detect current breakpoint
  - Create responsive utility classes for display, spacing, and layout
  - Update Navigation component to use responsive hook for mobile menu
  - _Requirements: 12.1, 12.4_

- [x] 25. Implement focus indicators and keyboard navigation
  - Add focus styles to all interactive elements (buttons, inputs, links, menu items)
  - Ensure focus indicators have sufficient contrast (at least 3:1 ratio)
  - Implement keyboard navigation for modals (Tab, Shift+Tab, ESC)
  - Implement keyboard navigation for navigation menu (Arrow keys)
  - _Requirements: 13.2, 13.3_

  - [ ]* 25.1 Write unit tests for focus indicators
    - Test focus indicators are visible on all interactive elements
    - Test focus indicators have sufficient contrast
    - Test keyboard navigation works correctly
    - _Requirements: 13.2, 13.3_

  - [ ]* 25.2 Write property test for focus visibility
    - **Property 20: Focus Indicator Visibility**
    - **Validates: Requirements 13.3**

- [x] 26. Add ARIA labels and semantic HTML
  - Add aria-label attributes to all interactive elements without visible text
  - Add aria-describedby for form fields with error messages
  - Add role attributes where semantic HTML is not available
  - Ensure all interactive elements use semantic HTML (button, input, select, etc.)
  - _Requirements: 13.4_

  - [ ]* 26.1 Write accessibility tests
    - Test all interactive elements have proper ARIA labels
    - Test semantic HTML is used correctly
    - Test screen reader compatibility
    - _Requirements: 13.4_

- [-] 27. Verify WCAG AA contrast compliance
  - Test all text/background color combinations for WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
  - Update colors if any combinations fail contrast requirements
  - Document contrast ratios for all color combinations
  - _Requirements: 13.1_

  - [ ]* 27.1 Write property test for contrast compliance
    - **Property 18: WCAG AA Contrast Compliance**
    - **Validates: Requirements 13.1**

- [ ] 28. Checkpoint - Verify accessibility compliance
  - Ensure all interactive elements have focus indicators
  - Ensure all ARIA labels are present and correct
  - Ensure WCAG AA contrast compliance is met
  - Ask the user if questions arise.

- [ ] 29. Test cross-browser compatibility
  - Test rendering in Chrome, Firefox, Safari, and Edge
  - Verify CSS features are supported in all target browsers
  - Test font rendering across browsers
  - Document any browser-specific issues and workarounds
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 29.1 Write cross-browser tests
    - Test rendering in Chrome, Firefox, Safari, and Edge
    - Test CSS features are supported
    - Test font rendering
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 29.2 Write property test for cross-browser consistency
    - **Property 15: Cross-Browser Rendering Consistency**
    - **Validates: Requirements 12.1, 12.4**

- [ ] 30. Create visual regression tests
  - Set up visual regression testing with Percy or Chromatic
  - Create baseline screenshots for all components
  - Create baseline screenshots for all pages
  - Document visual regression test process
  - _Requirements: 12.1, 12.4_

- [ ] 31. Write comprehensive unit tests for all components
  - Create unit tests for Button, Input, Card, Modal, Navigation, Badge, Alert, Select components
  - Test all component variants and states
  - Test component props and callbacks
  - Aim for 80%+ code coverage
  - _Requirements: 1.5, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5, 13.1, 13.2, 13.3, 13.4_

- [ ] 32. Write property-based tests for correctness properties
  - Create property test for Property 1: Color Palette Consistency
    - **Property 1: Color Palette Consistency**
    - **Validates: Requirements 1.5, 5.5, 7.3, 8.5**
  
  - Create property test for Property 2: Font Family Application
    - **Property 2: Font Family Application**
    - **Validates: Requirements 2.1, 2.3, 2.4**
  
  - Create property test for Property 4: Typography Hierarchy Consistency
    - **Property 4: Typography Hierarchy Consistency**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
  
  - Create property test for Property 9: Cross-Page Styling Consistency
    - **Property 9: Cross-Page Styling Consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5**
  
  - Create property test for Property 14: Spacing Units Application
    - **Property 14: Spacing Units Application**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
  
  - Create property test for Property 19: Interactive Element Distinction
    - **Property 19: Interactive Element Distinction**
    - **Validates: Requirements 13.2**
  
  - Create property test for Property 21: Semantic HTML and ARIA Labels
    - **Property 21: Semantic HTML and ARIA Labels**
    - **Validates: Requirements 13.4**
  
  - Create property test for Property 22: Semantic Color Usage for Status
    - **Property 22: Semantic Color Usage for Status**
    - **Validates: Requirements 7.4**

- [ ] 33. Final checkpoint - Ensure all tests pass
  - Run all unit tests and verify 80%+ coverage
  - Run all property-based tests and verify all properties pass
  - Run accessibility tests and verify WCAG AA compliance
  - Run visual regression tests and verify no unexpected changes
  - Ask the user if questions arise.

- [ ] 34. Create component documentation
  - Create `docs/COMPONENTS.md` with documentation for all components
  - Include component props, variants, and usage examples
  - Include accessibility notes for each component
  - Include styling customization guide
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 35. Create design token documentation
  - Create `docs/DESIGN_TOKENS.md` with documentation for all design tokens
  - Include color palette with hex values and usage guidelines
  - Include typography scale with sizes and weights
  - Include spacing units and usage guidelines
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2, 11.3, 11.4_

- [ ] 36. Create migration guide for existing components
  - Create `docs/MIGRATION_GUIDE.md` with instructions for updating existing components
  - Include before/after examples for common components
  - Include troubleshooting guide for common issues
  - Include performance optimization tips
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 37. Create accessibility guide
  - Create `docs/ACCESSIBILITY.md` with accessibility guidelines
  - Include WCAG AA compliance checklist
  - Include keyboard navigation guide
  - Include screen reader testing guide
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 38. Final documentation checkpoint
  - Ensure all documentation is complete and accurate
  - Verify all code examples are correct and runnable
  - Verify all links and references are correct
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for course correction
- Property-based tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- All components should follow the design specifications exactly
- All pages should maintain consistent styling across the application
- Accessibility should be verified throughout implementation, not just at the end
