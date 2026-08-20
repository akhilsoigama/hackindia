import { Survey } from "../../../types/GovtServey";

export const surveyData: Survey[] = [
  {
    id: '1',
    title: 'Public Health Infrastructure Feedback',
    department: 'health',
    status: 'active',
    responses: 1245,
    createdAt: '2023-10-15',
    endDate: '2023-12-15',
    questions: 12,
  },
  {
    id: '2',
    title: 'Education Policy Satisfaction Survey',
    department: 'education',
    status: 'active',
    responses: 876,
    createdAt: '2023-11-01',
    endDate: '2023-12-31',
    questions: 15,
  },
  {
    id: '3',
    title: 'Transportation System Improvement',
    department: 'transport',
    status: 'draft',
    responses: 0,
    createdAt: '2023-11-20',
    endDate: '2024-02-20',
    questions: 10,
  },
];