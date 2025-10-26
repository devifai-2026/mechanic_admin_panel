import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

type RoleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  editingRole?: any;
};

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRole,
}) => {
  const [code, setCode] = useState("");
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (editingRole) {
      setCode(editingRole.code || "");
      setRoleName(editingRole.roleName || "");
    } else {
      setCode("");
      setRoleName("");
    }
  }, [editingRole]);

  const handleSubmit = () => {
    onSubmit({
      code,
      name: roleName,
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
          {editingRole ? "Edit Role" : "Add Role"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter unique code"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter role name"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {editingRole ? "Update Role" : "Add Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;
