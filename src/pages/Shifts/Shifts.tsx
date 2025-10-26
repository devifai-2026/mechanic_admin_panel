import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { fetchShifts, deleteShift } from "../../apis/shiftApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import ShiftDrawer from "./ShiftDrawer";
import Title from "../../components/common/Title";

type ShiftRow = {
  id: string;
  shift_code: string;
  shift_from_time: string;
  shift_to_time: string;
};

export const Shifts = () => {
  const [shifts, setShifts] = useState<ShiftRow[]>([]);
  const [selectedShift, setSelectedShift] = useState<ShiftRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAndSetShifts = async () => {
    setLoading(true);
    try {
      const data = await fetchShifts();
      setShifts(
        data.map((item: any) => ({
          id: item.id,
          shift_code: item.shift_code,
          shift_from_time: item.shift_from_time,
          shift_to_time: item.shift_to_time,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetShifts();
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

  const filteredShifts = shifts.filter((shift) =>
    shift.shift_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedShifts,
  } = usePagination(filteredShifts, rowsPerPage);

  const exportShiftsToExcel = (shifts: ShiftRow[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
      shifts.map((shift) => ({
        "Shift Code": shift.shift_code,
        "From Time": shift.shift_from_time,
        "To Time": shift.shift_to_time,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(
      data,
      `shifts_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleDelete = async (shift: ShiftRow) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      setLoading(true);
      try {
        await deleteShift(shift.id);
        await fetchAndSetShifts();
        toast.success("Shift deleted successfully!");
      } catch (err) {
        console.error("Failed to delete shift", err);
        toast.error("Failed to delete shift!");
      }
      setLoading(false);
    }
  };

  const handleSortByCode = () => {
    setShifts((prev) =>
      [...prev].sort((a, b) => a.shift_code.localeCompare(b.shift_code))
    );
    toast.info("Sorted by Shift Code");
  };

  const handleSortByFromTime = () => {
    setShifts((prev) =>
      [...prev].sort((a, b) =>
        a.shift_from_time.localeCompare(b.shift_from_time)
      )
    );
    toast.info("Sorted by From Time");
  };

  return (
    <>
      {/* <PageBreadcrumb pageTitle="Shifts" /> */}
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Shifts" />
          <div className="flex flex-wrap justify-end items-center mb-4 gap-3">
            <input
              type="text"
              placeholder="Search Shift Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={() => navigate("/shifts/create")}
              className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <span>
                <FaPlus />
              </span>
              <span className="">New</span>
            </button>
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
                      exportShiftsToExcel(shifts);
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetShifts();
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
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            setSortMenuOpen(false);
                            handleSortByCode();
                          }}
                        >
                          Sort by Shift Code
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            setSortMenuOpen(false);
                            handleSortByFromTime();
                          }}
                        >
                          Sort by From Time
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto flex-1 w-full overflow-auto pb-6">
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
                  <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                  <th className="px-4 py-3 text-[12px] text-left">Shift Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">From Time</th>
                  <th className="px-4 py-3 text-[12px] text-left">To Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedShifts &&
                  paginatedShifts.map((shift, i) => (
                    <tr
                      key={shift.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedShift(shift)}
                      onMouseEnter={() => setHoveredRow(shift.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3 text-[12px] text-left">{i+1}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{shift.shift_code}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{shift.shift_from_time}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{shift.shift_to_time}</td>
                      <td className="flex justify-center gap-2 relative">
                        {hoveredRow === shift.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === shift.id ? null : shift.id
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition"
                            title="Actions"
                          >
                            <FaCircleChevronDown
                              className="text-blue-500"
                              size={20}
                            />
                          </button>
                        )}
                        {dropdownOpen === shift.id && (
                          <div
                            className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/shifts/edit/${shift.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(shift);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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
      <ShiftDrawer
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        shift={selectedShift}
      />
    </>
  );
};
