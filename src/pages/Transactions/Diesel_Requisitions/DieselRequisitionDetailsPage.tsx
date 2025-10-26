import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DieselRequisition } from "../../../types/dieselRequisition";
import { FaCalendarAlt, FaUser, FaBuilding, FaSearch, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const DieselRequisitionDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const requisition: DieselRequisition | null = state?.requisition;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!requisition) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <button
          onClick={() => navigate("/diesel-requisition/view")}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← Back to Diesel Requisitions
        </button>
        <div className="p-6 text-red-600 dark:text-red-400">
          <p className="mb-4">Requisition not found.</p>
        </div>
      </div>
    );
  }

  const filteredItems = requisition.items?.filter((item: any) =>
    item.consumableItem?.item_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <button
        onClick={() => navigate("/diesel-requisition/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Diesel Requisitions
      </button>

      <h1 className="text-2xl font-bold mb-6">Diesel Requisition Details</h1>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<FaCalendarAlt />}
          label="Date"
          value={new Date(requisition.date).toLocaleDateString()}
        />
        <InfoCard
          icon={<FaUser />}
          label="Created By"
          value={requisition.createdByEmployee?.emp_name || "N/A"}
        />
        <InfoCard
          icon={<FaBuilding />}
          label="Organisation"
          value={requisition.organisation?.org_name || "N/A"}
        />
      </div>

      {/* Approval Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={getApprovalStatusIcon(requisition.is_approve_mic)}
          label="Mechanic Incharge"
          value={
            <span className={
              requisition.is_approve_mic === "approved"
                ? "text-green-600"
                : requisition.is_approve_mic === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }>
              {requisition.is_approve_mic || "Pending"}
            </span>
          }
        />
        <InfoCard
          icon={getApprovalStatusIcon(requisition.is_approve_sic)}
          label="Site Incharge"
          value={
            <span className={
              requisition.is_approve_sic === "approved"
                ? "text-green-600"
                : requisition.is_approve_sic === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }>
              {requisition.is_approve_sic || "Pending"}
            </span>
          }
        />
        <InfoCard
          icon={getApprovalStatusIcon(requisition.is_approve_pm)}
          label="Project Manager"
          value={
            <span className={
              requisition.is_approve_pm === "approved"
                ? "text-green-600"
                : requisition.is_approve_pm === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }>
              {requisition.is_approve_pm || "Pending"}
            </span>
          }
        />
      </div>

      {/* Items Table */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Requisitioned Items ({requisition.items?.length || 0})</h2>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by item name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 border rounded-md dark:bg-gray-900 dark:border-gray-700 text-sm"
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Showing {paginatedItems.length} of {filteredItems.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">UOM</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
              {paginatedItems.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-3 py-2">
                    {item.consumableItem?.item_name || "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    {item.consumableItem?.item_description || "N/A"}
                  </td>
                  <td className="px-3 py-2">{item.quantity}</td>
                  <td className="px-3 py-2">
                    {item.unitOfMeasurement?.unit_name || "N/A"}
                  </td>
                  <td className="px-3 py-2">{item.Notes || "N/A"}</td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center px-3 py-4">
                    {filteredItems.length === 0
                      ? "No items found matching your search."
                      : "No items to display."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-sm rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-sm rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
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
  value: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 p-4 rounded-lg ${
      fullWidth ? "col-span-3" : ""
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

export default DieselRequisitionDetailsPage;