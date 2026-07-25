'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePurchase } from '@/hooks/usePurchases';
import { useProducts } from '@/hooks/useProducts';
import { ProductCategory } from '@/types/stock';
import { Loader2 } from 'lucide-react';

interface PurchasesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const emptyForm = {
    category: '',
    productId: '',
    quantityPurchased: '',
    pricePerUnit: '',
    supplier: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
};

const PurchasesDialog: React.FC<PurchasesDialogProps> = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState(emptyForm);

    const { mutate: createPurchase, isPending } = useCreatePurchase();
    const { data: products, isLoading: isLoadingProducts } = useProducts(
        { category: formData.category, page: 1, limit: 200 },
        { enabled: open && !!formData.category },
    );

    useEffect(() => {
        if (!open) {
            setFormData({
                ...emptyForm,
                purchaseDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productId || !formData.quantityPurchased) {
            return;
        }

        createPurchase({
            productId: Number(formData.productId),
            quantityReceived: Number(formData.quantityPurchased),
            pricePerUnit: (formData.pricePerUnit && Number(formData.pricePerUnit) > 0) ? Number(formData.pricePerUnit) : undefined,
            supplier: formData.supplier || undefined,
            purchaseDate: formData.purchaseDate,
            notes: formData.notes || undefined,
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    ...emptyForm,
                    purchaseDate: new Date().toISOString().split('T')[0],
                });
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCategoryChange = (category: string) => {
        setFormData(prev => ({
            ...prev,
            category,
            productId: '',
        }));
    };

    const categoryOptions = Array.from(new Set(Object.values(ProductCategory))).sort();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Items Received</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category first" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productId">Logistics Item *</Label>
                        <Select
                            value={formData.productId}
                            onValueChange={(value) => handleInputChange('productId', value)}
                            disabled={!formData.category || isLoadingProducts}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        !formData.category
                                            ? 'Select a category first'
                                            : isLoadingProducts
                                                ? 'Loading items...'
                                                : 'Select a logistics item'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {products?.items?.length ? (
                                    products.items.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.assetId
                                                ? `${product.assetId} — ${product.name}`
                                                : product.name}
                                            {product.model ? ` (${product.model})` : ''}
                                        </SelectItem>
                                    ))
                                ) : (
                                    formData.category && !isLoadingProducts && (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                            No items in this category
                                        </div>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => handleInputChange('supplier', e.target.value)}
                            placeholder="Enter supplier name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantityPurchased">Quantity Received *</Label>
                            <Input
                                id="quantityPurchased"
                                type="number"
                                min="1"
                                value={formData.quantityPurchased}
                                onChange={(e) => handleInputChange('quantityPurchased', e.target.value)}
                                placeholder="Enter quantity"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pricePerUnit">Unit Price (Optional)</Label>
                            <Input
                                id="pricePerUnit"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.pricePerUnit}
                                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchaseDate">Receiving Date</Label>
                        <Input
                            id="purchaseDate"
                            type="date"
                            value={formData.purchaseDate}
                            onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                        />
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

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !formData.productId}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Receipt
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PurchasesDialog;
