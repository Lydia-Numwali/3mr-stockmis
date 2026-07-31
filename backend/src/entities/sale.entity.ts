import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

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
  quantityIssued: number;  // renamed from quantitySold

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  priceUsed: number;  // unit value for accounting (optional - not always tracked in logistics)

  @Column({ nullable: true })
  issuedTo: string;  // renamed from customerName - employee name

  @Column({ nullable: true })
  department: string;  // new field

  @Column({ nullable: true })
  securitySite: string;  // new field - which branch/site

  @Column({ nullable: true })
  issuedBy: string;  // new field - staff who issued

  @Column({ nullable: true })
  approvedBy: string;  // new field - approval

  @Column({ nullable: true })
  purpose: string;  // new field - reason for issue

  @Column({ nullable: true })
  assetId: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  custodian: string;

  @Column({ nullable: true })
  condition: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '"quantityIssued" * "priceUsed"', nullable: true })
  totalValue: number;

  @Column({ type: 'timestamp', nullable: true })
  issueDate: Date;  // renamed from saleDate

  @CreateDateColumn()
  recordedDate: Date;

  // Keep the old date field for backward compatibility
  @CreateDateColumn()
  date: Date;
}
