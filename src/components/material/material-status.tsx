import { motion } from 'framer-motion';
import { ILecture } from '../../types/material';
import { Translated } from '../common/translator/translator';

interface MaterialStatsProps {
  lectures: ILecture[];
  filteredCount: number;
}

const MaterialStats: React.FC<MaterialStatsProps> = ({ lectures, filteredCount }) => {
  const stats = [
    {
      label: 'Total Materials',
      value: lectures.length,
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      label: 'Video Lectures',
      value: lectures.filter(l => l.contentType === 'video').length,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      label: 'PDF Documents',
      value: lectures.filter(l => l.contentType === 'pdf').length,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Filtered Results',
      value: filteredCount,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-sm text-gray-600 font-medium"><Translated text={`${stat.label}`}/></div>
          <div className={`w-12 h-1 bg-linear-to-r ${stat.gradient} rounded-full mt-3`}></div>
        </div>
      ))}
    </motion.div>
  );
};

export default MaterialStats;