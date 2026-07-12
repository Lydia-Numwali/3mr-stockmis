'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lending } from '@/types/stock';
import { Badge } from '@/components/ui/badge';

interface Props {
    lending: Lending | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LendingViewDialog: React.FC<Props> = ({ lending, open, onOpenChange }) => {
    if (!lending) return null;

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') return value.toLocaleString();
        return value;
    };

    const getStatusColor = (status: string) => {
        if (status === 'RETURNED') return 'bg-green-500';
        if (status === 'PARTIALLY_RETURNED') return 'bg-yellow-500';
        if (status === 'PENDING') return 'bg-orange-500';
        return 'bg-gray-500';
    };

    const getConditionColor = (condition: string) => {
        if (condition === 'Good') return 'bg-green-500';
        if (condition === 'Damaged') return 'bg-yellow-500';
        if (condition === 'Beyond Repair') return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Item Return Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header with Status */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{lending.product?.name || 'Unknown Item'}</h3>
                            <p className="text-sm text-gray-500 mt-1">Return ID: #{lending.id}</p>
                        </div>
                        <Badge className={`${getStatusColor(lending.status)} text-white`}>
                            {lending.status?.replace('_', ' ')}
                        </Badge>
                    </div>

                    {/* Item Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Item Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Brand</p>
                                <p className="text-base font-semibold text-gray-900">{lending.product?.brand || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Category</p>
                                <p className="text-base font-semibold text-gray-900">{lending.product?.category || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Return Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Return Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Quantity Returned</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatValue(lending.quantityReturned ?? lending.quantityLent)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Return Date</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {new Date(lending.returnDate || lending.dateLent).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Return Reference</p>
                                <p className="text-base font-semibold text-gray-900">{lending.returnReference || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Return Reason</p>
                                <p className="text-base font-semibold text-gray-900">{lending.returnReason || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Condition & Inspection */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Condition & Inspection</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Item Condition</p>
                                {lending.itemCondition ? (
                                    <Badge className={`${getConditionColor(lending.itemCondition)} text-white`}>
                                        {lending.itemCondition}
                                    </Badge>
                                ) : <p>-</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Inspected By</p>
                                <p className="text-base font-semibold text-gray-900">{lending.inspectedBy || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Inspection Date</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {lending.inspectionDate ? new Date(lending.inspectionDate).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Replacement Issued</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {lending.replacementIssued ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Returned By Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Personnel Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Returned By</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {lending.returnedBy || lending.borrowerShop || '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Contact Info</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {lending.contactInfo || lending.borrowerContact || '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Department</p>
                                <p className="text-base font-semibold text-gray-900">{lending.department || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Security Site</p>
                                <p className="text-base font-semibold text-gray-900">{lending.securitySite || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Received By</p>
                                <p className="text-base font-semibold text-gray-900">{lending.receivedBy || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {lending.notes && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Notes</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{lending.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Return Document */}
                    {lending.returnDocument && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Return Document</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-blue-600">📄 {lending.returnDocument}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LendingViewDialog;
