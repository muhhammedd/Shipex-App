'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CreateTemplateDto, OrderTemplate } from '@/types/template';

interface TemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTemplateDto) => Promise<void>;
    template?: OrderTemplate;
    isLoading?: boolean;
}

export function TemplateFormModal({
    isOpen,
    onClose,
    onSubmit,
    template,
    isLoading = false,
}: TemplateFormModalProps) {
    const [formData, setFormData] = useState<CreateTemplateDto>({
        name: template?.name || '',
        description: template?.description || '',
        packageType: template?.packageType || '',
        weight: template?.weight || undefined,
        dimensions: template?.dimensions || undefined,
        shippingCost: template?.shippingCost || undefined,
        codAmount: template?.codAmount || undefined,
        recipientName: template?.recipientName || '',
        recipientPhone: template?.recipientPhone || '',
        recipientCity: template?.recipientCity || '',
        recipientZone: template?.recipientZone || '',
        recipientAddress: template?.recipientAddress || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value ? parseFloat(value) : undefined,
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Template name is required';
        if (!formData.packageType.trim()) newErrors.packageType = 'Package type is required';

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
            console.error('Error submitting template:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card variant="default" className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-background-card dark:bg-background-card-dark border-b border-border dark:border-border-dark p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                        {template ? 'Edit Template' : 'Create New Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-background dark:hover:bg-background-dark transition-colors"
                    >
                        <X className="w-5 h-5 text-text-dim dark:text-text-dim-dark" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Template Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                            Template Information
                        </h3>
                        <Input
                            label="Template Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="e.g., Standard Package to Addis"
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-text-main-dark mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Add a description for this template..."
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-background-card dark:bg-background-card-dark text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                            Package Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Package Type"
                                name="packageType"
                                value={formData.packageType}
                                onChange={handleChange}
                                error={errors.packageType}
                                placeholder="e.g., Documents, Electronics"
                                required
                            />
                            <Input
                                label="Weight (kg) - Optional"
                                name="weight"
                                type="number"
                                step="0.1"
                                value={formData.weight || ''}
                                onChange={handleNumberChange}
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                            Pricing (Optional)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Shipping Cost"
                                name="shippingCost"
                                type="number"
                                step="0.01"
                                value={formData.shippingCost || ''}
                                onChange={handleNumberChange}
                                placeholder="0.00"
                                leftIcon={<span className="text-text-dim dark:text-text-dim-dark">$</span>}
                            />
                            <Input
                                label="COD Amount"
                                name="codAmount"
                                type="number"
                                step="0.01"
                                value={formData.codAmount || ''}
                                onChange={handleNumberChange}
                                placeholder="0.00"
                                leftIcon={<span className="text-text-dim dark:text-text-dim-dark">$</span>}
                            />
                        </div>
                    </div>

                    {/* Recipient Template */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                            Recipient Template (Optional)
                        </h3>
                        <p className="text-sm text-text-dim dark:text-text-dim-dark">
                            Pre-fill recipient details for faster order creation
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Recipient Name"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />
                            <Input
                                label="Phone Number"
                                name="recipientPhone"
                                value={formData.recipientPhone}
                                onChange={handleChange}
                                placeholder="+251912345678"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="City"
                                name="recipientCity"
                                value={formData.recipientCity}
                                onChange={handleChange}
                                placeholder="Addis Ababa"
                            />
                            <Input
                                label="Zone/Region"
                                name="recipientZone"
                                value={formData.recipientZone}
                                onChange={handleChange}
                                placeholder="Bole"
                            />
                        </div>
                        <Input
                            label="Address"
                            name="recipientAddress"
                            value={formData.recipientAddress}
                            onChange={handleChange}
                            placeholder="Street address"
                        />
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
                            {template ? 'Update Template' : 'Create Template'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
