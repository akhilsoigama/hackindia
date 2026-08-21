import { memo, useCallback, useMemo } from 'react';
import CommonDataList from '../../../components/common/commanDataList';
import type { ModalField } from '../../../components/common/commanDataList';
import type { IAssignmentUploadListItem } from '../../../types/assignmentUpload';

type AssignmentUploadRow = IAssignmentUploadListItem & {
  statusFlag: boolean;
};

interface AssignmentUploadListProps {
  submissions?: IAssignmentUploadListItem[];
  isLoading?: boolean;
  onEditSubmission?: (submission: IAssignmentUploadListItem) => void;
  onDeleteSubmission?: (id: string) => Promise<void>;
}

const AssignmentUploadList = memo(function AssignmentUploadList({
  submissions = [],
  isLoading = false,
  onEditSubmission,
  onDeleteSubmission,
}: AssignmentUploadListProps) {
  const tableRows = useMemo<AssignmentUploadRow[]>(
    () =>
      submissions.map((submission) => ({
        ...submission,
        statusFlag: submission.status === 'submitted' || submission.status === 'graded',
      })),
    [submissions]
  );

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (!onDeleteSubmission) {
        return;
      }
      await onDeleteSubmission(String(id));
    },
    [onDeleteSubmission]
  );

  const viewModalFields = useMemo<ModalField<AssignmentUploadRow>[]>(
    () => [
      { label: 'Assignment Title', key: 'title', type: 'text', disabled: true },
      { label: 'Subject', key: 'subject', type: 'text', disabled: true },
      {
        label: 'Submission Date',
        type: 'custom',
        render: (_value, data) =>
          data.submittedDate
            ? new Date(data.submittedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '-',
      },
      { label: 'Status', key: 'status', type: 'text', disabled: true },
      {
        label: 'File URL',
        type: 'custom',
        render: (_value, data) =>
          data.assignmentFile ? (
            <a
              href={data.assignmentFile}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 underline"
            >
              Open submitted file
            </a>
          ) : (
            '-'
          ),
      },
      { label: 'Marks', key: 'marks', type: 'text', disabled: true },
      { label: 'Grade', key: 'grad', type: 'text', disabled: true },
      { label: 'Faculty', key: 'facultyName', type: 'text', disabled: true },
      { label: 'Comments', key: 'comments', type: 'textarea', disabled: true },
    ],
    []
  );

  return (
    <CommonDataList<AssignmentUploadRow>
      data={tableRows}
      title="Assignment Submissions"
      subtitle="View and manage your assignment submissions"
      columns={[
        {
          header: 'Title',
          accessor: (item) => item.title,
          sortable: true,
          render: (item) => {
            const maxLength = 30;
            if (item.title && item.title.length > maxLength) {
              return <span title={item.title}>{item.title.substring(0, maxLength)}...</span>;
            }
            return item.title;
          },
        },
        {
          header: 'Subject',
          accessor: (item) => item.subject,
          sortable: true,
        },
        {
          header: 'Submission Date',
          accessor: (item) => item.submittedDate || '-',
          sortable: true,
          render: (item) => {
            if (!item.submittedDate) return '-';
            return new Date(item.submittedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
          },
        },
        {
          header: 'Faculty',
          accessor: (item) => item.facultyName || 'N/A',
          sortable: true,
        },
        {
          header: 'Status',
          accessor: (item) => item.status,
          sortable: true,
        },
      ]}
      onEdit={onEditSubmission}
      onDelete={handleDelete}
      createButtonText="Upload Assignment"
      searchPlaceholder="Search by assignment, course, or instructor"
      emptyMessage="No submissions found"
      emptyDescription="Submit an assignment to see it listed here"
      isLoading={isLoading}
      viewModalFields={viewModalFields}
      enableSearch
      enableStatusFilter
      statusFilterKey="statusFlag"
    />
  );
});

export default AssignmentUploadList;
