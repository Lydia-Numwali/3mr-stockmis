# Quick Reference Card
## Centurion Group Rwanda Logistics Management System

**Last Updated**: July 12, 2026  
**Status**: Phases 1 & 2 Complete

---

## 📌 Quick Links

- **Start Here**: `DEVELOPER_GUIDE.md`
- **Field Names**: `TERMINOLOGY_REFERENCE.md`
- **Test Backend**: `TEST_PHASE_2.md`
- **Sample Data**: `SAMPLE_LOGISTICS_ITEMS.md`
- **Full Plan**: `LOGISTICS_TRANSFORMATION_PLAN.md`

---

## 🔄 Field Name Quick Lookup

### Products → Logistics Items
```typescript
partType → itemType
wholesalePrice → standardUnitCost
retailPrice → issueValue
storageLocation → warehouse
```

### Purchases → Items Received
```typescript
quantityPurchased → quantityReceived
purchaseDate → receivingDate
+ deliveryReference (NEW)
+ warehouse (NEW)
+ receivedBy (NEW)
```

### Sales → Items Issued
```typescript
quantitySold → quantityIssued
customerName → issuedTo
saleDate → issueDate
+ department (NEW)
+ securitySite (NEW)
+ issuedBy (NEW)
+ approvedBy (NEW)
+ purpose (NEW)
```

### Lending → Returns
```typescript
quantityLent → quantityReturned
borrowerShop → returnedBy
dateLent → returnDate
+ returnReason (NEW)
+ itemCondition (NEW)
+ returnReference (NEW)
+ department (NEW)
+ securitySite (NEW)
```

---

## 🎯 New Enums

### LogisticsItemCategory (16 values)
```
Security Uniforms | Protective Equipment | Communication Equipment
Security Accessories | Office Supplies | Cleaning Supplies
Patrol Equipment | Electronics | Furniture | Stationery
IT Equipment | Vehicle Equipment | Emergency Equipment
Maintenance Tools | Consumables | Miscellaneous Assets
```

### StockStatus (5 values)
```
In Stock | Low Stock | Out of Stock | Under Repair | Damaged
```

### ReturnReason (10 values)
```
Damaged | Defective | Worn Out | Incorrect Item Issued
Expired | No Longer Needed | Replacement Required
Maintenance Required | End of Assignment | Excess Quantity
```

### ItemCondition (6 values)
```
Good | Needs Repair | Damaged | Defective
Beyond Repair | Pending Inspection
```

### ReturnStatus (6 values)
```
Received | Inspected | Restocked | Sent for Repair
Replaced | Disposed
```

---

## 🛣️ API Endpoints

### Logistics Items (Products)
```
GET    /products                   List all items
GET    /products/most-issued      Most issued items
GET    /products/low-stock        Low stock alerts
GET    /products/out-of-stock     Out of stock items
GET    /products/:id              Single item
POST   /products                  Create item
PUT    /products/:id              Update item
DELETE /products/:id              Delete item
```

### Items Received (Purchases)
```
GET    /purchases                 List all
GET    /purchases/summary         Receiving summary
GET    /purchases/by-supplier     Supplier analysis
POST   /purchases                 Record receipt
POST   /purchases/bulk            Bulk receiving
```

### Items Issued (Sales)
```
GET    /sales                     List all
GET    /sales/issue-summary       Issue summary
GET    /sales/by-department       Department analysis
GET    /sales/by-site             Site analysis
POST   /sales                     Issue items
POST   /sales/bulk                Bulk issuing
```

### Returns (Lending)
```
GET    /lending                   List all returns
GET    /lending/pending-inspection Pending inspection
GET    /lending/under-repair      Under repair
GET    /lending/damaged           Damaged items
GET    /lending/summary           Return summary
POST   /lending                   Process return
PUT    /lending/:id/inspect       Inspect return
POST   /lending/:id/replacement   Issue replacement
```

---

## 🔧 Common Code Snippets

### Create Logistics Item
```typescript
const item = {
  name: "Security Uniform Shirt",
  category: "Security Uniforms",
  standardUnitCost: 15000,
  issueValue: 0,
  warehouse: "Main Warehouse",
  quantity: 100,
  lowStockThreshold: 20
};
```

### Record Items Received
```typescript
const receipt = {
  productId: 1,
  quantityReceived: 50,
  pricePerUnit: 15000,
  supplier: "Centurion Textiles",
  deliveryReference: "DEL-2026-001",
  warehouse: "Main Warehouse",
  receivedBy: "John Doe"
};
```

### Issue Items
```typescript
const issue = {
  productId: 1,
  quantityIssued: 10,
  priceUsed: 15000,
  issuedTo: "Jane Smith",
  department: "Security Operations",
  securitySite: "Kigali Branch",
  issuedBy: "John Doe",
  purpose: "New hire uniform"
};
```

### Process Return
```typescript
const return = {
  productId: 1,
  quantityReturned: 2,
  returnedBy: "Jane Smith",
  department: "Security Operations",
  returnReason: "WORN_OUT",
  itemCondition: "GOOD",
  receivedBy: "John Doe"
};
```

---

## 📊 Inventory Logic

### Items Received
```
product.quantity += quantityReceived
```

### Items Issued
```
if (product.quantity >= quantityIssued) {
  product.quantity -= quantityIssued
} else {
  throw "Insufficient stock"
}
```

### Returns (Condition-Based)
```
if (itemCondition === "GOOD") {
  product.quantity += quantityReturned  // Restock
} else {
  // Hold for inspection/repair/disposal
  // Do NOT add to available inventory
}
```

### Replacement
```
// After issuing replacement:
product.quantity -= quantityReturned
returnRecord.replacementIssued = true
returnRecord.status = "REPLACED"
```

---

## ✅ Phase Checklist

### Phase 1: Entities ✅
- [x] Product → LogisticsItem
- [x] Purchase → ItemReceived
- [x] Sale → ItemIssued
- [x] Lending → ItemReturn

### Phase 2: Services ✅
- [x] Products service
- [x] Purchases service
- [x] Sales service
- [x] Lending service

### Phase 3: Frontend Types ⏳
- [ ] Update type definitions
- [ ] Create new interfaces
- [ ] Update API response types

### Phase 4: Frontend Services ⏳
- [ ] Update API calls
- [ ] Update field names
- [ ] Add new endpoints

---

## 🎯 Testing Commands

### Start Backend
```bash
cd backend
npm run start:dev
```

### Test API
```bash
# Get all items
curl http://localhost:3001/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create item
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Item",...}'
```

### Check Database
```sql
SELECT * FROM products LIMIT 10;
SELECT * FROM purchases LIMIT 10;
SELECT * FROM sales LIMIT 10;
SELECT * FROM lendings LIMIT 10;
```

---

## 🚨 Common Issues

### Issue: Computed column errors
**Fix**: Check entity expressions use new field names

### Issue: Validation errors
**Fix**: Check DTOs have @IsOptional() for new fields

### Issue: Old names not working
**Fix**: Check service maps old → new field names

### Issue: Repository not found
**Fix**: Check module imports (Sale repo in LendingModule)

---

## 📱 Contact & Help

### Documentation
- Full Guide: `DEVELOPER_GUIDE.md`
- Test Guide: `TEST_PHASE_2.md`
- Terminology: `TERMINOLOGY_REFERENCE.md`

### Status
- Current Phase: 2 (Complete)
- Next Phase: 3 (Frontend Types)
- Progress: 30%

---

**Quick Start**: Read `DEVELOPER_GUIDE.md` → Test with `TEST_PHASE_2.md` → Start Phase 3
