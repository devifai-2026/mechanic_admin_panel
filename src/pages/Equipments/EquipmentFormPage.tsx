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
} from "react-icons/fa";
import { GoNumber } from "react-icons/go";
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import EquipmentBulkUpload from "./EquipmentBulkUpload";
import { fetchProjects } from "../../apis/projectsApi";
import { MultiSelect } from "../../components/projects/MultiSelect";
import { getAllOEMs } from "../../apis/oemApi";

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "maco_corporation");
  formData.append("folder", "equipment_docs");

  const cloudName = "dlol2hjj8";

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    formData
  );
  return response.data.secure_url;
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
  const [selectedGroup, setSelectedGroup] = useState<string>("");

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
            label: oem.oem_code,
          }))
        );
      })
      .catch(() => toast.error("Failed to load OEMs"));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchEquipmentById(id)
        .then((data) => {
          setFormData({
            equipmentName: data.equipment_name,
            serialNo: data.equipment_sr_no,
            additionalId: data.additional_id,
            purchaseDate: data.purchase_date,
            oem: data.oem,
            purchaseCost: data.purchase_cost,
            equipmentManual: data.equipment_manual,
            maintenanceLog: JSON.stringify(data.maintenance_log ?? ""),
            otherLog: JSON.stringify(data.other_log ?? ""),
            hsn_number: data.hsn_number,
          });

          setSelectedProjects(
            data.project_tag
              ? Array.isArray(data.project_tag)
                ? data.project_tag.map(
                    (tag: any) => tag.site || tag.value || tag
                  )
                : [data.project_tag.site || data.project_tag]
              : []
          );
          setSelectedGroup(data.equipment_group_id || "");
        })
        .catch(() => toast.error("Failed to load equipment"))
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

  // const safeParse = (jsonString: string) => {
  //   try {
  //     return jsonString ? JSON.parse(jsonString) : {};
  //   } catch {
  //     return {};
  //   }
  // };

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

    // Validate HSN number (must be 8 digits)
    if (formData.hsn_number.toString().length !== 8) {
      toast.error("HSN number must be exactly 8 digits");
      return;
    }

    try {
      // Upload equipment manual if it's a File
      const equipmentManualUrl =
        typeof formData.equipmentManual === "object"
          ? await uploadToCloudinary(formData.equipmentManual)
          : formData.equipmentManual;

      const maintenanceLogUrl =
        typeof formData.maintenanceLog === "object"
          ? await uploadToCloudinary(formData.maintenanceLog)
          : formData.maintenanceLog;

      const otherLogUrl =
        typeof formData.otherLog === "object"
          ? await uploadToCloudinary(formData.otherLog)
          : formData.otherLog;

      // Map selectedProjects (array of IDs) to a single ProjectTag object (take the first if multiple)
      const selectedProjectTag = projectTags
        .filter((proj) => selectedProjects.includes(proj.value))
        .map((proj) => ({
          project_no: proj.text,
          site: proj.value,
        }))[0] || { project_no: "", site: "" };

      const payload = {
        equipment_name: formData.equipmentName,
        equipment_sr_no: formData.serialNo,
        additional_id: formData.additionalId,
        purchase_date: formData.purchaseDate,
        oem: formData.oem,
        purchase_cost: Number(formData.purchaseCost),
        equipment_manual: equipmentManualUrl,
        maintenance_log: maintenanceLogUrl, // Ensure object type
        other_log: otherLogUrl, // Ensure object type
        project_tag: selectedProjectTag?.site,
        equipment_group_id: selectedGroup,
        hsn_number: formData.hsn_number,
      };

      console.log({ payload });

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
            disabled={true}
            className={`cursor-not-allowed flex items-center px-4 py-2 rounded-md transition ${
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
            />
            <InputField
              icon={<FaTag />}
              label="Serial No"
              name="serialNo"
              value={formData.serialNo}
              onChange={handleChange}
            />
            <InputField
              icon={<FaTag />}
              label="Additional ID"
              name="additionalId"
              value={formData.additionalId}
              onChange={handleChange}
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
              />
              <FaCalendarAlt
                className="absolute right-3 top-9 text-gray-400 cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker?.()}
              />
            </div>

            <div>
              <label>OEM</label>
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
                placeholder="Select OEM"
                className="text-black"
              />
            </div>

            <InputField
              icon={<FaDollarSign />}
              label="Purchase Cost"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleChange}
              type="number"
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
                  formData.hsn_number.toString().length > 0 &&
                  formData.hsn_number.toString().length !== 8
                    ? "border-red-500"
                    : "border-gray-300"
                } dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
                placeholder="Enter HSN Number (8 digits required)"
              />
              {formData.hsn_number.toString().length > 0 &&
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
              onChange={handleFileChange}
            />
            <FileField
              icon={<FaCogs />}
              label="Maintenance Log (PDF only)"
              name="maintenanceLog"
              onChange={handleFileChange}
            />
            <FileField
              icon={<FaCogs />}
              label="Other Log (PDF only)"
              name="otherLog"
              onChange={handleFileChange}
            />

            <div className="md:col-span-2">
              <MultiSelect
                label="Project Tag"
                options={projectTags}
                defaultSelected={selectedProjects}
                onChange={(values: string[]) => setSelectedProjects(values)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
                Equipment Group
              </label>
              <MultiSelect
                label="Select Equipment Group"
                options={equipmentGroups}
                defaultSelected={selectedGroup ? [selectedGroup] : []}
                onChange={(values: string[]) =>
                  setSelectedGroup(values[0] || "")
                }
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/equipments/view")}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Create"}
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
}: any) => (
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

// Reusable FileField
const FileField = ({ icon, label, name, onChange }: any) => (
  <div className="md:col-span-2 mt-4">
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
    </label>
    <input
      type="file"
      name={name}
      accept="application/pdf"
      onChange={onChange}
      className="block w-full cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-0 file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100 transition"
    />
  </div>
);
