import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import AccountDrawer from "./AccountDrawer";
import { getAllAccounts, deleteAccount } from "../../apis/accountApi";
import { Account } from "../../types/accountTypes";
import * as XLSX from "xlsx";
import Title from "../../components/common/Title";

export const AccountPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredAccounts = accounts.filter((acc) => {
    const groupName =
      acc.group?.account_group_name || acc.account_group || "";
    const search = searchTerm.toLowerCase();
    return (
      acc.account_name.toLowerCase().includes(search) ||
      acc.account_code.toLowerCase().includes(search) ||
      groupName.toLowerCase().includes(search)
    );
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedAccounts,
  } = usePagination(filteredAccounts, rowsPerPage);

  const handleExportToExcel = () => {
    const exportData = accounts.map((acc) => ({
      "Account Name": acc.account_name,
      "Account Code": acc.account_code,
      "Account Group":
        acc.group?.account_group_name || acc.account_group || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

    XLSX.writeFile(workbook, "accounts.xlsx");
  };

  const fetchAndSetAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (err) {
      toast.error("Failed to fetch Accounts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetAccounts();
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

  const handleDelete = async (account: Account) => {
    if (window.confirm("Are you sure you want to delete this Account?")) {
      setLoading(true);
      try {
        await deleteAccount(account.id);
        await fetchAndSetAccounts();
        toast.success("Account deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete Account!");
      }
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setAccounts((prev) =>
      [...prev].sort((a, b) => a.account_name.localeCompare(b.account_name))
    );
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setAccounts((prev) =>
      [...prev].sort((a, b) => a.account_code.localeCompare(b.account_code))
    );
    toast.info("Sorted by Code");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center px-6">
          <Title pageTitle="Accounts" />

          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Search account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate("/account/create")}
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
                      handleExportToExcel();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetAccounts();
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
                  <th className="px-4 py-3 text-[12px] text-left">Account Code</th>
                  <th className="px-4 py-3 text-[12px] text-left">Account Name</th>
                  <th className="px-4 py-3 text-[12px] text-left">Account Group</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedAccounts.map((account, i) => (
                  <tr
                    key={account.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedAccount(account)}
                    onMouseEnter={() => setHoveredRow(account.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 text-[12px] text-left">{i+1}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{account.account_code}</td>
                    <td className="px-4 py-3 text-[12px] text-left">{account.account_name}</td>
                    <td className="px-4 py-3 text-[12px] text-left">
                      {account.group?.account_group_name ||
                        account.account_group}
                    </td>
                    <td className="flex justify-center gap-2 relative">
                      {hoveredRow === account.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === account.id ? null : account.id
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
                      {dropdownOpen === account.id && (
                        <div
                          className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/account/edit/${account.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(account);
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
      <AccountDrawer
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        account={selectedAccount}
      />
    </>
  );
};
