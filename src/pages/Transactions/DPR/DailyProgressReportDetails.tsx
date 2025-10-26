import { useLocation, useNavigate } from "react-router-dom";

const DailyProgressReportDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dpr = state?.dprLog;

  if (!dpr) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        <p className="mb-4">
          No DPR data available. Please go back to the list.
        </p>
        <button
          onClick={() => navigate("/dpr/view")}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Daily Progress Reports
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/dpr/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Daily Progress Reports
      </button>

      <h1 className="text-3xl font-bold mb-6">Daily Progress Report Details</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Date:</span> {dpr.date}
            </p>
            <p>
              <span className="font-semibold">DPR No:</span> {dpr.dpr_no}
            </p>
            <p>
              <span className="font-semibold">Project No:</span>{" "}
              {dpr.project?.project_no || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Contract Period:</span>{" "}
              {dpr.project?.contract_start_date
                ? new Date(dpr.project.contract_start_date).toLocaleDateString()
                : "N/A"}{" "}
              -{" "}
              {dpr.project?.contract_end_date
                ? new Date(dpr.project.contract_end_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Shift Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Shift Code:</span>{" "}
              {dpr.shift?.shift_code || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Shift Time:</span>{" "}
              {dpr.shift?.shift_from_time} - {dpr.shift?.shift_to_time}
            </p>
            <p>
              <span className="font-semibold">Shift Incharge:</span>{" "}
              {dpr.incharge?.emp_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Mechanic:</span>{" "}
              {dpr.mechanic?.emp_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Customer Representative:</span>{" "}
              {dpr.customer_representative || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Approval Status</h2>
        <div className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p>
            <span className="font-semibold">Project Manager Approval:</span>{" "}
            <span
              className={
                dpr.is_approve_pm === "approved"
                  ? "text-green-600"
                  : dpr.is_approve_pm === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {dpr.is_approve_pm === "approved"
                ? "Approved"
                : dpr.is_approve_pm === "rejected"
                ? "Rejected"
                : "Pending"}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Work Details</h2>
      {dpr.forms && dpr.forms.length > 0 ? (
        <div className="grid gap-4">
          {dpr.forms.map((form: any, index: number) => (
            <div
              key={index}
              className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <p>
                  <span className="font-semibold">Time From:</span>{" "}
                  {form.time_from}
                </p>
                <p>
                  <span className="font-semibold">Time To:</span> {form.time_to}
                </p>
                <p>
                  <span className="font-semibold">Total Time:</span>{" "}
                  {form.time_total}
                </p>
                <p className="md:col-span-3">
                  <span className="font-semibold">Job Done:</span>{" "}
                  {form.job_done}
                </p>
                <p>
                  <span className="font-semibold">Revenue Code:</span>{" "}
                  {form.revenue?.revenue_code || "N/A"}
                </p>
                <p className="md:col-span-2">
                  <span className="font-semibold">Revenue Description:</span>{" "}
                  {form.revenue?.revenue_description || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          No work details available for this DPR.
        </p>
      )}
    </div>
  );
};

export default DailyProgressReportDetails;
