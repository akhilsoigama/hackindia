import { useState, useCallback, useMemo } from "react";
import { useRouter } from "../../../../hooks/useRouter";
import DeleteModal from "../../../../components/common/deleteModel";
import { mutate } from "swr";
import { endpoints } from "../../../../utils/axios";
import { deleteGovtEvent, useGetAllGovtEvents } from "../../../../action/govtEvent";
import { IGovtEvent } from "../../../../types/govtEvent";
import GovtEventList from "../govt-event-list";

const GovtEventListView = () => {
    const router = useRouter();
    const { govtEvents, govtEventsLoading, govtEventsError } = useGetAllGovtEvents();

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        govtEvents: null as IGovtEvent | null,
        isLoading: false,
    });

    const stableGovtEvent = useMemo(() => govtEvents, [govtEvents]);

    const handleEditGovtEvent = useCallback((govtEvent: IGovtEvent) => {
        router.push(`/dashboard/admin/govtEvent-master/${govtEvent.id}/edit`);
    }, [router]);

    const handleDeleteGovtEvent = useCallback((id: number) => {
        const instituteToDelete = stableGovtEvent.find(inst => inst.id === id);
        if (!instituteToDelete) return;

        setDeleteModal({
            isOpen: true,
            govtEvents: instituteToDelete,
            isLoading: false,
        });
    }, [stableGovtEvent]);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteModal.govtEvents) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const deleted = await deleteGovtEvent(deleteModal.govtEvents.id);
            if (deleted) {
                mutate(endpoints.govtEvent.getAll, (currentData: { data: IGovtEvent[] } | undefined) => {
                    if (!currentData?.data) return { data: [] };
                    return {
                        data: currentData.data.filter(d => d.id !== deleteModal.govtEvents!.id),
                    };
                }, false);

                mutate(endpoints.govtEvent.getAll);

                setDeleteModal({
                    isOpen: false,
                    govtEvents: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Delete failed:", error);
            mutate(endpoints.govtEvent.getAll);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    }, [deleteModal.govtEvents]);

    const handleCloseModal = useCallback(() => {
        if (!deleteModal.isLoading) {
            setDeleteModal({
                isOpen: false,
                govtEvents: null,
                isLoading: false,
            });
        }
    }, [deleteModal.isLoading]);

    const handleCreateInstitute = useCallback(() => {
        router.push(`/dashboard/admin/govtEvent-master/new`);
    }, [router]);

    const isLoading = useMemo(() =>
        govtEventsLoading || govtEventsError !== undefined,
        [govtEventsLoading, govtEventsError]
    );

    return (
        <div className="">
            <GovtEventList
                govtEvents={stableGovtEvent}
                onEdit={handleEditGovtEvent}
                onDelete={handleDeleteGovtEvent}
                onCreate={handleCreateInstitute}
                isLoading={isLoading}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Institute"
                description="This will permanently delete the Institute and all associated data."
                itemName={deleteModal.govtEvents?.eventTitle}
                isLoading={deleteModal.isLoading}
                confirmText="Delete Institute"
                cancelText="Cancel"
            />
        </div>
    );
};

export default GovtEventListView;