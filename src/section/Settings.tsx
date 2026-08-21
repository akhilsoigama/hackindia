import { motion } from 'framer-motion';
import {
    CheckCircle,
    Palette,
    Person,
    Save,
    SettingsBackupRestore,
    Shield,
    Tune,
} from '@mui/icons-material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../components/common/translator/translator';
import RHFFormField from '../components/hook-form/RHFFormFiled';
import RHFDropDown from '../components/hook-form/RHFDropDown';
import RHFCheckbox from '../components/hook-form/RHFCheckbox';
import RHFRadioGroup from '../components/hook-form/RHFRadioGroup';

type TeacherSettingsFormValues = {
    name: string;
    email: string;
    phone: string;
    password: string;
    notifyEmail: boolean;
    notifySms: boolean;
    notifyInApp: boolean;
    theme: 'light' | 'dark';
    status: 'active' | 'inactive';
};

const defaultValues: TeacherSettingsFormValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    notifyEmail: true,
    notifySms: false,
    notifyInApp: true,
    theme: 'light',
    status: 'active',
};

const cn = (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' ');

const glassCard = (isDark: boolean) =>
    cn(
        'rounded-2xl border backdrop-blur-sm shadow-sm',
        isDark
            ? 'border-white/10 bg-slate-900/80 shadow-black/30'
            : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
    );

const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');
const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

const TeacherSettingsPage = () => {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const methods = useForm<TeacherSettingsFormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const { handleSubmit, reset, control } = methods;

    const notifyEmail = useWatch({ control, name: 'notifyEmail' });
    const notifySms = useWatch({ control, name: 'notifySms' });
    const notifyInApp = useWatch({ control, name: 'notifyInApp' });
    const selectedTheme = useWatch({ control, name: 'theme' });
    const status = useWatch({ control, name: 'status' });

    const enabledNotifications = [notifyEmail, notifySms, notifyInApp].filter(Boolean).length;

    const onSubmit = (values: TeacherSettingsFormValues) => {
        console.log('Teacher settings updated:', values);
        alert('Teacher settings updated successfully!');
    };

    return (
        <div
            className={cn(
                'relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 md:px-8 rounded-4xl',
                isDark ? 'bg-slate-950' : 'bg-slate-50'
            )}
        >
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-0',
                    isDark
                        ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.16),transparent_35%)]'
                        : 'bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.16),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.13),transparent_35%)]'
                )}
            />

            <div className="relative mx-auto max-w-full space-y-6">
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1
                                className={cn(
                                    'flex items-center gap-3 text-2xl font-semibold md:text-3xl',
                                    primaryText(isDark)
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-flex h-11 w-11 items-center justify-center rounded-2xl border',
                                        isDark
                                            ? 'border-sky-400/20 bg-sky-500/10 text-sky-300'
                                            : 'border-sky-200 bg-sky-50 text-sky-700'
                                    )}
                                >
                                    <Tune />
                                </span>
                                <Translated text="Teacher Settings" />
                            </h1>
                            <p className={cn('mt-2 text-sm md:text-base', subText(isDark))}>
                                <Translated text="Manage your profile, account status, notifications, and dashboard preferences." />
                            </p>
                        </div>

                        <div className={cn(glassCard(isDark), 'px-4 py-3')}>
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        'inline-flex h-9 w-9 items-center justify-center rounded-xl',
                                        isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                                    )}
                                >
                                    <CheckCircle fontSize="small" />
                                </span>
                                <div>
                                    <p className={cn('text-sm font-semibold', primaryText(isDark))}>
                                        <Translated text="Settings workspace ready" />
                                    </p>
                                    <p className={cn('text-xs', subText(isDark))}>
                                        <Translated text="All changes are locally validated before save." />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className={cn(glassCard(isDark), 'p-4')}>
                            <p className={cn('text-xs uppercase tracking-[0.08em]', subText(isDark))}>
                                <Translated text="Notifications enabled" />
                            </p>
                            <p className={cn('mt-1 text-xl font-semibold', primaryText(isDark))}>
                                {enabledNotifications}/3
                            </p>
                        </div>
                        <div className={cn(glassCard(isDark), 'p-4')}>
                            <p className={cn('text-xs uppercase tracking-[0.08em]', subText(isDark))}>
                                <Translated text="Current theme" />
                            </p>
                            <p className={cn('mt-1 text-xl font-semibold capitalize', primaryText(isDark))}>
                                {selectedTheme}
                            </p>
                        </div>
                        <div className={cn(glassCard(isDark), 'p-4')}>
                            <p className={cn('text-xs uppercase tracking-[0.08em]', subText(isDark))}>
                                <Translated text="Account status" />
                            </p>
                            <p className={cn('mt-1 text-xl font-semibold capitalize', primaryText(isDark))}>
                                {status}
                            </p>
                        </div>
                    </div>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className={cn(glassCard(isDark), 'p-5 sm:p-6')}
                >
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <section className="space-y-4">
                                <h2 className={cn('flex items-center gap-2 text-lg font-semibold', primaryText(isDark))}>
                                    <Person fontSize="small" className="text-sky-500" />
                                    <Translated text="Profile Information" />
                                </h2>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <RHFFormField
                                        name="name"
                                        label="Name"
                                        placeholder="Enter full name"
                                        required
                                        validation={{ required: 'Name is required' }}
                                    />
                                    <RHFFormField
                                        name="email"
                                        type="email"
                                        label="Email"
                                        placeholder="Enter email address"
                                        required
                                        validation={{
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^\S+@\S+\.\S+$/,
                                                message: 'Enter a valid email address',
                                            },
                                        }}
                                    />
                                    <RHFFormField
                                        name="phone"
                                        type="tel"
                                        label="Phone"
                                        placeholder="Enter phone number"
                                        validation={{
                                            pattern: {
                                                value: /^[0-9+()\-\s]{7,20}$/,
                                                message: 'Enter a valid phone number',
                                            },
                                        }}
                                    />
                                    <RHFFormField
                                        name="password"
                                        type="password"
                                        label="Password"
                                        placeholder="Update password"
                                        validation={{
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        }}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className={cn('flex items-center gap-2 text-lg font-semibold', primaryText(isDark))}>
                                    <Shield fontSize="small" className="text-emerald-500" />
                                    <Translated text="Notification Preferences" />
                                </h2>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className={cn(glassCard(isDark), 'p-4')}>
                                        <RHFCheckbox
                                            name="notifyEmail"
                                            label="Email Notifications"
                                            description="Receive important account and classroom updates by email."
                                        />
                                    </div>
                                    <div className={cn(glassCard(isDark), 'p-4')}>
                                        <RHFCheckbox
                                            name="notifySms"
                                            label="SMS Notifications"
                                            description="Get urgent alerts directly on your phone."
                                        />
                                    </div>
                                    <div className={cn(glassCard(isDark), 'p-4')}>
                                        <RHFCheckbox
                                            name="notifyInApp"
                                            label="In-App Notifications"
                                            description="Show learning and system alerts inside the dashboard."
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className={cn('flex items-center gap-2 text-lg font-semibold', primaryText(isDark))}>
                                    <Palette fontSize="small" className="text-violet-500" />
                                    <Translated text="Experience Settings" />
                                </h2>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className={cn(glassCard(isDark), 'p-4')}>
                                        <RHFDropDown
                                            name="theme"
                                            label="Dashboard Theme"
                                            required
                                            options={[
                                                { value: 'light', label: 'Light' },
                                                { value: 'dark', label: 'Dark' },
                                            ]}
                                        />
                                    </div>

                                    <div className={cn(glassCard(isDark), 'p-4')}>
                                        <RHFRadioGroup
                                            name="status"
                                            label="Account Status"
                                            required
                                            direction="row"
                                            options={[
                                                {
                                                    value: 'active',
                                                    label: 'Active',
                                                    description: 'Your account is fully visible and operational.',
                                                },
                                                {
                                                    value: 'inactive',
                                                    label: 'Inactive',
                                                    description: 'Temporarily pause account visibility and notifications.',
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-wrap justify-end gap-3 pt-2">
                                <motion.button
                                    type="button"
                                    onClick={() => reset(defaultValues)}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        isDark
                                            ? 'border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    )}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <SettingsBackupRestore fontSize="small" />
                                    <Translated text="Reset" />
                                </motion.button>

                                <motion.button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-sky-600 hover:to-blue-700"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Save fontSize="small" />
                                    <Translated text="Save Settings" />
                                </motion.button>
                            </div>
                        </form>
                    </FormProvider>
                </motion.div>
            </div>
        </div>
    );
};

export default TeacherSettingsPage;
