import { useState } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import DeleteModal from "../../../../components/common/deleteModel";
import MaterialList from "../materials-list";
import { deleteLecture, useGetLectures } from "../../../../action/material";
import { ILecture } from "../../../../types/material";

const MaterialsListView = () => {
    const router = useRouter();
    const { lectures, isLoading } = useGetLectures();

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        lectureId: null as number | null,
        isLoading: false,
    });

    const handleEditLecture = (lecture: ILecture) => {
        router.push(`/dashboard/faculty-management/material/${lecture.id}/edit`);
    };

    const handleDeleteLecture = (id: number) => {
        setDeleteModal({
            isOpen: true,
            lectureId: id,
            isLoading: false,
        });
    };

    const handleViewLecture = (lecture: ILecture) => {
        router.push(`/dashboard/faculty-management/material/${lecture.id}/details`)
    };


    const handleConfirmDelete = async () => {
        if (!deleteModal.lectureId) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            await deleteLecture(deleteModal.lectureId);
            setDeleteModal({
                isOpen: false,
                lectureId: null,
                isLoading: false,
            });
        } catch {
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleCloseModal = () => {
        setDeleteModal({
            isOpen: false,
            lectureId: null,
            isLoading: false,
        });
    };

    const handleCreateLecture = () => {
        router.push('/dashboard/faculty-management/material/new');
    };
    return (
        <>
            <MaterialList
                lectures={lectures}
                onEdit={handleEditLecture}
                onDelete={handleDeleteLecture}
                onCreate={handleCreateLecture}
                onView={handleViewLecture}
                isLoading={isLoading}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Lecture"
                description="This will permanently delete the lecture. Are you sure you want to continue?"
                isLoading={deleteModal.isLoading}
                confirmText="Delete Lecture"
                cancelText="Cancel"
            />

        </>
    );
};

export default MaterialsListView;