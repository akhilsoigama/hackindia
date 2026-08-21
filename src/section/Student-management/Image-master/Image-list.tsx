import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiImage,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiShare2,
  FiXCircle,
  FiCalendar,
  FiBook,
  FiPlus,
  FiUsers,
  FiMaximize
} from 'react-icons/fi';
import { Translated } from '../../../components/common/translator/translator';

interface ImageMaterial {
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
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  scheduledDate?: string;
  isDownloadable: boolean;
  isPublic: boolean;
  format: 'jpg' | 'png' | 'gif' | 'svg';
  dimensions: string;
  category: 'diagram' | 'chart' | 'photo' | 'illustration' | 'infographic';
}

interface ImageMaterialsProps {
  facultyId: string;
}

const sampleImageMaterials: ImageMaterial[] = [
  {
    id: 1,
    title: 'Human Anatomy Diagram',
    description: 'Detailed diagram of human muscular system with labels and descriptions.',
    course: 'Biology',
    subject: 'Anatomy',
    fileSize: '4.7 MB',
    uploadDate: '2024-01-15',
    lastModified: '2024-01-16',
    status: 'published',
    views: 892,
    studentsAccessed: 134,
    downloads: 89,
    imageUrl: '/images/anatomy-diagram.jpg',
    thumbnailUrl: '/thumbnails/anatomy-thumb.jpg',
    tags: ['biology', 'anatomy', 'diagram', 'muscular'],
    isDownloadable: true,
    isPublic: true,
    format: 'jpg',
    dimensions: '1920x1080',
    category: 'diagram'
  },
  {
    id: 2,
    title: 'Statistical Analysis Chart',
    description: 'Interactive chart showing statistical distributions and probability curves.',
    course: 'Mathematics',
    subject: 'Statistics',
    fileSize: '2.1 MB',
    uploadDate: '2024-01-14',
    lastModified: '2024-01-14',
    status: 'published',
    views: 567,
    studentsAccessed: 98,
    downloads: 67,
    imageUrl: '/images/stats-chart.png',
    thumbnailUrl: '/thumbnails/stats-thumb.png',
    tags: ['mathematics', 'statistics', 'chart', 'analysis'],
    isDownloadable: true,
    isPublic: true,
    format: 'png',
    dimensions: '1600x1200',
    category: 'chart'
  },
  {
    id: 3,
    title: 'Historical Site Photography',
    description: 'High-quality photographs of ancient Roman archaeological sites.',
    course: 'History',
    subject: 'Archaeology',
    fileSize: '8.3 MB',
    uploadDate: '2024-01-13',
    lastModified: '2024-01-13',
    status: 'draft',
    views: 0,
    studentsAccessed: 0,
    downloads: 0,
    imageUrl: '/images/roman-site.jpg',
    thumbnailUrl: '/thumbnails/roman-thumb.jpg',
    tags: ['history', 'archaeology', 'photography', 'roman'],
    isDownloadable: false,
    isPublic: false,
    format: 'jpg',
    dimensions: '2560x1440',
    category: 'photo'
  },
  {
    id: 4,
    title: 'Chemical Process Infographic',
    description: 'Visual infographic explaining complex chemical reaction processes.',
    course: 'Chemistry',
    subject: 'Organic Chemistry',
    fileSize: '3.8 MB',
    uploadDate: '2024-01-12',
    lastModified: '2024-01-12',
    status: 'scheduled',
    views: 0,
    studentsAccessed: 0,
    downloads: 0,
    imageUrl: '/images/chemical-infographic.svg',
    thumbnailUrl: '/thumbnails/chemical-thumb.svg',
    tags: ['chemistry', 'infographic', 'process', 'reactions'],
    scheduledDate: '2024-01-20',
    isDownloadable: true,
    isPublic: true,
    format: 'svg',
    dimensions: '1200x1800',
    category: 'infographic'
  },
  {
    id: 5,
    title: 'Physics Concept Illustration',
    description: 'Detailed illustration explaining quantum physics concepts and principles.',
    course: 'Physics',
    subject: 'Quantum Mechanics',
    fileSize: '5.2 MB',
    uploadDate: '2024-01-11',
    lastModified: '2024-01-11',
    status: 'published',
    views: 423,
    studentsAccessed: 78,
    downloads: 45,
    imageUrl: '/images/physics-illustration.png',
    thumbnailUrl: '/thumbnails/physics-thumb.png',
    tags: ['physics', 'quantum', 'illustration', 'concepts'],
    isDownloadable: true,
    isPublic: true,
    format: 'png',
    dimensions: '2000x1500',
    category: 'illustration'
  }
];

// const ImageMaterials: React.FC<ImageMaterialsProps> = ({ facultyId }) => {
const ImageMaterials: React.FC<ImageMaterialsProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageMaterials, setImageMaterials] = useState<ImageMaterial[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<ImageMaterial | null>(null);

  const courses = ['Biology', 'Mathematics', 'History', 'Chemistry', 'Physics'];
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'diagram', label: 'Diagrams' },
    { value: 'chart', label: 'Charts' },
    { value: 'photo', label: 'Photos' },
    { value: 'illustration', label: 'Illustrations' },
    { value: 'infographic', label: 'Infographics' }
  ];
  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
    { value: 'scheduled', label: 'Scheduled', color: 'blue' }
  ];

  useEffect(() => {
    setImageMaterials(sampleImageMaterials);
  }, []);

  const filteredImages = imageMaterials.filter(image => {
    const matchesSearch = searchQuery === '' ||
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'all' || image.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || image.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;

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
      case 'diagram': return 'bg-purple-100 text-purple-800';
      case 'chart': return 'bg-blue-100 text-blue-800';
      case 'photo': return 'bg-orange-100 text-orange-800';
      case 'illustration': return 'bg-pink-100 text-pink-800';
      case 'infographic': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditImage = (image: ImageMaterial) => {
    console.log('Edit image:', image);
  };

  const handleDeleteImage = (imageId: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImageMaterials(imageMaterials.filter(i => i.id !== imageId));
    }
  };

  const handlePreviewImage = (image: ImageMaterial) => {
    setSelectedImage(image);
  };

  const getStats = () => {
    const total = imageMaterials.length;
    const published = imageMaterials.filter(i => i.status === 'published').length;
    const drafts = imageMaterials.filter(i => i.status === 'draft').length;
    const scheduled = imageMaterials.filter(i => i.status === 'scheduled').length;
    const totalViews = imageMaterials.reduce((sum, i) => sum + i.views, 0);
    const totalDownloads = imageMaterials.reduce((sum, i) => sum + i.downloads, 0);

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
              <FiImage className="text-purple-500" size={28} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900"><Translated text="Image Materials" /></h1>
            </div>
            <p className="text-sm text-gray-500 mt-1"><Translated text="Manage your educational images, diagrams, and visual aids" /></p>
          </div>

          <button className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <FiPlus size={18} />
            <Translated text="Upload Image" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600"><Translated text="Total Images" /></div>
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
            <div className="text-2xl font-bold text-indigo-600">{stats.totalDownloads}</div>
            <div className="text-sm text-indigo-600"><Translated text="Downloads" /></div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search images by title, description, or tags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              value={selectedCourse}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
            >
              <option value="all"><Translated text="All Courses" /></option>
              {courses.map(course => (
                <option key={course} value={course}><Translated text={course} /></option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}><Translated text={category.label} /></option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}><Translated text={status.label} /></option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              List
            </button>
          </div>
        </div>
      </motion.header>

      {/* Image Materials Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }
      >
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all ${viewMode === 'list' ? 'flex' : ''
              }`}
          >
            {/* Image Preview */}
            <div className={`relative ${viewMode === 'list' ? 'w-48 shrink-0' : 'w-full h-48'}`}>
              <div className="w-full h-full bg-linear-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                <FiImage className="text-purple-400" size={48} />
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(image.category)}`}>
                  {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(image.status)}`}>
                  {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {image.dimensions}
              </div>
              <button
                onClick={() => handlePreviewImage(image)}
                className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white p-1 rounded hover:bg-opacity-90 transition-colors"
              >
                <FiMaximize size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1"><Translated text={image.title} /></h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEditImage(image)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2"><Translated text={image.description} /></p>

              {/* Course Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FiBook className="mr-1" size={14} />
                  <Translated text={image.course} /> • <Translated text={image.subject} />
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  {new Date(image.uploadDate).toLocaleDateString()}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <FiEye className="mr-1" size={14} />
                  <Translated text={`${image.views} views`} />
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" size={14} />
                  <Translated text={`${image.studentsAccessed} students`} />
                </div>
                <div className="flex items-center">
                  <FiDownload className="mr-1" size={14} />
                  <Translated text={`${image.downloads} downloads`} />
                </div>
              </div>

              {/* Image Details */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span><Translated text={image.format.toUpperCase()} /></span>
                <span><Translated text={image.dimensions} /></span>
                <span><Translated text={image.fileSize} /></span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {image.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    <Translated text={tag} />
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreviewImage(image)}
                  className="flex-1 py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FiEye size={14} />
                  <Translated text="Preview" />
                </button>

                {image.isDownloadable && (
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
      {filteredImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl border border-gray-200"
        >
          <FiImage className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2"><Translated text="No images found" /></h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all'
              ? <Translated text="Try adjusting your search or filters" />
              : <Translated text="You haven\'t uploaded any images yet" />
            }
          </p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto">
            <FiPlus size={16} />
            <Translated text="Upload Your First Image" />
          </button>
        </motion.div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl max-h-full overflow-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold"><Translated text={selectedImage.title} /></h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiXCircle size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <FiImage className="text-gray-400" size={64} />
              </div>
              <div className="mt-4">
                <p className="text-gray-600"><Translated text={selectedImage.description} /></p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-500">
                  <div><Translated text="Format" />: <Translated text={selectedImage.format.toUpperCase()} /></div>
                  <div><Translated text="Dimensions" />: <Translated text={selectedImage.dimensions} /></div>
                  <div><Translated text="File Size" />: <Translated text={selectedImage.fileSize} /></div>
                  <div><Translated text="Category" />: <Translated text={selectedImage.category} /></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImageMaterials;