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
exports.Lending = exports.LendingStatus = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
var LendingStatus;
(function (LendingStatus) {
    LendingStatus["PENDING"] = "PENDING";
    LendingStatus["PARTIALLY_RETURNED"] = "PARTIALLY_RETURNED";
    LendingStatus["RETURNED"] = "RETURNED";
    LendingStatus["OVERDUE"] = "OVERDUE";
})(LendingStatus || (exports.LendingStatus = LendingStatus = {}));
let Lending = class Lending {
    id;
    product;
    productId;
    quantityLent;
    quantityReturned;
    borrowerShop;
    borrowerContact;
    dateLent;
    expectedReturnDate;
    returnDate;
    status;
    notes;
    createdAt;
};
exports.Lending = Lending;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lending.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (p) => p.lendings, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], Lending.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Lending.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Lending.prototype, "quantityLent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Lending.prototype, "quantityReturned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Lending.prototype, "borrowerShop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lending.prototype, "borrowerContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Lending.prototype, "dateLent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Lending.prototype, "expectedReturnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Lending.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LendingStatus, default: LendingStatus.PENDING }),
    __metadata("design:type", String)
], Lending.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Lending.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Lending.prototype, "createdAt", void 0);
exports.Lending = Lending = __decorate([
    (0, typeorm_1.Entity)('lendings')
], Lending);
//# sourceMappingURL=lending.entity.js.map