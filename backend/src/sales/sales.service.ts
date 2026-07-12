import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for issuing items to employees/departments/sites
export class CreateSaleDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityIssued: number;  // Renamed from quantitySold
  @Type(() => Number) @IsNumber() @IsOptional() priceUsed?: number;  // Optional - for accounting/valuation when needed
  @IsOptional() @IsString() issuedTo?: string;  // Renamed from customerName - employee name
  @IsOptional() @IsString() department?: string;  // NEW: which department
  @IsOptional() @IsString() securitySite?: string;  // NEW: which site/branch
  @IsOptional() @IsString() issuedBy?: string;  // NEW: staff who issued
  @IsOptional() @IsString() approvedBy?: string;  // NEW: approval
  @IsOptional() @IsString() purpose?: string;  // NEW: reason for issue
  @IsOptional() @IsString() issueDate?: string;  // Renamed from saleDate
  @IsOptional() @IsString() notes?: string;
  
  // Backward compatibility - accept old field names
  @Type(() => Number) @IsNumber() @Min(1) @IsOptional() quantitySold?: number;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() saleDate?: string;
}

export class BulkSaleItemDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityIssued: number;  // Renamed
  @Type(() => Number) @IsNumber() priceUsed: number;
  
  // Backward compatibility
  @Type(() => Number) @IsNumber() @Min(1) @IsOptional() quantitySold?: number;
}

export class CreateBulkSaleDto {
  @IsOptional() @IsString() issuedTo?: string;  // Renamed from customerName
  @IsOptional() @IsString() department?: string;  // NEW
  @IsOptional() @IsString() securitySite?: string;  // NEW
  @IsOptional() @IsString() issuedBy?: string;  // NEW
  @IsOptional() @IsString() approvedBy?: string;  // NEW
  @IsOptional() @IsString() purpose?: string;  // NEW
  @IsOptional() @IsString() issueDate?: string;  // Renamed
  @IsOptional() @IsString() notes?: string;
  items: BulkSaleItemDto[];
  
  // Backward compatibility
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() saleDate?: string;
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateSaleDto) {
    return this.dataSource.transaction(async (em) => {
      const product = await em.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Logistics item not found');
      
      // Map old field names to new for backward compatibility
      const quantityIssued = dto.quantityIssued || dto.quantitySold;
      const issuedTo = dto.issuedTo || dto.customerName;
      const issueDate = dto.issueDate || dto.saleDate;
      
      if (!quantityIssued) throw new BadRequestException('Quantity to issue is required');
      
      // Check if sufficient stock available
      if (product.quantity < quantityIssued)
        throw new BadRequestException(`Insufficient stock. Available: ${product.quantity}, Requested: ${quantityIssued}`);
      
      // Decrease product quantity
      product.quantity -= Number(quantityIssued);
      await em.save(product);
      
      // Create issue record (no payment fields for internal logistics)
      const sale = em.create(Sale, {
        productId: dto.productId,
        quantityIssued: Number(quantityIssued),
        priceUsed: dto.priceUsed,
        issuedTo: issuedTo,
        department: dto.department,
        securitySite: dto.securitySite,
        issuedBy: dto.issuedBy,
        approvedBy: dto.approvedBy,
        purpose: dto.purpose,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        notes: dto.notes,
      });
      const savedSale = await em.save(sale);
      
      // Create stock movement record
      const movementNotes = [
        `Items Issued #${savedSale.id}`,
        issuedTo ? `to ${issuedTo}` : '',
        dto.department ? `(${dto.department})` : '',
        dto.securitySite ? `at ${dto.securitySite}` : '',
      ].filter(Boolean).join(' ');
      
      const movement = em.create(StockMovement, {
        productId: dto.productId,
        type: MovementType.OUT,
        quantity: quantityIssued,
        notes: movementNotes,
      });
      await em.save(movement);
      
      return savedSale;
    });
  }

  async createBulk(dto: CreateBulkSaleDto) {
    return this.dataSource.transaction(async (em) => {
      const savedSales = [];
      const issuedTo = dto.issuedTo || dto.customerName;
      const issueDate = dto.issueDate || dto.saleDate;
      const issueDateObj = issueDate ? new Date(issueDate) : new Date();
      
      // First, check stock availability for all items
      for (const item of dto.items) {
        const product = await em.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Logistics item with ID ${item.productId} not found`);
        
        const quantityIssued = item.quantityIssued || item.quantitySold;
        if (!quantityIssued) throw new BadRequestException(`Quantity to issue is required for item ${item.productId}`);
        
        if (product.quantity < quantityIssued) {
          throw new BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${quantityIssued}`);
        }
      }
      
      // If all items have sufficient stock, proceed with issuing
      for (const item of dto.items) {
        const product = await em.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Logistics item with ID ${item.productId} not found`);
        
        const quantityIssued = item.quantityIssued || item.quantitySold;
        
        // Update product quantity
        product.quantity -= Number(quantityIssued);
        await em.save(product);
        
        // Create issue record
        const sale = em.create(Sale, {
          productId: item.productId,
          quantityIssued: Number(quantityIssued),
          priceUsed: item.priceUsed,
          issuedTo: issuedTo,
          department: dto.department,
          securitySite: dto.securitySite,
          issuedBy: dto.issuedBy,
          approvedBy: dto.approvedBy,
          purpose: dto.purpose,
          issueDate: issueDateObj,
          notes: dto.notes,
        });
        const savedSale = await em.save(sale);
        savedSales.push(savedSale);
        
        // Create stock movement
        const movementNotes = [
          `Bulk Items Issued #${savedSale.id}`,
          issuedTo ? `to ${issuedTo}` : '',
          dto.department ? `(${dto.department})` : '',
        ].filter(Boolean).join(' ');
        
        const movement = em.create(StockMovement, {
          productId: item.productId,
          type: MovementType.OUT,
          quantity: quantityIssued,
          notes: movementNotes,
        });
        await em.save(movement);
      }
      
      return savedSales;
    });
  }

  async findAll(query: any) {
    const { from, to, department, securitySite, issuedTo, search, page = 1, limit = 20 } = query;
    const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
    
    // Use issueDate (new) or fallback to date
    if (from) qb.andWhere('COALESCE(s.issueDate, s.date) >= :from', { from });
    if (to) qb.andWhere('COALESCE(s.issueDate, s.date) <= :to', { to: to + ' 23:59:59' });
    if (department) qb.andWhere('s.department ILIKE :department', { department: `%${department}%` });
    if (securitySite) qb.andWhere('s.securitySite ILIKE :site', { site: `%${securitySite}%` });
    if (issuedTo) qb.andWhere('(s.issuedTo ILIKE :issuedTo OR s.customerName ILIKE :issuedTo)', { issuedTo: `%${issuedTo}%` });
    if (search) qb.andWhere('(p.name ILIKE :search OR s.issuedTo ILIKE :search OR s.customerName ILIKE :search OR s.department ILIKE :search)', { search: `%${search}%` });
    
    // Add COALESCE as a select expression, then order by it
    qb.addSelect('COALESCE(s.issueDate, s.date)', 'issue_date_order')
      .orderBy('issue_date_order', 'DESC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));
    
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  // Get issue summary (renamed from getRevenueSummary)
  async getIssueSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const [daily, weekly, monthly] = await Promise.all([
      this.saleRepo.createQueryBuilder('s')
        .select('COALESCE(SUM(COALESCE(s.quantityIssued, s.quantitySold) * s.priceUsed), 0)', 'total')
        .where('COALESCE(s.issueDate, s.date) >= :today', { today })
        .getRawOne(),
      this.saleRepo.createQueryBuilder('s')
        .select('COALESCE(SUM(COALESCE(s.quantityIssued, s.quantitySold) * s.priceUsed), 0)', 'total')
        .where('COALESCE(s.issueDate, s.date) >= :startOfWeek', { startOfWeek })
        .getRawOne(),
      this.saleRepo.createQueryBuilder('s')
        .select('COALESCE(SUM(COALESCE(s.quantityIssued, s.quantitySold) * s.priceUsed), 0)', 'total')
        .where('COALESCE(s.issueDate, s.date) >= :startOfMonth', { startOfMonth })
        .getRawOne(),
    ]);

    return {
      dailyIssueValue: Number(daily.total),
      weeklyIssueValue: Number(weekly.total),
      monthlyIssueValue: Number(monthly.total),
    };
  }
  
  // Backward compatibility alias
  async getRevenueSummary() {
    return this.getIssueSummary();
  }

  async getSalesForReport(query: any) {
    const { from, to, department, securitySite } = query;
    const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
    if (from) qb.andWhere('COALESCE(s.issueDate, s.date) >= :from', { from });
    if (to) qb.andWhere('COALESCE(s.issueDate, s.date) <= :to', { to: to + ' 23:59:59' });
    if (department) qb.andWhere('s.department ILIKE :department', { department: `%${department}%` });
    if (securitySite) qb.andWhere('s.securitySite ILIKE :site', { site: `%${securitySite}%` });
    qb.addSelect('COALESCE(s.issueDate, s.date)', 'issue_date_order')
      .orderBy('issue_date_order', 'DESC');
    return qb.getMany();
  }
  
  // Get issue summary by department
  async getIssueByDepartment(limit = 10) {
    return this.saleRepo
      .createQueryBuilder('s')
      .select([
        's.department',
        'COUNT(s.id) as issueCount',
        'COALESCE(SUM(COALESCE(s.quantityIssued, s.quantitySold)), 0) as totalQuantity',
        'COALESCE(SUM(s.totalValue), 0) as totalValue'
      ])
      .where('s.department IS NOT NULL')
      .groupBy('s.department')
      .orderBy('totalValue', 'DESC')
      .limit(limit)
      .getRawMany();
  }
  
  // Get issue summary by security site
  async getIssueBySite(limit = 10) {
    return this.saleRepo
      .createQueryBuilder('s')
      .select([
        's.securitySite',
        'COUNT(s.id) as issueCount',
        'COALESCE(SUM(COALESCE(s.quantityIssued, s.quantitySold)), 0) as totalQuantity',
        'COALESCE(SUM(s.totalValue), 0) as totalValue'
      ])
      .where('s.securitySite IS NOT NULL')
      .groupBy('s.securitySite')
      .orderBy('totalValue', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
