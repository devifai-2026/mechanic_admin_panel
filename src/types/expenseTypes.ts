export interface Expense {
  id: string;
  project_id: string;
  date: string;
  paid_to: string;
  paid_by: string;
  createdBy: string;
  expense_code: string;
  expense_name: string;
  amount: number;
  allocation: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    emp_name: string;
    emp_id: string;
  };
  project: {
    id: string;
    project_no: string;
    contract_start_date: string;
    contract_end_date: string;
  };
}
