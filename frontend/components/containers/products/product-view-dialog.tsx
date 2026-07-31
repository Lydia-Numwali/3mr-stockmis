'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types/stock';
import { Badge } from '@/components/ui/badge';

interface Props {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProductViewDialog: React.FC<Props> = ({ product, open, onOpenChange }) => {
    if (!product) return null;

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') return value.toLocaleString();
        return value;
    };

    const getStockStatus = () => {
        if (product.quantity === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
        if (product.quantity <= product.lowStockThreshold) return { label: 'Low Stock', color: 'bg-yellow-500' };
        return { label: 'In Stock', color: 'bg-green-500' };
    };

    const status = getStockStatus();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Logistics Item Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">ID: #{product.id}</p>
                        </div>
                        <Badge className={`${status.color} text-white`}>
                            {status.label}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Category</p>
                            <p className="text-base font-semibold text-gray-900">{product.category}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Model / Spec</p>
                            <p className="text-base font-semibold text-gray-900">{formatValue(product.model)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Brand</p>
                            <p className="text-base font-semibold text-gray-900">{formatValue(product.brand)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Supplier</p>
                            <p className="text-base font-semibold text-gray-900">{formatValue(product.supplier)}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Inventory</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">In Stock</p>
                                <p className="text-2xl font-bold text-green-600">{formatValue(product.quantity)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Low Stock Threshold</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatValue(product.lowStockThreshold)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Packaging Unit</p>
                                <p className="text-base font-semibold text-gray-900">{formatValue(product.packagingUnit)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Units per Package</p>
                                <p className="text-base font-semibold text-gray-900">{formatValue(product.unitsPerPackage)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Pricing (Optional)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Cost Price</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {product.costPrice ? `Frws ${formatValue(product.costPrice)}` : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Standard Unit Cost</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {(product.standardUnitCost || product.wholesalePrice) ? `Frws ${formatValue(product.standardUnitCost || product.wholesalePrice)}` : '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Issue Value</p>
                                <p className="text-base font-semibold text-gray-900">
                                    {(product.issueValue || product.retailPrice) ? `Frws ${formatValue(product.issueValue || product.retailPrice)}` : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {product.notes && (
                        <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Notes</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductViewDialog;
