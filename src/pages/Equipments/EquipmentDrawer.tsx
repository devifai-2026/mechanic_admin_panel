import React from "react";
import {
  FaBarcode,
  FaCalendarAlt,
  FaIndustry,
  FaLayerGroup,
  FaRupeeSign,
  FaTag,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import { GoNumber } from "react-icons/go";

const EquipmentDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  equipment: any;
}> = ({ isOpen, onClose, equipment }) => {
  if (!isOpen || !equipment) return null;

  // console.log({ equipment })
  const displayEquipment = {
    name: equipment.equipment_name || equipment.name || "",
    serialNo: equipment.equipment_sr_no || equipment.serialNo || "",
    additionalId: equipment.additional_id || equipment.additionalId || "",
    purchaseDate: equipment.purchase_date || equipment.purchaseDate || "",
    oem: equipment.oem || "", // should already be a name string after backend fix
    purchaseCost: equipment.purchase_cost ?? equipment.purchaseCost ?? "",
    group: equipment.equipment_group_name || equipment.group || "",
    manual: equipment.equipment_manual || "",
    maintenanceLog: equipment.maintenance_log || "",
    otherLog: equipment.other_log || "",
    hsn_number: equipment.hsn_number || "",
  };

  return (
    <div className="">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-30 transition-opacity"
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ zIndex: 2 }}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close drawer"
          >
            <FaTimes
              className="text-gray-500 hover:text-red-500 dark:text-gray-300"
              size={20}
            />
          </button>
          <div className="p-6 overflow-y-auto pt-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                <FaTools className="text-blue-600 dark:text-blue-300" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {displayEquipment.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Equipment Details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Serial No */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaBarcode className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Serial No</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {displayEquipment.serialNo}
                </p>
              </div>

              {/* Additional ID */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTag className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Additional ID</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {displayEquipment.additionalId}
                </p>
              </div>

              {/* Purchase Date */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Purchase Date</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {equipment.purchase_date
                    ? new Date(equipment.purchase_date).toLocaleDateString("en-GB")
                    : "-"}
                </p>
              </div>


              {/* OEM */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaIndustry className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">OEM</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">{displayEquipment.oem}</p>
              </div>

              {/* Purchase Cost */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaRupeeSign className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Purchase Cost</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  ₹{displayEquipment.purchaseCost}
                </p>
              </div>

              {/* Equipment Manual */}
              {displayEquipment.manual && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <FaTools className="text-gray-500 dark:text-gray-300 mr-2" />
                    <h3 className="font-semibold text-gray-700 dark:text-white">
                      Equipment Manual
                    </h3>
                  </div>
                  <div className="pl-6">
                    <a
                      href={displayEquipment.manual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 View PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Maintenance Log */}
              {displayEquipment.maintenanceLog && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <FaTools className="text-gray-500 dark:text-gray-300 mr-2" />
                    <h3 className="font-semibold text-gray-700 dark:text-white">
                      Maintenance Log
                    </h3>
                  </div>
                  <div className="pl-6">

                    <a
                      href={displayEquipment.maintenanceLog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 View PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Other Log */}
              {displayEquipment.otherLog && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <FaTools className="text-gray-500 dark:text-gray-300 mr-2" />
                    <h3 className="font-semibold text-gray-700 dark:text-white">Other Log</h3>
                  </div>
                  <div className="pl-6">

                    <a
                      href={displayEquipment.otherLog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 View PDF
                    </a>
                  </div>
                </div>
              )}
              {/* Project Tag */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTag className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Project Tag</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">{equipment.project_tag}</p>
              </div>

              {/* Equipment Group ID */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaLayerGroup className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Group ID</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">{equipment.equipment_group_id}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <GoNumber className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">Hsn No</h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">{equipment.hsn_number}</p>
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
      </div>
    </div>
  );
};

export default EquipmentDrawer;
