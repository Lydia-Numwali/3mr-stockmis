import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale, SaleType } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantitySold: number;
  @IsEnum(SaleType) saleType: SaleType;
  @Type(() => Number) @IsNumber() priceUsed: number;
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() saleDate?: string;
  @IsOptional() @IsString() notes?: string;
}

export class BulkSaleItemDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantitySold: number;
  @IsEnum(SaleType) saleType: SaleType;
  @Type(() => Number) @IsNumber() priceUsed: number;
}

export class CreateBulkSaleDto {
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() saleDate?: string;
  @IsOptional() @IsString() notes?: string;
  items: BulkSaleItemDto[];
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
      if (!product) throw new BadRequestException('Product not found');
      if (product.quantity < dto.quantitySold)
        throw new BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
      product.quantity -= Number(dto.quantitySold);
      await em.save(product);
      const sale = em.create(Sale, {
        ...dto,
        saleDate: dto.saleDate ? new Date(dto.saleDate) : new Date(),
      });
      const savedSale = await em.save(sale);
      const movement = em.create(StockMovement, {
        productId: dto.productId,
        type: MovementType.OUT,
        quantity: dto.quantitySold,
        notes: `Sale #${savedSale.id}`,
      });
      await em.save(movement);
      return savedSale;
    });
  }

  async createBulk(dto: CreateBulkSaleDto) {
    return this.dataSource.transaction(async (em) => {
      const savedSales = [];
      const saleDate = dto.saleDate ? new Date(dto.saleDate) : new Date();
      
      // First, check stock availability for all items
      for (const item of dto.items) {
        const product = await em.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Product with ID ${item.productId} not found`);
        if (product.quantity < item.quantitySold) {
          throw new BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantitySold}`);
        }
      }
      
      // If all items have sufficient stock, proceed with the sales
      for (const item of dto.items) {
        const product = await em.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Product with ID ${item.productId} not found`);
        
        // Update product quantity
        product.quantity -= Number(item.quantitySold);
        await em.save(product);
        
        // Create sale record
        const sale = em.create(Sale, {
          productId: item.productId,
          quantitySold: item.quantitySold,
          saleType: item.saleType,
          priceUsed: item.priceUsed,
          customerName: dto.customerName,
          saleDate,
          notes: dto.notes,
        });
        const savedSale = await em.save(sale);
        savedSales.push(savedSale);
        
        // Create stock movement
        const movement = em.create(StockMovement, {
          productId: item.productId,
          type: MovementType.OUT,
          quantity: item.quantitySold,
          notes: `Bulk Sale #${savedSale.id}`,
        });
        await em.save(movement);
      }
      
      return savedSales;
    });
  }

  async findAll(query: any) {
    const { from, to, saleType, customerName, search, page = 1, limit = 20 } = query;
    const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
    if (from) qb.andWhere('s.saleDate >= :from', { from });
    if (to) qb.andWhere('s.saleDate <= :to', { to: to + ' 23:59:59' });
    if (saleType) qb.andWhere('s.saleType = :saleType', { saleType });
    if (customerName) qb.andWhere('s.customerName ILIKE :customerName', { customerName: `%${customerName}%` });
    if (search) qb.andWhere('(p.name ILIKE :search OR s.customerName ILIKE :search)', { search: `%${search}%` });
    qb.orderBy('s.saleDate', 'DESC').skip((Number(page) - 1) * Number(limit)).take(Number(limit));
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async getRevenueSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const [daily, weekly, monthly] = await Promise.all([
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfWeek', { startOfWeek }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfMonth', { startOfMonth }).getRawOne(),
    ]);

    return {
      dailyRevenue: Number(daily.total),
      weeklyRevenue: Number(weekly.total),
      monthlyRevenue: Number(monthly.total),
    };
  }

  async getSalesForReport(query: any) {
    const { from, to, saleType } = query;
    const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
    if (from) qb.andWhere('s.saleDate >= :from', { from });
    if (to) qb.andWhere('s.saleDate <= :to', { to: to + ' 23:59:59' });
    if (saleType) qb.andWhere('s.saleType = :saleType', { saleType });
    qb.orderBy('s.saleDate', 'DESC');
    return qb.getMany();
  }
}
