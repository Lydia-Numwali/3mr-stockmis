import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum PaymentStatus {
  PAID = 'PAID',
  CREDIT = 'CREDIT',
  PARTIAL = 'PARTIAL',
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.purchases, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantityPurchased: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerUnit: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '"quantityPurchased" * "pricePerUnit"', nullable: true })
  totalValue: number;

  // Credit/Payment fields
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountDue: number;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate: Date;

  @CreateDateColumn()
  recordedDate: Date;

  // Keep the old date field for backward compatibility
  @CreateDateColumn()
  date: Date;
}