import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStores, deleteStore } from "../../apis/storeApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import StoreDrawer from "./StoreDrawer";
import Title from "../../components/common/Title";

type StoreRow = {
  id: string;
  store_code: string;
  store_name?: string;
  store_location: string;
};

export const StoreLocation = () => {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchAndSetStores = async () => {
    setLoading(true);
    try {
      const data = await fetchStores();
      setStores(
        data.map((item: any) => ({
          id: item.id,
          store_code: item.store_code,
          store_name: item.store_name,
          store_location: item.store_location,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetStores();
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      store.store_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.store_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedStores,
  } = usePagination(filteredStores, rowsPerPage);

  const exportToCSV = (data: StoreRow[], filename: string = "stores.csv") => {
    const headers = ["Store Code", "Name", "Location"];
    const rows = data.map((store) => [
      store.store_code,
      store.store_name || "-",
      store.store_location,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleDelete = async (store: StoreRow) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setLoading(true);
      try {
        await deleteStore(store.id);
        await fetchAndSetStores();
        toast.success("Store deleted successfully!");
      } catch (err) {
        console.error("Failed to delete store", err);
        toast.error("Failed to delete store!");
      }
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setStores((prev) =>
      [...prev].sort((a, b) =>
        (a.store_name || "").localeCompare(b.store_name || "")
      )
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setStores((prev) =>
      [...prev].sort((a, b) => a.store_code.localeCompare(b.store_code))
    );
    toast.info("Sorted by Store Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Store Location" />

          <div>
            <div className="flex flex-wrap justify-end items-center mb-4 gap-3">
              <input
                type="text"
                placeholder="Search by code or name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm w-60"
              />
              <button
                onClick={() => navigate("/store-locations/create")}
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
                      className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        exportToCSV(stores);
                      }}
                    >
                      Export
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        fetchAndSetStores();
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
                              handleSortByName();
                            }}
                          >
                            Sort by Name
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setMoreDropdownOpen(false);
                              setSortMenuOpen(false);
                              handleSortByCode();
                            }}
                          >
                            Sort by Store Code
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1 w-full overflow-auto  pb-6">
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
                  <th className="px-4 py-3 text-[12px] text-left">Store Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Name</th>
                  <th className="px-4 py-3 text-[12px] text-left">Location</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedStores &&
                  paginatedStores.map((store, i) => (
                    <tr
                      key={store.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedStore(store)}
                      onMouseEnter={() => setHoveredRow(store.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3 text-[12px] text-left">{i +1}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{store.store_code}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{store.store_name || "-"}</td>
                      <td className="px-4 py-3 text-[12px] text-left">{store.store_location}</td>
                      <td className="flex justify-center gap-2 relative">
                        {hoveredRow === store.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === store.id ? null : store.id
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
                        {dropdownOpen === store.id && (
                          <div
                            className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/store-locations/edit/${store.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(store);
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

      <StoreDrawer
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        store={selectedStore}
      />
    </>
  );
};
