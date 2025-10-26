import React, { JSX, useEffect, useState } from "react";
import { FaTimes, FaCode, FaWarehouse, FaMapMarkedAlt } from "react-icons/fa";

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  store?: any;
}

const StoreFormModal: React.FC<StoreFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  store,
}) => {
  const [formData, setFormData] = useState({
    storeCode: "",
    storeName: "",
    location: "",
  });

  useEffect(() => {
    if (store) {
      setFormData({ ...store });
    } else {
      setFormData({
        storeCode: "",
        storeName: "",
        location: "",
      });
    }
  }, [store]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaTimes className="text-gray-500 dark:text-gray-300" size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {store ? "Edit Store" : "Add New Store"}
        </h2>

        <div className="grid grid-cols-1 gap-5">
          <InputField
            icon={<FaCode />}
            label="Store Code"
            name="storeCode"
            value={formData.storeCode}
            onChange={handleChange}
          />

          <InputField
            icon={<FaWarehouse />}
            label="Store Name"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
          />

          <InputField
            icon={<FaMapMarkedAlt />}
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {store ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreFormModal;

// 👇 Reusable Input Field Component
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  icon: JSX.Element;
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  type?: string;
}) => (
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
