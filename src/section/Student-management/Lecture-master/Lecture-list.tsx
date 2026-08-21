import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiVideo,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlay,
  FiClock,
  FiUsers,
  FiUpload,
  FiDownload,
  FiShare2,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiBook,
  FiPlus
} from 'react-icons/fi';
import { Translated } from '../../../components/common/translator/translator';

interface VideoLecture {
  id: number;
  title: string;
  description: string;
  course: string;
  subject: string;
  duration: string;
  fileSize: string;
  uploadDate: string;
  lastModified: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  studentsWatched: number;
  averageWatchTime: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  scheduledDate?: string;
  isDownloadable: boolean;
  isPublic: boolean;
}

interface VideoLecturesProps {
  facultyId: string;
}

const sampleVideoLectures: VideoLecture[] = [
  {
    id: 1,
    title: 'Introduction to Calculus - Limits and Continuity',
    description: 'Comprehensive introduction to limits, continuity, and the fundamental concepts of calculus with practical examples.',
    course: 'Mathematics',
    subject: 'Calculus',
    duration: '45:22',
    fileSize: '245.7 MB',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-16',
    status: 'published',
    views: 1247,
    studentsWatched: 89,
    averageWatchTime: '32:15',
    thumbnail: '/thumbnails/calculus-intro.jpg',
    videoUrl: '/videos/calculus-intro.mp4',
    tags: ['calculus', 'limits', 'continuity', 'mathematics'],
    isDownloadable: true,
    isPublic: true
  },
  {
    id: 2,
    title: 'Quantum Mechanics: Wave-Particle Duality',
    description: 'Exploring the fundamental concept of wave-particle duality in quantum mechanics with experimental evidence.',
    course: 'Physics',
    subject: 'Quantum Mechanics',
    duration: '38:15',
    fileSize: '189.3 MB',
    uploadDate: '2024-01-14',
    lastModified: '2024-01-14',
    status: 'published',
    views: 892,
    studentsWatched: 67,
    averageWatchTime: '28:42',
    thumbnail: '/thumbnails/quantum-wave.jpg',
    videoUrl: '/videos/quantum-wave.mp4',
    tags: ['physics', 'quantum', 'wave-particle', 'duality'],
    isDownloadable: true,
    isPublic: true
  },
  {
    id: 3,
    title: 'Organic Chemistry - Reaction Mechanisms',
    description: 'Detailed explanation of SN1, SN2, E1, and E2 reaction mechanisms with molecular modeling.',
    course: 'Chemistry',
    subject: 'Organic Chemistry',
    duration: '52:48',
    fileSize: '312.5 MB',
    uploadDate: '2024-01-13',
    lastModified: '2024-01-13',
    status: 'draft',
    views: 0,
    studentsWatched: 0,
    averageWatchTime: '0:00',
    thumbnail: '/thumbnails/organic-mechanisms.jpg',
    videoUrl: '/videos/organic-mechanisms.mp4',
    tags: ['chemistry', 'organic', 'reactions', 'mechanisms'],
    isDownloadable: false,
    isPublic: false
  },
  {
    id: 4,
    title: 'Data Structures: Trees and Graphs',
    description: 'Comprehensive tutorial on tree and graph data structures with implementation examples.',
    course: 'Computer Science',
    subject: 'Algorithms',
    duration: '41:33',
    fileSize: '278.9 MB',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-12',
    status: 'scheduled',
    views: 0,
    studentsWatched: 0,
    averageWatchTime: '0:00',
    thumbnail: '/thumbnails/ds-trees.jpg',
    videoUrl: '/videos/ds-trees.mp4',
    tags: ['programming', 'data-structures', 'trees', 'graphs'],
    scheduledDate: '2024-01-20',
    isDownloadable: true,
    isPublic: true
  },
  {
    id: 5,
    title: 'Linear Algebra: Eigenvalues and Eigenvectors',
    description: 'Understanding eigenvalues and eigenvectors with geometric interpretations and applications.',
    course: 'Mathematics',
    subject: 'Linear Algebra',
    duration: '36:17',
    fileSize: '234.1 MB',
    uploadDate: '2024-01-11',
    lastModified: '2024-01-11',
    status: 'published',
    views: 567,
    studentsWatched: 45,
    averageWatchTime: '25:18',
    thumbnail: '/thumbnails/linear-algebra.jpg',
    videoUrl: '/videos/linear-algebra.mp4',
    tags: ['mathematics', 'linear-algebra', 'eigenvalues', 'eigenvectors'],
    isDownloadable: true,
    isPublic: true
  },
  {
    id: 6,
    title: 'Ancient History: Roman Empire',
    description: 'Historical analysis of the Roman Empire from its rise to fall, covering key events and figures.',
    course: 'History',
    subject: 'Ancient History',
    duration: '49:55',
    fileSize: '298.3 MB',
    uploadDate: '2024-01-10',
    lastModified: '2024-01-10',
    status: 'published',
    views: 723,
    studentsWatched: 52,
    averageWatchTime: '35:12',
    thumbnail: '/thumbnails/roman-empire.jpg',
    videoUrl: '/videos/roman-empire.mp4',
    tags: ['history', 'roman', 'empire', 'ancient'],
    isDownloadable: false,
    isPublic: true
  }
];

// const VideoLectures: React.FC<VideoLecturesProps> = ({ facultyId }) => {
const VideoLectures: React.FC<VideoLecturesProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  // const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title' | 'duration'>('date');

  const isSortByValue = (value: string): value is 'date' | 'views' | 'title' | 'duration' => {
    return value === 'date' || value === 'views' || value === 'title' || value === 'duration';
  };

  const courses = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'History', 'Literature'];
  const subjects = ['Calculus', 'Linear Algebra', 'Quantum Mechanics', 'Organic Chemistry', 'Algorithms', 'Ancient History'];
  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' }
  ];

  useEffect(() => {
    setVideoLectures(sampleVideoLectures);
  }, []);

  const filteredVideos = videoLectures.filter(video => {
    const matchesSearch = searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'all' || video.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || video.status === selectedStatus;
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;

    return matchesSearch && matchesCourse && matchesStatus && matchesSubject;
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'views':
        return b.views - a.views;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'duration':
        return parseInt(b.duration) - parseInt(a.duration);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <FiCheckCircle className="text-green-500" />;
      case 'draft': return <FiEdit className="text-yellow-500" />;
      case 'scheduled': return <FiCalendar className="text-blue-500" />;
      default: return <FiXCircle className="text-gray-500" />;
    }
  };

  const handleEditVideo = (video: VideoLecture) => {
    console.log('Edit video:', video);
    // In real app, this would open edit modal/form
  };

  const handleDeleteVideo = (videoId: number) => {
    if (window.confirm('Are you sure you want to delete this video lecture?')) {
      setVideoLectures(videoLectures.filter(v => v.id !== videoId));
    }
  };

  const handlePublishVideo = (videoId: number) => {
    setVideoLectures(videoLectures.map(v =>
      v.id === videoId ? { ...v, status: 'published' as const } : v
    ));
  };

  const getStats = () => {
    const total = videoLectures.length;
    const published = videoLectures.filter(v => v.status === 'published').length;
    const drafts = videoLectures.filter(v => v.status === 'draft').length;
    const scheduled = videoLectures.filter(v => v.status === 'scheduled').length;
    const totalViews = videoLectures.reduce((sum, v) => sum + v.views, 0);
    const totalStudents = videoLectures.reduce((sum, v) => sum + v.studentsWatched, 0);

    return { total, published, drafts, scheduled, totalViews, totalStudents };
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
              <FiVideo className="text-red-500" size={28} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900"><Translated text="Video Lectures" /></h1>
            </div>
            <p className="text-sm text-gray-500 mt-1"><Translated text="Manage and track your video lecture content" /></p>
          </div>

          <button className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <FiPlus size={18} />
            <Translated text="Upload New Video" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600"><Translated text="Total Videos" /></div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-green-600"><Translated text="Published" /></div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            <div className="text-sm text-yellow-600"><Translated text="Drafts" /></div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-sm text-blue-600"><Translated text="Scheduled" /></div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
            <div className="text-sm text-purple-600"><Translated text="Total Views" /></div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalStudents}</div>
            <div className="text-sm text-indigo-600"><Translated text="Students" /></div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search video lectures by title, description, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              value={selectedCourse}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
            >
              <option value="all"><Translated text="All Courses" /></option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              value={selectedSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSubject(e.target.value)}
            >
              <option value="all"><Translated text="All Subjects" /></option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}><Translated text={status.label} /></option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                if (isSortByValue(value)) {
                  setSortBy(value);
                }
              }}
            >
              <option value="date"><Translated text="Sort by Date" /></option>
              <option value="views"><Translated text="Sort by Views" /></option>
              <option value="title"><Translated text="Sort by Title" /></option>
              <option value="duration"><Translated text="Sort by Duration" /></option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Translated text="Grid" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Translated text="List" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Video Lectures Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }
      >
        {sortedVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''
              }`}
          >
            {/* Thumbnail */}
            <div className={`relative ${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full h-48'}`}>
              <div className="w-full h-full bg-linear-to-br from-red-100 to-red-200 flex items-center justify-center">
                <FiVideo className="text-red-400" size={48} />
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                  {getStatusIcon(video.status)}
                  <span className="ml-1 hidden sm:inline">
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEditVideo(video)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2"><Translated text={video.description} /></p>

              {/* Course Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FiBook className="mr-1" size={14} />
                  {video.course} • {video.subject}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  {new Date(video.uploadDate).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <FiEye className="mr-1" size={14} />
                  {video.views} <Translated text="views" />
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" size={14} />
                  {video.studentsWatched} <Translated text="students" />
                </div>
                {video.averageWatchTime !== '0:00' && (
                  <div className="flex items-center">
                    <FiClock className="mr-1" size={14} />
                    Avg: <Translated text={video.averageWatchTime} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {video.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    <Translated text={tag} />
                  </span>
                ))}
                {video.tags.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    +{video.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FiPlay size={14} />
                  <Translated text="Preview" />
                </button>

                {video.status === 'draft' && (
                  <button
                    onClick={() => handlePublishVideo(video.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Translated text="Publish" />
                  </button>
                )}

                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <FiShare2 size={14} />
                </button>

                {video.isDownloadable && (
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiDownload size={14} />
                  </button>
                )}
              </div>

              {/* File Info */}
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>{video.fileSize}</span>
                {video.isPublic ? (
                  <span className="text-green-600"><Translated text="Public" /></span>
                ) : (
                  <span className="text-yellow-600"><Translated text="Private" /></span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl border border-gray-200"
        >
          <FiVideo className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2"><Translated text="No video lectures found" /></h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all'
              ? <Translated text="Try adjusting your search or filters" />
              : <Translated text="You haven't uploaded any video lectures yet" />
            }
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto">
            <FiUpload size={16} />
            <Translated text="Upload Your First Video" />
          </button>
        </motion.div>
      )}

      {/* Quick Actions Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-semibold text-gray-900"><Translated text="Need help with video lectures?" /></h4>
            <p className="text-sm text-gray-600"><Translated text="Check our guide on creating effective educational videos" /></p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Translated text="View Guidelines" />
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <FiUpload size={16} />
              <Translated text="Bulk Upload" />
            </button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default VideoLectures;