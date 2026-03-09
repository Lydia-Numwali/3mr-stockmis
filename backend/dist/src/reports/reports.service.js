"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const sale_entity_1 = require("../entities/sale.entity");
const lending_entity_1 = require("../entities/lending.entity");
const ExcelJS = __importStar(require("exceljs"));
let ReportsService = class ReportsService {
    prodRepo;
    saleRepo;
    lendRepo;
    constructor(prodRepo, saleRepo, lendRepo) {
        this.prodRepo = prodRepo;
        this.saleRepo = saleRepo;
        this.lendRepo = lendRepo;
    }
    async getSalesReport(query) {
        const { from, to, saleType } = query;
        const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
        if (from)
            qb.andWhere('s.date >= :from', { from });
        if (to)
            qb.andWhere('s.date <= :to', { to: to + ' 23:59:59' });
        if (saleType)
            qb.andWhere('s.saleType = :saleType', { saleType });
        const sales = await qb.orderBy('s.date', 'DESC').getMany();
        const totalRevenue = sales.reduce((acc, s) => acc + s.quantitySold * Number(s.priceUsed), 0);
        return { sales, totalRevenue };
    }
    async getStockReport() {
        const products = await this.prodRepo.find({ order: { name: 'ASC' } });
        return products;
    }
    async getLendingReport() {
        return this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p').orderBy('l.createdAt', 'DESC').getMany();
    }
    async getIncomeReport() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const [daily, weekly, monthly, topSelling] = await Promise.all([
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfWeek', { startOfWeek }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfMonth', { startOfMonth }).getRawOne(),
            this.saleRepo.createQueryBuilder('s').select('p.id', 'productId').addSelect('p.name', 'productName').addSelect('SUM(s.quantitySold)', 'totalSold').addSelect('SUM(s.quantitySold * s.priceUsed)', 'totalRevenue').leftJoin('s.product', 'p').groupBy('p.id').addGroupBy('p.name').orderBy('SUM(s.quantitySold)', 'DESC').limit(10).getRawMany(),
        ]);
        return {
            dailyIncome: Number(daily.total),
            weeklyIncome: Number(weekly.total),
            monthlyIncome: Number(monthly.total),
            topSelling,
        };
    }
    async exportSalesToExcel(query) {
        const { sales } = await this.getSalesReport(query);
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Sales Report');
        ws.columns = [
            { header: 'Sale ID', key: 'id', width: 10 },
            { header: 'Product', key: 'product', width: 30 },
            { header: 'Qty Sold', key: 'qty', width: 12 },
            { header: 'Sale Type', key: 'saleType', width: 15 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Total Value', key: 'total', width: 15 },
            { header: 'Date', key: 'date', width: 20 },
        ];
        sales.forEach((s) => {
            ws.addRow({ id: s.id, product: s.product?.name, qty: s.quantitySold, saleType: s.saleType, price: s.priceUsed, total: s.quantitySold * Number(s.priceUsed), date: new Date(s.date).toLocaleString() });
        });
        return wb.xlsx.writeBuffer();
    }
    async exportStockToExcel() {
        const products = await this.getStockReport();
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Stock Report');
        ws.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Product Name', key: 'name', width: 30 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Brand', key: 'brand', width: 15 },
            { header: 'Qty', key: 'qty', width: 10 },
            { header: 'Cost Price', key: 'cost', width: 15 },
            { header: 'Retail Price', key: 'retail', width: 15 },
            { header: 'Wholesale Price', key: 'wholesale', width: 15 },
            { header: 'Supplier', key: 'supplier', width: 20 },
        ];
        products.forEach((p) => {
            ws.addRow({ id: p.id, name: p.name, category: p.category, brand: p.brand, qty: p.quantity, cost: p.costPrice, retail: p.retailPrice, wholesale: p.wholesalePrice, supplier: p.supplier });
        });
        return wb.xlsx.writeBuffer();
    }
    async exportLendingToExcel() {
        const lendings = await this.getLendingReport();
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Lending Report');
        ws.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Product', key: 'product', width: 30 },
            { header: 'Borrower Shop', key: 'shop', width: 25 },
            { header: 'Qty Lent', key: 'lent', width: 12 },
            { header: 'Qty Returned', key: 'returned', width: 15 },
            { header: 'Remaining', key: 'remaining', width: 12 },
            { header: 'Date Lent', key: 'dateLent', width: 15 },
            { header: 'Expected Return', key: 'expected', width: 18 },
            { header: 'Status', key: 'status', width: 15 },
        ];
        lendings.forEach((l) => {
            ws.addRow({ id: l.id, product: l.product?.name, shop: l.borrowerShop, lent: l.quantityLent, returned: l.quantityReturned, remaining: l.quantityLent - l.quantityReturned, dateLent: l.dateLent, expected: l.expectedReturnDate, status: l.status });
        });
        return wb.xlsx.writeBuffer();
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(2, (0, typeorm_1.InjectRepository)(lending_entity_1.Lending)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map