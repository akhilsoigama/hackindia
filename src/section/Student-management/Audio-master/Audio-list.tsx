import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiHeadphones,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiClock,
  FiUsers,
  FiUpload,
  FiDownload,
  FiShare2,
  FiCalendar,
  FiBook,
  FiPlus,
  FiMusic
} from 'react-icons/fi';
import { Translated } from '../../../components/common/translator/translator';

interface AudioLecture {
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
  plays: number;
  studentsListened: number;
  averageListenTime: string;
  audioUrl: string;
  tags: string[];
  scheduledDate?: string;
  isDownloadable: boolean;
  isPublic: boolean;
  category: 'lecture' | 'podcast' | 'interview' | 'discussion';
}

interface AudioLecturesProps {
  facultyId: string;
}

const sampleAudioLectures: AudioLecture[] = [
  {
    id: 1,
    title: 'French Pronunciation Masterclass',
    description: 'Complete guide to French pronunciation with native speaker examples and practice exercises.',
    course: 'Languages',
    subject: 'French',
    duration: '45:22',
    fileSize: '62.1 MB',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-16',
    status: 'published',
    plays: 892,
    studentsListened: 67,
    averageListenTime: '38:15',
    audioUrl: '/audio/french-pronunciation.mp3',
    tags: ['french', 'pronunciation', 'language', 'audio'],
    isDownloadable: true,
    isPublic: true,
    category: 'lecture'
  },
  {
    id: 2,
    title: 'History of Classical Music - Baroque Period',
    description: 'Exploring the Baroque period with musical examples and historical context.',
    course: 'Music',
    subject: 'Music History',
    duration: '38:15',
    fileSize: '52.8 MB',
    uploadDate: '2024-01-14',
    lastModified: '2024-01-14',
    status: 'published',
    plays: 567,
    studentsListened: 45,
    averageListenTime: '32:42',
    audioUrl: '/audio/baroque-music.mp3',
    tags: ['music', 'history', 'baroque', 'classical'],
    isDownloadable: true,
    isPublic: true,
    category: 'podcast'
  },
  {
    id: 3,
    title: 'Shakespeare Sonnets Analysis',
    description: 'Detailed analysis of selected Shakespeare sonnets with reading and interpretation.',
    course: 'Literature',
    subject: 'English Literature',
    duration: '52:48',
    fileSize: '72.3 MB',
    uploadDate: '2024-01-13',
    lastModified: '2024-01-13',
    status: 'draft',
    plays: 0,
    studentsListened: 0,
    averageListenTime: '0:00',
    audioUrl: '/audio/shakespeare-sonnets.mp3',
    tags: ['literature', 'shakespeare', 'sonnets', 'poetry'],
    isDownloadable: false,
    isPublic: false,
    category: 'lecture'
  },
  {
    id: 4,
    title: 'Interview with Nobel Laureate Dr. Smith',
    description: 'Exclusive interview discussing recent research and career insights.',
    course: 'Science',
    subject: 'Research Methods',
    duration: '41:33',
    fileSize: '57.2 MB',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-12',
    status: 'scheduled',
    plays: 0,
    studentsListened: 0,
    averageListenTime: '0:00',
    audioUrl: '/audio/nobel-interview.mp3',
    tags: ['interview', 'research', 'science', 'nobel'],
    scheduledDate: '2024-01-20',
    isDownloadable: true,
    isPublic: true,
    category: 'interview'
  },
  {
    id: 5,
    title: 'Philosophy Discussion: Existentialism',
    description: 'Roundtable discussion on existentialist philosophy and modern applications.',
    course: 'Philosophy',
    subject: 'Modern Philosophy',
    duration: '36:17',
    fileSize: '49.8 MB',
    uploadDate: '2024-01-11',
    lastModified: '2024-01-11',
    status: 'published',
    plays: 423,
    studentsListened: 38,
    averageListenTime: '28:45',
    audioUrl: '/audio/existentialism-discussion.mp3',
    tags: ['philosophy', 'existentialism', 'discussion', 'modern'],
    isDownloadable: true,
    isPublic: true,
    category: 'discussion'
  }
];

// const AudioLectures: React.FC<AudioLecturesProps> = ({ facultyId }) => {
const AudioLectures: React.FC<AudioLecturesProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [audioLectures, setAudioLectures] = useState<AudioLecture[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const courses = ['Languages', 'Music', 'Literature', 'Science', 'Philosophy', 'History'];
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'lecture', label: 'Lectures' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'interview', label: 'Interviews' },
    { value: 'discussion', label: 'Discussions' }
  ];
  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' }
  ];

  useEffect(() => {
    setAudioLectures(sampleAudioLectures);
  }, []);

  const filteredAudios = audioLectures.filter(audio => {
    const matchesSearch = searchQuery === '' ||
      audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audio.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'all' || audio.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || audio.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || audio.category === selectedCategory;

    return matchesSearch && matchesCourse && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'podcast': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'discussion': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlayPause = (audioId: number) => {
    setCurrentlyPlaying(currentlyPlaying === audioId ? null : audioId);
  };

  const handleEditAudio = (audio: AudioLecture) => {
    console.log('Edit audio:', audio);
  };

  const handleDeleteAudio = (audioId: number) => {
    if (window.confirm('Are you sure you want to delete this audio lecture?')) {
      setAudioLectures(audioLectures.filter(a => a.id !== audioId));
    }
  };

  const getStats = () => {
    const total = audioLectures.length;
    const published = audioLectures.filter(a => a.status === 'published').length;
    const drafts = audioLectures.filter(a => a.status === 'draft').length;
    const scheduled = audioLectures.filter(a => a.status === 'scheduled').length;
    const totalPlays = audioLectures.reduce((sum, a) => sum + a.plays, 0);
    const totalStudents = audioLectures.reduce((sum, a) => sum + a.studentsListened, 0);

    return { total, published, drafts, scheduled, totalPlays, totalStudents };
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
              <FiHeadphones className="text-green-500" size={28} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                <Translated text="Audio Lectures" />
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <Translated text="Manage your audio content and podcasts" />
            </p>
          </div>

          <button className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FiPlus size={18} />
            <Translated text="Upload Audio" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">
              <Translated text="Total Audio" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-sm text-green-600">
              <Translated text="Published" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            <div className="text-sm text-yellow-600">
              <Translated text="Drafts" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <div className="text-sm text-blue-600">
              <Translated text="Scheduled" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPlays}</div>
            <div className="text-sm text-purple-600">
              <Translated text="Total Plays" />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalStudents}</div>
            <div className="text-sm text-indigo-600">
              <Translated text="Listeners" />
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audio lectures by title, description, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              value={selectedCourse}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
            >
              <option value="all">
                <Translated text="All Courses" />
              </option>
              {courses.map(course => (
                <option key={course} value={course}>
                  <Translated text={course} />
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  <Translated text={category.label} />
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  <Translated text={status.label} />
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Translated text="Grid" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Translated text="List" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Audio Lectures Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }
      >
        {filteredAudios.map((audio, index) => (
          <motion.div
            key={audio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all ${viewMode === 'list' ? 'flex' : ''
              } ${currentlyPlaying === audio.id ? 'ring-2 ring-green-500' : ''}`}
          >
            {/* Audio Player Header */}
            <div className={`bg-gradient-to-r from-green-50 to-emerald-50 p-4 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiMusic className="text-green-500" size={20} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(audio.category)}`}>
                    {audio.category.charAt(0).toUpperCase() + audio.category.slice(1)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(audio.status)}`}>
                  {audio.status.charAt(0).toUpperCase() + audio.status.slice(1)}
                </span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePlayPause(audio.id)}
                  className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  {currentlyPlaying === audio.id ? <FiPause size={20} /> : <FiPlay size={20} />}
                </button>

                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>0:00</span>
                    <span><Translated text={audio.duration} /></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="h-1 rounded-full bg-green-500" style={{ width: '35%' }} />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900"><Translated text={audio.duration} /></div>
                  <div className="text-xs text-gray-500"><Translated text={audio.fileSize} /></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1"><Translated text={audio.title} /></h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEditAudio(audio)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAudio(audio.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2"><Translated text={audio.description} /></p>

              {/* Course Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FiBook className="mr-1" size={14} />
                  <Translated text={audio.course} /> • <Translated text={audio.subject} />
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  {new Date(audio.uploadDate).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <FiHeadphones className="mr-1" size={14} />
                  <Translated text={`${audio.plays} plays`} />
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" size={14} />
                  <Translated text={`${audio.studentsListened} listeners`} />
                </div>
                {audio.averageListenTime !== '0:00' && (
                  <div className="flex items-center">
                    <FiClock className="mr-1" size={14} />
                    <Translated text={`Avg: ${audio.averageListenTime}`} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {audio.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    <Translated text={tag} />
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FiPlay size={14} />
                  <Translated text={currentlyPlaying === audio.id ? 'Playing' : 'Play'} />
                </button>

                {audio.isDownloadable && (
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
      {filteredAudios.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl border border-gray-200"
        >
          <FiHeadphones className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2"><Translated text="No audio lectures found" /></h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all'
              ? <Translated text="Try adjusting your search or filters" />
              : <Translated text="You haven't uploaded any audio lectures yet" />
            }
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto">
            <FiUpload size={16} />
            <Translated text="Upload Your First Audio" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AudioLectures;