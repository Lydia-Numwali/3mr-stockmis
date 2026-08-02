export enum EUserRoles {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    OPERATOR = "OPERATOR",
    EMPLOYEE = "EMPLOYEE",
    VISITOR = "VISITOR"
}

// Logistics-specific enums
export enum LogisticsItemCategory {
    // Categories from June 2026 Inventory
    GENERAL = 'General',
    IT_ITEMS = 'IT Items',
    SECURITY_EQUIPMENT_AND_UNIFORMS = 'Security Equipment & Uniforms',
    BEDDINGS = 'Beddings',
    // Additional common categories
    OFFICE_SUPPLIES = 'Office Supplies',
    CLEANING_SUPPLIES = 'Cleaning Supplies',
    SAFETY_EQUIPMENT = 'Safety Equipment',
    COMMUNICATION_DEVICES = 'Communication Devices',
    STATIONERY = 'Stationery',
    MISCELLANEOUS = 'Miscellaneous',
}

export enum StockStatus {
    IN_STOCK = 'In Stock',
    LOW_STOCK = 'Low Stock',
    OUT_OF_STOCK = 'Out of Stock',
    UNDER_REPAIR = 'Under Repair',
    DAMAGED = 'Damaged',
}

export enum ReturnReason {
    DAMAGED = 'Damaged',
    DEFECTIVE = 'Defective',
    WORN_OUT = 'Worn Out',
    INCORRECT_ITEM = 'Incorrect Item Issued',
    EXPIRED = 'Expired',
    NO_LONGER_NEEDED = 'No Longer Needed',
    REPLACEMENT_REQUIRED = 'Replacement Required',
    MAINTENANCE_REQUIRED = 'Maintenance Required',
    END_OF_ASSIGNMENT = 'End of Assignment',
    EXCESS_QUANTITY = 'Excess Quantity',
}

export enum ItemCondition {
    GOOD = 'Good',
    NEEDS_REPAIR = 'Needs Repair',
    DAMAGED = 'Damaged',
    DEFECTIVE = 'Defective',
    BEYOND_REPAIR = 'Beyond Repair',
    PENDING_INSPECTION = 'Pending Inspection',
}

export enum ReturnStatus {
    RECEIVED = 'RECEIVED',
    INSPECTED = 'INSPECTED',
    RESTOCKED = 'RESTOCKED',
    SENT_FOR_REPAIR = 'SENT_FOR_REPAIR',
    REPLACED = 'REPLACED',
    DISPOSED = 'DISPOSED',
}

// Backward compatibility aliases
export const ProductCategory = LogisticsItemCategory;
export type ProductCategory = LogisticsItemCategory;
