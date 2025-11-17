import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createOEM, getOEMById, updateOEM } from "../../apis/oemApi";
import { CreateOEMPayload } from "../../types/oemTypes";

export default function OemFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateOEMPayload>({
    oem_name: "",
    oem_code: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getOEMById(id)
        .then((data) => {
          setFormData({
            oem_name: data.oem_name || "",
            oem_code: data.oem_code || "",
          });
        })
        .catch(() => toast.error("Failed to load OEM"))
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
        await updateOEM({ id, ...formData });
        toast.success("OEM updated successfully!");
      } else {
        await createOEM(formData);
        toast.success("OEM created successfully!");
      }
      setTimeout(() => navigate("/oem/view"), 800);
    } catch (err) {
      toast.error("Failed to save OEM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isEdit ? "Edit OEM" : "Add New OEM"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <InputField
          label="OEM Name"
          name="oem_name"
          value={formData.oem_name}
          onChange={handleChange}
          placeholder="Enter OEM manufacturer name (e.g., Caterpillar, Komatsu)"
        />
        <InputField
          label="OEM Code"
          name="oem_code"
          value={formData.oem_code}
          onChange={handleChange}
          placeholder="Enter OEM code (e.g., CAT, KMT)"
        />
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/oem/view")}
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
              ? "Update OEM"
              : "Create OEM"}
          </button>
        </div>
      </form>
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
    oem_name: "Enter OEM manufacturer name (e.g., Caterpillar, Komatsu)",
    oem_code: "Enter OEM code (e.g., CAT, KMT)"
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