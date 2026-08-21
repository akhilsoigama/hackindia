import { useEffect } from "react";
import { RolePermissionCreateView } from "../../../section/nabha-management/role-permission/view";

const RolePermissionCreatePage = () => {
    useEffect(() => {
        document.title = `RuralSpark: Create New User Role Permission`;
    }, []);
    return (<RolePermissionCreateView/>)
}

export default RolePermissionCreatePage
