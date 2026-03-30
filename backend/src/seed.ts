import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Purchase } from './entities/purchase.entity';
import { Sale, SaleType } from './entities/sale.entity';
import { Lending } from './entities/lending.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { PurchasesService } from './purchases/purchases.service';
import { SalesService } from './sales/sales.service';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get('UserRepository');
  const productRepository = app.get('ProductRepository');
  const purchaseRepository = app.get('PurchaseRepository');
  const saleRepository = app.get('SaleRepository');
  const lendingRepository = app.get('LendingRepository');
  const stockMovementRepository = app.get('StockMovementRepository');
  
  // Get services to create transactions properly
  const purchasesService = app.get(PurchasesService);
  const salesService = app.get(SalesService);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin@123456';

  try {
    console.log('🧹 Clearing existing sample data...');
    
    // Clear existing data (except admin user) - using query builder for better control
    await stockMovementRepository.createQueryBuilder().delete().execute();
    await lendingRepository.createQueryBuilder().delete().execute();
    await saleRepository.createQueryBuilder().delete().execute();
    await purchaseRepository.createQueryBuilder().delete().execute();
    await productRepository.createQueryBuilder().delete().execute();
    
    console.log('✓ Existing sample data cleared');

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      // Hash password
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      // Create admin user
      const admin = userRepository.create({
        email: adminEmail,
        passwordHash,
        role: 'super-admin',
      });

      await userRepository.save(admin);
      console.log(`✓ Admin user created successfully`);
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}`);
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('🌱 Creating fresh sample data...');

    // Create comprehensive sample products (directly since they don't need stock movements)
    const products = [
      {
        name: 'Engine Oil 5W-30',
        category: 'Engine Parts',
        brand: 'Mobil 1',
        model: 'Advanced Full Synthetic',
        partType: 'Lubricant',
        wholesalePrice: 25000,
        retailPrice: 32000,
        costPrice: 20000,
        quantity: 0, // Start with 0, will be updated by purchases
        lowStockThreshold: 25,
        supplier: 'Auto Parts Distributors Ltd',
        storageLocation: 'Warehouse A - Section 1'
      },
      {
        name: 'Engine Oil 5W-30',
        category: 'Engine Parts',
        brand: 'Castrol',
        model: 'GTX High Mileage',
        partType: 'Lubricant',
        wholesalePrice: 23000,
        retailPrice: 30000,
        costPrice: 18000,
        quantity: 0,
        lowStockThreshold: 25,
        supplier: 'Auto Parts Distributors Ltd',
        storageLocation: 'Warehouse A - Section 1'
      },
      {
        name: 'Brake Pads Front Set',
        category: 'Brake System',
        brand: 'Bosch',
        model: 'QuietCast Premium',
        partType: 'Brake System',
        wholesalePrice: 48000,
        retailPrice: 58000,
        costPrice: 38000,
        quantity: 0,
        lowStockThreshold: 15,
        supplier: 'Brake Masters International',
        storageLocation: 'Warehouse A - Section 2'
      },
      {
        name: 'Brake Pads Front Set',
        category: 'Brake System',
        brand: 'Brembo',
        model: 'Premium Ceramic',
        partType: 'Brake System',
        wholesalePrice: 55000,
        retailPrice: 68000,
        costPrice: 45000,
        quantity: 0,
        lowStockThreshold: 15,
        supplier: 'Brake Masters International',
        storageLocation: 'Warehouse A - Section 2'
      },
      {
        name: 'Air Filter',
        category: 'Engine Parts',
        brand: 'Mann Filter',
        model: 'C 25 114/1',
        partType: 'Engine Parts',
        wholesalePrice: 18000,
        retailPrice: 24000,
        costPrice: 14000,
        quantity: 0,
        lowStockThreshold: 30,
        supplier: 'Filter Solutions Pro',
        storageLocation: 'Warehouse B - Section 1'
      },
      {
        name: 'Air Filter',
        category: 'Engine Parts',
        brand: 'K&N',
        model: 'High-Flow Performance',
        partType: 'Engine Parts',
        wholesalePrice: 25000,
        retailPrice: 32000,
        costPrice: 20000,
        quantity: 0,
        lowStockThreshold: 20,
        supplier: 'Filter Solutions Pro',
        storageLocation: 'Warehouse B - Section 1'
      },
      {
        name: 'Spark Plugs Set',
        category: 'Engine Parts',
        brand: 'NGK',
        model: 'Iridium IX',
        partType: 'Ignition System',
        wholesalePrice: 12000,
        retailPrice: 16000,
        costPrice: 9000,
        quantity: 0,
        lowStockThreshold: 40,
        supplier: 'Ignition Systems Corp',
        storageLocation: 'Warehouse B - Section 2'
      },
      {
        name: 'Spark Plugs Set',
        category: 'Engine Parts',
        brand: 'Denso',
        model: 'Platinum TT',
        partType: 'Ignition System',
        wholesalePrice: 10000,
        retailPrice: 14000,
        costPrice: 7500,
        quantity: 0,
        lowStockThreshold: 40,
        supplier: 'Ignition Systems Corp',
        storageLocation: 'Warehouse B - Section 2'
      },
      {
        name: 'Car Battery 12V',
        category: 'Electrical Parts',
        brand: 'Exide',
        model: 'Excell EB740',
        partType: 'Electrical',
        wholesalePrice: 85000,
        retailPrice: 105000,
        costPrice: 72000,
        quantity: 0,
        lowStockThreshold: 12,
        supplier: 'Power Solutions Ltd',
        storageLocation: 'Warehouse C - Section 1'
      },
      {
        name: 'Car Battery 12V',
        category: 'Electrical Parts',
        brand: 'Varta',
        model: 'Blue Dynamic',
        partType: 'Electrical',
        wholesalePrice: 90000,
        retailPrice: 110000,
        costPrice: 75000,
        quantity: 0,
        lowStockThreshold: 12,
        supplier: 'Power Solutions Ltd',
        storageLocation: 'Warehouse C - Section 1'
      },
      {
        name: 'All-Season Tire',
        category: 'Tires & Wheels',
        brand: 'Michelin',
        model: 'Energy Saver+',
        partType: 'Wheels & Tires',
        wholesalePrice: 125000,
        retailPrice: 150000,
        costPrice: 105000,
        quantity: 0,
        lowStockThreshold: 16,
        supplier: 'Tire World Distribution',
        storageLocation: 'Warehouse C - Section 2'
      },
      {
        name: 'All-Season Tire',
        category: 'Tires & Wheels',
        brand: 'Bridgestone',
        model: 'Turanza T005',
        partType: 'Wheels & Tires',
        wholesalePrice: 130000,
        retailPrice: 155000,
        costPrice: 110000,
        quantity: 0,
        lowStockThreshold: 16,
        supplier: 'Tire World Distribution',
        storageLocation: 'Warehouse C - Section 2'
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = productRepository.create(productData);
      const savedProduct = await productRepository.save(product);
      createdProducts.push(savedProduct);
    }
    console.log(`✓ Created ${createdProducts.length} sample products`);

    // Create purchases using the service (this will create stock movements automatically)
    const purchases = [
      // January 2024 purchases - Different brands of same products
      { productId: createdProducts[0].id, quantityPurchased: 60, pricePerUnit: 20000, supplier: 'Auto Parts Distributors Ltd', purchaseDate: '2024-01-10', notes: 'Initial stock - Mobil 1 Engine Oil' },
      { productId: createdProducts[1].id, quantityPurchased: 40, pricePerUnit: 18000, supplier: 'Auto Parts Distributors Ltd', purchaseDate: '2024-01-12', notes: 'Initial stock - Castrol Engine Oil' },
      { productId: createdProducts[2].id, quantityPurchased: 30, pricePerUnit: 38000, supplier: 'Brake Masters International', purchaseDate: '2024-01-15', notes: 'Initial stock - Bosch Brake Pads' },
      
      // February 2024 purchases
      { productId: createdProducts[3].id, quantityPurchased: 25, pricePerUnit: 45000, supplier: 'Brake Masters International', purchaseDate: '2024-02-01', notes: 'Premium Brembo Brake Pads' },
      { productId: createdProducts[4].id, quantityPurchased: 50, pricePerUnit: 14000, supplier: 'Filter Solutions Pro', purchaseDate: '2024-02-05', notes: 'Mann Air Filters' },
      { productId: createdProducts[5].id, quantityPurchased: 30, pricePerUnit: 20000, supplier: 'Filter Solutions Pro', purchaseDate: '2024-02-10', notes: 'K&N Performance Air Filters' },
      
      // March 2024 purchases
      { productId: createdProducts[6].id, quantityPurchased: 80, pricePerUnit: 9000, supplier: 'Ignition Systems Corp', purchaseDate: '2024-03-01', notes: 'NGK Spark Plugs bulk order' },
      { productId: createdProducts[7].id, quantityPurchased: 60, pricePerUnit: 7500, supplier: 'Ignition Systems Corp', purchaseDate: '2024-03-05', notes: 'Denso Spark Plugs' },
      { productId: createdProducts[8].id, quantityPurchased: 25, pricePerUnit: 72000, supplier: 'Power Solutions Ltd', purchaseDate: '2024-03-08', notes: 'Exide Batteries' },
      
      // Recent purchases (March 2026)
      { productId: createdProducts[9].id, quantityPurchased: 20, pricePerUnit: 75000, supplier: 'Power Solutions Ltd', purchaseDate: '2026-03-15', notes: 'Varta Batteries' },
      { productId: createdProducts[10].id, quantityPurchased: 32, pricePerUnit: 105000, supplier: 'Tire World Distribution', purchaseDate: '2026-03-20', notes: 'Michelin Tires' },
      { productId: createdProducts[11].id, quantityPurchased: 28, pricePerUnit: 110000, supplier: 'Tire World Distribution', purchaseDate: '2026-03-25', notes: 'Bridgestone Tires' },
      { productId: createdProducts[0].id, quantityPurchased: 40, pricePerUnit: 19500, supplier: 'Auto Parts Distributors Ltd', purchaseDate: '2026-03-28', notes: 'Mobil 1 restock' }
    ];

    let purchaseCount = 0;
    for (const purchaseData of purchases) {
      await purchasesService.create(purchaseData);
      purchaseCount++;
    }
    console.log(`✓ Created ${purchaseCount} sample purchases with stock movements`);

    // Create sales using the service (this will create stock movements automatically)
    const sales = [
      // January 2024 sales - Different brands showing price differences
      { productId: createdProducts[0].id, quantitySold: 8, saleType: SaleType.RETAIL, priceUsed: 32000, customerName: 'John Smith', saleDate: '2024-01-20', notes: 'Mobil 1 - Premium choice' },
      { productId: createdProducts[1].id, quantitySold: 12, saleType: SaleType.RETAIL, priceUsed: 30000, customerName: 'Maria Garcia', saleDate: '2024-01-25', notes: 'Castrol - Budget option' },
      
      // February 2024 sales
      { productId: createdProducts[2].id, quantitySold: 4, saleType: SaleType.RETAIL, priceUsed: 58000, customerName: 'David Johnson', saleDate: '2024-02-02', notes: 'Bosch brake pads' },
      { productId: createdProducts[3].id, quantitySold: 2, saleType: SaleType.RETAIL, priceUsed: 68000, customerName: 'Sarah Wilson', saleDate: '2024-02-08', notes: 'Brembo premium brake pads' },
      { productId: createdProducts[4].id, quantitySold: 15, saleType: SaleType.WHOLESALE, priceUsed: 18000, customerName: 'Mike\'s Auto Repair', saleDate: '2024-02-12', notes: 'Mann filters bulk order' },
      
      // March 2024 sales
      { productId: createdProducts[5].id, quantitySold: 8, saleType: SaleType.WHOLESALE, priceUsed: 25000, customerName: 'Performance Auto Shop', saleDate: '2024-03-05', notes: 'K&N performance filters' },
      { productId: createdProducts[6].id, quantitySold: 12, saleType: SaleType.RETAIL, priceUsed: 16000, customerName: 'Robert Brown', saleDate: '2024-03-10', notes: 'NGK spark plugs' },
      { productId: createdProducts[7].id, quantitySold: 8, saleType: SaleType.RETAIL, priceUsed: 14000, customerName: 'Lisa Martinez', saleDate: '2024-03-15', notes: 'Denso spark plugs' },
      
      // Recent sales (March 2026)
      { productId: createdProducts[8].id, quantitySold: 3, saleType: SaleType.RETAIL, priceUsed: 105000, customerName: 'James Anderson', saleDate: '2026-03-18', notes: 'Exide battery replacement' },
      { productId: createdProducts[9].id, quantitySold: 2, saleType: SaleType.RETAIL, priceUsed: 110000, customerName: 'Emma Thompson', saleDate: '2026-03-22', notes: 'Varta premium battery' },
      { productId: createdProducts[10].id, quantitySold: 8, saleType: SaleType.RETAIL, priceUsed: 150000, customerName: 'Michael Davis', saleDate: '2026-03-26', notes: 'Michelin tire set' },
      { productId: createdProducts[11].id, quantitySold: 4, saleType: SaleType.RETAIL, priceUsed: 155000, customerName: 'Fleet Solutions Ltd', saleDate: '2026-03-28', notes: 'Bridgestone premium tires' },
      
      // Additional mixed sales for better testing
      { productId: createdProducts[0].id, quantitySold: 18, saleType: SaleType.WHOLESALE, priceUsed: 25000, customerName: 'City Auto Center', saleDate: '2026-03-29', notes: 'Mobil 1 bulk order' },
      { productId: createdProducts[1].id, quantitySold: 20, saleType: SaleType.WHOLESALE, priceUsed: 23000, customerName: 'Express Auto Repair', saleDate: '2026-03-30', notes: 'Castrol bulk order' }
    ];

    let salesCount = 0;
    for (const saleData of sales) {
      await salesService.create(saleData);
      salesCount++;
    }
    console.log(`✓ Created ${salesCount} sample sales with stock movements`);

    // Create sample lending records (directly since lending service might not exist yet)
    const lendings = [
      {
        productId: createdProducts[4].id, // Mann Air Filter
        quantityLent: 3,
        borrowerShop: 'Maintenance Team',
        dateLent: new Date('2026-03-20'),
        expectedReturnDate: new Date('2026-03-27'),
        notes: 'For company vehicle fleet maintenance',
        status: 'PENDING'
      },
      {
        productId: createdProducts[5].id, // K&N Air Filter
        quantityLent: 2,
        quantityReturned: 2,
        borrowerShop: 'Training Department',
        dateLent: new Date('2026-03-15'),
        expectedReturnDate: new Date('2026-03-22'),
        returnDate: new Date('2026-03-21'),
        notes: 'For mechanic training demonstration',
        status: 'RETURNED'
      },
      {
        productId: createdProducts[6].id, // NGK Spark Plugs
        quantityLent: 8,
        borrowerShop: 'R&D Department',
        dateLent: new Date('2026-03-25'),
        expectedReturnDate: new Date('2026-04-01'),
        notes: 'Product testing and evaluation',
        status: 'PENDING'
      },
      {
        productId: createdProducts[7].id, // Denso Spark Plugs
        quantityLent: 4,
        quantityReturned: 4,
        borrowerShop: 'Quality Control Team',
        dateLent: new Date('2026-03-10'),
        expectedReturnDate: new Date('2026-03-17'),
        returnDate: new Date('2026-03-16'),
        notes: 'Quality testing batch',
        status: 'RETURNED'
      }
    ];

    for (const lendingData of lendings) {
      const lending = lendingRepository.create(lendingData);
      await lendingRepository.save(lending);
    }
    console.log(`✓ Created ${lendings.length} sample lending records`);

    // Count stock movements to verify they were created
    const stockMovementCount = await stockMovementRepository.count();

    console.log('\n🎉 Database seeded successfully with comprehensive test data!');
    console.log('\n📊 Test Data Summary:');
    console.log(`   • ${createdProducts.length} Products (automotive parts with varied stock levels)`);
    console.log(`   • ${purchaseCount} Purchase records (spanning 2+ years)`);
    console.log(`   • ${salesCount} Sale records (retail & wholesale)`);
    console.log(`   • ${lendings.length} Lending records (active & returned)`);
    console.log(`   • ${stockMovementCount} Stock movements (automatically generated)`);
    
    console.log('\n✅ You can now test all functionalities:');
    console.log('   🏠 Dashboard - Cards with real metrics');
    console.log('   📦 Products - Table with varied stock levels');
    console.log('   🛒 Purchases - Historical purchase data');
    console.log('   💰 Sales - Mixed retail/wholesale transactions');
    console.log('   📋 Bulk Entry - Add multiple items at once');
    console.log('   🤝 Lending - Active and returned items');
    console.log('   📈 Stock Management - Low stock alerts');
    console.log('   📊 Reports - Rich data for analysis');
    console.log('   📋 Stock Movements - Complete transaction history');
    
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();