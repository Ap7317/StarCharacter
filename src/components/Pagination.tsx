interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) {
  const pages: number[] = [];
  
  // Generate page numbers to display
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded transition-colors ${
            page === currentPage
              ? 'bg-star-wars-yellow text-black font-bold'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
