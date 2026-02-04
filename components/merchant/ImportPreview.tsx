'use client';

import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImportRow } from '@/types/import';

interface ImportPreviewProps {
    rows: ImportRow[];
    onConfirm: () => void;
    onCancel: () => void;
    isImporting: boolean;
}

export function ImportPreview({ rows, onConfirm, onCancel, isImporting }: ImportPreviewProps) {
    const validRows = rows.filter(r => r.isValid);
    const invalidRows = rows.filter(r => !r.isValid);

    return (
        <Card variant="default" className="overflow-hidden">
            <div className="p-6 border-b border-border dark:border-border-dark">
                <h3 className="text-xl font-bold text-text-main dark:text-text-main-dark mb-2">
                    Import Preview
                </h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="success" size="sm">
                            {validRows.length} Valid
                        </Badge>
                    </div>
                    {invalidRows.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Badge variant="error" size="sm">
                                {invalidRows.length} Invalid
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-background dark:bg-background-dark border-b border-border dark:border-border-dark">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Row
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Recipient
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                City
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Package
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-text-dim dark:text-text-dim-dark uppercase">
                                Errors
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border-dark">
                        {rows.map((row) => (
                            <tr
                                key={row.rowNumber}
                                className={`${row.isValid
                                        ? 'bg-background-card dark:bg-background-card-dark'
                                        : 'bg-error/5 dark:bg-error/10'
                                    }`}
                            >
                                <td className="px-4 py-3 text-sm text-text-dim dark:text-text-dim-dark">
                                    {row.rowNumber}
                                </td>
                                <td className="px-4 py-3">
                                    {row.isValid ? (
                                        <CheckCircle className="w-5 h-5 text-success" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-error" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-text-main dark:text-text-main-dark">
                                    {row.recipientName}
                                </td>
                                <td className="px-4 py-3 text-sm text-text-main dark:text-text-main-dark">
                                    {row.recipientPhone}
                                </td>
                                <td className="px-4 py-3 text-sm text-text-main dark:text-text-main-dark">
                                    {row.recipientCity}
                                </td>
                                <td className="px-4 py-3 text-sm text-text-main dark:text-text-main-dark">
                                    {row.packageType}
                                </td>
                                <td className="px-4 py-3">
                                    {row.errors && row.errors.length > 0 && (
                                        <div className="text-xs text-error space-y-1">
                                            {row.errors.map((error, idx) => (
                                                <div key={idx}>• {error}</div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-border dark:border-border-dark flex items-center justify-between gap-4">
                <div className="text-sm text-text-dim dark:text-text-dim-dark">
                    {invalidRows.length > 0 ? (
                        <p className="text-error">
                            ⚠️ {invalidRows.length} row(s) have errors and will be skipped
                        </p>
                    ) : (
                        <p className="text-success">✓ All rows are valid and ready to import</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={isImporting}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        isLoading={isImporting}
                        disabled={validRows.length === 0}
                    >
                        Import {validRows.length} Order{validRows.length !== 1 ? 's' : ''}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
