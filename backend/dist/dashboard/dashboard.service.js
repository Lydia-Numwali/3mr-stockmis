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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const sale_entity_1 = require("../entities/sale.entity");
const lending_entity_1 = require("../entities/lending.entity");
let DashboardService = class DashboardService {
    prodRepo;
    saleRepo;
    lendRepo;
    constructor(prodRepo, saleRepo, lendRepo) {
        this.prodRepo = prodRepo;
        this.saleRepo = saleRepo;
        this.lendRepo = lendRepo;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const [totalProducts, totalStockRow, lowStockProducts, productsLentOut, soldTodayRow, revenueTodayRow, revenueMonthRow,] = await Promise.all([
            this.prodRepo.count(),
            this.prodRepo.createQueryBuilder('p').select('COALESCE(SUM(p.quantity), 0)', 'total').getRawOne(),
            this.prodRepo.createQueryBuilder('p').where('p.quantity <= p.lowStockThreshold').getMany(),
            this.lendRepo.createQueryBuilder('l').select('COALESCE(SUM(l.quantityLent - l.quantityReturned), 0)', 'total').where('l.status IN (:...s)', { s: [lending_entity_1.LendingStatus.PENDING, lending_entity_1.LendingStatus.OVERDUE, lending_entity_1.LendingStatus.PARTIALLY_RETURNED] }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfMonth', { startOfMonth }).getRawOne(),
        ]);
        return {
            totalProducts,
            totalStock: Number(totalStockRow.total),
            lowStockCount: lowStockProducts.length,
            lowStockProducts,
            productsLentOut: Number(productsLentOut.total),
            soldToday: Number(soldTodayRow.total),
            revenueToday: Number(revenueTodayRow.total),
            revenueThisMonth: Number(revenueMonthRow.total),
        };
    }
    async getMonthlyRevenueTrend() {
        const rows = await this.saleRepo
            .createQueryBuilder('s')
            .select("DATE_TRUNC('month', s.date)", 'month')
            .addSelect('SUM(s.quantitySold * s.priceUsed)', 'revenue')
            .where("s.date >= NOW() - INTERVAL '6 months'")
            .groupBy("DATE_TRUNC('month', s.date)")
            .orderBy("DATE_TRUNC('month', s.date)", 'ASC')
            .getRawMany();
        return rows;
    }
    async getCategoryBreakdown() {
        return this.prodRepo
            .createQueryBuilder('p')
            .select('p.category', 'category')
            .addSelect('COUNT(p.id)', 'count')
            .addSelect('SUM(p.quantity)', 'totalQty')
            .groupBy('p.category')
            .getRawMany();
    }
    async getLowStockAlerts() {
        return this.prodRepo.createQueryBuilder('p').where('p.quantity <= p.lowStockThreshold').orderBy('p.quantity', 'ASC').getMany();
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(2, (0, typeorm_1.InjectRepository)(lending_entity_1.Lending)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map