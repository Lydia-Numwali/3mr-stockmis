'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBulkPurchase } from '@/hooks/usePurchases';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { BulkPurchaseItemDto } from '@/services/purchases.service';

interface BulkPurchasesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface PurchaseItem extends BulkPurchaseItemDto {
    id: string;
}

const BulkPurchasesDialog: React.FC<BulkPurchasesDialogProps> = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState({
        supplier: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [items, setItems] = useState<PurchaseItem[]>([
        { id: '1', productId: 0, quantityPurchased: 0, pricePerUnit: 0 }
    ]);

    const { mutate: createBulkPurchase, isPending } = useCreateBulkPurchase();
    const { data: products } = useProducts({ page: 1, limit: 1000 });

    const addItem = () => {
        const newId = (Math.max(...items.map(item => parseInt(item.id))) + 1).toString();
        setItems([...items, { id: newId, productId: 0, quantityPurchased: 0, pricePerUnit: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id: string, field: keyof BulkPurchaseItemDto, value: number) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validItems = items.filter(item => 
            item.productId > 0 && item.quantityPurchased > 0 && item.pricePerUnit > 0
        );

        if (validItems.length === 0) {
            return;
        }

        createBulkPurchase({
            supplier: formData.supplier || undefined,
            purchaseDate: formData.purchaseDate,
            notes: formData.notes || undefined,
            items: validItems.map(({ id, ...item }) => item),
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    supplier: '',
                    purchaseDate: new Date().toISOString().split('T')[0],
                    notes: '',
                });
                setItems([{ id: '1', productId: 0, quantityPurchased: 0, pricePerUnit: 0 }]);
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleProductChange = (itemId: string, productIdStr: string) => {
        const productId = parseInt(productIdStr);
        updateItem(itemId, 'productId', productId);
    };

    const getTotalValue = () => {
        return items.reduce((total, item) => total + (item.quantityPurchased * item.pricePerUnit), 0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bulk Purchase Entry</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input
                                id="supplier"
                                value={formData.supplier}
                                onChange={(e) => handleInputChange('supplier', e.target.value)}
                                placeholder="Enter supplier name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Purchase Date</Label>
                            <Input
                                id="purchaseDate"
                                type="date"
                                value={formData.purchaseDate}
                                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="lg:col-span-2">
                                            <Label className="text-sm font-medium">Product</Label>
                                            <Select 
                                                value={item.productId > 0 ? item.productId.toString() : ''} 
                                                onValueChange={(value) => handleProductChange(item.id, value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products?.items?.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantityPurchased || ''}
                                                onChange={(e) => updateItem(item.id, 'quantityPurchased', parseInt(e.target.value) || 0)}
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
                                                value={item.pricePerUnit || ''}
                                                onChange={(e) => updateItem(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                                                placeholder="Price"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="bg-white px-3 py-2 rounded border">
                                            <span className="text-sm font-medium">
                                                Total: <span className="text-blue-600">Frws {(item.quantityPurchased * item.pricePerUnit).toLocaleString()}</span>
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
                                    Total Purchase Value: <span className="text-xl font-bold text-blue-600">Frws {getTotalValue().toLocaleString()}</span>
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
                            Record {items.filter(item => item.productId > 0).length} Purchase{items.filter(item => item.productId > 0).length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default BulkPurchasesDialog;