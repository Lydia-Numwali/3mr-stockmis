import { DataSource } from 'typeorm';
import { Product, PackagingUnit } from './entities/product.entity';
import { Sale } from './entities/sale.entity';
import { Purchase } from './entities/purchase.entity';
import { Lending } from './entities/lending.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { User } from './entities/user.entity';
import { ReportHistory } from './entities/report-history.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const newItems = [
  { sn: 1, name: 'Uniforms', supplier: 'Vision Garment', closingBalance: 265, unit: 'pairs', status: 'New' },
  { sn: 2, name: 'T-Shirt', supplier: 'Utexrwa, &Vision Garment', closingBalance: 542, unit: 'pcs', status: 'New' },
  { sn: 3, name: 'Socks', supplier: 'Vision Garment', closingBalance: 209, unit: 'pair', status: 'New' },
  { sn: 4, name: 'Raincoats', supplier: 'Vision Garment', closingBalance: 97, unit: 'pairs', status: 'New' },
  { sn: 5, name: 'Sweater Green color', supplier: 'NICCU', closingBalance: 55, unit: 'pcs', status: 'New' },
  { sn: 6, name: 'Jackets', supplier: 'Utexrwa', closingBalance: 47, unit: 'pcs', status: 'New' },
  { sn: 7, name: 'Boots', supplier: 'Swift line Ltd', closingBalance: 4, unit: 'pairs', status: 'New' },
  { sn: 8, name: 'Black Bag', supplier: 'Ishimwe Bernald', closingBalance: 1, unit: 'pcs', status: 'New' },
  { sn: 9, name: 'Mobile Samsung a17 128GB', supplier: 'Hi-Fi Trading Service Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 10, name: 'Stick broom', supplier: 'Run Supplies Ltd', closingBalance: 30, unit: 'pcs', status: 'New' },
  { sn: 11, name: 'Wooded stick mop', supplier: 'Run Supplies Ltd', closingBalance: 20, unit: 'pcs', status: 'New' },
  { sn: 12, name: 'Stick brush', supplier: 'Run Supplies Ltd', closingBalance: 15, unit: 'pcs', status: 'New' },
  { sn: 13, name: 'Adapter for Laptop', supplier: 'Hi-Fi Trading Service Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 14, name: 'Sanitary Pads', supplier: 'Kanura Ltd', closingBalance: 5, unit: 'pcs', status: 'New' },
  { sn: 15, name: 'Full Of Security Suits 9pair', supplier: 'Ufaco Garment', closingBalance: 3, unit: 'Pair', status: 'New' },
  { sn: 16, name: 'Under Vehicle Search Mirror', supplier: 'Orbit Solution Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 17, name: 'Flip chart Stand wheeled', supplier: 'Saint Alvin Company Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 18, name: 'Flip chart Pads', supplier: 'Saint Alvin Company Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 19, name: 'Permanent Marker', supplier: 'Saint Alvin Company Ltd', closingBalance: 5, unit: 'pcs', status: 'New' },
  { sn: 20, name: 'Blue Pen', supplier: 'Saint Alvin Company Ltd', closingBalance: 3, unit: 'Boxes', status: 'New' },
  { sn: 21, name: 'Pen with Elastic Holder', supplier: 'Saint Alvin Company Ltd', closingBalance: 10, unit: 'pcs', status: 'New' },
  { sn: 22, name: 'Suspension File (Blue)', supplier: 'Saint Alvin Company Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 24, name: 'Belts', supplier: 'Swift line Ltd', closingBalance: 200, unit: 'pcs', status: 'New' },
  { sn: 25, name: 'Mask (Nduba)', supplier: '-', closingBalance: 9, unit: 'pcs', status: 'New' },
  { sn: 26, name: 'Weighing scale with its accessories', supplier: 'Run supplies ltd', closingBalance: 2, unit: 'pcs', status: 'New' },
  { sn: 27, name: 'Hand Sanitizer', supplier: 'Run supplies ltd', closingBalance: 3, unit: 'Btls', status: 'New' },
  { sn: 28, name: 'Baton (PR)', supplier: 'Utexrwa', closingBalance: 27, unit: 'pcs', status: 'New' },
  { sn: 29, name: 'Gloves', supplier: '-', closingBalance: 24, unit: 'pcs', status: 'New' },
  { sn: 30, name: 'New Torch', supplier: 'Run Supplier', closingBalance: 8, unit: 'pcs', status: 'New' },
  { sn: 31, name: 'Extension Cable', supplier: 'Run Supplier', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 32, name: 'Walkie Talkie (Motorola)', supplier: 'Motorola solution', closingBalance: 4, unit: 'pcs', status: 'New&used' },
  { sn: 33, name: 'Walk talkies T42 (Motorola)', supplier: 'Motorola solution', closingBalance: 6, unit: 'pcs', status: 'New' },
  { sn: 35, name: 'Walk talkies (ALECTO)', supplier: '-', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 37, name: 'Food Flask', supplier: 'Best Friend', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 38, name: 'Handheld Metal Detector', supplier: 'Best Friend', closingBalance: 6, unit: 'pcs', status: 'New' },
  { sn: 39, name: 'Helmet', supplier: 'Swift line Ltd', closingBalance: 0, unit: 'pcs', status: 'New' },
  { sn: 40, name: 'GP Rechargeable (Battery)', supplier: '-', closingBalance: 4, unit: 'pcs', status: 'New' },
  { sn: 42, name: 'TM-081 Umbrella', supplier: '-', closingBalance: 2, unit: 'pcs', status: 'New' },
  { sn: 43, name: 'Envelope A4', supplier: 'Techno Market Ltd', closingBalance: 100, unit: 'pcs', status: 'New' },
  { sn: 44, name: 'Clear Plastic Paper Holder', supplier: 'Saint Alvin Company Ltd', closingBalance: 100, unit: 'pcs', status: 'New' },
  { sn: 45, name: 'Sticky Notes (Different Color)', supplier: 'Saint Alvin Company Ltd', closingBalance: 10, unit: 'pcs', status: 'New' },
  { sn: 46, name: 'Counter Book (Register)', supplier: 'Saint Alvin Company Ltd', closingBalance: 35, unit: 'pcs', status: 'New' },
  { sn: 48, name: 'Ream of Paper', supplier: 'Saint Alvin Company Ltd', closingBalance: 10, unit: 'pcs', status: 'New' },
  { sn: 49, name: 'Box Files', supplier: 'Saint Alvin Company Ltd', closingBalance: 42, unit: 'pcs', status: 'New' },
  { sn: 50, name: 'Tonner 106A for 107A', supplier: 'Saint Alvin Company Ltd', closingBalance: 4, unit: 'pcs', status: 'New' },
  { sn: 51, name: 'KONIKA Toner', supplier: 'Saint Alvin Company Ltd', closingBalance: 3, unit: 'pcs', status: 'New' },
  { sn: 52, name: 'Battery AAA & Battery AA', supplier: 'NILL', closingBalance: 6, unit: 'pair', status: 'New' },
  { sn: 53, name: 'Pencils', supplier: 'Saint Alvin Company Ltd', closingBalance: 1, unit: 'pac', status: 'New' },
  { sn: 54, name: 'Highlighters', supplier: 'Saint Alvin Company Ltd', closingBalance: 3, unit: 'set', status: 'New' },
  { sn: 55, name: 'Paper Clip (50mm)', supplier: 'Saint Alvin Company Ltd', closingBalance: 1, unit: 'box', status: 'New' },
  { sn: 56, name: 'Manilla paper', supplier: 'Saint Alvin Company Ltd', closingBalance: 20, unit: 'pcs', status: 'New' },
  { sn: 57, name: 'Retype', supplier: 'Saint Alvin Company Ltd', closingBalance: 3, unit: 'pcs', status: 'New' },
  { sn: 58, name: 'Desk Organizer', supplier: 'Saint Alvin Company Ltd', closingBalance: 2, unit: 'pcs', status: 'New' },
  { sn: 59, name: 'Binding Cover', supplier: 'Saint Alvin Company Ltd', closingBalance: 2, unit: 'pcs', status: 'New' },
  { sn: 60, name: 'Rocket & Dudu', supplier: 'Saint Alvin Company Ltd', closingBalance: 10, unit: 'pcs', status: 'New' },
  { sn: 61, name: 'Punch Machine', supplier: 'Saint Alvin Company Ltd', closingBalance: 1, unit: 'pcs', status: 'New' },
  { sn: 63, name: 'East Chi File separator', supplier: 'Saint Alvin Company Ltd', closingBalance: 32, unit: 'pcs', status: 'New' },
];

const usedItems = [
  { name: 'Baofeng Walkie-Talkie', quantity: 22, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Alecto walkie Talkie', quantity: 1, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Rover Walkie Talkie', quantity: 7, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'SHN Walkie Talkie', quantity: 2, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Mtn Ikosora Smart Phone', quantity: 7, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Samsung Smart Phone', quantity: 1, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Airtel Smart Phone', quantity: 2, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Tecno Phone', quantity: 4, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'KZG Tel', quantity: 1, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Keyboards', quantity: 11, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Router', quantity: 5, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'Computer adapters', quantity: 4, unit: 'pcs', category: 'IT Items', status: 'Used' },
  { name: 'PR', quantity: 2, unit: 'pcs', category: 'Security Equipment & Uniforms', status: 'Used' },
  { name: 'Handheld Metal Detector (Used)', quantity: 2, unit: 'pcs', category: 'Security Equipment & Uniforms', status: 'Used' },
  { name: 'Torch (Used)', quantity: 32, unit: 'pcs', category: 'Security Equipment & Uniforms', status: 'Used' },
  { name: 'Rain coats (Used)', quantity: 110, unit: 'pcs', category: 'Security Equipment & Uniforms', status: 'Used' },
  { name: 'Uniforms (Used)', quantity: 889, unit: 'pcs', category: 'Security Equipment & Uniforms', status: 'Used' },
  { name: 'Bed Cover', quantity: 9, unit: 'pcs', category: 'Beddings', status: 'Used' },
  { name: 'Bed sheet', quantity: 16, unit: 'pcs', category: 'Beddings', status: 'Used' },
];

async function importJuneInventory() {
  const databaseUrl = process.env.DATABASE_URL || process.env.PROD_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ No DATABASE_URL found');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    entities: [Product, Sale, Purchase, Lending, StockMovement, User, ReportHistory],
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    const productRepo = dataSource.getRepository(Product);

    // Import New Items
    console.log('📦 Importing NEW ITEMS from June 2026 Inventory Report...');
    let imported = 0;
    
    for (const item of newItems) {
      const product = new Product();
      product.name = item.name;
      product.category = 'General';
      product.packagingUnit = PackagingUnit.PIECES; // Will be set dynamically
      product.quantity = item.closingBalance;
      product.lowStockThreshold = 5;
      product.supplier = item.supplier !== '-' ? item.supplier : '';
      product.condition = item.status;
      product.dateRecorded = new Date('2026-06-30');
      product.notes = `Imported from June 2026 Inventory Report. Unit: ${item.unit}`;
      
      await productRepo.save(product);
      imported++;
      
      if (item.closingBalance > 0) {
        console.log(`   ✓ ${item.name} - ${item.closingBalance} ${item.unit} (${item.supplier})`);
      }
    }

    console.log(`\n✅ Imported ${imported} new items\n`);

    // Import Used Items
    console.log('📦 Importing USED/OLD ITEMS from June 2026 Inventory Report...');
    let importedUsed = 0;
    
    for (const item of usedItems) {
      const product = new Product();
      product.name = item.name;
      product.category = item.category;
      product.packagingUnit = PackagingUnit.PIECES;
      product.quantity = item.quantity;
      product.lowStockThreshold = 5;
      product.supplier = '';
      product.condition = item.status;
      product.dateRecorded = new Date('2026-06-30');
      product.notes = `Imported from June 2026 Inventory Report - ${item.category}. Unit: ${item.unit}`;
      
      await productRepo.save(product);
      importedUsed++;
      console.log(`   ✓ ${item.name} - ${item.quantity} ${item.unit}`);
    }

    console.log(`\n✅ Imported ${importedUsed} used items\n`);

    console.log('🎉 Import Complete!');
    console.log(`📊 Total Items: ${imported + importedUsed}`);
    console.log('');
    console.log('ℹ️  Asset IDs will be auto-generated when you access the Items tab');
    console.log('💡 These closing balances are now your opening stock for July 2026');
    
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing inventory:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

importJuneInventory();
