import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCustomer, fetchCustomers } from "../../apis/customerApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import PartnerDrawer from "./PartnerDrawer";
import * as XLSX from "xlsx";
import Title from "../../components/common/Title";

export const Partners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetPartners = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomers();
        setPartners(
          data.map((item) => ({
            id: item.id,
            partner_name: item.partner_name,
            partner_address: item.partner_address,
            partner_gst: item.partner_gst,
            partner_geo_id: item.partner_geo_id,
            isCustomer: item.isCustomer,
            state: (item as any).state || "N/A",
            city: (item as any).city || "N/A",
            pincode: (item as any).pincode || "N/A",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch partners", err);
      }
      setLoading(false);
    };
    fetchAndSetPartners();
  }, []);

  // Sort partners
  const sortPartners = (partners: any[]) => {
    if (!sortField) return partners;

    return [...partners].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string fields with case-insensitive sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle boolean field for isCustomer
      if (sortField === "isCustomer") {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      // Handle numeric fields
      if (sortField === "pincode") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filtered and sorted data
  const filteredPartners = partners.filter((partner) =>
    partner.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPartners = sortPartners(filteredPartners);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedPartners,
  } = usePagination(sortedPartners, rowsPerPage);

  const exportToExcel = (data: any[]) => {
    if (!data || data.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const exportData = data.map((partner) => ({
      Name: partner.partner_name,
      Address: partner.partner_address,
      GST: partner.partner_gst,
      "Geo ID": partner.partner_geo_id,
      "Is Customer": partner.isCustomer ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Partners");

    XLSX.writeFile(workbook, "partners.xlsx");
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection("asc");
    }
    setSortMenuOpen(false);
    setMoreDropdownOpen(false);
    
    const fieldName = getFieldDisplayName(field);
    const direction = sortField === field ? (sortDirection === "asc" ? "descending" : "ascending") : "ascending";
    toast.info(`Sorted by ${fieldName} ${direction}`);
  };

  const getFieldDisplayName = (field: string) => {
    const fieldNames: { [key: string]: string } = {
      partner_name: "Name",
      partner_gst: "GST",
      state: "State",
      city: "City",
      pincode: "Pincode",
      isCustomer: "Customer Status"
    };
    return fieldNames[field] || field;
  };

  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
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

  const handleDelete = async (partner: any) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setLoading(true);
      try {
        await deleteCustomer(partner.id);
        const data = await fetchCustomers();
        setPartners(
          data.map((item) => ({
            id: item.id,
            partner_name: item.partner_name,
            partner_address: item.partner_address,
            partner_gst: item.partner_gst,
            partner_geo_id: item.partner_geo_id,
            isCustomer: item.isCustomer,
          }))
        );
        toast.success("Partner deleted successfully!");
      } catch (err) {
        console.error("Failed to delete partner", err);
        toast.error("Failed to delete partner!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Partners" />
          <div className="flex justify-end items-center mb-4 gap-3">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate("/partners/create")}
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
                      exportToExcel(partners);
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
                          onClick={() => handleSort("partner_name")}
                        >
                          Sort by Name{getSortIndicator("partner_name")}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => handleSort("partner_gst")}
                        >
                          Sort by GST{getSortIndicator("partner_gst")}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => handleSort("state")}
                        >
                          Sort by State{getSortIndicator("state")}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => handleSort("city")}
                        >
                          Sort by City{getSortIndicator("city")}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => handleSort("pincode")}
                        >
                          Sort by Pincode{getSortIndicator("pincode")}
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                          onClick={() => handleSort("isCustomer")}
                        >
                          Sort by Customer Status{getSortIndicator("isCustomer")}
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
            <table className="w-full min-w-[900px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("partner_name")}>
                    Name{getSortIndicator("partner_name")}
                  </th>
                  <th className="px-4 py-3 text-left text-[12px]">Address</th>
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("state")}>
                    State{getSortIndicator("state")}
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("city")}>
                    City{getSortIndicator("city")}
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("pincode")}>
                    Pincode{getSortIndicator("pincode")}
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("partner_gst")}>
                    GST{getSortIndicator("partner_gst")}
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => handleSort("isCustomer")}>
                    Is Customer{getSortIndicator("isCustomer")}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {paginatedPartners.map((partner, i) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center cursor-pointer"
                    onClick={() => setSelectedPartner(partner)}
                    onMouseEnter={() => setHoveredRow(partner.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    
                    <td className="px-4 py-3 text-[12px] text-left">{partner.partner_name}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {partner.partner_address?.slice(0, 30) + "..."}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {partner.state}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {partner.city}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {partner.pincode}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-left">{partner.partner_gst}</td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {partner.isCustomer ? "Yes" : "No"}
                    </td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === partner.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === partner.id ? null : partner.id
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
                      {dropdownOpen === partner.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              navigate(`/partners/edit/${partner.id}`);
                              setDropdownOpen(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              handleDelete(partner);
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

      <PartnerDrawer
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
      />
    </>
  );
};