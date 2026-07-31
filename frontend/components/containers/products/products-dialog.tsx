'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { Product, ProductCategory, PackagingUnit } from '@/types/stock';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const productSchema = z.object({
    name: z.string().min(1, 'Item name is required'),
    category: z.string().optional(),
    packagingUnit: z.nativeEnum(PackagingUnit).optional(),
    unitsPerPackage: z.coerce.number().min(0.01).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    wholesalePrice: z.coerce.number().min(0).optional(),
    retailPrice: z.coerce.number().min(0).optional(),
    costPrice: z.coerce.number().min(0).optional(),
    lowStockThreshold: z.coerce.number().min(0),
    supplier: z.string().optional(),
    notes: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
    type: 'add' | 'edit';
    product?: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProductDialog: React.FC<Props> = ({ type, product, open, onOpenChange }) => {
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const isPending = createMutation.isPending || updateMutation.isPending;

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            brand: '',
            category: ProductCategory.IT_EQUIPMENT,
            packagingUnit: PackagingUnit.PIECES,
            unitsPerPackage: 1,
            lowStockThreshold: 5,
        }
    });

    useEffect(() => {
        if (open && type === 'edit' && product) {
            reset({
                name: product.name,
                category: product.category || ProductCategory.MISCELLANEOUS_ASSETS,
                packagingUnit: (product.packagingUnit as PackagingUnit) || PackagingUnit.PIECES,
                unitsPerPackage: product.unitsPerPackage || 1,
                brand: product.brand || '',
                model: product.model || '',
                wholesalePrice: product.wholesalePrice ?? product.standardUnitCost,
                retailPrice: product.retailPrice ?? product.issueValue,
                costPrice: product.costPrice,
                lowStockThreshold: product.lowStockThreshold,
                supplier: product.supplier || '',
                notes: product.notes || '',
            });
        } else if (open && type === 'add') {
            reset({
                name: '',
                brand: '',
                category: ProductCategory.IT_EQUIPMENT,
                packagingUnit: PackagingUnit.PIECES,
                unitsPerPackage: 1,
                model: '',
                wholesalePrice: 0,
                retailPrice: 0,
                costPrice: 0,
                lowStockThreshold: 5,
                supplier: '',
                notes: '',
            });
        }
    }, [open, type, product, reset]);

    const onSubmit = async (data: ProductFormValues) => {
        const payload = {
            ...data,
            standardUnitCost: data.wholesalePrice,
            issueValue: data.retailPrice,
            // Catalog items start at zero; stock comes from Items Received
            quantity: type === 'add' ? 0 : undefined,
        };
        if (type === 'edit' && product) {
            const { quantity: _ignored, ...updatePayload } = payload as any;
            await updateMutation.mutateAsync({ id: product.id, data: updatePayload });
        } else {
            await createMutation.mutateAsync(payload as any);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{type === 'add' ? 'Add Logistics Item' : 'Edit Logistics Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 grid grid-cols-2 gap-4">

                    <div className="col-span-2">
                        <Input label="Item Name *" {...register('name')} placeholder="Computer Laptop" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-urbanist text-[#081129DB] text-[18px] font-[400] pb-1 block">Category</label>
                        <Select
                            onValueChange={(val) => setValue('category', val)}
                            defaultValue={product?.category || ProductCategory.IT_EQUIPMENT}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(ProductCategory).map(([k, v]) => (
                                    <SelectItem key={k} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Input label="Model / Specification" {...register('model')} placeholder="HP PRO BOOK 450" />
                    </div>

                    <div>
                        <Input label="Brand" {...register('brand')} placeholder="HP" />
                    </div>

                    <div>
                        <Input label="Low Stock Threshold" type="number" {...register('lowStockThreshold')} />
                    </div>

                    <div>
                        <label className="text-sm font-urbanist text-[#081129DB] text-[18px] font-[400] pb-1 block">Packaging Unit</label>
                        <Select onValueChange={(val) => setValue('packagingUnit', val as PackagingUnit)} defaultValue={product?.packagingUnit || PackagingUnit.PIECES}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(PackagingUnit).map(([k, v]) => (
                                    <SelectItem key={k} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Input label="Units Per Package" type="number" step="0.01" {...register('unitsPerPackage')} placeholder="1" />
                    </div>

                    <div>
                        <Input label="Supplier" {...register('supplier')} />
                    </div>

                    <div>
                        <Input label="Cost Price (Optional)" type="number" step="any" {...register('costPrice')} placeholder="0" />
                    </div>

                    <div>
                        <Input label="Standard Unit Cost (Optional)" type="number" step="any" {...register('wholesalePrice')} placeholder="0" />
                    </div>

                    <div>
                        <Input label="Issue Value (Optional)" type="number" step="any" {...register('retailPrice')} placeholder="0" />
                    </div>

                    <div className="col-span-2">
                        <Input label="Notes" {...register('notes')} placeholder="Optional notes" />
                    </div>

                    {type === 'add' && (
                        <p className="col-span-2 text-sm text-muted-foreground">
                            New items start at 0 stock. Record stock through Items Received.
                        </p>
                    )}

                    <DialogFooter className="col-span-2 mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Logistics Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDialog;
