import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ReportType {
  MONTHLY_INVENTORY = 'Monthly Inventory Report',
  SALES_REPORT = 'Sales Report',
  STOCK_REPORT = 'Stock Report',
  LENDING_REPORT = 'Lending Report',
  INCOME_REPORT = 'Income Report',
}

@Entity('report_history')
export class ReportHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportName: string;

  @Column({ type: 'enum', enum: ReportType })
  reportType: ReportType;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  month: number;  // For monthly reports

  @Column({ nullable: true })
  year: number;  // For reports with year

  @Column({ nullable: true })
  startDate: Date;  // For date range reports

  @Column({ nullable: true })
  endDate: Date;  // For date range reports

  @Column()
  fileName: string;  // e.g., "inventory-report-june-2026.xlsx"

  @Column({ type: 'text' })
  filePath: string;  // Path where file is stored

  @Column({ default: 0 })
  downloadCount: number;  // Track how many times downloaded

  @Column({ nullable: true })
  generatedBy: string;  // User who generated the report

  @CreateDateColumn()
  generatedAt: Date;

  @Column({ type: 'bigint' })
  fileSize: number;  // File size in bytes
}
