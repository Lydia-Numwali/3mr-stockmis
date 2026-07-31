'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sale } from '@/types/stock';

interface Props {
    sale: Sale | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SaleViewDialog: React.FC<Props> = ({ sale, open, onOpenChange }) => {
    if (!sale) return null;

    const formatValue = (value: any) => {
        if (value === null || value === undefined || value === 0) return '-';
        if (typeof value === 'number') return value.toLocaleString();
        return value;
    };

    const qty = sale.quantityIssued ?? sale.quantitySold ?? 0;
    const price = sale.priceUsed ?? 0;
    const total = qty * price;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Item Issued Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{sale.product?.name || 'Unknown Item'}</h3>
                        <p className="text-sm text-gray-500 mt-1">Issue ID: #{sale.id}</p>
                    </div>

                    {/* Item Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Item Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Brand</p>
                                <p className="text-base font-semibold text-gray-900">{sale.product?.brand || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Category</p>
                                <p className="text-base font-semibold text-gray-900">{sale.product?.category || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Issue Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Issue Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Quantity Issued</p>
                                <p className="text-2xl font-bold text-red-600">{formatValue(qty)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Asset ID</p>
                                <p className="text-base font-semibold text-gray-900">{sale.assetId || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Serial Number</p>
                                <p className="text-base font-semibold text-gray-900">{sale.serialNumber || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <p className="text-base font-semibold text-gray-900">{sale.location || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Custodian</p>
                                <p className="text-base font-semibold text-gray-900">{sale.custodian || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Condition</p>
                                <p className="text-base font-semibold text-gray-900">{sale.condition || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Unit Value</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {price > 0 ? `Frws ${formatValue(price)}` : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Issue Date</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {new Date(sale.issueDate || sale.saleDate || sale.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Recipient Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Issued To</p>
                                <p className="text-base font-semibold text-gray-900">{sale.issuedTo || sale.customerName || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Department</p>
                                <p className="text-base font-semibold text-gray-900">{sale.department || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Security Site</p>
                                <p className="text-base font-semibold text-gray-900">{sale.securitySite || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Purpose</p>
                                <p className="text-base font-semibold text-gray-900">{sale.purpose || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Authorization */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Authorization</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Issued By</p>
                                <p className="text-base font-semibold text-gray-900">{sale.issuedBy || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Approved By</p>
                                <p className="text-base font-semibold text-gray-900">{sale.approvedBy || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {sale.notes && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Notes</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{sale.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SaleViewDialog;
