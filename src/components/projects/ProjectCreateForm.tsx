import React, { useState, useEffect } from "react";
import { MultiSelect } from "../../components/projects/MultiSelect";
import { fetchRevenues } from "../../apis/revenueApi";
import { fetchCustomers } from "../../apis/customerApi";
import { fetchStores } from "../../apis/storeApi";
import { Customer } from "../../types/customerTypes";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

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
  contractStartDate: Date | null;
  contractEndDate: Date | null;
  revenueMaster: string[];
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
    contractStartDate: null,
    contractEndDate: null,
    revenueMaster: [],
    staff: [],
    storeLocations: [],
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [revenueOptions, setRevenueOptions] = useState<Option[]>([]);
  const [storeOptions, setStoreOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const customerOptions = customers.map((cust) => ({
    value: cust.id,
    label: cust.partner_name,
  }));

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        projectNo: initialData.project_no || "",
        customer: initialData.customer?.id || "",
        orderNo: initialData.order_no || "",
        contractStartDate: initialData.contract_start_date
          ? new Date(initialData.contract_start_date)
          : null,
        contractEndDate: initialData.contract_end_date
          ? new Date(initialData.contract_end_date)
          : null,
        revenueMaster: initialData.revenues?.map((r: any) => r.id) || [],
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
        const [customersData, storeData, revenues] =
          await Promise.all([
            fetchCustomers(),
            fetchStores(),
            fetchRevenues(),
            // Removed fetchEquipments since it's not used
          ]);

        setCustomers(customersData);
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
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDateChange = (date: Date | null, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date
    }));
    
    // Clear error when user selects a date
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }

    // Validate end date if start date is changed and end date exists
    if (field === "contractStartDate" && formData.contractEndDate && date && date > formData.contractEndDate) {
      setErrors(prev => ({
        ...prev,
        contractEndDate: "End date cannot be before start date"
      }));
    }
  };

  const handleMultiSelectChange = (name: keyof FormData, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.projectNo.trim()) {
      newErrors.projectNo = "Project number is required";
    }
    if (!formData.contractStartDate) {
      newErrors.contractStartDate = "Contract start date is required";
    }
    if (formData.contractStartDate && formData.contractEndDate && 
        formData.contractStartDate > formData.contractEndDate) {
      newErrors.contractEndDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Format dates for API
      const submitData = {
        ...formData,
        contractStartDate: formData.contractStartDate ? formData.contractStartDate.toISOString() : null,
        contractEndDate: formData.contractEndDate ? formData.contractEndDate.toISOString() : null,
      };

      await onSubmit(submitData);
      setFormData({
        projectNo: "",
        customer: "",
        orderNo: "",
        contractStartDate: null,
        contractEndDate: null,
        revenueMaster: [],
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

  // Custom Input component with calendar icon
  const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }: any, ref: any) => (
    <div className="relative">
      <input
        type="text"
        className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        ref={ref}
        readOnly
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  ));

  CustomDateInput.displayName = 'CustomDateInput';

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
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.projectNo 
                ? "border-red-500 dark:border-red-400" 
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="PRJ-001"
            required
            disabled={isEditMode}
          />
          {errors.projectNo && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.projectNo}</p>
          )}
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
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: 'rgb(55 65 81)',
                borderColor: 'rgb(75 85 99)',
                color: 'white'
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: 'rgb(55 65 81)',
                color: 'white'
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? 'rgb(75 85 99)' : 'rgb(55 65 81)',
                color: 'white'
              }),
              singleValue: (base) => ({
                ...base,
                color: 'white'
              }),
              input: (base) => ({
                ...base,
                color: 'white'
              })
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract Start Date<span className="text-red-500"> *</span>
          </label>
          <DatePicker
            selected={formData.contractStartDate}
            onChange={(date) => handleDateChange(date, "contractStartDate")}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.contractStartDate 
                ? "border-red-500 dark:border-red-400" 
                : "border-gray-300 dark:border-gray-600"
            }`}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select start date"
            isClearable
            showYearDropdown
            scrollableYearDropdown
            required
            customInput={<CustomDateInput placeholder="Select start date" />}
          />
          {errors.contractStartDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contractStartDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract End Date
          </label>
          <DatePicker
            selected={formData.contractEndDate}
            onChange={(date) => handleDateChange(date, "contractEndDate")}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.contractEndDate 
                ? "border-red-500 dark:border-red-400" 
                : "border-gray-300 dark:border-gray-600"
            }`}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
            isClearable
            showYearDropdown
            scrollableYearDropdown
            minDate={formData.contractStartDate || undefined}
            customInput={<CustomDateInput placeholder="Select end date" />}
          />
          {errors.contractEndDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contractEndDate}</p>
          )}
        </div>
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
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
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