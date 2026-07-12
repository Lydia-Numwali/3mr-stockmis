import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sale } from './sale.entity';
import { StockMovement } from './stock-movement.entity';
import { Lending } from './lending.entity';
import { Purchase } from './purchase.entity';

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

// Keep ProductCategory as alias for backward compatibility during migration
export const ProductCategory = LogisticsItemCategory;

export enum PackagingUnit {
  PIECES = 'Pieces',
  CARTON = 'Carton',
  LITRE = 'Litre',
  KILOGRAM = 'Kilogram',
  BOX = 'Box',
  PACK = 'Pack',
  BOTTLE = 'Bottle',
  CAN = 'Can',
  GALLON = 'Gallon',
  METER = 'Meter',
  SET = 'Set',
  PAIR = 'Pair',
  UNIT = 'Unit',
  ROLL = 'Roll',
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
  UNDER_REPAIR = 'Under Repair',
  DAMAGED = 'Damaged',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: LogisticsItemCategory, default: LogisticsItemCategory.MISCELLANEOUS_ASSETS })
  category: LogisticsItemCategory;

  @Column({ type: 'enum', enum: PackagingUnit, default: PackagingUnit.PIECES })
  packagingUnit: PackagingUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  unitsPerPackage: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  itemType: string;  // renamed from partType

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  standardUnitCost: number;  // renamed from wholesalePrice

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  issueValue: number;  // renamed from retailPrice

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  warehouse: string;  // renamed from storageLocation

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  dateRecorded: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Sale, (sale: Sale) => sale.product)
  sales: Sale[];

  @OneToMany(() => StockMovement, (m: StockMovement) => m.product)
  movements: StockMovement[];

  @OneToMany(() => Lending, (l: Lending) => l.product)
  lendings: Lending[];

  @OneToMany(() => Purchase, (p: Purchase) => p.product)
  purchases: Purchase[];

  // Virtual/computed property for stock status
  getStockStatus(): StockStatus {
    if (this.quantity === 0) return StockStatus.OUT_OF_STOCK;
    if (this.quantity <= this.lowStockThreshold) return StockStatus.LOW_STOCK;
    return StockStatus.IN_STOCK;
  }
}
