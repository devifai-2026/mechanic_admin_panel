import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";
import * as XLSX from "xlsx";
import { getAllExpenses } from "../../../apis/expenseApi";

export const AllExpenses = () => {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredExpenses = expenses.filter(
        (exp) =>
            exp.paid_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.expense_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exp.project?.project_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData: paginatedExpenses,
    } = usePagination(filteredExpenses, rowsPerPage);

    const fetchAndSetExpenses = async () => {
        setLoading(true);
        try {
            const data = await getAllExpenses();
            setExpenses(data);
        } catch (err) {
            toast.error("Failed to fetch Expenses");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetExpenses();
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

    const exportExpensesToExcel = (expenses: any[]) => {
        if (!expenses || expenses.length === 0) {
            toast.error("No expenses to export.");
            return;
        }

        const exportData = expenses.map((exp) => ({
            Date: new Date(exp.date).toLocaleDateString(),
            "Paid To": exp.paid_to || "N/A",
            "Paid By": exp.paid_by || "N/A",
            "Project No": exp.project?.project_no || "N/A",
            "Expense Code": exp.expense_code || "N/A",
            "Expense Name": exp.expense_name || "N/A",
            Amount: exp.amount || 0,
            Allocation: exp.allocation || "N/A",
            "Created By": exp.creator?.emp_name || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        XLSX.writeFile(workbook, "expenses.xlsx");
    };

    const handleSortByDate = () => {
        setExpenses((prev) =>
            [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        toast.info("Sorted by Date");
    };

    const handleSortByAmount = () => {
        setExpenses((prev) =>
            [...prev].sort((a, b) => (a.amount || 0) - (b.amount || 0))
        );
        toast.info("Sorted by Amount");
    };

    const handleSortByProject = () => {
        setExpenses((prev) =>
            [...prev].sort((a, b) =>
                (a.project?.project_no || "").localeCompare(b.project?.project_no || "")
            )
        );
        toast.info("Sorted by Project");
    };

    return (
        <>
            <div className="flex justify-between items-center px-6 mb-2 ">
                <PageBreadcrumb pageTitle="All Expenses" />
                <div className="flex justify-end items-center gap-3 px-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search by Payee, Expense or Project..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-1 border rounded-md dark:bg-gray-900 dark:border-gray-700 text-sm"
                        />
                    </div>
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
                                        exportExpensesToExcel(expenses);
                                    }}
                                >
                                    Export
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                                    onClick={() => {
                                        setMoreDropdownOpen(false);
                                        fetchAndSetExpenses();
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
                                                    handleSortByDate();
                                                }}
                                            >
                                                Sort by Date
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    setMoreDropdownOpen(false);
                                                    setSortMenuOpen(false);
                                                    handleSortByAmount();
                                                }}
                                            >
                                                Sort by Amount
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                                onClick={() => {
                                                    setMoreDropdownOpen(false);
                                                    setSortMenuOpen(false);
                                                    handleSortByProject();
                                                }}
                                            >
                                                Sort by Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </span>
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
                <div className="overflow-x-auto flex-1 w-full overflow-auto px-6 pb-6">
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
                                    <th className="px-4 py-3 text-[12px]">S.No</th>
                                    <th className="px-4 py-3 text-[12px]">Date</th>
                                    <th className="px-4 py-3 text-[12px]">Paid To</th>
                                    <th className="px-4 py-3 text-[12px]">Project No</th>
                                    <th className="px-4 py-3 text-[12px]">Expense Name</th>
                                    <th className="px-4 py-3 text-[12px]">Amount</th>
                                    <th className="px-4 py-3 text-[12px]">Allocation</th>
                                    <th className="px-4 py-3 text-[12px]">Created By</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                                {paginatedExpenses.map((exp, index) => (
                                    <tr
                                        key={exp.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() =>
                                            navigate(`/expenses/${exp.id}`, {
                                                state: { expense: exp },
                                            })
                                        }
                                    >
                                        <td className="px-4 py-3 text-[12px]">
                                            {(currentPage - 1) * rowsPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {new Date(exp.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {exp.paid_to || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {exp.project?.project_no || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {exp.expense_name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            ₹{exp.amount || 0}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {exp.allocation || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {exp.creator?.emp_name || "N/A"}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedExpenses.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center px-4 py-3">
                                            No expenses found
                                        </td>
                                    </tr>
                                )}
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
        </>
    );
};