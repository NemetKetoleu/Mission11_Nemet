interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  sortOrder: string;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onSortChange: (order: string) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: PaginationProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 gap-3">
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <label>
          Results per page:{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1); // Reset to first page
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>

        <label>
          Sort By Title:{' '}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Pagination;
