import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCopy,
  FaUserShield,
  FaUsers,
  FaKey,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import { useGetUserRolePermissions } from '../../../action/RollPermission';
import { IUserRolePermissionItem } from '../../../types/Roles';
import { usePermissions } from '../../../action/permission';

interface Permission {
  [key: string]: boolean;
}

interface Role {
  id: string;
  roleName: string;
  description: string;
  permissions: Permission;
  createdAt: string;
  isDefault: boolean;
}

// Transform API data to match the component's expected format
const transformApiDataToRoles = (apiData: IUserRolePermissionItem[]): Role[] => {
  return apiData.map(item => ({
    id: item.id?.toString() || '',
    roleName: item.roleName || '',
    description: item.roleDescription || '',
    permissions: item.permissions || {},
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isDefault: item.isDefault || false,
  }));
};

// Generate permission categories dynamically from the actual permissions data
const generatePermissionCategories = (roles: Role[]) => {
  const categories: { [key: string]: string[] } = {};

  roles.forEach(role => {
    Object.keys(role.permissions).forEach(permission => {
      if (role.permissions[permission]) {
        // Extract category from permission key (e.g., "DASHBOARD_VIEW" -> "Dashboard")
        const category = permission.split('_')[0];
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

        if (!categories[formattedCategory]) {
          categories[formattedCategory] = [];
        }

        if (!categories[formattedCategory].includes(permission)) {
          categories[formattedCategory].push(permission);
        }
      }
    });
  });

  return categories;
};

const RolePermissionList = () => {
  const { userRolePermissions, isLoading, userRolePermissionsError } = useGetUserRolePermissions();
  const { permissions, isLoading: isPermissionsLoading, error: permissionsError } = usePermissions();



  // Transform API data when it's available
  const apiRoles = useMemo(() => {
    return transformApiDataToRoles(userRolePermissions);
  }, [userRolePermissions]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Role; direction: 'ascending' | 'descending' } | null>(null);

  // Generate permission categories dynamically from actual data
  const permissionCategories = useMemo(() => {
    return generatePermissionCategories(apiRoles);
  }, [apiRoles]);

  // Update roles when API data loads
  useMemo(() => {
    if (apiRoles.length > 0) {
      setRoles(apiRoles);
    }
  }, [apiRoles]);

  // Handle sorting
  const handleSort = (key: keyof Role) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted roles
  const getSortedRoles = () => {
    if (!sortConfig) return roles;

    return [...roles].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter roles based on search term and filters
  const filteredRoles = getSortedRoles().filter(role => {
    const matchesSearch =
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'default' && role.isDefault) ||
      (statusFilter === 'custom' && !role.isDefault);

    return matchesSearch && matchesStatus;
  });

  // Toggle role expansion
  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  // Delete a role
  const deleteRole = (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== id));
      // TODO: Call deleteUserRolePermission API
      // deleteUserRolePermission(parseInt(id));
    }
  };

  // Duplicate a role
  const duplicateRole = (role: Role) => {
    const newRole = {
      ...role,
      id: Date.now().toString(),
      roleName: `${role.roleName} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false,
    };
    setRoles([...roles, newRole]);
  };

  // Count total permissions for a role
  const countPermissions = (permissions: Permission) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  // Format permission name for display
   const formatPermissionName = (permissionKey: string) => {
    const perm = permissions.find(p => p.permissionKey === permissionKey);
    return perm ? perm.permissionName : permissionKey
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  };
  // Render sort icon
  const renderSortIcon = (key: keyof Role) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  // Loading state
  if (isLoading || isPermissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles and permissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userRolePermissionsError || permissionsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading data. Please try again later.</p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaUserShield className="mr-3 text-indigo-600" />
            Role Permissions
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Manage and view all system roles and their permissions
          </p>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="default">Default Roles</option>
                  <option value="custom">Custom Roles</option>
                </select>
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                <FaPlus className="mr-2" />
                New Role
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <FaUserShield className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Roles</p>
              <p className="text-xl md:text-2xl font-bold">{roles.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Default Roles</p>
              <p className="text-xl md:text-2xl font-bold">{roles.filter(r => r.isDefault).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <FaKey className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Custom Roles</p>
              <p className="text-xl md:text-2xl font-bold">{roles.filter(r => !r.isDefault).length}</p>
            </div>
          </div>
        </motion.div>

        {/* Roles List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
            <div
              className="col-span-5 flex items-center cursor-pointer"
              onClick={() => handleSort('roleName')}
            >
              Role {renderSortIcon('roleName')}
            </div>
            <div
              className="col-span-3 flex items-center cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              Created {renderSortIcon('createdAt')}
            </div>
            <div className="col-span-2 flex items-center cursor-pointer">Permissions</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Roles Items */}
          {filteredRoles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {roles.length === 0 ? 'No roles found in the system.' : 'No roles found. Try adjusting your search or filters.'}
            </div>
          ) : (
            filteredRoles.map(role => (
              <div key={role.id} className="border-b border-gray-100 last:border-b-0">
                {/* Role Summary */}
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleRoleExpansion(role.id)}
                >
                  <div className="md:col-span-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaUserShield className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {role.roleName}
                          {role.isDefault && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{role.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 flex items-center text-sm text-gray-500">
                    {role.createdAt}
                  </div>

                  <div className="md:col-span-2 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {countPermissions(role.permissions)} permissions
                    </span>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="View Details"
                      onClick={e => {
                        e.stopPropagation();
                        toggleRoleExpansion(role.id);
                      }}
                    >
                      {expandedRole === role.id ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                      title="Edit Role"
                    >
                      <FaEdit />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => {
                        e.stopPropagation();
                        duplicateRole(role);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-full"
                      title="Duplicate Role"
                    >
                      <FaCopy />
                    </motion.button>

                    {!role.isDefault && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={e => {
                          e.stopPropagation();
                          deleteRole(role.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete Role"
                      >
                        <FaTrash />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded Permission Details */}
                <AnimatePresence>
                  {expandedRole === role.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-4 border-t border-gray-200"
                    >
                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FaKey className="mr-2 text-indigo-500" />
                        Permission Details
                      </h3>
                      {Object.keys(permissionCategories).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(permissionCategories).map(([category, perms]) => {
                            // Filter only permissions that this role has
                            const categoryPermissions = perms
                              .filter(permKey => role.permissions[permKey])
                              .map(permKey => ({
                                key: permKey,
                                name: formatPermissionName(permKey),
                              }));

                            if (categoryPermissions.length === 0) return null;

                            return (
                              <div key={category} className="bg-white rounded-lg p-3 shadow-sm">
                                <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
                                <ul className="space-y-1">
                                  {categoryPermissions.length > 0 ? (
                                    categoryPermissions.map((perm, idx) => (
                                      <li
                                        key={`${perm.key}-${idx}`}
                                        className="flex items-center text-sm text-gray-600"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                                        {perm.name}
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-sm text-gray-500">
                                      No permissions in this category
                                    </li>
                                  )}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No permission categories found
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RolePermissionList;