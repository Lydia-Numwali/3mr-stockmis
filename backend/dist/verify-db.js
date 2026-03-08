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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./src/entities/user.entity");
const product_entity_1 = require("./src/entities/product.entity");
const stock_movement_entity_1 = require("./src/entities/stock-movement.entity");
const sale_entity_1 = require("./src/entities/sale.entity");
const lending_entity_1 = require("./src/entities/lending.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '123',
    database: process.env.DB_NAME || 'stockmis',
    entities: [user_entity_1.User, product_entity_1.Product, stock_movement_entity_1.StockMovement, sale_entity_1.Sale, lending_entity_1.Lending],
    synchronize: true,
    logging: true,
});
async function main() {
    try {
        console.log('🔌 Connecting to database...');
        await AppDataSource.initialize();
        console.log('✅ Database connected');
        const userRepo = AppDataSource.getRepository(user_entity_1.User);
        const users = await userRepo.find();
        console.log(`\n📊 Found ${users.length} user(s):`);
        users.forEach(u => {
            console.log(`   - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`);
        });
        const adminEmail = 'admin@example.com';
        const adminPassword = 'Admin@123456';
        const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log(`\n✅ Admin user already exists`);
        }
        else {
            console.log(`\n🌱 Seeding admin user...`);
            const hash = await bcrypt.hash(adminPassword, 10);
            const admin = await userRepo.save({
                email: adminEmail,
                passwordHash: hash,
                role: 'super-admin',
            });
            console.log(`✅ Admin user created:`);
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: ${adminPassword}`);
            console.log(`   ID: ${admin.id}`);
        }
        console.log('\n✅ Database verification complete');
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await AppDataSource.destroy();
    }
}
main();
//# sourceMappingURL=verify-db.js.map