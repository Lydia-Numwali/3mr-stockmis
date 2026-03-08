'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { useCreateLending } from '@/hooks/useLending';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const lendingSchema = z.object({
    productId: z.coerce.number().min(1, 'Product is required'),
    quantityLent: z.coerce.number().min(1, 'Quantity must be at least 1'),
    borrowerShop: z.string().min(1, 'Borrower details are required'),
    expectedReturnDate: z.string().optional(),
    notes: z.string().optional(),
});

type LendingFormValues = z.infer<typeof lendingSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LendingDialog: React.FC<Props> = ({ open, onOpenChange }) => {
    const createLendingMutation = useCreateLending();
    const isPending = createLendingMutation.isPending;

    const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 1000 });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<LendingFormValues>({
        resolver: zodResolver(lendingSchema),
        defaultValues: { quantityLent: 1 }
    });

    useEffect(() => {
        if (open) {
            reset({ quantityLent: 1, borrowerShop: '', expectedReturnDate: '', notes: '' });
        }
    }, [open, reset]);

    const onSubmit = async (data: LendingFormValues) => {
        // Convert empty string date to undefined to avoid backend parsing errors
        if (!data.expectedReturnDate) data.expectedReturnDate = undefined;

        await createLendingMutation.mutateAsync(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Lend Product</DialogTitle>
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
                        <Input label="Borrower / Shop *" {...register('borrowerShop')} placeholder="Shop B / John Carter" />
                        {errors.borrowerShop && <p className="text-red-500 text-xs mt-1">{errors.borrowerShop.message}</p>}
                    </div>

                    <div>
                        <Input label="Quantity Lent *" type="number" {...register('quantityLent')} />
                        {errors.quantityLent && <p className="text-red-500 text-xs mt-1">{errors.quantityLent.message}</p>}
                    </div>

                    <div>
                        <Input label="Expected Return Date" type="date" {...register('expectedReturnDate')} />
                    </div>

                    <div>
                        <Input label="Notes" {...register('notes')} />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Lend Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LendingDialog;
