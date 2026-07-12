# Testing Phase 2: Backend Services & Controllers
## Quick Verification Guide

**Purpose**: Verify that all backend transformations work correctly before proceeding to frontend.

---

## Prerequisites

1. Backend server running:
```bash
cd backend
npm run start:dev
```

2. Database connected and migrations applied

3. Authentication token (login first to get JWT)

---

## Test 1: Logistics Items (Products)

### Create a logistics item
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Security Uniform Shirt",
    "category": "Security Uniforms",
    "packagingUnit": "Pieces",
    "standardUnitCost": 15000,
    "issueValue": 0,
    "warehouse": "Main Warehouse",
    "quantity": 100,
    "lowStockThreshold": 20
  }'
```

**Expected**: 201 Created with item data

### Test backward compatibility
```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Two-Way Radio",
    "category": "Communication Equipment",
    "wholesalePrice": 45000,
    "retailPrice": 0,
    "storageLocation": "Electronics Storage",
    "quantity": 50
  }'
```

**Expected**: Should accept old field names (wholesalePrice, storageLocation)

### Get item with stock status
```bash
curl http://localhost:3001/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Response includes `stockStatus: "In Stock"`

### Get low stock items
```bash
curl http://localhost:3001/products/low-stock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: List of items where quantity <= lowStockThreshold

---

## Test 2: Items Received (Purchases)

### Record items received
```bash
curl -X POST http://localhost:3001/purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantityReceived": 50,
    "pricePerUnit": 15000,
    "supplier": "Centurion Textiles",
    "deliveryReference": "DEL-2026-001",
    "warehouse": "Main Warehouse",
    "receivedBy": "John Doe",
    "receivingDate": "2026-07-12"
  }'
```

**Expected**: 
- 201 Created
- Product quantity increased by 50
- Stock movement created

### Verify inventory increased
```bash
curl http://localhost:3001/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: quantity should be 150 (100 + 50)

### Get receiving summary
```bash
curl "http://localhost:3001/purchases/summary?from=2026-07-01&to=2026-07-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Summary with totalReceipts, totalItemsReceived, totalValue

---

## Test 3: Items Issued (Sales)

### Issue items to employee
```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantityIssued": 10,
    "priceUsed": 15000,
    "issuedTo": "Jane Smith",
    "department": "Security Operations",
    "securitySite": "Kigali Branch",
    "issuedBy": "John Doe",
    "approvedBy": "Operations Manager",
    "purpose": "New hire uniform",
    "issueDate": "2026-07-12"
  }'
```

**Expected**:
- 201 Created
- Product quantity decreased by 10
- Stock movement created

### Verify inventory decreased
```bash
curl http://localhost:3001/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: quantity should be 140 (150 - 10)

### Test insufficient stock
```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantityIssued": 1000,
    "priceUsed": 15000,
    "issuedTo": "Test User"
  }'
```

**Expected**: 400 Bad Request - "Insufficient stock. Available: 140, Requested: 1000"

### Get issue by department
```bash
curl http://localhost:3001/sales/by-department \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Department-wise issue summary

---

## Test 4: Returns (Lending)

### Process returned item - Good condition
```bash
curl -X POST http://localhost:3001/lending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantityReturned": 2,
    "returnReference": "RET-2026-001",
    "returnedBy": "Jane Smith",
    "department": "Security Operations",
    "securitySite": "Kigali Branch",
    "returnReason": "END_OF_ASSIGNMENT",
    "itemCondition": "GOOD",
    "receivedBy": "John Doe",
    "returnDate": "2026-07-12"
  }'
```

**Expected**:
- 201 Created
- Product quantity increased by 2 (restocked immediately)
- Return status: "RESTOCKED"

### Verify inventory increased
```bash
curl http://localhost:3001/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: quantity should be 142 (140 + 2)

### Process returned item - Damaged
```bash
curl -X POST http://localhost:3001/lending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantityReturned": 1,
    "returnReference": "RET-2026-002",
    "returnedBy": "Jane Smith",
    "department": "Security Operations",
    "returnReason": "DAMAGED",
    "itemCondition": "DAMAGED",
    "receivedBy": "John Doe"
  }'
```

**Expected**:
- 201 Created
- Product quantity NOT increased (damaged items held separately)
- Return status: "RECEIVED"

### Get pending inspection
```bash
curl http://localhost:3001/lending/pending-inspection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: List of returns with itemCondition: "PENDING_INSPECTION"

### Inspect returned item
```bash
curl -X PUT http://localhost:3001/lending/2/inspect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "itemCondition": "NEEDS_REPAIR",
    "inspectedBy": "Quality Control Officer",
    "notes": "Minor damage, can be repaired"
  }'
```

**Expected**:
- 200 OK
- Return status updated to: "SENT_FOR_REPAIR"

### Issue replacement
```bash
curl -X POST http://localhost:3001/lending/2/replacement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "issuedBy": "John Doe",
    "approvedBy": "Logistics Manager",
    "notes": "Replacement for damaged uniform"
  }'
```

**Expected**:
- 201 Created
- New sale/issue record created
- Product quantity decreased by 1
- Return record updated with replacementIssueId
- Return status: "REPLACED"

### Get return summary
```bash
curl http://localhost:3001/lending/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Summary with totalReturns, totalQuantityReturned, replacementsIssued

---

## Test 5: Backward Compatibility

### Test old field names in purchases
```bash
curl -X POST http://localhost:3001/purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 2,
    "quantityPurchased": 30,
    "pricePerUnit": 45000,
    "supplier": "TechComm Rwanda",
    "purchaseDate": "2026-07-12"
  }'
```

**Expected**: Should accept old field names (quantityPurchased, purchaseDate)

### Test old field names in sales
```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 2,
    "quantitySold": 5,
    "priceUsed": 45000,
    "customerName": "Security Guard",
    "saleDate": "2026-07-12"
  }'
```

**Expected**: Should accept old field names (quantitySold, customerName, saleDate)

---

## Test 6: Analytics Endpoints

### Most issued items
```bash
curl http://localhost:3001/products/most-issued?limit=5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Top 5 most issued items

### Receiving by supplier
```bash
curl http://localhost:3001/purchases/by-supplier?limit=5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Supplier performance summary

### Issue by department
```bash
curl http://localhost:3001/sales/by-department?limit=5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Department-wise issue summary

### Issue by site
```bash
curl http://localhost:3001/sales/by-site?limit=5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: Security site-wise issue summary

### Damaged items
```bash
curl http://localhost:3001/lending/damaged \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected**: List of damaged/defective/beyond repair items

---

## Test 7: Complete Workflow

### Workflow: Receive → Issue → Return → Replace

1. **Receive items** (50 units)
```bash
POST /purchases
{ productId: 1, quantityReceived: 50, ... }
```

2. **Check inventory** (should be +50)
```bash
GET /products/1
```

3. **Issue items** (10 units)
```bash
POST /sales
{ productId: 1, quantityIssued: 10, ... }
```

4. **Check inventory** (should be -10)
```bash
GET /products/1
```

5. **Return damaged item** (1 unit)
```bash
POST /lending
{ productId: 1, quantityReturned: 1, itemCondition: "DAMAGED", ... }
```

6. **Check inventory** (should NOT change - damaged held separately)
```bash
GET /products/1
```

7. **Inspect return**
```bash
PUT /lending/{id}/inspect
{ itemCondition: "BEYOND_REPAIR", ... }
```

8. **Issue replacement** (1 unit)
```bash
POST /lending/{id}/replacement
```

9. **Check final inventory** (should be -1 from replacement)
```bash
GET /products/1
```

**Expected Final Balance**:
- Started: 100
- Received: +50 = 150
- Issued: -10 = 140
- Returned (damaged, not restocked): 0 = 140
- Replacement: -1 = 139

---

## Test 8: Error Handling

### Test missing required fields
```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1
  }'
```

**Expected**: 400 Bad Request with validation errors

### Test invalid product ID
```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 99999,
    "quantityIssued": 10,
    "priceUsed": 1000
  }'
```

**Expected**: 400 Bad Request - "Logistics item not found"

### Test duplicate replacement
```bash
# Issue replacement for same return twice
POST /lending/1/replacement
POST /lending/1/replacement
```

**Expected**: Second request should fail - "Replacement already issued"

---

## Verification Checklist

After running all tests, verify:

- [ ] All endpoints respond correctly
- [ ] Inventory updates work (increase/decrease)
- [ ] Backward compatibility maintained (old field names work)
- [ ] New fields are stored and retrieved correctly
- [ ] Return workflow works (receive → inspect → replace)
- [ ] Condition-based inventory updates work
- [ ] Analytics endpoints return correct data
- [ ] Error handling works as expected
- [ ] Stock movements are created for all transactions
- [ ] Computed fields (totalValue) calculate correctly

---

## Database Verification

Check database directly:

```sql
-- Check products table
SELECT id, name, category, quantity, warehouse, "standardUnitCost", "issueValue" FROM products;

-- Check purchases with new fields
SELECT id, "productId", "quantityReceived", "deliveryReference", warehouse, "receivedBy" FROM purchases;

-- Check sales with new fields
SELECT id, "productId", "quantityIssued", "issuedTo", department, "securitySite", purpose FROM sales;

-- Check returns with new fields
SELECT id, "productId", "quantityReturned", "returnReason", "itemCondition", status, "replacementIssued" FROM lendings;

-- Check stock movements
SELECT id, "productId", type, quantity, notes, "createdAt" FROM stock_movements ORDER BY "createdAt" DESC;
```

---

## Success Criteria

✅ **Phase 2 is successful if:**

1. All API endpoints work without errors
2. Inventory updates correctly for all operations
3. New fields are stored and retrieved properly
4. Backward compatibility works (old field names accepted)
5. Return workflow complete (receive → inspect → replace)
6. Analytics endpoints provide correct data
7. Error handling is appropriate
8. Database records show correct data

---

## Troubleshooting

### Issue: Computed column errors
**Solution**: Check entity files - totalValue expressions use new field names

### Issue: Repository not found
**Solution**: Check module imports - Sale repository added to LendingModule

### Issue: Validation errors on new fields
**Solution**: Check DTOs - new fields should be @IsOptional()

### Issue: Old field names not working
**Solution**: Check service logic - should map old names to new

---

**Test Date**: July 12, 2026  
**Phase**: 2 - Backend Services & Controllers  
**Status**: Ready for Testing  
**Next**: Phase 3 - Frontend Types
