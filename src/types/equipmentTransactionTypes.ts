// src/types/equipmentTransactionTypes.ts

export interface EquipmentTransaction {
  id: string;
  project_id: string;
  date: string;
  createdBy: string;
  data_type: string;
  type: string;
  partner: string | null;
  is_approve_pm: string;
  is_invoiced: string;
  createdAt: string;
  updatedAt: string;
  partnerDetails: {
    id: string;
    partner_name: string;
    partner_address: string;
    partner_gst: string;
    partner_geo_id: string;
    state: string;
    city: string;
    pincode: string;
    isCustomer: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
  project: {
    id: string;
    project_no: string;
    customer_id: string;
    order_no: string;
    contract_start_date: string;
    contract_end_date: string;
    createdAt: string;
    updatedAt: string;
  };
  formItems: {
    id: string;
    equipment_transaction_id: string;
    equipment: string;
    qty: number;
    uom: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    consumableItem: {
      id: string;
      item_code: string;
      item_name: string;
      item_description: string;
      product_type: string;
      item_group_id: string;
      item_make: string;
      unit_of_measurement: string;
      item_qty_in_hand: number;
      hsn_number: string | null;
      item_avg_cost: number;
      inventory_account_code: string;
      expense_account_code: string;
      revenue_account_code: string;
      createdAt: string;
      updatedAt: string;
    };
    unitOfMeasure: {
      id: string;
      unit_code: string;
      unit_name: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
}
