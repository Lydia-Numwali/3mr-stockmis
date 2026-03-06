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
exports.ProductsService = exports.CreateProductDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const product_entity_2 = require("../entities/product.entity");
class CreateProductDto {
    name;
    category;
    brand;
    model;
    partType;
    wholesalePrice;
    retailPrice;
    costPrice;
    quantity;
    lowStockThreshold;
    supplier;
    storageLocation;
    notes;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(product_entity_2.ProductCategory),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "partType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "wholesalePrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "retailPrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "quantity", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "supplier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "storageLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "notes", void 0);
let ProductsService = class ProductsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(query) {
        const { search, category, brand, model, supplier, lowStock, recentlyAdded, page = 1, limit = 20 } = query;
        const qb = this.repo.createQueryBuilder('p');
        if (search)
            qb.andWhere('(p.name ILIKE :s OR p.partType ILIKE :s)', { s: `%${search}%` });
        if (category)
            qb.andWhere('p.category = :category', { category });
        if (brand)
            qb.andWhere('p.brand ILIKE :brand', { brand: `%${brand}%` });
        if (model)
            qb.andWhere('p.model ILIKE :model', { model: `%${model}%` });
        if (supplier)
            qb.andWhere('p.supplier ILIKE :supplier', { supplier: `%${supplier}%` });
        if (lowStock === 'true')
            qb.andWhere('p.quantity <= p.lowStockThreshold');
        if (recentlyAdded === 'true')
            qb.orderBy('p.dateRecorded', 'DESC');
        else
            qb.orderBy('p.id', 'DESC');
        const skip = (Number(page) - 1) * Number(limit);
        qb.skip(skip).take(Number(limit));
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page: Number(page), limit: Number(limit) };
    }
    async findOne(id) {
        const p = await this.repo.findOne({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Product not found');
        return p;
    }
    async create(dto) {
        const p = this.repo.create(dto);
        return this.repo.save(p);
    }
    async update(id, dto) {
        const p = await this.findOne(id);
        Object.assign(p, dto);
        return this.repo.save(p);
    }
    async remove(id) {
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map