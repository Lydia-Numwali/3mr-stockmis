'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { Product, ProductCategory } from '@/types/stock';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    category: z.nativeEnum(ProductCategory),
    brand: z.string().optional(),
    model: z.string().optional(),
    partType: z.string().optional(),
    wholesalePrice: z.coerce.number().min(0),
    retailPrice: z.coerce.number().min(0),
    costPrice: z.coerce.number().min(0),
    quantity: z.coerce.number().min(0),
    lowStockThreshold: z.coerce.number().min(0),
    supplier: z.string().optional(),
    storageLocation: z.string().optional(),
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
            category: ProductCategory.OTHER,
            quantity: 0,
            lowStockThreshold: 5,
        }
    });

    useEffect(() => {
        if (open && type === 'edit' && product) {
            reset({
                name: product.name,
                category: product.category as ProductCategory,
                brand: product.brand || '',
                model: product.model || '',
                partType: product.partType || '',
                wholesalePrice: product.wholesalePrice,
                retailPrice: product.retailPrice,
                costPrice: product.costPrice,
                quantity: product.quantity,
                lowStockThreshold: product.lowStockThreshold,
                supplier: product.supplier || '',
                storageLocation: product.storageLocation || '',
            });
        } else if (open && type === 'add') {
            reset({
                name: '',
                category: ProductCategory.OTHER,
                brand: '',
                model: '',
                partType: '',
                wholesalePrice: 0,
                retailPrice: 0,
                costPrice: 0,
                quantity: 0,
                lowStockThreshold: 5,
                supplier: '',
                storageLocation: '',
            });
        }
    }, [open, type, product, reset]);

    const onSubmit = async (data: ProductFormValues) => {
        if (type === 'edit' && product) {
            await updateMutation.mutateAsync({ id: product.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{type === 'add' ? 'Add Product' : 'Edit Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 grid grid-cols-2 gap-4">

                    <div className="col-span-2">
                        <Input label="Name *" {...register('name')} placeholder="Engine Oil" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Category *</label>
                        <Select onValueChange={(val) => setValue('category', val as ProductCategory)} defaultValue={product?.category || ProductCategory.OTHER}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(ProductCategory).map(([k, v]) => (
                                    <SelectItem key={k} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <Input label="Brand" {...register('brand')} placeholder="Castrol" />
                    </div>

                    <div>
                        <Input label="Model" {...register('model')} placeholder="Magnatec" />
                    </div>

                    <div>
                        <Input label="Part Type" {...register('partType')} placeholder="Oil" />
                    </div>

                    <div>
                        <Input label="Cost Price *" type="number" step="any" {...register('costPrice')} />
                        {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice.message}</p>}
                    </div>

                    <div>
                        <Input label="Wholesale Price *" type="number" step="any" {...register('wholesalePrice')} />
                        {errors.wholesalePrice && <p className="text-red-500 text-xs mt-1">{errors.wholesalePrice.message}</p>}
                    </div>

                    <div>
                        <Input label="Retail Price *" type="number" step="any" {...register('retailPrice')} />
                        {errors.retailPrice && <p className="text-red-500 text-xs mt-1">{errors.retailPrice.message}</p>}
                    </div>

                    <div>
                        <Input label="Quantity *" type="number" {...register('quantity')} disabled={type === 'edit'} />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div>
                        <Input label="Low Stock Threshold" type="number" {...register('lowStockThreshold')} />
                    </div>

                    <div>
                        <Input label="Supplier" {...register('supplier')} />
                    </div>

                    <div>
                        <Input label="Storage Location" {...register('storageLocation')} placeholder="A-12" />
                    </div>

                    <DialogFooter className="col-span-2 mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDialog;
