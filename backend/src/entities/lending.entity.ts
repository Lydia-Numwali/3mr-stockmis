import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

export enum ReturnReason {
  DAMAGED = 'Damaged',
  DEFECTIVE = 'Defective',
  WORN_OUT = 'Worn Out',
  INCORRECT_ITEM = 'Incorrect Item Issued',
  EXPIRED = 'Expired',
  NO_LONGER_NEEDED = 'No Longer Needed',
  REPLACEMENT_REQUIRED = 'Replacement Required',
  MAINTENANCE_REQUIRED = 'Maintenance Required',
  END_OF_ASSIGNMENT = 'End of Assignment',
  EXCESS_QUANTITY = 'Excess Quantity',
}

export enum ItemCondition {
  GOOD = 'Good',
  NEEDS_REPAIR = 'Needs Repair',
  DAMAGED = 'Damaged',
  DEFECTIVE = 'Defective',
  BEYOND_REPAIR = 'Beyond Repair',
  PENDING_INSPECTION = 'Pending Inspection',
}

export enum ReturnStatus {
  RECEIVED = 'RECEIVED',
  INSPECTED = 'INSPECTED',
  RESTOCKED = 'RESTOCKED',
  SENT_FOR_REPAIR = 'SENT_FOR_REPAIR',
  REPLACED = 'REPLACED',
  DISPOSED = 'DISPOSED',
}

// Keep old enums for backward compatibility
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
  quantityReturned: number;  // renamed from quantityLent

  @Column({ nullable: true })
  returnReference: string;  // new field - tracking number for return

  @Column()
  returnedBy: string;  // renamed from borrowerShop - employee returning

  @Column({ nullable: true })
  department: string;  // new field

  @Column({ nullable: true })
  securitySite: string;  // new field

  @Column({ nullable: true })
  contactInfo: string;  // renamed from borrowerContact

  @Column({ nullable: true })
  originalIssueReference: string;  // new field - link to original issue

  @Column({ type: 'enum', enum: ReturnReason, nullable: true })
  returnReason: ReturnReason;  // new field

  @Column({ type: 'enum', enum: ItemCondition, default: ItemCondition.PENDING_INSPECTION })
  itemCondition: ItemCondition;  // new field

  @Column({ type: 'enum', enum: ReturnStatus, default: ReturnStatus.RECEIVED })
  status: ReturnStatus;  // renamed from LendingStatus

  @Column({ type: 'date' })
  returnDate: Date;  // renamed from dateLent

  @Column({ nullable: true })
  receivedBy: string;  // new field - staff who received return

  @Column({ nullable: true })
  inspectedBy: string;  // new field

  @Column({ type: 'date', nullable: true })
  inspectionDate: Date;  // new field

  @Column({ nullable: true })
  replacementIssueId: number;  // new field - link to replacement if issued

  @Column({ type: 'boolean', default: false })
  replacementIssued: boolean;  // new field

  @Column({ nullable: true, type: 'text' })
  returnDocument: string;  // new field - path to uploaded document

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  // Keep old fields for backward compatibility during migration
  @Column({ default: 0, nullable: true })
  quantityLent: number;

  @Column({ nullable: true })
  borrowerShop: string;

  @Column({ nullable: true })
  borrowerContact: string;

  @Column({ type: 'date', nullable: true })
  dateLent: Date;

  @Column({ type: 'date', nullable: true })
  expectedReturnDate: Date;
}
