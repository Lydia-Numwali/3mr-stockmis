import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { Product } from '../entities/product.entity';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddStockDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantity: number;
  @Type(() => Number) @IsNumber() @IsOptional() purchasePrice?: number;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async addStock(dto: AddStockDto) {
    return this.dataSource.transaction(async (em) => {
      const product = await em.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Product not found');
      product.quantity += Number(dto.quantity);
      if (dto.purchasePrice) product.costPrice = Number(dto.purchasePrice);
      if (dto.supplier) product.supplier = dto.supplier;
      await em.save(product);
      const movement = em.create(StockMovement, {
        productId: dto.productId,
        type: MovementType.IN,
        quantity: dto.quantity,
        purchasePrice: dto.purchasePrice,
        supplier: dto.supplier,
        notes: dto.notes,
      });
      return em.save(movement);
    });
  }

  async getMovements(query: any) {
    const { productId, type, page = 1, limit = 20 } = query;
    const qb = this.movRepo.createQueryBuilder('m').leftJoinAndSelect('m.product', 'p');
    if (productId) qb.andWhere('m.productId = :productId', { productId });
    if (type) qb.andWhere('m.type = :type', { type });
    qb.orderBy('m.date', 'DESC').skip((page - 1) * limit).take(Number(limit));
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }
}
