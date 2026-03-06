import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  LEND = 'LEND',
  RETURN = 'RETURN',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.movements, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  supplier: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  date: Date;
}
