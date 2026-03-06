import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sale } from './sale.entity';
import { StockMovement } from './stock-movement.entity';
import { Lending } from './lending.entity';

export enum ProductCategory {
  ENGINE_PARTS = 'Engine Parts',
  BRAKE_SYSTEM = 'Brake System',
  ELECTRICAL_PARTS = 'Electrical Parts',
  BODY_PARTS = 'Body Parts',
  SUSPENSION = 'Suspension',
  TIRES_WHEELS = 'Tires & Wheels',
  OTHER = 'Other',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ProductCategory, default: ProductCategory.OTHER })
  category: ProductCategory;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  partType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  wholesalePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  retailPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costPrice: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  storageLocation: string;

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
}
