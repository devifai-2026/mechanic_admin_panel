import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

// Define props interface
interface ConsumableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  item: any | null; // Define item prop to handle edit
  uomOptions: string[]; // Unit of measurement options
  accountOptions: string[]; // Account options for dropdown
}

const ConsumableFormModal: React.FC<ConsumableFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  uomOptions,
  accountOptions,
}) => {
  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    description: "",
    type: "",
    make: "",
    uom: "",
    qtyInHand: 0,
    accIn: "",
    accOut: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        itemCode: "",
        name: "",
        description: "",
        type: "",
        make: "",
        uom: "",
        qtyInHand: 0,
        accIn: "",
        accOut: "",
      });
    }
  }, [item]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
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
          {item ? "Edit Consumable" : "Add New Consumable"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Item Code"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
          />
          <InputField
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <InputField
            label="Product Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
          <InputField
            label="Item Make"
            name="make"
            value={formData.make}
            onChange={handleChange}
          />
          <SelectField
            label="Unit of Measurement"
            name="uom"
            value={formData.uom}
            onChange={handleChange}
            options={uomOptions}
          />
          <InputField
            label="Qty in Hand"
            name="qtyInHand"
            value={formData.qtyInHand}
            onChange={handleChange}
            type="number"
          />
          <SelectField
            label="Account Code In"
            name="accIn"
            value={formData.accIn}
            onChange={handleChange}
            options={accountOptions}
          />
          <SelectField
            label="Account Code Out"
            name="accOut"
            value={formData.accOut}
            onChange={handleChange}
            options={accountOptions}
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
            {item ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumableFormModal;

const InputField = ({ label, name, value, onChange, type = "text" }: any) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange }: any) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">{label}</label>
    <textarea
      name={name}
      rows={3}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <option value="">Select</option>
      {options.map((option: string, index: number) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
