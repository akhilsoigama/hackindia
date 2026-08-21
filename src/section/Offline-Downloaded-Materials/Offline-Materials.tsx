import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
    CheckCircle,
    CloudDownload,
    DeleteOutline,
    Headphones,
    InsertDriveFile,
    LibraryBooks,
    MenuBook,
    MusicNote,
    PlayArrow,
    Schedule,
    Search,
    SmartDisplay,
    Storage,
    Tune,
    Visibility,
    WifiOff,
} from '@mui/icons-material';
import { Translated } from '../../components/common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';
import {
    OfflineMaterial,
    StorageInfo,
    OfflineMaterialsProps,
} from '../../types/offline-materials';

const sampleOfflineMaterials: OfflineMaterial[] = [
    {
        id: 1,
        title: 'Calculus Fundamentals',
        description: 'Complete guide to limits, derivatives, and integrals',
        course: 'Mathematics',
        subject: 'Calculus',
        type: 'lesson',
        fileSize: '45.2 MB',
        downloadDate: '2024-01-15',
        lastAccessed: '2024-01-18',
        filePath: '/offline/calculus-fundamentals.pdf',
        completed: true,
        category: 'Study Notes',
        tags: ['calculus', 'math', 'fundamentals'],
    },
    {
        id: 2,
        title: 'Organic Chemistry Reactions',
        description: 'Comprehensive guide to organic reactions and mechanisms',
        course: 'Chemistry',
        subject: 'Organic Chemistry',
        type: 'lesson',
        fileSize: '32.1 MB',
        downloadDate: '2024-01-16',
        lastAccessed: '2024-01-17',
        filePath: '/offline/organic-chemistry.pdf',
        completed: false,
        category: 'Study Notes',
        tags: ['chemistry', 'organic', 'reactions'],
    },
    {
        id: 3,
        title: 'Quantum Mechanics Explained',
        description: 'Visual explanation of quantum principles and experiments',
        course: 'Physics',
        subject: 'Quantum Mechanics',
        type: 'video',
        fileSize: '245.7 MB',
        duration: '28:15',
        downloadDate: '2024-01-14',
        lastAccessed: '2024-01-16',
        filePath: '/offline/quantum-mechanics.mp4',
        thumbnail: '/thumbnails/quantum.jpg',
        progress: 75,
        completed: false,
        category: 'Lecture Videos',
        tags: ['physics', 'quantum', 'video'],
    },
    {
        id: 4,
        title: 'Data Structures Tutorial',
        description: 'Complete data structures implementation guide',
        course: 'Computer Science',
        subject: 'Algorithms',
        type: 'video',
        fileSize: '189.3 MB',
        duration: '42:30',
        downloadDate: '2024-01-13',
        lastAccessed: '2024-01-15',
        filePath: '/offline/data-structures.mp4',
        thumbnail: '/thumbnails/ds.jpg',
        progress: 100,
        completed: true,
        category: 'Tutorial Videos',
        tags: ['programming', 'algorithms', 'data-structures'],
    },
    {
        id: 5,
        title: 'French Pronunciation Guide',
        description: 'Audio lessons for perfect French pronunciation',
        course: 'Languages',
        subject: 'French',
        type: 'audio',
        fileSize: '89.6 MB',
        duration: '1:15:22',
        downloadDate: '2024-01-12',
        lastAccessed: '2024-01-14',
        filePath: '/offline/french-pronunciation.mp3',
        progress: 40,
        completed: false,
        category: 'Language Learning',
        tags: ['french', 'language', 'audio'],
    },
    {
        id: 6,
        title: 'History of Ancient Rome',
        description: 'Audio documentary series on Roman history',
        course: 'History',
        subject: 'Ancient History',
        type: 'audio',
        fileSize: '156.2 MB',
        duration: '2:08:45',
        downloadDate: '2024-01-11',
        lastAccessed: '2024-01-13',
        filePath: '/offline/roman-history.mp3',
        progress: 100,
        completed: true,
        category: 'Audio Books',
        tags: ['history', 'rome', 'documentary'],
    },
    {
        id: 7,
        title: 'Mathematics Formula Sheet',
        description: 'Comprehensive formula sheet for all math courses',
        course: 'Mathematics',
        subject: 'General',
        type: 'file',
        fileSize: '12.3 MB',
        downloadDate: '2024-01-10',
        lastAccessed: '2024-01-12',
        filePath: '/offline/math-formulas.pdf',
        completed: true,
        category: 'Reference Materials',
        tags: ['math', 'formulas', 'reference'],
    },
    {
        id: 8,
        title: 'Programming Exercises',
        description: 'Collection of programming problems and solutions',
        course: 'Computer Science',
        subject: 'Programming',
        type: 'file',
        fileSize: '8.7 MB',
        downloadDate: '2024-01-09',
        lastAccessed: '2024-01-11',
        filePath: '/offline/programming-exercises.zip',
        completed: false,
        category: 'Practice Problems',
        tags: ['programming', 'exercises', 'practice'],
    },
];

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

const OfflineMaterials: React.FC<OfflineMaterialsProps> = () => {
    type ActiveTab = 'all' | 'lesson' | 'video' | 'audio' | 'file';

    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const [activeTab, setActiveTab] = useState<ActiveTab>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [materials, setMaterials] = useState<OfflineMaterial[]>(sampleOfflineMaterials);
    const [storageInfo] = useState<StorageInfo>({
        total: '64 GB',
        used: '23.4 GB',
        available: '40.6 GB',
        usagePercentage: 36.5,
    });

    const courses = [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Computer Science',
        'History',
        'Languages',
    ];

    const filteredMaterials = useMemo(
        () =>
            materials.filter((material) => {
                const query = searchQuery.trim().toLowerCase();
                const matchesSearch =
                    query.length === 0 ||
                    material.title.toLowerCase().includes(query) ||
                    material.description.toLowerCase().includes(query) ||
                    material.tags.some((tag) => tag.toLowerCase().includes(query));

                const matchesCourse = selectedCourse === 'all' || material.course === selectedCourse;
                const matchesType = activeTab === 'all' || material.type === activeTab;

                return matchesSearch && matchesCourse && matchesType;
            }),
        [activeTab, materials, searchQuery, selectedCourse]
    );

    const getTypeMeta = (type: OfflineMaterial['type']) => {
        if (type === 'lesson') {
            return {
                icon: MenuBook,
                className: isDark
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-400/20'
                    : 'bg-sky-50 text-sky-700 border border-sky-200',
                label: 'Lesson',
            };
        }

        if (type === 'video') {
            return {
                icon: SmartDisplay,
                className: isDark
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-400/20'
                    : 'bg-rose-50 text-rose-700 border border-rose-200',
                label: 'Video',
            };
        }

        if (type === 'audio') {
            return {
                icon: Headphones,
                className: isDark
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                label: 'Audio',
            };
        }

        return {
            icon: InsertDriveFile,
            className: isDark
                ? 'bg-violet-500/10 text-violet-300 border border-violet-400/20'
                : 'bg-violet-50 text-violet-700 border border-violet-200',
            label: 'File',
        };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handlePlayMaterial = (material: OfflineMaterial) => {
        const updatedMaterials = materials.map((m) =>
            m.id === material.id
                ? { ...m, lastAccessed: new Date().toISOString().split('T')[0] }
                : m
        );
        setMaterials(updatedMaterials);
    };

    const handleDeleteMaterial = (materialId: number) => {
        if (window.confirm('Are you sure you want to delete this downloaded material?')) {
            setMaterials(materials.filter((m) => m.id !== materialId));
        }
    };

    const getMaterialStats = () => {
        const total = materials.length;
        const lessons = materials.filter((m) => m.type === 'lesson').length;
        const videos = materials.filter((m) => m.type === 'video').length;
        const audio = materials.filter((m) => m.type === 'audio').length;
        const files = materials.filter((m) => m.type === 'file').length;
        const completed = materials.filter((m) => m.completed).length;

        return { total, lessons, videos, audio, files, completed };
    };

    const stats = getMaterialStats();

    const statCards = [
        { key: 'total', label: 'Total', value: stats.total },
        { key: 'lessons', label: 'Lessons', value: stats.lessons },
        { key: 'videos', label: 'Videos', value: stats.videos },
        { key: 'audio', label: 'Audio', value: stats.audio },
        { key: 'files', label: 'Files', value: stats.files },
        { key: 'completed', label: 'Completed', value: stats.completed },
    ];

    const tabs: Array<{ id: ActiveTab; label: string; icon: typeof CloudDownload }> = [
        { id: 'all', label: 'All Materials', icon: CloudDownload },
        { id: 'lesson', label: 'Lessons', icon: MenuBook },
        { id: 'video', label: 'Videos', icon: SmartDisplay },
        { id: 'audio', label: 'Audio', icon: Headphones },
        { id: 'file', label: 'Files', icon: InsertDriveFile },
    ];

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
                        ? 'bg-[radial-linear(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_35%),radial-linear(circle_at_85%_0%,rgba(99,102,241,0.16),transparent_35%)]'
                        : 'bg-[radial-linear(circle_at_15%_20%,rgba(14,165,233,0.16),transparent_35%),radial-linear(circle_at_85%_0%,rgba(59,130,246,0.13),transparent_35%)]'
                )}
            />

            <div className="relative mx-auto max-w-full space-y-6">
                <motion.header
                    className="mb-1"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
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
                                    <WifiOff />
                                </span>
                                <Translated text="Offline Materials" />
                            </h1>
                            <p className={cn('mt-2 text-sm md:text-base', subText(isDark))}>
                                <Translated text="Access your downloaded content with a faster, cleaner study workflow." />
                            </p>
                        </div>

                        <div className={cn(glassCard(isDark), 'w-full max-w-sm p-4')}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                                            isDark ? 'bg-sky-500/10 text-sky-300' : 'bg-sky-50 text-sky-700'
                                        )}
                                    >
                                        <Storage fontSize="small" />
                                    </span>
                                    <div>
                                        <p className={cn('text-sm font-medium', primaryText(isDark))}>
                                            {storageInfo.used} <Translated text="used" />
                                        </p>
                                        <p className={cn('text-xs', subText(isDark))}>
                                            {storageInfo.available} <Translated text="available" />
                                        </p>
                                    </div>
                                </div>
                                <span className={cn('text-xs font-semibold', subText(isDark))}>{storageInfo.total}</span>
                            </div>

                            <div className={cn('mt-3 h-2 w-full rounded-full', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
                                <div
                                    className="h-2 rounded-full bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500"
                                    style={{ width: `${storageInfo.usagePercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6"
                >
                    {statCards.map((card) => (
                        <div
                            key={card.key}
                            className={cn(
                                glassCard(isDark),
                                'group relative overflow-hidden p-4 text-center transition-all duration-200 hover:-translate-y-0.5',
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
                            <p className={cn('text-lg font-semibold', primaryText(isDark))}>{card.value}</p>
                            <p className={cn('mt-1 text-xs uppercase tracking-[0.08em]', subText(isDark))}>
                                <Translated text={card.label} />
                            </p>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    className={cn(glassCard(isDark), 'p-2')}
                >
                    <div className="flex flex-col gap-2 sm:flex-row">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition',
                                        activeTab === tab.id
                                            ? isDark
                                                ? 'border border-sky-300/20 bg-sky-400/15 text-sky-200'
                                                : 'border border-sky-300/60 bg-sky-50 text-sky-700'
                                            : isDark
                                                ? 'text-slate-300 hover:bg-white/5'
                                                : 'text-slate-600 hover:bg-slate-50'
                                    )}
                                >
                                    <Icon fontSize="small" />
                                    <Translated text={tab.label} />
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.16 }}
                    className={cn(glassCard(isDark), 'p-4 sm:p-5')}
                >
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="relative flex-1">
                            <Search
                                className={cn(
                                    'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                                    subText(isDark)
                                )}
                                fontSize="small"
                            />
                            <input
                                type="text"
                                placeholder="Search offline materials"
                                className={cn(
                                    'h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition',
                                    isDark
                                        ? 'border-white/10 bg-slate-950 text-slate-200 placeholder:text-slate-500 focus:border-sky-400/40'
                                        : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-300'
                                )}
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="relative sm:w-56">
                            <Tune
                                className={cn(
                                    'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                                    subText(isDark)
                                )}
                                fontSize="small"
                            />
                            <select
                                className={cn(
                                    'h-11 w-full appearance-none rounded-xl border pl-10 pr-10 text-sm outline-none transition',
                                    isDark
                                        ? 'border-white/10 bg-slate-950 text-slate-200 focus:border-sky-400/40'
                                        : 'border-slate-200 bg-white text-slate-900 focus:border-sky-300'
                                )}
                                value={selectedCourse}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
                            >
                                <option value="all">All Courses</option>
                                {courses.map((course) => (
                                    <option key={course} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {filteredMaterials.map((material, index) => {
                        const typeMeta = getTypeMeta(material.type);
                        const TypeIcon = typeMeta.icon;

                        return (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.07 }}
                                className={cn(
                                    glassCard(isDark),
                                    'overflow-hidden transition-all',
                                    isDark ? 'hover:border-white/20 hover:bg-slate-900/95' : 'hover:border-slate-300 hover:bg-white'
                                )}
                            >
                                <div className={cn('border-b p-4', isDark ? 'border-white/10' : 'border-slate-200')}>
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'inline-flex h-9 w-9 items-center justify-center rounded-xl',
                                                    isDark ? 'bg-slate-950' : 'bg-slate-100'
                                                )}
                                            >
                                                <TypeIcon fontSize="small" />
                                            </span>
                                            <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', typeMeta.className)}>
                                                <Translated text={typeMeta.label} />
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {material.completed && <CheckCircle className="text-emerald-500" fontSize="small" />}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteMaterial(material.id)}
                                                className={cn(
                                                    'rounded-lg p-1.5 transition',
                                                    isDark
                                                        ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-300'
                                                        : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                                                )}
                                            >
                                                <DeleteOutline fontSize="small" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className={cn('line-clamp-2 font-semibold', primaryText(isDark))}>{material.title}</h3>
                                    <p className={cn('mt-2 line-clamp-2 text-sm', subText(isDark))}>{material.description}</p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {material.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className={cn(
                                                    'rounded-full px-2 py-1 text-xs',
                                                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                                )}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className={cn('mb-3 flex items-center justify-between text-xs sm:text-sm', subText(isDark))}>
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center gap-1">
                                                <LibraryBooks fontSize="inherit" />
                                                {material.course}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <CloudDownload fontSize="inherit" />
                                                {material.fileSize}
                                            </span>
                                        </div>
                                        {material.duration && (
                                            <span className="inline-flex items-center gap-1">
                                                <Schedule fontSize="inherit" />
                                                {material.duration}
                                            </span>
                                        )}
                                    </div>

                                    {(material.type === 'video' || material.type === 'audio') && material.progress !== undefined && (
                                        <div className="mb-4">
                                            <div className={cn('mb-1.5 flex justify-between text-xs', subText(isDark))}>
                                                <span>
                                                    <Translated text="Progress" />
                                                </span>
                                                <span className={primaryText(isDark)}>{material.progress}%</span>
                                            </div>
                                            <div className={cn('h-2 w-full rounded-full', isDark ? 'bg-slate-800' : 'bg-slate-200')}>
                                                <div
                                                    className="h-2 rounded-full bg-linear-to-r from-sky-500 to-violet-500"
                                                    style={{ width: `${material.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handlePlayMaterial(material)}
                                            className={cn(
                                                'inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                                                material.type === 'video' || material.type === 'audio'
                                                    ? isDark
                                                        ? 'border border-sky-300/20 bg-sky-400/15 text-sky-200 hover:bg-sky-400/20'
                                                        : 'border border-sky-300/60 bg-sky-50 text-sky-700 hover:bg-sky-100'
                                                    : isDark
                                                        ? 'border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                                                        : 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            )}
                                        >
                                            {material.type === 'video' || material.type === 'audio' ? (
                                                <>
                                                    <PlayArrow fontSize="small" />
                                                    <Translated text="Play" />
                                                </>
                                            ) : (
                                                <>
                                                    <Visibility fontSize="small" />
                                                    <Translated text="Open" />
                                                </>
                                            )}
                                        </button>

                                        {material.type === 'audio' && (
                                            <button
                                                type="button"
                                                className={cn(
                                                    'inline-flex items-center justify-center rounded-xl px-3 transition',
                                                    isDark
                                                        ? 'border border-emerald-300/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
                                                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                )}
                                            >
                                                <MusicNote fontSize="small" />
                                            </button>
                                        )}
                                    </div>

                                    <div className={cn('mt-3 flex justify-between text-xs', subText(isDark))}>
                                        <span>
                                            <Translated text="Downloaded" />: {formatDate(material.downloadDate)}
                                        </span>
                                        {material.lastAccessed && (
                                            <span>
                                                <Translated text="Last" />: {formatDate(material.lastAccessed)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filteredMaterials.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(glassCard(isDark), 'py-12 text-center')}
                    >
                        <CloudDownload className={cn('mx-auto mb-3', subText(isDark))} sx={{ fontSize: 40 }} />
                        <h3 className={cn('text-lg font-medium', primaryText(isDark))}>
                            <Translated text="No offline materials found" />
                        </h3>
                        <p className={cn('mt-2 text-sm', subText(isDark))}>
                            {searchQuery || selectedCourse !== 'all' ? (
                                <Translated text="Try adjusting your search or filters" />
                            ) : (
                                <Translated text="You have not downloaded any materials yet" />
                            )}
                        </p>
                        <button
                            type="button"
                            className={cn(
                                'mt-4 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                isDark
                                    ? 'border border-sky-300/20 bg-sky-400/15 text-sky-200 hover:bg-sky-400/20'
                                    : 'border border-sky-300/60 bg-sky-50 text-sky-700 hover:bg-sky-100'
                            )}
                        >
                            <Translated text="Browse Available Materials" />
                        </button>
                    </motion.div>
                )}

                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={cn(glassCard(isDark), 'p-6')}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h4 className={cn('font-semibold', primaryText(isDark))}>
                                <Translated text="Need more space?" />
                            </h4>
                            <p className={cn('mt-1 text-sm', subText(isDark))}>
                                <Translated text="Manage downloaded content to keep your device fast and organized." />
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className={cn(
                                    'rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                    isDark
                                        ? 'border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                )}
                            >
                                <Translated text="Manage Storage" />
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    'rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                    isDark
                                        ? 'border border-sky-300/20 bg-sky-400/15 text-sky-200 hover:bg-sky-400/20'
                                        : 'border border-sky-300/60 bg-sky-50 text-sky-700 hover:bg-sky-100'
                                )}
                            >
                                <Translated text="Download New Materials" />
                            </button>
                        </div>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
};

export default OfflineMaterials;
