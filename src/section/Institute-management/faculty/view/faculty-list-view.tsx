import { useState } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import DeleteModal from "../../../../components/common/deleteModel";
import FacultyList from "../faculty-list";
import { deleteFaculty, useInstituteFaculties } from "../../../../action/faculty";
import { IfacultyItem, IupdateFaculty } from "../../../../types/Faculty";
import { useUser } from "../../../../atoms/userAtom";

const FacultyListView = () => {
    const router = useRouter();
    const { isLoading: userLoading } = useUser();

    const { faculties, facultiesLoading, facultiesMutate } = useInstituteFaculties();

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        faculty: IfacultyItem | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        faculty: null,
        isLoading: false,
    });

    const stableFaculties = faculties;


    const handleEditFaculty = (faculty: IupdateFaculty) => {
        router.push(`/dashboard/institute-management/faculty/${faculty.id}/edit?instituteId=${faculty.instituteId}`);
    };

    const handleDeleteFaculty = (id: number) => {
        const facultyDelete = stableFaculties.find(f => f.id === id);
        if (!facultyDelete) return;

        setDeleteModal({
            isOpen: true,
            faculty: facultyDelete,
            isLoading: false,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.faculty) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const deleted = await deleteFaculty(deleteModal.faculty.id, deleteModal.faculty.instituteId);
            if (deleted) {
                await facultiesMutate();
                setDeleteModal({
                    isOpen: false,
                    faculty: null,
                    isLoading: false,
                });
            } else {
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        } catch {
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleCloseModal = () => {
        if (!deleteModal.isLoading) {
            setDeleteModal({
                isOpen: false,
                faculty: null,
                isLoading: false,
            });
        }
    };

    const handleCreateFaculty = () => {
        router.push('/dashboard/institute-management/faculty/new');
    };

    return (
        <div>
            <FacultyList
                faculties={stableFaculties}
                onEdit={handleEditFaculty}
                onDelete={handleDeleteFaculty}
                onCreate={handleCreateFaculty}
                isLoading={facultiesLoading || userLoading}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Faculty"
                description="This will permanently delete the Faculty and remove all associated data. Are you sure you want to continue?"
                itemName={deleteModal.faculty?.facultyName}
                isLoading={deleteModal.isLoading}
                confirmText="Delete Faculty"
                cancelText="Cancel"
            />
        </div>
    );
};

export default FacultyListView;