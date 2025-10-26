import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import AccountGroupDrawer from "./AccountGroupDrawer";
import {
  getAllAccountGroups,
  deleteAccountGroup,
} from "../../apis/accountGroupApi";
import { AccountGroup } from "../../types/accountGroupTypes";
import Title from "../../components/common/Title";

export const AccountGroupPage = () => {
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [filteredAccountGroups, setFilteredAccountGroups] = useState<AccountGroup[]>([]);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState<AccountGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedAccountGroups,
  } = usePagination(filteredAccountGroups, rowsPerPage);

  const fetchAndSetAccountGroups = async () => {
    setLoading(true);
    try {
      const data = await getAllAccountGroups();
      setAccountGroups(data);
      setFilteredAccountGroups(data);
    } catch (err) {
      toast.error("Failed to fetch Account Groups");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetAccountGroups();
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

  const handleDelete = async (group: AccountGroup) => {
    if (window.confirm("Are you sure you want to delete this Account Group?")) {
      setLoading(true);
      try {
        await deleteAccountGroup(group.id);
        await fetchAndSetAccountGroups();
        toast.success("Account Group deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete Account Group!");
      }
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredAccountGroups.length === 0) {
      toast.info("No data to export.");
      return;
    }

    const csvRows = [
      ["Group Name", "Group Code"],
      ...filteredAccountGroups.map((group) => [
        group.account_group_name,
        group.account_group_code,
      ]),
    ];

    const csvContent = csvRows
      .map((row) =>
        row.map((value) => `"${(value ?? "").toString().replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "account_groups.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Exported as CSV");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = accountGroups.filter(
      (group) =>
        group.account_group_name.toLowerCase().includes(term.toLowerCase()) ||
        group.account_group_code.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAccountGroups(filtered);
    setCurrentPage(1);
  };

  const handleSortByName = () => {
    setFilteredAccountGroups((prev) =>
      [...prev].sort((a, b) =>
        a.account_group_name.localeCompare(b.account_group_name)
      )
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setFilteredAccountGroups((prev) =>
      [...prev].sort((a, b) =>
        a.account_group_code.localeCompare(b.account_group_code)
      )
    );
    toast.info("Sorted by Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Account Groups" />
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <input
              type="text"
              placeholder="Search by Name or Code"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm"
            />
            <button
              onClick={() => navigate("/accountgroup/create")}
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
                      exportToCSV();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetAccountGroups();
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
                  <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                  <th className="px-4 py-3 text-[12px] text-left">Group Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Group Name</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedAccountGroups.map((group, i) => (
                  <tr
                    key={group.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedAccountGroup(group)}
                    onMouseEnter={() => setHoveredRow(group.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i+1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{group.account_group_code}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{group.account_group_name}</td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === group.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(dropdownOpen === group.id ? null : group.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition"
                          title="Actions"
                        >
                          <FaCircleChevronDown className="text-blue-500" size={20} />
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
                              navigate(`/accountgroup/edit/${group.id}`);
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
      <AccountGroupDrawer
        isOpen={!!selectedAccountGroup}
        onClose={() => setSelectedAccountGroup(null)}
        accountGroup={selectedAccountGroup}
      />
    </>
  );
};
