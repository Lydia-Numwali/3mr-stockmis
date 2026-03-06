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
exports.SalesService = exports.CreateSaleDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const product_entity_1 = require("../entities/product.entity");
const stock_movement_entity_1 = require("../entities/stock-movement.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateSaleDto {
    productId;
    quantitySold;
    saleType;
    priceUsed;
    customerType;
    notes;
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "quantitySold", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(sale_entity_1.SaleType),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "saleType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "priceUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sale_entity_1.CustomerType),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "customerType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
let SalesService = class SalesService {
    saleRepo;
    prodRepo;
    movRepo;
    dataSource;
    constructor(saleRepo, prodRepo, movRepo, dataSource) {
        this.saleRepo = saleRepo;
        this.prodRepo = prodRepo;
        this.movRepo = movRepo;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (em) => {
            const product = await em.findOne(product_entity_1.Product, { where: { id: dto.productId } });
            if (!product)
                throw new common_1.BadRequestException('Product not found');
            if (product.quantity < dto.quantitySold)
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
            product.quantity -= Number(dto.quantitySold);
            await em.save(product);
            const sale = em.create(sale_entity_1.Sale, dto);
            const savedSale = await em.save(sale);
            const movement = em.create(stock_movement_entity_1.StockMovement, {
                productId: dto.productId,
                type: stock_movement_entity_1.MovementType.OUT,
                quantity: dto.quantitySold,
                notes: `Sale #${savedSale.id}`,
            });
            await em.save(movement);
            return savedSale;
        });
    }
    async findAll(query) {
        const { from, to, saleType, page = 1, limit = 20 } = query;
        const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
        if (from)
            qb.andWhere('s.date >= :from', { from });
        if (to)
            qb.andWhere('s.date <= :to', { to: to + ' 23:59:59' });
        if (saleType)
            qb.andWhere('s.saleType = :saleType', { saleType });
        qb.orderBy('s.date', 'DESC').skip((Number(page) - 1) * Number(limit)).take(Number(limit));
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
    async getSalesForReport(query) {
        const { from, to, saleType } = query;
        const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
        if (from)
            qb.andWhere('s.date >= :from', { from });
        if (to)
            qb.andWhere('s.date <= :to', { to: to + ' 23:59:59' });
        if (saleType)
            qb.andWhere('s.saleType = :saleType', { saleType });
        qb.orderBy('s.date', 'DESC');
        return qb.getMany();
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map