import { atom } from "jotai";
import { Permission } from "../types/Permissions";

export const PermissionAtom = atom<Permission[]>([]);
