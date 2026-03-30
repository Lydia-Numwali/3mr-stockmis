/**
 * Bug Condition Exploration Test for Dashboard Cards
 * 
 * **Property 1: Fault Condition** - Dashboard Cards Display Undefined Data
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * **GOAL**: Surface counterexamples that demonstrate the bug exists
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**
 * 
 * This test verifies that dashboard load produces 8 cards with correct field mappings.
 * It tests the fault condition where the frontend expects different field names than
 * what the backend provides, causing undefined data to be displayed.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardStatsCards } from '@/components/charts/DashboardStatsCards';
import { DashboardService } from '@/services/dashboard.service';
import { UtilsService } from '@/services/utils.service';

// Mock the dashboard service to return the current backend response format
jest.mock('@/services/dashboard.service');
jest.mock('@/services/utils.service');

const MockedDashboardService = DashboardService as jest.MockedClass<typeof DashboardService>;
const MockedUtilsService = UtilsService as jest.MockedClass<typeof UtilsService>;

describe('Property 1: Fault Condition - Dashboard Cards Display Undefined Data', () => {
  let queryClient: QueryClient;
  let mockDashboardService: jest.Mocked<DashboardService>;
  let mockUtilsService: jest.Mocked<UtilsService>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock the current backend response format (what actually gets returned)
    mockUtilsService = {
      authorizedAPI: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          data: {
            // Current backend response format - these are the ACTUAL field names returned
            totalSales: 150,
            totalPurchases: 200,
            valueOfSales: 75000,
            valueOfPurchases: 120000,
            stockBalance: 45000,
            totalItemsInStock: 1250, // Backend returns this, but frontend expects 'totalProducts'
            lentProducts: 25, // Backend returns this, but frontend expects 'productsLentOut'
            // Missing fields that frontend expects but backend doesn't provide:
            // - totalProducts (count of unique products)
            // - productsLentOut (frontend expects this name)
            // - lowStockCount (not calculated by backend)
            // - revenueThisMonth (not calculated by backend)
          }
        })
      })
    } as any;

    mockDashboardService = {
      getStats: jest.fn().mockImplementation(async () => {
        const response = await mockUtilsService.authorizedAPI().get('/dashboard/stats');
        return response.data;
      })
    } as any;

    MockedUtilsService.mockImplementation(() => mockUtilsService);
    MockedDashboardService.mockImplementation(() => mockDashboardService);
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  /**
   * Test that demonstrates the bug condition: Dashboard loads but displays undefined data
   * due to field name mismatches between backend response and frontend expectations.
   * 
   * **EXPECTED OUTCOME**: This test FAILS on unfixed code (this is correct - it proves the bug exists)
   */
  test('should display 8 cards with correct field mappings - EXPECTED TO FAIL on unfixed code', async () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    render(
      <TestWrapper>
        <DashboardStatsCards />
      </TestWrapper>
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(mockDashboardService.getStats).toHaveBeenCalled();
    });

    // **BUG CONDITION 1**: Frontend expects 'totalProducts' but backend returns 'totalItemsInStock'
    // This should fail because the frontend component expects stats.totalProducts but gets undefined
    const totalProductsCard = screen.getByText('Total Products');
    expect(totalProductsCard).toBeInTheDocument();
    
    // The card should display the actual count, but will show 0 due to field mismatch
    // This assertion will FAIL on unfixed code because stats.totalProducts is undefined
    const totalProductsValue = screen.getByText(/^\d+$/).closest('div')?.querySelector('p:last-child');
    expect(totalProductsValue).not.toHaveTextContent('0'); // This will FAIL - proves bug exists

    // **BUG CONDITION 2**: Frontend expects 'productsLentOut' but backend returns 'lentProducts'
    const lentItemsCard = screen.getByText('Lent Items');
    expect(lentItemsCard).toBeInTheDocument();
    
    // This assertion will FAIL on unfixed code because stats.productsLentOut is undefined
    const lentItemsValue = lentItemsCard.closest('div')?.querySelector('p:last-child');
    expect(lentItemsValue).not.toHaveTextContent('0'); // This will FAIL - proves bug exists

    // **BUG CONDITION 3**: Frontend expects 'lowStockCount' but backend doesn't provide it
    const stockAlertsCard = screen.getByText('Stock Alerts');
    expect(stockAlertsCard).toBeInTheDocument();
    
    // This assertion will FAIL on unfixed code because stats.lowStockCount is undefined
    const stockAlertsValue = stockAlertsCard.closest('div')?.querySelector('p:last-child');
    expect(stockAlertsValue).not.toHaveTextContent('0'); // This will FAIL - proves bug exists

    // **BUG CONDITION 4**: Frontend expects 'revenueThisMonth' but backend doesn't provide it
    const incomeCard = screen.getByText('Income This Month');
    expect(incomeCard).toBeInTheDocument();
    
    // This assertion will FAIL on unfixed code because stats.revenueThisMonth is undefined
    const incomeValue = incomeCard.closest('div')?.querySelector('p:last-child');
    expect(incomeValue).not.toHaveTextContent('Frws 0'); // This will FAIL - proves bug exists

    // **BUG CONDITION 5**: System shows only 4 cards instead of required 8
    // The following cards should exist but are missing in the current implementation:
    
    // These assertions will FAIL on unfixed code because these cards don't exist
    expect(screen.getByText('Total Sales')).toBeInTheDocument(); // WILL FAIL - card missing
    expect(screen.getByText('Total Purchases')).toBeInTheDocument(); // WILL FAIL - card missing
    expect(screen.getByText('Value of Sales')).toBeInTheDocument(); // WILL FAIL - card missing
    expect(screen.getByText('Value of Purchases')).toBeInTheDocument(); // WILL FAIL - card missing
    expect(screen.getByText('Stock Balance')).toBeInTheDocument(); // WILL FAIL - card missing
    expect(screen.getByText('Items in Stock')).toBeInTheDocument(); // WILL FAIL - card missing

    // **BUG CONDITION 6**: Verify all 8 required cards are rendered
    const allCards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('bg-white') && el.className.includes('rounded-2xl')
    );
    expect(allCards).toHaveLength(8); // This will FAIL - only 4 cards exist

    // **EXPECTED COUNTEREXAMPLES**:
    // 1. Cards display "0" or undefined values due to field name mismatches
    // 2. Only 4 cards render instead of required 8 cards
    // 3. Missing cards: Total Sales, Total Purchases, Value of Sales, Value of Purchases, Stock Balance, Items in Stock
    // 4. Field mapping issues: totalProducts, productsLentOut, lowStockCount, revenueThisMonth are undefined
  });

  /**
   * Test that verifies the backend response structure to confirm our root cause analysis
   */
  test('should confirm backend response structure differs from frontend expectations', async () => {
    const stats = await mockDashboardService.getStats();

    // Verify backend provides these fields (these should pass)
    expect(stats.totalSales).toBeDefined();
    expect(stats.totalPurchases).toBeDefined();
    expect(stats.valueOfSales).toBeDefined();
    expect(stats.valueOfPurchases).toBeDefined();
    expect(stats.stockBalance).toBeDefined();
    expect(stats.totalItemsInStock).toBeDefined(); // Backend provides this
    expect(stats.lentProducts).toBeDefined(); // Backend provides this

    // Verify backend does NOT provide these fields that frontend expects (these should pass)
    expect(stats.totalProducts).toBeUndefined(); // Frontend expects this - MISSING
    expect(stats.productsLentOut).toBeUndefined(); // Frontend expects this - MISSING
    expect(stats.lowStockCount).toBeUndefined(); // Frontend expects this - MISSING
    expect(stats.revenueThisMonth).toBeUndefined(); // Frontend expects this - MISSING

    // This confirms the root cause: field name mismatch and missing calculations
  });
});