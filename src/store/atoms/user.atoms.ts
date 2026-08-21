import type { User } from '@/types/user';
import { atom } from 'jotai';
import { atomWithStorage, selectAtom } from 'jotai/utils';

export const userAtom = atomWithStorage<User | null>('lms:user', null);

export const userIdAtom = selectAtom(userAtom, (user) => user?.id ?? null);

export const isAuthenticatedAtom = selectAtom(userAtom, (user) => user !== null);

export const userPermissionsAtom = selectAtom(userAtom, (user) => user?.permissions ?? []);

export const setUserAtom = atom(null, (_get, set, user: User | null) => {
  set(userAtom, user);
});
