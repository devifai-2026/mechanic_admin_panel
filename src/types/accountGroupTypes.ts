export interface AccountGroup {
  id: string;
  account_group_code: string;
  account_group_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountGroupPostPayload {
  account_group_code: string;
  account_group_name: string;
}
