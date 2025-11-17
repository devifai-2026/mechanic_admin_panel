import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createRole, updateRole, fetchRoleById } from "../../apis/roleApi";
import { toast, ToastContainer } from "react-toastify";
import { FaCode, FaUserShield } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import RoleBulkUpload from "./RoleBulkUpload";

export default function RoleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchRoleById(id)
        .then((data) => {
          setFormData({
            code: data.code || "",
            name: data.name || "",
          });
        })
        .catch(() => toast.error("Failed to load role"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: formData.code,
      name: formData.name,
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateRole(id, payload);
        toast.success("Role updated successfully!");
      } else {
        await createRole(payload);
        toast.success("Role created successfully!");
      }
      setTimeout(() => navigate("/roles/view"), 800);
    } catch (error) {
      toast.error("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
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
          Role Form
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
            {isEdit ? "Edit Role" : "Add New Role"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <InputField
              icon={<FaCode />}
              label="Role Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter role code (e.g., ADMIN, MANAGER)"
            />
            <InputField
              icon={<FaUserShield />}
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter role name (e.g., Administrator, Project Manager)"
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/roles/view")}
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
                  ? "Update Role"
                  : "Create Role"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <RoleBulkUpload />
      )}
    </div>
  );
}

// Reusable Input Field Component
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) => {
  // Default placeholders based on field name
  const defaultPlaceholders: Record<string, string> = {
    code: "Enter role code (e.g., ADMIN, MANAGER)",
    name: "Enter role name (e.g., Administrator, Project Manager)"
  };

  const fieldPlaceholder = placeholder || defaultPlaceholders[name] || `Enter ${label.toLowerCase()}`;

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
        placeholder={fieldPlaceholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};