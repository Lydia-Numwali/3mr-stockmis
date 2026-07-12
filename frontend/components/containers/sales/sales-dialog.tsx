'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { useCreateSale } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const saleSchema = z.object({
    productId: z.coerce.number().min(1, 'Product is required'),
    quantitySold: z.coerce.number().min(1, 'Quantity must be at least 1'),
    priceUsed: z.coerce.number().min(0).optional(),
    customerName: z.string().optional(),
    department: z.string().optional(),
    securitySite: z.string().optional(),
    issuedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    purpose: z.string().optional(),
    saleDate: z.string().optional(),
    notes: z.string().optional(),
});

type SaleFormValues = z.infer<typeof saleSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SalesDialog: React.FC<Props> = ({ open, onOpenChange }) => {
    const createSaleMutation = useCreateSale();
    const isPending = createSaleMutation.isPending;

    const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 1000 });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SaleFormValues>({
        resolver: zodResolver(saleSchema),
        defaultValues: { quantitySold: 1 }
    });

    const watchProductId = watch('productId');
    const watchQty = watch('quantitySold');
    const watchPrice = watch('priceUsed');

    // Auto-fill price based on product
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'productId') {
                const prodId = value.productId;
                if (prodId && productsData?.items) {
                    const prod = productsData.items.find((p: any) => p.id === Number(prodId));
                    if (prod) {
                        // Use issue value (retail price) as default
                        setValue('priceUsed', prod.retailPrice || prod.issueValue || 0);
                    }
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, productsData, setValue]);

    useEffect(() => {
        if (open) {
            const today = new Date().toISOString().split('T')[0];
            reset({ 
                quantitySold: 1, 
                priceUsed: 0, 
                notes: '', 
                customerName: '',
                department: '',
                securitySite: '',
                issuedBy: '',
                approvedBy: '',
                purpose: '',
                saleDate: today
            });
        }
    }, [open, reset]);

    const onSubmit = async (data: SaleFormValues) => {
        // Transform field names to match API expectations
        const apiData = {
            ...data,
            quantityIssued: data.quantitySold,
            issueDate: data.saleDate,
        };
        await createSaleMutation.mutateAsync(apiData);
        onOpenChange(false);
    };

    const totalCalculated = (watchQty || 0) * (watchPrice || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Issue Items</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

                    <div>
                        <label className="text-sm font-medium mb-1 block">Logistics Item *</label>
                        <Select onValueChange={(val) => setValue('productId', Number(val))}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingProducts ? "Loading items..." : "Select Item"} />
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input 
                                label="Issue Date" 
                                type="date" 
                                {...register('saleDate')} 
                                placeholder="When were items issued?"
                            />
                            {errors.saleDate && <p className="text-red-500 text-xs mt-1">{errors.saleDate.message}</p>}
                        </div>

                        <div>
                            <Input label="Quantity Issued *" type="number" {...register('quantitySold')} />
                            {errors.quantitySold && <p className="text-red-500 text-xs mt-1">{errors.quantitySold.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input label="Issue Value per Unit (Optional)" type="number" step="any" {...register('priceUsed')} placeholder="0.00" />
                            {errors.priceUsed && <p className="text-red-500 text-xs mt-1">{errors.priceUsed.message}</p>}
                        </div>

                        <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center">
                            <span className="font-medium text-gray-700 text-sm">Total Value:</span>
                            <span className="font-bold text-lg text-green-700">{totalCalculated.toLocaleString()} {totalCalculated > 0 ? 'Frw' : '-'}</span>
                        </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recipient Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input label="Issued To" {...register('customerName')} placeholder="Employee name" />
                            </div>
                            <div>
                                <Input label="Department" {...register('department')} placeholder="Department name" />
                            </div>
                            <div>
                                <Input label="Security Site" {...register('securitySite')} placeholder="Branch/Site location" />
                            </div>
                            <div>
                                <Input label="Purpose" {...register('purpose')} placeholder="Reason for issue" />
                            </div>
                        </div>
                    </div>

                    {/* Authorization */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Authorization</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input label="Issued By" {...register('issuedBy')} placeholder="Staff who issued" />
                            </div>
                            <div>
                                <Input label="Approved By" {...register('approvedBy')} placeholder="Supervisor/Manager" />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t pt-4 mt-4">
                        <Input label="Notes" {...register('notes')} placeholder="Additional information" />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Issue Items'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SalesDialog;
