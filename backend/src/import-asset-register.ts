/**
 * Import assets from "2025 ASSET REGISTER.xlsx" into the products table.
 *
 * Mapping (Excel → DB):
 *   Asset ID          → assetId
 *   Purchase Date     → purchaseDate
 *   Asset Category    → category
 *   Asset Description → name
 *   Serial Number     → serialNumber
 *   Model             → model
 *   QTY               → quantity
 *   Location          → location
 *   Assigned To       → SKIPPED (belongs in Items Issued / sales)
 *   Custodian         → custodian
 *   Condition         → condition
 *   Remarks           → notes
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

/** Excel serial date or string → JS Date */
function parseExcelDate(raw: unknown): Date | null {
  if (raw == null || raw === '') return null;

  if (raw instanceof Date && !isNaN(raw.getTime())) return raw;

  if (typeof raw === 'number') {
    // Excel serial number (days since 1899-12-30)
    if (raw > 20000 && raw < 100000) {
      const epoch = Date.UTC(1899, 11, 30);
      return new Date(epoch + raw * 86400000);
    }
    return null;
  }

  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const serial = parseFloat(trimmed);
    if (serial > 20000 && serial < 100000) {
      const epoch = Date.UTC(1899, 11, 30);
      return new Date(epoch + serial * 86400000);
    }
  }

  // dd/mm/yyyy or d/m/yyyy
  const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    const day = parseInt(dmy[1], 10);
    const month = parseInt(dmy[2], 10) - 1;
    let year = parseInt(dmy[3], 10);
    if (year < 100) year += 2000;
    return new Date(Date.UTC(year, month, day));
  }

  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

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

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const repo = app.get<Repository<Product>>(getRepositoryToken(Product));

  let imported = 0;
  let skipped = 0;
  let updated = 0;

  // Row 1 = headers; data starts at row 2
  // Columns: B=Asset ID, C=Purchase Date, D=Category, E=Description,
  // F=Serial, G=Model, H=QTY, I=Location, J=Assigned To (skip),
  // K=Custodian, L=Condition, M=Remarks
  const rows: ExcelJS.Row[] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    rows.push(row);
  });

  console.log(`Found ${rows.length} data rows`);

  for (const row of rows) {
    const assetId = cellText(row.getCell(2).value); // B
    const name = cellText(row.getCell(5).value); // E
    if (!assetId && !name) {
      skipped++;
      continue;
    }

    const serialNumber = cellText(row.getCell(6).value) || undefined; // F
    const qtyRaw = row.getCell(8).value; // H
    const quantity = Math.max(
      0,
      typeof qtyRaw === 'number' ? Math.floor(qtyRaw) : parseInt(cellText(qtyRaw), 10) || 1,
    );
    const purchaseDate = parseExcelDate(row.getCell(3).value); // C

    const payload: Partial<Product> = {
      assetId: assetId || undefined,
      name: name || assetId,
      category: cellText(row.getCell(4).value) || 'Miscellaneous Assets', // D
      serialNumber,
      model: cellText(row.getCell(7).value) || undefined, // G
      quantity,
      location: cellText(row.getCell(9).value) || undefined, // I
      // Assigned To (col 10 / J) intentionally skipped — use Items Issued
      custodian: cellText(row.getCell(11).value) || undefined, // K
      condition: cellText(row.getCell(12).value) || undefined, // L
      notes: cellText(row.getCell(13).value) || undefined, // M
      purchaseDate: purchaseDate || undefined,
      packagingUnit: PackagingUnit.PIECES,
      unitsPerPackage: 1,
      lowStockThreshold: 1,
    };

    let existing: Product | null = null;
    if (assetId && serialNumber) {
      existing = await repo.findOne({ where: { assetId, serialNumber } });
    }
    if (!existing && assetId && !serialNumber) {
      existing = await repo.findOne({ where: { assetId } });
    }
    if (!existing && serialNumber) {
      existing = await repo.findOne({ where: { serialNumber } });
    }

    if (existing) {
      Object.assign(existing, payload);
      await repo.save(existing);
      updated++;
    } else {
      const item = repo.create(payload);
      await repo.save(item);
      imported++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Updated:  ${updated}`);
  console.log(`  Skipped:  ${skipped}`);

  await app.close();
}

importAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
