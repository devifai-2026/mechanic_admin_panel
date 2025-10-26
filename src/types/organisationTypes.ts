export interface Organisation {
  id: string;
  org_name: string;
  org_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganisationPostPayload {
  org_name: string;
  org_code: string;
}
