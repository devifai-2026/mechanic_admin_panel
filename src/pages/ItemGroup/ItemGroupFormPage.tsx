import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CreateItemGroupPayload } from "../../types/itemGroupTypes";
import {
  createItemGroup,
  getItemGroupById,
  updateItemGroup,
} from "../../apis/intemGroupApi";
import { FaUpload } from "react-icons/fa6";
import ItemGroupBulkUpload from "./ItemGroupBulkUpload";

export default function ItemGroupFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateItemGroupPayload>({
    group_name: "",
    group_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getItemGroupById(id)
        .then((data) => {
          setFormData({
            group_name: data.group_name || "",
            group_code: data.group_code || "",
          });
        })
        .catch(() => toast.error("Failed to load Item Group"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateItemGroup({ id, ...formData });
        toast.success("Item Group updated successfully!");
      } else {
        await createItemGroup(formData);
        toast.success("Item Group created successfully!");
      }
      setTimeout(() => navigate("/itemgroup/view"), 800);
    } catch (err) {
      toast.error("Failed to save Item Group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeTab === "form"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Item Group Form
        </button>
        {!isEdit && (
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              activeTab === "bulk"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <FaUpload className="mr-2" /> Bulk Upload
          </button>
        )}
      </div>
      {activeTab === "form" ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEdit ? "Edit Item Group" : "Add New Item Group"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <InputField
              label="Group Name"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              placeholder="Enter item group name (e.g., Electrical, Mechanical)"
            />
            <InputField
              label="Group Code"
              name="group_code"
              value={formData.group_code}
              onChange={handleChange}
              placeholder="Enter item group code (e.g., ELEC, MECH)"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/itemgroup/view")}
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
                  ? "Update Item Group"
                  : "Create Item Group"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <ItemGroupBulkUpload />
      )}
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  name: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
}) => {
  // Default placeholders based on field name
  const defaultPlaceholders: Record<string, string> = {
    group_name: "Enter item group name (e.g., Electrical, Mechanical)",
    group_code: "Enter item group code (e.g., ELEC, MECH)"
  };

  const fieldPlaceholder = placeholder || defaultPlaceholders[name] || `Enter ${label.toLowerCase()}`;

  return (
    <div>
      <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={fieldPlaceholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};