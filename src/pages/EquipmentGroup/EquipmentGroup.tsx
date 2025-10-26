import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { deleteEquipmentGroup, fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import EquipmentDrawer from "./EquipmentDrawer";
// import { deleteEquipmentGroup } from "../../apis/equipmentGroupApi"; // Uncomment when ready

export const EquipmentGroup = () => {
    const [equipmentGroups, setEquipmentGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    // const [selectedOem, setSelectedOem] = useState(null);

    const navigate = useNavigate();

    const filteredEquipmentGroups = equipmentGroups.filter((group) =>
        group.equipment_group?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        group.equip_grp_code?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
    } = usePagination(filteredEquipmentGroups, rowsPerPage);

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

    const handleDelete = async (group: any) => {
        if (window.confirm("Are you sure you want to delete this equipment group?")) {
            setLoading(true);
            try {
                // await deleteEquipmentGroup(group.id);
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
        setEquipmentGroups((prev) =>
            [...prev].sort((a, b) => a.equipment_group.localeCompare(b.equipment_group))
        );
        toast.info("Sorted by Name");
    };

    const handleSortByCode = () => {
        setEquipmentGroups((prev) =>
            [...prev].sort((a, b) => a.equip_grp_code.localeCompare(b.equip_grp_code))
        );
        toast.info("Sorted by Code");
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
                        className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
                                <tr >
                                    <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                                    <th className="px-4 py-3 text-[12px] text-left">Group Code</th>
                                    <th className="px-4 py-3 text-[12px] text-left">Group Name</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                                {paginatedData.map((group, i) => (
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
                                            {(currentPage - 1) * rowsPerPage + i + 1}
                                        </td>
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
                    />
                </div>
            </div>
        </>
    );
};
