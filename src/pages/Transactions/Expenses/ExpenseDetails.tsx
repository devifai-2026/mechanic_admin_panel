import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaUser, FaBuilding, FaMoneyBillWave, FaFileAlt, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { getExpenseById } from "../../../apis/expenseApi";

const ExpenseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                setLoading(true);
                if (id) {
                    const data = await getExpenseById(id);
                    setExpense(data);
                }
            } catch (error) {
                toast.error("Failed to fetch expense details");
                console.error("Error fetching expense:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
                <div className="flex justify-center items-center py-20">
                    <span className="text-blue-600 font-semibold text-lg">Loading expense details...</span>
                </div>
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
                <button
                    onClick={() => navigate("/expenses/view")}
                    className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
                >
                    ← Back to All Expenses
                </button>
                <div className="p-6 text-red-600 dark:text-red-400">
                    <p className="mb-4">Expense not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
            <button
                onClick={() => navigate("/expenses/view")}
                className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
            >
                ← Back to All Expenses
            </button>

            <h1 className="text-2xl font-bold mb-6">Expense Details</h1>

            {/* Basic Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <InfoCard
                    icon={<FaCalendarAlt />}
                    label="Date"
                    value={new Date(expense.date).toLocaleDateString()}
                />
                <InfoCard
                    icon={<FaUser />}
                    label="Paid To"
                    value={expense.paid_to || "N/A"}
                />
                <InfoCard
                    icon={<FaUser />}
                    label="Paid By"
                    value={expense.paid_by || "N/A"}
                />
            </div>

            {/* Project and Amount Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <InfoCard
                    icon={<FaBuilding />}
                    label="Project No"
                    value={expense.project?.project_no || "N/A"}
                />
                <InfoCard
                    icon={<FaMoneyBillWave />}
                    label="Amount"
                    value={`₹${expense.amount || "0"}`}
                />
                <InfoCard
                    icon={<FaMapMarkerAlt />}
                    label="Allocation"
                    value={expense.allocation || "N/A"}
                />
            </div>

            {/* Expense Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <InfoCard
                    icon={<FaFileAlt />}
                    label="Expense Code"
                    value={expense.expense_code || "N/A"}
                />
                <InfoCard
                    icon={<FaFileAlt />}
                    label="Expense Name"
                    value={expense.expense_name || "N/A"}
                />
            </div>

            {/* Creator Info */}
            <div className="mb-6">
                <InfoCard
                    icon={<FaUser />}
                    label="Created By"
                    value={`${expense.creator?.emp_name || "N/A"} (${expense.creator?.emp_id || "N/A"})`}
                    fullWidth
                />
            </div>

            {/* Notes Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 mb-6">
                <h2 className="text-lg font-semibold mb-2">Notes</h2>
                <p className="text-gray-800 dark:text-gray-200">
                    {expense.notes || "No notes available"}
                </p>
            </div>
        </div>
    );
};

// InfoCard component
const InfoCard = ({
    icon,
    label,
    value,
    fullWidth = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
}) => (
    <div
        className={`flex items-center gap-3 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 p-4 rounded-lg ${fullWidth ? "col-span-3" : ""
            }`}
    >
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white">
                {value}
            </p>
        </div>
    </div>
);

export default ExpenseDetails;