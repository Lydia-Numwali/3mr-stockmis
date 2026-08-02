import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LogisticsItemCategory, PackagingUnit } from '../entities/product.entity';

// DTO for creating/updating logistics items
export class CreateProductDto {
  @IsOptional() @IsString() assetId?: string;
  @IsString() name: string;
  @IsOptional() @IsString() category?: string;
  @IsEnum(PackagingUnit) @IsOptional() packagingUnit?: PackagingUnit;
  @Type(() => Number) @IsNumber() @IsOptional() unitsPerPackage?: number;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() itemType?: string;  // Renamed from partType
  @Type(() => Number) @IsNumber() @IsOptional() standardUnitCost?: number;  // Renamed from wholesalePrice - now optional
  @Type(() => Number) @IsNumber() @IsOptional() issueValue?: number;  // Renamed from retailPrice - now optional
  @Type(() => Number) @IsNumber() @IsOptional() costPrice?: number;  // Now optional
  @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() lowStockThreshold?: number;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() location?: string;  // Renamed from warehouse
  @IsOptional() @IsString() custodian?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() purchaseDate?: string;
  @IsOptional() @IsString() notes?: string;
  
  // Backward compatibility - accept old field names during transition
  @IsOptional() @IsString() partType?: string;
  @Type(() => Number) @IsNumber() @IsOptional() wholesalePrice?: number;
  @Type(() => Number) @IsNumber() @IsOptional() retailPrice?: number;
  @IsOptional() @IsString() warehouse?: string;
  @IsOptional() @IsString() storageLocation?: string;
}

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  /**
   * Generate Asset ID in format: CAL-CL-001-2022
   * CAL = fixed prefix
   * CL = first 2 letters of item name (uppercase)
   * 001 = sequential number for that item type
   * 2022 = current year
   */
  private async generateAssetId(name: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = 'CAL';
    
    // Get first 2-3 letters from item name (remove spaces and special chars)
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const nameCode = cleanName.substring(0, Math.min(3, cleanName.length)).padEnd(2, 'X');
    
    // Count existing items with similar name to generate sequential number
    const namePattern = `${prefix}-${nameCode}-%`;
    const existingCount = await this.repo
      .createQueryBuilder('p')
      .where('p.assetId LIKE :pattern', { pattern: namePattern })
      .getCount();
    
    const sequentialNumber = (existingCount + 1).toString().padStart(3, '0');
    
    return `${prefix}-${nameCode}-${sequentialNumber}-${year}`;
  }

  async findAll(query: any) {
    const { search, category, brand, model, supplier, location, warehouse, lowStock, recentlyAdded, page = 1, limit = 20 } = query;
    const qb = this.repo.createQueryBuilder('p');

    // Search in name, assetId, serialNumber, and itemType
    if (search) {
      qb.andWhere(
        '(p.name ILIKE :s OR p.itemType ILIKE :s OR p.assetId ILIKE :s OR p.serialNumber ILIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (category) qb.andWhere('p.category = :category', { category });
    if (brand) qb.andWhere('p.brand ILIKE :brand', { brand: `%${brand}%` });
    if (model) qb.andWhere('p.model ILIKE :model', { model: `%${model}%` });
    if (supplier) qb.andWhere('p.supplier ILIKE :supplier', { supplier: `%${supplier}%` });
    const locationFilter = location || warehouse;
    if (locationFilter) qb.andWhere('p.location ILIKE :location', { location: `%${locationFilter}%` });
    if (lowStock === 'true') qb.andWhere('p.quantity <= p.lowStockThreshold');
    if (recentlyAdded === 'true') qb.orderBy('p.dateRecorded', 'DESC');
    else qb.orderBy('p.id', 'DESC');

    const skip = (Number(page) - 1) * Number(limit);
    qb.skip(skip).take(Number(limit));

    const [items, total] = await qb.getManyAndCount();
    
    // Enhance items with stock status
    const enhancedItems = items.map(item => ({
      ...item,
      stockStatus: item.getStockStatus(),
    }));
    
    return { items: enhancedItems, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Logistics item not found');
    return {
      ...p,
      stockStatus: p.getStockStatus(),
    };
  }

  async create(dto: CreateProductDto) {
    // Map old field names to new ones for backward compatibility
    const itemData: any = { ...dto };
    
    if (dto.partType && !dto.itemType) itemData.itemType = dto.partType;
    if (dto.wholesalePrice !== undefined && dto.standardUnitCost === undefined) itemData.standardUnitCost = dto.wholesalePrice;
    if (dto.retailPrice !== undefined && dto.issueValue === undefined) itemData.issueValue = dto.retailPrice;
    if (!dto.location) {
      itemData.location = dto.warehouse || dto.storageLocation;
    }
    if (dto.purchaseDate) itemData.purchaseDate = new Date(dto.purchaseDate);
    if (!itemData.category) itemData.category = LogisticsItemCategory.MISCELLANEOUS_ASSETS;
    
    // Generate Asset ID automatically if not provided
    if (!itemData.assetId) {
      itemData.assetId = await this.generateAssetId(dto.name);
    }
    
    const p = this.repo.create(itemData);
    return this.repo.save(p);
  }

  async update(id: number, dto: Partial<CreateProductDto>) {
    const p = await this.findOne(id);
    
    // Map old field names to new ones for backward compatibility
    const updateData: any = { ...dto };
    
    if (dto.partType && !dto.itemType) updateData.itemType = dto.partType;
    if (dto.wholesalePrice !== undefined && dto.standardUnitCost === undefined) updateData.standardUnitCost = dto.wholesalePrice;
    if (dto.retailPrice !== undefined && dto.issueValue === undefined) updateData.issueValue = dto.retailPrice;
    if (!dto.location) {
      const legacyLocation = dto.warehouse || dto.storageLocation;
      if (legacyLocation) updateData.location = legacyLocation;
    }
    if (dto.purchaseDate) updateData.purchaseDate = new Date(dto.purchaseDate);
    
    Object.assign(p, updateData);
    return this.repo.save(p);
  }

  async remove(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Logistics item not found');
    return this.repo.remove(p);
  }

  // Get most issued items (renamed from getBestSelling)
  async getMostIssued(limit = 10) {
    return this.repo
      .createQueryBuilder('p')
      .leftJoin('p.sales', 's')
      .select([
        'p.id', 
        'p.name', 
        'p.category', 
        'COALESCE(SUM(s.quantityIssued), COALESCE(SUM(s.quantitySold), 0)) as totalIssued'
      ])
      .groupBy('p.id')
      .orderBy('totalIssued', 'DESC')
      .limit(limit)
      .getRawMany();
  }
  
  // Alias for backward compatibility
  async getBestSelling(limit = 10) {
    return this.getMostIssued(limit);
  }
  
  // Get low stock items
  async getLowStockItems() {
    return this.repo
      .createQueryBuilder('p')
      .where('p.quantity <= p.lowStockThreshold')
      .andWhere('p.quantity > 0')
      .orderBy('p.quantity', 'ASC')
      .getMany();
  }
  
  // Get out of stock items
  async getOutOfStockItems() {
    return this.repo
      .createQueryBuilder('p')
      .where('p.quantity = 0')
      .orderBy('p.name', 'ASC')
      .getMany();
  }
  
  // Get items by category
  async getItemsByCategory(category: string) {
    return this.repo.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }
}
