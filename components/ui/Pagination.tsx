import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Simple logic for showing a subset of pages if there are many
    const visiblePages = pages.filter(p => {
        if (totalPages <= 7) return true;
        if (p === 1 || p === totalPages) return true;
        if (Math.abs(p - currentPage) <= 1) return true;
        return false;
    });

    const renderPageNumber = (p: number, index: number) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && p - prevPage > 1;

        return (
            <React.Fragment key={p}>
                {showEllipsis && (
                    <span className="px-3 text-accent/20 font-black">...</span>
                )}
                <Button
                    variant={p === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    className={`w-10 h-10 rounded-xl transition-all duration-500 font-black ${p === currentPage ? 'shadow-lg shadow-primary/20' : 'text-primary-light/40 hover:text-primary'
                        }`}
                    onClick={() => onPageChange(p)}
                    disabled={isLoading}
                >
                    {p}
                </Button>
            </React.Fragment>
        );
    };

    return (
        <div className="flex items-center justify-center gap-3 py-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="rounded-xl border-accent/10 px-5 group"
            >
                <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Prev</span>
            </Button>

            <div className="flex items-center gap-1 glass p-1 rounded-2xl border border-accent/5">
                {visiblePages.map(renderPageNumber)}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="rounded-xl border-accent/10 px-5 group"
            >
                <span className="text-[10px] font-black uppercase tracking-widest">Next</span>
                <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
        </div>
    );
}
