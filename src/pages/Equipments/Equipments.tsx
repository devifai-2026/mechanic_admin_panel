import { useEffect, useState } from "react";
import { fetchEquipments, deleteEquipment } from "../../apis/equipmentApi";
import Pagination from "../../utils/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import EquipmentDrawer from "./EquipmentDrawer";
import { useNavigate } from "react-router";
import Title from "../../components/common/Title";

type EquipmentRow = {
  id: string;
  equipment_name: string;
  equipment_sr_no: string;
  additional_id: string;
  purchase_date: string;
  oem: string;
  purchase_cost: number;
  equipment_group_id: string;
  oemDetails?: {
    oem_code: string;
  };
  equipmentGroup?: Array<{
    equipment_group: string;
  }>;
};

type SortConfig = {
  key: keyof EquipmentRow | null;
  direction: 'asc' | 'desc';
};

export const Equipments = () => {
  const [equipments, setEquipments] = useState<EquipmentRow[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const navigate = useNavigate();

  // Apply sorting
  const applySorting = (data: EquipmentRow[], config: SortConfig) => {
    if (!config.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[config.key!];
      let bValue = b[config.key!];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Handle date sorting
      if (config.key === 'purchase_date') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return config.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // Handle numeric sorting for purchase cost
      if (config.key === 'purchase_cost') {
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

  const handleSort = (key: keyof EquipmentRow) => {
    setSortConfig(currentConfig => ({
      key,
      direction: currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof EquipmentRow) => {
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

  // Filtered and sorted data
  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.equipment_sr_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEquipments = applySorting(filteredEquipments, sortConfig);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEquipments,
  } = usePagination(sortedEquipments, rowsPerPage);

  const exportToCSV = (data: EquipmentRow[]) => {
    if (!data || data.length === 0) {
      toast.warn("No data available to export");
      return;
    }

    const headers = [
      "Equipment Name",
      "Serial No",
      "Additional ID",
      "Purchase Date",
      "OEM",
      "Purchase Cost",
      "Group",
    ];

    const rows = data.map((item) => [
      item.equipment_name,
      item.equipment_sr_no,
      item.additional_id,
      item.purchase_date,
      item.oemDetails?.oem_code || '',
      item.purchase_cost,
      item.equipmentGroup?.map((group: any) => group.equipment_group).join(', ') || '',
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "equipments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported successfully!");
  };

  const handleSortByName = () => {
    handleSort('equipment_name');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortBySerialNo = () => {
    handleSort('equipment_sr_no');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByPurchaseCost = () => {
    handleSort('purchase_cost');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  const handleSortByPurchaseDate = () => {
    handleSort('purchase_date');
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  useEffect(() => {
    const fetchAndSetEquipments = async () => {
      setLoading(true);
      try {
        const data = await fetchEquipments();
        setEquipments(data);
      } catch (err) {
        console.error("Failed to fetch equipments", err);
      }
      setLoading(false);
    };

    fetchAndSetEquipments();
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

  const handleView = (equipment: EquipmentRow) => {
    setSelectedEquipment(equipment);
  };

  const handleDelete = async (equipment: EquipmentRow) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      setLoading(true);
      try {
        await deleteEquipment(equipment.id);
        const data = await fetchEquipments();
        setEquipments(data);
        toast.success("Equipment deleted successfully!");
      } catch (err) {
        console.error("Failed to delete equipment", err);
        toast.error("Failed to delete equipment!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Equipments" />
          <div className="flex flex-wrap justify-end items-center mb-4 gap-3">
            <input
              type="text"
              placeholder="Search by Name or Serial No"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              onClick={() => navigate("/equipments/create")}
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
                      exportToCSV(filteredEquipments);
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
                          onClick={handleSortByName}
                        >
                          Sort by Name
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={handleSortBySerialNo}
                        >
                          Sort by Serial No
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={handleSortByPurchaseCost}
                        >
                          Sort by Purchase Cost
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={handleSortByPurchaseDate}
                        >
                          Sort by Purchase Date
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto flex-1 w-full overflow-auto">
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
                    onClick={() => handleSort('equipment_name')}
                  >
                    <div className="flex items-center">
                      Equipment Name
                      {getSortIcon('equipment_name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('equipment_sr_no')}
                  >
                    <div className="flex items-center">
                      Equipment Serial No
                      {getSortIcon('equipment_sr_no')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-[12px] text-left">
                    Additional ID
                  </th>
                  <th
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('purchase_date')}
                  >
                    <div className="flex items-center">
                      Purchase Date
                      {getSortIcon('purchase_date')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-[12px] text-left">OEM</th>
                  <th
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('purchase_cost')}
                  >
                    <div className="flex items-center">
                      Purchase Cost
                      {getSortIcon('purchase_cost')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-[12px] text-left">Group</th>
                  <th className="px-4 py-3 text-[12px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {paginatedEquipments.map((equipment) => (
                  <tr
                    key={equipment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center cursor-pointer"
                    onClick={() => handleView(equipment)}
                    onMouseEnter={() => setHoveredRow(equipment.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment.equipment_name}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment.equipment_sr_no}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment.additional_id}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {(() => {
                        if (!equipment.purchase_date) return "-";
                        const date = new Date(equipment.purchase_date);
                        const dd = String(date.getDate()).padStart(2, "0");
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const yyyy = date.getFullYear();
                        return `${dd}-${mm}-${yyyy}`;
                      })()}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment?.oemDetails?.oem_code}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment.purchase_cost
                        ? `₹${equipment.purchase_cost.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {equipment.equipmentGroup &&
                      equipment.equipmentGroup.length > 0
                        ? equipment.equipmentGroup
                            .map((group: any) => group.equipment_group)
                            .join(", ")
                        : "-"}
                    </td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === equipment.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === equipment.id
                                ? null
                                : equipment.id
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
                      {dropdownOpen === equipment.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              navigate(`/equipments/edit/${equipment.id}`);
                              setDropdownOpen(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              handleDelete(equipment);
                              setDropdownOpen(null);
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

        <div className="px-6 pb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>

      <EquipmentDrawer
        isOpen={!!selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        equipment={selectedEquipment}
      />
    </>
  );
};