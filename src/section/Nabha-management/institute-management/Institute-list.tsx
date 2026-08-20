// pages/InstituteList.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Institute } from '../../../types/Institute';
import CommonModal from '../../../components/common/ViewModel';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
import InstituteCard from './Institute-card';
import { institutesAtom } from '../../../atoms/institutesAtom';
import { useAtom } from 'jotai';
import useSWR from 'swr';
import fetcher from '../../../utils/axios';



// Sub-components
const ViewToggleButton = ({ isGridView, onToggle }: { isGridView: boolean; onToggle: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onToggle}
    className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
    title={isGridView ? "Switch to list view" : "Switch to grid view"}
  >
    {isGridView ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )}
  </motion.button>
);

const AddInstituteButton = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    <span className="hidden md:inline">Add Institute</span>
  </motion.button>
);

const ResultsCount = ({ filteredCount, totalCount }: { filteredCount: number; totalCount: number }) => (
  <div className="mb-4 flex justify-between items-center">
    <p className="text-gray-600">
      Showing <span className="font-semibold">{filteredCount}</span> of <span className="font-semibold">{totalCount}</span> institutes
    </p>
  </div>
);

const NoResults = ({ onReset }: { onReset: () => void }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="mt-4 text-gray-600 text-lg font-medium">No institutes found</p>
    <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
    <button
      onClick={onReset}
      className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
    >
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Clear all filters
    </button>
  </div>
);

const GridView = ({ institutes, onViewDetails }: { institutes: Institute[]; onViewDetails: (institute: Institute) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {institutes.map((institute, index) => (
      <InstituteCard 
        key={institute.id} 
        institute={institute} 
        onViewDetails={onViewDetails} 
        index={index} 
      />
    ))}
  </div>
);

const ListView = ({ institutes, onViewDetails }: { institutes: Institute[]; onViewDetails: (institute: Institute) => void }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden  border border-gray-200">
    <div className="overflow-x-auto  scrollbar-hide">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Established</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {institutes.map((institute, index) => (
            <motion.tr
              key={institute.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Institute">
                <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">
                  {institute.name}
                </div>
                <div className="text-sm text-gray-500 truncate">{institute.code}</div>
              </td>
              <td className="px-4极速加速器-4 whitespace-nowrap sm:px-6" data-label="Location">
                <div className="text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[150px]">
                  {institute.city}
                </div>
                <div className="text-sm text-gray-500 truncate">{institute.state}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap sm:px-6 hidden lg:table-cell" data-label="Established">
                <div className="text-sm text-gray-500">{institute.establishedYear}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap sm:px-6" data-label="Status">
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${institute.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                  {institute.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6" data-label="Actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewDetails(institute)}
                  className="text-blue-600 hover:text-blue-900 transition-colors font-medium"
                >
                  View Details
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InstituteDetailsModal = ({ institute, isOpen, onClose, footerContent }: { 
  institute: Institute | null; 
  isOpen: boolean; 
  onClose: () => void;
  footerContent: React.ReactNode;
}) => (
  <CommonModal
    isOpen={isOpen}
    onClose={onClose}
    title={institute?.name || ''}
    footerContent={footerContent}
    size="xl"
  >
    {institute && (
      <>
        <div className="mb-6 scrollbar-hide">
          <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">Institute Information</h4>
          <div className="grid grid-cols-1 md:mt-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Institute Code</span>
                <p className="mt-1 text-gray-900">{institute.code}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Established Year</span>
                <p className="mt-1 text-gray-900">{institute.establishedYear}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Affiliation</span>
                <p className="mt-1 text-gray-900">{institute.affiliation}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Status</span>
                <span className={`mt-1 px-2.5 py-1 text-xs font-medium rounded-full ${institute.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {institute.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Address</span>
                <p className="mt-1 text-gray-900">{institute.address}</p>
                <p className="mt-1 text-gray-900">{institute.city}, {institute.state} - {institute.pincode}</p>
                <p className="mt-1 text-gray-900">{institute.country}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Phone</span>
                <p className="mt-1 text-gray-900">{institute.phone}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Email</span>
                <p className="mt-1 text-gray-900">{institute.email}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Website</span>
                <p className="mt-1 text-gray-900">{institute.website}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">Principal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm font-medium text-gray-500">Principal Name</span>
              <p className="mt-1 text-gray-900">{institute.principalName}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Principal Contact</span>
              <p className="mt-1 text-gray-900">{institute.principalContact}</p>
            </div>
          </div>
        </div>
      </>
    )}
  </CommonModal>
);

// Main component
const InstituteList = () => {
  const [institutes,setInsitutes] = useAtom(institutesAtom);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>(institutes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [isGridView, setIsGridView] = useState(true);

  const filterOptions = {
    status: [
      { value: 'All', label: 'All Statuses' },
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ],
  };

  const handleSearch = () => {
    let results = institutes;

    if (searchTerm) {
      results = results.filter(institute =>
        institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institute.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      results = results.filter(institute => institute.status === statusFilter);
    }

    setFilteredInstitutes(results);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, institutes]);

  const { data: apiResponse } = useSWR<{ data: { data: Institute[] } }>('/institutes', fetcher);
      // error, isLoading


  // This effect syncs the fetched data from SWR to your Jotai atom
  useEffect(() => {
    if (apiResponse?.data?.data) {
      const data = apiResponse.data.data;
      setInsitutes(data)
      console.log(data)
    }
   }, [apiResponse, setInsitutes]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setFilteredInstitutes(institutes);
  };

  const showDetails = (institute: Institute) => {
    setSelectedInstitute(institute);
  };

  const closeDetails = () => {
    setSelectedInstitute(null);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const modalFooter = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={closeDetails}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium"
    >
      Close
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Institute Directory</h2>
            <p className="text-gray-600 mt-1">Manage and explore educational institutions</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <ViewToggleButton isGridView={isGridView} onToggle={toggleView} />
            <AddInstituteButton />
          </div>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onReset={handleReset}
          filterOptions={filterOptions}
          placeholder="Search by name, code or city..."
        />

        <ResultsCount 
          filteredCount={filteredInstitutes.length} 
          totalCount={institutes.length} 
        />

        {filteredInstitutes.length === 0 ? (
          <NoResults onReset={handleReset} />
        ) : isGridView ? (
          <GridView institutes={filteredInstitutes} onViewDetails={showDetails} />
        ) : (
          <ListView institutes={filteredInstitutes} onViewDetails={showDetails} />
        )}
      </div>

      <InstituteDetailsModal 
        institute={selectedInstitute}
        isOpen={!!selectedInstitute}
        onClose={closeDetails}
        footerContent={modalFooter}
      />
    </div>
  );
};

export default InstituteList;