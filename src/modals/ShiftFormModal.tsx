import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

type ShiftFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  editingShift?: any;
};

const ShiftFormModal: React.FC<ShiftFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingShift,
}) => {
  const [shiftCode, setShiftCode] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  useEffect(() => {
    if (editingShift) {
      setShiftCode(editingShift.shiftCode || "");
      setFromTime(editingShift.fromTime || "");
      setToTime(editingShift.toTime || "");
    } else {
      setShiftCode("");
      setFromTime("");
      setToTime("");
    }
  }, [editingShift]);

  
  const handleSubmit = () => {
    onSubmit({
      shiftCode,
      fromTime,
      toTime,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 dark:text-gray-300"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          {editingShift ? "Edit Shift" : "Add Shift"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              Shift Code
            </label>
            <input
              type="text"
              value={shiftCode}
              onChange={(e) => setShiftCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter shift code"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              From Time
            </label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              To Time
            </label>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {editingShift ? "Update Shift" : "Add Shift"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftFormModal;
