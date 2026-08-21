import { EventNote, VerifiedUser } from '@mui/icons-material';

export const LEAVE_TYPES = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'other', label: 'Other' },
];

export const STEPS = [
  { id: 1, label: 'Leave Details', icon: EventNote },
  { id: 2, label: 'Review', icon: VerifiedUser },
];
