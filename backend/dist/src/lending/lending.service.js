"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingService = exports.ReturnLendingDto = exports.CreateLendingDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lending_entity_1 = require("../entities/lending.entity");
const product_entity_1 = require("../entities/product.entity");
const stock_movement_entity_1 = require("../entities/stock-movement.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateLendingDto {
    productId;
    quantityLent;
    borrowerShop;
    borrowerContact;
    dateLent;
    expectedReturnDate;
    notes;
}
exports.CreateLendingDto = CreateLendingDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLendingDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateLendingDto.prototype, "quantityLent", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLendingDto.prototype, "borrowerShop", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLendingDto.prototype, "borrowerContact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLendingDto.prototype, "dateLent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLendingDto.prototype, "expectedReturnDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLendingDto.prototype, "notes", void 0);
class ReturnLendingDto {
    quantityReturned;
    returnDate;
    notes;
}
exports.ReturnLendingDto = ReturnLendingDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReturnLendingDto.prototype, "quantityReturned", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnLendingDto.prototype, "returnDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnLendingDto.prototype, "notes", void 0);
let LendingService = class LendingService {
    lendRepo;
    prodRepo;
    movRepo;
    dataSource;
    constructor(lendRepo, prodRepo, movRepo, dataSource) {
        this.lendRepo = lendRepo;
        this.prodRepo = prodRepo;
        this.movRepo = movRepo;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (em) => {
            const product = await em.findOne(product_entity_1.Product, { where: { id: dto.productId } });
            if (!product)
                throw new common_1.BadRequestException('Product not found');
            if (product.quantity < dto.quantityLent)
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
            product.quantity -= Number(dto.quantityLent);
            await em.save(product);
            const lending = em.create(lending_entity_1.Lending, {
                ...dto,
                dateLent: dto.dateLent ? new Date(dto.dateLent) : new Date(),
                expectedReturnDate: dto.expectedReturnDate ? new Date(dto.expectedReturnDate) : undefined,
                status: lending_entity_1.LendingStatus.PENDING
            });
            const saved = await em.save(lending);
            await em.save(em.create(stock_movement_entity_1.StockMovement, {
                productId: dto.productId, type: stock_movement_entity_1.MovementType.LEND, quantity: dto.quantityLent, notes: `Lend #${saved.id} to ${dto.borrowerShop}`,
            }));
            return saved;
        });
    }
    async returnLending(id, dto) {
        return this.dataSource.transaction(async (em) => {
            const lending = await em.findOne(lending_entity_1.Lending, { where: { id } });
            if (!lending)
                throw new common_1.NotFoundException('Lending not found');
            const remaining = lending.quantityLent - lending.quantityReturned;
            if (dto.quantityReturned > remaining)
                throw new common_1.BadRequestException(`Can only return up to ${remaining}`);
            lending.quantityReturned += Number(dto.quantityReturned);
            if (dto.returnDate)
                lending.returnDate = new Date(dto.returnDate);
            lending.status = lending.quantityReturned >= lending.quantityLent ? lending_entity_1.LendingStatus.RETURNED : lending_entity_1.LendingStatus.PARTIALLY_RETURNED;
            await em.save(lending);
            const product = await em.findOne(product_entity_1.Product, { where: { id: lending.productId } });
            if (!product)
                throw new common_1.NotFoundException('Product not found for this lending record');
            product.quantity += Number(dto.quantityReturned);
            await em.save(product);
            await em.save(em.create(stock_movement_entity_1.StockMovement, {
                productId: lending.productId, type: stock_movement_entity_1.MovementType.RETURN, quantity: dto.quantityReturned, notes: `Return from Lend #${id}`,
            }));
            return lending;
        });
    }
    async findAll(query) {
        const { status, page = 1, limit = 20 } = query;
        await this.dataSource.createQueryBuilder()
            .update(lending_entity_1.Lending).set({ status: lending_entity_1.LendingStatus.OVERDUE })
            .where('status = :s AND expectedReturnDate < :now AND quantityReturned < quantityLent', { s: lending_entity_1.LendingStatus.PENDING, now: new Date() })
            .execute();
        const qb = this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p');
        if (status)
            qb.andWhere('l.status = :status', { status });
        qb.orderBy('l.createdAt', 'DESC').skip((Number(page) - 1) * Number(limit)).take(Number(limit));
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page: Number(page), limit: Number(limit) };
    }
    async getOverdue() {
        return this.lendRepo.find({ where: { status: lending_entity_1.LendingStatus.OVERDUE } });
    }
    async getAllForReport() {
        return this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p').orderBy('l.createdAt', 'DESC').getMany();
    }
};
exports.LendingService = LendingService;
exports.LendingService = LendingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lending_entity_1.Lending)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LendingService);
//# sourceMappingURL=lending.service.js.map