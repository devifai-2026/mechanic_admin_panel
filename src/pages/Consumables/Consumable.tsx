import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import ConsumableDrawer from "./ConsumableDrawer";
import { Item } from "../../types/consumableItemTypes";
import { deleteItem, fetchItems } from "../../apis/consumableApi";
import * as XLSX from "xlsx";
import Title from "../../components/common/Title";

export const Consumable = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const exportToExcel = () => {
    const dataToExport = filteredItems.map((item) => ({
      "Item Code": item.item_code,
      "Item Name": item.item_name,
      "Product Type": item.product_type,
      "Qty In Hand": item.item_qty_in_hand,
      UOM: item.uom?.unit_name || "N/A",
      "Group Name": item.itemGroup?.group_name || "N/A",
      OEM: item.oem?.oem_name || "N/A",
      "Revenue Value": item.revenueAccount?.revenue_value || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consumables");

    XLSX.writeFile(workbook, "ConsumableItems.xlsx");
  };

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const results = items.filter(
      (item) =>
        item.item_code.toLowerCase().includes(lower) ||
        item.item_name.toLowerCase().includes(lower)
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedItems,
  } = usePagination(filteredItems, rowsPerPage);

  const fetchAndSetItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      toast.error("Failed to fetch items");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetItems();
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

  const handleDelete = async (item: Item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLoading(true);
      try {
        await deleteItem(item.id);
        await fetchAndSetItems();
        toast.success("Item deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete item!");
      }
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setItems((prev) =>
      [...prev].sort((a, b) => a.item_name.localeCompare(b.item_name))
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setItems((prev) =>
      [...prev].sort((a, b) => a.item_code.localeCompare(b.item_code))
    );
    toast.info("Sorted by Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Consumable Items" />
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by code or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => navigate("/consumable/create")}
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
                      exportToExcel();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetItems();
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
                  <th className="px-4 py-3 text-[12px] text-left">
                    Serial No.
                  </th>
                  <th className="px-4 py-3 text-[12px] text-left">Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Item Name</th>
                  <th className="px-4 py-3 text-[12px] text-left">
                    Product Type
                  </th>
                  <th className="px-4 py-3 text-[12px] text-left">Quantity</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedItems.map((item, i) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i + 1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {item.item_code}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {item.product_type}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {item.item_qty_in_hand}
                    </td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === item.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === item.id ? null : item.id
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
                      {dropdownOpen === item.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/consumable/edit/${item.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(item);
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

      <ConsumableDrawer
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
};
