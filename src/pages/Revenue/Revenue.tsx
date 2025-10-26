import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { deleteRevenue, fetchRevenues } from "../../apis/revenueApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import RevenueDrawer from "./RevenueDrawer";

type RevenueRow = {
  id: string;
  revenue_code: string;
  revenue_description: string;
  revenue_value: number;
  linkedProjects: number;
};

export const Revenue = () => {
  const [revenues, setRevenues] = useState<RevenueRow[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueRow | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchAndSetRevenues = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenues();
      setRevenues(
        data.map((item: any) => ({
          id: item.id,
          revenue_code: item.revenue_code,
          revenue_description: item.revenue_description,
          revenue_value: item.revenue_value,
          linkedProjects: item.linkedProjects || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch revenues", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRevenues();
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

  const handleDelete = async (revenue: RevenueRow) => {
    if (window.confirm("Are you sure you want to delete this revenue?")) {
      setLoading(true);
      try {
        await deleteRevenue(revenue.id);
        await fetchAndSetRevenues();
        toast.success("Revenue deleted successfully!");
      } catch (err) {
        console.error("Failed to delete revenue", err);
        toast.error("Failed to delete revenue!");
      }
      setLoading(false);
    }
  };

  // Apply search filter
  const filteredRevenues = revenues.filter((rev) =>
    rev.revenue_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRevenues,
  } = usePagination(filteredRevenues, rowsPerPage);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex justify-between items-center">
        <PageBreadcrumb pageTitle="Revenue" />
        <div className="flex justify-end items-center gap-3 px-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Code"
            className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => navigate("/revenues/create")}
            className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <span>
              <FaPlus />
            </span>
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
                    toast.info("Export clicked");
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    window.location.reload();
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
                    className=" w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition flex justify-between items-center"
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
                          toast.info("Sort by Value clicked");
                        }}
                      >
                        Sort by Value
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          toast.info("Sort by Linked Projects clicked");
                        }}
                      >
                        Sort by Linked Projects
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
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
                  <th className="px-4 py-3 text-[12px]">Serial No.</th>
                  <th className="px-4 py-3 text-[12px]">Revenue Code</th>
                  <th className="px-4 py-3 text-[12px]">Description</th>
                  <th className="px-4 py-3 text-[12px]">Value</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedRevenues &&
                  paginatedRevenues.map((revenue, i) => (
                    <tr
                      key={revenue.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedRevenue(revenue)}
                      onMouseEnter={() => setHoveredRow(revenue.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3 text-[12px]">{i + 1}</td>
                      <td className="px-4 py-3 text-[12px]">
                        {revenue.revenue_code}
                      </td>
                      <td className="px-4 py-3 text-[12px]">
                        {revenue.revenue_description}
                      </td>
                      <td className="px-4 py-3 text-[12px]">
                        ₹{revenue.revenue_value}
                      </td>

                      <td className="flex justify-center gap-2 relative">
                        {hoveredRow === revenue.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === revenue.id ? null : revenue.id
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
                        {dropdownOpen === revenue.id && (
                          <div
                            className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/revenues/edit/${revenue.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(revenue);
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

      <RevenueDrawer
        isOpen={!!selectedRevenue}
        onClose={() => setSelectedRevenue(null)}
        revenue={selectedRevenue}
      />
    </>
  );
};
