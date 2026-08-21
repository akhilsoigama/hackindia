import { useGetLectures } from "@/action/material";
import SearchAndFilter from "@/components/common/SearchAndFilter";
import { Translated } from "@/components/common/translator/translator";
import { MaterialCard } from "@/components/material";
import { useTheme } from '@/theme/AppThemeProvider';import { useMemo, useState } from "react";

  
 const StudentMaterialList: React.FC = () => {
      const { lectures = [] } = useGetLectures();
      const { mode } = useTheme();
      const isDark = mode === 'dark';
      const [searchTerm, setSearchTerm] = useState('');
      const [contentTypeFilter, setContentTypeFilter] = useState('all');

      const filterOptions = {
        status: [
          { value: 'all', label: 'All Types' },
          { value: 'video', label: 'Video' },
          { value: 'pdf', label: 'PDF' },
          { value: 'audio', label: 'Audio' },
          { value: 'text', label: 'Text' },
          { value: 'image', label: 'Image' },
        ],
      };

      const handleReset = () => {
        setSearchTerm('');
        setContentTypeFilter('all');
      };

      const filteredLectures = useMemo(() => {
        return lectures.filter((lecture) => {
          const matchesSearch =
            lecture.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecture.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecture.std?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesType =
            contentTypeFilter === 'all' || lecture.contentType === contentTypeFilter;

          return matchesSearch && matchesType;
        });
      }, [lectures, searchTerm, contentTypeFilter]);

      return (
        <div className="max-w-full mx-auto px-6 py-8 space-y-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1
                  className={`text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <Translated text="Study Materials" />
                </h1>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-white/45" : "text-slate-500"}`}
                >
                  <Translated text="Organize and manage your educational content" />
                </p>
              </div>
            </div>

            <div className="relative z-20">
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={contentTypeFilter}
                onStatusFilterChange={setContentTypeFilter}
                onReset={handleReset}
                filterOptions={filterOptions}
                placeholder="Search materials by title, subject, or class..."
              />
            </div>
            {filteredLectures.length === 0 ? null : (
              <div
                className="relative z-0 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredLectures.map((lecture, index) => (
                  <MaterialCard 
                    key={lecture.id}
                    lecture={lecture}
                    index={index}
                    onView={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

  export default StudentMaterialList;
