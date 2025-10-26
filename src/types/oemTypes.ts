
export interface OEM {
  id: string;
  oem_name: string;
  oem_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOEMPayload {
  oem_name: string;
  oem_code: string;
}

export interface UpdateOemPayload {
  id: string;
  oem_name?: string;
  oem_code?: string;
}
