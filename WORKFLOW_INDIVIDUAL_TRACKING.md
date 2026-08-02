# Individual Item Tracking Workflow

## Overview
The system now tracks **individual items** rather than bulk quantities. Each physical item receives a unique Asset ID, enabling precise asset management and tracking.

---

## Key Changes

### 1. Items Tab - Read-Only Catalog
- **Before**: "Add Logistics Item" button to manually create items
- **After**: No add button - items are created automatically when received
- **Purpose**: Items tab shows all tracked items (catalog view)
- **Available Actions**: View details, Edit existing items

### 2. Items Received - Primary Entry Point
- **Before**: Select existing item → Add quantity
- **After**: Two modes available:
  1. **Receive New Item Type**: Create new item records
  2. **Add to Existing Item**: Receive more units of existing type

### 3. Individual Item Records
- **Before**: One Product record = bulk quantity (e.g., "10 Chairs")
- **After**: One Product record = one physical item (e.g., "Chair #1", "Chair #2")
- **Each item gets**:
  - Unique Asset ID (CAL-CHA-001-2026, CAL-CHA-002-2026, etc.)
  - Individual tracking record
  - Own custodian, location, condition
  - Separate lifecycle (received → issued → returned)

---

## How It Works

### Receiving Items

#### Scenario 1: Receiving New Item Type (First Time)
**Example**: Receiving 5 Computer Laptops

1. Go to **Items Received** tab
2. Click **"Record Items Received"**
3. Select **"Receive New Item Type"** mode
4. Fill in details:
   - Item Name: `Computer Laptop`
   - Category: `IT Equipment`
   - Brand: `HP`
   - Model: `PRO BOOK 450`
   - Quantity Received: `5`
   - Price Per Unit: `800000` (optional)
   - Supplier: `TechShop Rwanda`
   - Location: `Main Office`
   - Condition: `New`
5. Click **"Create & Record Receipt"**

**Result**:
- System creates 5 individual Product records:
  - Computer Laptop (CAL-COM-001-2026)
  - Computer Laptop (CAL-COM-002-2026)
  - Computer Laptop (CAL-COM-003-2026)
  - Computer Laptop (CAL-COM-004-2026)
  - Computer Laptop (CAL-COM-005-2026)
- Each gets its own row in Items tab
- Each can be tracked independently

#### Scenario 2: Receiving More of Existing Type
**Example**: Receiving 3 more Computer Laptops (already have some)

1. Go to **Items Received** tab
2. Click **"Record Items Received"**
3. Select **"Add to Existing Item"** mode
4. Select Category: `IT Equipment`
5. Select Item: `Computer Laptop`
6. Enter Quantity: `3`
7. Fill in receipt details
8. Click **"Record Receipt"**

**Result**:
- System creates 3 more individual Product records:
  - Computer Laptop (CAL-COM-006-2026)
  - Computer Laptop (CAL-COM-007-2026)
  - Computer Laptop (CAL-COM-008-2026)
- Sequential numbering continues from existing items
- Total: Now have 8 Computer Laptops, each individually tracked

---

## Asset ID Generation

### Format: CAL-XXX-NNN-YYYY

- **CAL**: Fixed prefix (Centurion Asset Logistics)
- **XXX**: 2-3 letter code from item name
  - Computer Laptop → COM
  - Office Chair → OFF
  - Security Guard Uniform → SEC
- **NNN**: Sequential 3-digit number (001, 002, 003...)
  - Increments for each item of same type
  - Independent per item type
- **YYYY**: Year item was received (2026, 2027, etc.)

### Examples:
```
First 3 chairs received in 2026:
- CAL-CHA-001-2026
- CAL-CHA-002-2026
- CAL-CHA-003-2026

First 2 laptops received in 2026:
- CAL-COM-001-2026
- CAL-COM-002-2026

More chairs received later in 2026:
- CAL-CHA-004-2026
- CAL-CHA-005-2026
```

---

## Issuing Items

When issuing items, you select **individual items** to issue (not bulk quantities):

**Example**: Issuing 2 Laptops to IT Department

1. Go to **Items Issued** tab
2. Select item: `Computer Laptop`
3. The system shows available units:
   - CAL-COM-001-2026 (Available)
   - CAL-COM-002-2026 (Available)
   - CAL-COM-003-2026 (Issued)
   - CAL-COM-004-2026 (Available)
4. Select 2 available units to issue
5. Each gets marked as issued individually

---

## Benefits of Individual Tracking

### 1. **Precise Asset Management**
- Know exact location of each item
- Track individual item history
- Identify specific items for maintenance

### 2. **Accountability**
- Each item has assigned custodian
- Clear chain of custody
- Individual responsibility

### 3. **Accurate Reporting**
- Track depreciation per item
- Monitor individual item condition
- Audit trail for each asset

### 4. **Lifecycle Management**
- Receive → Issue → Return → Repair → Dispose
- Complete history per item
- Condition tracking over time

### 5. **Better Inventory Control**
- No confusion about "which laptop?"
- Easy physical verification (scan Asset ID)
- Prevent losses and theft

---

## Migration from Old System

### Existing Items (Bulk Records)
Current items with bulk quantities will coexist with new individual records.

**Recommended Approach**:
1. Continue using existing bulk items for consumption
2. New receipts create individual items
3. Gradually phase out bulk records

**Optional**: Convert existing items to individual records:
- Export current inventory
- Issue out all old bulk items
- Receive new items as individuals with Asset IDs

---

## Best Practices

### 1. **Consistent Naming**
Use consistent item names for same item types:
- ✅ "Computer Laptop" (always)
- ❌ "Laptop Computer", "PC Laptop" (inconsistent)

This ensures proper Asset ID grouping.

### 2. **Record Details at Receipt**
Capture as much info as possible when receiving:
- Serial numbers (for serialized items)
- Supplier information
- Purchase price
- Initial condition
- Delivery reference

### 3. **Update Condition Regularly**
When items move or are serviced:
- Update condition field
- Add notes about maintenance
- Update custodian if reassigned

### 4. **Use Asset IDs for Physical Tagging**
- Print Asset ID labels
- Attach to physical items
- Use for inventory audits
- Scan during transfers

---

## Summary

| Aspect | Old System | New System |
|--------|-----------|------------|
| **Item Creation** | Manual in Items tab | Automatic at receipt |
| **Tracking** | Bulk quantities | Individual items |
| **Asset ID** | One per item type | One per physical item |
| **Quantity** | Aggregated (e.g., 10) | Always 1 per record |
| **Issuing** | Reduce quantity | Mark specific item |
| **Accountability** | Group level | Individual level |

---

## Quick Reference

### To Add New Items:
1. Go to **Items Received** → **Record Items Received**
2. Select **"Receive New Item Type"**
3. Enter item details + quantity
4. System creates individual records with Asset IDs

### To Receive More Units:
1. Go to **Items Received** → **Record Items Received**
2. Select **"Add to Existing Item"**
3. Pick category and item
4. Enter quantity
5. System creates more individual records

### To View All Items:
1. Go to **Items** tab
2. See all individual items with Asset IDs
3. Use filters and search to find specific items

### To Issue Items:
1. Go to **Items Issued**
2. Select individual items to issue
3. Each marked separately with full tracking
