export interface AccountGroupRef {
  id: string;
  account_group_name: string;
  account_group_code: string;
}

export interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_group: string; // UUID
  createdAt: string;
  updatedAt: string;
  group?: AccountGroupRef; // Populated group object if present
}

export interface CreateAccountPayload {
  account_code: string;
  account_name: string;
  account_group: string;
}

export interface UpdateAccountPayload {
  id: string;
  account_code?: string;
  account_name?: string;
  account_group?: string;
}