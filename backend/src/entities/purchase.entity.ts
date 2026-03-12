import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

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

  @Column({ type: 'timestamp', nullable: true })
  purchaseDate: Date;

  @CreateDateColumn()
  recordedDate: Date;

  // Keep the old date field for backward compatibility
  @CreateDateColumn()
  date: Date;
}