export interface RevenueInvoice {
  id: string;
  project_id: string;
  createdBy: string;
  date: string;
  ho_invoice: string;
  account_code: string;
  account_name: string;
  amount_basic: number;
  tax_value: number;
  total_amount: number;
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
  };
}
