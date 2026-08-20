import { atom } from "jotai";
import { IUserRolePermissionItem } from "../types/Roles";

export const rolePermissionsAtom = atom<IUserRolePermissionItem[]>([]);
