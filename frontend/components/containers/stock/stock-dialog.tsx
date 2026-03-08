'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { useAddStock } from '@/hooks/useStock';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const stockSchema = z.object({
    productId: z.coerce.number().min(1, 'Product is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    purchasePrice: z.coerce.number().optional(),
    supplier: z.string().optional(),
    notes: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const StockDialog: React.FC<Props> = ({ open, onOpenChange }) => {
    const addStockMutation = useAddStock();
    const isPending = addStockMutation.isPending;

    // We load a large list of products for the dropdown for simplicity, 
    // normally this would be an async select or paginated
    const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 1000 });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<StockFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: { quantity: 1 }
    });

    useEffect(() => {
        if (open) {
            reset({ quantity: 1, purchasePrice: 0, supplier: '', notes: '' });
        }
    }, [open, reset]);

    const onSubmit = async (data: StockFormValues) => {
        await addStockMutation.mutateAsync({
            ...data,
            purchasePrice: data.purchasePrice || 0
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Stock (Stock IN)</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

                    <div>
                        <label className="text-sm font-medium mb-1 block">Product *</label>
                        <Select onValueChange={(val) => setValue('productId', Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingProducts ? "Loading products..." : "Select Product"} />
                            </SelectTrigger>
                            <SelectContent>
                                {productsData?.items?.map((p: any) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name} ({p.quantity} in stock)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>}
                    </div>

                    <div>
                        <Input label="Quantity Received *" type="number" {...register('quantity')} />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div>
                        <Input label="New Purchase Price (Updates Cost Price)" type="number" step="any" {...register('purchasePrice')} />
                    </div>

                    <div>
                        <Input label="Supplier" {...register('supplier')} />
                    </div>

                    <div>
                        <Input label="Notes" {...register('notes')} />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Add Stock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default StockDialog;
