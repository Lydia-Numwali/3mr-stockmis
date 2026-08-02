import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sale } from './sale.entity';
import { StockMovement } from './stock-movement.entity';
import { Lending } from './lending.entity';
import { Purchase } from './purchase.entity';

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

  @Column({ nullable: true })
  assetId: string;  // Asset ID from asset register

  @Column()
  name: string;  // Asset Description

  @Column({ type: 'varchar', length: 100, default: LogisticsItemCategory.GENERAL })
  category: string;  // Asset Category (free text to match Excel)

  @Column({ type: 'enum', enum: PackagingUnit, default: PackagingUnit.PIECES })
  packagingUnit: PackagingUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  unitsPerPackage: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serialNumber: string;

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
  location: string;  // renamed from warehouse — matches Excel "Location"

  @Column({ nullable: true })
  custodian: string;

  @Column({ nullable: true })
  condition: string;  // Asset condition from register (Good, Fair, Poor, etc.)

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;  // Remarks

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
