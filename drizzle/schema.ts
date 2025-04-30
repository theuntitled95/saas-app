import * as organizations from "./schema/organizations";
import * as userOrganization from "./schema/user_organization";
import * as userProfiles from "./schema/user_profiles";
import * as users from "./schema/users";

export * from "./schema/organizations";
export * from "./schema/user_organization";
export * from "./schema/user_profiles";
export * from "./schema/users";

// ✅ export schema object
export const schema = {
  ...organizations,
  ...userOrganization,
  ...userProfiles,
  ...users,
};
