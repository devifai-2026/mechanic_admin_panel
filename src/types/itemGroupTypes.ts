export interface ItemGroup {
  id: string;
  group_name: string;
  group_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemGroupPayload {
  group_name: string;
  group_code: string;
}

export interface UpdateItemGroupPayload {
  id: string;
  group_name?: string;
  group_code?: string;
}
