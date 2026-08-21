import React, { memo, useMemo, useState } from 'react';
import {
    AccountCircle,
    Business,
    CalendarToday,
    CheckCircle,
    Contrast,
    Edit,
    Email,
    Language,
    LocationOn,
    Notifications,
    Palette,
    Person,
    Phone,
    QrCode2,
    Security,
    School,
    Settings,
    Shield,
    VerifiedUser,
    WarningAmber,
    type SvgIconComponent,
} from '@mui/icons-material';
import { useUser } from '../atoms/userAtom';
import { useTheme } from '@/theme/AppThemeProvider';
import { type User, type UserAuthType } from '../types/user';
import { Translated } from "../components/common/translator/translator";

type ProfileTabKey = 'overview' | 'security' | 'institute' | 'faculty' | 'preferences';

interface UserProfileProps {
    user?: User | null;
    onEditProfile?: () => void;
    onSecuritySettings?: () => void;
    className?: string;
}

interface NormalizedUser extends User {
    permissions: string[];
    roles: string[];
}

interface StatCardProps {
    icon: SvgIconComponent;
    label: string;
    value: string;
    accentClass: string;
    isDark: boolean;
}

interface FeatureCardProps {
    icon: SvgIconComponent;
    title: string;
    description: string;
    value: string;
    isDark: boolean;
    onClick?: () => void;
}

interface TabItem {
    key: ProfileTabKey;
    label: string;
    icon: SvgIconComponent;
    count?: number;
}

interface TabNavigationProps {
    activeTab: ProfileTabKey;
    isDark: boolean;
    tabs: TabItem[];
    onChange: (tab: ProfileTabKey) => void;
}

interface ProfileHeaderProps {
    user: NormalizedUser;
    isDark: boolean;
    roleLabel: string;
    verificationLabel: string;
    verificationTone: string;
    initials: string;
}

interface PermissionListProps {
    permissions: string[];
    roles: string[];
    isDark: boolean;
}

interface InstituteCardProps {
    user: NormalizedUser;
    isDark: boolean;
    isInstituteUser: boolean;
}

interface FacultyCardProps {
    user: NormalizedUser;
    isDark: boolean;
    isFacultyUser: boolean;
}

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

const cardClass = (isDark: boolean) =>
    cn(
        'rounded-2xl border backdrop-blur-sm shadow-sm',
        isDark ? 'border-white/10 bg-slate-900/80 shadow-black/30' : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
    );

const subduedTextClass = (isDark: boolean) => (isDark ? 'text-gray-200' : 'text-gray-500');
const primaryTextClass = (isDark: boolean) => (isDark ? 'text-gray-100' : 'text-gray-900');

const statusTone = (value: boolean) =>
    value
        ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
        : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300';

const roleToneMap: Record<UserAuthType, string> = {
    super_admin: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    institute: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    faculty: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    student: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    admin: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    jwt: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
};

const formatDisplayDate = (value?: string) => {
    if (!value) return 'Unknown';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const toTitle = (value?: string) => {
    if (!value) return 'Unknown';

    return value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const getInitials = (name?: string) => {
    if (!name) return 'U';

    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
};

const normalizePermissions = (candidate: User | null | undefined): string[] => {
    const nestedPermissions = candidate?.data?.permissions;

    if (Array.isArray(nestedPermissions)) {
        return nestedPermissions;
    }

    if (nestedPermissions && typeof nestedPermissions === 'object') {
        return Object.entries(nestedPermissions)
            .filter(([, enabled]) => Boolean(enabled))
            .map(([key]) => key);
    }

    return Array.isArray(candidate?.permissions) ? candidate.permissions : [];
};

const normalizeRoles = (candidate: User | null | undefined): string[] => {
    const nestedRoles = candidate?.data?.roles;
    if (Array.isArray(nestedRoles)) return nestedRoles;
    return Array.isArray(candidate?.roles) ? candidate.roles : [];
};

const StatCard = memo(function StatCard({ icon: Icon, label, value, accentClass, isDark }: StatCardProps) {
    return (
        <div
            className={cn(
                cardClass(isDark),
                'group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5',
                isDark ? 'hover:border-white/20 hover:bg-slate-900/95' : 'hover:border-slate-300 hover:bg-white'
            )}
        >
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80',
                    isDark ? 'bg-white/20' : 'bg-slate-300/60'
                )}
            />
            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className={cn('text-xs font-semibold uppercase tracking-[0.08em]', isDark ? 'text-slate-300' : 'text-slate-500')}>{label}</p>
                    <p className={cn('mt-2 truncate text-xl font-semibold sm:text-2xl', isDark ? 'text-white' : 'text-slate-900')}>{value}</p>
                </div>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg', accentClass)}>
                    <Icon className="text-white" fontSize="small" />
                </div>
            </div>
        </div>
    );
});

const FeatureCard = memo(function FeatureCard({ icon: Icon, title, description, value, isDark, onClick }: FeatureCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                cardClass(isDark),
                'w-full p-5 text-left transition-colors duration-150',
                isDark ? 'hover:border-gray-600 hover:bg-gray-900/90' : 'hover:border-blue-200 hover:bg-blue-50/40'
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                    <Icon className="text-white" fontSize="small" />
                </div>
                <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700')}>
                    {value}
                </span>
            </div>
            <h3 className={cn('mt-4 text-sm font-semibold', primaryTextClass(isDark))}>{title}</h3>
            <p className={cn('mt-2 text-sm leading-6', subduedTextClass(isDark))}>{description}</p>
        </button>
    );
});

const ProfileHeader = memo(function ProfileHeader({ user, isDark, roleLabel, verificationLabel, verificationTone, initials }: ProfileHeaderProps) {
    return (
        <section className={cn(cardClass(isDark), 'relative overflow-hidden p-6 sm:p-7')}>
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-0',
                    isDark
                        ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.22),transparent_45%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.2),transparent_40%)]'
                        : 'bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.12),transparent_40%)]'
                )}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div
                    className={cn(
                        'flex items-center gap-4 rounded-2xl border p-4 sm:gap-5 sm:p-5',
                        isDark ? 'border-white/10 bg-slate-950/60' : 'border-slate-200/70 bg-white/75'
                    )}
                >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-sky-500 via-blue-600 to-indigo-700 text-2xl font-semibold text-white shadow-xl sm:h-24 sm:w-24 sm:text-3xl">
                        {initials}
                    </div>
                    <div>
                        <h1 className={cn('text-2xl font-semibold tracking-tight sm:text-3xl', isDark ? 'text-slate-50' : 'text-slate-900')}>
                            {user.fullName || 'Unnamed User'}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', roleToneMap[(user.userType || user.authType || 'jwt') as UserAuthType] || roleToneMap.jwt)}>
                                {roleLabel}
                            </span>
                            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusTone(Boolean(user.isActive)))}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={cn('rounded-full px-3 py-1 text-xs font-medium', verificationTone)}>
                                {verificationLabel}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className={cn('flex items-center gap-3 rounded-xl border px-4 py-3', isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200/80 bg-white/80')}>
                        <Email className={cn(isDark ? 'text-sky-300' : 'text-sky-600')} fontSize="small" />
                        <div>
                            <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Email</p>
                            <p className={cn('text-sm font-medium', primaryTextClass(isDark))}>{user.email || 'Not added'}</p>
                        </div>
                    </div>
                    <div className={cn('flex items-center gap-3 rounded-xl border px-4 py-3', isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200/80 bg-white/80')}>
                        <Phone className={cn(isDark ? 'text-blue-300' : 'text-blue-600')} fontSize="small" />
                        <div>
                            <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Mobile</p>
                            <p className={cn('text-sm font-medium', primaryTextClass(isDark))}>{user.mobile || 'Not added'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

const TabNavigation = memo(function TabNavigation({ activeTab, isDark, tabs, onChange }: TabNavigationProps) {
    return (
        <nav className={cn('flex flex-wrap gap-2 border-b px-4 py-4 sm:px-6', isDark ? 'border-white/10 bg-slate-900/35' : 'border-slate-200/80 bg-white/45')}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.key === activeTab;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 ease-in-out',
                            active
                                ? isDark
                                    ? 'border-sky-400/50 bg-sky-500/15 text-sky-100 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.3)] shadow-sky-900/30'
                                    : 'border-sky-400/60 bg-sky-100/70 text-sky-700 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.5)] shadow-sky-200/40'
                                : isDark
                                    ? 'border-slate-700/60 bg-slate-950/40 text-slate-400 hover:border-slate-600 hover:bg-slate-900/60 hover:text-slate-200'
                                    : 'border-slate-300/60 bg-slate-100/40 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800'
                        )}
                    >
                        <Icon fontSize="small" />
                        <span>{tab.label}</span>
                        {typeof tab.count === 'number' && tab.count > 0 ? (
                            <span className={cn('rounded-full border px-2 py-0.5 text-xs transition-all duration-300', active ? (isDark ? 'border-sky-400/40 bg-sky-500/20 text-sky-100 shadow-sm shadow-sky-900/20' : 'border-sky-300/60 bg-sky-200/60 text-sky-700 shadow-sm shadow-sky-200/30') : isDark ? 'border-slate-700 bg-slate-800/60 text-slate-300' : 'border-slate-300 bg-slate-200/50 text-slate-700')}>
                                {tab.count}
                            </span>
                        ) : null}
                    </button>
                );
            })}
        </nav>
    );
});

const PermissionList = memo(function PermissionList({ permissions, roles, isDark }: PermissionListProps) {
    return (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <section className={cn(cardClass(isDark), 'p-6')}>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className={cn('text-lg font-semibold', primaryTextClass(isDark))}>Permissions</h2>
                        <p className={cn('mt-1 text-sm', subduedTextClass(isDark))}>Access granted to this account</p>
                    </div>
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700')}>
                        {permissions.length}
                    </span>
                </div>

                {permissions.length === 0 ? (
                    <div className={cn('mt-6 rounded-xl border border-dashed p-6 text-center', isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500')}>
                        No permissions assigned.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                        {permissions.map((permission) => (
                            <div
                                key={permission}
                                className={cn('flex items-center gap-3 rounded-xl border px-4 py-3', isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50')}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500">
                                    <CheckCircle className="text-white" fontSize="small" />
                                </div>
                                <div>
                                    <p className={cn('text-sm font-medium capitalize', primaryTextClass(isDark))}>{permission.split('_').join(' ')}</p>
                                    <p className={cn('text-xs', subduedTextClass(isDark))}>Enabled</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-6">
                <div className={cn(cardClass(isDark), 'p-6')}>
                    <h3 className={cn('text-lg font-semibold', primaryTextClass(isDark))}>Roles</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {roles.length === 0 ? (
                            <span className={cn('text-sm', subduedTextClass(isDark))}>No roles assigned.</span>
                        ) : (
                            roles.map((role) => (
                                <span
                                    key={role}
                                    className={cn('rounded-full px-3 py-1 text-xs font-medium', isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700')}
                                >
                                    {toTitle(role)}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
});

const InstituteCard = memo(function InstituteCard({ user, isDark, isInstituteUser }: InstituteCardProps) {
    const institute = user.institute;

    if (!institute) {
        return (
            <div className={cn(cardClass(isDark), 'p-8 text-center')}>
                <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-2xl', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                    <Business className={cn(isDark ? 'text-gray-400' : 'text-gray-500')} />
                </div>
                <h3 className={cn('mt-4 text-lg font-semibold', primaryTextClass(isDark))}>No institute linked</h3>
                <p className={cn('mx-auto mt-2 max-w-md text-sm leading-6', subduedTextClass(isDark))}>
                    {isInstituteUser ? 'Your institute profile is not configured yet.' : 'This account is not currently associated with an institute.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className={cn(cardClass(isDark), 'p-6')}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className={cn('text-xl font-semibold', primaryTextClass(isDark))}>{institute.instituteName || 'Institute'}</h2>
                        <p className={cn('mt-1 text-sm', subduedTextClass(isDark))}>{institute.instituteCode || 'No institute code'}</p>
                    </div>
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-700')}>
                        {institute.establishedYear || 'Year N/A'}
                    </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className={cn('rounded-xl border p-4', isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50')}>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Contact</p>
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Email fontSize="small" className={subduedTextClass(isDark)} />
                                <span className={primaryTextClass(isDark)}>{institute.instituteEmail || 'No email added'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone fontSize="small" className={subduedTextClass(isDark)} />
                                <span className={primaryTextClass(isDark)}>{institute.institutePhone || 'No phone added'}</span>
                            </div>
                        </div>
                    </div>

                    <div className={cn('rounded-xl border p-4', isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50')}>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Address</p>
                        <div className="mt-3 flex items-start gap-2 text-sm">
                            <LocationOn fontSize="small" className={subduedTextClass(isDark)} />
                            <span className={primaryTextClass(isDark)}>{institute.instituteAddress || 'No address added'}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={cn(cardClass(isDark), 'p-6')}>
                <h3 className={cn('text-lg font-semibold', primaryTextClass(isDark))}>Institute profile</h3>
                <div className="mt-5 space-y-4 text-sm">
                    <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Website</p>
                        <p className={cn('mt-1 flex items-center gap-2', primaryTextClass(isDark))}>
                            <Language fontSize="small" />
                            {institute.instituteWebsite || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Affiliation</p>
                        <p className={cn('mt-1', primaryTextClass(isDark))}>{institute.affiliation || 'Not provided'}</p>
                    </div>
                </div>
            </section>
        </div>
    );
});

const FacultyCard = memo(function FacultyCard({ user, isDark, isFacultyUser }: FacultyCardProps) {
    const faculty = user.faculty;

    if (!faculty) {
        return (
            <div className={cn(cardClass(isDark), 'p-8 text-center')}>
                <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-2xl', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                    <School className={cn(isDark ? 'text-gray-400' : 'text-gray-500')} />
                </div>
                <h3 className={cn('mt-4 text-lg font-semibold', primaryTextClass(isDark))}>No faculty linked</h3>
                <p className={cn('mx-auto mt-2 max-w-md text-sm leading-6', subduedTextClass(isDark))}>
                    {isFacultyUser ? 'Your faculty profile is not configured yet.' : 'This account is not currently associated with a faculty record.'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <section className={cn(cardClass(isDark), 'p-6')}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className={cn('text-xl font-semibold', primaryTextClass(isDark))}>{faculty.facultyName || 'Faculty'}</h2>
                        <p className={cn('mt-1 text-sm', subduedTextClass(isDark))}>{faculty.facultyCode || 'No faculty code'}</p>
                    </div>
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', statusTone(Boolean(faculty.isActive)))}>
                        {faculty.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className={cn('rounded-xl border p-4', isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50')}>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Faculty email</p>
                        <p className={cn('mt-2 text-sm', primaryTextClass(isDark))}>{faculty.facultyEmail || 'Not provided'}</p>
                    </div>
                    <div className={cn('rounded-xl border p-4', isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50')}>
                        <p className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}>Faculty phone</p>
                        <p className={cn('mt-2 text-sm', primaryTextClass(isDark))}>{faculty.facultyPhone || 'Not provided'}</p>
                    </div>
                </div>
            </section>

            <section className={cn(cardClass(isDark), 'p-6')}>
                <h3 className={cn('text-lg font-semibold', primaryTextClass(isDark))}>Faculty description</h3>
                <p className={cn('mt-4 text-sm leading-7', subduedTextClass(isDark))}>
                    {faculty.facultyDescription || 'No faculty description has been added yet.'}
                </p>
            </section>
        </div>
    );
});

const UserProfile: React.FC<UserProfileProps> = ({ user: providedUser, onEditProfile, onSecuritySettings, className = '' }) => {
    const [activeTab, setActiveTab] = useState<ProfileTabKey>('overview');
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const { user, isFacultyUser, isInstitute } = useUser();

    const userData = useMemo<NormalizedUser | null>(() => {
        const source = providedUser ?? user;
        if (!source) return null;

        const nested = source.data;
        return {
            ...source,
            ...nested,
            authType: nested?.authType ?? source.authType,
            userType: nested?.userType ?? source.userType,
            roleName: String(nested?.roleName ?? source.roleName ?? ''),
            institute: (nested?.institute as User['institute']) ?? source.institute,
            faculty: (nested?.faculty as User['faculty']) ?? source.faculty,
            permissions: normalizePermissions(source),
            roles: normalizeRoles(source),
        };
    }, [providedUser, user]);

    const verificationLabel = useMemo(() => {
        if (!userData) return 'Unknown';
        if (userData.isEmailVerified && userData.isMobileVerified) return 'Fully verified';
        if (userData.isEmailVerified) return 'Email verified';
        if (userData.isMobileVerified) return 'Mobile verified';
        return 'Unverified';
    }, [userData]);

    const verificationTone = useMemo(() => {
        if (!userData) return isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700';
        if (userData.isEmailVerified && userData.isMobileVerified) return isDark ? 'bg-green-500/15 text-green-300' : 'bg-green-100 text-green-700';
        if (userData.isEmailVerified || userData.isMobileVerified) return isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100 text-amber-700';
        return isDark ? 'bg-red-500/15 text-red-300' : 'bg-red-100 text-red-700';
    }, [isDark, userData]);

    const roleLabel = useMemo(() => {
        if (!userData) return 'Unknown';
        return userData.roleName || toTitle(userData.userType || userData.authType || 'jwt');
    }, [userData]);

    const initials = useMemo(() => getInitials(userData?.fullName), [userData?.fullName]);

    const securityScore = useMemo(() => {
        if (!userData) return 0;
        let score = 30;
        if (userData.isEmailVerified) score += 20;
        if (userData.isMobileVerified) score += 20;
        if (userData.permissions.length > 0) score += 15;
        if (userData.roles.length > 0) score += 15;
        return Math.min(score, 100);
    }, [userData]);

    const stats = useMemo<StatCardProps[]>(() => {
        if (!userData) return [];

        return [
            {
                icon: Shield,
                label: 'Account Status',
                value: userData.isActive ? 'Active' : 'Inactive',
                accentClass: userData.isActive ? 'bg-green-500' : 'bg-red-500',
                isDark,
            },
            {
                icon: VerifiedUser,
                label: 'Verification Status',
                value: verificationLabel,
                accentClass: verificationLabel === 'Fully verified' ? 'bg-green-500' : verificationLabel === 'Unverified' ? 'bg-amber-500' : 'bg-blue-600',
                isDark,
            },
            {
                icon: Security,
                label: 'Permissions Count',
                value: String(userData.permissions.length),
                accentClass: 'bg-indigo-600',
                isDark,
            },
            {
                icon: CalendarToday,
                label: 'Member Since',
                value: formatDisplayDate(userData.createdAt),
                accentClass: 'bg-blue-600',
                isDark,
            },
        ];
    }, [isDark, userData, verificationLabel]);

    const tabs = useMemo<TabItem[]>(() => {
        const permissionCount = userData?.permissions.length || 0;
        const roleCount = userData?.roles.length || 0;

        return [
            { key: 'overview', label: 'Overview', icon: AccountCircle },
            { key: 'security', label: 'Security', icon: Security, count: permissionCount + roleCount },
            { key: 'institute', label: 'Institute', icon: Business, count: userData?.institute ? 1 : 0 },
            { key: 'faculty', label: 'Faculty', icon: School, count: userData?.faculty ? 1 : 0 },
            { key: 'preferences', label: 'Preferences', icon: Settings, count: 3 },
        ];
    }, [userData]);

    const quickActions = useMemo(
        () => [
            { label: 'Edit Profile', icon: Edit, onClick: onEditProfile },
            { label: 'Notifications', icon: Notifications },
            { label: 'QR Code', icon: QrCode2 },
            { label: 'Appearance', icon: Palette },
        ],
        [onEditProfile]
    );

    const overviewFeatures = useMemo(
        () =>
            userData
                ? [
                    {
                        icon: Person,
                        title: 'Personal Information',
                        description: 'Review contact details, verification state, and public identity data.',
                        value: userData.email ? 'Complete' : 'Needs review',
                        onClick: onEditProfile,
                    },
                    {
                        icon: Security,
                        title: 'Security Settings',
                        description: 'Inspect permissions, roles, and account protection signals.',
                        value: `${securityScore}% score`,
                        onClick: onSecuritySettings,
                    },
                    {
                        icon: Business,
                        title: 'Institute Profile',
                        description: userData.institute ? 'Linked institute details are available.' : 'No institute is linked to this account yet.',
                        value: userData.institute ? 'Connected' : 'Missing',
                    },
                    {
                        icon: School,
                        title: 'Faculty Information',
                        description: userData.faculty ? 'Faculty membership and description are available.' : 'No faculty record is linked yet.',
                        value: userData.faculty ? 'Connected' : 'Missing',
                    },
                ]
                : [],
        [onEditProfile, onSecuritySettings, securityScore, userData]
    );

    const preferences = useMemo(
        () => [
            { label: 'Theme', value: isDark ? 'Dark' : 'Light', icon: Contrast },
            { label: 'Language', value: typeof navigator !== 'undefined' ? navigator.language : 'en-US', icon: Language },
            { label: 'Notifications', value: userData?.isEmailVerified ? 'Email enabled' : 'Basic alerts', icon: Notifications },
        ],
        [isDark, userData?.isEmailVerified]
    );

    if (!userData) {
        return (
            <div className={cn('min-h-screen px-4 py-10 sm:px-6 md:px-8', isDark ? 'bg-gray-950' : 'bg-gray-50', className)}>
                <div className={cn('mx-auto max-w-xl rounded-2xl border p-10 text-center shadow-sm', isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white')}>
                    <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-2xl', isDark ? 'bg-gray-800' : 'bg-gray-100')}>
                        <Person className={cn(isDark ? 'text-gray-300' : 'text-gray-500')} />
                    </div>
                    <h2 className={cn('mt-5 text-2xl font-semibold', primaryTextClass(isDark))}>No user found</h2>
                    <p className={cn('mt-2 text-sm leading-6', subduedTextClass(isDark))}>Sign in to access your profile dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 md:px-8 rounded-4xl',
                isDark ? 'bg-slate-950' : 'bg-slate-50',
                className
            )}
        >
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-0',
                    isDark
                        ? 'bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.2),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(2,132,199,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.12),transparent_40%)]'
                        : 'bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(2,132,199,0.1),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.08),transparent_40%)]'
                )}
            />
            <div className="relative mx-auto max-w-full space-y-6">
                <div className={cn('rounded-2xl border px-5 py-5 sm:px-6', isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85')}>
                    <p className={cn('text-sm font-semibold uppercase tracking-[0.12em]', isDark ? 'text-sky-300' : 'text-sky-700')}><Translated text="Account" /></p>
                    <h1 className={cn('mt-2 text-3xl font-semibold tracking-tight sm:text-4xl', primaryTextClass(isDark))}><Translated text="User Profile" /></h1>
                    <p className={cn('mt-2 max-w-3xl text-sm sm:text-base', subduedTextClass(isDark))}><Translated text="A fast, minimal dashboard for profile, access, and organization details." /></p>
                </div>

                <ProfileHeader
                    user={userData}
                    isDark={isDark}
                    roleLabel={roleLabel}
                    verificationLabel={verificationLabel}
                    verificationTone={verificationTone}
                    initials={initials}
                />

                <section className={cn(cardClass(isDark), 'p-4 sm:p-5')}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className={cn('text-xs font-semibold uppercase tracking-[0.12em]', isDark ? 'text-sky-300' : 'text-sky-700')}><Translated text="Performance snapshot" /></p>
                            <h2 className={cn('mt-1 text-xl font-semibold sm:text-2xl', primaryTextClass(isDark))}><Translated text="Account metrics" /></h2>
                        </div>
                        <div className={cn('w-full rounded-xl border px-3 py-3 sm:max-w-xs', isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-white')}>
                            <div className="flex items-center justify-between">
                                <span className={cn('text-xs font-medium uppercase tracking-wide', subduedTextClass(isDark))}><Translated text="Security health" /></span>
                                <span className={cn('text-sm font-semibold', primaryTextClass(isDark))}>{securityScore}%</span>
                            </div>
                            <div className={cn('mt-2 h-1.5 rounded-full', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
                                <div
                                    className={cn('h-1.5 rounded-full transition-all duration-300', securityScore >= 80 ? 'bg-emerald-500' : securityScore >= 60 ? 'bg-amber-500' : 'bg-rose-500')}
                                    style={{ width: `${securityScore}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>
                </section>

                <section className={cn(cardClass(isDark), 'relative overflow-hidden')}>
                    <div
                        aria-hidden="true"
                        className={cn(
                            'pointer-events-none absolute inset-0',
                            isDark
                                ? 'bg-[radial-gradient(circle_at_12%_8%,rgba(125,211,252,0.12),transparent_30%),radial-gradient(circle_at_92%_0%,rgba(56,189,248,0.1),transparent_28%)]'
                                : 'bg-[radial-gradient(circle_at_12%_8%,rgba(125,211,252,0.08),transparent_30%),radial-gradient(circle_at_92%_0%,rgba(56,189,248,0.06),transparent_28%)]'
                        )}
                    />
                    <TabNavigation activeTab={activeTab} isDark={isDark} tabs={tabs} onChange={setActiveTab} />

                    <div className="relative p-4 sm:p-6">
                        {activeTab === 'overview' ? (
                            <div className="space-y-6">
                                <div className={cn(cardClass(isDark), 'p-5', isDark ? 'bg-slate-900/55' : 'bg-white/75')}>
                                    <div>
                                        <h2 className={cn('text-lg font-semibold', primaryTextClass(isDark))}><Translated text="Quick actions" /></h2>
                                        <p className={cn('mt-1 text-sm', subduedTextClass(isDark))}><Translated text="Frequent shortcuts for managing this profile." /></p>
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                                        {quickActions.map(({ label, icon: Icon, onClick }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={onClick}
                                                className={cn(
                                                    'group rounded-xl border px-4 py-4 text-left backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5',
                                                    isDark ? 'border-white/10 bg-slate-950/70 hover:border-sky-300/25 hover:bg-slate-900/80' : 'border-slate-200/80 bg-white/80 hover:border-sky-300/45 hover:bg-sky-50/50'
                                                )}
                                            >
                                                <Icon className={cn('transition-colors', isDark ? 'text-sky-300 group-hover:text-sky-200' : 'text-sky-600 group-hover:text-sky-700')} fontSize="small" />
                                                <p className={cn('mt-3 text-sm font-medium', primaryTextClass(isDark))}><Translated text={label} /></p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {overviewFeatures.map((feature) => (
                                        <FeatureCard key={feature.title} {...feature} isDark={isDark} />
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {activeTab === 'security' ? (
                            <div className="space-y-6">
                                <PermissionList permissions={userData.permissions} roles={userData.roles} isDark={isDark} />
                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className={cn(cardClass(isDark), 'p-6 md:col-span-1', isDark ? 'bg-slate-900/60' : 'bg-white/80')}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                                                <Shield className="text-white" fontSize="small" />
                                            </div>
                                            <div>
                                                <h3 className={cn('text-lg font-semibold', primaryTextClass(isDark))}><Translated text="Security score" /></h3>
                                                <p className={cn('text-sm', subduedTextClass(isDark))}><Translated text="Based on verification and access setup" /></p>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <div className="flex items-end justify-between">
                                                <span className={cn('text-3xl font-semibold', primaryTextClass(isDark))}>{securityScore}%</span>
                                                <span className={cn('text-xs font-medium', securityScore >= 80 ? 'text-green-500' : securityScore >= 60 ? 'text-amber-500' : 'text-red-500')}>
                                                    <Translated text={securityScore >= 80 ? 'Strong' : securityScore >= 60 ? 'Moderate' : 'Needs work'} />
                                                </span>
                                            </div>
                                            <div className={cn('mt-4 h-2 rounded-full', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
                                                <div
                                                    className={cn('h-2 rounded-full', securityScore >= 80 ? 'bg-green-500' : securityScore >= 60 ? 'bg-amber-500' : 'bg-red-500')}
                                                    style={{ width: `${securityScore}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {activeTab === 'institute' ? <InstituteCard user={userData} isDark={isDark} isInstituteUser={isInstitute} /> : null}

                        {activeTab === 'faculty' ? <FacultyCard user={userData} isDark={isDark} isFacultyUser={isFacultyUser} /> : null}

                        {activeTab === 'preferences' ? (
                            <div className="grid gap-6 lg:grid-cols-3">
                                {preferences.map(({ label, value, icon: Icon }) => (
                                    <div key={label} className={cn(cardClass(isDark), 'group p-6 transition-all duration-150 hover:-translate-y-0.5', isDark ? 'bg-slate-900/60 hover:border-white/20' : 'bg-white/80 hover:border-slate-300')}>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', isDark ? 'bg-sky-400/20' : 'bg-sky-100')}>
                                                <Icon className={cn(isDark ? 'text-sky-200' : 'text-sky-700')} fontSize="small" />
                                            </div>
                                            {label === 'Notifications' && !userData.isEmailVerified ? (
                                                <WarningAmber className="text-amber-500" fontSize="small" />
                                            ) : null}
                                        </div>
                                        <h3 className={cn('mt-4 text-lg font-semibold', primaryTextClass(isDark))}>{label}</h3>
                                        <p className={cn('mt-2 text-sm', subduedTextClass(isDark))}>{value}</p>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfile;