'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { useReturnLending } from '@/hooks/useLending';
import { Lending } from '@/types/stock';

const returnSchema = z.object({
    quantityReturned: z.coerce.number().min(1, 'Quantity returned must be at least 1'),
    notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lending: Lending | null;
}

const ReturnDialog: React.FC<Props> = ({ open, onOpenChange, lending }) => {
    const returnMutation = useReturnLending();
    const isPending = returnMutation.isPending;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ReturnFormValues>({
        resolver: zodResolver(returnSchema),
        defaultValues: { quantityReturned: 1 }
    });

    useEffect(() => {
        if (open && lending) {
            const remaining = lending.quantityLent - lending.quantityReturned;
            reset({ quantityReturned: remaining, notes: '' });
        }
    }, [open, lending, reset]);

    const onSubmit = async (data: ReturnFormValues) => {
        if (!lending) return;
        await returnMutation.mutateAsync({
            id: lending.id,
            data: {
                quantityReturned: data.quantityReturned,
                notes: data.notes
            }
        });
        onOpenChange(false);
    };

    if (!lending) return null;
    const remaining = lending.quantityLent - lending.quantityReturned;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Return Lent Item</DialogTitle>
                    <DialogDescription>
                        Returning {lending.product.name} from {lending.borrowerShop}.<br />
                        Currently outstanding: {remaining} items.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

                    <div>
                        <Input label="Quantity Being Returned *" type="number" max={remaining} {...register('quantityReturned')} />
                        {errors.quantityReturned && <p className="text-red-500 text-xs mt-1">{errors.quantityReturned.message}</p>}
                    </div>

                    <div>
                        <Input label="Notes" {...register('notes')} />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isPending}>
                            {isPending ? 'Processing...' : 'Mark Returned'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnDialog;
