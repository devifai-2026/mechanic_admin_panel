import React from "react";
import {
  FaTimes,
  FaIdBadge,
  FaUser,
  FaBirthdayCake,
  FaTint,
  FaUserTie,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

type EmployeeViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
};

const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes className="text-gray-500 hover:text-red-500 dark:text-gray-300" size={20} />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
            <FaIdBadge className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{employee.empId}</h2>
            <p className="text-gray-600 dark:text-gray-300">Employee Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Name</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.name}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaBirthdayCake className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Age</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.age}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaTint className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Blood Group</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.bloodGroup}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUserTie className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Position</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.position}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaClock className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Shift</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.shift}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaShieldAlt className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Role</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{employee.role}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              {employee.active ? (
                <FaCheckCircle className="text-green-500 mr-2" />
              ) : (
                <FaTimesCircle className="text-red-500 mr-2" />
              )}
              <h3 className="font-semibold text-gray-700 dark:text-white">Active</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {employee.active ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
