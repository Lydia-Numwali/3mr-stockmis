# Logistics Management System Transformation Plan
## Centurion Group Rwanda - Security Company Logistics

### Executive Summary
Transform the motorcycle spare parts wholesale system into a comprehensive Logistics Management System for Centurion Group Rwanda, a private security company in Rwanda. The system will track all company assets and consumable inventory from receipt to issuance to staff, departments, and security sites.

---

## 1. Business Domain Research

### Centurion Group Rwanda Services
Based on research, Centurion Group Rwanda provides:
- Highly trained security guard services
- State-of-the-art surveillance technology
- Modern security equipment
- Flexible security solutions for businesses
- On-site security presence at client locations

### Logistics Requirements for Security Companies
Security companies require robust inventory management for:
- **Personnel Equipment**: Uniforms, protective gear, communication devices
- **Site Equipment**: Surveillance cameras, access control systems, patrol equipment
- **Consumables**: Stationery, cleaning supplies, batteries
- **IT Assets**: Computers, radios, charging equipment
- **Vehicle Equipment**: Patrol vehicle supplies, fuel management
- **Safety Equipment**: First aid kits, fire extinguishers, emergency supplies

---

## 2. Terminology Transformation Map

### Core Modules
| Old Term | New Term | Context |
|----------|----------|---------|
| Products | Logistics Items | All tracked inventory |
| Purchases | Items Received | Incoming inventory from suppliers |
| Sales | Items Issued | Outgoing inventory to employees/sites |
| Purchase Order | Receiving Record | Documentation of items received |
| Sale Order | Issue Record | Documentation of items issued |
| Customer | Employee/Department/Site | Recipients of issued items |
| Supplier | Vendor/Supplier | Sources of inventory |
| Stock | Logistics Inventory | Current inventory levels |
| Wholesale Price | Standard Unit Cost | Internal valuation |
| Retail Price | Issue Value | Valuation when issued |

### Entity-Level Renaming
- `Product` → `LogisticsItem`
- `Purchase` → `ItemReceived`
- `Sale` → `ItemIssued`
- `Lending` → Will evolve to `ItemReturn` for returned items module

---

## 3. Database Schema Updates

### LogisticsItem Categories (replacing ProductCategory)
```typescript
export enum LogisticsItemCategory {
  SECURITY_UNIFORMS = 'Security Uniforms',
  PROTECTIVE_EQUIPMENT = 'Protective Equipment',
  COMMUNICATION_EQUIPMENT = 'Communication Equipment',
  SECURITY_ACCESSORIES = 'Security Accessories',
  OFFICE_SUPPLIES = 'Office Supplies',
  CLEANING_SUPPLIES = 'Cleaning Supplies',
  PATROL_EQUIPMENT = 'Patrol Equipment',
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  STATIONERY = 'Stationery',
  IT_EQUIPMENT = 'IT Equipment',
  VEHICLE_EQUIPMENT = 'Vehicle Equipment',
  EMERGENCY_EQUIPMENT = 'Emergency Equipment',
  MAINTENANCE_TOOLS = 'Maintenance Tools',
  CONSUMABLES = 'Consumables',
  MISCELLANEOUS_ASSETS = 'Miscellaneous Assets',
}
```

### ItemReceived Entity (replacing Purchase)
- `quantityPurchased` → `quantityReceived`
- `purchaseDate` → `receivingDate`
- Add: `deliveryReference` (tracking number)
- Add: `warehouse` (storage location)
- Add: `receivedBy` (staff member who received)
- Keep: `supplier`, `notes`

### ItemIssued Entity (replacing Sale)
- Remove: `saleType` (RETAIL/WHOLESALE not relevant)
- `quantitySold` → `quantityIssued`
- `customerName` → `issuedTo` (employee name)
- `saleDate` → `issueDate`
- Add: `department` (which department)
- Add: `securitySite` (which site/branch)
- Add: `issuedBy` (staff who issued)
- Add: `approvedBy` (optional approval)
- Add: `purpose` (reason for issue)
- Remove payment status fields (not applicable to internal logistics)

### ItemReturn Entity (new - repurposing Lending)
```typescript
export enum ReturnReason {
  DAMAGED = 'Damaged',
  DEFECTIVE = 'Defective',
  WORN_OUT = 'Worn Out',
  INCORRECT_ITEM = 'Incorrect Item Issued',
  EXPIRED = 'Expired',
  NO_LONGER_NEEDED = 'No Longer Needed',
  REPLACEMENT_REQUIRED = 'Replacement Required',
  MAINTENANCE_REQUIRED = 'Maintenance Required',
}

export enum ItemCondition {
  GOOD = 'Good',
  NEEDS_REPAIR = 'Needs Repair',
  DAMAGED = 'Damaged',
  DEFECTIVE = 'Defective',
  BEYOND_REPAIR = 'Beyond Repair',
  PENDING_INSPECTION = 'Pending Inspection',
}
```

---

## 4. Sample Logistics Items

### Security Uniforms
- Security Uniform Shirt (Long Sleeve)
- Security Uniform Shirt (Short Sleeve)
- Security Uniform Trousers
- Security Uniform Cap
- Beret (Black)
- Security Belt (Leather)
- Name Badge
- Company Insignia Patch

### Protective Equipment (PPE)
- Safety Boots (Black)
- Reflective Vest (High Visibility)
- Reflective Jacket
- Safety Gloves (Black)
- Raincoat (Security)
- Safety Helmet
- Protective Goggles

### Security Accessories
- Whistle (Metal)
- Baton (Standard Security)
- Handcuffs (Standard)
- Torch/Flashlight (LED)
- Flashlight Batteries (D-size)
- Duty Belt with Holsters
- Security Armband

### Communication Equipment
- Two-Way Radio (Handheld)
- Radio Battery (Rechargeable)
- Radio Charger
- Radio Earpiece
- Walkie-Talkie Set
- Mobile Phone (Duty)
- Phone Charger

### Office Supplies
- Notebook (A5 Logbook)
- Pen (Black Ink)
- Pen (Blue Ink)
- Marker (Permanent)
- Clipboard
- File Folder
- Stamp Pad
- Report Forms (Security Incident)

### Patrol Equipment
- Patrol Bag
- First Aid Kit (Portable)
- Fire Extinguisher (2kg)
- Emergency Light
- Patrol Checkpoint Scanner
- Incident Report Book

### Cleaning Supplies
- Cleaning Detergent (Liquid)
- Mop (Floor)
- Bucket (Plastic)
- Broom
- Dustpan
- Garbage Bags (Large)
- Hand Sanitizer (500ml)
- Toilet Paper

### IT Equipment
- Desktop Computer
- Laptop Computer
- Computer Monitor
- Computer Mouse
- Keyboard
- Printer (Laser)
- Printer Cartridge (Black)
- USB Flash Drive (16GB)
- Ethernet Cable (5m)

### Vehicle Equipment
- Vehicle Tyre (Patrol Car)
- Fuel Voucher
- Vehicle First Aid Kit
- Fire Extinguisher (Vehicle)
- Traffic Cone
- Warning Triangle
- Vehicle Toolkit

### Emergency Equipment
- First Aid Box (Complete)
- Fire Extinguisher (9kg)
- Emergency Siren
- Megaphone
- Emergency Exit Sign
- Fire Blanket
- Emergency Whistle

---

## 5. Workflow Updates

### Items Received Workflow
1. Supplier delivers items to warehouse
2. Logistics officer records:
   - Supplier name
   - Delivery reference number
   - Receiving date
   - Warehouse location
   - Item details
   - Quantity received
   - Unit cost
   - Received by (staff name)
   - Remarks
3. System automatically increases inventory quantity
4. System records audit trail

### Items Issued Workflow
1. Department/site requests items
2. Logistics officer records:
   - Employee name (who receives)
   - Department
   - Security site/branch
   - Issue date
   - Item details
   - Quantity issued
   - Issued by (staff name)
   - Approved by (optional)
   - Purpose of issue
   - Remarks
3. System validates sufficient inventory
4. System automatically decreases inventory quantity
5. System records audit trail

### Returned Items Workflow
1. Employee returns item to logistics
2. Logistics officer records:
   - Return reference number
   - Return date
   - Item details
   - Quantity returned
   - Employee returning
   - Department/site
   - Original issue reference (if traceable)
   - Return reason
   - Item condition
   - Received by (staff name)
   - Remarks
3. System updates inventory based on condition:
   - **Good**: Return to available inventory
   - **Needs Repair**: Move to repair/maintenance stock
   - **Damaged/Defective**: Move to damaged stock area
   - **Beyond Repair**: Mark for disposal (exclude from available inventory)
4. If replacement needed, system allows issuing replacement
5. System maintains complete audit trail

---

## 6. Dashboard Metrics

### Primary Metrics
- Total Logistics Items (count of item types)
- Total Categories (count)
- Total Items Received (this month)
- Total Items Issued (this month)
- Current Inventory Value
- Low Stock Items (count)
- Out of Stock Items (count)

### Activity Metrics
- Recent Receiving Activity (last 10 transactions)
- Recent Issue Activity (last 10 transactions)
- Recent Returns (last 10 transactions)
- Pending Inspections (returned items)

### Status Indicators
- Items In Stock (green)
- Items Low Stock (orange/yellow)
- Items Out of Stock (red)
- Items Under Repair (blue)
- Items Pending Disposal (grey)

---

## 7. Reports Structure

### Items Received Report
- Date range filter
- Supplier filter
- Category filter
- Warehouse filter
- Shows: Date, Item, Supplier, Quantity, Unit Cost, Total Cost, Received By

### Items Issued Report
- Date range filter
- Department filter
- Security site filter
- Employee filter
- Category filter
- Shows: Date, Item, Issued To, Department, Site, Quantity, Purpose, Issued By

### Current Stock Report
- Category filter
- Warehouse filter
- Stock status filter (In Stock / Low / Out of Stock)
- Shows: Item, Category, Available Qty, Min Stock Level, Unit, Status, Last Received, Last Issued

### Inventory Movement Report
- Date range filter
- Item filter
- Shows: Date, Item, Movement Type (Received/Issued/Returned), Quantity, Balance, Reference

### Low Stock Report
- Items where available quantity <= minimum stock level
- Shows: Item, Current Qty, Min Stock Level, Warehouse, Last Received Date

### Supplier Report
- Summary by supplier
- Shows: Supplier, Total Items Supplied, Total Value, Last Supply Date

### Employee Issue Report
- Summary by employee
- Shows: Employee, Department, Total Items Issued, Issue Dates

### Category Report
- Summary by category
- Shows: Category, Total Items, Total Quantity in Stock, Total Value

### Returned Items Report
- Date range filter
- Return reason filter
- Condition filter
- Shows: Date, Item, Returned By, Reason, Condition, Replacement Status

### Damaged Items Report
- Shows: Item, Quantity Damaged, Date Reported, Condition, Status (Under Repair/Awaiting Disposal)

### Repair & Maintenance Report
- Shows: Item, Quantity, Date Sent to Repair, Expected Return, Status

### Replacement History Report
- Shows: Original Item, Return Date, Replacement Item, Replacement Date, Employee

### Disposal Report
- Shows: Item, Quantity Disposed, Date, Reason, Approved By

---

## 8. User Interface Updates

### Navigation Structure
- Dashboard
- **Logistics Items** (was Products)
- **Items Received** (was Purchases)
- **Items Issued** (was Sales)
- **Returns & Replacements** (new module)
- **Inventory** (was Stock)
- **Reports**
- **Settings**

### Icons Update
- Logistics Items: Package/Box icon
- Items Received: Truck/Delivery icon
- Items Issued: Hand/User icon or Arrow-right icon
- Returns: Rotate/Return icon
- Inventory: Warehouse/Stack icon
- Reports: Chart/Document icon

### Form Labels
All forms updated to reflect logistics terminology:
- "Add New Logistics Item" (not "Add Product")
- "Record Items Received" (not "Record Purchase")
- "Issue Items" (not "Make Sale")
- "Record Returned Items" (not visible before)

### Empty States
- "No logistics items yet. Start by adding your first item."
- "No receiving records yet. Record items received from suppliers."
- "No issue records yet. Issue items to employees or departments."
- "No returned items. Process returns here when items come back."

---

## 9. Stock Status Logic

```typescript
export enum StockStatus {
  IN_STOCK = 'In Stock',       // quantity > lowStockThreshold
  LOW_STOCK = 'Low Stock',     // quantity > 0 && quantity <= lowStockThreshold
  OUT_OF_STOCK = 'Out of Stock', // quantity === 0
  UNDER_REPAIR = 'Under Repair',    // items in repair queue
  DAMAGED = 'Damaged',         // items marked as damaged
}
```

---

## 10. Implementation Phases

### Phase 1: Backend Entity Transformation
1. Rename entity files and classes
2. Update enums (categories, statuses)
3. Update entity fields
4. Generate and run migrations
5. Update services, controllers, DTOs

### Phase 2: Backend API Updates
1. Update API endpoints and routes
2. Update service logic
3. Update validation rules
4. Add new endpoints for returns module

### Phase 3: Frontend Type Updates
1. Update TypeScript types/interfaces
2. Update service files
3. Update hooks

### Phase 4: Frontend UI Transformation
1. Update navigation and routes
2. Update page components
3. Update forms and inputs
4. Update tables and lists
5. Update dashboard

### Phase 5: Internationalization
1. Update English translations
2. Update Kinyarwanda translations
3. Update all labels, messages, tooltips

### Phase 6: Sample Data
1. Create seed data with logistics items
2. Update database seed script
3. Test with realistic security company data

### Phase 7: Documentation
1. Update README files
2. Create user guide
3. Update API documentation

---

## 11. Key Files to Update

### Backend Files
- `backend/src/entities/*.entity.ts` - All entity files
- `backend/src/*/` - All module directories (rename and update)
- `backend/src/seed.ts` - Sample data
- `backend/package.json` - Project description

### Frontend Files
- `frontend/types/*.ts` - Type definitions
- `frontend/services/*.ts` - API services
- `frontend/hooks/*.ts` - React hooks
- `frontend/utils/*.ts` - Utilities and constants
- `frontend/messages/*.json` - Translations
- `frontend/app/[locale]/*` - All page components
- `frontend/components/*` - All components

### Root Files
- `README.md` - Project description
- `docker-compose.yml` - Service descriptions
- `package.json` files - Project metadata

---

## 12. Preservation Strategy

### Keep Unchanged
- Authentication system
- User management
- Database connection setup
- API architecture (NestJS)
- Frontend framework (Next.js)
- UI component library
- Form validation patterns
- Report generation logic
- Export functionality

### Adapt and Rename
- Entity names and fields
- API routes and endpoints
- Service method names
- Component names
- Navigation structure
- Form labels
- Table columns
- Dashboard metrics

### Add New Features
- Returns module
- Item condition tracking
- Replacement workflow
- Repair/maintenance tracking
- Disposal management
- Enhanced audit trails

---

## Success Criteria

✅ All motorcycle spare parts terminology removed
✅ Security company logistics terminology implemented
✅ Sample data reflects realistic security operations
✅ Dashboard shows relevant logistics metrics
✅ Returns module fully functional
✅ All reports adapted to logistics context
✅ UI feels like enterprise logistics system
✅ No broken functionality from original system
✅ Database migrations run successfully
✅ Documentation updated

---

**Prepared for:** Centurion Group Rwanda Logistics Management System
**Transformation Type:** Business Domain Repurposing
**Preserve:** Architecture, Authentication, Core Functionality
**Transform:** Terminology, Workflows, Sample Data, UI/UX
