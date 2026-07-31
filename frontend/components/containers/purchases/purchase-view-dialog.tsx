'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Purchase } from '@/types/stock';

interface Props {
    purchase: Purchase | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PurchaseViewDialog: React.FC<Props> = ({ purchase, open, onOpenChange }) => {
    if (!purchase) return null;

    const formatValue = (value: any) => {
        if (value === null || value === undefined || value === 0) return '-';
        if (typeof value === 'number') return value.toLocaleString();
        return value;
    };

    const qty = purchase.quantityReceived ?? purchase.quantityPurchased ?? 0;
    const price = purchase.pricePerUnit ?? 0;
    const total = purchase.totalValue ?? (qty * price);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Item Received Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{purchase.product?.name || 'Unknown Item'}</h3>
                        <p className="text-sm text-gray-500 mt-1">Receipt ID: #{purchase.id}</p>
                    </div>

                    {/* Item Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Item Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Brand</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.product?.brand || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Category</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.product?.category || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Information */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Receipt Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Quantity Received</p>
                                <p className="text-2xl font-bold text-blue-600">{formatValue(qty)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Price Per Unit</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {price > 0 ? `Frws ${formatValue(price)}` : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Total Value</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {total > 0 ? `Frws ${formatValue(total)}` : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Receiving Date</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {new Date(purchase.receivingDate || purchase.purchaseDate || purchase.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supplier & Location */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Supplier & Location</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Supplier</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.supplier || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Location</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.location || purchase.warehouse || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Asset ID</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.assetId || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Serial Number</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.serialNumber || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Custodian</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.custodian || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Condition</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.condition || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Delivery Reference</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.deliveryReference || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Received By</p>
                                <p className="text-base font-semibold text-gray-900">{purchase.receivedBy || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {purchase.notes && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Notes</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{purchase.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseViewDialog;
