import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiFileText,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiShare2,
  FiCalendar,
  FiBook,
  FiPlus,
  FiUsers,
  FiType
} from 'react-icons/fi';

interface TextMaterial {
  id: number;
  title: string;
  description: string;
  course: string;
  subject: string;
  fileSize: string;
  uploadDate: string;
  lastModified: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  studentsAccessed: number;
  downloads: number;
  content: string;
  tags: string[];
  scheduledDate?: string;
  isDownloadable: boolean;
  isPublic: boolean;
  format: 'pdf' | 'doc' | 'txt' | 'html';
  pages?: number;
  wordCount?: number;
}

interface TextMaterialsProps {
  facultyId: string;
}

const sampleTextMaterials: TextMaterial[] = [
  {
    id: 1,
    title: 'Advanced Calculus Study Guide',
    description: 'Comprehensive study guide covering limits, derivatives, integrals, and series with practice problems.',
    course: 'Mathematics',
    subject: 'Calculus',
    fileSize: '8.7 MB',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-16',
    status: 'published',
    views: 1247,
    studentsAccessed: 189,
    downloads: 156,
    content: 'Full text content...',
    tags: ['calculus', 'mathematics', 'study-guide', 'advanced'],
    isDownloadable: true,
    isPublic: true,
    format: 'pdf',
    pages: 45,
    wordCount: 18500
  },
  {
    id: 2,
    title: 'Research Paper Template',
    description: 'Academic research paper template with formatting guidelines and citation examples.',
    course: 'Research Methods',
    subject: 'Academic Writing',
    fileSize: '2.3 MB',
    uploadDate: '2024-01-14',
    lastModified: '2024-01-14',
    status: 'published',
    views: 892,
    studentsAccessed: 134,
    downloads: 98,
    content: 'Template content...',
    tags: ['research', 'template', 'writing', 'academic'],
    isDownloadable: true,
    isPublic: true,
    format: 'doc',
    pages: 12,
    wordCount: 3200
  },
  {
    id: 3,
    title: 'Literature Analysis: Modernist Poetry',
    description: 'In-depth analysis of modernist poetry movements and key literary works.',
    course: 'Literature',
    subject: 'Literary Analysis',
    fileSize: '5.1 MB',
    uploadDate: '2024-01-13',
    lastModified: '2024-01-13',
    status: 'draft',
    views: 0,
    studentsAccessed: 0,
    downloads: 0,
    content: 'Analysis content...',
    tags: ['literature', 'poetry', 'modernist', 'analysis'],
    isDownloadable: false,
    isPublic: false,
    format: 'pdf',
    pages: 28,
    wordCount: 12500
  },
  {
    id: 4,
    title: 'Computer Science Lab Manual',
    description: 'Complete lab manual for data structures and algorithms course with code examples.',
    course: 'Computer Science',
    subject: 'Algorithms',
    fileSize: '6.8 MB',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-12',
    status: 'scheduled',
    views: 0,
    studentsAccessed: 0,
    downloads: 0,
    content: 'Lab manual content...',
    tags: ['programming', 'algorithms', 'lab', 'manual'],
    scheduledDate: '2024-01-20',
    isDownloadable: true,
    isPublic: true,
    format: 'pdf',
    pages: 67,
    wordCount: 28900
  },
  {
    id: 5,
    title: 'Historical Timeline: World War II',
    description: 'Detailed timeline of World War II events with maps and primary source references.',
    course: 'History',
    subject: 'Modern History',
    fileSize: '4.2 MB',
    uploadDate: '2024-01-11',
    lastModified: '2024-01-11',
    status: 'published',
    views: 567,
    studentsAccessed: 89,
    downloads: 67,
    content: 'Timeline content...',
    tags: ['history', 'ww2', 'timeline', 'modern'],
    isDownloadable: true,
    isPublic: true,
    format: 'html',
    pages: 34,
    wordCount: 15600
  }
];

// const TextMaterials: React.FC<TextMaterialsProps> = ({ facultyId }) => {
const TextMaterials: React.FC<TextMaterialsProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [textMaterials, setTextMaterials] = useState<TextMaterial[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const courses = ['Mathematics', 'Research Methods', 'Literature', 'Computer Science', 'History'];
  const formats = [
    { value: 'all', label: 'All Formats', icon: FiType },
    { value: 'pdf', label: 'PDF', color: 'bg-red-100 text-red-800' },
    { value: 'doc', label: 'DOC', color: 'bg-blue-100 text-blue-800' },
    { value: 'txt', label: 'TXT', color: 'bg-gray-100 text-gray-800' },
    { value: 'html', label: 'HTML', color: 'bg-orange-100 text-orange-800' }
  ];
  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' }
  ];

  useEffect(() => {
    setTextMaterials(sampleTextMaterials);
  }, []);

  const filteredTexts = textMaterials.filter(material => {
    const matchesSearch = searchQuery === '' ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'all' || material.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || material.status === selectedStatus;
    const matchesFormat = selectedFormat === 'all' || material.format === selectedFormat;

    return matchesSearch && matchesCourse && matchesStatus && matchesFormat;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'txt': return '📃';
      case 'html': return '🌐';
      default: return '📄';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'doc': return 'bg-blue-100 text-blue-800';
      case 'txt': return 'bg-gray-100 text-gray-800';
      case 'html': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditMaterial = (material: TextMaterial) => {
    console.log('Edit material:', material);
  };

  const handleDeleteMaterial = (materialId: number) => {
    if (window.confirm('Are you sure you want to delete this text material?')) {
      setTextMaterials(textMaterials.filter(m => m.id !== materialId));
    }
  };

  const getStats = () => {
    const total = textMaterials.length;
    const published = textMaterials.filter(m => m.status === 'published').length;
    const drafts = textMaterials.filter(m => m.status === 'draft').length;
    const scheduled = textMaterials.filter(m => m.status === 'scheduled').length;
    const totalViews = textMaterials.reduce((sum, m) => sum + m.views, 0);
    const totalDownloads = textMaterials.reduce((sum, m) => sum + m.downloads, 0);

    return { total, published, drafts, scheduled, totalViews, totalDownloads };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiFileText className="text-blue-500" size={28} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Text Materials</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your documents, guides, and study materials</p>
          </div>

          <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FiPlus size={18} />
            Upload Document
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-green-600">Published</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            <div className="text-sm text-yellow-600">Drafts</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-sm text-blue-600">Scheduled</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
            <div className="text-sm text-purple-600">Total Views</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalDownloads}</div>
            <div className="text-sm text-indigo-600">Downloads</div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search text materials by title, description, or content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedCourse}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedFormat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFormat(e.target.value)}
            >
              {formats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              List
            </button>
          </div>
        </div>
      </motion.header>

      {/* Text Materials Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }
      >
        {filteredTexts.map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all ${viewMode === 'list' ? 'flex' : ''
              }`}
          >
            {/* Format Header */}
            <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 p-4 ${viewMode === 'list' ? 'w-32 flex-shrink-0 flex items-center justify-center' : ''}`}>
              <div className="text-center">
                <div className="text-3xl mb-2">{getFormatIcon(material.format)}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(material.format)}`}>
                  {material.format.toUpperCase()}
                </span>
                <div className="text-sm text-gray-600 mt-1">{material.fileSize}</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
                      {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                    </span>
                    {material.pages && (
                      <span className="text-xs text-gray-500">{material.pages} pages</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{material.title}</h3>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEditMaterial(material)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>

              {/* Course Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FiBook className="mr-1" size={14} />
                  {material.course} • {material.subject}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  {new Date(material.uploadDate).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <FiEye className="mr-1" size={14} />
                  {material.views} views
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" size={14} />
                  {material.studentsAccessed} students
                </div>
                <div className="flex items-center">
                  <FiDownload className="mr-1" size={14} />
                  {material.downloads} downloads
                </div>
              </div>

              {/* Document Details */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                {material.wordCount && (
                  <span>{material.wordCount.toLocaleString()} words</span>
                )}
                {material.pages && (
                  <span>{material.pages} pages</span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {material.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FiEye size={14} />
                  Preview
                </button>

                {material.isDownloadable && (
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiDownload size={14} />
                  </button>
                )}

                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <FiShare2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredTexts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl border border-gray-200"
        >
          <FiFileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No text materials found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'You haven\'t uploaded any text materials yet'
            }
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
            <FiPlus size={16} />
            Upload Your First Document
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TextMaterials;