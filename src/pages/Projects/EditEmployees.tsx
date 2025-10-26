import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEmployyesAssignedToProject,
  updateEmployeesForProject,
} from "../../apis/employyeApi";

export const EditEmployees: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  console.log({ selectedEmployees });
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!projectId) return;

      try {
        const data = await getEmployyesAssignedToProject(projectId);
        const employeeList = data.data || [];
        console.log({ employeeList });
        setEmployees(employeeList);
        setSelectedEmployees(employeeList.map((e: any) => e.emp_id)); // Use emp_id here
      } catch (err) {
        console.error("Error fetching employees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [projectId]);

  const handleToggle = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const handleSelectAll = () => {
    const allEmpIds = filteredEmployees.map((emp) => emp.emp_id);
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(allEmpIds);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    console.log({ projectId, selectedEmployees });
    setSaving(true);
    try {
      await updateEmployeesForProject(projectId, selectedEmployees); // Send emp_id values only
      alert("Employees updated successfully.");
      navigate("/projects/view");
    } catch (err) {
      console.error("Error updating employees:", err);
      alert("Failed to update employees. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.employeeDetails.emp_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Edit Employees</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border px-4 py-2 rounded shadow-sm focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredEmployees.length > 0 &&
                    filteredEmployees.every((emp) =>
                      selectedEmployees.includes(emp.emp_id)
                    )
                  }
                />
              </th>
              <th className="px-4 py-2 font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 font-semibold text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
              <tr key={emp.emp_id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.emp_id)}
                    onChange={() => handleToggle(emp.emp_id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-4 py-2">{emp.employeeDetails.emp_name}</td>
                <td className="px-4 py-2">{emp.employeeDetails.role.name}</td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
