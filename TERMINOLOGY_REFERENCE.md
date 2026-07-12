# Terminology Reference Guide
## Centurion Group Rwanda Logistics Management System

### Quick Reference: Old vs New Terminology

| Context | Old Term | New Term | Notes |
|---------|----------|----------|-------|
| **General** |
| | Product | Logistics Item | Any trackable inventory item |
| | Stock | Logistics Inventory | Current inventory levels |
| | Spare Parts | Assets/Equipment | Company assets and consumables |
| **Transactions** |
| | Purchase | Items Received | Incoming inventory transaction |
| | Purchase Order | Receiving Record | Documentation of receipt |
| | Sale | Items Issued | Outgoing inventory transaction |
| | Sale Order | Issue Record | Documentation of issuance |
| | Customer | Employee/Department/Site | Recipients of issued items |
| | Invoice | Issue Receipt | Internal document |
| **People & Entities** |
| | Customer Name | Issued To | Employee receiving items |
| | Supplier | Vendor/Supplier | Source of items |
| | Borrower | Employee/Staff | Person handling items |
| | Shop | Department/Site | Organizational unit |
| **Operations** |
| | Selling | Issuing | Internal distribution |
| | Buying/Purchasing | Receiving | Incoming items |
| | Lending | Item Return | Return workflow |
| | Stock Taking | Inventory Count | Physical inventory verification |
| **Financial** |
| | Wholesale Price | Standard Unit Cost | Internal valuation |
| | Retail Price | Issue Value | Value at issue |
| | Sales Revenue | Issue Value | Internal accounting |
| | Purchase Cost | Receiving Cost | Cost of acquisition |
| **Locations** |
| | Store | Warehouse | Storage facility |
| | Storage Location | Warehouse | Where items are kept |
| | Shop Location | Security Site/Branch | Field locations |
| **Item Properties** |
| | Part Type | Item Type | Classification |
| | Part Number | Item Code | Identifier |
| | Model | Model | Equipment model |
| | Brand | Brand | Manufacturer/Brand |
| **Quantities** |
| | Quantity Purchased | Quantity Received | Items coming in |
| | Quantity Sold | Quantity Issued | Items going out |
| | Quantity Lent | Quantity Returned | Items coming back |
| | Stock Level | Inventory Level | Current quantity |
| **Dates** |
| | Purchase Date | Receiving Date | When items arrived |
| | Sale Date | Issue Date | When items were distributed |
| | Recording Date | Transaction Date | When recorded in system |
| **Status** |
| | In Stock | In Stock | Available inventory |
| | Out of Stock | Out of Stock | No inventory |
| | Low Stock | Low Stock | Below threshold |
| | N/A | Under Repair | Items being repaired |
| | N/A | Damaged | Non-functional items |

---

## Module Name Changes

| Old Module | New Module | Purpose |
|-----------|------------|---------|
| Products | Logistics Items | Manage all trackable items |
| Purchases | Items Received | Record incoming inventory |
| Sales | Items Issued | Record outgoing inventory |
| Lending | Returns & Replacements | Handle returned items |
| Stock | Inventory | View current stock levels |
| Reports | Reports | Generate various reports |
| Dashboard | Dashboard | Overview and metrics |

---

## Report Name Changes

| Old Report Name | New Report Name | Purpose |
|----------------|-----------------|---------|
| Purchase Report | Items Received Report | Incoming inventory summary |
| Sales Report | Items Issued Report | Outgoing inventory summary |
| Stock Report | Current Stock Report | Inventory levels |
| Product List | Logistics Items List | All tracked items |
| Low Stock Report | Low Stock Alert Report | Items needing reorder |
| Supplier Report | Supplier/Vendor Report | Supplier performance |
| Customer Report | Employee Issue Report | Who received what |
| N/A | Inventory Movement Report | All transactions |
| N/A | Category Summary Report | By category analysis |
| N/A | Returned Items Report | Return tracking |
| N/A | Damaged Items Report | Damaged inventory |
| N/A | Disposal Report | Items disposed |

---

## Field Name Changes by Entity

### Logistics Item (formerly Product)

| Old Field | New Field | Type | Purpose |
|-----------|-----------|------|---------|
| category | category | LogisticsItemCategory | Item classification |
| partType | itemType | string | Type of item |
| wholesalePrice | standardUnitCost | decimal | Internal cost |
| retailPrice | issueValue | decimal | Value at issue |
| storageLocation | warehouse | string | Storage facility |

### Items Received (formerly Purchase)

| Old Field | New Field | Type | Purpose |
|-----------|-----------|------|---------|
| quantityPurchased | quantityReceived | number | Quantity received |
| purchaseDate | receivingDate | date | Date received |
| - | deliveryReference | string | Tracking number (NEW) |
| - | warehouse | string | Storage location (NEW) |
| - | receivedBy | string | Staff who received (NEW) |

### Items Issued (formerly Sale)

| Old Field | New Field | Type | Purpose |
|-----------|-----------|------|---------|
| quantitySold | quantityIssued | number | Quantity issued |
| customerName | issuedTo | string | Employee name |
| saleDate | issueDate | date | Date issued |
| saleType | (removed) | - | Not applicable |
| - | department | string | Department (NEW) |
| - | securitySite | string | Site/branch (NEW) |
| - | issuedBy | string | Staff who issued (NEW) |
| - | approvedBy | string | Approver (NEW) |
| - | purpose | string | Reason for issue (NEW) |

### Items Returned (formerly Lending)

| Old Field | New Field | Type | Purpose |
|-----------|-----------|------|---------|
| quantityLent | quantityReturned | number | Quantity returned |
| borrowerShop | returnedBy | string | Employee returning |
| borrowerContact | contactInfo | string | Contact info |
| dateLent | returnDate | date | Date returned |
| status | status | ReturnStatus | Return status |
| - | returnReference | string | Tracking number (NEW) |
| - | department | string | Department (NEW) |
| - | securitySite | string | Site (NEW) |
| - | returnReason | ReturnReason | Why returned (NEW) |
| - | itemCondition | ItemCondition | Condition (NEW) |
| - | receivedBy | string | Who received (NEW) |
| - | inspectedBy | string | Who inspected (NEW) |
| - | replacementIssued | boolean | Replacement given (NEW) |

---

## New Enums & Categories

### Logistics Item Categories (16 total)
1. Security Uniforms
2. Protective Equipment
3. Communication Equipment
4. Security Accessories
5. Office Supplies
6. Cleaning Supplies
7. Patrol Equipment
8. Electronics
9. Furniture
10. Stationery
11. IT Equipment
12. Vehicle Equipment
13. Emergency Equipment
14. Maintenance Tools
15. Consumables
16. Miscellaneous Assets

### Stock Status (5 states)
1. In Stock - Sufficient quantity
2. Low Stock - Below threshold
3. Out of Stock - Zero quantity
4. Under Repair - Items being repaired
5. Damaged - Non-functional items

### Return Reasons (10 reasons)
1. Damaged
2. Defective
3. Worn Out
4. Incorrect Item Issued
5. Expired
6. No Longer Needed
7. Replacement Required
8. Maintenance Required
9. End of Assignment
10. Excess Quantity

### Item Condition (6 conditions)
1. Good - Can be restocked
2. Needs Repair - Repairable
3. Damaged - Functional issues
4. Defective - Manufacturing defect
5. Beyond Repair - Must dispose
6. Pending Inspection - Awaiting check

### Return Status (6 statuses)
1. Received - Just returned
2. Inspected - Condition assessed
3. Restocked - Back in inventory
4. Sent for Repair - Under repair
5. Replaced - Replacement issued
6. Disposed - Removed from inventory

---

## UI Label Changes

### Navigation
- "Products" → "Logistics Items"
- "Add Product" → "Add Logistics Item"
- "Purchases" → "Items Received"
- "Record Purchase" → "Record Receipt"
- "Sales" → "Items Issued"
- "Make Sale" → "Issue Items"
- "Lending" → "Returns"
- "Record Lending" → "Process Return"
- "Stock" → "Inventory"

### Buttons
- "New Product" → "New Item"
- "Purchase" → "Receive Items"
- "Sell" → "Issue Items"
- "Lend" → "Return Items"

### Form Labels
- "Product Name" → "Item Name"
- "Purchase Quantity" → "Quantity Received"
- "Sale Quantity" → "Quantity Issued"
- "Customer" → "Issued To"
- "Supplier" → "Supplier/Vendor"

---

## User Role Context

### Who Uses What

| User Role | Primary Modules | Common Actions |
|-----------|----------------|----------------|
| Logistics Officer | All modules | Receive, Issue, Process Returns |
| Warehouse Staff | Items Received, Inventory | Receive items, Stock counts |
| Department Head | Items Issued, Reports | Request items, View reports |
| Security Manager | Dashboard, Reports | Monitor inventory, Approve issues |
| Finance Officer | Reports | Cost analysis, Audit trails |
| System Admin | All + Settings | User management, System config |

---

**Purpose**: Quick reference for understanding the terminology transformation  
**Use Case**: When reading old documentation or transitioning from the old system  
**Updated**: July 12, 2026
