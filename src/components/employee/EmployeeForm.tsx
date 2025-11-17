import React, { useEffect, useState } from "react";
import { fetchRoles } from "../../apis/roleApi";
import { fetchShifts } from "../../apis/shiftApi";
import { getAllOrganisations } from "../../apis/organisationApi";
import { State, City } from "country-state-city";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Option = { id: string; name: string; shift_code?: string };

type ValidationField = "age" | "pincode" | "acc_holder_name" | "acc_no" | "ifsc_code";

type EmployeeFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
};

const APP_ACCESS_ROLES = [
  { text: "Mechanic", value: "mechanic" },
  { text: "Mechanic Incharge", value: "mechanicIncharge" },
  { text: "Site Incharge", value: "siteIncharge" },
  { text: "Store Manager", value: "storeManager" },
  { text: "Account Manager", value: "accountManager" },
  { text: "Project Manager", value: "projectManager" },
  { text: "admin", value: "admin" },
];

export const EmployeeForm = ({
  initialData,
  onSubmit,
  loading = false,
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    blood_group: "",
    age: "",
    adress: "",
    position: "",
    is_active: true,
    shiftcode: "",
    role_id: "",
    org_id: "",
    app_access_role: "",
    state: "",
    city: "",
    pincode: "",
    acc_holder_name: "",
    bank_name: "",
    acc_no: "",
    ifsc_code: "",
    dob: null as Date | null,
    aadhar_number: ""
  });

  const bloodGroupOptions = [
    { value: "A+", text: "A+" },
    { value: "A-", text: "A-" },
    { value: "B+", text: "B+" },
    { value: "B-", text: "B-" },
    { value: "AB+", text: "AB+" },
    { value: "AB-", text: "AB-" },
    { value: "O+", text: "O+" },
    { value: "O-", text: "O-" },
  ];

  const [roles, setRoles] = useState<Option[]>([]);
  const [shifts, setShifts] = useState<Option[]>([]);
  const [organisations, setOrganisations] = useState<Option[]>([]);
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, shiftsData, orgsData] = await Promise.all([
          fetchRoles(),
          fetchShifts(),
          getAllOrganisations(),
        ]);

        setRoles(rolesData.map((r) => ({ id: r.id, name: r.name })));
        setShifts(
          shiftsData.map((s) => ({
            id: s.id,
            name: s.shift_code,
            shift_code: s.shift_code,
          }))
        );
        setOrganisations(orgsData.map((o) => ({ id: o.id, name: o.org_name })));

        if (initialData) {
          const formattedData = {
            ...initialData,
            dob: initialData.dob ? new Date(initialData.dob) : null
          };
          setFormData(formattedData);

          const stateMatch = states.find((s) => s.name === initialData.state);
          if (stateMatch) {
            const cityData = City.getCitiesOfState("IN", stateMatch.isoCode);
            setCities(cityData);
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    fetchData();
  }, [initialData]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === selectedStateCode);

    setFormData((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      city: "",
    }));

    setCities(City.getCitiesOfState("IN", selectedStateCode));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(formData.age) < 0 || parseInt(formData.age) > 100) {
      alert("Age must be between 0 and 100");
      return;
    }

    if (formData.aadhar_number && formData.aadhar_number.length !== 12) {
      alert("Aadhar number must be exactly 12 digits");
      return;
    }

    // Prepare the data to submit
    const submitData = {
      ...formData,
      shiftcode: formData.shiftcode || "", // Ensure empty string if not selected
    };

    onSubmit(submitData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    switch (name) {
      case "pincode":
        // Only allow numeric input and limit to 6 characters
        if (/^\d{0,6}$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        return;

      case "acc_holder_name":
        // Only allow letters and spaces
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        return;

      case "acc_no":
        // Only allow numeric input
        if (/^\d*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        return;

      case "ifsc_code":
        // Allow only alphanumeric, first 4 must be letters, convert to uppercase
        if (/^[A-Za-z]{0,4}[A-Za-z0-9]{0,7}$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
        }
        return;

      case "age":
        // Allow typing but validate on blur
        if (value === "" || /^\d*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
        return;

      default:
        // Default handling for all other fields
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
    }
  };

  const inputField = (
    label: string,
    name: string,
    type: string = "text",
    required: boolean = true,
    className: string = "w-full",
    min?: number,
    max?: number,
    placeholder?: string
  ) => {
    // Validation rules
    const validations: Record<ValidationField, { isValid: boolean; message: string }> = {
      age: {
        isValid: !formData.age || (parseInt(formData.age) >= 18 && parseInt(formData.age) <= 65),
        message: "Age must be between 18 and 65"
      },
      pincode: {
        isValid: !formData.pincode || /^\d{6}$/.test(formData.pincode),
        message: "Pincode must be exactly 6 digits"
      },
      acc_holder_name: {
        isValid: !formData.acc_holder_name || /^[A-Za-z\s]+$/.test(formData.acc_holder_name),
        message: "Only letters allowed"
      },
      acc_no: {
        isValid: !formData.acc_no || /^\d+$/.test(formData.acc_no),
        message: "Only numbers allowed"
      },
      ifsc_code: {
        isValid: !formData.ifsc_code || /^[A-Z]{4}[A-Z0-9]{7}$/.test(formData.ifsc_code),
        message: "Format: 4 letters + 7 alphanumeric (e.g., UBIN0906964)"
      }
    };

    const isValidationField = (name: string): name is ValidationField => {
      return name in validations;
    };

    const isInvalid = isValidationField(name) ? !validations[name].isValid : false;
    const validationMessage = isValidationField(name) ? validations[name].message : "";

    // Default placeholders based on field name
    const defaultPlaceholders: Record<string, string> = {
      emp_id: "Enter employee ID",
      emp_name: "Enter employee name",
      age: "Enter age (18-65)",
      pincode: "Enter 6-digit pincode",
      acc_holder_name: "Enter account holder name",
      bank_name: "Enter bank name",
      acc_no: "Enter account number",
      ifsc_code: "Enter IFSC code (e.g., SBIN0000123)",
      aadhar_number: "Enter 12-digit Aadhar number",
      adress: "Enter complete address",
      position: "Enter job position"
    };

    const fieldPlaceholder = placeholder || defaultPlaceholders[name] || `Enter ${label.toLowerCase()}`;

    return (
      <div className={`${className} px-3 mb-4`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={(formData as any)[name] || ""}
          onChange={handleChange}
          onBlur={(e) => {
            if (name === "ifsc_code" && e.target.value.length !== 11 && e.target.value !== "") {
              setFormData(prev => ({ ...prev, ifsc_code: "" }));
            }
            if (name === "acc_holder_name") {
              setFormData(prev => ({ ...prev, acc_holder_name: e.target.value.toUpperCase() }));
            }
            if (name === "age") {
              const ageValue = parseInt(e.target.value);
              if (isNaN(ageValue)) {
                setFormData(prev => ({ ...prev, age: "" }));
              } else if (ageValue < 18) {
                setFormData(prev => ({ ...prev, age: "18" }));
              } else if (ageValue > 65) {
                setFormData(prev => ({ ...prev, age: "65" }));
              }
            }
          }}
          required={required}
          min={min}
          max={max}
          maxLength={name === "ifsc_code" ? 11 : undefined}
          placeholder={fieldPlaceholder}
          pattern={
            name === "pincode" ? "\\d{6}" :
              name === "ifsc_code" ? "[A-Z]{4}[A-Z0-9]{7}" :
                undefined
          }
          inputMode={
            name === "pincode" || name === "acc_no" ? "numeric" :
              undefined
          }
          className={`w-full px-3 py-2 border ${isInvalid ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        />
        {isValidationField(name) && (
          <p className={`text-xs mt-1 ${isInvalid ? "text-red-500" : "text-gray-500"}`}>
            {validationMessage}
          </p>
        )}
      </div>
    );
  };

  const selectField = (
    label: string,
    name: string,
    options: Option[] | { value: string; text: string }[],
    required: boolean = true,
    className: string = "w-full"
  ) => {
    const isShift = name === "shiftcode";
    const isOptional = name === "shiftcode" && !required;

    return (
      <div className={`${className} px-3 mb-4`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={name}
          value={(formData as any)[name] || ""}
          onChange={handleChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select {label}</option>
          {options.map((option: any) => (
            <option
              key={
                isShift
                  ? option.shift_code || option.id
                  : option.id || option.value
              }
              value={
                isShift
                  ? option.shift_code || option.id
                  : option.id || option.value
              }
            >
              {isShift
                ? option.shift_code || option.name
                : option.name || option.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-wrap -mx-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white px-3 mb-6 w-full">
          Employee Information
        </h2>

        {inputField(
          "Employee ID",
          "emp_id",
          "text",
          true,
          "w-full sm:w-1/2 lg:w-1/3",
          undefined,
          undefined,
          "EMP001"
        )}
        {inputField(
          "Name",
          "emp_name",
          "text",
          true,
          "w-full sm:w-1/2 lg:w-1/3",
          undefined,
          undefined,
          "John Doe"
        )}

        {inputField(
          "Age", 
          "age", 
          "number", 
          true, 
          "w-full sm:w-1/2 lg:w-1/3", 
          18, 
          65,
          "25"
        )}

        {selectField(
          "Shift Code",
          "shiftcode",
          shifts,
          false,
          "w-full sm:w-1/2 lg:w-1/3"
        )}
        {selectField(
          "Role",
          "role_id",
          roles,
          true,
          "w-full sm:w-1/2 lg:w-1/3"
        )}
        {selectField(
          "App Access Role",
          "app_access_role",
          APP_ACCESS_ROLES,
          true,
          "w-full sm:w-1/2 lg:w-1/3"
        )}
        {selectField(
          "Organisation",
          "org_id",
          organisations,
          true,
          "w-full sm:w-1/2 lg:w-1/3"
        )}

        {selectField("Blood Group", "blood_group", bloodGroupOptions, true)}

        {/* Location Section */}
        <div className="w-full px-3 mb-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Location Details
          </h3>
          <div className="flex flex-wrap -mx-3">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  states.find((s) => s.name === formData.state)?.isoCode || ""
                }
                onChange={handleStateChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={handleCityChange}
                required
                disabled={!formData.state}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {inputField(
              "Pincode",
              "pincode",
              "text",
              true,
              "w-full sm:w-1/2 lg:w-1/3",
              undefined,
              undefined,
              "560001"
            )}

            <div className="w-full px-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="adress"
                value={formData.adress}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter complete address with street, area, and landmark"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="w-full px-3 mb-6">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Bank Details
          </h3>
          <div className="flex flex-wrap -mx-3">
            {inputField(
              "Account Holder Name",
              "acc_holder_name",
              "text",
              true,
              "w-full sm:w-1/2 lg:w-1/3",
              undefined,
              undefined,
              "JOHN DOE"
            )}
            {inputField(
              "Bank Name",
              "bank_name",
              "text",
              true,
              "w-full sm:w-1/2 lg:w-1/3",
              undefined,
              undefined,
              "State Bank of India"
            )}
            {inputField(
              "Account Number",
              "acc_no",
              "text",
              true,
              "w-full sm:w-1/2 lg:w-1/3",
              undefined,
              undefined,
              "12345678901"
            )}
            {inputField(
              "IFSC Code",
              "ifsc_code",
              "text",
              true,
              "w-full sm:w-1/2 lg:w-1/3",
              undefined,
              undefined,
              "SBIN0000123"
            )}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="w-full px-3 mb-6">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Personal Information
          </h3>
          <div className="flex flex-wrap -mx-3">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,12}$/.test(value)) {
                    setFormData((prev) => ({ ...prev, aadhar_number: value }));
                  }
                }}
                inputMode="numeric"
                pattern="\d{12}"
                maxLength={12}
                required
                placeholder="123456789012"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {formData.aadhar_number && formData.aadhar_number.length !== 12 && (
                <p className="text-red-500 text-xs mt-1">Aadhar number must be exactly 12 digits.</p>
              )}
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.dob}
                onChange={(date: Date | null) =>
                  setFormData((prev) => ({ ...prev, dob: date }))
                }
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date of birth"
                maxDate={new Date()}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Active Status */}
        <div className="w-full px-3 mb-6 flex items-center">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Active Employee
          </label>
        </div>
      </div>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {loading ? (
            <>
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
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};