# Asset ID Feature Implementation

## Overview
Implemented automatic Asset ID generation for logistics items with the format: **CAL-XXX-NNN-YYYY**

## Format Breakdown
- **CAL** - Fixed prefix (Centurion Asset Logistics)
- **XXX** - 2-3 letter abbreviation from item name (e.g., CHA for Chair, COM for Computer)
- **NNN** - Sequential 3-digit number (001, 002, etc.)
- **YYYY** - Year when item was created (e.g., 2026)

## Examples
- Chair → `CAL-CHA-001-2026`
- Computer Laptop → `CAL-COM-001-2026`
- Security Guard Uniform → `CAL-SEC-001-2026`
- Two-Way Radio → `CAL-TWO-001-2026`

## Features

### Backend (Auto-Generation)
- **Location**: `backend/src/products/products.service.ts`
- Asset IDs are generated automatically when creating new items
- Sequential numbering per item type (e.g., first Chair is 001, second Chair is 002)
- Year is set based on creation date
- Manual entry supported (if provided, auto-generation is skipped)

### Frontend Display
1. **Items Table** (`productColumns.tsx`)
   - Asset ID shown in first column
   - Displays with blue monospace font
   - Falls back to `#ID` if Asset ID not available

2. **Item View Dialog** (`product-view-dialog.tsx`)
   - Shows Asset ID prominently under item name
   - Falls back to showing database ID if no Asset ID

3. **Add/Edit Form** (`products-dialog.tsx`)
   - Optional Asset ID field at top of form
   - Shows hint: "Leave empty for auto-generation"
   - Format example shown in placeholder
   - If left empty, backend generates automatically

4. **Export Functions** (`products-container.tsx`)
   - Asset ID included in Excel/PDF exports
   - Uses Asset ID as primary identifier

## Existing Items Migration
All 6 existing items in the database have been assigned Asset IDs:
- Shirts → CAL-SHI-001-2026
- Security Guard Uniform → CAL-SEC-001-2026
- Two-Way Radio → CAL-TWO-001-2026
- Flashlight - Heavy Duty → CAL-FLA-001-2026
- First Aid Kit → CAL-FIR-001-2026
- Handcuffs → CAL-HAN-001-2026

## Migration Script
**Location**: `backend/src/generate-asset-ids.ts`

**Usage**: 
```bash
cd backend
npx ts-node src/generate-asset-ids.ts
```

This script:
- Finds all items without Asset IDs
- Generates Asset IDs following the correct format
- Uses the item's creation date for the year
- Updates the database

## Testing
1. **Create a new item** without entering an Asset ID → Backend auto-generates
2. **View existing items** → All show Asset IDs in table
3. **Click on an item** → View dialog shows Asset ID
4. **Export to Excel/PDF** → Asset ID appears in first column
5. **Edit an item** → Asset ID field is shown and can be updated manually

## How to Use
1. **Auto-generation** (recommended): Leave Asset ID field empty when creating items
2. **Manual entry**: Enter custom Asset ID following the format CAL-XXX-NNN-YYYY
3. **View Asset IDs**: Check the first column in the Items table
4. **Export with Asset IDs**: Use Export → Excel/PDF buttons

## Notes
- Asset IDs are unique identifiers for tracking physical assets
- Sequential numbers prevent duplicates within the same item type
- Year helps with asset age tracking and depreciation
- Format matches common asset tracking standards
