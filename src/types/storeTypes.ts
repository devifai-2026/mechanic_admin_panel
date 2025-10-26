export interface Store {
  id: string;
  store_code: string;
  store_location: string;
  store_name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorePayload {
  store_code: string;
  store_location: string;
  store_name?: string;
}
