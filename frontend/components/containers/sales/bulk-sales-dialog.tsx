'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBulkSale } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { BulkSaleItemDto } from '@/services/sales.service';

interface BulkSalesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface SaleItem extends BulkSaleItemDto {
    id: string;
}

const BulkSalesDialog: React.FC<BulkSalesDialogProps> = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        saleDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [items, setItems] = useState<SaleItem[]>([
        { id: '1', productId: 0, quantitySold: 0, saleType: 'RETAIL' as const, priceUsed: 0 }
    ]);

    const { mutate: createBulkSale, isPending } = useCreateBulkSale();
    const { data: products, isLoading: productsLoading } = useProducts({ page: 1, limit: 1000 });

    const addItem = () => {
        const newId = (Math.max(...items.map(item => parseInt(item.id))) + 1).toString();
        setItems([...items, { id: newId, productId: 0, quantitySold: 0, saleType: 'RETAIL', priceUsed: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof BulkSaleItemDto, value: number | string) => {
        setItems(prevItems => {
            const newItems = prevItems.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            );
            return newItems;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validItems = items.filter(item => 
            item.productId > 0 && item.quantitySold > 0 && item.priceUsed > 0
        );

        if (validItems.length === 0) {
            return;
        }

        createBulkSale({
            customerName: formData.customerName || undefined,
            saleDate: formData.saleDate,
            notes: formData.notes || undefined,
            items: validItems.map(({ id, ...item }) => item),
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    customerName: '',
                    saleDate: new Date().toISOString().split('T')[0],
                    notes: '',
                });
                setItems([{ id: '1', productId: 0, quantitySold: 0, saleType: 'RETAIL', priceUsed: 0 }]);
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getTotalValue = () => {
        return items.reduce((total, item) => total + (item.quantitySold * item.priceUsed), 0);
    };

    const getProductPrice = (productId: number, saleType: 'WHOLESALE' | 'RETAIL') => {
        const product = products?.items?.find(p => p.id === productId);
        if (!product) return 0;
        return saleType === 'WHOLESALE' ? product.wholesalePrice : product.retailPrice;
    };

    const handleProductChange = (itemId: string, productIdStr: string) => {
        if (!productIdStr || productIdStr === 'no-products' || productIdStr === 'loading') return;
        
        const productId = parseInt(productIdStr);
        updateItem(itemId, 'productId', productId);
        const item = items.find(i => i.id === itemId);
        if (item && productId > 0) {
            const price = getProductPrice(productId, item.saleType);
            updateItem(itemId, 'priceUsed', price);
        }
    };

    const handleSaleTypeChange = (itemId: string, saleType: 'WHOLESALE' | 'RETAIL') => {
        updateItem(itemId, 'saleType', saleType);
        const item = items.find(i => i.id === itemId);
        if (item && item.productId > 0) {
            const price = getProductPrice(item.productId, saleType);
            updateItem(itemId, 'priceUsed', price);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Sale Entry</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Customer Name</Label>
                            <Input
                                id="customerName"
                                value={formData.customerName}
                                onChange={(e) => handleInputChange('customerName', e.target.value)}
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="saleDate">Sale Date</Label>
                            <Input
                                id="saleDate"
                                type="date"
                                value={formData.saleDate}
                                onChange={(e) => handleInputChange('saleDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Items</Label>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="p-4 border rounded-lg bg-gray-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-gray-600">Item #{index + 1}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            size="sm"
                                            variant="outline"
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div className="lg:col-span-2">
                                            <Label className="text-sm font-medium">Product</Label>
                                            <Select 
                                                value={item.productId > 0 ? item.productId.toString() : undefined} 
                                                onValueChange={(value) => handleProductChange(item.id, value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue 
                                                        placeholder={productsLoading ? "Loading products..." : "Select product"}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productsLoading ? (
                                                        <SelectItem value="loading" disabled>
                                                            Loading products...
                                                        </SelectItem>
                                                    ) : products?.items?.length > 0 ? (
                                                        products.items.map((product) => (
                                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                                {product.name} (Stock: {product.quantity})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="no-products" disabled>
                                                            No products available
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Sale Type</Label>
                                            <Select 
                                                value={item.saleType} 
                                                onValueChange={(value: 'WHOLESALE' | 'RETAIL') => handleSaleTypeChange(item.id, value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="RETAIL">Retail</SelectItem>
                                                    <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantitySold || ''}
                                                onChange={(e) => updateItem(item.id, 'quantitySold', parseInt(e.target.value) || 0)}
                                                placeholder="Qty"
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Price per Unit</Label>
                                            <Input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.priceUsed || ''}
                                                onChange={(e) => updateItem(item.id, 'priceUsed', parseFloat(e.target.value) || 0)}
                                                placeholder="Price"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="bg-white px-3 py-2 rounded border">
                                            <span className="text-sm font-medium">
                                                Total: <span className="text-blue-600">Frws {(item.quantitySold * item.priceUsed).toLocaleString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add Item Button - Now appears after each item */}
                            <div className="flex justify-center">
                                <Button type="button" onClick={addItem} size="sm" variant="outline" className="w-full max-w-xs">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Item
                                </Button>
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div className="flex justify-end">
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <div className="text-lg font-semibold">
                                    Total Sale Value: <span className="text-xl font-bold text-blue-600">Frws {getTotalValue().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Enter any additional notes"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-blue hover:bg-blue/90 text-white">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record {items.filter(item => item.productId > 0).length} Sale{items.filter(item => item.productId > 0).length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BulkSalesDialog;