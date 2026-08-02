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
  // Option 1: Create new item with details
  @IsOptional() @IsString() itemName?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsString() itemType?: string;
  
  // Option 2: Add to existing item (by productId)
  @IsOptional() @Type(() => Number) @IsNumber() productId?: number;
  
  // Common fields for both new and existing items
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1) quantityReceived?: number;  // Made optional
  @IsOptional() @Type(() => Number) @IsNumber() pricePerUnit?: number;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() deliveryReference?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() warehouse?: string;  // Backward compatibility
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() custodian?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() receivedBy?: string;
  @IsOptional() @IsString() receivingDate?: string;
  @IsOptional() @IsString() notes?: string;
  
  // Backward compatibility
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
      try {
        const quantityReceived = dto.quantityReceived || dto.quantityPurchased;
        const receivingDate = dto.receivingDate || dto.purchaseDate;
        const location = dto.location || dto.warehouse;
        
        if (!quantityReceived) {
          throw new BadRequestException('Quantity received is required');
        }
        
        let product: Product | null = null;
        
        // If productId is provided, we're receiving more of an existing item type
        if (dto.productId) {
          product = await em.findOne(Product, { where: { id: dto.productId } });
          if (!product) throw new BadRequestException('Logistics item not found');
        } 
        // If itemName is provided, create new item type (or find existing by name)
        else if (dto.itemName) {
          // Check if an item with this name already exists
          product = await em.findOne(Product, { where: { name: dto.itemName } });
          
          if (!product) {
            // Create new item type (master record)
            product = em.create(Product, {
              name: dto.itemName,
              category: dto.category || 'Miscellaneous Assets',
              brand: dto.brand,
              model: dto.model,
              itemType: dto.itemType,
              quantity: 0, // Will be incremented below
              lowStockThreshold: 5,
              supplier: dto.supplier,
              location,
            });
            product = await em.save(product);
          }
        } else {
          throw new BadRequestException('Either productId or itemName is required');
        }
        
        // At this point, product is guaranteed to be non-null
        if (!product) {
          throw new BadRequestException('Failed to create or find product');
        }
        
        const savedPurchases = [];
        
        // Create individual item records for each received item
        for (let i = 0; i < quantityReceived; i++) {
          // Generate unique Asset ID for each individual item
          const assetId = await this.generateAssetId(product.name, em);
          
          // Create individual product record
          const individualItem = em.create(Product, {
            name: product.name,
            assetId,
            category: product.category,
            brand: dto.brand || product.brand,
            model: dto.model || product.model,
            itemType: dto.itemType || product.itemType,
            serialNumber: dto.serialNumber,
            costPrice: dto.pricePerUnit,
            quantity: 1, // Each record represents 1 physical item
            lowStockThreshold: 1,
            supplier: dto.supplier || product.supplier,
            location,
            custodian: dto.custodian,
            condition: dto.condition || 'Good',
          });
          const savedItem = await em.save(individualItem);
          
          // Create purchase/receiving record
          const purchase = em.create(Purchase, {
            productId: savedItem.id,
            quantityReceived: 1,
            pricePerUnit: dto.pricePerUnit,
            supplier: dto.supplier,
            deliveryReference: dto.deliveryReference,
            location,
            assetId,
            serialNumber: dto.serialNumber,
            custodian: dto.custodian,
            condition: dto.condition || 'Good',
            receivedBy: dto.receivedBy,
            receivingDate: receivingDate ? new Date(receivingDate) : new Date(),
            notes: dto.notes,
          });
          const savedPurchase = await em.save(purchase);
          savedPurchases.push(savedPurchase);
          
          // Create stock movement record
          const movement = em.create(StockMovement, {
            productId: savedItem.id,
            type: MovementType.IN,
            quantity: 1,
            purchasePrice: dto.pricePerUnit,
            supplier: dto.supplier,
            notes: `Items Received #${savedPurchase.id}${dto.deliveryReference ? ` - Ref: ${dto.deliveryReference}` : ''}`,
          });
          await em.save(movement);
        }
        
        return savedPurchases;
      } catch (error) {
        // Log the error for debugging
        console.error('Error creating purchase:', error);
        throw error;
      }
    });
  }

  // Generate Asset ID for individual items
  private async generateAssetId(name: string, em: any): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = 'CAL';
    
    // Get first 2-3 letters from item name (remove spaces and special chars)
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const nameCode = cleanName.substring(0, Math.min(3, cleanName.length)).padEnd(2, 'X');
    
    // Count existing items with similar name code to generate sequential number
    const namePattern = `${prefix}-${nameCode}-%`;
    
    // Use the entity manager's repository to query
    const productRepo = em.getRepository(Product);
    const existingCount = await productRepo
      .createQueryBuilder('p')
      .where('p.assetId LIKE :pattern', { pattern: namePattern })
      .getCount();
    
    const sequentialNumber = (existingCount + 1).toString().padStart(3, '0');
    
    return `${prefix}-${nameCode}-${sequentialNumber}-${year}`;
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
}