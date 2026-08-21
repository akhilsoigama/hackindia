import { useEffect, useRef, useState } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import {
  deleteFacultyLeave,
  useGetFacultyLeaves,
  useFacultyLeaveMutation,
  type FacultyLeaveResponse,
} from "../../../../action/facultyLeave";
import LeaveList from "../leave-list";
import DeleteModal from "../../../../components/common/deleteModel";

export default function LeaveListView() {
  const router = useRouter();
  const { leaves, leavesLoading, leavesError } = useGetFacultyLeaves();
  const { refreshLeaves } = useFacultyLeaveMutation();

  const prevLeavesRef = useRef<FacultyLeaveResponse[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    leave: FacultyLeaveResponse | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    leave: null,
    isLoading: false,
  });

  useEffect(() => {
    if (leaves.length > 0) {
      prevLeavesRef.current = leaves;
    }
  }, [leaves]);

  const stableLeaves = leaves.length > 0 ? leaves : prevLeavesRef.current;

  const handleEdit = (leave: FacultyLeaveResponse) => {
    router.push(`/dashboard/leave-management/leave/${leave.id}/edit`);
  };

  const handleDelete = (id: number) => {
    const leaveToDelete = stableLeaves.find((leave) => leave.id === id);
    if (!leaveToDelete) return;

    setDeleteModal({
      isOpen: true,
      leave: leaveToDelete,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.leave) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const deleted = await deleteFacultyLeave(deleteModal.leave.id);
      if (deleted) {
        await refreshLeaves();
        setDeleteModal({
          isOpen: false,
          leave: null,
          isLoading: false,
        });
      } else {
        setDeleteModal((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        leave: null,
        isLoading: false,
      });
    }
  };

  const handleCreate = () => {
    router.push('/dashboard/leave-management/leave/new');
  };

  if (leavesError && stableLeaves.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">Failed to load leave applications.</div>
      </div>
    );
  }

  return (
    <>
      <LeaveList
        leaves={stableLeaves}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={leavesLoading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Leave Request"
        description="This will permanently delete the leave request. Are you sure you want to continue?"
        itemName={deleteModal.leave?.reason}
        isLoading={deleteModal.isLoading}
        confirmText="Delete Leave"
        cancelText="Cancel"
      />
    </>
  );
}
