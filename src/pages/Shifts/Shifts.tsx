import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShifts, deleteShift } from "../../apis/shiftApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import ShiftDrawer from "./ShiftDrawer";
import Title from "../../components/common/Title";

type ShiftRow = {
  id: string;
  shift_code: string;
  shift_from_time: string;
  shift_to_time: string;
};

type SortConfig = {
  key: keyof ShiftRow | null;
  direction: 'asc' | 'desc';
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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
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

  // Apply sorting
  const applySorting = (data: ShiftRow[], config: SortConfig) => {
    if (!config.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[config.key!];
      let bValue = b[config.key!];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Handle time values (shift_from_time, shift_to_time)
      if (config.key === 'shift_from_time' || config.key === 'shift_to_time') {
        // Convert time strings to comparable format (HH:MM:SS to seconds)
        const timeToSeconds = (timeStr: string) => {
          const [hours, minutes, seconds] = timeStr.split(':').map(Number);
          return hours * 3600 + minutes * 60 + (seconds || 0);
        };
        
        const aSeconds = timeToSeconds(aValue);
        const bSeconds = timeToSeconds(bValue);
        return config.direction === 'asc' ? aSeconds - bSeconds : bSeconds - aSeconds;
      }

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return config.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const handleSort = (key: keyof ShiftRow) => {
    setSortConfig(currentConfig => ({
      key,
      direction: currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof ShiftRow) => {
    if (sortConfig.key !== key) {
      return (
        <div className="inline-flex flex-col ml-1 opacity-30">
          <FaSortUp size={10} className="-mb-1" />
          <FaSortDown size={10} className="-mt-1" />
        </div>
      );
    }
    
    return sortConfig.direction === 'asc' 
      ? <FaSortUp size={12} className="ml-1 text-blue-500" />
      : <FaSortDown size={12} className="ml-1 text-blue-500" />;
  };

  const filteredShifts = shifts.filter((shift) =>
    shift.shift_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedShifts = applySorting(filteredShifts, sortConfig);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedShifts,
  } = usePagination(sortedShifts, rowsPerPage);

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
    handleSort('shift_code');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByFromTime = () => {
    handleSort('shift_from_time');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByToTime = () => {
    handleSort('shift_to_time');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  return (
    <>
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
              className="p-2 bg-gray-200 border-2 border-gray-50 rounded-lg cursor-pointer relative dark:bg-gray-700 dark:border-gray-600"
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
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByCode}
                        >
                          Sort by Shift Code
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByFromTime}
                        >
                          Sort by From Time
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByToTime}
                        >
                          Sort by To Time
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
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('shift_code')}
                  >
                    <div className="flex items-center">
                      Shift Code
                      {getSortIcon('shift_code')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('shift_from_time')}
                  >
                    <div className="flex items-center">
                      From Time
                      {getSortIcon('shift_from_time')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('shift_to_time')}
                  >
                    <div className="flex items-center">
                      To Time
                      {getSortIcon('shift_to_time')}
                    </div>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedShifts &&
                  paginatedShifts.map((shift) => (
                    <tr
                      key={shift.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedShift(shift)}
                      onMouseEnter={() => setHoveredRow(shift.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
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
             totalItems={shifts.length}
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