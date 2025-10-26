import { useEffect, useState } from "react";
import { deleteProject, fetchProjects } from "../../apis/projectsApi";
import { handleExport } from "../../utils/helperFunctions/downloadExcel_forProjects";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ProjectDrawer from "./ProjectDrawer";
import { useNavigate } from "react-router";
import Title from "../../components/common/Title";
import { IoIosMore } from "react-icons/io";

type ProjectRow = {
  id: any;
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStart: string;
  tenure: string;
  duration: string | null;
  revenues: string;
  equipments: number;
  staff: number;
  locations: number;
};

export const Projects = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rawProjects, setRawProjects] = useState<any[]>([]);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedProjects,
  } = usePagination(projects, rowsPerPage);

  const navigate = useNavigate();

  const fetchAndSetProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setRawProjects(data);
    } catch (err) {
      console.error("Error loading projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetProjects();
  }, []);

  useEffect(() => {
    const filtered = rawProjects.filter((p: any) => {
      const projectNo = p.project_no?.toLowerCase() || "";
      const customer = p.customer?.partner_name?.toLowerCase() || "";
      const orderNo = p.order_no?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      return (
        projectNo.includes(query) ||
        customer.includes(query) ||
        orderNo.includes(query)
      );
    });

    const simplified = filtered.map((p: any) => {
      const start = new Date(p.contract_start_date);
      const end = p.contract_end_date ? new Date(p.contract_end_date) : null;

      let duration = "Ongoing";
      if (end && !isNaN(start.getTime())) {
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = (diffDays % 365) % 30;

        const parts = [];
        if (years) parts.push(`${years} year${years > 1 ? "s" : ""}`);
        if (months) parts.push(`${months} month${months > 1 ? "s" : ""}`);
        if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);

        duration = parts.join(" ");
      }

      return {
        id: p.id,
        projectNo: p.project_no,
        customer: p.customer?.partner_name || "N/A",
        orderNo: p.order_no,
        contractStart: p.contract_start_date?.split("T")[0] || "N/A",
        tenure: p.contract_tenure,
        duration,
        revenues:
          p.revenues.length > 0
            ? p.revenues.map((r: any) => r.revenue_description).join(", ")
            : "N/A",
        equipments: p.equipments.length,
        staff: p.staff.length,
        locations: p.store_locations.length,
      };
    });

    setProjects(simplified);
  }, [searchQuery, rawProjects]);

  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
      setOptionsDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleExportProjects = () => {
    const formattedProjects = rawProjects.map((project) => {
      const {
        createdAt,
        updatedAt,
        contract_start_date,
        contract_end_date,
        ...rest
      } = project;

      return {
        ...rest,
        contract_start_date: contract_start_date
          ? new Date(contract_start_date).toISOString().split("T")[0]
          : "",
        contract_end_date: contract_end_date
          ? new Date(contract_end_date).toISOString().split("T")[0]
          : "",
      };
    });

    handleExport(formattedProjects);
    toast.success("Exported as Excel!");
  };

  const handleSort = () => {
    const sorted = [...projects].sort((a, b) =>
      sortAsc
        ? a.projectNo.localeCompare(b.projectNo)
        : b.projectNo.localeCompare(a.projectNo)
    );
    setProjects(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="h-[80vh] flex flex-col dark:bg-gray-900 overflow-hidden">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center px-6">
        <Title pageTitle="Projects" />

        <div className="flex justify-end items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Search by Project No, Customer, or Order No"
            className="px-4 py-2 w-80 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => navigate("/projects/create")}
            className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <span>
              <FaPlus />
            </span>
            <span>New</span>
          </button>
          <span
            className="p-2 bg-gray-200 border-2 border-gray-50 rounded-lg cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setOptionsDropdownOpen(!optionsDropdownOpen);
            }}
          >
            <IoIosMore />
            {optionsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={handleExportProjects}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    fetchAndSetProjects();
                    setOptionsDropdownOpen(false);
                  }}
                >
                  Refresh
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    handleSort();
                    setOptionsDropdownOpen(false);
                  }}
                >
                  {sortAsc ? <FaSortAmountDown /> : <FaSortAmountUp />}
                  <span>Sort {sortAsc ? "Asc" : "Desc"}</span>
                </button>
              </div>
            )}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-blue-600 font-semibold text-lg">
              Loading...
            </span>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden px-6 pt-4">
              <div className="h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="overflow-y-auto h-full">
                  <table className="w-full min-w-full text-base">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Serial No.
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Project No
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Order No
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Contract Start
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Revenues
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Equipments
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Staff
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left">
                          Locations
                        </th>
                        <th className="px-4 py-3 text-[12px] text-left"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                      {paginatedProjects?.map((project, idx) => (
                        <tr
                          key={idx}
                          className="even:bg-gray-200 dark:even:bg-gray-900 cursor-pointer"
                          onClick={() =>
                            navigate(`/projects/${project.id}`, {
                              state: { project: rawProjects[idx] },
                            })
                          }
                          onMouseEnter={() => setHoveredRow(project.projectNo)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-4 py-2 text-[12px] text-left">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.projectNo}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.customer}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.orderNo}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.contractStart}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.duration}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.revenues}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.equipments}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.staff}
                          </td>
                          <td className="px-4 py-2 text-[12px] text-left">
                            {project.locations}
                          </td>
                          <td className="flex justify-center gap-2 relative">
                            {hoveredRow === project.projectNo && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropdownOpen(
                                    dropdownOpen === project.projectNo
                                      ? null
                                      : project.projectNo
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
                            {dropdownOpen === project.projectNo && (
                              <div
                                className="absolute z-20 right-0 mt-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    navigate(
                                      `/projects/add/employees/${project.id}`
                                    );
                                  }}
                                >
                                  Add Employees
                                </button>
                                {project.staff > 0 && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                    onClick={() => {
                                      setDropdownOpen(null);
                                      navigate(
                                        `/projects/edit/employees/${project.id}`
                                      );
                                    }}
                                  >
                                    Edit Employees
                                  </button>
                                )}
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    navigate(`/projects/edit/${project.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition flex items-center justify-between"
                                  onClick={async () => {
                                    setIsDeleting(true);
                                    try {
                                      await deleteProject(project.id);
                                      toast.success(
                                        "Project deleted successfully!"
                                      );
                                      setDropdownOpen(null);
                                      fetchAndSetProjects();
                                    } catch (error) {
                                      console.error("Delete failed:", error);
                                      toast.error("Failed to delete project");
                                    } finally {
                                      setIsDeleting(false);
                                    }
                                  }}
                                  disabled={isDeleting}
                                >
                                  Delete
                                  {isDeleting && (
                                    <svg
                                      className="animate-spin h-4 w-4 ml-2"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  )}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </>
        )}
      </div>

      <ProjectDrawer
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
};
