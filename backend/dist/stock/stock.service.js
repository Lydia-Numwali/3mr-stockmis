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
exports.StockService = exports.AddStockDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_movement_entity_1 = require("../entities/stock-movement.entity");
const product_entity_1 = require("../entities/product.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AddStockDto {
    productId;
    quantity;
    purchasePrice;
    supplier;
    notes;
}
exports.AddStockDto = AddStockDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddStockDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddStockDto.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AddStockDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddStockDto.prototype, "supplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddStockDto.prototype, "notes", void 0);
let StockService = class StockService {
    movRepo;
    prodRepo;
    dataSource;
    constructor(movRepo, prodRepo, dataSource) {
        this.movRepo = movRepo;
        this.prodRepo = prodRepo;
        this.dataSource = dataSource;
    }
    async addStock(dto) {
        return this.dataSource.transaction(async (em) => {
            const product = await em.findOne(product_entity_1.Product, { where: { id: dto.productId } });
            if (!product)
                throw new common_1.BadRequestException('Product not found');
            product.quantity += Number(dto.quantity);
            if (dto.purchasePrice)
                product.costPrice = Number(dto.purchasePrice);
            if (dto.supplier)
                product.supplier = dto.supplier;
            await em.save(product);
            const movement = em.create(stock_movement_entity_1.StockMovement, {
                productId: dto.productId,
                type: stock_movement_entity_1.MovementType.IN,
                quantity: dto.quantity,
                purchasePrice: dto.purchasePrice,
                supplier: dto.supplier,
                notes: dto.notes,
            });
            return em.save(movement);
        });
    }
    async getMovements(query) {
        const { productId, type, page = 1, limit = 20 } = query;
        const qb = this.movRepo.createQueryBuilder('m').leftJoinAndSelect('m.product', 'p');
        if (productId)
            qb.andWhere('m.productId = :productId', { productId });
        if (type)
            qb.andWhere('m.type = :type', { type });
        qb.orderBy('m.date', 'DESC').skip((page - 1) * limit).take(Number(limit));
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page: Number(page), limit: Number(limit) };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], StockService);
//# sourceMappingURL=stock.service.js.map