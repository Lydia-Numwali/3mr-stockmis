'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePurchase } from '@/hooks/usePurchases';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface PurchasesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PurchasesDialog: React.FC<PurchasesDialogProps> = ({ open, onOpenChange }) => {
    const [formData, setFormData] = useState({
        productId: '',
        quantityPurchased: '',
        pricePerUnit: '',
        supplier: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const { mutate: createPurchase, isPending } = useCreatePurchase();
    const { data: products } = useProducts({ page: 1, limit: 1000 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.productId || !formData.quantityPurchased || !formData.pricePerUnit) {
            return;
        }

        createPurchase({
            productId: Number(formData.productId),
            quantityPurchased: Number(formData.quantityPurchased),
            pricePerUnit: Number(formData.pricePerUnit),
            supplier: formData.supplier || undefined,
            purchaseDate: formData.purchaseDate,
            notes: formData.notes || undefined,
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    productId: '',
                    quantityPurchased: '',
                    pricePerUnit: '',
                    supplier: '',
                    purchaseDate: new Date().toISOString().split('T')[0],
                    notes: '',
                });
            }
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record New Purchase</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productId">Product *</Label>
                        <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
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
                            <Label htmlFor="quantityPurchased">Quantity *</Label>
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
                            <Label htmlFor="pricePerUnit">Purchase Price *</Label>
                            <Input
                                id="pricePerUnit"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={formData.pricePerUnit}
                                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                                placeholder="Enter price per unit"
                                required
                            />
                        </div>
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
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Purchase
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PurchasesDialog;