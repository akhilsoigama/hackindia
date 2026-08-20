export type Survey = {
  id: string;
  title: string;
  department: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  responses: number;
  createdAt: string;
  endDate: string;
  questions: number;
}