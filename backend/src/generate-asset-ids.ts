import { DataSource, IsNull } from 'typeorm';
import { Product } from './entities/product.entity';
import { Sale } from './entities/sale.entity';
import { Purchase } from './entities/purchase.entity';
import { Lending } from './entities/lending.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function generateAssetIds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'rcaa',
    password: process.env.DB_PASSWORD || 'Test@123',
    database: process.env.DB_NAME || 'stockmis',
    entities: [Product, Sale, Purchase, Lending, StockMovement, User],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('✅ Database connected');

  const productRepo = dataSource.getRepository(Product);

  // Get all products without Asset IDs
  const productsWithoutAssetIds = await productRepo.find({
    where: { assetId: IsNull() },
  });

  console.log(`Found ${productsWithoutAssetIds.length} products without Asset IDs`);

  for (const product of productsWithoutAssetIds) {
    const year = new Date(product.dateRecorded || new Date()).getFullYear();
    const prefix = 'CAL';

    // Get first 2-3 letters from item name (remove spaces and special chars)
    const cleanName = product.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const nameCode = cleanName.substring(0, Math.min(3, cleanName.length)).padEnd(2, 'X');

    // Count existing items with similar name code to generate sequential number
    const namePattern = `${prefix}-${nameCode}-%`;
    const existingCount = await productRepo
      .createQueryBuilder('p')
      .where('p.assetId LIKE :pattern', { pattern: namePattern })
      .getCount();

    const sequentialNumber = (existingCount + 1).toString().padStart(3, '0');
    const assetId = `${prefix}-${nameCode}-${sequentialNumber}-${year}`;

    // Update the product
    product.assetId = assetId;
    await productRepo.save(product);

    console.log(`✅ Generated Asset ID for "${product.name}": ${assetId}`);
  }

  console.log('\n✅ Asset ID generation complete!');
  await dataSource.destroy();
  process.exit(0);
}

generateAssetIds().catch((error) => {
  console.error('❌ Error generating Asset IDs:', error);
  process.exit(1);
});
