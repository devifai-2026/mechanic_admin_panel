import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaCogs,
  FaDollarSign,
  FaTag,
  FaCalendarAlt,
} from "react-icons/fa";
import { createEquipment, updateEquipment } from "../apis/equipmentApi";
import { EquipmentGroupOption } from "../types/equipmentGroupTypes";

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  equipment?: any;
  equipmentGroups: EquipmentGroupOption[];
}

const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipment,
  equipmentGroups,
}) => {
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
    projectTag: "",
    equipmentGroup: "",
    hsn_number: 0,
  });

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (equipment) {
      setFormData({ ...equipment });
    } else {
      setFormData({
        equipmentName: "",
        serialNo: "",
        additionalId: "",
        purchaseDate: "",
        oem: "",
        purchaseCost: 0,
        equipmentManual: "",
        maintenanceLog: "",
        otherLog: "",
        projectTag: "",
        equipmentGroup: "",
        hsn_number: 0
      });
    }
  }, [equipment]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  function safeParse(jsonString: string) {
    try {
      return jsonString ? JSON.parse(jsonString) : {};
    } catch {
      return {};
    }
  }

  const handleSubmit = async () => {
    const payload = {
      equipment_name: formData.equipmentName,
      equipment_sr_no: formData.serialNo,
      additional_id: formData.additionalId,
      purchase_date: formData.purchaseDate,
      oem: formData.oem,
      purchase_cost: Number(formData.purchaseCost),
      equipment_manual: formData.equipmentManual,
      maintenance_log: safeParse(formData.maintenanceLog),
      other_log: safeParse(formData.otherLog),
      project_tag: safeParse(formData.projectTag),
      equipment_group_id: formData.equipmentGroup,
      hsn_number: formData.hsn_number
    };

    try {
      if (equipment && equipment.id) {
        await updateEquipment(equipment.id, payload);
      } else {
        await createEquipment(payload);
      }
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Failed to save equipment", error);
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
          {equipment ? "Edit Equipment" : "Add New Equipment"}
        </h2>

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
              style={{ pointerEvents: "auto" }}
            />
          </div>

          <InputField
            icon={<FaCogs />}
            label="OEM"
            name="oem"
            value={formData.oem}
            onChange={handleChange}
          />

          <InputField
            icon={<FaDollarSign />}
            label="Purchase Cost"
            name="purchaseCost"
            value={formData.purchaseCost}
            onChange={handleChange}
            type="number"
          />

          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Equipment Manual"
              name="equipmentManual"
              value={formData.equipmentManual}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Maintenance Log "
              name="maintenanceLog"
              value={formData.maintenanceLog}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Other Log "
              name="otherLog"
              value={formData.otherLog}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Project Tag "
              name="projectTag"
              value={formData.projectTag}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <SelectField
              icon={<FaCogs />}
              label="Equipment Group"
              name="equipmentGroup"
              value={formData.equipmentGroup}
              onChange={handleChange}
              options={equipmentGroups}
            />
          </div>
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
            {equipment ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentFormModal;

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

const TextAreaField = ({ icon, label, name, value, onChange }: any) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <textarea
      name={name}
      rows={3}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({ icon, label, name, value, onChange, options }: any) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <option value="">Select Group</option>
      {options.map((group: { value: string; label: string }) => (
        <option key={group.value} value={group.value}>
          {group.label}
        </option>
      ))}
    </select>
  </div>
);
