import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import UomDrawer from "./UomDrawer";
import { getAllUOMs, deleteUOM } from "../../apis/uomApi";
import { UOM } from "../../types/uomTypes";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Title from "../../components/common/Title";

export const Uom = () => {
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [filteredUoms, setFilteredUoms] = useState<UOM[]>([]);
  const [selectedUom, setSelectedUom] = useState<UOM | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const navigate = useNavigate();

  const exportToExcel = () => {
    if (filteredUoms.length === 0) {
      toast.info("No data to export");
      return;
    }

    const dataToExport = filteredUoms.map(({ unit_name, unit_code }) => ({
      "Unit Name": unit_name,
      "Unit Code": unit_code,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UOMs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "UOMs_export.xlsx");
  };

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUoms,
  } = usePagination(filteredUoms, rowsPerPage);

  const fetchAndSetUoms = async () => {
    setLoading(true);
    try {
      const data = await getAllUOMs();
      setUoms(data);
    } catch (err) {
      toast.error("Failed to fetch UOMs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetUoms();
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

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = uoms.filter(
      (uom) =>
        uom.unit_name.toLowerCase().includes(term) ||
        uom.unit_code.toLowerCase().includes(term)
    );
    setFilteredUoms(filtered);
    setCurrentPage(1); // reset pagination when search term changes
  }, [searchTerm, uoms]);

  const handleDelete = async (uom: UOM) => {
    if (window.confirm("Are you sure you want to delete this UOM?")) {
      setLoading(true);
      try {
        await deleteUOM(uom.id);
        await fetchAndSetUoms();
        toast.success("UOM deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete UOM!");
      }
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setFilteredUoms((prev) =>
      [...prev].sort((a, b) => a.unit_name.localeCompare(b.unit_name))
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setFilteredUoms((prev) =>
      [...prev].sort((a, b) => a.unit_code.localeCompare(b.unit_code))
    );
    toast.info("Sorted by Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center ">
          <Title pageTitle="UOMs" />
          <div className="flex flex-wrap justify-end items-center gap-3 mb-2">
            <input
              type="text"
              placeholder="Search Name or Code"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => navigate("/uom/create")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaPlus />
              <span>New</span>
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
                      exportToExcel();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetUoms();
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
                            handleSortByName();
                          }}
                        >
                          Sort by Name
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={() => {
                            setMoreDropdownOpen(false);
                            setSortMenuOpen(false);
                            handleSortByCode();
                          }}
                        >
                          Sort by Code
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
            <table className="w-full min-w-[700px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                  <th className="px-4 py-3 text-[12px] text-left">Unit Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Unit Name</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedUoms.map((uom, i) => (
                  <tr
                    key={uom.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedUom(uom)}
                    onMouseEnter={() => setHoveredRow(uom.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i+1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{uom.unit_code}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{uom.unit_name}</td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === uom.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === uom.id ? null : uom.id
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition"
                          title="Actions"
                        >
                          <FaCircleChevronDown className="text-blue-500" size={20} />
                        </button>
                      )}
                      {dropdownOpen === uom.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/uom/edit/${uom.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(uom);
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
      <UomDrawer
        isOpen={!!selectedUom}
        onClose={() => setSelectedUom(null)}
        uom={selectedUom}
      />
    </>
  );
};
