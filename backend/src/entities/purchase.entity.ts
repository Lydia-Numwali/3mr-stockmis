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
  quantityReceived: number;  // renamed from quantityPurchased

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerUnit: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  deliveryReference: string;  // new field for tracking number

  @Column({ nullable: true })
  warehouse: string;  // new field for warehouse location

  @Column({ nullable: true })
  receivedBy: string;  // new field for staff who received

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '"quantityReceived" * "pricePerUnit"', nullable: true })
  totalValue: number;

  // Credit/Payment fields (kept for backward compatibility but less relevant for internal logistics)
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountDue: number;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  receivingDate: Date;  // renamed from purchaseDate

  @CreateDateColumn()
  recordedDate: Date;

  // Keep the old date field for backward compatibility
  @CreateDateColumn()
  date: Date;
}