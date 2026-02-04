'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    FileText,
    Search,
    Download,
    Filter,
    Eye,
    RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Pagination } from '@/components/ui/Pagination';
import { auditLogService } from '@/lib/services/auditLogService';
import { AuditLog, AuditLogFilters } from '@/types/auditLog';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [isExporting, setIsExporting] = useState(false);

    const [filters, setFilters] = useState<AuditLogFilters>({
        page: 1,
        limit: 20,
        search: '',
        action: undefined,
        entityType: undefined,
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadLogs();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const loadLogs = async () => {
        try {
            setIsLoading(true);
            const response = await auditLogService.getLogs(filters);
            setLogs(response.data || []);
            setTotal(response.meta?.total || 0);
        } catch (error) {
            console.error('Error loading audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const blob = await auditLogService.exportLogs(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Audit logs exported');
        } catch (error) {
            console.error('Error exporting logs:', error);
            toast.error('Failed to export logs');
        } finally {
            setIsExporting(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            page: 1,
            limit: 20,
            search: '',
            action: undefined,
            entityType: undefined,
        });
    };

    const getActionColor = (action: string): 'success' | 'warning' | 'error' | 'info' => {
        if (action.includes('CREATE')) return 'success';
        if (action.includes('UPDATE')) return 'warning';
        if (action.includes('DELETE')) return 'error';
        return 'info';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        Audit Logs
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Track all system activities and changes
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={handleExport}
                    isLoading={isExporting}
                >
                    Export Logs
                </Button>
            </div>

            {/* Filters */}
            <Card variant="default" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-dim dark:text-text-dim-dark" />
                        <Input
                            placeholder="Search by user, action, or entity..."
                            className="pl-10"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                        />
                    </div>
                    <div>
                        <Select
                            value={filters.action || 'all'}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                action: e.target.value === 'all' ? undefined : e.target.value,
                                page: 1
                            }))}
                        >
                            <option value="all">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={resetFilters}
                            leftIcon={<RotateCcw className="h-4 w-4" />}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Logs Table */}
            <Card variant="default" className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background dark:bg-background-dark border-b border-border dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Entity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-text-dim dark:text-text-dim-dark uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border-dark">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="h-40 text-center">
                                        <Loading text="Loading audit logs..." />
                                    </td>
                                </tr>
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-background dark:hover:bg-background-dark transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-text-main dark:text-text-main-dark">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                                    {log.userName}
                                                </p>
                                                <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                                    {log.userRole}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getActionColor(log.action)} size="sm">
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                                    {log.entityType}
                                                </p>
                                                <p className="text-xs text-text-dim dark:text-text-dim-dark font-mono">
                                                    {log.entityId.substring(0, 8)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.changes && (
                                                <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                                    {Object.keys(log.changes).length} field(s) changed
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <FileText className="h-12 w-12 text-text-dim dark:text-text-dim-dark" />
                                            <p className="text-text-dim dark:text-text-dim-dark font-semibold">
                                                No audit logs found
                                            </p>
                                            <Button variant="ghost" onClick={resetFilters}>
                                                Clear filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {total > (filters.limit || 20) && (
                    <div className="border-t border-border dark:border-border-dark bg-background/50 dark:bg-background-dark/50">
                        <Pagination
                            currentPage={filters.page || 1}
                            totalPages={Math.ceil(total / (filters.limit || 20))}
                            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
