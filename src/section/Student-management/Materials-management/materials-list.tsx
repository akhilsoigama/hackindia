import { NavLink, Outlet } from 'react-router-dom';
import { FaBook, FaFileAlt, FaQuestionCircle, FaBookOpen } from 'react-icons/fa';

const materialTypes = [
  { name: 'Reading', path: 'reading', icon: <FaBookOpen /> },
  { name: 'Lectures', path: 'lectures', icon: <FaBook /> },
  { name: 'Assignments', path: 'assignments', icon: <FaFileAlt /> },
  { name: 'Quiz', path: 'quiz', icon: <FaQuestionCircle /> }, // Corrected from 'quize'
];

const MaterialList = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {materialTypes.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:-translate-y-1'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
};

export default MaterialList;