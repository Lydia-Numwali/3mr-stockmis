-- Move asset-instance fields onto receipt/issue transactions.
-- Catalog products keep only identity + stock balance.

ALTER TABLE purchases ADD COLUMN IF NOT EXISTS "assetId" VARCHAR(255);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS "serialNumber" VARCHAR(255);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS custodian VARCHAR(255);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS condition VARCHAR(100);

ALTER TABLE sales ADD COLUMN IF NOT EXISTS "assetId" VARCHAR(255);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS "serialNumber" VARCHAR(255);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS custodian VARCHAR(255);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS condition VARCHAR(100);
