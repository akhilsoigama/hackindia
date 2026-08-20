// types/index.ts
export type Institute = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  code: string;
  affiliation: string;
  establishedYear: number;
  principalName: string;
  principalEmail: string;
  principalContact: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  principalQualification: string;
  principalExperience: number;
  status: 'Active' | 'Inactive';
};
