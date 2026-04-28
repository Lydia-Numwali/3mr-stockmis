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
import { SaleType } from '@/types/stock';

const saleSchema = z.object({
    productId: z.coerce.number().min(1, 'Product is required'),
    quantitySold: z.coerce.number().min(1, 'Quantity must be at least 1'),
    saleType: z.nativeEnum(SaleType),
    priceUsed: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    customerName: z.string().optional(),
    saleDate: z.string().optional(),
    notes: z.string().optional(),
    paymentStatus: z.enum(['PAID', 'CREDIT', 'PARTIAL']).optional(),
    amountPaid: z.coerce.number().min(0).optional(),
    dueDate: z.string().optional(),
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
        defaultValues: { quantitySold: 1, saleType: SaleType.RETAIL, paymentStatus: 'PAID', amountPaid: 0 }
    });

    const watchProductId = watch('productId');
    const watchQty = watch('quantitySold');
    const watchPrice = watch('priceUsed');
    const watchPaymentStatus = watch('paymentStatus');
    const watchAmountPaid = watch('amountPaid');

    // Auto-fill price based on product and sale type
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'productId' || name === 'saleType') {
                const prodId = value.productId;
                const type = value.saleType;
                if (prodId && productsData?.items) {
                    const prod = productsData.items.find((p: any) => p.id === Number(prodId));
                    if (prod) {
                        const suggestedPrice = type === SaleType.WHOLESALE ? prod.wholesalePrice : prod.retailPrice;
                        setValue('priceUsed', suggestedPrice);
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
                saleType: SaleType.RETAIL, 
                priceUsed: 0, 
                notes: '', 
                customerName: '',
                saleDate: today,
                paymentStatus: 'PAID',
                amountPaid: 0,
                dueDate: ''
            });
        }
    }, [open, reset]);

    const onSubmit = async (data: SaleFormValues) => {
        const totalValue = (data.quantitySold || 0) * (data.priceUsed || 0);
        const submitData = {
            ...data,
            amountPaid: data.paymentStatus === 'PAID' ? totalValue : (data.amountPaid || 0)
        };
        await createSaleMutation.mutateAsync(submitData);
        onOpenChange(false);
    };

    const totalCalculated = (watchQty || 0) * (watchPrice || 0);
    const amountDue = totalCalculated - (watchAmountPaid || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Record Sale</DialogTitle>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Sale Type *</label>
                            <Select onValueChange={(val) => setValue('saleType', val as SaleType)} defaultValue={SaleType.RETAIL}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sale Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SaleType.RETAIL}>Retail</SelectItem>
                                    <SelectItem value={SaleType.WHOLESALE}>Wholesale</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.saleType && <p className="text-red-500 text-xs mt-1">{errors.saleType.message}</p>}
                        </div>

                        <div>
                            <Input 
                                label="Sale Date" 
                                type="date" 
                                {...register('saleDate')} 
                                placeholder="When was this sale made?"
                            />
                            {errors.saleDate && <p className="text-red-500 text-xs mt-1">{errors.saleDate.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Input label="Customer Name" {...register('customerName')} placeholder="John Doe" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input label="Quantity Sold *" type="number" {...register('quantitySold')} />
                            {errors.quantitySold && <p className="text-red-500 text-xs mt-1">{errors.quantitySold.message}</p>}
                        </div>

                        <div>
                            <Input label="Price per Unit *" type="number" step="any" {...register('priceUsed')} />
                            {errors.priceUsed && <p className="text-red-500 text-xs mt-1">{errors.priceUsed.message}</p>}
                        </div>
                    </div>

                    <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total Sale Value:</span>
                        <span className="font-bold text-lg text-green-700">{totalCalculated.toLocaleString()}</span>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Payment Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Payment Status *</label>
                                <Select onValueChange={(val) => setValue('paymentStatus', val as any)} defaultValue="PAID">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Payment Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PAID">Paid in Full</SelectItem>
                                        <SelectItem value="CREDIT">Credit (Pay Later)</SelectItem>
                                        <SelectItem value="PARTIAL">Partial Payment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(watchPaymentStatus === 'PARTIAL' || watchPaymentStatus === 'CREDIT') && (
                                <div>
                                    <Input 
                                        label="Due Date" 
                                        type="date" 
                                        {...register('dueDate')} 
                                    />
                                </div>
                            )}
                        </div>

                        {watchPaymentStatus === 'PARTIAL' && (
                            <div className="mb-4">
                                <Input 
                                    label="Amount Paid Now" 
                                    type="number" 
                                    step="any" 
                                    {...register('amountPaid')} 
                                    placeholder="0.00"
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                    Amount Due: <span className="font-semibold text-red-600">{amountDue.toLocaleString()}</span>
                                </p>
                            </div>
                        )}

                        {watchPaymentStatus === 'CREDIT' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-semibold">Credit Sale:</span> Full amount of {totalCalculated.toLocaleString()} will be due on the specified date.
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <Input label="Notes" {...register('notes')} />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Record Sale'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SalesDialog;
