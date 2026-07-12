import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Product, LogisticsItemCategory, PackagingUnit } from './entities/product.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get('UserRepository');
  const productRepository = app.get('ProductRepository');

  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin@123456';

  try {
    console.log('🌱 Starting simple seed...');
    
    // Create admin user if doesn't exist
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const admin = userRepository.create({
        email: adminEmail,
        password: passwordHash,
        name: 'Admin User',
      });
      await userRepository.save(admin);
      console.log('✓ Admin user created:', adminEmail);
      console.log('  Password:', adminPassword);
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create 5 sample logistics items
    const items = [
      {
        name: 'Security Guard Uniform',
        category: LogisticsItemCategory.SECURITY_UNIFORMS,
        brand: 'Centurion',
        model: 'Standard',
        itemType: 'Uniform',
        packagingUnit: PackagingUnit.PIECES,
        unitsPerPackage: 1,
        quantity: 50,
        costPrice: 25000,
        standardUnitCost: 25000,
        issueValue: 25000,
        lowStockThreshold: 10,
        supplier: 'Uniform Suppliers Ltd',
        warehouse: 'Main Warehouse',
        notes: 'Standard security guard uniform set',
      },
      {
        name: 'Two-Way Radio',
        category: LogisticsItemCategory.COMMUNICATION_EQUIPMENT,
        brand: 'Motorola',
        model: 'CP200d',
        itemType: 'Communication Device',
        packagingUnit: PackagingUnit.PIECES,
        unitsPerPackage: 1,
        quantity: 20,
        costPrice: 150000,
        standardUnitCost: 150000,
        issueValue: 150000,
        lowStockThreshold: 5,
        supplier: 'Tech Solutions Rwanda',
        warehouse: 'Main Warehouse',
        notes: 'Digital two-way radio for security communication',
      },
      {
        name: 'Flashlight - Heavy Duty',
        category: LogisticsItemCategory.PATROL_EQUIPMENT,
        brand: 'Maglite',
        model: 'ML300L',
        itemType: 'Equipment',
        packagingUnit: PackagingUnit.PIECES,
        unitsPerPackage: 1,
        quantity: 35,
        costPrice: 8000,
        standardUnitCost: 8000,
        issueValue: 8000,
        lowStockThreshold: 10,
        supplier: 'Security Equipment Co',
        warehouse: 'Main Warehouse',
        notes: 'High-powered LED flashlight',
      },
      {
        name: 'Handcuffs',
        category: LogisticsItemCategory.SECURITY_ACCESSORIES,
        brand: 'Smith & Wesson',
        model: 'Model 100',
        itemType: 'Restraint',
        packagingUnit: PackagingUnit.PAIR,
        unitsPerPackage: 1,
        quantity: 15,
        costPrice: 18000,
        standardUnitCost: 18000,
        issueValue: 18000,
        lowStockThreshold: 5,
        supplier: 'Security Equipment Co',
        warehouse: 'Secure Storage',
        notes: 'Standard issue handcuffs',
      },
      {
        name: 'First Aid Kit',
        category: LogisticsItemCategory.EMERGENCY_EQUIPMENT,
        brand: 'Red Cross',
        model: 'Professional',
        itemType: 'Medical Supplies',
        packagingUnit: PackagingUnit.BOX,
        unitsPerPackage: 1,
        quantity: 25,
        costPrice: 12000,
        standardUnitCost: 12000,
        issueValue: 12000,
        lowStockThreshold: 8,
        supplier: 'Medical Supplies Rwanda',
        warehouse: 'Main Warehouse',
        notes: 'Complete first aid kit for security posts',
      },
    ];

    console.log('📦 Creating logistics items...');
    let createdCount = 0;
    
    for (const itemData of items) {
      const existing = await productRepository.findOne({ where: { name: itemData.name } });
      if (!existing) {
        const item = productRepository.create(itemData);
        await productRepository.save(item);
        console.log(`  ✓ Created: ${itemData.name}`);
        createdCount++;
      } else {
        console.log(`  - Exists: ${itemData.name}`);
      }
    }

    console.log(`\n✅ Seed completed successfully!`);
    console.log(`   Created ${createdCount} new items`);
    console.log(`   Total items: ${items.length}`);
    console.log(`\n📝 Admin credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed();
