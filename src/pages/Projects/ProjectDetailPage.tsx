import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById } from "../../apis/projectsApi";
import { FaArrowLeft } from "react-icons/fa";
import { fetchEmployeeById } from "../../apis/employyeApi";

interface Customer {
  id: string;
  partner_name: string;
}

interface Equipment {
  id: string;
  equipment_name: string;
}

interface StaffMember {
  id: string;
  emp_name: string;
  role_id: string;
  role: {
    name: string;
  };
}

interface Revenue {
  id: string;
  revenue_code: string;
  revenue_description: string;
}

interface StoreLocation {
  id: string;
  store_code: string;
  store_name: string;
}

interface Project {
  id: string;
  project_no: string;
  customer_id: string;
  order_no: string;
  contract_tenure: string;
  contract_start_date: string;
  contract_end_date: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  equipments: Equipment[];
  staff: StaffMember[];
  revenues: Revenue[];
  store_locations: StoreLocation[];
}

interface Employee {
  id: string;
  emp_id: string;
  emp_name: string;
  blood_group: string;
  age: number;
  adress: string;
  state: string;
  city: string;
  pincode: string;
  acc_holder_name: string;
  bank_name: string;
  acc_no: string;
  ifsc_code: string;
  is_active: boolean;
  shiftcode: string;
  role_id: string;
  org_id: string;
  aadhar_number: string;
  dob: string;
  app_access_role: string;
  createdAt: string;
  updatedAt: string;
  role?: {
    name: string;
  };
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 10;
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!id) throw new Error("No project ID provided");
        const data = await fetchProjectById(id) as unknown as Project;
        setProject(data);
      } catch (err) {
        console.error("Error loading project:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const handleViewEmployee = async (employeeId: string) => {
    try {
      setEmployeeLoading(true);
      setEmployeeError(null);
      const employee = await fetchEmployeeById(employeeId);

      // Runtime type check
      if (!employee.state || !employee.city || !employee.pincode) {
        throw new Error("Incomplete employee data received");
      }

      setSelectedEmployee(employee);
      setIsEmployeeModalOpen(true);
    } catch (err) {
      console.error("Error loading employee:", err);
      setEmployeeError("Failed to load employee details");
    } finally {
      setEmployeeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-blue-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-gray-600">Project not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </button>

          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <span className="text-blue-600 font-bold">#</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {project.project_no}
              </h1>
              <p className="text-sm text-gray-500">
                {project.customer.partner_name}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Basic Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-gray-800 font-medium">{project.order_no || '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Contract Start</p>
                <p className="text-gray-800 font-medium">
                  {project.contract_start_date ? formatDate(project.contract_start_date) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Contract End</p>
                <p className="text-gray-800 font-medium">
                  {project.contract_end_date ? formatDate(project.contract_end_date) : '-'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Project Duration</p>
                <p className="text-gray-800 font-medium">{project.duration || '-'}</p>
              </div>
            </div>
          </div>

          {/* Revenues Section */}
          {project.revenues.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.revenues.map((revenue) => (
                  <div key={revenue.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{revenue.revenue_code}</p>
                    <p className="text-sm text-gray-600">{revenue.revenue_description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipments Section */}
          {project.equipments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Equipments ({project.equipments.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.equipments.map((equipment) => (
                  <div key={equipment.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{equipment.equipment_name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff Section */}
          {project.staff.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Staff ({project.staff.length})
                </h2>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search staff..."
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.staff
                      .filter(member =>
                        member.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        member.role?.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .slice((currentPage - 1) * staffPerPage, currentPage * staffPerPage)
                      .map(member => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {member.emp_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.emp_name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                              {member.role?.name.toLowerCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewEmployee(member.id)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * staffPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * staffPerPage, project.staff.length)}
                        </span>{' '}
                        of <span className="font-medium">{project.staff.length}</span> staff
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.ceil(project.staff.length / staffPerPage) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(project.staff.length / staffPerPage)))}
                          disabled={currentPage === Math.ceil(project.staff.length / staffPerPage)}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Locations Section */}
          {project.store_locations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Locations ({project.store_locations.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.store_locations.map((location) => (
                  <div key={location.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{location.store_name}</p>
                    <p className="text-sm text-gray-600">{location.store_code}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Details Modal */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Employee Details
                </h3>
                <button
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {employeeLoading ? (
                <div className="flex justify-center py-8">
                  <p className="text-blue-600">Loading employee details...</p>
                </div>
              ) : employeeError ? (
                <div className="flex flex-col items-center py-8">
                  <p className="text-red-600 mb-4">{employeeError}</p>
                  <button
                    onClick={() => selectedEmployee && handleViewEmployee(selectedEmployee.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : selectedEmployee ? (
                <div className="space-y-6">
                  {/* Employee Basic Info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-2xl font-bold">
                        {selectedEmployee.emp_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800">{selectedEmployee.emp_name}</h4>
                      <p className="text-gray-600">{selectedEmployee.emp_id}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: {selectedEmployee.is_active ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Personal Information</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Date of Birth</p>
                          <p>{formatDate(selectedEmployee.dob)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Age</p>
                          <p>{selectedEmployee.age}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Blood Group</p>
                          <p>{selectedEmployee.blood_group}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Aadhar Number</p>
                          <p>{selectedEmployee.aadhar_number}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Contact Information</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p>{selectedEmployee.adress}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">City/State/Pincode</p>
                          <p>{`${selectedEmployee.city}, ${selectedEmployee.state} - ${selectedEmployee.pincode}`}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Bank Details</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Account Holder</p>
                          <p>{selectedEmployee.acc_holder_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p>{selectedEmployee.bank_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Number</p>
                          <p>{selectedEmployee.acc_no}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">IFSC Code</p>
                          <p>{selectedEmployee.ifsc_code}</p>
                        </div>
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Employment Details</h5>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Shift Code</p>
                          <p>{selectedEmployee.shiftcode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">App Access Role</p>
                          <p className="capitalize">{selectedEmployee.app_access_role}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Joined On</p>
                          <p>{formatDate(selectedEmployee.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;