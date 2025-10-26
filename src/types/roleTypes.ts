export interface Role {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePayload {
  code: string;
  name: string;
}
