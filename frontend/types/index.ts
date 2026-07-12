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
