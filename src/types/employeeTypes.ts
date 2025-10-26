export interface Employee {
  id: string;
  emp_id: string;
  emp_name: string;
  blood_group: string;
  age: number;
  adress: string;
  position: string; // UUID
  is_active: boolean;
  shiftcode: string;
  role_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePayload {
  emp_id: string;
  emp_name: string;
  blood_group: string;
  age: number;
  adress: string;
  position: string;
  is_active: boolean;
  shiftcode: string;
  role_id: string;
}
