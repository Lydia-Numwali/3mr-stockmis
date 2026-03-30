# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Dashboard Cards Display Undefined Data
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to dashboard load scenarios where cards should display correct data
  - Test that dashboard load produces 8 cards with correct field mappings (from Fault Condition in design)
  - Verify totalProducts, productsLentOut, lowStockCount, revenueThisMonth fields are accessible
  - Verify all 8 required cards are rendered (Total Products, Lent Products, Total Sales, Total Purchases, Value of Sales, Value of Purchases, Stock Balance, Items in Stock)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause (undefined fields, missing cards)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  - **COMPLETED**: ✅ Bug exploration tests written and confirmed the field mapping issues

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Dashboard Functionality Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-dashboard-cards functionality
  - Test that chart components (revenue trends, category breakdowns) continue to work correctly
  - Test that other dashboard endpoints (/dashboard/best-customers, /dashboard/revenue-trend) return same data
  - Test that existing API calculation logic for sales, purchases, stock quantities remains unchanged
  - Test that UI components (charts, customer lists) render identically
  - Test that error handling for API failures continues to work
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - **COMPLETED**: ✅ Preservation tests written and passing, baseline behavior documented

- [x] 3. Fix dashboard cards to display correct 8 metrics with proper field mappings

  - [x] 3.1 Update backend dashboard service to provide all required fields
    - Add totalProducts calculation (count of unique products, not sum of quantities)
    - Add lowStockCount calculation (count of products below threshold)
    - Add revenueThisMonth calculation (current month sales value)
    - Update field names to match frontend expectations (keep existing for compatibility)
    - Ensure response includes all 8 required metrics: totalProducts, lentProducts, totalSales, totalPurchases, valueOfSales, valueOfPurchases, stockBalance, itemsInStock
    - _Bug_Condition: isBugCondition(input) where dashboard loads and fields are undefined_
    - _Expected_Behavior: All 8 cards display correct data with proper field mappings_
    - _Preservation: Existing API calculation logic, other endpoints, and error handling unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4_
    - **COMPLETED**: ✅ Backend service updated with all required fields and calculations

  - [x] 3.2 Update frontend DashboardStatsCards component to display 8 cards
    - Update field references to match backend response (totalProducts, lentProducts, lowStockCount, revenueThisMonth)
    - Add missing cards for Total Sales, Total Purchases, Value of Sales, Value of Purchases, Stock Balance
    - Update grid layout to accommodate 8 cards with proper responsive design
    - Add appropriate icons for new cards (DollarSign, TrendingUp, Scale, etc.)
    - Ensure all cards display correct data from backend API response
    - _Bug_Condition: isBugCondition(input) where frontend expects different field names_
    - _Expected_Behavior: Frontend displays 8 cards with correct field mappings_
    - _Preservation: Card styling, loading states, error handling unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4_
    - **COMPLETED**: ✅ Frontend component updated to display all 8 cards with correct field mappings

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Dashboard Cards Display Correct Data
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify all 8 cards display correct data with proper field mappings
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
    - **COMPLETED**: ✅ Bug exploration tests now pass, confirming the fix works

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Dashboard Functionality Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - Verify chart components, other endpoints, and UI components work identically
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
    - **COMPLETED**: ✅ All preservation tests still pass, no regressions detected

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - **COMPLETED**: ✅ All 27 tests passing, integration tests confirm complete fix