import { PermissionEntity } from "./useOptimizedPermission";

type ModulePermission = {
  id: number;
  key: string;
  name: string;
};

type ModuleGroup = {
  moduleName: string;
  permissions: ModulePermission[];
  hasAccess: boolean;
};

type SafePermission = {
  id: number;
  permissionKey?: string;
};

/**
 * Build Permission Entities from moduleGroups.
 * Groups by entity name (removing last part like _VIEW/_CREATE).
 */
export const useBuildPermissionEntities = (
  moduleGroups: Record<string, ModuleGroup>
): PermissionEntity[] => {
  const result: PermissionEntity[] = [];

  Object.entries(moduleGroups).forEach(([, module]) => {
    if (module.hasAccess && module.permissions.length > 0) {
      const entityGroups: Record<string, PermissionEntity> = {};

      module.permissions.forEach((perm: ModulePermission) => {
        const parts = perm.key.split("_");
        const action = parts.pop()?.toLowerCase(); // e.g., 'view', 'create'
        const entityName = parts.join("_").toUpperCase() || "OTHER";

        if (!entityGroups[entityName]) {
          entityGroups[entityName] = {
            name: entityName,
            keys: {},
          };
        }

        // Group permissions by action type
        if (!action) {
          entityGroups[entityName].keys.access = perm.id;
          return;
        }

        if (["list", "view"].includes(action)) {
          if (!entityGroups[entityName].keys.view)
            entityGroups[entityName].keys.view = [];
          (entityGroups[entityName].keys.view as number[]).push(perm.id);
        } else if (["assign", "create"].includes(action)) {
          if (!entityGroups[entityName].keys.create)
            entityGroups[entityName].keys.create = [];
          (entityGroups[entityName].keys.create as number[]).push(perm.id);
        } else {
          // Other actions like update, delete, etc.
          entityGroups[entityName].keys[action] = perm.id;
        }
      });

      // Normalize any single-number view/create into arrays
      Object.values(entityGroups).forEach((entity) => {
        if (typeof entity.keys.view === "number") {
          entity.keys.view = [entity.keys.view];
        }
        if (typeof entity.keys.create === "number") {
          entity.keys.create = [entity.keys.create];
        }
        result.push(entity);
      });
    }
  });

  return result;
};

/**
 * Ensures communication-related permissions exist in the result set.
 */
export const useEnsureCommunicationPermissions = (
  result: PermissionEntity[],
  safePermissions: SafePermission[]
): PermissionEntity[] => {
  const hasCommunicationPermissions = result.some((entity) =>
    ["COMMUNICATION", "CHAT", "MESSAGE", "NOTIFICATION"].some((k) =>
      entity.name.includes(k)
    )
  );

  if (!hasCommunicationPermissions) {
    const communicationPerms = safePermissions.filter((perm) =>
      ["communication", "chat", "message", "notification", "email"].some((k) =>
        perm.permissionKey?.toLowerCase()?.includes(k)
      )
    );

    if (communicationPerms.length > 0) {
      const communicationEntities: Record<string, PermissionEntity> = {};

      communicationPerms.forEach((perm) => {
        if (!perm.permissionKey) {
          return;
        }

        const parts = perm.permissionKey.split("_");
        const action = parts.pop()?.toLowerCase();
        const entityName = parts.join("_").toUpperCase() || "COMMUNICATION";

        if (!communicationEntities[entityName]) {
          communicationEntities[entityName] = {
            name: entityName,
            keys: {},
          };
        }

        if (!action) {
          communicationEntities[entityName].keys.access = perm.id;
          return;
        }

        if (["list", "view"].includes(action)) {
          if (!communicationEntities[entityName].keys.view)
            communicationEntities[entityName].keys.view = [];
          (communicationEntities[entityName].keys.view as number[]).push(perm.id);
        } else if (["assign", "create"].includes(action)) {
          if (!communicationEntities[entityName].keys.create)
            communicationEntities[entityName].keys.create = [];
          (communicationEntities[entityName].keys.create as number[]).push(perm.id);
        } else {
          communicationEntities[entityName].keys[action] = perm.id;
        }
      });

      Object.values(communicationEntities).forEach((entity) => result.push(entity));
    } else {
      result.push({
        name: "COMMUNICATION",
        keys: {
          access: 9991,
          view: [9992],
          send: 9993,
          receive: 9994,
        },
      });
    }
  }

  return result;
};
