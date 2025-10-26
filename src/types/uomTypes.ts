export interface UOM {
  id: string;
  unit_code: string;
  unit_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUOMPayload {
  unit_code: string;
  unit_name: string;
}

export interface UpdateUOMPayload {
  id: string;
  unit_code?: string;
  unit_name?: string;
}
