'use client';

import React, { useState } from 'react';
import { useExportSales, useExportStock, useExportLending, useExportMonthlyInventory, useReportHistory, useDownloadHistoryReport, useDeleteHistoryReport } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download, Calendar, Trash2, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const ReportsContainer = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Monthly Inventory Report state
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const queryClient = useQueryClient();
    const exportSales = useExportSales();
    const exportStock = useExportStock();
    const exportLending = useExportLending();
    const exportMonthlyInventory = useExportMonthlyInventory();
    
    // Report History
    const { data: reportHistory, isLoading: isLoadingHistory, error: historyError } = useReportHistory({ limit: 50 });
    const downloadHistoryReport = useDownloadHistoryReport();
    const deleteHistoryReport = useDeleteHistoryReport();

    const handleExportSales = () => {
        exportSales.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

    const handleExportStock = () => {
        exportStock.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

    const handleExportLending = () => {
        exportLending.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

    const handleExportMonthlyInventory = () => {
        exportMonthlyInventory.mutate(
            { month: selectedMonth, year: selectedYear },
            {
                onSuccess: () => {
                    // Refresh report history after successful generation
                    queryClient.invalidateQueries({ queryKey: ['reports', 'history'] });
                }
            }
        );
    };

    const handleDownloadHistory = (id: number) => {
        downloadHistoryReport.mutate(id);
    };

    const handleDeleteHistory = (id: number) => {
        if (confirm('Are you sure you want to delete this report?')) {
            deleteHistoryReport.mutate(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['reports', 'history'] });
                }
            });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Generate month options
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    // Generate year options (current year and 5 years back)
    const years = Array.from({ length: 6 }, (_, i) => currentDate.getFullYear() - i);

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Reports & Exports</h2>

                <div className="flex gap-4 items-center bg-white p-2 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">From:</span>
                        <input
                            type="date"
                            className="border rounded px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">To:</span>
                        <input
                            type="date"
                            className="border rounded px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setStartDate(''); setEndDate(''); }} className="text-xs">
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                            Items Issued Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all items issued records for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                            onClick={handleExportSales}
                            disabled={exportSales.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportSales.isPending ? 'Downloading...' : 'Download Issues (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-500" />
                            Inventory Movements Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all inventory movements for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                            onClick={handleExportStock}
                            disabled={exportStock.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportStock.isPending ? 'Downloading...' : 'Download Inventory (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                            Returns Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all item returns history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
                            onClick={handleExportLending}
                            disabled={exportLending.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportLending.isPending ? 'Downloading...' : 'Download Returns (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Inventory Report */}
            <div className="mt-8">
                <Card className="shadow-sm border-blue-200">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Monthly Inventory Report
                        </CardTitle>
                        <CardDescription>Generate a comprehensive monthly inventory report with opening balance, received, issued, returns, and closing balance.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Month</label>
                                <select
                                    className="w-full border rounded px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                >
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
                                <select
                                    className="w-full border rounded px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={handleExportMonthlyInventory}
                                    disabled={exportMonthlyInventory.isPending}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {exportMonthlyInventory.isPending ? 'Generating...' : 'Generate Report'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report History */}
            <div className="mt-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-600" />
                            Report History
                        </CardTitle>
                        <CardDescription>View and download previously generated reports.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingHistory ? (
                            <div className="text-center py-8 text-gray-500">Loading report history...</div>
                        ) : historyError ? (
                            <div className="text-center py-8 text-gray-500">
                                Report history will be available after generating your first report.
                            </div>
                        ) : !reportHistory?.items || reportHistory.items.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No reports generated yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left p-3 font-semibold text-gray-700">Report Name</th>
                                            <th className="text-left p-3 font-semibold text-gray-700">Generated</th>
                                            <th className="text-left p-3 font-semibold text-gray-700">File Size</th>
                                            <th className="text-center p-3 font-semibold text-gray-700">Downloads</th>
                                            <th className="text-right p-3 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportHistory.items.map((report: any) => (
                                            <tr key={report.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="font-medium text-gray-900">{report.reportName}</div>
                                                    <div className="text-sm text-gray-500">{report.description}</div>
                                                </td>
                                                <td className="p-3 text-gray-600 text-sm">
                                                    {formatDateTime(report.generatedAt)}
                                                </td>
                                                <td className="p-3 text-gray-600 text-sm">
                                                    {formatFileSize(report.fileSize)}
                                                </td>
                                                <td className="p-3 text-center text-gray-600 text-sm">
                                                    {report.downloadCount}
                                                </td>
                                                <td className="p-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleDownloadHistory(report.id)}
                                                            disabled={downloadHistoryReport.isPending}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteHistory(report.id)}
                                                            disabled={deleteHistoryReport.isPending}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default ReportsContainer;
