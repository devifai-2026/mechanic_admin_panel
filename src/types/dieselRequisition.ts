// types/index.ts or types/dieselRequisition.ts

export interface DieselRequisition {
  id: string;
  date: string;
  createdBy: string;
  is_approve_mic: string;
  is_approve_sic: string;
  is_approve_pm: string;
  org_id: string;
  project_id: string;
  createdAt: string;
  updatedAt: string;
  items: DieselRequisitionItem[];
  createdByEmployee: Employee;
  organisation: Organisation;
}

export interface DieselRequisitionItem {
  id: string;
  requisition_id: string;
  item: string;
  quantity: string;
  UOM: string;
  Notes: string;
  createdAt: string;
  updatedAt: string;
  consumableItem: ConsumableItem;
  unitOfMeasurement: UnitOfMeasurement;
}

export interface ConsumableItem {
  id: string;
  item_name: string;
  item_description: string;
}

export interface UnitOfMeasurement {
  id: string;
  unit_name: string;
  unit_code: string;
}

export interface Employee {
  id: string;
  emp_name: string;
}

export interface Organisation {
  id: string;
  org_name: string;
}
