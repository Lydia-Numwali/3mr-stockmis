import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending } from '../entities/lending.entity';

describe('Dashboard Preservation Tests', () => {
  let service: DashboardService;
  let mockProdRepo: any;
  let mockSaleRepo: any;
  let mockPurchaseRepo: any;
  let mockLendRepo: any;

  beforeEach(async () => {
    // Mock repositories with method-specific data
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: 100 }),
      getRawMany: jest.fn().mockImplementation(() => {
        // Return different data based on the query context
        const selectCalls = mockQueryBuilder.select.mock.calls;
        const lastSelectCall = selectCalls[selectCalls.length - 1];
        
        if (lastSelectCall && lastSelectCall[0].includes('customerName')) {
          return Promise.resolve([
            { customerName: 'John Doe', frequency: 5, totalValue: 1000 }
          ]);
        } else if (lastSelectCall && lastSelectCall[0].includes('DATE_TRUNC')) {
          return Promise.resolve([
            { month: '2024-01-01', revenue: 5000 }
          ]);
        } else if (lastSelectCall && lastSelectCall[0].includes('category')) {
          return Promise.resolve([
            { category: 'Electronics', count: 10, totalQty: 50 }
          ]);
        }
        
        return Promise.resolve([]);
      }),
      getMany: jest.fn().mockResolvedValue([
        { id: 1, name: 'Product 1', quantity: 5, lowStockThreshold: 10 }
      ]),
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

  describe('Preservation - Existing API Calculations', () => {
    it('should preserve existing totalSales calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('totalSales');
      expect(typeof stats.totalSales).toBe('number');
      expect(stats.totalSales).toBe(100);
    });

    it('should preserve existing totalPurchases calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('totalPurchases');
      expect(typeof stats.totalPurchases).toBe('number');
      expect(stats.totalPurchases).toBe(100);
    });

    it('should preserve existing valueOfSales calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('valueOfSales');
      expect(typeof stats.valueOfSales).toBe('number');
      expect(stats.valueOfSales).toBe(100);
    });

    it('should preserve existing valueOfPurchases calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('valueOfPurchases');
      expect(typeof stats.valueOfPurchases).toBe('number');
      expect(stats.valueOfPurchases).toBe(100);
    });

    it('should preserve existing stockBalance calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('stockBalance');
      expect(typeof stats.stockBalance).toBe('number');
      expect(stats.stockBalance).toBe(0); // 100 - 100 = 0
    });

    it('should preserve existing totalItemsInStock calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('totalItemsInStock');
      expect(typeof stats.totalItemsInStock).toBe('number');
      expect(stats.totalItemsInStock).toBe(100);
    });

    it('should preserve existing lentProducts calculation', async () => {
      const stats = await service.getStats();
      
      expect(stats).toHaveProperty('lentProducts');
      expect(typeof stats.lentProducts).toBe('number');
      expect(stats.lentProducts).toBe(100);
    });
  });

  describe('Preservation - Other Dashboard Endpoints', () => {
    it('should preserve getBestCustomers functionality', async () => {
      const customers = await service.getBestCustomers();
      
      expect(Array.isArray(customers)).toBe(true);
      expect(customers).toHaveLength(1);
      expect(customers[0]).toHaveProperty('customerName');
      expect(customers[0]).toHaveProperty('frequency');
      expect(customers[0]).toHaveProperty('totalValue');
    });

    it('should preserve getMonthlyRevenueTrend functionality', async () => {
      const trend = await service.getMonthlyRevenueTrend();
      
      expect(Array.isArray(trend)).toBe(true);
      expect(trend).toHaveLength(1);
      expect(trend[0]).toHaveProperty('month');
      expect(trend[0]).toHaveProperty('revenue');
    });

    it('should preserve getCategoryBreakdown functionality', async () => {
      const breakdown = await service.getCategoryBreakdown();
      
      expect(Array.isArray(breakdown)).toBe(true);
      expect(breakdown).toHaveLength(1);
      expect(breakdown[0]).toHaveProperty('category');
      expect(breakdown[0]).toHaveProperty('count');
      expect(breakdown[0]).toHaveProperty('totalQty');
    });

    it('should preserve getLowStockAlerts functionality', async () => {
      const alerts = await service.getLowStockAlerts();
      
      expect(Array.isArray(alerts)).toBe(true);
      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toHaveProperty('id');
      expect(alerts[0]).toHaveProperty('name');
      expect(alerts[0]).toHaveProperty('quantity');
    });
  });

  describe('Preservation - Mathematical Correctness', () => {
    it('should preserve stockBalance calculation as valueOfPurchases - valueOfSales', async () => {
      const stats = await service.getStats();
      
      const expectedBalance = stats.valueOfPurchases - stats.valueOfSales;
      expect(stats.stockBalance).toBe(expectedBalance);
    });

    it('should preserve numeric type conversions', async () => {
      const stats = await service.getStats();
      
      // All values should be numbers, not strings
      Object.values(stats).forEach(value => {
        expect(typeof value).toBe('number');
      });
    });
  });

  describe('Preservation - Repository Query Patterns', () => {
    it('should preserve COUNT query pattern for sales', async () => {
      await service.getStats();
      
      expect(mockSaleRepo.createQueryBuilder).toHaveBeenCalled();
      const queryBuilder = mockSaleRepo.createQueryBuilder();
      expect(queryBuilder.select).toHaveBeenCalledWith('COALESCE(COUNT(*), 0)', 'total');
    });

    it('should preserve SUM query pattern for values', async () => {
      await service.getStats();
      
      expect(mockSaleRepo.createQueryBuilder).toHaveBeenCalled();
      const queryBuilder = mockSaleRepo.createQueryBuilder();
      expect(queryBuilder.select).toHaveBeenCalledWith('COALESCE(SUM(s.totalValue), 0)', 'total');
    });

    it('should preserve lending status filtering', async () => {
      await service.getStats();
      
      expect(mockLendRepo.createQueryBuilder).toHaveBeenCalled();
      const queryBuilder = mockLendRepo.createQueryBuilder();
      expect(queryBuilder.where).toHaveBeenCalledWith('l.status IN (:...s)', expect.any(Object));
    });
  });
});