import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import ConsumableDrawer from "./ConsumableDrawer";
import { Item } from "../../types/consumableItemTypes";
import { deleteItem, fetchItems } from "../../apis/consumableApi";
import * as XLSX from "xlsx";
import Title from "../../components/common/Title";

type SortConfig = {
  key: keyof Item | null;
  direction: 'asc' | 'desc';
};

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
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

  // Apply sorting
  const applySorting = (data: Item[], config: SortConfig) => {
    if (!config.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[config.key!];
      let bValue = b[config.key!];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Handle numeric values (item_qty_in_hand)
      if (config.key === 'item_qty_in_hand') {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return config.direction === 'asc' ? aNum - bNum : bNum - aNum;
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

  const handleSort = (key: keyof Item) => {
    setSortConfig(currentConfig => ({
      key,
      direction: currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof Item) => {
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

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const results = items.filter(
      (item) =>
        item.item_code.toLowerCase().includes(lower) ||
        item.item_name.toLowerCase().includes(lower)
    );
    const sortedResults = applySorting(results, sortConfig);
    setFilteredItems(sortedResults);
  }, [searchTerm, items, sortConfig]);

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
      const sortedData = applySorting(data, sortConfig);
      setFilteredItems(sortedData);
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
    handleSort('item_name');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByCode = () => {
    handleSort('item_code');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByProductType = () => {
    handleSort('product_type');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByQuantity = () => {
    handleSort('item_qty_in_hand');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
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
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              onClick={() => navigate("/consumable/create")}
              className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaPlus />
              <span>New</span>
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
                          onClick={handleSortByName}
                        >
                          Sort by Name
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByCode}
                        >
                          Sort by Code
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByProductType}
                        >
                          Sort by Product Type
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                          onClick={handleSortByQuantity}
                        >
                          Sort by Quantity
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
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('item_code')}
                  >
                    <div className="flex items-center">
                      Code
                      {getSortIcon('item_code')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('item_name')}
                  >
                    <div className="flex items-center">
                      Item Name
                      {getSortIcon('item_name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('product_type')}
                  >
                    <div className="flex items-center">
                      Product Type
                      {getSortIcon('product_type')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('item_qty_in_hand')}
                  >
                    <div className="flex items-center">
                      Quantity
                      {getSortIcon('item_qty_in_hand')}
                    </div>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
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
             totalItems={Consumable.length}
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