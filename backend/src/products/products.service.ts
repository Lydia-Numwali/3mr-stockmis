import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Product } from '../entities/product.entity';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory, PackagingUnit } from '../entities/product.entity';

export class CreateProductDto {
  @IsString() name: string;
  @IsEnum(ProductCategory) category: ProductCategory;
  @IsEnum(PackagingUnit) @IsOptional() packagingUnit?: PackagingUnit;
  @Type(() => Number) @IsNumber() @IsOptional() unitsPerPackage?: number;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsString() partType?: string;
  @Type(() => Number) @IsNumber() wholesalePrice: number;
  @Type(() => Number) @IsNumber() retailPrice: number;
  @Type(() => Number) @IsNumber() costPrice: number;
  @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) @IsOptional() lowStockThreshold?: number;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsString() storageLocation?: string;
  @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async findAll(query: any) {
    const { search, category, brand, model, supplier, lowStock, recentlyAdded, page = 1, limit = 20 } = query;
    const qb = this.repo.createQueryBuilder('p');

    if (search) qb.andWhere('(p.name ILIKE :s OR p.partType ILIKE :s)', { s: `%${search}%` });
    if (category) qb.andWhere('p.category = :category', { category });
    if (brand) qb.andWhere('p.brand ILIKE :brand', { brand: `%${brand}%` });
    if (model) qb.andWhere('p.model ILIKE :model', { model: `%${model}%` });
    if (supplier) qb.andWhere('p.supplier ILIKE :supplier', { supplier: `%${supplier}%` });
    if (lowStock === 'true') qb.andWhere('p.quantity <= p.lowStockThreshold');
    if (recentlyAdded === 'true') qb.orderBy('p.dateRecorded', 'DESC');
    else qb.orderBy('p.id', 'DESC');

    const skip = (Number(page) - 1) * Number(limit);
    qb.skip(skip).take(Number(limit));

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(dto: CreateProductDto) {
    const p = this.repo.create(dto);
    return this.repo.save(p);
  }

  async update(id: number, dto: Partial<CreateProductDto>) {
    const p = await this.findOne(id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(id: number) {
    const p = await this.findOne(id);
    return this.repo.remove(p);
  }

  async getBestSelling(limit = 10) {
    return this.repo
      .createQueryBuilder('p')
      .leftJoin('p.sales', 's')
      .select(['p.id', 'p.name', 'p.category', 'COALESCE(SUM(s.quantitySold), 0) as totalSold'])
      .groupBy('p.id')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
