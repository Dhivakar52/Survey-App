import React from 'react';

const Pagination = ({ table, totalCount }) => {
  if (!table) return null;

  const { pageIndex, pageSize } = table.getState().pagination;
  const currentPage = pageIndex + 1;
  const totalPages = Math.ceil(totalCount / pageSize) || 0;

  if (totalPages === 0 || totalCount === 0) return null;

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalCount);

  // Ellipsis Pagination Logic
  const getPages = () => {
    const pages = [];
    const maxVisible = 2;

    // First pages (1,2,3)
    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
      pages.push(i);
    }

    // Show dots after first block
    if (currentPage > 4 && totalPages > 6) {
      pages.push('...');
    }

    // Middle current page
    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(currentPage);
    }

    // Show dots before last
    if (currentPage < totalPages - 3 && totalPages > 6) {
      pages.push('...');
    }

    // Last page
    if (totalPages > maxVisible) {
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 py-3 my-2 border-top border-light">
      {/* LEFT */}
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted small">
          Showing <b>{start}</b> to <b>{end}</b> of <b>{totalCount}</b>
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
            table.setPageIndex(0);
          }}
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn btn-outline-secondary btn-sm"
        >
          ‹
        </button>

        {/* Pages */}
        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <span key={index} className="px-2 text-muted small">
                …
              </span>
            );
          }

          return (
            <button
              key={p}
              onClick={() => table.setPageIndex(Number(p) - 1)}
              className={`btn btn-sm ${
                p === currentPage
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              style={p === currentPage ? { background: '#00084D', borderColor: '#00084D' } : {}}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn btn-outline-secondary btn-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;