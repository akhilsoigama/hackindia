import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ILecture } from "../../../types/material";

import { MaterialCard } from "../../../components/material";
import SearchAndFilter from "../../../components/common/SearchAndFilter";
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from "../../../components/common/translator/translator";
import { FaPlus } from "react-icons/fa";
import { ParticleButton } from "@/components/ui/particle-button";

interface MaterialListProps {
  lectures: ILecture[];
  onEdit: (lecture: ILecture) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  onView: (lecture: ILecture) => void;
  isLoading?: boolean;
}

const MaterialList: React.FC<MaterialListProps> = ({
  lectures,
  onEdit,
  onDelete,
  onCreate,
  onView,
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");

  // Filter options for content types
  const filterOptions = {
    status: [
      { value: "all", label: "All Types" },
      { value: "video", label: "Video" },
      { value: "pdf", label: "PDF" },
      { value: "audio", label: "Audio" },
      { value: "text", label: "Text" },
      { value: "image", label: "Image" },
    ],
  };

  // Handle reset filters
  const handleReset = () => {
    setSearchTerm("");
    setContentTypeFilter("all");
  };

  // Filter lectures based on search and content type
  const filteredLectures = useMemo(() => {
    return lectures.filter((lecture) => {
      const matchesSearch =
        lecture.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.std?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        contentTypeFilter === "all" ||
        lecture.contentType === contentTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [lectures, searchTerm, contentTypeFilter]);

  return (
    <div className="max-w-full mx-auto px-6 py-8 space-y-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              <Translated text="Study Materials" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-sm mt-1 ${isDark ? "text-white/45" : "text-slate-500"}`}
            >
              <Translated text="Organize and manage your educational content" />
            </motion.p>
          </div>

          <ParticleButton
            onClick={onCreate}
            successDuration={1000}
            variant="default"
            className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              isDark
                ? "bg-white text-gray-900 hover:bg-gray-100 shadow-sm"
                : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
            }`}
          >
            <FaPlus /> <Translated text={"Add Material"} />
          </ParticleButton>
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
          <motion.div
            layout
            className="relative z-0 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredLectures.map((lecture, index) => (
              <MaterialCard
                key={lecture.id}
                lecture={lecture}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MaterialList;
