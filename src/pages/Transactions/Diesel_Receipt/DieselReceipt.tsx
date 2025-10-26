import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";
import * as XLSX from "xlsx";
import { getAllDieselReceipt } from "../../../apis/dieselReceipt.ts";

export const DieselReceipt = () => {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.createdByEmployee?.emp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.organisation?.org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(req.date).toLocaleDateString().includes(searchTerm)
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRequisitions,
  } = usePagination(filteredRequisitions, rowsPerPage);

  const fetchAndSetRequisitions = async () => {
    setLoading(true);
    try {
      const data = await getAllDieselReceipt();
      setRequisitions(data);
    } catch (err) {
      toast.error("Failed to fetch Diesel Requisitions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRequisitions();
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

  const exportRequisitionsToExcel = (requisitions: any[]) => {
    if (!requisitions || requisitions.length === 0) {
      toast.error("No requisitions to export.");
      return;
    }

    const exportData: any[] = requisitions.map((req) => ({
      "Requisition ID": req.id,
      Date: new Date(req.date).toLocaleDateString(),
      "Created By": req.createdByEmployee?.emp_name || "N/A",
      Organisation: req.organisation?.org_name || "N/A",
      "Items Count": req.items?.length || 0,
      "MIC Status": req.is_approve_mic || "Pending",
      "SIC Status": req.is_approve_sic || "Pending",
      "PM Status": req.is_approve_pm || "Pending"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Diesel Requisitions");
    XLSX.writeFile(workbook, "diesel_requisitions.xlsx");
  };

  const handleSortByDate = () => {
    setRequisitions((prev) =>
      [...prev].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    toast.info("Sorted by Date");
  };

  const handleSortByEmployee = () => {
    setRequisitions((prev) =>
      [...prev].sort((a, b) =>
        (a.createdByEmployee?.emp_name || "").localeCompare(
          b.createdByEmployee?.emp_name || ""
        )
      )
    );
    toast.info("Sorted by Employee");
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 mb-2">
        <PageBreadcrumb pageTitle="Diesel Receipt" />
        <div className="flex justify-end items-center gap-3 px-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by employee, organisation or date..."
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
                    exportRequisitionsToExcel(requisitions);
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetRequisitions();
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
                    <div className="absolute right-full top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 py-1">
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
                          handleSortByEmployee();
                        }}
                      >
                        Sort by Employee
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
                  <th className="px-4 py-3 text-[12px]">Created By</th>
                  <th className="px-4 py-3 text-[12px]">Organisation</th>
                  <th className="px-4 py-3 text-[12px]">Items Count</th>
                  <th className="px-4 py-3 text-[12px]">MIC Status</th>
                  <th className="px-4 py-3 text-[12px]">SIC Status</th>
                  <th className="px-4 py-3 text-[12px]">PM Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedRequisitions.map((req, index) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() =>
                      navigate(`/diesel-receipt/${req.id}`, {
                        state: { requisition: req },
                      })
                    }
                  >
                    <td className="px-4 py-3 text-[12px]">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {new Date(req.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.createdByEmployee?.emp_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.organisation?.org_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.items?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          req.is_approve_mic === "approved"
                            ? "bg-green-100 text-green-800"
                            : req.is_approve_mic === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.is_approve_mic || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          req.is_approve_sic === "approved"
                            ? "bg-green-100 text-green-800"
                            : req.is_approve_sic === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.is_approve_sic || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          req.is_approve_pm === "approved"
                            ? "bg-green-100 text-green-800"
                            : req.is_approve_pm === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.is_approve_pm || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedRequisitions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-3">
                      No requisitions found
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