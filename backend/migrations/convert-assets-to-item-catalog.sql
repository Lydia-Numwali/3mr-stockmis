-- Convert the asset-instance import into a reusable item catalog.
--
-- Catalog identity:
--   category + asset description (name) + model/specification
--
-- Excel asset IDs, serial numbers, locations, custodians, conditions, and
-- assigned people describe individual assets, not stock catalog items.
-- Catalog stock starts at zero and is derived only from recorded movements.

BEGIN;

CREATE TEMP TABLE catalog_stage AS
SELECT
  lower(btrim(category)) AS category_key,
  lower(btrim(name)) AS name_key,
  lower(btrim(COALESCE(model, ''))) AS model_key,
  min(id) AS representative_id,
  NULL::integer AS catalog_product_id
FROM products
WHERE "assetId" IS NOT NULL
GROUP BY
  lower(btrim(category)),
  lower(btrim(name)),
  lower(btrim(COALESCE(model, '')));

-- Create one selectable item per unique category, description, and model.
INSERT INTO products (
  name,
  category,
  "packagingUnit",
  "unitsPerPackage",
  brand,
  model,
  "itemType",
  "standardUnitCost",
  "issueValue",
  "costPrice",
  quantity,
  "lowStockThreshold",
  supplier,
  notes
)
SELECT
  representative.name,
  representative.category,
  representative."packagingUnit",
  representative."unitsPerPackage",
  representative.brand,
  representative.model,
  representative."itemType",
  representative."standardUnitCost",
  representative."issueValue",
  representative."costPrice",
  0,
  1,
  representative.supplier,
  NULL
FROM catalog_stage stage
JOIN products representative ON representative.id = stage.representative_id;

-- Link each staged identity to its newly created catalog product.
UPDATE catalog_stage stage
SET catalog_product_id = (
  SELECT max(product.id)
  FROM products product
  WHERE product."assetId" IS NULL
    AND lower(btrim(product.category)) = stage.category_key
    AND lower(btrim(product.name)) = stage.name_key
    AND lower(btrim(COALESCE(product.model, ''))) = stage.model_key
);

-- Preserve transactions and movement history by moving their foreign keys
-- from asset instances to the matching catalog item.
UPDATE purchases transaction
SET "productId" = stage.catalog_product_id
FROM products old_product
JOIN catalog_stage stage
  ON lower(btrim(old_product.category)) = stage.category_key
 AND lower(btrim(old_product.name)) = stage.name_key
 AND lower(btrim(COALESCE(old_product.model, ''))) = stage.model_key
WHERE transaction."productId" = old_product.id
  AND old_product."assetId" IS NOT NULL;

UPDATE sales transaction
SET "productId" = stage.catalog_product_id
FROM products old_product
JOIN catalog_stage stage
  ON lower(btrim(old_product.category)) = stage.category_key
 AND lower(btrim(old_product.name)) = stage.name_key
 AND lower(btrim(COALESCE(old_product.model, ''))) = stage.model_key
WHERE transaction."productId" = old_product.id
  AND old_product."assetId" IS NOT NULL;

UPDATE lendings transaction
SET "productId" = stage.catalog_product_id
FROM products old_product
JOIN catalog_stage stage
  ON lower(btrim(old_product.category)) = stage.category_key
 AND lower(btrim(old_product.name)) = stage.name_key
 AND lower(btrim(COALESCE(old_product.model, ''))) = stage.model_key
WHERE transaction."productId" = old_product.id
  AND old_product."assetId" IS NOT NULL;

UPDATE stock_movements movement
SET "productId" = stage.catalog_product_id
FROM products old_product
JOIN catalog_stage stage
  ON lower(btrim(old_product.category)) = stage.category_key
 AND lower(btrim(old_product.name)) = stage.name_key
 AND lower(btrim(COALESCE(old_product.model, ''))) = stage.model_key
WHERE movement."productId" = old_product.id
  AND old_product."assetId" IS NOT NULL;

-- Recalculate catalog stock exclusively from recorded movements.
UPDATE products catalog_product
SET quantity = GREATEST(movement_totals.quantity, 0)
FROM (
  SELECT
    movement."productId",
    sum(
      CASE
        WHEN movement.type IN ('IN', 'RETURN') THEN movement.quantity
        WHEN movement.type IN ('OUT', 'LEND') THEN -movement.quantity
        ELSE 0
      END
    )::integer AS quantity
  FROM stock_movements movement
  GROUP BY movement."productId"
) movement_totals
WHERE catalog_product.id = movement_totals."productId"
  AND catalog_product.id IN (
    SELECT catalog_product_id FROM catalog_stage
  );

-- Asset-instance rows are no longer needed after all references are remapped.
DELETE FROM products
WHERE "assetId" IS NOT NULL;

-- Prevent future duplicate catalog entries with differences only in case or
-- surrounding whitespace.
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_catalog_identity
ON products (
  lower(btrim(category)),
  lower(btrim(name)),
  lower(btrim(COALESCE(model, '')))
);

COMMIT;
