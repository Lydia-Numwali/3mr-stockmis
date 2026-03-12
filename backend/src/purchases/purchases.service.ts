import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { Product } from '../entities/product.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityPurchased: number;
  @Type(() => Number) @IsNumber() @Min(0.01) pricePerUnit: number;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() purchaseDate?: string;
  @IsOptional() @IsString() notes?: string;
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
      if (!product) throw new BadRequestException('Product not found');
      
      // Update product quantity and cost price
      product.quantity += Number(dto.quantityPurchased);
      product.costPrice = Number(dto.pricePerUnit);
      if (dto.supplier) product.supplier = dto.supplier;
      await em.save(product);
      
      const purchase = em.create(Purchase, {
        ...dto,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : new Date(),
      });
      const savedPurchase = await em.save(purchase);
      
      // Create stock movement
      const movement = em.create(StockMovement, {
        productId: dto.productId,
        type: MovementType.IN,
        quantity: dto.quantityPurchased,
        purchasePrice: dto.pricePerUnit,
        supplier: dto.supplier,
        notes: `Purchase #${savedPurchase.id}`,
      });
      await em.save(movement);
      
      return savedPurchase;
    });
  }

  async findAll(query: any) {
    const { from, to, supplier, page = 1, limit = 20 } = query;
    const qb = this.purchaseRepo.createQueryBuilder('p').leftJoinAndSelect('p.product', 'prod');
    if (from) qb.andWhere('p.purchaseDate >= :from', { from });
    if (to) qb.andWhere('p.purchaseDate <= :to', { to: to + ' 23:59:59' });
    if (supplier) qb.andWhere('p.supplier ILIKE :supplier', { supplier: `%${supplier}%` });
    qb.orderBy('p.purchaseDate', 'DESC').skip((Number(page) - 1) * Number(limit)).take(Number(limit));
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async getTotalPurchases() {
    const result = await this.purchaseRepo.createQueryBuilder('p')
      .select('COALESCE(SUM(p.totalValue), 0)', 'total')
      .getRawOne();
    return Number(result.total);
  }
}