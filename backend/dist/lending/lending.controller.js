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
exports.LendingController = void 0;
const common_1 = require("@nestjs/common");
const lending_service_1 = require("./lending.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LendingController = class LendingController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    returnLending(id, dto) {
        return this.service.returnLending(+id, dto);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    getOverdue() {
        return this.service.getOverdue();
    }
};
exports.LendingController = LendingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lending_service_1.CreateLendingDto]),
    __metadata("design:returntype", void 0)
], LendingController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, lending_service_1.ReturnLendingDto]),
    __metadata("design:returntype", void 0)
], LendingController.prototype, "returnLending", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LendingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LendingController.prototype, "getOverdue", null);
exports.LendingController = LendingController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lending'),
    __metadata("design:paramtypes", [lending_service_1.LendingService])
], LendingController);
//# sourceMappingURL=lending.controller.js.map