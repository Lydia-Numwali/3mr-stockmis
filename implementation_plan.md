# Motorcycle Spare Parts Stock Management System – Implementation Plan

Full-stack inventory management app for a motorcycle spare parts shop. Backend: NestJS + PostgreSQL + TypeORM. Frontend: React (Vite). Sales tracked for stock/reporting only (no payment processing).

---

## Proposed Changes

### Backend — `backend/`

#### [NEW] Project scaffold

`npx @nestjs/cli new backend` inside `c:\Users\user\3mr-stockmis\`  
Packages to add: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`, `@nestjs/config`, `pdfmake`/`pdf-lib`, `exceljs`.

#### [NEW] `backend/src/config/typeorm.config.ts`
TypeORM data-source config reading from `.env` (host, port, db name, user, password).

#### [NEW] Entities (`backend/src/entities/`)
| File | Description |
|---|---|
| `product.entity.ts` | id, name, category, brand, model, partType, wholesalePrice, retailPrice, costPrice, quantity, supplier, storageLocation, notes, dateRecorded |
| `stock-movement.entity.ts` | id, product (FK), type (IN/OUT/LEND/RETURN), quantity, supplier, purchasePrice, notes, date |
| `sale.entity.ts` | id, product (FK), quantitySold, saleType (RETAIL/WHOLESALE), priceUsed, customerType, date, notes |
| `lending.entity.ts` | id, product (FK), quantityLent, quantityReturned, borrowerShop, borrowerContact, dateLent, expectedReturnDate, returnDate, status (PENDING/RETURNED/OVERDUE), notes |
| `user.entity.ts` | id, username, passwordHash, role |

#### [NEW] Modules
- **AuthModule** – JWT login, `POST /auth/login`, returns access token
- **ProductsModule** – CRUD + search/filter (`GET /products?search=&category=&brand=&supplier=&lowStock=`)
- **StockModule** – `POST /stock/add` (add/increase stock), `GET /stock/movements`
- **SalesModule** – `POST /sales`, `GET /sales?from=&to=&saleType=`
- **LendingModule** – `POST /lending`, `POST /lending/:id/return`, `GET /lending?status=`
- **DashboardModule** – `GET /dashboard/stats` (totals, today's sales, revenue, low-stock count)
- **ReportsModule** – `GET /reports/sales`, `/reports/stock`, `/reports/lending`, `/reports/income`; export endpoints `GET /reports/export/sales?format=pdf|csv` etc.
- **AlertsModule** – inline in dashboard: low-stock items, overdue lends

---

### Frontend — `frontend/`

#### [NEW] Project scaffold
`npm create vite@latest frontend -- --template react` inside `c:\Users\user\3mr-stockmis\`  
Packages: `react-router-dom`, `axios`, `recharts`, `@tanstack/react-query`, `react-hook-form`, `react-hot-toast`, `lucide-react`, `jspdf`, `jspdf-autotable`, `xlsx`.

#### [NEW] Design system & layout
- `src/styles/index.css` – CSS variables (green/dark theme matching references), typography (Inter font), utility classes
- `src/components/Layout/` – `Sidebar.jsx`, `Header.jsx`, `AppLayout.jsx`

#### [NEW] Pages
| Page | Route | Key Features |
|---|---|---|
| Login | `/login` | JWT auth form |
| Dashboard | `/` | Stats cards, line/donut charts, low-stock & overdue alerts |
| Products | `/products` | Table with search/filter, Add/Edit/Delete modals |
| Stock Management | `/stock` | Add stock form, movement history table |
| Sales Records | `/sales` | Record sale form, sales table with filters |
| Lent Products | `/lending` | Lend form, return modal, pending/overdue tabs |
| Reports | `/reports` | Report selector, preview table, PDF/CSV export |
| Settings | `/settings` | Low-stock threshold, user profile |

#### [NEW] API service layer
`src/services/api.js` – axios instance with JWT interceptor  
Per-module hooks using React Query.

---

## Verification Plan

### Automated Tests
No existing test suite. The project is brand new.

**Backend smoke tests (manual via curl/browser after `npm run start:dev`):**
```
POST http://localhost:3001/auth/login  { "username": "admin", "password": "admin123" }
GET  http://localhost:3001/products    (with Authorization: Bearer <token>)
POST http://localhost:3001/products    (add product)
POST http://localhost:3001/stock/add   (add stock)
POST http://localhost:3001/sales       (record sale)
POST http://localhost:3001/lending     (lend item)
GET  http://localhost:3001/dashboard/stats
GET  http://localhost:3001/reports/sales
```

### Browser Verification (via browser subagent)
After both servers are running (`npm run start:dev` in backend, `npm run dev` in frontend):
1. Navigate to `http://localhost:5173` → should redirect to login  
2. Log in with seeded admin credentials → land on Dashboard  
3. Add a product → appears in Products table  
4. Add stock → product quantity increases  
5. Record a sale → stock reduces, sale appears in Sales Records  
6. Lend a product → appears in Lent Products pending list  
7. Return lent product → stock increases  
8. Navigate to Reports → generate and export PDF/CSV  
9. Check low-stock alert on dashboard  
