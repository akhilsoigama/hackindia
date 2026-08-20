// components/Roles/PermissionsSection.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';

export type PermissionEntity = {
  name: string;
  keys: {
    create?: number;
    view?: number;
    update?: number;
    delete?: number;
    [key: string]: number | undefined;
  };
};

interface PermissionsSectionProps {
  permissionMatrix: PermissionEntity[];
  selectedPermissions: number[];
  isMobile: boolean;
  viewMode: 'cards' | 'table';
  togglePermission: (id: number) => void;
  toggleAll: (keys: Record<string, number>) => void;
  toggleAllPermissions: () => void;
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissionMatrix,
  selectedPermissions,
  isMobile,
  togglePermission,
  toggleAll,
  toggleAllPermissions,
}) => {
  // Check if a specific permission ID is selected
  const isChecked = (id?: number) => (id ? selectedPermissions.includes(id) : false);

  // Check if all keys for an entity are selected
  const isAllChecked = (keys: Record<string, number | undefined>) => {
    const validKeys = Object.values(keys).filter((v): v is number => v !== undefined);
    return validKeys.length > 0 && validKeys.every(k => selectedPermissions.includes(k));
  };

  // Total number of permissions
  const totalPermissions = permissionMatrix.flatMap(e =>
    Object.values(e.keys).filter((v): v is number => v !== undefined)
  ).length;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h3 className="font-semibold text-gray-800 text-lg sm:text-xl">Permissions</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAllPermissions}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            {selectedPermissions.length === totalPermissions ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {permissionMatrix.length > 0 ? (
        <div className="rounded-lg border border-gray-200 scrollbar-hide overflow-hidden">
          <div className="max-h-[50vh] overflow-y-auto scrollbar-hide">
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead className="bg-zinc-100">
                <TableRow>
                  <TableCell className="min-w-[120px] sm:min-w-[150px] font-bold">Permissions</TableCell>
                  <TableCell className="text-center font-medium">All</TableCell>
                  {['create', 'view', 'update', 'delete'].map(action => (
                    <TableCell key={action} className="text-center font-medium capitalize">
                      {isMobile ? action.charAt(0).toUpperCase() : action}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {permissionMatrix.map(entity => {
                  // Filter out undefined keys for toggleAll
                  const definedKeys = Object.fromEntries(
                    Object.entries(entity.keys).filter(([_, v]) => v !== undefined)
                  ) as Record<string, number>;

                  return (
                    <TableRow key={entity.name} className="hover:bg-zinc-50">
                      <TableCell className="font-medium">{entity.name}</TableCell>
                      <TableCell className="text-center">
                        <RHFCheckbox
                          name={`permissionIds.${entity.name}.all`}
                          label=""
                          checked={isAllChecked(entity.keys)}
                          onChange={() => toggleAll(definedKeys)}
                          size="small"
                        />
                      </TableCell>
                      {['create', 'view', 'update', 'delete'].map(action => {
                        const id = entity.keys[action];
                        return (
                          <TableCell key={action} className="text-center">
                            {id ? (
                              <RHFCheckbox
                                name={`permissionIds.${id}`}
                                label=""
                                checked={isChecked(id)}
                                onChange={() => togglePermission(id)}
                                size="small"
                              />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No permissions available</div>
      )}
    </div>
  );
};

export default PermissionsSection;
