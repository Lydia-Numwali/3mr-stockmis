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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = exports.CustomerType = exports.SaleType = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
var SaleType;
(function (SaleType) {
    SaleType["RETAIL"] = "RETAIL";
    SaleType["WHOLESALE"] = "WHOLESALE";
})(SaleType || (exports.SaleType = SaleType = {}));
var CustomerType;
(function (CustomerType) {
    CustomerType["INDIVIDUAL"] = "INDIVIDUAL";
    CustomerType["SHOP_OWNER"] = "SHOP_OWNER";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
let Sale = class Sale {
    id;
    product;
    productId;
    quantitySold;
    saleType;
    priceUsed;
    customerType;
    notes;
    totalValue;
    date;
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (p) => p.sales, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], Sale.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sale.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sale.prototype, "quantitySold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: SaleType }),
    __metadata("design:type", String)
], Sale.prototype, "saleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "priceUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CustomerType, nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "customerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '"quantitySold" * "priceUsed"', nullable: true }),
    __metadata("design:type", Number)
], Sale.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sale.prototype, "date", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)('sales')
], Sale);
//# sourceMappingURL=sale.entity.js.map