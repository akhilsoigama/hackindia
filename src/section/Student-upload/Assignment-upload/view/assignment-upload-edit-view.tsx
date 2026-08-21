import { IAssignmentUploadListItem } from '@/types/assignmentUpload';
import AssignmentUploadNewEditForm from '../assignment-upload-new-edit-form';

interface AssignmentUploadEditViewProps {
  currentData?: IAssignmentUploadListItem | null;
}

export default function AssignmentUploadEditView({
  currentData,
}: AssignmentUploadEditViewProps) {
  return <AssignmentUploadNewEditForm currentData={currentData} />;
}
