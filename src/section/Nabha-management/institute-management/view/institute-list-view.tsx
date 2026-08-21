import { useState, useCallback, useMemo } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import DeleteModal from "../../../../components/common/deleteModel";
import InstituteList from "../Institute-list";
import { IInstitute } from "../../../../types/Institute";
import { mutate } from "swr";
import { endpoints } from "../../../../utils/axios";
import { deleteInstituteService, useInstitutes } from "../../../../action/institute";

const InstituteListView = () => {
    const router = useRouter();
    const { institutes, institutesLoading } = useInstitutes();

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        institute: null as IInstitute | null,
        isLoading: false,
    });

    const stableInstitutes = useMemo(() => institutes, [institutes]);

    const handleEditInstitute = useCallback((institute: IInstitute) => {
        router.push(`/dashboard/admin/institute/${institute.id}/edit`);
    }, [router]);

    const handleDeleteInstitute = useCallback((id: number) => {
        const instituteToDelete = stableInstitutes.find(inst => inst.id === id);
        if (!instituteToDelete) return;

        setDeleteModal({
            isOpen: true,
            institute: instituteToDelete,
            isLoading: false,
        });
    }, [stableInstitutes]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteModal.institute) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const deleted = await deleteInstituteService(deleteModal.institute.id);
            if (deleted) {
                mutate(endpoints.institute.getAll, (currentData: { data: IInstitute[] } | undefined) => {
                    if (!currentData?.data) return { data: [] };
                    return {
                        data: currentData.data.filter(d => d.id !== deleteModal.institute!.id),
                    };
                }, false);

                mutate(endpoints.institute.getAll);
                
                setDeleteModal({
                    isOpen: false,
                    institute: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Delete failed:", error);
            mutate(endpoints.institute.getAll);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    }, [deleteModal.institute]);

    const handleCloseModal = useCallback(() => {
        if (!deleteModal.isLoading) {
            setDeleteModal({
                isOpen: false,
                institute: null,
                isLoading: false,
            });
        }
    }, [deleteModal.isLoading]);

    const handleCreateInstitute = useCallback(() => {
        router.push(`/dashboard/admin/institute/new`);
    }, [router]);

    const isLoading = useMemo(() => institutesLoading, [institutesLoading]);

    return (
        <div className="">
            <InstituteList
                institutes={stableInstitutes}
                onEdit={handleEditInstitute}
                onDelete={handleDeleteInstitute}
                onCreate={handleCreateInstitute}
                isLoading={isLoading}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Institute"
                description="This will permanently delete the Institute and all associated data."
                itemName={deleteModal.institute?.instituteName}
                isLoading={deleteModal.isLoading}
                confirmText="Delete Institute"
                cancelText="Cancel"
            />
        </div>
    );
};

export default InstituteListView;