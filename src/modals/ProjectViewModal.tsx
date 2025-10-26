import React from "react";
import { FaTimes, FaBuilding, FaUserTie, FaFileInvoice, FaCalendarAlt, FaClock, FaMoneyBillWave, FaServer, FaUsers, FaMapMarkerAlt } from "react-icons/fa";

type ProjectViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: any;
};

const ProjectViewModal: React.FC<ProjectViewModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen || !project) return null;

  // Format currency if revenues is a number
  const formatCurrency = (value: any) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value;
  };



  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes className="text-gray-500 hover:text-red-500 dark:text-gray-300" size={20} />
        </button>
        
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
            <FaBuilding className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{project.projectNo}</h2>
            <p className="text-gray-600 dark:text-gray-300">Project Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUserTie className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Customer</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.customer}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaFileInvoice className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Order No</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.orderNo}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Contract Start</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.contractStart}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaClock className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Tenure</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.tenure}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaMoneyBillWave className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Revenues</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{formatCurrency(project.revenues)}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaServer className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Equipments</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.equipments}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUsers className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Staff</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.staff}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Locations</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{project.locations}</p>
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

export default ProjectViewModal;