import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectById } from '../../apis/projectsApi';
import { fetchRoles } from '../../apis/roleApi';
import { assignEmployeesToProject, fetchEmployeesByRoleId } from '../../apis/employyeApi';
import { toast, ToastContainer } from 'react-toastify';

// Define types
interface Role {
    id: string;
    name: string;
}

interface Employee {
    id: string;
    emp_name: string;
    emp_id: string;
    position: string;
    shiftcode: string;
}

const AddEmployeesPage: React.FC = () => {
    const { id: projectId } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployeeMap, setSelectedEmployeeMap] = useState<{ [id: string]: Employee }>({});
    const [loadingProject, setLoadingProject] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    // Inside your component
    const [submitting, setSubmitting] = useState(false);

    // Fetch project and roles
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoadingProject(true);
                if (projectId) {
                    const data = await fetchProjectById(projectId);
                    setProject(data);
                }
            } catch (err) {
                console.error('Error fetching project:', err);
            } finally {
                setLoadingProject(false);
            }
        };

        const fetchAllRoles = async () => {
            try {
                const data = await fetchRoles();
                setRoles(data);
            } catch (err) {
                console.error('Error fetching roles:', err);
            }
        };

        fetchProject();
        fetchAllRoles();
    }, [projectId]);

    // Fetch employees by selected role
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!selectedRoleId) return;
            try {
                setLoadingEmployees(true);
                const res = await fetchEmployeesByRoleId(selectedRoleId);
                setEmployees(res);
            } catch (err) {
                console.error('Error fetching employees:', err);
            } finally {
                setLoadingEmployees(false);
            }
        };

        fetchEmployees();
    }, [selectedRoleId]);

    // Filter employees based on search
    useEffect(() => {
        if (searchQuery.trim()) {
            const lowerSearch = searchQuery.toLowerCase();
            setFilteredEmployees(employees.filter(e => e.emp_name.toLowerCase().includes(lowerSearch)));
        } else {
            setFilteredEmployees(employees);
        }
    }, [searchQuery, employees]);

    const toggleSelectOne = (employee: Employee) => {
        setSelectedEmployeeMap(prev => {
            const updated = { ...prev };
            if (updated[employee.id]) {
                delete updated[employee.id];
            } else {
                updated[employee.id] = employee;
            }
            return updated;
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        setSelectedEmployeeMap(prev => {
            const updated = { ...prev };
            filteredEmployees.forEach(emp => {
                if (checked) {
                    updated[emp.id] = emp;
                } else {
                    delete updated[emp.id];
                }
            });
            return updated;
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover draggable pauseOnFocusLoss theme="light" />
            <h1 className="text-2xl font-bold mb-4">Add Employees to Project</h1>

            {loadingProject ? (
                <p>Loading project...</p>
            ) : (
                project && (
                    <div className="mb-4 border p-4 flex justify-between rounded bg-gray-100">
                        <p><strong>Project No:</strong> {project.project_no}</p>
                        <p><strong>Customer:</strong> {project.customer?.partner_name}</p>
                        <p><strong>Start Date:</strong> {new Date(project.contract_start_date).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(project.contract_end_date).toLocaleDateString()}</p>
                    </div>
                )
            )}

            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">Select Role</label>
                <select
                    className="w-full p-2 border rounded"
                    value={selectedRoleId}
                    onChange={e => setSelectedRoleId(e.target.value)}
                >
                    <option value="">-- Select Role --</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search employee by name..."
                    className="w-full p-2 border rounded"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {loadingEmployees ? (
                <p>Loading employees...</p>
            ) : filteredEmployees.length === 0 ? (
                <p className="text-gray-500">No employees found</p>
            ) : (
                <table className="w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 text-left">
                                <input
                                    type="checkbox"
                                    checked={filteredEmployees.every(e => selectedEmployeeMap[e.id])}
                                    onChange={e => toggleSelectAll(e.target.checked)}
                                />
                            </th>
                            <th className="p-2 text-left">Employee ID</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Position</th>
                            <th className="p-2 text-left">Shift Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id} className="border-t hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={!!selectedEmployeeMap[emp.id]}
                                        onChange={() => toggleSelectOne(emp)}
                                    />
                                </td>
                                <td className="p-2">{emp.emp_id}</td>
                                <td className="p-2">{emp.emp_name}</td>
                                <td className="p-2">{emp.position}</td>
                                <td className="p-2">{emp.shiftcode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                onClick={async () => {
                    const employeeIds = Object.keys(selectedEmployeeMap);
                    if (!projectId || employeeIds.length === 0) {
                        toast.error("Please select at least one employee and ensure project is loaded.");
                        return;
                    }

                    try {
                        setSubmitting(true); // start loader
                        await assignEmployeesToProject(projectId, employeeIds);
                        toast.success("Employees added to project successfully!");
                        setSelectedEmployeeMap({});
                    } catch (error) {
                        console.error("Error assigning employees:", error);
                        toast.error("Failed to assign employees. Please try again.");
                    } finally {
                        setSubmitting(false); // stop loader
                    }
                }}
                className={`mt-6 px-4 py-2 rounded text-white ${submitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={submitting}
            >
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                        </svg>
                        Submitting...
                    </span>
                ) : (
                    'Submit'
                )}
            </button>
        </div>
    );
};

export default AddEmployeesPage;
