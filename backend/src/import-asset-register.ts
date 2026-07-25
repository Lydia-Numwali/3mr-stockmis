/**
 * Import a reusable item catalog from "2025 ASSET REGISTER.xlsx".
 *
 * Catalog identity:
 *   Asset Category + Asset Description + Model/Specification
 *
 * Mapping (Excel → DB):
 *   Asset Category    → category
 *   Asset Description → name
 *   Model             → model
 *
 * Asset ID, serial number, location, assigned person, custodian, condition,
 * remarks, and Excel quantity describe existing asset instances. They are not
 * imported into the stock catalog. New catalog items start at quantity 0;
 * stock is added only by recording Items Received.
 *
 * Usage:
 *   cd backend
 *   npm run import:assets -- "/path/to/2025 ASSET REGISTER.xlsx"
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, PackagingUnit } from './entities/product.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

const DEFAULT_XLSX = path.resolve(
  __dirname,
  '../../../Downloads/2025 ASSET REGISTER.xlsx',
);

function cellText(value: ExcelJS.CellValue): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    const rich = value as ExcelJS.CellRichTextValue;
    if (rich.richText) return rich.richText.map((t) => t.text).join('').trim();
    const result = value as ExcelJS.CellFormulaValue | ExcelJS.CellHyperlinkValue;
    if ('result' in result && result.result != null) return cellText(result.result as ExcelJS.CellValue);
    if ('text' in result && result.text) return String(result.text).trim();
  }
  return String(value).trim();
}

function cleanText(value: ExcelJS.CellValue): string {
  return cellText(value).replace(/\s+/g, ' ').trim();
}

function catalogKey(category: string, name: string, model: string): string {
  return [category, name, model]
    .map((value) => value.toLocaleLowerCase())
    .join('\u0000');
}

async function importAssets() {
  const xlsxPath = process.argv[2] || DEFAULT_XLSX;
  if (!fs.existsSync(xlsxPath)) {
    console.error(`File not found: ${xlsxPath}`);
    process.exit(1);
  }

  console.log(`Reading: ${xlsxPath}`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const sheet = workbook.worksheets[0];
  if (!sheet) {
    console.error('No worksheet found');
    process.exit(1);
  }

  // Row 1 = headers; data starts at row 2
  // Columns used: D=Category, E=Description, G=Model/Specification.
  const rows: ExcelJS.Row[] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    rows.push(row);
  });

  const catalog = new Map<
    string,
    { category: string; name: string; model?: string }
  >();
  let skipped = 0;
  for (const row of rows) {
    const category =
      cleanText(row.getCell(4).value) || 'Miscellaneous Assets'; // D
    const name = cleanText(row.getCell(5).value); // E
    const model = cleanText(row.getCell(7).value); // G
    if (!name) {
      skipped++;
      continue;
    }

    const key = catalogKey(category, name, model);
    if (!catalog.has(key)) {
      catalog.set(key, { category, name, model: model || undefined });
    }
  }

  console.log(
    `Found ${rows.length} asset rows and ${catalog.size} unique catalog items`,
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const repo = app.get<Repository<Product>>(getRepositoryToken(Product));

  let imported = 0;
  let existingCount = 0;
  for (const item of catalog.values()) {
    const existing = await repo
      .createQueryBuilder('product')
      .where('lower(btrim(product.category)) = :category', {
        category: item.category.toLocaleLowerCase(),
      })
      .andWhere('lower(btrim(product.name)) = :name', {
        name: item.name.toLocaleLowerCase(),
      })
      .andWhere("lower(btrim(COALESCE(product.model, ''))) = :model", {
        model: (item.model || '').toLocaleLowerCase(),
      })
      .getOne();

    if (existing) {
      existingCount++;
    } else {
      await repo.save(
        repo.create({
          name: item.name,
          category: item.category,
          model: item.model,
          quantity: 0,
          packagingUnit: PackagingUnit.PIECES,
          unitsPerPackage: 1,
          lowStockThreshold: 1,
        }),
      );
      imported++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Existing: ${existingCount}`);
  console.log(`  Skipped rows without a description: ${skipped}`);

  await app.close();
}

importAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
