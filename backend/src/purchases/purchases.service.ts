import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { Product } from '../entities/product.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for recording items received
export class CreatePurchaseDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityReceived: number;  // Renamed from quantityPurchased
  @IsOptional() @Type(() => Number) @IsNumber() pricePerUnit?: number;  // Now optional - no minimum when optional
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() deliveryReference?: string;  // NEW: tracking number
  @IsOptional() @IsString() location?: string;  // Renamed from warehouse
  @IsOptional() @IsString() warehouse?: string;  // Backward compatibility
  @IsOptional() @IsString() assetId?: string;
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() custodian?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() receivedBy?: string;  // NEW: staff who received
  @IsOptional() @IsString() receivingDate?: string;  // Renamed from purchaseDate
  @IsOptional() @IsString() notes?: string;
  
  // Backward compatibility - accept old field names
  @Type(() => Number) @IsNumber() @Min(1) @IsOptional() quantityPurchased?: number;
  @IsOptional() @IsString() purchaseDate?: string;
}

export class BulkPurchaseItemDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityReceived: number;  // Renamed
  @IsOptional() @Type(() => Number) @IsNumber() pricePerUnit?: number;  // Now optional - no minimum
  
  // Backward compatibility
  @Type(() => Number) @IsNumber() @Min(1) @IsOptional() quantityPurchased?: number;
}

export class CreateBulkPurchaseDto {
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() deliveryReference?: string;  // NEW
  @IsOptional() @IsString() location?: string;  // Renamed from warehouse
  @IsOptional() @IsString() warehouse?: string;  // Backward compatibility
  @IsOptional() @IsString() receivedBy?: string;  // NEW
  @IsOptional() @IsString() receivingDate?: string;  // Renamed
  @IsOptional() @IsString() notes?: string;
  items: BulkPurchaseItemDto[];
  
  // Backward compatibility
  @IsOptional() @IsString() purchaseDate?: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreatePurchaseDto) {
    return this.dataSource.transaction(async (em) => {
      const product = await em.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Logistics item not found');
      
      // Map old field names to new for backward compatibility
      const quantityReceived = dto.quantityReceived || dto.quantityPurchased;
      const receivingDate = dto.receivingDate || dto.purchaseDate;
      const location = dto.location || dto.warehouse;
      
      if (!quantityReceived) throw new BadRequestException('Quantity received is required');
      
      // Update product quantity and cost price
      product.quantity += Number(quantityReceived);
      product.costPrice = Number(dto.pricePerUnit);
      if (dto.supplier) product.supplier = dto.supplier;
      if (location) product.location = location;
      await em.save(product);
      
      // Create purchase/receiving record
      const purchase = em.create(Purchase, {
        productId: dto.productId,
        quantityReceived: Number(quantityReceived),
        pricePerUnit: dto.pricePerUnit,
        supplier: dto.supplier,
        deliveryReference: dto.deliveryReference,
        location,
        assetId: dto.assetId,
        serialNumber: dto.serialNumber,
        custodian: dto.custodian,
        condition: dto.condition,
        receivedBy: dto.receivedBy,
        receivingDate: receivingDate ? new Date(receivingDate) : new Date(),
        notes: dto.notes,
      });
      const savedPurchase = await em.save(purchase);
      
      // Create stock movement record
      const movement = em.create(StockMovement, {
        productId: dto.productId,
        type: MovementType.IN,
        quantity: quantityReceived,
        purchasePrice: dto.pricePerUnit,
        supplier: dto.supplier,
        notes: `Items Received #${savedPurchase.id}${dto.deliveryReference ? ` - Ref: ${dto.deliveryReference}` : ''}`,
      });
      await em.save(movement);
      
      return savedPurchase;
    });
  }

  async createBulk(dto: CreateBulkPurchaseDto) {
    return this.dataSource.transaction(async (em) => {
      const savedPurchases = [];
      const receivingDate = dto.receivingDate || dto.purchaseDate;
      const receiptDate = receivingDate ? new Date(receivingDate) : new Date();
      const location = dto.location || dto.warehouse;
      
      for (const item of dto.items) {
        const product = await em.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Logistics item with ID ${item.productId} not found`);
        
        // Map old field names for backward compatibility
        const quantityReceived = item.quantityReceived || item.quantityPurchased;
        if (!quantityReceived) throw new BadRequestException(`Quantity received is required for item ${item.productId}`);
        
        // Update product quantity and cost price
        product.quantity += Number(quantityReceived);
        product.costPrice = Number(item.pricePerUnit);
        if (dto.supplier) product.supplier = dto.supplier;
        if (location) product.location = location;
        await em.save(product);
        
        // Create purchase/receiving record
        const purchase = em.create(Purchase, {
          productId: item.productId,
          quantityReceived: Number(quantityReceived),
          pricePerUnit: item.pricePerUnit,
          supplier: dto.supplier,
          deliveryReference: dto.deliveryReference,
          location,
          receivedBy: dto.receivedBy,
          receivingDate: receiptDate,
          notes: dto.notes,
        });
        const savedPurchase = await em.save(purchase);
        savedPurchases.push(savedPurchase);
        
        // Create stock movement record
        const movement = em.create(StockMovement, {
          productId: item.productId,
          type: MovementType.IN,
          quantity: quantityReceived,
          purchasePrice: item.pricePerUnit,
          supplier: dto.supplier,
          notes: `Bulk Items Received #${savedPurchase.id}${dto.deliveryReference ? ` - Ref: ${dto.deliveryReference}` : ''}`,
        });
        await em.save(movement);
      }
      
      return savedPurchases;
    });
  }

  async findAll(query: any) {
    const { from, to, supplier, location, warehouse, deliveryReference, search, page = 1, limit = 20 } = query;
    const qb = this.purchaseRepo.createQueryBuilder('p').leftJoinAndSelect('p.product', 'prod');
    
    // Use receivingDate (new) or fallback to date
    if (from) qb.andWhere('COALESCE(p.receivingDate, p.date) >= :from', { from });
    if (to) qb.andWhere('COALESCE(p.receivingDate, p.date) <= :to', { to: to + ' 23:59:59' });
    if (supplier) qb.andWhere('p.supplier ILIKE :supplier', { supplier: `%${supplier}%` });
    const locationFilter = location || warehouse;
    if (locationFilter) qb.andWhere('p.location ILIKE :location', { location: `%${locationFilter}%` });
    if (deliveryReference) qb.andWhere('p.deliveryReference ILIKE :ref', { ref: `%${deliveryReference}%` });
    if (search) qb.andWhere('(prod.name ILIKE :search OR p.supplier ILIKE :search OR p.deliveryReference ILIKE :search)', { search: `%${search}%` });
    
    // Order by receivingDate (preferred) or date (fallback) - use raw SQL for COALESCE
    qb.addSelect('COALESCE(p.receivingDate, p.date)', 'order_date')
      .orderBy('order_date', 'DESC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));
    
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async getTotalPurchases() {
    const result = await this.purchaseRepo.createQueryBuilder('p')
      .select('COALESCE(SUM(p.totalValue), 0)', 'total')
      .getRawOne();
    return Number(result.total);
  }
  
  // Get receiving summary by date range
  async getReceivingSummary(from?: string, to?: string) {
    const qb = this.purchaseRepo.createQueryBuilder('p');
    
    if (from) qb.andWhere('COALESCE(p.receivingDate, p.date) >= :from', { from });
    if (to) qb.andWhere('COALESCE(p.receivingDate, p.date) <= :to', { to: to + ' 23:59:59' });
    
    const result = await qb
      .select([
        'COUNT(p.id) as totalReceipts',
        'COALESCE(SUM(p.quantityReceived), COALESCE(SUM(p.quantityPurchased), 0)) as totalItemsReceived',
        'COALESCE(SUM(p.totalValue), 0) as totalValue'
      ])
      .getRawOne();
    
    return {
      totalReceipts: Number(result.totalReceipts),
      totalItemsReceived: Number(result.totalItemsReceived),
      totalValue: Number(result.totalValue),
    };
  }
  
  // Get receiving by supplier
  async getReceivingBySupplier(limit = 10) {
    return this.purchaseRepo
      .createQueryBuilder('p')
      .select([
        'p.supplier',
        'COUNT(p.id) as receiptCount',
        'COALESCE(SUM(p.quantityReceived), COALESCE(SUM(p.quantityPurchased), 0)) as totalQuantity',
        'COALESCE(SUM(p.totalValue), 0) as totalValue'
      ])
      .where('p.supplier IS NOT NULL')
      .groupBy('p.supplier')
      .orderBy('totalValue', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async update(id: number, dto: Partial<CreatePurchaseDto>) {
    return this.dataSource.transaction(async (em) => {
      const purchase = await em.findOne(Purchase, { 
        where: { id },
        relations: ['product']
      });
      
      if (!purchase) {
        throw new BadRequestException('Purchase record not found');
      }

      const product = purchase.product;
      const oldQuantity = purchase.quantityReceived || purchase.quantityPurchased || 0;
      const newQuantity = dto.quantityReceived || dto.quantityPurchased || oldQuantity;

      // Adjust stock if quantity changed
      if (newQuantity !== oldQuantity) {
        const quantityDiff = newQuantity - oldQuantity;
        product.quantity += quantityDiff;
        await em.save(product);
      }

      // Update purchase record
      Object.assign(purchase, {
        ...dto,
        quantityReceived: dto.quantityReceived || dto.quantityPurchased,
        receivingDate: dto.receivingDate || dto.purchaseDate,
        location: dto.location || dto.warehouse,
      });

      return em.save(purchase);
    });
  }

  async remove(id: number) {
    return this.dataSource.transaction(async (em) => {
      const purchase = await em.findOne(Purchase, {
        where: { id },
        relations: ['product']
      });

      if (!purchase) {
        throw new BadRequestException('Purchase record not found');
      }

      const product = purchase.product;
      const quantityReceived = purchase.quantityReceived || purchase.quantityPurchased || 0;

      // Reverse the stock increase
      product.quantity -= quantityReceived;
      
      // Prevent negative stock
      if (product.quantity < 0) {
        throw new BadRequestException(
          `Cannot delete: This would result in negative stock. ` +
          `Current stock: ${product.quantity + quantityReceived}, ` +
          `Attempting to remove: ${quantityReceived}`
        );
      }

      await em.save(product);
      await em.remove(purchase);

      return {
        success: true,
        message: 'Purchase record deleted and stock adjusted',
        id
      };
    });
  }
}