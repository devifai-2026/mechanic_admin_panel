import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaTint,
  FaBirthdayCake,
  FaUserTie,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt,
  FaIdBadge,
} from "react-icons/fa";
import { fetchEmpPositions } from "../apis/empPositionApi";
import { fetchShifts } from "../apis/shiftApi";
import { fetchRoles } from "../apis/roleApi";
import { EmpPosition } from "../types/empPositionTypes";
import { Shift } from "../types/shiftTypes";
import { Role } from "../types/roleTypes";

type EmployeeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  employee?: any;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
}) => {
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    bloodGroup: "",
    age: "",
    address: "",
    position: "",
    shift: "",
    role: "",
    active: true,
  });

  const [positions, setPositions] = useState<EmpPosition[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  console.log("============", roles);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const posData = await fetchEmpPositions();
        setPositions(posData);
        const shiftData = await fetchShifts();
        setShifts(shiftData.map((s: any) => s.shift_code));
        const roleData = await fetchRoles();
        setRoles(roleData);
      } catch (err) {
        console.error("Failed to fetch select options", err);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (employee) {
      console.log({ employee });
      setFormData({ ...employee });
    } else {
      setFormData({
        empId: "",
        name: "",
        bloodGroup: "",
        age: "",
        address: "",
        position: "",
        shift: "",
        role: "",
        active: true,
      });
    }
  }, [employee]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FaTimes className="text-gray-500 dark:text-gray-300" size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {employee ? "Edit Employee" : "Add New Employee"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={<FaIdBadge />}
            label="Emp ID"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
          />

          <InputField
            icon={<FaUser />}
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <SelectField
            icon={<FaTint />}
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            options={bloodGroups}
            onChange={handleChange}
          />

          <InputField
            icon={<FaBirthdayCake />}
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />

          <TextAreaField
            icon={<FaMapMarkerAlt />}
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <SelectField
            icon={<FaUserTie />}
            label="Position"
            name="position"
            value={formData.position}
            options={positions}
            optionValueKey="id"
            optionLabelKey="designation"
            onChange={handleChange}
          />

          <SelectField
            icon={<FaClock />}
            label="Shift"
            name="shift"
            value={formData.shift}
            options={shifts}
            optionValueKey="shift_code"
            optionLabelKey="shift_code"
            onChange={handleChange}
          />

          <SelectField
            icon={<FaShieldAlt />}
            label="Role"
            name="role"
            value={formData.role}
            options={roles}
            optionValueKey="id"
            optionLabelKey="name"
            onChange={handleChange}
          />

          <div className="flex items-center space-x-4 mt-2 md:col-span-2">
            <label className="text-gray-700 dark:text-gray-200 font-medium">
              Active
            </label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {employee ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormModal;

// ------------------------------
// Utility Components
// ------------------------------

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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({
  icon,
  label,
  name,
  value,
  options,
  onChange,
  optionValueKey = "value",
  optionLabelKey = "label",
}: any) => (
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
      <option value="">Select {label}</option>
      {options.map((opt: any, index: number) => (
        <option key={index} value={opt[optionValueKey] ?? opt}>
          {opt[optionLabelKey] ?? opt}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ icon, label, name, value, onChange }: any) => (
  <div className="md:col-span-2">
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
