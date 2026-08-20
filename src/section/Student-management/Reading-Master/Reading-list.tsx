import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrash,
    FaEye,
    FaClock,
    FaChalkboardTeacher,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaBook,
    FaVideo,
    FaFilePdf,
    FaImage,
    FaLink,
    FaUsers,
    FaChartBar,
    FaList,
    FaTh,
    FaTimes
} from 'react-icons/fa';

// Define the ReadingMaterial interface
interface ReadingMaterial {
    id: string;
    title: string;
    subject: string;
    gradeLevel: string;
    duration: string;
    objectives: string[];
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    lastModified: string;
    resources: { type: string; title: string; url: string }[];
    standards: string[];
    author: string;
    timesTaught: number;
    rating: number;
    imageUrl?: string;
}

const ReadingList = () => {
    // Sample material data with image URLs
    const [readingMaterials] = useState<ReadingMaterial[]>([
        {
            id: '1',
            title: 'Introduction to Quadratic Equations',
            subject: 'Mathematics',
            gradeLevel: '9th Grade',
            duration: '45 minutes',
            objectives: ['Understand quadratic functions', 'Solve quadratic equations using factoring', 'Graph quadratic equations'],
            status: 'published',
            createdAt: '2023-10-15',
            lastModified: '2023-10-20',
            resources: [
                { type: 'video', title: 'Quadratic Formula Explained', url: 'https://example.com/video1' },
                { type: 'pdf', title: 'Practice Problems', url: 'https://example.com/pdf1' }
            ],
            standards: ['CCSS.MATH.CONTENT.HSA.REI.B.4', 'CCSS.MATH.CONTENT.HSA.SSE.B.3'],
            author: 'John Smith',
            timesTaught: 24,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '2',
            title: 'Photosynthesis Process',
            subject: 'Science',
            gradeLevel: '7th Grade',
            duration: '60 minutes',
            objectives: ['Explain the process of photosynthesis', 'Identify the reactants and products', 'Understand the importance of photosynthesis'],
            status: 'published',
            createdAt: '2023-11-05',
            lastModified: '2023-11-10',
            resources: [
                { type: 'image', title: 'Photosynthesis Diagram', url: 'https://example.com/image1' },
                { type: 'link', title: 'Interactive Simulation', url: 'https://example.com/link1' }
            ],
            standards: ['NGSS.MS-LS1-6', 'NGSS.MS-LS1-7'],
            author: 'Sarah Johnson',
            timesTaught: 18,
            rating: 4.2,
            imageUrl: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '3',
            title: 'Shakespeare\'s Macbeth Analysis',
            subject: 'English',
            gradeLevel: '11th Grade',
            duration: '90 minutes',
            objectives: ['Analyze themes in Macbeth', 'Understand Shakespearean language', 'Explore character development'],
            status: 'draft',
            createdAt: '2023-11-12',
            lastModified: '2023-11-12',
            resources: [
                { type: 'pdf', title: 'Macbeth Full Text', url: 'https://example.com/pdf2' },
                { type: 'video', title: 'Macbeth Summary', url: 'https://example.com/video2' }
            ],
            standards: ['CCSS.ELA-LITERACY.RL.11-12.1', 'CCSS.ELA-LITERACY.RL.11-12.2'],
            author: 'Michael Brown',
            timesTaught: 0,
            rating: 0,
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '4',
            title: 'World War II Causes',
            subject: 'History',
            gradeLevel: '10th Grade',
            duration: '75 minutes',
            objectives: ['Identify causes of WWII', 'Understand geopolitical factors', 'Analyze primary sources'],
            status: 'published',
            createdAt: '2023-09-20',
            lastModified: '2023-10-05',
            resources: [
                { type: 'link', title: 'Timeline of Events', url: 'https://example.com/link2' },
                { type: 'pdf', title: 'Primary Source Documents', url: 'https://example.com/pdf3' }
            ],
            standards: ['CCSS.ELA-LITERACY.RH.9-10.3', 'CCSS.ELA-LITERACY.RH.9-10.4'],
            author: 'Emily Davis',
            timesTaught: 32,
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: '5',
            title: 'Introduction to Watercolor Techniques',
            subject: 'Art',
            gradeLevel: '8th Grade',
            duration: '120 minutes',
            objectives: ['Learn basic watercolor techniques', 'Practice color mixing', 'Create a simple landscape'],
            status: 'archived',
            createdAt: '2023-08-15',
            lastModified: '2023-09-01',
            resources: [
                { type: 'video', title: 'Watercolor Basics', url: 'https://example.com/video3' },
                { type: 'image', title: 'Technique Examples', url: 'https://example.com/image2' }
            ],
            standards: ['NCCAS.VA.Cr1.1.8a', 'NCCAS.VA.Cr2.1.8a'],
            author: 'Robert Wilson',
            timesTaught: 15,
            rating: 4.0,
            imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [subjectFilter, setSubjectFilter] = useState<string>('all');
    const [gradeFilter, setGradeFilter] = useState<string>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ReadingMaterial; direction: 'ascending' | 'descending' } | null>(null);
    const [expandedReading, setExpandedReading] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Available filters
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
    const gradeLevels = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
        '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

    // Handle sorting
    const handleSort = (key: keyof ReadingMaterial) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Get sorted materials
     const getSortedReadings = () => {
    if (!sortConfig) return readingMaterials;

    return [...readingMaterials].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (bValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
        
        // Handle different data types appropriately
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'ascending' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }
        
        // Fallback for other types or mixed types
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });
};

    // Filter materials based on search term and filters
    const filteredReadings = getSortedReadings().filter(reading => {
        const matchesSearch = reading.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reading.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reading.objectives.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || reading.status === statusFilter;
        const matchesSubject = subjectFilter === 'all' || reading.subject === subjectFilter;
        const matchesGrade = gradeFilter === 'all' || reading.gradeLevel === gradeFilter;

        return matchesSearch && matchesStatus && matchesSubject && matchesGrade;
    });

    // Get status badge style
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'published':
                return {
                    style: 'bg-green-100 text-green-800',
                    icon: 'Published'
                };
            case 'draft':
                return {
                    style: 'bg-yellow-100 text-yellow-800',
                    icon: 'Draft'
                };
            case 'archived':
                return {
                    style: 'bg-gray-100 text-gray-800',
                    icon: 'Archived'
                };
            default:
                return {
                    style: 'bg-gray-100 text-gray-800',
                    icon: 'Unknown'
                };
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get resource icon
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <FaVideo className="text-red-500" />;
            case 'pdf':
                return <FaFilePdf className="text-red-600" />;
            case 'image':
                return <FaImage className="text-green-500" />;
            case 'link':
                return <FaLink className="text-blue-500" />;
            default:
                return <FaLink className="text-gray-500" />;
        }
    };

    // Render sort icon
    const renderSortIcon = (key: keyof ReadingMaterial) => {
        if (!sortConfig || sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
        if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
        return <FaSortDown className="ml-1" />;
    };

    // Toggle material expansion
    const toggleReadingExpansion = (readingId: string) => {
        setExpandedReading(expandedReading === readingId ? null : readingId);
    };

    // Render star rating
    const renderRating = (rating: number) => {
        if (rating === 0) return <span className="text-gray-400">No ratings</span>;

        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                        <FaBook className="mr-3 text-indigo-600" />
                        Reading Materials
                    </h1>
                    <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
                        Browse and access all your reading materials
                    </p>
                </div>

                {/* Stats Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                >
                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center border border-gray-100">
                        <div className="rounded-full bg-indigo-100 p-3 mr-4">
                            <FaBook className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Readings</p>
                            <p className="text-xl md:text-2xl font-bold">{readingMaterials.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center border border-gray-100">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <FaChalkboardTeacher className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Published</p>
                            <p className="text-xl md:text-2xl font-bold">{readingMaterials.filter(l => l.status === 'published').length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center border border-gray-100">
                        <div className="rounded-full bg-yellow-100 p-3 mr-4">
                            <FaClock className="text-yellow-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Drafts</p>
                            <p className="text-xl md:text-2xl font-bold">{readingMaterials.filter(l => l.status === 'draft').length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-4 flex items-center border border-gray-100">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <FaUsers className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Taught</p>
                            <p className="text-xl md:text-2xl font-bold">{readingMaterials.reduce((acc, reading) => acc + reading.timesTaught, 0)}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-100"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search reading materials by title, subject, or objectives..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-3 justify-between">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                <FaFilter />
                                Filters
                                {showFilters && <FaTimes className="ml-1" />}
                            </button>

                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    <FaTh />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <select
                                        value={subjectFilter}
                                        onChange={(e) => setSubjectFilter(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="all">All Subjects</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                                    <select
                                        value={gradeFilter}
                                        onChange={(e) => setGradeFilter(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="all">All Grades</option>
                                        {gradeLevels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Lessons Grid/List */}
                {filteredReadings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500 border border-gray-100">
                        <FaSearch className="mx-auto text-4xl mb-4 text-gray-300" />
                        <p className="text-lg">No reading materials found</p>
                        <p className="mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredReadings.map((reading) => {
                            const statusInfo = getStatusInfo(reading.status);

                            return (
                                <motion.div 
                                    key={reading.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300"
                                >
                                    <a 
                                        href={reading.resources.find(r => r.type === 'pdf')?.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="relative flex-grow flex flex-col items-center justify-center p-6 bg-gray-100 hover:bg-gray-200 transition-colors h-48 text-center"
                                    >
                                        <FaFilePdf className="text-5xl text-red-500 mb-3" />
                                        <p className="font-semibold text-gray-700 line-clamp-3">{reading.title}</p>
                                        <div className="absolute top-4 right-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.style}`}>
                                                {statusInfo.icon}
                                            </span>
                                        </div>
                                    </a>
                                    
                                    <div className="p-5 flex-shrink-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {reading.subject}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {reading.gradeLevel}
                                            </span>
                                        </div>
                                        
                                        
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FaChalkboardTeacher className="mr-1" />
                                            <span>by {reading.author}</span>
                                            <span className="mx-2">•</span>
                                            <FaClock className="mr-1" />
                                            <span>{reading.duration}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center">
                                                <FaUsers className="mr-1 text-gray-400" />
                                                <span className="text-sm text-gray-600">Taught {reading.timesTaught} times</span>
                                            </div>
                                            {renderRating(reading.rating)}
                                        </div>
                                        
                                        <div className="flex justify-between pt-4 border-t border-gray-100">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                                onClick={() => toggleReadingExpansion(reading.id)}
                                            >
                                                <FaEye className="text-sm" />
                                                View Details
                                            </motion.button>
                                            
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-gray-400 rounded-full cursor-not-allowed"
                                                    title="Edit Reading (disabled)"
                                                    disabled
                                                >
                                                    <FaEdit />
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-gray-400 rounded-full cursor-not-allowed"
                                                    title="Delete Reading (disabled)"
                                                    disabled
                                                >
                                                    <FaTrash />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Reading Details */}
                                    <AnimatePresence>
                                        {expandedReading === reading.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-50 p-5 border-t border-gray-200"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-medium text-gray-800">Reading Details</h3>
                                                    <button 
                                                        onClick={() => setExpandedReading(null)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Learning Objectives</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {reading.objectives.map((obj, i) => (
                                                                <li key={i} className="text-sm text-gray-600">{obj}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Attached Files</h4>
                                                        <div className="space-y-2">
                                                            {reading.resources.map((resource, i) => (
                                                                <div key={i} className="flex items-center bg-white p-2 rounded-lg border">
                                                                    <span className="mr-2">{getResourceIcon(resource.type)}</span>
                                                                    <span className="text-sm text-gray-700 flex-1">{resource.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <div>
                                                            <div>Created: {formatDate(reading.createdAt)}</div>
                                                            <div>Modified: {formatDate(reading.lastModified)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                    >
                        {/* Table Header */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                            <div
                                className="col-span-4 flex items-center cursor-pointer"
                                onClick={() => handleSort('title')}
                            >
                                Reading {renderSortIcon('title')}
                            </div>
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => handleSort('subject')}
                            >
                                Subject {renderSortIcon('subject')}
                            </div>
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => handleSort('gradeLevel')}
                            >
                                Grade {renderSortIcon('gradeLevel')}
                            </div>
                            <div
                                className="col-span-2 flex items-center cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                Status {renderSortIcon('status')}
                            </div>
                            <div className="col-span-2 text-center">
                                Actions
                            </div>
                        </div>

                        {/* Reading Items */}
                        {filteredReadings.map((reading) => {
                            const statusInfo = getStatusInfo(reading.status);

                            return (
                                <div key={reading.id} className="border-b border-gray-100 last:border-b-0">
                                    {/* Reading Summary */}
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                        onClick={() => toggleReadingExpansion(reading.id)}
                                    >
                                        <div className="md:col-span-4">
                                            <div className="font-medium text-gray-900">{reading.title}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reading.objectives[0]}
                                                {reading.objectives.length > 1 && '...'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <FaChalkboardTeacher className="mr-1" />
                                                <span>by {reading.author}</span>
                                                <span className="mx-2">•</span>
                                                <FaClock className="mr-1" />
                                                <span>{reading.duration}</span>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex items-center">
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {reading.subject}
                                            </span>
                                        </div>

                                        <div className="md:col-span-2 flex items-center">
                                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {reading.gradeLevel}
                                            </span>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.style}`}>
                                                    {statusInfo.icon}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-1" />
                                                    <span>Taught {reading.timesTaught} times</span>
                                                </div>
                                                {renderRating(reading.rating)}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex items-center justify-center space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="View Details"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleReadingExpansion(reading.id);
                                                }}
                                            >
                                                <FaEye />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-gray-400 rounded-full cursor-not-allowed"
                                                title="Edit Reading (disabled)"
                                                disabled
                                            >
                                                <FaEdit />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-gray-400 rounded-full cursor-not-allowed"
                                                title="Delete Reading (disabled)"
                                                disabled
                                            >
                                                <FaTrash />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Expanded Reading Details */}
                                    <AnimatePresence>
                                        {expandedReading === reading.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-50 p-4 border-t border-gray-200"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-medium text-gray-800">Reading Details</h3>
                                                    <button 
                                                        onClick={() => setExpandedReading(null)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Learning Objectives</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {reading.objectives.map((obj, i) => (
                                                                <li key={i} className="text-sm text-gray-600">{obj}</li>
                                                            ))}
                                                        </ul>

                                                        <h4 className="font-medium text-gray-700 mt-4 mb-2">Standards</h4>
                                                        <ul className="list-disc pl-5 space-y-1">
                                                            {reading.standards.map((standard, i) => (
                                                                <li key={i} className="text-sm text-gray-600">{standard}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Attached Files</h4>
                                                        <div className="space-y-2">
                                                            {reading.resources.map((resource, i) => (
                                                                <div key={i} className="flex items-center bg-white p-2 rounded-lg border">
                                                                    <span className="mr-2">{getResourceIcon(resource.type)}</span>
                                                                    <span className="text-sm text-gray-700 flex-1">{resource.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-between mt-4 text-sm text-gray-500">
                                                            <div>
                                                                <div>Created: {formatDate(reading.createdAt)}</div>
                                                                <div>Modified: {formatDate(reading.lastModified)}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-center">
                                                                    <FaChartBar className="mr-1" />
                                                                    <span>Taught {reading.timesTaught} times</span>
                                                                </div>
                                                                {renderRating(reading.rating)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ReadingList;