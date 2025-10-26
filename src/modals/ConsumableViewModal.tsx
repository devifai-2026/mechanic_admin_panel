import React from "react";
import {
  FaTimes,
  FaTag,
  FaToolbox,
  FaIndustry,
  FaCubes,
  FaChartLine,
  FaDownload,
  FaUpload,
} from "react-icons/fa";

type ConsumableViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: any;
};

const ConsumableViewModal: React.FC<ConsumableViewModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes className="text-gray-500 hover:text-red-500 dark:text-gray-300" size={20} />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
            <FaToolbox className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{item.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">Consumable Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaTag className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Item Code</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.itemCode}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaIndustry className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Make</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.make}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaCubes className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">UOM</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.uom}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaChartLine className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Qty In Hand</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.qtyInHand}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaDownload className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Acc. In</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.accIn}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaUpload className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Acc. Out</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{item.accOut}</p>
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

export default ConsumableViewModal;
