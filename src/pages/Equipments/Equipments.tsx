import { useEffect, useState } from "react";
import { fetchEquipments, deleteEquipment } from "../../apis/equipmentApi";
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import Pagination from "../../utils/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import EquipmentDrawer from "./EquipmentDrawer";
import { useNavigate } from "react-router";
import Title from "../../components/common/Title";

export const Equipments = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [equipmentGroups, setEquipmentGroups] = useState<any[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  // const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Filtered data
  const filteredEquipments = equipments.filter((eq) =>
    eq.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.equipment_sr_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEquipments,
  } = usePagination(filteredEquipments, rowsPerPage);

  const exportToCSV = (data: any[]) => {
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
      item.oem,
      item.purchase_cost,
      item.equipment_group_id,
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

  useEffect(() => {
    const fetchAndSetEquipmentGroups = async () => {
      try {
        const data = await fetchEquipmentGroups();
        setEquipmentGroups(data);
      } catch (err) {
        console.error("Failed to fetch equipment groups", err);
      }
    };

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

    fetchAndSetEquipmentGroups();
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

  const handleView = (equipment: any) => {
    setSelectedEquipment(equipment);
  };

  const handleDelete = async (equipment: any) => {
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
              className="px-3 py-1 border rounded-md text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate("/equipments/create")}
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
                  <th className="px-4 py-3 text-[12px] text-left">Serial No</th>
                  <th className="px-4 py-3 text-[12px] text-left">Equipment Name</th>
                  <th className="px-4 py-3 text-[12px] text-left">Equipment Serial No</th>
                  <th className="px-4 py-3 text-[12px] text-left">Additional ID</th>
                  <th className="px-4 py-3 text-[12px] text-left">Purchase Date</th>
                  <th className="px-4 py-3 text-[12px] text-left">OEM</th>
                  <th className="px-4 py-3 text-[12px] text-left">Purchase Cost</th>
                  <th className="px-4 py-3 text-[12px] text-left">Group</th>
                  <th className="px-4 py-3 text-[12px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {paginatedEquipments.map((equipment, i) => (
                  <tr
                    key={equipment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center cursor-pointer"
                    onClick={() => handleView(equipment)}
                    onMouseEnter={() => setHoveredRow(equipment.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i +1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{equipment.equipment_name}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{equipment.equipment_sr_no}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{equipment.additional_id}</td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {(() => {
                        const date = new Date(equipment.purchase_date);
                        const dd = String(date.getDate()).padStart(2, "0");
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const yyyy = date.getFullYear();
                        return `${dd}-${mm}-${yyyy}`;
                      })()}
                    </td>

                    <td className="px-4 py-3 text-[12px] text-left">{equipment.oem}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{equipment.purchase_cost}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {
                        equipmentGroups.find(
                          (g: any) => g.id === equipment.equipment_group_id
                        )?.equipment_group || ""
                      }
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
                              toast.info("Edit clicked");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => handleDelete(equipment)}
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
