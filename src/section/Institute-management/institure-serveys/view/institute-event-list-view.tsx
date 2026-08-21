import { useRouter } from "../../../../hooks/useRouter";
import { useCallback, useMemo, useState } from "react";

import { mutate } from "swr";
import { endpoints } from "../../../../utils/axios";
import DeleteModal from "../../../../components/common/deleteModel";
import { IInstituteEvent } from "../../../../types/instituteEvent";
import {
  useDeleteInstituteEvent as deleteInstituteEvent,
  useGetInstituteEvents,
} from "../../../../action/instituteEvent";
import InstituteEventList from "../institute-event-list";

const InstituteEventListView = () => {
  const routes = useRouter();
  const { instituteEvents, instituteEventsLoading, instituteEventsError } =
    useGetInstituteEvents();
  const [InstituteEvent, setInstituteEvent] = useState({
    isOpen: false,
    instituteEvent: null as IInstituteEvent | null,
    isLoading: false,
  });

  const stableInstituteEvents = useMemo(
    () => instituteEvents,
    [instituteEvents],
  );

  const handleEditInstituteEvent = useCallback(
    (instituteEvent: IInstituteEvent) => {
      routes.push(`/dashboard/institute-management/institute-event/${instituteEvent.id}/edit`);
    },
    [routes],
  );

  const handleDeleteInstituteEvent = useCallback((id: number) => {
    const eventToDelete = instituteEvents.find((evt) => evt.id === id);
    if (eventToDelete) {
      setInstituteEvent({
        isOpen: true,
        instituteEvent: eventToDelete,
        isLoading: false,
      });
    }
  }, [instituteEvents]);

  const handleConfirmDelete = useCallback(async () => {
    if (!InstituteEvent.instituteEvent) return;
    setInstituteEvent((prev) => ({ ...prev, isLoading: true }));

    try {
      const deleted = await deleteInstituteEvent(
        InstituteEvent.instituteEvent.id,
      );
      if (deleted) {
        mutate(
          endpoints?.instituteEvent.getAll,
          (currentData: { data: IInstituteEvent[] } | undefined) => {
            if (!currentData?.data) return { data: [] };

            return {
              data: currentData.data.filter(
                (d) => d.id !== InstituteEvent.instituteEvent!.id,
              ),
            };
          },
          false,
        );

        mutate(endpoints.instituteEvent.getAll);

        setInstituteEvent({
          isOpen: false,
          instituteEvent: null,
          isLoading: false,
        });
      } else {
        setInstituteEvent((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      mutate(endpoints.instituteEvent.getAll);
      setInstituteEvent((prev) => ({ ...prev, isLoading: false }));
    }
  }, [InstituteEvent.instituteEvent]);

  const handleCloseModal = useCallback(() => {
    if (!InstituteEvent.isLoading) {
      setInstituteEvent({
        isOpen: false,
        instituteEvent: null,
        isLoading: false,
      });
    }
  }, [InstituteEvent.isLoading]);

  const handleCreateInstitute = useCallback(() => {
    routes.push(`/dashboard/institute-management/institute-event/new`);
  }, [routes]);

  const isLoading = useMemo(
    () => instituteEventsLoading || instituteEventsError !== undefined,
    [instituteEventsLoading, instituteEventsError],
  );

  return (
    <div >
      <InstituteEventList
        instituteEvents={stableInstituteEvents}
        onEdit={handleEditInstituteEvent}
        onDelete={handleDeleteInstituteEvent}
        onCreate={handleCreateInstitute}
        isLoading={isLoading}
      />

      <DeleteModal
        isOpen={InstituteEvent.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Institute"
        description="This will permanently delete the Institute and all associated data."
        itemName={InstituteEvent.instituteEvent?.eventTitle}
        isLoading={InstituteEvent.isLoading}
        confirmText="Delete Institute"
        cancelText="Cancel"
      />
    </div>
  );
};

export default InstituteEventListView;
