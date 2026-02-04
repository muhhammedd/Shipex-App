'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Upload,
    Download,
    FileText,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImportPreview } from '@/components/merchant/ImportPreview';
import { importService } from '@/lib/services/importService';
import { ImportRow, ImportValidationResponse, ImportResponse } from '@/types/import';
import { toast } from 'react-hot-toast';

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

export default function ImportPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<ImportStep>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [validationData, setValidationData] = useState<ImportValidationResponse | null>(null);
    const [importResult, setImportResult] = useState<ImportResponse | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleFileSelect = async (selectedFile: File) => {
        // Validate file type
        const validTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

        if (!validTypes.includes(selectedFile.type) && fileExtension !== 'csv' && fileExtension !== 'json') {
            toast.error('Please upload a CSV or JSON file');
            return;
        }

        setFile(selectedFile);
        await validateFile(selectedFile);
    };

    const validateFile = async (fileToValidate: File) => {
        try {
            setIsValidating(true);
            const response = await importService.validateFile(fileToValidate);
            setValidationData(response);

            if (response.isValid) {
                toast.success(`File validated: ${response.validRows} valid rows`);
                setStep('preview');
            } else {
                toast.error(`Validation failed: ${response.invalidRows} invalid rows`);
                setStep('preview');
            }
        } catch (error) {
            console.error('Error validating file:', error);
            toast.error('Failed to validate file');
        } finally {
            setIsValidating(false);
        }
    };

    const handleImport = async () => {
        if (!validationData) return;

        const validRows = validationData.rows.filter(r => r.isValid);
        if (validRows.length === 0) {
            toast.error('No valid rows to import');
            return;
        }

        try {
            setIsImporting(true);
            setStep('importing');

            const importData = {
                rows: validRows.map(row => ({
                    recipientName: row.recipientName,
                    recipientPhone: row.recipientPhone,
                    recipientAddress: row.recipientAddress,
                    recipientCity: row.recipientCity,
                    recipientZone: row.recipientZone,
                    packageType: row.packageType,
                    weight: row.weight,
                    codAmount: row.codAmount,
                    notes: row.notes,
                }))
            };

            const result = await importService.importOrders(importData);
            setImportResult(result);
            setStep('complete');

            toast.success(`Successfully imported ${result.successCount} orders!`);
        } catch (error) {
            console.error('Error importing orders:', error);
            toast.error('Failed to import orders');
            setStep('preview');
        } finally {
            setIsImporting(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await importService.downloadSampleTemplate();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'order_import_template.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Template downloaded');
        } catch (error) {
            console.error('Error downloading template:', error);
            toast.error('Failed to download template');
        }
    };

    const handleReset = () => {
        setStep('upload');
        setFile(null);
        setValidationData(null);
        setImportResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-text-main dark:text-text-main-dark font-gilroy">
                        Bulk Order Import
                    </h1>
                    <p className="text-text-dim dark:text-text-dim-dark mt-2">
                        Upload CSV or JSON files to create multiple orders at once
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={handleDownloadTemplate}
                >
                    Download Template
                </Button>
            </div>

            {/* Upload Step */}
            {step === 'upload' && (
                <Card variant="default" className="p-8">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-border dark:border-border-dark'
                            }`}
                    >
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="h-16 w-16 bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark flex items-center justify-center mx-auto text-primary">
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                    {isDragging ? 'Drop file here' : 'Upload your file'}
                                </p>
                                <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                    Drag and drop your CSV or JSON file, or click to browse
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.json"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                            <Button
                                variant="primary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isValidating}
                                isLoading={isValidating}
                            >
                                {isValidating ? 'Validating...' : 'Choose File'}
                            </Button>
                            <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                Supported formats: CSV, JSON • Max file size: 10MB
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                                <Download className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-text-main dark:text-text-main-dark mb-1">
                                1. Download Template
                            </h3>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                Get the sample CSV template with required fields
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-text-main dark:text-text-main-dark mb-1">
                                2. Fill Your Data
                            </h3>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                Add your order details following the template format
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-text-main dark:text-text-main-dark mb-1">
                                3. Upload & Import
                            </h3>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                Upload your file and review before importing
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Preview Step */}
            {step === 'preview' && validationData && (
                <ImportPreview
                    rows={validationData.rows}
                    onConfirm={handleImport}
                    onCancel={handleReset}
                    isImporting={isImporting}
                />
            )}

            {/* Importing Step */}
            {step === 'importing' && (
                <Card variant="default" className="p-16 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                        <div>
                            <p className="text-lg font-semibold text-text-main dark:text-text-main-dark">
                                Importing Orders...
                            </p>
                            <p className="text-sm text-text-dim dark:text-text-dim-dark mt-2">
                                Please wait while we create your orders
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Complete Step */}
            {step === 'complete' && importResult && (
                <Card variant="default" className="p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="h-16 w-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-success">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark mb-2">
                                Import Complete!
                            </h2>
                            <p className="text-text-dim dark:text-text-dim-dark">
                                Your orders have been successfully imported
                            </p>
                        </div>

                        {/* Results Summary */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <Card variant="default" className="p-4 text-center">
                                <p className="text-2xl font-bold text-text-main dark:text-text-main-dark">
                                    {importResult.totalOrders}
                                </p>
                                <p className="text-sm text-text-dim dark:text-text-dim-dark">Total</p>
                            </Card>
                            <Card variant="default" className="p-4 text-center">
                                <p className="text-2xl font-bold text-success">
                                    {importResult.successCount}
                                </p>
                                <p className="text-sm text-text-dim dark:text-text-dim-dark">Success</p>
                            </Card>
                            <Card variant="default" className="p-4 text-center">
                                <p className="text-2xl font-bold text-error">
                                    {importResult.failureCount}
                                </p>
                                <p className="text-sm text-text-dim dark:text-text-dim-dark">Failed</p>
                            </Card>
                        </div>

                        {/* Errors */}
                        {importResult.errors && importResult.errors.length > 0 && (
                            <div className="mb-8 p-4 bg-error/5 dark:bg-error/10 rounded-lg border border-error/20">
                                <div className="flex items-start gap-2 mb-3">
                                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-error">Import Errors</p>
                                        <p className="text-sm text-text-dim dark:text-text-dim-dark">
                                            The following rows failed to import:
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {importResult.errors.map((error, idx) => (
                                        <div key={idx} className="text-sm text-text-main dark:text-text-main-dark">
                                            Row {error.rowNumber}: {error.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Import More
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => router.push('/merchant/orders')}
                                className="flex-1"
                            >
                                View Orders
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
