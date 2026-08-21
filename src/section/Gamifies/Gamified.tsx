import { useTheme } from '@/theme/AppThemeProvider'
import {
    PlayArrow,
    AccessTime,
    Star,
    School,
    MenuBook,
    EmojiEvents,
    TrendingUp,
} from '@mui/icons-material'

const SpokenEnglishList = () => {
    const { mode } = useTheme()
    const isDark = mode === 'dark'

    const topics = [
        {
            id: 1,
            title: 'Greetings & Introductions',
            description: 'Learn how to greet people and introduce yourself in various settings',
            level: 'Beginner',
            duration: '15 min',
            lessons: 8,
            students: 1245,
            rating: 4.8,
        },
        {
            id: 2,
            title: 'Daily Conversations',
            description: 'Practice common daily conversations for real-life situations',
            level: 'Beginner',
            duration: '20 min',
            lessons: 10,
            students: 980,
            rating: 4.6,
        },
        {
            id: 3,
            title: 'Shopping & Dining',
            description: 'Master vocabulary and phrases for shopping and dining out',
            level: 'Intermediate',
            duration: '25 min',
            lessons: 12,
            students: 756,
            rating: 4.7,
        },
        {
            id: 4,
            title: 'Workplace Communication',
            description: 'Improve your professional communication skills at work',
            level: 'Intermediate',
            duration: '30 min',
            lessons: 15,
            students: 892,
            rating: 4.9,
        },
        {
            id: 5,
            title: 'Travel & Tourism',
            description: 'Essential English phrases for traveling and tourism',
            level: 'Intermediate',
            duration: '20 min',
            lessons: 9,
            students: 634,
            rating: 4.5,
        },
        {
            id: 6,
            title: 'Public Speaking',
            description: 'Develop confidence and skills for public speaking in English',
            level: 'Advanced',
            duration: '40 min',
            lessons: 14,
            students: 523,
            rating: 4.8,
        },
        {
            id: 7,
            title: 'Business English',
            description: 'Learn business vocabulary, email writing, and meeting etiquette',
            level: 'Advanced',
            duration: '35 min',
            lessons: 16,
            students: 678,
            rating: 4.7,
        },
        {
            id: 8,
            title: 'Idioms & Expressions',
            description: 'Master common English idioms and everyday expressions',
            level: 'Intermediate',
            duration: '25 min',
            lessons: 11,
            students: 445,
            rating: 4.4,
        },
        {
            id: 9,
            title: 'Pronunciation Mastery',
            description: 'Perfect your English pronunciation and accent reduction',
            level: 'Beginner',
            duration: '30 min',
            lessons: 13,
            students: 1123,
            rating: 4.9,
        },
    ]

    const stats = [
        { label: 'Total Lessons', value: '120+', icon: MenuBook },
        { label: 'Active Students', value: '15K+', icon: School },
        { label: 'Achievements', value: '45', icon: EmojiEvents },
        { label: 'Success Rate', value: '94%', icon: TrendingUp },
    ]

    const getLevelColor = (level: string) => {
        if (isDark) {
            switch (level) {
                case 'Beginner':
                    return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                case 'Intermediate':
                    return 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                case 'Advanced':
                    return 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                default:
                    return 'bg-slate-500/20 text-slate-300 border-slate-400/30'
            }
        } else {
            switch (level) {
                case 'Beginner':
                    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
                case 'Intermediate':
                    return 'bg-amber-50 text-amber-700 border-amber-200'
                case 'Advanced':
                    return 'bg-rose-50 text-rose-700 border-rose-200'
                default:
                    return 'bg-slate-50 text-slate-700 border-slate-200'
            }
        }
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
            {/* Background Gradient */}
            <div
                className={`pointer-events-none absolute inset-0 ${
                    isDark
                        ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(99,102,241,0.10),transparent_35%)]'
                        : 'bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.10),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.08),transparent_35%)]'
                }`}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl md:text-4xl font-bold flex items-center gap-3 ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                <span className={`inline-flex p-2 rounded-2xl ${
                                    isDark ? 'bg-sky-500/10 text-sky-300' : 'bg-sky-50 text-sky-600'
                                }`}>
                                    <School fontSize="large" />
                                </span>
                                "Spoken English Lessons"
                            </h1>
                            <p className={`mt-2 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                "Improve your English speaking skills with our curated lessons"
                            </p>
                        </div>
                        <button
                            className={`px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105 ${
                                isDark
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25'
                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg hover:shadow-sky-500/25'
                            }`}
                        >
                            "Start Learning"
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl border p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                                    isDark
                                        ? 'border-white/10 bg-slate-900/80 shadow-black/30'
                                        : 'border-slate-200/80 bg-white/90 shadow-slate-200/70'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${
                                        isDark ? 'bg-slate-800' : 'bg-slate-100'
                                    }`}>
                                        <Icon className={isDark ? 'text-sky-300' : 'text-sky-600'} />
                                    </div>
                                    <div>
                                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {stat.value}
                                        </p>
                                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {stat.label} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                filter === 'All'
                                    ? isDark
                                        ? 'bg-sky-400/15 text-sky-200 border border-sky-300/20'
                                        : 'bg-sky-50 text-sky-700 border border-sky-300/60'
                                    : isDark
                                        ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/10'
                                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                            }`}
                        >
                            {filter} 
                        </button>
                    ))}
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className={`group rounded-2xl border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
                                isDark
                                    ? 'border-white/10 bg-slate-900/80 shadow-black/30 hover:border-sky-400/30 hover:shadow-sky-500/5'
                                    : 'border-slate-200/80 bg-white/90 shadow-slate-200/70 hover:border-sky-400/30 hover:shadow-sky-500/10'
                            }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(
                                        topic.level
                                    )}`}
                                >
                                    {topic.level} 
                                </span>
                                <div className="flex items-center gap-1">
                                    <Star className="text-amber-400" fontSize="small" />
                                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {topic.rating}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {topic.title} 
                            </h3>

                            {/* Description */}
                            <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {topic.description} 
                            </p>

                            {/* Meta Info */}
                            <div className={`flex items-center gap-4 text-sm border-t pt-4 ${
                                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                            }`}>
                                <div className="flex items-center gap-1">
                                    <AccessTime fontSize="small" />
                                    <span>{topic.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MenuBook fontSize="small" />
                                    <span>{topic.lessons} lessons</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <School fontSize="small" />
                                    <span>{topic.students}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                className={`mt-4 w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                                    isDark
                                        ? 'bg-sky-400/10 text-sky-300 border border-sky-400/20 hover:bg-sky-400/20'
                                        : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                                }`}
                            >
                                <PlayArrow fontSize="small" />
                               "Start Lesson"
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <footer className={`mt-12 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            © 2026 SpeakEasy. "All rights reserved"
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className={isDark ? 'text-slate-400 hover:text-sky-300' : 'text-slate-500 hover:text-sky-600'}>
                               About                            </a>
                            <a href="#" className={isDark ? 'text-slate-400 hover:text-sky-300' : 'text-slate-500 hover:text-sky-600'}>
                                Privacy
                            </a>
                            <a href="#" className={isDark ? 'text-slate-400 hover:text-sky-300' : 'text-slate-500 hover:text-sky-600'}>
                                Terms
                            </a>
                            <a href="#" className={isDark ? 'text-slate-400 hover:text-sky-300' : 'text-slate-500 hover:text-sky-600'}>
                                Contact
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default SpokenEnglishList