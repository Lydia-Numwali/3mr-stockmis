"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lending_entity_1 = require("../entities/lending.entity");
const product_entity_1 = require("../entities/product.entity");
const stock_movement_entity_1 = require("../entities/stock-movement.entity");
const lending_service_1 = require("./lending.service");
const lending_controller_1 = require("./lending.controller");
let LendingModule = class LendingModule {
};
exports.LendingModule = LendingModule;
exports.LendingModule = LendingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([lending_entity_1.Lending, product_entity_1.Product, stock_movement_entity_1.StockMovement])],
        controllers: [lending_controller_1.LendingController],
        providers: [lending_service_1.LendingService],
        exports: [lending_service_1.LendingService],
    })
], LendingModule);
//# sourceMappingURL=lending.module.js.map