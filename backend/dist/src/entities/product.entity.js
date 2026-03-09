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
exports.Product = exports.PackagingUnit = exports.ProductCategory = void 0;
const typeorm_1 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const stock_movement_entity_1 = require("./stock-movement.entity");
const lending_entity_1 = require("./lending.entity");
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["ENGINE_PARTS"] = "Engine Parts";
    ProductCategory["BRAKE_SYSTEM"] = "Brake System";
    ProductCategory["ELECTRICAL_PARTS"] = "Electrical Parts";
    ProductCategory["BODY_PARTS"] = "Body Parts";
    ProductCategory["SUSPENSION"] = "Suspension";
    ProductCategory["TIRES_WHEELS"] = "Tires & Wheels";
    ProductCategory["OTHER"] = "Other";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var PackagingUnit;
(function (PackagingUnit) {
    PackagingUnit["PIECES"] = "Pieces";
    PackagingUnit["CARTON"] = "Carton";
    PackagingUnit["LITRE"] = "Litre";
    PackagingUnit["KILOGRAM"] = "Kilogram";
    PackagingUnit["BOX"] = "Box";
    PackagingUnit["PACK"] = "Pack";
    PackagingUnit["BOTTLE"] = "Bottle";
    PackagingUnit["CAN"] = "Can";
    PackagingUnit["GALLON"] = "Gallon";
    PackagingUnit["METER"] = "Meter";
    PackagingUnit["SET"] = "Set";
    PackagingUnit["PAIR"] = "Pair";
})(PackagingUnit || (exports.PackagingUnit = PackagingUnit = {}));
let Product = class Product {
    id;
    name;
    category;
    packagingUnit;
    unitsPerPackage;
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
    dateRecorded;
    updatedAt;
    sales;
    movements;
    lendings;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ProductCategory, default: ProductCategory.OTHER }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PackagingUnit, default: PackagingUnit.PIECES }),
    __metadata("design:type", String)
], Product.prototype, "packagingUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "unitsPerPackage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "partType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "wholesalePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "retailPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 5 }),
    __metadata("design:type", Number)
], Product.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "storageLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Product.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "dateRecorded", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.product),
    __metadata("design:type", Array)
], Product.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_movement_entity_1.StockMovement, (m) => m.product),
    __metadata("design:type", Array)
], Product.prototype, "movements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lending_entity_1.Lending, (l) => l.product),
    __metadata("design:type", Array)
], Product.prototype, "lendings", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map