import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending } from '../entities/lending.entity';

describe('Dashboard Integration Tests - Complete Fix Verification', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    // Mock repositories with realistic data
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockImplementation(() => {
        // Return different values based on the query type
        const selectCalls = mockQueryBuilder.select.mock.calls;
        const lastSelectCall = selectCalls[selectCalls.length - 1];
        
        if (lastSelectCall && lastSelectCall[0].includes('COUNT(*)')) {
          return Promise.resolve({ total: 25 }); // Count queries
        } else if (lastSelectCall && lastSelectCall[0].includes('SUM')) {
          return Promise.resolve({ total: 50000 }); // Sum queries
        }
        
        return Promise.resolve({ total: 10 });
      }),
      getRawMany: jest.fn().mockResolvedValue([]),
      getMany: jest.fn().mockResolvedValue([]),
    };

    const mockProdRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    const mockSaleRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    const mockPurchaseRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    const mockLendRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Product), useValue: mockProdRepo },
        { provide: getRepositoryToken(Sale), useValue: mockSaleRepo },
        { provide: getRepositoryToken(Purchase), useValue: mockPurchaseRepo },
        { provide: getRepositoryToken(Lending), useValue: mockLendRepo },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  describe('Complete Dashboard Cards Fix Verification', () => {
    it('should provide all 8 required fields for frontend dashboard cards', async () => {
      const stats = await service.getStats();

      // Verify all 8 required fields are present
      expect(stats).toHaveProperty('totalProducts');
      expect(stats).toHaveProperty('productsLentOut');
      expect(stats).toHaveProperty('totalSales');
      expect(stats).toHaveProperty('totalPurchases');
      expect(stats).toHaveProperty('valueOfSales');
      expect(stats).toHaveProperty('valueOfPurchases');
      expect(stats).toHaveProperty('stockBalance');
      expect(stats).toHaveProperty('itemsInStock');

      // Verify all values are numbers
      expect(typeof stats.totalProducts).toBe('number');
      expect(typeof stats.productsLentOut).toBe('number');
      expect(typeof stats.totalSales).toBe('number');
      expect(typeof stats.totalPurchases).toBe('number');
      expect(typeof stats.valueOfSales).toBe('number');
      expect(typeof stats.valueOfPurchases).toBe('number');
      expect(typeof stats.stockBalance).toBe('number');
      expect(typeof stats.itemsInStock).toBe('number');

      console.log('✅ All 8 dashboard cards have correct field mappings');
      console.log('Dashboard response:', stats);
    });

    it('should maintain backward compatibility with existing fields', async () => {
      const stats = await service.getStats();

      // Verify existing fields are still present
      expect(stats).toHaveProperty('totalSales');
      expect(stats).toHaveProperty('totalPurchases');
      expect(stats).toHaveProperty('valueOfSales');
      expect(stats).toHaveProperty('valueOfPurchases');
      expect(stats).toHaveProperty('stockBalance');
      expect(stats).toHaveProperty('totalItemsInStock');
      expect(stats).toHaveProperty('lentProducts');

      console.log('✅ Backward compatibility maintained');
    });

    it('should calculate stockBalance correctly as valueOfPurchases - valueOfSales', async () => {
      const stats = await service.getStats();

      const expectedBalance = stats.valueOfPurchases - stats.valueOfSales;
      expect(stats.stockBalance).toBe(expectedBalance);

      console.log('✅ Stock balance calculation is correct');
    });

    it('should provide field aliases for frontend compatibility', async () => {
      const stats = await service.getStats();

      // Verify aliases work correctly
      expect(stats.productsLentOut).toBe(stats.lentProducts);
      expect(stats.itemsInStock).toBe(stats.totalItemsInStock);

      console.log('✅ Field aliases working correctly');
    });

    it('should handle the complete dashboard endpoint through controller', async () => {
      const result = await controller.getStats();

      // Verify controller returns the same structure
      expect(result).toHaveProperty('totalProducts');
      expect(result).toHaveProperty('productsLentOut');
      expect(result).toHaveProperty('totalSales');
      expect(result).toHaveProperty('totalPurchases');
      expect(result).toHaveProperty('valueOfSales');
      expect(result).toHaveProperty('valueOfPurchases');
      expect(result).toHaveProperty('stockBalance');
      expect(result).toHaveProperty('itemsInStock');

      console.log('✅ Controller endpoint working correctly');
    });
  });

  describe('Frontend Card Mapping Verification', () => {
    it('should provide exactly the fields that frontend DashboardStatsCards expects', async () => {
      const stats = await service.getStats();

      // These are the exact fields the frontend component uses
      const frontendExpectedFields = [
        'totalProducts',      // Card 1: Total Products
        'productsLentOut',    // Card 2: Lent Products  
        'totalSales',         // Card 3: Total Sales
        'totalPurchases',     // Card 4: Total Purchases
        'valueOfSales',       // Card 5: Value of Sales
        'valueOfPurchases',   // Card 6: Value of Purchases
        'stockBalance',       // Card 7: Stock Balance
        'itemsInStock',       // Card 8: Items in Stock
      ];

      frontendExpectedFields.forEach(field => {
        expect(stats).toHaveProperty(field);
        expect(typeof stats[field]).toBe('number');
      });

      console.log('✅ All frontend expected fields are present and correctly typed');
    });
  });
});