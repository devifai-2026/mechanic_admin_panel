import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import {
  createEquipment,
  updateEquipment,
  fetchEquipmentById,
} from "../../apis/equipmentApi";
import { toast, ToastContainer } from "react-toastify";
import {
  FaCogs,
  FaDollarSign,
  FaTag,
  FaCalendarAlt,
  FaUpload,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";
import { GoNumber } from "react-icons/go";
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import EquipmentBulkUpload from "./EquipmentBulkUpload";
import { fetchProjects } from "../../apis/projectsApi";
import { getAllOEMs } from "../../apis/oemApi";

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "maco_corporationnew");
  formData.append("folder", "equipment_docs");

  const cloudName = "dfjpc4teh";

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    formData
  );
  return response.data.secure_url;
};

// Helper function to check if log field contains invalid data
const isInvalidLogField = (logField: any): boolean => {
  if (!logField || typeof logField !== 'string') return true;
  
  const trimmedField = logField.trim();
  if (trimmedField === '') return true;
  
  // Check for patterns of escaped backslashes or quotes
  const invalidPatterns = [
    /^"+$/, // Only quotes
    /^\\+$/, // Only backslashes
    /^["\\\s]*$/, // Only quotes, backslashes, or whitespace
    /^\"\\\"\\\\\\\"/, // Starts with escaped backslash patterns
    /^\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/, // Multiple backslashes
  ];
  
  const hasInvalidPattern = invalidPatterns.some(pattern => pattern.test(trimmedField));
  const isPdfUrl = trimmedField.includes('.pdf') && trimmedField.startsWith('http');
  
  return hasInvalidPattern || !isPdfUrl;
};

// Reusable FilterableMultiSelect Component
interface FilterableMultiSelectProps {
  label: string;
  options: { value: string; text: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const FilterableMultiSelect: React.FC<FilterableMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter available options (exclude already selected)
  const availableOptions = options.filter(
    (opt) => !selectedValues.includes(opt.value)
  );

  const filteredOptions = availableOptions.filter((opt) =>
    opt.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onChange([...selectedValues, value]);
    setSearchTerm("");
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected option labels
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => ({ value: opt.value, text: opt.text }));

  return (
    <div className="relative" ref={containerRef}>
      <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
        {label}
      </label>

      {/* Selected Items Display */}
      <div
        className="w-full min-h-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 flex flex-wrap gap-2 items-start cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((item) => (
            <div
              key={item.value}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {item.text}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.value);
                }}
                className="hover:bg-blue-600 rounded-full p-0.5"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedLabels.length === 0 ? placeholder : "Search..."}
          className="flex-1 min-w-32 outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-800 dark:text-white transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                {option.text}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
              No available options
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function EquipmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");
  const [equipmentGroups, setEquipmentGroups] = useState<
    { value: string; text: string }[]
  >([]);
  const [oemArr, setOem] = useState<{ value: string; label: string }[]>([]);
  const [projectTags, setProjectTags] = useState<
    { value: string; text: string }[]
  >([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    equipmentName: "",
    serialNo: "",
    additionalId: "",
    purchaseDate: "",
    oem: "",
    purchaseCost: 0,
    equipmentManual: "",
    maintenanceLog: "",
    otherLog: "",
    hsn_number: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipmentGroups()
      .then((groups) => {
        setEquipmentGroups(
          groups.map((g) => ({
            value: g.id,
            text: g.equipment_group,
          }))
        );
      })
      .catch(() => toast.error("Failed to load equipment groups"));

    fetchProjects()
      .then((projects: any[]) => {
        setProjectTags(
          projects.map((proj) => ({
            value: proj.id,
            text: proj.project_no,
          }))
        );
      })
      .catch(() => toast.error("Failed to load projects"));

    getAllOEMs()
      .then((oems: any[]) => {
        setOem(
          oems.map((oem) => ({
            value: oem.id,
            label: `${oem.oem_code} - ${oem.oem_name}`,
          }))
        );
      })
      .catch(() => toast.error("Failed to load OEMs"));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchEquipmentById(id)
        .then((data: any) => {
          console.log("Loaded equipment data:", data);
          const purchaseDate = data.purchase_date
            ? new Date(data.purchase_date).toISOString().split("T")[0]
            : "";

          // Clean log fields - set to empty string if invalid
          const equipmentManual = isInvalidLogField(data.equipment_manual) ? "" : data.equipment_manual;
          const maintenanceLog = isInvalidLogField(data.maintenance_log) ? "" : data.maintenance_log;
          const otherLog = isInvalidLogField(data.other_log) ? "" : data.other_log;

          console.log("Cleaned log fields:", {
            equipmentManual,
            maintenanceLog,
            otherLog
          });

          setFormData({
            equipmentName: data.equipment_name || "",
            serialNo: data.equipment_sr_no || "",
            additionalId: data.additional_id || "",
            purchaseDate: purchaseDate,
            oem: data.oem || "",
            purchaseCost: data.purchase_cost || 0,
            equipmentManual: equipmentManual,
            maintenanceLog: maintenanceLog,
            otherLog: otherLog,
            hsn_number: data.hsn_number || 0,
          });

          // Handle project tags
          const projectTags = data.projects || data.project_tag || [];
          const projectIds = Array.isArray(projectTags)
            ? projectTags.map((tag: any) => tag.id).filter(Boolean)
            : [];
          setSelectedProjects(projectIds);

          // Handle equipment groups
          const equipmentGroups = data.equipmentGroup || [];
          const groupIds = Array.isArray(equipmentGroups)
            ? equipmentGroups.map((group: any) => group.id).filter(Boolean)
            : [];
          setSelectedGroups(groupIds);

        })
        .catch((err) => {
          console.error("Failed to load equipment:", err);
          toast.error("Failed to load equipment");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: any) => {
    const { name, files } = e.target;
    if (files.length > 0 && files[0].type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      formData.hsn_number !== 0 &&
      formData.hsn_number.toString().length !== 8
    ) {
      toast.error("HSN number must be exactly 8 digits");
      setLoading(false);
      return;
    }

    try {
      // Handle file uploads and clean log fields
      const equipmentManualUrl = 
        typeof formData.equipmentManual === "object"
          ? await uploadToCloudinary(formData.equipmentManual)
          : (isInvalidLogField(formData.equipmentManual) ? "" : formData.equipmentManual);

      const maintenanceLogUrl = 
        typeof formData.maintenanceLog === "object"
          ? await uploadToCloudinary(formData.maintenanceLog)
          : (isInvalidLogField(formData.maintenanceLog) ? "" : formData.maintenanceLog);

      const otherLogUrl = 
        typeof formData.otherLog === "object"
          ? await uploadToCloudinary(formData.otherLog)
          : (isInvalidLogField(formData.otherLog) ? "" : formData.otherLog);

      // Prepare payload with cleaned log fields
      const payload = {
        equipment_name: formData.equipmentName,
        equipment_sr_no: formData.serialNo,
        additional_id: formData.additionalId,
        purchase_date: formData.purchaseDate,
        oem: formData.oem,
        purchase_cost: Number(formData.purchaseCost),
        equipment_manual: equipmentManualUrl,
        maintenance_log: maintenanceLogUrl,
        other_log: otherLogUrl,
        project_tag: selectedProjects,
        equipment_group_id: selectedGroups,
        hsn_number: formData.hsn_number,
      };

      console.log("Submitting payload:", payload);

      if (isEdit && id) {
        await updateEquipment(id, payload as any);
        toast.success("Equipment updated successfully!");
      } else {
        await createEquipment(payload as any);
        toast.success("Equipment created successfully!");
      }

      setTimeout(() => navigate("/equipments/view"), 800);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center px-4 py-2 rounded-md transition ${
            activeTab === "form"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Equipment Form
        </button>
        {!isEdit && (
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              activeTab === "bulk"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <FaUpload className="mr-2" /> Bulk Upload
          </button>
        )}
      </div>

      {activeTab === "form" ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={<FaCogs />}
              label="Equipment Name"
              name="equipmentName"
              value={formData.equipmentName}
              onChange={handleChange}
              placeholder="Enter equipment name (e.g., Excavator, Crane)"
            />
            <InputField
              icon={<FaTag />}
              label="Serial No"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
            <InputField
              icon={<FaTag />}
              label="Additional ID"
              name="additionalId"
              value={formData.additionalId}
              onChange={handleChange}
              placeholder="Enter additional identification number"
            />
            <div className="relative">
              <InputField
                icon={<FaCalendarAlt />}
                label="Purchase Date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                type="date"
                inputRef={dateInputRef}
                placeholder=""
              />
              <FaCalendarAlt
                className="absolute right-3 top-9 text-gray-400 cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker?.()}
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
                <span className="mr-2">
                  <FaCogs />
                </span>
                OEM
              </label>
              <Select
                options={oemArr}
                isSearchable
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    oem: selectedOption?.value || "",
                  }));
                }}
                value={oemArr.find((opt) => opt.value === formData.oem)}
                placeholder="Select OEM manufacturer"
                className="text-gray-900"
                classNames={{
                  control: (state) =>
                    `bg-white border border-gray-300 rounded-md p-1 ${
                      state.isFocused
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "hover:border-gray-400"
                    }`,
                  menu: () => "bg-white border border-gray-300 rounded-md mt-1",
                  option: (state) =>
                    `${
                      state.isFocused ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-100 text-gray-900`,
                  placeholder: () => "text-gray-500",
                }}
              />
            </div>

            <InputField
              icon={<FaDollarSign />}
              label="Purchase Cost"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleChange}
              type="number"
              placeholder="Enter purchase cost in USD"
            />

            <div>
              <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
                <span className="mr-2">
                  <GoNumber />
                </span>
                HSN Number
              </label>
              <input
                type="text"
                name="hsn_number"
                value={formData.hsn_number === 0 ? "" : formData.hsn_number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setFormData((prev) => ({
                      ...prev,
                      hsn_number: value ? Number(value) : 0,
                    }));
                  }
                }}
                className={`w-full px-3 py-2 border ${
                  formData.hsn_number !== 0 &&
                  formData.hsn_number.toString().length !== 8
                    ? "border-red-500"
                    : "border-gray-300"
                } dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter 8-digit HSN number"
              />
              {formData.hsn_number !== 0 &&
                formData.hsn_number.toString().length !== 8 && (
                  <p className="text-red-500 text-sm mt-1">
                    HSN number must be exactly 8 digits
                  </p>
                )}
            </div>

            <FileField
              icon={<FaCogs />}
              label="Equipment Manual (PDF only)"
              name="equipmentManual"
              value={formData.equipmentManual}
              onChange={handleFileChange}
            />
            <FileField
              icon={<FaCogs />}
              label="Maintenance Log (PDF only)"
              name="maintenanceLog"
              value={formData.maintenanceLog}
              onChange={handleFileChange}
            />
            <FileField
              icon={<FaCogs />}
              label="Other Log (PDF only)"
              name="otherLog"
              value={formData.otherLog}
              onChange={handleFileChange}
            />

            <div className="md:col-span-2">
              <FilterableMultiSelect
                label="Project Tags"
                options={projectTags}
                selectedValues={selectedProjects}
                onChange={setSelectedProjects}
                placeholder="Select projects..."
              />
            </div>

            <div className="md:col-span-2">
              <FilterableMultiSelect
                label="Equipment Groups"
                options={equipmentGroups}
                selectedValues={selectedGroups}
                onChange={setSelectedGroups}
                placeholder="Select equipment groups..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/equipments/view")}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Equipment"
                : "Create Equipment"}
            </button>
          </div>
        </form>
      ) : (
        <EquipmentBulkUpload />
      )}
    </div>
  );
}

// Reusable InputField
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  inputRef,
  placeholder = "",
}: any) => {
  const defaultPlaceholders: Record<string, string> = {
    equipmentName: "Enter equipment name (e.g., Excavator, Crane)",
    serialNo: "Enter serial number",
    additionalId: "Enter additional identification number",
    purchaseCost: "Enter purchase cost in USD",
  };

  const fieldPlaceholder =
    placeholder || defaultPlaceholders[name] || `Enter ${label.toLowerCase()}`;

  return (
    <div>
      <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
        <span className="mr-2">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        ref={inputRef}
        placeholder={fieldPlaceholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

// Reusable FileField
const FileField = ({ icon, label, name, value, onChange }: any) => {
  const hasValidFile = value && typeof value === 'string' && value.includes('.pdf') && value.startsWith('http');
  
  return (
    <div className="md:col-span-2 mt-4">
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
      </label>
      
      {/* Show current file if exists and is valid */}
      {hasValidFile && (
        <div className="mb-2 p-2 bg-green-50 dark:bg-green-900 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaFilePdf className="text-red-500" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Current file: 
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline ml-1"
              >
                View PDF
              </a>
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange({ target: { name, value: '' } })}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      )}
      
      <input
        type="file"
        name={name}
        accept="application/pdf"
        onChange={onChange}
        className="block w-full cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md
          file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
          dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800
          transition-colors bg-white dark:bg-gray-700 text-gray-800 dark:text-white
          border border-gray-300 dark:border-gray-600 rounded-md p-2"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Only PDF files are accepted
      </p>
    </div>
  );
};