import React from "react";
import {
  FaTimes,
  // FaIdBadge,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaGlobe,
  FaHandshake,
  FaProjectDiagram,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

type PartnerViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  partner: any;
};

const PartnerViewModal: React.FC<PartnerViewModalProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  if (!isOpen || !partner) return null;

  // Map backend keys to frontend keys for display
  const displayPartner = {
    name: partner.partner_name || partner.name || "",
    address: partner.partner_address || partner.address || "",
    gst: partner.partner_gst || partner.gst || "",
    geoId: partner.partner_geo_id || partner.geoId || "",
    isCustomer: partner.isCustomer ?? true,
    linkedProjects: partner.linkedProjects ?? "",
    isActive: partner.isActive ?? true,
  };

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
            <FaBuilding className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{displayPartner.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">Partner Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Address</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{displayPartner.address}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaFileInvoice className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">GST</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{displayPartner.gst}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaGlobe className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Geo ID</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{displayPartner.geoId}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <FaHandshake className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Is Customer</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayPartner.isCustomer ? "Yes" : "No"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              <FaProjectDiagram className="text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="font-semibold text-gray-700 dark:text-white">Linked Projects</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">{displayPartner.linkedProjects}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              {displayPartner.isActive ? (
                <FaCheckCircle className="text-green-500 mr-2" />
              ) : (
                <FaTimesCircle className="text-red-500 mr-2" />
              )}
              <h3 className="font-semibold text-gray-700 dark:text-white">Active</h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 pl-6">
              {displayPartner.isActive ? "Yes" : "No"}
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

export default PartnerViewModal;
