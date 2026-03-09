import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lending, LendingStatus } from '../entities/lending.entity';
import { Product } from '../entities/product.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLendingDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityLent: number;
  @IsString() borrowerShop: string;
  @IsOptional() @IsString() borrowerContact?: string;
  @IsOptional() @IsString() dateLent?: string;
  @IsOptional() @IsString() expectedReturnDate?: string;
  @IsOptional() @IsString() notes?: string;
}

export class ReturnLendingDto {
  @Type(() => Number) @IsNumber() @Min(1) quantityReturned: number;
  @IsOptional() @IsString() returnDate?: string;
  @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class LendingService {
  constructor(
    @InjectRepository(Lending) private lendRepo: Repository<Lending>,
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateLendingDto) {
    return this.dataSource.transaction(async (em) => {
      const product = await em.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Product not found');
      if (product.quantity < dto.quantityLent)
        throw new BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
      product.quantity -= Number(dto.quantityLent);
      await em.save(product);
      const lending = em.create(Lending, { 
        ...dto, 
        dateLent: dto.dateLent ? new Date(dto.dateLent) as any : new Date() as any,
        expectedReturnDate: dto.expectedReturnDate ? new Date(dto.expectedReturnDate) as any : undefined,
        status: LendingStatus.PENDING 
      });
      const saved = await em.save(lending);
      await em.save(em.create(StockMovement, {
        productId: dto.productId, type: MovementType.LEND, quantity: dto.quantityLent, notes: `Lend #${saved.id} to ${dto.borrowerShop}`,
      }));
      return saved;
    });
  }

  async returnLending(id: number, dto: ReturnLendingDto) {
    return this.dataSource.transaction(async (em) => {
      const lending = await em.findOne(Lending, { where: { id } });
      if (!lending) throw new NotFoundException('Lending not found');
      const remaining = lending.quantityLent - lending.quantityReturned;
      if (dto.quantityReturned > remaining)
        throw new BadRequestException(`Can only return up to ${remaining}`);
      lending.quantityReturned += Number(dto.quantityReturned);
      if (dto.returnDate) lending.returnDate = new Date(dto.returnDate) as any;
      lending.status = lending.quantityReturned >= lending.quantityLent ? LendingStatus.RETURNED : LendingStatus.PARTIALLY_RETURNED;
      await em.save(lending);
      const product = await em.findOne(Product, { where: { id: lending.productId } });
      if (!product) throw new NotFoundException('Product not found for this lending record');
      product.quantity += Number(dto.quantityReturned);
      await em.save(product);
      await em.save(em.create(StockMovement, {
        productId: lending.productId, type: MovementType.RETURN, quantity: dto.quantityReturned, notes: `Return from Lend #${id}`,
      }));
      return lending;
    });
  }

  async findAll(query: any) {
    const { status, page = 1, limit = 20 } = query;
    // Auto-flag overdue
    await this.dataSource.createQueryBuilder()
      .update(Lending).set({ status: LendingStatus.OVERDUE })
      .where('status = :s AND expectedReturnDate < :now AND quantityReturned < quantityLent', { s: LendingStatus.PENDING, now: new Date() })
      .execute();

    const qb = this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p');
    if (status) qb.andWhere('l.status = :status', { status });
    qb.orderBy('l.createdAt', 'DESC').skip((Number(page) - 1) * Number(limit)).take(Number(limit));
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async getOverdue() {
    return this.lendRepo.find({ where: { status: LendingStatus.OVERDUE } });
  }

  async getAllForReport() {
    return this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p').orderBy('l.createdAt', 'DESC').getMany();
  }
}
