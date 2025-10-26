import React, { useState, useEffect } from "react";
import { MultiSelect } from "../../components/projects/MultiSelect";
import { fetchRevenues } from "../../apis/revenueApi";
import { fetchEquipments } from "../../apis/equipmentApi";
import { fetchCustomers } from "../../apis/customerApi";
// import { fetchEmployees } from "../../apis/employeeApi";
import { fetchStores } from "../../apis/storeApi";
import { Customer } from "../../types/customerTypes";
import Select from "react-select";

type ProjectFormProps = {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditMode?: boolean;
};

type Option = {
  value: string;
  text: string;
};

type FormData = {
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStartDate: string;
  contractEndDate: string; // ✅ Added
  // contractTenure: string;
  revenueMaster: string[];
  // equipments: string[];
  staff: string[];
  storeLocations: string[];
};

export const ProjectCreateForm: React.FC<ProjectFormProps> = ({
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    projectNo: "",
    customer: "",
    orderNo: "",
    contractStartDate: "",
    contractEndDate: "", // ✅ Added
    // contractTenure: "",
    revenueMaster: [],
    // equipments: [],
    staff: [],
    storeLocations: [],
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [revenueOptions, setRevenueOptions] = useState<Option[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  // const [employeeOptions, setEmployeeOptions] = useState<Option[]>([]);
  const [storeOptions, setStoreOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const customerOptions = customers.map((cust) => ({
    value: cust.id,
    label: cust.partner_name,
  }));

  // Initialize form data when initialData changes

  console.log({ initialData });
  useEffect(() => {
    if (initialData) {
      setFormData({
        projectNo: initialData.project_no || "",
        customer: initialData.customer?.id || "",
        orderNo: initialData.order_no || "",
        contractStartDate: initialData.contract_start_date
          ? new Date(initialData.contract_start_date)
              .toISOString()
              .split("T")[0]
          : "",
        contractEndDate: initialData.contract_end_date // ✅ Added
          ? new Date(initialData.contract_end_date).toISOString().split("T")[0]
          : "",
        // contractTenure: initialData.contract_tenure || "",
        revenueMaster: initialData.revenues?.map((r: any) => r.id) || [],
        // equipments: initialData.equipments?.map((e: any) => e.id) || [],
        staff: initialData.staff?.map((s: any) => s.id) || [],
        storeLocations:
          initialData.store_locations?.map((s: any) => s.id) || [],
      });
    }
  }, [initialData]);

  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [customersData, storeData, revenues, equipments] =
          await Promise.all([
            fetchCustomers(),
            // fetchEmployees(),
            fetchStores(),
            fetchRevenues(),
            fetchEquipments(),
          ]);

        setCustomers(customersData);
        // setEmployeeOptions(
        //   employeesData.map((emp: any) => ({
        //     value: emp.id,
        //     text: emp.emp_name || "Unnamed Employee",
        //   }))
        // );
        setStoreOptions(
          storeData.map((store: any) => ({
            value: store.id,
            text: store.store_name || "Unnamed Store",
          }))
        );
        setRevenueOptions(
          revenues.map((rev: any) => ({
            value: rev.id,
            text: `${rev.revenue_code}`,
          }))
        );
        console.log({ equipments });
        setEquipmentOptions(
          equipments.map((eq: any) => ({
            value: eq.id,
            text: eq.equipment_name || "Unnamed Equipment",
          }))
        );
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log({ equipmentOptions });
  console.log({ revenueOptions });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: keyof FormData, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (formData.staff.length < 6) {
    //   alert("Please select at least 6 staff members.");
    //   return;
    // }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        projectNo: "",
        customer: "",
        orderNo: "",
        contractStartDate: "",
        contractEndDate: "", // ✅ Added
        // contractTenure: "",
        revenueMaster: [],
        // equipments: [],
        staff: [],
        storeLocations: [],
      });
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      customer: selectedOption?.value || "",
    }));
  };

  // const tenureOptions = ["3 months", "6 months", "12 months"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project No<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            name="projectNo"
            value={formData.projectNo}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="PRJ-001"
            required
            disabled={isEditMode}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Order No
          </label>
          <input
            type="text"
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Order Number"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer
          </label>
          <Select
            options={customerOptions}
            value={customerOptions.find(
              (opt) => opt.value === formData.customer
            )}
            onChange={handleCustomerChange}
            isClearable
            placeholder="Select Customer"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract Start Date
          </label>
          <input
            type="date"
            name="contractStartDate"
            value={formData.contractStartDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract End Date
          </label>
          <input
            type="date"
            name="contractEndDate"
            value={formData.contractEndDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract Tenure
          </label>
          <select
            name="contractTenure"
            value={formData.contractTenure}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            <option value="">Select Tenure</option>
            {tenureOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Revenues
        </label>
        <MultiSelect
          label="Revenues"
          options={revenueOptions}
          defaultSelected={formData.revenueMaster}
          onChange={(values) =>
            handleMultiSelectChange("revenueMaster", values)
          }
        />
      </div>

      {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Equipments
        </label>
        <MultiSelect
          label="Equipments"
          options={equipmentOptions}
          defaultSelected={formData.equipments}
          onChange={(values) => handleMultiSelectChange("equipments", values)}
        />
      </div> */}

      {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Staff <span className="text-xs text-gray-500">(Select at least 6)</span>
        </label>
        <MultiSelect
          label="Staff"
          options={employeeOptions}
          defaultSelected={formData.staff}
          onChange={(values) => handleMultiSelectChange("staff", values)}
          className="mb-4"
        />
      </div> */}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Store Locations
        </label>
        <MultiSelect
          label="Store Locations"
          options={storeOptions}
          defaultSelected={formData.storeLocations}
          onChange={(values) =>
            handleMultiSelectChange("storeLocations", values)
          }
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {isEditMode ? "Updating..." : "Creating..."}
            </span>
          ) : isEditMode ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </form>
  );
};
