import type { Permission } from '@/types/Permissions';
import { atom } from 'jotai';

export const permissionAtom = atom<Permission[]>([]);

// export const permissionItemsAtom = splitAtom(permissionAtom);

// export const permissionCountAtom = selectAtom(
//   permissionAtom,
//   (permissions) => permissions.length
// );

// export const permissionKeyMapAtom = atom((get) => {
//   const permissions = get(permissionAtom);

//   return new Set(
//     permissions.map(
//       (permission) => permission.permissionKey
//     )
//   );
// });