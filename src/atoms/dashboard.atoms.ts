import { atom } from 'jotai';
import { atomWithStorage, selectAtom } from 'jotai/utils';
import { userAtom } from './userAtom';
import {
  STATS_DATA,
  ACTIVITIES_DATA,
  DEADLINES_DATA,
  PROGRESS_DATA,
  QUICK_ACTIONS_DATA,
} from '../constants/dashboard.constants';

export type DashboardTheme = 'light' | 'dark';

export const dashboardThemeAtom = atomWithStorage<DashboardTheme>('theme', 'light');

export const userDisplayNameAtom = selectAtom(
  userAtom,
  (user) => user?.data?.fullName || user?.fullName || 'Student',
);

export const userProfileSummaryAtom = selectAtom(userAtom, (user) => ({
  roleName: user?.roleName || 'Learner',
  permissionsCount: user?.permissions?.length ?? 0,
}));

export const dashboardStatsAtom = atom(() => STATS_DATA);

export const dashboardActivitiesAtom = atom(() => ACTIVITIES_DATA);

export const dashboardDeadlinesAtom = atom(() => DEADLINES_DATA);

export const dashboardProgressAtom = atom(() => PROGRESS_DATA);

export const dashboardQuickActionsAtom = atom(() => QUICK_ACTIONS_DATA);
