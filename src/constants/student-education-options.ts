export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type DegreeDefinition = {
  value: string;
  label: string;
  totalSemesters: number;
};

const DEFAULT_STANDARD_VALUES = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '12 Commerce',
  'Diploma',
];

const SCHOOL_STANDARD_VALUES = ['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const DIPLOMA_STANDARD_VALUES = ['Diploma'];

export const COLLEGE_DEGREES: DegreeDefinition[] = [
  { value: 'B.A', label: 'B.A', totalSemesters: 6 },
  { value: 'B.Sc', label: 'B.Sc', totalSemesters: 6 },
  { value: 'B.Com', label: 'B.Com', totalSemesters: 6 },
  { value: 'BCA', label: 'BCA', totalSemesters: 6 },
  { value: 'BBA', label: 'BBA', totalSemesters: 6 },
  { value: 'B.Tech', label: 'B.Tech', totalSemesters: 8 },
  { value: 'M.A', label: 'M.A', totalSemesters: 4 },
  { value: 'M.Sc', label: 'M.Sc', totalSemesters: 4 },
  { value: 'M.Com', label: 'M.Com', totalSemesters: 4 },
  { value: 'MCA', label: 'MCA', totalSemesters: 4 },
  { value: 'MBA', label: 'MBA', totalSemesters: 4 },
  { value: 'M.Tech', label: 'M.Tech', totalSemesters: 4 },
];

export const COMMERCE_SPECIALIZATION_OPTIONS: DropdownOption[] = [
  { value: 'Accounts', label: 'Accounts' },
  { value: 'Banking', label: 'Banking' },
  { value: 'Business Studies', label: 'Business Studies' },
  { value: 'Economics', label: 'Economics' },
];

export const normalizeInstituteType = (instituteType?: string): string => {
  return instituteType?.trim().toLowerCase() ?? '';
};

const toOptions = (values: string[], placeholderLabel: string): DropdownOption[] => [
  { value: '', label: placeholderLabel, disabled: true },
  ...values.map((value) => ({ value, label: value })),
];

export const getCollegeDegreeOptions = (): DropdownOption[] => [
  { value: '', label: 'Select Degree', disabled: true },
  ...COLLEGE_DEGREES.map((degree) => ({ value: degree.value, label: degree.label })),
];

export const getStudentStandardOptions = (instituteType?: string): DropdownOption[] => {
  const normalizedType = normalizeInstituteType(instituteType);

  if (normalizedType === 'school') {
    return toOptions(SCHOOL_STANDARD_VALUES, 'Select Standard');
  }

  if (normalizedType === 'diploma') {
    return toOptions(DIPLOMA_STANDARD_VALUES, 'Select Standard');
  }

  if (normalizedType === 'college' || normalizedType === 'university') {
    return getCollegeDegreeOptions();
  }

  return toOptions(DEFAULT_STANDARD_VALUES, 'Select Standard');
};

export const getSemesterOptionsForDegree = (degreeValue?: string): DropdownOption[] => {
  if (!degreeValue) {
    return [{ value: '', label: 'Select Semester', disabled: true }];
  }

  const degree = COLLEGE_DEGREES.find((item) => item.value === degreeValue);
  if (!degree) {
    return [{ value: '', label: 'Select Semester', disabled: true }];
  }

  const semesters = Array.from({ length: degree.totalSemesters }, (_value, index) => {
    const semesterLabel = `Sem ${index + 1}`;
    return { value: semesterLabel, label: semesterLabel };
  });

  return [{ value: '', label: 'Select Semester', disabled: true }, ...semesters];
};

export const buildCollegeStudentStd = (degree?: string, semester?: string): string => {
  if (!degree) return '';
  if (!semester) return degree;
  return `${degree} - ${semester}`;
};

export const parseCollegeStudentStd = (studentStd?: string): { degree: string; semester: string } => {
  const rawValue = studentStd?.trim() ?? '';

  if (!rawValue) {
    return { degree: '', semester: '' };
  }

  const splitValue = rawValue.split(' - ');
  if (splitValue.length >= 2) {
    return {
      degree: splitValue[0].trim(),
      semester: splitValue.slice(1).join(' - ').trim(),
    };
  }

  const semesterMatch = rawValue.match(/^(.*)\s+(Sem\s+\d+)$/i);
  if (semesterMatch) {
    return {
      degree: semesterMatch[1].trim(),
      semester: semesterMatch[2].replace(/\s+/g, ' ').trim(),
    };
  }

  return { degree: rawValue, semester: '' };
};
