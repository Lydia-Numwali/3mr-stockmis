'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Input from '@/components/auth/Input';
import { useCreateLending } from '@/hooks/useLending';
import { useProducts } from '@/hooks/useProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lending } from '@/types/stock';

const RETURN_REASONS = [
    'Damaged',
    'Defective',
    'Worn Out',
    'Incorrect Item Issued',
    'Expired',
    'No Longer Needed',
    'Replacement Required',
    'Maintenance Required',
    'End of Assignment',
    'Excess Quantity',
    'Other'
];

const ITEM_CONDITIONS = [
    'Good',
    'Needs Repair',
    'Damaged',
    'Defective',
    'Beyond Repair',
    'Pending Inspection'
];

const returnSchema = z.object({
    productId: z.coerce.number().min(1, 'Item is required'),
    quantityReturned: z.coerce.number().min(1, 'Quantity must be at least 1'),
    returnReason: z.string().min(1, 'Return reason is required'),
    customReturnReason: z.string().optional(),
    itemCondition: z.string().optional(),
    returnReference: z.string().optional(),
    returnedBy: z.string().min(1, 'Returned by is required'),
    department: z.string().optional(),
    securitySite: z.string().optional(),
    contactInfo: z.string().optional(),
    originalIssueReference: z.string().optional(),
    returnDate: z.string().optional(),
    receivedBy: z.string().optional(),
    returnDocument: z.string().optional(),
    notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lending?: Lending | null;
}

const ReturnDialog: React.FC<Props> = ({ open, onOpenChange, lending }) => {
    const createLendingMutation = useCreateLending();
    const isPending = createLendingMutation.isPending;
    const [showCustomReason, setShowCustomReason] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 1000 });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReturnFormValues>({
        resolver: zodResolver(returnSchema),
        defaultValues: { quantityReturned: 1 }
    });

    const watchReturnReason = watch('returnReason');

    useEffect(() => {
        if (watchReturnReason === 'Other') {
            setShowCustomReason(true);
        } else {
            setShowCustomReason(false);
            setValue('customReturnReason', '');
        }
    }, [watchReturnReason, setValue]);

    useEffect(() => {
        if (open) {
            const today = new Date().toISOString().split('T')[0];
            reset({ 
                quantityReturned: 1,
                returnDate: today,
                itemCondition: 'Pending Inspection',
                returnReason: '',
                returnedBy: '',
                department: '',
                securitySite: '',
                contactInfo: '',
                returnReference: '',
                originalIssueReference: '',
                receivedBy: '',
                notes: '',
            });
            setUploadedFile(null);
        }
    }, [open, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            // In a real implementation, you would upload the file to a server
            // and get back a URL or path to store
            setValue('returnDocument', file.name);
        }
    };

    const onSubmit = async (data: ReturnFormValues) => {
        const finalReturnReason = data.returnReason === 'Other' 
            ? data.customReturnReason 
            : data.returnReason;

        await createLendingMutation.mutateAsync({
            ...data,
            returnReason: finalReturnReason || data.returnReason,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Record Item Return</DialogTitle>
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
                                label="Return Date" 
                                type="date" 
                                {...register('returnDate')} 
                            />
                        </div>

                        <div>
                            <Input label="Quantity Returned *" type="number" {...register('quantityReturned')} />
                            {errors.quantityReturned && <p className="text-red-500 text-xs mt-1">{errors.quantityReturned.message}</p>}
                        </div>
                    </div>

                    {/* Return Reason */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Return Reason *</label>
                            <Select onValueChange={(val) => setValue('returnReason', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RETURN_REASONS.map((reason) => (
                                        <SelectItem key={reason} value={reason}>
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.returnReason && <p className="text-red-500 text-xs mt-1">{errors.returnReason.message}</p>}
                        </div>

                        {showCustomReason && (
                            <div>
                                <Input 
                                    label="Specify Other Reason *" 
                                    {...register('customReturnReason')} 
                                    placeholder="Enter custom reason"
                                />
                                {errors.customReturnReason && <p className="text-red-500 text-xs mt-1">{errors.customReturnReason.message}</p>}
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium mb-1 block">Item Condition</label>
                            <Select onValueChange={(val) => setValue('itemCondition', val)} defaultValue="Pending Inspection">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ITEM_CONDITIONS.map((condition) => (
                                        <SelectItem key={condition} value={condition}>
                                            {condition}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Personnel Details */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Personnel Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input label="Returned By *" {...register('returnedBy')} placeholder="Employee name" />
                                {errors.returnedBy && <p className="text-red-500 text-xs mt-1">{errors.returnedBy.message}</p>}
                            </div>
                            <div>
                                <Input label="Contact Info" {...register('contactInfo')} placeholder="Phone/Email" />
                            </div>
                            <div>
                                <Input label="Department" {...register('department')} placeholder="Department name" />
                            </div>
                            <div>
                                <Input label="Security Site" {...register('securitySite')} placeholder="Branch/Site location" />
                            </div>
                            <div>
                                <Input label="Received By" {...register('receivedBy')} placeholder="Staff who received" />
                            </div>
                        </div>
                    </div>

                    {/* References */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">References</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Input label="Return Reference" {...register('returnReference')} placeholder="Tracking number" />
                            </div>
                            <div>
                                <Input label="Original Issue Reference" {...register('originalIssueReference')} placeholder="Original issue ID" />
                            </div>
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Return Document</h4>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Upload Document</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                            {uploadedFile && (
                                <p className="text-xs text-green-600 mt-1">✓ {uploadedFile.name}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Accepted: PDF, DOC, DOCX, JPG, PNG</p>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t pt-4 mt-4">
                        <Input label="Notes" {...register('notes')} placeholder="Additional information" />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-blue hover:bg-blue/90 text-white" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Record Return'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnDialog;
