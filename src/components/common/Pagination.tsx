import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/api";

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

export function Pagination({
    meta,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) {
    const { page, pageSize, pages, total } = meta;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="flex items-center justify-between text-sm text-slate-600">
            {/* Info */}
            <div className="flex items-center gap-3">
                <span>
                    Showing <span className="font-medium text-slate-900">{startItem}</span>
                    {" - "}
                    <span className="font-medium text-slate-900">{endItem}</span>
                    {" of "}
                    <span className="font-medium text-slate-900">{total}</span>
                </span>

                {onPageSizeChange && (
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus-ring"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size} / page
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange?.(page - 1)}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {generatePageNumbers(page, pages).map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-slate-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange?.(p as number)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                                    ? "bg-primary-600 text-white shadow-sm"
                                    : "hover:bg-slate-100 text-slate-700"
                                }`}
                        >
                            {p}
                        </button>
                    ),
                )}

                <button
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page >= pages}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function generatePageNumbers(
    current: number,
    total: number,
): (number | "...")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) pages.push("...");

    pages.push(total);
    return pages;
}
