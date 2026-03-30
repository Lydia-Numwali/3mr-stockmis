# Dashboard Cards Fix Bugfix Design

## Overview

The dashboard cards are displaying incorrect information due to a mismatch between the backend API response structure and the frontend component expectations. The backend correctly calculates and returns 7 metrics (totalSales, totalPurchases, valueOfSales, valueOfPurchases, stockBalance, totalItemsInStock, lentProducts), but the frontend expects different field names and tries to display 4 cards with undefined data. Additionally, the system needs to display 8 cards total, including a "Total Products" card that requires counting unique products rather than total item quantities.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the dashboard loads and displays cards with undefined data due to field name mismatches
- **Property (P)**: The desired behavior when the dashboard loads - all 8 cards should display correct data with proper field mappings
- **Preservation**: Existing API calculation logic, styling, loading states, and error handling that must remain unchanged
- **DashboardStatsCards**: The React component in `frontend/components/charts/DashboardStatsCards.tsx` that renders the dashboard metric cards
- **getStats**: The backend method in `backend/src/dashboard/dashboard.service.ts` that calculates dashboard metrics
- **Field Mapping**: The correspondence between backend response fields and frontend expected fields

## Bug Details

### Fault Condition

The bug manifests when the dashboard loads and the frontend component tries to access fields that don't exist in the backend API response. The `DashboardStatsCards` component expects fields like `totalProducts`, `productsLentOut`, `lowStockCount`, and `revenueThisMonth`, but the backend returns different field names and doesn't calculate all required metrics.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type DashboardLoadEvent
  OUTPUT: boolean
  
  RETURN input.isInitialLoad = true
         AND (backendResponse.totalProducts IS undefined
              OR backendResponse.productsLentOut IS undefined  
              OR backendResponse.lowStockCount IS undefined
              OR backendResponse.revenueThisMonth IS undefined)
         AND frontendExpectsEightCards = true
END FUNCTION
```

### Examples

- **Total Products Card**: Frontend expects `stats.totalProducts` but backend returns `totalItemsInStock` (which is quantity sum, not product count)
- **Lent Products Card**: Frontend expects `stats.productsLentOut` but backend returns `lentProducts`
- **Stock Alerts Card**: Frontend expects `stats.lowStockCount` but backend doesn't provide this field at all
- **Income This Month Card**: Frontend expects `stats.revenueThisMonth` but backend doesn't provide this field at all
- **Missing Cards**: System shows only 4 cards instead of required 8 business metrics (Total Sales, Total Purchases, Value of Sales, Value of Purchases, Stock Balance)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Existing API calculation logic for sales, purchases, stock quantities, and lending data must continue to work exactly as before
- Card styling, icons, responsive layout, and visual design must remain unchanged
- Loading states with skeleton placeholders must continue to work as before
- Error handling for API failures must remain unchanged
- Existing dashboard endpoints (`/dashboard/best-customers`, `/dashboard/revenue-trend`, etc.) must continue to work

**Scope:**
All dashboard functionality that does NOT involve the main stats cards should be completely unaffected by this fix. This includes:
- Chart components (bar charts, pie charts)
- Best customers data
- Revenue trend data
- Category breakdown data
- Low stock alerts list (separate from the count)

## Hypothesized Root Cause

Based on the bug analysis, the issues are:

1. **Field Name Mismatch**: The frontend component was built expecting different field names than what the backend provides
   - Frontend expects `totalProducts` but backend calculates total item quantities as `totalItemsInStock`
   - Frontend expects `productsLentOut` but backend returns `lentProducts`

2. **Missing Calculations**: The backend doesn't calculate some metrics the frontend expects
   - No `lowStockCount` calculation (count of products below threshold)
   - No `revenueThisMonth` calculation (current month sales value)
   - No `totalProducts` calculation (count of unique products)

3. **Incomplete Card Set**: The frontend only implements 4 cards instead of the required 8 business metrics

4. **Incorrect Metric Definition**: The backend calculates `totalItemsInStock` as sum of quantities, but the business requirement is for count of unique products

## Correctness Properties

Property 1: Fault Condition - Dashboard Cards Display Correct Data

_For any_ dashboard load event where the system should display 8 metric cards, the fixed dashboard SHALL display all cards with correct data values mapped from the backend API response, showing Total Products (unique count), Lent Products, Total Sales, Total Purchases, Value of Sales, Value of Purchases, Stock Balance, and Items in Stock.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

Property 2: Preservation - Non-Dashboard Functionality

_For any_ dashboard functionality that is NOT the main stats cards (charts, customer data, trends), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing API endpoints, calculations, and UI components.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `backend/src/dashboard/dashboard.service.ts`

**Function**: `getStats`

**Specific Changes**:
1. **Add Total Products Calculation**: Add a query to count unique products (not sum of quantities)
   - Add `this.prodRepo.createQueryBuilder('p').select('COALESCE(COUNT(*), 0)', 'total').getRawOne()`
   - Return as `totalProducts` field

2. **Add Low Stock Count Calculation**: Add a query to count products below threshold
   - Add `this.prodRepo.createQueryBuilder('p').select('COALESCE(COUNT(*), 0)', 'total').where('p.quantity <= p.lowStockThreshold').getRawOne()`
   - Return as `lowStockCount` field

3. **Add Revenue This Month Calculation**: Add a query for current month sales value
   - Add query with date filtering for current month
   - Return as `revenueThisMonth` field

4. **Update Field Names**: Ensure response includes both old and new field names for compatibility
   - Keep existing fields for backward compatibility
   - Add new fields with expected names

5. **Rename totalItemsInStock**: Change to `itemsInStock` to match business requirements

**File**: `frontend/components/charts/DashboardStatsCards.tsx`

**Component**: `DashboardStatsCards`

**Specific Changes**:
1. **Update Field References**: Change field names to match backend response
   - `stats?.totalProducts` (new field)
   - `stats?.lentProducts` (existing field, rename from productsLentOut)
   - `stats?.lowStockCount` (new field)
   - `stats?.revenueThisMonth` (new field)

2. **Add Missing Cards**: Expand from 4 to 8 cards
   - Add "Total Sales" card using `stats?.totalSales`
   - Add "Total Purchases" card using `stats?.totalPurchases`
   - Add "Value of Sales" card using `stats?.valueOfSales`
   - Add "Value of Purchases" card using `stats?.valueOfPurchases`
   - Add "Stock Balance" card using `stats?.stockBalance`
   - Update "Items in Stock" card using `stats?.itemsInStock`

3. **Update Grid Layout**: Change from `grid-cols-2 lg:grid-cols-4` to accommodate 8 cards
   - Use `grid-cols-2 lg:grid-cols-4 xl:grid-cols-4` with wrapping for 8 cards

4. **Add Appropriate Icons**: Add icons for new cards (DollarSign, TrendingUp, Scale, etc.)

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that load the dashboard and inspect the rendered cards for undefined values and missing cards. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Field Mismatch Test**: Load dashboard and verify `totalProducts` field is undefined (will fail on unfixed code)
2. **Missing Cards Test**: Count rendered cards and verify only 4 are shown instead of 8 (will fail on unfixed code)
3. **Undefined Values Test**: Check that cards show "0" or undefined for missing backend fields (will fail on unfixed code)
4. **API Response Test**: Inspect backend response and verify field names don't match frontend expectations (will fail on unfixed code)

**Expected Counterexamples**:
- Cards display "0" or undefined values due to field name mismatches
- Only 4 cards render instead of required 8 cards
- Possible causes: field name mismatch, missing calculations, incomplete card implementation

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := loadDashboard_fixed(input)
  ASSERT allEightCardsDisplayCorrectData(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT loadDashboard_original(input) = loadDashboard_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-dashboard-cards functionality

**Test Plan**: Observe behavior on UNFIXED code first for charts, customer data, and other endpoints, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Chart Data Preservation**: Verify revenue trends, category breakdowns continue to work correctly after fix
2. **API Endpoint Preservation**: Verify all other dashboard endpoints return same data after fix
3. **UI Component Preservation**: Verify charts, customer lists, and other components render identically after fix
4. **Error Handling Preservation**: Verify API error scenarios continue to be handled correctly

### Unit Tests

- Test backend `getStats` method returns all 8 required fields with correct data types
- Test frontend component renders 8 cards when provided with complete data
- Test field mapping between backend response and frontend display
- Test edge cases (empty database, no sales/purchases, no lending data)

### Property-Based Tests

- Generate random database states and verify all 8 cards display appropriate values
- Generate random API response structures and verify frontend handles field presence/absence correctly
- Test that calculations remain mathematically correct across many scenarios

### Integration Tests

- Test full dashboard load flow from API call to card rendering
- Test responsive layout with 8 cards across different screen sizes
- Test loading states and error handling for the complete dashboard