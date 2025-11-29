import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { deleteEquipmentGroup, fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import EquipmentDrawer from "./EquipmentDrawer";

type EquipmentGroup = {
  id: string;
  equipment_group: string;
  equip_grp_code: string;
};

type SortConfig = {
  key: keyof EquipmentGroup | null;
  direction: 'asc' | 'desc';
};

export const EquipmentGroup = () => {
    const [equipmentGroups, setEquipmentGroups] = useState<EquipmentGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<EquipmentGroup | null>(null);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

    const navigate = useNavigate();

    // Apply sorting
    const applySorting = (data: EquipmentGroup[], config: SortConfig) => {
        if (!config.key) return data;

        return [...data].sort((a, b) => {
            let aValue = a[config.key!];
            let bValue = b[config.key!];

            // Handle null/undefined values
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';

            // Handle string values
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return config.direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return 0;
        });
    };

    const handleSort = (key: keyof EquipmentGroup) => {
        setSortConfig(currentConfig => ({
            key,
            direction: currentConfig.key === key && currentConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key: keyof EquipmentGroup) => {
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

    const filteredEquipmentGroups = equipmentGroups.filter((group) =>
        group.equipment_group?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        group.equip_grp_code?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    const sortedEquipmentGroups = applySorting(filteredEquipmentGroups, sortConfig);

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
    } = usePagination(sortedEquipmentGroups, rowsPerPage);

    const fetchAndSetEquipmentGroups = async () => {
        setLoading(true);
        try {
            const data = await fetchEquipmentGroups();
            setEquipmentGroups(data);
        } catch (err) {
            toast.error("Failed to fetch equipment groups");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetEquipmentGroups();
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

    const handleDelete = async (group: EquipmentGroup) => {
        if (window.confirm("Are you sure you want to delete this equipment group?")) {
            setLoading(true);
            try {
                await deleteEquipmentGroup(group.id);
                await fetchAndSetEquipmentGroups();
                toast.success("Equipment group deleted successfully!");
            } catch (err) {
                toast.error("Failed to delete equipment group!");
            }
            setLoading(false);
        }
    };

    const handleSortByName = () => {
        handleSort('equipment_group');
        setMoreDropdownOpen(false);
        setSortMenuOpen(false);
    };

    const handleSortByCode = () => {
        handleSort('equip_grp_code');
        setMoreDropdownOpen(false);
        setSortMenuOpen(false);
    };

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={3000} />

            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-6 mb-4 gap-4">
                <PageBreadcrumb pageTitle="Equipment Groups" />

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search by name or code"
                        className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        onClick={() => navigate("/equipmentgroup/create")}
                        className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
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
                                        toast.info("Export clicked");
                                    }}
                                >
                                    Export
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                                    onClick={() => {
                                        setMoreDropdownOpen(false);
                                        fetchAndSetEquipmentGroups();
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
                                        Sort <span className="ml-2">&gt;</span>
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
                <div className="overflow-x-auto flex-1 w-full overflow-auto px-6 pb-6">
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
                                        onClick={() => handleSort('equip_grp_code')}
                                    >
                                        <div className="flex items-center">
                                            Group Code
                                            {getSortIcon('equip_grp_code')}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-4 py-3 text-[12px] text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        onClick={() => handleSort('equipment_group')}
                                    >
                                        <div className="flex items-center">
                                            Group Name
                                            {getSortIcon('equipment_group')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                                {paginatedData.map((group) => (
                                    <tr
                                        key={group.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() => {
                                            setSelectedGroup(group)
                                            setDrawerOpen(true);
                                        }}
                                        onMouseEnter={() => setHoveredRow(group.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td className="px-4 py-3 text-[12px] text-left">
                                            {group.equip_grp_code}
                                        </td>
                                        <td className="px-4 py-3 text-[12px] text-left">
                                            {group.equipment_group}
                                        </td>
                                        <td className="flex justify-center gap-2 relative">
                                            {hoveredRow === group.id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDropdownOpen(
                                                            dropdownOpen === group.id ? null : group.id
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
                                            {dropdownOpen === group.id && (
                                                <div
                                                    className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                                        onClick={() => {
                                                            setDropdownOpen(null);
                                                            navigate(`/equipment-group/edit/${group.id}`);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                                                        onClick={() => {
                                                            setDropdownOpen(null);
                                                            handleDelete(group);
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

                <EquipmentDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    equipmentGroup={selectedGroup}
                />

                {/* Pagination */}
                <div className="px-6 pb-6 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                         totalItems={equipmentGroups.length}
                    />
                </div>
            </div>
        </>
    );
};