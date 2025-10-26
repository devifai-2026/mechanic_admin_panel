import React from "react";
import {
  FaTimes,
  FaTools,
  FaBarcode,
  FaTag,
  FaCalendarAlt,
  FaIndustry,
  FaRupeeSign,
  FaLayerGroup,
} from "react-icons/fa";

interface EquipmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: any;
}

const EquipmentViewModal: React.FC<EquipmentViewModalProps> = ({
  isOpen,
  onClose,
  equipment,
}) => {
  if (!isOpen || !equipment) return null;

  if (!isOpen || !equipment) return null;

  // Map backend keys to frontend keys for display
  const displayEquipment = {
    name: equipment.equipment_name || equipment.name || "",
    serialNo: equipment.equipment_sr_no || equipment.serialNo || "",
    additionalId: equipment.additional_id || equipment.additionalId || "",
    purchaseDate: equipment.purchase_date || equipment.purchaseDate || "",
    oem: equipment.oem || "",
    purchaseCost: equipment.purchase_cost ?? equipment.purchaseCost ?? "",
    group: equipment.equipment_group_name || equipment.group || "",
  };

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes
            className="text-gray-500 hover:text-red-500 dark:text-gray-300"
            size={20}
          />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
            <FaTools className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {displayEquipment.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Equipment Details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaBarcode className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Serial No
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayEquipment.serialNo}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaTag className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Additional ID
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayEquipment.additionalId}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Purchase Date
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayEquipment.purchaseDate}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaIndustry className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                OEM
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayEquipment.oem}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaRupeeSign className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Purchase Cost
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              ₹{displayEquipment.purchaseCost}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaLayerGroup className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">
                Group
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayEquipment.group}
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

export default EquipmentViewModal;
