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

// Import the actual API types
import { EquipmentResponse, ProjectTag } from "../../types/equipmentTypes";

// Extend the EquipmentResponse type to include oemDetails
type ExtendedEquipmentResponse = EquipmentResponse & {
  oemDetails?: {
    id: string;
    oem_name: string;
    oem_code: string;
  };
};

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
  projects?: Array<{  
    id: string;
    project_no: string;
    customer_id: string;
    order_no: string;
    contract_start_date: string;
    contract_end_date: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

// Extended ProjectTag type with optional properties
type ExtendedProjectTag = ProjectTag & {
  customer_id?: string;
  order_no?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SortConfig = {
  key: keyof EquipmentRow | null;
  direction: 'asc' | 'desc';
};

// Helper function to transform API response to EquipmentRow
const transformEquipmentData = (data: ExtendedEquipmentResponse[]): EquipmentRow[] => {
  return data.map((item) => ({
    id: item.id,
    equipment_name: item.equipment_name,
    equipment_sr_no: item.equipment_sr_no,
    additional_id: item.additional_id,
    purchase_date: item.purchase_date,
    oem: item.oem,
    purchase_cost: item.purchase_cost,
    equipment_group_id: item.equipment_group_id,
    // Use oemDetails from API response
    oemDetails: item.oemDetails ? { oem_code: item.oemDetails.oem_code } : { oem_code: item.oem },
    equipmentGroup: item.equipmentGroup,
    projects: item.projects?.map((project: ExtendedProjectTag) => ({
      id: project.id,
      project_no: project.project_no,
      customer_id: project.customer_id || '',
      order_no: project.order_no || '',
      contract_start_date: project.contract_start_date || '',
      contract_end_date: project.contract_end_date || '',
      createdAt: project.createdAt || '',
      updatedAt: project.updatedAt || ''
    }))
  }));
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

      // Handle projects array sorting
      if (config.key === 'projects') {
        const aProjectNo = a.projects && a.projects.length > 0 ? a.projects[0].project_no : '';
        const bProjectNo = b.projects && b.projects.length > 0 ? b.projects[0].project_no : '';
        
        return config.direction === 'asc' 
          ? aProjectNo.localeCompare(bProjectNo)
          : bProjectNo.localeCompare(aProjectNo);
      }

      // Handle date sorting - ensure we only pass string values to Date constructor
      if (config.key === 'purchase_date') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
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
      eq.equipment_sr_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eq.projects && eq.projects.some(project => 
        project.project_no.toLowerCase().includes(searchTerm.toLowerCase())
      ))
  );

  const sortedEquipments = applySorting(filteredEquipments, sortConfig);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEquipments,
  } = usePagination(sortedEquipments, rowsPerPage);

  // Calculate total purchase cost for CURRENTLY DISPLAYED data (paginated)
  const totalDisplayedPurchaseCost = paginatedEquipments.reduce((total, equipment) => {
    return total + (equipment.purchase_cost || 0);
  }, 0);

  // Calculate total purchase cost for all equipment
  const totalAllPurchaseCost = equipments.reduce((total, equipment) => {
    return total + (equipment.purchase_cost || 0);
  }, 0);

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
      "Project Tags",
    ];

    const rows = data.map((item) => [
      item.equipment_name,
      item.equipment_sr_no,
      item.additional_id,
      item.purchase_date,
      item.oemDetails?.oem_code || item.oem || '',
      item.purchase_cost,
      item.equipmentGroup?.map((group) => group.equipment_group).join(', ') || '',
      item.projects?.map((project) => project.project_no).join(', ') || '',
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

  const handleSortByProjectNo = () => {
    setSortConfig(currentConfig => ({
      key: 'projects' as keyof EquipmentRow,
      direction: currentConfig.key === 'projects' && currentConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setMoreDropdownOpen(false);
    setSortMenuOpen(false);
  };

  useEffect(() => {
    const fetchAndSetEquipments = async () => {
      setLoading(true);
      try {
        const data = await fetchEquipments();
        // Type assertion to include oemDetails
        const transformedData = transformEquipmentData(data as ExtendedEquipmentResponse[]);
        setEquipments(transformedData);
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
        // Type assertion to include oemDetails
        const transformedData = transformEquipmentData(data as ExtendedEquipmentResponse[]);
        setEquipments(transformedData);
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

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col text-center">
          <Title pageTitle="Equipments" />
           <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {searchTerm ? (
                  <>
                    All Purchase Cost: ₹{totalAllPurchaseCost.toLocaleString()}
                  </>
                ) : (
                  `All Purchase Cost: ₹${totalAllPurchaseCost.toLocaleString()}`
                )}
              </div>
        <div className="flex justify-between items-center mx-auto mt-4">
          <div className="flex flex-wrap justify-end items-center mb-4 gap-5">
            {/* Total Equipment Count */}
            <div className="px-4 py-2 border rounded-md text-sm w-[200px] bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm flex items-center gap-1.5">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                Total Equipments :
              </div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-500 truncate">
                {filteredEquipments.length.toLocaleString()}
                {searchTerm && (
                  <span className="text-xs text-gray-500 ml-1">
                    of {equipments.length.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Purchase Cost Display */}
            <div className="px-4 py-2 border rounded-md text-sm w-[200px] bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm flex items-center gap-1.5">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                Purchase Cost :
              </div>
              <div className="text-sm font-bold text-green-600 dark:text-green-500 truncate">
                ₹{totalDisplayedPurchaseCost.toLocaleString()}
              </div>
            </div>

            {/* Search Box */}
            <input
              type="text"
              placeholder="Search by Name, Serial No, or Project"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 shadow-sm"
            />

            {/* New Button */}
            <button
              onClick={() => navigate("/equipments/create")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-sm h-[42px]"
            >
              <FaPlus />
              <span>New</span>
            </button>

            {/* More Options */}
            <div className="relative">
              <button
                className="flex items-center justify-center p-2 bg-gray-200 border-2 border-gray-50 rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600 shadow-sm h-[42px] w-[42px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreDropdownOpen((prev) => !prev);
                }}
              >
                <IoIosMore />
              </button>
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
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={handleSortByProjectNo}
                        >
                          Sort by Project No
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
                  <th 
                    className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    onClick={handleSortByProjectNo}
                  >
                    <div className="flex items-center">
                      Project Tags
                      {sortConfig.key === 'projects' ? (
                        sortConfig.direction === 'asc' 
                          ? <FaSortUp size={12} className="ml-1 text-blue-500" />
                          : <FaSortDown size={12} className="ml-1 text-blue-500" />
                      ) : (
                        <div className="inline-flex flex-col ml-1 opacity-30">
                          <FaSortUp size={10} className="-mb-1" />
                          <FaSortDown size={10} className="-mt-1" />
                        </div>
                      )}
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
                      {equipment.projects && equipment.projects.length > 0 ? (
                        <div className="flex items-center">
                          <span className="truncate max-w-[120px]">
                            {equipment.projects[0].project_no}
                          </span>
                          {equipment.projects.length > 1 && (
                            <span 
                              className="ml-1 text-xs text-gray-500" 
                              title={equipment.projects.slice(1).map(p => p.project_no).join(', ')}
                            >
                              ...+{equipment.projects.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
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
                      {equipment?.oemDetails?.oem_code || equipment.oem}
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
                            .map((group) => group.equipment_group)
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalItems={filteredEquipments.length}
          />
      </div>

      <EquipmentDrawer
        isOpen={!!selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        equipment={selectedEquipment}
      />
    </>
  );
};