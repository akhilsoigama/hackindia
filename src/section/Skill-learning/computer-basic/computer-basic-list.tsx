import { useState } from 'react'
import { useTheme } from '@/theme/AppThemeProvider'
import { useRouter } from '@/hooks/useRouter'
import {
    AccessTime,
    MenuBook,
    School,
    Computer,
    Storage,
    Security,
    Cloud,
    Settings,
    Devices,
    PlayArrow,
    Close,
} from '@mui/icons-material'
import { ParticleButton } from "../../../components/ui/particle-button"
import { cn } from '@/utils/utils'

// Nested Component - Lesson Detail View
const LessonDetail = ({ topic, onClose }: { topic: any, onClose: () => void }) => {
    const { mode } = useTheme()
    const isDark = mode === 'dark'
    const router = useRouter()

    const handleStartLearning = () => {
        router.push(`/learning/${topic.slug}`)
    }

    const getLevelColor = (level: string) => {
        if (isDark) {
            switch (level) {
                case 'Beginner': return 'bg-green-900/30 text-green-300 border-green-400/20'
                case 'Intermediate': return 'bg-yellow-900/30 text-yellow-300 border-yellow-400/20'
                case 'Advanced': return 'bg-red-900/30 text-red-300 border-red-400/20'
                default: return 'bg-gray-700 text-gray-300'
            }
        } else {
            switch (level) {
                case 'Beginner': return 'bg-green-100 text-green-700 border-green-200'
                case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
                case 'Advanced': return 'bg-red-100 text-red-700 border-red-200'
                default: return 'bg-gray-100 text-gray-700'
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={cn(
                "relative max-w-2xl w-full rounded-2xl p-6 shadow-2xl",
                isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"
            )}>
                {/* Close Button - Top Right */}
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-4 right-4 z-10 p-2 rounded-lg transition-colors",
                        isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                    )}
                >
                    <Close fontSize="medium" />
                </button>

                {/* Header: Icon + Status + Level */}
                <div className="flex items-start justify-between mb-4 pr-10">
                    <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl",
                        isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                    )}>
                        {topic.icon}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                            {topic.status}
                        </span>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            getLevelColor(topic.level)
                        )}>
                            {topic.level}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h2 className={cn(
                    "text-2xl font-bold mb-2",
                    isDark ? "text-white" : "text-slate-900"
                )}>
                    {topic.title}
                </h2>

                {/* Description */}
                <p className={cn(
                    "text-base mb-6",
                    isDark ? "text-slate-400" : "text-slate-600"
                )}>
                    {topic.description}
                </p>

                {/* Details Grid */}
                <div className={cn(
                    "grid grid-cols-3 gap-4 p-4 rounded-xl mb-6",
                    isDark ? "bg-slate-800/50" : "bg-slate-50"
                )}>
                    <div className="text-center">
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? "text-white" : "text-slate-900"
                        )}>{topic.duration}</p>
                        <p className={cn(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-slate-500"
                        )}>Duration</p>
                    </div>
                    <div className="text-center">
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? "text-white" : "text-slate-900"
                        )}>{topic.lessons}</p>
                        <p className={cn(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-slate-500"
                        )}>Lessons</p>
                    </div>
                    <div className="text-center">
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? "text-white" : "text-slate-900"
                        )}>{topic.students}</p>
                        <p className={cn(
                            "text-xs",
                            isDark ? "text-slate-400" : "text-slate-500"
                        )}>Students</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {topic.tags?.map((tag: string, i: number) => (
                        <span
                            key={`${tag}-${i}`}
                            className={cn(
                                "rounded-md px-3 py-1 text-xs font-medium",
                                isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                            )}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <ParticleButton
                        type="button"
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                            "bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                        )}
                        successDuration={600}
                        onClick={handleStartLearning}
                    >
                        <PlayArrow fontSize="small" />
                        Start Learning
                    </ParticleButton>
                    <ParticleButton
                        type="button"
                        className={cn(
                            "px-6 py-3 rounded-xl font-medium transition-all",
                            isDark 
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                        successDuration={600}
                        onClick={onClose}
                    >
                        Close
                    </ParticleButton>
                </div>
            </div>
        </div>
    )
}

const ComputerBasicList = () => {
    const { mode } = useTheme()
    const isDark = mode === 'dark'

    const [selectedTopic, setSelectedTopic] = useState<any>(null)

    const topics = [
        {
            id: 1,
            title: 'Computer Fundamentals',
            level: 'Beginner',
            duration: '20 min',
            lessons: 10,
            students: 2345,
            description: 'Learn the basic components and functions of a computer system',
            icon: <Computer fontSize="small" />,
            status: 'Popular',
            tags: ['Beginner', 'Hardware'],
            slug: 'computer-fundamentals',
        },
        {
            id: 2,
            title: 'Operating Systems Basics',
            level: 'Beginner',
            duration: '25 min',
            lessons: 8,
            students: 1890,
            description: 'Understand different operating systems and their core features',
            icon: <Storage fontSize="small" />,
            status: 'Trending',
            tags: ['Beginner', 'Software'],
            slug: 'operating-systems-basics',
        },
        {
            id: 3,
            title: 'Microsoft Office Suite',
            level: 'Beginner',
            duration: '30 min',
            lessons: 12,
            students: 2156,
            description: 'Master Word, Excel, PowerPoint and other Office applications',
            icon: <MenuBook fontSize="small" />,
            status: 'Popular',
            tags: ['Beginner', 'Office'],
            slug: 'microsoft-office-suite',
        },
        {
            id: 4,
            title: 'Internet & Email Basics',
            level: 'Intermediate',
            duration: '20 min',
            lessons: 9,
            students: 1678,
            description: 'Learn how to browse the internet safely and use email effectively',
            icon: <Devices fontSize="small" />,
            status: 'Top Rated',
            tags: ['Intermediate', 'Internet'],
            slug: 'internet-email-basics',
        },
        {
            id: 5,
            title: 'File Management',
            level: 'Intermediate',
            duration: '15 min',
            lessons: 6,
            students: 1432,
            description: 'Organize, store, and manage files and folders efficiently',
            icon: <Storage fontSize="small" />,
            status: 'Active',
            tags: ['Intermediate', 'Organization'],
            slug: 'file-management',
        },
        {
            id: 6,
            title: 'Computer Security Basics',
            level: 'Advanced',
            duration: '35 min',
            lessons: 14,
            students: 987,
            description: 'Protect your computer from viruses, malware, and online threats',
            icon: <Security fontSize="small" />,
            status: 'Advanced',
            tags: ['Advanced', 'Security'],
            slug: 'computer-security-basics',
        },
        {
            id: 7,
            title: 'Troubleshooting & Maintenance',
            level: 'Intermediate',
            duration: '25 min',
            lessons: 11,
            students: 1123,
            description: 'Diagnose and fix common computer problems and perform maintenance',
            icon: <Settings fontSize="small" />,
            status: 'Popular',
            tags: ['Intermediate', 'Maintenance'],
            slug: 'troubleshooting-maintenance',
        },
        {
            id: 8,
            title: 'Cloud Computing Basics',
            level: 'Advanced',
            duration: '30 min',
            lessons: 13,
            students: 876,
            description: 'Understand cloud storage, services, and their practical applications',
            icon: <Cloud fontSize="small" />,
            status: 'Trending',
            tags: ['Advanced', 'Cloud'],
            slug: 'cloud-computing-basics',
        },
        {
            id: 9,
            title: 'Keyboard Shortcuts & Productivity',
            level: 'Beginner',
            duration: '15 min',
            lessons: 7,
            students: 1956,
            description: 'Boost your productivity with essential keyboard shortcuts and tips',
            icon: <Computer fontSize="small" />,
            status: 'New',
            tags: ['Beginner', 'Productivity'],
            slug: 'keyboard-shortcuts-productivity',
        },
    ]

    const handleCardClick = (topic: any) => {
        setSelectedTopic(topic)
    }

    const handleCloseDetail = () => {
        setSelectedTopic(null)
    }

    const getLevelColor = (level: string) => {
        if (isDark) {
            switch (level) {
                case 'Beginner': return 'bg-green-900/30 text-green-300'
                case 'Intermediate': return 'bg-yellow-900/30 text-yellow-300'
                case 'Advanced': return 'bg-red-900/30 text-red-300'
                default: return 'bg-gray-700 text-gray-300'
            }
        } else {
            switch (level) {
                case 'Beginner': return 'bg-green-100 text-green-700'
                case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
                case 'Advanced': return 'bg-red-100 text-red-700'
                default: return 'bg-gray-100 text-gray-700'
            }
        }
    }

    return (
        <div className={cn(
            "min-h-screen transition-colors duration-300",
            isDark ? 'bg-gray-900' : 'bg-white'
        )}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={cn(
                            "text-3xl font-bold",
                            isDark ? "text-slate-100" : "text-slate-950/70"
                        )}>
                            Computer Basics
                        </h1>
                        <p className={cn(
                            "text-sm",
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            Learn essential computer skills for beginners and intermediate users
                        </p>
                    </div>
                    <ParticleButton
                        type="button"
                        className={cn(
                            "flex items-center px-4 py-2 border rounded-lg text-sm font-medium",
                            isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                        )}
                        successDuration={600}
                    >
                        Start Learning
                    </ParticleButton>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className={cn(
                        "p-4 rounded-lg border",
                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>80+</p>
                        <p className={cn(
                            "text-sm",
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>Lessons</p>
                    </div>
                    <div className={cn(
                        "p-4 rounded-lg border",
                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>10K</p>
                        <p className={cn(
                            "text-sm",
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>Students</p>
                    </div>
                    <div className={cn(
                        "p-4 rounded-lg border",
                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>9</p>
                        <p className={cn(
                            "text-sm",
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>Topics</p>
                    </div>
                    <div className={cn(
                        "p-4 rounded-lg border",
                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                        <p className={cn(
                            "text-2xl font-bold",
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>92%</p>
                        <p className={cn(
                            "text-sm",
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>Success Rate</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
                        <ParticleButton
                            key={filter}
                            type="button"
                            className={cn(
                                "flex items-center px-4 py-2 border rounded-lg text-sm font-medium",
                                filter === 'All'
                                    ? isDark
                                        ? "text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700"
                                        : "text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200"
                                    : isDark
                                        ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800"
                                        : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
                            )}
                            successDuration={600}
                        >
                            {filter}
                        </ParticleButton>
                    ))}
                </div>

                {/* Topics Grid with Card Pattern */}
                <div className={cn(
                    "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                )}>
                    {topics.map((topic, index) => (
                        <div
                            key={`${topic.title}-${index}`}
                            className={cn(
                                "group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300",
                                "border will-change-transform",
                                isDark
                                    ? "border-slate-800 bg-slate-900/50 hover:border-teal-500/30 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-teal-500/5"
                                    : "border-slate-200 bg-white hover:shadow-lg hover:shadow-teal-100/20",
                                "hover:-translate-y-0.5 cursor-pointer"
                            )}
                            onClick={() => handleCardClick(topic)}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className={cn(
                                    "absolute inset-0 bg-size[4px_4px]",
                                    isDark
                                        ? "bg-[radial-linear(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                                        : "bg-[radial-linear(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)]"
                                )} />
                            </div>

                            {/* Content */}
                            <div className="relative flex flex-col space-y-3">
                                {/* Header: Icon + Status + Level */}
                                <div className="flex items-center justify-between">
                                    <div className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                                        isDark
                                            ? "bg-slate-800 text-slate-300"
                                            : "bg-slate-100 text-slate-600 group-hover:bg-teal-50"
                                    )}>
                                        {topic.icon}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors duration-300",
                                            isDark
                                                ? "bg-slate-800 text-slate-300"
                                                : "bg-slate-100 text-slate-600 group-hover:bg-teal-50"
                                        )}>
                                            {topic.status}
                                        </span>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium",
                                            getLevelColor(topic.level)
                                        )}>
                                            {topic.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Title & Description */}
                                <div className="space-y-2">
                                    <h3 className={cn(
                                        "text-[15px] font-medium tracking-tight",
                                        isDark ? "text-white" : "text-slate-900"
                                    )}>
                                        {topic.title}
                                        <span className={cn(
                                            "ml-2 text-xs font-normal",
                                            isDark ? "text-slate-400" : "text-slate-500"
                                        )}>
                                            {topic.lessons} lessons
                                        </span>
                                    </h3>
                                    <p className={cn(
                                        "text-sm leading-snug",
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    )}>
                                        {topic.description}
                                    </p>
                                </div>

                                {/* Duration, Lessons, Students */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <AccessTime fontSize="small" className="h-3 w-3" />
                                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>{topic.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MenuBook fontSize="small" className="h-3 w-3" />
                                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>{topic.lessons} lessons</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <School fontSize="small" className="h-3 w-3" />
                                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>{topic.students} students</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                                    {topic.tags?.map((tag, i) => (
                                        <span
                                            key={`${tag}-${i}`}
                                            className={cn(
                                                "rounded-md px-2 py-1 backdrop-blur-sm transition-all duration-200",
                                                isDark
                                                    ? "bg-slate-800 text-slate-300"
                                                    : "bg-slate-100 text-slate-600 hover:bg-teal-50"
                                            )}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Click to view detail indicator */}
                                <div className="mt-1 text-xs flex items-center gap-1 text-teal-500">
                                    <span>Click to view details</span>
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Border linear */}
                            <div
                                className={cn(
                                    "absolute inset-0 -z-10 rounded-xl p-px transition-opacity duration-300",
                                    isDark
                                        ? "bg-linear-to-br from-transparent via-teal-500/20 to-transparent"
                                        : "bg-linear-to-br from-transparent via-teal-300/30 to-transparent",
                                    "opacity-0 group-hover:opacity-100"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Nested Detail Component - Shows when card is clicked */}
            {selectedTopic && (
                <LessonDetail 
                    topic={selectedTopic} 
                    onClose={handleCloseDetail} 
                />
            )}
        </div>
    )
}

export default ComputerBasicList