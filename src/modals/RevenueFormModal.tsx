import React, { useEffect, useState } from "react";
import { FaTimes, FaCode, FaAlignLeft, FaMoneyBill } from "react-icons/fa";
import { createRevenue, updateRevenue } from "../apis/revenueApi";

interface RevenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  revenue?: any;
}

const RevenueFormModal: React.FC<RevenueFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  revenue,
}) => {
  const [formData, setFormData] = useState({
    revenueCode: "",
    description: "",
    revenueValue: "",
  });

  useEffect(() => {
    if (revenue) {
      setFormData({ ...revenue });
    } else {
      setFormData({
        revenueCode: "",
        description: "",
        revenueValue: "",
      });
    }
  }, [revenue]);


  

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Prepare payload to match API field names
    const payload = {
      revenue_code: formData.revenueCode,
      revenue_description: formData.description,
      revenue_value: Number(formData.revenueValue),
    };

    try {
      if (revenue && revenue.id) {
        // Update
        await updateRevenue(revenue.id, payload);
      } else {
        // Create
        await createRevenue(payload);
      }
      onSubmit(payload); // Optionally pass data up
      onClose();
    } catch (error) {
      // Handle error (show toast, etc.)
      console.error("Failed to save revenue", error);
    }
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
          {revenue ? "Edit Revenue" : "Add New Revenue"}
        </h2>

        <div className="grid grid-cols-1 gap-5">
          <InputField
            icon={<FaCode />}
            label="Revenue Code"
            name="revenueCode"
            value={formData.revenueCode}
            onChange={handleChange}
          />

          <InputField
            icon={<FaAlignLeft />}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <InputField
            icon={<FaMoneyBill />}
            label="Revenue Value"
            name="revenueValue"
            value={formData.revenueValue}
            onChange={handleChange}
            type="number"
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
            {revenue ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueFormModal;

// 👇 Reusable Input Field Component
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
