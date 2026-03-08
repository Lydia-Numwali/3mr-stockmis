'use client';

import React, { useState } from 'react';
import { useExportSales, useExportStock, useExportLending, useIncomeReport } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download, Activity, DollarSign } from 'lucide-react';
import { formatValue } from '@/lib/utils';
import Input from '@/components/auth/Input';

const ReportsContainer = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const exportSales = useExportSales();
    const exportStock = useExportStock();
    const exportLending = useExportLending();

    const { data: incomeData, isLoading: isLoadingIncome } = useIncomeReport({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });

    const handleExportSales = () => {
        exportSales.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

    const handleExportStock = () => {
        exportStock.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

    const handleExportLending = () => {
        exportLending.mutate({ startDate: startDate || undefined, endDate: endDate || undefined });
    };

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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
                        <DollarSign className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800">
                            {isLoadingIncome ? '...' : formatValue(incomeData?.totalIncome || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Sales revenue for selected period
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Cost</CardTitle>
                        <Activity className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800">
                            {isLoadingIncome ? '...' : formatValue(incomeData?.totalCost || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Cost of goods sold
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Gross Profit</CardTitle>
                        <DollarSign className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${(incomeData?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {isLoadingIncome ? '...' : formatValue(incomeData?.profit || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Net profit margin
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                            Sales Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all sales records for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                            onClick={handleExportSales}
                            disabled={exportSales.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportSales.isPending ? 'Downloading...' : 'Download Sales (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-t-4 border-t-green-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-500" />
                            Stock Movements Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all stock ins/outs for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
                            onClick={handleExportStock}
                            disabled={exportStock.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportStock.isPending ? 'Downloading...' : 'Download Stock (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-t-4 border-t-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                            Lending Report
                        </CardTitle>
                        <CardDescription>Export a detailed excel spreadsheet containing all lending and return history.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200"
                            onClick={handleExportLending}
                            disabled={exportLending.isPending}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {exportLending.isPending ? 'Downloading...' : 'Download Lending (.xlsx)'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default ReportsContainer;
