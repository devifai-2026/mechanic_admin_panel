import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";
import * as XLSX from "xlsx";
import { getAllMaterialTransactions } from "../../../apis/materialTransactions";

export const MaterialTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMaterialIn, setShowMaterialIn] = useState(true);
  const [showMaterialOut, setShowMaterialOut] = useState(true);
  const navigate = useNavigate();

  const filteredTransactions = transactions.filter(
    (txn) =>
      ((txn.data_type === "material_in" && showMaterialIn) ||
        (txn.data_type === "material_out" && showMaterialOut)) &&
      (txn.project?.project_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.challan_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.date?.toLowerCase().includes(searchTerm.toLowerCase())
      ));

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedTransactions,
  } = usePagination(filteredTransactions, rowsPerPage);

  const fetchAndSetTransactions = async () => {
    setLoading(true);
    try {
      const response = await getAllMaterialTransactions();
      setTransactions(response);
    } catch (err) {
      toast.error("Failed to fetch Material Transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetTransactions();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setMoreDropdownOpen(false);
    if (moreDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [moreDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const exportTransactionsToExcel = (transactions: any[]) => {
    if (!transactions || transactions.length === 0) {
      toast.error("No transactions to export.");
      return;
    }

    const exportData: any[] = [];

    transactions.forEach((txn) => {
      txn.formItems.forEach((item: any) => {
        exportData.push({
          "Transaction ID": txn.id,
          Date: txn.date,
          "Project No": txn.project?.project_no || "N/A",
          "Transaction Type": txn.data_type,
          "Item Name": item.consumableItem?.item_name || "N/A",
          "Item Code": item.consumableItem?.item_code || "N/A",
          Quantity: item.qty,
          Unit: item.unitOfMeasure?.unit_name || "N/A",
          "Challan No": txn.challan_no || "N/A",
          Notes: item.notes || "",
          "PM Approval": txn.is_approve_pm || "Pending",
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Material Transactions");

    XLSX.writeFile(workbook, "material_transactions.xlsx");
  };

  const handleSortByDate = () => {
    setTransactions((prev) =>
      [...prev].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    toast.info("Sorted by Date");
  };

  const handleSortByProject = () => {
    setTransactions((prev) =>
      [...prev].sort((a, b) =>
        (a.project?.project_no || "").localeCompare(b.project?.project_no || "")
      )
    );
    toast.info("Sorted by Project");
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 mb-2">
        <PageBreadcrumb pageTitle="Material Transactions" />
        <div className="flex justify-end items-center gap-3 px-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Project, Challan No or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded-md dark:bg-gray-900 dark:border-gray-700 text-sm"
            />
          </div>
          <span
            className="p-2 bg-gray-200 border-2 border-gray-50 rounded-lg cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setMoreDropdownOpen((prev) => !prev);
            }}
          >
            <IoIosMore />
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    exportTransactionsToExcel(transactions);
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetTransactions();
                  }}
                >
                  Refresh
                </button>
                <div
                  className="relative"
                  onMouseEnter={() => setSortMenuOpen(true)}
                  onMouseLeave={() => setSortMenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition flex justify-between items-center"
                    onClick={() => setSortMenuOpen((prev) => !prev)}
                  >
                    Sort
                    <span className="ml-2">&gt;</span>
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-full top-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 py-1">
                      <div className="px-4 py-2 text-sm">
                        <label className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={showMaterialIn}
                            onChange={() => setShowMaterialIn((prev) => !prev)}
                          />
                          <span>View Material In</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={showMaterialOut}
                            onChange={() => setShowMaterialOut((prev) => !prev)}
                          />
                          <span>View Material Out</span>
                        </label>
                      </div>
                      <hr className="border-gray-300 dark:border-gray-600 my-1" />
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByDate();
                        }}
                      >
                        Sort by Date
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByProject();
                        }}
                      >
                        Sort by Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="overflow-x-auto flex-1 w-full overflow-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-blue-600 font-semibold text-lg">
                Loading...
              </span>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-[12px]">S.No</th>
                  <th className="px-4 py-3 text-[12px]">Date</th>
                  <th className="px-4 py-3 text-[12px]">Project</th>
                  <th className="px-4 py-3 text-[12px]">Type</th>
                  <th className="px-4 py-3 text-[12px]">Challan No</th>
                  <th className="px-4 py-3 text-[12px]">Items Count</th>
                  <th className="px-4 py-3 text-[12px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedTransactions.map((txn, index) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() =>
                      navigate(`/material-transactions/${txn.id}`, {
                        state: { transaction: txn },
                      })
                    }
                  >
                    <td className="px-4 py-3 text-[12px]">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {txn.date.split("-").reverse().join("-")}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {txn.project?.project_no || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {txn.data_type === "material_in"
                        ? "Material In"
                        : "Material Out"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {txn.challan_no || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {txn.formItems?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${txn.is_approve_pm === "approved"
                          ? "bg-green-100 text-green-800"
                          : txn.is_approve_pm === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {txn.is_approve_pm === "approved"
                          ? "Approved"
                          : txn.is_approve_pm === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center px-4 py-3">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 pb-6 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};