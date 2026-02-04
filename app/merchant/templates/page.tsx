'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Copy,
    Play,
    Package,
    DollarSign,
    MapPin,
    Search
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { TemplateFormModal } from '@/components/merchant/TemplateFormModal';
import { templatesService } from '@/lib/services/templatesService';
import { OrderTemplate, CreateTemplateDto } from '@/types/template';
import { toast } from 'react-hot-toast';

export default function TemplatesPage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<OrderTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<OrderTemplate | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setIsLoading(true);
            const response = await templatesService.getTemplates();
            setTemplates(response.data || []);
        } catch (error) {
            console.error('Error loading templates:', error);
            toast.error('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTemplate(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (template: OrderTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: CreateTemplateDto) => {
        try {
            setIsSubmitting(true);
            if (editingTemplate) {
                await templatesService.updateTemplate(editingTemplate.id, data);
                toast.success('Template updated successfully');
            } else {
                await templatesService.createTemplate(data);
                toast.success('Template created successfully');
            }
            await loadTemplates();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            await templatesService.deleteTemplate(id);
            toast.success('Template deleted successfully');
            await loadTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            toast.error('Failed to delete template');
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            await templatesService.duplicateTemplate(id);
            toast.success('Template duplicated successfully');
            await loadTemplates();
        } catch (error) {
            console.error('Error duplicating template:', error);
            toast.error('Failed to duplicate template');
        }
    };

    const handleUseTemplate = async (id: string) => {
        try {
            // Navigate to new order page with template ID
            router.push(`/merchant/orders/new?templateId=${id}`);
        } catch (error) {
            console.error('Error using template:', error);
            toast.error('Failed to use template');
        }
    };

    const filteredTemplates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.packageType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <Loading text="Loading templates..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        Order Templates
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Save and reuse order configurations for faster workflow
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus className="w-5 h-5" />}
                    onClick={handleCreate}
                >
                    Create Template
                </Button>
            </div>

            {/* Search */}
            {templates.length > 0 && (
                <Card variant="default" className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dim dark:text-text-dim-dark" />
                        <Input
                            placeholder="Search templates by name, description, or package type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </Card>
            )}

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card
                            key={template.id}
                            variant="hover"
                            className="p-6"
                        >
                            {/* Template Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mb-1">
                                        {template.name}
                                    </h3>
                                    {template.description && (
                                        <p className="text-sm text-text-dim dark:text-text-dim-dark line-clamp-2">
                                            {template.description}
                                        </p>
                                    )}
                                </div>
                                <Badge variant="info" size="sm">
                                    {template.usageCount} uses
                                </Badge>
                            </div>

                            {/* Template Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm text-text-main dark:text-text-main-dark">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{template.packageType}</span>
                                    {template.weight && (
                                        <span className="text-text-dim dark:text-text-dim-dark">
                                            • {template.weight}kg
                                        </span>
                                    )}
                                </div>

                                {(template.shippingCost || template.codAmount) && (
                                    <div className="flex items-center gap-3 text-sm">
                                        {template.shippingCost && (
                                            <div className="flex items-center gap-1 text-text-main dark:text-text-main-dark">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                                <span className="font-medium">${template.shippingCost.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {template.codAmount && (
                                            <div className="flex items-center gap-1 text-success">
                                                <span className="text-xs">COD:</span>
                                                <span className="font-medium">${template.codAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {template.recipientCity && (
                                    <div className="flex items-center gap-2 text-sm text-text-dim dark:text-text-dim-dark">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            {template.recipientCity}
                                            {template.recipientZone && `, ${template.recipientZone}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-4 border-t border-border dark:border-border-dark">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleUseTemplate(template.id)}
                                    leftIcon={<Play className="w-4 h-4" />}
                                >
                                    Use Template
                                </Button>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(template)}
                                        leftIcon={<Edit className="w-4 h-4" />}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDuplicate(template.id)}
                                        leftIcon={<Copy className="w-4 h-4" />}
                                    >
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(template.id)}
                                        className="text-error hover:bg-error/10 hover:border-error"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="default" className="p-16 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-16 w-16 bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark flex items-center justify-center mx-auto text-text-dim dark:text-text-dim-dark">
                            <FileText size={32} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                {searchQuery ? 'No templates found' : 'No templates yet'}
                            </p>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                {searchQuery
                                    ? 'Try adjusting your search criteria'
                                    : 'Create templates to save time when creating similar orders'}
                            </p>
                        </div>
                        {!searchQuery && (
                            <Button
                                variant="primary"
                                leftIcon={<Plus className="w-5 h-5" />}
                                onClick={handleCreate}
                            >
                                Create Your First Template
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Template Form Modal */}
            <TemplateFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                template={editingTemplate}
                isLoading={isSubmitting}
            />
        </div>
    );
}
