import React from "react";

// Define the props interface directly in the component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}

const rowsPerPageOptions = [10, 20, 50, 100, 200];

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalItems,
}) => {
  // Calculate the range of items being shown
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalItems);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="flex flex-wrap justify-end items-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="px-2 py-1 rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {rowsPerPageOptions.map((opt) => (
            <option
              key={opt}
              value={opt}
              className={
                rowsPerPage === opt ? "text-blue-500 font-semibold" : ""
              }
            >
              {opt} per page
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 
          ${currentPage === 1 ? "text-gray-400" : "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"} 
          disabled:opacity-50 transition`}
      >
        &larr;
      </button>
      <span className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
        <span className="text-blue-500">
          {start}
          {end > start && ` - ${end}`}
        </span>
        <span>of {totalItems}</span>
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 
          ${currentPage === totalPages ? "text-gray-400" : "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"} 
          disabled:opacity-50 transition`}
      >
        &rarr;
      </button>
    </div>
  );
};

export default Pagination;