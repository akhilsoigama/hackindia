// types/student.ts
export type IStudent = {
    id: number;
    studentStd: string;
    studentName: string;
    studentGrNo: number;
    studentGender: 'Male' | 'Female' | 'Other' | undefined;
    studentEmail: string;
    studentMobile: string;
    roleId: number;
    studentDob: string;
    departmentId: number;
    instituteId: number;
    studentId: string;
    studentAddress?: string;
    studentCity?: string;
    studentState?: string;
    studentAddmissionDate?: Date;
    studentCountry?: string;
    studentPincode?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy?: number;
    created_by?: number;
    updatedBy?: number;
    updated_by?: number;
    
    department?: {
        id: number;
        departmentName: string;
    };
    
    role?: {
        id: number;
        roleName: string;
        roleDescription: string;
        roleKey: string;

    };
    
    institute?: {
        id: number;
        instituteName: string;
    };
};

export type IcreateStudent = {
    studentName: string;
    studentStd: string;
    studentGrNo: number;
    studentGender: 'Male' | 'Female' | 'Other' | undefined;
    studentEmail: string;
    studentMobile: string;
    roleId?: number;
    studentAddress?: string;
    studentCity?: string;
    studentState?: string;
    studentCountry?: string;
    studentPincode?: string;
    departmentId: number;
    studentAddmissionDate: string; 
    studentId: string;
    studentDob: string; 
    instituteId: number;
    isActive: boolean;
};

export type IupdateStudent = {
    id:number;
    studentName?: string;
    studentStd?: string;
    studentGrNo?: number;
    studentGender?: 'Male' | 'Female' | 'Other';
    studentEmail?: string;
    studentMobile?: string;
    studentAddress?: string;
    studentCity?: string;
    studentState?: string;
    studentCountry?: string;
    studentPincode?: string;
    studentAddmissionDate?: string; 
    roleId?: number;
    departmentId?: number;
    studentId?: string;
    studentDob?: string; 
    instituteId?: number;
    isActive?: boolean;
};