export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  // ...other props...
  rowsPerPage: number;
  setRowsPerPage: (n: number) => void;
}