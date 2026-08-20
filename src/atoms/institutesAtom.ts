import { atom } from 'jotai';
import { Institute } from '../types/Institute';

export const institutesAtom = atom<Institute[]>([
  {
    id: 1,
    name: "ABC University",
    code: "ABC123",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    phone: "+91-9876543210",
    email: "info@abcuniversity.edu",
    website: "https://www.abcuniversity.edu",
    principalName: "Dr. John Doe",
    principalEmail: "principal@abcuniversity.edu",
    principalContact: "+91-9123456780",
    establishedYear: 1995,
    affiliation: "State University",
    principalQualification: "PhD in Education",
    principalExperience: 25,
    status: "Active",
  }
]);
