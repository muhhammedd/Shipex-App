'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    ArrowLeft, Package, CheckCircle, Truck, DollarSign,
    ChevronRight, BookOpen, Save, FileText, MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { ordersApiService } from '@/lib/services/ordersApiService';
import { pricingService, ShippingCostResponse } from '@/lib/services/pricingService';
import { Loader2 } from 'lucide-react';
import { CreateOrderRequest } from '@/types/api';

// Validation schema
const orderSchema = z.object({
    recipientName: z.string().min(2, 'Name must be at least 2 characters'),
    recipientPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    recipientAddress: z.string().min(5, 'Address is required'),
    recipientCity: z.string().min(2, 'City is required'),
    recipientZone: z.string().optional(),
    packageDescription: z.string().optional(),
    packageWeight: z.number().positive('Weight must be positive').optional(),
    packageDimensions: z.string().optional(),
    declaredValue: z.number().positive('Declared value must be positive'),
    codAmount: z.number().min(0, 'COD amount cannot be negative').optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

// Mock Address Book Data
const mockAddressBook = [
    { id: '1', name: 'John Doe', phone: '0123456789', address: '123 Main St', city: 'Cairo', zone: 'Downtown' },
    { id: '2', name: 'Jane Smith', phone: '0111222333', address: '456 Nile Ave', city: 'Giza', zone: 'Dokki' },
];

export default function CreateOrderPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shippingCost, setShippingCost] = useState<ShippingCostResponse | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Modals
    const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
    const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setValue,
        formState: { errors },
    } = useForm<OrderFormData>({

        resolver: zodResolver(orderSchema),
        defaultValues: {
            codAmount: 0,
            declaredValue: 0,
        }
    });

    const formData = watch();

    const onSubmit = async (data: OrderFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const orderData: CreateOrderRequest = {
                ...data,
                packageWeight: data.packageWeight || undefined,
                codAmount: data.codAmount || undefined,
            };
            const response = await ordersApiService.createOrder(orderData);
            router.push(`/merchant/orders/${response.order.id}`);
        } catch (err: any) {
            console.error('Error creating order:', err);
            setError(err.response?.data?.message || 'Failed to create order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate shipping cost when relevant values change
    useEffect(() => {
        const calculate = async () => {
            const city = formData.recipientCity;
            const weight = formData.packageWeight;
            const cod = formData.codAmount || 0;

            if (city && weight) {
                setIsCalculating(true);
                try {
                    const result = await pricingService.calculateShipping({
                        recipientCity: city,
                        packageWeight: weight,
                        codAmount: cod
                    });
                    setShippingCost(result);
                } catch (error) {
                    console.error("Failed to calculate shipping:", error);
                } finally {
                    setIsCalculating(false);
                }
            } else {
                setShippingCost(null);
            }
        };

        const timer = setTimeout(calculate, 800);
        return () => clearTimeout(timer);
    }, [formData.recipientCity, formData.packageWeight, formData.codAmount]);

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ['recipientName', 'recipientPhone', 'recipientAddress', 'recipientCity'];
        if (step === 2) fieldsToValidate = ['packageDescription', 'packageWeight'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep(s => s + 1);
    };

    const handleSelectAddress = (address: any) => {
        setValue('recipientName', address.name);
        setValue('recipientPhone', address.phone);
        setValue('recipientAddress', address.address);
        setValue('recipientCity', address.city);
        if (address.zone) setValue('recipientZone', address.zone);
        setIsAddressBookOpen(false);
    };

    const steps = [
        { id: 1, title: "Recipient", icon: MapPin },
        { id: 2, title: "Package", icon: Package },
        { id: 3, title: "Financials", icon: DollarSign },
        { id: 4, title: "Review", icon: CheckCircle }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">Create New Order</h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-1">Fill in the details to create a new shipment.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => setIsTemplatePickerOpen(true)} leftIcon={<FileText className="w-4 h-4" />}>
                        Templates
                    </Button>
                    <Button variant="primary" onClick={() => setIsAddressBookOpen(true)} leftIcon={<BookOpen className="w-4 h-4" />}>
                        Address Book
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stepper */}
                    <Card variant="glass" className="p-4">
                        <div className="flex items-center justify-between relative">
                            {/* Connecting Line */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border dark:bg-border-dark -z-10" />

                            {steps.map((s) => {
                                const Icon = s.icon;
                                const isActive = step >= s.id;
                                const isCurrent = step === s.id;
                                return (
                                    <div key={s.id} className="flex flex-col items-center gap-2 bg-background dark:bg-background-dark px-2">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${isActive
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                                                : 'bg-background-card dark:bg-background-card-dark border-border dark:border-border-dark text-text-dim'
                                            }
                                        `}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-semibold ${isCurrent ? 'text-primary' : 'text-text-dim dark:text-text-dim-dark'}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Step Content */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card variant="default" className="p-6 md:p-8 min-h-[400px]">
                            {error && (
                                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
                                    <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Recipient Name" {...register('recipientName')} error={errors.recipientName?.message} placeholder="e.g. John Doe" />
                                        <Input label="Phone Number" {...register('recipientPhone')} error={errors.recipientPhone?.message} placeholder="e.g. 01xxxxxxxxx" />
                                    </div>
                                    <Input label="Address" {...register('recipientAddress')} error={errors.recipientAddress?.message} placeholder="Full street address and building no." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="City" {...register('recipientCity')} error={errors.recipientCity?.message} placeholder="Select City" />
                                        <Input label="Zone / Area (Optional)" {...register('recipientZone')} placeholder="e.g. Maadi, Heliopolis" />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <Input label="Package Description (Optional)" {...register('packageDescription')} placeholder="e.g. Electronics, Clothes" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Weight (kg)" type="number" step="0.1" {...register('packageWeight', { valueAsNumber: true })} error={errors.packageWeight?.message} placeholder="0.0" />
                                        <Input label="Dimensions (LxWxH cm)" {...register('packageDimensions')} placeholder="e.g. 30x20x10" />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                                        <p className="text-sm text-primary font-medium">Please verify financial details carefully for insurance purposes.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <Input label="Declared Value (EGP)" type="number" step="0.1" {...register('declaredValue', { valueAsNumber: true })} error={errors.declaredValue?.message} placeholder="0.00" />
                                            <p className="text-xs text-text-dim px-1">Value for insurance coverage</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Input label="COD Amount (EGP)" type="number" step="0.1" {...register('codAmount', { valueAsNumber: true })} error={errors.codAmount?.message} placeholder="0.00" />
                                            <p className="text-xs text-text-dim px-1">Amount to collect from recipient</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 border border-border dark:border-border-dark rounded-xl bg-background-card dark:bg-background-card-dark">
                                            <h3 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3">Recipient Details</h3>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-text-main dark:text-text-main-dark">{formData.recipientName}</p>
                                                <p className="text-sm text-text-dim">{formData.recipientPhone}</p>
                                                <p className="text-sm text-text-dim">{formData.recipientAddress}</p>
                                                <p className="text-sm text-text-dim">{formData.recipientCity}, {formData.recipientZone}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 border border-border dark:border-border-dark rounded-xl bg-background-card dark:bg-background-card-dark">
                                            <h3 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-3">Package Info</h3>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-text-main dark:text-text-main-dark">{formData.packageDescription || 'Standard Parcel'}</p>
                                                <p className="text-sm text-text-dim">{formData.packageWeight} kg</p>
                                                <p className="text-sm text-text-dim">{formData.packageDimensions || 'Standard Dimensions'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-success/5 border border-success/10 rounded-xl flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-success">Ready to Create</h3>
                                            <p className="text-xs text-text-dim mt-1">Please review all details before confirming. Tracking number will be generated automatically.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => step === 1 ? router.back() : setStep(s => s - 1)}
                                className="text-text-dim hover:text-text-main"
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>

                            <Button
                                type={step === 4 ? 'submit' : 'button'}
                                onClick={step < 4 ? nextStep : undefined}
                                isLoading={isSubmitting}
                                variant="primary"
                                size="lg"
                                className="px-8 shadow-lg shadow-primary/20"
                                rightIcon={step < 4 ? <ChevronRight className="w-4 h-4" /> : undefined}
                            >
                                {step === 4 ? 'Confirm Order' : 'Continue'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="space-y-6">
                    <Card variant="default" className="p-6 sticky top-6">
                        <h3 className="font-bold text-text-main dark:text-text-main-dark mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Shipping Estimate
                        </h3>

                        {shippingCost ? (
                            <div className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-text-dim">
                                        <span>Base Fare</span>
                                        <span>${shippingCost.breakdown.basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-dim">
                                        <span>Weight Surcharge</span>
                                        <span>+${shippingCost.breakdown.weightSurcharge.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-dim">
                                        <span>COD Fee</span>
                                        <span>+${shippingCost.breakdown.codFee.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border dark:border-border-dark flex justify-between items-end">
                                    <span className="font-bold text-text-main dark:text-text-main-dark">Total Cost</span>
                                    <span className="text-2xl font-bold text-primary">${shippingCost.shippingCost.toFixed(2)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-text-dim">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Enter city and weight to calculate shipping cost.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Address Book Modal */}
            <Modal
                isOpen={isAddressBookOpen}
                onClose={() => setIsAddressBookOpen(false)}
                title="Select from Address Book"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockAddressBook.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => handleSelectAddress(addr)}
                                className="p-4 border border-border dark:border-border-dark rounded-xl hover:border-primary cursor-pointer hover:bg-primary/5 transition-colors group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors">{addr.name}</p>
                                        <p className="text-sm text-text-dim mt-1">{addr.phone}</p>
                                    </div>
                                    <div className="px-2 py-1 bg-background-card dark:text-text-dim-dark rounded text-xs font-semibold">
                                        {addr.zone}
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-text-dim flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {addr.address}, {addr.city}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            {/* Template Picker Modal */}
            <Modal
                isOpen={isTemplatePickerOpen}
                onClose={() => setIsTemplatePickerOpen(false)}
                title="Use a Template"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-text-dim dark:text-text-dim-dark">Select a predefined template to autofill package details.</p>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 't1', name: 'Standard Document', desc: '0.5kg, Paper', weight: 0.5, type: 'Documents' },
                            { id: 't2', name: 'Electronics Box', desc: 'Small box for gadgets', weight: 1.5, type: 'Electronics' },
                            { id: 't3', name: 'Heavy Parcel', desc: 'Up to 5kg', weight: 5, type: 'General' },
                        ].map((t) => (
                            <div
                                key={t.id}
                                onClick={() => {
                                    setValue('packageDescription', t.type);
                                    setValue('packageWeight', t.weight);
                                    setValue('packageDimensions', '30x20x10'); // Example default
                                    setIsTemplatePickerOpen(false);
                                }}
                                className="p-4 border border-border dark:border-border-dark rounded-xl hover:border-primary cursor-pointer hover:bg-primary/5 transition-colors group flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-bold text-text-main dark:text-text-main-dark group-hover:text-primary transition-colors">{t.name}</p>
                                    <p className="text-xs text-text-dim mt-1">{t.desc}</p>
                                </div>
                                <div className="text-xs font-semibold bg-background-card dark:bg-background-card-dark px-2 py-1 rounded text-text-dim">
                                    {t.weight} kg
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
