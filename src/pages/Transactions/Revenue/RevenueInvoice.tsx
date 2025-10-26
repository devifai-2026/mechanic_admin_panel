import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";

import * as XLSX from "xlsx";
import { getAllRevenueInvoice } from "../../../apis/revenueInputApi";

export const RevenueInvoice = () => {
    const [revenues, setRevenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredRevenues = revenues.filter(
        (rev) =>
            rev.ho_invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.project?.project_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData: paginatedRevenues,
    } = usePagination(filteredRevenues, rowsPerPage);

    const fetchAndSetRevenues = async () => {
        setLoading(true);
        try {
            const data = await getAllRevenueInvoice();
            setRevenues(data);
        } catch (err) {
            toast.error("Failed to fetch Revenues");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetRevenues();
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

    const exportRevenuesToExcel = (revenues: any[]) => {
        if (!revenues || revenues.length === 0) {
            toast.error("No revenues to export.");
            return;
        }

        const exportData = revenues.map((rev) => ({
            Date: new Date(rev.date).toLocaleDateString(),
            "HO Invoice": rev.ho_invoice || "N/A",
            "Project No": rev.project?.project_no || "N/A",
            "Account Name": rev.account_name || "N/A",
            "Account Code": rev.account_code || "N/A",
            "Basic Amount": rev.amount_basic || 0,
            "Tax Value": rev.tax_value || 0,
            "Total Amount": rev.total_amount || 0,
            "Created By": rev.creator?.emp_name || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Revenues");

        XLSX.writeFile(workbook, "revenues.xlsx");
    };

    const handleSortByDate = () => {
        setRevenues((prev) =>
            [...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        toast.info("Sorted by Date");
    };

    const handleSortByAmount = () => {
        setRevenues((prev) =>
            [...prev].sort((a, b) => (a.total_amount || 0) - (b.total_amount || 0))
        );
        toast.info("Sorted by Total Amount");
    };

    const handleSortByProject = () => {
        setRevenues((prev) =>
            [...prev].sort((a, b) =>
                (a.project?.project_no || "").localeCompare(b.project?.project_no || "")
            )
        );
        toast.info("Sorted by Project");
    };

    return (
        <>
            <div className="flex justify-between items-center px-6 mb-2 ">
                <PageBreadcrumb pageTitle="Revenue" />
                <div className="flex justify-end items-center gap-3 px-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search by Invoice, Account or Project..."
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
                                        exportRevenuesToExcel(revenues);
                                    }}
                                >
                                    Export
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                                    onClick={() => {
                                        setMoreDropdownOpen(false);
                                        fetchAndSetRevenues();
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
                                    <th className="px-4 py-3 text-[12px]">HO Invoice</th>
                                    <th className="px-4 py-3 text-[12px]">Project No</th>
                                    <th className="px-4 py-3 text-[12px]">Account Name</th>
                                    <th className="px-4 py-3 text-[12px]">Basic Amount</th>
                                    <th className="px-4 py-3 text-[12px]">Tax Value</th>
                                    <th className="px-4 py-3 text-[12px]">Total Amount</th>
                                    <th className="px-4 py-3 text-[12px]">Created By</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                                {paginatedRevenues.map((rev, index) => (
                                    <tr
                                        key={rev.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                                        onClick={() =>
                                            navigate(`/revenueInvoice-detail/${rev.id}`, {
                                                state: { revenue: rev },
                                            })
                                        }
                                    >
                                        <td className="px-4 py-3 text-[12px]">
                                            {(currentPage - 1) * rowsPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {new Date(rev.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {rev.ho_invoice || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {rev.project?.project_no || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {rev.account_name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            ₹{rev.amount_basic || 0}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            ₹{rev.tax_value || 0}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            ₹{rev.total_amount || 0}
                                        </td>
                                        <td className="px-4 py-3 text-[12px]">
                                            {rev.creator?.emp_name || "N/A"}
                                        </td>
                                    </tr>
                                ))}
                                {paginatedRevenues.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="text-center px-4 py-3">
                                            No revenues found
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