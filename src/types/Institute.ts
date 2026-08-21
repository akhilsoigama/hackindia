export interface IInstituteBase {
  instituteName: string;
  instituteCode: string;
  instituteType: string;
  instituteAddress: string;
  instituteCity: string;
  instituteState: string;
  instituteCountry: string;
  institutePinCode: string;
  institutePhone: string;
  instituteEmail: string;
  instituteWebsite?: string;
  principalName: string;
  principalEmail?: string;
  principalPhone?: string;
  principalQualification?: string;
  principalExperience?: string;
  establishedYear: string;
  affiliation?: string;
  campusArea?: string;
  roleId: number;
  isActive: boolean;
}

// Main Institute interface
export interface IInstitute extends IInstituteBase {
  id: number;
    role?: {
    id: number;
    roleName: string;
    roleKey: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateInstitute {
  instituteName: string;
  instituteCode: string;
  instituteType: string;
  instituteAddress: string;
  instituteCity: string;
  instituteState: string;
  instituteCountry: string;
  institutePinCode: string;
  institutePhone: string;
  instituteEmail: string;
  instituteWebsite?: string;
  principalName: string;
  principalEmail?: string;
  principalPhone?: string;
  principalQualification?: string;
  principalExperience?: string;
  establishedYear: string;
  affiliation?: string | null;
  campusArea?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface IUpdateInstitute {
  instituteName?: string;
  instituteCode?: string;
  instituteType?: string;
  instituteAddress?: string;
  instituteCity?: string;
  instituteState?: string;
  instituteCountry?: string;
  institutePinCode?: string;
  institutePhone?: string;
  instituteEmail?: string;
  instituteWebsite?: string;
  principalName?: string;
  principalEmail?: string;
  principalPhone?: string;
  principalQualification?: string;
  principalExperience?: string;
  establishedYear?: string;
  affiliation?: string;
  campusArea?: string;
  roleId?: number;
  isActive?: boolean;
}