import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import OemDrawer from "./OemDrawer";
import { getAllOEMs, deleteOEM } from "../../apis/oemApi";
import { OEM } from "../../types/oemTypes";

export const OemPage = () => {
  const [oems, setOems] = useState<OEM[]>([]);
  const [filteredOems, setFilteredOems] = useState<OEM[]>([]);
  const [selectedOem, setSelectedOem] = useState<OEM | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedOems,
  } = usePagination(filteredOems, rowsPerPage);

  const fetchAndSetOems = async () => {
    setLoading(true);
    try {
      const data = await getAllOEMs();
      setOems(data);
      setFilteredOems(data); // apply to filtered as well
    } catch (err) {
      toast.error("Failed to fetch OEMs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetOems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOems(oems);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = oems.filter(
        (item) =>
          item.oem_name.toLowerCase().includes(lower) ||
          item.oem_code.toLowerCase().includes(lower)
      );
      setFilteredOems(filtered);
    }
  }, [searchTerm, oems]);

  const handleDelete = async (oem: OEM) => {
    if (window.confirm("Are you sure you want to delete this OEM?")) {
      setLoading(true);
      try {
        await deleteOEM(oem.id);
        await fetchAndSetOems();
        toast.success("OEM deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete OEM!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSortByName = () => {
    const sorted = [...filteredOems].sort((a, b) =>
      a.oem_name.localeCompare(b.oem_name)
    );
    setFilteredOems(sorted);
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    const sorted = [...filteredOems].sort((a, b) =>
      a.oem_code.localeCompare(b.oem_code)
    );
    setFilteredOems(sorted);
    toast.info("Sorted by Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-6 mb-4 gap-4">
        <PageBreadcrumb pageTitle="OEMs" />
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or code"
            className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => navigate("/oem/create")}
            className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    toast.info("Export clicked");
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetOems();
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
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white flex justify-between items-center transition"
                    onClick={() => setSortMenuOpen((prev) => !prev)}
                  >
                    Sort
                    <span className="ml-2">&gt;</span>
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-full top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByName();
                        }}
                      >
                        Sort by Name
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition"
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

      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="overflow-x-auto flex-1 w-full px-6 pb-6">
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
                  <th className="px-4 py-3 text-left text-[12px]">Serial No.</th>
                  <th className="px-4 py-3 text-left text-[12px]">OEM Name</th>
                  <th className="px-4 py-3 text-left text-[12px]">OEM Code</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedOems.map((oem, i) => (
                  <tr
                    key={oem.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedOem(oem)}
                    onMouseEnter={() => setHoveredRow(oem.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-left text-[12px]">
                      {i + 1 + (currentPage - 1) * rowsPerPage}
                    </td>
                    <td className="px-4 py-3 text-left text-[12px]">
                      {oem.oem_name}
                    </td>
                    <td className="px-4 py-3 text-left text-[12px]">
                      {oem.oem_code}
                    </td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === oem.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === oem.id ? null : oem.id
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
                      {dropdownOpen === oem.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/oem/edit/${oem.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(oem);
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

      <OemDrawer
        isOpen={!!selectedOem}
        onClose={() => setSelectedOem(null)}
        oem={selectedOem}
      />
    </>
  );
};
