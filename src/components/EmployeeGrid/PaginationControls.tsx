import { useMemo } from 'react';

const PAGE_SIZES = [10, 25, 50, 100];

interface PaginationControlsProps {
  currentPage: number;  // 0-indexed (AG Grid convention)
  totalPages: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationControls = ({
  currentPage, totalPages, pageSize, totalRows,
  onPageChange, onPageSizeChange,
}: PaginationControlsProps) => {
  const from = totalRows === 0 || Number.isNaN(currentPage) ? 0 : currentPage * pageSize + 1;
    const to   = Number.isNaN(currentPage) ? 0 : Math.min((currentPage + 1) * pageSize, totalRows)

  // Page numbers with ellipsis
  const pageNumbers = useMemo((): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const pages: (number | 'ellipsis')[] = [0];
    if (currentPage > 3) pages.push('ellipsis');
    const start = Math.max(1, currentPage - 1);
    const end   = Math.min(totalPages - 2, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 4) pages.push('ellipsis');
    pages.push(totalPages - 1);
    return pages;
  }, [currentPage, totalPages]);

  const navBtn = (disabled: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      disabled
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`;

  const pageBtn = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-indigo-600 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">

      {/* Left — rows per page */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-gray-400 whitespace-nowrap">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>{size} rows</option>
          ))}
        </select>
      </div>

      {/* Centre — row range */}
      <span className="text-xs text-gray-400 tabular-nums">
        {totalRows === 0 ? '0' : `${from}–${to}`} of{' '}
        <span className="font-semibold text-gray-600">{totalRows}</span>
      </span>

      {/* Right — page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-0.5">
          {/* First */}
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className={navBtn(currentPage === 0)}
            title="First page"
          >
            «
          </button>

          {/* Prev */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={navBtn(currentPage === 0)}
            title="Previous page"
          >
            ‹
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page, idx) =>
            page === 'ellipsis' ? (
              <span
                key={`e-${idx}`}
                className="w-8 text-center text-xs text-gray-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={pageBtn(page === currentPage)}
              >
                {page + 1}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className={navBtn(currentPage >= totalPages - 1)}
            title="Next page"
          >
            ›
          </button>

          {/* Last */}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className={navBtn(currentPage >= totalPages - 1)}
            title="Last page"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;