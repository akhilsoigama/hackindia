import { useEffect, useMemo, useState } from "react";
import { useParams } from "../../../hooks/useParams";
import { useGetUserRolePermission } from "../../../action/RollPermission";
import { RolePermissionEditView } from "../../../section/nabha-management/role-permission/view";
import { IUserRolePermissionItem } from "../../../types/Roles";
import { Translated } from "../../../components/common/translator/translator";

const RolePermissionEditPage = () => {
  const { id } = useParams();
  const roleId = id ? Number(id) : null;

  const {
    userRolePermission,
    isLoading,
    userRolePermissionError,
    isOffline,
  } = useGetUserRolePermission(roleId ?? 0);

  const [localData, setLocalData] = useState<IUserRolePermissionItem | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.title = "Dashboard: Edit User Role Permission | Institute Management System";
  }, []);

  useEffect(() => {
    if (!roleId) return;

    (async () => {
      try {
        const db = await import("../../../indexDB/rolePermission");
        const local = await db.getRolePermissionsDB();
        const match = local.find((p: IUserRolePermissionItem) => p.id === roleId);
        if (match) setLocalData(match);
      } catch (err) {
        console.warn(`${<Translated text="Local DB read failed"/>}`, err);
      } finally {
        setIsReady(true);
      }
    })();
  }, [roleId]);

  const currentRole = useMemo(() => {
    if (userRolePermission) return userRolePermission;
    if (localData) return localData;
    return null;
  }, [userRolePermission, localData]);

  if (!isReady || (isLoading && !currentRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isOffline ? <Translated text="Offline mode - loading local data..."/> : <Translated text="Loading role data..."/>}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (userRolePermissionError && !currentRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            <Translated text="Failed to load role data"/>
          </h2>
          <p className="text-gray-600 mb-4">
            <Translated text={`${userRolePermissionError?.message || "Please check your connection"}`}/>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            <Translated text="Retry"/>
          </button>
        </div>
      </div>
    );
  }

  // ✅ Fallback for missing data
  if (!currentRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-gray-600">
          <Translated text="No role permission data found for this ID."/>
        </p>
      </div>
    );
  }

  return <RolePermissionEditView currentData={currentRole} />;
};

export default RolePermissionEditPage;
