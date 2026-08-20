import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BiSearch,
  BiFilter,
  BiSort,
  BiFile,
  BiLoaderAlt,
  BiListUl,
  BiGridAlt
} from 'react-icons/bi';
import {
  FaBookOpen,
  FaCalculator, FaPalette, FaFlask, FaFeatherAlt, FaThLarge
} from 'react-icons/fa';
import { FiUser, FiCalendar } from 'react-icons/fi';
// import useSWR from 'swr';
// import {fetcher} from '../../../utils/axios'

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'document';
  uploadDate: string;
  author: string;
  size: string;
  subject: string;
  pdfUrl: string;
  thumbnail?: string;
}

// --- Mock Data & Fetcher for useSWR ---
const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'ਪੈਂਤੀ ਅੱਖਰੀ (Painti Akshar)',
    description: 'A document to learn the Punjabi alphabet from ੳ to ੜ.',
    type: 'document',
    uploadDate: '2023-10-15',
    author: 'Gurpreet Kaur',
    size: '112 MB',
    subject: 'Punjabi',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '2',
    title: 'ਗਿਣਤੀ (Ginti) 1-10',
    description: 'A worksheet to practice writing Punjabi numbers from ੧ to ੧੦.',
    type: 'document',
    uploadDate: '2023-10-10',
    author: 'Harman Singh',
    size: '3.2 MB',
    subject: 'Mathematics',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '3',
    title: 'ਰੰਗਾਂ ਦੇ ਨਾਮ (Rangan de Naam)',
    description: 'A colorful document to learn the names of different colors in Punjabi.',
    type: 'document',
    uploadDate: '2023-10-05',
    author: 'Gurpreet Kaur',
    size: '95 MB',
    subject: 'Art',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '4',
    title: 'ਫਲਾਂ ਦੇ ਨਾਮ (Phalan de Naam)',
    description: 'A document to identify common fruits.',
    type: 'document',
    uploadDate: '2023-09-28',
    author: 'Harman Singh',
    size: '15 MB',
    subject: 'Science',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1573246123736-9b6f78a751a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '5',
    title: 'ਕਵਿਤਾ: ਮਛਲੀ ਜਲ ਕੀ ਰਾਣੀ ਹੈ',
    description: 'A document with the famous childrens poem.',
    type: 'document',
    uploadDate: '2023-09-20',
    author: 'Jaspreet Gill',
    size: '150 MB',
    subject: 'Literature',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '6',
    title: 'ਮੁਹਾਰਨੀ (Muharni)',
    description: 'A document to practice vowel sounds with consonants.',
    type: 'document',
    uploadDate: '2023-09-15',
    author: 'Harman Singh',
    size: '5.7 MB',
    subject: 'Punjabi',
    pdfUrl: '/path/to/demo.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  }
];


const StudentMaterialList: React.FC = () => {
  // To use live data, uncomment the line below and comment out the mock data lines
  // const { data: materials, error, isLoading } = useSWR<Material[]>('/student/materials', fetcher);

  // Using mock data for now
  const materials = mockMaterials;
  const isLoading = false;
  const error = null;

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'punjabi': return <FaBookOpen />;
      case 'mathematics': return <FaCalculator />;
      case 'art': return <FaPalette />;
      case 'science': return <FaFlask />;
      case 'literature': return <FaFeatherAlt />;
      default: return <FaThLarge />;
    }
  };

  const categories = useMemo(() => {
    if (!materials) return [];

    const subjectCounts = materials.reduce((acc, material) => {
      acc[material.subject] = (acc[material.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const subjectCategories = Object.keys(subjectCounts).map(subject => ({
      id: subject,
      name: subject,
      icon: getSubjectIcon(subject),
      count: subjectCounts[subject]
    }));

    return [
      { id: 'all', name: 'All', icon: <FaThLarge />, count: materials.length },
      ...subjectCategories
    ];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = subjectFilter === 'all' || material.subject === subjectFilter;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [materials, searchTerm, subjectFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Learning Materials</h1>
            <p className="text-blue-100">Browse and read all your course materials</p>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <BiFilter className="w-5 h-5" />
                  <span>Filter</span>
                </button>

                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                  >
                    <BiGridAlt />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                  >
                    <BiListUl />
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                  <BiSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Subject</label>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <motion.button
                          key={category.id}
                          onClick={() => setSubjectFilter(category.id)}
                          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${subjectFilter === category.id
                              ? 'bg-blue-600 text-white shadow-md border-blue-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Filter by ${category.name}`}
                        >
                          <span className="mr-2">{category.icon}</span>
                          <span>{category.name}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${subjectFilter === category.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            {category.count}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            {!isLoading && materials && (
              <p className="text-sm text-gray-600">
                Showing {filteredMaterials.length} of {materials.length} materials
              </p>
            )}
          </div>

          {/* Materials List */}
          <div>
            <AnimatePresence>
              {isLoading ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <BiLoaderAlt className="w-8 h-8 animate-spin mb-4" />
                  <p>Loading materials...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-600">
                  <p>Failed to load materials. Please try again later.</p>
                </div>
              ) : viewMode === 'list' ? (
                filteredMaterials.map((material, index) => (
                  <motion.a
                    href={material.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block p-6 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-full md:w-32 h-32 md:h-20">
                        {material.thumbnail ? (
                          <img
                            src={material.thumbnail}
                            alt={material.title}
                            className="w-full h-full object-cover rounded-lg "
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><BiFile className="w-8 h-8 text-gray-400" /></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{material.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                            {material.subject}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4">{material.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <BiFile className="w-4 h-4" />
                            <span className="capitalize">Document</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            <span>{material.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span>{material.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))
              ) : filteredMaterials.length > 0 ? (
                <div className="p-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials.map((material, index) => (
                    <motion.a
                      href={material.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
                    >
                      <div className="relative h-40">
                        {material.thumbnail ? (
                          <img
                            src={material.thumbnail}
                            alt={material.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center"><BiFile className="w-12 h-12 text-gray-400" /></div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {material.subject}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                          {material.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            <span>{material.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center"
                >
                  <div className="text-gray-400 mb-4">
                    <BiSearch className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentMaterialList;