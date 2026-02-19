type DashboardPaginationProps = {
  hasPagination: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (value: number) => void;
};

export function DashboardPagination({
  hasPagination,
  currentPage,
  totalPages,
  setCurrentPage,
}: DashboardPaginationProps) {
  if (!hasPagination) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-violet-600 text-white"
              : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
