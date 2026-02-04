'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CreateAddressDto, Address } from '@/types/address';

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateAddressDto) => Promise<void>;
    address?: Address;
    isLoading?: boolean;
}

export function AddressFormModal({
    isOpen,
    onClose,
    onSubmit,
    address,
    isLoading = false,
}: AddressFormModalProps) {
    const [formData, setFormData] = useState<CreateAddressDto>({
        name: address?.name || '',
        phone: address?.phone || '',
        email: address?.email || '',
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        zone: address?.zone || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'Ethiopia',
        isDefault: address?.isDefault || false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting address:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card variant="default" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                        {address ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
                    >
                        <X className="w-5 h-5 text-text-dim dark:text-text-dim-dark" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Contact Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="John Doe"
                            required
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            placeholder="+251912345678"
                            required
                        />
                    </div>

                    <Input
                        label="Email (Optional)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />

                    <Input
                        label="Address Line 1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        error={errors.addressLine1}
                        placeholder="Street address, P.O. box"
                        required
                    />

                    <Input
                        label="Address Line 2 (Optional)"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            error={errors.city}
                            placeholder="Addis Ababa"
                            required
                        />
                        <Input
                            label="Zone/Region (Optional)"
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            placeholder="Bole"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Postal Code (Optional)"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="1000"
                        />
                        <Input
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            error={errors.country}
                            placeholder="Ethiopia"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-background dark:bg-background-dark">
                        <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-border dark:border-border-dark text-primary focus:ring-primary"
                        />
                        <label
                            htmlFor="isDefault"
                            className="text-sm font-medium text-text-main dark:text-text-main-dark cursor-pointer"
                        >
                            Set as default address
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border dark:border-border-dark">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            isLoading={isLoading}
                        >
                            {address ? 'Update Address' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
