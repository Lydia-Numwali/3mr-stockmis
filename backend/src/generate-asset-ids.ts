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

/**
 * Generate Asset ID in format: CAL-[2-3 letters from name]-[sequential number]-[year]
 * Example: CAL-CL-001-2022
 */
function generateAssetId(name: string, sequence: number, year: number): string {
  // Remove commas, ampersands, and other special chars
  // This handles names like "T-Shirt, &Vision" -> "TShirtVision" -> "TSH"
  const cleanName = name
    .replace(/[,&()]/g, ' ')  // Replace commas, ampersands, parentheses with spaces
    .replace(/[^a-zA-Z\s]/g, '')  // Remove all other special chars except letters and spaces
    .split(/\s+/)  // Split by spaces
    .filter(w => w.length > 0)  // Remove empty strings
    .join('')  // Join back
    .toUpperCase();
  
  // Get 2-3 letters from cleaned name
  let nameCode = cleanName.substring(0, Math.min(3, cleanName.length));
  
  // Ensure we have at least 2 letters
  if (nameCode.length < 2) {
    nameCode = nameCode.padEnd(2, 'X');
  }
  if (nameCode.length > 3) {
    nameCode = nameCode.substring(0, 3);
  }
  
  // Format: CAL-XX-NNN-YYYY
  const seqStr = sequence.toString().padStart(3, '0');
  return `CAL-${nameCode}-${seqStr}-${year}`;
}

async function generateAssetIdsForAllProducts() {
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

    // Get all products without Asset IDs, with empty Asset IDs, or with Asset IDs containing special characters
    const allProducts = await productRepo
      .createQueryBuilder('product')
      .orderBy('product.id', 'ASC')
      .getMany();

    // Filter products that need new Asset IDs
    const products = allProducts.filter(p => {
      if (!p.assetId || p.assetId.trim() === '') return true;
      // Check if Asset ID contains special characters like commas, ampersands, etc.
      const hasSpecialChars = /[,&()]/.test(p.assetId);
      return hasSpecialChars;
    });

    console.log(`📝 Found ${products.length} products that need Asset ID generation/update\n`);
    if (products.length === 0) {
      console.log('✅ All products already have clean Asset IDs!');
      await dataSource.destroy();
      process.exit(0);
    }
    console.log('🔧 Generating Asset IDs...\n');

    let generated = 0;
    const year = 2026;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const sequence = i + 1;
      const oldAssetId = product.assetId;
      const assetId = generateAssetId(product.name, sequence, year);
      
      product.assetId = assetId;
      await productRepo.save(product);
      
      generated++;
      if (oldAssetId) {
        console.log(`   ✓ ${oldAssetId} → ${assetId} - ${product.name}`);
      } else {
        console.log(`   ✓ ${assetId} - ${product.name}`);
      }
    }

    console.log(`\n✅ Generated ${generated} Asset IDs`);
    console.log('🎉 All products now have Asset IDs!');
    
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating Asset IDs:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

generateAssetIdsForAllProducts();
