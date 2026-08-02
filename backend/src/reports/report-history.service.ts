import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportHistory, ReportType } from '../entities/report-history.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportHistoryService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'reports');

  constructor(
    @InjectRepository(ReportHistory)
    private reportHistoryRepo: Repository<ReportHistory>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save a generated report to the database and file system
   */
  async saveReport(
    reportType: ReportType,
    fileName: string,
    buffer: Buffer,
    metadata: {
      description?: string;
      month?: number;
      year?: number;
      startDate?: Date;
      endDate?: Date;
      generatedBy?: string;
    },
  ): Promise<ReportHistory> {
    // Save file to disk
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Generate report name
    let reportName = `${reportType}`;
    if (metadata.month && metadata.year) {
      const monthName = new Date(metadata.year, metadata.month - 1).toLocaleString('default', { month: 'long' });
      reportName = `${reportType} - ${monthName} ${metadata.year}`;
    } else if (metadata.startDate && metadata.endDate) {
      reportName = `${reportType} - ${metadata.startDate.toLocaleDateString()} to ${metadata.endDate.toLocaleDateString()}`;
    }

    // Save to database
    const report = this.reportHistoryRepo.create({
      reportName,
      reportType,
      description: metadata.description || reportName,
      month: metadata.month,
      year: metadata.year,
      startDate: metadata.startDate,
      endDate: metadata.endDate,
      fileName,
      filePath,
      generatedBy: metadata.generatedBy || 'System',
      fileSize: buffer.length,
      downloadCount: 0,
    });

    return this.reportHistoryRepo.save(report);
  }

  /**
   * Get all report history with pagination
   */
  async getAllReports(params: { page?: number; limit?: number; reportType?: ReportType }) {
    const { page = 1, limit = 20, reportType } = params;
    
    const qb = this.reportHistoryRepo.createQueryBuilder('r');
    
    if (reportType) {
      qb.where('r.reportType = :reportType', { reportType });
    }
    
    qb.orderBy('r.generatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [items, total] = await qb.getManyAndCount();
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a specific report file
   */
  async getReportFile(id: number): Promise<{ buffer: Buffer; report: ReportHistory }> {
    const report = await this.reportHistoryRepo.findOne({ where: { id } });
    
    if (!report) {
      throw new Error('Report not found');
    }

    // Check if file exists
    if (!fs.existsSync(report.filePath)) {
      throw new Error('Report file not found on disk');
    }

    // Increment download count
    report.downloadCount += 1;
    await this.reportHistoryRepo.save(report);

    // Read file
    const buffer = fs.readFileSync(report.filePath);

    return { buffer, report };
  }

  /**
   * Delete a report from history
   */
  async deleteReport(id: number): Promise<void> {
    const report = await this.reportHistoryRepo.findOne({ where: { id } });
    
    if (!report) {
      throw new Error('Report not found');
    }

    // Delete file from disk
    if (fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    // Delete from database
    await this.reportHistoryRepo.remove(report);
  }

  /**
   * Clean up old reports (older than specified days)
   */
  async cleanupOldReports(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldReports = await this.reportHistoryRepo
      .createQueryBuilder('r')
      .where('r.generatedAt < :cutoffDate', { cutoffDate })
      .getMany();

    for (const report of oldReports) {
      await this.deleteReport(report.id);
    }

    return oldReports.length;
  }
}
