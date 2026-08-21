import { useState, useMemo, useCallback, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAssignmentUploads } from '../../../action/assignmentUpload';
import { gradeAssignmentSubmission } from '../../../action/assignmentUpload';
import { IAssignmentUploadListItem } from '../../../types/assignmentUpload';
import { toast } from 'sonner';
import { ParticleButton } from '../../../components/ui/particle-button';
import { useUser } from '../../../atoms/userAtom';
import CommonDataList from '../../../components/common/commanDataList';
import { useTheme } from '@/theme/AppThemeProvider';
interface GradingData {
  uploadId: number;
  marks: number;
  maxPoints: number;
  isGraded: boolean;
}

type SubmissionRow = IAssignmentUploadListItem & {
  statusFlag: boolean;
  playlistTitle: string;
};

const AssignmentSubmissionsPage = memo(function AssignmentSubmissionsPage() {
  const {
    submissions,
    submissionsLoading,
    submissionsMutate,
    hasAssociationError,
  } = useAssignmentUploads();
  const { user, isFacultyUser } = useUser();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [searchParams] = useSearchParams();
  const [gradingData, setGradingData] = useState<GradingData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const selectedAssignmentId = searchParams.get('assignmentId');

  const tableRows = useMemo<SubmissionRow[]>(
    () =>
      submissions.map((submission) => ({
        ...submission,
        statusFlag: submission.status === 'submitted' || submission.status === 'graded',
        playlistTitle: submission.title,
      })),
    [submissions]
  );

  const filteredRows = useMemo(
    () =>
      selectedAssignmentId
        ? tableRows.filter((row) => String(row.assignmentId) === String(selectedAssignmentId))
        : tableRows,
    [tableRows, selectedAssignmentId]
  );

  const handleUpdateMarks = useCallback(
    async (uploadId: number, marks: number) => {
      setIsUpdating(true);
      try {
        const result = await gradeAssignmentSubmission(
          uploadId,
          marks,
          true,
          typeof user?.facultyId === 'number' ? user.facultyId : undefined
        );
        if (result) {
          await submissionsMutate();
          setGradingData(null);
          toast.success('Marks updated successfully!');
        }
      } catch (error) {
        toast.error('Failed to update marks');
      } finally {
        setIsUpdating(false);
      }
    },
    [submissionsMutate, user?.facultyId]
  );

  return (
    <>
      {hasAssociationError && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Your account is logged in as faculty but is not linked to a faculty profile yet. Please contact admin to map this user to a faculty record.
        </div>
      )}
      <div className="space-y-2">
        {selectedAssignmentId && (
          <Link
            to="/dashboard/faculty-management/assignment/submissions"
            className="inline-block text-sm font-medium text-sky-600 underline"
          >
            View all submissions
          </Link>
        )}

        <CommonDataList<SubmissionRow>
          data={filteredRows}
          title="Assignment Submissions"
          subtitle={
            selectedAssignmentId
              ? `Showing submissions for students who submitted for assignment Name: ${filteredRows[0]?.playlistTitle || 'N/A'}`
              : 'View and grade student submissions.'
          }
          columns={[
            {
              header: 'Assignment',
              accessor: (item) => item.title,
              sortable: true,
            },
            {
              header: 'Student',
              accessor: (item) => item.studentName || 'Unknown Student',
              sortable: true,
            },
            {
              header: 'Submission Date',
              accessor: (item) => item.submittedDate || '-',
              sortable: true,
              render: (item) =>
                item.submittedDate
                  ? new Date(item.submittedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-',
            },
            {
              header: 'Status',
              accessor: (item) => item.status,
              sortable: true,
              render: (item) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.status === 'graded'
                      ? isDark
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-green-100 text-green-800'
                      : item.status === 'submitted'
                      ? isDark
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                      : isDark
                      ? 'bg-yellow-900/30 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'File',
              accessor: (item) => (item.assignmentFile ? 'Open File' : '-'),
              sortable: false,
              render: (item) =>
                item.assignmentFile ? (
                  <a
                    href={item.assignmentFile}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 underline"
                  >
                    Open File
                  </a>
                ) : (
                  '-'
                ),
            },
            {
              header: 'Marks',
              accessor: (item) => `${item.marks ?? '-'} / ${item.maxPoints ?? 100}`,
              sortable: false,
            },
            ...(isFacultyUser
              ? [
                  {
                    header: 'Action',
                    accessor: (item: SubmissionRow) => item.id,
                    sortable: false,
                    render: (item: SubmissionRow) => (
                      <ParticleButton
                        onClick={() =>
                          setGradingData({
                            uploadId: parseInt(String(item.id), 10),
                            marks: item.marks || 0,
                            maxPoints: item.maxPoints ?? 100,
                            isGraded: item.status === 'graded',
                          })
                        }
                        className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-700"
                      >
                        {item.status === 'graded' ? '✓ Graded' : 'Grade Now'}
                      </ParticleButton>
                    ),
                  },
                ]
              : []),
          ]}
          searchPlaceholder="Search by student, assignment, or status"
          emptyMessage="No submissions found"
          emptyDescription="Submissions will appear here when students upload assignments"
          isLoading={submissionsLoading}
          enableSearch
          enableStatusFilter
          statusFilterKey="statusFlag"
        />
      </div>

      {/* Grading Modal */}
      {gradingData && isFacultyUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg shadow-xl max-w-md w-full ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            <div
              className={`px-6 py-4 border-b ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Update Marks
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  Marks
                </label>
                <input
                  type="number"
                  min="0"
                  max={gradingData.maxPoints}
                  value={gradingData.marks}
                  onChange={(e) =>
                    setGradingData({
                      ...gradingData,
                      marks: Math.min(parseInt(e.target.value) || 0, gradingData.maxPoints),
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDark
                      ? 'border-slate-600 bg-slate-800 text-slate-100'
                      : 'border-slate-300 bg-white text-slate-900'
                  }`}
                />
                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Maximum allowed: {gradingData.maxPoints}
                </p>
              </div>
            </div>
            <div
              className={`px-6 py-4 border-t flex gap-3 justify-end ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setGradingData(null)}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                  isDark
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Cancel
              </button>
              <ParticleButton
                onClick={() => handleUpdateMarks(gradingData.uploadId, gradingData.marks)}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </ParticleButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

AssignmentSubmissionsPage.displayName = 'AssignmentSubmissionsPage';

export default AssignmentSubmissionsPage;
