import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending } from '../entities/lending.entity';

describe('Dashboard Bug Exploration Tests', () => {
  let service: DashboardService;
  let mockProdRepo: any;
  let mockSaleRepo: any;
  let mockPurchaseRepo: any;
  let mockLendRepo: any;

  beforeEach(async () => {
    // Mock repositories with sample data
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: 10 }),
      getRawMany: jest.fn().mockResolvedValue([]),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockProdRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    mockSaleRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    mockPurchaseRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    mockLendRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Product), useValue: mockProdRepo },
        { provide: getRepositoryToken(Sale), useValue: mockSaleRepo },
        { provide: getRepositoryToken(Purchase), useValue: mockPurchaseRepo },
        { provide: getRepositoryToken(Lending), useValue: mockLendRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  describe('Bug Condition Exploration - Field Mapping Issues', () => {
    it('SHOULD FAIL: Backend should provide all 8 required fields for dashboard cards', async () => {
      // This test encodes the expected behavior and MUST FAIL on unfixed code
      const stats = await service.getStats();

      // Test for all 8 required fields that frontend expects
      const requiredFields = [
        'totalProducts',      // Frontend expects this, backend returns totalItemsInStock
        'lentProducts',       // Backend has this (correct)
        'totalSales',         // Backend has this (correct)
        'totalPurchases',     // Backend has this (correct)
        'valueOfSales',       // Backend has this (correct)
        'valueOfPurchases',   // Backend has this (correct)
        'stockBalance',       // Backend has this (correct)
        'itemsInStock',       // Frontend expects this, backend returns totalItemsInStock
        'productsLentOut',    // Frontend expects this, backend returns lentProducts
        'lowStockCount',      // Frontend expects this, backend doesn't provide
        'revenueThisMonth',   // Frontend expects this, backend doesn't provide
      ];

      console.log('Current backend response:', stats);
      console.log('Fields present in response:', Object.keys(stats));

      // These assertions WILL FAIL on unfixed code - this is expected and correct
      expect(stats).toHaveProperty('totalProducts');
      expect(stats).toHaveProperty('productsLentOut');
      expect(stats).toHaveProperty('lowStockCount');
      expect(stats).toHaveProperty('revenueThisMonth');
      expect(stats).toHaveProperty('itemsInStock');

      // Verify the response has all required metrics (12 total including compatibility fields)
      expect(Object.keys(stats).length).toBeGreaterThanOrEqual(8);
    });

    it('SHOULD FAIL: Frontend field mapping should match backend response', async () => {
      const stats = await service.getStats();

      // Document the field mapping issues
      const frontendExpectedFields = [
        'totalProducts',
        'productsLentOut', 
        'lowStockCount',
        'revenueThisMonth'
      ];

      const backendActualFields = Object.keys(stats);
      
      console.log('Frontend expects these fields:', frontendExpectedFields);
      console.log('Backend provides these fields:', backendActualFields);

      // These will fail - documenting the mismatch
      frontendExpectedFields.forEach(field => {
        expect(backendActualFields).toContain(field);
      });
    });
  });

  describe('Bug Condition Exploration - Missing Calculations', () => {
    it('SHOULD FAIL: Backend should calculate totalProducts as count of unique products', async () => {
      const stats = await service.getStats();
      
      // totalProducts should be count of unique products, not sum of quantities
      expect(stats.totalProducts).toBeDefined();
      expect(typeof stats.totalProducts).toBe('number');
    });

    it('SHOULD FAIL: Backend should calculate lowStockCount', async () => {
      const stats = await service.getStats();
      
      expect(stats.lowStockCount).toBeDefined();
      expect(typeof stats.lowStockCount).toBe('number');
    });

    it('SHOULD FAIL: Backend should calculate revenueThisMonth', async () => {
      const stats = await service.getStats();
      
      expect(stats.revenueThisMonth).toBeDefined();
      expect(typeof stats.revenueThisMonth).toBe('number');
    });
  });
});