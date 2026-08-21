import { useEffect } from "react";
import { RolePermissionListView } from "../../../section/nabha-management/role-permission/view";

const RolePermissionListPage = () => {
    useEffect(() => {
        document.title = `RuralSpark: List User Role Permission`;
    }, []);
    return (<RolePermissionListView />)
}

export default RolePermissionListPage
