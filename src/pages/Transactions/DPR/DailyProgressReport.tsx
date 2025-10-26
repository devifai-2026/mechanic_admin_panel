import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";
import * as XLSX from "xlsx";
import { getAllDPR } from "../../../apis/dailyProgressReport";

export const DailyProgressReport = () => {
  const [dprLogs, setDprLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredDprLogs = dprLogs.filter(
    (log) =>
      log.dpr_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project?.project_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.mechanic?.emp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.shift?.shift_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedDprLogs,
  } = usePagination(filteredDprLogs, rowsPerPage);

  const fetchAndSetDprLogs = async () => {
    setLoading(true);
    try {
      const data = await getAllDPR();
      setDprLogs(data);
    } catch (err) {
      toast.error("Failed to fetch DPR Logs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetDprLogs();
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

  const exportDprLogsToExcel = (logs: any[]) => {
    if (!logs || logs.length === 0) {
      toast.error("No DPR logs to export.");
      return;
    }

    const exportData: any[] = [];

    logs.forEach((log) => {
      exportData.push({
        "DPR ID": log.id,
        Date: log.date,
        "DPR No": log.dpr_no,
        "Project No": log.project?.project_no || "N/A",
        "Customer Representative": log.customer_representative || "N/A",
        "Shift Code": log.shift?.shift_code || "N/A",
        "Shift Incharge": log.incharge?.emp_name || "N/A",
        "Shift Mechanic": log.mechanic?.emp_name || "N/A",
        "PM Approval": log.is_approve_pm || "pending",
        "Total Jobs": log.forms?.length || 0,
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DPR Logs");

    XLSX.writeFile(workbook, "dpr_logs.xlsx");
  };

  const handleSortByDate = () => {
    setDprLogs((prev) =>
      [...prev].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    toast.info("Sorted by Date");
  };

  const handleSortByProject = () => {
    setDprLogs((prev) =>
      [...prev].sort((a, b) =>
        (a.project?.project_no || "").localeCompare(b.project?.project_no || "")
      )
    );
    toast.info("Sorted by Project");
  };

  const handleSortByDprNo = () => {
    setDprLogs((prev) =>
      [...prev].sort((a, b) =>
        (a.dpr_no || "").localeCompare(b.dpr_no || "")
      )
    );
    toast.info("Sorted by DPR No");
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 mb-2">
        <PageBreadcrumb pageTitle="Daily Progress Reports" />
        <div className="flex justify-end items-center gap-3 px-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by DPR No, Project or Mechanic..."
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
                    exportDprLogsToExcel(dprLogs);
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetDprLogs();
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
                          handleSortByProject();
                        }}
                      >
                        Sort by Project
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByDprNo();
                        }}
                      >
                        Sort by DPR No
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
                  <th className="px-4 py-3 text-[12px]">DPR No</th>
                  <th className="px-4 py-3 text-[12px]">Project</th>
                  <th className="px-4 py-3 text-[12px]">Shift</th>
                  <th className="px-4 py-3 text-[12px]">Mechanic</th>
                  <th className="px-4 py-3 text-[12px]">Jobs</th>
                  <th className="px-4 py-3 text-[12px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedDprLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() =>
                      navigate(`/dpr/${log.id}`, {
                        state: { dprLog: log },
                      })
                    }
                  >
                    <td className="px-4 py-3 text-[12px]">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[12px]">{log.date}</td>
                    <td className="px-4 py-3 text-[12px]">{log.dpr_no}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {log.project?.project_no || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {log.shift?.shift_code || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {log.mechanic?.emp_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {log.forms?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          log.is_approve_pm === "approved"
                            ? "bg-green-100 text-green-800"
                            : log.is_approve_pm === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {log.is_approve_pm === "approved"
                          ? "Approved"
                          : log.is_approve_pm === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedDprLogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center px-4 py-3">
                      No DPR logs found
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