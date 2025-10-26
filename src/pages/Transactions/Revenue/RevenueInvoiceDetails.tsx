import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaFileInvoice, FaBuilding, FaUser, FaMoneyBillWave, FaHashtag } from "react-icons/fa";

import { toast } from "react-toastify";
import { getRevenueInvoiceById } from "../../../apis/revenueInputApi";

const RevenueInvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getRevenueInvoiceById(id);
          setRevenue(data);
        }
      } catch (error) {
        toast.error("Failed to fetch revenue details");
        console.error("Error fetching revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex justify-center items-center py-20">
          <span className="text-blue-600 font-semibold text-lg">Loading revenue details...</span>
        </div>
      </div>
    );
  }

  if (!revenue) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <button
          onClick={() => navigate("/revenueInvoice/view")}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← Back to Revenue
        </button>
        <div className="p-6 text-red-600 dark:text-red-400">
          <p className="mb-4">Revenue not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <button
        onClick={() => navigate("/revenueInvoice/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Revenue
      </button>

      <h1 className="text-2xl font-bold mb-6">Revenue Details</h1>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<FaCalendarAlt />}
          label="Date"
          value={new Date(revenue.date).toLocaleDateString()}
        />
        <InfoCard
          icon={<FaFileInvoice />}
          label="HO Invoice"
          value={revenue.ho_invoice || "N/A"}
        />
        <InfoCard
          icon={<FaBuilding />}
          label="Project No"
          value={revenue.project?.project_no || "N/A"}
        />
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <InfoCard
          icon={<FaHashtag />}
          label="Account Code"
          value={revenue.account_code || "N/A"}
        />
        <InfoCard
          icon={<FaUser />}
          label="Account Name"
          value={revenue.account_name || "N/A"}
        />
      </div>

      {/* Amount Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<FaMoneyBillWave />}
          label="Basic Amount"
          value={`₹${revenue.amount_basic || "0"}`}
        />
        <InfoCard
          icon={<FaMoneyBillWave />}
          label="Tax Value"
          value={`₹${revenue.tax_value || "0"}`}
        />
        <InfoCard
          icon={<FaMoneyBillWave />}
          label="Total Amount"
          value={`₹${revenue.total_amount || "0"}`}
        />
      </div>

      {/* Creator Info */}
      <div className="mb-6">
        <InfoCard
          icon={<FaUser />}
          label="Created By"
          value={`${revenue.creator?.emp_name || "N/A"} (${revenue.creator?.emp_id || "N/A"})`}
          fullWidth
        />
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

export default RevenueInvoiceDetails;