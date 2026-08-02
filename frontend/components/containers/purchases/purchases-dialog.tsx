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
    mode: 'existing', // 'existing' or 'new'
    category: '',
    productId: '',
    // Fields for new items
    itemName: '',
    brand: '',
    model: '',
    itemType: '',
    // Common fields
    quantityPurchased: '',
    pricePerUnit: '',
    supplier: '',
    deliveryReference: '',
    serialNumber: '',
    location: '',
    custodian: '',
    condition: 'Good',
    receivedBy: '',
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

        // Validation based on mode
        if (formData.mode === 'new' && !formData.itemName) {
            alert('Please enter item name for new item');
            return;
        }
        
        if (formData.mode === 'existing' && !formData.productId) {
            alert('Please select an existing item');
            return;
        }

        if (!formData.quantityPurchased) {
            alert('Please enter quantity received');
            return;
        }

        const payload: any = {
            quantityReceived: Number(formData.quantityPurchased),
            pricePerUnit: (formData.pricePerUnit && Number(formData.pricePerUnit) > 0) ? Number(formData.pricePerUnit) : undefined,
            supplier: formData.supplier || undefined,
            deliveryReference: formData.deliveryReference || undefined,
            serialNumber: formData.serialNumber || undefined,
            location: formData.location || undefined,
            custodian: formData.custodian || undefined,
            condition: formData.condition || 'Good',
            receivedBy: formData.receivedBy || undefined,
            receivingDate: formData.purchaseDate,
            notes: formData.notes || undefined,
        };

        // Add mode-specific fields
        if (formData.mode === 'new') {
            payload.itemName = formData.itemName;
            payload.category = formData.category || undefined;
            payload.brand = formData.brand || undefined;
            payload.model = formData.model || undefined;
            payload.itemType = formData.itemType || undefined;
        } else {
            payload.productId = Number(formData.productId);
        }

        createPurchase(payload, {
            onSuccess: () => {
                onOpenChange(false);
                setFormData({
                    ...emptyForm,
                    purchaseDate: new Date().toISOString().split('T')[0],
                });
            },
            onError: (error: any) => {
                alert(error?.response?.data?.message || 'Failed to record receipt');
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Record Items Received</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mode Selection */}
                    <div className="space-y-2">
                        <Label>Item Type</Label>
                        <Select value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="existing">Add to Existing Item</SelectItem>
                                <SelectItem value="new">Receive New Item Type</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {formData.mode === 'new' 
                                ? 'Creates new item record(s) with auto-generated Asset IDs' 
                                : 'Adds more units to an existing item type'}
                        </p>
                    </div>

                    {/* New Item Fields */}
                    {formData.mode === 'new' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="itemName">Item Name *</Label>
                                <Input
                                    id="itemName"
                                    value={formData.itemName}
                                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                                    placeholder="e.g., Computer Laptop, Office Chair"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
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
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand}
                                        onChange={(e) => handleInputChange('brand', e.target.value)}
                                        placeholder="e.g., HP, Dell"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model/Specification</Label>
                                    <Input
                                        id="model"
                                        value={formData.model}
                                        onChange={(e) => handleInputChange('model', e.target.value)}
                                        placeholder="e.g., HP PRO BOOK 450"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="itemType">Item Type</Label>
                                    <Input
                                        id="itemType"
                                        value={formData.itemType}
                                        onChange={(e) => handleInputChange('itemType', e.target.value)}
                                        placeholder="e.g., Electronics"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Existing Item Fields */}
                    {formData.mode === 'existing' && (
                        <>
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
                                                    {product.name}
                                                    {product.model ? ` — ${product.model}` : ''}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            formData.category && !isLoadingProducts && (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No items in this category. Switch to "Receive New Item Type" to create one.
                                                </div>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Common Fields for Both Modes */}
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-sm font-semibold mb-3">Receipt Details</h3>

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
                                <p className="text-xs text-muted-foreground">
                                    Each item will get a unique Asset ID (CAL-XXX-001-2026, CAL-XXX-002-2026, etc.)
                                </p>
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

                        <div className="grid grid-cols-2 gap-4 mt-4">
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
                                <Label htmlFor="deliveryReference">Delivery Reference</Label>
                                <Input
                                    id="deliveryReference"
                                    value={formData.deliveryReference}
                                    onChange={(e) => handleInputChange('deliveryReference', e.target.value)}
                                    placeholder="Tracking/PO number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="serialNumber">Serial Number (Optional)</Label>
                                <Input
                                    id="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                                    placeholder="For serialized items"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Storage location"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="custodian">Custodian</Label>
                                <Input
                                    id="custodian"
                                    value={formData.custodian}
                                    onChange={(e) => handleInputChange('custodian', e.target.value)}
                                    placeholder="Person/department responsible"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New</SelectItem>
                                        <SelectItem value="Good">Good</SelectItem>
                                        <SelectItem value="Fair">Fair</SelectItem>
                                        <SelectItem value="Poor">Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="receivedBy">Received By</Label>
                                <Input
                                    id="receivedBy"
                                    value={formData.receivedBy}
                                    onChange={(e) => handleInputChange('receivedBy', e.target.value)}
                                    placeholder="Staff name"
                                />
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
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Enter any additional notes"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={
                                isPending || 
                                !formData.quantityPurchased ||
                                (formData.mode === 'new' && !formData.itemName) ||
                                (formData.mode === 'existing' && !formData.productId)
                            }
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {formData.mode === 'new' ? 'Create & Record Receipt' : 'Record Receipt'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PurchasesDialog;
