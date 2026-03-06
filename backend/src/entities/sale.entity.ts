import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum SaleType {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  SHOP_OWNER = 'SHOP_OWNER',
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.sales, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantitySold: number;

  @Column({ type: 'enum', enum: SaleType })
  saleType: SaleType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceUsed: number;

  @Column({ type: 'enum', enum: CustomerType, nullable: true })
  customerType: CustomerType;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '"quantitySold" * "priceUsed"', nullable: true })
  totalValue: number;

  @CreateDateColumn()
  date: Date;
}
