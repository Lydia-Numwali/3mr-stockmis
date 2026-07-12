import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Lending, ReturnReason, ItemCondition, ReturnStatus } from '../entities/lending.entity';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { StockMovement, MovementType } from '../entities/stock-movement.entity';
import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for processing returned items
export class CreateLendingDto {
  @Type(() => Number) @IsNumber() productId: number;
  @Type(() => Number) @IsNumber() @Min(1) quantityReturned: number;  // Renamed from quantityLent
  @IsOptional() @IsString() returnReference?: string;  // NEW: tracking number
  @IsString() returnedBy: string;  // Renamed from borrowerShop - employee returning
  @IsOptional() @IsString() department?: string;  // NEW
  @IsOptional() @IsString() securitySite?: string;  // NEW
  @IsOptional() @IsString() contactInfo?: string;  // Renamed from borrowerContact
  @IsOptional() @IsString() originalIssueReference?: string;  // NEW: link to original issue
  @IsEnum(ReturnReason) returnReason: ReturnReason;  // NEW: why returned
  @IsEnum(ItemCondition) @IsOptional() itemCondition?: ItemCondition;  // NEW: item condition
  @IsOptional() @IsString() returnDate?: string;  // Renamed from dateLent
  @IsOptional() @IsString() receivedBy?: string;  // NEW: staff who received return
  @IsOptional() @IsString() returnDocument?: string;  // NEW: path to uploaded document
  @IsOptional() @IsString() notes?: string;
  
  // Backward compatibility
  @Type(() => Number) @IsNumber() @Min(1) @IsOptional() quantityLent?: number;
  @IsOptional() @IsString() borrowerShop?: string;
  @IsOptional() @IsString() borrowerContact?: string;
  @IsOptional() @IsString() dateLent?: string;
}

// DTO for inspecting returned items
export class InspectReturnDto {
  @IsEnum(ItemCondition) itemCondition: ItemCondition;
  @IsOptional() @IsString() inspectedBy?: string;
  @IsOptional() @IsString() inspectionDate?: string;
  @IsOptional() @IsString() notes?: string;
}

// DTO for issuing replacement
export class IssueReplacementDto {
  @IsOptional() @IsString() issuedBy?: string;
  @IsOptional() @IsString() approvedBy?: string;
  @IsOptional() @IsString() notes?: string;
}

// Keep old DTO for backward compatibility
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
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  // Process returned items
  async create(dto: CreateLendingDto) {
    return this.dataSource.transaction(async (em) => {
      const product = await em.findOne(Product, { where: { id: dto.productId } });
      if (!product) throw new BadRequestException('Logistics item not found');
      
      // Map old field names for backward compatibility
      const quantityReturned = dto.quantityReturned || dto.quantityLent;
      const returnedBy = dto.returnedBy || dto.borrowerShop;
      const contactInfo = dto.contactInfo || dto.borrowerContact;
      const returnDate = dto.returnDate || dto.dateLent;
      
      if (!quantityReturned) throw new BadRequestException('Quantity returned is required');
      if (!returnedBy) throw new BadRequestException('Returned by (employee name) is required');
      
      // Determine initial condition
      const itemCondition = dto.itemCondition || ItemCondition.PENDING_INSPECTION;
      
      // Create return record
      const lending = em.create(Lending, { 
        productId: dto.productId,
        quantityReturned: Number(quantityReturned),
        returnReference: dto.returnReference,
        returnedBy: returnedBy,
        department: dto.department,
        securitySite: dto.securitySite,
        contactInfo: contactInfo,
        originalIssueReference: dto.originalIssueReference,
        returnReason: dto.returnReason,
        itemCondition: itemCondition,
        returnDate: returnDate ? new Date(returnDate) as any : new Date() as any,
        receivedBy: dto.receivedBy,
        returnDocument: dto.returnDocument,
        status: ReturnStatus.RECEIVED,
        notes: dto.notes,
        // Keep old fields for compatibility
        quantityLent: Number(quantityReturned),
        borrowerShop: returnedBy,
        borrowerContact: contactInfo,
        dateLent: returnDate ? new Date(returnDate) as any : new Date() as any,
      });
      const saved = await em.save(lending);
      
      // Update inventory based on item condition (only if condition is Good)
      if (itemCondition === ItemCondition.GOOD) {
        product.quantity += Number(quantityReturned);
        await em.save(product);
        
        // Update status to restocked
        saved.status = ReturnStatus.RESTOCKED;
        await em.save(saved);
        
        // Create stock movement for restock
        await em.save(em.create(StockMovement, {
          productId: dto.productId,
          type: MovementType.RETURN,
          quantity: quantityReturned,
          notes: `Return #${saved.id} - ${returnedBy} (Good condition - restocked)`,
        }));
      } else {
        // Create stock movement for tracking (not restocked yet)
        await em.save(em.create(StockMovement, {
          productId: dto.productId,
          type: MovementType.RETURN,
          quantity: quantityReturned,
          notes: `Return #${saved.id} - ${returnedBy} (${itemCondition} - pending action)`,
        }));
      }
      
      return saved;
    });
  }

  // Inspect returned item and update condition
  async inspectReturn(id: number, dto: InspectReturnDto) {
    return this.dataSource.transaction(async (em) => {
      const returnRecord = await em.findOne(Lending, { where: { id }, relations: ['product'] });
      if (!returnRecord) throw new NotFoundException('Return record not found');
      
      const oldCondition = returnRecord.itemCondition;
      returnRecord.itemCondition = dto.itemCondition;
      if (dto.inspectedBy) returnRecord.inspectedBy = dto.inspectedBy;
      returnRecord.inspectionDate = dto.inspectionDate ? new Date(dto.inspectionDate) as any : new Date() as any;
      returnRecord.status = ReturnStatus.INSPECTED;
      if (dto.notes) returnRecord.notes = (returnRecord.notes || '') + '\n' + dto.notes;
      
      // If condition changed to Good after inspection, restock the item
      if (dto.itemCondition === ItemCondition.GOOD && oldCondition !== ItemCondition.GOOD) {
        const product = await em.findOne(Product, { where: { id: returnRecord.productId } });
        if (!product) throw new NotFoundException('Product not found');
        
        product.quantity += returnRecord.quantityReturned;
        await em.save(product);
        
        returnRecord.status = ReturnStatus.RESTOCKED;
        
        // Create stock movement
        await em.save(em.create(StockMovement, {
          productId: returnRecord.productId,
          type: MovementType.RETURN,
          quantity: returnRecord.quantityReturned,
          notes: `Return #${id} inspected - Good condition - restocked`,
        }));
      } else if (dto.itemCondition === ItemCondition.NEEDS_REPAIR) {
        returnRecord.status = ReturnStatus.SENT_FOR_REPAIR;
      }
      
      await em.save(returnRecord);
      return returnRecord;
    });
  }

  // Issue replacement for returned item
  async issueReplacement(id: number, dto: IssueReplacementDto) {
    return this.dataSource.transaction(async (em) => {
      const returnRecord = await em.findOne(Lending, { where: { id }, relations: ['product'] });
      if (!returnRecord) throw new NotFoundException('Return record not found');
      
      if (returnRecord.replacementIssued) {
        throw new BadRequestException('Replacement already issued for this return');
      }
      
      const product = await em.findOne(Product, { where: { id: returnRecord.productId } });
      if (!product) throw new NotFoundException('Product not found');
      
      // Check if enough stock for replacement
      if (product.quantity < returnRecord.quantityReturned) {
        throw new BadRequestException(`Insufficient stock for replacement. Available: ${product.quantity}, Needed: ${returnRecord.quantityReturned}`);
      }
      
      // Issue replacement (create a sale/issue record)
      const replacement = em.create(Sale, {
        productId: returnRecord.productId,
        quantityIssued: returnRecord.quantityReturned,
        priceUsed: product.issueValue || product.standardUnitCost || 0,
        issuedTo: returnRecord.returnedBy,
        department: returnRecord.department,
        securitySite: returnRecord.securitySite,
        issuedBy: dto.issuedBy,
        approvedBy: dto.approvedBy,
        purpose: `Replacement for return #${id} - ${returnRecord.returnReason}`,
        issueDate: new Date(),
        notes: dto.notes || `Replacement for returned item (${returnRecord.itemCondition})`,
      });
      const savedReplacement = await em.save(replacement);
      
      // Update product quantity
      product.quantity -= returnRecord.quantityReturned;
      await em.save(product);
      
      // Update return record
      returnRecord.replacementIssueId = savedReplacement.id;
      returnRecord.replacementIssued = true;
      returnRecord.status = ReturnStatus.REPLACED;
      await em.save(returnRecord);
      
      // Create stock movement
      await em.save(em.create(StockMovement, {
        productId: returnRecord.productId,
        type: MovementType.OUT,
        quantity: returnRecord.quantityReturned,
        notes: `Replacement issued for return #${id}`,
      }));
      
      return { returnRecord, replacement: savedReplacement };
    });
  }

  // Backward compatibility: Old lending workflow (lend items out)
  async returnLending(id: number, dto: ReturnLendingDto) {
    return this.dataSource.transaction(async (em) => {
      const lending = await em.findOne(Lending, { where: { id } });
      if (!lending) throw new NotFoundException('Lending/Return record not found');
      
      // If it's an old lending record, process as before
      if (lending.quantityLent > 0) {
        const remaining = lending.quantityLent - (lending.quantityReturned || 0);
        if (dto.quantityReturned > remaining)
          throw new BadRequestException(`Can only return up to ${remaining}`);
        
        lending.quantityReturned = (lending.quantityReturned || 0) + Number(dto.quantityReturned);
        if (dto.returnDate) lending.returnDate = new Date(dto.returnDate) as any;
        
        // Update product quantity
        const product = await em.findOne(Product, { where: { id: lending.productId } });
        if (!product) throw new NotFoundException('Product not found');
        product.quantity += Number(dto.quantityReturned);
        await em.save(product);
        
        await em.save(lending);
        
        await em.save(em.create(StockMovement, {
          productId: lending.productId,
          type: MovementType.RETURN,
          quantity: dto.quantityReturned,
          notes: `Return from Lend #${id}`,
        }));
      }
      
      return lending;
    });
  }

  async findAll(query: any) {
    const { status, returnReason, itemCondition, department, securitySite, page = 1, limit = 20 } = query;
    const qb = this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p');
    
    if (status) qb.andWhere('l.status = :status', { status });
    if (returnReason) qb.andWhere('l.returnReason = :reason', { reason: returnReason });
    if (itemCondition) qb.andWhere('l.itemCondition = :condition', { condition: itemCondition });
    if (department) qb.andWhere('l.department ILIKE :department', { department: `%${department}%` });
    if (securitySite) qb.andWhere('l.securitySite ILIKE :site', { site: `%${securitySite}%` });
    
    qb.orderBy('l.returnDate', 'DESC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit));
    
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page: Number(page), limit: Number(limit) };
  }

  // Get returns pending inspection
  async getPendingInspection() {
    return this.lendRepo.find({
      where: { itemCondition: ItemCondition.PENDING_INSPECTION },
      relations: ['product'],
      order: { returnDate: 'DESC' },
    });
  }

  // Get items under repair
  async getUnderRepair() {
    return this.lendRepo.find({
      where: [
        { itemCondition: ItemCondition.NEEDS_REPAIR },
        { status: ReturnStatus.SENT_FOR_REPAIR },
      ],
      relations: ['product'],
      order: { returnDate: 'DESC' },
    });
  }

  // Get damaged items
  async getDamagedItems() {
    return this.lendRepo.find({
      where: [
        { itemCondition: ItemCondition.DAMAGED },
        { itemCondition: ItemCondition.DEFECTIVE },
        { itemCondition: ItemCondition.BEYOND_REPAIR },
      ],
      relations: ['product'],
      order: { returnDate: 'DESC' },
    });
  }

  // Backward compatibility
  async getOverdue() {
    return this.lendRepo.find({
      where: { itemCondition: ItemCondition.PENDING_INSPECTION },
      relations: ['product'],
    });
  }

  async getAllForReport() {
    return this.lendRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.product', 'p')
      .orderBy('l.returnDate', 'DESC')
      .getMany();
  }
  
  // Get return summary
  async getReturnSummary() {
    const result = await this.lendRepo
      .createQueryBuilder('l')
      .select([
        'COUNT(l.id) as totalReturns',
        'COALESCE(SUM(l.quantityReturned), 0) as totalQuantityReturned',
        'COUNT(CASE WHEN l.replacementIssued = true THEN 1 END) as replacementsIssued',
      ])
      .getRawOne();
    
    return {
      totalReturns: Number(result.totalReturns),
      totalQuantityReturned: Number(result.totalQuantityReturned),
      replacementsIssued: Number(result.replacementsIssued),
    };
  }
}
