import { FaCogs, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { FaHashtag, FaMoneyBillWave, FaUsers } from "react-icons/fa6";

const ProjectDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  project: any;
}> = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 transition-opacity pointer-events-auto"
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 2 }}
      >
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                  <FaHashtag className="text-blue-600 dark:text-blue-300" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {project.project_no}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.customer?.partner_name || 'No customer'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close drawer"
              >
                <FaTimes className="text-gray-500 hover:text-red-500 dark:text-gray-300" size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Project Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                  <p className="text-gray-800 dark:text-gray-200">{project.order_no || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contract Start</p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {project.contract_start_date ? formatDate(project.contract_start_date) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tenure</p>
                  <p className="text-gray-800 dark:text-gray-200">{project.contract_tenure || '-'}</p>
                </div>
              </div>
            </div>

            {/* Revenues Section */}
            {project.revenues?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaMoneyBillWave className="mr-2 text-gray-500 dark:text-gray-300" />
                  Revenues
                </h3>
                <div className="space-y-2">
                  {project.revenues.map((revenue: any) => (
                    <div key={revenue.revenue_code} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{revenue.revenue_code}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{revenue.revenue_description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipments Section */}
            {project.equipments?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaCogs className="mr-2 text-gray-500 dark:text-gray-300" />
                  Equipments ({project.equipments.length})
                </h3>
                <div className="space-y-2">
                  {project.equipments.map((equipment: any) => (
                    <div key={equipment.equipment_name} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200">{equipment.equipment_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Section */}
            {project.staff?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaUsers className="mr-2 text-gray-500 dark:text-gray-300" />
                  Staff ({project.staff.length})
                </h3>
                <div className="space-y-2">
                  {project.staff.map((member: any) => (
                    <div key={member.emp_name} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-800 dark:text-gray-200">{member.emp_name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locations Section */}
            {project.store_locations?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500 dark:text-gray-300" />
                  Locations ({project.store_locations.length})
                </h3>
                <div className="space-y-2">
                  {project.store_locations.map((location: any) => (
                    <div key={location.store_code} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{location.store_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{location.store_code}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDrawer;