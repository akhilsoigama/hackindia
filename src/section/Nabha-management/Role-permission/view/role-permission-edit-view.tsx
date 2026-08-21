import { IUserRolePermissionItem } from "../../../../types/Roles"
import RolePermissionNewEditForm from "../role-permission-new-edit-from"

type RolePermissionEditProps = {
    currentData:IUserRolePermissionItem | undefined
}
const RolePermissionEditView = ({currentData}:RolePermissionEditProps) => {
  return (
   <RolePermissionNewEditForm currentData={currentData}/>
  )
}

export default RolePermissionEditView
