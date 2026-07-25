-- Migration: Align products with Asset Register Excel columns
-- Renames warehouse → location and adds asset register fields
-- Run against your Postgres/Supabase database before restarting the backend

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
  END IF;
END $$;

-- Add Excel-aligned columns on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS "assetId" VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS "serialNumber" VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS custodian VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS "purchaseDate" TIMESTAMP;

-- Ensure location exists even on fresh DBs that never had warehouse
ALTER TABLE products ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Convert category from enum to varchar so Excel categories can be stored as-is
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category'
      AND udt_name LIKE '%enum%'
  ) OR EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_attribute a ON a.atttypid = t.oid
    JOIN pg_class c ON c.oid = a.attrelid
    WHERE c.relname = 'products' AND a.attname = 'category' AND t.typtype = 'e'
  ) THEN
    ALTER TABLE products ALTER COLUMN category TYPE VARCHAR(100) USING category::text;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Fallback: try direct cast
  BEGIN
    ALTER TABLE products ALTER COLUMN category TYPE VARCHAR(100) USING category::text;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not alter category column: %', SQLERRM;
  END;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_products_asset_id ON products("assetId");
CREATE INDEX IF NOT EXISTS idx_products_serial_number ON products("serialNumber");
CREATE INDEX IF NOT EXISTS idx_purchases_location ON purchases(location);

-- Drop old warehouse index if present
DROP INDEX IF EXISTS idx_products_warehouse;
