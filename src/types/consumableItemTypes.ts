export interface ItemPostPayload {
  item_code: string;
  item_name: string;
  item_description: string;
  product_type: string;
  item_group_id: string;
  item_make: string;
  unit_of_measurement: string;
  item_qty_in_hand: number;
  item_avg_cost: number;
  inventory_account_code: string;
  expense_account_code: string;
  revenue_account_code: string;
  hsn_number: string;
}

export interface Item {
  id: string;
  item_code: string;
  item_name: string;
  item_description: string;
  product_type: string;
  item_group_id: string;
  item_make: string;
  unit_of_measurement: string;
  item_qty_in_hand: number;
  item_avg_cost: number;
  inventory_account_code: string;
  expense_account_code: string;
  revenue_account_code: string;
  hsn_number: string;
  createdAt: string;
  updatedAt: string;
  itemGroup: ItemGroup;
  oem: OEM;
  uom: UOM;
  inventoryAccount: Account;
  expenseAccount: Account;
  revenueAccount: RevenueAccount;
}

export interface ItemGroup {
  id: string;
  group_name: string;
  group_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface OEM {
  id: string;
  oem_name: string;
  oem_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface UOM {
  id: string;
  unit_code: string;
  unit_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_group: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueAccount {
  id: string;
  revenue_code: string;
  revenue_description: string;
  revenue_value: number;
  createdAt: string;
  updatedAt: string;
}
