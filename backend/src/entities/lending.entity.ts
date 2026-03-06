import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum LendingStatus {
  PENDING = 'PENDING',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

@Entity('lendings')
export class Lending {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.lendings, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantityLent: number;

  @Column({ default: 0 })
  quantityReturned: number;

  @Column()
  borrowerShop: string;

  @Column({ nullable: true })
  borrowerContact: string;

  @Column({ type: 'date' })
  dateLent: Date;

  @Column({ type: 'date', nullable: true })
  expectedReturnDate: Date;

  @Column({ type: 'date', nullable: true })
  returnDate: Date;

  @Column({ type: 'enum', enum: LendingStatus, default: LendingStatus.PENDING })
  status: LendingStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
