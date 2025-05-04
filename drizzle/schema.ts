import * as organizations from "./schema/organizations";
import * as permissions from "./schema/permissions";
import * as rolePermissions from "./schema/role_permissions";
import * as roles from "./schema/roles";
import * as userOrganization from "./schema/user_organization";
import * as userOrganizationRoles from "./schema/user_organization_roles";
import * as userProfiles from "./schema/user_profiles";
import * as users from "./schema/users";

export * from "./schema/organizations";
export * from "./schema/permissions";
export * from "./schema/role_permissions";
export * from "./schema/roles";
export * from "./schema/user_organization";
export * from "./schema/user_organization_roles";
export * from "./schema/user_profiles";
export * from "./schema/users";

// ✅ export schema object
export const schema = {
  ...organizations,
  ...userOrganization,
  ...userProfiles,
  ...users,
  ...permissions,
  ...rolePermissions,
  ...roles,
  ...userOrganizationRoles,
};
