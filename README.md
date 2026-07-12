# Centurion Group Rwanda - Logistics Management System

A comprehensive logistics and inventory management system designed for Centurion Group Rwanda, a private security company. This system tracks all company assets and consumable inventory from receipt through issuance to employees, departments, and security sites.

## Overview

The Logistics Management System manages:
- **Logistics Items**: All trackable company assets and consumables
- **Items Received**: Incoming inventory from suppliers/vendors
- **Items Issued**: Outgoing inventory to employees, departments, and security sites
- **Returns & Replacements**: Returned items with condition tracking and replacement workflow
- **Inventory Management**: Real-time inventory levels and stock status
- **Comprehensive Reporting**: Audit trails and operational insights

## Features

### Core Modules
- ✅ **Logistics Items Management** - Track all company assets by category
- ✅ **Receiving Module** - Record items received from suppliers
- ✅ **Issuing Module** - Issue items to employees and sites
- ✅ **Returns Module** - Process returns with condition tracking
- ✅ **Inventory Tracking** - Real-time stock levels and status
- ✅ **Dashboard** - Key metrics and recent activity
- ✅ **Reports** - Comprehensive reporting suite

### Logistics Item Categories
- Security Uniforms
- Protective Equipment (PPE)
- Communication Equipment
- Security Accessories
- Office Supplies
- Cleaning Supplies
- Patrol Equipment
- Electronics & IT Equipment
- Furniture
- Vehicle Equipment
- Emergency Equipment
- Maintenance Tools
- Consumables
- Miscellaneous Assets

### Key Workflows
1. **Items Received**: Supplier → Warehouse → Inventory Increase
2. **Items Issued**: Request → Approval → Issue → Inventory Decrease
3. **Item Returns**: Return → Inspection → Restock/Repair/Replace/Dispose

## Technology Stack

### Backend
- NestJS (Node.js Framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- JWT Authentication

### Frontend
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- React Hook Form
- Recharts (Data Visualization)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd 3mr-stockmis
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your database connection in .env
npm run start:dev
```

3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint in .env
npm run dev
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Documentation

- [Transformation Plan](./LOGISTICS_TRANSFORMATION_PLAN.md) - Detailed transformation documentation
- [Backend README](./backend/README.md) - Backend setup and API docs
- [Quick Start Guide](./QUICK_START.md) - Quick setup guide

## Security Features

- Role-based access control
- JWT authentication
- Secure password hashing
- Audit trail for all transactions
- Session management

## Reports Available

- Items Received Report
- Items Issued Report
- Current Stock Report
- Inventory Movement Report
- Low Stock Alert Report
- Supplier Report
- Employee Issue Report
- Category Summary Report
- Returned Items Report
- Damaged Items Report
- Repair & Maintenance Report
- Disposal Report

## Support

For support and questions, please contact the development team or refer to the documentation.

## License

Proprietary - Centurion Group Rwanda

---

**Built for:** Centurion Group Rwanda  
**Purpose:** Internal Logistics & Inventory Management  
**Status:** Active Development
