-- Migration: Align products table with 2025 Asset Register Excel columns
-- warehouse → location; add assetId, serialNumber, custodian, condition, purchaseDate

-- Products: rename warehouse → location (if warehouse still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'warehouse'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location'
  ) THEN
    ALTER TABLE products RENAME COLUMN warehouse TO location;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'warehouse'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location'
  ) THEN
    UPDATE products SET location = COALESCE(location, warehouse) WHERE location IS NULL;
    ALTER TABLE products DROP COLUMN warehouse;
  END IF;
END $$;

-- Purchases: rename warehouse → location
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'warehouse'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'location'
  ) THEN
    ALTER TABLE purchases RENAME COLUMN warehouse TO location;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'warehouse'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'location'
  ) THEN
    UPDATE purchases SET location = COALESCE(location, warehouse) WHERE location IS NULL;
    ALTER TABLE purchases DROP COLUMN warehouse;
  END IF;
END $$;

-- Convert category from enum to varchar if needed (to accept Excel categories as-is)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category'
      AND udt_name LIKE '%enum%'
  ) THEN
    ALTER TABLE products ALTER COLUMN category TYPE varchar(100) USING category::text;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- If already varchar or cast fails, try explicit cast
  BEGIN
    ALTER TABLE products ALTER COLUMN category TYPE varchar(100) USING category::text;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- Add Excel-aligned columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS "assetId" VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS "serialNumber" VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS custodian VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS "purchaseDate" TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_products_asset_id ON products("assetId");
CREATE INDEX IF NOT EXISTS idx_products_serial ON products("serialNumber");
CREATE INDEX IF NOT EXISTS idx_purchases_location ON purchases(location);

-- Drop old warehouse index if present
DROP INDEX IF EXISTS idx_products_warehouse;
