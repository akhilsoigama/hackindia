import { useAtomValue } from 'jotai';
import {
  userAtom,
  userIdAtom,
  isAuthenticatedAtom,
  userPermissionsAtom,
} from '../atoms/user.atoms';

export const useUserState = () => {
  const user = useAtomValue(userAtom);
  const userId = useAtomValue(userIdAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const permissions = useAtomValue(userPermissionsAtom);

  return {
    user,
    userId,
    isAuthenticated,
    permissions,
  };
};
