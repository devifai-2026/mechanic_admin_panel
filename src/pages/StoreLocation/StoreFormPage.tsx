import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createStore, updateStore, fetchStoreById } from "../../apis/storeApi";
import { toast, ToastContainer } from "react-toastify";
import { FaCode, FaWarehouse, FaMapMarkedAlt, FaUpload } from "react-icons/fa";
import StoreBulkUpload from "./StoreBulkUpload";

export default function StoreFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    storeCode: "",
    storeName: "",
    store_location: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchStoreById(id)
        .then((data) => {
          setFormData({
            storeCode: data.store_code,
            storeName: data.store_name ?? "",
            store_location: data.store_location,
          });
        })
        .catch(() => toast.error("Failed to load store"))
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
      store_code: formData.storeCode,
      store_name: formData.storeName,
      store_location: formData.store_location,
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateStore(id, payload);
        toast.success("Store updated successfully!");
      } else {
        await createStore(payload);
        toast.success("Store created successfully!");
      }
      setTimeout(() => navigate("/store-locations/view"), 800);
    } catch (error) {
      toast.error("Failed to save store");
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
          Store Form
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
            {isEdit ? "Edit Store" : "Add New Store"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <InputField
              icon={<FaCode />}
              label="Store Code"
              name="storeCode"
              placeholder="Enter store code (e.g., ST001)"
              value={formData.storeCode}
              onChange={handleChange}
            />
            <InputField
              icon={<FaWarehouse />}
              label="Store Name"
              name="storeName"
              placeholder="Enter store name (e.g., Main Warehouse)"
              value={formData.storeName}
              onChange={handleChange}
            />
            <InputField
              icon={<FaMapMarkedAlt />}
              label="Location"
              name="store_location"
              placeholder="Enter store location with complete address"
              value={formData.store_location}
              onChange={handleChange}
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/store-locations/view")}
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
                  ? "Update Store"
                  : "Create Store"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <StoreBulkUpload />
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
    storeCode: "Enter store code (e.g., ST001)",
    storeName: "Enter store name (e.g., Main Warehouse)",
    store_location: "Enter store location with complete address"
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