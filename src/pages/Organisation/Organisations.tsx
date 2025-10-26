import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { Organisation } from "../../types/organisationTypes";
import {
  deleteOrganisation,
  getAllOrganisations,
} from "../../apis/organisationApi";
import OrganisationDrawer from "./OrganisationDrawer";
import Title from "../../components/common/Title";

export const Organisations = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState(""); // 🆕 Search input state
  const navigate = useNavigate();

  const convertOrganisationsToCSV = (orgs: Organisation[]) => {
    const header = ["Organisation Name", "Organisation Code"];
    const rows = orgs.map((org) => [org.org_name, org.org_code]);
    const csvContent =
      [header, ...rows]
        .map((row) =>
          row
            .map((item) => `"${item?.toString().replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n") + "\n";
    return csvContent;
  };

  const handleExport = () => {
    if (organisations.length === 0) {
      toast.info("No organisations to export");
      return;
    }

    const csv = convertOrganisationsToCSV(organisations);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "organisations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success("Organisations exported successfully!");
  };

  const filteredOrganisations = organisations.filter(
    (org) =>
      org.org_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.org_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedOrganisations,
  } = usePagination(filteredOrganisations, rowsPerPage); // 🆕 use filtered data

  const fetchAndSetOrganisations = async () => {
    setLoading(true);
    try {
      const data = await getAllOrganisations();
      setOrganisations(data);
    } catch (err) {
      toast.error("Failed to fetch organisations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetOrganisations();
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

  const handleDelete = async (org: Organisation) => {
    if (window.confirm("Are you sure you want to delete this organisation?")) {
      setLoading(true);
      try {
        await deleteOrganisation(org.id);
        await fetchAndSetOrganisations();
        toast.success("Organisation deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete organisation!");
      }
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setOrganisations((prev) =>
      [...prev].sort((a, b) => a.org_name.localeCompare(b.org_name))
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setOrganisations((prev) =>
      [...prev].sort((a, b) => a.org_code.localeCompare(b.org_code))
    );
    toast.info("Sorted by Code");
  };

  return (
    <>
      {/* <PageBreadcrumb pageTitle="Organisations" /> */}
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Organisations" />
          <div className="flex justify-end items-center mb-4 gap-3">
             <div className="">
          <input
            type="text"
            placeholder="Search by Name or Code"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
            <button
              onClick={() => navigate("/organisations/create")}
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
                      handleExport();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetOrganisations();
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

        {/* 🆕 Search bar */}
       

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
                  <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                  <th className="px-4 py-3 text-[12px] text-left">Organisation Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Organisation Name</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedOrganisations.map((org, i) => (
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedOrganisation(org)}
                    onMouseEnter={() => setHoveredRow(org.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i +1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{org.org_code}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{org.org_name}</td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === org.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === org.id ? null : org.id
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
                      {dropdownOpen === org.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/organisation/edit/${org.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(org);
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

      <OrganisationDrawer
        isOpen={!!selectedOrganisation}
        onClose={() => setSelectedOrganisation(null)}
        organisation={selectedOrganisation}
      />
    </>
  );
};
