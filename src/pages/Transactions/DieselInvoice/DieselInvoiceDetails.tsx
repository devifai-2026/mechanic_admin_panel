import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaBuilding, 
  FaFileInvoice,
  FaMoneyBillWave,
  FaInfoCircle
} from "react-icons/fa";

import { toast } from "react-toastify";
import { getDieselInvoiceById } from "../../../apis/dieselInvoiceApi";

const DieselInvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getDieselInvoiceById(id);
          setInvoice(data);
        }
      } catch (error) {
        toast.error("Failed to fetch invoice details");
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex justify-center items-center py-20">
          <span className="text-blue-600 font-semibold text-lg">Loading invoice details...</span>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
        <button
          onClick={() => navigate("/diesel-invoice/view")}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← Back to Diesel Invoices
        </button>
        <div className="p-6 text-red-600 dark:text-red-400">
          <p className="mb-4">Invoice not found.</p>
        </div>
      </div>
    );
  }

  const filteredItems = invoice.formItems.filter((item: any) =>
    item.consumableItem?.item_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const totalValue = invoice.formItems?.reduce((sum: number, item: any) => sum + (item.total_value || 0), 0) || 0;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <button
        onClick={() => navigate("/diesel-invoice/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Diesel Invoices
      </button>

      <h1 className="text-2xl font-bold mb-6">Diesel Invoice Details</h1>

      {/* Basic Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <InfoCard
          icon={<FaCalendarAlt />}
          label="Date"
          value={new Date(invoice.date).toLocaleDateString()}
        />
        <InfoCard
          icon={<FaBuilding />}
          label="Project No"
          value={invoice.project?.project_no || "N/A"}
        />
        <InfoCard
          icon={<FaFileInvoice />}
          label="Invoice Status"
          value={
            <span className={`px-2 py-1 rounded-full text-xs ${
              invoice.is_invoiced === "invoiced" 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {invoice.is_invoiced || "Draft"}
            </span>
          }
        />
      </div>

      {/* Total Value Card */}
      <div className="mb-6">
        <InfoCard
          icon={<FaMoneyBillWave />}
          label="Total Invoice Value"
          value={`₹${totalValue}`}
          fullWidth
        />
      </div>

      {/* Items Table */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Invoice Items ({invoice.formItems?.length || 0})</h2>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-gray-500" />
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
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit Rate</th>
                <th className="px-3 py-2">Total Value</th>
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
                    {item.consumableItem?.item_code || "N/A"}
                  </td>
                  <td className="px-3 py-2">{item.qty}</td>
                  <td className="px-3 py-2">₹{item.unit_rate}</td>
                  <td className="px-3 py-2">₹{item.total_value}</td>
                  <td className="px-3 py-2">
                    {item.unitOfMeasure?.unit_name || "N/A"} ({item.unitOfMeasure?.unit_code || "N/A"})
                  </td>
                  <td className="px-3 py-2">{item.notes || "N/A"}</td>
                </tr>
              ))}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center px-3 py-4">
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
      <div className="text-base font-semibold text-gray-800 dark:text-white">
        {value}
      </div>
    </div>
  </div>
);

export default DieselInvoiceDetails;