// types/materialBillTransactionTypes.ts

export interface Project {
  id: string;
  project_no: string;
  contract_start_date: string;
  contract_end_date: string;
}

export interface PartnerDetails {
  id: string;
  partner_name: string;
  partner_address: string;
}

export interface CreatedByUser {
  id: string;
  emp_id: string;
  emp_name: string;
}

export interface Material {
  id: string;
  challan_no: string;
  type: string;
  data_type: string;
  date: string;
}

export interface ConsumableItem {
  id: string;
  item_name: string;
  item_code: string;
}

export interface UnitOfMeasure {
  id: string;
  unit_name: string;
  unit_code: string;
}

export interface FormItem {
  id: string;
  material_transaction_id: string;
  item: string;
  qty: number;
  unit_price: number;
  totalValue: number;
  uom: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  consumableItem: ConsumableItem;
  unitOfMeasure: UnitOfMeasure;
}

export interface MaterialBillTransaction {
  id: string;
  materialTransactionId: string;
  project_id: string;
  date: string;
  createdBy: string;
  partner: string | null;
  partner_inv_no: string;
  inv_basic_value: string;
  inv_tax: string;
  total_invoice_value: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  partnerDetails: PartnerDetails | null;
  createdByUser: CreatedByUser[]; // Empty array in response
  material: Material;
  formItems: FormItem[];
}
