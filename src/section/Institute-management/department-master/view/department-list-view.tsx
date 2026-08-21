import { useState, useCallback, useEffect, useRef } from "react";
import { mutate } from "swr";
import {
  deleteDepartmentService,
  useDepartments,
} from "../../../../action/department";
import { useRouter } from "../../../../hooks/useRouter";
import { IDepartment, IUpdateDepartment } from "../../../../types/department";
import DepartmentList from "../department-list";
import DeleteModal from "../../../../components/common/deleteModel";
import { endpoints } from "../../../../utils/axios";
import { useUser } from "../../../../atoms/userAtom";
import { Translated } from "../../../../components/common/translator/translator";

const DepartmentListView = () => {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  const { departments, departmentLoading, departmentMutate } = useDepartments();
  const prevDepartmentRef = useRef<IDepartment[]>([]);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    department: IDepartment | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    department: null,
    isLoading: false,
  });
  useEffect(() => {
    if (user?.userType === "institute" && !departmentLoading) {
      departmentMutate();
    }
  }, [user, departmentLoading, departmentMutate]);
  useEffect(() => {
    if (departments.length > 0) {
      prevDepartmentRef.current = departments;
    }
  }, [departments]);

  const stableDepartments =
    departments.length > 0 ? departments : prevDepartmentRef.current;
  const handleEditDepartment = useCallback(
    (department: IUpdateDepartment) => {
      router.push(
        `/dashboard/institute-management/department/${department.id}/edit`,
      );
    },
    [router],
  );

  const handleDeleteDepartment = useCallback(
    (id: number) => {
      const departmentToDelete = stableDepartments.find((dept) => dept.id === id);
      if (!departmentToDelete) return;

      setDeleteModal({
        isOpen: true,
        department: departmentToDelete,
        isLoading: false,
      });
    },
    [stableDepartments],
  );

  const handleConfirmDelete = async () => {
    if (!deleteModal.department) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const deleted = await deleteDepartmentService(deleteModal.department.id);

      if (deleted) {
        mutate(
          endpoints.department.getAll,
          (currentData: { data: IDepartment[] } | undefined) => {
            if (!currentData?.data) return { data: [] };
            return {
              data: currentData.data.filter(
                (d) => d.id !== deleteModal.department!.id,
              ),
            };
          },
          false,
        );

        setDeleteModal({
          isOpen: false,
          department: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        department: null,
        isLoading: false,
      });
    }
  };

  const handleCreateDepartment = () => {
    router.push("/dashboard/institute-management/department/new");
  };

  return (
    <>
      <DepartmentList
        departments={stableDepartments}
        onEdit={handleEditDepartment}
        onDelete={handleDeleteDepartment}
        onCreate={handleCreateDepartment}
        isLoading={departmentLoading || userLoading}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={<Translated text="Delete Department" />}
        description={<Translated text="This will permanently delete the department and remove all associated data. Are you sure you want to continue?" />}
        itemName={deleteModal.department?.departmentName}
        isLoading={deleteModal.isLoading}
        confirmText={<Translated text="Delete Department" />}
        cancelText={<Translated text="Cancel" />}
      />
    </>
  );
};

export default DepartmentListView;
