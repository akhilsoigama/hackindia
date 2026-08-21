import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from '../../../../hooks/useRouter';
import DeleteModal from '../../../../components/common/deleteModel';
import { useAssignmentUploads, deleteAssignmentUpload } from '../../../../action/assignmentUpload';
import { IAssignmentUploadListItem } from '../../../../types/assignmentUpload';
import AssignmentUploadList from '../assignment-upload-list.tsx';

export default function AssignmentUploadListView() {
  const router = useRouter();
  const { submissions, submissionsLoading, submissionsError, submissionsMutate } = useAssignmentUploads();
  const prevSubmissionsRef = useRef<IAssignmentUploadListItem[]>([]);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    submission: IAssignmentUploadListItem | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    submission: null,
    isLoading: false,
  });

  const isLoading = useMemo(
    () => submissionsLoading || submissionsError !== undefined,
    [submissionsLoading, submissionsError]
  );

  useEffect(() => {
    if (submissions.length > 0) {
      prevSubmissionsRef.current = submissions;
    }
  }, [submissions]);

  const stableSubmissions = submissions.length > 0 ? submissions : prevSubmissionsRef.current;

  const handleEditSubmission = useCallback(
    (submission: IAssignmentUploadListItem) => {
      router.push(`/dashboard/student-upload/assignment-upload/${submission.id}/edit`);
    },
    [router]
  );

  const handleDeleteSubmission = async (id: string | number) => {
    const submissionToDelete = stableSubmissions.find((s) => s.id === String(id));
    if (!submissionToDelete) return;

    setDeleteModal({
      isOpen: true,
      submission: submissionToDelete,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.submission) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const deleted = await deleteAssignmentUpload(parseInt(deleteModal.submission.id));
      if (deleted) {
        await submissionsMutate();
        setDeleteModal({
          isOpen: false,
          submission: null,
          isLoading: false,
        });
      }
    } catch {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        submission: null,
        isLoading: false,
      });
    }
  };

  return (
    <>
      <AssignmentUploadList
        submissions={stableSubmissions}
        isLoading={isLoading}
        onEditSubmission={handleEditSubmission}
        onDeleteSubmission={handleDeleteSubmission}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Submission"
        description="This will permanently delete the assignment submission. Are you sure you want to continue?"
        itemName={deleteModal.submission?.title}
        isLoading={deleteModal.isLoading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
