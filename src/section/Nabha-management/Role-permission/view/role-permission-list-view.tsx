import { useState } from 'react'
import { deleteUserRolePermission, useGetUserRolePermissions } from '../../../../action/RollPermission'
import { useRouter } from '../../../../hooks/useRouter'
import { IUpdateUserRolePermission, IUserRolePermissionItem } from '../../../../types/Roles'
import { mutate } from 'swr'
import { endpoints } from '../../../../utils/axios'
import DeleteModal from '../../../../components/common/deleteModel'
import RolePermissionList from '../role-permission-list'

const RolePermissionListView = () => {
    const router = useRouter()
    const { userRolePermissions, isLoading } = useGetUserRolePermissions()

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        rolePermission: IUserRolePermissionItem | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        rolePermission: null,
        isLoading: false,  
    });
    const handleEditRolePermission = (RolePermission: IUpdateUserRolePermission) => {
        router.push(`/dashboard/core-management/rolePermission/${RolePermission.id}/edit`)
    };

    const handleDeleteRolePermission = (id: number) => {
        const rolePermissionDelete = userRolePermissions.find(fect => fect.id === id);
        if (!rolePermissionDelete) return;

        setDeleteModal({
            isOpen: true,
            rolePermission: rolePermissionDelete,
            isLoading: false,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.rolePermission) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const deleted = await deleteUserRolePermission(deleteModal.rolePermission.id);

            if (deleted) {
                mutate(endpoints.role.getAll, (currentData: { data: IUserRolePermissionItem[] } | undefined) => {
                    if (!currentData?.data) return { data: [] };
                    return {
                        data: currentData.data.filter(d => d.id !== deleteModal.rolePermission!.id),
                    };
                }, false);

                setDeleteModal({
                    isOpen: false,
                    rolePermission: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Delete failed:', error);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };
    const handleCloseModal = () => {
        if (!deleteModal.isLoading) {
            setDeleteModal({
                isOpen: false,
                rolePermission: null,
                isLoading: false,
            });
        }
    };

    const handleCreateRolePermission = () => {
        router.push('/dashboard/core-management/rolePermission/new')
    };
    return (
        <>
            <RolePermissionList
                rolePermissions={userRolePermissions}
                onEdit={handleEditRolePermission}
                onDelete={handleDeleteRolePermission}
                onCreate={handleCreateRolePermission}
                isLoading={isLoading}
            />
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Faculty"
                description="This will permanently delete the Faculty and remove all associated data. Are you sure you want to continue?"
                itemName={deleteModal.rolePermission?.roleName}
                isLoading={deleteModal.isLoading}
                confirmText="Delete Faculty"
                cancelText="Cancel"
            />
        </>
    )
}

export default RolePermissionListView
