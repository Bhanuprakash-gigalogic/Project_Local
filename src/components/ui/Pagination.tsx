import * as React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic to show limited pages could be added here (e.g. 1, 2, ..., 10)
    // For simplicity, showing range around current page

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Simplified pagination rendering */}
            <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
