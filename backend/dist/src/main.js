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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: '*' });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`✅ Server running on port ${port}`);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepo = dataSource.getRepository(user_entity_1.User);
    try {
        const exists = await userRepo.findOne({ where: { email: 'admin@example.com' } });
        if (exists) {
            console.log('✅ Admin user already exists');
        }
        else {
            const hash = await bcrypt.hash('Admin@123456', 10);
            const admin = await userRepo.save({
                email: 'admin@example.com',
                passwordHash: hash,
                role: 'super-admin'
            });
            console.log('✅ Admin seeded successfully');
            console.log(`   Email: admin@example.com`);
            console.log(`   Password: Admin@123456`);
            console.log(`   ID: ${admin.id}`);
        }
    }
    catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map