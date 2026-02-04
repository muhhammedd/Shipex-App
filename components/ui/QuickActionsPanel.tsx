import React from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Upload, BookOpen, FileText, Download, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface QuickAction {
    icon: React.ElementType;
    label: string;
    description?: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';
    color?: string;
}

interface QuickActionsPanelProps {
    actions?: QuickAction[];
}

// Force re-compile
export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
    const router = useRouter();

    const defaultActions: QuickAction[] = [
        {
            icon: PlusCircle,
            label: 'New Shipment',
            description: 'Create a new order',
            href: '/merchant/orders/new',
            variant: 'primary',
        },
        {
            icon: Upload,
            label: 'Bulk Import',
            description: 'Import multiple orders',
            href: '/merchant/import',
            variant: 'secondary',
        },
        {
            icon: BookOpen,
            label: 'Templates',
            description: 'Use saved templates',
            href: '/merchant/templates',
            variant: 'secondary',
        },
        {
            icon: FileText,
            label: 'Address Book',
            description: 'Manage addresses',
            href: '/merchant/address-book',
            variant: 'secondary',
        },
        {
            icon: Download,
            label: 'Reports',
            description: 'Download analytics',
            href: '/merchant/reports',
            variant: 'secondary',
        },
    ];

    const displayActions = actions || defaultActions;

    const handleClick = (action: QuickAction) => {
        if (action.onClick) {
            action.onClick();
        } else if (action.href) {
            router.push(action.href);
        }
    };

    return (
        <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        Quick Actions
                    </h2>
                    <p className="text-sm text-text-dim dark:text-text-dim-dark mt-1">
                        Frequently used features for faster workflow
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {displayActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(action)}
                        className="group p-4 rounded-xl bg-background-card dark:bg-background-card-dark border border-border dark:border-border-dark hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-card text-left flex flex-col justify-between h-full"
                    >
                        <div className="flex items-start justify-between w-full mb-3">
                            <div className={`p-2.5 rounded-lg ${action.color
                                ? action.color
                                : action.variant === 'primary'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary dark:bg-secondary-100 dark:text-secondary-900'
                                } group-hover:scale-110 transition-transform duration-300`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-dim dark:text-text-dim-dark opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-main dark:text-text-main-dark text-sm mb-1">
                                {action.label}
                            </h3>
                            <p className="text-xs text-text-dim dark:text-text-dim-dark line-clamp-1">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    );
}
