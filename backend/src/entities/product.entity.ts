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
  // Asset register categories (from Excel)
  COMM_DEVICE = 'Comm.Device',
  KITCHEN_EQPT = 'Kitchen Eqpt.',
  FURN_AND_FITT = 'Furn. & Fitt.',
  SECURITY_EQPT = 'Security Eqpt.',
  OFFICE_FURNITURE = 'Office Furniture',
  ACC_FURNITURE = 'Acc. Furniture',
  OFF_MACHINES = 'Off. Machines',
  OFF_ACCESSORIES = 'Off. accessories',
  CLEANING_EQPT = 'Cleaning. Eqpt',
  OFFICE_EQPT = 'Office Eqpt.',
  FIRE_AND_SAFETY = 'Fire and safety',
  MISC_DECO = 'Misc/Deco',
  ELECTRICAL_EQPT = 'Eelectrical Eqpt.',
  OFFICE_EQUIP = 'Office Equip.',
  ELECT_DEVICE = 'Elect. Divice',
  MEASURING_EQUIP = 'Measuring equip',
  OFFICE_CARTENS = 'Office Cartens',
  VEHICLE = 'Vehicle',
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

  @Column({ type: 'varchar', length: 100, default: LogisticsItemCategory.MISCELLANEOUS_ASSETS })
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
